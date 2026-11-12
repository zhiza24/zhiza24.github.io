/* Шаг 10 «Кто сейчас выбирает?»: треугольник Герой, Эго, Самость на картинке владелицы.
   Реплики и фразы дословно из GTXT.dialogue. Влево = голос Эго (Защитник), вправо = голос Самости.
   Картинка берется по полу: img/triangle_f.jpg, img/triangle_m.jpg. Если картинки для пола нет, остается прежний экран диалога. */
(function(){
'use strict';
var KEY='alch_v5_profile',q=new URLSearchParams(location.search),preview=q.get('preview')==='1';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
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
'.tri-hint{display:flex;justify-content:space-between;font-size:13px;color:#cdb68c;margin:0 2px 8px}'+
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
 var pos=0,ans={},hist=[];
 box.innerHTML='<div class="tri"><div class="tri-img" id="triImg" style="background-image:url('+src+')" role="img" aria-label="Герой между Эго и Самостью"><i class="lH"></i><i class="lL"></i><i class="lR"></i><i class="dL"></i><i class="dR"></i></div><div class="tri-p" id="triP"></div></div>';
 var img=box.querySelector('#triImg'),pan=box.querySelector('#triP'),I={lH:img.querySelector('.lH'),lL:img.querySelector('.lL'),lR:img.querySelector('.lR'),dL:img.querySelector('.dL'),dR:img.querySelector('.dR')};
 function glow(v){I.lH.style.opacity=Math.max(0,Math.min(1,v||0))}
 /* фокус: -1 свет на Эго (слева), +1 свет на Самость (справа), 0 ровно */
 function focus(x){x=Math.max(-1,Math.min(1,x||0));I.lL.style.opacity=Math.max(0,-x);I.dR.style.opacity=Math.max(0,-x);I.lR.style.opacity=Math.max(0,x);I.dL.style.opacity=Math.max(0,x);img.dataset.focus=x<-.3?'ego':x>.3?'self':'none'}
 window.gBack=function(){if(hist.length){pos=hist.pop();var s=seq[pos];if(s.k==='card')delete ans[s.c];draw();return true}return false};
 function go(){hist.push(pos);pos++;draw()}
 function draw(){var s=seq[pos];if(!s){finish();return}window.scrollTo(0,0);glow(0);
  if(s.k==='intro'){focus(0);pan.innerHTML='<h2>'+esc(D.title)+'</h2>'+(D.paragraphs||[]).map(function(p){return '<p>'+esc(T(p))+'</p>'}).join('')+'<p class="tri-lb">Влево: не про меня · Вправо: про меня</p><button class="next" id="triGo">Начать</button>';pan.querySelector('#triGo').onclick=go;return}
  if(s.k==='say'){var l=L[s.n],ego=/Защитник/.test(T(l.speaker));focus(ego?-1:1);
   pan.innerHTML='<div class="tri-lb">'+esc(T(l.speaker))+' · '+(s.n+1)+' из '+L.length+'</div><div class="tri-sp">'+esc(T(l.text))+'</div><button class="next" id="triGo">Дальше</button>';pan.querySelector('#triGo').onclick=go;return}
  var c=cards[s.c];focus(0);glow(0);
  pan.innerHTML='<div class="tri-lb">Звучит во мне? · '+(s.c+1)+' из '+cards.length+'</div><div class="tri-card" id="triCd"><div class="tri-q">Это звучит во мне?</div>'+esc(c.text)+'</div><div class="tri-bt"><button id="triN" type="button">← Не про меня</button><button id="triY" type="button">Про меня →</button></div>';
  var cd=pan.querySelector('#triCd'),sx=null,dx=0,busy=false;
  function pick(a){if(busy)return;busy=true;ans[s.c]=a;var lf=a==='notme';glow(.6);cd.style.transform='translateX('+(lf?-420:420)+'px) rotate('+(lf?-18:18)+'deg)';cd.style.opacity=0;try{navigator.vibrate&&navigator.vibrate(20)}catch(e){}setTimeout(go,380)}
  cd.addEventListener('pointerdown',function(e){sx=e.clientX;dx=0;cd.style.transition='none';img.classList.add('drag');try{cd.setPointerCapture(e.pointerId)}catch(_){}});
  cd.addEventListener('pointermove',function(e){if(sx==null)return;dx=e.clientX-sx;cd.style.transform='translateX('+dx+'px) rotate('+dx/18+'deg)';glow(Math.abs(dx)/110*.7)});
  function up(){if(sx==null)return;sx=null;cd.style.transition='';img.classList.remove('drag');if(dx<-70)pick('notme');else if(dx>70)pick('me');else{cd.style.transform='';glow(0)}dx=0}
  cd.addEventListener('pointerup',up);cd.addEventListener('pointercancel',up);
  pan.querySelector('#triN').onclick=function(){pick('notme')};pan.querySelector('#triY').onclick=function(){pick('me')}}
 function finish(){glow(0);var A=cards.map(function(c,i){return {n:c.n,j:c.j,answer:ans[i]||null,key:c.key}}),e=A.filter(function(a){return a.answer==='me'&&a.key==='ego'}).length,sf=A.filter(function(a){return a.answer==='me'&&a.key==='self'}).length;
  var res={v:3,mode:'triangle',answers:A,egoCount:e,selfCount:sf,ego:e,self:sf,at:Date.now()};
  if(!preview){var P=load();P.dialog=res;if(window.GProfile){try{P=GProfile.saveResult('dialog',res,{answers:A,version:3},{profile:P,save:false})}catch(err){}}P.dialog=res;(P.log=P.log||[]).push({t:Date.now(),x:e+sf?'Кто сейчас выбирает: среди фраз «про меня» голос Эго '+e+', голос Самости '+sf:'Кто сейчас выбирает: ни одна фраза пока не отмечена как своя'});try{localStorage.setItem(KEY,JSON.stringify(P))}catch(err){}}
  result(res)}
 function result(res){var A=res.answers,n=nextOf(),e=res.egoCount,sf=res.selfCount,none=!(e+sf);focus(e>sf?-1:sf>e?1:0);glow(0);hist=[];window.gBack=null;
  function list(side,lab){var l=[];A.forEach(function(a,i){if(a.answer==='me'&&a.key===side)l.push(i)});return l.length?'<ul>'+l.map(function(i){return '<li><small>'+lab+'</small><br>'+esc(cards[i].text)+'<br><small>'+esc(cards[i].outcome)+'</small></li>'}).join('')+'</ul>':'<p><small>Среди отмеченных фраз таких нет.</small></p>'}
  var r=D.result_rules||{},par=(r.result_paragraphs||[])[1];
  var head=none?'<p>Сейчас ни одна фраза не откликнулась как своя. Это тоже ответ. Можно вернуться к этим словам позже и заметить, какие из них звучат в обычный день.</p>':'<p>Среди фраз, которые звучат в тебе, голос Эго (Защитника): '+e+', голос Самости: '+sf+'. Это не оценка: так видно, чей голос чаще выбирает в тебе сейчас. Куда направлен фокус внимания, там сила и выбор.</p>';
  pan.innerHTML='<div class="tri-res"><div class="tri-lb">Кто сейчас выбирает?</div><h2>'+(none?'Пока без отклика':'Эго: '+e+' · Самость: '+sf)+'</h2>'+head+(par?'<p>'+esc(T(par))+'</p>':'')+
   (none?'':'<details><summary>Голос Эго в тебе: '+e+'</summary>'+list('ego','Эго · Защитник')+'</details><details><summary>Голос Самости в тебе: '+sf+'</summary>'+list('self','Самость')+'</details>')+
   (preview?'<p><small>Просмотр: ответы не сохраняются в твой путь.</small></p>':'')+'<button class="next" id="nx">'+(n?'Дальше: '+esc(n.t):'Дальше')+'</button><div class="tri-links"><button type="button" id="triRe">Пройти заново</button><a href="diary.html">В дневник</a></div></div>';
  var nx=pan.querySelector('#nx');window.nx=nx;if(window.GQuote)GQuote.add(pan.querySelector('.tri-res'),'slot.html?id=dialog',nx);
  nx.onclick=function(){if(preview){location.href='tasks.html';return}if(window.GReview){location.href='tasks.html';return}var u=GRoute.advance();if(u)location.href=u};
  pan.querySelector('#triRe').onclick=function(){ans={};pos=0;hist=[];draw();scrollTo(0,0)};
  window.scrollTo(0,0)}
 if(P.dialog&&P.dialog.v===3&&P.dialog.answers&&!preview){result(P.dialog);return}
 draw()}
window.GTri={mount:mount};
})();
