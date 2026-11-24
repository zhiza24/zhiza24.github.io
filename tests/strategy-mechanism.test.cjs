const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const window={};
const context={window};
vm.createContext(context);
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../game_v5/strategy.js'),'utf8'),context);
const S=window.GStrategy;
assert.ok(S&&typeof S.testsLayer==='function'&&typeof S.practRec==='function');
const result={
 total:60,answered:48,
 families:[
  {id:'curiosity',kind:'resource',name:'Интерес и движение',answered:4,score:10,max:12},
  {id:'support',kind:'resource',name:'Внутренняя опора',answered:4,score:9,max:12},
  {id:'anticipation',kind:'protective',name:'Предвосхищение сложностей',answered:4,score:10,max:12}
 ],
 episodes:{event:'Сложный разговор',external:'Были реальные ограничения и давление'}
};
const P={innerMechanism:{result}};
const layer=S.testsLayer(P,false);
assert.ok(layer.res.some(x=>x.t==='Ресурс внутреннего механизма · Интерес и движение'));
assert.ok(layer.obst.some(x=>x.t==='Что стоит проверить · Предвосхищение сложностей'));
const protective=layer.obst.find(x=>x.t.indexOf('Предвосхищение сложностей')>=0);
assert.ok(protective.x.includes('не объяснение причин'));
assert.ok(protective.x.includes('отмечены внешние обстоятельства'));
const practices=S.practRec(P);
assert.ok(practices.some(x=>x.id==='create'),'resource signal should inform an optional supportive practice');
assert.ok(!practices.some(x=>x.id==='risk'),'protective signal alone must not trigger a corrective practice');
assert.ok(practices.length<=2,'strategy must keep the practice load limited');

// Thin evidence is not promoted into a strategy signal.
const thin={innerMechanism:{result:{total:60,answered:12,families:[
 {id:'curiosity',kind:'resource',name:'Интерес и движение',answered:2,score:6,max:6},
 {id:'anticipation',kind:'protective',name:'Предвосхищение сложностей',answered:2,score:6,max:6}
],episodes:{}}}};
const thinLayer=S.testsLayer(thin,false);
assert.ok(!thinLayer.res.some(x=>x.t.indexOf('внутреннего механизма')>=0));
assert.ok(!thinLayer.obst.some(x=>x.t.indexOf('Предвосхищение сложностей')>=0));
assert.equal(S.practRec(thin).length,0);
console.log('PASS: inner-mechanism resource and protective signals enter strategy separately; only resource signals may suggest an optional practice.');
