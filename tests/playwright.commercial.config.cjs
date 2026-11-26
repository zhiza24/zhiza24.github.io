const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
 testDir:'./e2e',
 testMatch:'**/commercial.spec.cjs',
 timeout:60000,
 expect:{timeout:15000},
 fullyParallel:false,
 workers:1,
 reporter:'list',
 use:{baseURL:'http://127.0.0.1:8001',browserName:'chromium',headless:true,viewport:{width:390,height:844},actionTimeout:15000},
 webServer:{command:'python3 -m http.server 8001 --directory ../game_commercial',url:'http://127.0.0.1:8001/map.html',reuseExistingServer:!process.env.CI,timeout:60000}
});
