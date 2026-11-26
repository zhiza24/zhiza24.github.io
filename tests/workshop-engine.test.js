'use strict';
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const W=require('../game_v5/workshop-engine.js');
const add=(P,s,x={},day=1)=>W.addEntry(P,Object.assign({strategy:s},x),{day,at:1764000000000+day*864e5});
const all=JSON.stringify([W.strategies,W.options('delay'),W.options('rush'),W.options('steady'),W.options('limit')]);
function hyp(list,T){const P={};list.forEach((s,i)=>add(P,s,{},i+1));return {P,h:W.hypothesis(P,T||{})}}

test('PAT-15: меньше трех проверок — вывода нет, ничего не выдумываем',()=>{const P={};add(P,'delay');add(P,'rush');const h=W.hypothesis(P,{});assert.equal(h.ready,false);assert.equal(h.need,1)});
test('PAT-04: откладывание дает мягкую гипотезу с источником',()=>{const T={days:{1:{res:{v:'min'}},2:{res:{v:'fail'}}},marks24:{1:[{kind:'wish'}]}};const {h}=hyp(['delay','perfect','prep'],T);assert.equal(h.group,'under');assert.match(h.text,/^Похоже/);assert.match(h.why,/3 раз из 3/);assert.match(h.why,/минимумом или паузой 2/);assert.match(h.why,/не сделал/);assert.ok(h.plus.length>0)});
test('PAT-05: долгая подготовка — эксперимент с проверкой в деле',()=>{const ids=W.options('prep').experiments.map(x=>x.id);assert.ok(ids.includes('show')&&ids.includes('test'))});
test('PAT-06: спешка — гипотеза про проверку результата, без ярлыка',()=>{const {h}=hyp(['rush','rush','many']);assert.equal(h.group,'over');assert.match(h.text,/без проверки результата/);assert.doesNotMatch(all+h.text,/импульсив|тип личности|ленив/i);assert.ok(W.options('rush').experiments.some(x=>/признаку/.test(x.t)))});
test('PAT-07: ожидание и реальный отклик хранятся раздельно, «нет отклика» считается',()=>{const P={};add(P,'many',{expect:'progress',actual:'unknown'});add(P,'rush',{expect:'progress',actual:'unknown'});add(P,'switch',{actual:'same'});const e=P.strategyWorkshop.entries[0];assert.equal(e.expect,'progress');assert.equal(e.actual,'unknown');assert.equal(W.hypothesis(P,{}).noFeedback,2)});
test('PAT-08: итог эксперимента сохраняется, повтор заменяет прошлый',()=>{const P={};const r=add(P,'rush',{experiment:'sign'},1);assert.equal(W.openExperiment(P,3),null);assert.equal(W.openExperiment(P,6).id,r.entry.id);assert.ok(W.reviewExperiment(P,r.entry.id,'no'));assert.ok(W.reviewExperiment(P,r.entry.id,'part'));assert.equal(P.strategyWorkshop.reviews.length,1);assert.equal(W.openExperiment(P,9),null);assert.equal(W.reviewExperiment(P,'nope','helped'),false)});
test('PAT-09: много действий — действие не равно результату, усилие ценится',()=>{const {h}=hyp(['many','many','many'],{marks24:{1:[{kind:'act',init:'must',after:'worse'},{kind:'act',init:'self'}]}});assert.match(h.text,/много действий/);assert.match(h.plus,/ресурс/);assert.match(h.why,/дел 2, из них «надо» 1, после которых стало хуже 1/)});
test('PAT-10/11: гибкость и ровный темп — сильная сторона, без лишней коррекции',()=>{const {h}=hyp(['adjust','steady','adjust'],{days:{1:{res:{v:'done'}},2:{res:{v:'part'}},3:{res:{v:'fail'}}}});assert.equal(h.group,'strong');assert.match(h.plus,/сильная сторона/);assert.match(h.why,/2 из 3/);assert.deepEqual(W.options('adjust').experiments.map(x=>x.id),['keep','none'])});
test('PAT-12: внешние ограничения — практические шаги, не внутренний блок',()=>{const {h}=hyp(['limit','limit','delay']);assert.equal(h.group,'outer');assert.match(h.text,/обстоятельства/);assert.match(h.plus,/практические/);assert.ok(W.options('limit').experiments.some(x=>/ресурсу/.test(x.t)))});
test('PAT-13: равные сигналы — нет ведущей стратегии',()=>{const {h}=hyp(['delay','rush','steady','limit']);assert.equal(h.tie,true);assert.equal(h.group,null);assert.match(h.text,/нет одного способа/)});
test('PAT-16: несогласие сохраняется и учитывается',()=>{const {P}=hyp(['delay','delay','delay']);assert.ok(W.setFeedback(P,'under','no'));assert.equal(W.hypothesis(P,{}).feedback,'no');assert.equal(W.setFeedback(P,'under','maybe'),false);assert.equal(W.setFeedback(P,'xxx','yes'),false)});
test('PAT-18: у каждой стратегии есть мысли, проверка и эксперименты',()=>{W.strategies.forEach(s=>{const o=W.options(s.id);assert.ok(o.thoughts.length>=2,s.id);assert.ok(o.experiments.length>=2,s.id);assert.equal(o.experiments.at(-1).id,'none')})});
test('PAT-19/20: проверка мысли не навязывает позитив',()=>{const ids=W.options('delay').check.map(x=>x.id);assert.deepEqual(ids,['yes','part','no','unk']);assert.doesNotMatch(all,/все получится|просто нужно действовать|притягиваешь/i)});
test('PAT-21: пауза и «без эксперимента» допустимы, штрафов нет',()=>{const P={};const r=add(P,'steady',{experiment:'none'});assert.ok(r.ok);assert.equal(W.openExperiment(P,20),null);assert.doesNotMatch(JSON.stringify(P),/penalty|streak|"xp"/i)});
test('PAT-22: прогноз и факт сравниваются, факт может остаться непроверенным',()=>{const P={};const r=add(P,'perfect',{expect:'fail',actual:'more',thought:'ideal',check:'no',experiment:'rough'});assert.deepEqual([r.entry.expect,r.entry.actual,r.entry.thought,r.entry.check,r.entry.experiment],['fail','more','ideal','no','rough'])});
test('PAT-23: запись связана с целью по id и не трогает календарь',()=>{const T={start:5,days:{1:{res:{v:'done'}}}};const before=JSON.stringify(T);const P={tracker:T};W.addEntry(P,{strategy:'delay'},{goalId:'g_abc',day:4});assert.equal(P.strategyWorkshop.entries[0].goalId,'g_abc');assert.equal(JSON.stringify(P.tracker),before)});
test('PAT-25: свободный текст не читается',()=>{const a=W.trackerSignals({marks24:{1:[{kind:'act',text:'не сделал откладываю спешу'}]},days:{1:{note:'провал',res:{v:'done'}}}});const b=W.trackerSignals({marks24:{1:[{kind:'act'}]},days:{1:{res:{v:'done'}}}});assert.deepEqual(a,b)});
test('Готовые варианты: чужие значения отбрасываются',()=>{const P={};assert.equal(W.addEntry(P,{strategy:'hack'}).ok,false);const r=W.addEntry(P,{strategy:'delay',expect:'<b>',thought:'more',experiment:'sign'});assert.equal(r.entry.expect,null);assert.equal(r.entry.thought,null);assert.equal(r.entry.experiment,null)});
test('Тексты без ё и с формами {м|ж}',()=>{assert.doesNotMatch(all+fs.readFileSync(path.join(__dirname,'../game_v5/workshop-engine.js'),'utf8'),/[ёЁ]/);assert.match(all,/\{\|а\}/)});
test('PAT-24: экспорт/импорт и удаление включают данные мастерской',()=>{
 const store=Object.create(null);const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]},key:i=>Object.keys(store)[i]||null,get length(){return Object.keys(store).length}};
 class FR{readAsText(f){this.result=f.content;this.onload()}}
 const ctx={window:{},localStorage:ls,sessionStorage:ls,FileReader:FR,Date,Math,JSON,isFinite};vm.createContext(ctx);
 vm.runInContext(fs.readFileSync(path.join(__dirname,'../game_v5/engine.js'),'utf8'),ctx);
 const P={name:'x'};add(P,'rush',{experiment:'sign'});
 const payload=JSON.stringify({format:'put-alhimika-backup',version:2,profile:P,local:{}});let ok=null;
 ctx.window.GPro.importFile({size:payload.length,content:payload},r=>{ok=r});assert.equal(ok,true);
 assert.equal(JSON.parse(store.alch_v5_profile).strategyWorkshop.entries[0].strategy,'rush');
 assert.ok(ctx.window.GPro.deleteAll());assert.equal(store.alch_v5_profile,undefined);
});
const all2=JSON.stringify([W.strategies,W.safety].concat(W.strategies.map(s=>W.options(s.id))));
test('REL-11: нет ролевых ярлыков в текстах и данных',()=>{assert.doesNotMatch(all2+fs.readFileSync(path.join(__dirname,'../game_v5/workshop-engine.js'),'utf8'),/жертв|агрессор|преследовател|спасател|victim|aggressor|rescuer/i)});
test('REL-02/09: трудность с просьбой — эксперимент сравнивает прогноз и ответ',()=>{const P={};const r=add(P,'noask',{expect:'fail',actual:'more',thought:'refuse',check:'no',experiment:'ask'});assert.equal(r.entry.group,'people');assert.equal(r.entry.thought,'refuse');assert.equal(r.entry.experiment,'ask')});
test('REL-03: ясная договоренность — сильная сторона, не давление',()=>{assert.equal(W.strategies.find(s=>s.id==='agree').g,'strong');assert.equal(W.strategies.find(s=>s.id==='press').g,'people')});
test('REL-04/05: давление рядом — безопасность, без упрека и без «попробуй иначе»',()=>{const s=W.strategies.find(s=>s.id==='unsafe');assert.equal(s.g,'outer');assert.match(W.safety,/безопасность/);assert.deepEqual(W.options('unsafe').experiments.map(x=>x.id),['support','none'])});
test('REL-06/07: разные способы с людьми не сводятся к одному',()=>{const {h}=hyp(['yield','agree','delay']);assert.equal(h.tie,true);const h2=hyp(['yield','noask','press']).h;assert.equal(h2.group,'people');assert.match(h2.plus,/не про характер/)});
test('REL-10: несогласие с выводом про людей сохраняется',()=>{const {P}=hyp(['yield','yield','noask']);assert.ok(W.setFeedback(P,'people','no'));assert.equal(W.hypothesis(P,{}).feedback,'no')});
