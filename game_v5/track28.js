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
  {key:'presence', name:'Присутствие', sub:'насколько ты здесь', color:'#B4552D', low:'Внимание разбежалось. Три медленных вдоха могут вернуть тебя в этот момент.'}
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
  return P;
}
function Tget(P){return (P||ensure()).tracker}
function dayRec(T,n){
  var k=String(n);
  if(!T.days[k])T.days[k]={sliders:{},signs:[],choose:[],grat:[],hours:{},dirSteps:['','',''],dirState:['','',''],dirMarks:['','',''],wishMark:'',hintSeen:false,note:'',ifFire:['','','']};
  var d=T.days[k];
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
  return '<div class="card t28-graph"><div class="tag">'+esc(title)+'</div>'+legend+
    '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(title)+'">'+grid+'<line class="g-axis" x1="'+padL+'" y1="'+(padT+ih)+'" x2="'+(W-padR)+'" y2="'+(padT+ih)+'"/>'+lines+xa+'</svg></div>';
}

/* ---------- render ---------- */
var host=null;
function mount(el){host=el; var P=ensure(); var T=Tget(P); if(!T.openDay)T.openDay=todayNum(T); save(P); render()}

function render(){
  if(!host)return;
  var P=ensure(), T=Tget(P);
  if(T.view==='week'){host.innerHTML=viewWeek(P,T); bind(); return}
  if(T.view==='monthg'){host.innerHTML=viewMonthG(P,T); bind(); return}
  if(T.view==='finale'){host.innerHTML=viewFinale(P,T); bind(); return}
  host.innerHTML=viewMonth(P,T); bind();
  var pan=host.querySelector('.day-panel');
  if(pan)try{pan.scrollIntoView({block:'nearest'})}catch(e){}
}

function wishText(T){return (T.declared&&(T.declared.text||T.declared.raw))||''}
function dirs(T){return T.directions||[]}

function cellDots(T,n){
  var d=dayRec(T,n);
  var wishOn=!!(d.hintSeen||(d.signs&&d.signs.length));
  var signOn=(d.signs&&d.signs.length);
  var ds=(d.dirState||[]);
  var html='<span class="dots"><i class="'+(wishOn?'on wish':'')+(signOn?' sign':'')+'"></i>';
  for(var i=0;i<3;i++)html+='<i class="'+(ds[i]==='done'?'on':'')+'"></i>';
  html+='</span><span class="mini-marks"><b class="'+(d.wishMark?'on':'')+'"></b>';
  for(i=0;i<3;i++)html+='<b class="'+((d.dirMarks&&d.dirMarks[i])?'on':'')+'"></b>';
  return html+'</span>';
}

function viewMonth(P,T){
  var today=todayNum(T), open=T.openDay||today;
  var html='<div class="t28"><h1>28 дней</h1>';
  if(wishText(T))html+='<p class="wishline">'+esc(wishText(T))+'</p>';
  else html+='<p class="mute">Заявленное желание появится здесь после неба желаний.</p>';
  if(!dirs(T).length)html+='<p class="mute">Три направления запишутся сюда после разбора на колесах.</p>';
  html+='<div class="cal-head">'+WD.map(function(w){return '<span>'+w+'</span>'}).join('')+'</div>';
  for(var w=0;w<4;w++){
    html+='<div class="cal-week"><div class="week-bar"><span class="tag">Неделя '+(w+1)+'</span><button type="button" data-act="weekg" data-w="'+w+'">График недели</button></div>';
    html+='<div class="cal-row">';
    for(var i=0;i<7;i++){
      var n=w*7+i+1, cls='cell'+(n===today?' today':'')+(n===open?' open':'')+(n>today?' future':'');
      html+='<button type="button" class="'+cls+'" data-act="open" data-n="'+n+'"><span>'+n+'</span>'+cellDots(T,n)+'</button>';
    }
    html+='</div>';
    if(open>=w*7+1&&open<=w*7+7)html+=dayPanel(P,T,open);
    html+=weekSum(T,w+1);
    html+='</div>';
  }
  html+='<button class="go" type="button" data-act="monthg">График за 28 дней</button>';
  if(today>=28||T.finale)html+='<button class="go" type="button" data-act="finale" style="margin-top:8px">Было и стало</button>';
  html+='<a class="quiet" href="wish-track.html">Желание и направления</a>';
  html+='<a class="quiet" href="tasks.html">К заданиям</a></div>';
  return html;
}

function weekSum(T,week){
  var a=(week-1)*7+1, b=week*7, signs=0, grat=0, steps=0, marks=0;
  for(var i=a;i<=b;i++){
    var d=dayRec(T,i);
    signs+=(d.signs||[]).length; grat+=(d.grat||[]).length;
    steps+=(d.dirState||[]).filter(function(x){return x==='done'}).length;
    if(d.wishMark)marks++;
    (d.dirMarks||[]).forEach(function(x){if(x)marks++});
  }
  return '<div class="week-sum">Итог недели '+week+': знаков '+signs+', шагов '+steps+', благодарностей '+grat+', отметок прогресса '+marks+'. <button type="button" class="quiet-btn" data-act="weekg" data-w="'+(week-1)+'">Открыть график</button></div>';
}

function markBtns(cur,attr){
  return '<div class="marks">'+MARKS.map(function(m){
    return '<button type="button" class="'+(cur===m.id?'on':'')+'" data-act="mark" '+attr+' data-m="'+m.id+'">'+esc(m.t)+'</button>';
  }).join('')+'</div>';
}

function dayPanel(P,T,n){
  var d=dayRec(T,n), today=todayNum(T);
  var html='<div class="day-panel" data-day="'+n+'"><div class="tag">День '+n+(n===today?' · сегодня':'')+(n<today?' · можно дозаполнить':'')+'</div>';
  /* ritual */
  html+='<div class="ritual"><h3>Главное желание</h3>';
  if(wishText(T))html+='<p class="wishline" style="margin-bottom:8px">'+esc(wishText(T))+'</p>';
  html+='<div class="tag">Настройка внимания</div><p class="hint-line">'+esc(hintOf(n))+'</p>';
  html+='<label class="mute"><input type="checkbox" data-act="hint-seen" '+(d.hintSeen?'checked':'')+'> Я {видел|видела} эту подсказку сегодня</label>'.replace(/\{([^|]*)\|([^}]*)\}/g,function(_,m,f){return window.GG?GG(m,f):m});
  html+='<div class="notify-row"><label>Мягкое напоминание <input type="time" data-act="notify-time" value="'+(T.notifyTime||'')+'"></label>';
  html+='<button type="button" class="quiet-btn" data-act="notify-on">'+(T.notifyOn?'Напоминание включено':'Включить, если браузер позволит')+'</button></div>';
  html+='<div class="tag" style="margin-top:10px">Знаки дня</div><p class="mute">1–5 коротких записей: встречи, совпадения, все, что само попалось в сторону желания. Без обещания, что оно сбудется.</p><div class="signs">';
  (d.signs||[]).forEach(function(s,i){
    html+='<div class="sign-item">'+esc(s.tag?s.tag+' · ':'')+esc(s.text)+'</div>';
  });
  if((d.signs||[]).length<5){
    html+='<div class="row"><select data-act="sign-tag">'+SIGN_TAGS.map(function(t){return '<option>'+t+'</option>'}).join('')+'</select>';
    html+='<input type="text" data-act="sign-in" maxlength="160" placeholder="что {заметил|заметила}">'.replace(/\{([^|]*)\|([^}]*)\}/g,function(_,m,f){return window.GG?GG(m,f):m})+'<button type="button" class="add" data-act="sign-add">Записать</button></div>';
  }
  html+='</div>';
  html+='<p class="mute">Как продвигается желание сегодня? Можно пропустить.</p>'+markBtns(d.wishMark,'data-who="wish"');
  html+='</div>';

  /* directions */
  html+='<div class="dirs"><div class="tag">Три направления</div>';
  dirs(T).forEach(function(dir,i){
    var st=d.dirState[i]||'';
    html+='<div class="dir"><b>'+esc(dir.text)+'</b>';
    html+='<input type="text" data-act="dir-step" data-i="'+i+'" placeholder="маленький шаг сегодня" value="'+esc(d.dirSteps[i]||'')+'">';
    html+='<div class="step-row"><button type="button" data-act="dir-st" data-i="'+i+'" data-s="do" class="'+(st==='do'?'on':'')+'">Делаю</button>';
    html+='<button type="button" data-act="dir-st" data-i="'+i+'" data-s="done" class="'+(st==='done'?'on':'')+'">Сделано</button></div>';
    html+='<p class="mute">Если (заметный повод), то (одно конкретное действие)</p>';
    html+='<input type="text" data-act="ifthen" data-i="'+i+'" placeholder="если … то …" value="'+esc((T.ifthens&&T.ifthens[i])||'')+'">';
    html+='<p class="mute">Отметка прогресса, если есть что заметить</p>'+markBtns(d.dirMarks[i]||'','data-who="dir" data-i="'+i+'"');
    html+='</div>';
  });
  if(!dirs(T).length)html+='<p class="mute">Направления появятся, когда ты выберешь три после колес.</p>';
  html+='</div>';

  /* sliders */
  html+='<div class="sliders"><div class="tag">Состояние дня</div>';
  MET.forEach(function(m){
    var v=d.sliders[m.key]; if(v==null)v=5;
    html+='<div class="slid"><label>'+esc(m.name)+' <small>'+esc(m.sub)+' · '+v+'</small></label>';
    html+='<p class="soft-tip">'+esc(sliderHint(m,+v))+'</p>';
    html+='<input type="range" min="1" max="10" value="'+v+'" data-act="slider" data-k="'+m.key+'"></div>';
  });
  html+='</div>';

  /* accordions */
  html+=acc('grat','Дневник благодарности','записей: '+(d.grat||[]).length+' · всего '+allGrat(T)+' из 50', gratBody(d,T));
  html+=acc('choose','Выбираю — делаю — сделано', (d.choose||[]).length?'дел: '+d.choose.length:'можно не открывать', chooseBody(d,T,n));
  html+=acc('hours','Почасовая сетка дня','свернута', hoursBody(d));
  html+=acc('pract','Другие практики', practLabel(T), practBody(T));
  html+=acc('proof','Мои доказательства', String((T.proofs||[]).length), proofBody(T));
  html+=acc('note','Заметка дня', d.note?'есть':'можно не открывать', '<textarea data-act="note" rows="3" placeholder="что важно оставить">'+esc(d.note||'')+'</textarea>');
  html+='</div>';
  return html;
}
function acc(id,title,sub,body){
  return '<div class="acc" data-acc="'+id+'"><button type="button" class="head" data-act="acc" data-id="'+id+'">'+esc(title)+'<span>'+esc(sub)+'</span></button><div class="body">'+body+'</div></div>';
}
function gratBody(d,T){
  var list=(d.grat||[]).map(function(g){return '<div class="sign-item">'+esc(g.text)+'</div>'}).join('');
  return '<p class="mute">Минимум 10 за цикл, цель — 50. Можно не открывать.</p>'+list+
    '<input type="text" data-act="grat-in" maxlength="160" placeholder="за что я благодар'+((window.GG&&GG('ен','на'))||'ен')+' сегодня"><button type="button" class="add" data-act="grat-add">Записать</button>';
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
  }).join('')||'<p class="mute">Ничего не обнуляется. Время и длительность каждого дела остаются здесь.</p>';
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
function practLabel(T){
  var p=T.practices||{}, n=0;
  Object.keys(p).forEach(function(k){n+=+(p[k].count||0)});
  return n?('записей: '+n):'свои счетчики, отдельно от 28 дней';
}
function practBody(T){
  var names=[{id:'breath',t:'Вдох-выдох'},{id:'iam',t:'Я есмь'},{id:'look',t:'Тихое внимание'}];
  var p=T.practices||{};
  return '<p class="mute">У каждой практики свой счетчик и серия, независимо от цикла. Можно включить на 2–3 часа.</p>'+names.map(function(x){
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

function viewWeek(P,T){
  var w=T.weekN||0, a=w*7+1, b=a+6;
  return '<div class="t28"><p class="tag">Неделя '+(w+1)+'</p><h1>График недели</h1><p class="mute">Все показатели за дни '+a+'–'+b+'. Нажми метку, чтобы скрыть или показать линию.</p>'+
    svgChart(T,a,b,T.hiddenMet||{},'Неделя '+(w+1))+
    weekSum(T,w+1)+
    '<button class="go" type="button" data-act="back">К сетке месяца</button></div>';
}
function viewMonthG(P,T){
  return '<div class="t28"><p class="tag">Весь цикл</p><h1>График за 28 дней</h1><p class="mute">Перепады, пики и точки поворота по всем показателям.</p>'+
    svgChart(T,1,28,T.hiddenMet||{},'28 дней')+
    '<button class="go" type="button" data-act="back">К сетке месяца</button>'+
    ((todayNum(T)>=28||T.finale)?'<button class="go" type="button" data-act="finale" style="margin-top:8px">Было и стало</button>':'')+
    '</div>';
}
function avgWeek(T,w,key){
  var a=w*7+1,b=a+6,s=0,c=0;
  for(var i=a;i<=b;i++){var v=dayRec(T,i).sliders[key]; if(v!=null&&v!==''){s+=+v;c++}}
  return c?Math.round(s/c*10)/10:null;
}
function viewFinale(P,T){
  var wish=wishText(T);
  var fate=(T.finale&&T.finale.fate)||'';
  var w0=P.wheel||[], w1=(P.retest&&P.retest.wheel)||(T.finale&&T.finale.wheel)||[];
  var names=['Здоровье','Финансы','Карьера','Отношения','Семья','Друзья','Рост','Отдых'];
  var wheelH='';
  if(w0.length===8){
    wheelH='<div class="card"><div class="tag">Колесо и потребности</div>'+names.map(function(n,i){
      return '<p>'+esc(n)+': было '+(w0[i]!=null?w0[i]:'—')+(w1[i]!=null?' → стало '+w1[i]:'')+'</p>';
    }).join('')+'</div>';
  }
  var sl='<div class="card"><div class="tag">Бегунки: неделя 1 и неделя 4</div>'+MET.map(function(m){
    var a=avgWeek(T,0,m.key), b=avgWeek(T,3,m.key);
    return '<p>'+esc(m.name)+': '+(a==null?'нет отметок':a)+(b==null?'':' → '+b)+'</p>';
  }).join('')+'</div>';
  var dirH='<div class="card"><div class="tag">Три направления</div>'+dirs(T).map(function(dir,i){
    var done=0, marks={}; for(var n=1;n<=28;n++){var d=dayRec(T,n); if(d.dirState[i]==='done')done++; if(d.dirMarks[i])marks[d.dirMarks[i]]=(marks[d.dirMarks[i]]||0)+1;}
    return '<p><b>'+esc(dir.text)+'</b> · шагов сделано: '+done+'. Стало лучше: '+(marks.better||0)+', привычка: '+(marks.habit||0)+', вопрос решился: '+(marks.solved||0)+'.</p>';
  }).join('')+'</div>';
  var wm={}; for(var n=1;n<=28;n++){var m=dayRec(T,n).wishMark; if(m)wm[m]=(wm[m]||0)+1;}
  var signs=0; for(n=1;n<=28;n++)signs+=(dayRec(T,n).signs||[]).length;
  return '<div class="t28"><h1>Было и стало</h1>'+
    svgChart(T,1,28,T.hiddenMet||{},'Месяц целиком')+
    wheelH+sl+dirH+
    '<div class="card finale-card"><div class="tag">Судьба заявленного желания</div><p class="wishline">'+esc(wish)+'</p>'+
    '<p class="mute">Этот вопрос задается только здесь, в конце цикла. Знаков за 28 дней: '+signs+'. Отметок «стало лучше»: '+(wm.better||0)+', привычка: '+(wm.habit||0)+', вопрос решился: '+(wm.solved||0)+'.</p>'+
    '<div class="fate">'+[['came','сбылось'],['closer','приблизилось'],['letgo','отпущено']].map(function(x){
      return '<button type="button" class="'+(fate===x[0]?'on':'')+'" data-act="fate" data-v="'+x[0]+'">'+x[1]+'</button>';
    }).join('')+'</div></div>'+
    '<button class="go" type="button" data-act="card">Сохранить карточку</button>'+
    '<button class="go" type="button" data-act="newcycle" style="margin-top:8px">Начать новый цикл</button>'+
    '<button type="button" class="quiet-btn" data-act="back">К сетке</button></div>';
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
  if(a)a.classList.add('open');
}

function bind(){
  if(!host)return;
  host.onclick=function(e){
    var b=e.target.closest('[data-act]'); if(!b)return;
    var act=b.getAttribute('data-act');
    var P=ensure(), T=Tget(P), n=T.openDay||todayNum(T), d=dayRec(T,n);
    tick();
    if(act==='open'){T.view='month'; T.openDay=+b.getAttribute('data-n'); save(P); render(); return}
    if(act==='weekg'){T.view='week'; T.weekN=+b.getAttribute('data-w'); save(P); render(); return}
    if(act==='monthg'){T.view='monthg'; save(P); render(); return}
    if(act==='finale'){T.view='finale'; save(P); render(); return}
    if(act==='back'){T.view='month'; save(P); render(); return}
    if(act==='tog-met'){T.hiddenMet=T.hiddenMet||{}; var k=b.getAttribute('data-k'); T.hiddenMet[k]=!T.hiddenMet[k]; save(P); render(); return}
    if(act==='hint-seen'){d.hintSeen=b.checked; save(P); return}
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
    if(act==='dir-st'){var i=+b.getAttribute('data-i'), s=b.getAttribute('data-s'); d.dirState[i]=(d.dirState[i]===s?'':s); if(s==='done')d.dirDoneAt=d.dirDoneAt||{}; d.dirDoneAt[i]=Date.now(); save(P); render(); return}
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
      var day=new Date().toDateString(); if(c.last===day){/* still count once+ */} c.count=(c.count||0)+1; c.last=day; c.streak=(c.streak||0)+1; save(P); render(); openAccAfterRender('pract'); return;
    }
    if(act==='pract-on'){
      var id=b.getAttribute('data-id'); T.practices=T.practices||{}; var c=T.practices[id]=T.practices[id]||{count:0,streak:0};
      c.until=Date.now()+2*3600*1000; save(P); render(); openAccAfterRender('pract'); return;
    }
    if(act==='acc'){b.parentNode.classList.toggle('open'); return}
    if(act==='hour-t'){d.openHour=d.openHour===+b.getAttribute('data-h')?null:+b.getAttribute('data-h'); save(P); render(); openAccAfterRender('hours'); return}
    if(act==='fate'){
      T.finale=T.finale||{}; T.finale.fate=b.getAttribute('data-v'); T.finale.done=true; T.finale.at=Date.now();
      if(window.GRoute)GRoute.complete('reactor.html');
      save(P); render(); return;
    }
    if(act==='newcycle'){
      T.prev=(T.prev||[]).concat([{start:T.start,finale:T.finale,days:T.days}]);
      T.days={}; T.start=Date.now(); T.finale=null; T.openDay=1; T.view='month'; T.cycle=(T.cycle||1)+1;
      save(P); render(); return;
    }
    if(act==='card'){try{drawCard(P,T)}catch(e){} return}
  };
  host.oninput=function(e){
    var el=e.target, act=el.getAttribute('data-act'); if(!act)return;
    var P=ensure(), T=Tget(P), n=T.openDay||todayNum(T), d=dayRec(T,n);
    if(act==='slider'){d.sliders[el.getAttribute('data-k')]=+el.value; save(P); var lab=el.previousElementSibling; /* tip live */ var m=MET.filter(function(x){return x.key===el.getAttribute('data-k')})[0]; var tip=el.parentNode.querySelector('.soft-tip'); if(tip)tip.textContent=sliderHint(m,+el.value); var sm=el.parentNode.querySelector('label small'); if(sm&&m)sm.textContent=m.sub+' · '+el.value; return}
    if(act==='dir-step'){d.dirSteps[+el.getAttribute('data-i')]=el.value; save(P); return}
    if(act==='ifthen'){T.ifthens=T.ifthens||['','','']; T.ifthens[+el.getAttribute('data-i')]=el.value; save(P); return}
    if(act==='note'){d.note=el.value; save(P); return}
    if(act==='hour-in'){d.hours[el.getAttribute('data-h')]=d.hours[el.getAttribute('data-h')]||{}; d.hours[el.getAttribute('data-h')].text=el.value; save(P); return}
    if(act==='notify-time'){T.notifyTime=el.value; if(T.notifyOn&&T.notifyOk)scheduleNote(T); save(P); return}
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
