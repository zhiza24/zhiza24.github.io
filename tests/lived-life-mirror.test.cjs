const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const source=fs.readFileSync(path.join(__dirname,'../game_v5/track28.js'),'utf8');
const now=Date.now();
const T={
 start:now-28*86400000,cycle:1,space:'mirror',view:'mirror',strategySeen:true,
 days:{},events24:{
  1:[
   {id:'overnight-work',title:'Работа ночью',startMin:1380,endMin:1500,sphere:'work',motive:'own',emotion:'interest',focus:'self',planned:'yes',completion:'done',after:'better',alternative:'Завершить раньше'},
   {id:'overlap-rest',title:'Пауза',startMin:1410,endMin:1470,sphere:'rest',motive:'restore',emotion:'calm',focus:'self',planned:'no',completion:'partial',after:'same',alternative:'Сохранить паузу'}
  ],
  2:[{id:'morning-health',title:'Прогулка',startMin:540,endMin:600,sphere:'health',motive:'restore',emotion:'calm',focus:'self',planned:'no',completion:'done',after:'better'}]
 },
 checkpoints24:{1:[{id:'cp1',minute:900,mood:8,energy:7}],2:[{id:'cp2',minute:600,mood:6,energy:5}]},
 mirror:{version:1,phase:'report',endWheel:Array(8).fill(6),endResearch:Array(24).fill(3),initialWheel:Array(8).fill(4),initialResearch:Array(8).fill(5),completedAt:now,reflection:{}}
};
const profile={tracker:T,cycleBaseline:{wheel:Array(8).fill(4),research:Array(8).fill(5)},wheelTest:{averages:Array(8).fill(5)}};
const dom=new JSDOM('<!doctype html><html><body><div id="t28"></div></body></html>',{url:'https://game.test/reactor.html',runScripts:'outside-only'});
dom.window.localStorage.setItem('alch_v5_profile',JSON.stringify(profile));
dom.window.eval(source);
const api=dom.window.GTrack28;
assert.ok(api&&typeof api.mirrorActivityStats==='function','mirror stats API should be available for regression checks');
const stats=api.mirrorActivityStats(T);
assert.equal(stats.events,3,'overnight event is counted once');
assert.equal(stats.days,2,'overnight continuation appears on the next day');
assert.equal(stats.total,120,'only non-overlapping minutes are counted');
assert.equal(stats.overlap,60,'overlapping minutes are reported separately');
assert.equal(stats.bySphere.work,60);
assert.equal(stats.bySphere.health,60);
assert.equal(stats.bySphere.rest,0,'overlapped rest minutes are not double-counted');
assert.equal(stats.byMotive.own,60);
assert.equal(stats.byMotive.restore,60,'only non-overlapped walk minutes count toward unique time');
assert.equal(stats.checkpoints,2);
assert.equal(stats.moodAvg,7);
assert.equal(stats.energyAvg,6);
assert.deepEqual(Array.from(stats.alternatives),['Завершить раньше','Сохранить паузу']);
const html=dom.window.document.getElementById('t28').innerHTML;
assert.ok(html.includes('Пять разных взглядов на одну жизнь'),'report should render the five views');
assert.ok(html.includes('Пересекающееся время'),'report should disclose overlap');
assert.ok(html.includes('не означает ошибку или самообман'),'report should avoid judgmental interpretation');
assert.ok(html.includes('Что я хочу изменить или исследовать дальше?'),'report should include user reflection');
let cursor='reactor';
const routeCalls=[];
dom.window.GRoute={
 status(url){
  if(url==='reactor.html')return cursor==='reactor'?'current':'done';
  if(url==='slot.html?id=retest')return cursor==='reactor'?'locked':cursor==='retest'?'current':'done';
  if(url==='slot.html?id=compare')return cursor==='compare'?'current':cursor==='end'?'done':'locked';
  return 'resource';
 },
 complete(url){
  routeCalls.push(url);
  if(url==='reactor.html'&&cursor==='reactor'){cursor='retest';return true}
  if(url==='slot.html?id=retest'&&cursor==='retest'){cursor='compare';return true}
  return false;
 }
};
const blocked=api.continueMirror(profile,T);
assert.equal(blocked.ok,false,'mirror must not skip the Reactor final checkpoint');
assert.equal(blocked.reason,'cycle-finale');
assert.equal(cursor,'reactor');
T.finale={done:true};
const handoff=api.continueMirror(profile,T);
assert.equal(handoff.ok,true,'completed cycle may proceed to comparison');
assert.equal(handoff.url,'slot.html?id=compare');
assert.equal(cursor,'compare');
assert.deepEqual(routeCalls,['reactor.html','slot.html?id=retest'],'route handoff completes Reactor and prefilled retest in order');
console.log('PASS: lived-life mirror handles overnight events, overlap, unique-time analytics, checkpoints and report rendering and route-gated final handoff.');
dom.window.close();
