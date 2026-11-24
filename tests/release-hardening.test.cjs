const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'../game_v5');

{
 const source=fs.readFileSync(path.join(root,'values-atlas.js'),'utf8');
 assert.ok(!/\balert\s*\(/.test(source),'values atlas validation must not use blocking browser alerts');
 const dom=new JSDOM('<!doctype html><html><body><span id="ph"></span><h1 id="t"></h1><p id="d"></p><section id="card"></section></body></html>',{url:'https://game.test/values.html',runScripts:'outside-only'});
 let alertCalled=false;
 dom.window.alert=()=>{alertCalled=true};
 dom.window.eval(source);
 const card=dom.window.document.getElementById('card');
 const next=()=>Array.from(card.querySelectorAll('button')).find(b=>b.textContent==='Перейти к ситуациям');
 next().click();
 let validation=card.querySelector('[role="status"]');
 assert.ok(validation&&!validation.hidden,'missing selections should show an inline message');
 assert.match(validation.textContent,/от 5 до 8/);
 assert.equal(alertCalled,false,'validation must not interrupt the page');
 const choices=['Свобода','Близость','Безопасность','Признание','Развитие','Справедливость','Забота','Живость','Смысл'];
 for(const label of choices){
  const b=Array.from(card.querySelectorAll('.grid button')).find(x=>x.textContent===label);
  b.click();
 }
 assert.equal(card.querySelectorAll('.grid button.on').length,8,'the interface must enforce the maximum of eight selections');
 next().click();
 assert.match(dom.window.document.getElementById('ph').textContent,/2 из 6/,'valid selection should proceed to the next layer');
 dom.window.close();
}

{
 const dom=new JSDOM('<!doctype html><html><body></body></html>',{url:'https://game.test/slot.html?id=km',runScripts:'outside-only'});
 dom.window.eval(fs.readFileSync(path.join(root,'tests-data.js'),'utf8'));
 dom.window.eval(fs.readFileSync(path.join(root,'tests.js'),'utf8'));
 const scales=dom.window.GTESTS.km.scales;
 const unknown={};
 scales.forEach(s=>s.items.forEach(it=>unknown[it.id]='dk'));
 const empty=dom.window.GTests.BUILD.km(unknown).res;
 assert.equal(empty.answeredCount,0,'unknown answers must not count as answered');
 assert.equal(empty.status,'insufficient','unknown answers alone must not create a result');
 empty.scales.forEach(s=>{assert.equal(s.answered,0);assert.equal(s.score,null)});
 const partial={};
 scales.forEach(s=>s.items.forEach((it,i)=>partial[it.id]=i===3?'dk':2));
 const result=dom.window.GTests.BUILD.km(partial).res;
 assert.equal(result.answeredCount,18,'only the 18 actual answers count toward coverage');
 result.scales.forEach(s=>{assert.equal(s.answered,3);assert.equal(s.status,'preliminary');assert.notEqual(s.score,null)});
 assert.equal(result.scoringVersion,2);
 dom.window.close();
}
const slot=fs.readFileSync(path.join(root,'slot.html'),'utf8');
const arch=fs.readFileSync(path.join(root,'arch.js'),'utf8');
const tests=fs.readFileSync(path.join(root,'tests.js'),'utf8');
assert.ok(slot.includes("var words=('«'+oldRule+'»').split(' '),lines=[],line='';"),'old rule must be wrapped as a whole string before splitting');
assert.ok(arch.includes("bs[bc[0]]=Math.max(0,bs[bc[0]]-2)"),'disconfirmation must not create negative intermediate scores');
assert.ok(!tests.includes("L.length>1?'Заметнее всего здесь':'Заметнее всего здесь'"),'remove identical ternary branches');
console.log('PASS: inline values-atlas validation, eight-item selection limit, KM unknown scoring, eraser text wrapping, and non-negative disconfirmation.');
