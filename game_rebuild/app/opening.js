/* A repeat of the opening uses its own tab-local game, never the saved route.
   Installed before legacy scripts: their original interactions stay unchanged. */
(function(){
'use strict';
const real=window.localStorage,tab=window.sessionStorage,KEY='alch_v5_opening_run_v1';
const file=location.pathname.split('/').pop()||'index.html',q=new URLSearchParams(location.search);
const requested=file==='form.html'&&(q.get('opening')==='1'||q.get('review')==='1');
const exits=['index.html','cover_v1.html','map.html','tasks.html','diary.html'];
let run=null;try{run=JSON.parse(tab.getItem(KEY));}catch(e){}
function profile(){try{return JSON.parse(real.getItem('alch_v5_profile'))||{}}catch(e){return {}}}
if(exits.includes(file)){tab.removeItem(KEY);return;}
if(requested&&!run){
 const main=profile(),p={};
 ['name','birth','gender','points','passport'].forEach(k=>{if(main[k]!==undefined)p[k]=main[k]});
 p.flow={version:2,current:'form.html',completed:{}};
 run={store:{alch_v5_profile:JSON.stringify(p)},session:{}};tab.setItem(KEY,JSON.stringify(run));
}
if(run&&!requested&&q.get('opening')!=='1'){tab.removeItem(KEY);return;}
if(!run||!run.store||!run.session)return;
function persist(){tab.setItem(KEY,JSON.stringify(run));}
const methods={getItem:k=>Object.hasOwn(run.store,String(k))?run.store[String(k)]:null,setItem:(k,v)=>{run.store[String(k)]=String(v);persist()},removeItem:k=>{delete run.store[String(k)];persist()},clear:()=>{run.store={};persist()},key:i=>Object.keys(run.store)[i]||null};
const storage=new Proxy(methods,{get:(o,k)=>k==='length'?Object.keys(run.store).length:k in o?o[k]:run.store[k],set:(o,k,v)=>{methods.setItem(k,v);return true},ownKeys:()=>Object.keys(run.store),getOwnPropertyDescriptor:()=>({enumerable:true,configurable:true})});
const ephemeral=new Set(['alch_v5_gLastStep','alch_v5_fire0','alch_v5_mirror_preview']);
const session=new Proxy(tab,{get:(o,k)=>{
 if(k==='getItem')return key=>ephemeral.has(key)?run.session[key]??null:tab.getItem(key);
 if(k==='setItem')return (key,v)=>{if(ephemeral.has(key)){run.session[key]=String(v);persist()}else tab.setItem(key,v)};
 if(k==='removeItem')return key=>{if(ephemeral.has(key)){delete run.session[key];persist()}else tab.removeItem(key)};
 if(ephemeral.has(k))return run.session[k];const v=Reflect.get(o,k,o);return typeof v==='function'?v.bind(o):v;
},set:(o,k,v)=>{if(ephemeral.has(k)){run.session[k]=String(v);persist()}else tab.setItem(k,v);return true}});
Object.defineProperty(window,'localStorage',{value:storage,configurable:true});
Object.defineProperty(window,'sessionStorage',{value:session,configurable:true});
function url(href){const u=new URL(href,location.href);if(u.origin!==location.origin)return href;u.searchParams.set('v','opening2');if(!exits.includes(u.pathname.split('/').pop())){u.searchParams.delete('review');u.searchParams.set('opening','1');}else u.searchParams.delete('opening');return u.pathname.split('/').pop()+u.search+u.hash;}
window.GOpening={active:true,url,savedProfile:profile,saveIdentity:draft=>{
 const p=profile();['name','birth','gender','points'].forEach(k=>{if(draft[k]!==undefined)p[k]=draft[k]});
 GPassport.ensure(p,real);real.setItem('alch_v5_profile',JSON.stringify(p));
}};
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;const h=a.getAttribute('href');if(h.startsWith('#'))return;const u=new URL(h,location.href);if(u.origin!==location.origin)return;a.href=url(h);},true);
})();
