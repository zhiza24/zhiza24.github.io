'use strict';
/* Progressive cache: never download the entire game during installation. */
const CACHE='alch-v5-fast-2026-11-23-v32';
const SHELL=[
 './index.html','./map.html','./theme.js','./sound.js','./flow.js',
 './opening.js','./route.js','./profile-layer.js','./route-gate.js',
 './engine.js','./passport-data.js','./passport.js','./texts.js','./nav.js',
 './nav.css','./sun-btn.css','./t/style.css','./img/map_axis.jpg'
];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  await Promise.all(SHELL.map(async path=>{
   try{
    const url=new URL(path,self.registration.scope);
    const response=await fetch(url.href,{cache:'reload'});
    if(response.ok)await cache.put(url.href,response);
   }catch(e){}
  }));
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('alch-v5-')&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||req.headers.has('range'))return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin||/\.(mp4|webm)$/i.test(url.pathname))return;
 if(req.mode==='navigate'){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const hit=await cache.match(req,{ignoreSearch:true});
   if(hit)return hit;
   try{
    const response=await fetch(req);
    if(response&&response.ok)await cache.put(req,response.clone());
    return response;
   }catch(e){
    return (await cache.match(new URL('./offline.html',self.registration.scope).href))||Response.error();
   }
  })());
  return;
 }
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const hit=await cache.match(req,{ignoreSearch:true});
  if(hit)return hit;
  try{
   const response=await fetch(req);
   if(response&&response.ok)await cache.put(req,response.clone());
   return response;
  }catch(e){return Response.error()}
 })());
});
