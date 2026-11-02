const CACHE='eden-lens-v2.6';
const CORE=['/','/index.html','/manifest.webmanifest','/icon.svg'];
const MAX_ENTRIES=40;
const PUBLIC_ASSETS=new Set(CORE);
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('eden-lens-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||request.headers.has('authorization')||request.cache==='no-store')return;
  const isNavigation=request.mode==='navigate';
  const assetPath=isNavigation?'/':url.pathname;
  if(!PUBLIC_ASSETS.has(assetPath)||(!isNavigation&&url.search))return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(request);
      if(response.ok&&response.type==='basic'&&!response.headers.has('set-cookie')&&!/private|no-store/i.test(response.headers.get('cache-control')||'')){
        const copy=response.clone();
        event.waitUntil((async()=>{
          try{
            const cache=await caches.open(CACHE);
            await cache.put(isNavigation?'/':request,copy);
            const keys=await cache.keys();
            const removable=keys.filter(key=>!CORE.includes(new URL(key.url).pathname));
            const excess=Math.max(0,keys.length-MAX_ENTRIES);
            for(const key of removable.slice(0,excess))await cache.delete(key);
          }catch(error){console.warn('EDEN LENS cache update skipped',error)}
        })());
      }
      return response;
    }catch(error){
      const cache=await caches.open(CACHE);
      const cached=await cache.match(isNavigation?'/':request);
      if(cached)return cached;
      throw error;
    }
  })());
});
