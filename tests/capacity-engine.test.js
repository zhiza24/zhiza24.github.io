'use strict';
const test=require('node:test');const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const C=require('../game_v5/capacity-engine.js');const GP=require('../game_v5/goal-path-engine.js');
const src=fs.readFileSync(path.join(__dirname,'../game_v5/capacity-engine.js'),'utf8');
const nat=k=>({nature:{primary:k}});
const H=(P,plan,day,extra)=>C.hint(P,plan||{},Object.assign({day:day||1},extra||{}));

test('ACT-13: нет данных — нет подсказки',()=>{assert.equal(H({},{} ,1),null);assert.equal(H({nature:{primary:'weird'}},{},1),null)});
test('ACT-14: механика есть — подсказка с «Почему так» и оговоркой',()=>{const h=H(nat('initiator'),{},1,{name:()=>'Инициатор'});assert.equal(h.type,'self');assert.match(h.why,/механика природы по дате рождения — Инициатор/);assert.match(h.why,/только предположение/)});
test('ACT-01/02: запрос — найти запрос или показать',()=>{const P=nat('observer');assert.equal(H(P,{},1).type,'request');assert.equal(H(P,{},2).type,'show')});
test('ACT-04/15: запроса нет и шаг стоит — не ждать, создать точку контакта',()=>{const h=H(nat('observer'),{},1,{stalled:true});assert.equal(h.type,'show');assert.match(h.text,/не жди/)});
test('ACT-05..08: разные механики — разные форматы',()=>{assert.equal(H(nat('initiator'),{},1).type,'self');assert.equal(H(nat('creator'),{},1).type,'show');assert.equal(H(nat('researcher'),{},1).type,'trial');const e=H(nat('architect'),{},1);assert.equal(e.type,'trial');assert.match(e.text,/условия|легче/)});
test('ACT-10/CAP-15: выбор игрока важнее расчета, «по-разному» отключает подсказки',()=>{const P=Object.assign(nat('observer'),{capacity:{start:'self'}});const h=H(P,{},1);assert.equal(h.type,'self');assert.equal(h.source,'player');assert.match(h.why,/ты выбрал\{\|а\}: мне проще начинать, когда решаю/);assert.equal(H(nat('observer'),{capacity:{start:'mixed'}},1),null)});
test('CAP-14/PLN-02: у двух целей разный способ',()=>{const P=nat('observer');assert.equal(H(P,{capacity:{start:'trial'}},1).type,'trial');assert.equal(H(P,{},1).type,'request');assert.match(H(P,{capacity:{start:'trial'}},1).why,/для этой цели/)});
test('CAP-01/31: что не тянуть одному — подсказка передать часть, без найма как единственного пути',()=>{const P={capacity:{start:'self',support:'admin'}};const h=H(P,{},3);assert.equal(h.type,'delegate');assert.match(h.text,/напоминания и организацию/);assert.match(h.text,/обменяться|инструмент/);assert.doesNotMatch(src,/найми|любой ценой/i)});
test('CAP-05/29: «справляюсь сам» — нет передачи',()=>{const P={capacity:{start:'self',support:'none'}};for(let d=1;d<7;d++)assert.notEqual(H(P,{},d).type,'delegate')});
test('CAP-16: подсказка про поддержку от механики только как предположение',()=>{const h=H(nat('creator'),{},3);assert.equal(h.type,'delegate');assert.equal(h.source,'nature')});
test('ACT-16: тексты чередуются, не одно и то же каждый день',()=>{const P=nat('initiator');assert.notEqual(H(P,{},1).text,H(P,{},2).text)});
test('ACT-09: способ запуска и что передать — разные слои',()=>{const pr=C.profile({capacity:{start:'request',support:'tech'}},{});assert.equal(pr.route,'request');assert.equal(pr.support,'tech')});
test('Мастерская «с людьми» добавляет передачу части',()=>{const P={capacity:{start:'self',support:'contact'}};assert.equal(H(P,{},2,{people:true}).type,'delegate')});
test('Ярлыки: нет названий чужих моделей и типов как факта',()=>{const all=JSON.stringify([C.start,C.support])+src.split('\n').filter(l=>!l.startsWith('/*')&&!l.startsWith('   ')).join('');assert.doesNotMatch(all,/проектор|генератор|манифестор|рефлектор|human design|ты — /i);assert.doesNotMatch(src,/[ёЁ]/)});
test('setGlobal принимает только готовые варианты',()=>{const P={};assert.equal(C.setGlobal(P,'start','free text'),false);assert.ok(C.setGlobal(P,'start','request'));assert.equal(P.capacity.start,'request');assert.equal(C.setGlobal(P,'x','self'),false)});
test('Расчет механики не меняется: nature.js тот же код',()=>{const ctx={window:{}};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../game_v5/nature.js'),'utf8'),ctx);const r=ctx.window.GNature.calc('15.04.1985');assert.equal(r.version,1);const P={birth:'15.04.1985'};assert.equal(C.profile(P,{},{calc:ctx.window.GNature.calc}).natureKey,r.primary)});

/* PLN */
const mk=()=>{const T={start:Date.now()-3*864e5,directions:[{id:'a',text:'Книга'},{id:'b',text:'Здоровье'}]};GP.syncDirections(T);return T};
test('PLN-13: критерий успеха — только готовый вариант, сохраняется',()=>{const T=mk(),id=GP.goalId(T.directions[0],0);assert.ok(GP.setCriterion(T,id,'feedback'));assert.equal(GP.planFor(T,id).criterion,'feedback');GP.setCriterion(T,id,'свое');assert.equal(GP.planFor(T,id).criterion,null)});
test('PLN-12/CAP-20: действие и результат отдельно, «результат ожидается»',()=>{const T=mk(),id=GP.goalId(T.directions[0],0);assert.ok(GP.setOutcome(T,id,0,'pending'));assert.equal(GP.planFor(T,id).outcomes[0].status,'pending');assert.equal(GP.setOutcome(T,id,5,'seen'),false);GP.setOutcome(T,id,0,null);assert.equal(GP.planFor(T,id).outcomes[0],undefined)});
test('PLN-14: изменения пишутся версиями, старое не теряется',()=>{const T=mk(),id=GP.goalId(T.directions[0],0);GP.setCriterion(T,id,'visible');GP.setCriterion(T,id,'number');GP.setCapacity(T,id,'start','request');GP.setReadiness(T,id,'time');const v=GP.planFor(T,id).versions.map(x=>x.kind+':'+JSON.stringify(x.value));assert.deepEqual(v,['criterion:"visible"','criterion:"number"','capacity.start:"request"','readiness:"time"'])});
test('PLN-10/CAP-22: план привязан к id цели, другая цель не затронута, день не сдвинут',()=>{const T=mk(),a=GP.goalId(T.directions[0],0),b=GP.goalId(T.directions[1],1),start=T.start,day=GP.cycleDay(T);GP.setCapacity(T,a,'start','trial');assert.equal((GP.planFor(T,b)||{}).capacity,undefined);T.directions=[{id:'c',text:'Новое'},T.directions[1]];GP.syncDirections(T);assert.equal(GP.planFor(T,a).capacity.start,'trial');assert.equal(T.start,start);assert.equal(GP.cycleDay(T),day)});
test('PLN-08: отказ от подсказки не возвращается молча',()=>{const T=mk(),id=GP.goalId(T.directions[0],0);GP.setCapacity(T,id,'start','mixed');assert.equal(C.hint(nat('observer'),GP.planFor(T,id),{day:1}),null)});
test('CAP-28: экспорт/импорт сохраняет способ запуска и план',()=>{
 const store=Object.create(null);const ls={getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]},key:i=>Object.keys(store)[i]||null,get length(){return Object.keys(store).length}};
 class FR{readAsText(f){this.result=f.content;this.onload()}}
 const ctx={window:{},localStorage:ls,sessionStorage:ls,FileReader:FR,Date,Math,JSON,isFinite};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,'../game_v5/engine.js'),'utf8'),ctx);
 const T=mk(),id=GP.goalId(T.directions[0],0);GP.setCapacity(T,id,'support','tech');GP.setOutcome(T,id,1,'pending');const P={capacity:{start:'request'},tracker:T};
 const payload=JSON.stringify({format:'put-alhimika-backup',version:2,profile:P,local:{}});let ok;ctx.window.GPro.importFile({size:payload.length,content:payload},r=>{ok=r});assert.equal(ok,true);
 const back=JSON.parse(store.alch_v5_profile);assert.equal(back.capacity.start,'request');assert.equal(back.tracker.goalPath.plans[id].capacity.support,'tech');assert.equal(back.tracker.goalPath.plans[id].outcomes[1].status,'pending');
});
test('Стратегия выбора: запасной источник без даты рождения',()=>{const h=H({pocherk:{lead:'cre'}},{},1);assert.equal(h.type,'show');assert.equal(h.source,'pocherk');assert.match(h.why,/стратегия выбора — Созидание/)});
test('Стратегия выбора: совпадение с механикой отмечается, смешанный итог не учитывается',()=>{assert.match(H({nature:{primary:'initiator'},pocherk:{lead:'act'}},{},1).why,/совпадает твоя стратегия выбора \(Действие\)/);assert.equal(H({pocherk:{lead:'act',mixed:true}},{},1),null)});
test('Опора на других: чаще подсказка передать часть',()=>{const P={nature:{primary:'initiator'},pocherk:{lead:'sup'},capacity:{support:'admin'}};assert.equal(H(P,{},2).type,'delegate')});

test('passport direction marked yes adds a soft support line only for its sphere',()=>{
 global.GPassportData={directions:[{id:3,name:'Достижение'}]};
 const P={birth:'10.02.1990',capacity:{start:'self'},passport:{birth:'10.02.1990',answers:{'direction:3':{choice:'yes'}}}};
 assert.match(C.hint(P,{},{day:1,sphere:'career'}).why,/Достижение/);
 assert.doesNotMatch(C.hint(P,{},{day:1,sphere:'love'}).why,/Опора/);
 P.passport.answers['direction:3'].choice='partly';
 assert.doesNotMatch(C.hint(P,{},{day:1,sphere:'career'}).why,/Опора/);
 delete global.GPassportData;
});
