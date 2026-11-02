const CACHE='eden-lens-v2.5';
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
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/')||request.headers.has('authorization')||request.cache==='no-store')return;
  event.respondWith((async()=>{
    try{
      const response=await fetch(request);
      if(response.ok&&response.type==='basic'&&!response.headers.has('set-cookie')&&!/private|no-store/i.test(response.headers.get('cache-control')||'')){
        const copy=response.clone();
        event.waitUntil((async()=>{
          try{
            const cache=await caches.open(CACHE);
            await cache.put(request,copy);
            const keys=await cache.keys();
            const removable=keys.filter(key=>!CORE.includes(new URL(key.url).pathname));
            const excess=Math.max(0,keys.length-MAX_ENTRIES);
            for(const key of removable.slice(0,excess))await cache.delete(key);
          }catch(error){console.warn('EDEN LENS cache update skipped',error)}
        })());
      }
      return response;
    }catch(error){
      const cached=await caches.match(request);
      if(cached)return cached;
      throw error;
    }
  })());
});
