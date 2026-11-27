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
 await page.addInitScript(()=>{
  const completed={'index.html':1,'form.html':1,'elder.html':1,'hero.html':1,'choose.html':1};
  const profile={
   name:'Проверка',birth:'10.02.2000',gender:'f',
   points:{personality:10,intuition:2,challenge:15,key:5},
   flow:{version:2,current:'bridge.html',visited:{},completed}
  };
  localStorage.setItem('alch_commercial_profile',JSON.stringify(profile));
 });
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
