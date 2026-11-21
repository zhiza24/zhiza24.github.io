global.window={};
require(__dirname+'/../game_v5/inner-mirror-data.js');
require(__dirname+'/../game_v5/background-state-engine.js');
const assert=require('node:assert/strict');
const D=window.GIMD,E=window.GBackgroundState;
function chooseFor(family){
 const answers={};
 D.Q.forEach(q=>{
  let best=-1,bestWeight=0;
  q[3].forEach((o,i)=>{const w=E.parseTags(o[1]).families[family]||0;if(w>bestWeight){bestWeight=w;best=i}});
  if(best>=0)answers[q[0]]=best;
 });
 return answers;
}
function afterFor(family){
 const out={};
 D.AFTER_AT.forEach(id=>{
  const i=D.AFTER.findIndex(o=>(E.parseTags(o[1]).families[family]||0)>0);
  if(i>=0)out[id]=i;
 });
 return out;
}
assert.equal(D.Q.length,24,'ожидается 24 ситуационных вопроса');
assert.equal(D.AFTER_AT.length,8,'ожидается 8 эмоциональных итогов');
assert.equal(Object.keys(D.FAM).length,8,'ожидается 8 семейств');
const split=E.parseTags('S5/S8 A3/A4 A6');
assert.equal(split.families.S5,.5);
assert.equal(split.families.S8,.5);
assert.equal(split.adaptations.A3,.5);
assert.equal(split.adaptations.A4,.5);
assert.equal(split.resources.A6,1);
for(const id of Object.keys(D.FAM)){
 const result=E.calculate(chooseFor(id),{});
 assert.ok(result.families.find(x=>x.id===id).situationCount>0,'семейство '+id+' должно иметь ситуационные сигналы');
}
const fullAnswers={};D.Q.forEach((q,i)=>fullAnswers[q[0]]=i%q[3].length);
const fullAfter={};D.AFTER_AT.forEach((id,i)=>fullAfter[id]=i%D.AFTER.length);
const full=E.calculate(fullAnswers,fullAfter);
assert.equal(full.coverage.answered,24);
assert.equal(full.coverage.aftertasteAnswered,8);
assert.equal(full.coverage.chapters,4);
const withoutAfter=E.calculate(fullAnswers,{});
full.families.forEach(f=>{
 const other=withoutAfter.families.find(x=>x.id===f.id);
 assert.equal(f.situationCount,other.situationCount,'послевкусие не меняет ситуационные ответы');
 assert.equal(f.weight,other.weight,'послевкусие не меняет ситуационный вес');
});
const partial=E.calculate(Object.fromEntries(D.Q.slice(0,8).map((q,i)=>[q[0],0])),{});
assert.equal(partial.coverage.answered,8);
assert.equal(partial.coverage.chapters,2);
assert.equal(partial.status,'preliminary');
assert.ok(!Object.prototype.hasOwnProperty.call(full,'kind'),'движок не присваивает общий тип личности');
console.log('PASS: 24 ситуации, 8 эмоциональных итогов, 8 семейств, раздельный расчет послевкусия, частичный набор и пропуски.');
