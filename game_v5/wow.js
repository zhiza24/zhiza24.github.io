/* GWow: эффектное появление ключевой мысли, как бонус в игровом автомате.
   Затемнение, золотая вспышка и лучи, искры, карточка с мыслью. Чистый CSS/JS.
   GWow.show({id, kicker, title, text, quote, sub, button, onClose, letter, quoteAfter})
     text — строки через \n становятся абзацами; quoteAfter:true — цитата после текста.
     id — обязателен: момент показывается один раз (P.self.wow[id]) и сохраняется в дневник (P.diary.blocks, id 'wow_'+id).
     force:true — показать повторно (без записи). Пустой текст и заголовок — ничего не показывается.
   GWow.done(id) — уже показан ли момент. */
(function(){
'use strict';
if(window.GWow)return;
var K='alch_v5_profile';
function load(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return {}}}
function store(P){try{localStorage.setItem(K,JSON.stringify(P))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function done(id){var P=load();return !!(P.self&&P.self.wow&&P.self.wow[id])}
function css(){if(document.getElementById('gwow-css'))return;var st=document.createElement('style');st.id='gwow-css';st.textContent=
'.gwow{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;overflow:hidden;font-family:Manrope,system-ui,sans-serif}'+
'.gwow-bg{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,rgba(60,38,10,.92),rgba(6,4,2,.97) 70%);opacity:0;animation:gw-fade .45s ease forwards}'+
'.gwow-rays{position:absolute;left:50%;top:45%;width:180vmax;height:180vmax;margin:-90vmax 0 0 -90vmax;background:repeating-conic-gradient(from 0deg,rgba(255,214,120,.16) 0deg 6deg,transparent 6deg 18deg);-webkit-mask:radial-gradient(circle,#000 0,transparent 55%);mask:radial-gradient(circle,#000 0,transparent 55%);opacity:0;animation:gw-rays 1.2s .25s ease forwards,gw-spin 40s linear infinite}'+
'.gwow-flash{position:absolute;left:50%;top:45%;width:60vmin;height:60vmin;margin:-30vmin 0 0 -30vmin;border-radius:50%;background:radial-gradient(circle,#fff8e0 0,#ffd27a 25%,rgba(255,190,80,.35) 50%,transparent 70%);transform:scale(.1);opacity:0;animation:gw-flash 1s .2s cubic-bezier(.2,.8,.2,1) forwards}'+
'.gwow-sp{position:absolute;left:50%;top:45%;width:6px;height:6px;border-radius:50%;background:#ffe2a0;box-shadow:0 0 8px #ffc860;opacity:0;animation:gw-spark 1.3s var(--d) cubic-bezier(.1,.7,.3,1) forwards}'+
'.gwow-card{position:relative;max-width:340px;width:100%;max-height:calc(100vh - 40px);overflow:auto;padding:26px 22px 20px;border-radius:18px;text-align:center;color:#f4ecdf;background:linear-gradient(180deg,rgba(42,28,12,.96),rgba(20,13,6,.97));border:1px solid #c9a25a;box-shadow:0 0 0 1px rgba(255,215,140,.15) inset,0 0 40px rgba(255,190,80,.35),0 20px 60px rgba(0,0,0,.6);transform:scale(.6) translateY(20px);opacity:0;animation:gw-card .7s .75s cubic-bezier(.2,1.4,.4,1) forwards}'+
'.gwow-card:before{content:"";pointer-events:none;position:absolute;inset:-1px;border-radius:18px;padding:1px;background:linear-gradient(120deg,transparent 30%,#ffe7a8 50%,transparent 70%) 0 0/300% 100%;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;animation:gw-shine 2.4s 1.4s ease-in-out infinite}'+
'html body .gwow[role=dialog] .gwow-card .gwow-k{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#d9b36a!important;margin-bottom:10px}'+
'html body .gwow[role=dialog] .gwow-card .gwow-t{font-family:"Cormorant Garamond",Georgia,serif;font-size:30px;line-height:1.1;font-weight:600;color:#ffd98a!important;text-shadow:0 0 18px rgba(255,200,90,.45);margin:0 0 12px}'+
'html body .gwow[role=dialog] .gwow-card .gwow-q{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:21px;line-height:1.3;color:#fff1cf!important;margin:6px 0 12px}'+
'html body .gwow[role=dialog] .gwow-card .gwow-x{font-size:15px;line-height:1.5;margin:0 0 10px;color:#f4ecdf!important}'+
'html body .gwow[role=dialog] .gwow-card .gwow-s{font-size:13px;line-height:1.45;color:#cdbb98!important;margin:0 0 18px}'+
'html body .gwow.gwow-letter[role=dialog] .gwow-card .gwow-x{text-align:left;font-family:"Cormorant Garamond",Georgia,serif;font-size:19px;line-height:1.4;color:#f4ecdf!important}html body .gwow.gwow-letter[role=dialog] .gwow-card .gwow-s{text-align:right;font-style:italic}'+
'.gwow-b{display:block;width:100%;min-height:48px;border:0;border-radius:12px;font:600 16px Manrope,system-ui,sans-serif;color:#2a1a06;background:linear-gradient(180deg,#ffe29a,#d9a441);box-shadow:0 6px 18px rgba(217,164,65,.35);cursor:pointer}'+
'.gwow.out{transition:opacity .35s ease;opacity:0}'+
'@keyframes gw-fade{to{opacity:1}}@keyframes gw-rays{to{opacity:1}}@keyframes gw-spin{to{transform:rotate(360deg)}}'+
'@keyframes gw-flash{40%{opacity:1;transform:scale(1.4)}100%{opacity:.35;transform:scale(2.2)}}'+
'@keyframes gw-spark{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.3)}}'+
'@keyframes gw-card{to{opacity:1;transform:none}}@keyframes gw-shine{0%{background-position:100% 0}60%,100%{background-position:-100% 0}}'+
'@media (prefers-reduced-motion:reduce){.gwow *{animation-duration:.01s!important;animation-delay:0s!important;animation-iteration-count:1!important}}';
document.head.appendChild(st)}
function record(o){var P=load();P.self=P.self||{};P.self.wow=P.self.wow||{};
 P.self.wow[o.id]={at:Date.now(),title:o.title||'',text:[o.quote,o.text].filter(Boolean).join(' '),page:location.pathname.split('/').pop()+location.search};
 P.diary=P.diary||{};P.diary.blocks=P.diary.blocks||[];var id='wow_'+o.id;
 if(!P.diary.blocks.some(function(b){return b.id===id}))P.diary.blocks.push({id:id,step:P.self.wow[o.id].page,title:'Озарение · '+(o.title||''),passed:'Нить Самости',lead:[o.quote,o.text].filter(Boolean).join(' '),strong:o.sub||'',strongMore:'',insight:'',insightMore:'',answers:[],at:Date.now(),history:[]});
 store(P)}
function show(o){o=o||{};if(!o.id||!(o.title||o.text||o.quote))return false;if(!o.force&&done(o.id))return false;css();
 var el=document.createElement('div');el.className='gwow'+(o.letter?' gwow-letter':'');el.setAttribute('role','dialog');el.setAttribute('data-rdskip','1');el.setAttribute('aria-modal','true');
 var sp='';for(var i=0;i<22;i++){var a=Math.random()*6.283,r=120+Math.random()*180;sp+='<i class="gwow-sp" style="--x:'+Math.round(Math.cos(a)*r)+'px;--y:'+Math.round(Math.sin(a)*r)+'px;--d:'+(.25+Math.random()*.35).toFixed(2)+'s"></i>'}
 el.innerHTML='<div class="gwow-bg"></div><div class="gwow-rays"></div><div class="gwow-flash"></div>'+sp+
  '<div class="gwow-card">'+(o.kicker?'<div class="gwow-k">'+esc(o.kicker)+'</div>':'')+(o.title?'<h2 class="gwow-t">'+esc(o.title)+'</h2>':'')+
  (function(){var q=o.quote?'<p class="gwow-q">'+esc(o.quote)+'</p>':'',x=String(o.text||'').split('\n').filter(Boolean).map(function(t){return '<p class="gwow-x">'+esc(t)+'</p>'}).join('');return o.quoteAfter?x+q:q+x})()+(o.sub?'<p class="gwow-s">'+esc(o.sub)+'</p>':'')+
  '<button type="button" class="gwow-b">'+esc(o.button||'Беру с собой')+'</button></div>';
 el.querySelectorAll('*').forEach(function(n){n.setAttribute('data-rdskip','1')});var CL={'gwow-k':'#d9b36a','gwow-t':'#ffd98a','gwow-q':'#fff1cf','gwow-x':'#f4ecdf','gwow-s':'#cdbb98'};Object.keys(CL).forEach(function(c){el.querySelectorAll('.'+c).forEach(function(n){n.style.setProperty('color',CL[c],'important');n.style.setProperty('-webkit-text-fill-color',CL[c],'important')})});document.body.appendChild(el);try{navigator.vibrate&&navigator.vibrate([30,60,30])}catch(e){}
 try{if(window.GSound&&GSound.play)GSound.play('reveal')}catch(e){}
 var b=el.querySelector('.gwow-b');setTimeout(function(){try{b.focus({preventScroll:true})}catch(e){}},1500);
 b.onclick=function(){if(!o.force)record(o);el.classList.add('out');setTimeout(function(){el.remove();if(typeof o.onClose==='function')o.onClose()},360)};
 return true}
window.GWow={show:show,done:done};
})();
