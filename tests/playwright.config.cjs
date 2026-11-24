const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
 testDir:'./e2e',
 testMatch:'**/*.spec.cjs',
 timeout:60000,
 expect:{timeout:15000},
 fullyParallel:false,
 workers:1,
 reporter:'list',
 use:{
  baseURL:'http://127.0.0.1:8000',
  browserName:'chromium',
  headless:true,
  viewport:{width:1365,height:900},
  actionTimeout:15000
 },
 webServer:{
  command:'python3 -m http.server 8000 --directory ../game_v5',
  url:'http://127.0.0.1:8000/index.html',
  reuseExistingServer:!process.env.CI,
  timeout:60000
 }
});
