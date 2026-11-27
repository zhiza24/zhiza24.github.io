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
