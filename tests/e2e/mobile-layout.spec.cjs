const {test,expect}=require('@playwright/test');

function seedProfile(page){
 return page.addInitScript(()=>{
  const file=location.pathname.split('/').pop()||'index.html';
  const params=new URLSearchParams(location.search);
  const current=file==='reactor.html'?'reactor.html':file==='slot.html'?'slot.html?id='+(params.get('id')||'mechanism'):'slot.html?id=mechanism';
  const profile={
   name:'Проверка',birth:'10.02.2000',gender:'f',
   points:{personality:10,intuition:2,challenge:15,key:5},
   flow:{version:2,current,visited:{},completed:{},snapshots:{}},
   tracker:{start:Date.now(),day:1,space:'day',view:'day',days:{},events24:{},checkpoints24:{},directions:[],focus:[]},
   diary:{entries:[]}
  };
  localStorage.setItem('alch_v5_profile',JSON.stringify(profile));
 });
}

test('main game screens fit a narrow mobile viewport without horizontal page overflow',async({page})=>{
 await page.setViewportSize({width:375,height:812});
 await seedProfile(page);
 await page.route('**/*.mp4',route=>route.abort());
 const cases=[
  '/map.html?u=T',
  '/slot.html?id=mechanism&u=T',
  '/reactor.html?u=T',
  '/diary.html?u=T',
  '/hero.html?u=T',
  '/elder.html?review=1&u=T',
  '/cutscene.html?review=1&u=T'
 ];
 const overflows=[];
 for(const url of cases){
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await expect(page.locator('body')).toBeVisible();
  const size=await page.evaluate(()=>({width:window.innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
  if(size.document>size.width+1||size.body>size.width+1)overflows.push({url,...size});
 }
 expect(overflows,'horizontal overflow at 375px viewport').toEqual([]);
});
