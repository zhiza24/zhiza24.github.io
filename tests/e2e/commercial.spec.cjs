const {test,expect}=require('@playwright/test');
test('commercial edition exposes 35-step route and does not read main profile',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('alch_v5_profile',JSON.stringify({name:'MAIN_ONLY_SENTINEL'})));
 await page.goto('/map.html');
 await expect(page).toHaveTitle(/Путь современного Алхимика/);
 const result=await page.evaluate(()=>({count:window.GFLOW.length,current:window.GRoute.state().url,profileName:window.GRoute.load().name}));
 expect(result.count).toBe(35);
 expect(result.current).toBe('form.html');
 expect(result.profileName).toBeUndefined();
});

test('strategy choice completes ten scenes and keeps score details internal',async({page})=>{
 const profile={
  name:'Проверка',birth:'10.02.2000',gender:'f',
  points:{personality:10,intuition:2,challenge:15,key:5},
  flow:{version:2,current:'bridge.html',visited:{},completed:{'index.html':1,'form.html':1,'elder.html':1,'hero.html':1,'choose.html':1}}
 };
 await page.goto('/map.html');
 await page.evaluate(p=>window.GRoute.save(p),profile);
 const route=await page.evaluate(()=>window.GRoute.state().url);
 expect(route).toBe('bridge.html');
 await page.goto('/bridge.html');
 await expect(page.locator('#gsc-close')).toBeVisible();
 await page.locator('#gsc-close').click();
 for(let i=0;i<10;i++){
  await expect(page.locator('.op')).toHaveCount(4);
  const previousQuestion=await page.locator('#qt').textContent();
  await page.locator('.op[data-k="'+(i<5?'0':'1')+'"]').click();
  if(i===2||i===6){
   await expect(page.locator('#gsc-close')).toBeVisible({timeout:15000});
   await page.locator('#gsc-close').click();
  }
  if(i<9)await expect(page.locator('#qt')).not.toHaveText(previousQuestion,{timeout:15000});
 }
 await expect(page.locator('#cutGo')).toBeVisible({timeout:15000});
 await page.locator('#cutGo').click();
 await expect(page.locator('.grc')).toBeVisible();
 await expect(page.locator('.grc-lead')).toContainText('Действие и Наблюдение');
 await expect(page.locator('.grc')).not.toContainText('Распределение');
 await expect(page.locator('.grc')).not.toContainText('одинаковое число выборов');
 const details=page.locator('.grc-det').first();
 await details.locator('summary').click();
 await expect(details).toContainText('Это видно по твоим решениям');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('alch_v5_profile')));
 expect(saved.pocherk.answers).toHaveLength(10);
 expect(saved.pocherk.mixed).toBe(true);
 expect(saved.handTop).toBeNull();
});

test('every commercial route screen opens in sequence without runtime errors',async({page})=>{
 test.setTimeout(180000);
 const pageErrors=[];
 page.on('pageerror',error=>pageErrors.push({url:page.url(),message:error.message}));
 await page.goto('/map.html');
 const steps=await page.evaluate(()=>window.GFLOW.map(x=>x.u));
 expect(steps).toHaveLength(35);
 const fixture={
  name:'Проверка',birth:'10.02.2000',gender:'f',points:{personality:10,intuition:2,challenge:15,key:5},
  mapStyle:'amber',handTop:'act',pocherk:{doneAt:1,answers:[]},dialog:{answers:[]},
  backgroundProfile:{backgroundState:{version:2,completedAt:1,families:[],groups:{resource:{leaders:[],families:[],status:'no_clear_leader'},protective:{leaders:[],families:[],status:'no_clear_leader'}},coverage:{answered:16}}},
  ego:{v:2,schema:'df',mode:'ha',sc:{},md:{}},betray:{done:true},im:{v:3,sources:[],fragments:[],links:[],tensions:[],unknown:[]},
  dq:{accepted:80},portrait:{done:true,zones:[]},wheel:[5,5,5,5,5,5,5,5],wheelTest:{completed:true,spheres:[]},
  valuesStage:'done',values:{picked:['Свобода','Безопасность','Смысл','Развитие','Любовь'],score:{'Свобода':5,'Безопасность':4,'Смысл':3,'Развитие':2,'Любовь':1},pairs:[],pi:10,order:['Свобода','Смысл','Развитие','Безопасность','Любовь']},egoSelf:{i:10,ans:Array(10).fill('mixed')},focuses:['Здоровье','Финансы','Смысл'],valuesCore:{v:1,top3:['Свобода','Смысл','Развитие']},
  fractal:{evidence:[{sphere:'money'}],lever:{id:'lever',status:'chosen'}},
  lab:{lead:'err',queue:['deval','resp'],weak:false,cycle:1,sort:['yes','part','no','unknown','yes','part'],newRule:'Новая формулировка'},
  desireLab:{v:1,desire:'Свое дело'},tracker:{declared:{text:'Главное желание'},directions:[{id:'a',text:'Первое'},{id:'b',text:'Второе'}],start:Date.now()-27*86400000,strategySeen:true,finale:{done:true},days:{},strategy:{v:1,wish:'Главное желание',result:'Первый результат',focus:[],days:[]}},
  archD:{v:1,top:'Выбор состояния'},pathPlan:{done:true},retest:{wheel:[6,6,6,6,6,6,6,6],beh:[1,1,1]},
  pathFinal:{wish:'дом'},res:[],body:'',nature:{primary:'architect'},flow:{version:2,current:'form.html',completed:{},visited:{}}
 };
 for(let i=0;i<steps.length;i++){
  const u=steps[i],completed={};
  for(let j=0;j<i;j++)completed[steps[j]]=Date.now()-((i-j)*1000);
  const profile={...fixture,flow:{version:2,current:u,completed,visited:{}}};
  await page.evaluate(p=>window.GRoute.save(p),profile);
  const target='/'+u+(u.includes('?')?'&':'?')+'u=ROUTEQA';
  await page.goto(target,{waitUntil:'domcontentloaded'});
  await expect(page.locator('body')).toContainText(/\S/);
  await expect(page).not.toHaveURL(/tasks\.html\?locked=1/);
  const errors=pageErrors.splice(0);
  expect(errors, 'runtime errors at '+u).toEqual([]);
 }
});
