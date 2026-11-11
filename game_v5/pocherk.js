/* Тест «Почерк героя»: Туман (1-3) → Мост (4-7) → Костер (8-10) → карточка.
   Черновик ответов: P.pocherkDraft {v,answers:[{q,stage,opt,dir,pos,v,t}]}.
   Итог: P.pocherk {v,answers,score:{act,obs,cre,sup},lead,leads,second,mixed,doneAt}.
   Совместимость: P.hand {s,n,str,z} и P.handTop. */
(function(){
'use strict';
var K='alch_v5_profile',V=window.POCHERK_VERSION,Q=window.POCHERK_Q,STG=window.POCHERK_STAGES,DIRS=window.POCHERK_DIRS,KEY=window.POCHERK_KEY,TX=window.POCHERK_TEXT;
var ORDER=['act','obs','cre','sup'],OLD={act:'s',obs:'n',cre:'str',sup:'z'},LET=['A','B','C','D'];
var F=(window.GGender?GGender():'m')==='f';
var $=function(id){return document.getElementById(id)};
var stg=$('stg'),bgi=$('bgi'),fogl=$('fogl'),brg=$('brg'),glow=$('glow'),veil=$('veil'),cap=$('cap'),qz=$('qz'),qt=$('qt'),opts=$('opts'),fin=$('fin'),nx=$('nx');
function load(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return {}}}
function save(P){localStorage.setItem(K,JSON.stringify(P))}
function vib(n){try{navigator.vibrate&&navigator.vibrate(n)}catch(e){}}
function draft(P){var d=P.pocherkDraft;if(!d||d.v!==V||!Array.isArray(d.answers))d={v:V,answers:[],startedAt:Date.now()};return d}

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

/* ---------- layout: background as a cover box with a focus point ---------- */
var IMG={fog:['img/map_bg.jpg',720/1280,.5,.4],bridge:['img/chasm_top.webp?v=pc1',756/1344,.5,.33],fire:['img/fire_camp.webp?v=pc1',756/1344,.45,.32]};
var box={x:0,y:0,w:0,h:0},cur='',panelH=0;
function topSafe(){return 100}
function visibleBand(){var H=innerHeight,qr=qz.getBoundingClientRect(),top=topSafe(),bot=Math.min(H,H-(panelH||qr.height)-90);return [top,Math.max(top+80,bot)]}
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
  '<div class="tok hero" id="hero"><img alt="" src="'+(window.GHeroSrc?GHeroSrc('portrait'):'img/hero_m_portrait.jpg')+'"></div>';
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
function setBuilt(n,anim){built=n;var s=deck.children;for(var i=0;i<4;i++){if(i<n){if(!anim||i<n-1){s[i].style.transition='none';s[i].querySelectorAll('.bd,.rope').forEach(function(e){e.style.transition='none'})}s[i].classList.add('on')}}
 if(!anim)requestAnimationFrame(function(){for(var i=0;i<4;i++){s[i].style.transition='';s[i].querySelectorAll('.bd,.rope').forEach(function(e){e.style.transition=''})}});
 setTimeout(function(){posTokens(anim)},anim?550:0)}

/* ---------- fire sparks ---------- */
function sparks(){var sp=glow.querySelector('span');if(sp.children.length)return;var h='';for(var i=0;i<12;i++)h+='<i style="--x:'+((i%2?1:-1)*(8+i*5))+'px;animation-delay:'+(i*.2)+'s;animation-duration:'+(1.8+(i%4)*.4)+'s"></i>';sp.innerHTML=h}

/* ---------- stage control ---------- */
function stageOf(i){return i<3?'fog':i<7?'bridge':'fire'}
var idx=0,P,D,locked=false,stageStarted={};
function setStage(s,cb){
 cur=s;document.body.className='st-'+s;
 var S=STG[s],n=Q.filter(function(q){return q.st===s}).length;
 cap.innerHTML=S.cap;cap.classList.add('on');
 measure(s);
 if(s==='bridge'&&!deck)buildBridge();
 if(s==='fire')sparks();
 layout();
 setTimeout(function(){veil.classList.add('off')},60);
 cb&&cb();
}
function fogLevel(){var a=D.answers.filter(function(x){return x.stage==='fog'}).length;fogl.style.setProperty('--fog',[.85,.6,.38,.16][a]||.16)}
function measure(s){var qs=Q.filter(function(q){return q.st===s}),mx=0;qz.style.visibility='hidden';qz.classList.add('on');qz.style.minHeight='';
 qs.forEach(function(q){render(q);mx=Math.max(mx,qz.offsetHeight)});qz.classList.remove('on');qz.style.visibility='';panelH=mx;qz.style.minHeight=mx+'px';opts.innerHTML='';qt.textContent=''}
function render(q){qt.textContent=q.q;opts.innerHTML=q.perm.map(function(k,pos){return '<button type="button" class="op" data-k="'+k+'" data-pos="'+pos+'">'+q.a[k]+'</button>'}).join('')}
function showScroll(s,then){
 var S=STG[s],answered=D.answers.some(function(a){return a.stage===s}),fired=false;
 function go(){if(fired)return;fired=true;then()}
 if(!window.Scroll){go();return}
 Scroll.show({id:'pocherk_'+s,title:S.title,html:'<p class="pc-sub">'+S.sub+'</p>'+S.html,closeLabel:'Начать',everyTime:!answered,delay:700,onClose:go});
 if(answered)go();
}
function ask(){
 if(idx>=Q.length){finish(true);return}
 var q=Q[idx],s=q.st;
 cap.innerHTML=STG[s].cap+'<small>'+(Q.filter(function(x){return x.st===s}).indexOf(q)+1)+' / '+Q.filter(function(x){return x.st===s}).length+'</small>';
 qz.classList.add('swap');
 setTimeout(function(){render(q);qz.classList.remove('lock');qz.classList.add('on');requestAnimationFrame(function(){qz.classList.remove('swap')});locked=false;
  opts.querySelectorAll('.op').forEach(function(b){b.onclick=function(){pick(q,b)}})},qz.classList.contains('on')?260:0);
}
function pick(q,b){
 if(locked)return;locked=true;var k=+b.dataset.k;b.classList.add('sel');qz.classList.add('lock');vib(30);
 P=load();D=draft(P);
 if(!D.answers.some(function(a){return a.q===q.id}))D.answers.push({q:q.id,stage:q.st,opt:LET[k],dir:KEY[k],pos:+b.dataset.pos+1,v:V,t:Date.now()});
 P.pocherkDraft=D;save(P);idx=D.answers.length;
 react(q,function(){
  if(idx>=Q.length){finish(true);return}
  var ns=stageOf(idx);if(ns!==q.st){transit(q.st,ns);return}
  ask();
 });
}
function react(q,cb){
 if(q.st==='fog'){fogLevel();setTimeout(cb,700);return}
 if(q.st==='bridge'){var n=q.id-3;setBuilt(n,true);if(n===2){var s=deck.children[1];s.classList.add('crack');setTimeout(function(){s.classList.remove('crack')},600)}
  if(n===4){setTimeout(function(){crossed=true;posTokens(true)},1500);setTimeout(cb,2900)}else setTimeout(cb,1400);return}
 if(q.st==='fire'){document.body.classList.add('flare');setTimeout(function(){document.body.classList.remove('flare')},900);setTimeout(cb,800)}
}
function transit(from,to){
 qz.classList.remove('on');cap.classList.remove('on');
 setTimeout(function(){veil.classList.remove('off');setTimeout(function(){setStage(to,function(){showScroll(to,ask)})},850)},300);
}

/* ---------- final card ---------- */
function esc(v){return window.GEsc?GEsc(v):String(v)}
function names(arr,j){return arr.map(function(k){return DIRS[k]}).join(j)}
function paras(k){var t=(TX[k]||{})[F?'F':'M']||[];return t.filter(function(x){return x&&String(x).trim()}).map(function(x){
 x=esc(x).replace(/^(Твоя сила)( —)/,'<b>$1</b>$2').replace(/^(На что стоит обратить внимание:)/,'<b>$1</b>');return '<p>'+x+'</p>'}).join('')}
function dirBlock(k,kind,open){var body=paras(k);var head='<h3>'+DIRS[k].toUpperCase()+'</h3>';
 if(kind==='second')return '<details'+(open?' open':'')+'><summary>Дополнительный почерк<b>'+DIRS[k].toUpperCase()+'</b></summary>'+body+'</details>';
 return (kind?'<span class="kind">'+kind+'</span>':'')+head+body}
var CRYSTAL='<svg viewBox="0 0 46 56" aria-hidden="true"><defs><linearGradient id="cr1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9a80"/><stop offset=".4" stop-color="#ff1a0a"/><stop offset="1" stop-color="#8a0000"/></linearGradient><linearGradient id="cr2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6a50"/><stop offset="1" stop-color="#a00c08"/></linearGradient></defs>'+
 '<polygon points="23,2 40,18 23,54 6,18" fill="url(#cr1)"/><polygon points="23,2 40,18 23,22" fill="#ff7a60" opacity=".7"/><polygon points="23,2 6,18 23,22" fill="#ff3a22" opacity=".8"/><polygon points="6,18 23,22 23,54" fill="url(#cr2)" opacity=".85"/><polygon points="40,18 23,22 23,54" fill="#d80c04" opacity=".85"/><polyline points="6,18 23,22 40,18" fill="none" stroke="#ffe0d6" stroke-width=".8" opacity=".8"/></svg>';
function finish(fresh){
 P=load();D=draft(P);var R;
 if(P.pocherk&&P.pocherk.doneAt&&(!D.answers.length||D.answers.length<Q.length)){R=P.pocherk}
 else{
  var r=score(D.answers);R={v:V,answers:D.answers,score:r.score,lead:r.lead,leads:r.leads,second:r.second,mixed:r.mixed,doneAt:(P.pocherk&&P.pocherk.doneAt&&P.pocherk.v===V&&JSON.stringify(P.pocherk.answers)===JSON.stringify(D.answers))?P.pocherk.doneAt:Date.now()};
  var first=!(P.pocherk&&P.pocherk.v===V&&P.pocherk.doneAt);
  P.pocherk=R;var h={};ORDER.forEach(function(k){h[OLD[k]]=r.score[k]});P.hand=h;P.handTop=OLD[r.leads[0]];
  if(window.GProfile){GProfile.writeResult(P,'pocherk',R,{answers:D.answers});GProfile.writeResult(P,'hand',{hand:h,handTop:P.handTop})}
  if(window.GArts)GArts.grant('crystal_1',{profile:P,source:'bridge.html'});else{P.arts=P.arts||[];if(P.arts.indexOf('crystal_1')<0)P.arts.push('crystal_1')}
  save(P);
  if(first&&window.GP){var p=GP();var txt=r.mixed?'смешанный почерк: '+names(r.leads,', '):'ведущий почерк: '+DIRS[r.lead]+(r.second.length?', дополнительный: '+names(r.second,', '):'');
   p.log.push({s:3,t:'Почерк героя',r:txt+'. Награда: Кристалл опоры',d:new Date().toLocaleDateString('ru')});SP(p)}
 }
 showFinal(R,fresh);
}
function showFinal(R,fresh){
 var C=window.POCHERK_CARD,res;
 if(R.mixed)res='<div><div class="rl">Смешанный почерк</div><div class="rv">'+names(R.leads,' · ')+'</div></div>';
 else res='<div><div class="rl">Ведущий почерк</div><div class="rv">'+DIRS[R.lead]+'</div></div>'+(R.second&&R.second.length?'<div><div class="rl">Дополнительный</div><div class="rv">'+names(R.second,' · ')+'</div></div>':'');
 var why='<section class="why"><h2>Что показал твой выбор</h2>';
 if(R.mixed){var mx=(TX.mixed||{})[F?'F':'M']||[];why+='<h3>СМЕШАННЫЙ ПОЧЕРК</h3>'+mx.map(function(x){return '<p class="mix">'+esc(x)+'</p>'}).join('')+R.leads.map(function(k){return dirBlock(k,'')}).join('')}
 else{why+=dirBlock(R.lead,'Ведущий почерк');(R.second||[]).forEach(function(k){why+=dirBlock(k,'second',false)})}
 why+='</section>';
 fin.innerHTML='<div class="wrap"><svg class="ribbon" viewBox="0 0 500 420" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stop-color="#fff3c4" stop-opacity="0"/><stop offset=".25" stop-color="#ffe08a"/><stop offset=".6" stop-color="#ffc44a"/><stop offset="1" stop-color="#fff3c4" stop-opacity="0"/></linearGradient><filter id="rgl" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M-10 330 C 120 240, 180 60, 300 110 S 460 260, 520 60" fill="none" stroke="url(#rg)" stroke-width="16" stroke-linecap="round" filter="url(#rgl)"/><path d="M-10 336 C 120 246, 180 66, 300 116 S 460 266, 520 66" fill="none" stroke="#fff8e0" stroke-opacity=".7" stroke-width="2"/></svg>'+
  '<div class="glass"><span class="tag">'+C.tag+'</span><h1>'+C.title+'</h1><div class="rule"></div><div class="lead">'+C.lead+'</div><div class="res">'+res+'</div>'+C.html+'</div>'+why+
  '<div class="reward"><span class="cr">'+CRYSTAL+'</span><div><b>Награда: Кристалл опоры</b><small>Запись в Дневнике</small></div></div>'+
  '<p class="diary-note">'+(F?'Все твои ответы и открытия сохраняются в твоем Дневнике и будут раскрываться там по мере прохождения пути.':'Все твои ответы и открытия сохраняются в твоем Дневнике и будут раскрываться там по мере прохождения пути.')+'</p></div>';
 qz.classList.remove('on');cap.classList.remove('on');fin.hidden=false;document.body.classList.add('fin-on');
 requestAnimationFrame(function(){fin.classList.add('on');veil.classList.add('off')});
 nx.hidden=false;nx.textContent='ДАЛЕЕ';
 nx.onclick=function(e){e.preventDefault();vib(20);location.href=window.GReview?'tasks.html':GRoute.advance()};
 if(fresh)vib([40,30,80]);
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
  showScroll(s,function(){setTimeout(ask,200)});
 });
}
addEventListener('resize',function(){if(cur){layout()}});
start();
})();
