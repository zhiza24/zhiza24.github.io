'use strict';
const CACHE='alch-v5-static-2026-11-24-v32';
const ASSETS=["./arcana.js","./arch-copy-updates.js","./arch-data.js","./arch.js","./background-state-engine.js","./background-state.js","./background-state-16-data.js","./background-state-16-engine.js","./background-state-16.js","./betray.html","./betraywheel.js","./birth-preview.html","./book.css","./book.js","./bquote.js","./breath.html","./bridge.html","./choose.html","./cover_v1.html","./crystal.html","./cutscene.html","./diary-book.js","./diary.html","./ego.html","./elder.html","./engine.js","./favicon.svg","./fin.html","./flow.js","./form.html","./g.css","./gender.js","./hero-sum.js","./hero.html","./hero.js","./herocard.html","./heromap.js","./hold.css","./hold.html","./hold.js","./img/arts/black_crystal.webp","./img/arts/bridge.webp","./img/arts/compass.webp","./img/arts/crystal_1.webp","./img/arts/fire.webp","./img/arts/guardian_boundaries.webp","./img/arts/guardian_clarity.webp","./img/arts/guardian_companion.webp","./img/arts/guardian_connection.webp","./img/arts/guardian_experience.webp","./img/arts/guardian_measure.webp","./img/arts/guardian_pace.webp","./img/arts/hero_passport.webp","./img/arts/key.webp","./img/arts/lantern.webp","./img/arts/laurel.webp","./img/arts/mirror.webp","./img/arts/path_crystal.webp","./img/arts/path_map.webp","./img/arts/proof_sign.webp","./img/arts/source.webp","./img/arts/sword.webp","./img/arts/wheel.webp","./img/arts/wish_star.webp","./img/btn_plate.png","./img/c1_n.jpg","./img/c1_s.jpg","./img/c1_str.jpg","./img/c1_z.jpg","./img/c2_n.jpg","./img/c2_s.jpg","./img/c2_str.jpg","./img/c2_z.jpg","./img/c3_n.jpg","./img/c3_s.jpg","./img/c3_str.jpg","./img/c3_z.jpg","./img/c4_n.jpg","./img/c4_s.jpg","./img/c4_str.jpg","./img/c4_z.jpg","./img/c5_n.jpg","./img/c5_s.jpg","./img/c5_str.jpg","./img/c5_z.jpg","./img/c6_n.jpg","./img/c6_s.jpg","./img/c6_str.jpg","./img/c6_z.jpg","./img/card_n.jpg","./img/card_s.jpg","./img/card_str.jpg","./img/card_z.jpg","./img/chasm_top.webp","./img/compass.png","./img/cutscene/iam_poster.jpg","./img/elder.jpg","./img/fire_camp.webp","./img/hero.jpg","./img/hero_f.jpg","./img/hero_f_full.jpg","./img/hero_f_old.jpg","./img/hero_f_portrait.jpg","./img/hero_icon.png","./img/hero_m.jpg","./img/hero_m_full.jpg","./img/hero_m_old.jpg","./img/hero_m_portrait.jpg","./img/info.png","./img/init.jpg","./img/map_axis.jpg","./img/map_bg.jpg","./img/map_bg_old.jpg","./img/map_pirate.jpg","./img/scene_architect.jpg","./img/scene_fire.jpg","./img/scene_fog.jpg","./img/scene_gap.jpg","./img/scene_mage.jpg","./img/scene_point_b.jpg","./img/scene_point_c.jpg","./img/scene_road.jpg","./img/scroll.webp","./img/scroll_closed.jpg","./img/scroll_closed.png","./img/scroll_open.jpg","./img/scroll_open.png","./img/scroll_open_bot.png","./img/scroll_open_bot_f.png","./img/scroll_open_mid.png","./img/scroll_open_top.png","./img/scroll_open_top_f.png","./img/sheet.jpg","./img/sheet_f.svg","./img/sphere.png","./img/start.png","./img/suede.webp","./img/sun_plasma.png","./img/tochka/cover.webp","./img/tochka/stage1.webp","./img/tochka/stage2.webp","./img/tochka/stage3.webp","./img/tochka/stage4.webp","./img/tochka/stage5.webp","./img/tochka/stage6.webp","./img/triangle_f.jpg","./img/triangle_m.jpg","./img/wheel.webp","./index.html","./inner-mirror-data.js","./inner-mirror.js","./inner-mechanism-data.js","./inner-mechanism.js","./lanterns.html","./manifest.webmanifest","./map.html","./maps.js","./media/elder.mp3","./media/elder_sides.mp3","./media/elder_strategy_f.mp3","./media/elder_strategy_m.mp3","./media/voice.mp3","./mirrors-data.js","./mirrors.css","./mirrors.js","./nature.js","./nav.css","./nav.js","./offline.html","./opening.js","./passport-data.js","./passport-ui.js","./passport.css","./passport.js","./path.html","./pocherk-data.js","./pocherk.css","./pocherk.js","./point-b-data.js","./practice-engine.js","./profile-layer.js","./reactor.html","./res.html","./result-card.js","./route-gate.js","./route.js","./samost.css","./samost.html","./samost.js","./scene.html","./scroll.css","./scroll.js","./sim-engine.js","./slot.html","./snd/entry.mp3","./snd/trans.mp3","./sound.js","./stage.html","./stages.js","./state-engine.js","./state-model-data.js","./strategy.js","./sum.html","./sun-btn.css","./support.js","./swipe.html","./t/style.css","./tasks.css","./tasks.html","./tasks.js","./tests-data.js","./tests-ld.js","./tests.js","./texts.js","./texts_fr.js","./theme.js","./themes_v1_1.json","./tochka-book.js","./track28.css","./track28.js","./tracker-analytics.js","./triangle.js","./upd.js","./values-atlas.js","./values.html","./wheel-test-data.js","./wheel-test.html","./wheel-test.js","./wheel.html","./wheel8.html","./labs/razbor.html","./wish-track.html","./wish.css","./wish.html","./wish.js"];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  for(let i=0;i<ASSETS.length;i+=10){
   await Promise.all(ASSETS.slice(i,i+10).map(async path=>{
    try{const url=new URL(path,self.registration.scope);const response=await fetch(url.href,{cache:'reload'});if(response.ok)await cache.put(url.href,response.clone())}catch(e){}
   }));
  }
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
   try{
    const response=await fetch(req);
    if(response&&response.ok){const cache=await caches.open(CACHE);await cache.put(req,response.clone())}
    return response;
   }catch(e){
    const cache=await caches.open(CACHE);
    return (await cache.match(req,{ignoreSearch:true}))||(await cache.match(new URL('./offline.html',self.registration.scope).href))||Response.error();
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
