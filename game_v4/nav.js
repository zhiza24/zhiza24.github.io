document.write('<script src="engine.js?v=n2"><\/script><script src="texts.js?v=1"><\/script>');
var _cur=(function(){try{return (JSON.parse(localStorage.getItem('alch_profile'))||{}).flow.last||'form.html'}catch(e){return 'form.html'}})();
(function(){var cur=document.body.dataset.page||'';var _f=location.pathname.split('/').pop()||'index.html';if(_f==='index.html'||_f==='cover_v1.html'||cur==='tracker')return;
var built={'index.html':1,'map.html':1};
function L(h,t,k){return '<a href="'+h+'"'+(k==cur?' class="cur"':'')+'>'+t+'</a>'}
var d=document.createElement('div');d.className='gdraw';d.innerHTML='<div class="sh"></div><div class="pn"><h3>Меню</h3>'+
L('./','Главный вход','cover')+L('map.html?v=9','Карта пути','map')+L('form.html','Инициация','form')+L('hero.html?v=8','Герой','hero')+L(_cur,'Задание','task')+L('diary.html','Дневник','diary')+L('slot.html?id=map_all','Путь по шагам','steps')+L('slot.html?id=map_all','Вся линия игры','all')+L('#soon','Информация и правила','info')+L('#soon','Тема','theme')+'</div>';
var I=JSON.parse("{\"task\": \"<svg viewBox=\\\"0 0 32 32\\\" width=\\\"32\\\" height=\\\"32\\\" fill=\\\"none\\\" stroke=\\\"url(#gg)\\\" stroke-width=\\\"1.8\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"><path d=\\\"M8 6h15a3 3 0 0 1 0 6H11v14a3 3 0 0 1-6 0V9a3 3 0 0 1 3-3z\\\"/><path d=\\\"M23 12v11a3 3 0 0 1-3 3H8\\\"/><path d=\\\"M14 16h6M14 20h6\\\"/></svg>\", \"map\": \"<svg viewBox=\\\"0 0 32 32\\\" width=\\\"32\\\" height=\\\"32\\\" fill=\\\"none\\\" stroke=\\\"url(#gg)\\\" stroke-width=\\\"1.8\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"><circle cx=\\\"16\\\" cy=\\\"16\\\" r=\\\"12\\\"/><circle cx=\\\"16\\\" cy=\\\"16\\\" r=\\\"8.5\\\" stroke-width=\\\"1\\\"/><path d=\\\"M16 4v3M16 25v3M4 16h3M25 16h3\\\"/><path d=\\\"M16 9l3 7-3 7-3-7z\\\" fill=\\\"#e0a940\\\"/></svg>\", \"diary\": \"<svg viewBox=\\\"0 0 32 32\\\" width=\\\"32\\\" height=\\\"32\\\" fill=\\\"none\\\" stroke=\\\"url(#gg)\\\" stroke-width=\\\"1.8\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"><path d=\\\"M6 7c4-1.5 7-1 10 1.5 3-2.5 6-3 10-1.5v18c-4-1.5-7-1-10 1.5-3-2.5-6-3-10-1.5z\\\"/><path d=\\\"M16 8.5v18\\\"/><path d=\\\"M27 3c-4 3-6 7-7 11l1.5.5c2-4 4-7 5.5-11.5z\\\" stroke-width=\\\"1.3\\\"/></svg>\", \"menu\": \"<svg viewBox=\\\"0 0 32 32\\\" width=\\\"32\\\" height=\\\"32\\\" fill=\\\"none\\\" stroke=\\\"url(#gg)\\\" stroke-width=\\\"1.8\\\" stroke-linecap=\\\"round\\\" stroke-linejoin=\\\"round\\\"><path d=\\\"M7 9h18M5 16h22M7 23h18\\\"/><circle cx=\\\"4\\\" cy=\\\"9\\\" r=\\\"1.3\\\"/><circle cx=\\\"28\\\" cy=\\\"9\\\" r=\\\"1.3\\\"/><circle cx=\\\"4\\\" cy=\\\"23\\\" r=\\\"1.3\\\"/><circle cx=\\\"28\\\" cy=\\\"23\\\" r=\\\"1.3\\\"/></svg>\"}");var n=document.createElement('nav');n.className='gnav';
function B(h,i,t,k){return '<a href="'+h+'"'+(k==cur?' class="on"':'')+'><span class="i">'+i+'</span>'+t+'</a>'}
n.innerHTML='<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a8"/><stop offset=".5" stop-color="#e0a940"/><stop offset="1" stop-color="#a8692a"/></linearGradient></defs></svg>'+B(_cur,I.task,'Задание','task')+B('map.html?v=9',I.map,'Карта','map')+'<a href="hero.html?v=8" class="hero'+(cur=='hero'?' on':'')+'"><img src="img/hero_icon.png" alt="">Герой</a>'+B('diary.html',I.diary,'Дневник','diary')+'<a href="#menu" data-menu>'+I.menu+'Меню</a>';
var t=document.createElement('div');t.className='gtoast';t.textContent='Скоро откроется';
document.body.append(n,d,t);
function toast(){t.classList.add('on');setTimeout(function(){t.classList.remove('on')},1600)}
document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.getAttribute('href');
if(a.hasAttribute('data-menu')){e.preventDefault();d.classList.add('open');return}
if(h=='#soon'){e.preventDefault();d.classList.remove('open');toast()}});
d.querySelector('.sh').onclick=function(){d.classList.remove('open')};
window.gToast=toast;})();

/* ===== ЕДИНЫЙ КАРКАС ПУТИ: порядок шагов, верхняя панель, цвет по пути ===== */
window.GFLOW=[
{u:'index.html',pt:'0',t:'Вход в игру'},
{u:'form.html',pt:'0',t:'Инициация: имя и дата рождения'},
{u:'elder.html',pt:'0',t:'Заставка: Старец'},
{u:'hero.html',pt:'0',t:'Герой'},
{u:'scene.html?k=start',pt:'0',t:'Старец: начало пути'},
{u:'choose.html',pt:'0',t:'Выбор карты'},
{u:'scene.html?k=road',pt:'0',t:'Туман: стереть пальцем'},
{u:'bridge.html',pt:'0',t:'Мост'},
{u:'lanterns.html',pt:'0',t:'Фонари'},
{u:'sum.html',pt:'0',t:'Итог отрезка'},
{u:'slot.html?id=dialog',pt:'0',t:'Диалог: спор Эго и Самости'},
{u:'scene.html?k=ego',pt:'0',t:'Маг: вход в тест'},
{u:'ego.html',pt:'0',t:'Тест: фоновое состояние'},
{u:'swipe.html',pt:'0',t:'Игра: свайп хорошего'},
{u:'res.html',pt:'0',t:'Ресурсы и тело'},
{u:'breath.html',pt:'0',t:'Дыхание'},
{u:'fin.html',pt:'0',t:'Триумф: точка 0 пройдена'},
{u:'scene.html?k=pa',pt:'А',t:'Заставка: Зодчий'},
{u:'wheel8.html',pt:'А',t:'Колесо баланса'},
{u:'scene.html?k=pa_test',pt:'А',t:'Зодчий: вход в тест'},
{u:'wheel-test.html',pt:'А',t:'Тест: как на самом деле'},
{u:'slot.html?id=mirrors',pt:'А',t:'Два зеркала'},
{u:'slot.html?id=source',pt:'А',t:'Источник: тело и энергия'},
{u:'slot.html?id=pa_end',pt:'А',t:'Итог Точки А'},
{u:'slot.html?id=pb_intro',pt:'Б',t:'Заставка Точки Б'},
{u:'values.html',pt:'Б',t:'Ценности, Эго или Самость, направления'},
{u:'slot.html?id=sort',pt:'Б',t:'Разбор установки по корзинам'},
{u:'slot.html?id=eraser',pt:'Б',t:'Стирание установки пальцем'},
{u:'slot.html?id=mirage',pt:'Б',t:'Пустыня миражей'},
{u:'slot.html?id=pb_end',pt:'Б',t:'Итог Точки Б'},
{u:'slot.html?id=pc_intro',pt:'С',t:'Заставка Точки С: три действия'},
{u:'reactor.html',pt:'С',t:'Трекер 21 день'},
{u:'slot.html?id=retest',pt:'Финал',t:'Повторный тест'},
{u:'slot.html?id=compare',pt:'Финал',t:'Было и стало'},
{u:'slot.html?id=end',pt:'Финал',t:'Финал пути'}];
window.GSLOTS={
dialog:{k:'Диалог',h:'Спор Эго и Самости',d:'Сцена как в Disco Elysium: Защитник (Эго) и Голос Самости спорят. Игрок выбирает реплику, система показывает, из какого состояния сделан выбор. Итог уходит в дневник.'},
mirrors:{k:'Тест',h:'Два зеркала',d:'Как я вижу себя и как, по-моему, меня видят другие. Сравнение двух отражений, разрыв уходит в копилку тестов.'},
source:{k:'Тест и практика',h:'Источник',d:'Тело и энергия: где напряжение, сколько сил. Короткая телесная практика.'},
pa_end:{k:'Заставка и ответ',h:'Итог Точки А',d:'Зодчий подводит итог: колесо, слабые сферы, список того, что хочется изменить. Артефакт уровня.'},
pb_intro:{k:'Заставка',h:'Точка Б: чего ты хочешь',d:'Появление персонажа Точки Б, как заставка Старца. Вход в ценности и желания.'},
sort:{k:'Игра',h:'Разбор установки по корзинам',d:'Найденная у игрока установка (например «Я должна всем доказать, что чего-то стою») разбирается на части, части раскладываются в корзины Эго и Самости. При ошибке персонаж мягко объясняет, почему это Эго.'},
eraser:{k:'Игра',h:'Стирание установки',d:'Установка Эго появляется на экране, игрок стирает ее пальцем (принцип как у тумана, но своя сцена). Под ней проступает фраза Самости, экран теплеет.'},
mirage:{k:'Тест',h:'Пустыня миражей',d:'Ложные цели и чужие желания: что из желаемого на самом деле не твое.'},
pb_end:{k:'Заставка и ответ',h:'Итог Точки Б',d:'Иерархия ценностей, желания Самости, отпущенные установки. Артефакт уровня.'},
pc_intro:{k:'Заставка',h:'Точка С: три действия',d:'Персонаж Точки С подтверждает три выбранных направления и вводит в трекер на 21 день. Дневник переходит в трекер.'},
retest:{k:'Тест',h:'Повторное колесо',d:'Игрок снова проходит колесо и тест через 21 день.'},
compare:{k:'Ответ',h:'Было и стало',d:'Наложенные колеса до и после, прирост по сферам и по трем направлениям. Доволен ли результатом.'},
end:{k:'Заставка',h:'Финал пути',d:'Финальная сцена, все артефакты героя, путь завершен.'}};
function gIdx(){var f=location.pathname.split('/').pop()||'index.html',q=new URLSearchParams(location.search),k=q.get('k'),id=q.get('id'),L=GFLOW;
for(var i=0;i<L.length;i++){var u=L[i].u,p=u.split('?'),qq=new URLSearchParams(p[1]||'');if(p[0]!==f)continue;if(qq.get('k')&&qq.get('k')!==k)continue;if(qq.get('id')&&qq.get('id')!==id)continue;return i}
if(f==='scene.html'){var m={fog:7,gap:7,fire:7,lvl:9};if(m[k]!==undefined)return m[k]}
if(f==='crystal.html')return 9;if(f==='stage.html'||f==='path.html'||f==='map.html')return -1;return -1}
window.gIdx=gIdx;window.flowNext=function(){var i=gIdx();return i>=0&&i<GFLOW.length-1?GFLOW[i+1].u:null};
;(function(){var pg=document.body.dataset.page||'',f=location.pathname.split('/').pop()||'index.html';
if(f==='index.html'||f==='cover_v1.html'||pg==='tracker')return;
var i=gIdx(),pt=i>=0?GFLOW[i].pt:'';if(i>=0)try{sessionStorage.setItem('gLastStep',GFLOW[i].t);var _P=JSON.parse(localStorage.getItem('alch_profile'))||{};_P.flow=_P.flow||{max:0};if(i>_P.flow.max)_P.flow.max=i;_P.flow.last=GFLOW[i].u;localStorage.setItem('alch_profile',JSON.stringify(_P))}catch(e){}
var sat={'0':.6,'А':.78,'Б':.9,'С':1,'Финал':1.05}[pt];if(sat)document.documentElement.style.filter='saturate('+sat+')';
document.querySelectorAll('.gtopb,.garr').forEach(function(e){e.remove()});
var st=document.createElement('style');st.textContent='.gtop{position:fixed;left:0;right:0;top:0;z-index:60;display:flex;align-items:center;gap:8px;padding:calc(8px + env(safe-area-inset-top)) 10px 8px;background:linear-gradient(#0c0804ee,#0c080400);pointer-events:none}.gtop button{pointer-events:auto;width:40px;height:40px;border-radius:50%;border:1.5px solid #c99a45;background:rgba(58,36,12,.9);color:#f0c870;font:800 22px Manrope,sans-serif;line-height:36px;padding:0;cursor:pointer}.gtop button.off{opacity:.3}.gtop .gpt{flex:1;text-align:center;color:#f0c870;font:700 13px Manrope,sans-serif;letter-spacing:.5px;text-shadow:0 1px 3px #000}';document.head.appendChild(st);
var bar=document.createElement('div');bar.className='gtop';var b=document.createElement('button'),t=document.createElement('div'),fw=document.createElement('button');b.textContent='‹';fw.textContent='›';b.setAttribute('aria-label','Назад');fw.setAttribute('aria-label','Вперед');t.className='gpt';t.textContent=pt?('Точка '+pt+(pt==='Финал'?'':'')).replace('Точка Финал','Финал')+' · '+GFLOW[i].t:'';bar.append(b,t,fw);document.body.appendChild(bar);
function P(){try{return JSON.parse(localStorage.getItem('alch_profile'))||{}}catch(e){return{}}}
function ok(){if(f==='form.html'){var p=P();return !!(p.name&&p.birth&&p.birth.length==10&&p.gender&&p.points)}return true}
function nxt(){return window.gNext||flowNext()}
setInterval(function(){fw.classList.toggle('off',!nxt()||!ok())},500);
b.onclick=function(){if(window.gBack&&window.gBack())return;if(i>0)location.href=GFLOW[i-1].u;else history.back()};
fw.onclick=function(){var n=nxt();if(!n)return;if(!ok()){if(window.gToast){var tt=document.querySelector('.gtoast');if(tt){tt.textContent='Сначала заполните этот шаг';gToast();setTimeout(function(){tt.textContent='Скоро откроется'},1700)}}return}location.href=n}})();
