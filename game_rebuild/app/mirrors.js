/* Local-only scene controller. Opening and reviewing never complete a route step. */
(function(){
'use strict';
const D=window.GMirrorData, URL_SCENE='slot.html?id=mirrors';
const copy=x=>JSON.parse(JSON.stringify(x));
function load(){return JSON.parse(localStorage.getItem('alch_v5_profile')||'{}')||{};}
function el(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function typ(s){return String(s==null?'':s).replace(/§([^§|]+)\|([^§]+)§/g,(_,m,f)=>window.GG?GG(m,f):m);}
function button(parent,text,fn,cls=''){const b=el('button',text,cls);b.type='button';b.onclick=fn;parent.append(b);return b;}
function paragraph(parent,text,cls){parent.append(el('p',text,cls));}
function field(parent,label,value,oninput){const l=el('label',label,'mirror-field'),t=el('textarea');t.rows=3;t.maxLength=4000;t.value=value||'';t.oninput=()=>oninput(t.value);l.append(t);parent.append(l);return t;}
function date(value){return value.split('-').reverse().join('.');}
function stamp(value){return new Date(value).toLocaleString('ru-RU',{timeZone:'Europe/Moscow',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})+' (МСК)';}
function metaphor(parent,active){const row=el('div',undefined,'mirror-metaphor');['Представление о себе','Действия за 14 дней'].forEach((text,i)=>{const mirror=el('div',undefined,'mirror-frame'+(active===i?' active':''));mirror.append(el('span',i?'✦':'◇','mirror-silhouette'),el('span',text));row.append(mirror)});parent.append(row);}
function mount(host){
 host.classList.add('mirrors');
 const params=new URLSearchParams(location.search),preview=params.get('preview')==='1',review=params.get('review');
 let p=load(),store=preview?JSON.parse(sessionStorage.getItem('alch_v5_mirror_preview')||'null'):p.mirrors;
 store=store||{version:1,draft:null,history:[]};
 let draft=store.draft,view=review?store.history.find(x=>x.id===review):!draft?store.history[store.history.length-1]:null;
 let saveError='';
 function persist(){try{store.draft=draft;if(preview)sessionStorage.setItem('alch_v5_mirror_preview',JSON.stringify(store));else{const latest=load();latest.mirrors=store;localStorage.setItem('alch_v5_profile',JSON.stringify(latest));}saveError='';status();return true;}catch(e){saveError='Не удалось сохранить. Проверьте доступность хранилища браузера. Не закрывайте страницу.';status();return false;}}
 function status(){const e=host.querySelector('.mirror-save-status');if(e)e.textContent=saveError||'Сохраняется только в этом браузере. Никуда не отправляется.';}
 function start(){draft=D.create(load().gender);view=null;if(persist())render();}
 function go(phase,index=0){const old={phase:draft.phase,index:draft.index};draft.phase=phase;draft.index=index;if(persist()){render();window.scrollTo(0,0);}else Object.assign(draft,old);}
 function back(){if(view||!draft||draft.phase==='intro')return false;
  const phase=draft.phase,i=draft.index;
  if(phase==='self')go(i?'self':'intro',Math.max(0,i-1));
  else if(phase==='transition')go('self',5);
  else if(phase==='actions')go(i?'actions':'transition',Math.max(0,i-1));
  else if(phase==='compare')go('actions',5);
  else if(phase==='observe')go('compare');
  return true;
 }
 window.gBack=()=>review||preview?(back(),true):back();
 function actions(nextText,nextFn,ready=true){const row=el('div',undefined,'mirror-actions');button(row,'Назад',back);const next=button(row,nextText,nextFn,'mirror-primary');next.disabled=!ready;host.append(row);return next;}
 function pairs(record,editable,parent){
  parent=parent||host;
  D.questions.forEach((q,i)=>{const details=el('details',undefined,'mirror-pair'),status=D.compare(record.self_image[q.id],record.actual_actions[q.id]);
   details.append(el('summary',(i+1)+'. '+typ(q.title)));
   const grid=el('div',undefined,'mirror-pair-grid');
   [['Первое зеркало',record.self_image[q.id]],['Второе зеркало',record.actual_actions[q.id]]].forEach(([name,a])=>{const box=el('section');box.append(el('h3',name));paragraph(box,D.answerText(a));if(a&&a.example)paragraph(box,'Пример: '+a.example,'muted');grid.append(box);});
   details.append(grid);paragraph(details,typ(D.statuses[status]),'mirror-status');
   if(editable)field(details,'Как ты понимаешь эту пару? Необязательно.',record.pair_notes[q.id]||'',v=>{draft.pair_notes[q.id]=v;persist();});
   else if((record.pair_notes||{})[q.id])paragraph(details,record.pair_notes[q.id]);
   parent.append(details);
  });
 }
 function header(){
  host.replaceChildren();window.gNext=null;
  host.append(el('span','Точка А · Исследование','tag'),el('h1','Два зеркала'));
  if(preview)paragraph(host,'Предпросмотр. Ответы хранятся отдельно от игры в этой вкладке. Маршрут, дневник и прежние результаты не изменятся.','mirror-notice');
  const s=el('p','','mirror-save-status muted');s.setAttribute('role','status');host.append(s);status();
 }
 function intro(){
  metaphor(host,-1);
  paragraph(host,'У каждого человека есть представление о себе. Но общее впечатление и реальные поступки не всегда одно и то же. Иногда мы строже оцениваем себя, чем показывают наши действия. Иногда обстоятельства меняют привычный способ поступать.');
  paragraph(host,'Первое зеркало — каким ты представляешь свое поведение. Второе — как складывались твои действия за последние 14 дней. Затем ты увидишь ответы рядом и выберешь важное наблюдение.');
  paragraph(host,'Здесь нет правильных ответов, баллов и оценки личности. Различие — не ошибка и не повод осуждать себя. Чужие оценки нам не нужны.');
  if(draft)button(host,'Посмотреть в первое зеркало',()=>go('self'),'mirror-primary');
  else if(!review)button(host,'Посмотреть в первое зеркало',()=>{draft=D.create(load().gender);draft.phase='self';if(persist())render();},'mirror-primary');
 }
 function question(){
  const phase=draft.phase,i=draft.index,q=D.questions[i],key=phase==='self'?'self_image':'actual_actions',a=draft[key][q.id];
  metaphor(host,phase==='self'?0:1);
  host.append(el('h2',phase==='self'?'Первое зеркало':'Второе зеркало'));
  paragraph(host,'Вопрос '+(i+1)+' из 6','mirror-counter');
  const progress=el('progress');progress.max=12;progress.value=(phase==='self'?0:6)+i;progress.setAttribute('aria-label','Пройденные вопросы');host.append(progress);
  paragraph(host,phase==='self'?'Как ты обычно представляешь свое поведение? Не о желаемом образе и не о мнении окружающих.':'Вспомни обычные события за '+date(draft.period_start)+' — '+date(draft.period_end)+'. Не нужно угадывать или придумывать ситуации.','muted');
  if(phase==='actions'){const usual=el('details');usual.append(el('summary','Тема первого зеркала'));paragraph(usual,typ(q.self_prompt));host.append(usual);}
  host.append(el('h3',typ(phase==='self'?q.self_prompt:q.action_prompt),'mirror-question'));
  const choices=el('div',undefined,'mirror-choices');choices.setAttribute('role','group');choices.setAttribute('aria-label','Варианты ответа');
  D.options(q,phase,draft.gender).forEach(o=>{const b=button(choices,o.text,()=>{D.answer(draft,phase,i,o.id,o.id===a?.option_id?a.custom_answer:'',a?.example||'');persist();render();},a?.option_id===o.id?'selected':'');b.dataset.option=o.id;b.setAttribute('aria-pressed',String(a?.option_id===o.id));});host.append(choices);
  let next;
  if(a?.option_id==='custom')field(host,'Твой ответ',a.custom_answer,v=>{D.answer(draft,phase,i,'custom',v,draft[key][q.id].example);persist();next.disabled=!D.valid(draft[key][q.id]);});
  if(phase==='actions'&&a&&!['no_event','unknown'].includes(a.option_id)){
   const more=el('details');more.append(el('summary','Конкретный пример (необязательно)'));
   field(more,'Что произошло?',a.example,v=>{const current=draft[key][q.id];D.answer(draft,phase,i,current.option_id,current.custom_answer,v);persist();});host.append(more);
  }
  next=actions(i===5?(phase==='self'?'Завершить первое зеркало':'Совместить зеркала'):'Далее',()=>{if(!D.valid(draft[key][q.id]))return;if(i<5)go(phase,i+1);else if(phase==='self')go('transition');else{draft.comparison=D.comparisons(draft);go('compare');}},D.valid(a));
 }
 function transition(){
  metaphor(host,1);host.append(el('h2','Первое отражение сохранено'));
  paragraph(host,'Представление о своем поведении сохранено. Теперь опирайся на реальные действия, а не на общее впечатление о себе. Ответы первого зеркала пока скрыты.');
  paragraph(host,'Период наблюдения: '+date(draft.period_start)+' — '+date(draft.period_end)+'. Он не изменится при возвращении к сцене. Если события не было или ты его не помнишь, для этого есть отдельные ответы.');
  actions('Перейти ко второму зеркалу',()=>go('actions'));
 }
 function comparison(){
  host.append(el('h2','Что показали два зеркала?'));
  paragraph(host,'Раскрой шесть пар ответов. Совпадение вариантов не доказывает постоянство поведения, а различие не означает внутренний конфликт. Важен твой смысл и обстоятельства.');
  pairs(draft,true);actions('Что я замечаю',()=>go('observe'));
 }
 function observe(){
  host.append(el('h2','Что удалось заметить?'));
  paragraph(host,'Возможно, получилось заметить что-то неожиданное. Возможно, ответы подтвердили уже знакомое. Выбери наиболее важное наблюдение. Если нового открытия нет, это тоже допустимо.');
  const choices=el('div',undefined,'mirror-choices');
  D.observations(draft.gender).forEach(o=>{const selected=draft.main_observation?.option_id===o.id,b=button(choices,o.text,()=>{if(!selected){draft.main_observation={option_id:o.id,selected_text:o.text,custom_answer:'',saved_at:Date.now()};draft.clarification=[];draft.cause_note='';}persist();render();},selected?'selected':'');b.dataset.observation=o.id;b.setAttribute('aria-pressed',String(selected));});host.append(choices);
  let finish;
  if(draft.main_observation?.option_id==='custom')field(host,'Твой собственный вывод',draft.main_observation.custom_answer,v=>{draft.main_observation.custom_answer=v;draft.main_observation.saved_at=Date.now();persist();finish.disabled=!ready();});
  const obs=draft.main_observation?.option_id;
  if(['B','C','D','E','custom'].includes(obs)){
   host.append(el('h3','Что могло повлиять на замеченное?'));
   paragraph(host,'Можно выбрать несколько причин или не выбирать ни одной. Это твое уточнение, а не объяснение от игры.','muted');
   const list=el('div',undefined,'mirror-choices');
   D.causes(draft.gender).forEach(o=>{const selected=draft.clarification.some(x=>x.option_id===o.id),b=button(list,o.text,()=>{draft.clarification=selected?draft.clarification.filter(x=>x.option_id!==o.id):draft.clarification.concat({option_id:o.id,selected_text:o.text});if(o.id==='custom'&&selected)draft.cause_note='';persist();render();},selected?'selected':'');b.dataset.cause=o.id;b.setAttribute('aria-pressed',String(selected));});host.append(list);
   if(draft.clarification.some(x=>x.option_id==='custom'))field(host,'Другая причина (необязательно)',draft.cause_note,v=>{draft.cause_note=v;persist();});
  }
  field(host,typ('Что удалось заметить о себе такого, чего раньше не замечал§|а§? Необязательно.'),draft.personal_note,v=>{draft.personal_note=v;persist();});
  paragraph(host,'Достаточно выбранного наблюдения. Не нужно делать окончательный вывод о себе.');
  finish=actions('Сохранить наблюдение',finishScene,ready());
 }
 function ready(){return D.completeAnswers(draft)&&D.valid(draft.main_observation);}
 function finishScene(){
  if(!ready())return;
  const result=copy(draft);result.comparison=D.comparisons(result);result.completed_at=Date.now();delete result.phase;delete result.index;
  const old=copy(store);store.history.push(result);draft=null;store.draft=null;
  try{
   if(preview)sessionStorage.setItem('alch_v5_mirror_preview',JSON.stringify(store));
   else{
    const latest=load();latest.mirrors=store;latest.mirror_exercise=result;
    latest.diary=latest.diary||{};latest.diary.ins=latest.diary.ins||[];latest.diary.q=latest.diary.q||[];
    latest.diary.ins.push({id:result.id,d:result.completed_at,at:'Два зеркала',source:{type:'mirrors',id:result.id},x:D.observationText(result)+(result.personal_note?'\n'+result.personal_note:'')+(result.clarification.length?'\nВозможные причины: '+result.clarification.map(c=>c.selected_text).join(' '):'')+(result.cause_note?'\n'+result.cause_note:'')});
    // Result, diary and route completion are committed in one storage write.
    if(!GRoute.complete(URL_SCENE,latest))throw Error('Result not saved');
   }
   saveError='';view=result;render();
  }catch(e){store=old;draft=old.draft;saveError='Не удалось сохранить результат. Не закрывайте страницу и попробуйте снова.';render();}
 }
 function showResult(record){
  host.append(el('h2','Отражение собрано'));
  paragraph(host,'Сохранено '+stamp(record.completed_at)+'. Период: '+date(record.period_start)+' — '+date(record.period_end)+'.','muted');
  paragraph(host,'Ни один из результатов не делает тебя лучше или хуже. Здесь сохранены твои ответы и собственное наблюдение. Просмотр их не меняет.');
  paragraph(host,D.observationText(record),'mirror-notice');
  if(record.personal_note)paragraph(host,record.personal_note);
  if(record.clarification.length){host.append(el('h3','Возможные причины по твоему ощущению'));record.clarification.forEach(c=>paragraph(host,c.selected_text));}
  if(record.cause_note)paragraph(host,record.cause_note);
  if(review){
   const resume=el('a','Продолжить актуальный шаг','mirror-primary');resume.href=GRoute.resume();host.append(resume);
  }else if(!preview){
   button(host,'Дальше: Источник',()=>{location.href='slot.html?id=source';},'mirror-primary');
  }
  if(window.GQuote)GQuote.add(host,URL_SCENE);
  const answers=el('details',undefined,'mirror-answers');answers.append(el('summary','Мои ответы'));pairs(record,false,answers);host.append(answers);
  const links=el('nav',undefined,'mirror-links');links.setAttribute('aria-label','Дополнительно');
  if(!review){const again=el('button','Пройти еще раз','mirror-link');again.type='button';again.onclick=start;links.append(again);}
  const hist=el('details',undefined,'mirror-hist');hist.append(el('summary','Предыдущие прохождения'));
  const list=el('div',undefined,'mirror-hist-list');
  store.history.slice().reverse().forEach(r=>{if(preview)button(list,stamp(r.completed_at),()=>{view=r;render();},'mirror-link');else{const a=el('a',stamp(r.completed_at),'mirror-link');a.href=URL_SCENE+'&review='+encodeURIComponent(r.id);list.append(a);}});
  hist.append(list);links.append(hist);
  const diary=el('a','В дневник','mirror-link');diary.href='diary.html?tab=tests';links.append(diary);
  host.append(links);
  if(!review)paragraph(host,'Повторное прохождение сохранит прежнюю запись.','muted');
 }
 function render(){header();if(review&&!view){paragraph(host,'Эта запись не найдена. Сохраненные ответы не изменены.');return;}
  if(view){showResult(view);return;}
  if(!draft){intro();return;}
  if(draft.phase==='intro')intro();else if(['self','actions'].includes(draft.phase))question();else if(draft.phase==='transition')transition();else if(draft.phase==='compare')comparison();else if(draft.phase==='observe')observe();
 }
 render();
}
function context(host){const p=load(),r=p.mirror_exercise;if(!r?.completed_at)return;const box=el('section',undefined,'pt');box.append(el('h2','Твое наблюдение из двух зеркал'));paragraph(box,D.observationText(r));if(r.personal_note)paragraph(box,r.personal_note);const a=el('a','Посмотреть сохраненные ответы');a.href=URL_SCENE+'&review='+encodeURIComponent(r.id);a.style.color='#f0c870';box.append(a);host.insertBefore(box,host.querySelector('button.next'));}
window.GMirrors={mount,context};
})();
