/* Мастерская стратегий: как ты идешь от желания к действию и к результату.
   Только готовые варианты. Данные в P.strategyWorkshop (внутри alch_v5_profile). Без ярлыков и штрафов. */
(function(root,factory){var api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.GWorkshop=api})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
var VERSION=1;
var STRATEGIES=[
 {id:'delay',g:'under',t:'Откладывал{|а} начало'},
 {id:'prep',g:'under',t:'Долго готовил{ся|ась}, но не проверил{|а} в деле'},
 {id:'perfect',g:'under',t:'Ждал{|а}, пока будет идеально'},
 {id:'rush',g:'over',t:'Торопил{ся|ась} и не проверил{|а}, что вышло'},
 {id:'many',g:'over',t:'Делал{|а} много, но результат не ясен'},
 {id:'switch',g:'over',t:'Перескакивал{|а} с одного на другое'},
 {id:'steady',g:'strong',t:'{Шел|Шла} ровно и смотрел{|а} на отклик'},
 {id:'adjust',g:'strong',t:'Пробовал{|а} и менял{|а} способ по результату'},
 {id:'limit',g:'outer',t:'Мешали реальные обстоятельства'}
];
var EXPECT=[{id:'progress',t:'Заметного продвижения'},{id:'some',t:'Хоть немного продвинуться'},{id:'fail',t:'Что ничего не выйдет'},{id:'none',t:'Ничего особенного'}];
var ACTUAL=[{id:'more',t:'Лучше, чем ждал{|а}'},{id:'same',t:'Примерно как ждал{|а}'},{id:'less',t:'Меньше, чем ждал{|а}'},{id:'unknown',t:'Пока непонятно, отклика нет'}];
var THOUGHTS={
 under:[{id:'ready',t:'Сначала надо лучше подготовиться'},{id:'ideal',t:'Если не идеально, не стоит и начинать'},{id:'nouse',t:'Все равно не выйдет'},{id:'later',t:'Потом будет больше времени'}],
 over:[{id:'more',t:'Чем больше сделаю, тем лучше'},{id:'done',t:'Раз сделал{|а}, значит работает'},{id:'notime',t:'Некогда проверять, надо успеть'},{id:'stop',t:'Остановиться значит отстать'}],
 strong:[{id:'try',t:'Можно пробовать и смотреть, что выходит'},{id:'pace',t:'Лучше в своем темпе, но регулярно'}],
 outer:[{id:'mine',t:'Если не вышло, это моя вина'},{id:'wait',t:'Пока обстоятельства не изменятся, ничего не сделать'}]
};
var CHECK=[{id:'yes',t:'Подтвердилась'},{id:'part',t:'Отчасти'},{id:'no',t:'Не подтвердилась'},{id:'unk',t:'Пока не знаю'}];
var EXPERIMENTS={
 delay:[{id:'five',t:'Начинать с пяти минут в одно и то же время'},{id:'first',t:'Делать самый первый маленький шаг сразу'}],
 prep:[{id:'show',t:'Показать черновик одному человеку'},{id:'test',t:'Один раз проверить идею в деле до новой подготовки'}],
 perfect:[{id:'rough',t:'Сделать простую версию и посмотреть отклик'},{id:'limit',t:'Ограничить время на шаг и закончить как есть'}],
 rush:[{id:'sign',t:'Перед шагом выбрать, по какому признаку пойму результат'},{id:'pause',t:'После шага делать короткую паузу и смотреть, что изменилось'}],
 many:[{id:'week',t:'Раз в неделю отмечать, что реально изменилось'},{id:'one',t:'Выбрать одно главное действие на день'}],
 switch:[{id:'keep',t:'Неделю держать одно направление'},{id:'finish',t:'Довести один шаг до конца, прежде чем браться за новый'}],
 steady:[{id:'keep',t:'Продолжать как есть'}],
 adjust:[{id:'keep',t:'Продолжать как есть'}],
 limit:[{id:'resource',t:'Сделать один практический шаг к ресурсу: время, помощь или деньги'},{id:'smaller',t:'Уменьшить шаг под реальные условия'}]
};
var REVIEW=[{id:'helped',t:'Помогло'},{id:'part',t:'Отчасти'},{id:'no',t:'Не помогло'},{id:'skip',t:'Не получилось попробовать'}];
var GROUP={under:{t:'чаще бывало промедление перед шагом: откладывание, долгая подготовка или ожидание идеала',plus:'Такая осторожность иногда бережет силы и уберегает от ошибок.'},
 over:{t:'чаще бывало много действий без проверки результата: спешка, распыление или «больше значит лучше»',plus:'За этим стоит энергия и желание двигаться, это ресурс.'},
 strong:{t:'чаще получалось идти ровно и сверять шаги с откликом',plus:'Это сильная сторона, ее стоит сохранить.'},
 outer:{t:'больше мешали реальные обстоятельства, чем способ действовать',plus:'Здесь помогают практические шаги, а не борьба с собой.'}};
function obj(x){return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
function arr(x){return Array.isArray(x)?x:[]}
function find(list,id){for(var i=0;i<list.length;i++)if(list[i].id===id)return list[i];return null}
function strategy(id){return find(STRATEGIES,id)}
function state(P){P.strategyWorkshop=obj(P.strategyWorkshop);var W=P.strategyWorkshop;W.v=VERSION;W.entries=arr(W.entries);W.reviews=arr(W.reviews);W.feedback=arr(W.feedback);return W}
function options(stratId){var s=strategy(stratId),g=s?s.g:'under';return {strategies:STRATEGIES,expect:EXPECT,actual:ACTUAL,thoughts:THOUGHTS[g]||[],check:CHECK,experiments:(EXPERIMENTS[stratId]||[]).concat([{id:'none',t:'Пока без эксперимента'}]),review:REVIEW}}
function valid(list,id){return !!find(list,id)}
function addEntry(P,x,ctx){
 x=obj(x);ctx=obj(ctx);var s=strategy(x.strategy);if(!s)return {ok:false,error:'strategy'};
 var o=options(s.id),W=state(P);
 var e={id:'ws'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),at:Number(ctx.at)||Date.now(),day:Number(ctx.day)||0,cycle:Number(ctx.cycle)||1,goalId:ctx.goalId?String(ctx.goalId).slice(0,100):null,
  strategy:s.id,group:s.g,expect:valid(EXPECT,x.expect)?x.expect:null,actual:valid(ACTUAL,x.actual)?x.actual:null,
  thought:valid(o.thoughts,x.thought)?x.thought:null,check:valid(CHECK,x.check)?x.check:null,experiment:valid(o.experiments,x.experiment)?x.experiment:null};
 W.entries.push(e);if(W.entries.length>300)W.entries=W.entries.slice(-300);return {ok:true,entry:e};
}
function openExperiment(P,day){var W=state(P);for(var i=W.entries.length-1;i>=0;i--){var e=W.entries[i];if(e.experiment&&e.experiment!=='none'&&!W.reviews.some(function(r){return r.entryId===e.id}))return (day==null||day-e.day>=5||day<e.day)?e:null}return null}
function reviewExperiment(P,entryId,result,at){var W=state(P);if(!valid(REVIEW,result)||!W.entries.some(function(e){return e.id===entryId}))return false;W.reviews=W.reviews.filter(function(r){return r.entryId!==entryId});W.reviews.push({entryId:entryId,result:result,at:Number(at)||Date.now()});return true}
/* сводка отметок трекера: только числа из готовых отметок, без чтения свободного текста */
function trackerSignals(T){
 T=obj(T);var days=obj(T.days),res={done:0,part:0,min:0,other:0,fail:0},recDays=0,wish=0,must=0,self=0,worse=0,better=0,acts=0;
 Object.keys(days).forEach(function(k){var d=obj(days[k]),r=obj(d.res);if(r.v&&res[r.v]!=null){res[r.v]++;recDays++}});
 Object.keys(obj(T.marks24)).forEach(function(k){arr(T.marks24[k]).forEach(function(m){m=obj(m);if(m.kind==='wish')wish++;else{acts++;if(m.init==='must')must++;if(m.init==='self')self++}if(m.after==='worse')worse++;if(m.after==='better')better++})});
 return {recDays:recDays,res:res,wishNotDone:wish,acts:acts,must:must,self:self,worse:worse,better:better};
}
function hypothesis(P,T){
 var W=state(P),E=W.entries,sig=trackerSignals(T);
 if(E.length<3)return {ready:false,need:3-E.length,signals:sig};
 var cnt={under:0,over:0,strong:0,outer:0};E.forEach(function(e){if(cnt[e.group]!=null)cnt[e.group]++});
 var keys=Object.keys(cnt).sort(function(a,b){return cnt[b]-cnt[a]}),top=keys[0],tie=cnt[keys[1]]===cnt[top];
 var why=['ты отметил{|а} это '+cnt[top]+' раз из '+E.length];
 if(top==='under'&&(sig.res.min+sig.res.fail+sig.wishNotDone))why.push('в трекере: дней с минимумом или паузой '+(sig.res.min+sig.res.fail)+', отметок «хотелось, но не сделал{|а}» '+sig.wishNotDone);
 if(top==='over'&&sig.acts)why.push('в трекере: дел '+sig.acts+', из них «надо» '+sig.must+', после которых стало хуже '+sig.worse);
 if(top==='strong'&&sig.recDays)why.push('в трекере: дней со сделанным шагом '+(sig.res.done+sig.res.part)+' из '+sig.recDays);
 var ex=E.filter(function(e){return e.actual==='unknown'}).length;
 var fb=W.feedback.filter(function(f){return f.group===top}).slice(-1)[0]||null;
 var rv=W.reviews.map(function(r){return r.result}),helped=rv.filter(function(x){return x==='helped'||x==='part'}).length;
 return {ready:true,tie:tie,group:tie?null:top,text:tie?'Пока нет одного способа, который встречался бы чаще других.':'Похоже, в последнее время '+GROUP[top].t+'.',plus:tie?'':GROUP[top].plus,why:why.join('; ')+'.',
  noFeedback:ex,experiments:{done:rv.length,helped:helped},feedback:fb?fb.answer:null,counts:cnt,signals:sig};
}
function setFeedback(P,group,answer,at){if(['yes','part','no'].indexOf(answer)<0||!GROUP[group])return false;var W=state(P);W.feedback.push({group:group,answer:answer,at:Number(at)||Date.now()});if(W.feedback.length>100)W.feedback=W.feedback.slice(-100);return true}
return {version:VERSION,strategies:STRATEGIES,options:options,addEntry:addEntry,openExperiment:openExperiment,reviewExperiment:reviewExperiment,trackerSignals:trackerSignals,hypothesis:hypothesis,setFeedback:setFeedback,state:state,label:function(list,id){var x=find(list,id);return x?x.t:''}};
});
