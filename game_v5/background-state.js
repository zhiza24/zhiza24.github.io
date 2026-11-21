/* Отдельный проход по исследованию фонового состояния. */
(function(root){
'use strict';
function arr(x){return Array.isArray(x)?x:[]}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function text(s){return String(s==null?'':s).replace(/\{([^{}|]*)\|([^{}]*)\}/g,function(_,a,b){return root.GG?GG(a,b):a}).replace(/§([^§|]+)\|([^§]+)§/g,function(_,a,b){return root.GG?GG(a,b):a})}
function css(){
 if(document.getElementById('bg-state-css'))return;
 var s=document.createElement('style');s.id='bg-state-css';s.textContent='.im-stage{margin:12px 0;padding:18px 14px;border:1px solid rgba(201,164,106,.35);border-radius:18px;background:linear-gradient(145deg,#21190f,#100e0b);color:#f2dfbd}.im-eyebrow{color:#cba25f;font-size:12px;letter-spacing:.14em;text-transform:uppercase}.im-stage h1{font-size:25px;line-height:1.2}.im-stage h2{font-size:19px}.im-stage p{line-height:1.55}.im-muted{color:#bba98d;font-size:13px}.im-card{margin:12px 0;padding:14px;border:1px solid rgba(201,164,106,.35);border-radius:14px;background:rgba(35,27,19,.6)}.im-final{margin:16px 0;padding:16px;text-align:center;border:1px solid #b48a49;border-radius:16px;background:radial-gradient(circle,rgba(214,166,82,.18),transparent 75%),#17110a}.im-final-num{font:700 38px Georgia;color:#f3d28e}.im-bg-choices{display:grid;gap:8px;margin:16px 0}.im-choice,.im-secondary{width:100%;padding:13px;border:1px solid #806035;border-radius:12px;background:#21190f;color:#f2dfbd;text-align:left;font:500 15px/1.45 Manrope}.im-choice.selected{border-color:#e5bf75;background:#49351d;color:#ffe8b2}.im-secondary{margin-top:8px;text-align:center;background:transparent}.im-actions{display:flex;gap:8px;flex-wrap:wrap}.im-actions button{flex:1;min-height:42px}.im-stage progress{width:100%;height:8px;accent-color:#d4a653}';document.head.appendChild(s);
}
function mount(box){
 var G=root.GTests,D=root.GIMD,E=root.GBackgroundState;if(!G||!D||!E)return;
 G.css();css();
 var preview=G.preview,P=G.load(),profile=P.backgroundProfile||{},saved=profile.backgroundState||null;
 var draft=profile.backgroundStateDraft||{answers:{},aftertaste:{},startedAt:Date.now()},step=0;
 if(preview){try{draft=JSON.parse(sessionStorage.getItem('alch_v5_bg_preview')||'null')||draft}catch(e){}}
 function total(){return D.Q.length+D.AFTER_AT.length}
 function firstMissing(){var i;for(i=0;i<D.Q.length;i++)if(draft.answers[D.Q[i][0]]==null)return i;for(i=0;i<D.AFTER_AT.length;i++)if(draft.aftertaste[D.AFTER_AT[i]]==null)return D.Q.length+i;return total()}
 function persist(){
  draft.updatedAt=Date.now();
  if(preview){try{sessionStorage.setItem('alch_v5_bg_preview',JSON.stringify(draft))}catch(e){}return}
  try{var p=root.GProfile?GProfile.load():G.load(),b=p.backgroundProfile&&typeof p.backgroundProfile==='object'?p.backgroundProfile:{};b.backgroundStateDraft=draft;p.backgroundProfile=b;
   if(root.GProfile)GProfile.saveResult('backgroundProfile',b,null,{profile:p,save:true});else localStorage.setItem('alch_v5_profile',JSON.stringify(p));
  }catch(e){console.warn('Не удалось сохранить черновик фонового состояния',e)}
 }
 function saveResult(result){
  if(preview){saved=result;return}
  var p=root.GProfile?GProfile.load():G.load(),b=p.backgroundProfile&&typeof p.backgroundProfile==='object'?p.backgroundProfile:{};
  if(b.backgroundState){b.backgroundStateHistory=arr(b.backgroundStateHistory);b.backgroundStateHistory.push(b.backgroundState);if(b.backgroundStateHistory.length>5)b.backgroundStateHistory.shift()}
  b.backgroundState=result;b.v=b.v||1;b.version=b.version||1;b.algoVersion=1;delete b.backgroundStateDraft;p.backgroundProfile=b;
  if(root.GProfile)GProfile.saveResult('backgroundProfile',b,null,{profile:p,save:true});else localStorage.setItem('alch_v5_profile',JSON.stringify(p));
  saved=result;P=p;profile=b;
 }
 function shell(html){box.innerHTML='<div class="im-stage">'+html+'</div>';bind()}
 function intro(){
  var n=Object.keys(draft.answers||{}).length+Object.keys(draft.aftertaste||{}).length;
  var hasSaved=!!saved;
  shell('<span class="tag">Точка 0 · Исследование</span><div class="im-eyebrow">Фоновое состояние</div><h1>Что остается внутри?</h1>'+
   '<p>24 жизненные ситуации помогут увидеть, какие способы воспринимать происходящее повторяются в разных областях жизни. Отдельно рассмотрим эмоциональное послевкусие после восьми выбранных ситуаций.</p>'+
   '<p>Здесь нет правильных ответов. Выбирай то, что чаще похоже на твою обычную реакцию, а не на идеальный образ себя. Если не можешь определить — вопрос можно пропустить; пропуск не считается ответом.</p>'+
   '<div class="im-card"><b>Четыре главы</b><p>Новые обстоятельства · Другие люди · Результаты и достижения · Собственный путь</p><p>24 ситуации + 8 вопросов о послевкусии</p></div>'+
   (hasSaved?'<p class="im-muted">Исследование уже сохранено. Его можно пройти заново — предыдущий результат останется в истории.</p>':'')+
   (n?'<p class="im-muted">Сохранен черновик: '+n+' из 32 ответов.</p>':'')+
   '<button class="next" id="bgStart">'+(n?'Продолжить исследование':hasSaved?'Пройти заново':'Начать исследование')+'</button>'+
   (hasSaved?'<button class="next" id="bgContinue">Перейти к карте внутреннего мира</button><button type="button" class="im-secondary" id="bgRetake">Пройти заново</button>':''));
 }
 function question(){
  var isAfter=step>=D.Q.length,qid,chapter,prompt,opts,current;
  if(!isAfter){var q=D.Q[step];qid=q[0];chapter=D.CH[q[1]];prompt=q[2];opts=q[3].map(function(o,i){return {text:o[0],i:i}});current=draft.answers[qid]}
  else{var ai=step-D.Q.length;qid=D.AFTER_AT[ai];var src=D.Q.filter(function(x){return x[0]===qid})[0];chapter={t:'Эмоциональное послевкусие'};prompt=src?src[2]:'';opts=D.AFTER.map(function(o,i){return {text:o[0],i:i}});current=draft.aftertaste[qid]}
  var options=opts.map(function(o){return '<button type="button" class="im-choice '+(Number(current)===o.i?'selected':'')+'" data-bg-choice="'+o.i+'">'+esc(text(o.text))+'</button>'}).join('');
  shell('<span class="tag">Фоновое состояние · '+(isAfter?'Послевкусие':'Глава '+(D.CH.indexOf(chapter)+1)+' из 4')+'</span>'+
   '<div class="im-eyebrow">'+esc(chapter.t)+'</div>'+(!isAfter&&step%6===0?'<p class="im-muted">'+esc(text(chapter.d))+'</p><p class="im-muted">'+esc(text(chapter.elder))+'</p>':'')+'<h2>'+(isAfter?'Что остается после ситуации?':'Ситуация '+(step+1)+' из 24')+'</h2>'+
   '<progress max="'+total()+'" value="'+step+'"></progress><p class="im-muted">'+(isAfter?'Ситуация, к которой относится вопрос: ':'')+esc(text(prompt))+'</p>'+
   '<p>'+(isAfter?'Что чаще остается внутри после такого события?':'Какой вариант ближе к тому, как ты обычно поступаешь?')+'</p>'+
   '<div class="im-bg-choices">'+options+'</div><div class="im-actions"><button type="button" id="bgBack" '+(step===0?'disabled':'')+'>Назад</button><button type="button" id="bgSkip">Пропустить</button><button type="button" id="bgNext" '+(current==null?'disabled':'')+'>'+(step===total()-1?'Завершить':'Далее')+'</button></div>'+
   '<p class="im-muted">Ответы сохраняются в этом браузере. Можно пропустить вопрос; пропуск останется без ответа.</p>');
 }
 function result(){
  var r=saved||E.calculate(draft.answers,draft.aftertaste),families=r.families.filter(function(f){return f.situationCount||f.aftertaste>0}),html='<span class="tag">Фоновое состояние · результат</span><div class="im-eyebrow">Предварительная карта</div><h1>Что повторяется в разных ситуациях</h1>'+
   '<p>Это не тип личности и не диагноз. Карта показывает, какие варианты ответов повторились в выбранных ситуациях. Эмоциональное послевкусие учитывается отдельно и не добавляет баллы ситуационным ответам.</p>'+
   '<div class="im-final"><div class="im-final-num">'+r.coverage.answered+'/'+r.coverage.total+'</div><div>ситуаций отвечено</div><p>'+r.coverage.aftertasteAnswered+' из '+r.coverage.aftertasteTotal+' эмоциональных итогов</p></div>';
  if(families.length)families.forEach(function(f){html+='<article class="im-card"><div class="im-card-k">'+esc(f.repeatLabel)+(f.aftertasteLabel?' · '+esc(f.aftertasteLabel):'')+'</div><h3>'+esc(f.title)+'</h3><p>'+esc(f.description)+'</p><p class="im-muted">Области: '+esc(f.chapterList.join(', ')||'не выделены')+'. Ситуаций: '+f.situationCount+'.</p></article>'});
  else html+='<div class="im-card"><p>Пока недостаточно ответов, чтобы увидеть повторяющиеся сигналы.</p></div>';
  if(r.adaptations.length){html+='<h2>Способы реагирования</h2>';r.adaptations.forEach(function(a){html+='<article class="im-card"><h3>'+esc(a.title)+'</h3><p>'+esc(a.description)+'</p></article>'})}
  if(r.resources.length){html+='<h2>Что уже помогает</h2>';r.resources.forEach(function(a){html+='<article class="im-card"><p>'+esc(a.description)+'</p></article>'})}
  html+='<p class="im-muted">Сигналы не объясняют причины и не доказывают устойчивую черту. Их можно сверить с другими исследованиями и собственными примерами.</p><button class="next" id="bgContinue">Перейти в зал зеркал</button><button type="button" class="im-secondary" id="bgRetake">Пройти исследование заново</button>';
  shell(html);
 }
 function advance(skip){var isAfter=step>=D.Q.length;if(skip){if(isAfter)delete draft.aftertaste[D.AFTER_AT[step-D.Q.length]];else delete draft.answers[D.Q[step][0]]}step++;persist();if(step>=total()){saveResult(E.calculate(draft.answers,draft.aftertaste));result()}else question()}
 function bind(){
  var start=box.querySelector('#bgStart');if(start)start.onclick=function(){step=firstMissing();if(step>=total()){saveResult(E.calculate(draft.answers,draft.aftertaste));result()}else question()};
  var retake=box.querySelector('#bgRetake');if(retake)retake.onclick=function(){draft={answers:{},aftertaste:{},startedAt:Date.now()};step=0;persist();intro()};
  var cont=box.querySelector('#bgContinue');if(cont)cont.onclick=function(){if(root.GInner)GInner.mount(box)};
  var back=box.querySelector('#bgBack');if(back)back.onclick=function(){if(step>0){step--;question()}};
  var next=box.querySelector('#bgNext');if(next)next.onclick=function(){advance(false)};
  var skip=box.querySelector('#bgSkip');if(skip)skip.onclick=function(){advance(true)};
  box.querySelectorAll('[data-bg-choice]').forEach(function(b){b.onclick=function(){var i=Number(b.dataset.bgChoice);if(step>=D.Q.length)draft.aftertaste[D.AFTER_AT[step-D.Q.length]]=i;else draft.answers[D.Q[step][0]]=i;persist();question()}});
 }
 if(saved){result()}else intro();
}
root.GBackgroundTest={mount:mount};
})(window);
