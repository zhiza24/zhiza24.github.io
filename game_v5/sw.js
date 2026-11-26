/* Оболочка кэшируется при установке. Картинки и прочие тяжелые файлы — по мере просмотра, stale-while-revalidate.
   Смена версии больше не скачивает заново всю папку img/. localStorage не затрагивается. */
'use strict';
const CACHE='alch-v5-shell-2026-11-26-v77';
const RUNTIME='alch-v5-runtime';
const ASSETS=["./wow.js","./self-thread.js","./arcana.js","./arch-copy-updates.js","./arch-data.js","./arch.js","./background-state-engine.js","./background-state.js","./background-state-16-data.js","./background-state-16-engine.js","./background-state-16.js","./betray.html","./betraywheel.js","./birth-preview.html","./book.css","./book.js","./bquote.js","./breath.html","./bridge.html","./choose.html","./cover_v1.html","./crystal.html","./cutscene.html","./diary-book.js","./diary.html","./ego.html","./elder.html","./engine.js","./favicon.svg","./fin.html","./flow.js","./form.html","./g.css","./gender.js","./hero-sum.js","./hero.html","./hero.js","./herocard.html","./heromap.js","./hold.css","./hold.html","./hold.js","./img/cutscene/iam_poster.jpg","./img/elder.jpg","./img/icon-192.png","./img/icon-180.png","./index.html","./info.html","./inner-mirror-data.js","./inner-mirror.js","./inner-mechanism-data.js","./inner-mechanism.js","./lanterns.html","./learning-data.js","./learning-engine.js","./learning.css","./learning.html","./manifest.webmanifest","./map.html","./maps.js","./media/elder.mp3","./media/elder_sides.mp3","./media/elder_strategy_f.mp3","./media/elder_strategy_m.mp3","./media/voice.mp3","./mirrors-data.js","./mirrors.css","./mirrors.js","./nature.js","./nav.css","./nav.js","./offline.html","./opening.js","./pattern-map-engine.js","./pattern-map-lab.css","./pattern-map-lab.html","./passport-data.js","./passport-ui.js","./passport.css","./passport.js","./path.html","./pocherk-data.js","./pocherk.css","./pocherk.js","./point-b-data.js","./practice-engine.js","./profile-layer.js","./reactor.html","./reactor-core.js","./goal-path-engine.js","./capacity-engine.js","./workshop-engine.js","./res.html","./result-card.js","./route-gate.js","./route.js","./samost.css","./samost.html","./samost.js","./scene.html","./scroll.css","./scroll.js","./sim-engine.js","./slot.html","./snd/entry.mp3","./snd/trans.mp3","./sound.js","./stage.html","./stages.js","./state-engine.js","./state-model-data.js","./strategy.js","./sum.html","./sun-btn.css","./support.js","./swipe.html","./t/style.css","./tasks.css","./tasks.html","./tasks.js","./tests-data.js","./tests-ld.js","./tests.js","./texts.js","./texts_fr.js","./theme.js","./themes_v1_1.json","./tochka-book.js","./track28.css","./track28.js","./tracker-app.css","./tracker-analytics.js","./triangle.js","./upd.js","./values-atlas.js","./values.html","./wheel-test-data.js","./wheel-test.html","./wheel-test.js","./wheel.html","./wheel8.html","./labs/razbor.html","./wish-track.html","./wish.css","./wish.html","./wish.js"];
self.addEventListener('message',event=>{
 if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  for(let i=0;i<ASSETS.length;i+=16){
   await Promise.all(ASSETS.slice(i,i+16).map(async path=>{
    try{const url=new URL(path,self.registration.scope);const response=await fetch(url.href,{cache:'reload'});if(response.ok)await cache.put(url.href,response.clone())}catch(e){}
   }));
  }
  await self.skipWaiting();
 })());
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k!==CACHE&&k!==RUNTIME&&(k.startsWith('alch-v5-static-')||k.startsWith('alch-v5-shell-'))).map(k=>caches.delete(k)));
  await self.clients.claim();
 })());
});
function isHeavy(url){return /\.(png|jpe?g|gif|webp|svg|avif|ico|mp3|ogg|wav|m4a)$/i.test(url.pathname)}
async function swr(req,cacheName,ignoreSearch){
 const cache=await caches.open(cacheName);
 const cached=await cache.match(req,ignoreSearch?{ignoreSearch:true}:undefined);
 const fetching=fetch(req).then(async res=>{if(res&&res.ok)await cache.put(req,res.clone());return res}).catch(()=>null);
 if(cached){fetching.catch(()=>{});return cached}
 const net=await fetching;
 return net||Response.error();
}
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||req.headers.has('range'))return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin||/\.(mp4|webm)$/i.test(url.pathname))return;
 if(req.mode==='navigate'){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const cached=await cache.match(req,{ignoreSearch:true});
   const netP=fetch(req).then(async net=>{if(net&&net.ok)await cache.put(req,net.clone());return net}).catch(()=>null);
   if(cached){netP.catch(()=>{});return cached}
   const net=await netP;
   if(net)return net;
   return (await cache.match(new URL('./offline.html',self.registration.scope).href))||Response.error();
  })());
  return;
 }
 if(isHeavy(url)){event.respondWith(swr(req,RUNTIME,true));return}
 event.respondWith((async()=>{
  const shell=await caches.open(CACHE);
  const hit=await shell.match(req,{ignoreSearch:true});
  const netP=fetch(req).then(async res=>{
   if(res&&res.ok){const dest=hit?shell:await caches.open(RUNTIME);await dest.put(req,res.clone())}
   return res;
  }).catch(()=>null);
  if(hit){netP.catch(()=>{});return hit}
  const runtime=await caches.open(RUNTIME);
  const rhit=await runtime.match(req,{ignoreSearch:true});
  if(rhit){netP.catch(()=>{});return rhit}
  const net=await netP;
  return net||Response.error();
 })());
});
