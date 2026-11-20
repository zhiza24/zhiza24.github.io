/* Трекер 28 дней: календарь 4x7, ритуал желания (подсказка + знаки), бегунки, графики, отметки прогресса. */
(function(){
'use strict';
var KEY='alch_v5_profile';
var HINTS=[
  'Сегодня присмотрись к встречам и разговорам: среди них может быть то, что приблизит твое желание.',
  'Сегодня могут попадаться знаки и совпадения — замечай их.',
  'Обрати внимание на случайные фразы, статьи, предложения — они могут подсказать следующий шаг.',
  'Прислушайся к телу: какое состояние сегодня само зовет тебя ближе к желаемому.',
  'Сегодня может открыться маленькая возможность — если она появится, просто заметь ее.',
  'Сегодня может найтись один крошечный шаг в сторону твоего желания. Если он тебе по силам, сделай его.',
  'Присмотрись, кто сегодня говорит с тобой теплее обычного: этот человек может случайно подсказать путь.',
  'Если попадется книга, пост или разговор на знакомую тему, задержись на минуту: там может быть нужная деталь.',
  'Сегодня может появиться развилка. Не торопись, просто заметь, какой выбор кажется живым.',
  'Обрати внимание, где в теле появляется тепло или легкость, когда ты думаешь о желании.',
  'Сегодня может встретиться человек, который уже прошел похожий путь. Если так случится, прислушайся.',
  'Случайная фраза в транспорте, в очереди или в переписке может отозваться — лови такие моменты.',
  'Если появится приглашение или свободное окно, посмотри, не ведет ли оно мягко к твоему желанию.',
  'Заметь, что ты уже {сделал|сделала} сегодня такого, что чуть приближает желаемое, даже если это мелочь.',
  'Сегодня присмотрись к лицам и интонациям: кто-то может сказать именно то, что тебе сейчас нужно услышать.',
  'Могут попасться старые записи, письма или заметки. Если так будет, открой их вниманием, без спешки.',
  'Сегодня, возможно, объявится простой ресурс: контакт, инструмент, свободный час. Просто держи глаза открытыми.',
  'Обрати внимание на сон и первые минуты после пробуждения: какой образ или чувство уже связано с желанием.',
  'Если день принесет необычное совпадение, не объясняй его сразу — просто запиши вечером в знаки дня.',
  'Сегодня маленький жест заботы о себе может сделать желание чуть ближе. Если он прост, попробуй.',
  'Присмотрись, кому ты сегодня {мог бы|могла бы} мягко сказать о своем направлении — хотя бы чтобы оно прозвучало вслух.',
  'Сегодня информация может прийти с неожиданной стороны: чужой опыт, совет, случайный пример.',
  'Если появится шанс сделать что-то чуть смелее обычного, почувствуй, откликается ли это желанию.',
  'Замечай моменты, когда становится тише и яснее: в этой тишине может всплыть следующий шаг.',
  'Сегодня встреча или разговор могут сложить два знакомых кусочка в одну картину. Если так случится, запомни.',
  'Обрати внимание на то, что повторяется уже не первый раз: тема, слово, человек. В этом может быть подсказка.',
  'Сегодня может найтись совсем маленькая дверь — звонок, сообщение, объявление. Не все двери нужно открывать, но заметить стоит.',
  'Перед вечером оглянись: даже одна деталь, что за день само пришло в сторону желания, уже настраивает внимание.'
];
var MET=[
  {key:'energy', name:'Энергия', sub:'сколько сил сейчас есть', color:'#C4A35A', low:'Сил мало. Может, сейчас достаточно короткой паузы «Вдох-выдох».'},
  {key:'mood', name:'Настроение', sub:'какой тон дня', color:'#7FA968', low:'День тяжелый. Можно ничего не форсировать и просто заметить, что ты чувствуешь.'},
  {key:'well', name:'Самочувствие', sub:'как тело откликается', color:'#6C86A0', low:'Телу может быть нужна вода, воздух или короткая опора. Один маленький жест уже достаточно.'},
  {key:'presence', name:'Присутствие', sub:'насколько ты здесь', color:'#B4552D', low:'Внимание разбежалось. Три медленных вдоха могут вернуть тебя в этот момент.'},
  {key:'support', name:'Внутренняя опора', sub:'насколько крепок твой выбор', color:'#C47A8A', low:'Опора сейчас тонкая. Достаточно одного маленького собственного выбора.'}
];
var MARKS=[
  {id:'better', t:'стало лучше'},
  {id:'habit', t:'привычка закрепляется'},
  {id:'solved', t:'вопрос решился'}
];
var SIGN_TAGS=['встреча','совпадение','информация','возможность','чувство'];
var BONUS_HINT='Эта строчка — подсказка для внимания. Когда ты держишь желание в поле зрения, легче замечать похожее вокруг: людей, идеи, возможности. Отмечай, что попалось, и продолжай: выбираю, делаю, сделано.';
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
function mount(el){host=el; var P=ensure(); var T=Tget(P); if(T.openDay==null)T.openDay=0; save(P); render()}

function spacesNav(space){
  var tabs=[['day','Мой день'],['map','Карта'],['lab','Практики'],['hero','Герой'],['path','Путь']];
  return '<nav class="spaces">'+tabs.map(function(t){return '<button type="button" class="'+(space===t[0]?'on':'')+'" data-act="space" data-s="'+t[0]+'">'+t[1]+'</button>'}).join('')+'</nav>';
}
function injectNav(html,space){
  return String(html).replace('<div class="t28">','<div class="t28">'+spacesNav(space)).replace('<div class="t28 res">','<div class="t28 res">'+spacesNav(space));
}
function render(){
  if(!host)return;
  var P=ensure(), T=Tget(P);
  if(!T.strategySeen&&T.strategy&&window.GStrategy){
    host.innerHTML=viewStrategy(P,T); bind(); return;
  }
  if(T.view==='settings'){host.innerHTML=viewSettings(P,T); bind(); return}
  if(T.view==='review'){host.innerHTML=viewReview(P,T); bind(); return}
  if(T.view==='week'){host.innerHTML=injectNav(viewWeek(P,T),'map'); bind(); return}
  var space=T.space||'day';
  if(space==='lab'||T.view==='practs'){host.innerHTML=injectNav(viewPracts(P,T),'lab'); bind(); return}
  if(space==='hero'){host.innerHTML=injectNav(viewHero(P,T),'hero'); bind(); return}
  if(space==='path'||T.view==='monthg'||T.view==='finale'){host.innerHTML=injectNav(viewResults(P,T),'path'); bind(); return}
  if(space==='map'){host.innerHTML=injectNav(viewMonth(P,T),'map'); bind(); return}
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
  {id:'choose',t:'Выбираю — делаю — сделано',len:7,d:'Дела дня по шагам. После каждого третьего появляется строчка с твоим желанием.'},
  {id:'brake',t:'Слова-тормоза',len:7,d:'Ловишь слово, которое тормозит, и видишь мягкую замену.'},
  {id:'betray',t:'Что узнаю в себе',len:7,d:'Отмечаешь, где сегодня включились перфекционизм, контроль, угождение или онемение.'},
  {id:'hours',t:'Блоки времени',len:1,d:'Почасовая сетка дня: куда уходят время, силы и внимание.'},
  {id:'pract',t:'Вдох-выдох, Я есмь, Тихое внимание',len:7,d:'Короткие практики на 2 часа с отметкой.'},
  {id:'signs',t:'Знаки дня',len:28,d:'Записываешь, что в жизни откликнулось на твое желание.'}
];
function prc(id){var x=PRC.filter(function(z){return z.id===id})[0];if(x)return x;var g=window.GPract&&GPract.byId(id);return g?{id:g.id,t:g.t,len:g.len,d:g.d}:null}
function actOn(T,id,n){var a=(T.act||{})[id];return a&&n>=a.from&&n<a.from+a.len?a:null}
function prFilled(d,id){if(id==='grat')return (d.grat||[]).length>0;if(id==='choose')return (d.choose||[]).length>0;if(id==='brake')return (d.brakeWords||[]).length>0;if(id==='betray')return (d.betrayMarks||[]).length>0;if(id==='signs')return (d.signs||[]).length>0;if(id==='want')return !!(d.journal&&d.journal.want);if(id==='bounds')return !!(d.journal&&d.journal.bounds);if(id==='hours'){for(var k in (d.hours||{}))if(d.hours[k]&&d.hours[k].text)return true;return false}return !!d.practDone}
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
  h+='<p class="mute">'+esc(item.d||'')+(item.len>1?' · '+item.len+' дней.':' · На один день.')+(item.load?' Нагрузка: '+esc(item.load)+'.':'')+'</p>';
  if(reason)h+='<p class="soft-tip">Почему сейчас: '+esc(reason)+'</p>';
  if(item.effect)h+='<p class="mute">Ожидаемый эффект: '+esc(item.effect)+'</p>';
  if(a)h+='<p class="score ok">Идет · день '+(n-a.from+1)+' из '+a.len+' · уникальных дней: '+filled+'</p><button type="button" class="quiet-btn" data-act="pr-off" data-id="'+item.id+'">Приостановить</button>';
  else{
    if(filled)h+='<p class="mute">За все запуски уникальных дней: '+filled+'. История не обнуляется.</p>';
    h+='<button type="button" class="add" data-act="pr-on" data-id="'+item.id+'">Включить'+(item.len>1?' на '+item.len+' дней':'')+'</button>';
  }
  return h+'</div>';
}
function viewPracts(P,T){
  var n=todayNum(T);
  var h='<div class="t28"><p class="dk">Лаборатория практик</p><h1>Практики</h1><p class="cap28">Система рекомендует, ты подтверждаешь или выбираешь сам. Одновременно идут не больше двух дополнительных практик. Пропуск ничего не обнуляет.</p>';
  var recs=(window.GPract&&GPract.recs(P,T,n))||[];
  if(recs.length){
    h+='<h2 class="lab-h">Сейчас рекомендуется</h2>';
    recs.forEach(function(r){h+=practCard(P,T,n,r.item,r.reason)});
  }
  var groups=[['base','Базовые практики'],['research','По результатам исследования'],['situ','По ситуации']];
  var cat=(window.GPract&&GPract.CAT)||PRC.map(function(x){return {id:x.id,t:x.t,len:x.len,d:x.d,group:(x.id==='brake'||x.id==='betray'||x.id==='hours')?'research':'base'}});
  groups.forEach(function(g){
    var list=cat.filter(function(x){return (x.group||'base')===g[0]});
    if(!list.length)return;
    h+='<h2 class="lab-h">'+g[1]+'</h2>';
    list.forEach(function(item){
      var open=true;
      if(window.GPract&&item.lv===2)open=GPract.unlocked(P,item);
      if(!open){h+='<div class="row-line prc dim"><b>'+esc(item.t)+'</b><p class="mute">Откроется, когда в профиле появятся соответствующие исследования.</p></div>';return}
      h+=practCard(P,T,n,item);
    });
  });
  h+='<div class="row-line"><b>Мои доказательства</b>'+proofBody(T)+'</div>';
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
    h+='<p class="mute">Числа 0–100 пересчитаны из твоей самооценки 1–10. Расчет динамики не подменяет оценку и не поднимает энергию за практики.</p>';
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
  var html='<div class="t28"><p class="dk">Карта 28 дней</p><h1>Четыре недели</h1><p class="cap28">Нажми день, чтобы открыть его. Нажми номер недели, чтобы открыть неделю.</p>';
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
    html+='<div class="step-row"><button type="button" data-act="dir-st" data-i="'+i+'" data-s="done" class="'+(st==='done'?'on':'')+'">Выполнить</button></div>';
    html+='<input type="text" data-act="ifthen" data-i="'+i+'" placeholder="если … то …" value="'+esc((T.ifthens&&T.ifthens[i])||'')+'">';
    html+=markBtns(d.dirMarks[i]||'','data-who="dir" data-i="'+i+'"');
    html+='</div>';
  });
  if(!dirs(T).length)html+='<div class="row-line"><p class="mute">Три звезды появятся, когда ты подтвердишь выбор на небе желаний.</p></div>';

  }
  html+='<div class="row-line sliders">';
  MET.forEach(function(m){
    var v=d.sliders[m.key]; if(v==null)v=5;
    var tip=sliderHint(m,+v);
    html+='<div class="slid"><label>'+esc(m.name)+' <small>'+esc(gx(m.sub))+' · '+v+'</small></label>';
    if(tip)html+='<p class="soft-tip">'+esc(tip)+'</p>';
    else html+='<p class="soft-tip"></p>';
    html+='<input type="range" min="1" max="10" value="'+v+'" data-act="slider" data-k="'+m.key+'"></div>';
  });
  html+='</div>';

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
  if(window.GPract){['want','bounds'].forEach(function(id){
    if(!GPract.isOn(T,id,n))return;
    var it=GPract.byId(id); if(!it)return;
    html+='<div class="row-line"><b>'+esc(it.t)+'</b><p class="mute">'+esc(it.daily)+'</p>';
    html+='<textarea data-act="journal" data-id="'+id+'" rows="2" maxlength="240" placeholder="'+esc(it.min)+'">'+esc((d.journal&&d.journal[id])||'')+'</textarea></div>';
  });}
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
function betrayBody(d){
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
   '<p class="cap28 soft">Три отдельных показателя. Исполнение считает, что сделано, изменения — что ты '+gx('{заметил|заметила}')+', внутренний опыт — твои бегунки.</p>'+
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
  return '<div class="res"><b>Рецепт успеха</b><p>Чаще сдвигалось '+bits.map(function(s){return gx(s)}).join(', ')+'. Это не правило, только то, что уже видно по твоим отметкам.</p></div>';
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
  var RV={done:'Шаг дня сделан.',part:'Шаг сделан частично. Это тоже движение.',min:'Ты {выбрал|выбрала} минимальную версию. Так система держится в трудные дни.',other:'Ты {выбрал|выбрала} другой шаг. Он тоже засчитан.',fail:'Сегодня не получилось. Ничего не обнуляется: завтра игра предложит шаг полегче.'};
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
    if(act==='space'){
      var sp=b.getAttribute('data-s');
      T.space=sp; T.view=(sp==='map'?'month':sp==='path'?'monthg':sp==='lab'?'practs':'day');
      if(sp==='day'&&!T.openDay)T.openDay=todayNum(T);
      save(P); render(); try{window.scrollTo(0,0)}catch(e){} return;
    }
    if(act==='start-cycle'){T.strategySeen=true;T.space='day';T.view='day';if(!T.start)T.start=Date.now();T.openDay=todayNum(T);save(P);render();try{window.scrollTo(0,0)}catch(e){}return}
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
    if(act==='hour-t'){d.openHour=d.openHour===+b.getAttribute('data-h')?null:+b.getAttribute('data-h'); save(P); render(); openAccAfterRender('hours'); return}
    if(act==='fate'){
      T.finale=T.finale||{}; T.finale.fate=b.getAttribute('data-v'); T.finale.done=true; T.finale.at=Date.now();
      if(window.GRoute)GRoute.complete('reactor.html');
      save(P); if(window.GArts)GArts.grant('proof_sign'); render(); return;
    }
    if(act==='newcycle'){
      T.prev=(T.prev||[]).concat([{start:T.start,finale:T.finale,days:T.days,weekPlans:T.weekPlans,rewards:T.rewards}]);
      T.days={}; T.start=Date.now(); T.finale=null; T.openDay=0; T.view='month'; T.cycle=(T.cycle||1)+1; T.weekPlans={};
      save(P); render(); return;
    }
    if(act==='card'){try{drawCard(P,T)}catch(e){} return}
  };
  host.onchange=function(e){
    var el=e.target, act=el.getAttribute('data-act'); if(!act)return;
    var P=ensure(), T=Tget(P);
    if(act==='plan-done'){
      var i=+el.getAttribute('data-i'), plan=weekPlan(T,(T.weekN||0)+1);
      plan.done[i]=!!el.checked; save(P); render(); return;
    }
  };
  host.oninput=function(e){
    var el=e.target, act=el.getAttribute('data-act'); if(!act)return;
    var P=ensure(), T=Tget(P), n=T.openDay||todayNum(T), d=dayRec(T,n);
    if(act==='slider'){d.sliders[el.getAttribute('data-k')]=+el.value; save(P); var m=MET.filter(function(x){return x.key===el.getAttribute('data-k')})[0]; var tip=el.parentNode.querySelector('.soft-tip'); if(tip)tip.textContent=sliderHint(m,+el.value); var sm=el.parentNode.querySelector('label small'); if(sm&&m)sm.textContent=m.sub+' · '+el.value; return}
    if(act==='dir-step'){d.dirSteps[+el.getAttribute('data-i')]=el.value; save(P); return}
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
