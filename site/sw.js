const CACHE='eden-lens-v2.4';
const CORE=['/','/index.html','/manifest.webmanifest','/icon.svg'];
const MAX_ENTRIES=40;
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('eden-lens-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/')||request.headers.has('authorization'))return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(request);
      if(response.ok&&response.type==='basic'&&!response.headers.has('set-cookie')&&!/private|no-store/i.test(response.headers.get('cache-control')||'')){
        const cache=await caches.open(CACHE);
        await cache.put(request,response.clone());
        const keys=await cache.keys();
        if(keys.length>MAX_ENTRIES){
          for(const key of keys.slice(0,keys.length-MAX_ENTRIES))await cache.delete(key);
        }
      }
      return response;
    }catch(error){
      const cached=await caches.match(request);
      if(cached)return cached;
      throw error;
    }
  })());
});
