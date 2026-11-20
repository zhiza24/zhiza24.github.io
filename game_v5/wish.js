/* Блок желаний game_v5: небо, заявка удержанием, две колеса, три направления.
   Данные живут в alch_v5_profile: wishMod + tracker. Колесо баланса читает P.wheel. */
(function(){
'use strict';
var KEY='alch_v5_profile';
var HOLD_MS=2500;
var SPH=[
  {id:'health', name:'Здоровье', color:'#78b995'},
  {id:'money', name:'Финансы', color:'#d8b657'},
  {id:'career', name:'Карьера', color:'#77a9d3'},
  {id:'love', name:'Отношения', color:'#d48eaa'},
  {id:'family', name:'Семья', color:'#b69bd6'},
  {id:'friends', name:'Друзья', color:'#dfab77'},
  {id:'growth', name:'Рост', color:'#79c1bf'},
  {id:'rest', name:'Отдых', color:'#a8bb75'}
];
var HEROES=[
  {id:'ruler', name:'Правитель', drive:'контроль', q:'стабильность', color:'#2f8a52', guard:'порядок и ясность', wound:'чувство несправедливости', qs:['Мне важно, чтобы мои желания укладывались в понятный порядок.','Я спокойнее, когда {сам определяю|сама определяю}, как все будет устроено.']},
  {id:'care', name:'Заботливый', drive:'комфорт', q:'стабильность', color:'#7a9a32', guard:'тепло и тех, кто рядом', wound:'страх остаться без своих', qs:['Я чаще загадываю то, что облегчит жизнь близким, а не только мне.','Мне важно, чтобы желаемое никого не оставило без опоры.']},
  {id:'creator', name:'Творец', drive:'инновации', q:'стабильность', color:'#2a9a7a', guard:'право на свое видение', wound:'боль отвержения своего видения', qs:['Мои желания часто начинаются с образа, которого еще нет в жизни.','Мне хочется создавать новое, а не повторять уже знакомое.']},
  {id:'innocent', name:'Простодушный', drive:'безопасность', q:'самопознание', color:'#3a9aaa', guard:'простой покой', wound:'чувство унижения', qs:['Я легче желаю то, что кажется безопасным и добрым.','Мне важно, чтобы желаемое не разрушило простой покой.']},
  {id:'sage', name:'Мудрец', drive:'понимание', q:'самопознание', color:'#2a7a9a', guard:'время понять', wound:'рану недоверия', qs:['Сначала я хочу понять смысл желания, и только потом к нему идти.','Мне важно видеть, чему это желание меня учит.']},
  {id:'seeker', name:'Искатель', drive:'свобода', q:'самопознание', color:'#3a6aaa', guard:'свободу не застрять', wound:'боль отвержения', qs:['Мои самые живые желания связаны со свободой и новым горизонтом.','Мне тесно, когда желание требует оставаться на одном месте.']},
  {id:'rebel', name:'Бунтарь', drive:'независимость', q:'изменения', color:'#4a4aaa', guard:'независимость', wound:'чувство несправедливости', qs:['Я оживляюсь, когда желание ломает привычный ход вещей.','Мне важно идти своим путем, даже если он не похож на чужой.']},
  {id:'magus', name:'Маг', drive:'сила', q:'изменения', color:'#5a3a9a', guard:'внутреннюю силу', wound:'чувство унижения', qs:['Я чувствую, что внутреннее состояние меняет, как складывается желаемое.','Мне важно сначала почувствовать, будто желаемое уже рядом.']},
  {id:'hero', name:'Герой', drive:'мастерство', q:'изменения', color:'#6b3a8a', guard:'достоинство и путь', wound:'рану предательства', qs:['Я хочу желаний, в которых есть вызов и путь, который нужно пройти.','Мне важно довести задуманное до ясного результата.']},
  {id:'lover', name:'Любовник', drive:'близость', q:'принадлежность', color:'#c45a5a', guard:'живое чувство', wound:'страх быть покинутым', qs:['Мои желания часто про близость, красоту и живое чувство.','Мне важно, чтобы в желаемом было место для теплых отношений.']},
  {id:'jester', name:'Шут', drive:'наслаждение', q:'принадлежность', color:'#e08a50', guard:'легкость', wound:'чувство унижения', qs:['Я охотнее загадываю то, что приносит легкость и игру.','Мне важно, чтобы на пути к желаемому оставалась радость.']},
  {id:'everyman', name:'Славный малый', drive:'принадлежность', color:'#e0a04a', guard:'связь со своими', wound:'боль отвержения', qs:['Мне легче желать того, в чем я не буду один.','Мне важно чувствовать, что мои желания понятны близким людям.']}
];
var HERO_Q=[];HEROES.forEach(function(h){h.qs.forEach(function(t){HERO_Q.push({hero:h.id,text:t})})});
var QUADS=[
  {id:'стабильность', name:'Стабильность', color:'#2f8a52'},
  {id:'самопознание', name:'Самопознание', color:'#2a7a9a'},
  {id:'изменения', name:'Изменения', color:'#5a3a9a'},
  {id:'принадлежность', name:'Принадлежность', color:'#c45a5a'}
];
var VALS=['Свобода','Любовь','Семья','Здоровье','Творчество','Развитие','Смысл','Стабильность','Приключения','Служение','Красота','Спокойствие','Дружба','Честность','Гармония'];
var SOURCE=[
  {id:'body', t:'Тело', d:'слышу это в теле, как тепло или движение'},
  {id:'image', t:'Образ', d:'сначала встает картинка, а уже потом слова'},
  {id:'mind', t:'Мысль', d:'приходит как ясная мысль или решение'},
  {id:'relation', t:'Связь', d:'оживает, когда рядом другой человек'}
];

function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(P){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function gx(s){return String(s).replace(/\{([^|]*)\|([^}]*)\}/g,function(_,m,f){return window.GG?GG(m,f):m})}
function uid(){return 'w'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function now(){return Date.now()}
function zoneOf(n){n=+n;if(!isFinite(n))return 'none';if(n<=4)return 'need';if(n<=7)return 'ok';return 'like'}
function zoneName(z){return z==='need'?'не хватает':z==='ok'?'терпимо':z==='like'?'нравится':'нет оценки'}

function ensure(P){
  P=P||load();
  P.wishMod=P.wishMod||{};
  var W=P.wishMod;
  if(!Array.isArray(W.wishes))W.wishes=[];
  if(!W.research)W.research={heroAns:[],places:{},source:{},values:[],contra:'',dirs:[]};
  if(!W.research.heroAns)W.research.heroAns=[];
  if(!W.research.places)W.research.places={};
  if(!W.research.source)W.research.source={};
  if(!W.research.values)W.research.values=[];
  if(!W.research.dirs)W.research.dirs=[];
  if(!W.scene)W.scene='invite';
  P.tracker=P.tracker||{};
  return P;
}
function wheelScores(P){
  var a=(P&&P.wheel)||[];
  if(Array.isArray(a)&&a.length===8)return a.map(function(x){return +x});
  var loc=(P.wishMod&&P.wishMod.wheelLocal)||[];
  if(Array.isArray(loc)&&loc.length===8)return loc.map(function(x){return +x});
  return null;
}
function remaining(P){
  var W=P.wishMod, id=W.declaredId;
  return W.wishes.filter(function(w){return w.id!==id});
}
function declaredWish(P){
  var id=P.wishMod&&P.wishMod.declaredId;
  return (P.wishMod.wishes||[]).find(function(w){return w.id===id})||null;
}

function writeDeclared(P){
  var w=declaredWish(P); if(!w)return;
  P.tracker=P.tracker||{};
  P.tracker.declared={
    id:w.id,
    text:w.form||w.text,
    raw:w.text,
    at:P.wishMod.declaredAt||now(),
    scheme:'declared'
  };
  P.log=P.log||[];
  P.log.push({t:now(),x:'Заявлено желание: '+(w.form||w.text)});
  save(P);
}
function writeDirections(P){
  var ids=P.wishMod.research.dirs||[];
  var list=ids.map(function(id){
    var w=P.wishMod.wishes.find(function(x){return x.id===id});
    return w?{id:w.id,text:w.form||w.text}:null;
  }).filter(Boolean);
  P.tracker=P.tracker||{};
  P.tracker.directions=list;
  P.tracker.directionsAt=now();
  if(!P.tracker.start)P.tracker.start=now();
  P.log=P.log||[];
  P.log.push({t:now(),x:'Три целевых направления: '+list.map(function(x){return x.text}).join('; ')});
  save(P);
}

var app=document.getElementById('wapp');
var sky=document.getElementById('wsky');
var starsLayer=null;

function setScene(name){var P=ensure();P.wishMod.scene=name;save(P);render()}

function starSvg(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.2l3.4 8.6 9.2.8-7 6.2 2.2 9-7.8-4.6-7.8 4.6 2.2-9-7-6.2 9.2-.8z"/></svg>'}
function placeStar(w,i,n){
  var a=(i/Math.max(n,1))*Math.PI*2-Math.PI/2;
  var cx=innerWidth/2, cy=130+Math.min(innerHeight*0.18,160);
  var rx=Math.min(innerWidth*0.34, 140), ry=Math.min(innerHeight*0.14, 110);
  w.x=cx+Math.cos(a)*rx;
  w.y=cy+Math.sin(a)*ry;
  w.x=Math.max(48,Math.min(innerWidth-48,w.x));
  w.y=Math.max(110,Math.min(innerHeight*0.42,w.y));
}
function drawStars(opts){
  opts=opts||{};
  if(starsLayer)starsLayer.remove();
  starsLayer=document.createElement('div');
  starsLayer.id='wstars';
  if(opts.viewonly)starsLayer.className='viewonly';
  document.body.appendChild(starsLayer);
  var P=ensure(), W=P.wishMod.wishes, hide=opts.hideCaps, focus=opts.focus, dimOthers=opts.dim;
  W.forEach(function(w,i){
    placeStar(w,i,W.length);
    var b=document.createElement('button');
    b.type='button';
    b.className='star'+(w.id===P.wishMod.declaredId?' gold':'')+(focus&&w.id===focus?' front':'')+(dimOthers&&w.id!==focus?' dim':'')+(opts.faint?' faint':'')+(opts.glow&&opts.glow[w.id]?' glow':'');
    b.style.left=w.x+'px'; b.style.top=w.y+'px';
    var cap=esc((w.form||w.text||'').slice(0,28));
    var side=w.x<70?'right':(w.x>innerWidth-70?'left':'center');
    b.innerHTML=starSvg()+(hide?'':'<span class="cap cap-'+side+'">'+cap+'</span>');
    b.onclick=function(){if(opts.onStar)opts.onStar(w)};
    starsLayer.appendChild(b);
  });
  save(P);
}
function clearStars(){if(starsLayer){starsLayer.remove();starsLayer=null}}

function drawSky(){
  if(!sky)return;
  var c=sky.getContext('2d');
  var w=sky.width=innerWidth,h=sky.height=innerHeight;
  c.fillStyle='#0c0804';c.fillRect(0,0,w,h);
  var g=c.createRadialGradient(w*.5,h*.28,10,w*.5,h*.5,h*.8);
  g.addColorStop(0,'rgba(80,50,16,.35)');g.addColorStop(1,'rgba(12,8,4,0)');
  c.fillStyle=g;c.fillRect(0,0,w,h);
  for(var i=0;i<80;i++){
    c.globalAlpha=.15+Math.random()*.4;
    c.fillStyle='#f0c870';
    c.beginPath();c.arc(Math.random()*w,Math.random()*h,Math.random()*1.2+.2,0,Math.PI*2);c.fill();
  }
  c.globalAlpha=1;
}

function shell(html,cls){
  app.innerHTML='<div class="wsc '+(cls||'')+'">'+html+'</div>';
}

function inviteView(){
  clearStars();
  shell(
    '<div class="kicker">Точка Б</div>'+
    '<h2>Сейчас у тебя есть редкий шанс собрать все свои желания в одном небе</h2>'+
    '<p class="line mute">Не оценивай их и не отсекай. Сначала просто выложи все, что зовет. Потом одно из них ты заявишь, а с остальными разберемся на двух колесах.</p>'+
    '<button class="go" id="goSky">Открыть небо</button>'
  );
  document.getElementById('goSky').onclick=function(){setScene('sky')};
}

function skyView(){
  var P=ensure(), n=P.wishMod.wishes.length;
  drawStars({});
  shell(
    '<div class="counter">'+n+' желани'+(n%10===1&&n%100!==11?'е':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?'я':'й'))+'</div>'+
    (n<4?'<p class="hint">Назови все, что зовет. Чем полнее небо, тем яснее будет выбор.</p>':'<p class="hint">Небо уже живет. Можешь добавить еще или идти дальше.</p>')+
    '<div class="composer"><label for="wishIn">Я хочу...</label><div class="row"><input id="wishIn" maxlength="160" placeholder="напиши желание" autocomplete="off"><button class="send" id="addWish" aria-label="Добавить">✦</button></div></div>'+
    (n>=1?'<button class="go" id="goNext" style="margin-top:12px">'+(n>=4?'Дальше':'Этого пока достаточно')+'</button>':'')
  );
  var inp=document.getElementById('wishIn');
  function add(){
    var t=(inp.value||'').trim(); if(!t)return;
    P=ensure();
    P.wishMod.wishes.push({id:uid(),text:t,at:now()});
    save(P); inp.value=''; skyView();
  }
  document.getElementById('addWish').onclick=add;
  inp.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();add()}};
  var nx=document.getElementById('goNext');
  if(nx)nx.onclick=function(){
    P=ensure();
    if(P.wishMod.wishes.length>=3) setScene('pair');
    else setScene('choose');
  };
  setTimeout(function(){try{inp.focus()}catch(e){}},200);
}

function pairView(){
  var P=ensure(), W=P.wishMod.wishes;
  if(W.length<2){setScene('choose');return}
  if(!P.wishMod.pairI)P.wishMod.pairI=0;
  var i=P.wishMod.pairI;
  if(i>=Math.min(3,W.length-1)){setScene('discover');return}
  var a=W[i], b=W[i+1]||W[0];
  drawStars({dim:false,glow:{},viewonly:true});
  shell(
    '<p class="kicker">Чуть ближе</p>'+
    '<h2>Какое из двух сейчас живее?</h2>'+
    '<p class="line mute">Это не отказ от второго. Просто почувствуй, какое откликается сильнее.</p>'+
    '<div class="pair-vals"><button class="pick-val" data-id="'+a.id+'">'+esc(a.text)+'</button><button class="pick-val" data-id="'+b.id+'">'+esc(b.text)+'</button></div>'
  );
  app.querySelectorAll('.pick-val').forEach(function(btn){
    btn.onclick=function(){
      P=ensure();
      var w=P.wishMod.wishes.find(function(x){return x.id===btn.dataset.id});
      if(w)w.closer=(w.closer||0)+1;
      P.wishMod.pairI=i+1; save(P); pairView();
    };
  });
}

function discoverView(){
  var P=ensure();
  var glow={};
  P.wishMod.wishes.forEach(function(w){if(w.closer)glow[w.id]=1});
  drawStars({glow:glow,viewonly:true});
  shell(
    '<h2>Посмотри: некоторые звезды сами стали ярче</h2>'+
    '<p class="line mute">Когда ты '+GG('выбирал','выбирала')+', небо уже подсказало, что откликается живее. Теперь выбери одно желание, которое загадаешь прямо сейчас.</p>'+
    '<button class="go" id="goCh">Выбрать одно желание</button>'
  );
  document.getElementById('goCh').onclick=function(){setScene('choose')};
}

function chooseView(){
  var P=ensure();
  clearStars();
  shell(
    '<h2>Выбери одно желание, которое загадаешь прямо сейчас</h2>'+
    '<p class="line mute">Остальные не пропадут, с ними разберемся дальше. Нажми на звезду или на строку.</p>'+
    '<div class="chips">'+P.wishMod.wishes.map(function(w){
      return '<button class="chip" data-id="'+w.id+'">'+esc(w.text)+'</button>';
    }).join('')+'</div>'
  );
  app.querySelectorAll('.chip').forEach(function(b){b.onclick=function(){pickWish(b.dataset.id)}});
}
function pickWish(id){
  var P=ensure();
  P.wishMod.chosenId=id;
  var w=P.wishMod.wishes.find(function(x){return x.id===id});
  if(w&&!w.form)w.form=w.text;
  save(P); setScene('clarify');
}

function clarifyView(){
  var P=ensure();
  var w=P.wishMod.wishes.find(function(x){return x.id===P.wishMod.chosenId});
  if(!w){setScene('choose');return}
  clearStars();
  shell(
    '<p class="kicker">Формулировка</p>'+
    '<h2>Скажи это так, будто оно уже происходит</h2>'+
    '<p class="line mute">В настоящем времени, своими словами. Потом ты удержишь золотой круг — и заявка запишется в трекер.</p>'+
    '<textarea id="formW" rows="3" maxlength="220">'+esc(w.form||w.text)+'</textarea>'+
    '<div class="row" style="width:min(92vw,420px);margin:0 auto 8px;display:flex;flex-direction:column;gap:6px">'+
    '<label>Ярче <input type="range" id="smB" min="1" max="10" value="'+(w.bright||6)+'"></label>'+
    '<label>Ближе <input type="range" id="smC" min="1" max="10" value="'+(w.close||6)+'"></label>'+
    '<label>Больше <input type="range" id="smS" min="1" max="10" value="'+(w.size||6)+'"></label></div>'+
    '<button class="go" id="goDec">К заявке</button>'
  );
  document.getElementById('goDec').onclick=function(){
    P=ensure(); w=P.wishMod.wishes.find(function(x){return x.id===P.wishMod.chosenId});
    w.form=(document.getElementById('formW').value||'').trim()||w.text;
    w.bright=+document.getElementById('smB').value;
    w.close=+document.getElementById('smC').value;
    w.size=+document.getElementById('smS').value;
    save(P); setScene('declare');
  };
}

function bindHold(el,done){
  var t0=0,raf=0,fill=el.querySelector('.declare-fill');
  function p(v){if(fill)fill.style.setProperty('--p',Math.max(0,Math.min(100,v)))}
  function stop(){t0=0;el.classList.remove('holding');if(raf)cancelAnimationFrame(raf);p(0)}
  function tick(){if(!t0)return;var k=(performance.now()-t0)/HOLD_MS;p(k*100);if(k>=1){stop();done();return}raf=requestAnimationFrame(tick)}
  function start(e){e.preventDefault();t0=performance.now();el.classList.add('holding');tick()}
  el.addEventListener('pointerdown',start);
  el.addEventListener('pointerup',stop);
  el.addEventListener('pointerleave',stop);
  el.addEventListener('pointercancel',stop);
}

function declareView(){
  var P=ensure();
  var w=P.wishMod.wishes.find(function(x){return x.id===P.wishMod.chosenId});
  if(!w){setScene('choose');return}
  clearStars();
  shell(
    '<p class="line">'+esc(w.form||w.text)+'</p>'+
    '<p class="mute">Удерживай круг, пока он не заполнится. Это заявка.</p>'+
    '<div class="declare-wrap"><button class="declare-btn" id="holdBtn" type="button"><span class="declare-fill"></span><span class="lbl">Заявляю<small>удерживай</small></span></button></div>',
    'ctr'
  );
  bindHold(document.getElementById('holdBtn'),function(){
    P=ensure();
    P.wishMod.declaredId=P.wishMod.chosenId;
    P.wishMod.declaredAt=now();
    writeDeclared(P);
    setScene('accepted');
  });
}

function acceptedView(){
  var P=ensure(), w=declaredWish(P);
  clearStars();
  shell(
    '<p class="kicker">Принято</p>'+
    '<h2>Твое желание принято и реализуется в максимально возможные сроки наилучшим образом для тебя</h2>'+
    '<div class="track-note">Заявленное желание уже записано в трекер отдельной строкой:<br><b>'+esc(w?(w.form||w.text):'')+'</b></div>'+
    '<p class="line mute">Теперь разберем остальные желания: сначала колесо баланса, затем цветной круг героев. Потом ты выберешь три целевых направления — они тоже попадут в трекер.</p>'+
    '<button class="go" id="goEx">Разобраться с остальными желаниями</button>',
    'ctr'
  );
  if(window.GSupport)GSupport.after(app.querySelector('.wsc')||app,'step',document.getElementById('goEx'));
  document.getElementById('goEx').onclick=function(){setScene('wheel')};
}

function polar(cx,cy,r,a){return [cx+r*Math.cos(a),cy+r*Math.sin(a)]}
function sector(cx,cy,r0,r1,a0,a1){
  var p1=polar(cx,cy,r1,a0),p2=polar(cx,cy,r1,a1),p3=polar(cx,cy,r0,a1),p4=polar(cx,cy,r0,a0);
  var large=a1-a0>Math.PI?1:0;
  return 'M'+p1[0]+','+p1[1]+' A'+r1+','+r1+' 0 '+large+' 1 '+p2[0]+','+p2[1]+' L'+p3[0]+','+p3[1]+' A'+r0+','+r0+' 0 '+large+' 0 '+p4[0]+','+p4[1]+' Z';
}

function balanceSvg(scores,opts){
  opts=opts||{};
  var cx=100,cy=100,R=78;
  var parts=[];
  SPH.forEach(function(s,i){
    var a0=-Math.PI/2+i*Math.PI/4, a1=a0+Math.PI/4;
    var sc=scores?scores[i]:0, zr=18+((isFinite(sc)?sc:0)/10)*60;
    parts.push('<path d="'+sector(cx,cy,18,zr,a0,a1)+'" fill="'+s.color+'" opacity=".95" data-i="'+i+'"></path>');
    parts.push('<path d="'+sector(cx,cy,18,R,a0,a1)+'" fill="none" stroke="rgba(240,200,112,.25)" stroke-width=".7"></path>');
    var mid=a0+Math.PI/8, lp=polar(cx,cy,R+14,mid);
    parts.push('<text class="wlab" text-anchor="middle" x="'+lp[0]+'" y="'+lp[1]+'">'+esc(s.name)+'</text>');
  });
  parts.push('<text class="me" text-anchor="middle" x="'+cx+'" y="'+(cy+4)+'">ты</text>');
  return '<div class="wheel-wrap"><svg viewBox="-24 -24 248 248">'+parts.join('')+'</svg></div>';
}

function wheelView(){
  clearStars();
  var P=ensure(), scores=wheelScores(P);
  if(scores){
    shell(
      '<p class="kicker">Колесо баланса</p>'+
      '<h2>Вот твое колесо из Точки А</h2>'+
      '<p class="line mute">Мы не рисуем второе колесо и не переписываем твои оценки. Темные зоны — «не хватает», средние — «терпимо», яркие — «нравится».</p>'+
      balanceSvg(scores)+
      '<p class="mute">не хватает 0–4 · терпимо 5–7 · нравится 8–10</p>'+
      '<button class="go" id="goPl">Разложить желания по сферам</button>'
    );
    document.getElementById('goPl').onclick=function(){setScene('place')};
    return;
  }
  /* Нет сохраненного колеса Точки А — короткая оценка только в wishMod.wheelLocal, P.wheel не трогаем. */
  if(!P.wishMod.wheelLocal)P.wishMod.wheelLocal=[5,5,5,5,5,5,5,5];
  var loc=P.wishMod.wheelLocal;
  shell(
    '<p class="kicker">Колесо баланса</p>'+
    '<h2>Коротко отметь, как сейчас живется в восьми сферах</h2>'+
    '<p class="line mute">Полного колеса Точки А в сохранении нет, поэтому здесь укороченная оценка. В основное колесо игры она не записывается.</p>'+
    balanceSvg(loc)+
    '<div class="zones">'+SPH.map(function(s,i){
      return '<div><b>'+esc(s.name)+'</b> · '+zoneName(zoneOf(loc[i]))+'<input type="range" min="0" max="10" value="'+loc[i]+'" data-i="'+i+'"><div class="zone-lab"><span>не хватает</span><span>терпимо</span><span>нравится</span></div></div>';
    }).join('')+'</div>'+
    '<button class="go" id="goPl">Дальше</button>'
  );
  app.querySelectorAll('input[type=range]').forEach(function(r){
    r.oninput=function(){P=ensure();P.wishMod.wheelLocal[+r.dataset.i]=+r.value;save(P)};
  });
  document.getElementById('goPl').onclick=function(){setScene('place')};
}

function placeView(){
  var P=ensure(), scores=wheelScores(P)||[5,5,5,5,5,5,5,5];
  var rest=remaining(P);
  var html=rest.map(function(w){
    var cur=(P.wishMod.research.places||{})[w.id]||'';
    return '<div class="place-row"><b>'+esc(w.form||w.text)+'</b>'+
      '<select data-id="'+w.id+'"><option value="">сфера...</option>'+SPH.map(function(s,i){
        var z=zoneName(zoneOf(scores[i]));
        return '<option value="'+s.id+'"'+(cur===s.id?' selected':'')+'>'+esc(s.name)+' — '+z+'</option>';
      }).join('')+'</select></div>';
  }).join('');
  shell(
    '<p class="kicker">Потребности и желания</p>'+
    '<h2>Куда ложится каждое оставшееся желание?</h2>'+
    '<p class="line mute">Если сфера «не хватает» — это скорее потребность. Если «нравится» — желание идет дальше уже наполненного.</p>'+
    balanceSvg(scores)+
    '<div class="panel">'+html+'</div>'+
    '<button class="go" id="goH">К карте потребностей</button>'
  );
  app.querySelectorAll('select').forEach(function(s){
    s.onchange=function(){P=ensure();P.wishMod.research.places[s.dataset.id]=s.value;save(P)};
  });
  document.getElementById('goH').onclick=function(){
    P=ensure();
    var ok=rest.every(function(w){return P.wishMod.research.places[w.id]});
    if(!ok){/* мягко, но можно идти: не анкета */ }
    setScene('needs');
  };
}

function heroIntroView(){
  clearStars();
  shell(
    '<p class="kicker">Круг героев</p>'+
    '<h2>Кто в тебе загадывает и кто тормозит</h2>'+
    '<p class="line mute">Двадцать четыре коротких утверждения. Это не оценка личности, а карта: какие герои сейчас желают, а какие охраняют.</p>'+
    heroWheelSvg(null)+
    '<button class="go" id="goQ">Начать</button>'
  );
  document.getElementById('goQ').onclick=function(){var P=ensure();P.wishMod.research.heroI=0;save(P);setScene('heroQ')};
}

function heroScores(P){
  var ans=P.wishMod.research.heroAns||[], map={};
  HEROES.forEach(function(h){map[h.id]=[]});
  HERO_Q.forEach(function(q,i){if(ans[i]!=null)map[q.hero].push(+ans[i])});
  var out={};
  HEROES.forEach(function(h){
    var a=map[h.id], s=a.length?a.reduce(function(x,y){return x+y},0)/a.length:0;
    out[h.id]=s;
  });
  return out;
}

function heroWheelSvg(scores){
  var cx=100,cy=100,r0=28,r1=52,r2=86;
  var parts=[], i, mid, lp;
  QUADS.forEach(function(q,qi){
    var a0=-Math.PI/2+qi*Math.PI/2, a1=a0+Math.PI/2;
    parts.push('<path d="'+sector(cx,cy,r0,r1,a0,a1)+'" fill="'+q.color+'" opacity=".9"></path>');
    mid=a0+Math.PI/4; lp=polar(cx,cy,(r0+r1)/2,mid);
    parts.push('<text class="qlab" text-anchor="middle" x="'+lp[0]+'" y="'+lp[1]+'">'+esc(q.name)+'</text>');
  });
  HEROES.forEach(function(h,hi){
    var a0=-Math.PI/2+hi*Math.PI/6, a1=a0+Math.PI/6;
    var sc=scores?scores[h.id]:3, op=.25+(sc?((sc-1)/4)*.75:0);
    parts.push('<path d="'+sector(cx,cy,r1,r2,a0,a1)+'" fill="'+h.color+'" opacity="'+op+'"></path>');
    mid=a0+Math.PI/12; lp=polar(cx,cy,r2+16,mid);
    parts.push('<text class="wlab" text-anchor="middle" x="'+lp[0]+'" y="'+lp[1]+'">'+esc(h.name)+'</text>');
  });
  parts.push('<text class="me" text-anchor="middle" x="'+cx+'" y="'+(cy+4)+'">ты</text>');
  return '<div class="wheel-wrap"><svg viewBox="-36 -36 272 272">'+parts.join('')+'</svg></div>';
}

function heroQView(){
  var P=ensure();
  var i=P.wishMod.research.heroI||0;
  if(i>=HERO_Q.length){setScene('heroResult');return}
  var q=HERO_Q[i], ans=P.wishMod.research.heroAns||[];
  shell(
    '<p class="mute">'+(i+1)+' из '+HERO_Q.length+'</p>'+
    '<p class="q-line">'+esc(gx(q.text))+'</p>'+
    '<div class="likert">'+[1,2,3,4,5].map(function(n){
      return '<button class="lik'+(ans[i]===n?' on':'')+'" data-n="'+n+'">'+n+'</button>';
    }).join('')+'</div>'+
    '<p class="mute">1 — почти не про меня · 5 — очень про меня</p>'
  );
  app.querySelectorAll('.lik').forEach(function(b){
    b.onclick=function(){
      P=ensure();
      P.wishMod.research.heroAns=P.wishMod.research.heroAns||[];
      P.wishMod.research.heroAns[i]=+b.dataset.n;
      P.wishMod.research.heroI=i+1;
      save(P); heroQView();
    };
  });
}

function heroResultView(){
  var P=ensure(), sc=heroScores(P);
  var list=HEROES.slice().sort(function(a,b){return (sc[b.id]||0)-(sc[a.id]||0)});
  var wishers=list.filter(function(h){return (sc[h.id]||0)>=4}).slice(0,3);
  var holds=list.slice().reverse().filter(function(h){return (sc[h.id]||0)>0&&(sc[h.id]||0)<=2.5}).slice(0,2);
  if(!wishers.length)wishers=list.slice(0,2);
  if(!holds.length)holds=[list[list.length-1]];
  shell(
    '<p class="kicker">Круг героев</p>'+
    '<h2>Кто в тебе загадывает</h2>'+
    heroWheelSvg(sc)+
    '<div class="panel">'+
    wishers.map(function(h){return '<p><b>'+esc(h.name)+'</b> — живое желание. Движет: '+esc(h.drive)+'.</p>'}).join('')+
    '<h2 style="margin-top:12px">Кто тормозит и что он охраняет</h2>'+
    '<p class="mute">Это не враг. Он бережет то, что ему важно.</p>'+
    holds.map(function(h){return '<p><b>'+esc(h.name)+'</b> охраняет '+esc(h.guard)+'.'+(h.wound?' Может беречь и это: '+esc(h.wound)+'.':'')+'</p>'}).join('')+'<p class="mute">Это не диагноз. Только узнавание, если откликается.</p>'+
    '</div>'+
    '<button class="go" id="goS">Дальше</button>'
  );
  document.getElementById('goS').onclick=function(){setScene('source')};
}

function sourceView(){
  var P=ensure(), rest=remaining(P);
  if(!rest.length){setScene('values');return}
  var cur=P.wishMod.research.source||{};
  var idx=rest.findIndex(function(w){return !cur[w.id]});
  if(idx<0){setScene('values');return}
  var w=rest[idx];
  shell(
    '<p class="kicker">Источник</p>'+
    '<h2>'+esc(w.form||w.text)+'</h2>'+
    '<p class="line mute">Откуда это желание приходит? Без оценки, просто заметь источник.</p>'+
    '<div class="orbs">'+SOURCE.map(function(s){
      return '<button class="orb" data-id="'+s.id+'"><b>'+esc(s.t)+'</b><small>'+esc(s.d)+'</small></button>';
    }).join('')+'</div>'
  );
  app.querySelectorAll('.orb').forEach(function(b){
    b.onclick=function(){P=ensure();P.wishMod.research.source[w.id]=b.dataset.id;save(P);sourceView()};
  });
}

function valuesView(){
  var P=ensure(), sel=P.wishMod.research.values||[];
  shell(
    '<p class="kicker">Ценности</p>'+
    '<h2>Что для тебя сейчас важнее всего?</h2>'+
    '<p class="line mute">Отметь от трех до пяти ориентиров. Потом сверим их с оставшимися желаниями.</p>'+
    '<div class="chips">'+VALS.map(function(v){
      return '<button class="chip'+(sel.indexOf(v)>=0?' on':'')+'" data-v="'+esc(v)+'">'+esc(v)+'</button>';
    }).join('')+'</div>'+
    '<button class="go" id="goC">Дальше</button>'
  );
  app.querySelectorAll('.chip').forEach(function(b){
    b.onclick=function(){
      P=ensure(); sel=P.wishMod.research.values||[];
      var v=b.getAttribute('data-v'), i=sel.indexOf(v);
      if(i>=0)sel.splice(i,1); else if(sel.length<5)sel.push(v);
      P.wishMod.research.values=sel; save(P); valuesView();
    };
  });
  document.getElementById('goC').onclick=function(){if((ensure().wishMod.research.values||[]).length>=3)setScene('contra')};
}

function contraView(){
  var P=ensure(), rest=remaining(P), places=P.wishMod.research.places||{}, scores=wheelScores(P)||[];
  var notes=rest.map(function(w){
    var sid=places[w.id], i=SPH.findIndex(function(s){return s.id===sid});
    var z=i>=0?zoneOf(scores[i]):'none';
    var tag=z==='need'?'скорее потребность':z==='like'?'желание сверх наполненного':'желаемое направление';
    return '<p><b>'+esc(w.form||w.text)+'</b> — '+tag+(i>=0?' ('+esc(SPH[i].name)+')':'')+'.</p>';
  }).join('');
  shell(
    '<p class="kicker">Приоритеты</p>'+
    '<h2>Где потребность, а где желание</h2>'+
    '<div class="panel">'+notes+'</div>'+
    '<p class="line mute">Если два желания тянут в разные стороны, просто заметь это. Потом ты выберешь три направления, с которыми пойдешь дальше.</p>'+
    '<textarea id="cNote" rows="2" placeholder="Если есть напряжение между желаниями, напиши его здесь (необязательно)">'+esc(P.wishMod.research.contra||'')+'</textarea>'+
    '<button class="go" id="go3">Выбрать три направления</button>'
  );
  document.getElementById('go3').onclick=function(){
    P=ensure();P.wishMod.research.contra=document.getElementById('cNote').value||'';save(P);setScene('rings');
  };
}

function pick3View(){
  var P=ensure(), rest=remaining(P);
  if(rest.length<3){
    shell(
      '<h2>Чтобы выбрать три направления, нужно еще чуть больше желаний</h2>'+
      '<p class="line mute">Заявленное желание уже в трекере и не входит в эти три. Вернись к небу и добавь недостающие звезды.</p>'+
      '<button class="go" id="backSky">Вернуться к небу</button>'
    );
    document.getElementById('backSky').onclick=function(){setScene('sky')};
    return;
  }
  var dirs=P.wishMod.research.dirs||[];
  shell(
    '<p class="kicker">Три направления</p>'+
    '<h2>Выбери ровно три целевых направления</h2>'+
    '<p class="line mute">Заявленное желание уже идет своей строкой и в эти три не входит. Три направления тоже запишутся в трекер.</p>'+
    '<div class="chips">'+rest.map(function(w){
      return '<button class="chip'+(dirs.indexOf(w.id)>=0?' on':'')+'" data-id="'+w.id+'">'+esc(w.form||w.text)+'</button>';
    }).join('')+'</div>'+
    '<p class="mute">Выбрано: '+dirs.length+' из 3</p>'+
    (dirs.length===3?'<button class="go" id="goSum">Записать в трекер</button>':'')
  );
  app.querySelectorAll('.chip').forEach(function(b){
    b.onclick=function(){
      P=ensure(); dirs=P.wishMod.research.dirs||[];
      var i=dirs.indexOf(b.dataset.id);
      if(i>=0)dirs.splice(i,1); else if(dirs.length<3)dirs.push(b.dataset.id);
      P.wishMod.research.dirs=dirs; save(P); pick3View();
    };
  });
  var g=document.getElementById('goSum');
  if(g)g.onclick=function(){writeDirections(ensure());setScene('summary')};
}

function summaryView(){
  var P=ensure(), w=declaredWish(P), dirs=P.tracker&&P.tracker.directions||[];
  var scores=wheelScores(P);
  clearStars();
  shell(
    '<p class="kicker">Собрано</p>'+
    '<h2>Заявка и три направления уже в трекере</h2>'+
    (scores?balanceSvg(scores):'')+
    heroWheelSvg(heroScores(P))+
    '<div class="track-note"><b>Заявленное желание</b><br>'+esc(w?(w.form||w.text):'—')+'</div>'+
    '<div class="track-note"><b>Три направления</b><ol style="margin:6px 0 0 18px;padding:0">'+dirs.map(function(d){return '<li>'+esc(d.text)+'</li>'}).join('')+'</ol></div>'+
    '<button class="go" id="goOn">'+((window.GFLOW&&flowNext())?'Дальше':'К трекеру')+'</button>'+
    '<button class="quiet" id="toReac">Открыть трекер</button>'
  );
  if(window.GQuote)GQuote.add(app.querySelector('.wsc')||app,'wish.html',document.getElementById('goOn'));
  if(window.GSupport)GSupport.after(app.querySelector('.wsc')||app,'praise',document.getElementById('goOn'));
  document.getElementById('goOn').onclick=finishStep;
  document.getElementById('toReac').onclick=function(){finishStep('wish-track.html')};
}

function finishStep(to){
  var P=ensure();
  if(!(P.tracker&&P.tracker.declared&&(P.tracker.directions||[]).length===3))return;
  if(window.GRoute){
    if(!GRoute.complete('wish.html'))GRoute.complete();
    if(GRoute.markAdvance)GRoute.markAdvance();
  }
  var n=to||((window.flowNext)&&flowNext())||'reactor.html';
  location.href=n;
}


function deficitName(P, sid){
  var scores=wheelScores(P)||[];
  var i=SPH.findIndex(function(s){return s.id===sid});
  if(i<0)return 'none';
  return zoneOf(scores[i]);
}
function originOf(P,w){
  var R=P.wishMod.research||{}, sid=(R.places||{})[w.id], z=deficitName(P,sid);
  var src=(R.source||{})[w.id];
  var hits=0;
  if(z==='like')hits++;
  if(src&&src!=='relation')hits++;
  if((w.closer||0)>0)hits++;
  var kind=hits>=2?'mine':hits===1?'mixed':'outer';
  var explain=kind==='mine'?'По сигналам это больше похоже на твое: оно опирается на уже живой отклик и не закрывает только дыру.':kind==='mixed'?'Здесь смешано свое и внешнее: часть идет из дефицита или из связи с другими, часть — из живого желания.':'Пока больше похоже, что желание пришло извне или из нехватки. Это не приговор, просто заметка по сигналам.';
  return {kind:kind, label:kind==='mine'?'мое':kind==='mixed'?'смешанное':'пришло извне', explain:explain};
}
function needsView(){
  clearStars();
  var P=ensure(), scores=wheelScores(P)||[], rest=remaining(P), places=P.wishMod.research.places||{};
  var html=rest.map(function(w){
    var sid=places[w.id], i=SPH.findIndex(function(s){return s.id===sid});
    var z=i>=0?zoneOf(scores[i]):'none';
    var tag=z==='need'?'потребность: закрывает дефицит':z==='like'?'желание сверх уже наполненного':'направление';
    var o=originOf(P,w);
    return '<p><b>'+esc(w.form||w.text)+'</b> — '+tag+(i>=0?' ('+esc(SPH[i].name)+')':'')+'. Метка: <i>'+esc(o.label)+'</i>. '+esc(o.explain)+'</p>';
  }).join('')||'<p class="mute">Сначала вернись к небу и добавь желания.</p>';
  /* фон и самоценность, если есть */
  var extra='';
  if(P.ego) extra+='<p class="mute">Учитывается и фоновое состояние из пути героя, если оно уже собрано.</p>';
  if(P.selfWorth||P.sv) extra+='<p class="mute">Учитывается и самоценность, если этот шаг уже пройден.</p>';
  shell('<p class="kicker">Слой потребностей</p><h2>Где желание закрывает нехватку, а где идет дальше</h2><p class="line mute">Дефициты читаются из колеса баланса. Мы не спрашиваем «чье это». Метки появляются по сигналам.</p><div class="panel">'+html+extra+'</div><button class="go" id="goSc">К сцене с символами</button>');
  document.getElementById('goSc').onclick=function(){setScene('scene')};
}
function sceneView(){
  clearStars();
  var P=ensure();
  var sy=P.wishMod.research.scene||{self:'',sym:''};
  var SYMS=[{id:'house',t:'дом'},{id:'road',t:'дорога'},{id:'water',t:'вода'},{id:'door',t:'дверь'},{id:'light',t:'свет'},{id:'figures',t:'фигуры'}];
  var PL=[{id:'center',t:'в центре'},{id:'near',t:'рядом'},{id:'path',t:'на пути'},{id:'edge',t:'у края'}];
  shell('<p class="kicker">Сцена</p><h2>Поставь себя в сцену, потом появится символ желания</h2><p class="line mute">Это не тест. Просто почувствуй место и образ.</p>'+
    '<p class="mute">Где ты сейчас в сцене?</p><div class="chips">'+PL.map(function(x){return '<button class="chip'+(sy.self===x.id?' on':'')+'" data-self="'+x.id+'">'+x.t+'</button>'}).join('')+'</div>'+
    '<p class="mute">Какой символ появляется как желание?</p><div class="chips">'+SYMS.map(function(x){return '<button class="chip'+(sy.sym===x.id?' on':'')+'" data-sym="'+x.id+'">'+x.t+'</button>'}).join('')+'</div>'+
    '<button class="go" id="goH">К кругу героев</button>');
  app.querySelectorAll('[data-self]').forEach(function(b){b.onclick=function(){P=ensure();P.wishMod.research.scene=P.wishMod.research.scene||{};P.wishMod.research.scene.self=b.getAttribute('data-self');save(P);sceneView()}});
  app.querySelectorAll('[data-sym]').forEach(function(b){b.onclick=function(){P=ensure();P.wishMod.research.scene=P.wishMod.research.scene||{};P.wishMod.research.scene.sym=b.getAttribute('data-sym');save(P);sceneView()}});
  document.getElementById('goH').onclick=function(){setScene('heroIntro')};
}
function ringsView(){
  clearStars();
  var P=ensure(), rest=remaining(P);
  var rings=P.wishMod.research.rings||{inner:null, mid:[]};
  function cls(id){return 'chip'+(rings.inner===id?' on':'')+(rings.mid.indexOf(id)>=0?' has':'')}
  shell('<p class="kicker">Кольца близости</p><h2>Что сейчас ближе всего к тебе</h2><p class="line mute">Во внутреннем кольце — одно желание, в среднем — два, остальные остаются во внешнем. Это про близость сейчас, не про важность навсегда. Заявленное желание сюда не входит.</p>'+
    '<div class="chips">'+rest.map(function(w){return '<button class="'+cls(w.id)+'" data-id="'+w.id+'">'+esc(w.form||w.text)+'</button>'}).join('')+'</div>'+
    '<p class="mute">Внутри: '+(rings.inner?1:0)+' из 1 · рядом: '+(rings.mid||[]).length+' из 2</p>'+
    ((rings.inner&&rings.mid.length===2)||rest.length<3?'<button class="go" id="go3">Выбрать три направления</button>':''));
  app.querySelectorAll('[data-id]').forEach(function(b){
    b.onclick=function(){
      P=ensure(); rings=P.wishMod.research.rings||{inner:null, mid:[]};
      var id=b.getAttribute('data-id');
      if(rings.inner===id) rings.inner=null;
      else if(rings.mid.indexOf(id)>=0) rings.mid=rings.mid.filter(function(x){return x!==id});
      else if(!rings.inner) rings.inner=id;
      else if(rings.mid.length<2) rings.mid.push(id);
      P.wishMod.research.rings=rings; save(P); ringsView();
    };
  });
  var g=document.getElementById('go3'); if(g)g.onclick=function(){setScene('pick3')};
}

var VIEWS={
  invite:inviteView, sky:skyView, pair:pairView, discover:discoverView,
  choose:chooseView, clarify:clarifyView, declare:declareView, accepted:acceptedView,
  wheel:wheelView, place:placeView, needs:needsView, scene:sceneView, heroIntro:heroIntroView, heroQ:heroQView,
  heroResult:heroResultView, source:sourceView, values:valuesView, contra:contraView,
  rings:ringsView, pick3:pick3View, summary:summaryView
};

function render(){
  var P=ensure();
  var sc=P.wishMod.scene||'invite';
  if(P.tracker&&P.tracker.declared&&(P.tracker.directions||[]).length===3&&!['summary','sky','pick3'].includes(sc)){
    /* уже собрано — можно показать итог, если маршрут открыл шаг для просмотра */
  }
  (VIEWS[sc]||inviteView)();
}

drawSky();
window.addEventListener('resize',function(){drawSky();var P=ensure();if(['sky','pair','discover','choose','clarify','declare'].indexOf(P.wishMod.scene)>=0)render()});
render();
})();
