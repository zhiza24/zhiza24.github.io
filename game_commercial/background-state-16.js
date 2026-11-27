/* UI «Ведущее фоновое состояние». Сохраняет черновик и результат в локальном профиле игры. */
(function(root){
'use strict';
var D=root.GBGS16,E=root.GBackgroundState16;
if(!D||!E)return;
function arr(x){return Array.isArray(x)?x:[]}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function tx(s){return String(s==null?'':s).replace(/\{([^{}|]*)\|([^{}]*)\}/g,function(_,a,b){return root.GG?root.GG(a,b):a})}
function css(){
 var id='bg16-css',s=document.getElementById(id);if(!s){s=document.createElement('style');s.id=id;}
 s.textContent="#m .bg16{--ink:#392514;--muted:#765a39;box-sizing:border-box;margin:0 0 28px;padding:22px 16px 28px;border-radius:18px;background:#f4e8cf!important;color:var(--ink)!important;font-family:Manrope,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif!important}#m .bg16,#m .bg16 *{box-sizing:border-box;text-shadow:none!important;opacity:1!important}#m .bg16 p,#m .bg16 li,#m .bg16 span,#m .bg16 b,#m .bg16 strong,#m .bg16 label,#m .bg16 small{color:var(--ink)!important}#m .bg16 h1,#m .bg16 h2,#m .bg16 h3{font-family:'Cormorant Garamond',Georgia,serif!important;color:#5c3a12!important;-webkit-text-fill-color:#5c3a12!important;font-weight:700!important}#m .bg16 h1{font-size:30px;line-height:1.15;margin:8px 0 14px;text-align:center}#m .bg16 h2{font-size:25px;line-height:1.2;margin:14px 0 10px}#m .bg16 h3{font-size:20px;line-height:1.25;margin:0 0 8px}#m .bg16 p{font-size:15px;line-height:1.6;margin:10px 0;color:#4a3018!important}#m .bg16 .tag{display:inline-block;background:#e8c16c!important;color:#26190b!important;border:1px solid #c99a45!important;border-radius:20px;padding:4px 12px;font-size:13px;font-weight:700}#m .bg16-kicker{display:block;color:#8a5212!important;font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;text-align:center;margin:12px 0 7px}#m .bg16-muted{color:#765a39!important;font-size:13px;line-height:1.5;text-align:center}#m .bg16-card,#m .bg16-secondary{margin:15px 0;padding:16px;border:1px solid #d9bf8c!important;border-radius:14px;background:#fffaf0!important;color:#392514!important;box-shadow:none}#m .bg16-card * ,#m .bg16-secondary *{color:#392514!important}#m .bg16-card h2,#m .bg16-card h3{color:#5c3a12!important}#m .bg16-choices{display:grid;gap:9px;margin:15px 0}#m .bg16-choice,#m .bg16-special{display:block;width:100%;min-height:52px;padding:13px 14px;border:1.5px solid #c9a46a!important;border-radius:12px;background:#fffaf0!important;color:#392514!important;text-align:left;font:600 15px/1.45 Manrope,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif!important;white-space:normal;overflow-wrap:anywhere;box-shadow:none}#m .bg16-choice.selected,#m .bg16-special.selected{border:2px solid #9e783a!important;background:linear-gradient(180deg,#ffe9a8,#e0a940)!important;color:#2a1606!important;font-weight:800!important}#m .bg16-choice.selected:before{content:'✓';display:inline-block;margin-right:9px;color:#2a1606!important}#m .bg16-actions{display:flex;flex-direction:column;gap:9px;margin-top:20px;align-items:center}#m .bg16-actions button{display:block;width:100%;max-width:340px;min-height:50px;margin:0 auto;padding:12px 17px;border:0!important;border-radius:12px;background:#edc879!important;color:#291a08!important;font:800 16px/1.35 Manrope,sans-serif!important;box-shadow:none!important}#m .bg16-actions button.gh{background:#fffaf0!important;border:1.5px solid #c9a46a!important;color:#392514!important;font-weight:700!important}#m .bg16-actions button:disabled{background:#e8dfcd!important;color:#8a7658!important}#m .bg16 progress{display:block;width:100%;height:8px;accent-color:#e0a940;border-radius:8px;margin:8px 0 16px}#m .bg16 textarea{display:block;width:100%;min-height:86px;padding:12px;border:1px solid #c9a46a;border-radius:11px;background:#fffaf0;color:#392514;font:14px/1.5 Manrope,sans-serif;resize:vertical}#m .bg16 .bg16-option{display:flex;align-items:flex-start;gap:9px;margin:8px 0;padding:11px 12px;border-radius:11px;background:#fffaf0;border:1px solid #d9bf8c;font-size:14px;line-height:1.4}#m .bg16 .bg16-option input{flex:0 0 19px;width:19px;height:19px;margin:2px 0 0;accent-color:#9e783a}#m .bg16-result{margin:14px 0;padding:15px;border:1px solid #d9bf8c;border-radius:13px;background:#fffaf0}#m .bg16-result h2{margin-top:4px}#m .bg16-result .formula{font-weight:800;font-size:16px;line-height:1.5;color:#68431b!important}#m .bg16-result h3{margin-top:14px}#m .bg16-result ul{padding-left:20px;margin:8px 0}#m .bg16-result li{font-size:14px;line-height:1.5;margin:6px 0}#m .bg16-tag{display:inline-block;padding:5px 9px;border:1px solid #c9a46a;border-radius:999px;color:#7a4512!important;font-size:12px;font-weight:800;margin:3px 4px 3px 0;background:#fff6e2}#m .bg16 a{color:#7a4512!important;text-decoration:underline}#m .bg16 button:focus-visible,#m .bg16 input:focus-visible,#m .bg16 textarea:focus-visible{outline:3px solid #9e783a!important;outline-offset:3px}";
 if(!s.parentNode)document.head.appendChild(s);
}
function random(seed){var x=seed>>>0;return function(){x=(x+0x6D2B79F5)|0;var t=Math.imul(x^x>>>15,1|x);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296}}
function shuffle(a,r){var b=a.slice();for(var i=b.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=b[i];b[i]=b[j];b[j]=t}return b}
function freshDraft(){
 var seed=(Date.now()^Math.floor(Math.random()*0xffffffff))>>>0,r=random(seed),order=shuffle(D.Q.map(function(q){return q[0]}),r),optionOrder={};
 D.Q.forEach(function(q){optionOrder[q[0]]=shuffle(q[3].map(function(_,i){return i}),r)});
 return {version:3,seed:seed,order:order,optionOrder:optionOrder,answers:{},followup:{},startedAt:Date.now(),updatedAt:Date.now()};
}
function mount(box){
 css();
 var G=root.GTests||{},preview=!!G.preview,retake=!!G.retakeMode;
 var P=root.GProfile?root.GProfile.load():(G.load?G.load():{}),bp=P.backgroundProfile&&typeof P.backgroundProfile==='object'?P.backgroundProfile:{};
 var saved=bp.backgroundState&&bp.backgroundState.version>=3?bp.backgroundState:null;
 var draft=bp.backgroundStateDraft16&&bp.backgroundStateDraft16.version===3?bp.backgroundStateDraft16:null;
 var step=0,stage='intro';
 if(preview){try{draft=JSON.parse(sessionStorage.getItem('alch_v5_bg16_preview')||'null')||draft}catch(e){}}
 if(!draft||!Array.isArray(draft.order)||draft.order.length!==D.Q.length)draft=null;
 function saveDraft(){
  draft.updatedAt=Date.now();
  if(preview){try{sessionStorage.setItem('alch_v5_bg16_preview',JSON.stringify(draft))}catch(e){}return true}
  try{
   var p=root.GProfile?GProfile.load():(G.load?G.load():{}),b=p.backgroundProfile&&typeof p.backgroundProfile==='object'?p.backgroundProfile:{};
   b.backgroundStateDraft16=draft;p.backgroundProfile=b;
   if(p.modules&&p.modules.backgroundProfile){p.modules.backgroundProfile.result=JSON.parse(JSON.stringify(b));p.modules.backgroundProfile.updatedAt=Date.now()}
   if(root.GProfile)GProfile.save(p);else localStorage.setItem('alch_v5_profile',JSON.stringify(p));
   P=p;bp=b;return true;
  }catch(e){return false}
 }
 function saveResult(r){
  r.completedAt=Date.now();r.at=r.completedAt;
  if(preview){saved=r;root.GBackgroundState16PreviewResult=r;return}
  var p=root.GProfile?GProfile.load():(G.load?G.load():{}),b=p.backgroundProfile&&typeof p.backgroundProfile==='object'?p.backgroundProfile:{};
  if(b.backgroundState){b.backgroundStateHistory=arr(b.backgroundStateHistory);b.backgroundStateHistory.push(b.backgroundState);if(b.backgroundStateHistory.length>5)b.backgroundStateHistory.shift()}
  b.backgroundState=r;b.algoVersion=3;delete b.backgroundStateDraft16;p.backgroundProfile=b;
  if(root.GProfile)GProfile.saveResult('backgroundProfile',b,null,{profile:p,save:true});else localStorage.setItem('alch_v5_profile',JSON.stringify(p));
  P=p;bp=b;saved=r;
 }
 function shell(html){box.innerHTML='<div class="bg16">'+html+'</div>';bind()}
 function qById(id){for(var i=0;i<D.Q.length;i++)if(D.Q[i][0]===id)return D.Q[i];return null}
 function firstMissing(){if(!draft)return 0;for(var i=0;i<draft.order.length;i++){var a=draft.answers[draft.order[i]];if(!a||a.primary==null&&!a.skipped)return i}return draft.order.length}
 function intro(){
  var count=Object.keys(draft&&draft.answers||{}).filter(function(k){var a=draft.answers[k];return a&&(a.primary!=null||a.skipped)}).length;
  shell('<span class="tag">Точка 0 · Исследование</span><div class="bg16-kicker">Ведущее фоновое состояние</div><h1>Куда ты обычно приходишь внутри?</h1>'+
   '<p>Это исследование не определяет тип личности и не оценивает, каким человеком ты должен быть. Оно помогает заметить, какие внутренние реакции повторяются в разных жизненных обстоятельствах.</p>'+
   '<p>В каждой ситуации выбери то, что чаще всего возникает первым. Затем, если узнаешь себя еще в одном варианте, отметь его как дополнительный. Выбирай не самый правильный ответ, а тот, который действительно похож на твою обычную реакцию.</p>'+
   '<div class="bg16-card"><b>Что мы будем различать</b><p>Четыре защитные посадки: Отвержение, Дефектность, Контроль / Опасность и Разочарование / Дистанция. Отдельно посмотрим на ресурсную опору — способность оставаться на своей стороне и выбирать, как поступить.</p><p class="bg16-muted">16 ситуаций · 8 жизненных сфер · примерно 8–10 минут</p></div>'+
   (count?'<p class="bg16-muted">Сохранено: '+count+' из 16 ситуаций. Можно продолжить с того же места.</p>':'')+
   (saved&&!retake?'<p class="bg16-muted">Предыдущий результат сохранен. Его можно посмотреть или пройти исследование заново.</p>':'')+
   '<div class="bg16-actions"><button type="button" id="bg16Start">'+(count?'Продолжить исследование':saved?'Начать заново':'Начать исследование')+'</button>'+
   (saved&&!retake?'<button type="button" class="gh" id="bg16Show">Посмотреть предыдущий результат</button>':'')+'</div>');
 }
 function question(){
  stage='questions';
  var qid=draft.order[step],q=qById(qid),a=draft.answers[qid]||{},indices=draft.optionOrder[qid]||[0,1,2,3,4],primary=a.primary,opts=indices.map(function(i){return q[3][i]});
  var html=opts.map(function(o){return '<button type="button" class="bg16-choice '+(primary===o[1]?'selected':'')+'" data-bg16-primary="'+o[1]+'">'+esc(tx(o[0]))+'</button>'}).join('');
  var secondary='';
  if(primary){
   secondary='<div class="bg16-secondary"><b>Есть еще одна реакция, которая тебе знакома?</b><p class="bg16-muted">Это необязательно. Выбери один дополнительный вариант, если он тоже бывает у тебя. Он будет учитываться с меньшим весом.</p><div class="bg16-choices">'+opts.filter(function(o){return o[1]!==primary}).map(function(o){return '<button type="button" class="bg16-choice '+(a.secondary===o[1]?'selected':'')+'" data-bg16-secondary="'+o[1]+'">'+esc(tx(o[0]))+'</button>'}).join('')+'<button type="button" class="bg16-special '+(!a.secondary?'selected':'')+'" data-bg16-secondary="">Без дополнительного ответа</button></div></div>';
  }
  shell('<span class="tag">Ситуация '+(step+1)+' из 16</span><div class="bg16-kicker">'+esc(D.SPHERES[q[1]])+'</div><progress max="16" value="'+(step+1)+'"></progress><h2>'+esc(tx(q[2]))+'</h2><p>Какая мысль или реакция возникает у тебя первой?</p><div class="bg16-choices">'+html+'</div>'+secondary+
   '<div class="bg16-card"><b>Если ни один вариант не подходит</b><p class="bg16-muted">Можешь пропустить ситуацию. Пропуск не будет засчитан ни в одну посадку.</p></div>'+
   '<div class="bg16-actions"><button type="button" id="bg16Next" '+(primary==null?'disabled':'')+'>'+(step===15?'Перейти к уточнениям':'Далее')+'</button><button type="button" class="gh" id="bg16Back" '+(step===0?'disabled':'')+'>Назад</button><button type="button" class="gh" id="bg16Skip">Пропустить ситуацию</button></div>');
 }
 function radios(key,opts,current){
  return '<div class="bg16-choices">'+opts.map(function(o){return '<label class="bg16-option"><input type="radio" name="'+key+'" value="'+esc(o)+'" '+(current===o?'checked':'')+' data-bg16-follow="'+key+'">'+esc(o)+'</label>'}).join('')+'</div>';
 }
 function followup(){
  stage='followup';var f=draft.followup||{};
  shell('<span class="tag">Последняя часть</span><div class="bg16-kicker">Небольшая сверка</div><h1>Как эти состояния проявляются у тебя?</h1><p>Ответы ниже не меняют баллы. Они помогают отличить краткую реакцию от состояния, которое надолго остается с тобой, и увидеть, на что ты можешь опираться.</p>'+
   '<div class="bg16-card"><b>1. Когда подобная реакция возникает, как долго она обычно остается с тобой?</b>'+radios('recovery',D.FOLLOW.recovery,f.recovery)+'</div>'+
   '<div class="bg16-card"><b>2. В каких обстоятельствах она проявляется сильнее?</b>'+radios('context',['В отношениях и семье','В работе и деньгах','В общении и социальном окружении','В отношении к себе','В желаниях, целях и будущем','В отдыхе и свободном времени','По-разному, зависит от ситуации'],f.context)+'</div>'+
   '<div class="bg16-card"><b>3. Что обычно помогает тебе вернуться в устойчивое состояние?</b>'+radios('support',['Разговор и подтверждение близости','Поддержка и признание того, что я справился','Понимание ситуации и конкретный план','Возможность отстраниться и перестать ждать определенного результата','Время, собственные решения и возвращение внимания к тому, что важно мне','Пока не понимаю, что помогает'],f.support)+'</div>'+
   '<div class="bg16-card"><b>4. Насколько легко тебе переносить ресурсное состояние в другие сферы жизни?</b>'+radios('transfer',D.FOLLOW.transfer,f.transfer)+'</div>'+
   '<div class="bg16-card"><b>И еще один вопрос — своими словами</b><p>Если бы тебе не нужно было защищаться от привычного разочарования, оценки, потери или неопределенности, что бы ты позволил себе изменить в жизни?</p><textarea id="bg16Free" placeholder="Можно написать коротко, как приходит…">'+esc(f.free||'')+'</textarea></div>'+
   '<div class="bg16-actions"><button type="button" id="bg16BackToQuestions">Назад к ситуациям</button><button type="button" id="bg16Finish">Собрать мою карту</button></div><p class="bg16-muted">Можно оставить любые уточнения без ответа.</p>');
 }
 function profileHtml(id,rank){
  var p=D.PROFILES[id];if(!p)return '';
  var f=(saved||E.calculate(draft.answers,draft.followup,{startedAt:draft.startedAt,seed:draft.seed})).families.filter(function(x){return x.id===id})[0];
  return '<article class="bg16-result"><span class="bg16-tag">'+(rank||'Наблюдение')+'</span><h2>'+esc(p.title)+'</h2><p class="formula">'+esc(p.formula)+'</p><p>'+esc(p.summary)+'</p>'+
   '<h3>Что поддерживает эту посадку</h3><p>'+esc(p.mechanism)+'</p>'+
   '<h3>Как это может проявляться в жизни</h3><ul>'+p.manifestations.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ul>'+
   '<h3>Чем она обходится</h3><p>'+esc(p.cost)+'</p>'+
   '<h3>Куда направить внимание</h3><p>'+esc(p.direction)+'</p>'+
   '<h3>Вопрос для дальнейшего исследования</h3><p><b>'+esc(p.question)+'</b></p>'+
   (f?'<p class="bg16-muted">Выборов: '+f.primaryCount+' первых и '+f.secondaryCount+' дополнительных · проявилось в '+f.sphereCount+' из 8 сфер.</p>':'')+'</article>';
 }
 function groupResult(r,key,title){
  var g=r.groups[key],html='<section class="bg16-card"><h2>'+title+'</h2>';
  if(g.leaders.length){
   html+='<p>'+(g.status==='two_close'?'В ответах выделяются два близких сигнала.':'В ответах выделяется повторяющийся сигнал.')+'</p>';
   g.leaders.forEach(function(id,i){html+=profileHtml(id,g.leaders.length>1?'Ведущий сигнал '+(i+1):'Ведущий сигнал')});
  }else{
   var cand=g.families.filter(function(x){return x.points>0}).slice(0,2);
   html+='<p><b>Выраженного ведущего состояния пока не выявлено.</b></p><p>Это не означает, что у тебя нет трудностей. Возможно, реакции зависят от конкретных обстоятельств или предложенные варианты не полностью описывают твой опыт.</p>';
   if(cand.length)html+='<p class="bg16-muted">Есть отдельные сигналы: '+cand.map(function(x){return D.PROFILES[x.id].title+' ('+x.sphereCount+' сфер)'}).join('; ')+'. Для выделения ведущей посадки нужно повторение минимум в трех сферах.</p>';
  }
  return html+'</section>';
 }
 function result(){
  stage='result';var r=saved||E.calculate(draft.answers,draft.followup,{startedAt:draft.startedAt,seed:draft.seed});
  var html='<span class="tag">Точка 0 · Результат</span><div class="bg16-kicker">Твоя карта фоновых состояний</div><h1>Куда ты чаще приходишь внутри</h1>'+
   '<div class="bg16-card"><b>Что показали ответы</b><p>Учтено '+r.coverage.answered+' из 16 ситуаций; охвачено '+r.coverage.spheres+' из 8 жизненных сфер. Первая реакция учитывается с весом 2, дополнительная — с весом 1.</p><p class="bg16-muted">Это авторская карта повторяющихся ответов, а не диагноз и не окончательное объяснение причин.</p></div>'+
   groupResult(r,'protective','Ведущее защитное ожидание')+
   groupResult(r,'resource','Ресурсная опора — отдельно от защитных состояний');
  var ranked=r.families.filter(function(f){return f.points>0}).sort(function(a,b){return b.points-a.points});
  html+='<section class="bg16-card"><h2>Распределение по пяти состояниям</h2>';
  if(ranked.length)ranked.forEach(function(f){html+='<p><b>'+esc(f.title)+'</b> — '+f.points+' баллов · '+f.sphereCount+' из 8 сфер</p>'});
  else html+='<p>Пока недостаточно ответов для распределения.</p>';
  html+='<p class="bg16-muted">Защитные состояния и ресурсная опора показаны отдельно: ресурс не перекрывает и не отменяет защитные реакции.</p></section>';
  if(r.followup&&Object.keys(r.followup).length){
   html+='<section class="bg16-card"><h2>Твои уточнения</h2>';
   var labels={recovery:'Как долго остается реакция',context:'Где проявляется сильнее',support:'Что помогает вернуться к себе',transfer:'Перенос ресурсного состояния'};
   Object.keys(labels).forEach(function(k){if(r.followup[k])html+='<p><b>'+labels[k]+':</b> '+esc(r.followup[k])+'</p>'});
   if(r.followup.free)html+='<p><b>Что хотелось бы изменить:</b><br>'+esc(r.followup.free).replace(/\n/g,'<br>')+'</p>';
   html+='</section>';
  }
  html+='<section class="bg16-card"><h2>Как пользоваться этой картой</h2><p>Посмотри, в каких ситуациях реакция включается особенно часто. В следующий раз попробуй заметить момент, когда появляется привычный внутренний вывод, и отделить его от того, что действительно произошло.</p><p>Не нужно заставлять себя немедленно реагировать иначе. Сначала важно увидеть повторение, понять, что его запускает, и найти доступный способ поддержать себя.</p></section>'+
   '<p class="bg16-muted">Реальная опасность, нехватка денег, нарушение границ и несправедливое отношение не объясняются автоматически внутренним состоянием. Учитывай реальные обстоятельства, а не только собственную реакцию.</p>'+
   '<div class="bg16-actions"><button type="button" id="bg16Continue">'+(preview||retake?'Вернуться к заданиям':'Продолжить путь')+'</button><button type="button" class="gh" id="bg16Retake">Пройти исследование заново</button></div>';
  shell(html);
  if(root.GResultCard&&!preview){
   var pLead=(r.groups.protective.leaders||[]).map(function(id){return D.PROFILES[id].title}).join(' · ');
   var resLead=(r.groups.resource.leaders||[]).map(function(id){return D.PROFILES[id].title}).join(' · ');
   root.GResultCard.attachDiaryBar(box.querySelector('.bg16')||box,{id:'bg16',step:'slot.html?id=bg16',title:'Ведущее фоновое состояние',passed:'Точка 0',lead:r.coverage.answered+' из 16 ситуаций, охвачено сфер: '+r.coverage.spheres+'.',strong:pLead,insight:resLead,insightLabel:'Ресурсная опора',at:r.completedAt||Date.now()});
  }
 }
 function bind(){
  var start=box.querySelector('#bg16Start');if(start)start.onclick=function(){if(!draft)draft=freshDraft();step=firstMissing();if(step>=16)followup();else question()};
  var show=box.querySelector('#bg16Show');if(show)show.onclick=function(){result()};
  box.querySelectorAll('[data-bg16-primary]').forEach(function(b){b.onclick=function(){var qid=draft.order[step],a=draft.answers[qid]||{};a.primary=b.dataset.bg16Primary;if(a.secondary===a.primary)a.secondary=null;delete a.skipped;draft.answers[qid]=a;saveDraft();question()}});
  box.querySelectorAll('[data-bg16-secondary]').forEach(function(b){b.onclick=function(){var qid=draft.order[step],a=draft.answers[qid]||{};a.secondary=b.dataset.bg16Secondary||null;draft.answers[qid]=a;saveDraft();question()}});
  var back=box.querySelector('#bg16Back');if(back)back.onclick=function(){if(step>0){step--;question()}};
  var skip=box.querySelector('#bg16Skip');if(skip)skip.onclick=function(){var qid=draft.order[step];draft.answers[qid]={primary:null,secondary:null,skipped:true};saveDraft();step++;if(step>=16)followup();else question()};
  var next=box.querySelector('#bg16Next');if(next)next.onclick=function(){var qid=draft.order[step],a=draft.answers[qid];if(!a||a.primary==null)return;step++;saveDraft();if(step>=16)followup();else question()};
  box.querySelectorAll('[data-bg16-follow]').forEach(function(b){b.onchange=function(){draft.followup[b.dataset.bg16Follow]=b.value;saveDraft()}});
  var free=box.querySelector('#bg16Free');if(free)free.oninput=function(){draft.followup.free=free.value;saveDraft()};
  var backQ=box.querySelector('#bg16BackToQuestions');if(backQ)backQ.onclick=function(){step=15;question()};
  var finish=box.querySelector('#bg16Finish');if(finish)finish.onclick=function(){var r=E.calculate(draft.answers,draft.followup,{startedAt:draft.startedAt,seed:draft.seed});saveResult(r);result()};
  var cont=box.querySelector('#bg16Continue');if(cont)cont.onclick=function(){if(preview||retake){location.href='tasks.html'+(retake?'#skipped':'');return}if(root.GRoute&&GRoute.advance)location.href=GRoute.advance();else location.href='tasks.html'};
  var again=box.querySelector('#bg16Retake');if(again)again.onclick=function(){draft=freshDraft();step=0;saveDraft();intro()};
 }
 if(saved&&!(draft&&draft.updatedAt&&draft.updatedAt>(saved.completedAt||saved.at||0))&&!retake){result();return}
 intro();
}
root.GBackgroundState16Test={mount:mount};
})(window);
