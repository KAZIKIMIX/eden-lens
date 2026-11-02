import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

const source=fs.readFileSync('site/sw.js','utf8');

function setup({offline=false}={}){
  const listeners=new Map();
  const entries=new Map();
  const requests=[];
  const cache={
    addAll:async paths=>{for(const p of paths)entries.set('https://eden-lens.netlify.app'+p,{ok:true,body:p})},
    put:async(request,response)=>{entries.set(typeof request==='string'?'https://eden-lens.netlify.app'+request:request.url,response)},
    match:async request=>entries.get(typeof request==='string'?'https://eden-lens.netlify.app'+request:request.url),
    keys:async()=>[...entries.keys()].map(url=>({url})),
    delete:async request=>entries.delete(request.url)
  };
  const caches={
    open:async()=>cache,
    keys:async()=>['eden-lens-old','eden-lens-v2.6'],
    delete:async()=>true
  };
  const scope={
    self:{location:{origin:'https://eden-lens.netlify.app'},addEventListener:(name,fn)=>listeners.set(name,fn),skipWaiting:async()=>{},clients:{claim:async()=>{}}},
    caches,
    URL,
    console,
    fetch:async request=>{
      requests.push(request.url);
      if(offline)throw Error('offline');
      return {ok:true,type:'basic',headers:{has:()=>false,get:()=>null},clone(){return this},body:'network'};
    }
  };
  vm.runInNewContext(source,scope,{filename:'sw.js'});
  const request=(path,options={})=>({
    method:'GET',url:'https://eden-lens.netlify.app'+path,mode:'same-origin',cache:'default',
    headers:{has:()=>false},...options
  });
  async function fire(name,requestValue){
    const waits=[];
    let response;
    listeners.get(name)({request:requestValue,waitUntil:p=>waits.push(Promise.resolve(p)),respondWith:p=>{response=Promise.resolve(p)}});
    const result=response?await response:undefined;
    await Promise.all(waits);
    return result;
  }
  return {fire,request,entries,requests};
}

test('precache contains the application shell',async()=>{
  const s=setup();
  await s.fire('install');
  for(const path of ['/','/index.html','/manifest.webmanifest','/icon.svg'])
    assert.ok(s.entries.has('https://eden-lens.netlify.app'+path));
});

test('navigation works from cache when offline',async()=>{
  const s=setup({offline:true});
  await s.fire('install');
  const response=await s.fire('fetch',s.request('/?from=pwa',{mode:'navigate'}));
  assert.equal(response.body,'/');
});

test('public asset works from cache when offline',async()=>{
  const s=setup({offline:true});
  await s.fire('install');
  const response=await s.fire('fetch',s.request('/icon.svg'));
  assert.equal(response.body,'/icon.svg');
});

test('API endpoints are never intercepted',async()=>{
  const s=setup();
  assert.equal(await s.fire('fetch',s.request('/api/private')),undefined);
  assert.equal(s.requests.length,0);
});

test('external origins and non-GET requests are not intercepted',async()=>{
  const s=setup();
  assert.equal(await s.fire('fetch',s.request('/',{method:'POST'})),undefined);
  assert.equal(await s.fire('fetch',s.request('/',{url:'https://example.com/'})),undefined);
});

test('authorization and no-store requests are not intercepted',async()=>{
  const s=setup();
  assert.equal(await s.fire('fetch',s.request('/',{headers:{has:key=>key==='authorization'}})),undefined);
  assert.equal(await s.fire('fetch',s.request('/',{cache:'no-store'})),undefined);
});

test('cache does not grow with query-string variants',async()=>{
  const s=setup();
  await s.fire('install');
  for(let i=0;i<50;i++)await s.fire('fetch',s.request('/?q='+i,{mode:'navigate'}));
  assert.equal(s.entries.size,4);
});

test('unrecognized assets are never intercepted',async()=>{
  const s=setup();
  assert.equal(await s.fire('fetch',s.request('/random.json')),undefined);
  assert.equal(await s.fire('fetch',s.request('/icon.svg?token=secret')),undefined);
});
