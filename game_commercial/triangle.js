/* Шаг «Кто сейчас выбирает?»:
   1) Короткая заставка Старца (голос Б, помещается без скролла, без терминов Эго/Самость).
   2) Экран с героем, темной и светлой фигурами + 16 коротких утверждений о привычных защитных реакциях.
      Игрок свайпает «Про меня» / «Не про меня» (или «Иногда») и в момент выбора узнает, какая это была сторона:
      темная — затемняется тенью, светлая — мягко подсвечивается золотом.
   3) Итог в едином шаблоне GResultCard с расшифровкой Эго/Самости, закономерностей и автосохранением в Дневник. */
(function(){
'use strict';
var KEY='alch_v5_profile',q=new URLSearchParams(location.search),preview=q.get('preview')==='1';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(P){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function GF(s){var f=load().gender==='f';return String(s).replace(/\{([^{}|]*)\|([^{}|]*)\}/g,function(_,m,w){return f?w:m})}
function ph(n,a,b,c){var m=n%10,h=n%100;return n+' '+(m===1&&h!==11?a:m>=2&&m<=4&&(h<12||h>14)?b:c)}
function vib(n){try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}}

/* 16 коротких естественных фраз вперемешку (10 темных: матричные слова + 5 травм; 6 светлых: живая опора).
   Никаких подсказывающих слов — человек отвечает о себе честно. */
var CARDS=[
 /* 16 утверждений: 8 защитных (темных) и 8 живых (светлых) — по одной паре на область.
    Так видно и привычную реакцию, и то, где уже есть контакт с собой. Гендер подставляет GF(). */
 {id:'e1',side:'ego',word:'Требование к себе',wound:'duty',t:'Даже когда я понимаю, что {устал|устала}, мне трудно остановиться, пока не выполню все запланированное.'},
 {id:'s1',side:'self',word:'Право на паузу',pillar:'duty',t:'Я могу остановиться и отдохнуть, даже если не все дела сделаны, и не чувствовать за это вину.'},
 {id:'e2',side:'ego',word:'Страх недовольства',wound:'approval',t:'Я могу согласиться на то, чего не хочу, только чтобы не испортить отношения или не вызвать недовольство.'},
 {id:'s2',side:'self',word:'Прямой отказ',pillar:'approval',t:'Я могу сказать «нет» без длинных объяснений, если понимаю, что не хочу этого делать.'},
 {id:'e3',side:'ego',word:'Контроль неопределенности',wound:'control',t:'Когда я не знаю, чем закончится ситуация, мне трудно действовать, пока я не просчитаю возможные варианты.'},
 {id:'s3',side:'self',word:'Шаг без полной ясности',pillar:'control',t:'Я могу сделать следующий шаг, даже если не вижу весь путь до конца.'},
 {id:'e4',side:'ego',word:'Трудность просить',wound:'rejection',t:'Мне бывает проще отказаться от своего желания или просьбы, чем рискнуть показаться {навязчивым|навязчивой}.'},
 {id:'s4',side:'self',word:'Могу попросить',pillar:'rejection',t:'Я могу прямо сказать, чего хочу, или попросить о помощи, не заранее убеждая себя, что это лишнее.'},
 {id:'e5',side:'ego',word:'Спасательство',wound:'responsibility',t:'Когда я вижу, что другой человек не справляется, у меня автоматически возникает желание вмешаться и все исправить.'},
 {id:'s5',side:'self',word:'Чужая доля',pillar:'responsibility',t:'Я могу оставить другому его часть задачи и не бросаться исправлять все за него.'},
 {id:'e6',side:'ego',word:'Ориентация на ожидания',wound:'expectations',t:'Принимая важное решение, я чаще думаю о том, чего от меня ждут другие, чем о том, чего хочу {сам|сама}.'},
 {id:'s6',side:'self',word:'Свой выбор',pillar:'expectations',t:'Я могу выбрать то, чего хочу {сам|сама}, даже если близкие могут это не одобрить.'},
 {id:'e7',side:'ego',word:'Перфекционизм',wound:'perfection',t:'Я могу долго откладывать начало дела, потому что не {уверен|уверена}, что справлюсь достаточно хорошо.'},
 {id:'s7',side:'self',word:'Достаточно хорошо',pillar:'perfection',t:'Я могу начать или закончить дело, когда результат уже достаточно хорош, не дожидаясь идеала.'},
 {id:'e8',side:'ego',word:'Трудность принимать помощь',wound:'independence',t:'Мне неловко принимать помощь, даже когда она действительно могла бы облегчить мне жизнь.'},
 {id:'s8',side:'self',word:'Могу принять',pillar:'independence',t:'Я могу принять помощь и не чувствовать, что теперь {должен|должна} немедленно отплатить или доказать, что она была не зря.'}
];

var WOUND_INFO={
 duty:{name:'требования важнее самочувствия',note:'Внутренний план может звучать громче, чем то, как ты себя чувствуешь сейчас. Полезно замечать, когда настойчивость действительно нужна, а когда пора снизить нагрузку.'},
 approval:{name:'сначала думаешь, как воспримут другие',note:'Перед своим решением появляется проверка: а как это воспримут? Это помогает учитывать отношения, но иногда мешает сказать прямо, чего хочешь ты.'},
 control:{name:'стремление снизить неопределенность',note:'Подготовка и прогнозирование дают ощущение устойчивости, но на них уходит больше сил, чем требует реальный следующий шаг.'},
 rejection:{name:'осторожность перед обращением',note:'Перед тем как попросить или сказать, появляется мысль: а вдруг помешаю или откажут. Это может останавливать даже там, где контакт был бы уместен.'},
 responsibility:{name:'берешь на себя больше своей доли',note:'Ты можешь брать чужую часть, чтобы дело не остановилось. Полезно различать, что твое, а что принадлежит другому.'},
 expectations:{name:'сначала учитываешь ожидания',note:'При выборе сначала думаешь об окружении. Это не обязательно отказ от себя, но полезно отдельно услышать, чего хочешь ты.'},
 perfection:{name:'ждешь полной уверенности',note:'Высокая планка может помогать качеству, но иногда превращает начало в ожидание, пока не будешь уверен полностью.'},
 independence:{name:'привычка справляться самому',note:'Самостоятельность может быть силой. Но иногда она же мешает заметить, что помощь можно принять и не чувствовать за это долг.'}
};

function css(){
 if(document.getElementById('tri-css'))return;
 var s=document.createElement('style');s.id='tri-css';
 s.textContent=
  'body.tri-on,body.tri-on .wrap{background:#0d0905!important}'+
  '.tri{margin:-8px -16px 0;position:relative;color:#f4ecdf;font-family:Manrope,sans-serif}'+'.tri.deck{display:flex;flex-direction:column;height:calc(100svh - 70px - 90px);min-height:460px;margin-top:-62px}'+
  /* Заставка Старца — влезает целиком на 375x667 без скролла */
  '.tri-cut{position:relative;min-height:calc(100svh - 110px);display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;border-radius:0 0 22px 22px;background:#0c0804}'+
  '.tri-cut-bg{position:absolute;inset:0;background:url(img/scene_fire.jpg) center 20%/cover no-repeat}'+
  '.tri-cut-fg{position:absolute;inset:0;background:linear-gradient(rgba(12,8,4,.22),rgba(12,8,4,.18) 32%,rgba(12,8,4,.86) 66%,#0d0905 96%)}'+
  '.tri-cut-card{position:relative;z-index:2;margin:16px 14px 12px;padding:16px 16px 14px;border-radius:20px;background:linear-gradient(#f6e6bf,#e2c78e);color:#3a2410;box-shadow:0 14px 34px rgba(0,0,0,.5)}'+
  '.tri-cut-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}'+
  '.tri-cut-role{font:800 12px Manrope,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#7a4e1c}'+
  '.tri-cut-au{border:1.5px solid #9c6b26;background:rgba(255,250,236,.75);color:#5c350c;border-radius:999px;padding:5px 12px;font:700 13px Manrope,sans-serif;cursor:pointer}'+
  '.tri-cut-au.on{background:#6e4314;color:#fff7e4;border-color:#6e4314}'+
  '.tri-cut-txt{margin:0 0 12px;font:500 16.5px/1.44 Manrope,sans-serif;color:#2c1808}'+
  '.tri-cut-go{display:block;width:100%;min-height:48px;padding:12px 18px;border:0;border-radius:999px;background:linear-gradient(180deg,#f5d68a,#cfa046);color:#261606;font:800 17px Manrope,sans-serif;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.28)}'+
  '.tri-cut-hint{margin:0 0 12px;font:600 15px/1.4 Manrope,sans-serif;color:#5c350c;text-align:center}'+
  '.tri-demo{position:relative;height:48px;margin:2px auto 10px;width:100%;max-width:260px}.tri-demo b{position:absolute;left:50%;top:6px;width:104px;margin-left:-52px;height:36px;border-radius:10px;background:linear-gradient(#fff8e4,#e0a940);box-shadow:0 4px 10px rgba(80,40,8,.28);animation:triDemo 2.6s ease-in-out infinite}.tri-demo b:after{content:"\\261D";position:absolute;left:40px;top:16px;font-size:22px}.tri-demo span{position:absolute;top:12px;font-size:22px;color:#7a4e1c;font-weight:800}.tri-demo .a1{left:0}.tri-demo .a2{right:0}@keyframes triDemo{0%,100%{transform:translateX(0)}25%{transform:translateX(-64px) rotate(-10deg)}50%{transform:translateX(0)}75%{transform:translateX(64px) rotate(10deg)}}'+
  /* Сцена треугольника */
  '.tri-img{position:relative;width:100%;flex:1 1 38%;min-height:180px;max-height:42vh;height:auto;background:#0d0905 center 12%/cover no-repeat;overflow:hidden}'+
  '.tri-img i{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .28s ease}'+
  /* Темная сторона — видимая тень и дым слева, той же силы, что и свет справа */
  '.tri-img .shDark{background:radial-gradient(ellipse 80% 90% at 15% 50%,rgba(0,0,0,.98) 0%,rgba(0,0,0,.85) 35%,rgba(0,0,0,.4) 60%,transparent 80%),linear-gradient(90deg,rgba(0,0,0,.9) 0%,rgba(0,0,0,.6) 30%,transparent 65%);mix-blend-mode:multiply}'+
  '.tri-img .shSmoke{background:radial-gradient(ellipse 52% 68% at 20% 46%,rgba(10,6,4,.88),rgba(18,10,6,.4) 48%,transparent 74%);mix-blend-mode:multiply;transform-origin:20% 48%}'+
  '.tri-img .shHero{background:radial-gradient(ellipse 64% 52% at 50% 32%,rgba(0,0,0,.82),rgba(0,0,0,.4) 58%,transparent 76%);mix-blend-mode:multiply}'+
  /* Светлая сторона — мягкое золотое свечение справа и вокруг героя */
  '.tri-img .glLight{background:radial-gradient(ellipse 68% 62% at 74% 48%,rgba(255,226,148,.66),rgba(255,204,110,.24) 52%,transparent 76%);mix-blend-mode:screen}'+
  '.tri-img .glHero{background:radial-gradient(ellipse 60% 48% at 50% 34%,rgba(255,232,168,.55),transparent 72%);mix-blend-mode:screen}'+
  '.tri-img .dimLeft{background:linear-gradient(90deg,rgba(6,4,2,.72),transparent 54%)}'+
  '.tri-img.fx-dark .shDark{opacity:1}.tri-img.fx-dark .shSmoke{opacity:1;animation:triSmoke .7s ease-out}.tri-img.fx-dark .shHero{opacity:1}.tri-img.fx-dark:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.55) 0%,rgba(0,0,0,.25) 40%,transparent 70%);pointer-events:none}'+
  '.tri-img.fx-dark-soft .shDark{opacity:.75}.tri-img.fx-dark-soft .shSmoke{opacity:.7}.tri-img.fx-dark-soft .shHero{opacity:.65}'+
  '.tri-img.fx-light .glLight{opacity:1}.tri-img.fx-light .glHero{opacity:1}.tri-img.fx-light .dimLeft{opacity:.9}.tri-img.fx-light:after{content:"";position:absolute;inset:0;background:linear-gradient(270deg,rgba(255,220,140,.45) 0%,rgba(255,200,100,.15) 40%,transparent 70%);pointer-events:none;mix-blend-mode:screen}'+
  '.tri-img.fx-light-soft .glLight{opacity:.7}.tri-img.fx-light-soft .glHero{opacity:.6}.tri-img.fx-light-soft .dimLeft{opacity:.5}'+
  '.tri-img.drag i{transition:none}'+
  '@keyframes triSmoke{from{filter:blur(16px);transform:scale(.82)}to{filter:blur(0);transform:scale(1)}}'+
  '@keyframes triWig{0%,100%{transform:translateX(0)}20%{transform:translateX(-16px) rotate(-2deg)}50%{transform:translateX(16px) rotate(2deg)}75%{transform:translateX(-6px)}}.tri-card.wig{animation:triWig 1.1s ease}'+
  /* Плашка раскрытия стороны поверх сцены */
  '.tri-rev{position:absolute;left:50%;top:14px;transform:translate(-50%,-6px);z-index:4;padding:6px 16px;border-radius:999px;font:800 13px Manrope,sans-serif;letter-spacing:.09em;text-transform:uppercase;opacity:0;transition:opacity .2s ease,transform .2s ease;pointer-events:none;white-space:nowrap}'+
  '.tri-rev.on{opacity:1;transform:translate(-50%,0)}'+
  '.tri-rev.dark{background:rgba(16,10,8,.92);color:#d7c6b2;border:1px solid rgba(170,145,120,.55);box-shadow:0 6px 20px rgba(0,0,0,.75)}'+
  '.tri-rev.light{background:linear-gradient(180deg,#fff2c2,#e5b755);color:#2c1808;border:1px solid #fff5d4;box-shadow:0 0 22px rgba(255,212,110,.75)}'+
  /* Нижняя панель карточек */
  '.tri-p{position:relative;flex:0 0 auto;margin-top:0;padding:12px 16px 16px;background:#0d0905}'+
  '.tri-meta{display:flex;justify-content:space-between;align-items:center;margin:0 0 8px;font:700 12.5px Manrope,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#d6b272}'+
  '.tri-card{position:relative;margin:4px 0 12px;padding:20px 16px;border-radius:18px;background:linear-gradient(#f6e6bf,#e2c78e);color:#2c1808;font:700 19.5px/1.38 Manrope,sans-serif;text-align:center;touch-action:none;user-select:none;-webkit-user-select:none;transition:transform .34s ease,opacity .3s ease,background .24s ease,color .24s ease,box-shadow .24s ease;box-shadow:0 8px 24px rgba(0,0,0,.55);min-height:92px;display:flex;flex-direction:column;align-items:center;justify-content:center}'+
  '.tri-card.fl-dark{background:linear-gradient(#261c17,#140e0b);color:#e6d8c6;box-shadow:0 10px 30px rgba(0,0,0,.85),inset 0 0 0 1px rgba(170,140,110,.35)}'+
  '.tri-card.fl-light{background:linear-gradient(#fff6d8,#f0cb72);color:#2c1808;box-shadow:0 0 28px rgba(255,216,118,.75)}'+
  '.tri-card small{display:block;margin-top:6px;font:700 12px Manrope,sans-serif;letter-spacing:.08em;text-transform:uppercase;opacity:.85}'+
  '.tri-bt{display:flex;gap:8px;align-items:stretch}'+
  '.tri-bt button{flex:1;min-height:48px;border-radius:999px;font:700 15.5px Manrope,sans-serif;border:1px solid #c99a45;background:#20170e;color:#f4ecdf;cursor:pointer;padding:8px 10px}'+
  '.tri-bt button:active{transform:scale(.97)}'+
  '.tri-bt .yes{background:linear-gradient(180deg,#f5d68a,#cfa046);color:#261606;border-color:#ffe7a8;font-weight:800}'+
  '.tri-bt .mid{flex:0 0 auto;min-width:92px;background:transparent;color:#d6b272;border-color:rgba(201,154,69,.5);font-size:14.5px}'+
  '.tri-hint{text-align:center;margin:10px 0 0;font:500 13.5px Manrope,sans-serif;color:#a8906a}'+
  '.tri-res-wrap{padding:4px 14px 20px}';
 document.head.appendChild(s);
}

function mount(box){
 var P=load(),pic=P.gender==='f'?'img/triangle_f.jpg':'img/triangle_m.jpg';
 css();document.body.classList.add('tri-on');
 var pre=new Image();pre.src=pic;
 var pre2=new Image();pre2.src='img/scene_fire.jpg';
 var step='intro',idx=0,ans=[],locked=false,elderAu=null,t0=0;

 function stopAudio(){if(elderAu){try{elderAu.pause();elderAu.currentTime=0}catch(e){}elderAu=null}}
 function soundEnabled(){return !window.GSound||GSound.isOn()}
 window.addEventListener('pagehide',stopAudio);

 /* ---------- 1. Заставка Старца ---------- */
 function showIntro(){
  step='intro';
  box.innerHTML='<div class="tri"><div class="tri-cut"><div class="tri-cut-bg"></div><div class="tri-cut-fg"></div>'+
   '<div class="tri-cut-card">'+
    '<div class="tri-cut-head"><span class="tri-cut-role">Старец</span></div>'+
    '<p class="tri-cut-txt">У каждого есть привычные способы защищаться и справляться. Иногда они помогают, а иногда начинают выбирать за нас. Давай посмотрим, какие из них проявляются у тебя.</p>'+
    '<div class="tri-demo" aria-hidden="true"><span class="a1">←</span><b></b><span class="a2">→</span></div>'+
    '<p class="tri-cut-hint">Свайпай фразу влево или вправо, если она тебе откликается. Кнопки внизу тоже можно нажать.</p>'+
    '<button type="button" class="tri-cut-go" id="triGo">Начать</button>'+
   '</div></div></div>';
  /* Голос отключен: озвучка не совпадала с текстом. Остается только надпись. */
  box.querySelector('#triGo').onclick=function(){vib(20);idx=0;ans=[];showDeck()};
  scrollTo(0,0);
 }

 /* ---------- 2. Экран свайпа карточек ---------- */
 var imgEl,panEl,revEl;
 function showDeck(){
  step='deck';
  box.innerHTML='<div class="tri deck">'+
   '<div class="tri-img" id="triImg" style="background-image:url('+pic+')">'+
    '<i class="shDark"></i><i class="shSmoke"></i><i class="shHero"></i><i class="glLight"></i><i class="glHero"></i><i class="dimLeft"></i>'+
    '<div class="tri-rev" id="triRev"></div>'+
   '</div>'+
   '<div class="tri-p" id="triPan"></div>'+
  '</div>';
  imgEl=box.querySelector('#triImg');panEl=box.querySelector('#triPan');revEl=box.querySelector('#triRev');
  drawCard();
 }
 function setFx(mode){
  if(!imgEl)return;
  imgEl.classList.remove('fx-dark','fx-dark-soft','fx-light','fx-light-soft');
  if(mode==='dark'||mode==='dark-soft'||mode==='light'||mode==='light-soft')imgEl.classList.add('fx-'+mode);
 }
 function drawCard(){
  if(idx>=CARDS.length){finish();return}
  locked=false;setFx('');
  if(revEl){revEl.className='tri-rev';revEl.textContent=''}
  var item=CARDS[idx],txt=GF(item.t);
  t0=Date.now();
  panEl.innerHTML='<div class="tri-meta"><span>Это про тебя?</span><span>'+(idx+1)+' / '+CARDS.length+'</span></div>'+
   '<div class="tri-card" id="triC">'+esc(txt)+'</div>'+
   '<div class="tri-bt">'+
    '<button type="button" data-pick="no">Не про меня</button>'+
    '<button type="button" class="mid" data-pick="mid">Иногда</button>'+
    '<button type="button" class="yes" data-pick="yes">Про меня</button>'+
   '</div>'+
   '<div class="tri-hint">Свайпни карточку вправо («Про меня») или влево («Не про меня»)</div>';

  var card=panEl.querySelector('#triC');
  panEl.querySelectorAll('[data-pick]').forEach(function(b){
   b.onclick=function(){choose(b.dataset.pick,card,item,txt,idle)};
  });

  var sx=0,sy=0,dx=0,dy=0,drag=false,idle=null;
  function wig(){if(drag||locked)return;card.classList.remove('wig');void card.offsetWidth;card.classList.add('wig')}
  idle=setInterval(wig,3200);setTimeout(wig,800);
  card.onpointerdown=function(e){
   if(locked)return;drag=true;sx=e.clientX;sy=e.clientY;dx=0;dy=0;
   card.classList.remove('wig');card.style.transition='none';
   if(imgEl)imgEl.classList.add('drag');
   try{card.setPointerCapture(e.pointerId)}catch(err){}
  };
  card.onpointermove=function(e){
   if(!drag||locked)return;
   dx=e.clientX-sx;dy=e.clientY-sy;
   card.style.transform='translate('+dx+'px,'+Math.max(-12,dy*.4)+'px) rotate('+(dx/18)+'deg)';
   if(dx>28)setFx(item.side==='ego'?'dark-soft':'light-soft');
   else setFx('');
  };
  function endDrag(){
   if(!drag||locked)return;drag=false;
   if(imgEl)imgEl.classList.remove('drag');
   card.style.transition='';
   if(dx>56)choose('yes',card,item,txt,idle);
   else if(dx<-56)choose('no',card,item,txt,idle);
   else if(dy>70)choose('mid',card,item,txt,idle);
   else{card.style.transform='';setFx('')}
  }
  card.onpointerup=endDrag;card.onpointercancel=endDrag;
 }

 function choose(pick,card,item,txt,idle){
  if(locked)return;locked=true;
  if(idle)clearInterval(idle);
  var ms=Date.now()-t0;
  ans.push({id:item.id,text:txt,side:item.side,pick:pick,word:item.word||'',wound:item.wound||'',pillar:item.pillar||'',ms:ms});
  vib(pick==='yes'?26:16);
  if(imgEl)imgEl.classList.remove('drag');

  if(pick==='yes'||pick==='mid'){
   var isDark=item.side==='ego';
   var soft=pick==='mid';
   setFx(isDark?(soft?'dark-soft':'dark'):(soft?'light-soft':'light'));
   card.classList.remove('wig');
   card.classList.add(isDark?'fl-dark':'fl-light');
   card.innerHTML=esc(txt);
   card.style.transform=pick==='yes'?'translate(28px,0) scale(1.03)':'scale(.98)';
   if(revEl){revEl.className='tri-rev';revEl.textContent=''}
   setTimeout(function(){
    card.style.opacity='0';
    card.style.transform=pick==='yes'?'translate(420px,0) rotate(18deg)':'translate(0,160px) scale(.9)';
    setTimeout(function(){idx++;drawCard()},280);
   },isDark?520:420);
  }else{
   /* «Не про меня»: карточка уходит влево без эффекта. Эффект только когда выбираешь «про меня». */
   setFx('');
   card.classList.remove('wig');
   card.style.transform='translate(-420px,0) rotate(-18deg)';
   card.style.opacity='0';
   setTimeout(function(){idx++;drawCard()},320);
  }
 }

 /* ---------- 3. Сохранение и единый экран результата ---------- */
 function finish(){
  function score(side){
   return ans.filter(function(a){return a.side===side}).reduce(function(n,a){return n+(a.pick==='yes'?2:a.pick==='mid'?1:0)},0);
  }
  var egoScore=score('ego'),selfScore=score('self');
  var egoRate=Math.round(egoScore/16*100),selfRate=Math.round(selfScore/16*100);
  var wCnt={};
  ans.filter(function(a){return a.side==='ego'&&(a.pick==='yes'||a.pick==='mid')}).forEach(function(a){
   if(a.wound)wCnt[a.wound]=(wCnt[a.wound]||0)+(a.pick==='yes'?2:1);
  });
  var topWounds=Object.keys(wCnt).sort(function(a,b){return wCnt[b]-wCnt[a]}).slice(0,2);
  var egoYes=ans.filter(function(a){return a.side==='ego'&&a.pick==='yes'}).length,selfYes=ans.filter(function(a){return a.side==='self'&&a.pick==='yes'}).length;
  var rec={v:7,egoScore:egoScore,selfScore:selfScore,egoRate:egoRate,selfRate:selfRate,
   ego:egoYes,self:selfYes,
   egoCount:egoYes,
   selfCount:selfYes,
   doubtCount:ans.filter(function(a){return a.pick==='mid'}).length,
   topWounds:topWounds,answers:ans,doneAt:Date.now()};
  if(!preview){
   var P2=load();
   P2.dialog=rec;
   P2.researchContext=P2.researchContext||{};
   P2.researchContext.egoSelf={
    version:rec.v,source:'dialog',updatedAt:rec.doneAt,
    egoRate:rec.egoRate,selfRate:rec.selfRate,
    egoScore:rec.egoScore,selfScore:rec.selfScore,
    topProtectivePatterns:rec.topWounds.slice(),
    selfContactAreas:ans.filter(function(a){return a.side==='self'&&(a.pick==='yes'||a.pick==='mid')}).map(function(a){return {id:a.id,pillar:a.pillar,pick:a.pick}}),
    responseUncertainty:rec.doubtCount,
    rawAnswers:ans.map(function(a){return {id:a.id,side:a.side,pick:a.pick,text:a.text}}),
    note:'Исследовательские наблюдения, не диагноз и не автоматическое предписание.'
   };
   if(window.GProfile&&GProfile.saveResult){
    GProfile.saveResult('dialog',rec,{answers:ans,version:rec.v});
    P2=load();
    P2.researchContext=P2.researchContext||{};
    P2.researchContext.egoSelf={
     version:rec.v,source:'dialog',updatedAt:rec.doneAt,
     egoRate:rec.egoRate,selfRate:rec.selfRate,egoScore:rec.egoScore,selfScore:rec.selfScore,
     topProtectivePatterns:rec.topWounds.slice(),
     selfContactAreas:ans.filter(function(a){return a.side==='self'&&(a.pick==='yes'||a.pick==='mid')}).map(function(a){return {id:a.id,pillar:a.pillar,pick:a.pick}}),
     responseUncertainty:rec.doubtCount,
     rawAnswers:ans.map(function(a){return {id:a.id,side:a.side,pick:a.pick,text:a.text}}),
     note:'Исследовательские наблюдения, не диагноз и не автоматическое предписание.'
    };
   }
   if(window.GArts&&GArts.grantInto)GArts.grantInto(P2,'mirror',{source:'slot.html?id=dialog'});
   (P2.log=P2.log||[]).push({t:Date.now(),x:'Короткие ситуации о выборе: '+(rec.topWounds&&rec.topWounds[0]&&WOUND_INFO[rec.topWounds[0]]?WOUND_INFO[rec.topWounds[0]].name:'привычные реакции')});
   save(P2);
  }
  showResult(rec);
 }

 function showResult(rec){
  var F=load().gender==='f',all=rec.answers||[];
  function score(side){
   return all.filter(function(a){return a.side===side}).reduce(function(n,a){return n+(a.pick==='yes'?2:a.pick==='mid'?1:0)},0);
  }
  var egoScore=typeof rec.egoScore==='number'?rec.egoScore:score('ego');
  var selfScore=typeof rec.selfScore==='number'?rec.selfScore:score('self');
  var egoRate=Math.round(egoScore/16*100),selfRate=Math.round(selfScore/16*100);
  var egoSeen=all.filter(function(a){return a.side==='ego'&&(a.pick==='yes'||a.pick==='mid')});
  var selfSeen=all.filter(function(a){return a.side==='self'&&(a.pick==='yes'||a.pick==='mid')});
  var leadText='';
  var strongLine=egoSeen.length
   ?'Есть реакции, которые включаются сами, еще до того как ты успеваешь осознать, что произошло. Это автоматическая реакция. Начать замечать ее уже значит, что с этим можно работать и выбирать осознанно.'
   :'В этих ситуациях привычные реакции почти не '+(F?'отозвались':'отозвались')+'. Это тоже результат: возможно, они не про тебя, или проявляются в других обстоятельствах.';
  var wounds=(rec.topWounds||[]).filter(function(k){return WOUND_INFO[k]});
  var topName=wounds.length?WOUND_INFO[wounds[0]].name:'привычные реакции';
  var strongMore='';
  if(egoSeen.length&&selfSeen.length)strongMore='<p>В разных ситуациях у тебя включаются и привычные реакции, и живой выбор. Чаще всего знакомо: '+esc(topName)+'. Замечать это уже значит выбирать осознаннее.</p>';
  else if(egoSeen.length)strongMore='<p>В этих ситуациях чаще включается привычная реакция. Чаще всего знакомо: '+esc(topName)+'. Это не приговор — это то, что можно замечать и выбирать иначе.</p>';
  else if(selfSeen.length)strongMore='<p>В этих ситуациях ты чаще выбираешь по-своему. Это опора, на которую можно опираться и дальше.</p>';
  else strongMore='<p>Ни одна формулировка не отозвалась как «про меня». Это тоже результат: можно вернуться позже.</p>';
  var insightLine=egoSeen.length
   ?'Чаще всего тебе знакомо: '+(wounds.length?wounds.map(function(k){return WOUND_INFO[k].name}).join(' и '):'несколько разных привычных способов')+'.'
   :'';
  var insightMore=egoSeen.length?'<p>Эти способы когда-то помогали справляться. Сейчас полезно просто замечать, когда они включаются сами, и спрашивать себя: это еще нужно, или я могу выбрать иначе?</p>':'';
  wounds.forEach(function(k){insightMore+='<p><b>'+esc(WOUND_INFO[k].name.charAt(0).toUpperCase()+WOUND_INFO[k].name.slice(1))+':</b> '+esc(WOUND_INFO[k].note)+'</p>'});
  var chosenList=[];
  var nextStep=null;
  if(window.GFLOW){var ci=GFLOW.findIndex(function(x){return x.u==='slot.html?id=dialog'});if(ci>=0&&GFLOW[ci+1])nextStep=GFLOW[ci+1]}
  box.innerHTML='<div class="tri"><div class="tri-res-wrap" id="triRes"></div></div>';
  GResultCard.render(box.querySelector('#triRes'),{
   id:'dialog',stepKey:'slot.html?id=dialog',
   passed:(F?'Ты прошла':'Ты прошел')+' короткие ситуации о выборе',
   title:'Что тебе знакомо',
   lead:leadText,strong:strongLine,strongMore:strongMore,
   insight:insightLine,insightMore:insightMore,insightLabel:'На что обратить внимание',answers:chosenList,preview:preview,
   nextLabel:'Продолжить путь',
   onNext:function(){vib(20);if(preview||window.GReview){location.href='tasks.html';return}var u=GRoute.advance();if(u)location.href=u},
   onRetake:function(){idx=0;ans=[];showDeck();scrollTo(0,0)}
  });
  scrollTo(0,0);
 }
 if(P.dialog&&P.dialog.v===7&&P.dialog.answers&&!preview){showResult(P.dialog);return}
 showIntro();
}

window.GTri={mount:mount};
})();
