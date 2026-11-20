/* Сборные карты по точкам пути: портрет Точки 0, карта исходного положения (А),
   карта противоречий (Б) и личная карта пути (Финал).
   Ничего не вычисляет заново: берет уже полученные результаты из GHM (heromap.js)
   и артефакты героя. Пустые блоки не показываются. */
(function(){
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function load(){try{return JSON.parse(localStorage.getItem('alch_v5_profile'))||{}}catch(e){return {}}}
function ptOf(u){var F=window.GFLOW||[];for(var i=0;i<F.length;i++)if(F[i].u===u)return F[i].pt;return null}
function css(){if(document.getElementById('gm-css'))return;var s=document.createElement('style');s.id='gm-css';s.textContent=
'.gm{margin:12px 0;text-align:left}.gm-it{margin:8px 0;padding:10px 12px;border-radius:12px;border-left:3px solid #c99a45;background:rgba(201,154,69,.10)}'+
'.gm-it>b{display:block;font:700 12px Manrope,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#a8762f;margin-bottom:4px}'+
'.gm-it p{margin:4px 0}.gm-it .hm-q{font-weight:700;margin:2px 0}.gm-it ul,.gm-it ol{margin:4px 0;padding-left:20px}.gm-it details summary{cursor:pointer;color:#a8762f}'+
'.gm-h{font:700 13px Manrope,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#a8762f;margin:16px 0 6px}'+
'.gm-arts{display:flex;flex-wrap:wrap;gap:6px}.gm-art{padding:6px 10px;border:1px solid rgba(201,154,69,.6);border-radius:999px;font-size:14px}'+
'.gm-ch{display:inline-block;margin:4px;padding:8px 12px;border:1.5px solid #c99a45;border-radius:999px;background:transparent;color:inherit;font:600 15px Manrope,sans-serif;cursor:pointer}'+
'.gm-ch.on{background:linear-gradient(#ffe9a8,#e0a940);color:#2a1606}';document.head.appendChild(s)}
/* items: результаты, полученные на шагах выбранных точек */
function items(P,pts){if(!window.GHM)return [];return GHM.done(P).filter(function(x){return pts.indexOf(ptOf(x.u))>=0})}
function arts(P,pts){var L=(P.arts||[]);if(!window.GArts)return L.map(function(a){return {n:a,i:'✦'}});
 return L.map(function(a){return {n:GArts.label(a,P),i:GArts.icon?GArts.icon(a):'✦'}})}
function block(x){return '<div class="gm-it"><b>'+esc(x.name)+'</b>'+x.html+'</div>'}
function render(box,pts,opts,cb){opts=opts||{};css();
 var go=function(){var P=load(),L=items(P,pts),h='';
  if(opts.extra)h+=opts.extra(P)||'';
  h+=L.length?L.map(block).join(''):'<p>Результаты появятся, когда ты пройдешь шаги этой части пути.</p>';
  if(opts.arts){var A=arts(P);if(A.length)h+='<div class="gm-h">Артефакты героя</div><div class="gm-arts">'+A.map(function(a){return '<span class="gm-art">'+esc(a.i)+' '+esc(a.n)+'</span>'}).join('')+'</div>'}
  box.innerHTML='<div class="gm">'+h+'</div>';if(cb)cb(P,L)};
 if(window.GHM)GHM.ready(go);else{var s=document.createElement('script');s.src='heromap.js?v=map1';s.onload=function(){GHM.ready(go)};s.onerror=go;document.head.appendChild(s)}}
/* выбор до трех зон для дальнейшего исследования из полученных результатов */
function zones(box,list,key,max,onChange){max=max||3;var P=load();P.maps=P.maps||{};var sel=(P.maps[key]||[]).slice();
 box.innerHTML=list.map(function(n){return '<button type="button" class="gm-ch'+(sel.indexOf(n)>=0?' on':'')+'">'+esc(n)+'</button>'}).join('');
 [].forEach.call(box.querySelectorAll('.gm-ch'),function(b,i){b.onclick=function(){var n=list[i],j=sel.indexOf(n);if(j>=0)sel.splice(j,1);else{if(sel.length>=max)return;sel.push(n)}
  var P=load();P.maps=P.maps||{};P.maps[key]=sel.slice();localStorage.setItem('alch_v5_profile',JSON.stringify(P));b.classList.toggle('on',sel.indexOf(n)>=0);if(onChange)onChange(sel)}})}
window.GMaps={render:render,items:items,zones:zones,esc:esc,load:load,ptOf:ptOf};
})();
