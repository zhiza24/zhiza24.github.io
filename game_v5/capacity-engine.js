/* Способ запуска: в каких условиях способности раскрываются и что лучше не тянуть одному.
   Основа: авторская механика природы по дате рождения (nature.js, расчет не меняется) и выбор игрока.
   Выбор игрока важнее расчета. Только готовые варианты, одна подсказка на шаг, без ярлыков. */
(function(root,factory){var api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.GCapacity=api})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
var START=[
 {id:'self',t:'решаю сам{|а} и сразу начинаю',y:'ты решаешь сам{|а} и сразу начинаешь'},
 {id:'request',t:'меня просят или есть конкретный заказ',y:'тебя просят или есть конкретный заказ'},
 {id:'respond',t:'есть живой отклик и интерес'},
 {id:'trial',t:'можно быстро попробовать и поменять'},
 {id:'env',t:'подходят условия: время, место, люди'},
 {id:'mixed',t:'по-разному, подсказки не нужны'}
];
var SUPPORT=[
 {id:'admin',t:'напоминания и организацию'},{id:'tech',t:'техническую часть'},{id:'contact',t:'звонки, переговоры, контакты'},
 {id:'money',t:'расчеты и деньги'},{id:'routine',t:'однообразную рутину'},{id:'none',t:'справляюсь сам{|а}'}
];
/* авторская модель: механика природы → путь включения (сверено с nature.js и STYLE в goal-path-engine.js) */
var NATURE_ROUTE={initiator:'self',observer:'request',creator:'respond',researcher:'trial',architect:'env'};
var NATURE_SUPPORT={initiator:'routine',observer:'contact',creator:'admin',architect:'contact',researcher:'routine'};
/* «Твоя стратегия выбора» (pocherk.js, P.pocherk.lead): ответы игрока, второй источник */
var POCHERK_ROUTE={act:'self',obs:'env',cre:'respond',sup:'request'};
var POCHERK_NAME={act:'Действие',obs:'Наблюдение',cre:'Созидание',sup:'Опора на других'};
var ROUTE_TYPE={self:'self',request:'request',respond:'show',trial:'trial',env:'trial'};
var TYPE_TAG={self:'начать сам{|а}',request:'найти запрос',show:'показать кому-то',delegate:'передать часть',trial:'короткая проба'};
var TEXT={
 self:['Начни сам{|а}: один небольшой шаг сегодня, без ожидания одобрения.','Сделай первый ход и коротко сообщи тому, кого это касается.'],
 request:['Подумай, кто мог бы попросить тебя об этом: заказчик, партнер, сообщество. Напиши одному человеку.','Где может появиться конкретный запрос на твою сильную сторону? Найди одно такое место.'],
 show:['Покажи кому-то кусочек результата и спроси, что откликается.','Сделай шаг так, чтобы его кто-то увидел: пример, черновик или короткий рассказ.'],
 trial:['Сделай короткую пробу минут на 15 и посмотри, что получилось.','Попробуй шаг в маленькой версии. Менять направление можно.'],
 env:['Сначала создай условия: время, место и первый понятный этап, потом шаг.','Сделай шаг там и с теми, где тебе легче, и заметь разницу.'],
 nowait:'Если запроса пока нет, не жди: покажи пример своей работы или предложи понятный формат одному человеку.',
 delegate:'Не тяни все одн{ому|ой}: можно передать {s}. Кого попросить, с кем обменяться помощью или какой инструмент взять?'
};
/* «Твои направления» паспорта (13): только те, что игрок сам отметил «да», и только близкие сфере цели. Мягкая опора, без вывода. */
var SPHERE_DIR={health:[5,13],money:[1,8,6],career:[3,6,12],love:[4,1],family:[2,4],friends:[4,11],growth:[9,10,7],rest:[13,5]};
function dirLean(P,sphere){var b=obj(P&&P.passport),a=obj(b.answers),ids=SPHERE_DIR[sphere]||[];if(b.birth&&P.birth&&b.birth!==P.birth)return null;
 for(var i=0;i<ids.length;i++){var r=a['direction:'+ids[i]];if(r&&r.choice==='yes'){var D=(typeof GPassportData!=='undefined'&&GPassportData.directions)||[],d=null;for(var j=0;j<D.length;j++)if(D[j].id===ids[i])d=D[j];if(d)return d.name}}return null}
function obj(x){return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
function find(list,id){for(var i=0;i<list.length;i++)if(list[i].id===id)return list[i];return null}
function valid(list,id){return !!find(list,id)}
function natureKey(P,calc){var n=obj(P&&P.nature);if(NATURE_ROUTE[n.primary])return n.primary;try{var c=calc&&P&&P.birth?calc(P.birth):null;if(c&&NATURE_ROUTE[c.primary])return c.primary}catch(e){}return null}
function setGlobal(P,field,value){if(['start','support'].indexOf(field)<0)return false;P.capacity=obj(P.capacity);var list=field==='start'?START:SUPPORT;if(value&&!valid(list,value))return false;if(value)P.capacity[field]=value;else delete P.capacity[field];P.capacity.updatedAt=Date.now();return true}
function profile(P,plan,opt){
 P=obj(P);opt=obj(opt);var pc=obj(obj(plan).capacity),gc=obj(P.capacity),nk=natureKey(P,opt.calc);
 var route=null,source=null;
 if(valid(START,pc.start)){route=pc.start;source='goal'}else if(valid(START,gc.start)){route=gc.start;source='player'}else if(nk){route=NATURE_ROUTE[nk];source='nature'}
 var pk=obj(P.pocherk),pl=!pk.mixed&&POCHERK_ROUTE[pk.lead]?pk.lead:null;
 if(!route&&pl){route=POCHERK_ROUTE[pl];source='pocherk'}
 var agree=!!(pl&&source==='nature'&&POCHERK_ROUTE[pl]===route);
 if(route==='mixed')route=null;
 var support=null,ss=null;
 if(valid(SUPPORT,pc.support)){support=pc.support;ss='goal'}else if(valid(SUPPORT,gc.support)){support=gc.support;ss='player'}else if(nk&&source==='nature'){support=NATURE_SUPPORT[nk];ss='nature'}
 if(support==='none')support=null;
 return {route:route,source:source,support:support,supportSource:ss,natureKey:nk,pocherk:pl,agree:agree,declined:pc.start==='mixed'||(!pc.start&&gc.start==='mixed')};
}
/* ctx: {day, stalled(bool), name(fn natureKey→имя), people(bool из Мастерской)} */
function hint(P,plan,ctx){
 ctx=obj(ctx);var pr=profile(P,plan,ctx),day=Math.max(1,Number(ctx.day)||1);
 if(pr.declined||(!pr.route&&!pr.support))return null;
 var type=pr.route?ROUTE_TYPE[pr.route]:'delegate',txt;
 var lean=ctx.people||pr.pocherk==='sup';
 if(pr.support&&(day%3===0||!pr.route||(lean&&day%2===0)))type='delegate';
 if(type==='request'&&day%2===0)type='show';
 if(type==='delegate')txt=TEXT.delegate.replace('{s}',find(SUPPORT,pr.support).t);
 else if(pr.route==='request'&&ctx.stalled){txt=TEXT.nowait;type='show'}
 else{var list=pr.route==='env'?TEXT.env:TEXT[type];txt=list[day%list.length]}
 var src=type==='delegate'?pr.supportSource:pr.source,why;
 if(src==='goal'||src==='player'){why=type==='delegate'?'ты отметил{|а}, что лучше не тянуть одн{ому|ой} '+find(SUPPORT,pr.support).t:'ты выбрал{|а}: мне проще начинать, когда '+find(START,pr.route).t;if(src==='goal')why+=' (для этой цели)'}
 else if(src==='pocherk')why='твоя стратегия выбора — '+POCHERK_NAME[pr.pocherk]+'. Это только предположение, его можно поправить ниже';
 else{var nm=ctx.name&&pr.natureKey?ctx.name(pr.natureKey):'';why='механика природы по дате рождения'+(nm?' — '+nm:'')+(pr.agree&&type!=='delegate'?', с ней совпадает твоя стратегия выбора ('+POCHERK_NAME[pr.pocherk]+')':'')+'. Это только предположение, его можно поправить ниже'}
 var dn=ctx.sphere?dirLean(P,ctx.sphere):null;if(dn)why+='. Опора: в паспорте ты узнал{|а} в себе направление «'+dn+'»';
 return {type:type,tag:TYPE_TAG[type],text:txt,why:why+'.',source:src,route:pr.route,direction:dn};
}
return {start:START,support:SUPPORT,natureRoute:NATURE_ROUTE,profile:profile,hint:hint,setGlobal:setGlobal,label:function(list,id){var x=find(list,id);return x?x.t:''},you:function(id){var x=find(START,id);return x?(x.y||x.t):''}};
});
