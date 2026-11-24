// Единый профиль и движок персонализации
(function(){
var K='alch_v5_profile';
function load(){var P={};try{P=JSON.parse(localStorage.getItem(K))||{}}catch(e){}
 // миграция старых хранилищ в один профиль
 try{var op=JSON.parse(localStorage.getItem('alch_v5_path')||'null');if(op&&!P.path){P.path=op}localStorage.removeItem('alch_v5_path')}catch(e){}
 var od=localStorage.getItem('alch_v5_day');if(od!==null){P.reactor=P.reactor||{};if(!P.reactor.day)P.reactor.day=+od||0;localStorage.removeItem('alch_v5_day');save(P)}
 if(window.GProfile)P=GProfile.migrate(P);
 return P}
function save(P){if(window.GProfile)P=GProfile.migrate(P);localStorage.setItem(K,JSON.stringify(P))}
function objectLike(v){return !!v&&typeof v==='object'&&!Array.isArray(v)}
var EXTRA_KEYS=['alch_samost','alch_v5_hold','alch_v5_belief_lab_v1','alch_v5_belief_lab_backup_v1','alch_v5_sound','alch_v5_theme','alch_v5_book_seen','alch_v5_birth_preview_v1'];
var EXTRA_PREFIXES=['alch_v5_scroll_'];
function isExtraKey(k){return EXTRA_KEYS.indexOf(k)>=0||EXTRA_PREFIXES.some(function(prefix){return k.indexOf(prefix)===0})}
function collectExtraLocal(){
 var local={};
 EXTRA_KEYS.forEach(function(k){local[k]=localStorage.getItem(k)});
 try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&EXTRA_PREFIXES.some(function(prefix){return k.indexOf(prefix)===0}))local[k]=localStorage.getItem(k)}}catch(e){}
 return local;
}
function validImport(P){
 if(!objectLike(P))return false;
 if(P.schemaVersion!=null&&(!isFinite(+P.schemaVersion)||+P.schemaVersion<0||+P.schemaVersion>(window.GProfile&&GProfile.schemaVersion||3)))return false;
 if(P.wheel!=null&&!Array.isArray(P.wheel))return false;
 if(P.arts!=null&&!Array.isArray(P.arts))return false;
 if(P.tracker!=null&&!objectLike(P.tracker))return false;
 if(P.trackerHistory!=null&&!Array.isArray(P.trackerHistory))return false;
 if(P.cycleHistory!=null&&!Array.isArray(P.cycleHistory))return false;
 if(P.modules!=null&&!objectLike(P.modules))return false;
 if(P.diary!=null&&!objectLike(P.diary))return false;
 if(P.fractal!=null&&!objectLike(P.fractal))return false;
 if(P.lab!=null&&!objectLike(P.lab))return false;
 return true;
}
function snapshotAll(){
 return {format:'put-alhimika-backup',version:2,profile:load(),local:collectExtraLocal()};
}
function decodeSnapshot(data){
 if(objectLike(data)&&data.format==='put-alhimika-backup'&&(data.version===1||data.version===2)){
  if(!validImport(data.profile)||!objectLike(data.local))throw new Error('invalid backup envelope');
  Object.keys(data.local).forEach(function(k){
   if(!isExtraKey(k))throw new Error('unknown local module key');
   var v=data.local[k];if(v!==null&&typeof v!=='string')throw new Error('invalid local module data');
  });
  return {profile:data.profile,local:data.local,version:data.version};
 }
 if(validImport(data))return {profile:data,local:null,version:0};
 throw new Error('invalid profile structure');
}
function applySnapshot(s){
 if(s.local){
  /* Version 2 is a complete snapshot of app-managed standalone keys.
     Version 1 is partial: preserve settings/reading progress it never exported. */
  if(s.version>=2){
   var remove=[];
   try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&isExtraKey(k)&&!Object.prototype.hasOwnProperty.call(s.local,k))remove.push(k)}}catch(e){}
   remove.forEach(function(k){localStorage.removeItem(k)});
  }
  Object.keys(s.local).forEach(function(k){var v=s.local[k];if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)});
 }
 save(s.profile);
}
function backupCurrent(){
 var raw=JSON.stringify(snapshotAll());
 var backups=[];
 try{backups=JSON.parse(localStorage.getItem('alch_v5_profile_backups')||'[]')}catch(e){backups=[]}
 if(!Array.isArray(backups))backups=[];
 backups.push({at:Date.now(),raw:raw});
 backups=backups.slice(-3);
 localStorage.setItem('alch_v5_profile_backups',JSON.stringify(backups));
 return raw;
}
window.GPro={
 load:load,save:save,
 exportFile:function(){var b=new Blob([JSON.stringify(snapshotAll(),null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='put-alhimika-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1000)},
 importFile:function(f,cb){
  if(!f||f.size>20*1024*1024){cb&&cb(false);return}
  var r=new FileReader();
  r.onerror=function(){cb&&cb(false)};
  r.onload=function(){
   var snap,raw;
   try{
    snap=decodeSnapshot(JSON.parse(r.result));
    raw=backupCurrent();
    try{applySnapshot(snap)}catch(e){try{applySnapshot(decodeSnapshot(JSON.parse(raw)))}catch(ignore){}throw e}
    cb&&cb(true);
   }catch(e){cb&&cb(false)}
  };
  r.readAsText(f);
 },
 restoreBackup:function(cb){
  var raw=null;
  try{
   var backups=JSON.parse(localStorage.getItem('alch_v5_profile_backups')||'[]');
   if(!Array.isArray(backups)||!backups.length)throw new Error('no backup');
   var target=backups[backups.length-1],snap=decodeSnapshot(JSON.parse(target.raw));
   raw=JSON.stringify(snapshotAll());
   backups.push({at:Date.now(),raw:raw});
   localStorage.setItem('alch_v5_profile_backups',JSON.stringify(backups.slice(-3)));
   try{applySnapshot(snap)}catch(e){try{applySnapshot(decodeSnapshot(JSON.parse(raw)))}catch(ignore){}throw e}
   cb&&cb(true);
  }catch(e){cb&&cb(false)}
 }
};

// Библиотека установок: 6 частей, ветка, практики
var PAT={
resp:{n:'Гиперответственность',br:'Ответственность и границы',art:'Меч',
 parts:[['Триггер','Кто-то рядом не справляется или недоволен'],['Реакция','Беру на себя, спасаю, доделываю за других'],['Скрытое правило','Если не я, то все рухнет'],['Выгода','Чувствую контроль и свою нужность'],['Цена','Усталость, на свое не остается сил'],['Новая настройка','Я отвечаю за свои решения, другие за свои']],
 pr:['Перед тем как помочь, спроси себя: «Меня просили?»','Отдай одну задачу другому человеку и не переделывай','Скажи «нет» одной просьбе, без долгих объяснений','Запиши: что сегодня было мое, а что чужое','Оставь одно дело несделанным и посмотри, что случится','Попроси о помощи в одном вопросе','Час только на себя, без пользы для других']},
err:{n:'Страх ошибки',br:'Безопасный эксперимент',art:'Ключ',
 parts:[['Триггер','Новое дело или оценка со стороны'],['Реакция','Откладываю, перепроверяю, не начинаю'],['Скрытое правило','Ошибка докажет, что я плохая'],['Выгода','Никто не увидит промаха'],['Цена','Стою на месте, идеи не сбываются'],['Новая настройка','Ошибка это информация для следующего шага']],
 pr:['Сделай одно дело на 70% и отпусти','Покажи кому-то черновик, а не готовое','Запиши одну ошибку дня и что она подсказала','Попробуй новый способ в мелочи','Начни дело за 5 минут, без подготовки','Скажи вслух: «Я могу ошибиться, и это нормально»','Отметь три вещи, которые получились неидеально, но работают']},
appr:{n:'Зависимость от одобрения',br:'Самоценность и свой выбор',art:'Зеркало',
 parts:[['Триггер','Кто-то оценивает мой выбор'],['Реакция','Подстраиваюсь, жду похвалы, оправдываюсь'],['Скрытое правило','Меня любят, только если я это заслужу'],['Выгода','Чувство принадлежности и безопасности'],['Цена','Живу чужой жизнью, свое «хочу» молчит'],['Новая настройка','Моя ценность не зависит от одобрения']],
 pr:['Прими одно решение, ни с кем не советуясь','Не рассказывай о своем успехе, просто отметь его для себя','Напиши три вещи, за которые ценишь себя без чужой оценки','Выскажи свое мнение, когда оно отличается','Сделай то, что нравится тебе, а не «правильно»','На похвалу ответь «спасибо», без «да ну, ерунда»','Вечером спроси себя: «Чего мне сегодня хотелось на самом деле?»']},
deval:{n:'Обесценивание хорошего',br:'Принятие результата',art:'Источник',
 parts:[['Триггер','Мне говорят хорошее или у меня получилось'],['Реакция','Отмахиваюсь: «это мелочь», «повезло»'],['Скрытое правило','Со мной что-то не так, хорошее не про меня'],['Выгода','Не разочаруюсь, если потом не выйдет'],['Цена','Не чувствую опоры, сил и радости'],['Новая настройка','Я принимаю свое хорошее, оно настоящее']],
 pr:['Запиши три своих успеха дня, даже маленьких','Прими комплимент молча, с улыбкой','Расскажи кому-то о своем результате','Перечитай вечером, что сегодня получилось','Купи или сделай себе приятное за сделанное','Найди в себе одно качество, которым гордишься','Скажи себе: «Это мой результат»']},
others:{n:'Ориентация на чужие желания',br:'Разделение «надо» и «хочу»',art:'Компас',
 parts:[['Триггер','Надо выбрать для себя'],['Реакция','Выбираю то, чего ждут другие'],['Скрытое правило','Сначала все остальные, потом я'],['Выгода','Нет конфликтов, меня считают хорошей'],['Цена','Не знаю, чего хочу на самом деле'],['Новая настройка','Мои интересы тоже имеют значение']],
 pr:['Перед решением спроси: «Это мое хочу или чужое надо?»','Выпиши 5 «надо» и вычеркни одно','Сделай одну вещь только потому, что хочется','Выбери еду, фильм или маршрут первой','Скажи о своем желании вслух','Замени одно «я обязана / обязан» на «я выбираю»','Вечером отметь, что сегодня было по твоему желанию']},
avoid:{n:'Избегание действий',br:'Малые шаги',art:'Ключ',
 parts:[['Триггер','Важное дело, которое пугает'],['Реакция','Отвлекаюсь, отстраняюсь, «потом»'],['Скрытое правило','Если не трогать, будет безопаснее'],['Выгода','Нет тревоги прямо сейчас'],['Цена','Дела копятся, растет вина'],['Новая настройка','Маленький шаг сейчас лучше большого никогда']],
 pr:['Сделай первый шаг важного дела за 2 минуты','Поставь таймер на 10 минут и начни','Разбей страшное дело на три кусочка','Сделай самое неприятное утром','Назови вслух, чего избегаешь','Отметь, как стало после шага','Похвали себя за начало, а не за результат']}
};
var female=false;try{female=(JSON.parse(localStorage.getItem('alch_v5_profile'))||{}).gender==='f'}catch(e){}
PAT.err.parts[2][1]=female?'Ошибка докажет, что я плохая':'Ошибка докажет, что я плохой';
PAT.others.parts[3][1]=female?'Нет конфликтов, меня считают хорошей':'Нет конфликтов, меня считают хорошим';
PAT.others.pr[3]=female?'Выбери еду, фильм или маршрут первой':'Выбери еду, фильм или маршрут первым';
window.GPAT=PAT;

// Расчет: ведущая установка и очередь
function calc(P){P=P||load();var K=['resp','err','appr','deval','others','avoid'],src={},why={};
 function put(name,k,v,t){if(!(v>0))return;src[name]=src[name]||{};src[name][k]=(src[name][k]||0)+v;(why[k]=why[k]||[]).push(t)}
 var e=P.ego||{},sc=e.sc||{},md=e.md||{};
 var map={ct:'resp',st:'appr',sb:'others',df:'deval',ab:'appr'};
 Object.keys(sc).forEach(function(k){if(map[k])put('ego',map[k],(sc[k]||0)/6,'фоновый узор')});
 if(e.v===2&&e.scores){var am={A1:'deval',A2:'appr',A3:'appr',A4:'resp',A5:'others',A6:'avoid',A7:'resp',A8:'deval',A9:'resp',A10:'others',A11:'resp'};Object.keys(am).forEach(function(k){put('ego',am[k],(e.scores[k]||0)/6,'фоновое состояние')})}
 var bb=(P.archB&&P.archB.scores)||null;if(bb){var bm={B1:'appr',B2:'others',B3:'err',B4:'avoid',B5:'resp',B7:'avoid'};Object.keys(bm).forEach(function(k){put('mode',bm[k],(bb[k]||0)/4,'привычный ход')})}
 var mt=(md.vc||0)+(md.dp||0)+(md.cr||0)+(md.ha||0);if(mt){put('mode','err',(md.cr||0)/mt,'строгий критик');put('mode','avoid',(md.dp||0)/mt,'отстраненный защитник')}
 if(P.dq&&P.dq.accepted!=null&&P.dq.accepted<70)put('dq','deval',(70-P.dq.accepted)/70,'смахивает свое хорошее');
 if(P.egoSelf&&P.egoSelf.match!=null&&P.egoSelf.match<7)put('es','others',(7-P.egoSelf.match)/7,'путает Эго и Самость');
 var w=P.wheel||[];if(w.length===8){var lo=w.filter(function(x){return x<=3}).length;if(lo>=3)put('wheel','avoid',(lo-2)/6,'много низких сфер')}
 var s={},n={};K.forEach(function(k){s[k]=0;n[k]=0});
 Object.keys(src).forEach(function(nm){K.forEach(function(k){var v=Math.min(1,src[nm][k]||0);if(v){s[k]+=v;n[k]++}})});
 K.forEach(function(k){s[k]=Math.round(s[k]*100)/100});
 var ord=K.slice().sort(function(a,b){return s[b]-s[a]||n[b]-n[a]});
 var weak=!s[ord[0]];if(weak)ord=['appr','resp','others','deval','err','avoid'];
 var tie=!weak&&s[ord[1]]===s[ord[0]];
 return {lead:ord[0],queue:ord.slice(1),score:s,sources:n,why:why,weak:weak,tie:tie,ver:2}}
function inKey(P){var k=[P.ego&&P.ego.sc,P.ego&&P.ego.md,P.dq&&P.dq.accepted,P.egoSelf&&P.egoSelf.match,P.wheel];if(P.ego&&P.ego.v===2||P.archB)k.push(P.ego&&P.ego.scores,P.archB&&P.archB.scores);return JSON.stringify(k)}
window.GCalc=calc;
window.GLead=function(){var P=load(),k=inKey(P);if(!P.lab||!P.lab.lead||(P.lab.agree==null&&(P.lab.cycle||1)<=1&&P.lab.key!==k)){var c=calc(P),L=P.lab||{};P.lab={lead:c.lead,queue:c.queue,score:c.score,sources:c.sources,weak:c.weak,tie:c.tie,key:k,cycle:L.cycle||1,agree:null,done:L.done};save(P)}return P.lab};

// Противоречие одной фразой
var WN=['Здоровье','Финансы','Карьера','Отношения','Семья','Друзья','Рост','Отдых'];
window.GContra=function(){
 var P=load(),L=GLead(),p=PAT[L.lead],v=(P.valuesCore&&P.valuesCore.top3&&P.valuesCore.top3[0])||(P.values&&P.values.order||[])[0]||'свобода';
 var E=(P.fractal&&P.fractal.evidence)||[],names={health:'Здоровье',money:'Финансы',work:'Карьера',relationships:'Отношения',family:'Семья',environment:'Друзья',self_development:'Рост',rest:'Отдых'};
 var spheres=E.map(function(x){return names[x.sphere]}).filter(Boolean),basis='';
 if(P.lab&&P.lab.foundStatus==='insufficient')basis='Основание пока не определилось — это открытый вопрос.';
 else if(P.lab&&P.lab.foundFeedback==='no')basis='Предложенное объяснение основания не откликнулось; его не нужно принимать.';
 else if(P.lab&&P.lab.found&&P.lab.found!=='none')basis='Есть предварительная гипотеза об основании реакции; ее стоит сверять с конкретными обстоятельствами.';
 var own=P.lab&&P.lab.ownCorrection?String(P.lab.ownCorrection).replace(/[&<>\"']/g,function(c){return c==='&'?'&amp;':c==='<'?'&lt;':c==='>'?'&gt;':c==='\"'?'&quot;':'&#39;'}):'',rule=own?'собственная формулировка «'+own+'»':'возможное правило «'+p.parts[2][1].toLowerCase()+'»';
 return 'Среди твоих трех ориентиров — ценность «'+v+'». Ведущая гипотеза Точки Б — '+rule+'.'+(spheres.length?' Ты решил'+(female?'а':'')+' проверить повторение схемы в сферах: '+spheres.join(', ')+'.':'')+(basis?' '+basis:' Это рабочая гипотеза, а не окончательное описание тебя.') ;
};

// Задания Реактора на день
window.GDay=function(n){var P=load(),L=GLead(),p=PAT[L.lead],f=P.focuses||[];
 return {morning:'Сканер состояния: «Я есмь», три вдоха и честное «как я сейчас»',
  day:p.pr[n%p.pr.length],
  focus:f.length?('Шаг по направлению «'+f[n%f.length]+'»'):'Один шаг к цели',
  evening:'Запись в дневник: где сегодня включилось правило «'+p.parts[2][1].toLowerCase()+'» и какой выбор я '+(female?'сделала':'сделал')}};
})();
