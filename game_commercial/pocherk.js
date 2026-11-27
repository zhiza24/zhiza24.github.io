/* Тест «Твоя стратегия выбора»: Туман (1-3) -> Мост (4-7) -> Костер (8-10) -> Заставка Старца (голос Б) -> Единая карточка результата.
   Черновик ответов: P.pocherkDraft {v,answers:[{q,stage,opt,dir,pos,v,t}]}.
   Итог: P.pocherk {v,answers,score:{act,obs,cre,sup},lead,leads,second,mixed,doneAt}.
   Совместимость: P.hand {s,n,str,z} и P.handTop. */
(function(){
'use strict';
var K='alch_v5_profile',V=window.POCHERK_VERSION,Q=window.POCHERK_Q,STG=window.POCHERK_STAGES,DIRS=window.POCHERK_DIRS,KEY=window.POCHERK_KEY,TX=window.POCHERK_TEXT;
var ORDER=['act','obs','cre','sup'],OLD={act:'s',obs:'n',cre:'str',sup:'z'},LET=['A','B','C','D'];
var F=(window.GGender?GGender():'m')==='f';
var $=function(id){return document.getElementById(id)};
var bgi=$('bgi'),fogl=$('fogl'),brg=$('brg'),glow=$('glow'),veil=$('veil'),cap=$('cap'),qz=$('qz'),qt=$('qt'),opts=$('opts'),cut=$('cut'),fin=$('fin'),nx=$('nx');
function load(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return {}}}
function save(P){localStorage.setItem(K,JSON.stringify(P))}
function vib(n){try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}}
function draft(P){var d=P.pocherkDraft;if(!d||d.v!==V||!Array.isArray(d.answers))d={v:V,answers:[],startedAt:Date.now()};return d}
function esc(v){return window.GEsc?GEsc(v):String(v==null?'':v).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

/* Предзагрузка картинок этапов и свитка, чтобы переходы шли без задержек и скачков */
['img/map_bg.jpg','img/chasm_top.webp?v=pc1','img/fire_camp.webp?v=pc1','img/scene_fire.jpg','img/scroll_open_top_f.png?v=h10','img/scroll_open_bot_f.png?v=h10'].forEach(function(src){var im=new Image();im.src=src});

/* ---------- scoring ---------- */
function score(ans){
 var s={act:0,obs:0,cre:0,sup:0};ans.forEach(function(a){if(s[a.dir]!=null)s[a.dir]++});
 var vals=ORDER.map(function(k){return s[k]}),max=Math.max.apply(null,vals);
 var leads=ORDER.filter(function(k){return s[k]===max}),mixed=leads.length>1;
 var rest=ORDER.filter(function(k){return s[k]<max}),m2=rest.length?Math.max.apply(null,rest.map(function(k){return s[k]})):0;
 var second=mixed||!rest.length||m2===0?[]:rest.filter(function(k){return s[k]===m2});
 return {score:s,lead:mixed?null:leads[0],leads:leads,second:second,mixed:mixed};
}
window.PocherkScore=score;

/* ---------- layout ---------- */
var IMG={fog:['img/map_bg.jpg',720/1280,.5,.4],bridge:['img/chasm_top.webp?v=pc1',756/1344,.5,.33],fire:['img/fire_camp.webp?v=pc1',756/1344,.45,.32]};
var box={x:0,y:0,w:0,h:0},cur='',panelH=0;
function topSafe(){return 96}
function visibleBand(){var H=innerHeight,qr=qz.getBoundingClientRect(),top=topSafe(),bot=Math.min(H,H-(panelH||qr.height)-88);return [top,Math.max(top+80,bot)]}
function layout(){
 var im=IMG[cur];if(!im)return;var W=innerWidth,H=innerHeight,r=im[1],w=Math.max(W,H*r),h=w/r;
 var band=visibleBand(),ty=(band[0]+band[1])/2,y=ty-im[3]*h;y=Math.min(0,Math.max(H-h-(cur==='fog'?0:H*.25),y));if(cur==='fog')y=Math.min(0,Math.max(H-h,y));
 var x=(W-w)/2;box={x:x,y:y,w:w,h:h};
 bgi.style.cssText='background-image:url('+im[0]+');left:'+x+'px;top:'+y+'px;width:'+w+'px;height:'+h+'px';
 if(cur==='bridge')placeBridge();
 if(cur==='fire'){glow.style.left=(x+.425*w)+'px';glow.style.top=(y+.385*h)+'px'}
}
function IX(fx){return box.x+fx*box.w}

/* ---------- bridge ---------- */
var hero,deck,built=0;
function buildBridge(){
 brg.innerHTML='<div class="deck" id="deck">'+[0,1,2,3].map(function(){return '<div class="sec"><div class="gh"></div><div class="bd"><i class="pk"></i><i class="pk"></i><i class="pk"></i><i class="pk"></i></div><i class="rope t"></i><i class="rope b"></i></div>'}).join('')+'</div><i class="post" id="p1"></i><i class="post" id="p2"></i><i class="post" id="p3"></i><i class="post" id="p4"></i>'+
  '<div class="tok hero" id="hero"><img alt="" src="'+(window.GHeroSrc?GHeroSrc('portrait'):'img/hero_m_portrait.webp')+'"></div>';
 deck=$('deck');hero=$('hero');
}
var L0=.24,L1=.77,BY=0;
function placeBridge(){
 if(!deck)return;var band=visibleBand();BY=band[0]+(band[1]-band[0])*.5;
 var l=IX(L0),r=IX(L1),dh=Math.max(40,Math.min(56,(r-l)*.2));deck.style.cssText='left:'+l+'px;width:'+(r-l)+'px;top:'+(BY-dh/2)+'px;--dh:'+dh+'px';
 [['p1',l,BY-dh/2],['p2',l,BY+dh/2],['p3',r,BY-dh/2],['p4',r,BY+dh/2]].forEach(function(p){var e=$(p[0]);e.style.left=p[1]+'px';e.style.top=p[2]+'px'});
 posTokens(false);
}
function heroX(k){var l=IX(L0),r=IX(L1),seg=(r-l)/4;if(k<=0)return IX(.17);if(k>=5)return IX(.85);return l+seg*(k-.5)}
function posTokens(walk){
 if(!hero)return;var k=built>=4&&crossed?5:built;
 var hx=heroX(k);
 hero.style.left=hx+'px';hero.style.top=(BY-(k>=5?22:0))+'px';
 if(walk){hero.classList.remove('walk');void hero.offsetWidth;hero.classList.add('walk')}
}
var crossed=false;
function setBuilt(n,anim){
 built=n;var s=deck.children;
 for(var i=0;i<4;i++){
  if(i<n){
   if(!anim||i<n-1){s[i].style.transition='none';s[i].querySelectorAll('.bd,.rope').forEach(function(e){e.style.transition='none'})}
   s[i].classList.add('on');
  }
 }
 if(!anim)requestAnimationFrame(function(){for(var i=0;i<4;i++){s[i].style.transition='';s[i].querySelectorAll('.bd,.rope').forEach(function(e){e.style.transition=''})}});
 setTimeout(function(){posTokens(anim)},anim?260:0);
}

/* ---------- fire sparks ---------- */
function sparks(){var sp=glow.querySelector('span');if(sp.children.length)return;var h='';for(var i=0;i<12;i++)h+='<i style="--x:'+((i%2?1:-1)*(8+i*5))+'px;animation-delay:'+(i*.2)+'s;animation-duration:'+(1.8+(i%4)*.4)+'s"></i>';sp.innerHTML=h}

/* ---------- stage control (без мигания будущих вопросов) ---------- */
function stageOf(i){return i<3?'fog':i<7?'bridge':'fire'}
var idx=0,P,D,locked=false,elderAu=null;
function setStage(s,cb){
 cur=s;document.body.className='st-'+s;
 var S=STG[s];
 cap.innerHTML=S.cap;cap.classList.add('on');
 measure(s);
 if(s==='bridge'&&!deck)buildBridge();
 if(s==='fire')sparks();
 layout();
 requestAnimationFrame(function(){veil.classList.add('off')});
 cb&&cb();
}
function fogLevel(){var a=D.answers.filter(function(x){return x.stage==='fog'}).length;fogl.style.setProperty('--fog',[.82,.56,.34,.14][a]||.14)}
/* Замер высоты вопросов без малейшей вспышки: transition:none + принудительный reflow до возврата visibility */
function measure(s){
 var qs=Q.filter(function(q){return q.st===s}),mx=0;
 qz.style.transition='none';
 qz.style.visibility='hidden';
 qz.classList.add('on');
 qz.style.minHeight='';
 qs.forEach(function(q){render(q);mx=Math.max(mx,qz.offsetHeight)});
 qz.classList.remove('on');
 opts.innerHTML='';qt.textContent='';
 panelH=mx;qz.style.minHeight=mx+'px';
 void qz.offsetHeight;
 qz.style.visibility='';
 qz.style.transition='';
}
function render(q){qt.textContent=q.q;opts.innerHTML=q.perm.map(function(k,pos){return '<button type="button" class="op" data-k="'+k+'" data-pos="'+pos+'">'+q.a[k]+'</button>'}).join('')}
function showScroll(s,then){
 var S=STG[s],answered=D.answers.some(function(a){return a.stage===s}),fired=false;
 function go(){if(fired)return;fired=true;then()}
 if(!window.Scroll){go();return}
 Scroll.show({id:'pocherk_'+s,noIcon:true,title:S.title,html:'<p class="pc-sub">'+S.sub+'</p>'+S.html,closeLabel:'Начать',everyTime:!answered,delay:140,fast:true,onClose:go});
 if(answered)go();
}
function ask(){
 if(idx>=Q.length){finish(true);return}
 var q=Q[idx],s=q.st;
 var list=Q.filter(function(x){return x.st===s});
 cap.innerHTML=STG[s].cap+'<small>'+(list.indexOf(q)+1)+' / '+list.length+'</small>';
 var wasOn=qz.classList.contains('on');
 qz.classList.add('swap');
 setTimeout(function(){
  render(q);qz.classList.remove('lock');qz.classList.add('on');
  requestAnimationFrame(function(){qz.classList.remove('swap')});
  locked=false;
  opts.querySelectorAll('.op').forEach(function(b){b.onclick=function(){pick(q,b)}});
 },wasOn?80:0);
}
function pick(q,b){
 if(locked)return;locked=true;var k=+b.dataset.k;b.classList.add('sel');qz.classList.add('lock');vib(25);
 P=load();D=draft(P);
 if(!D.answers.some(function(a){return a.q===q.id}))D.answers.push({q:q.id,stage:q.st,opt:LET[k],dir:KEY[k],pos:+b.dataset.pos+1,text:q.a[k],v:V,t:Date.now()});
 P.pocherkDraft=D;save(P);idx=D.answers.length;
 react(q,function(){
  if(idx>=Q.length){finish(true);return}
  var ns=stageOf(idx);if(ns!==q.st){transit(q.st,ns);return}
  ask();
 });
}
function react(q,cb){
 if(q.st==='fog'){fogLevel();setTimeout(cb,150);return}
 if(q.st==='bridge'){
  var n=q.id-3;setBuilt(n,true);
  if(n===2){var s=deck.children[1];s.classList.add('crack');setTimeout(function(){s.classList.remove('crack')},420)}
  if(n===4){setTimeout(function(){crossed=true;posTokens(true)},420);setTimeout(cb,900)}
  else setTimeout(cb,420);
  return;
 }
 if(q.st==='fire'){document.body.classList.add('flare');setTimeout(function(){document.body.classList.remove('flare')},420);setTimeout(cb,320)}
}
function transit(from,to){
 qz.classList.remove('on');cap.classList.remove('on');
 setTimeout(function(){
  veil.classList.remove('off');
  setTimeout(function(){setStage(to,function(){showScroll(to,ask)})},320);
 },120);
}

/* ---------- audio helper (голос Б, учитывает GSound) ---------- */
function stopAudio(){if(elderAu){try{elderAu.pause();elderAu.currentTime=0}catch(e){}elderAu=null}}
function soundEnabled(){return !window.GSound||GSound.isOn()}

/* ---------- elder cutscene + unified result card ---------- */
function names(arr,j){return arr.map(function(k){return DIRS[k]}).join(j)}
var CRYSTAL='<svg viewBox="0 0 46 56" aria-hidden="true"><defs><linearGradient id="cr1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a80"/><stop offset=".4" stop-color="#ff1a0a"/><stop offset="1" stop-color="#8a0000"/></linearGradient><linearGradient id="cr2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6a50"/><stop offset="1" stop-color="#a00c08"/></linearGradient></defs>'+
 '<polygon points="23,2 40,18 23,54 6,18" fill="url(#cr1)"/><polygon points="23,2 40,18 23,22" fill="#ff7a60" opacity=".7"/><polygon points="23,2 6,18 23,22" fill="#ff3a22" opacity=".8"/><polygon points="6,18 23,22 23,54" fill="url(#cr2)" opacity=".85"/><polygon points="40,18 23,22 23,54" fill="#d80c04" opacity=".85"/><polyline points="6,18 23,22 40,18" fill="none" stroke="#ffe0d6" stroke-width=".8" opacity=".8"/></svg>';

function finish(fresh){
 P=load();D=draft(P);var R;
 if(P.pocherk&&P.pocherk.doneAt&&(!D.answers.length||D.answers.length<Q.length)){R=P.pocherk}
 else{
  var r=score(D.answers);
  R={v:V,answers:D.answers,score:r.score,lead:r.lead,leads:r.leads,second:r.second,mixed:r.mixed,
     doneAt:(P.pocherk&&P.pocherk.doneAt&&P.pocherk.v===V&&JSON.stringify(P.pocherk.answers)===JSON.stringify(D.answers))?P.pocherk.doneAt:Date.now()};
  var first=!(P.pocherk&&P.pocherk.doneAt);
  P.pocherk=R;var h={};ORDER.forEach(function(k){h[OLD[k]]=r.score[k]});P.hand=h;P.handTop=OLD[r.leads[0]];
  if(window.GProfile){GProfile.writeResult(P,'pocherk',R,{answers:D.answers});GProfile.writeResult(P,'hand',{hand:h,handTop:P.handTop})}
  if(window.GArts)GArts.grant('crystal_1',{profile:P,source:'bridge.html'});else{P.arts=P.arts||[];if(P.arts.indexOf('crystal_1')<0)P.arts.push('crystal_1')}
  save(P);
  if(first&&window.GP){
   var p=GP();
   var txt=r.mixed?'смешанная стратегия: '+names(r.leads,', '):'ведущая стратегия: '+DIRS[r.lead]+(r.second.length?', дополнительная: '+names(r.second,', '):'');
   p.log.push({s:3,t:'Твоя стратегия выбора',r:txt+'. Артефакт: Кристалл опоры',d:new Date().toLocaleDateString('ru')});
   SP(p);
  }
 }
 if(fresh)showElderCutscene(R);
 else showBreakdown(R,false);
}

/* Экран А: отдельная заставка со Старцем и озвучкой голосом Б */
function showElderCutscene(R){
 var E=window.POCHERK_ELDER||{};
 qz.classList.remove('on');cap.classList.remove('on');
 cut.innerHTML='<div class="cut-bg"></div><div class="cut-fg"></div>'+
  '<div class="cut-card">'+
   '<div class="cut-head"><span class="cut-role">Старец у костра</span>'+
    '<button type="button" class="cut-au" id="cutAu" aria-label="Озвучка Старца">♪ Слушать</button>'+
   '</div>'+
   '<p class="cut-txt">'+esc(E.text||'')+'</p>'+
   '<button type="button" class="cut-go" id="cutGo">Увидеть стратегию</button>'+
  '</div>';
 cut.hidden=false;document.body.classList.add('fin-on');
 requestAnimationFrame(function(){cut.classList.add('on');veil.classList.add('off')});

 var auBtn=$('cutAu');
 function updateBtn(playing){if(auBtn){auBtn.textContent=playing?'❚❚ Пауза':'♪ Слушать';auBtn.classList.toggle('on',!!playing)}}
 if(E.audio){
  elderAu=new Audio(E.audio);
  elderAu.onended=function(){updateBtn(false)};
  elderAu.onpause=function(){updateBtn(false)};
  elderAu.onplay=function(){updateBtn(true)};
  if(soundEnabled()){elderAu.play().catch(function(){updateBtn(false)})}
  auBtn.onclick=function(){
   if(!elderAu)return;
   if(elderAu.paused){elderAu.play().catch(function(){})}else{elderAu.pause()}
  };
 }else if(auBtn){auBtn.hidden=true}

 $('cutGo').onclick=function(){
  vib(20);stopAudio();
  cut.classList.remove('on');
  setTimeout(function(){cut.hidden=true;showBreakdown(R,true)},240);
 };
 vib([35,25,65]);
}

/* Экран Б: единый чистый экран расшифровки стратегии выбора (эталон sum.html) */
function stripPrefix(s,re){return String(s||'').replace(re,'').trim()}
function showBreakdown(R,fresh){
 var leadKey=R.mixed?R.leads[0]:R.lead;
 var mainArr=(TX[leadKey]||{})[F?'F':'M']||[];
 var strongLine=stripPrefix(mainArr[1]||'',/^Твоя сила\s*[—–-]\s*/i);
 var attnLine=stripPrefix(mainArr[2]||'',/^На что стоит обратить внимание:\s*/i);

 var total=(R.answers||[]).length;
 var tally=ORDER.map(function(k){return DIRS[k]+' — '+(R.score[k]||0)}).join('; ');
 var leadTitle=R.mixed
  ? 'В ответах несколько способов набрали одинаковое число выборов: '+names(R.leads,' и ')+'.'
  : 'В этих игровых ситуациях чаще встречался ход «'+DIRS[R.lead]+'».';
 leadTitle+=' Учтено ответов: '+total+' из '+Q.length+'. Распределение: '+tally+'. Это описание выбора в игровых сценах, а не постоянная характеристика личности.';

 var strongMore='';
 if(R.mixed){
  var mx=(TX.mixed||{})[F?'F':'M']||[];
  strongMore+=mx.map(function(p){return '<p>'+esc(p)+'</p>'}).join('');
  R.leads.forEach(function(k){
   var arr=(TX[k]||{})[F?'F':'M']||[];
   strongMore+='<p><b>'+esc(DIRS[k])+':</b> '+esc(arr[0]||'')+'</p>'+(arr[1]?'<p>'+esc(arr[1])+'</p>':'');
  });
 }else{
  if(mainArr[0])strongMore+='<p>'+esc(mainArr[0])+'</p>';
  if(mainArr[1])strongMore+='<p>'+esc(mainArr[1])+'</p>';
  (R.second||[]).forEach(function(k){
   var arr=(TX[k]||{})[F?'F':'M']||[];
   strongMore+='<p><b>Дополнительная стратегия — '+esc(DIRS[k])+':</b> '+esc(arr[0]||'')+'</p>';
  });
 }

 var insightMore='<p>'+esc(attnLine)+'</p>';
 if(!R.mixed&&R.second&&R.second.length){
  R.second.forEach(function(k){
   var arr=(TX[k]||{})[F?'F':'M']||[];
   if(arr[2])insightMore+='<p><b>'+esc(DIRS[k])+':</b> '+esc(stripPrefix(arr[2],/^На что стоит обратить внимание:\s*/i))+'</p>';
  });
 }
 if(window.POCHERK_CARD&&POCHERK_CARD.note)insightMore+='<p>'+esc(POCHERK_CARD.note)+'</p>';

 var stageRu={fog:'Туман',bridge:'Мост',fire:'Костер'};
 var ansList=(R.answers||[]).map(function(a){
  var txt=a.text;
  if(!txt){var qObj=Q.filter(function(x){return x.id===a.q})[0];var kIdx=LET.indexOf(a.opt);if(qObj&&kIdx>=0)txt=qObj.a[kIdx]}
  return (stageRu[a.stage]||'')+': '+(txt||DIRS[a.dir]||a.opt);
 });

 fin.innerHTML='<div class="fin-wrap" id="finCard"></div>';
 qz.classList.remove('on');cap.classList.remove('on');fin.hidden=false;document.body.classList.add('fin-on');
 if(nx)nx.hidden=true;

 GResultCard.render($('finCard'),{
  id:'strategy',
  stepKey:'bridge.html',
  passed:(F?'Ты прошла':'Ты прошел')+' туман, мост и костер',
  title:'Твоя стратегия выбора',
  lead:leadTitle,
  strong:R.mixed
   ? 'В этом прохождении несколько способов получили одинаковый результат. Возможно, выбор зависит от контекста; сами по себе равные баллы еще не доказывают устойчивую гибкость.'
   : (strongLine.charAt(0).toUpperCase()+strongLine.slice(1)),
  strongMore:strongMore,
  insight:attnLine.split('. ')[0]+'.',
  insightMore:insightMore,
  answers:ansList,
  artifact:{name:'Кристалл опоры',note:'Хранится у твоего героя',icon:CRYSTAL},
  preview:new URLSearchParams(location.search).get('preview')==='1',
  nextLabel:'Дальше',
  onNext:function(){vib(20);stopAudio();location.href=window.GReview?'tasks.html':GRoute.advance()}
 });

 requestAnimationFrame(function(){fin.classList.add('on');veil.classList.add('off')});
 if(fresh)vib(25);
}

/* ---------- start / resume ---------- */
function start(){
 P=load();D=draft(P);idx=D.answers.length;
 if(P.pocherk&&P.pocherk.doneAt&&idx===0){finish(false);return}
 if(idx>=Q.length){finish(false);return}
 var s=stageOf(idx);
 setStage(s,function(){
  if(s==='fog')fogLevel();
  if(s==='bridge'){var n=D.answers.filter(function(a){return a.stage==='bridge'}).length;setBuilt(n,false)}
  showScroll(s,function(){setTimeout(ask,80)});
 });
}
window.addEventListener('pagehide',stopAudio);
addEventListener('resize',function(){if(cur){layout()}});
start();
})();
