const test = require('node:test');
const assert = require('node:assert/strict');
const GP = require('../goal-path-engine.js');

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
  assert.equal(GP.styleFor(P,'reflective').id,'structured'); // invalid override falls back to nature/default
  assert.equal(GP.styleFor(P,'observer').id,'reflective');
});
test('scaffold turns one wish into four editable weekly stages and a WOOP plan', () => {
  const plan=GP.scaffold({id:'w1',text:'Открыть свое дело'},{level:'foundation',missing:['опыт']},GP.styleFor({nature:{primary:'architect'}}),{outcome:'Свой проект',obstacle:'Не знаю, с чего начать',ifThen:'Если растеряюсь, то изучу один пример'});
  assert.equal(plan.weeks.length,4);
  assert.match(plan.weeks[0].title,/основу/i);
  assert.equal(plan.woop.obstacle,'Не знаю, с чего начать');
  assert.equal(plan.woop.plan,'Если растеряюсь, то изучу один пример');
});
test('cycle day is anchored to calendar dates, including daylight-saving transitions', () => {
  const T={start:new Date(2026,2,28,15).getTime(),goalPath:{cycleStartAt:new Date(2026,2,28,15).getTime()}};
  assert.equal(GP.calendarDay(T,new Date(2026,2,29,8).getTime()),2);
  assert.equal(GP.calendarDay(T,new Date(2026,3,1,8).getTime()),4);
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
