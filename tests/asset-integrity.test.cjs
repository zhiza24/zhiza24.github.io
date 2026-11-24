const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../game_v5');
const repoRoot=path.resolve(root,'..');
function walk(dir,out=[]){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,ent.name);if(ent.isDirectory())walk(full,out);else out.push(full)}return out}
const files=walk(root);
const refs=[];
function add(owner,raw,kind){
 let ref=String(raw||'').trim();
 if(!ref||ref.startsWith('#')||ref.startsWith('//')||/^(https?:|data:|blob:|mailto:|tel:|javascript:|about:)/i.test(ref))return;
 ref=ref.split('#')[0].split('?')[0];
 if(!ref)return;
 let target=ref.startsWith('/')?path.resolve(repoRoot,'.'+ref):path.resolve(path.dirname(owner),ref);
 if(!target.startsWith(repoRoot+path.sep)&&target!==repoRoot)return;
 refs.push({owner:path.relative(repoRoot,owner),ref,target,kind});
}
for(const file of files){
 const ext=path.extname(file).toLowerCase();
 if(ext==='.html'){
  const text=fs.readFileSync(file,'utf8');
  for(const m of text.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/gi))add(file,m[1],'html');
  for(const m of text.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/gi))add(file,m[1],'inline-css');
  for(const m of text.matchAll(/["']((?:img|media|snd)\/[^"']+\.(?:mp3|wav|ogg|mp4|webm|png|jpe?g|webp|svg))["']/gi))add(file,m[1],'inline-js');
 }else if(ext==='.css'){
  const text=fs.readFileSync(file,'utf8');
  for(const m of text.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/gi))add(file,m[1],'css');
 }else if(ext==='.js'){
  const text=fs.readFileSync(file,'utf8');
  for(const m of text.matchAll(/["']((?:img|media|snd)\/[^"']+\.(?:mp3|wav|ogg|mp4|webm|png|jpe?g|webp|svg))["']/gi))add(file,m[1],'js');
 }
}
const missing=refs.filter(x=>!fs.existsSync(x.target));
if(missing.length){
 console.error('Missing local assets:',missing.map(x=>x.owner+' -> '+x.ref+' ['+x.kind+']').join('\n'));
}
assert.equal(missing.length,0,'all local page, style, image, audio and video references must resolve');
console.log('PASS: '+refs.length+' local references across '+files.length+' game files resolve to existing assets.');
