/* Вкладка «Книга Алхимика» в дневнике: оглавление практикума без теста. */
(function(){
if(window.GDiaryBook)return;
var GROUPS=[
 {l:'ПРАКТИКУМ',t:'ВМЕСТО ПРЕДИСЛОВИЯ',cls:'mintro',ch:[0]},
 {l:'ПРАКТИКУМ',t:'ВВЕДЕНИЕ',cls:'mintro',ch:[1,2]},
 {l:'УРОВЕНЬ 1',t:'СОЗДАНИЕ УЗОРА',cls:'mlv',ch:[3]},
 {l:'УРОВЕНЬ 2',t:'ФОКУС ВНИМАНИЯ',cls:'mlv',ch:[4]},
 {l:'УРОВЕНЬ 3',t:'НОВАЯ ПОЗИЦИЯ',cls:'mlv',ch:[5]},
 {l:'УРОВЕНЬ 4',t:'ПЕРЕСБОРКА УЗОРА',cls:'mlv',ch:[6]},
 {l:'ИССЛЕДОВАНИЕ',t:'ВЕДУЩИЙ УЗОР',cls:'mtest',ch:[7]},
 {l:'ЕЖЕДНЕВНО',t:'ПРАКТИКИ',cls:'mpr',ch:[9]},
 {l:'ПОСЛЕ ТЕСТА',t:'НОВАЯ ТОЧКА СБОРКИ',cls:'mgold',ch:[8,10]},
 {l:'ЗАВЕРШЕНИЕ',t:'КАРТА ПРОЙДЕННОГО ПУТИ',cls:'mmap',ch:[11]}
];
var openG=-1;
function esc(s){return window.GBook?GBook.esc(s):String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function title(n){var B=window.TBOOK;return (B&&B[n]&&B[n].t)||(window.GBook&&GBook.TT[n])||('Глава '+(n+1))}
function sections(n){if(!window.GBook||!window.TBOOK)return [];try{return GBook.SEC(n,TBOOK)||[]}catch(e){return []}}
function groupOpen(g){return g.ch.some(function(n){return GBook.unlocked(n)})}
function item(n,s,lab,idx){
 var on=GBook.unlocked(n);
 var t=lab||title(n);
 if(!on)return '<button type="button" class="dbk-item lock" disabled data-n="'+n+'" aria-disabled="true"><span class="dbk-num">'+(idx+1)+'</span><span class="dbk-it">'+esc(t)+'<span class="dbk-lock">Откроется дальше по пути</span></span></button>';
 return '<button type="button" class="dbk-item" data-n="'+n+'" data-s="'+(s==null?-1:s)+'"><span class="dbk-num">'+(idx+1)+'</span><span class="dbk-it">'+esc(t)+'</span><span class="dbk-go">›</span></button>';
}
function html(){
 var note=GBook.isPreview()?'<p class="dbk-note">Все главы открыты для просмотра.</p>':'';
 var menu=GROUPS.map(function(g,gi){
  var any=groupOpen(g);
  var rows=[];
  var idx=0;
  g.ch.forEach(function(n){
   var L=GBook.SUBS[n]?sections(n):[];
   if(L.length>1){L.forEach(function(x,j){rows.push(item(n,j,x.t,idx++));});}
   else rows.push(item(n,-1,title(n),idx++));
  });
  var head='<button type="button" class="dbk-mi '+g.cls+(any?'':' lock')+'" data-g="'+gi+'" aria-expanded="'+(openG===gi)+'"><span class="dbk-mt"><small>'+esc(g.l)+'</small><b>'+esc(g.t)+'</b></span><span class="dbk-ma">⌄</span></button>';
  return '<div class="dbk-grp'+(openG===gi?' open':'')+'" data-grp="'+gi+'">'+head+'<div class="dbk-sub">'+rows.join('')+'</div></div>';
 }).join('');
 return '<div class="dbk"><section class="dbk-cover"><div class="dbk-cover-img" style="background-image:url(img/tochka/cover.webp)"></div><div class="dbk-cover-in"><div class="dbk-k">Майя Явь · Архитектура личности</div><h2>Книга Алхимика</h2><p>Двенадцать глав практикума. Они открываются по мере пути и собираются здесь, чтобы их можно было перечитать.</p></div></section>'+note+'<div class="dbk-menu" role="list">'+menu+'</div></div>';
}
function bind(el){
 el.querySelectorAll('[data-g]').forEach(function(b){
  b.onclick=function(){var gi=+b.dataset.g;openG=openG===gi?-1:gi;paint(el)};
 });
 el.querySelectorAll('.dbk-item:not(.lock)').forEach(function(b){
  b.onclick=function(){GBook.openChapter(+b.dataset.n,+b.dataset.s,'diary')};
 });
}
function paint(el){
 if(!window.GBook||!window.TBOOK){el.innerHTML='<p class="dbk-err">Не удалось открыть книгу. Обновите страницу.</p>';return}
 el.innerHTML=html();
 bind(el);
}
function render(el){
 if(!el)return;
 if(!window.GBook){el.innerHTML='<p class="dbk-err">Книга загружается...</p>';return}
 GBook.ensureFont();
 GBook.load(function(err){if(err){el.innerHTML='<p class="dbk-err">Не удалось открыть книгу. Обновите страницу.</p>';return}paint(el)});
}
window.GDiaryBook={render:render,GROUPS:GROUPS};
})();
