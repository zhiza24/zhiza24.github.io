/* Шаг 10 «Кто сейчас выбирает?»: треугольник Герой, Эго, Самость на картинке владелицы.
   Реплики и фразы дословно из GTXT.dialogue. Фразу тянут к фигуре: влево к темной (Защитник, Эго), вправо к светлой (Самость), вниз или кнопка «Сомневаюсь».
   Картинка берется по полу: img/triangle_f.jpg, img/triangle_m.jpg. Если картинки для пола нет, остается прежний экран диалога. */
(function(){
'use strict';
var KEY='alch_v5_profile',q=new URLSearchParams(location.search),preview=q.get('preview')==='1';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function GF(s){var f=load().gender==='f';return String(s).replace(/\{([^{}|]*)\|([^{}|]*)\}/g,function(_,m,w){return f?w:m})}
function ph(n,a,b,c){var m=n%10,h=n%100;return n+' '+(m===1&&h!==11?a:m>=2&&m<=4&&(h<12||h>14)?b:c)}
function T(v){return window.GT?GT(v):(v&&v.m)||v}
function css(){if(document.getElementById('tri-css'))return;var s=document.createElement('style');s.id='tri-css';s.textContent=
'.tri{margin:-8px -16px 0;position:relative;color:#f4ecdf}'+
'.tri-img{position:relative;width:100%;height:clamp(300px,calc(100svh - 330px),min(148.7vw,714px));background:#0d0905 center top/cover no-repeat;overflow:hidden}'+
'.tri-img i{position:absolute;top:0;bottom:0;width:50%;pointer-events:none;opacity:0;transition:opacity .45s ease}'+
'.tri-img .lL{left:0;background:radial-gradient(ellipse 85% 60% at 30% 52%,rgba(255,200,125,.62),rgba(255,170,90,.2) 55%,transparent 75%);mix-blend-mode:screen}'+
'.tri-img .lR{right:0;background:radial-gradient(ellipse 85% 60% at 70% 52%,rgba(255,228,155,.62),rgba(255,210,120,.2) 55%,transparent 75%);mix-blend-mode:screen}'+
'.tri-img .dL{left:0;background:linear-gradient(90deg,rgba(6,4,2,.72),rgba(6,4,2,.35))}'+
'.tri-img .dR{right:0;background:linear-gradient(270deg,rgba(6,4,2,.72),rgba(6,4,2,.35))}'+
'.tri-img.drag i{transition:none}.tri-img .lH{left:20%;width:60%;background:radial-gradient(ellipse 70% 42% at 50% 24%,rgba(255,226,160,.55),transparent 72%);mix-blend-mode:screen}.tri-q{font:700 12px Manrope,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#8a5a22;margin-bottom:6px}'+
'.tri-p{position:relative;margin-top:-24%;padding:22px 18px 18px;background:linear-gradient(rgba(13,9,5,0),rgba(13,9,5,.82) 18%,#0d0905 40%);min-height:34%}'+
'body.tri-on,body.tri-on .wrap{background:#0d0905!important}.tri,.tri *{border-color:#c99a45}'+'.tri-p h2{margin:0 0 8px;color:#f0c870!important;font-size:24px}.tri-p p,.tri-p li,.tri-sp,.tri-p summary+*{line-height:1.45;color:#f4ecdf!important}.tri-p p{margin:0 0 10px;font-size:17px}'+
'.tri-lb{font:800 12px Manrope,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#e0b860;margin:0 0 6px}'+
'.tri-sp{font-size:18px;margin:0 0 12px}.tri-p small{color:#cdb68c!important}.tri-res summary{color:#f0c870!important}'+
'.tri-card{position:relative;margin:4px 0 12px;padding:18px 16px;border-radius:16px;background:linear-gradient(#f6e6bf,#e2c78e);color:#3a2410;font:700 20px/1.35 Manrope,sans-serif;text-align:center;touch-action:none;user-select:none;-webkit-user-select:none;transition:transform .3s,opacity .3s;box-shadow:0 8px 24px rgba(0,0,0,.55)}'+
'.tri-bt{display:flex;gap:10px}.tri-bt button{flex:1;min-height:48px;border-radius:999px;font:800 17px Manrope,sans-serif;border:1px solid #c99a45;background:#20170e;color:#f4ecdf;cursor:pointer}'+
'.tri-hint{text-align:center;font-size:13px;color:#cdb68c;margin:-4px 0 8px}'+'.tri-img .hD{left:22%;width:56%;background:radial-gradient(ellipse 60% 38% at 50% 26%,rgba(4,3,2,.78),rgba(4,3,2,.35) 55%,transparent 75%)}'+'.tri-img .hG{left:22%;width:56%;background:radial-gradient(ellipse 60% 38% at 50% 26%,rgba(255,224,150,.7),rgba(255,200,120,.22) 55%,transparent 75%);mix-blend-mode:screen}'+'.tri-bt button.tri-mid{flex:.9;font-size:14px;font-weight:700;background:transparent;color:#e8d3a8;border-color:rgba(201,154,69,.55)}.tri-bt{gap:8px}.tri-bt button{padding:0 8px;white-space:nowrap}'+'@keyframes triWig{0%,100%{transform:translateX(0)}20%{transform:translateX(-16px) rotate(-2deg)}50%{transform:translateX(16px) rotate(2deg)}75%{transform:translateX(-6px)}}.tri-card.wig{animation:triWig 1.1s ease}'+'.tri-ov{position:absolute;left:0;right:0;bottom:0;min-height:100%;box-sizing:border-box;z-index:5;background:#0d0905;padding:16px 18px;display:flex;flex-direction:column;justify-content:center;text-align:center;border-radius:12px}'+'.tri-demo{position:relative;flex:none;height:52px;margin:0 auto 10px;width:100%;max-width:300px}.tri-demo b{position:absolute;left:50%;top:8px;width:130px;margin-left:-65px;height:42px;border-radius:10px;background:linear-gradient(#f6e6bf,#e2c78e);animation:triDemo 2.6s ease-in-out infinite}'+'.tri-demo b:after{content:"\\261D";position:absolute;left:52px;top:22px;font-size:26px}.tri-demo span{position:absolute;top:18px;font-size:22px;color:#e0b860}.tri-demo .a1{left:0}.tri-demo .a2{right:0}'+'@keyframes triDemo{0%,100%{transform:translateX(0)}25%{transform:translateX(-70px) rotate(-8deg)}50%{transform:translateX(0)}75%{transform:translateX(70px) rotate(8deg)}}'+'#m .tri .tri-ov p{color:#f4ecdf!important;font-size:16px;margin:0 0 6px}.tri-ov .next{flex:none}'+
'@media (max-height:720px){.tri-img{height:clamp(300px,calc(100svh - 285px),min(148.7vw,714px))}.tri-p{padding-top:16px}.tri-card{padding:14px 14px;font-size:18px;margin-bottom:10px}.tri-hint{margin-bottom:6px}}'+'.tri .next{margin-top:12px}.tri-res{padding:4px 0 0}.tri-res details{margin:10px 0;border-top:1px solid rgba(201,154,69,.4);padding-top:8px}.tri-res summary{cursor:pointer;font-weight:700;color:#f0c870}'+
'.tri-res li{margin:6px 0;line-height:1.4}.tri-res small{color:#cdb68c}.tri-links{margin-top:12px;display:flex;gap:18px}.tri-links a,.tri-links button{background:none;border:0;padding:0;color:#e0b860;font:500 15px Manrope,sans-serif;text-decoration:underline;cursor:pointer;width:auto;min-height:0}'+
'#m .tri p,#m .tri li,#m .tri .tri-sp,#m .tri .gq-t,#m .tri .tri-p{color:#f4ecdf!important}#m .tri small{color:#cdb68c!important}#m .tri h2,#m .tri summary{color:#f0c870!important}#m .tri .gq-c,#m .tri .gq-b{color:#e0b860!important}#m .tri .tri-card{color:#3a2410!important}';document.head.appendChild(s)}
function nextOf(){var F=window.GFLOW||[],i=F.findIndex(function(x){return x.u==='slot.html?id=dialog'}),n=F[i+1];return n?{u:n.u,t:String(n.t).replace(/^Тест:\s*/,'')}:null}
function mount(box,fallback){
 var P=load(),g=P.gender==='f'?'f':'m',src='img/triangle_'+g+'.jpg?v=1',im=new Image();
 im.onload=function(){run(box,src)};im.onerror=function(){fallback()};im.src=src}
function run(box,src){css();document.body.classList.add('tri-on');var D=GTXT.dialogue,L=D.dialogue,cards=[],P=load();
 L.forEach(function(l,n){l.options.forEach(function(o,j){cards.push({n:n+1,j:j,text:T(o.text),key:o.state,outcome:T(o.outcome)})})});
 var seq=[{k:'intro'}];L.forEach(function(l,n){seq.push({k:'say',n:n});l.options.forEach(function(o,j){seq.push({k:'card',c:n*3+j})})});
 var pos=0,ans={},hist=[],idle=null;
 box.innerHTML='<div class="tri"><div class="tri-img" id="triImg" style="background-image:url('+src+')" role="img" aria-label="Герой между темной и светлой фигурой"><i class="lL"></i><i class="lR"></i><i class="dL"></i><i class="dR"></i><i class="hD"></i><i class="hG"></i></div><div class="tri-p" id="triP"></div></div>';
 var img=box.querySelector('#triImg'),pan=box.querySelector('#triP'),I={};['lL','lR','dL','dR','hD','hG'].forEach(function(k){I[k]=img.querySelector('.'+k)});
 function op(k,v){I[k].style.opacity=Math.max(0,Math.min(1,v||0))}
 /* реплики: -1 свет на Защитнике (слева), +1 на Самости (справа) */
 function focus(x){x=Math.max(-1,Math.min(1,x||0));op('lL',-x);op('dR',-x);op('lR',x);op('dL',x);op('hD',0);op('hG',0);img.dataset.focus=x<-.3?'ego':x>.3?'self':'none'}
 /* свайп фразы: влево герой темнеет и загорается темная фигура, вправо герой светлеет и загорается светлая */
 function drag(x){x=Math.max(-1,Math.min(1,x||0));op('hD',-x);op('lL',-x);op('dR',-x*.5);op('hG',x);op('lR',x);op('dL',x*.5);img.dataset.focus=x<-.3?'dark':x>.3?'light':'none'}
 window.gBack=function(){if(hist.length){pos=hist.pop();var s=seq[pos];if(s.k==='card')delete ans[s.c];draw();return true}return false};
 function go(){hist.push(pos);pos++;draw()}
 function draw(){clearInterval(idle);var s=seq[pos];if(!s){finish();return}window.scrollTo(0,0);
  if(s.k==='intro'){focus(0);pan.innerHTML='<h2>'+esc(D.title)+'</h2>'+(D.paragraphs||[]).map(function(p){return '<p>'+esc(T(p))+'</p>'}).join('')+'<button class="next" id="triGo">Начать</button>';pan.querySelector('#triGo').onclick=go;return}
  if(s.k==='say'){var l=L[s.n],ego=/Защитник/.test(T(l.speaker));focus(ego?-1:1);
   pan.innerHTML='<div class="tri-lb">'+esc(T(l.speaker))+' · '+(s.n+1)+' из '+L.length+'</div><div class="tri-sp">'+esc(T(l.text))+'</div><button class="next" id="triGo">Дальше</button>';pan.querySelector('#triGo').onclick=go;return}
  var c=cards[s.c];focus(0);
  pan.innerHTML='<div class="tri-lb">Чей это голос? · '+(s.c+1)+' из '+cards.length+'</div><div class="tri-card" id="triCd"><div class="tri-q">Чей это голос в тебе?</div>'+esc(c.text)+'</div>'+(s.c<2?'<div class="tri-hint">Потяни фразу: влево к темной фигуре, вправо к светлой, вниз если сомневаешься</div>':'')+'<div class="tri-bt"><button id="triD" type="button">← Темный</button><button id="triM" class="tri-mid" type="button">Сомневаюсь</button><button id="triL" type="button">Светлый →</button></div>';
  var cd=pan.querySelector('#triCd'),sx=null,sy=0,dx=0,dy=0,busy=false;
  function wig(){if(sx!=null||busy)return;cd.classList.remove('wig');void cd.offsetWidth;cd.classList.add('wig')}
  idle=setInterval(wig,3200);
  function pick(a){if(busy)return;busy=true;clearInterval(idle);ans[s.c]=a;if(a==='ego')drag(-1);else if(a==='self')drag(1);else drag(0);
   cd.style.transform=a==='doubt'?'translateY(160px) scale(.9)':'translateX('+(a==='ego'?-420:420)+'px) rotate('+(a==='ego'?-18:18)+'deg)';cd.style.opacity=0;try{navigator.vibrate&&navigator.vibrate(20)}catch(e){}setTimeout(go,400)}
  cd.addEventListener('pointerdown',function(e){sx=e.clientX;sy=e.clientY;dx=dy=0;cd.classList.remove('wig');cd.style.transition='none';img.classList.add('drag');try{cd.setPointerCapture(e.pointerId)}catch(_){}});
  cd.addEventListener('pointermove',function(e){if(sx==null)return;dx=e.clientX-sx;dy=e.clientY-sy;cd.style.transform='translate('+dx+'px,'+Math.max(0,dy)+'px) rotate('+dx/18+'deg)';drag(dx/110)});
  function up(){if(sx==null)return;sx=null;cd.style.transition='';img.classList.remove('drag');if(dx<-70)pick('ego');else if(dx>70)pick('self');else if(dy>70&&Math.abs(dx)<60)pick('doubt');else{cd.style.transform='';drag(0)}dx=dy=0}
  cd.addEventListener('pointerup',up);cd.addEventListener('pointercancel',up);
  pan.querySelector('#triD').onclick=function(){pick('ego')};pan.querySelector('#triL').onclick=function(){pick('self')};pan.querySelector('#triM').onclick=function(){pick('doubt')};
  var seen=false;try{seen=localStorage.getItem('alch_v5_trihint')==='1'}catch(e){}
  if(s.c===0&&!seen){clearInterval(idle);var ov=document.createElement('div');ov.className='tri-ov';ov.id='triOv';
   ov.innerHTML='<div class="tri-demo" aria-hidden="true"><span class="a1">←</span><b></b><span class="a2">→</span></div><p>'+esc(GF('Потяни фразу к тому, чей это голос в тебе: влево к темной фигуре в доспехах, вправо к светлой. Если не {уверен|уверена}, жми «Сомневаюсь».'))+'</p><button class="next" id="triOk">Понятно</button>';
   pan.appendChild(ov);ov.querySelector('#triOk').onclick=function(){try{localStorage.setItem('alch_v5_trihint','1')}catch(e){}ov.remove();idle=setInterval(wig,3200)}}}
 function finish(){var A=cards.map(function(c,i){return {n:c.n,j:c.j,answer:ans[i]||null,key:c.key}});
  var cnt=function(v){return A.filter(function(a){return a.answer===v}).length},e=cnt('ego'),sf=cnt('self'),dq=cnt('doubt'),mt=A.filter(function(a){return a.answer===a.key}).length;
  var res={v:4,mode:'triangle',answers:A,egoCount:e,selfCount:sf,doubtCount:dq,matches:mt,ego:e,self:sf,at:Date.now()};
  if(!preview){var P=load();P.dialog=res;if(window.GProfile){try{P=GProfile.saveResult('dialog',res,{answers:A,version:4},{profile:P,save:false})}catch(err){}}P.dialog=res;(P.log=P.log||[]).push({t:Date.now(),x:'Кто сейчас выбирает: Защитнику '+e+', Самости '+sf+', сомневаюсь '+dq});try{localStorage.setItem(KEY,JSON.stringify(P))}catch(err){}}
  result(res)}
 function result(res){clearInterval(idle);var A=res.answers,n=nextOf(),e=res.egoCount,sf=res.selfCount,dq=res.doubtCount,mt=res.matches,given=e+sf;focus(e>sf?-1:sf>e?1:0);hist=[];window.gBack=null;
  var TAG={ego:'по подсказке игры: голос Эго',self:'по подсказке игры: голос Самости'};
  function list(f,showTag){var l=[];A.forEach(function(a,i){if(f(a))l.push(i)});return l.length?'<ul>'+l.map(function(i){return '<li>'+esc(cards[i].text)+(showTag?'<br><small>'+TAG[cards[i].key]+'</small>':'')+'<br><small>'+esc(cards[i].outcome)+'</small></li>'}).join('')+'</ul>':'<p><small>Таких фраз нет.</small></p>'}
  var r=D.result_rules||{},par=(r.result_paragraphs||[])[1];
  var reveal='<p>Темная фигура в доспехах это Защитник, голос Эго. Светлая фигура это голос Самости.</p>';
  var head=!given?'<p>Сейчас ты сомневаешься во всех фразах. Это честный ответ: голоса пока звучат вместе. Можно вернуться к этим словам позже и заметить, какой из них слышен в обычный день.</p>':
   '<p>'+esc(GF('Защитнику ты {отдал|отдала} '+ph(e,'фразу','фразы','фраз')+', Самости '+sf+(dq?', в '+dq+' сомневаешься':'')+'. С подсказкой игры совпало '+mt+' из '+given+'.'))+' Куда направлен фокус внимания, там сила и выбор.</p>';
  var diff=A.some(function(a){return a.answer&&a.answer!=='doubt'&&a.answer!==a.key});
  pan.innerHTML='<div class="tri-res"><div class="tri-lb">Кто сейчас выбирает?</div><h2>Темная: '+e+' · Светлая: '+sf+' · Сомневаюсь: '+dq+'</h2>'+reveal+head+(par?'<p>'+esc(T(par))+'</p>':'')+
   (e?'<details><summary>Темной фигуре, Защитнику: '+e+'</summary>'+list(function(a){return a.answer==='ego'})+'</details>':'')+
   (sf?'<details><summary>Светлой фигуре, Самости: '+sf+'</summary>'+list(function(a){return a.answer==='self'})+'</details>':'')+
   (dq?'<details><summary>Сомневаюсь: '+dq+'</summary>'+list(function(a){return a.answer==='doubt'},true)+'</details>':'')+
   (diff?'<details><summary>Где ты слышишь иначе, чем подсказка игры</summary>'+list(function(a){return a.answer&&a.answer!=='doubt'&&a.answer!==a.key},true)+'</details>':'')+
   (preview?'<p><small>Просмотр: ответы не сохраняются в твой путь.</small></p>':'')+'<button class="next" id="nx">'+(n?'Дальше: '+esc(n.t):'Дальше')+'</button><div class="tri-links"><button type="button" id="triRe">Пройти заново</button><a href="diary.html">В дневник</a></div></div>';
  var nx=pan.querySelector('#nx');window.nx=nx;if(window.GQuote)GQuote.add(pan.querySelector('.tri-res'),'slot.html?id=dialog',nx);
  nx.onclick=function(){if(preview){location.href='tasks.html';return}if(window.GReview){location.href='tasks.html';return}var u=GRoute.advance();if(u)location.href=u};
  pan.querySelector('#triRe').onclick=function(){ans={};pos=0;hist=[];draw();scrollTo(0,0)};
  window.scrollTo(0,0)}
 if(P.dialog&&P.dialog.v===4&&P.dialog.answers&&!preview){result(P.dialog);return}
 draw()}
window.GTri={mount:mount};
})();
