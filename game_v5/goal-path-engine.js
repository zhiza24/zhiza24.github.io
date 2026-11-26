/* Goal Path Engine — isolated planning layer for Reactor.
   Reads existing profile signals; keeps goal lifecycle and calendar snapshots by stable IDs.
   No network calls, no diary-text scanning, no diagnosis, no automatic goal ownership verdicts. */
(function(root,factory){
  var api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.GGoalPath=api;
})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
var VERSION=1;
var SPHERES=[
 {id:'health',names:['Здоровье'],label:'Здоровье'},
 {id:'money',names:['Финансы'],label:'Финансы'},
 {id:'career',names:['Карьера'],label:'Карьера'},
 {id:'love',names:['Отношения'],label:'Отношения'},
 {id:'family',names:['Семья'],label:'Семья'},
 {id:'friends',names:['Друзья'],label:'Друзья'},
 {id:'growth',names:['Рост'],label:'Рост'},
 {id:'rest',names:['Отдых'],label:'Отдых'}
];
var STYLE={
 initiator:{id:'action_first',title:'Через действие',hint:'Тебе может быть проще начать с конкретного шага и быстро увидеть первый результат.',prompt:'Какое действие можно сделать сегодня за 10–20 минут?',format:'Сначала действие, затем короткое осмысление.'},
 observer:{id:'reflective',title:'Через понимание',hint:'Полезно сначала прояснить ситуацию и смысл шага, а затем переходить к действию.',prompt:'Что важно понять, прежде чем выбирать следующий шаг?',format:'Короткое наблюдение → один проверяемый шаг.'},
 creator:{id:'creative',title:'Через пробу',hint:'Можно двигаться через небольшие эксперименты и видимые фрагменты результата.',prompt:'Какую небольшую версию результата можно попробовать создать?',format:'Черновик → проба → обратная связь → улучшение.'},
 architect:{id:'structured',title:'Через последовательность',hint:'Может подойти ясная последовательность этапов с понятным объемом каждого шага.',prompt:'Какой один этап логично сделать первым?',format:'Этапы → порядок → срок → проверка.'},
 researcher:{id:'exploratory',title:'Через исследование',hint:'Начни с небольшого исследования и проверки предположения на практике.',prompt:'Что нужно выяснить первым, чтобы выбрать обоснованный шаг?',format:'Вопрос → сбор фактов → маленькая проверка → решение.'}
};
var READINESS={
 ready:{title:'Основа уже есть',next:'Выбрать первый результат и перейти к действиям.'},
 time:{title:'Нужно выделить время',next:'Найти реалистичное окно в расписании и определить минимальный ритм.'},
 gaps:{title:'Нужно укрепить отдельные опоры',next:'Выбрать один недостающий навык или ресурс и сделать его первым этапом.'},
 foundation:{title:'Сначала подготовить основу',next:'Не торопиться с большим действием: определить, чего пока не хватает, и начать с самого базового шага.'}
};
/* Препятствия и ответы на них: только готовые варианты, без свободного текста */
var OBSTACLES=[
 {id:'tired',t:'Не будет сил'},
 {id:'time',t:'Не хватит времени'},
 {id:'forget',t:'Забуду'},
 {id:'doubt',t:'Появятся сомнения'},
 {id:'people',t:'Отвлекут другие люди или дела'}
];
var RESPONSES={
 tired:[{id:'min',t:'сделаю минимальную версию шага'},{id:'five',t:'сделаю пять минут и остановлюсь'},{id:'rest',t:'сначала отдохну, потом вернусь'}],
 time:[{id:'min',t:'сделаю минимальную версию шага'},{id:'slot',t:'выберу другое время сегодня'},{id:'move',t:'перенесу на завтра без упреков'}],
 forget:[{id:'bind',t:'привяжу шаг к привычному делу'},{id:'remind',t:'поставлю напоминание'},{id:'evening',t:'вернусь к шагу вечером'}],
 doubt:[{id:'small',t:'сделаю самую маленькую пробу'},{id:'why',t:'вспомню, зачем мне это'},{id:'ask',t:'спрошу совета у близкого'}],
 people:[{id:'say',t:'скажу, что мне нужно немного времени'},{id:'after',t:'сделаю шаг после них'},{id:'min',t:'сделаю минимальную версию шага'}],
 other:[{id:'min',t:'сделаю минимальную версию шага'},{id:'move',t:'перенесу на завтра без упреков'},{id:'ask',t:'попрошу помощи'}]
};
function ifThenOptions(obstacle){return {obstacles:OBSTACLES.concat([{id:'other',t:'Другое'}]),responses:RESPONSES[obstacle]||[]}}
function ifThenText(woop){woop=obj(woop);var o=OBSTACLES.filter(function(x){return x.id===woop.obstacle})[0],r=arr(RESPONSES[woop.obstacle]).filter(function(x){return x.id===woop.response})[0];if(!r)return '';return (o?'Если '+o.t.charAt(0).toLowerCase()+o.t.slice(1):'Если что-то помешает')+', я '+r.t+'.'}
function setIfThen(T,id,obstacle,response){
 var G=ensureState(T),gid=text(id,100);if(!gid)return {ok:false};
 var ob=obstacle==='other'||OBSTACLES.some(function(x){return x.id===obstacle})?obstacle:'';
 var rs=ob&&arr(RESPONSES[ob]).some(function(x){return x.id===response})?response:'';
 var p=obj(G.plans[gid]),w=obj(p.woop);
 if(w.obstacle!==ob)rs=rs||'';
 p.woop={obstacle:ob,response:rs,plan:rs?ifThenText({obstacle:ob,response:rs}):'',updatedAt:Date.now()};
 p.goalId=gid;p.updatedAt=Date.now();G.plans[gid]=p;return {ok:true,woop:p.woop};
}
function setReadiness(T,id,level){var G=ensureState(T),gid=text(id,100);if(!gid)return false;var p=obj(G.plans[gid]);p.readiness=READINESS[level]?level:null;p.goalId=gid;p.updatedAt=Date.now();G.plans[gid]=p;return true}
function obj(x){return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
function arr(x){return Array.isArray(x)?x:[]}
function text(x,max){return String(x==null?'':x).trim().slice(0,max||500)}
function clone(x){return JSON.parse(JSON.stringify(x))}
function sphere(id){for(var i=0;i<SPHERES.length;i++)if(SPHERES[i].id===id)return SPHERES[i];return null}
function sphereForWish(w){
 var cid=text(w&&w.cid,40), links=arr(w&&w.spheres);
 if(cid&&cid!=='legacy'&&sphere(cid))return [cid];
 return links.filter(function(id){return !!sphere(id)});
}
function wheelSignals(P,w){
 P=obj(P);var values=arr(P.wheel),test=obj(P.wheelTest),signals=[];
 sphereForWish(w).forEach(function(id){
  var s=sphere(id),idx=SPHERES.indexOf(s),score=values.length===8&&values[idx]!=null?Number(values[idx]):null;
  var wt=arr(test.spheres).filter(function(x){return x&&(x.name===s.label||arr(s.names).indexOf(x.name)>=0)})[0];
  var urgent=false,change=false;
  arr(wt&&wt.improvements).forEach(function(im){if(im&&im.change==='yes'){change=true;if(im.urgency==='soon'||im.urgency==='now'||Number(im.strength)>=7)urgent=true}});
  if(score!=null&&score<=4)change=true;
  signals.push({sphere:id,label:s.label,score:isFinite(score)?score:null,needsChange:change,urgent:urgent,source:wt?'wheelTest':(score!=null?'wheel':'none')});
 });
 return signals;
}
function priorityContext(P,w){
 var signals=wheelSignals(P,w),urgent=signals.some(function(x){return x.urgent}),low=signals.some(function(x){return x.score!=null&&x.score<=4});
 return {signals:signals,urgent:urgent,lowScore:low,important:!!(w&&w.important),horizon:text(w&&w.horizon,30)||null,done:!!(w&&w.done)};
}
function styleFor(P,override){
 P=obj(P);var n=obj(P.nature),key=text(n.primary,40),s=STYLE[key]||STYLE.architect;
 if(override){var requested=STYLE[override]||Object.keys(STYLE).map(function(k){return STYLE[k]}).filter(function(x){return x.id===override})[0];if(requested)s=requested;}
 return {id:s.id,title:s.title,hint:s.hint,prompt:s.prompt,format:s.format,source:STYLE[key]?'nature.primary':'balanced_default',natureKey:STYLE[key]?key:null};
}
function assessReadiness(answer){
 answer=obj(answer);var level=['ready','time','gaps','foundation'].indexOf(answer.level)>=0?answer.level:'gaps';
 var missing=arr(answer.missing).map(function(x){return text(x,80)}).filter(Boolean).slice(0,8);
 var note=text(answer.note,500);
 return {level:level,title:READINESS[level].title,next:READINESS[level].next,missing:missing,note:note,checkedAt:Number(answer.checkedAt)||Date.now()};
}
function scaffold(goal,assessment,style,answers){
 goal=obj(goal);assessment=assessReadiness(assessment);style=style||STYLE.architect;answers=obj(answers);
 var foundation=assessment.level==='foundation';
 var weeks=[
  {week:1,title:foundation?'Подготовить первую опору':'Сделать первый понятный шаг',focus:foundation?'Разобраться с базовым условием, которого пока не хватает.':'Перевести желание в конкретный первый результат.'},
  {week:2,title:foundation?'Освоить или найти недостающий ресурс':'Проверить способ в реальности',focus:foundation?'Получить минимальный навык, информацию или поддержку.':'Сделать небольшую пробу и посмотреть на фактический отклик.'},
  {week:3,title:foundation?'Применить подготовленное':'Продвинуться на следующий уровень',focus:foundation?'Использовать новую опору в небольшом безопасном действии.':'Повторить рабочий шаг или скорректировать его по результату.'},
  {week:4,title:'Подвести итог и выбрать продолжение',focus:'Сопоставить исходную точку с тем, что изменилось, и решить, что делать дальше.'}
 ];
 return {
  goalId:text(goal.id,100),goal:text(goal.text||goal.raw,300),readiness:assessment,style:style,
  desiredOutcome:text(answers.outcome,500),milestone:text(answers.milestone,300),
  weeks:weeks.map(function(w,i){return {week:w.week,title:w.title,focus:w.focus,action:text(arr(answers.weekActions)[i],300),minimum:text(arr(answers.weekMinimums)[i],200),proof:text(arr(answers.weekProofs)[i],200),status:'open'} }),
  firstAction:text(answers.firstAction,300),minimumAction:text(answers.minimumAction,200),
  woop:{wish:text(goal.text||goal.raw,300),outcome:text(answers.outcome,500),obstacle:text(answers.obstacle,400),plan:text(answers.ifThen,400)},
  prompts:{next:style.prompt,obstacle:'Что чаще всего может помешать этому шагу?',ifThen:'Если возникнет это препятствие, то какой небольшой шаг ты предпримешь?',review:'Что получилось на практике и что стоит изменить?'},
  status:'draft',createdAt:Number(answers.createdAt)||Date.now(),updatedAt:Date.now()
 };
}
function ensureState(T){
 T=obj(T);T.goalPath=obj(T.goalPath);
 var G=T.goalPath;
 G.version=VERSION;G.goals=obj(G.goals);G.plans=obj(G.plans);G.days=obj(G.days);
 G.activeIds=arr(G.activeIds);G.history=arr(G.history);
 G.cycles=arr(G.cycles);
 if(T.start&&G.cycleStartAt&&Number(T.start)!==Number(G.cycleStartAt)){
  /* новый цикл трекера: снимки прошлого цикла уходят в архив, желания и история сохраняются */
  if(Object.keys(G.days).length)G.cycles.push({startAt:G.cycleStartAt,days:G.days,archivedAt:Date.now()});
  if(G.cycles.length>12)G.cycles=G.cycles.slice(-12);
  G.days={};G.cycleStartAt=Number(T.start);
 }
 if(!G.cycleStartAt&&T.start)G.cycleStartAt=Number(T.start);
 return G;
}
function goalId(d,i){
if(typeof d==='string')d={id:d,text:d};
 d=obj(d);return text(d.id,100)||('legacy-'+String(i+1)+'-'+text(d.text||d.t||d.name,48).toLowerCase().replace(/[^a-z0-9а-я]+/gi,'-'));
}
function registerGoals(T,directions){
 var G=ensureState(T);
 arr(directions).forEach(function(d,i){
  var id=goalId(d,i);if(typeof d==='string')d={text:d};d=obj(d);
  if(!G.goals[id])G.goals[id]={id:id,text:text(d.text||d.t||d.name,300),sphere:text(d.cid||d.sphere,40)||null,status:'active',createdAt:Date.now(),updatedAt:Date.now()};
  if(G.activeIds.indexOf(id)<0&&G.activeIds.length<3)G.activeIds.push(id);
 });
 return G;
}
function activateCycle(T,at){
 var G=ensureState(T),stamp=Number(at)||Date.now();
 if(!G.cycleStartAt)G.cycleStartAt=Number(T.start)||stamp;
 if(!T.start)T.start=G.cycleStartAt;
 G.status='active';G.activatedAt=G.activatedAt||stamp;
 return {startAt:G.cycleStartAt,day:cycleDay(T,stamp),preservedExistingStart:stamp!==G.cycleStartAt};
}
function calendarDay(T,at){
 T=obj(T);var G=obj(T.goalPath),start=Number(G.cycleStartAt||T.start),now=Number(at)||Date.now();
 if(!start)return 0;
 function dayStamp(x){var d=new Date(x);return Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())}
 return Math.floor((dayStamp(now)-dayStamp(start))/86400000)+1;
}
/* День цикла в той же нумерации, что и трекер (track28 todayNum / GTrackDay): 1..28 от T.start */
function cycleDay(T,at){
 T=obj(T);var start=Number(T.start||obj(T.goalPath).cycleStartAt),now=Number(at)||Date.now();
 if(!start)return 0;var n=Math.floor((now-start)/86400000)+1;return n<1?1:(n>28?28:n);
}
/* Синхронизация с тремя направлениями из Неба желаний: источник правды T.directions, ничего не удаляется */
function syncDirections(T,at){
 var G=ensureState(T),stamp=Number(at)||Date.now(),list=arr(T&&T.directions).slice(0,3),ids=[];
 list.forEach(function(d,i){
  var id=goalId(d,i),src=typeof d==='string'?{text:d}:obj(d);if(!text(src.text||src.t||src.name,300))return;ids.push(id);
  if(!G.goals[id])G.goals[id]={id:id,text:text(src.text||src.t||src.name,300),sphere:text(src.cid||src.sphere,40)||null,status:'active',createdAt:stamp,updatedAt:stamp};
  else if(G.goals[id].status!=='active'){G.goals[id].status='active';G.goals[id].updatedAt=stamp}
 });
 var changed=ids.join('|')!==G.activeIds.join('|');
 if(changed){
  G.activeIds.forEach(function(old,slot){if(ids.indexOf(old)<0&&G.goals[old]){G.goals[old].status='paused';G.goals[old].endedAt=stamp;G.goals[old].updatedAt=stamp;addHistory(G,{type:'replace',slot:slot,from:old,to:ids[slot]||null,at:stamp,day:cycleDay(T,stamp),reason:'directions'})}});
  G.activeIds=ids;
 }
 return {changed:changed,activeIds:ids.slice()};
}
function snapshotDay(T,day,at){
 var G=ensureState(T),n=Number(day)||cycleDay(T,at),key=String(n);
 if(!n||n<1)return null;
 if(G.days[key])return {snapshot:G.days[key],created:false};
 var active=G.activeIds.map(function(id){var g=G.goals[id];return g?{id:g.id,text:g.text,sphere:g.sphere}:null}).filter(Boolean);
 G.days[key]={day:n,date:Number(at)||Date.now(),active:active,createdAt:Date.now()};
 return {snapshot:G.days[key],created:true};
}
function addHistory(G,event){G.history.push(event);if(G.history.length>500)G.history=G.history.slice(-500)}
function replaceActiveGoal(T,slot,newGoal,at,reason){
 var G=ensureState(T),i=Number(slot),stamp=Number(at)||Date.now(),day=cycleDay(T,stamp);
 if(i<0||i>2||Math.floor(i)!==i)return {ok:false,error:'slot must be 0, 1 or 2'};
 newGoal=obj(newGoal);var id=goalId(newGoal,i),oldId=G.activeIds[i]||null;
 if(!text(newGoal.text||newGoal.raw,300))return {ok:false,error:'Нужно указать новое желание.'};
 if(oldId===id)return {ok:false,error:'Это желание уже находится в выбранном направлении.'};
 if(G.activeIds.indexOf(id)>=0)return {ok:false,error:'Это желание уже активно в другом направлении.'};
 if(oldId&&G.goals[oldId]){G.goals[oldId].status='paused';G.goals[oldId].updatedAt=stamp;G.goals[oldId].endedAt=stamp}
 if(!G.goals[id])G.goals[id]={id:id,text:text(newGoal.text||newGoal.raw,300),sphere:text(newGoal.cid||newGoal.sphere,40)||null,status:'active',createdAt:stamp,updatedAt:stamp};
 else{G.goals[id].status='active';G.goals[id].updatedAt=stamp;G.goals[id].text=text(newGoal.text||newGoal.raw,300)}
 G.activeIds[i]=id;
 addHistory(G,{type:'replace',slot:i,from:oldId,to:id,at:stamp,day:day,reason:text(reason,240)});
 return {ok:true,from:oldId,to:id,day:day,cycleStartAt:G.cycleStartAt,activeIds:G.activeIds.slice()};
}
function setGoalStatus(T,id,status,at,reason){
 var G=ensureState(T),g=G.goals[text(id,100)],stamp=Number(at)||Date.now();
 if(!g)return {ok:false,error:'Желание не найдено.'};
 if(['active','paused','deferred','completed','removed'].indexOf(status)<0)return {ok:false,error:'Недопустимый статус.'};
 var old=g.status;g.status=status;g.updatedAt=stamp;
 if(status!=='active')G.activeIds=G.activeIds.filter(function(x){return x!==id});
 else if(G.activeIds.indexOf(id)<0&&G.activeIds.length<3)G.activeIds.push(id);
 addHistory(G,{type:'status',id:id,from:old,to:status,at:stamp,day:cycleDay(T,stamp),reason:text(reason,240)});
 return {ok:true,status:status,activeIds:G.activeIds.slice()};
}
function attachPlan(T,id,plan){
 var G=ensureState(T),g=G.goals[text(id,100)];
 if(!g)return false;
 plan=clone(obj(plan));var old=obj(G.plans[id]);Object.keys(plan).forEach(function(k){old[k]=plan[k]});old.goalId=id;old.updatedAt=Date.now();G.plans[id]=old;return true;
}
function planFor(T,id){return obj(obj(obj(T).goalPath).plans)[text(id,100)]||null}
function strategyContext(P){
 var T=obj(P&&P.tracker),S=obj(T.strategy);
 return {available:Object.keys(S).length>0,focus:arr(S.focus).slice(0,3).map(function(x){x=obj(x);return {title:text(x.t||x.wish,180),guidance:text(x.g,300),source:text(x.src,120)}}),first:arr(S.days).length?{action:text(obj(S.days[0]).m,240),minimum:text(obj(S.days[0]).n,160),observation:text(obj(S.days[0]).o,200)}:null,weeks:arr(S.weeks).slice(0,4).map(function(x){x=obj(x);return {title:text(x.t,120),description:text(x.d,240),question:text(x.q,200)}}),practices:arr(S.practRec).slice(0,5).map(function(x){x=obj(x);return {id:text(x.id,80),why:text(x.why,240)}}),modelActions:arr(S.modelActions).slice(0,5).map(function(x){x=obj(x);return {title:text(x.t||x.title,140),description:text(x.x||x.description,240)}})};
}
function contextFor(P,w){
 var strategy=strategyContext(P);
 return {priority:priorityContext(P,w),style:styleFor(P),strategyAvailable:strategy.available,strategy:strategy,natureAvailable:!!(P&&P.nature&&P.nature.primary),wheelAvailable:!!(P&&(arr(P.wheel).length===8||P.wheelTest))};
}
return {version:VERSION,spheres:SPHERES,styles:STYLE,readiness:READINESS,wheelSignals:wheelSignals,priorityContext:priorityContext,styleFor:styleFor,assessReadiness:assessReadiness,scaffold:scaffold,ensureState:ensureState,registerGoals:registerGoals,activateCycle:activateCycle,calendarDay:calendarDay,cycleDay:cycleDay,syncDirections:syncDirections,planFor:planFor,goalId:goalId,snapshotDay:snapshotDay,replaceActiveGoal:replaceActiveGoal,setGoalStatus:setGoalStatus,attachPlan:attachPlan,obstacles:OBSTACLES,ifThenOptions:ifThenOptions,ifThenText:ifThenText,setIfThen:setIfThen,setReadiness:setReadiness,contextFor:contextFor};
});
