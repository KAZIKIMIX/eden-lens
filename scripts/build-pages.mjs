import fs from 'node:fs';
import path from 'node:path';
const source='site', dest='pages-dist';
fs.rmSync(dest,{recursive:true,force:true});
fs.mkdirSync(dest,{recursive:true});
for(const file of ['index.html','icon.svg','manifest.webmanifest','sw.js']){
 fs.copyFileSync(path.join(source,file),path.join(dest,file));
}
const manifestPath=path.join(dest,'manifest.webmanifest');
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
manifest.start_url='./';
manifest.scope='./';
for(const icon of manifest.icons||[])icon.src='./'+icon.src.replace(/^\/+/, '');
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
const swPath=path.join(dest,'sw.js');
let sw=fs.readFileSync(swPath,'utf8');
sw=sw.replace("const CORE=['/','/index.html','/manifest.webmanifest','/icon.svg'];","const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];");
sw=sw.replace("const PUBLIC_ASSETS=new Set(CORE);","const PUBLIC_ASSETS=new Set(CORE.map(p=>new URL(p,self.registration.scope).pathname));");
sw=sw.replace("const assetPath=isNavigation?'/':url.pathname;","const root=new URL('./',self.registration.scope).pathname;\n  const assetPath=isNavigation?root:url.pathname;");
sw=sw.replace("cache.put(isNavigation?'/':request,copy)","cache.put(isNavigation?root:request,copy)");
sw=sw.replace("cache.match(isNavigation?'/':request)","cache.match(isNavigation?root:request)");
sw=sw.replace("!CORE.includes(new URL(key.url).pathname)","!PUBLIC_ASSETS.has(new URL(key.url).pathname)");
sw=sw.replace(/const CACHE='([^']+)'/,(_,v)=>"const CACHE='"+v+"-pages'");
fs.writeFileSync(swPath,sw);
fs.writeFileSync(path.join(dest,'.nojekyll'),'');
if(!sw.includes("CORE=['./'"))throw Error('Failed to adapt service worker paths');
console.log('GitHub Pages bundle prepared');
