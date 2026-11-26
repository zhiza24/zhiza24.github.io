/* Исполняемые проверки из матрицы GAME_INTEGRATION_TEST_MATRIX (то, что проверяется без браузера) */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const GP=require('../game_v5/goal-path-engine.js');
const SRC=f=>fs.readFileSync(path.join(__dirname,'../game_v5',f),'utf8');
const DAY=86400000;
function readyFn(){const s=SRC('route.js');const a=s.indexOf('function ready(u,p){');let i=s.indexOf('{',a),d=0,j=i;for(;j<s.length;j++){if(s[j]==='{')d++;else if(s[j]==='}'){d--;if(!d)break}}
  return new Function('isVisualReview','mirrorReadonly','return '+s.slice(a,j+1))(()=>false,()=>false);}
const dirs=n=>[{id:'w1',text:'Один',cid:'health'},{id:'w2',text:'Два',cid:'health'},{id:'w3',text:'Три',cid:'health'},{id:'w4',text:'Четыре'}].slice(0,n);

test('GOAL-11: route, engine and UI agree on "up to three" directions', () => {
  const ready=readyFn();
  [0,1,2,3,4].forEach(n=>assert.equal(ready('wish.html',{tracker:{declared:{text:'X'},directions:dirs(n)}}),n>=1&&n<=3,'n='+n));
  for(const n of [1,2]){const T={start:1,directions:dirs(n)};const r=GP.syncDirections(T);assert.equal(r.activeIds.length,n)}
  const w=SRC('wish.js');assert.ok(!/pick\.length!==3|pick\.length===3\?''/.test(w),'wish.js still demands exactly three');
});
test('GOAL-02: three wishes in one sphere are allowed', () => {
  const T={start:1,directions:dirs(3)};assert.equal(GP.syncDirections(T).activeIds.length,3);
});
test('GOAL-06/07: missing psychotype falls back, override is presentation only', () => {
  assert.equal(GP.styleFor({}).source,'balanced_default');
  assert.equal(GP.styleFor({nature:{primary:'unknown'}}).natureKey,null);
  const a=GP.scaffold({id:'g',text:'X'},{level:'ready'},GP.styleFor({},'creative')),b=GP.scaffold({id:'g',text:'X'},{level:'ready'},GP.styleFor({},'structured'));
  assert.deepEqual(a.weeks.map(w=>w.title),b.weeks.map(w=>w.title));
  assert.notEqual(a.prompts.next,b.prompts.next);
});
test('GOAL-04/05: readiness changes the first stage, not the goal', () => {
  assert.match(GP.scaffold({text:'X'},{level:'foundation'}).weeks[0].title,/опору/);
  assert.match(GP.scaffold({text:'X'},{level:'time'}).weeks[0].title,/шаг/);
});
test('GOAL-10: duplicate active goal is rejected', () => {
  const T={start:1,directions:dirs(2)};GP.syncDirections(T);
  assert.equal(GP.replaceActiveGoal(T,0,{id:'w2',text:'Два'}).ok,false);
});
test('GOAL-12: central wish stays outside the directions', () => {
  const T={start:1,declared:{id:'big',text:'Большое'},directions:dirs(2)};GP.syncDirections(T);
  assert.ok(!T.goalPath.activeIds.includes('big'));
});
test('RX-03/RX-06/GOAL-08: replacing a wish on day 8 keeps calendar, snapshots, other slots and history', () => {
  const start=Date.UTC(2026,10,1,9);const T={start,directions:dirs(3)};GP.syncDirections(T,start);
  GP.snapshotDay(T,1,start);const snap1=JSON.stringify(T.goalPath.days['1']);
  const at=start+7*DAY+3600000;assert.equal(GP.cycleDay(T,at),8);
  T.directions=[dirs(3)[0],{id:'w9',text:'Новое'},dirs(3)[2]];GP.syncDirections(T,at);
  assert.equal(T.start,start);assert.equal(GP.cycleDay(T,at),8);
  assert.equal(JSON.stringify(T.goalPath.days['1']),snap1);
  assert.deepEqual(T.goalPath.activeIds,['w1','w9','w3']);
  assert.equal(T.goalPath.goals.w2.status,'paused');
  assert.ok(T.goalPath.history.some(h=>h.from==='w2'&&h.to==='w9'&&h.day===8));
});
test('RX-10: legacy slot data is migrated to goal ids and follows its goal', () => {
  const T={start:1,directions:dirs(3),goalSteps:{0:{goal:'Один',weeks:[{t:'Шаг А'},{},{},{}]},1:{goal:'Два',weeks:[{t:'Шаг Б',done:true},{},{},{}]}},directionPlans:{1:{minimum:'Мин Б'}},ifthens:['','если Б','']};
  GP.syncDirections(T);
  assert.equal(GP.planFor(T,'w2').legacySlot.goalSteps.weeks[0].t,'Шаг Б');
  assert.equal(T.goalSteps[1].weeks[0].t,'Шаг Б','originals stay in place');
  T.directions=[dirs(3)[0],{id:'w9',text:'Новое'},dirs(3)[2]];GP.syncDirections(T);
  assert.equal(T.goalSteps[1],undefined,'new goal does not inherit old steps');
  assert.equal(T.directionPlans[1],undefined);assert.equal(T.ifthens[1],'');
  assert.equal(GP.planFor(T,'w2').legacySlot.goalSteps.weeks[0].done,true);
  assert.equal(GP.planFor(T,'w2').legacySlot.directionPlan.minimum,'Мин Б');
  T.directions=dirs(3);GP.syncDirections(T);
  assert.equal(T.goalSteps[1].weeks[0].t,'Шаг Б','swap back restores');
  assert.equal(T.ifthens[1],'если Б');
  assert.equal(T.goalSteps[0].weeks[0].t,'Шаг А','other slots untouched');
});
test('RX-10: dropping from three to two directions keeps the third goal data', () => {
  const T={start:1,directions:dirs(3),goalSteps:{2:{goal:'Три',weeks:[{t:'Шаг В'},{},{},{}]}}};GP.syncDirections(T);
  T.directions=dirs(2);GP.syncDirections(T);
  assert.equal(T.goalSteps[2],undefined);assert.equal(GP.planFor(T,'w3').legacySlot.goalSteps.weeks[0].t,'Шаг В');
  assert.equal(T.goalPath.goals.w3.status,'paused');
});
test('DATA-03: daily snapshot is created once per day', () => {
  const T={start:1,directions:dirs(1)};GP.syncDirections(T);
  assert.equal(GP.snapshotDay(T,3).created,true);assert.equal(GP.snapshotDay(T,3).created,false);
});
test('RX-07/RX-08: goal data survives a JSON round trip (reload / export)', () => {
  const T={start:1,directions:dirs(2)};GP.syncDirections(T);GP.setIfThen(T,'w1','time','slot');
  const T2=JSON.parse(JSON.stringify(T));assert.equal(GP.syncDirections(T2).changed,false);
  assert.equal(GP.planFor(T2,'w1').woop.response,'slot');
});
test('SELF-01/02: daily question and daily Self scroll are wired in the tracker', () => {
  const s=SRC('track28.js');
  assert.ok(/GSelf\.dailyQuestion\(P\)/.test(s));
  assert.ok(/trackerVoiceDay/.test(s)&&/GSelf\.voice\('tracker'/.test(s));
});
test('IM-03/PRACT: strategy never auto-activates practices from protective signals', () => {
  const s=SRC('strategy.js');assert.ok(!/activate\(/.test(s));
});
test('RX-09: failed save is reported, not silent', () => {
  assert.ok(/_t28warn/.test(SRC('track28.js')));
});
test('copy: no letter yo in changed player files', () => {
  ['wish.js','track28.js','reactor-core.js','goal-path-engine.js','learning-data.js','learning-engine.js','self-thread.js'].forEach(f=>assert.ok(!/[ёЁ]/.test(SRC(f)),f));
});
