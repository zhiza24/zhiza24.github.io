/* Карта закономерностей — изолированный исследовательский слой.
   Читает alch_v5_profile и alch_samost без изменения исходных данных.
   Собственные эпизоды/подтверждения хранятся отдельно в alch_pattern_map_v1.
   Никаких диагнозов, скрытого анализа дневника или сетевых запросов. */
(function(g){
'use strict';
var PROFILE_KEY='alch_v5_profile',SAMOST_KEY='alch_samost',OWN_KEY='alch_pattern_map_v1',VERSION=1;
var TOPIC_NAMES={being:'Я есть',liking:'Что мне нравится',self_cancel:'Где я отменяю себя',voice:'Чей голос звучит внутри',ally:'Внутренний союзник',desires:'Мои желания',history:'Мой опыт — часть моей истории',quality:'Качество проживаемого опыта'};
var SPHERES={health:'Здоровье',money:'Финансы',work:'Карьера',relationships:'Отношения',family:'Семья',friends:'Друзья',growth:'Рост',rest:'Отдых'};
function obj(x){return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}
function arr(x){return Array.isArray(x)?x:[]}
function parse(key){try{var x=JSON.parse(g.localStorage.getItem(key)||'null');return obj(x)}catch(e){return {}}}
function countKeys(x){return Object.keys(obj(x)).length}
function safeText(x,max){return String(x==null?'':x).trim().slice(0,max||1200)}
function ownData(){var x=parse(OWN_KEY);x.version=VERSION;x.episodes=arr(x.episodes);x.patterns=arr(x.patterns);return x}
function saveOwn(x){try{g.localStorage.setItem(OWN_KEY,JSON.stringify(x));return true}catch(e){return false}}
function trackerStats(T){
 T=obj(T);var days=obj(T.days),events=obj(T.events24),marks=obj(T.marks24),eventCount=0,markCount=0,activeDays={},sphereCounts={},motives={},emotions={},after={},wishCount=0;
 Object.keys(events).forEach(function(day){arr(events[day]).forEach(function(e){eventCount++;activeDays[day]=1;if(e&&e.sphere)sphereCounts[e.sphere]=(sphereCounts[e.sphere]||0)+1;if(e&&e.motive)motives[e.motive]=(motives[e.motive]||0)+1;if(e&&e.emotion)emotions[e.emotion]=(emotions[e.emotion]||0)+1;if(e&&e.after)after[e.after]=(after[e.after]||0)+1;if(e&&e.alternative)wishCount++})});
 Object.keys(marks).forEach(function(day){arr(marks[day]).forEach(function(m){markCount++;activeDays[day]=1;if(m&&m.sph)sphereCounts[m.sph]=(sphereCounts[m.sph]||0)+1;if(m&&m.kind==='wish')wishCount++;if(m&&m.init)motives[m.init]=(motives[m.init]||0)+1;if(m&&m.emo)emotions[m.emo]=(emotions[m.emo]||0)+1;if(m&&m.after)after[m.after]=(after[m.after]||0)+1})});
 var stateDays=Object.keys(days).filter(function(k){var d=obj(days[k]);return !!(Object.keys(obj(d.sliders)).length||Object.keys(obj(d.am)).length)}).length;
 return {eventCount:eventCount,markCount:markCount,daysWithRecords:Object.keys(activeDays).length,stateDays:stateDays,dayRecords:countKeys(days),spheres:sphereCounts,motives:motives,emotions:emotions,after:after,wishCount:wishCount,hasEvents:eventCount+markCount>0};
}
function sourceInventory(P,S){
 P=obj(P);S=obj(S);var T=obj(P.tracker),samAnswers=obj(S.answers),completed=obj(S.completed),learning=obj(P.learning),stateResult=null;
 try{if(g.GStateEngine&&typeof g.GStateEngine.evaluate==='function')stateResult=g.GStateEngine.evaluate(P)}catch(e){}
 var topicIds=Object.keys(TOPIC_NAMES),doneTopics=topicIds.filter(function(k){return !!completed[k]}).length;
 return {
  profile:{available:!!Object.keys(P).length,topLevelFields:Object.keys(P).length,hasBackground:!!P.backgroundProfile,hasBetray:!!P.betray,hasValues:!!P.values||!!P.valuesCore,hasMechanism:!!P.innerMechanism,hasFirstSettings:!!P.firstSet,hasDesireLab:!!P.desireLab},
  stateModel:stateResult?{available:true,states:arr(stateResult.states).length,statesWithSignals:stateResult.coverage&&stateResult.coverage.statesWithSignals||0,families:arr(stateResult.families).length,unknown:arr(stateResult.unknown)}:{available:false,states:0,statesWithSignals:0,families:0,unknown:['Модуль GStateEngine не подключен к этой странице.']},
  reactor:trackerStats(T),
  samost:{available:!!Object.keys(S).length,answerFields:countKeys(samAnswers),completedTopics:doneTopics,totalTopics:topicIds.length,history:arr(S.history).length,allyHistory:arr(S.allyHistory).length,topicIds:Object.keys(completed).filter(function(k){return completed[k]})},
  learning:{available:!!Object.keys(learning).length,completed:countKeys(learning.completed),attempts:countKeys(learning.attempts),practiceFields:countKeys(learning.practice),cards:countKeys(learning.cards)},
  caveats:['Текст свободного дневника не читается и не анализируется автоматически.','Наличие записи не доказывает устойчивую черту или причину поведения.','Пропуск записи не считается отсутствием проблемы или отсутствием действия.']
 };
}
function readSnapshot(){
 var P=parse(PROFILE_KEY),S=parse(SAMOST_KEY),O=ownData();
 return {profile:P,samost:S,own:O,inventory:sourceInventory(P,S),capturedAt:Date.now()};
}
function normalizeEpisode(e){
 e=obj(e);return {id:safeText(e.id,80)||('ep-'+Date.now().toString(36)),createdAt:+e.createdAt||Date.now(),sphere:safeText(e.sphere,40),fact:safeText(e.fact,1200),thought:safeText(e.thought,1000),feeling:safeText(e.feeling,240),action:safeText(e.action,600),need:safeText(e.need,500),rule:safeText(e.rule,500),tag:safeText(e.tag,80).toLowerCase(),counterexample:!!e.counterexample,alternative:safeText(e.alternative,600),reflection:safeText(e.reflection,800)}}
function addEpisode(e){var O=ownData(),x=normalizeEpisode(e);if(!x.fact&&!x.thought&&!x.action)return {ok:false,error:'Добавь хотя бы факт, мысль или действие.'};O.episodes.push(x);if(!saveOwn(O))return {ok:false,error:'Не удалось сохранить запись. Проверь свободное место в браузере.'};return {ok:true,episode:x}}
function deleteEpisode(id){var O=ownData(),before=O.episodes.length;O.episodes=O.episodes.filter(function(e){return e.id!==id});return before!==O.episodes.length&&saveOwn(O)}
function updatePattern(id,status,note){var O=ownData(),p=O.patterns.filter(function(x){return x.id===id})[0];if(!p)return false;p.status=['unreviewed','recognized','partial','rejected','uncertain'].indexOf(status)>=0?status:'unreviewed';p.note=safeText(note,800);p.updatedAt=Date.now();return saveOwn(O)}
function buildPatterns(episodes){
 var groups={};arr(episodes).forEach(function(e){if(!e.tag)return;var k=e.tag;if(!groups[k])groups[k]=[];groups[k].push(e)});
 return Object.keys(groups).map(function(tag){var list=groups[tag],spheres={};list.forEach(function(e){if(e.sphere)spheres[e.sphere]=1});var sphereIds=Object.keys(spheres);return {id:'tag-'+tag,tag:tag,episodes:list.length,spheres:sphereIds,sphereCount:sphereIds.length,eligible:list.length>=2&&sphereIds.length>=2,status:'unreviewed',title:tag,description:'Эта тема отмечена в '+list.length+' эпизодах'+(sphereIds.length?' и '+sphereIds.length+' сферах':'')+'. Это повод исследовать повторение, а не вывод о причине.',evidence:list.map(function(e){return {id:e.id,sphere:e.sphere,fact:e.fact,thought:e.thought,action:e.action,createdAt:e.createdAt,counterexample:e.counterexample}})}}).sort(function(a,b){return b.episodes-a.episodes});
}
function analyze(){
 var snap=readSnapshot(),patterns=buildPatterns(snap.own.episodes),known={};snap.own.patterns.forEach(function(p){known[p.id]=p});
 patterns=patterns.map(function(p){var old=known[p.id]||{};p.status=old.status||'unreviewed';p.note=old.note||'';p.updatedAt=old.updatedAt||null;return p});
 return {inventory:snap.inventory,episodes:snap.own.episodes,patterns:patterns,capturedAt:snap.capturedAt,readOnlySources:true,ownStorageKey:OWN_KEY};
}
g.GPatternMap={version:VERSION,readSnapshot:readSnapshot,analyze:analyze,addEpisode:addEpisode,deleteEpisode:deleteEpisode,updatePattern:updatePattern,storageKey:OWN_KEY,topicNames:TOPIC_NAMES,sphereNames:SPHERES};
})(typeof window!=='undefined'?window:globalThis);
