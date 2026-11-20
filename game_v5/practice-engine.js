/* Каталог и активация практик. История запусков не затирается. Система рекомендует, человек подтверждает или выбирает сам. */
(function(){
'use strict';
var CAT=[
  {id:'signs', lv:1, group:'base', t:'Знаки дня', len:28, load:'2 минуты',
    d:'Записываешь, что в жизни откликнулось на твое желание.',
    why:'Базовая фиксация внимания.',
    effect:'Легче замечать движение к желанию.',
    min:'Одна короткая запись.',
    done:'Хотя бы несколько знаков за цикл.',
    daily:'Запиши один знак дня.'},
  {id:'grat', lv:1, group:'base', t:'Дневник благодарности', len:10, load:'3–5 минут',
    d:'Каждый день минимум 10 благодарностей, цель цикла 50.',
    why:'Базовая опора внимания на то, что уже есть.',
    effect:'Мягче фон дня, больше опоры.',
    min:'Три благодарности.',
    done:'Практика шла задуманное число дней или накопилось 50.',
    daily:'Запиши благодарности дня.'},
  {id:'choose', lv:1, group:'base', t:'Выбираю — делаю — сделано', len:7, load:'5 минут',
    d:'Дела дня по шагам. После каждого третьего появляется строчка с твоим желанием.',
    why:'Собирает внимание на собственных действиях.',
    effect:'Яснее, что ты действительно делаешь.',
    min:'Один шаг «выбрал — сделал».',
    done:'Семь уникальных дней с записью.',
    daily:'Выбери одно дело, сделай, отметь.'},
  {id:'pract', lv:1, group:'base', t:'Вдох-выдох, Я есмь, Тихое внимание', len:7, load:'2 минуты',
    d:'Короткие практики на возвращение в настоящий момент.',
    why:'Базовый возврат в тело и момент.',
    effect:'Больше присутствия.',
    min:'Три медленных вдоха.',
    done:'Семь дней с отметкой.',
    daily:'Сделай короткую практику и поставь отметку.'},
  {id:'brake', lv:2, group:'research', t:'Слова-тормоза', len:7, load:'3 минуты',
    d:'Ловишь слово, которое тормозит, и видишь мягкую замену.',
    why:'Полезно, если в установках часто звучат запреты и «я должен».',
    effect:'Меньше автоматических стоп-фраз.',
    min:'Заметить одно слово-тормоз.',
    done:'Семь дней наблюдений.',
    daily:'Заметь слово и его мягкую замену.',
    need:function(P){return !!(P.lab||P.betray||(P.kmTest&&P.kmTest.v))}},
  {id:'betray', lv:2, group:'research', t:'Что узнаю в себе', len:7, load:'3 минуты',
    d:'Отмечаешь, где сегодня включились перфекционизм, контроль, угождение или онемение.',
    why:'Открывается, если уже было колесо самопредательства.',
    effect:'Быстрее узнаешь привычный ход.',
    min:'Одна отметка.',
    done:'Семь дней с отметкой.',
    daily:'Отметь, что сегодня включилось.',
    need:function(P){return !!(P.betray&&(P.betray.done||P.betray.picked))}},
  {id:'hours', lv:2, group:'research', t:'Блоки времени', len:1, load:'10 минут',
    d:'Почасовая сетка дня: куда уходят время, силы и внимание.',
    why:'Когда неясно, куда девается ресурс времени.',
    effect:'Виднее картина дня.',
    min:'Отметь несколько часов.',
    done:'Один заполненный день.',
    daily:'Заполни сетку дня.'},
  {id:'want', lv:2, group:'research', t:'Собственное хочу', len:7, load:'3 минуты',
    d:'Каждый день коротко записываешь, чего хочешь ты сам, отдельно от чужих ожиданий.',
    why:'Полезно при конфликте своих желаний и обязательств.',
    effect:'Яснее собственный выбор.',
    min:'Одна фраза «я хочу».',
    done:'Семь записей.',
    daily:'Напиши одно свое «хочу» сегодня.',
    need:function(P){return !!(P.desireLab||P.selfWorth||P.interact)}},
  {id:'bounds', lv:2, group:'research', t:'Границы и распределение сил', len:7, load:'3 минуты',
    d:'Замечаешь, где сегодня отдал силы чужому, и выбираешь одну границу.',
    why:'Если часто уходишь в чужие задачи.',
    effect:'Ровнее расход сил.',
    min:'Заметить одно место, где силы ушли вовне.',
    done:'Семь наблюдений.',
    daily:'Отметь границу дня.'}
];

function byId(id){return CAT.filter(function(x){return x.id===id})[0]||null}
function hist(T){T.practHist=T.practHist||[]; return T.practHist}
function act(T){T.act=T.act||{}; return T.act}

function openRun(T,id){var a=act(T)[id]; return a&&!a.stopped?a:null}
function filledOn(T,id,n){
  if(window.prFilledTrack)return window.prFilledTrack(T,id,n);
  var d=(T.days&&T.days[String(n)])||{};
  if(id==='grat')return (d.grat||[]).length>0;
  if(id==='choose')return (d.choose||[]).length>0;
  if(id==='brake')return (d.brakeWords||[]).length>0;
  if(id==='betray')return (d.betrayMarks||[]).length>0;
  if(id==='hours')return d.hours&&Object.keys(d.hours).length>0;
  if(id==='pract')return !!(d.practDone);
  if(id==='signs')return (d.signs||[]).length>0;
  if(id==='want')return !!(d.journal&&d.journal.want);
  if(id==='bounds')return !!(d.journal&&d.journal.bounds);
  return false;
}
function uniqueDays(T,id){
  var h=hist(T).filter(function(x){return x.id===id}), n=0, seen={};
  /* считаем уникальные дни по всем запускам и текущему */
  for(var i=1;i<=28;i++)if(filledOn(T,id,i)){n++; seen[i]=1}
  return n;
}

function unlocked(P,item){
  if(item.lv===1)return true;
  if(item.lv===2)return !item.need||item.need(P);
  return true;
}

function extrasActive(T,n){
  var c=0;
  CAT.forEach(function(x){
    if(x.id==='signs')return;
    var a=openRun(T,x.id);
    if(a&&n>=a.from&&n<a.from+a.len)c++;
  });
  return c;
}

function recs(P,T,n){
  n=n||1;
  var out=[], sim=window.GSim&&GSim.mode(T,n);
  function add(id,reason){
    var it=byId(id); if(!it)return;
    if(openRun(T,id))return;
    out.push({item:it, reason:reason});
  }
  if(sim&&(sim.id==='recovery'||sim.id==='soft')) add('pract','Состояние просит короткую опору, а не новые большие задачи.');
  if(sim&&GSim.lowDays&&GSim.lowDays(T,n,'energy')>=3) add('hours','Энергия низкая несколько дней. Стоит посмотреть, куда уходит ресурс.');
  var fails=(window.GSim&&GSim.lastRes)?GSim.lastRes(T,n,3):[];
  if(fails.filter(function(v){return v==='fail'||v==='min'}).length>=3) add('choose','Три дня не получается шаг. Можно собрать его через «выбираю — делаю».');
  if(P.betray&&(P.betray.done||P.betray.picked)) add('betray','В исследовании уже было колесо самопредательства.');
  if(P.lab||P.kmTest) add('brake','В установках могут звучать слова-тормоза.');
  if(P.desireLab||P.selfWorth) add('want','Исследование желания и самоценности подсказывает практику собственного «хочу».');
  /* уникальные */
  var seen={}; return out.filter(function(x){if(seen[x.item.id])return false; seen[x.item.id]=1; return true}).slice(0,3);
}

function activate(T,id,n){
  var it=byId(id); if(!it)return {ok:false,err:'нет практики'};
  if(id!=='signs'&&extrasActive(T,n)>=2)return {ok:false,err:'Сейчас уже идут две дополнительные практики. Это верхняя граница обычной нагрузки.'};
  var a=act(T);
  a[id]={from:n,len:it.len,at:Date.now()};
  hist(T).push({id:id,from:n,len:it.len,at:Date.now()});
  return {ok:true};
}
function pause(T,id,n){
  var a=act(T)[id]; if(!a)return;
  a.len=Math.max(1,n-a.from+1); a.stopped=Date.now();
  var h=hist(T); for(var i=h.length-1;i>=0;i--){if(h[i].id===id&&!h[i].to){h[i].to=n;h[i].stopped=Date.now();h[i].days=uniqueDays(T,id);break}}
}
function complete(T,id,n){pause(T,id,n)}

function isOn(T,id,n){var a=openRun(T,id); return !!(a&&n>=a.from&&n<a.from+a.len)}

window.GPract={CAT:CAT,byId:byId,recs:recs,unlocked:unlocked,activate:activate,pause:pause,complete:complete,isOn:isOn,openRun:openRun,uniqueDays:uniqueDays,extrasActive:extrasActive,hist:hist,filledOn:filledOn};
})();
