const {test,expect}=require('@playwright/test');
function seedProfile(page){
 return page.addInitScript(()=>{
  const file=location.pathname.split('/').pop()||'index.html';
  const params=new URLSearchParams(location.search);
  const current=file==='reactor.html'?'reactor.html':file==='slot.html'?'slot.html?id='+(params.get('id')||'mechanism'):'slot.html?id=mechanism';
  const profile={
   name:'Проверка',
   birth:'10.02.2000',
   gender:'f',
   points:{personality:10,intuition:2,challenge:15,key:5},
   flow:{version:2,current,visited:{},completed:{},snapshots:{}},
   tracker:{start:Date.now(),day:1,space:'day',view:'day',days:{},events24:{},checkpoints24:{},directions:[],focus:[]},
   diary:{entries:[]}
  };
  localStorage.setItem('alch_v5_profile',JSON.stringify(profile));
 });
}
test('main screens render without page errors or missing local responses',async({page})=>{
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:8000/')&&r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url())});
 await seedProfile(page);
 await page.route('**/*.mp4',route=>route.abort());
 const cases=[
  {url:'/map.html?u=T',text:'Приветствую вас, господа пробужденные'},
  {url:'/slot.html?id=mechanism&u=T',text:'Лаборатория внутреннего механизма'},
  {url:'/reactor.html?u=T',text:'Твой маршрут на 28 дней'},
  {url:'/diary.html?u=T',text:'Дневник'},
  {url:'/hero.html?u=T',text:'Герой'},
  {url:'/elder.html?review=1&u=T',text:'Вот твой мир'},
  {url:'/cutscene.html?review=1&u=T',text:null}
 ];
 for(const item of cases){
  errors.length=0;
  await page.goto(item.url,{waitUntil:'domcontentloaded'});
  await expect(page.locator('body')).toBeVisible();
  if(item.text)await expect(page.locator('body')).toContainText(item.text);
  if(item.url.startsWith('/slot.html'))expect(page.url()).toContain('slot.html?id=mechanism');
  if(item.url.startsWith('/reactor.html')){
   await expect(page.locator('body')).toContainText('Предварительный маршрут');
   await expect(page.locator('body')).not.toContainText('Скрытое правило');
  }
  if(item.url.startsWith('/elder.html')){
   await expect(page.locator('#au')).toHaveAttribute('src','media/voice.mp3');
   await page.locator('#snd').click();
   await page.waitForFunction(()=>{const a=document.getElementById('au');return !!a&&!a.paused},null,{timeout:15000});
   await page.evaluate(()=>document.getElementById('au').pause());
  }
  if(item.url.startsWith('/cutscene.html'))expect(await page.locator('video').first().getAttribute('poster')).toBeTruthy();
  expect(errors,'errors while loading '+item.url).toEqual([]);
 }
});
test('both cinematic videos decode and can play online',async({page})=>{
 await seedProfile(page);
 for(const item of [
  {url:'/elder.html?review=1&u=T',src:'media/elder.mp4'},
  {url:'/cutscene.html?review=1&u=T',src:'media/iam.mp4?v=cs2'}
 ]){
  await page.goto(item.url,{waitUntil:'domcontentloaded'});
  const video=page.locator('video').first();
  await expect(video).toHaveAttribute('src',item.src);
  await page.evaluate(async()=>{const v=document.querySelector('video');if(v){v.muted=true;await v.play()}});
  await page.waitForFunction(()=>{const v=document.querySelector('video');return !!v&&v.readyState>=2&&v.currentTime>0},null,{timeout:45000});
  await page.evaluate(()=>{const v=document.querySelector('video');if(v)v.pause()});
 }
});
test('main task runner remains available offline after service-worker install',async({page,context})=>{
 await seedProfile(page);
 await page.route('**/*.mp4',route=>route.abort());
 await page.goto('/map.html?u=T',{waitUntil:'domcontentloaded'});
 await page.setDefaultTimeout(60000);
 await page.waitForFunction(()=>!!window.GSWRegistration,null,{timeout:60000});
 await page.evaluate(async()=>{await window.GSWRegistration;await navigator.serviceWorker.ready});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!navigator.serviceWorker&&!!navigator.serviceWorker.controller,null,{timeout:60000});
 await page.goto('/slot.html?id=mechanism&u=T',{waitUntil:'domcontentloaded'});
 await expect(page.locator('body')).toContainText('Лаборатория внутреннего механизма');
 const cacheNames=await page.evaluate(()=>caches.keys());
 expect(cacheNames.some(x=>x.includes('2026-11-24-v35'))).toBeTruthy();
 await context.setOffline(true);
 await page.reload({waitUntil:'domcontentloaded'});
 await expect(page.locator('body')).toContainText('Лаборатория внутреннего механизма',{timeout:30000});
 await context.setOffline(false);
});
