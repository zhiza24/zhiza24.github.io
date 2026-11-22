/* Трекер 28 дней: календарь 4x7, ритуал желания (подсказка + знаки), бегунки, графики, отметки прогресса. */
(function(){
'use strict';
var KEY='alch_v5_profile';
var HINTS=[
  "Сегодня обратите внимание на встречи и разговоры: среди них может появиться полезная идея.",
  "Если заметите совпадение или повторяющийся мотив, можно записать его без попытки сразу объяснить.",
  "Случайная фраза, статья или предложение могут подсказать новый ракурс. Достаточно отметить это.",
  "Обратите внимание на телесные ощущения: какое состояние помогает приблизиться к желаемому?",
  "Если появится небольшая возможность, оцените, подходит ли она твоим обстоятельствам.",
  "Возможно, сегодня найдется один небольшой шаг к желаемому. Он не обязан быть большим.",
  "В разговоре может прозвучать полезная мысль. Можно сохранить ее и вернуться позже.",
  "Если встретится книга, публикация или разговор на знакомую тему, обратите внимание на важную деталь.",
  "Если возникнет развилка, не торопитесь. Сначала можно заметить, какой вариант кажется более подходящим.",
  "Обратите внимание, что происходит в теле, когда ты думаешь о желаемом.",
  "Опыт другого человека может подсказать направление. Не обязательно повторять его путь.",
  "Если услышите фразу, которая зацепила внимание, запишите ее своими словами.",
  "Свободное окно или приглашение можно рассмотреть как возможность, а не обязательство.",
  "Отметьте, что уже сделано сегодня и что немного приблизило тебя к желаемому.",
  "Интонация или слова собеседника могут дать новую информацию. Сохраните то, что оказалось полезным.",
  "Старые записи или заметки могут напомнить о том, что раньше было важно.",
  "Обратите внимание на доступные ресурсы: контакт, инструмент, время или помощь.",
  "В первые минуты после пробуждения можно заметить образ или чувство, связанное с твоим желанием.",
  "Если день принесет необычное совпадение, можно записать его без поспешных выводов.",
  "Небольшой жест заботы о себе может сделать день приятнее. Выбери то, что доступно.",
  "Можно спокойно обозначить свое направление человеку, которому ты доверяешь.",
  "Информация может прийти из неожиданного источника. Сохраняйте любопытство и проверяйте факты.",
  "Если появится возможность попробовать новый формат, оцените, подходит ли он Вам сейчас.",
  "Заметьте момент, когда становится спокойнее или яснее. Возможно, это подскажет следующий шаг.",
  "Разговор или встреча могут соединить знакомые идеи. Запишите то, что хочется обдумать.",
  "Сегодня можно уделить несколько минут тому, что давно хотелось попробовать.",
  "Если планы изменятся, посмотрите, какие варианты остаются доступными.",
  "В конце дня отметьте один момент, который хочется сохранить в памяти."
];
var MET=[
  {key:'energy', name:'Энергия', sub:'сколько сил сейчас есть', color:'#C4A35A', low:'Сил мало. Может, сейчас достаточно короткой паузы «Вдох-выдох».'},
  {key:'mood', name:'Настроение', sub:'какой тон дня', color:'#7FA968', low:'День может быть непростым. Не обязательно ничего форсировать: достаточно заметить свое состояние.'},
  {key:'well', name:'Самочувствие', sub:'как тело откликается', color:'#6C86A0', low:'Телу может быть нужна вода, воздух или короткая опора. Один маленький жест уже достаточно.'},
  {key:'presence', name:'Присутствие', sub:'насколько ты присутствуешь в моменте', color:'#B4552D', low:'Внимание рассеялось. Несколько медленных вдохов могут помочь вернуться к текущему моменту.'},
  {key:'support', name:'Внутренняя опора', sub:'насколько ощущается внутренняя опора', color:'#C47A8A', low:'Внутренняя опора может ощущаться непрочной. Иногда достаточно одного небольшого собственного выбора.'}
];
var MARKS=[
  {id:'better', t:'стало лучше'},
  {id:'habit', t:'привычка закрепляется'},
  {id:'solved', t:'вопрос решился'}
];
var SIGN_TAGS=['встреча','совпадение','информация','возможность','чувство'];
var BONUS_HINT='Эта строка — подсказка для внимания. Когда желание остается в поле зрения, легче замечать связанные с ним идеи, людей и возможности. Отмечайте то, что оказалось значимым, и продолжайте: выбираю, делаю, сделано.';
var WD=['пн','вт','ср','чт','пт','сб','вс'];

function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(P){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function gx(s){return String(s).replace(/\{([^|]*)\|([^}]*)\}/g,function(_,m,f){return window.GG?GG(m,f):m})}
function tick(){if(window.GSound&&!GSound.isOn())return;try{var C=window.AudioContext||window.webkitAudioContext;if(!C)return;var c=new C(),o=c.createOscillator(),g=c.createGain();o.frequency.value=660;g.gain.value=0.04;o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+0.05)}catch(e){}}
function uid(){return 't'+Date.now().toString(36)+Math.random().toString(36).slice(2,5)}

function ensure(){
  var P=load();
  P.tracker=P.tracker||{};
  var T=P.tracker;
  if(!T.days)T.days={};
  if(!T.proofs)T.proofs=[];
  if(!T.practices)T.practices={};
  if(!T.ifthens)T.ifthens=['','',''];
  if(!T.hiddenMet)T.hiddenMet={};
  if(!T.openDay)T.openDay=0;
  if(!T.view)T.view='month';
  if(T.declared&&T.directions&&T.directions.length===3&&!T.start)T.start=Date.now();
  if(window.GStrategy){try{
    if(!T.strategy){T.strategy=GStrategy.build(P);if(!T.start)T.start=Date.now()}
    else{
      var ds=((T.directions)||[]).map(function(x){return typeof x==='string'?{id:x,text:x}:{id:(x&&x.id)||'',text:(x&&(x.text||x.t||x.name))||''}}).filter(function(x){return x.text});
      if(ds.length===3){
        T.strategy.stars=ds.map(function(d){return {id:d.id,text:d.text}});
        if(T.strategy.focus&&T.strategy.focus.length){
          T.strategy.focus=T.strategy.focus.map(function(x,i){if(!ds[i])return x;return {k:x.k,t:ds[i].text,g:x.g,src:x.src||x.t,wish:ds[i].text}});
        }
      }
    }
  }catch(e){}}
  if(!T.act){T.act={signs:{from:1,len:28}}}
  if(!T.practHist)T.practHist=[];
  if(!T.space){
    if(T.view==='practs')T.space='lab';
    else if(T.view==='monthg'||T.view==='finale')T.space='path';
    else if(T.view==='week'||T.view==='month')T.space='map';
    else T.space='day';
  }
  var filled=0; for(var i=1;i<=28;i++){var dd=T.days[String(i)]; if(dd&&(dd.res||dd.wishMark||(dd.signs&&dd.signs.length)))filled++}
  if(filled>0)T.strategySeen=true;
  return P;
}
function Tget(P){return (P||ensure()).tracker}
function dayRec(T,n){
  var k=String(n);
  if(!T.days[k])T.days[k]={sliders:{},signs:[],choose:[],grat:[],hours:{},dirSteps:['','',''],dirState:['','',''],dirMarks:['','',''],wishMark:'',hintSeen:false,note:'',ifFire:['','',''],journal:{}};
  var d=T.days[k];
  if(!d.journal)d.journal={};
  if(!d.sliders)d.sliders={};
  if(!d.signs)d.signs=[];
  if(!d.choose)d.choose=[];
  if(!d.grat)d.grat=[];
  if(!d.hours)d.hours={};
  if(!d.dirSteps)d.dirSteps=['','',''];
  if(!d.dirState)d.dirState=['','',''];
  if(!d.dirMarks)d.dirMarks=['','',''];
  return d;
}
function todayNum(T){
  if(!T.start)return 1;
  var n=Math.floor((Date.now()-T.start)/86400000)+1;
  if(n<1)return 1; if(n>28)return 28; return n;
}
function hintOf(n){return gx(HINTS[Math.max(0,Math.min(27,n-1))])}

function allGrat(T){var n=0;for(var i=1;i<=28;i++)n+=(dayRec(T,i).grat||[]).length;return n}
function proofsAdd(T,text,n){T.proofs.push({t:Date.now(),day:n,text:text});}

function sliderHint(m,v){if(v>0&&v<=3)return gx(m.low);return ''}

/* ---------- graphs ---------- */
function series(T,from,to,key){
  var out=[];
  for(var i=from;i<=to;i++){
    var d=dayRec(T,i), v=null;
    if(key.indexOf('s.')===0){var sk=key.slice(2);v=d.sliders[sk]; if(v==null||v==='')v=null; else v=+v;}
    else if(key==='signs')v=(d.signs||[]).length;
    else if(key==='grat')v=(d.grat||[]).length;
    else if(key==='steps')v=(d.dirState||[]).filter(function(x){return x==='done'}).length;
    else if(key==='choose')v=(d.choose||[]).filter(function(x){return x.status==='done'||x.status==='switched'}).length;
    else if(key==='wishMark')v=d.wishMark?1:0;
    else if(key.indexOf('mark.')===0){var ix=+key.slice(5);v=(d.dirMarks&&d.dirMarks[ix])?1:0;}
    out.push({x:i,y:v});
  }
  return out;
}
var GMET=[
  {key:'s.energy', name:'Энергия', color:'#C4A35A'},
  {key:'s.mood', name:'Настроение', color:'#7FA968'},
  {key:'s.well', name:'Самочувствие', color:'#6C86A0'},
  {key:'s.presence', name:'Присутствие', color:'#B4552D'},
  {key:'signs', name:'Знаки дня', color:'#f0c870'},
  {key:'steps', name:'Шаги направлений', color:'#78b995'},
  {key:'grat', name:'Благодарности', color:'#d48eaa'},
  {key:'choose', name:'Сделано дел', color:'#77a9d3'},
  {key:'wishMark', name:'Прогресс желания', color:'#e08a50'}
];
function svgChart(T,from,to,hidden,title){
  var W=320,H=180,padL=28,padR=8,padT=16,padB=28;
  var iw=W-padL-padR, ih=H-padT-padB;
  var days=to-from+1;
  var mets=GMET.filter(function(m){return !hidden[m.key]});
  var max=1;
  mets.forEach(function(m){series(T,from,to,m.key).forEach(function(p){if(p.y!=null&&p.y>max)max=p.y})});
  if(max<10)max=10;
  var grid='', xa='';
  for(var g=0;g<=4;g++){
    var y=padT+ih-ih*(g/4);
    grid+='<line class="g-grid" x1="'+padL+'" y1="'+y+'" x2="'+(W-padR)+'" y2="'+y+'"/>';
    grid+='<text fill="#c9a46a" font-size="11" font-family="Manrope,sans-serif" x="2" y="'+(y+4)+'">'+Math.round(max*g/4)+'</text>';
  }
  for(var i=0;i<days;i++){
    var x=padL+(days===1?iw/2:iw*i/Math.max(days-1,1));
    if(days<=7||i===0||i===days-1||(i+from)%7===0)xa+='<text fill="#c9a46a" font-size="11" font-family="Manrope,sans-serif" text-anchor="middle" x="'+x+'" y="'+(H-6)+'">'+(from+i)+'</text>';
  }
  var lines=mets.map(function(m){
    var pts=series(T,from,to,m.key);
    var d='',dots='';
    pts.forEach(function(p,i){
      if(p.y==null)return;
      var x=padL+(days===1?iw/2:iw*i/Math.max(days-1,1));
      var y=padT+ih-ih*(p.y/max);
      d+=(d?' L':'M')+x.toFixed(1)+','+y.toFixed(1);
      dots+='<circle class="g-dot" cx="'+x+'" cy="'+y+'" r="3.2" fill="'+m.color+'"/>';
    });
    return (d?'<path class="g-line" d="'+d+'" stroke="'+m.color+'"/>':'')+dots;
  }).join('');
  var legend='<div class="t28-legend">'+GMET.map(function(m){
    var on=!hidden[m.key];
    return '<button type="button" class="'+(on?'on':'')+'" data-act="tog-met" data-k="'+m.key+'"><i style="background:'+m.color+'"></i>'+esc(m.name)+'</button>';
  }).join('')+'</div>';
  return '<div class="t28-graph">'+(title?'<div class="dk">'+esc(title)+'</div>':'')+legend+
    '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(title)+'">'+grid+'<line class="g-axis" x1="'+padL+'" y1="'+(padT+ih)+'" x2="'+(W-padR)+'" y2="'+(padT+ih)+'"/>'+lines+xa+'</svg></div>';
}

/* ---------- render ---------- */
var host=null;
function mount(el){host=el; var P=ensure(); var T=Tget(P); if(T.openDay==null)T.openDay=0;try{if(location.search.indexOf('view=mirror')>=0){T.space='mirror';T.view='mirror'}}catch(e){} save(P); render()}

function spacesNav(space){
  var active=space==='path'?'results':space==='lab'?'practs':space;
  var tabs=[['day','Мой день'],['diary','Дневник'],['directions','Мои направления'],['practs','Практики'],['labs','Лаборатории'],['results','Результаты']];
  return '<nav class="spaces">'+tabs.map(function(t){return '<button type="button" class="'+(active===t[0]?'on':'')+'" data-act="space" data-s="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</nav>';
}
function injectNav(html,space){
  return String(html).replace('<div class="t28">','<div class="t28">'+spacesNav(space)).replace('<div class="t28 res">','<div class="t28 res">'+spacesNav(space));
}
function render(){
  if(!host)return;
  var P=ensure(), T=Tget(P);
  if(T.archiveIndex!=null){host.innerHTML=viewArchive(P,T);bind();return;}
  if(!T.strategySeen&&T.strategy&&window.GStrategy&&T.view!=='mirror'&&T.space!=='mirror'){
    host.innerHTML=viewStrategy(P,T); bind(); return;
  }
  if(T.view==='settings'){host.innerHTML=viewSettings(P,T); bind(); return}
  if(T.view==='review'){host.innerHTML=viewReview(P,T); bind(); return}
  if(T.view==='week'){host.innerHTML=injectNav(viewWeek(P,T),'map'); bind(); return}
  var space=T.space||'day';
  if(space==='labs'||T.view==='labs'){host.innerHTML=injectNav(viewLabs(P,T),'labs'); bind(); return}
  if(space==='practs'||space==='lab'||T.view==='practs'){host.innerHTML=injectNav(viewPracts(P,T),'practs'); bind(); return}
  if(space==='diary'||T.view==='diary'){host.innerHTML=injectNav(viewDiary(P,T),'diary'); bind(); return}
  if(space==='directions'||T.view==='directions'){host.innerHTML=injectNav(viewDirections(P,T),'directions'); bind(); return}
  if(space==='hero'){host.innerHTML=injectNav(viewHero(P,T),'day'); bind(); return}
  if(space==='mirror'||T.view==='mirror'){host.innerHTML=injectNav(viewMirror(P,T),'results'); bind(); return}
  if(space==='results'||space==='path'||T.view==='monthg'||T.view==='finale'){host.innerHTML=injectNav(viewResults(P,T),'results'); bind(); return}
  if(space==='map'){host.innerHTML=injectNav(viewMonth(P,T),'diary'); bind(); return}
  host.innerHTML=injectNav(viewDay(P,T),'day'); bind();
}
function viewStrategy(P,T){
  var h='<div class="t28">'+((window.GStrategy&&GStrategy.html)?GStrategy.html(T.strategy):'<h1>Твоя стратегия готова</h1>');
  h+='<button class="go" type="button" data-act="start-cycle">Начать 28 дней</button></div>';
  return h;
}

function wishText(T){return (T.declared&&(T.declared.text||T.declared.raw))||''}
function dirs(T){return ((T&&T.directions)||[]).map(function(d){if(typeof d==='string')return {id:d,text:d};return {id:(d&&d.id)||'',text:(d&&(d.text||d.t||d.name))||''}}).filter(function(d){return d.text})}

function dayFilled(T,n){
  var d=dayRec(T,n);
  if(d.hintSeen||d.wishMark||d.note||d.res)return true;
  if((d.signs||[]).length||(d.grat||[]).length||(d.choose||[]).length||(d.brakeWords||[]).length||(d.betrayMarks||[]).length)return true;
  if((d.dirState||[]).some(function(s){return s==='done'||s==='do'}))return true;
  if((d.dirMarks||[]).some(function(s){return !!s}))return true;
  var sl=d.sliders||{};
  for(var k in sl){if(sl[k]!=null&&sl[k]!=='')return true}
  var hrs=d.hours||{};
  for(k in hrs){if(hrs[k]&&hrs[k].text)return true}
  return false;
}
function filledCount(T){var n=0;for(var i=1;i<=28;i++)if(dayFilled(T,i))n++;return n}
function streakOf(T){
  var t=todayNum(T),s=0;
  for(var i=t;i>=1;i--){if(dayFilled(T,i))s++;else break}
  return s;
}
var LEVELS=[{min:0,t:'Искра'},{min:2,t:'След'},{min:7,t:'Тропа'},{min:14,t:'Путь'},{min:21,t:'Русло'},{min:28,t:'Круг'}];
function levelOf(n){
  var L=LEVELS[0];
  for(var i=0;i<LEVELS.length;i++)if(n>=LEVELS[i].min)L=LEVELS[i];
  return L;
}
function growthHtml(T){
  var n=filledCount(T), L=levelOf(n), st=streakOf(T);
  var dots=LEVELS.map(function(lv,i){return '<i class="'+(n>=lv.min?'on':'')+'"></i>'}).join('');
  return '<div class="growth"><span class="dots">'+dots+'</span><b>'+esc(L.t)+'</b>'+(st>1?'<span>серия '+st+'</span>':'')+'</div>';
}

function cellMark(T,n){
  var d=dayRec(T,n);
  if((d.signs||[]).length)return '<i class="star"></i>';
  if(dayFilled(T,n))return '<i class="dot"></i>';
  return '';
}

function weekPlan(T,w){
  T.weekPlans=T.weekPlans||{};
  var k=String(w);
  if(!T.weekPlans[k])T.weekPlans[k]={actions:['','',''],done:[false,false,false],review:{worked:'',stuck:'',next:''}};
  var p=T.weekPlans[k];
  if(!p.actions)p.actions=['','',''];
  if(!p.done)p.done=[false,false,false];
  if(!p.review)p.review={worked:'',stuck:'',next:''};
  return p;
}
function weekScore(T,w){
  var p=weekPlan(T,w),total=0,ok=0;
  (p.actions||[]).forEach(function(t,i){if(String(t||'').trim()){total++; if(p.done[i])ok++}});
  if(!total)return null;
  return Math.round(ok/total*100);
}
function weekNums(T,week){
  var a=(week-1)*7+1, b=week*7, signs=0, grat=0, steps=0, marks=0, brakes=0;
  for(var i=a;i<=b;i++){
    var d=dayRec(T,i);
    signs+=(d.signs||[]).length; grat+=(d.grat||[]).length;
    steps+=(d.dirState||[]).filter(function(x){return x==='done'}).length;
    if(d.wishMark)marks++;
    (d.dirMarks||[]).forEach(function(x){if(x)marks++});
    brakes+=(d.brakeWords||[]).length;
  }
  return {signs:signs,grat:grat,steps:steps,marks:marks,brakes:brakes,score:weekScore(T,week)};
}
function numsHtml(N){
  var items=[['Знаки',N.signs],['Шаги',N.steps]];
  if(N.score!=null)items.push(['План',N.score+'%']);
  else items.push(['Отметки',N.marks]);
  items.push(['Благодарности',N.grat]);
  return '<div class="nums">'+items.map(function(x){return '<div><b>'+esc(String(x[1]))+'</b><span>'+esc(x[0])+'</span></div>'}).join('')+'</div>';
}

var BRAKES=[
  {id:'must', t:'я должен / я должна', s:'я выбираю'},
  {id:'cant', t:'я не могу', s:'я пока не умею'},
  {id:'choice', t:'у меня нет выбора', s:'я могу выбрать иначе'},
  {id:'try', t:'я попробую', s:'я сделаю маленький шаг'},
  {id:'late', t:'я не успеваю', s:'я выбираю одно'},
  {id:'hard', t:'это слишком сложно', s:'я разобью на мельче'},
  {id:'all', t:'все или ничего', s:'достаточно одного шага'},
  {id:'forbid', t:'мне нельзя', s:'я разрешаю себе'},
  {id:'always', t:'я всегда так', s:'сегодня могу иначе'},
  {id:'later', t:'не сейчас', s:'могу начать с малого'}
];
var BETRAY=[
  {id:'perf', t:'Перфекционизм', d:'еще не идеально — и поэтому можно не начинать'},
  {id:'ctrl', t:'Контроль', d:'{если не удержу все сам, развалится|если не удержу все сама, развалится}'},
  {id:'please', t:'Угождение', d:'сначала другим, свое подождет'},
  {id:'numb', t:'Онемение', d:'лучше не чувствовать, тогда не так уязвимо'}
];

var PRC=[
  {id:'grat',t:'Дневник благодарности',len:10,d:'Каждый день минимум 10 благодарностей, цель цикла 50.'},
  {id:'choose',t:'Выбираю — делаю — сделано',len:7,d:'Небольшие действия по шагам. После каждого третьего появляется напоминание о выбранном желании.'},
  {id:'brake',t:'Слова-тормоза',len:7,d:'Помогает замечать слова, которые останавливают, и подбирать более точные формулировки.'},
  {id:'betray',t:'Колесо контакта с собой',len:28,d:'Наблюдение за тем, где в течение цикла собственные интересы отодвигаются или получают поддержку.'},
  {id:'hours',t:'Блоки времени',len:1,d:'Почасовая сетка дня: куда уходят время, силы и внимание.'},
  {id:'pract',t:'Вдох-выдох, Я есмь, Тихое внимание',len:7,d:'Короткие практики на 2 часа с отметкой.'},
  {id:'signs',t:'Знаки дня',len:28,d:'Записи о событиях и деталях, которые оказались связаны с выбранным желанием.'}
];
function prc(id){var x=PRC.filter(function(z){return z.id===id})[0];if(x)return x;var g=window.GPract&&GPract.byId(id);return g?{id:g.id,t:g.t,len:g.len,d:g.d}:null}
function actOn(T,id,n){var a=(T.act||{})[id];return a&&n>=a.from&&n<a.from+a.len?a:null}
function prFilled(d,id){if(window.GPract&&id!=='want'&&id!=='bounds'){var gj=GPract.byId(id);if(gj&&gj.journal)return !!(d.journal&&d.journal[id])}if(id==='grat')return (d.grat||[]).length>0;if(id==='choose')return (d.choose||[]).length>0;if(id==='brake')return (d.brakeWords||[]).length>0;if(id==='betray')return (d.betrayMarks||[]).length>0;if(id==='signs')return (d.signs||[]).length>0;if(id==='want')return !!(d.journal&&d.journal.want);if(id==='bounds')return !!(d.journal&&d.journal.bounds);if(id==='hours'){for(var k in (d.hours||{}))if(d.hours[k]&&d.hours[k].text)return true;return false}return !!d.practDone}
window.prFilledTrack=function(T,id,n){return prFilled(dayRec(T,n),id)}
function prCount(T,id){var a=(T.act||{})[id];if(!a)return 0;var c=0;for(var i=a.from;i<a.from+a.len&&i<=28;i++)if(prFilled(dayRec(T,i),id))c++;return c}
var RES=[{id:'done',t:'Сделано'},{id:'part',t:'Частично'},{id:'min',t:'Минимум'},{id:'other',t:'Другой шаг'},{id:'fail',t:'Сегодня не получилось'}];
function stepCard(P,T,n){
  var S=T.strategy; if(!S||!window.GStrategy)return '';
  var st=GStrategy.adapt(T,n); if(!st)return '';
  var md=window.GSim?GSim.mode(T,n):null;
  if(md&&window.GSim.shouldEase(T,n)&&!(T.custom||{})[n]){
    if(!st.note)st.note=md.d;
    if(md.id==='recovery'&&st.m!==st.n){st.m=st.n; st.n='Сегодня достаточно просто вспомнить о желании.'}
  }
  var d=dayRec(T,n), w=Math.floor((n-1)/7), W=S.weeks[w]||{}, F=S.focus[st.dir]||S.focus[0], r=d.res||{};
  var h='<div class="row-line step-card"><p class="wk">Неделя '+(w+1)+' · '+esc(W.t||'')+'</p>';
  if(md)h+='<p class="mode-mini">Режим: '+esc(md.t)+'</p>';
  h+='<span class="ftag">'+esc(F.t)+'</span>';
  if(st.note)h+='<p class="soft-tip">'+esc(st.note)+'</p>';
  h+='<p class="main">'+esc(st.m)+'</p>';
  h+='<p class="alt"><small>Минимум</small>'+esc(st.n)+'</p>';
  h+='<p class="alt"><small>Можно иначе</small>'+esc(st.a)+'</p>';
  h+='<p class="alt"><small>Наблюдение</small>'+esc(st.o)+'</p>';
  h+='<div class="chips res">'+RES.map(function(x){return '<button type="button" class="'+(r.v===x.id?'on':'')+'" data-act="res" data-v="'+x.id+'">'+esc(x.t)+'</button>'}).join('')+'</div>';
  if(r.v){
    h+='<textarea data-act="res-saw" rows="2" placeholder="Что я '+gx('{заметил|заметила}')+' (по желанию)">'+esc(r.saw||'')+'</textarea>';
    h+='<textarea data-act="res-proof" rows="2" placeholder="Что сегодня стало подтверждением движения (по желанию)">'+esc(r.proof||'')+'</textarea>';
  }
  h+='<details class="own"><summary>Свой шаг на сегодня</summary><input type="text" data-act="custom" maxlength="200" placeholder="напиши свой вариант" value="'+esc((T.custom||{})[n]||'')+'"></details>';
  return h+'</div>';
}
function practCard(P,T,n,item,reason){
  var a=window.GPract?GPract.openRun(T,item.id):actOn(T,item.id,n);
  var filled=window.GPract?GPract.uniqueDays(T,item.id):prCount(T,item.id);
  var h='<div class="row-line prc"><b>'+esc(item.t)+'</b>';
  h+='<p class="mute">'+esc(gx(item.d||''))+(item.len>1?' · '+item.len+' дней.':' · На один день.')+(item.load?' Нагрузка: '+esc(item.load)+'.':'')+'</p>';
  if(reason)h+='<p class="soft-tip">Почему сейчас: '+esc(gx(reason))+'</p>';
  if(item.effect)h+='<p class="mute">Ожидаемый эффект: '+esc(gx(item.effect))+'</p>';
  if(a)h+='<p class="score ok">Идет · день '+(n-a.from+1)+' из '+a.len+' · уникальных дней: '+filled+'</p><button type="button" class="quiet-btn" data-act="pr-off" data-id="'+item.id+'">Приостановить</button>';
  else{
    if(filled)h+='<p class="mute">За все запуски уникальных дней: '+filled+'. История не обнуляется.</p>';
    h+='<button type="button" class="add" data-act="pr-on" data-id="'+item.id+'">Включить'+(item.len>1?' на '+item.len+' дней':'')+'</button>';
  }
  return h+'</div>';
}
function viewPracts(P,T){
  var n=todayNum(T);
  var h='<div class="t28"><p class="dk">Лаборатория практик</p><h1>Практики</h1><p class="cap28">Система предлагает практики, а ты решаешь, подходят ли они сейчас. Одновременно активны не более двух дополнительных практик. Пропуск ничего не обнуляет.</p>';
  var recs=(window.GPract&&GPract.recs(P,T,n))||[];
  if(recs.length){
    h+='<h2 class="lab-h">Сейчас рекомендуется</h2>';
    recs.forEach(function(r){h+=practCard(P,T,n,r.item,r.reason)});
  }
  var groups=[['base','Базовые практики'],['support','Укрепить то, что уже работает'],['research','По результатам исследований'],['situ','По ситуации']];
  var cat=(window.GPract&&GPract.CAT)||PRC.map(function(x){return {id:x.id,t:x.t,len:x.len,d:x.d,group:(x.id==='brake'||x.id==='betray'||x.id==='hours')?'research':'base'}});
  groups.forEach(function(g){
    var list=cat.filter(function(x){return (x.group||'base')===g[0]&&(!window.GPract||x.lv!==2||GPract.unlocked(P,x))});
    if(!list.length)return;
    h+='<h2 class="lab-h">'+g[1]+'</h2>';
    list.forEach(function(item){
      var open=true;
      if(window.GPract&&item.lv===2)open=GPract.unlocked(P,item);
      if(!open)return;
      h+=practCard(P,T,n,item);
    });
  });
  h+='<div class="row-line"><b>Мои доказательства</b>'+proofBody(T)+'</div>';
  var sup=T.support||{},week=Math.floor((n-1)/7)+1,phrases=['Мне не нужно решать все сразу.','Я могу начать с малого.','Мои обстоятельства имеют значение.','Пропуск не отменяет уже пройденный путь.','Я могу пересмотреть решение без обвинения себя.'];
  h+='<section class="row-line support-panel"><p class="dk">Поддержка без давления</p><h2>Небольшое место для себя</h2>';
  h+='<label class="support-check"><input type="checkbox" data-act="support-five" '+(sup.fiveMinDays&&sup.fiveMinDays[n]?'checked':'')+'> <span>Сегодня я выделил(а) хотя бы пять минут для себя</span></label>';
  h+='<label>Новое впечатление или маленькая новизна на этой неделе<textarea rows="2" maxlength="300" data-act="support-week" data-w="'+week+'" placeholder="Что хотелось бы попробовать, увидеть или заметить?">'+esc((sup.weeklyExperience&&sup.weeklyExperience[week])||'')+'</textarea></label>';
  h+='<label>Что сейчас могло бы меня поддержать?<textarea rows="2" maxlength="300" data-act="support-note" placeholder="Своя фраза, напоминание или важное условие">'+esc(sup.note||'')+'</textarea></label>';
  h+='<div class="support-phrase"><p>'+esc(phrases[(+sup.phraseIndex||0)%phrases.length])+'</p><button type="button" class="quiet-btn" data-act="support-phrase">Другая поддерживающая фраза</button></div></section>';
  return h+'</div>';
}
function trackClock(minute){
  var m=((+minute||0)%1440+1440)%1440;
  return ('0'+Math.floor(m/60)).slice(-2)+':'+('0'+(m%60)).slice(-2);
}
function viewDiary(P,T){
  var chooseStatus={pick:'выбрано',do:'в работе',done:'сделано',switched:'изменен шаг',bonus:'дополнительная запись'};
  var html='<div class="t28"><p class="dk">История наблюдений</p><h1>Дневник</h1><p class="cap28">Здесь собраны события, заметки, знаки, благодарность, выборы и контрольные точки, внесенные за 28 дней. Пустые промежутки не трактуются как бездействие.</p>';
  html+='<button type="button" class="quiet-btn" data-act="space" data-s="map">Открыть календарь 28 дней</button>';
  var records=0;
  for(var n=1;n<=28;n++){
    var evs=(T.events24&&T.events24[n])||[],cps=(T.checkpoints24&&T.checkpoints24[n])||[],d=(T.days||{})[String(n)]||{},proofs=(T.proofs||[]).filter(function(x){return +x.day===n}),custom=(T.custom||{})[n];
    var journal=Object.keys(d.journal||{}).filter(function(k){return String(d.journal[k]||'').trim()});
    var hasNotes=!!(d.note||(d.res&&(d.res.saw||d.res.proof))||custom||(d.signs||[]).length||(d.grat||[]).length||(d.choose||[]).length||journal.length||proofs.length||d.lightCounters);
    if(!evs.length&&!cps.length&&!hasNotes)continue;
    records++;
    html+='<section class="row-line diary-day"><b>День '+n+'</b>';
    if(d.note)html+='<div class="diary-event"><b>Заметка дня</b><p>'+esc(d.note)+'</p></div>'; if(custom)html+='<div class="diary-event"><b>Своя запись</b><p>'+esc(custom)+'</p></div>';
    if(d.lightCounters)html+='<div class="diary-event"><b>Легкие отметки</b><p>Вода: '+(+d.lightCounters.water||0)+' стак. · Движение: '+(+d.lightCounters.movement||0)+' мин · Приемы пищи: '+(+d.lightCounters.meals||0)+'</p></div>';
    if(d.res&&(d.res.saw||d.res.proof))html+='<div class="diary-event"><b>Наблюдение и подтверждение</b>'+(d.res.saw?'<p>'+esc(d.res.saw)+'</p>':'')+(d.res.proof?'<p>'+esc(d.res.proof)+'</p>':'')+'</div>';
    if((d.signs||[]).length)html+='<div class="diary-event"><b>Знаки и совпадения</b>'+d.signs.map(function(x){return '<p>'+esc(x.tag?x.tag+' · ':'')+esc(x.text||'')+'</p>'}).join('')+'</div>';
    if((d.grat||[]).length)html+='<div class="diary-event"><b>Благодарность и хорошее</b>'+d.grat.map(function(x){return '<p>'+esc(x.text||x)+'</p>'}).join('')+'</div>';
    if((d.choose||[]).length)html+='<div class="diary-event"><b>Выборы и шаги</b>'+d.choose.map(function(x){return '<p>'+esc(x.text||'')+(x.status?' · '+esc(chooseStatus[x.status]||x.status):'')+'</p>'}).join('')+'</div>';
    if(journal.length)html+='<div class="diary-event"><b>Записи практик</b>'+journal.map(function(k){return '<p><b>'+esc(k)+'</b> · '+esc(d.journal[k])+'</p>'}).join('')+'</div>';
    if(proofs.length)html+='<div class="diary-event"><b>Доказательства и наблюдения</b>'+proofs.map(function(x){return '<p>'+esc(x.text||'')+'</p>'}).join('')+'</div>';
    evs.slice().sort(function(a,b){return (+a.startMin)-(+b.startMin)}).forEach(function(e){
      html+='<div class="diary-event"><div><b>'+esc(e.title||'Событие')+'</b><span>'+trackClock(e.startMin)+'–'+trackClock(e.endMin)+(e.endMin>1440?' · после полуночи':'')+'</span></div>';
      html+='<p class="mute">'+[e.sphere,e.motive,e.emotion,e.focus].filter(Boolean).map(esc).join(' · ')+'</p>';
      if(e.after)html+='<p>После: '+esc(e.after)+'</p>';
      html+='<div class="row"><button type="button" class="quiet-btn" data-act="event-edit" data-day="'+n+'" data-id="'+esc(e.id)+'">Изменить</button><button type="button" class="quiet-btn" data-act="event-delete" data-day="'+n+'" data-id="'+esc(e.id)+'">Удалить</button></div></div>';
    });
    cps.slice().sort(function(a,b){return (+a.minute)-(+b.minute)}).forEach(function(c){
      html+='<div class="diary-event checkpoint"><b>Состояние · '+trackClock(c.minute)+'</b><p>Настроение: '+c.mood+'/10 · Энергия: '+c.energy+'/10</p>'+(c.note?'<p>'+esc(c.note)+'</p>':'')+'</div>';
    });
    html+='<button type="button" class="quiet-btn" data-act="open" data-n="'+n+'">Открыть день '+n+'</button></section>';
  }
  if(!records)html+='<div class="row-line"><p>Записей пока нет. ты можешь добавить событие, заметку или контрольную точку из раздела «Мой день».</p><button type="button" class="go" data-act="today">Перейти к сегодняшнему дню</button></div>';
  html+='</div>';return html;
}
function viewDirections(P,T){
  var ds=dirs(T),plans=T.directionPlans||{},html='<div class="t28"><p class="dk">Три выбранных направления</p><h1>Мои направления</h1><p class="cap28">Не нужно превращать жизнь в жесткий план. Для каждого направления зафиксируйте желаемое изменение, минимальный шаг и ближайшее действие.</p>';
  if(!ds.length)return html+'<div class="row-line"><p>Сначала выберите и подтвердите три направления на «Небе желаний».</p><a class="go" href="wish.html">Открыть Небо желаний</a></div></div>';
  ds.forEach(function(d,i){
    var p=plans[i]||{},done=0,marks=0;
    for(var n=1;n<=28;n++){var day=dayRec(T,n);if(day.dirState[i]==='done')done++;if(day.dirMarks[i])marks++}
    html+='<section class="row-line direction-plan"><p class="dk">Направление '+(i+1)+'</p><h2>'+esc(d.text)+'</h2><p class="mute">Выполнено шагов: '+done+' · отметок о динамике: '+marks+'</p>';
    html+='<label>Какого изменения ты хочешь?<textarea rows="2" maxlength="500" data-act="dir-plan" data-i="'+i+'" data-k="goal" placeholder="Опишите желаемое положение">'+esc(p.goal||'')+'</textarea></label>';
    html+='<label>Минимальный шаг, доступный даже в сложный день<textarea rows="2" maxlength="300" data-act="dir-plan" data-i="'+i+'" data-k="minimum" placeholder="Самая небольшая версия действия">'+esc(p.minimum||'')+'</textarea></label>';
    html+='<label>Ближайшее регулярное действие<textarea rows="2" maxlength="300" data-act="dir-plan" data-i="'+i+'" data-k="next" placeholder="Что можно повторять без перегрузки">'+esc(p.next||'')+'</textarea></label>';
    html+='</section>';
  });
  html+='<p class="mute">План можно пересматривать. Изменение цели не считается неудачей: это часть настройки маршрута.</p></div>';return html;
}
function viewLabs(P,T){
  var h='<div class="t28"><p class="dk">Самостоятельные инструменты исследования</p><h1>Лаборатории</h1><p class="cap28">Каждая лаборатория решает отдельную задачу. Ее можно проходить независимо от ежедневных отметок Реактора.</p>';
  h+='<a class="lab-link" href="samost.html"><b>Самость</b><span>Отдельное исследование внутренней опоры и собственных решений</span></a>';
  h+='<a class="lab-link" href="wish.html"><b>Небо желаний</b><span>Желания, мотивы, направления и выбор того, что действительно важно</span></a>';
  h+='<div class="row-line"><b>Зеркало прожитой жизни</b><p>Сопоставление самооценки, исследовательских ответов и зарегистрированных событий за цикл.</p><button type="button" class="quiet-btn" data-act="space" data-s="mirror">Открыть зеркало</button></div>';
  h+='<div class="row-line"><b>Разбор привычной схемы</b><p>Этап основного маршрута Точки Б: исследование ситуации, реакции, правила, защитной функции, цены и возможной перенастройки.</p><a class="sky-link" href="map.html">Открыть основной маршрут</a></div>';
  h+='<a class="lab-link" href="labs/razbor.html"><b>Разбор убеждений</b><span>Шесть шагов: исследовать мысль, отделить факты от выводов, увидеть контекст и возможную функцию, учесть реальные ограничения и сформулировать более точный выбор. Независимая лаборатория, не обязательная часть маршрута.</span></a>';
  h+='<a class="lab-link" href="hold.html"><b>Что удерживает меня на месте?</b><span>Шесть уровней: неудовлетворенность, желаемое положение, фактический выбор, скрытая функция, цена и безопасная перенастройка</span></a>';
  return h+'</div>';
}
function viewDay(P,T){
  var n=+T.openDay||todayNum(T); if(n<1||n>28)n=todayNum(T);
  var md=window.GSim?GSim.mode(T,n):null;
  var h='<div class="t28"><p class="dk">Мой день · день '+n+' из 28</p>';
  if(md)h+='<p class="mode-line"><b>'+esc(md.t)+'</b> · '+esc(md.d)+'</p>';
  var wish=wishText(T);
  if(wish)h+='<p class="wishline">Центральная звезда · '+esc(wish)+'</p>';
  var ds=dirs(T);
  if(ds.length){
    var st=T.strategy&&window.GStrategy?GStrategy.adapt(T,n):null, focus=st?st.dir:-1;
    h+='<div class="stars3">'+ds.map(function(d,i){return '<span class="st'+(i===focus?' on':'')+'">'+esc(d.text)+'</span>'}).join('')+'</div>';
  }
  h+='<p class="cap28"><a class="sky-link" href="wish.html">Открыть небо желаний</a></p>';
  h+=dayPanel(P,T,n);
  return h+'</div>';
}
var MIRROR_SPHERES=[{k:'health',n:'Здоровье'},{k:'money',n:'Финансы'},{k:'work',n:'Карьера'},{k:'relationships',n:'Отношения'},{k:'family',n:'Семья'},{k:'friends',n:'Друзья'},{k:'growth',n:'Рост'},{k:'rest',n:'Отдых'}];
function mirrorWheelSvg(values,label,maxValue){
 var cx=180,cy=150,r=94,max=maxValue||10,pts=[],all=true,labels=MIRROR_SPHERES.map(function(x){return x.n});
 var svg='<div class="mirror-wheel-card"><b>'+esc(label)+'</b><svg viewBox="0 0 360 310" role="img" aria-label="'+esc(label)+'">';
 [0.25,0.5,0.75,1].forEach(function(v){svg+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*v)+'" fill="none" stroke="#8a795f" stroke-opacity=".35" stroke-width="1"/>'});
 MIRROR_SPHERES.forEach(function(x,i){var an=-Math.PI/2+i*Math.PI/4,ex=cx+Math.cos(an)*r,ey=cy+Math.sin(an)*r,lx=cx+Math.cos(an)*(r+24),ly=cy+Math.sin(an)*(r+24);svg+='<line x1="'+cx+'" y1="'+cy+'" x2="'+ex.toFixed(1)+'" y2="'+ey.toFixed(1)+'" stroke="#8a795f" stroke-opacity=".35"/><text x="'+lx.toFixed(1)+'" y="'+(ly+3).toFixed(1)+'" text-anchor="middle" font-size="9" fill="#d7c6a7">'+labels[i]+'</text>';var v=values&&values[i];if(typeof v==='number'&&isFinite(v)){var rr=Math.max(0,Math.min(max,v))/max*r;pts.push([cx+Math.cos(an)*rr,cy+Math.sin(an)*rr])}else{all=false;pts.push(null)}});
 if(all){svg+='<polygon points="'+pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' ')+'" fill="#a8b294" fill-opacity=".25" stroke="#d1b27b" stroke-width="2"/>'}
 pts.forEach(function(p){if(p)svg+='<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3.8" fill="#e4c58d" stroke="#352719" stroke-width="1"/>'});
 svg+='</svg></div>';return svg;
}
function mirrorResearchAvg(arr){
 return MIRROR_SPHERES.map(function(x,i){var a=(arr||[]).slice(i*3,i*3+3).filter(function(v){return typeof v==='number'&&isFinite(v)});return a.length?a.reduce(function(p,c){return p+c},0)/a.length:null});
}
function mirrorInitialResearch(P){
 if(P.cycleBaseline&&Array.isArray(P.cycleBaseline.research))return P.cycleBaseline.research.slice();var w=P.wheelTest||{};if(Array.isArray(w.averages)&&w.averages.length===8)return w.averages;
 return (w.spheres||[]).map(function(s){var a=(s.ratings||[]).filter(function(v){return typeof v==='number'&&isFinite(v)});return a.length?a.reduce(function(p,c){return p+c},0)/a.length:null});
}
function mirrorActivityStats(T){
 var all=T.events24||{},bySphere={},byMotive={},byEmotion={},byFocus={},byPlanned={},after={},completion={},eventIds={},days=0,checkpoints=0,overlap=0,total=0,unknown=0,alternatives=[];
 MIRROR_SPHERES.forEach(function(x){bySphere[x.k]=0});
 for(var n=1;n<=28;n++){
  var own=all[n]||[],prev=all[n-1]||[],evs=[];
  own.forEach(function(e){if(+e.startMin<1440)evs.push({e:e,s:+e.startMin,t:Math.min(1440,+e.endMin)})});
  prev.forEach(function(e){if(+e.endMin>1440)evs.push({e:e,s:0,t:Math.min(1440,+e.endMin-1440)})});
  if(evs.length)days++;
  evs.forEach(function(x){if(x.e.id)eventIds[x.e.id]=x.e;else eventIds['n'+n+'_'+evs.indexOf(x)]=x.e});
  var bounds=[0,1440];evs.forEach(function(x){bounds.push(Math.max(0,Math.min(1440,x.s)),Math.max(0,Math.min(1440,x.t)))});
  bounds=Array.from(new Set(bounds)).sort(function(a,b){return a-b});
  for(var j=0;j<bounds.length-1;j++){
   var from=bounds[j],to=bounds[j+1],dur=to-from;if(dur<=0)continue;
   var active=evs.filter(function(x){return x.s<to&&x.t>from});
   if(active.length>1){overlap+=dur;continue}
   if(active.length===1){var e=active[0].e,sp=e.sphere||'unclassified',mo=e.motive||'unclassified',em=e.emotion||'unclassified';if(bySphere[sp]==null)bySphere[sp]=0;bySphere[sp]+=dur;if(sp==='unclassified'||sp==='other')unknown+=dur;byMotive[mo]=(byMotive[mo]||0)+dur;byEmotion[em]=(byEmotion[em]||0)+dur;var fo=e.focus||'unclassified',pl=e.planned||'unclassified';byFocus[fo]=(byFocus[fo]||0)+dur;byPlanned[pl]=(byPlanned[pl]||0)+dur;total+=dur}
  }
 }
 Object.keys(eventIds).forEach(function(id){var e=eventIds[id];after[e.after||'unclassified']=(after[e.after||'unclassified']||0)+1;completion[e.completion||'unclassified']=(completion[e.completion||'unclassified']||0)+1;if(e.alternative)alternatives.push(e.alternative)});
 var moodSum=0,energySum=0;Object.keys(T.checkpoints24||{}).forEach(function(k){(T.checkpoints24[k]||[]).forEach(function(c){checkpoints++;moodSum+=+c.mood||0;energySum+=+c.energy||0})});
 return {moodAvg:checkpoints?moodSum/checkpoints:null,energyAvg:checkpoints?energySum/checkpoints:null,bySphere:bySphere,byMotive:byMotive,byEmotion:byEmotion,byFocus:byFocus,byPlanned:byPlanned,after:after,completion:completion,total:total,overlap:overlap,unknown:unknown,days:days,events:Object.keys(eventIds).length,checkpoints:checkpoints,alternatives:alternatives};
}
function mirrorBars(values,total,names){
 var keys=Object.keys(values||{}).filter(function(k){return values[k]>0}).sort(function(a,b){return values[b]-values[a]});
 if(!keys.length)return '<p class="mute">Пока недостаточно записей.</p>';
 return keys.map(function(k){var v=values[k],pct=total?Math.round(v/total*100):0;return '<div class="mirror-bar"><div><b>'+esc((names&&names[k])||k)+'</b><span>'+Math.round(v/60*10)/10+' ч · '+pct+'%</span></div><i><em style="width:'+pct+'%"></em></i></div>'}).join('');
}
function viewMirror(P,T,isArchive){
 if(!isArchive&&T.mirrorArchiveIndex!=null){var old=(P.trackerHistory||[])[+T.mirrorArchiveIndex];if(old&&old.mirror&&old.mirror.phase==='report')return viewMirror(P,old,true);delete T.mirrorArchiveIndex;save(P)}
 var M=T.mirror||{},ready=!!(T.finale&&T.finale.done)||todayNum(T)>=28;
 if(M.phase==='self'){
  var h='<div class="t28 mirror"><p class="dk">Зеркало прожитой жизни · повторный замер</p><h1>Как ты воспринимаешь свою жизнь сейчас?</h1><p class="cap28">Оцени каждую сферу по собственному ощущению. Прежние оценки, ответы и дневниковая статистика пока скрыты — сначала зафиксируйте сегодняшний взгляд.</p><div class="mirror-self-grid">';
  MIRROR_SPHERES.forEach(function(x,i){h+='<label class="mirror-self-item"><b>'+x.n+'</b><select data-act="mirror-wheel" data-i="'+i+'"><option value="">Выбери оценку</option>'+Array.from({length:10},function(_,j){var v=j+1;return '<option value="'+v+'" '+(+M.endWheel[i]===v?'selected':'')+'>'+v+' / 10</option>'}).join('')+'</select></label>'});
  h+='</div><button class="go" type="button" data-act="mirror-wheel-save">Зафиксировать самооценку</button><p class="mute">Можно вернуться и изменить оценки до завершения повторного исследования.</p></div>';return h;
 }
 if(M.phase==='research'){
  var idx=+M.researchIndex||0,sph=Math.floor(idx/3),q=idx%3,Q=window.WHEEL_QUESTIONS&&WHEEL_QUESTIONS[sph]&&WHEEL_QUESTIONS[sph].questions[q];
  if(!Q){M.phase='report';M.completedAt=Date.now();save(P);return viewMirror(P,T)}
  var ans=M.endResearch||[],h='<div class="t28 mirror"><p class="dk">Зеркало прожитой жизни · исследовательский повтор</p><p class="cap28">Вопрос '+(idx+1)+' из 24 · '+MIRROR_SPHERES[sph].n+'</p><h1>'+esc(gx(Q.text))+'</h1><p class="mute">Отвечайте по своему нынешнему опыту. Предыдущие ответы и статистика все еще скрыты.</p><div class="mirror-answers">';
  Q.options.forEach(function(o){h+='<button type="button" class="mirror-answer" data-act="mirror-answer" data-v="'+o.score+'">'+esc(gx(o.text))+'</button>'});
  h+='<button type="button" class="mirror-answer na" data-act="mirror-answer" data-v="na">Не относится ко мне</button></div><button type="button" class="quiet-btn" data-act="mirror-back-self">Вернуться к самооценке</button></div>';return h;
 }
 if(M.phase!=='report'){
  var events=Object.values(T.events24||{}).reduce(function(n,a){return n+(a||[]).length},0),prior=(P.trackerHistory||[]).map(function(x,i){return {t:x,i:i}}).filter(function(x){return x.t.mirror&&x.t.mirror.phase==='report'}),priorHtml=prior.length?'<details><summary>Отчеты предыдущих циклов: '+prior.length+'</summary>'+prior.map(function(x){return '<p><button type="button" class="quiet-btn" data-act="mirror-archive" data-i="'+x.i+'">Открыть отчет · '+new Date(x.t.mirror.completedAt||x.t.mirror.startedAt||Date.now()).toLocaleDateString('ru-RU')+'</button></p>'}).join('')+'</details>':'';
  return '<div class="t28 mirror"><p class="dk">Зеркало прожитой жизни</p><h1>Три картины одной жизни</h1><p class="cap28">В начале цикла ты уже увидел(а) собственную оценку сфер и прошли исследовательские вопросы. За 28 дней можно было записывать события, время, мотивы и состояние. В конце мы сопоставим эти разные источники — не как оценку правильной жизни, а как материал для понимания.</p><div class="mirror-stage"><ol><li><b>Первый взгляд</b><span>Исходная самооценка сфер.</span></li><li><b>Исследовательская картина</b><span>Подробные ответы по восьми сферам и парные наблюдения.</span></li><li><b>Наблюдаемая картина</b><span>Зарегистрированные события, длительности, мотивы и состояние. Пустые промежутки не считаются бездействием.</span></li><li><b>Новый взгляд</b><span>Повторная самооценка и исследовательские вопросы — до показа прежних данных.</span></li></ol></div>'+(ready?'<p class="mute">Цикл достиг 28-го дня. Записано событий: '+events+'. Можно пройти повторный замер. Незаполненные дни не мешают завершить исследование.</p><button type="button" class="go" data-act="mirror-start">Начать повторный замер</button>':'<p class="mute">Повторный замер откроется на 28-й день цикла. Сейчас можно продолжать вести дневник событий и контрольных точек.</p>')+priorHtml+'<button type="button" class="quiet-btn" data-act="space" data-s="day">Вернуться к моему дню</button></div>';
 }
 var init=M.initialWheel||((P.cycleBaseline&&P.cycleBaseline.wheel)||P.wheel||[]),initResearch=M.initialResearch||mirrorInitialResearch(P),finalWheel=M.endWheel||[],finalResearch=mirrorResearchAvg(M.endResearch||[]),stats=mirrorActivityStats(T),shares={};
 MIRROR_SPHERES.forEach(function(x){shares[x.k]=stats.total?stats.bySphere[x.k]/stats.total*100:0});
 var sn={own:'Собственное желание',important:'Осознанный выбор',need:'Необходимость',care:'Забота / любовь',duty:'Чувство долга',external:'Внешнее требование',habit:'Привычка',avoid:'Избегание',restore:'Восстановление',mixed:'Смешанный мотив',unclassified:'Не указано',joy:'Радость',calm:'Спокойствие',interest:'Интерес',satisfaction:'Удовлетворение',neutral:'Нейтральность',tension:'Напряжение',anxiety:'Тревога',sadness:'Грусть',irritation:'Раздражение',fatigue:'Усталость',emptiness:'Опустошение',better:'Стало лучше',same:'Без заметных изменений',worse:'Стало хуже',unknown:'Не определено',self:'Для себя',other:'Для другого',shared:'Общее / совместное',both:'Для себя и других',yes:'Плановое',no:'Спонтанное',done:'Выполнено',partial:'Частично',not_done:'Не выполнено',ongoing:'Продолжается',na:'Не применимо'};
 var h='<div class="t28 mirror"><p class="dk">Зеркало прожитой жизни · отчет</p><h1>Пять разных взглядов на одну жизнь</h1><p class="cap28">Это не единый рейтинг и не объективная оценка благополучия. Самооценка, исследовательские ответы и зарегистрированная активность измеряют разные стороны опыта.</p>';
 h+='<div class="mirror-report-grid"><details open><summary>1. Исходная самооценка</summary>'+mirrorWheelSvg(init,'Как ты оценивал(а) сферы в начале',10)+'</details><details><summary>2. Исходные исследовательские ответы</summary>'+mirrorWheelSvg(initResearch,'Подробные ответы в начале',10)+'</details><details open><summary>3. Наблюдаемая активность за 28 дней</summary>';
 h+='<p class="mute">Событий: '+stats.events+' · дни с записями: '+stats.days+' из 28 · контрольные точки состояния: '+stats.checkpoints+(stats.checkpoints?' · среднее настроение '+stats.moodAvg.toFixed(1)+'/10 · энергия '+stats.energyAvg.toFixed(1)+'/10':'')+'. Учтено без пересечений: '+Math.round(stats.total/60*10)/10+' ч. Пересекающееся время: '+Math.round(stats.overlap/60*10)/10+' ч — показано отдельно и не добавлено повторно. Другое или сфера не указана: '+Math.round(stats.unknown/60*10)/10+' ч.</p>';
 h+=stats.total?mirrorWheelSvg(MIRROR_SPHERES.map(function(x){return shares[x.k]}),'Доля зарегистрированного времени по сферам, %',100):'<p class="mute">Недостаточно записей, чтобы построить распределение. Это не означает, что в эти дни ничего не происходило.</p>';
 h+='<h3>Время по сферам</h3>'+mirrorBars(stats.bySphere,stats.total,Object.assign({unclassified:'Не указано'},Object.fromEntries(MIRROR_SPHERES.map(function(x){return [x.k,x.n]}))));
 h+='<h3>Плановые и спонтанные события</h3>'+mirrorBars(stats.byPlanned,stats.total,sn)+'<h3>На кого было направлено время</h3>'+mirrorBars(stats.byFocus,stats.total,sn)+'<h3>Мотивы зарегистрированных событий</h3>'+mirrorBars(stats.byMotive,stats.total,sn)+'<h3>Эмоциональные отметки</h3>'+mirrorBars(stats.byEmotion,stats.total,sn);
 h+='<h3>Степень выполнения</h3>'+Object.keys(stats.completion).map(function(k){return '<p>'+esc(sn[k]||k)+': '+stats.completion[k]+'</p>'}).join('')+'<h3>Последействие</h3>'+Object.keys(stats.after).map(function(k){return '<p>'+esc(sn[k]||k)+': '+stats.after[k]+'</p>'}).join('')+(stats.alternatives.length?'<h3>Что хотелось бы попробовать иначе</h3>'+stats.alternatives.slice(0,8).map(function(x){return '<p>· '+esc(x)+'</p>'}).join(''):'')+'</details>';
 h+='<details open><summary>4. Новая самооценка</summary>'+mirrorWheelSvg(finalWheel,'Как ты оцениваешь сферы сейчас',10)+'</details><details><summary>5. Повторные исследовательские ответы</summary>'+mirrorWheelSvg(finalResearch,'Подробные ответы сейчас',10)+'</details></div>';
 h+='<h2>Сопоставление</h2><div class="mirror-compare"><div class="mirror-compare-head"><span>Сфера</span><span>Было</span><span>Исслед.</span><span>Время</span><span>Стало</span><span>Исслед.</span></div>';
 MIRROR_SPHERES.forEach(function(x,i){h+='<div class="mirror-compare-row"><b>'+x.n+'</b><span>'+(init[i]==null?'—':init[i])+'</span><span>'+(initResearch[i]==null?'—':initResearch[i].toFixed(1))+'</span><span>'+(stats.total?Math.round(shares[x.k])+'%':'—')+'</span><span>'+(finalWheel[i]==null?'—':finalWheel[i])+'</span><span>'+(finalResearch[i]==null?'—':finalResearch[i].toFixed(1))+'</span></div>'});
 h+='</div><p class="mute">Расхождение между тем, что ты ощущаешь, что показывают ответы и на что уходит записанное время, не означает ошибку или самообман. Возможны изменение приоритетов, неполнота записей, внешние обстоятельства и разные способы измерения. Время по сферам рассчитано по непересекающимся интервалам; перекрытия вынесены отдельно.</p>';
 var note=M.reflection||{};h+='<div class="mirror-note"><h3>Что я замечаю в этой картине?</h3><label>Что оказалось неожиданным?<textarea data-act="mirror-note" data-key="surprise" rows="3">'+esc(note.surprise||'')+'</textarea></label><label>Что я хочу сохранить в своей жизни?<textarea data-act="mirror-note" data-key="keep" rows="3">'+esc(note.keep||'')+'</textarea></label><label>Что я хочу изменить или исследовать дальше?<textarea data-act="mirror-note" data-key="next" rows="3">'+esc(note.next||'')+'</textarea></label></div>';
 if(isArchive){h+='<button type="button" class="quiet-btn" data-act="mirror-archive-back">Вернуться к текущему отчету</button>'}
 else{h+='<button type="button" class="go" data-act="mirror-continue">Продолжить к финальному сравнению</button><button type="button" class="quiet-btn" data-act="mirror-restart">Пройти повторное исследование еще раз</button><button type="button" class="quiet-btn" data-act="space" data-s="day">Вернуться к моему дню</button>'}
 if(M.history&&M.history.length)h+='<details><summary>Повторные отчеты этого цикла: '+M.history.length+'</summary>'+M.history.map(function(x,i){return '<p>Повтор '+(i+1)+' · '+new Date(x.completedAt||x.startedAt||Date.now()).toLocaleDateString('ru-RU')+'</p>'}).join('')+'</details>';
 if(!isArchive){var prev=(P.trackerHistory||[]).map(function(x,i){return {t:x,i:i}}).filter(function(x){return x.t.mirror&&x.t.mirror.phase==='report'&&x.t.cycle!==T.cycle});if(prev.length)h+='<details><summary>Отчеты предыдущих циклов: '+prev.length+'</summary>'+prev.map(function(x){return '<p><button type="button" class="quiet-btn" data-act="mirror-archive" data-i="'+x.i+'">Открыть отчет · '+new Date(x.t.mirror.completedAt||x.t.mirror.startedAt||Date.now()).toLocaleDateString('ru-RU')+'</button></p>'}).join('')+'</details>'}
 return h+'</div>';
}
function viewHero(P,T){
  var n=todayNum(T), pan=window.GSim?GSim.panel(T,n):null;
  var h='<div class="t28"><p class="dk">Мой герой</p><h1>Состояние и опоры</h1>';
  if(wishText(T))h+='<p class="wishline">Центральная звезда · '+esc(wishText(T))+'</p>';
  if(pan){
    h+='<div class="hero-mets">'+pan.items.map(function(it){
      var v=it.show==null?'нет отметки':it.show+'/100';
      var tr=it.trend>0.4?' растет':(it.trend<-0.4?' снижается':'');
      return '<div><b>'+esc(it.name)+'</b><span>'+v+esc(tr)+'</span></div>';
    }).join('')+'</div>';
    h+='<p class="mute">Числа 0–100 пересчитаны из твоих самооценок 1–10. Расчет динамики не подменяет самооценку и не повышает показатели за выполнение практик.</p>';
  }
  h+=svgChart(T,1,Math.max(n,7),T.hiddenMet||{},'Динамика');
  var S=T.strategy||{};
  if(S.res&&S.res.length)h+='<div class="row-line"><b>На что ты можешь опереться</b>'+S.res.slice(0,4).map(function(x){return '<p><b>'+esc(x.t)+'.</b> '+esc(x.x)+'</p>'}).join('')+'</div>';
  h+='<div class="row-line"><b>Достижения цикла</b><p>Дней с отметкой: '+filledCount(T)+' из 28. Доказательств: '+((T.proofs||[]).length)+'. Знаков: '+ (function(){var c=0;for(var i=1;i<=28;i++)c+=(dayRec(T,i).signs||[]).length;return c})()+'.</p></div>';
  h+='<p class="cap28"><a class="sky-link" href="hero.html?v=h5">Открыть вкладку героя</a> · <a class="sky-link" href="wish.html">Небо желаний</a></p>';
  return h+'</div>';
}
function viewMonth(P,T){
  var today=todayNum(T), open=+T.openDay||0;
  var html='<div class="t28"><p class="dk">Карта 28 дней</p><h1>Четыре недели</h1><p class="cap28">Выбери день, чтобы открыть его. Номер недели открывает обзор недели.</p>';
  html+='<div class="cal"><span></span>';
  WD.forEach(function(w){html+='<span class="hd">'+w+'</span>'});
  for(var w=0;w<4;w++){
    html+='<button type="button" class="wn" data-act="weekg" data-w="'+w+'" aria-label="Неделя '+(w+1)+'">'+(w+1)+'</button>';
    for(var i=0;i<7;i++){
      var n=w*7+i+1, cls='cell'+(n===today?' today':'')+(n===open?' open':'')+(n>today?' future':'');
      html+='<button type="button" class="'+cls+'" data-act="open" data-n="'+n+'"><span>'+n+'</span>'+cellMark(T,n)+'</button>';
    }
  }
  html+='</div></div>';
  return html;
}

function markBtns(cur,attr){
  return '<div class="chips">'+MARKS.map(function(m){
    return '<button type="button" class="'+(cur===m.id?'on':'')+'" data-act="mark" '+attr+' data-m="'+m.id+'">'+esc(m.t)+'</button>';
  }).join('')+'</div>';
}

function dayPanel(P,T,n){
  var d=dayRec(T,n), today=todayNum(T);
  var html='<div class="day-card" data-day="'+n+'"><p class="dk">День '+n+(n===today?' · сегодня':'')+'</p>';
  if(!T.strategy)html+='<p class="hint">'+esc(hintOf(n))+'</p>';
  html+=stepCard(P,T,n);

  if(!T.strategy){
  html+='<div class="row-line">';
  html+='<b>'+esc(wishText(T)||'Главное желание')+'</b>';
  html+=markBtns(d.wishMark,'data-who="wish"');
  html+='</div>';

  dirs(T).forEach(function(dir,i){
    var st=d.dirState[i]||'';
    html+='<div class="row-line"><b>'+esc(dir.text)+'</b>';
    html+='<input type="text" data-act="dir-step" data-i="'+i+'" placeholder="маленький шаг сегодня" value="'+esc(d.dirSteps[i]||'')+'">';
    html+='<div class="step-row"><button type="button" data-act="dir-st" data-i="'+i+'" data-s="done" class="'+(st==='done'?'on':'')+'">Сделать</button></div>';
    html+='<input type="text" data-act="ifthen" data-i="'+i+'" placeholder="если … то …" value="'+esc((T.ifthens&&T.ifthens[i])||'')+'">';
    html+=markBtns(d.dirMarks[i]||'','data-who="dir" data-i="'+i+'"');
    html+='</div>';
  });
  if(!dirs(T).length)html+='<div class="row-line"><p class="mute">Три направления появятся после подтверждения выбора на Небе желаний.</p></div>';

  }
  var stateBody='<div class="row-line sliders">';
  MET.forEach(function(m){
    var v=d.sliders[m.key]; if(v==null)v=5;
    var tip=sliderHint(m,+v);
    stateBody+='<div class="slid"><label>'+esc(m.name)+' <small>'+esc(gx(m.sub))+' · '+v+'</small></label>';
    if(tip)stateBody+='<p class="soft-tip">'+esc(tip)+'</p>';
    else stateBody+='<p class="soft-tip"></p>';
    stateBody+='<input type="range" min="1" max="10" value="'+v+'" data-act="slider" data-k="'+m.key+'"></div>';
  });
  stateBody+='</div>';
  html+=acc('state','Состояние сейчас','пять оценок · по желанию',stateBody);
  html+=razborBlock(P,T,n);
  var evCount=((T.events24||{})[n]||[]).length+(((T.events24||{})[n-1]||[]).filter(function(x){return +x.endMin>1440}).length);html+=acc('events24','24 часа · события и занятия',evCount?'записей: '+evCount:'добавить запись',events24Body(T,n));

  if(actOn(T,'signs',n)){
  html+='<div class="row-line"><b>Знаки дня</b><div class="signs">';
  (d.signs||[]).forEach(function(s){
    html+='<div class="sign-item">'+esc(s.tag?s.tag+' · ':'')+esc(s.text)+'</div>';
  });
  if((d.signs||[]).length<5){
    html+='<div class="row"><select data-act="sign-tag">'+SIGN_TAGS.map(function(t){return '<option>'+t+'</option>'}).join('')+'</select>';
    html+='<input type="text" data-act="sign-in" maxlength="160" placeholder="что {заметил|заметила}">'.replace(/\{([^|]*)\|([^}]*)\}/g,function(_,m,f){return window.GG?GG(m,f):m});
    html+='<button type="button" class="add" data-act="sign-add">Записать</button></div>';
  }
  html+='</div></div>';
  }

  var BOD={grat:function(){return gratBody(d,T)},choose:function(){return chooseBody(d,T,n)},hours:function(){return hoursBody(d)},brake:function(){return brakeBody(d)},betray:function(){return betrayBody(d)},pract:function(){return practBody(T)}};
  var pa='';
  PRC.forEach(function(x){if(x.id==='signs')return;var a=actOn(T,x.id,n);if(!a)return;pa+=acc(x.id,x.t,'день '+(n-a.from+1)+' из '+a.len+' · заполнено '+prCount(T,x.id),BOD[x.id]())});
  html+=pa;
  if(window.GPract){GPract.CAT.filter(function(x){return x.journal}).map(function(x){return x.id}).forEach(function(id){
    if(!GPract.isOn(T,id,n))return;
    var it=GPract.byId(id); if(!it)return;
    html+='<div class="row-line"><b>'+esc(it.t)+'</b><p class="mute">'+esc(gx(it.daily))+'</p>';
    html+='<textarea data-act="journal" data-id="'+id+'" rows="2" maxlength="240" placeholder="'+esc(gx(it.min))+'">'+esc((d.journal&&d.journal[id])||'')+'</textarea></div>';
  });}
  var lc=d.lightCounters||{};
  var lightBody='<p class="mute">Не медицинский дневник и не норма. Отмечайте только то, что помогает тебе наблюдать за днем. Пропуски ничего не означают.</p>';
  [['water','Вода · стаканы',1],['movement','Движение · минуты',5],['meals','Приемы пищи',1]].forEach(function(x){
    var v=+lc[x[0]]||0;
    lightBody+='<div class="light-counter"><b>'+x[1]+'</b><div><button type="button" class="quiet-btn" data-act="counter" data-k="'+x[0]+'" data-delta="-'+x[2]+'">−</button><strong>'+v+'</strong><button type="button" class="quiet-btn" data-act="counter" data-k="'+x[0]+'" data-delta="'+x[2]+'">+</button></div></div>';
  });
  html+=acc('light','Легкие отметки','по желанию',lightBody);
  html+='<button type="button" class="quiet-btn" data-act="practs">'+(pa?'Практики':'Лаборатория практик')+'</button>';
  html+='<button class="go" type="button" data-act="done">Завершить день</button></div>';
  return html;
}
function acc(id,title,sub,body){
  return '<div class="acc" data-acc="'+id+'"><button type="button" class="head" data-act="acc" data-id="'+id+'">'+esc(title)+(sub?'<span>'+esc(sub)+'</span>':'')+'</button><div class="body">'+body+'</div></div>';
}
function gratBody(d,T){
  var list=(d.grat||[]).map(function(g){return '<div class="sign-item">'+esc(g.text)+'</div>'}).join('');
  return list+'<input type="text" data-act="grat-in" maxlength="160" placeholder="за что я благодар'+((window.GG&&GG('ен','на'))||'ен')+' сегодня"><button type="button" class="add" data-act="grat-add">Записать</button>';
}
function chooseBody(d,T,n){
  var rows=(d.choose||[]).map(function(r){
    var t=r.tChoose?new Date(r.tChoose):null;
    var dur=r.tDone&&r.tDo?Math.round((r.tDone-r.tDo)/60000)+' мин':'';
    var when=t?(t.getHours()+':'+('0'+t.getMinutes()).slice(-2)):'';
    var st=r.status==='done'?'сделано':r.status==='do'?'делаю':r.status==='bonus'?'бонус':'выбор';
    var line='<div class="ch-row'+(r.bonus?' bonus':'')+'"><b>'+esc(r.text|| (r.bonus?wishText(T):''))+'</b> · '+st+(when?' · '+when:'')+(dur?' · '+dur:'');
    if(r.bonus){
      line+='<p class="mute">'+esc(BONUS_HINT)+'</p>';
      line+='<button type="button" class="quiet-btn" data-act="notice" data-id="'+r.id+'">'+((window.GG&&GG('Заметил','Заметила'))||'Заметил')+'</button>';
    } else {
      line+=' <button type="button" class="quiet-btn" data-act="ch-st" data-id="'+r.id+'" data-s="do">Делаю</button>';
      line+=' <button type="button" class="quiet-btn" data-act="ch-st" data-id="'+r.id+'" data-s="done">Сделано</button>';
    }
    return line+'</div>';
  }).join('');
  return rows+'<input type="text" data-act="ch-in" placeholder="Выбираю…" maxlength="160"><button type="button" class="add" data-act="ch-add">Добавить</button>';
}
/* 24-hour event journal. Records are stored per cycle day; endMin may exceed 1440 for overnight events. */
function day24Fmt(v){v=Math.max(0,Math.round(v));if(v===1440)return '24:00';v=v%1440;return ('0'+Math.floor(v/60)).slice(-2)+':'+('0'+(v%60)).slice(-2)}
function day24Names(){
 return {type:{activity:'Занятие',sleep:'Сон',travel:'Дорога',care:'Забота',rest:'Отдых',other:'Другое'},
 sphere:{health:'Здоровье',money:'Финансы',work:'Работа',relationships:'Отношения',family:'Семья',friends:'Друзья',growth:'Развитие',rest:'Отдых',other:'Другое'},
 motive:{own:'Собственное желание',important:'Осознанный выбор по важности',need:'Необходимость',care:'Забота / любовь',duty:'Чувство долга',external:'Внешнее требование',habit:'Привычка / автоматизм',avoid:'Избегание / откладывание',restore:'Восстановление по потребности',mixed:'Смешанный мотив',other:'Другое'},
 emotion:{calm:'Спокойствие',joy:'Радость',interest:'Интерес',satisfaction:'Удовлетворение',neutral:'Нейтральность',tension:'Напряжение',anxiety:'Тревога',sadness:'Грусть',irritation:'Раздражение',fatigue:'Усталость',emptiness:'Опустошение'},completion:{done:'Выполнено',partial:'Частично',not_done:'Не выполнено',ongoing:'Продолжается',na:'Не применимо'},after:{better:'Стало лучше',same:'Без заметных изменений',worse:'Стало хуже',unknown:'Не определено'},focus:{self:'Для себя',other:'Для другого',shared:'Общее / совместное',both:'И для себя, и для других',unknown:'Не могу определить'}};
}
function events24Body(T,n){
 var all=T.events24||{},own=all[n]||[],prev=all[n-1]||[],rows=[],N=day24Names(),draft=(T.eventDraft&&T.eventDraft[n])||{},editing=!!(T.editingEvent&&T.editingEvent.day===n),cps=((T.checkpoints24||{})[n]||[]),cpDraft=(T.checkpointDraft&&T.checkpointDraft[n])||{};
 own.forEach(function(e){if(+e.startMin<1440)rows.push({e:e,owner:n,from:+e.startMin,to:Math.min(1440,+e.endMin),continued:false,overnight:+e.endMin>1440})});
 prev.forEach(function(e){if(+e.endMin>1440)rows.push({e:e,owner:n-1,from:0,to:Math.min(1440,+e.endMin-1440),continued:true,overnight:false})});
 rows.sort(function(a,b){return a.from-b.from});
 var html='<div class="d24"><p class="mute">Записывайте события по ходу дня или вечером. Пустые промежутки остаются неизвестными — мы не считаем их отдыхом или бездействием. События могут пересекаться; в сводной картине пересечения будут показаны отдельно, чтобы не считать одни и те же минуты дважды.</p><div class="d24-axis"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div>';
 if(rows.length){html+=rows.map(function(r){var e=r.e,from=r.from,to=r.to,dur=Math.max(0,to-from),left=from/1440*100,width=Math.max(0,dur/1440*100),time=r.continued?'00:00–'+day24Fmt(to):day24Fmt(e.startMin)+'–'+(r.overnight?day24Fmt(e.endMin-1440)+' следующего дня':day24Fmt(e.endMin));var details=[N.type[e.type]||'Событие',N.sphere[e.sphere]||'',N.motive[e.motive]||'',N.emotion[e.emotion]||'',N.focus[e.focus]||'',e.planned==='yes'?'Плановое':e.planned==='no'?'Спонтанное':'',N.completion[e.completion]||'',N.after[e.after]||''].filter(Boolean).join(' · ');
 return '<div class="d24-row"><div class="d24-meta"><b>'+esc(e.title)+(r.continued?' · продолжение':'')+'</b><small>'+time+' · '+Math.floor(dur/60)+' ч '+(dur%60)+' мин</small><small>'+esc(details)+'</small>'+(e.alternative?'<small>В следующий раз: '+esc(e.alternative)+'</small>':'')+'</div><div class="d24-track"><i style="left:'+left+'%;width:'+width+'%"></i></div>'+(r.continued?'':'<button type="button" class="quiet-btn" data-act="event-edit" data-day="'+r.owner+'" data-id="'+esc(e.id)+'">Изменить</button>')+'<button type="button" class="quiet-btn" data-act="event-delete" data-day="'+r.owner+'" data-id="'+esc(e.id)+'">Удалить</button></div>'}).join('')}
 else html+='<p class="mute">Пока нет записей за этот день.</p>';
 html+='<details class="d24-add"><summary>Добавить событие</summary><div class="d24-form">';
 html+='<label>Что происходило<input type="text" maxlength="120" data-act="event-field" data-key="title" value="'+esc(draft.title||'')+'" placeholder="Например, работа над проектом"></label>';
 html+='<div class="d24-times"><label>Начало<input type="time" data-act="event-field" data-key="start" value="'+esc(draft.start||'')+'"></label><label>Окончание<input type="time" data-act="event-field" data-key="end" value="'+esc(draft.end||'')+'"></label></div>';
 function opts(key,items){var titles={type:'Тип события',sphere:'Сфера жизни',motive:'Что побудило?',emotion:'Эмоциональный фон',focus:'Для кого это было?',planned:'План или спонтанность',completion:'Степень выполнения',after:'Последействие'};return '<label>'+(titles[key]||key)+'<select data-act="event-field" data-key="'+key+'">'+items.map(function(x){return '<option value="'+x[0]+'" '+((draft[key]||'')===x[0]?'selected':'')+'>'+x[1]+'</option>'}).join('')+'</select></label>'}
 html+=opts('type',[['activity','Занятие'],['sleep','Сон'],['travel','Дорога'],['care','Забота'],['rest','Отдых'],['other','Другое']]);
 html+=opts('sphere',[['','Сферу можно не указывать'],['health','Здоровье'],['money','Финансы'],['work','Карьера'],['relationships','Отношения'],['family','Семья'],['friends','Друзья'],['growth','Рост'],['rest','Отдых'],['other','Другое']]);
 html+=opts('motive',[['','Мотив можно не указывать'],['own','Собственное желание'],['important','Осознанный выбор по важности'],['care','Забота / любовь'],['duty','Чувство долга'],['need','Необходимость'],['habit','Привычка / автоматизм'],['avoid','Избегание / откладывание'],['restore','Восстановление по потребности'],['mixed','Смешанный мотив'],['other','Другое']]);
 html+=opts('emotion',[['','Эмоцию можно не указывать'],['joy','Радость'],['calm','Спокойствие'],['interest','Интерес'],['satisfaction','Удовлетворение'],['neutral','Нейтральность'],['tension','Напряжение'],['irritation','Раздражение'],['anxiety','Тревога'],['fatigue','Усталость'],['emptiness','Опустошение']]);
 html+=opts('focus',[['','Для кого — по желанию'],['self','Для себя'],['other','Для другого'],['shared','Общее / совместное'],['both','И для себя, и для других'],['unknown','Не могу определить']]);
 html+=opts('planned',[['','План / спонтанность — по желанию'],['yes','Плановое'],['no','Спонтанное']]);
 html+=opts('completion',[['','Степень выполнения — по желанию'],['done','Выполнено'],['partial','Частично'],['not_done','Не выполнено'],['ongoing','Продолжается'],['na','Не применимо']]);
 html+=opts('after',[['','Последействие — по желанию'],['better','Стало лучше'],['same','Без заметных изменений'],['worse','Стало хуже'],['unknown','Не могу определить']]);
 html+='<label>Что в следующий раз хотелось бы сделать иначе? <textarea rows="2" data-act="event-field" data-key="alternative" placeholder="Необязательно">'+esc(draft.alternative||'')+'</textarea></label>';
 html+='<button type="button" class="add" data-act="event-add">'+(editing?'Сохранить изменения':'Сохранить событие')+'</button>'+(editing?'<button type="button" class="quiet-btn" data-act="event-cancel">Отменить редактирование</button>':'')+'<p class="mute">Если окончание раньше начала, запись продолжится после полуночи. Сон и другие события можно отмечать через границу дня.</p></div></details>';
 html+='<div class="d24-checkpoints"><b>Контрольные точки состояния</b><p class="mute">Это отдельные отметки времени, настроения и энергии. Они не привязываются автоматически к событию.</p>';
 if(cps.length)html+=cps.map(function(c){return '<div class="d24-check"><b>'+day24Fmt(c.minute)+'</b><span>Настроение '+c.mood+'/10 · энергия '+c.energy+'/10</span>'+(c.note?'<small>'+esc(c.note)+'</small>':'')+'<button type="button" class="quiet-btn" data-act="checkpoint-delete" data-day="'+n+'" data-id="'+esc(c.id)+'">Удалить</button></div>'}).join('');
 html+='<div class="d24-form"><div class="d24-times"><label>Время<input type="time" data-act="checkpoint-field" data-key="time" value="'+esc(cpDraft.time||'')+'"></label><label>Настроение (1–10)<input type="number" min="1" max="10" data-act="checkpoint-field" data-key="mood" value="'+esc(cpDraft.mood||'')+'"></label><label>Энергия (1–10)<input type="number" min="1" max="10" data-act="checkpoint-field" data-key="energy" value="'+esc(cpDraft.energy||'')+'"></label></div><label>Что важно отметить? <input type="text" maxlength="140" data-act="checkpoint-field" data-key="note" value="'+esc(cpDraft.note||'')+'" placeholder="Необязательно"></label><button type="button" class="add" data-act="checkpoint-add">Добавить отметку состояния</button></div></div></div>';
 return html;
}
function hoursBody(d){
  var h='<div class="hours">';
  for(var i=7;i<=22;i++){
    var hr=d.hours[i]||{};
    h+='<div><button type="button" class="hour-h" data-act="hour-t" data-h="'+i+'"><b>'+(i<10?'0':'')+i+':00</b> <span class="mute">'+esc(hr.text||'')+'</span></button>';
    if(d.openHour===i)h+='<input type="text" data-act="hour-in" data-h="'+i+'" value="'+esc(hr.text||'')+'" placeholder="чем занят час"></div>';
    else h+='</div>';
  }
  return h+'</div>';
}
function brakeBody(d){
  var cur=d.brakeWords||[], last=d.brakeLast;
  var html='<div class="brake">'+BRAKES.map(function(w){
    return '<button type="button" class="'+(cur.indexOf(w.id)>=0?'on':'')+'" data-act="brake" data-id="'+w.id+'">'+esc(w.t)+'</button>';
  }).join('')+'</div>';
  if(last){
    var w=BRAKES.filter(function(x){return x.id===last})[0];
    if(w)html+='<p class="swap">Можно сказать иначе: «'+esc(w.s)+'».</p>';
  }
  return html;
}
/* Разбор дня: одним касанием отметить, где сегодня себя предал(а) и где поддержал(а). P.betray.days[дата] */
function dayDate(T,n){var base=T.start||Date.now();if(!T.start)return window.GBW?GBW.isoDay(Date.now()):'';return window.GBW?GBW.isoDay(base+(n-1)*86400000):''}
function cycleRange(T){if(!T.start||!window.GBW)return [null,null];return [GBW.isoDay(T.start),GBW.isoDay(T.start+27*86400000)]}
function razborBlock(P,T,n){
  if(!window.GBW)return '';
  GBW.css();
  var key=dayDate(T,n),B=P.betray||{},rec=(B.days&&B.days[key])||{sh:[],sp:[]};
  var h='<div class="row-line razbor"><b>Разбор дня</b>';
  h+='<p class="mute">'+esc(gx('Где сегодня {отодвинул|отодвинула} себя'))+'</p><div class="bw-chips sh">'+GBW.S.map(function(s){return '<button type="button" class="'+((rec.sh||[]).indexOf(s.id)>=0?'on':'')+'" data-act="bw" data-z="sh" data-id="'+s.id+'">'+esc(s.t)+'</button>'}).join('')+'</div>';
  h+='<p class="mute">'+esc(gx('Где сегодня {поддержал|поддержала} себя'))+'</p><div class="bw-chips sp">'+GBW.S.map(function(s){return '<button type="button" class="'+((rec.sp||[]).indexOf(s.m.id)>=0?'on':'')+'" data-act="bw" data-z="sp" data-id="'+s.m.id+'">'+esc(s.m.t)+'</button>'}).join('')+'</div>';
  var r=cycleRange(T),A=GBW.daysAgg(P,r[0],r[1]);
  if(A.days)h+='<details class="bw-mini"><summary>Мое колесо за цикл · дней с отметкой: '+A.days+'</summary>'+GBW.svg(A.vals,{size:230})+GBW.legend()+'</details>';
  return h+'</div>';
}
function betrayBody(d){
  if(window.GBW){var P=load(),T=(P.tracker||{}),r=cycleRange(T),A=GBW.daysAgg(P,r[0],r[1]);GBW.css();
    return '<p class="mute">Отмечайте это в «Разборе дня» выше. Колесо отражает записи за 28 дней.</p>'+(A.days?GBW.svg(A.vals,{size:230})+GBW.legend():'<p class="mute">Пока нет отметок.</p>');}
  var cur=d.betrayMarks||[];
  return '<div class="brake">'+BETRAY.map(function(w){
    return '<button type="button" class="'+(cur.indexOf(w.id)>=0?'on':'')+'" data-act="betray-mark" data-id="'+w.id+'">'+esc(w.t)+'</button>';
  }).join('')+'</div>';
}
function practLabel(T){
  var p=T.practices||{}, n=0;
  Object.keys(p).forEach(function(k){n+=+(p[k].count||0)});
  return n?('записей: '+n):'';
}
function practBody(T){
  var names=[{id:'breath',t:'Вдох-выдох'},{id:'iam',t:'Я есмь'},{id:'look',t:'Тихое внимание'}];
  var p=T.practices||{};
  return names.map(function(x){
    var c=p[x.id]||{count:0,streak:0,until:0};
    var on=c.until&&c.until>Date.now();
    return '<div class="ch-row"><b>'+esc(x.t)+'</b> · сделано '+(c.count||0)+' · серия '+(c.streak||0)+
      ' <button type="button" class="quiet-btn" data-act="pract" data-id="'+x.id+'">Отметить</button>'+
      ' <button type="button" class="quiet-btn" data-act="pract-on" data-id="'+x.id+'">'+(on?'Идет сессия':'Включить на 2 часа')+'</button></div>';
  }).join('');
}
function proofBody(T){
  var L=(T.proofs||[]).slice().reverse().map(function(p){return '<div class="sign-item">'+esc(p.text)+(p.day?' <span class="mute">· день '+p.day+'</span>':'')+'</div>'}).join('');
  return L||'<p class="mute">Сюда попадают знаки дня и то, что ты '+((window.GG&&GG('заметил','заметила'))||'заметил')+' в бонусной строке.</p>';
}

function weekStrat(T,w){
  var S=T.strategy,W=S.weeks[w]||{},a=w*7+1,pts=0,cnt=0,ch=0,mood=[],RT={done:'Сделано',part:'Частично',min:'Минимум',other:'Другой шаг',fail:'Не получилось'},SC={done:1,part:.5,min:.5,other:1,fail:0};
  var list='';
  for(var i=a;i<a+7;i++){var d=dayRec(T,i),st=GStrategy.adapt(T,i),r=d.res&&d.res.v;if(r){cnt++;pts+=SC[r]||0}
    ch+=(d.signs||[]).length+((d.res&&d.res.proof)?1:0)+((d.res&&d.res.saw)?1:0);
    var sl=d.sliders||{};['mood','presence','well'].forEach(function(k){if(sl[k]!=null)mood.push(+sl[k])});
    list+='<div class="wd-it'+(r?' on':'')+'"><span>'+i+'</span><p>'+esc(st?st.m:'')+'</p><em>'+(r?RT[r]:'')+'</em></div>'}
  var ex=Math.round(pts/7*100),inn=mood.length?(mood.reduce(function(x,y){return x+y},0)/mood.length).toFixed(1):'—';
  return '<div class="row-line"><b>'+esc(W.t)+'</b><p class="mute">'+esc(W.d)+'</p></div>'+
   '<div class="nums nums3"><div><b>'+ex+'%</b><span>Исполнение</span></div><div><b>'+ch+'</b><span>Изменения</span></div><div><b>'+inn+'</b><span>Внутренний опыт</span></div></div>'+
   '<p class="cap28 soft">Три отдельных показателя. Исполнение отражает выполненные действия, изменения — замеченные Вами сдвиги, внутренний опыт — твои оценки.</p>'+
   '<div class="row-line wd-list"><b>Шаги недели</b>'+list+'</div>'+
   '<p class="cap28">Вопрос недели: '+esc(W.q)+'</p>';
}
function viewWeek(P,T){
  var w=T.weekN||0, a=w*7+1, b=a+6, week=w+1, N=weekNums(T,week), plan=weekPlan(T,week), sc=N.score;
  var scoreLine='';
  if(sc!=null){
    scoreLine='<p class="score'+(sc>=85?' ok':'')+'">Выполнение '+sc+'%'+(sc>=85?'. Неделя уже удалась.':'')+'</p>';
  }
  var rewDay=week*7;
  T.rewards=T.rewards||{};
  var html='<div class="t28"><p class="dk">Дни '+a+'–'+b+'</p><h1>Неделя '+week+'</h1>'+
    (T.strategy?weekStrat(T,w):numsHtml(N))+
    svgChart(T,a,b,T.hiddenMet||{},'');
  if(!T.strategy){html+='<div class="row-line"><b>План недели</b><div class="plan">';
  for(var i=0;i<3;i++){
    html+='<div class="it"><input type="checkbox" data-act="plan-done" data-i="'+i+'" '+(plan.done[i]?'checked':'')+'><input type="text" data-act="plan-text" data-i="'+i+'" maxlength="160" placeholder="'+(i<2?'ключевое действие':'еще одно, если нужно')+'" value="'+esc(plan.actions[i]||'')+'"></div>';
  }
  html+='</div>'+scoreLine+'</div>';}
  html+='<div class="row-line"><b>Награда себе</b><input type="text" data-act="reward" data-d="'+rewDay+'" maxlength="160" placeholder="что будет наградой за эту неделю" value="'+esc(T.rewards[rewDay]||'')+'"></div>';
  html+=acc('wrev','Разбор недели','',
    '<input type="text" data-act="wrev" data-f="worked" placeholder="что сработало" value="'+esc(plan.review.worked||'')+'">'+
    '<input type="text" data-act="wrev" data-f="stuck" placeholder="что помешало" value="'+esc(plan.review.stuck||'')+'">'+
    '<input type="text" data-act="wrev" data-f="next" placeholder="что беру дальше" value="'+esc(plan.review.next||'')+'">'
  );
  html+='<button type="button" class="quiet-btn" data-act="space" data-s="map">К карте 28 дней</button></div>';
  return html;
}

function recipeOf(T){
  var signs=0, better=0, steps=0, filled=0, hiEnergy=0, withSigns=0;
  for(var n=1;n<=28;n++){
    var d=dayRec(T,n);
    if(!dayFilled(T,n))continue;
    filled++;
    var sg=(d.signs||[]).length; signs+=sg;
    if(sg)withSigns++;
    if(d.wishMark==='better'||(d.dirMarks||[]).indexOf('better')>=0)better++;
    if((d.dirState||[]).indexOf('done')>=0)steps++;
    if(+d.sliders.energy>=7)hiEnergy++;
  }
  if(!filled)return '';
  var bits=[];
  if(withSigns && withSigns>=Math.ceil(filled/3))bits.push('в дни, когда {появлялись|появлялись} знаки');
  if(steps)bits.push('когда {был|была} сделан маленький шаг');
  if(hiEnergy && hiEnergy>=2)bits.push('когда энергия была выше');
  if(better)bits.push('когда {ставил|ставила} отметку «стало лучше»');
  if(!bits.length)return '';
  return '<div class="res"><b>Рецепт успеха</b><p>Чаще сдвигалось '+bits.map(function(s){return gx(s)}).join(', ')+'. Это не правило, а только то, что видно по твоим отметкам.</p></div>';
}

function viewResults(P,T){
  var today=todayNum(T);
  T.rewards=T.rewards||{};
  var html='<div class="t28 res"><p class="dk">Результаты и путь</p><h1>Итоги</h1>';
  if(window.GTrackA){
    var st=GTrackA.starProgress(T);
    if(st.length)html+='<div class="row-line"><b>Три звезды</b>'+st.map(function(x){return '<p><b>'+esc(x.text)+'</b> · шагов: '+x.done+', стало лучше: '+x.better+', привычка: '+x.habit+'.</p>'}).join('')+'</div>';
    var notes=GTrackA.patterns(T,today);
    if(notes.length)html+='<div class="row-line"><b>Что уже видно</b>'+notes.map(function(t){return '<p>'+esc(t)+'</p>'}).join('')+'</div>';
    var cmp=GTrackA.compareWeeks(T);
    html+='<div class="row-line"><b>Неделя 1 и неделя 4</b>'+cmp.map(function(x){return '<p>'+esc(x.name)+': '+(x.w1==null?'нет отметок':x.w1)+(x.w4==null?'':' → '+x.w4)+'</p>'}).join('')+'</div>';
  }
  html+='<button type="button" class="quiet-btn" data-act="space" data-s="mirror">Открыть «Зеркало прожитой жизни»</button>';
  var archivedCycles=P.trackerHistory||[];
  if(archivedCycles.length){
    html+='<section class="row-line"><b>Архив циклов</b><p class="mute">Здесь хранятся завершенные циклы. Архив доступен для просмотра и не изменяет текущие записи.</p>';
    html+=archivedCycles.map(function(a,i){
      var date=a.archivedAt||a.cycleEndedAt||a.start||Date.now(),filled=0,events=0;
      for(var d=1;d<=28;d++){var rec=(a.days||{})[String(d)]||{};if(rec.note||rec.res||rec.wishMark||(rec.signs||[]).length||(rec.grat||[]).length||(rec.choose||[]).length||Object.keys(rec.sliders||{}).length)filled++}
      Object.keys(a.events24||{}).forEach(function(k){events+=(a.events24[k]||[]).length});
      return '<div class="archive-cycle"><b>Цикл '+(a.cycle||i+1)+'</b><span>'+new Date(date).toLocaleDateString('ru-RU')+' · дней с записями: '+filled+'/28 · событий: '+events+'</span><button type="button" class="quiet-btn" data-act="archive-open" data-i="'+i+'">Открыть дневник цикла</button>'+(a.mirror&&a.mirror.phase==='report'?'<button type="button" class="quiet-btn" data-act="mirror-archive" data-i="'+i+'">Открыть отчет Зеркала</button>':'')+'</div>';
    }).join('');
    html+='</section>';
  }
  html+=svgChart(T,1,28,T.hiddenMet||{},'')+recipeOf(T);
  var rew=[7,14,21,28].filter(function(d){return T.rewards[d]}).map(function(d){return '<p>День '+d+': '+esc(T.rewards[d])+'</p>'}).join('');
  html+='<div class="row-line"><b>Награда за цикл</b><input type="text" data-act="reward" data-d="28" maxlength="160" placeholder="награда себе за 28 дней" value="'+esc(T.rewards[28]||'')+'">'+rew+'</div>';
  if(today>=21){var M=T.mid||{};html+='<div class="card"><b>Сверка 21 дня</b><p class="mute">Три недели позади. Короткая сверка поможет пройти последнюю неделю точнее.</p>'+
    [['ok','Что получается'],['ch','Что изменилось'],['fix','Что скорректировать на последнюю неделю']].map(function(x){return '<input type="text" data-act="mid" data-f="'+x[0]+'" maxlength="200" placeholder="'+x[1]+'" value="'+esc(M[x[0]]||'')+'">'}).join('')+'</div>';}
  if(today>=28||T.finale)html+=finaleBlock(P,T);
  html+='<button type="button" class="quiet-btn" data-act="settings">Настройки</button>';
  html+='<button type="button" class="quiet-btn" data-act="space" data-s="path">К итогам</button></div>';
  return html;
}
function viewArchive(P,T){
  var i=+T.archiveIndex,A=(P.trackerHistory||[])[i];
  if(!A){delete T.archiveIndex;save(P);return viewResults(P,T)}
  var date=A.archivedAt||A.cycleEndedAt||A.start||Date.now();
  var html='<div class="t28"><p class="dk">Архив · цикл '+(A.cycle||i+1)+'</p><h1>История цикла</h1><p class="cap28">Начало: '+(A.start?new Date(A.start).toLocaleDateString('ru-RU'):'дата не записана')+' · завершение: '+new Date(date).toLocaleDateString('ru-RU')+'</p>';
  html+='<p class="mute">Это сохраненная копия. Записи доступны для просмотра и не редактируются.</p>';
  if(A.directions&&A.directions.length)html+='<section class="row-line"><b>Направления цикла</b>'+A.directions.map(function(x){return '<p>'+esc(typeof x==='string'?x:(x.text||x.t||x.name||''))+'</p>'}).join('')+'</section>';
  for(var n=1;n<=28;n++){
    var d=(A.days||{})[String(n)]||{},evs=(A.events24||{})[n]||[],cps=(A.checkpoints24||{})[n]||[],proofs=(A.proofs||[]).filter(function(x){return +x.day===n});
    var has=!!(d.note||d.res||d.wishMark||(d.signs||[]).length||(d.grat||[]).length||(d.choose||[]).length||Object.keys(d.sliders||{}).length||Object.keys(d.journal||{}).length||evs.length||cps.length||proofs.length);
    if(!has)continue;
    html+='<section class="row-line diary-day"><b>День '+n+'</b>';
    if(d.note)html+='<p>'+esc(d.note)+'</p>';
    if(d.res&&(d.res.saw||d.res.proof))html+='<p>'+esc(d.res.saw||'')+' '+esc(d.res.proof||'')+'</p>';
    if((d.signs||[]).length)html+='<div><b>Знаки</b>'+d.signs.map(function(x){return '<p>'+esc(x.tag||'')+' '+esc(x.text||'')+'</p>'}).join('')+'</div>';
    if((d.grat||[]).length)html+='<div><b>Благодарность</b>'+d.grat.map(function(x){return '<p>'+esc(x.text||x)+'</p>'}).join('')+'</div>';
    if((d.choose||[]).length)html+='<div><b>Выборы и действия</b>'+d.choose.map(function(x){return '<p>'+esc(x.text||'')+' · '+esc(x.status||'')+'</p>'}).join('')+'</div>';
    Object.keys(d.journal||{}).forEach(function(k){if(d.journal[k])html+='<p><b>'+esc(k)+'</b> · '+esc(d.journal[k])+'</p>'});
    if(proofs.length)html+='<div><b>Доказательства</b>'+proofs.map(function(x){return '<p>'+esc(x.text||'')+'</p>'}).join('')+'</div>';
    evs.forEach(function(e){html+='<div class="diary-event"><b>'+esc(e.title||'Событие')+'</b><span>'+trackClock(e.startMin)+'–'+trackClock(e.endMin)+'</span><p>'+[e.sphere,e.motive,e.emotion,e.after].filter(Boolean).map(esc).join(' · ')+'</p></div>'});
    cps.forEach(function(x){html+='<p class="mute">Контрольная точка '+trackClock(x.minute)+' · настроение '+x.mood+'/10 · энергия '+x.energy+'/10 '+esc(x.note||'')+'</p>'});
    html+='</section>';
  }
  if(A.mirror&&A.mirror.phase==='report')html+='<button type="button" class="quiet-btn" data-act="mirror-archive" data-i="'+i+'">Открыть отчет Зеркала этого цикла</button>';
  html+='<button type="button" class="go" data-act="archive-close">Вернуться к результатам</button></div>';
  return html;
}
function avgWeek(T,w,key){
  var a=w*7+1,b=a+6,s=0,c=0;
  for(var i=a;i<=b;i++){var v=dayRec(T,i).sliders[key]; if(v!=null&&v!==''){s+=+v;c++}}
  return c?Math.round(s/c*10)/10:null;
}
function finaleBlock(P,T){
  var wish=wishText(T);
  var fate=(T.finale&&T.finale.fate)||'';
  var w0=P.wheel||[], w1=(P.retest&&P.retest.wheel)||(T.finale&&T.finale.wheel)||[];
  var names=['Здоровье','Финансы','Карьера','Отношения','Семья','Друзья','Рост','Отдых'];
  var wheelH='';
  if(w0.length===8){
    wheelH='<div class="card"><b>Колесо</b>'+names.map(function(n,i){
      return '<p>'+esc(n)+': было '+(w0[i]!=null?w0[i]:'—')+(w1[i]!=null?' → стало '+w1[i]:'')+'</p>';
    }).join('')+'</div>';
  }
  var sl='<div class="card"><b>Бегунки: неделя 1 и неделя 4</b>'+MET.map(function(m){
    var a=avgWeek(T,0,m.key), b=avgWeek(T,3,m.key);
    return '<p>'+esc(m.name)+': '+(a==null?'нет отметок':a)+(b==null?'':' → '+b)+'</p>';
  }).join('')+'</div>';
  var dirH='<div class="card"><b>Три звезды</b>'+dirs(T).map(function(dir,i){
    var done=0, marks={}; for(var n=1;n<=28;n++){var d=dayRec(T,n); if(d.dirState[i]==='done')done++; if(d.dirMarks[i])marks[d.dirMarks[i]]=(marks[d.dirMarks[i]]||0)+1;}
    return '<p><b>'+esc(dir.text)+'</b> · шагов сделано: '+done+'. Стало лучше: '+(marks.better||0)+', привычка: '+(marks.habit||0)+', вопрос решился: '+(marks.solved||0)+'.</p>';
  }).join('')+'</div>';
  var wm={}; for(var n=1;n<=28;n++){var m=dayRec(T,n).wishMark; if(m)wm[m]=(wm[m]||0)+1;}
  var signs=0; for(n=1;n<=28;n++)signs+=(dayRec(T,n).signs||[]).length;
  return '<h1>Было и стало</h1>'+wheelH+sl+dirH+
    '<div class="card finale-card"><b>Судьба центральной звезды</b><p class="wishline">'+esc(wish)+'</p>'+
    '<p class="mute">Этот вопрос задается только здесь, в конце цикла. Знаков за 28 дней: '+signs+'. Отметок «стало лучше»: '+(wm.better||0)+', привычка: '+(wm.habit||0)+', вопрос решился: '+(wm.solved||0)+'.</p>'+
    '<div class="fate">'+[['came','сбылось'],['closer','приблизилось'],['letgo','отпущено']].map(function(x){
      return '<button type="button" class="'+(fate===x[0]?'on':'')+'" data-act="fate" data-v="'+x[0]+'">'+x[1]+'</button>';
    }).join('')+'</div></div>'+
    '<button class="go" type="button" data-act="card">Сохранить карточку</button>'+
    '<button type="button" class="quiet-btn" data-act="newcycle">Начать новый цикл</button>';
}

function viewSettings(P,T){
  return '<div class="t28"><h1>Настройки</h1>'+
    '<div class="row-line"><b>Мягкое напоминание</b>'+
    '<input type="time" data-act="notify-time" value="'+(T.notifyTime||'')+'">'+
    '<button type="button" class="quiet-btn" data-act="notify-on">'+(T.notifyOn?'Напоминание включено':'Включить, если браузер позволит')+'</button></div>'+
    '<button type="button" class="quiet-btn" data-act="monthg">К итогам</button>'+
    '<button type="button" class="quiet-btn" data-act="back">К сетке</button></div>';
}

function viewReview(P,T){
  var n=T.reviewDay||todayNum(T), d=dayRec(T,n), lines=[];
  var sg=(d.signs||[]).length;
  if(sg)lines.push(gx('Сегодня {заметил|заметила} '+sg+(sg===1?' знак':sg<5?' знака':' знаков')+'.'));
  var done=(d.dirState||[]).filter(function(x){return x==='done'}).length;
  if(done)lines.push('Маленький шаг выполнен'+(done>1?': '+done+'.':'.'));
  if(d.wishMark==='better'||(d.dirMarks||[]).indexOf('better')>=0)lines.push('Есть отметка «стало лучше».');
  if((d.brakeWords||[]).length)lines.push(gx('{Поймал|Поймала} слово-тормоз и {увидел|увидела} мягкую замену.'));
  var RV={done:'Шаг дня сделан.',part:'Шаг сделан частично. Это тоже движение.',min:'Ты выбрал(а) минимальную версию. Так система остается гибкой в трудные дни.',other:'Ты выбрал(а) другой шаг. Он тоже засчитан.',fail:'Сегодня не получилось. Ничего не обнуляется: завтра игра предложит шаг полегче.'};
  if(d.res&&RV[d.res.v])lines.unshift(gx(RV[d.res.v]));
  if(T.strategy&&n<28){var nx=GStrategy.adapt(T,n+1);if(nx)lines.push('Завтра: '+nx.m)}
  if(!lines.length)lines.push('День можно дозаполнить позже. Без штрафа.');
  return '<div class="t28 review"><p class="dk">День '+n+'</p><h1>Короткий разбор</h1>'+
    lines.map(function(s){return '<p>'+esc(s)+'</p>'}).join('')+
    '<button class="go" type="button" data-act="back">К сетке</button></div>';
}

function maybeBonus(d,T){
  var done=(d.choose||[]).filter(function(r){return !r.bonus&&(r.status==='done'||r.status==='switched')}).length;
  var bon=(d.choose||[]).filter(function(r){return r.bonus}).length;
  if(Math.floor(done/3)>bon){
    d.choose.push({id:uid(),bonus:true,text:wishText(T),status:'bonus',tChoose:Date.now()});
  }
}

function openAccAfterRender(id){
  var a=host&&host.querySelector('.acc[data-acc="'+id+'"]');
  if(a){
    a.classList.add('open');
    var par=a.parentNode&&a.parentNode.closest&&a.parentNode.closest('.acc');
    if(par)par.classList.add('open');
  }
}

function bind(){
  if(!host)return;
  host.onclick=function(e){
    var b=e.target.closest('[data-act]'); if(!b)return;
    var act=b.getAttribute('data-act');
    var P=ensure(), T=Tget(P), n=T.openDay||todayNum(T), d=dayRec(T,n);
    tick();
    if(act==='archive-open'){T.archiveIndex=+b.getAttribute('data-i');save(P);render();return}
    if(act==='archive-close'){delete T.archiveIndex;save(P);render();return}
    if(act==='space'){
      var sp=b.getAttribute('data-s');
      T.space=sp;
      T.view=({map:'month',path:'monthg',results:'monthg',lab:'practs',practs:'practs',labs:'labs',diary:'diary',directions:'directions',mirror:'mirror',hero:'hero',day:'day'})[sp]||'day';
      if(sp==='day'&&!T.openDay)T.openDay=todayNum(T);
      save(P); render(); try{window.scrollTo(0,0)}catch(e){} return;
    }
    if(act==='start-cycle'){T.strategySeen=true;T.space='day';T.view='day';if(!T.start)T.start=Date.now();if(!P.cycleBaseline){P.cycleBaseline={wheel:(Array.isArray(P.wheel)?P.wheel:[]).slice(),research:mirrorInitialResearch(P),cycle:T.cycle||1,capturedAt:Date.now(),source:'initial'};}T.openDay=todayNum(T);save(P);render();try{window.scrollTo(0,0)}catch(e){}return}
    if(act==='open'){
      var nn=+b.getAttribute('data-n');
      T.space='day'; T.view='day'; T.openDay=nn;
      save(P); render(); return;
    }
    if(act==='res'){var v=b.getAttribute('data-v');d.res=d.res||{};d.res.v=(d.res.v===v?'':v);d.res.t=Date.now();if(!d.res.v)delete d.res;save(P);render();return}
    if(act==='practs'){T.space='lab';T.view='practs';save(P);render();try{window.scrollTo(0,0)}catch(e){}return}
    if(act==='pr-on'){
      var id=b.getAttribute('data-id'), dayn=todayNum(T);
      if(window.GPract){var r=GPract.activate(T,id,dayn); if(!r.ok){alert(r.err||'Не удалось включить');return}}
      else {T.act=T.act||{};T.act[id]={from:dayn,len:(prc(id)||{len:7}).len,at:Date.now()}}
      save(P);render();return
    }
    if(act==='counter'){var ck=b.getAttribute('data-k'),delta=+b.getAttribute('data-delta')||0,limits={water:20,movement:600,meals:8};d.lightCounters=d.lightCounters||{};d.lightCounters[ck]=Math.max(0,Math.min(limits[ck]||20,(+d.lightCounters[ck]||0)+delta));save(P);render();openAccAfterRender('light');return}
    if(act==='support-phrase'){T.support=T.support||{};T.support.phraseIndex=((+T.support.phraseIndex||0)+1)%5;save(P);render();return}
    if(act==='pr-off'){
      var id=b.getAttribute('data-id');
      if(window.GPract)GPract.pause(T,id,todayNum(T));
      else {var a=T.act[id];if(a){a.len=Math.max(1,todayNum(T)-a.from+1);a.stopped=Date.now()}}
      save(P);render();return
    }
    if(act==='today'){T.space='day'; T.view='day'; T.openDay=todayNum(T); save(P); render(); return}
    if(act==='done'){d.hintSeen=true; T.reviewDay=n; T.openDay=n; T.view='review'; save(P); render(); return}
    if(act==='weekg'){T.space='map'; T.view='week'; T.weekN=+b.getAttribute('data-w'); save(P); render(); return}
    if(act==='monthg'){T.space='path'; T.view='monthg'; save(P); render(); return}
    if(act==='finale'){T.space='path'; T.view='finale'; save(P); render(); return}
    if(act==='settings'){T.view='settings'; save(P); render(); return}
    if(act==='back'){
      if(T.view==='week'){T.view='month';T.space='map'}
      else if(T.view==='review'){T.view='day';T.space='day'}
      else {T.view='day';T.space='day'}
      save(P); render(); return
    }
    if(act==='tog-met'){T.hiddenMet=T.hiddenMet||{}; var k=b.getAttribute('data-k'); T.hiddenMet[k]=!T.hiddenMet[k]; save(P); render(); return}
    if(act==='notify-on'){
      T.notifyOn=true;
      var ask=function(){save(P); render()};
      if(typeof Notification!=='undefined'){
        if(Notification.permission==='granted'){T.notifyOk=true; scheduleNote(T); ask(); return}
        Notification.requestPermission().then(function(p){T.notifyOk=p==='granted'; if(T.notifyOk)scheduleNote(T); else T.notifyOn=true; ask()});
      } else ask();
      return;
    }
    if(act==='sign-add'){
      var inp=host.querySelector('[data-act="sign-in"]'); var tag=host.querySelector('[data-act="sign-tag"]');
      var tx=(inp&&inp.value||'').trim(); if(!tx)return;
      d.signs=d.signs||[]; if(d.signs.length>=5)return;
      d.signs.push({text:tx,tag:tag?tag.value:'',t:Date.now()});
      proofsAdd(T,tx,n); save(P); render(); openAccAfterRender('proof'); return;
    }
    if(act==='mark'){
      var who=b.getAttribute('data-who'), m=b.getAttribute('data-m');
      if(who==='wish')d.wishMark=(d.wishMark===m?'':m);
      else {var i=+b.getAttribute('data-i'); d.dirMarks[i]=(d.dirMarks[i]===m?'':m)}
      save(P); render(); return;
    }
    if(act==='dir-st'){var i=+b.getAttribute('data-i'), s=b.getAttribute('data-s'); d.dirState[i]=(d.dirState[i]===s?'':s); if(s==='done'){d.dirDoneAt=d.dirDoneAt||{}; d.dirDoneAt[i]=Date.now()} save(P); render(); return}
    if(act==='brake'){
      var id=b.getAttribute('data-id'); d.brakeWords=d.brakeWords||[];
      var ix=d.brakeWords.indexOf(id);
      if(ix>=0)d.brakeWords.splice(ix,1); else d.brakeWords.push(id);
      d.brakeLast=id; save(P); render(); openAccAfterRender('brake'); return;
    }
    if(act==='bw'){
      var z=b.getAttribute('data-z'),bid=b.getAttribute('data-id'),key=dayDate(T,n);
      P.betray=P.betray||{};P.betray.days=P.betray.days||{};var rr=P.betray.days[key]=P.betray.days[key]||{sh:[],sp:[]};rr[z]=rr[z]||[];
      var bi=rr[z].indexOf(bid);if(bi>=0)rr[z].splice(bi,1);else rr[z].push(bid);rr.t=Date.now();rr.day=n;
      d.betrayMarks=(rr.sh||[]).concat(rr.sp||[]);
      var y=window.scrollY;save(P); render(); try{window.scrollTo(0,y)}catch(e){} return;
    }
    if(act==='betray-mark'){
      var id=b.getAttribute('data-id'); d.betrayMarks=d.betrayMarks||[];
      var ix=d.betrayMarks.indexOf(id);
      if(ix>=0)d.betrayMarks.splice(ix,1); else d.betrayMarks.push(id);
      save(P); render(); openAccAfterRender('betray'); return;
    }
    if(act==='ch-add'){
      var inp=host.querySelector('[data-act="ch-in"]'); var tx=(inp&&inp.value||'').trim(); if(!tx)return;
      d.choose.push({id:uid(),text:tx,status:'pick',tChoose:Date.now()}); save(P); render(); openAccAfterRender('choose'); return;
    }
    if(act==='ch-st'){
      var id=b.getAttribute('data-id'), s=b.getAttribute('data-s');
      d.choose.forEach(function(r){if(r.id===id){r.status=s; if(s==='do')r.tDo=Date.now(); if(s==='done')r.tDone=Date.now()}});
      maybeBonus(d,T); save(P); render(); openAccAfterRender('choose'); return;
    }
    if(act==='notice'){
      var id=b.getAttribute('data-id');
      d.choose.forEach(function(r){if(r.id===id)r.noticed=Date.now()});
      proofsAdd(T,'Заметка внимания: '+(wishText(T)||'желание'),n); save(P); render(); openAccAfterRender('proof'); return;
    }
    if(act==='grat-add'){
      var inp=host.querySelector('[data-act="grat-in"]'); var tx=(inp&&inp.value||'').trim(); if(!tx)return;
      d.grat.push({text:tx,t:Date.now()}); save(P); render(); openAccAfterRender('grat'); return;
    }
    if(act==='pract'){
      var id=b.getAttribute('data-id'); T.practices=T.practices||{}; var c=T.practices[id]=T.practices[id]||{count:0,streak:0};
      var day=new Date().toDateString(); c.count=(c.count||0)+1; c.last=day; c.streak=(c.streak||0)+1; save(P); render(); openAccAfterRender('pract'); return;
    }
    if(act==='pract-on'){
      var id=b.getAttribute('data-id'); T.practices=T.practices||{}; var c=T.practices[id]=T.practices[id]||{count:0,streak:0};
      c.until=Date.now()+2*3600*1000; save(P); render(); openAccAfterRender('pract'); return;
    }
    if(act==='acc'){
      b.parentNode.classList.toggle('open');
      var par=b.parentNode.parentNode&&b.parentNode.parentNode.closest&&b.parentNode.parentNode.closest('.acc');
      if(par)par.classList.add('open');
      return;
    }
    if(act==='event-add'){
      var dr=(T.eventDraft&&T.eventDraft[n])||{},title=String(dr.title||'').trim(),start=String(dr.start||''),end=String(dr.end||'');
      function toMin(v){var m=/^(\d{2}):(\d{2})$/.exec(v);return m?(+m[1]*60+ +m[2]):null}
      var sm=toMin(start),em=toMin(end);
      if(!title||sm===null||em===null){alert('Укажите название события, время начала и окончания.');return}
      if(em<=sm)em+=1440;
      if(em-sm>1440){alert('Одно событие можно записать длительностью не более 24 часов.');return}
      T.events24=T.events24||{};T.events24[n]=T.events24[n]||[];
      var evData={title:title,startMin:sm,endMin:em,type:dr.type||'activity',sphere:dr.sphere||'',motive:dr.motive||'',emotion:dr.emotion||'',planned:dr.planned||'',focus:dr.focus||'',completion:dr.completion||'',after:dr.after||'',alternative:String(dr.alternative||'').trim()};
      if(T.editingEvent&&T.editingEvent.day===n){var list=T.events24[n],old=list.filter(function(x){return x.id===T.editingEvent.id})[0];if(old)Object.keys(evData).forEach(function(k){old[k]=evData[k]});else list.push(Object.assign({id:uid(),createdAt:Date.now()},evData));T.editingEvent=null}
      else T.events24[n].push(Object.assign({id:uid(),createdAt:Date.now()},evData));
      T.eventDraft=T.eventDraft||{};delete T.eventDraft[n];save(P);render();openAccAfterRender('events24');return;
    }
    if(act==='checkpoint-add'){
      var cd=(T.checkpointDraft&&T.checkpointDraft[n])||{},tm=String(cd.time||''),mm=+cd.mood,ee=+cd.energy;
      function cm(v){var z=/^(\d{2}):(\d{2})$/.exec(v);return z?(+z[1]*60+ +z[2]):null}
      var mn=cm(tm);if(mn===null||!(mm>=1&&mm<=10)||!(ee>=1&&ee<=10)){alert('Укажите время, настроение и энергию от 1 до 10.');return}
      T.checkpoints24=T.checkpoints24||{};T.checkpoints24[n]=T.checkpoints24[n]||[];T.checkpoints24[n].push({id:uid(),minute:mn,mood:mm,energy:ee,note:String(cd.note||'').trim(),at:Date.now()});T.checkpointDraft=T.checkpointDraft||{};delete T.checkpointDraft[n];save(P);render();openAccAfterRender('events24');return;
    }
    if(act==='checkpoint-delete'){var dn=+b.getAttribute('data-day'),did=b.getAttribute('data-id');T.checkpoints24=T.checkpoints24||{};T.checkpoints24[dn]=(T.checkpoints24[dn]||[]).filter(function(x){return x.id!==did});if(!T.checkpoints24[dn].length)delete T.checkpoints24[dn];save(P);render();openAccAfterRender('events24');return}
    if(act==='mirror-archive'){T.mirrorArchiveIndex=+b.getAttribute('data-i');save(P);render();return}
    if(act==='mirror-archive-back'){delete T.mirrorArchiveIndex;save(P);render();return}
    if(act==='mirror-continue'){
      var M=T.mirror||{};
      if(M.phase!=='report'||!Array.isArray(M.endWheel)||M.endWheel.length!==8||M.endWheel.some(function(v){return typeof v!=='number'||!isFinite(v)})||!Array.isArray(M.endResearch)||M.endResearch.length!==24||M.endResearch.some(function(v){return v!=='na'&&(typeof v!=='number'||!isFinite(v))})){alert('Проверьте повторное исследование: заполните все оценки колеса и ответы. Для исследовательского вопроса можно выбрать «не знаю».');return}
      P.retest={wheel:M.endWheel.slice(),beh:null,fromMirror:true,d:new Date().toLocaleDateString('ru'),mirror:{initialResearch:(M.initialResearch||mirrorInitialResearch(P)||[]).slice(),endResearch:M.endResearch.slice(),initialWheel:(M.initialWheel||P.wheel||[]).slice(),completedAt:M.completedAt||Date.now()}};
      save(P);location.href='slot.html?id=compare';return;
    }
    if(act==='mirror-start'||act==='mirror-restart'){
      var hist=(T.mirror&&T.mirror.history)||[];
      if(T.mirror&&T.mirror.phase==='report')hist=hist.concat([{startedAt:T.mirror.startedAt,completedAt:T.mirror.completedAt,endWheel:T.mirror.endWheel,endResearch:T.mirror.endResearch,reflection:T.mirror.reflection}]);
      T.mirror={version:1,phase:'self',endWheel:Array(8).fill(null),endResearch:Array(24).fill(null),researchIndex:0,startedAt:Date.now(),initialWheel:((P.cycleBaseline&&P.cycleBaseline.wheel)||P.wheel||[]).slice(),initialResearch:mirrorInitialResearch(P).slice(),history:hist};delete T.mirrorArchiveIndex;
      save(P);render();return;
    }
    if(act==='mirror-wheel-save'){
      var M=T.mirror||{},W=M.endWheel||[];
      if(W.length!==8||W.some(function(v){return typeof v!=='number'||v<1||v>10})){alert('Поставьте оценку для каждой из восьми сфер.');return}
      M.phase='research';M.researchIndex=0;M.endResearch=M.endResearch||Array(24).fill(null);T.mirror=M;save(P);render();return;
    }
    if(act==='mirror-answer'){
      var M=T.mirror||{},ix=+M.researchIndex||0,v=b.getAttribute('data-v');
      if(ix<0||ix>=24)return;
      M.endResearch=M.endResearch||Array(24).fill(null);M.endResearch[ix]=v==='na'?'na':+v;M.researchIndex=ix+1;
      if(M.researchIndex>=24){M.phase='report';M.completedAt=Date.now()}
      T.mirror=M;save(P);render();return;
    }
    if(act==='mirror-back-self'){if(T.mirror){T.mirror.phase='self';save(P);render()}return}
    if(act==='event-edit'){
      var eday=+b.getAttribute('data-day'),eid=b.getAttribute('data-id'),ex=((T.events24||{})[eday]||[]).filter(function(x){return x.id===eid})[0];
      if(!ex)return;
      n=eday;T.openDay=eday;T.space='day';T.view='day';
      function tm(v){v=+v;return ('0'+Math.floor((v%1440)/60)).slice(-2)+':'+('0'+(v%60)).slice(-2)}
      T.editingEvent={day:eday,id:eid};T.eventDraft=T.eventDraft||{};T.eventDraft[n]={title:ex.title,start:tm(ex.startMin),end:tm(ex.endMin),type:ex.type||'activity',sphere:ex.sphere||'',motive:ex.motive||'',emotion:ex.emotion||'',planned:ex.planned||'',focus:ex.focus||'',completion:ex.completion||'',after:ex.after||'',alternative:ex.alternative||''};save(P);render();openAccAfterRender('events24');return;
    }
    if(act==='event-cancel'){if(T.eventDraft)delete T.eventDraft[n];T.editingEvent=null;save(P);render();openAccAfterRender('events24');return}
    if(act==='event-delete'){
      var en=+b.getAttribute('data-day'),eid=b.getAttribute('data-id');if(T.editingEvent&&T.editingEvent.id===eid){T.editingEvent=null;if(T.eventDraft)delete T.eventDraft[en]}T.events24=T.events24||{};T.events24[en]=(T.events24[en]||[]).filter(function(x){return x.id!==eid});if(!T.events24[en].length)delete T.events24[en];save(P);render();openAccAfterRender('events24');return;
    }
    if(act==='hour-t'){d.openHour=d.openHour===+b.getAttribute('data-h')?null:+b.getAttribute('data-h'); save(P); render(); openAccAfterRender('hours'); return}
    if(act==='fate'){
      T.finale=T.finale||{}; T.finale.fate=b.getAttribute('data-v'); T.finale.done=true; T.finale.at=Date.now();
      if(window.GRoute)GRoute.complete('reactor.html');
      save(P); if(window.GArts)GArts.grant('proof_sign'); render(); return;
    }
    if(act==='newcycle'){
      if(!T.mirror||T.mirror.phase!=='report'){
        if(!T.mirror)T.mirror={version:1,phase:'self',endWheel:Array(8).fill(null),endResearch:Array(24).fill(null),researchIndex:0,startedAt:Date.now(),initialWheel:((P.cycleBaseline&&P.cycleBaseline.wheel)||P.wheel||[]).slice(),initialResearch:mirrorInitialResearch(P).slice(),history:[]};
        T.space='mirror';T.view='mirror';save(P);render();return;
      }
      if(!window.confirm('Сохранить весь текущий цикл в архиве и начать новый?'))return;
      var completedMirror=T.mirror&&T.mirror.phase==='report'&&Array.isArray(T.mirror.endWheel)&&T.mirror.endWheel.length===8&&T.mirror.endWheel.every(function(v){return typeof v==='number'&&isFinite(v)})&&Array.isArray(T.mirror.endResearch)&&T.mirror.endResearch.length===24&&T.mirror.endResearch.every(function(v){return v==='na'||(typeof v==='number'&&isFinite(v))});
      /* Сначала фиксируем исходную точку и полный старый цикл. Новый baseline
         нельзя записывать до архивации: иначе отчет прошлого цикла получит
         данные уже следующего цикла. */
      var baselineBefore=P.cycleBaseline?JSON.parse(JSON.stringify(P.cycleBaseline)):null;
      var retestBefore=P.retest?JSON.parse(JSON.stringify(P.retest)):null;
      var archived=JSON.parse(JSON.stringify(T));
      archived.archiveVersion=2;
      archived.archivedAt=Date.now();
      archived.cycleStartedAt=T.start||null;
      archived.cycleEndedAt=archived.archivedAt;
      if(baselineBefore)archived.cycleBaseline=baselineBefore;
      if(retestBefore)archived.retest=retestBefore;
      P.trackerHistory=P.trackerHistory||[];
      if(!P.trackerHistory.some(function(x){return x&&x.cycle===(T.cycle||1)&&((x.start||null)===(T.start||null))}))P.trackerHistory.push(archived);
      if(completedMirror){
        var nextWheel=T.mirror.endWheel.slice(),nextResearch=mirrorResearchAvg(T.mirror.endResearch);
        P.wheel=nextWheel.slice();
        P.cycleBaseline={wheel:nextWheel,research:nextResearch,cycle:(T.cycle||1)+1,capturedAt:Date.now(),source:'mirror'};
      }
      /* Повторный замер относится к закрытому циклу: не переносим его в новый. */
      delete P.retest;
      var nextCycle={
        version:T.version||1,
        cycle:(T.cycle||1)+1,
        start:Date.now(),
        days:{},events24:{},eventDraft:{},checkpoints24:{},checkpointDraft:{},
        weekPlans:{},rewards:{},proofs:[],openDay:1,view:'month',space:'map',
        directions:JSON.parse(JSON.stringify(T.directions||[])),
        directionPlans:JSON.parse(JSON.stringify(T.directionPlans||{})),
        strategy:JSON.parse(JSON.stringify(T.strategy||null)),
        strategySeen:!!T.strategySeen,
        declared:!!T.declared,
        ifthens:(T.ifthens||['','','']).slice(),
        hiddenMet:{},
        practices:JSON.parse(JSON.stringify(T.practices||{})),
        act:JSON.parse(JSON.stringify(T.act||{})),
        practHist:[],
        support:{fiveMinDays:{},weeklyExperience:{},note:'',phraseIndex:(T.support&&T.support.phraseIndex)||0},
        notifyOn:!!T.notifyOn,
        notifyTime:T.notifyTime||'',
        mirror:null,
        prev:[]
      };
      P.tracker=nextCycle;
      save(P); render(); return;
    }
    if(act==='card'){try{drawCard(P,T)}catch(e){} return}
  };
  host.onchange=function(e){
    var el=e.target, act=el.getAttribute('data-act'); if(!act)return;
    var P=ensure(), T=Tget(P), n=T.openDay||todayNum(T);
    if(act==='mirror-wheel'){T.mirror=T.mirror||{version:1,phase:'self',endWheel:Array(8).fill(null),endResearch:Array(24).fill(null),researchIndex:0};T.mirror.endWheel=T.mirror.endWheel||Array(8).fill(null);T.mirror.endWheel[+el.getAttribute('data-i')]=el.value===''?null:+el.value;save(P);return}
    if(act==='mirror-note'){T.mirror=T.mirror||{};T.mirror.reflection=T.mirror.reflection||{};T.mirror.reflection[el.getAttribute('data-key')]=el.value;save(P);return}
    if(act==='support-five'){T.support=T.support||{};T.support.fiveMinDays=T.support.fiveMinDays||{};T.support.fiveMinDays[todayNum(T)]=!!el.checked;save(P);return}
    if(act==='event-field'){T.eventDraft=T.eventDraft||{};T.eventDraft[n]=T.eventDraft[n]||{};T.eventDraft[n][el.getAttribute('data-key')]=el.value;save(P);return}
    if(act==='checkpoint-field'){T.checkpointDraft=T.checkpointDraft||{};T.checkpointDraft[n]=T.checkpointDraft[n]||{};T.checkpointDraft[n][el.getAttribute('data-key')]=el.value;save(P);return}
    if(act==='plan-done'){
      var i=+el.getAttribute('data-i'), plan=weekPlan(T,(T.weekN||0)+1);
      plan.done[i]=!!el.checked; save(P); render(); return;
    }
  };
  host.oninput=function(e){
    var el=e.target, act=el.getAttribute('data-act'); if(!act)return;
    var P=ensure(), T=Tget(P), n=T.openDay||todayNum(T), d=dayRec(T,n);
    if(act==='event-field'){T.eventDraft=T.eventDraft||{};T.eventDraft[n]=T.eventDraft[n]||{};T.eventDraft[n][el.getAttribute('data-key')]=el.value;save(P);return}
    if(act==='checkpoint-field'){T.checkpointDraft=T.checkpointDraft||{};T.checkpointDraft[n]=T.checkpointDraft[n]||{};T.checkpointDraft[n][el.getAttribute('data-key')]=el.value;save(P);return}
    if(act==='slider'){d.sliders[el.getAttribute('data-k')]=+el.value; save(P); var m=MET.filter(function(x){return x.key===el.getAttribute('data-k')})[0]; var tip=el.parentNode.querySelector('.soft-tip'); if(tip)tip.textContent=sliderHint(m,+el.value); var sm=el.parentNode.querySelector('label small'); if(sm&&m)sm.textContent=m.sub+' · '+el.value; return}
    if(act==='dir-step'){d.dirSteps[+el.getAttribute('data-i')]=el.value; save(P); return}
    if(act==='dir-plan'){T.directionPlans=T.directionPlans||{};var di=+el.getAttribute('data-i'),dk=el.getAttribute('data-k');T.directionPlans[di]=T.directionPlans[di]||{};T.directionPlans[di][dk]=el.value;save(P);return}
    if(act==='support-week'){T.support=T.support||{};T.support.weeklyExperience=T.support.weeklyExperience||{};T.support.weeklyExperience[el.getAttribute('data-w')]=el.value;save(P);return}
    if(act==='support-note'){T.support=T.support||{};T.support.note=el.value;save(P);return}
    if(act==='ifthen'){T.ifthens=T.ifthens||['','','']; T.ifthens[+el.getAttribute('data-i')]=el.value; save(P); return}
    if(act==='note'){d.note=el.value; save(P); return}
    if(act==='journal'){d.journal=d.journal||{};d.journal[el.getAttribute('data-id')]=el.value;save(P);return}
    if(act==='res-saw'){d.res=d.res||{};d.res.saw=el.value;save(P);return}
    if(act==='res-proof'){d.res=d.res||{};d.res.proof=el.value;T.proofs=(T.proofs||[]).filter(function(x){return !(x.day===n&&x.auto)});if(el.value.trim())T.proofs.push({t:Date.now(),day:n,text:el.value.trim(),auto:true});save(P);return}
    if(act==='custom'){T.custom=T.custom||{};if(el.value.trim())T.custom[n]=el.value.trim();else delete T.custom[n];save(P);return}
    if(act==='hour-in'){d.hours[el.getAttribute('data-h')]=d.hours[el.getAttribute('data-h')]||{}; d.hours[el.getAttribute('data-h')].text=el.value; save(P); return}
    if(act==='notify-time'){T.notifyTime=el.value; if(T.notifyOn&&T.notifyOk)scheduleNote(T); save(P); return}
    if(act==='plan-text'){var plan=weekPlan(T,(T.weekN||0)+1); plan.actions[+el.getAttribute('data-i')]=el.value; save(P); return}
    if(act==='wrev'){var plan=weekPlan(T,(T.weekN||0)+1); plan.review[el.getAttribute('data-f')]=el.value; save(P); return}
    if(act==='mid'){T.mid=T.mid||{}; T.mid[el.getAttribute('data-f')]=el.value; T.mid.done=!!(T.mid.ok||T.mid.ch||T.mid.fix); save(P); return}
    if(act==='reward'){T.rewards=T.rewards||{}; T.rewards[el.getAttribute('data-d')]=el.value; save(P); return}
  };
}

function scheduleNote(T){
  try{
    if(window._t28to)clearTimeout(window._t28to);
    if(!T.notifyTime||typeof Notification==='undefined'||Notification.permission!=='granted')return;
    var p=T.notifyTime.split(':'), now=new Date(), at=new Date();
    at.setHours(+p[0]||12, +p[1]||0, 0, 0);
    var ms=at-now; if(ms<0)ms+=86400000;
    window._t28to=setTimeout(function(){
      var P=ensure(), Tt=Tget(P), n=todayNum(Tt);
      try{new Notification('Настройка внимания',{body:hintOf(n),silent:true})}catch(e){}
    }, ms);
  }catch(e){}
}

function drawCard(P,T){
  var c=document.createElement('canvas'); c.width=900; c.height=1200; var g=c.getContext('2d');
  g.fillStyle='#0c0804'; g.fillRect(0,0,900,1200);
  g.fillStyle='#f0c870'; g.font='600 42px "Cormorant Garamond",serif'; g.fillText('Было и стало', 60, 90);
  g.fillStyle='#f4ecdf'; g.font='700 28px "Cormorant Garamond",serif';
  var w=wishText(T)||''; wrap(g,w,60,160,780,36);
  g.font='16px Manrope,sans-serif'; g.fillStyle='#c9a46a';
  var fate={came:'сбылось',closer:'приблизилось',letgo:'отпущено'}[(T.finale||{}).fate]||'цикл завершен';
  g.fillText('Желание: '+fate, 60, 280);
  g.fillText('Авторский путь · Майя Явь', 60, 1140);
  c.toBlob(function(b){var a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='bylo-i-stalo.png'; a.click()});
  function wrap(g,t,x,y,max,lh){var words=t.split(' '), line='', yy=y; words.forEach(function(w){var n=line+w+' '; if(g.measureText(n).width>max){g.fillText(line,x,yy); line=w+' '; yy+=lh} else line=n}); g.fillText(line,x,yy)}
}

/* start */
var root=document.getElementById('t28')||document.getElementById('wishTrack')||null;
if(!root){
  root=document.createElement('div'); root.id='t28';
  var pg=document.querySelector('.pg')||document.body;
  pg.insertBefore(root, pg.firstChild);
}
mount(root);
var P0=ensure(); if(P0.tracker&&P0.tracker.notifyOn)scheduleNote(P0.tracker);
window.GTrack28={mount:mount,render:render,ensure:ensure};
})();
