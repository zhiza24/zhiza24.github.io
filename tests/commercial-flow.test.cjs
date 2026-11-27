'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.resolve(__dirname,'../game_commercial');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

function routeEnv(){
 const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://game.test/map.html',runScripts:'outside-only'});
 const w=dom.window;
 w.GPassport={parse:()=>({valid:true})};
 w.gIdx=function(){
  const file=w.location.pathname.split('/').pop()||'index.html',q=new URLSearchParams(w.location.search);
  const u=file==='slot.html'?file+'?id='+(q.get('id')||''):file==='scene.html'?file+'?k='+(q.get('k')||''):file==='breath.html'?file+'?at='+(q.get('at')||''):file;
  return w.GFLOW.findIndex(x=>x.u===u);
 };
 w.eval(read('flow.js'));
 w.eval(read('route.js'));
 return {dom,w};
}
{
 const {dom,w}=routeEnv(),steps=w.GFLOW;
 assert.equal(steps.length,35,'commercial path must contain 35 steps');
 assert.equal(w.GRoute.state().url,'form.html','fresh profile starts at the initiation form');
 let p={
  name:'Проверка',birth:'10.02.2000',gender:'f',points:{personality:1},
  mapStyle:'amber',pocherk:{doneAt:1},dialog:{answers:[]},
  backgroundProfile:{backgroundState:{version:2,completedAt:1}},
  ego:{v:2},betray:{done:true},im:{v:3},dq:{accepted:80},
  portrait:{done:true},wheel:[5,5,5,5,5,5,5,5],valuesStage:'done',
  valuesCore:{v:1,top3:['Свобода','Смысл','Развитие']},
  fractal:{evidence:[{sphere:'money'}],lever:{status:'chosen'}},
  lab:{sort:['yes','part','no','unknown','yes','part'],newRule:'Новая формулировка'},
  desireLab:{v:1,desire:'Свое дело'},
  tracker:{declared:{text:'Главное желание'},directions:[{id:'a',text:'Первое'},{id:'b',text:'Второе'}],finale:{done:true}},
  archD:{v:1,top:'Выбор состояния'},pathPlan:{done:true},retest:{wheel:[6,6,6,6,6,6,6,6]},
  flow:{version:2,current:'form.html',completed:{},visited:{}}
 };
 const readiness={
  'form.html':true,'choose.html':true,'bridge.html':true,'slot.html?id=dialog':true,
  'slot.html?id=bg16':true,'ego.html':true,'betray.html':true,'slot.html?id=im':true,
  'swipe.html':true,'fin.html':true,'wheel8.html':true,'values.html':true,
  'slot.html?id=vsort':true,'slot.html?id=evidence':true,'slot.html?id=sort':true,
  'slot.html?id=lab_d':true,'wish.html':true,'slot.html?id=leverage':true,
  'slot.html?id=arch_d':true,'slot.html?id=builder':true,'reactor.html':true,
  'slot.html?id=retest':true
 };
 w.GRoute.save(p);
 for(let i=1;i<steps.length;i++){
  const u=steps[i].u;
  p=w.GRoute.load();
  assert.equal(w.GRoute.state(p).url,u,'route cursor at step '+(i+1)+' '+u);
  assert.equal(w.GRoute.status(u,p),'current','current status '+u);
  if(readiness[u])assert.equal(w.GRoute.ready(u,p),true,'readiness contract '+u);
  if(i+1<steps.length)assert.equal(w.GRoute.status(steps[i+1].u,p),'locked','next step stays locked before completion: '+u);
  assert.equal(w.GRoute.complete(u,p),true,'completion succeeds '+u);
  p=w.GRoute.load();
  assert.ok(p.flow.completed[u],'completion timestamp persisted '+u);
  if(i+1<steps.length)assert.equal(p.flow.current,steps[i+1].u,'cursor advances exactly one step after '+u);
 }
 p=w.GRoute.load();
 assert.equal(w.GRoute.state(p).finished,true,'last route step closes the route');
 const emptyDay={sliders:{},signs:[],choose:[],grat:[],hours:{},dirSteps:['step text only','',''],dirState:['','',''],dirMarks:['','',''],wishMark:'',hintSeen:false,note:'',ifFire:['','',''],journal:{}};
 const activity={note:'сделал заметку'};
 const completion={dirState:['done','','']};
 const slider={sliders:{energy:6}};
 const counted=w.GTrackDay({tracker:{start:Date.now(),days:{1:emptyDay,2:activity,3:completion,4:slider}}});
 assert.equal(counted.filled,3,'opening a day without a record must not count as a completed journal day');
 assert.equal(counted.day,1,'cycle day count begins from the stored start timestamp');

 assert.equal(Object.keys(p.flow.completed).length,34,'all 34 playable steps persist completion');
 dom.window.close();
}
{
 const {dom,w}=routeEnv(),source=read('route.js');
 const keys=source.match(/const keys=\{([\s\S]*?)\};/);
 assert.ok(keys,'route snapshot field map exists');
 const names=[...keys[1].matchAll(/'([^']+)'\s*:/g)].map(m=>m[1]);
 assert.equal(new Set(names).size,names.length,'snapshot map must not declare duplicate route keys');
 const p={
  portrait:{done:true,id:'portrait'},arts:['mirror'],wheel:[1,2,3,4,5,6,7,8],
  values:{order:['Свобода']},egoSelf:{match:7},focuses:['one'],wheelTest:{completed:true},
  lab:{lead:'err',sort:['yes']},fractal:{evidence:[{id:1}],lever:{id:'lever'}},
  desireLab:{desire:'свое дело'},valuesCore:{top3:['Смысл']},reactorIn:{v:1},
  betray:{start:{a:1},end:{a:2}},retest:{wheel:[8]},pathFinal:{wish:'дом'},
  reactor:{day:28},tracker:{days:{1:{}}},cycleBaseline:{wheel:[1]},cycleHistory:[{cycle:1}],trackerHistory:[{cycle:1}]
 };
 const cases=[
  ['fin.html',['portrait','arts']],
  ['slot.html?id=pa_end',['wheel','values','egoSelf','focuses','arts']],
  ['slot.html?id=pb_end',['lab','fractal','desireLab','valuesCore','reactorIn']],
  ['slot.html?id=compare',['wheel','retest','betray']],
  ['slot.html?id=end',['pathFinal','reactor','retest','arts','cycleBaseline','cycleHistory','trackerHistory']]
 ];
 for(const [url,fields] of cases){
  const snap=w.GRoute.snapshot(url,p);
  for(const field of fields)assert.ok(Object.prototype.hasOwnProperty.call(snap.data,field),url+' snapshot must retain '+field);
 }
 dom.window.close();
}
{
 const dom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://game.test/game_commercial/map.html',runScripts:'outside-only'});
 const w=dom.window,storage=w.localStorage,session=w.sessionStorage;
 const nativeGet=w.Storage.prototype.getItem,nativeSet=w.Storage.prototype.setItem;
 nativeSet.call(storage,'alch_v5_profile','MAIN_PROFILE');
 nativeSet.call(storage,'alch_samost','MAIN_SAMOST');
 nativeSet.call(storage,'alch_pattern_map_v1','MAIN_PATTERN');
 nativeSet.call(session,'alch_v5_private','MAIN_SESSION');
 w.eval(read('flow.js'));
 assert.equal(storage.getItem('alch_v5_profile'),null,'commercial profile cannot read main profile');
 assert.equal(storage.getItem('alch_samost'),null,'commercial app cannot read main Self-thread store');
 assert.equal(storage.getItem('alch_pattern_map_v1'),null,'commercial app cannot read main pattern map');
 storage.setItem('alch_v5_profile','COMMERCIAL_PROFILE');
 storage.setItem('alch_samost','COMMERCIAL_SAMOST');
 storage.setItem('alch_pattern_map_v1','COMMERCIAL_PATTERN');
 assert.equal(nativeGet.call(storage,'alch_v5_profile'),'MAIN_PROFILE');
 assert.equal(nativeGet.call(storage,'alch_samost'),'MAIN_SAMOST');
 assert.equal(nativeGet.call(storage,'alch_pattern_map_v1'),'MAIN_PATTERN');
 assert.equal(nativeGet.call(storage,'alch_commercial_profile'),'COMMERCIAL_PROFILE');
 assert.equal(nativeGet.call(storage,'alch_commercial_samost'),'COMMERCIAL_SAMOST');
 assert.equal(nativeGet.call(storage,'alch_commercial_pattern_map_v1'),'COMMERCIAL_PATTERN');
 w.eval(read('profile-layer.js'));
 class FakeFileReader{readAsText(file){this.result=file.content;this.onload()}}
 w.FileReader=FakeFileReader;
 w.eval(read('engine.js'));
 w.GPro.save({name:'Commercial profile',schemaVersion:3});
 const backups=JSON.parse(storage.getItem('alch_v5_profile_backups'));
 const snap=JSON.parse(backups[0].raw);
 assert.equal(snap.local.alch_samost,'COMMERCIAL_SAMOST','backup exports commercial Self-thread data');
 assert.equal(snap.local.alch_pattern_map_v1,'COMMERCIAL_PATTERN','backup exports commercial pattern-map data');
 const incoming={format:'put-alhimika-backup',version:2,profile:{name:'Imported commercial',schemaVersion:3},local:{alch_samost:'RESTORED_SAMOST',alch_pattern_map_v1:'RESTORED_PATTERN'}};
 let imported=false;
 w.GPro.importFile({size:JSON.stringify(incoming).length,content:JSON.stringify(incoming)},ok=>{imported=ok});
 assert.equal(imported,true,'commercial backup imports');
 assert.equal(storage.getItem('alch_samost'),'RESTORED_SAMOST');
 assert.equal(storage.getItem('alch_pattern_map_v1'),'RESTORED_PATTERN');
 assert.equal(nativeGet.call(storage,'alch_samost'),'MAIN_SAMOST','import never overwrites main game data');
 assert.equal(nativeGet.call(storage,'alch_pattern_map_v1'),'MAIN_PATTERN');
 assert.equal(w.GPro.deleteAll(),true,'delete-all succeeds');
 assert.equal(storage.getItem('alch_v5_profile'),null);
 assert.equal(storage.getItem('alch_samost'),null);
 assert.equal(storage.getItem('alch_pattern_map_v1'),null);
 assert.equal(nativeGet.call(storage,'alch_v5_profile'),'MAIN_PROFILE','delete-all preserves main profile');
 assert.equal(nativeGet.call(storage,'alch_samost'),'MAIN_SAMOST','delete-all preserves main Self-thread data');
 assert.equal(nativeGet.call(storage,'alch_pattern_map_v1'),'MAIN_PATTERN','delete-all preserves main pattern map');
 assert.equal(nativeGet.call(session,'alch_v5_private'),'MAIN_SESSION','delete-all preserves main session data');
 const quotaDom=new JSDOM('<!doctype html><html><head></head><body></body></html>',{url:'https://quota.test/game_commercial/map.html',runScripts:'outside-only'});
 const qw=quotaDom.window;
 const rawSet=qw.Storage.prototype.setItem;
 qw.Storage.prototype.setItem=function(key,value){
  if(key==='alch_commercial_profile'){const err=new Error('storage full');err.name='QuotaExceededError';throw err}
  return rawSet.call(this,key,value);
 };
 qw.eval(read('flow.js'));
 qw.eval(read('profile-layer.js'));
 qw.alert=()=>{quotaWarnings++};
 qw.eval(read('engine.js'));
 let quotaWarnings=0;
 assert.throws(()=>qw.GProfile.save({name:'Should not pretend to save'}),'quota failure must propagate to the caller');
 assert.equal(quotaWarnings,1,'quota failure must be visible to the player');
 quotaDom.window.close();
 dom.window.close();
}
console.log('PASS: commercial route progression, reload persistence, snapshot provenance, and isolated backup/import/delete.');
