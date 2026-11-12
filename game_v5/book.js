/* Книга Алхимика: главы практикума «Архитектура личности» из «Точки отсчета», по шагу пути.
   Тексты в tochka-book.js (дословно), грузятся по нажатию. Кнопка в верхней панели .gtop. */
(function(){
if(window.GBook)return;
var V='b5';
/* шаг GFLOW (u) -> [глава 0..11, раздел или -1] */
var MAP={
'index.html':[0,-1],'form.html':[0,-1],'elder.html':[0,-1],
'hero.html':[1,-1],'choose.html':[1,-1],
'scene.html?k=road':[2,-1],
'bridge.html':[3,-1],
'breath.html?at=p0':[9,-1],'cutscene.html':[9,-1],
'sum.html':[4,-1],
'slot.html?id=dialog':[5,-1],
'scene.html?k=ego':[7,-1],'ego.html':[7,-1],
'swipe.html':[4,1],
'res.html':[8,-1],
'breath.html':[9,-1],
'fin.html':[11,-1],
'scene.html?k=pa':[11,-1],'wheel8.html':[11,-1],'scene.html?k=pa_test':[11,-1],'wheel-test.html':[11,-1],
'slot.html?id=mirrors':[6,-1],
'slot.html?id=source':[10,-1],
'values.html':[6,2],
'slot.html?id=pa_end':[11,-1],
'slot.html?id=pb_intro':[5,-1],
'slot.html?id=evidence':[7,-1],
'slot.html?id=sort':[3,1],
'slot.html?id=eraser':[6,1],
'slot.html?id=mirage':[4,-1],'slot.html?id=arch_b':[7,-1],'slot.html?id=arch_v':[4,1],'slot.html?id=arch_p':[5,2],'slot.html?id=arch_d':[8,-1],
'slot.html?id=found':[3,2],
'slot.html?id=pb_end':[8,-1],
'slot.html?id=fractal':[4,2],
'slot.html?id=leverage':[5,2],
'slot.html?id=guard':[6,-1],
'slot.html?id=pc_intro':[10,-1],
'reactor.html':[10,-1],
'slot.html?id=retest':[11,-1],'slot.html?id=compare':[11,-1],'slot.html?id=end':[11,-1]};
/* названия глав (как в BOOK), чтобы подпись в панели была без загрузки текста */
var TT=['Приветствие','Возвращение к себе','Карта исследования','Уровень I. Создание внутреннего узора','Уровень II. Фокус внимания','Уровень III. Новая позиция','Уровень IV. Пересборка внутреннего узора','Инструмент самодиагностики','Новая точка сборки','Практика «Я есмь»','Новая настройка системы','Карта пройденного пути'];
/* разделы уровней — как SUBS в приложении */
var SUBS={3:[[5,'Принцип 4. Формирование узора'],[11,'Принцип 5. Первая модель — эталон'],[24,'Принцип 6. Адаптация — автоматизм'],[30,'Смещение центра внимания']],
4:[[6,'Принцип 8. Внимание формирует реальность'],[19,'Принцип 9. Состояние задает направление'],[53,'Мозг не противник'],[76,'Настоящий момент — точка выбора']],
5:[[6,'Принцип 10. Позиция и реальность'],[16,'Принцип 11. Момент — точка выбора'],[25,'Центр — Я'],[61,'Карта путешествия']],
6:[[4,'Перестаньте «чинить» себя'],[21,'Принцип 7. Самоценность прежде оценки']]};
var LVN={0:['ПРАКТИКУМ','ВМЕСТО ПРЕДИСЛОВИЯ'],1:['ПРАКТИКУМ','ВВЕДЕНИЕ'],2:['ПРАКТИКУМ','ВВЕДЕНИЕ'],3:['УРОВЕНЬ 1','СОЗДАНИЕ УЗОРА'],4:['УРОВЕНЬ 2','ФОКУС ВНИМАНИЯ'],5:['УРОВЕНЬ 3','НОВАЯ ПОЗИЦИЯ'],6:['УРОВЕНЬ 4','ПЕРЕСБОРКА УЗОРА'],7:['ИССЛЕДОВАНИЕ','ВЕДУЩИЙ УЗОР'],8:['ПОСЛЕ ТЕСТА','НОВАЯ ТОЧКА СБОРКИ'],9:['ЕЖЕДНЕВНО','ПРАКТИКИ'],10:['ПОСЛЕ ТЕСТА','НОВАЯ ТОЧКА СБОРКИ'],11:['ЗАВЕРШЕНИЕ','КАРТА ПРОЙДЕННОГО ПУТИ']};
var CHIMG=['cover','stage1','stage2','stage1','stage3','stage5','stage4','stage2','stage4','stage5','stage6','stage6'];
var SK='alch_v5_book_seen';
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function SL(t){if(/^Вступление/.test(t))return'Вступление';var m=/^Принцип (\d+)/.exec(t);if(m)return'Принцип '+m[1];var w=t.replace(/[«»✦]/g,'').split(' ').filter(function(x){return/[А-Яа-я]/.test(x)});if(!w.length)return t;if(w[0].length<5||(w[1]&&(w[0]+' '+w[1]).length<=13))return w.slice(0,2).join(' ');return w[0]}
/* разделы главы: для уровней — как в приложении; для остальных — по заголовкам «#✦», иначе по коротким заголовкам «#» */
function SEC(n,B){var p=B[n].p,L=SUBS[n];
 if(!L){L=[];p.forEach(function(x,i){if(x[0]==='#'&&x[1]==='✦')L.push([i,x.slice(1).replace(/^✦\s*/,'')])});
  if(!L.length)p.forEach(function(x,i){var t=x.slice(1);if(x[0]==='#'&&i>0&&t.length<60&&t!=='Майя Явь'&&t!=='Архитектура личности')L.push([i,t])})}
 var o=[];if(!L.length||L[0][0]>0)o.push({a:0,t:SUBS[n]?'Вступление к уровню':'Вступление'});L.forEach(function(x){o.push({a:x[0],t:x[1]})});
 o.forEach(function(x,k){x.b=k+1<o.length?o[k+1].a:p.length});return o}
function para(p,i,arr){if(p==='KEY')return'';if(arr[i-1]==='KEY')return'<div class="key"><small>🔑 Ключ Архитектуры личности</small>'+esc(p)+'</div>';
 if(p[0]==='#'){var t=p.slice(1);if(t.indexOf('✦')===0)return'<h4 class="pr">'+esc(t)+'</h4>';return t.length<60?'<h4>'+esc(t)+'</h4>':'<p><b>'+esc(t)+'</b></p>'}
 if(/^(—|–|●|•|\d+\))/.test(p))return'<p class="li2">'+esc(p.replace(/^[●•]\s*/,''))+'</p>';
 if(/→/.test(p)&&p.length<160)return'<p class="flow">'+esc(p)+'</p>';return'<p>'+esc(p)+'</p>'}
function cur(){var i=window.gIdx?gIdx():-1;if(i<0||!window.GFLOW)return null;var m=MAP[GFLOW[i].u];return m?{n:m[0],s:m[1]}:null}
function isPreview(){try{return new URLSearchParams(location.search).get('preview')==='1'}catch(e){return false}}
function unlocked(n){if(isPreview())return true;if(!window.GRoute||!window.GFLOW)return n===0;
 var ok=false;GFLOW.forEach(function(step){var m=MAP[step.u];if(!m||m[0]!==n)return;var st=GRoute.status(step.u);if(st==='done'||st==='current')ok=true});return ok}
function unlockedSet(){var o={};for(var i=0;i<TT.length;i++)if(unlocked(i))o[i]=true;return o}
function seen(){try{return localStorage.getItem(SK)}catch(e){return null}}
function cap(x){x=x.toLowerCase();return x.charAt(0).toUpperCase()+x.slice(1)}
function label(c){return SUBS[c.n]?cap(LVN[c.n][0])+' · '+cap(LVN[c.n][1]):TT[c.n]}
var btn,ov,loaded=false,openSrc='path';
function ensureFont(){if(document.getElementById('gbk-font'))return;var l=document.createElement('link');l.id='gbk-font';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap';document.head.appendChild(l)}
function load(cb){if(window.TBOOK)return cb();var s=document.createElement('script');s.src='tochka-book.js?v='+V;s.onload=function(){cb&&cb()};s.onerror=function(){cb&&cb(new Error('book'))};document.head.appendChild(s)}
function open(){var c=cur();if(!c)return;openAt(c,'path')}
function openChapter(n,s,src){if(!unlocked(n))return false;openAt({n:n,s:s==null?-1:s},src||'path');return true}
function openAt(c,src){openSrc=src||'path';try{localStorage.setItem(SK,String(c.n))}catch(e){}if(btn)btn.classList.remove('gbk-glow');ensureFont();load(function(){render(c)})}
function close(){if(ov){ov.classList.remove('on');document.documentElement.classList.remove('gbk-lock')}}
function render(c){var B=window.TBOOK,n=c.n,ch=B[n],L=SEC(n,B),H=ch.p.map(para);
 var tabs=L.length>1?'<nav class="gbk-bar" aria-label="Разделы">'+L.map(function(x,j){return'<button class="gbk-sp" data-s="'+j+'" aria-label="'+(j+1)+'. '+esc(x.t)+'"><b>'+(j+1)+'</b> '+esc(SL(x.t))+'</button>'}).join('')+'</nav>':'';
 var secs=L.map(function(x,j){var hp=ch.p[x.a],dup=hp&&hp[0]==='#'&&j>0,t=dup?hp.slice(1).replace(/^✦\s*/,''):x.t;
  return'<section class="gbk-card gbk-sect" id="gbk-s'+j+'"><h3 class="gbk-sh">'+(L.length>1?'<span class="gbk-num">'+(j+1)+'</span>':'')+'<span>'+esc(t)+'</span></h3><div class="gbk-txt">'+H.slice(dup?x.a+1:x.a,x.b).join('')+'</div></section>'}).join('');
 if(!ov){ov=document.createElement('div');ov.className='gbk';ov.setAttribute('role','dialog');ov.setAttribute('aria-modal','true');document.body.appendChild(ov)}
 ov.innerHTML='<div class="gbk-hdr"><div class="gbk-mid">'+esc(LVN[n][0].charAt(0)+LVN[n][0].slice(1).toLowerCase())+'</div><button class="gbk-x" aria-label="Закрыть">✕</button></div>'+
  '<div class="gbk-sc" id="gbk-sc"><section class="gbk-card gbk-hero"><div class="gbk-img" style="background-image:url(img/tochka/'+CHIMG[n]+'.webp)"></div><div class="gbk-in"><div class="gbk-k">Глава '+(n+1)+' · '+esc(LVN[n][0])+' · '+esc(LVN[n][1])+'</div><h2>'+esc(ch.t)+'</h2><div class="gbk-sub">'+esc(ch.s)+'</div></div></section>'+tabs+secs+
  '<button class="gbk-back">'+(openSrc==='diary'?'Вернуться в дневник':'Вернуться в путь')+'</button><p class="gbk-small">Книга Алхимика · по методу «Архитектура личности»</p></div>';
 document.documentElement.classList.add('gbk-lock');ov.classList.add('on');
 var sc=ov.querySelector('.gbk-sc'),nb=ov.querySelector('.gbk-bar'),S=[].slice.call(ov.querySelectorAll('.gbk-sect'));
 function off(){return nb?nb.offsetHeight+8:0}
 function Y(e){return e.getBoundingClientRect().top-sc.getBoundingClientRect().top+sc.scrollTop-off()}
 function spy(){if(!nb)return;var a=0;S.forEach(function(e,j){if(Y(e)<=sc.scrollTop+40)a=j});if(sc.scrollTop+sc.clientHeight>=sc.scrollHeight-4)a=S.length-1;
  [].forEach.call(nb.querySelectorAll('.gbk-sp'),function(b,j){var was=b.classList.contains('on');b.classList.toggle('on',j===a);if(j===a&&!was)nb.scrollTo({left:b.offsetLeft-nb.clientWidth/2+b.offsetWidth/2,behavior:'smooth'})})}
 function go(j,sm){var e=S[j];if(!e)return;if(nb){[].forEach.call(nb.querySelectorAll('.gbk-sp'),function(b,i){b.classList.toggle('on',i===j)})}sc.scrollTo({top:Y(e),behavior:sm?'smooth':'auto'})}
 [].forEach.call(ov.querySelectorAll('.gbk-sp'),function(b){b.onclick=function(){go(+b.dataset.s,1)}});
 ov.querySelector('.gbk-x').onclick=close;ov.querySelector('.gbk-back').onclick=close;
 sc.addEventListener('scroll',spy,{passive:true});sc.scrollTop=0;if(c.s>0)go(c.s,0);spy()}
function init(){var bar=document.querySelector('.gtop'),c=cur();if(!bar||!c||btn)return;
 ensureFont();
 var l=document.createElement('link');l.rel='stylesheet';l.href='book.css?v='+V;document.head.appendChild(l);
 var pt=bar.querySelector('.gpt');bar.classList.add('gbk-has');
 if(pt&&!bar.querySelector('.gtools')){var w=document.createElement('div');w.className='gpt gbk-tw';var a=document.createElement('div');a.className='gbk-t1';a.textContent=pt.textContent;var b=document.createElement('div');b.className='gbk-t2';b.textContent=label(c);w.append(a,b);pt.replaceWith(w)}
 btn=document.createElement('button');btn.className='gbk-btn';btn.type='button';btn.setAttribute('aria-label','Книга Алхимика: '+label(c));
 btn.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#FFF8EF" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 5.5c3-1 5.6-.7 8.5 1.2 2.9-1.9 5.5-2.2 8.5-1.2v13c-3-1-5.6-.7-8.5 1.2-2.9-1.9-5.5-2.2-8.5-1.2z"/><path d="M12 6.7v13"/><path d="M6 9.3h3.3M6 12.3h3.3M14.7 9.3H18M14.7 12.3H18"/></svg>';
 var fw=bar.lastElementChild,grp=bar.querySelector('.gtools');if(grp)grp.append(btn);else bar.insertBefore(btn,fw);
 if(seen()!==String(c.n))btn.classList.add('gbk-glow');
 btn.onclick=function(e){e.preventDefault();e.stopPropagation();open()};
 document.addEventListener('keydown',function(e){if(e.key==='Escape')close()})}
window.GBook={open:open,close:close,map:MAP,cur:cur,load:load,SEC:SEC,SL:SL,TT:TT,LVN:LVN,SUBS:SUBS,CHIMG:CHIMG,unlocked:unlocked,isPreview:isPreview,unlockedSet:unlockedSet,openChapter:openChapter,para:para,esc:esc,label:label,ensureFont:ensureFont,V:V};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
