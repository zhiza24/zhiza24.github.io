/* Read-only list and review: this page never initializes or saves profile data. */
(function(){
'use strict';
const p=GRoute.load(),state=GRoute.state(p),host=document.getElementById('tasks'),q=new URLSearchParams(location.search);
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function para(parent,text,cls){parent.append(el('p',text,cls));}
function link(parent,text,url,primary=false){const a=el('a',text,primary?'primary':'');a.href=url;parent.append(a);return a;}
function date(t){return new Date(t).toLocaleString('ru-RU',{timeZone:'Europe/Moscow',dateStyle:'short',timeStyle:'short'})+' (МСК)';}
function title(step){return step.t.replace(/ё/g,'е');}
function review(u){
 const step=GFLOW.find(x=>x.u===u);if(!step||GRoute.status(u,p)!=='done'){para(host,'Этот шаг пока закрыт. Сначала заверши актуальное задание.','task-notice');return false;}
 if(GRoute.visualReview(u)){location.replace(GRoute.reviewUrl(u));return true;}
 host.append(el('h1',title(step)));para(host,'Просмотр пройденного этапа. Ответы, даты и продвижение не меняются.','task-notice');
 const at=(p.flow||{}).completed?.[u];if(at)para(host,'Завершено '+date(at),'muted');
 const box=el('section',undefined,'task-review'),saved=p.flow?.results?.[u];
 const screenIds={'slot.html?id=source':'SOURCE','slot.html?id=pa_end':'POINT_A_RESULT','slot.html?id=pb_intro':'POINT_B_INTRO','slot.html?id=mirage':'DESERT_OF_MIRAGES','slot.html?id=pc_intro':'POINT_C_INTRO'};
 const screen=screenIds[u]&&GScr(screenIds[u]);if(screen)(screen.paragraphs||[]).forEach(t=>para(box,String(GT(t)).replace(/ё/g,'е')));
 const snap=saved||GRoute.snapshot(u,p);renderData(box,snap.data);
 if(saved&&saved.logs?.length){const logs=el('details');logs.append(el('summary','Записи на момент прохождения'));saved.logs.forEach(l=>para(logs,l.x||l.r||''));box.append(logs);}
 if(!box.childNodes.length)para(box,'Отдельные ответы для этой сцены не сохранялись. Отметка о прохождении сохранена; заново запускать сцену для просмотра не нужно.');
 if(!saved&&Object.keys(snap.data).length)para(box,'Показаны доступные сохраненные данные. В старой версии отдельный снимок этого этапа мог не сохраняться.','muted');
 host.append(box);
 if(window.GHM)GHM.ready(function(){const it=GHM.done(p).filter(x=>x.u===u);if(!it.length)return;GHM.css();box.id='hmBox';box.innerHTML=it.map(x=>'<div class="hm-it"><div class="hm-n">'+x.name+'</div>'+x.html+'</div>').join('');});
 if(u==='slot.html?id=mirrors'&&p.mirrors?.history?.length){const r=p.mirrors.history[p.mirrors.history.length-1];link(host,'Посмотреть оба зеркала','slot.html?id=mirrors&review='+encodeURIComponent(r.id));}
 link(host,'К списку заданий','tasks.html');if(!state.finished)link(host,'Продолжить актуальный шаг',state.url,true);return true;
}
const labels={archResult:'Итог',archMap:'Моя карта',name:'Имя',birth:'Дата рождения',gender:'Обращение',arts:'Артефакты',mapStyle:'Выбранная дорога',hand:'Ответы на мосту',handTop:'Наблюдение',ego:'Фоновое состояние',dq:'Открытия',res:'Ресурсы',body:'Тело',wheel:'Первый взгляд на сферы',wheelTest:'Подробное исследование сфер',spheres:'Сферы',ratings:'Оценки',answers:'Ответы',improvements:'Желаемые изменения',average:'Средняя оценка',change:'Хочется изменить',strength:'Сила желания',urgency:'Когда',values:'Ценности',order:'Твой порядок',focuses:'Направления',mirror_exercise:'Два зеркала',self_image:'Представление о себе',actual_actions:'Действия',main_observation:'Наблюдение',personal_note:'Личная запись',selected_text:'Выбранный ответ',custom_answer:'Свой ответ',example:'Пример',clarification:'Возможные причины',cause_note:'Своя причина',dialog:'Диалог',fractal:'Наблюдения и связи',evidence:'Примеры',situation:'Ситуация',player_comment:'Уточнение',rule:'Правило',threat:'Опасение',benefit:'Что помогает',cost:'Цена',reaction:'Реакция',lever:'Точка влияния',action:'Действие',title:'Название',lab:'Сохраненный итог',guard:'Встреча со Стражем',reactor:'Практика в жизни',day:'Засчитано дней',days:'Задания по дням',notes:'Записи',done:'Практик выполнено',full:'Полных дней',retest:'Повторный замер',beh:'Ответы об изменениях',f:'Прогноз',a:'Действие',r:'Итог',v:'Вывод',s:'Ситуация',b:'Раньше',n:'Теперь',period_start:'Начало периода',period_end:'Конец периода',start:'Начало дела',obstacle:'Препятствия',desire:'Желания',boundary:'Границы',decision:'Решения',promise:'Обещания себе'};
const skip=new Set(['version','id','option_id','question_id','saved_at','started_at','completed_at','updatedAt','cursor','history','comparison','key','score','sources','queue','lead','foundScore','ver','prioritiesChosen','priorities','averages','completed','pair_notes','passportPractices']);
function renderData(parent,data,depth=0){
 if(data===null||data===undefined||data==='')return;
 if(typeof data!=='object'){para(parent,typeof data==='boolean'?(data?'Да':'Нет'):String(data));return;}
 Object.entries(data).forEach(([key,value])=>{
  if(skip.has(key)||value===null||value===undefined||value==='')return;
  if(depth>7)return;
  const section=el('details');section.append(el('summary',labels[key]||(/^\d+$/.test(key)?'Запись '+(Number(key)+1):'Ответ')));
  if(key==='gender')para(section,value==='f'?'Женское':'Мужское');else renderData(section,value,depth+1);
  if(section.childNodes.length>1)parent.append(section);
 });
}
if(q.has('review')&&review(q.get('review')))return;
host.append(el('h1','Задания'));
if(q.has('locked'))para(host,'Этот этап еще закрыт. Он откроется после предыдущих шагов.','task-notice');
const current=GFLOW[state.index],hero=el('section',undefined,'task-hero');
hero.append(el('h2',state.finished?'Путь завершен':'Сейчас: '+title(current)));
para(hero,state.finished?'Можно спокойно просмотреть пройденные этапы.':'Следующий шаг определяется завершенными заданиями, а не последней открытой страницей.');
if(!state.finished)link(hero,'Продолжить',state.url,true);
if(state.url==='reactor.html'&&!state.finished)para(hero,'Реактор: засчитано '+Math.max(0,Math.min(21,p.reactor?.day||0))+' из 21 дней.');
host.append(hero);
const SKF={'slot.html?id=arch_b':'archB','slot.html?id=arch_v':'archV','slot.html?id=arch_p':'archP','slot.html?id=arch_d':'archD','slot.html?id=km':'kmTest','slot.html?id=fs':'firstSet','slot.html?id=lab_d':'desireLab','slot.html?id=pi':'interact','slot.html?id=rs':'respTest','slot.html?id=ct':'ctTest','slot.html?id=sv':'selfWorth','slot.html?id=vsort':'valuesCore'};
const SK=GFLOW.map(x=>x.u).filter(u=>((p.flow||{}).archSkipped||{})[u]&&SKF[u]&&!(p[SKF[u]]&&p[SKF[u]].v));
if(SK.length){const sk=el('section',undefined,'task-block task-skipped');sk.id='skipped';sk.append(el('h2','Пропущенные тесты'));para(sk,'Эти испытания появились в игре позже, и ты '+(window.GG?GG('прошел','прошла'):'прошел')+' дальше без них. Их можно пройти сейчас: прогресс не сбросится, а результаты добавятся в Карту героя и Дневник.','muted');SK.forEach(u=>{const st=GFLOW.find(x=>x.u===u),card=el('article',undefined,'task-card skipped');card.dataset.step=u;card.append(el('span','○ Пропущено','task-status'),el('h3',title(st)));link(card,'Пройти',u+(u.includes('?')?'&':'?')+'retake=1');sk.append(card)});host.append(sk);}
para(host,'Пройденное открывается только для просмотра. Текущий шаг выделен. Следующие этапы откроются по порядку.','muted');
let block=null,point=null;
GFLOW.forEach((step,i)=>{
 if(point!==step.pt){point=step.pt;block=el('section',undefined,'task-block');block.id='block-'+point;block.append(el('h2',point==='Финал'?'Финал':'Точка '+point));host.append(block);}
 const status=GRoute.status(step.u,p),card=el('article',undefined,'task-card '+status);card.dataset.step=step.u;card.dataset.status=status;
 if(status==='current'&&!state.finished)card.setAttribute('aria-current','step');
 card.append(el('span',status==='done'?'✓ Пройдено':status==='current'?'◆ Актуальный шаг':'🔒 Пока закрыто','task-status'),el('h3',title(step)));
 if(status==='done')link(card,'Посмотреть',GRoute.reviewUrl(step.u));else if(status==='current')link(card,'Продолжить',step.u,true);else para(card,'Откроется после предыдущих шагов.','muted');
 block.append(card);
});
})();
