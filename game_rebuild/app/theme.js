/* Светлая и темная тема (localStorage alch_v5_theme = 'light' | 'dark', по умолчанию светлая).
   Загружается первым в <head>: ставит data-theme на <html> до отрисовки.
   Тема меняет только экраны тестов, вопросов и итогов (ego.html, slot.html кроме зеркал), Дневник и читалку Книги.
   Сюжетные сцены, заставки, карта, Пифагор, арканы и паспорт не меняются. */
/* Изолированное хранилище новой сборки. Старый game_v5 не читается и не перезаписывается. */
(function(){
'use strict';
if(!window.Storage||Storage.prototype.__alchemyRebuildMapped)return;
var get=Storage.prototype.getItem,set=Storage.prototype.setItem,remove=Storage.prototype.removeItem;
function key(k){k=String(k);return k.indexOf('alch_v5_')===0?'alch_rebuild_'+k.slice(8):k}
Storage.prototype.getItem=function(k){return get.call(this,key(k))};
Storage.prototype.setItem=function(k,v){return set.call(this,key(k),v)};
Storage.prototype.removeItem=function(k){return remove.call(this,key(k))};
try{Object.defineProperty(Storage.prototype,'__alchemyRebuildMapped',{value:true})}catch(e){}
})();
(function(){
'use strict';
if(window.GTheme)return;
var KEY='alch_v5_theme',H=document.documentElement;
/* Переключатель темы снят по решению владельца: всегда светлая, сохраненный выбор игнорируется. Код темной темы оставлен спящим (ALLOW_DARK). */
var ALLOW_DARK=false;
function get(){if(!ALLOW_DARK)return 'light';try{return localStorage.getItem(KEY)==='dark'?'dark':'light'}catch(e){return 'light'}}
var f=location.pathname.split('/').pop()||'index.html',q=new URLSearchParams(location.search);
var on=f==='ego.html'||f==='diary.html'||(f==='slot.html'&&q.get('id')!=='mirrors');
H.setAttribute('data-theme',get());if(on)H.classList.add('th-on');
/* Читабельность: по умолчанию вариант 'c' — чистый светлый фон, темный текст, системный шрифт без засечек и курсива (выбор владельца).
   ?read=a|b|c — проба другого варианта, ?read=off — старый вид; проба держится в sessionStorage. RDEF — вариант для всех. */
var RDEF='c';
(function(){var r=q.get('read'),RK='alch_v5_read';try{if(r==='off'){sessionStorage.setItem(RK,'off');r=''}else if(/^[abc]$/.test(r||''))sessionStorage.setItem(RK,r);else{r=sessionStorage.getItem(RK)||RDEF;if(r==='off')r=''}}catch(e){r=/^[abc]$/.test(r||'')?r:(r==='off'?'':RDEF)}
 if(!r)return;H.setAttribute('data-read',r);
 var SANS='-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display",Inter,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
 var X=':not(.gtop *):not(.gnav *):not(.gbk *):not(.cap):not(.cap *)';
 function S(pre,list){return list.split(',').map(function(x){return pre+x+X}).join(',')}
 var BODY='p,small,li,.ar-ph,.ar-ph small,.ar-draft,.ar-ctx,.ar-blk p,.al,.l,.muted,.pt,.ao,.e,.dt,label,.gq-t,blockquote,textarea';
 var HEAD='h1,h2,h3,h4,.q,.aq,.ar-title,.ar-ph b,[style*="Cormorant"]';
 var c='';
 var LA='html.th-on[data-theme=light][data-read=a] ',LC='html.th-on[data-theme=light][data-read=c] ',DC='html.th-on[data-theme=dark][data-read=c] ';
 var B1='html.th-on[data-read=b] ',B2='html.th-on[data-read=c] ';
 /* цвет: A и C, светлая */
 [LA,LC].forEach(function(P){c+=P+'body{background:#faf5ea linear-gradient(180deg,#fdf9f1,#f5ecda) fixed!important;color:#2a2118!important}'+
  P+'.sc,'+P+'.ar-slot,'+P+'main.wrap .card{background:#fffaf0!important;background-image:none!important}'+
  P+'.ar-ph{background:#fffdf8!important}'+
  S(P,BODY)+'{color:#2a2118!important}'+S(P,HEAD)+'{color:#3a1f08!important}'+
  P+'.ao{background:#fffdf8!important;border-color:#c9a36a!important}'});
 /* цвет: C, темная */
 c+=DC+'body{color:#efe6d6!important}'+S(DC,BODY)+'{color:#efe6d6!important}'+S(DC,HEAD)+'{color:#f3d48a!important}';
 /* шрифт: B — проба 17.5px/500; C — 18.5px, плотнее, заголовки тем же шрифтом жирно */
 c+=S(B1,BODY)+'{font-family:'+SANS+'!important;font-weight:500!important;font-style:normal!important;line-height:1.5!important}'+
  S(B1,'p,.ar-ph,.ar-draft,.ar-ctx,.ar-blk p,.ao,.e,li,.gq-t')+'{font-size:17.5px!important}'+S(B1,'small,.ar-ph small,.muted,.dt,.al,.l')+'{font-size:15.5px!important}';
 c+=S(B2,BODY)+'{font-family:'+SANS+'!important;font-weight:500!important;font-style:normal!important;line-height:1.5!important;letter-spacing:0!important}'+
  S(B2,'p,.ar-ph,.ar-draft,.ar-ctx,.ar-blk p,.ao,.e,li,.gq-t,blockquote,textarea')+'{font-size:18.5px!important}'+
  S(B2,'small,.ar-ph small,.muted,.dt,.al,.l')+'{font-size:16px!important}'+
  S(B2,HEAD)+'{font-family:'+SANS+'!important;font-weight:700!important;font-style:normal!important;letter-spacing:-.01em!important;line-height:1.25!important}'+
  S(B2,'.q,.aq,.ar-title')+'{font-size:23px!important}'+
  S(B2,'.ar-draft span,.ar-draft *')+'{font-style:normal!important}';
 /* Книга (читалка и оглавление в Дневнике) — тот же шрифт на любой странице */
 var K='html[data-read=c] ';
 c+=K+'.gbk-txt p,'+K+'.gbk-txt li,'+K+'.gbk-txt .key,'+K+'.gbk-txt .flow,'+K+'.gbk-txt .li2{font-family:'+SANS+'!important;font-weight:500!important;font-style:normal!important;font-size:18.5px!important;line-height:1.55!important;letter-spacing:0!important}'+
  K+'.gbk-hero h2,'+K+'.gbk-sh,'+K+'.gbk-txt h4,'+K+'.dbk-cover h2,'+K+'.dbk-item .dbk-it{font-family:'+SANS+'!important;font-weight:700!important;font-style:normal!important;letter-spacing:-.01em!important}'+
  K+'.gbk-hero h2,'+K+'.dbk-cover h2{font-size:26px!important}'+K+'.gbk-sh{font-size:22px!important}'+K+'.gbk-txt h4{font-size:20px!important}'+K+'.dbk-item .dbk-it{font-size:18px!important}';
 /* Все остальные страницы: тот же шрифт без засечек и курсива. Цвет: темный текст на светлом -> почти черный; светлый текст на темном (сюжет, свитки) остается светлым. */
 c+='[data-rdf]{font-family:'+SANS+'!important;font-style:normal!important;letter-spacing:0!important}'+
  '[data-rdf=h]{font-weight:700!important;letter-spacing:-.01em!important;line-height:1.25!important}'+
  '[data-rdb]{font-weight:500!important}'+'[data-rdb=s]{font-size:18.5px!important;line-height:1.5!important}'+
  '[data-rdc=d]{color:#2a2118!important}'+'[data-rdc=h]{color:#3a1f08!important}';
 var st=document.createElement('style');st.id='gread';st.textContent=c;(document.head||H).appendChild(st);
 if(r!=='c'||/^(index|cover_v1|birth-preview)\.html$/.test(f))return;/* обложка — логотип, не трогаем */
 var SKIP='#scr.sh,.gtop,.gnav,.gbk,.cap,.tag,.gq-b,button,select,input,svg,canvas,script,style,[class*=pyth],[class*=arcan],[class*=passport],[class*=psq],[data-rdskip]';
 var HT=/^(H1|H2|H3|H4)$/;
 function lum(cs){var m=/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/.exec(cs);if(!m)return 1;if(m[4]!=null&&+m[4]<.35)return 1;
  function f(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)}return .2126*f(+m[1])+.7152*f(+m[2])+.0722*f(+m[3])}
 function own(e){for(var n=e.firstChild;n;n=n.nextSibling)if(n.nodeType===3&&n.nodeValue.trim())return n.nodeValue.trim();return ''}
 function fix(){var all=document.body?document.body.getElementsByTagName('*'):[];
  for(var i=0;i<all.length;i++){var e=all[i];if(e.hasAttribute('data-rdx'))continue;var t=own(e);if(!t)continue;e.setAttribute('data-rdx','1');
   if(e.closest(SKIP))continue;var cs=getComputedStyle(e),fs=parseFloat(cs.fontSize)||16,ff=cs.fontFamily,serif=/Cormorant|Garamond|Georgia|serif/i.test(ff.replace(/sans-serif/ig,''));
   if(t.length<=3&&fs>=24)continue;/* крупные цифры и знаки — часть картинки */
   var head=HT.test(e.tagName)||(serif&&fs>=20);
   e.setAttribute('data-rdf',head?'h':'b');
   if(head&&serif)e.style.setProperty('font-size',Math.round(fs*.88*10)/10+'px','important');
   if(!head){var w=parseInt(cs.fontWeight,10)||400;if(w<=500){e.setAttribute('data-rdb',(t.length>=50&&fs>=14.5&&fs<18.5&&/block|list-item/.test(cs.display))?'s':'w')}}
   var L=lum(cs.color);if(L<.2)e.setAttribute('data-rdc',head?'h':'d')}}
 var tm=0;function later(){clearTimeout(tm);tm=setTimeout(fix,60)}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){fix();new MutationObserver(later).observe(document.body,{childList:true,subtree:true,characterData:true})});
 else{fix();new MutationObserver(later).observe(document.body,{childList:true,subtree:true,characterData:true})}
 addEventListener('load',later)})();

var L='html.th-on[data-theme=light] ',DK='html.th-on[data-theme=dark] ',BL='html[data-theme=light] ',BD='html[data-theme=dark] ';
var css=
/* ----- светлая: общие экраны ----- */
L+'body{background:#f4e8cf linear-gradient(180deg,#f8efdc,#ecdcbb) fixed!important;color:#3a2410!important}'+
L+'.gtop .gpt,'+L+'.gbk-t1{color:#6a3a12!important;text-shadow:none!important}'+L+'.gbk-t2{color:#9a5a2a!important}'+
L+'h1,'+L+'h2,'+L+'.aq,'+L+'.ar-title{color:#7a4512!important}'+L+'p{color:#4a3018}'+L+'b{color:inherit}'+
L+'.pt{background:#fffaf0!important;border-color:#d9bf8c!important;color:#3a2410}'+L+'.pt small,'+L+'.al,'+L+'.ar-ctx,'+L+'.muted,'+L+'.dt{color:#6e5028!important}'+L+'.pt.ok{border-color:#6e9e58!important}'+
L+'.ao,'+L+'.row button,'+L+'button[style*="#20170e"],'+L+'a.st{background:#fffaf0!important;color:#3a2410!important;border-color:#c9a46a!important}'+
L+'.ao.ar-on,'+L+'.row button[style*="#7a5a26"]{background:linear-gradient(#ffe9a8,#e0a940)!important;color:#2a1606!important}'+
L+'.ar-ph,'+L+'.ph{background:rgba(255,250,236,.75)!important;color:#5a3a1a!important;border-color:#b8893f!important}'+L+'.ar-ph b,'+L+'.ph b{color:#7a4512!important}'+L+'.ar-ph small{color:#7a5a36!important}'+
L+'.ar-draft{color:#5a3a1a}'+L+'.ar-blk h3{color:#6e5028}'+L+'.fb{color:#8a5212!important}'+L+'.ar-skip{color:#5a3a1a}'+
L+'textarea,'+L+'.ar-ta{background:#fffdf6!important;color:#3a2410!important;border-color:#c9a46a!important}'+
/* ego.html: светлый фон вокруг пергаментной карточки */
L+'.bar{background:#e3cfa3!important}'+
/* Дневник */
L+'.tabs button{background:#fff6e2!important;color:#3a2410!important;border-color:#c9a46a!important}'+L+'.tabs button.on{background:#e8c16c!important;color:#26190b!important}'+
L+'.e{background:#fffaf0!important;border-color:#d9bf8c!important;color:#3a2410}'+L+'.e b{color:#7a4512!important}'+L+'.add{background:#e0a940!important}'+
L+'.dbk{color:#3a2410!important}'+L+'.dbk-note{color:#7a4512!important;background:rgba(232,193,108,.22)!important;border-color:#c9a46a!important}'+L+'.dbk-err{color:#7a4512!important}'+
/* ----- темная: спокойный темный фон ----- */
DK+'body{background:#120d08!important;color:#efe3cf!important}'+
DK+'.sc{background:#21180f!important;color:#efe3cf!important;border:1px solid #5a4325}'+DK+'.sc .q,'+DK+'.sc .ar-title{color:#f0c870!important}'+DK+'.sc .l,'+DK+'.sc .ar-ctx,'+DK+'.sc .ar-blk h3{color:#c4a878!important}'+
DK+'.sc .a{background:#2b2013!important;color:#efe3cf!important;border-color:#9e783a!important}'+DK+'.sc .a.ar-on{background:linear-gradient(#ffe9a8,#e0a940)!important;color:#2a1606!important}'+DK+'.sc p{color:#e6d8bf}'+
DK+'.sc .ar-ph{background:rgba(32,23,14,.6)!important;color:#e8d3ac!important;border-color:#b8893f!important}'+DK+'.sc .ar-ph b{color:#f0c870!important}'+DK+'.sc .ar-ph small{color:#cdb68c!important}'+DK+'.sc .ar-draft{color:#e6d8bf}'+DK+'.sc .ar-skip{color:#e6d8bf}'+
/* ----- читалка Книги Алхимика (где бы ни открылась) ----- */
BL+'.gbk{background:#f2e5ca!important}'+BL+'.gbk-mid{color:#7a4512!important}'+BL+'.gbk-bar{background:linear-gradient(180deg,rgba(246,236,214,.97),rgba(246,236,214,.88))!important;border-bottom-color:#d9bf8c!important}'+
BL+'.gbk-sp{background:#fffaf0!important;color:#5a3a1a!important;border-color:#d9bf8c!important}'+BL+'.gbk-sp b{background:#ecd9b4!important;color:#5a3a1a!important}'+BL+'.gbk-sp.on,'+BL+'.gbk-sp.on b{color:#FFF8EF!important}'+BL+'.gbk-sp.on{background:linear-gradient(180deg,#946420,#6B4517)!important}'+BL+'.gbk-small{color:#6e5028!important}'+
BD+'.gbk{background:#120d08!important}'+BD+'.gbk-card,'+BD+'.dbk-cover{background:#21180f!important;color:#efe3cf!important;box-shadow:0 0 0 1px #4a3620,0 10px 24px rgba(0,0,0,.4)!important}'+
BD+'.gbk-hero h2,'+BD+'.gbk-sh,'+BD+'.dbk-cover h2{color:#f0d29a!important}'+BD+'.gbk-txt p,'+BD+'.gbk-sub,'+BD+'.dbk-cover p{color:#e6d8bf!important}'+BD+'.gbk-txt h4{color:#f0b07a!important}'+BD+'.gbk-k,'+BD+'.dbk-k{color:#f0a06a!important}'+
BD+'.gbk-txt .flow{background:#2e2014!important;color:#f0b07a!important}'+BD+'.dbk-item .dbk-it{color:#efe3cf!important}'+BD+'.dbk-item .dbk-go{color:rgba(240,200,150,.6)!important}'+BD+'.dbk-mi.mlv{color:#efe3cf!important}'+
/* кнопка темы */
'.gthm{display:flex!important;align-items:center;justify-content:center}';
var st=document.createElement('style');st.id='gtheme-css';st.textContent=css;(document.head||H).appendChild(st);
var SUN='<circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/>',
    MOON='<path d="M19.5 14.6A8 8 0 0 1 9.4 4.5a8 8 0 1 0 10.1 10.1z"/>';
function paint(b){var d=get()==='dark';b.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#f0c870" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(d?MOON:SUN)+'</svg>';b.setAttribute('aria-label',d?'Включить светлую тему':'Включить темную тему');b.title=d?'Темная тема':'Светлая тема'}
function set(t){t=t==='dark'?'dark':'light';try{localStorage.setItem(KEY,t)}catch(e){}H.setAttribute('data-theme',t);document.querySelectorAll('.gthm').forEach(paint)}
function button(){var b=document.createElement('button');b.type='button';b.className='gthm';paint(b);b.onclick=function(e){e.preventDefault();set(get()==='dark'?'light':'dark')};return b}
window.addEventListener('storage',function(e){if(e.key===KEY)set(get())});
window.GTheme={get:get,set:set,button:button,themed:on};
})();
