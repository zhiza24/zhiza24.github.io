const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../../game_v5');
const flowSource=fs.readFileSync(path.join(root,'flow.js'),'utf8');
const routeUrls=[...flowSource.matchAll(/\{u:'([^']+)',pt:'([^']+)'/g)].map(m=>m[1]);

test('all 57 route destinations render in their own current route state',async({page})=>{
 test.setTimeout(180000);
 expect(routeUrls.length).toBe(57);
 const errors=[];
 let currentUrl='/';
 page.on('pageerror',e=>errors.push({url:currentUrl,error:e.message}));
 page.on('response',r=>{
  if(r.url().startsWith('http://127.0.0.1:8000/')&&r.status()>=400)errors.push({url:currentUrl,error:'HTTP '+r.status()+' '+r.url()});
 });
 await page.route('**/*.mp4',route=>route.abort());
 await page.goto('/index.html?u=T',{waitUntil:'domcontentloaded'});
 for(let i=0;i<routeUrls.length;i++){
  const routeUrl=routeUrls[i];
  const completed={};
  routeUrls.slice(0,i).forEach(u=>{completed[u]=Date.now()});
  const profile={
   name:'Проверка',birth:'10.02.2000',gender:'f',mapStyle:'amber',
   points:{personality:10,intuition:2,challenge:15,key:5},
   flow:{version:2,current:routeUrl,visited:{},completed,snapshots:{}},
   tracker:{start:Date.now(),day:1,space:'day',view:'day',days:{},events24:{},checkpoints24:{},directions:['Проверка'],focus:[]},
   diary:{entries:[]}
  };
  await page.evaluate(p=>{
   localStorage.clear();sessionStorage.clear();
   localStorage.setItem('alch_v5_profile',JSON.stringify(p));
  },profile);
  currentUrl='/'+routeUrl;
  const requestUrl=currentUrl+(routeUrl.includes('?')?'&':'?')+'u=T';
  await page.goto(requestUrl,{waitUntil:'domcontentloaded'});
  await expect(page.locator('body')).toBeVisible();
  const actualPath=new URL(page.url()).pathname.replace(/^\//,'');
  expect(actualPath,'route redirected unexpectedly: '+routeUrl).toBe(routeUrl.split('?')[0]);
  const text=(await page.locator('body').innerText()).trim();
  expect(text.length,'empty screen for '+routeUrl).toBeGreaterThan(0);
 }
 expect(errors,'uncaught page errors or missing local responses across route').toEqual([]);
});
