const test = require('node:test');
const assert = require('node:assert/strict');
process.env.TZ = 'Europe/Amsterdam';
const GP = require('../game_v5/goal-path-engine.js');

test('wheel urgency is surfaced as context, not as a verdict about the wish', () => {
  const P={wheel:[3,7,6,6,6,6,6,6],wheelTest:{spheres:[{name:'Здоровье',improvements:[{change:'yes',urgency:'now'}]}]}};
  const s=GP.wheelSignals(P,{cid:'health',text:'Больше энергии'});
  assert.equal(s.length,1);
  assert.equal(s[0].urgent,true);
  assert.equal(s[0].needsChange,true);
});
test('readiness distinguishes time, skill gaps and missing foundations', () => {
  assert.equal(GP.assessReadiness({level:'time'}).level,'time');
  assert.equal(GP.assessReadiness({level:'gaps',missing:['навык']}).missing[0],'навык');
  assert.equal(GP.assessReadiness({level:'foundation'}).level,'foundation');
});
test('psychotype changes the suggested working style without changing the goal', () => {
  const P={nature:{primary:'initiator'}};
  assert.equal(GP.styleFor(P).id,'action_first');
  assert.equal(GP.styleFor(P,'reflective').id,'reflective');
  assert.equal(GP.styleFor(P,'observer').id,'reflective');
});
test('scaffold turns one wish into four editable weekly stages and a WOOP plan', () => {
  const plan=GP.scaffold({id:'w1',text:'Открыть свое дело'},{level:'foundation',missing:['опыт']},GP.styleFor({nature:{primary:'architect'}}),{outcome:'Свой проект',obstacle:'Не знаю, с чего начать',ifThen:'Если растеряюсь, то изучу один пример'});
  assert.equal(plan.weeks.length,4);
  assert.match(plan.weeks[0].title,/опору/i);
  assert.equal(plan.woop.obstacle,'Не знаю, с чего начать');
  assert.equal(plan.woop.plan,'Если растеряюсь, то изучу один пример');
});
test('cycle day is anchored to calendar dates, including daylight-saving transitions', () => {
  const T={start:new Date(2026,2,28,15).getTime(),goalPath:{cycleStartAt:new Date(2026,2,28,15).getTime()}};
  assert.equal(GP.calendarDay(T,new Date(2026,2,29,8).getTime()),2);
  assert.equal(GP.calendarDay(T,new Date(2026,3,1,8).getTime()),5);
});
test('snapshots are immutable after a goal replacement', () => {
  const T={start:Date.UTC(2026,11,1),goalPath:{cycleStartAt:Date.UTC(2026,11,1),goals:{a:{id:'a',text:'A',status:'active'},b:{id:'b',text:'B',status:'paused'}},activeIds:['a'],days:{},history:[]}};
  const first=GP.snapshotDay(T,1,Date.UTC(2026,11,1));
  assert.equal(first.created,true);
  const changed=GP.replaceActiveGoal(T,0,{id:'b',text:'B'},Date.UTC(2026,11,2),'стало неактуально');
  assert.equal(changed.ok,true);
  assert.equal(changed.day,2);
  assert.equal(T.goalPath.days['1'].active[0].id,'a');
  assert.equal(T.goalPath.days['2'],undefined);
  assert.equal(T.start,Date.UTC(2026,11,1));
  assert.equal(GP.snapshotDay(T,1,Date.UTC(2026,11,2)).created,false);
});
test('replacement does not silently reassign another active slot', () => {
  const T={start:Date.UTC(2026,11,1),goalPath:{cycleStartAt:Date.UTC(2026,11,1),goals:{a:{id:'a',text:'A'},b:{id:'b',text:'B'}},activeIds:['a','b'],history:[]}};
  const r=GP.replaceActiveGoal(T,0,{id:'b',text:'B'},Date.UTC(2026,11,4));
  assert.equal(r.ok,false);
});
test('status changes preserve history and do not reset the cycle', () => {
  const start=Date.UTC(2026,11,1),T={start:start,goalPath:{cycleStartAt:start,goals:{a:{id:'a',text:'A',status:'active'}},activeIds:['a'],history:[]}};
  assert.equal(GP.setGoalStatus(T,'a','deferred',Date.UTC(2026,11,5)).ok,true);
  assert.equal(T.goalPath.history.length,1);
  assert.equal(T.goalPath.activeIds.length,0);
  assert.equal(T.start,start);
});

test('existing Reactor strategy is exposed as reusable context', () => {
  const P={tracker:{strategy:{focus:[{t:'Собственная инициатива',g:'Начать с малого'}],days:[{m:'Сделать первый шаг',n:'Открыть заметку'}],weeks:[{t:'Начать',d:'Проверить'}],practRec:[{id:'chooseme',why:'Поддержать свой выбор'}]}}};
  const c=GP.contextFor(P,{id:'w1',text:'Мое желание'});
  assert.equal(c.strategyAvailable,true);
  assert.equal(c.strategy.focus[0].title,'Собственная инициатива');
  assert.equal(c.strategy.first.action,'Сделать первый шаг');
  assert.equal(c.strategy.practices[0].id,'chooseme');
});

test('string directions get the same ids as track28 dirs()', () => {
  const T={start:Date.UTC(2026,11,1),directions:['Бегать','Читать','Спать']};
  const r=GP.syncDirections(T,Date.UTC(2026,11,1));
  assert.deepEqual(r.activeIds,['Бегать','Читать','Спать']);
});
test('re-picking directions in the wish sky keeps old goals, plans and history', () => {
  const T={start:Date.UTC(2026,11,1),directions:[{id:'w1',text:'A',cid:'health'},{id:'w2',text:'B'},{id:'w3',text:'C'}]};
  GP.syncDirections(T,Date.UTC(2026,11,1));
  GP.attachPlan(T,'w2',{woop:{obstacle:'устал',plan:'сделаю 5 минут'}});
  GP.snapshotDay(T,1,Date.UTC(2026,11,1));
  T.directions=[{id:'w1',text:'A'},{id:'w9',text:'D'},{id:'w3',text:'C'}];
  const r=GP.syncDirections(T,Date.UTC(2026,11,3,12));
  assert.equal(r.changed,true);
  assert.deepEqual(T.goalPath.activeIds,['w1','w9','w3']);
  assert.equal(T.goalPath.goals.w2.status,'paused');
  assert.equal(GP.planFor(T,'w2').woop.plan,'сделаю 5 минут');
  assert.equal(T.goalPath.days['1'].active[1].id,'w2');
  assert.equal(T.goalPath.history.slice(-1)[0].from,'w2');
  assert.equal(T.start,Date.UTC(2026,11,1));
  assert.equal(GP.syncDirections(T).changed,false);
});
test('attachPlan merges fields instead of wiping earlier answers', () => {
  const T={start:1,directions:[{id:'a',text:'A'}]};GP.syncDirections(T);
  GP.attachPlan(T,'a',{readiness:'time'});GP.attachPlan(T,'a',{woop:{obstacle:'x',plan:'y'}});
  assert.equal(GP.planFor(T,'a').readiness,'time');
  assert.equal(GP.planFor(T,'a').woop.plan,'y');
});
test('cycleDay matches the tracker day numbering, calendarDay counts local dates', () => {
  const start=new Date(2026,10,1,23,0).getTime(),T={start:start};
  const next=new Date(2026,10,2,8,0).getTime();
  assert.equal(GP.cycleDay(T,next),Math.max(1,Math.min(28,Math.floor((next-start)/86400000)+1)));
  assert.equal(GP.calendarDay(T,next),2);
  assert.equal(GP.cycleDay(T,start+40*86400000),28);
});
test('a new tracker cycle archives snapshots but keeps goals and history', () => {
  const T={start:Date.UTC(2026,11,1),directions:[{id:'a',text:'A'}]};
  GP.syncDirections(T);GP.snapshotDay(T,1,Date.UTC(2026,11,1));
  T.start=Date.UTC(2027,0,5);
  const G=GP.ensureState(T);
  assert.equal(G.cycleStartAt,Date.UTC(2027,0,5));
  assert.equal(Object.keys(G.days).length,0);
  assert.equal(G.cycles.length,1);
  assert.ok(G.goals.a);
});
test('if-then is chosen from ready options and stays countable', () => {
  const T={start:1,directions:[{id:'a',text:'A'}]};GP.syncDirections(T);
  assert.equal(GP.setIfThen(T,'a','tired','five').ok,true);
  assert.equal(GP.planFor(T,'a').woop.response,'five');
  assert.equal(GP.planFor(T,'a').woop.plan,'Если не будет сил, я сделаю пять минут и остановлюсь.');
  GP.setIfThen(T,'a','time','five');
  assert.equal(GP.planFor(T,'a').woop.response,'');
  GP.setIfThen(T,'a','bogus','x');
  assert.equal(GP.planFor(T,'a').woop.obstacle,'');
  assert.equal(GP.setReadiness(T,'a','time'),true);
  assert.equal(GP.planFor(T,'a').readiness,'time');
  assert.ok(GP.ifThenOptions('other').responses.length>=3);
});
