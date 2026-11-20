/* Шаг «Кто сейчас выбирает?»:
   1) Короткая заставка Старца (голос Б, помещается без скролла, без терминов Эго/Самость).
   2) Экран с героем, темной и светлой фигурами + 16 коротких фраз вперемешку (темные и светлые).
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
 {id:'d1',side:'ego',word:'Я должен',wound:'injustice',t:'Сначала доделаю, потом отдохну.'},
 {id:'l1',side:'self',pillar:'Право на отдых',t:'Я могу устать и остановиться без вины.'},
 {id:'d2',side:'ego',word:'Я не могу просить',wound:'rejection',t:'Не буду просить, {сам справлюсь|сама справлюсь}.'},
 {id:'d3',side:'ego',word:'Мне стыдно отказать',wound:'humiliation',t:'Соглашусь, неудобно отказывать.'},
 {id:'l2',side:'self',pillar:'Ясные границы',t:'Если мне не подходит, я спокойно говорю «нет».'},
 {id:'d4',side:'ego',word:'Мне нужно контролировать',wound:'betrayal',t:'Лучше перепроверю {сам|сама}, так спокойнее.'},
 {id:'d5',side:'ego',word:'Меня не ждут',wound:'rejection',t:'Не пойду, меня там особо не ждут.'},
 {id:'l3',side:'self',pillar:'Свобода от чужих оценок',t:'Я не {должен|должна} угадывать, что думают другие.'},
 {id:'d6',side:'ego',word:'А что обо мне подумают',wound:'injustice',t:'А что обо мне подумают, если не выйдет?'},
 {id:'d7',side:'ego',word:'Я попробую',wound:'abandonment',t:'Начну с понедельника, попробую, как пойдет.'},
 {id:'l4',side:'self',pillar:'Соразмерный шаг',t:'Не обязательно менять все сразу — хватит одного шага.'},
 {id:'d8',side:'ego',word:'У меня нет выбора',wound:'humiliation',t:'У меня сейчас нет другого выхода.'},
 {id:'l5',side:'self',pillar:'Контакт со своими желаниями',t:'Мне важно сначала понять, чего хочу именно я.'},
 {id:'d9',side:'ego',word:'Я виноват',wound:'abandonment',t:'Если человек молчит, значит я {виноват|виновата}.'},
 {id:'d10',side:'ego',word:'Они все портят',wound:'betrayal',t:'Они опять все испортили, приходится тащить {самому|самой}.'},
 {id:'l6',side:'self',pillar:'Живое доверие',t:'Я могу попросить о помощи, и это не слабость.'}
];

var WOUND_INFO={
 injustice:{name:'высокая планка и страх ошибки',note:'Внутри часто звучит строгое «надо» и оглядка на чужую оценку — усталость откладывается на потом.'},
 rejection:{name:'привычка отступать раньше, чем откажут',note:'Проще справляться в одиночку и не навязываться, чем рискнуть услышать «нет» или остаться лишним.'},
 humiliation:{name:'неудобно отказать и страшно выбрать себя',note:'Чужой комфорт перевешивает собственный, и кажется, что выхода нет.'},
 betrayal:{name:'напряжение контроля и недоверие',note:'Кажется, что если отпустить хватку, другие подведут и все равно придется разгребать самому.'},
 abandonment:{name:'страх остаться без опоры и чувство вины',note:'Тишину другого легко принять на свой счет, а важные шаги откладывать в ожидании поддержки.'}
};

function css(){
 if(document.getElementById('tri-css'))return;
 var s=document.createElement('style');s.id='tri-css';
 s.textContent=
  'body.tri-on,body.tri-on .wrap{background:#0d0905!important}'+
  '.tri{margin:-8px -16px 0;position:relative;color:#f4ecdf;font-family:Manrope,sans-serif}'+
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
  /* Сцена треугольника */
  '.tri-img{position:relative;width:100%;height:clamp(250px,calc(100svh - 330px),520px);background:#0d0905 center 14%/cover no-repeat;overflow:hidden}'+
  '.tri-img i{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .28s ease}'+
  /* Темная сторона — настоящая тень и затемнение (никакого яркого света!) */
  '.tri-img .shDark{background:radial-gradient(ellipse 85% 75% at 24% 48%,rgba(2,1,0,.25),rgba(2,1,0,.88) 72%),linear-gradient(90deg,rgba(4,2,1,.88) 0%,rgba(4,2,1,.68) 52%,rgba(4,2,1,.86) 100%)}'+
  '.tri-img .shSmoke{background:radial-gradient(circle at 26% 42%,rgba(32,20,16,.75),rgba(4,2,1,.85) 68%)}'+
  /* Светлая сторона — мягкое золотое свечение справа и вокруг героя */
  '.tri-img .glLight{background:radial-gradient(ellipse 68% 62% at 74% 48%,rgba(255,226,148,.66),rgba(255,204,110,.24) 52%,transparent 76%);mix-blend-mode:screen}'+
  '.tri-img .glHero{background:radial-gradient(ellipse 60% 48% at 50% 34%,rgba(255,232,168,.55),transparent 72%);mix-blend-mode:screen}'+
  '.tri-img .dimLeft{background:linear-gradient(90deg,rgba(6,4,2,.72),transparent 54%)}'+
  /* Плашка раскрытия стороны поверх сцены */
  '.tri-rev{position:absolute;left:50%;top:14px;transform:translate(-50%,-6px);z-index:4;padding:6px 16px;border-radius:999px;font:800 13px Manrope,sans-serif;letter-spacing:.09em;text-transform:uppercase;opacity:0;transition:opacity .2s ease,transform .2s ease;pointer-events:none;white-space:nowrap}'+
  '.tri-rev.on{opacity:1;transform:translate(-50%,0)}'+
  '.tri-rev.dark{background:rgba(16,10,8,.92);color:#d7c6b2;border:1px solid rgba(170,145,120,.55);box-shadow:0 6px 20px rgba(0,0,0,.75)}'+
  '.tri-rev.light{background:linear-gradient(180deg,#fff2c2,#e5b755);color:#2c1808;border:1px solid #fff5d4;box-shadow:0 0 22px rgba(255,212,110,.75)}'+
  /* Нижняя панель карточек */
  '.tri-p{position:relative;margin-top:-18%;padding:18px 16px 20px;background:linear-gradient(rgba(13,9,5,0),rgba(13,9,5,.86) 18%,#0d0905 40%)}'+
  '.tri-meta{display:flex;justify-content:space-between;align-items:center;margin:0 0 8px;font:700 12.5px Manrope,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#d6b272}'+
  '.tri-card{position:relative;margin:4px 0 12px;padding:20px 16px;border-radius:18px;background:linear-gradient(#f6e6bf,#e2c78e);color:#2c1808;font:700 19.5px/1.38 Manrope,sans-serif;text-align:center;touch-action:none;user-select:none;-webkit-user-select:none;transition:transform .24s ease,opacity .24s ease,background .24s ease,color .24s ease,box-shadow .24s ease;box-shadow:0 8px 24px rgba(0,0,0,.55);min-height:92px;display:flex;flex-direction:column;align-items:center;justify-content:center}'+
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
    '<div class="tri-cut-head"><span class="tri-cut-role">Старец</span>'+
     '<button type="button" class="tri-cut-au" id="triAu" aria-label="Озвучка Старца">♪ Слушать</button>'+
    '</div>'+
    '<p class="tri-cut-txt">В каждом из нас есть светлая и темная стороны. В разных ситуациях выбирает то одна, то другая. Давай посмотрим, кто чаще выбирает в тебе.</p>'+
    '<button type="button" class="tri-cut-go" id="triGo">Начать</button>'+
   '</div></div></div>';
  var auBtn=box.querySelector('#triAu');
  function upBtn(pl){if(auBtn){auBtn.textContent=pl?'❚❚ Пауза':'♪ Слушать';auBtn.classList.toggle('on',!!pl)}}
  elderAu=new Audio('media/elder_sides.mp3');
  elderAu.onended=function(){upBtn(false)};
  elderAu.onpause=function(){upBtn(false)};
  elderAu.onplay=function(){upBtn(true)};
  if(soundEnabled()){elderAu.play().catch(function(){upBtn(false)})}
  auBtn.onclick=function(){if(!elderAu)return;if(elderAu.paused)elderAu.play().catch(function(){});else elderAu.pause()};
  box.querySelector('#triGo').onclick=function(){vib(20);stopAudio();idx=0;ans=[];showDeck()};
  scrollTo(0,0);
 }

 /* ---------- 2. Экран свайпа карточек ---------- */
 var imgEl,panEl,revEl;
 function showDeck(){
  step='deck';
  box.innerHTML='<div class="tri">'+
   '<div class="tri-img" id="triImg" style="background-image:url('+pic+')">'+
    '<i class="shDark"></i><i class="shSmoke"></i><i class="glLight"></i><i class="glHero"></i><i class="dimLeft"></i>'+
    '<div class="tri-rev" id="triRev"></div>'+
   '</div>'+
   '<div class="tri-p" id="triPan"></div>'+
  '</div>';
  imgEl=box.querySelector('#triImg');panEl=box.querySelector('#triPan');revEl=box.querySelector('#triRev');
  drawCard();
 }
 function setFx(mode){
  if(!imgEl)return;
  var op=function(c,v){var e=imgEl.querySelector('.'+c);if(e)e.style.opacity=v};
  op('shDark',mode==='dark'?0.92:mode==='dark-soft'?0.52:0);
  op('shSmoke',mode==='dark'?0.8:0);
  op('glLight',mode==='light'?0.95:mode==='light-soft'?0.55:0);
  op('glHero',mode==='light'?0.85:0);
  op('dimLeft',mode==='light'?0.7:0);
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
   b.onclick=function(){choose(b.dataset.pick,card,item,txt)};
  });

  var sx=0,sy=0,dx=0,dy=0,drag=false;
  card.onpointerdown=function(e){
   if(locked)return;drag=true;sx=e.clientX;sy=e.clientY;dx=0;dy=0;
   card.style.transition='none';
   try{card.setPointerCapture(e.pointerId)}catch(err){}
  };
  card.onpointermove=function(e){
   if(!drag||locked)return;
   dx=e.clientX-sx;dy=e.clientY-sy;
   card.style.transform='translate('+dx+'px,'+(dy*.22)+'px) rotate('+(dx*.045)+'deg)';
  };
  function endDrag(){
   if(!drag)return;drag=false;
   card.style.transition='';
   if(dx>58)choose('yes',card,item,txt);
   else if(dx<-58)choose('no',card,item,txt);
   else if(dy>70)choose('mid',card,item,txt);
   else card.style.transform='';
  }
  card.onpointerup=endDrag;card.onpointercancel=endDrag;
 }

 function choose(pick,card,item,txt){
  if(locked)return;locked=true;
  var ms=Date.now()-t0;
  ans.push({id:item.id,text:txt,side:item.side,pick:pick,word:item.word||'',wound:item.wound||'',pillar:item.pillar||'',ms:ms});
  vib(pick==='yes'?26:16);

  if(pick==='yes'||pick==='mid'){
   var isDark=item.side==='ego';
   var soft=pick==='mid';
   setFx(isDark?(soft?'dark-soft':'dark'):(soft?'light-soft':'light'));
   card.classList.add(isDark?'fl-dark':'fl-light');
   card.innerHTML=esc(txt)+'<small>'+(isDark?'Темная сторона':'Светлая сторона')+'</small>';
   card.style.transform=pick==='yes'?'translate(24px,0) scale(1.02)':'scale(.98)';
   if(revEl){
    revEl.textContent=isDark?'Темная сторона':'Светлая сторона';
    revEl.className='tri-rev on '+(isDark?'dark':'light');
   }
   setTimeout(function(){
    card.style.opacity='0';
    card.style.transform=pick==='yes'?'translate(140px,0) rotate(8deg)':'translate(0,40px)';
    setTimeout(function(){idx++;drawCard()},180);
   },580);
  }else{
   card.style.transform='translate(-160px,0) rotate(-10deg)';
   card.style.opacity='0';
   setTimeout(function(){idx++;drawCard()},220);
  }
 }

 /* ---------- 3. Сохранение и единый экран результата ---------- */
 function finish(){
  var darkYes=ans.filter(function(a){return a.side==='ego'&&a.pick==='yes'});
  var darkMid=ans.filter(function(a){return a.side==='ego'&&a.pick==='mid'});
  var lightYes=ans.filter(function(a){return a.side==='self'&&a.pick==='yes'});
  var lightMid=ans.filter(function(a){return a.side==='self'&&a.pick==='mid'});

  var wCnt={};
  darkYes.forEach(function(a){if(a.wound)wCnt[a.wound]=(wCnt[a.wound]||0)+2});
  darkMid.forEach(function(a){if(a.wound)wCnt[a.wound]=(wCnt[a.wound]||0)+1});
  var topWounds=Object.keys(wCnt).sort(function(a,b){return wCnt[b]-wCnt[a]}).slice(0,2);

  var rec={
   v:5,
   egoCount:darkYes.length,
   selfCount:lightYes.length,
   doubtCount:darkMid.length+lightMid.length,
   topWounds:topWounds,
   answers:ans,
   doneAt:Date.now()
  };

  if(!preview){
   var P2=load();
   P2.dialog=rec;
   (P2.log=P2.log||[]).push({t:Date.now(),x:'Кто сейчас выбирает: темная сторона — '+darkYes.length+', светлая — '+lightYes.length});
   save(P2);
  }
  showResult(rec);
 }

 function showResult(rec){
  var F=load().gender==='f';
  var all=rec.answers||[];
  var darkYes=all.filter(function(a){return a.side==='ego'&&a.pick==='yes'});
  var darkMid=all.filter(function(a){return a.side==='ego'&&a.pick==='mid'});
  var lightYes=all.filter(function(a){return a.side==='self'&&a.pick==='yes'});
  var lightMid=all.filter(function(a){return a.side==='self'&&a.pick==='mid'});

  var leadText='';
  if(darkYes.length>=lightYes.length+2){
   leadText='Сейчас чаще включается темная сторона — привычные защиты Эго (откликнулось '+ph(darkYes.length,'фраза','фразы','фраз')+' из 10).';
  }else if(lightYes.length>darkYes.length&&darkYes.length<=3){
   leadText='В твоих ответах хорошо слышна светлая сторона — голос Самости (откликнулось '+ph(lightYes.length,'опора','опоры','опор')+' из 6).';
  }else{
   leadText='В тебе звучат обе стороны: темная — '+darkYes.length+' из 10, светлая — '+lightYes.length+' из 6.';
  }

  var pillars=lightYes.map(function(a){return a.pillar}).filter(Boolean);
  var strongLine=pillars.length
   ? 'Твоя светлая сторона (Самость) уже опирается на: '+pillars.join(', ').toLowerCase()+'.'
   : 'Даже если сейчас чаще срабатывает защита, ты честно '+(F?'заметила':'заметил')+' свои привычные фразы — с этого начинается выход из автопилота.';
  var strongMore='<p>То, что в этом шаге называлось <b>светлой стороной</b>, — это голос <b>Самости</b>: спокойный, трезвый выбор из уважения к себе, без вины и давления.</p>';
  if(lightYes.length){
   strongMore+='<p><b>Фразы светлой стороны, которые уже про тебя:</b></p><ul>'+lightYes.map(function(a){return '<li>'+esc(a.text)+'</li>'}).join('')+'</ul>';
  }

  var wounds=(rec.topWounds||[]).filter(function(k){return WOUND_INFO[k]});
  var insightLine='';
  if(wounds.length){
   insightLine='Темная сторона (Эго) чаще всего включается через '+wounds.map(function(k){return WOUND_INFO[k].name}).join(' и ')+'.';
  }else if(darkYes.length||darkMid.length){
   insightLine='Защитные фразы проскальзывают лишь время от времени — важно просто замечать момент, когда внутри появляется «надо» или вина.';
  }else{
   insightLine='Ни одна защитная фраза не отозвалась как постоянная. Если захочется, можно вернуться к этому шагу в обычный загруженный день и свериться снова.';
  }

  var insightMore='<p>То, что в этом шаге проявлялось как <b>темная сторона</b>, — это голос <b>Эго</b>: старые защитные привычки, которые когда-то помогали справляться, но сейчас забирают силы и свободу выбора.</p>';
  wounds.forEach(function(k){
   insightMore+='<p><b>'+esc(WOUND_INFO[k].name.charAt(0).toUpperCase()+WOUND_INFO[k].name.slice(1))+':</b> '+esc(WOUND_INFO[k].note)+'</p>';
  });
  var fastDark=darkYes.slice().sort(function(a,b){return (a.ms||9999)-(b.ms||9999)})[0];
  if(fastDark&&fastDark.ms&&fastDark.ms<3500){
   insightMore+='<p>Быстрее всего откликнулась фраза «'+esc(fastDark.text)+'» — похоже, этот ход срабатывает почти автоматически.</p>';
  }

  var chosenList=all.filter(function(a){return a.pick==='yes'||a.pick==='mid'}).map(function(a){
   return (a.side==='ego'?'Темная сторона':'Светлая сторона')+(a.pick==='mid'?' (иногда)':'')+': «'+a.text+'»';
  });

  var nextStep=null;
  if(window.GFLOW){var ci=GFLOW.findIndex(function(x){return x.u==='slot.html?id=dialog'});if(ci>=0&&GFLOW[ci+1])nextStep=GFLOW[ci+1]}

  box.innerHTML='<div class="tri"><div class="tri-res-wrap" id="triRes"></div></div>';
  GResultCard.render(box.querySelector('#triRes'),{
   id:'dialog',
   stepKey:'slot.html?id=dialog',
   passed:(F?'Ты прошла':'Ты прошел')+' шаг «Кто сейчас выбирает»',
   title:'Темная и светлая стороны',
   lead:leadText,
   strong:strongLine,
   strongMore:strongMore,
   insight:insightLine,
   insightMore:insightMore,
   answers:chosenList,
   preview:preview,
   nextLabel:nextStep?'Дальше: '+nextStep.t:'Дальше',
   onNext:function(){
    vib(20);
    if(preview||window.GReview){location.href='tasks.html';return}
    var u=GRoute.advance();if(u)location.href=u;
   },
   onRetake:function(){idx=0;ans=[];showDeck();scrollTo(0,0)}
  });
  scrollTo(0,0);
 }

 if(P.dialog&&P.dialog.v===5&&P.dialog.answers&&!preview){showResult(P.dialog);return}
 showIntro();
}

window.GTri={mount:mount};
})();
