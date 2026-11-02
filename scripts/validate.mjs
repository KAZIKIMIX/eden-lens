import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {execFileSync} from 'node:child_process';

const dir=path.resolve('site');
const required=['index.html','manifest.webmanifest','sw.js','icon.svg','_headers','netlify.toml'];
let count=0;
function check(condition,message){count++;if(!condition)throw Error(`Check ${count} failed: ${message}`)}
for(const file of required)check(fs.existsSync(path.join(dir,file)),`Missing ${file}`);
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(dir,'sw.js'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.webmanifest'),'utf8'));
const headers=fs.readFileSync(path.join(dir,'_headers'),'utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
check(scripts.length>0,'Missing application JavaScript');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'eden-validate-'));
try{
  for(let i=0;i<scripts.length;i++){
    const filename=path.join(temp,`inline-${i}.js`);
    fs.writeFileSync(filename,scripts[i][1]);
    execFileSync(process.execPath,['--check',filename],{stdio:'pipe'});
    count++;
  }
}finally{fs.rmSync(temp,{recursive:true,force:true})}
execFileSync(process.execPath,['--check',path.join(dir,'sw.js')],{stdio:'pipe'});count++;
const ids=[...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match=>match[1]);
const idSet=new Set(ids);
check(ids.length===idSet.size,'Duplicate HTML IDs');
for(const id of ids)check(/^[A-Za-z][A-Za-z0-9_-]*$/.test(id),`Invalid ID: ${id}`);
for(const script of scripts){
  for(const match of script[1].matchAll(/\$\(['"]([^'"]+)['"]\)/g)){
    check(idSet.has(match[1]),`Missing DOM element referenced by JS: ${match[1]}`);
  }
}
for(const id of ['video','overlay','snapshot','intro','start','capture','result','note','save','file','introFile','demo','status'])check(idSet.has(id),`Missing critical UI element: ${id}`);
check(/<html\s+lang=["']ja["']/.test(html),'Missing Japanese document language');
check(/name=["']viewport["']/.test(html),'Missing responsive viewport');
check(/name=["']theme-color["']/.test(html),'Missing theme color');
check(/rel=["']manifest["']/.test(html),'Manifest not linked');
check(manifest.name==='EDEN LENS','Unexpected PWA name');
check(manifest.display==='standalone','PWA display mode');
check(manifest.start_url==='/'&&manifest.scope==='/','Unexpected PWA scope');
check(Array.isArray(manifest.icons)&&manifest.icons.length>0,'Missing PWA icon');
for(const icon of manifest.icons){
  check(typeof icon.src==='string'&&icon.src.startsWith('/'),'PWA icon must be local');
  check(fs.existsSync(path.join(dir,icon.src.slice(1))),`Missing icon asset: ${icon.src}`);
}
check(sw.includes('self.addEventListener(\'install\''),'Missing SW install');
check(sw.includes('self.addEventListener(\'activate\''),'Missing SW activate');
check(sw.includes('self.addEventListener(\'fetch\''),'Missing SW fetch');
check(sw.includes('request.method!==\'GET\''),'SW must avoid caching non-GET requests');
check(sw.includes('request.headers.has(\'authorization\')'),'SW must avoid authenticated requests');
check(sw.includes('no-store'),'SW must respect no-store');
check(headers.includes('X-Content-Type-Options'),'Missing content type protection');
check(headers.includes('Referrer-Policy'),'Missing referrer policy');
check(headers.includes('Permissions-Policy'),'Missing permissions policy');
check(html.includes("x.class!=='person'"),'Person filtering missing');
check(html.includes('audio:false'),'Camera audio must be disabled');
check(html.includes('getTracks().forEach(t=>t.stop())'),'Camera stream cleanup missing');
check(html.includes('encodeURIComponent(q)'),'Search URL encoding missing');
check(html.includes('localStorage'),'Local notes storage missing');
const captureHandler=html.match(/\$\('capture'\)\.onclick=async\(\)=>\{([\s\S]*?)\};\$\('save'\)/)?.[1];
check(Boolean(captureHandler),'Missing capture handler');
check(captureHandler.indexOf('v.readyState<2')>=0&&captureHandler.indexOf('v.readyState<2')<captureHandler.indexOf('++loopToken'),'Camera readiness must be checked before stopping detection');
check(html.includes("alert('画像ファイルを選択してください')"),'Invalid image upload must show feedback');
check(html.includes('if(startToken!==loopToken)return;if(stream)'), 'Stale camera failures must not reset newer camera sessions');
check(html.includes('if(scanId!==latestScanId)return;lastPredictions=[]'), 'Stale scan errors must not reset newer predictions');
check(html.includes("if(scanId!==latestScanId)return;$('result').classList.remove('hidden')"), 'Stale scans must not render results');
check(html.includes("++loopToken; lastImage=null;lastPredictions=[]"),'Photo scan must clear previous scan state');
check(html.includes('await img.decode();if(scanId!==latestScanId)return'),'Cancelled photo decode must not change canvas');
check(html.includes('model=await getModel();if(scanId!==latestScanId)return;const predictions='),'Cancelled model load must not begin photo detection');
check(html.includes("if(!img.naturalWidth||!img.naturalHeight)throw Error"),'Invalid decoded image dimensions must be rejected');
check(html.includes('++loopToken;lastPredictions=[];selectedIndex=-1;selectedLabel='),'Camera capture must reset previous detection selection');
check(html.includes('if(scanId!==latestScanId)return;const detected=await m.detect(c,20,.25)'),'Cancelled camera capture must not run model detection');
check(html.includes('function start(){++latestScanId;const startToken=++loopToken'),'Camera restart must invalidate photo scans');
check(html.includes("await $('video').play();if(startToken!==loopToken)return"),'Stale camera playback must not update the UI');
console.log(`EDEN LENS validation passed: ${count} checks`);
