/* Экран нового входного исследования «Ведущее фоновое состояние».
   Сырые ответы и результат остаются локально в alch_v5_profile. */
(function(root){
'use strict';
var D=root.GBGS16,E=root.GBackgroundState16;
if(!D||!E)return;
function arr(x){return Array.isArray(x)?x:[]}
function isFamily(id){return !!(D.FAM&&D.FAM[id])}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function tx(s){return String(s==null?'':s).replace(/\{([^{}|]*)\|([^{}]*)\}/g,function(_,a,b){return root.GG?root.GG(a,b):a}).replace(/§([^§|]+)\|([^§]+)§/g,function(_,a,b){return root.GG?root.GG(a,b):a})}
function css(){
 if(document.getElementById('bg16-css'))return;
 var s=document.createElement('style');s.id='bg16-css';
 s.textContent='.bg16{margin:0 0 28px;padding:24px 18px 28px;color:#ffffff !important;opacity:1 !important}.bg16 h1{font-family:"Cormorant Garamond",serif;font-size:32px;line-height:1.1;color:#f0d9a8 !important;margin:4px 0 12px;text-align:center;opacity:1 !important}.bg16 h2{font-family:"Cormorant Garamond",serif;font-size:24px;line-height:1.2;color:#f0d9a8 !important;margin:10px 0 14px;opacity:1 !important}.bg16 p,.bg16 li,.bg16 span,.bg16 b,.bg16 strong{color:#ffffff !important;opacity:1 !important}.bg16-muted{color:#e0c080 !important;font-size:14px;text-align:center;opacity:1 !important}.bg16-card{margin:16px 0;padding:18px;border:1.5px solid rgba(201,164,106,.35);border-radius:18px;background:#1a120c !important}.bg16-card,.bg16-card *{color:#ffffff !important;opacity:1 !important}.bg16-card h1,.bg16-card h2,.bg16-card h3,.bg16-card b{color:#f0d9a8 !important;opacity:1 !important}.bg16-kicker{color:#e0a940 !important;font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:700;text-align:center;margin-bottom:6px;opacity:1 !important}.bg16-choices{display:grid;gap:12px;margin:18px 0}.bg16-choice,.bg16-special{width:100%;padding:16px 16px;border:1.5px solid #6b4c2c;border-radius:16px;background:#24160c !important;color:#ffffff !important;text-align:left;font:600 16px/1.4 Manrope,system-ui;min-height:52px;opacity:1 !important}.bg16-choice.selected,.bg16-special.selected{border-color:#ffd877;background:#4a3010 !important;color:#ffffff !important;opacity:1 !important}.bg16-special{margin-top:8px;background:transparent !important;font-size:15px;border-style:dashed;color:#ffffff !important;opacity:1 !important}.bg16-actions{display:flex;flex-direction:column;gap:10px;margin-top:22px;align-items:center}.bg16-actions button{width:100%;max-width:320px;min-height:52px;border-radius:999px;border:0;background:linear-gradient(#f0c870,#c98a40) !important;color:#1a0e04 !important;font:800 18px Manrope;box-shadow:0 6px 0 #0e0905;opacity:1 !important}.bg16-actions button.gh{background:transparent !important;border:1.5px solid #c9a46a;color:#f0d9a8 !important;box-shadow:none;font-weight:600;opacity:1 !important}.bg16-actions button:disabled{color:#6b5a40 !important;opacity:.7}.bg16 progress{width:100%;height:7px;accent-color:#e0a940;border-radius:4px;margin:6px 0 16px}.bg16-option{display:block;margin:10px 0;padding:12px 14px;border-radius:12px;background:#24160c;border:1px solid #6b4c2c;color:#ffffff !important;opacity:1 !important}.bg16-result{border-left:3px solid #e0a940;padding:8px 0 8px 14px;margin:16px 0;color:#ffffff !important;opacity:1 !important}.bg16-tag{display:inline-block;padding:5px 11px;border:1px dashed #e0a940;border-radius:999px;color:#e0a940 !important;font-size:12px;font-weight:700;margin:3px 4px 3px 0;background:rgba(224,169,64,.12);opacity:1 !important}.bg16-secondary{margin-top:20px;padding:18px;border:1.5px solid rgba(201,164,106,.3);border-radius:18px;background:#1a120c !important}.bg16-secondary,.bg16-secondary *{color:#ffffff !important;opacity:1 !important}.bg16-secondary h3{font-size:17px;color:#e0a940 !important;margin:0 0 6px;text-align:center;opacity:1 !important}.bg16-note{font-size:14px;color:#e0c080 !important;margin:4px 0 12px;text-align:center;opacity:1 !important}.bg16-hero-btn{display:block;width:100%;max-width:280px;margin:24px auto 8px;padding:16px;border:0;border-radius:999px;background:linear-gradient(#f0c870,#c98a40) !important;color:#1a0e04 !important;font:800 19px Manrope;box-shadow:0 8px 0 #0e0905;text-align:center;opacity:1 !important}';
 document.head.appendChild(s);
}
function rng(seed){var x=seed>>>0;return function(){x=(x+0x6D2B79F5)|0;var t=Math.imul(x^x>>>15,1|x);t^=t+Math.imul(t^t>>>7,61|t);return ((t^t>>>14)>>>0)/4294967296}}
function shuffle(list,random){var a=list.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
function freshDraft(){
 var seed=(Date.now()^Math.floor(Math.random()*0xffffffff))>>>0,random=rng(seed),order=shuffle(D.Q.map(function(q){return q[0]}),random),optionOrder={};
 D.Q.forEach(function(q){optionOrder[q[0]]=shuffle(q[3].map(function(_,i){return i}),random)});
 return {version:1,seed:seed,order:order,optionOrder:optionOrder,answers:{},followup:{},startedAt:Date.now(),updatedAt:Date.now()};
}
function mount(box){
 css();
 var G=root.GTests||{},preview=!!G.preview,retake=!!G.retakeMode;
 var P=G.load?G.load():(root.GProfile?GProfile.load():{}),bp=P.backgroundProfile||{},saved=bp.backgroundState&&bp.backgroundState.version===2?bp.backgroundState:null;
 var draft=bp.backgroundStateDraft16&&bp.backgroundStateDraft16.version===1?bp.backgroundStateDraft16:null,step=0,stage='intro';
 if(preview){try{draft=JSON.parse(sessionStorage.getItem('alch_v5_bg16_preview')||'null')||draft}catch(e){}}
 if(draft&&(!Array.isArray(draft.order)||draft.order.length!==D.Q.length))draft=null;
 function saveDraft(){
  draft.updatedAt=Date.now();
  if(preview){try{sessionStorage.setItem('alch_v5_bg16_preview',JSON.stringify(draft))}catch(e){}return true}
  try{
   var p=root.GProfile?GProfile.load():G.load(),b=p.backgroundProfile&&typeof p.backgroundProfile==='object'?p.backgroundProfile:{};
   b.backgroundStateDraft16=draft;p.backgroundProfile=b;
   if(p.modules&&p.modules.backgroundProfile){p.modules.backgroundProfile.result=JSON.parse(JSON.stringify(b));p.modules.backgroundProfile.updatedAt=Date.now()}
   if(root.GProfile)GProfile.save(p);else localStorage.setItem('alch_v5_profile',JSON.stringify(p));
   P=p;bp=b;return true;
  }catch(e){return false}
 }
 function saveResult(result){
  result.completedAt=Date.now();
  if(preview){saved=result;root.GBackgroundState16PreviewResult=result;return}
  var p=root.GProfile?GProfile.load():G.load(),b=p.backgroundProfile&&typeof p.backgroundProfile==='object'?p.backgroundProfile:{};
  if(b.backgroundState){b.backgroundStateHistory=arr(b.backgroundStateHistory);b.backgroundStateHistory.push(b.backgroundState);if(b.backgroundStateHistory.length>5)b.backgroundStateHistory.shift()}
  b.backgroundState=result;b.algoVersion=2;delete b.backgroundStateDraft16;p.backgroundProfile=b;
  if(root.GProfile)GProfile.saveResult('backgroundProfile',b,null,{profile:p,save:true});else localStorage.setItem('alch_v5_profile',JSON.stringify(p));
  if(root.GTests&&GTests.reactorIn){var current=root.GProfile?GProfile.load():JSON.parse(localStorage.getItem('alch_v5_profile')||'{}');current.reactorIn=GTests.reactorIn(current);if(root.GProfile)GProfile.save(current);else localStorage.setItem('alch_v5_profile',JSON.stringify(current));P=current;bp=current.backgroundProfile||b}else{P=p;bp=b}
  saved=result;
 }
 function shell(html){box.innerHTML='<div class="bg16">'+html+'</div>';bind()}
 function qById(id){return D.Q.filter(function(q){return q[0]===id})[0]}
 function firstMissing(){if(!draft)return 0;for(var i=0;i<draft.order.length;i++){var a=draft.answers[draft.order[i]];if(!a||a.primary==null&&!a.skipped)return i}return draft.order.length}
 function intro(){
  var count=Object.keys(draft&&draft.answers||{}).filter(function(k){var a=draft.answers[k];return a&&(a.primary!=null||a.skipped)}).length;
  shell('<span class="tag">Точка 0 · Начало исследования</span><div class="bg16-kicker">Ведущее фоновое состояние</div><h1>Что обычно остается внутри?</h1>'+
   '<p>16 жизненных сцен охватывают восемь сфер: здоровье, финансы, карьеру, отношения, семью, друзей, рост и отдых. Мы посмотрим, какие внутренние реакции повторяются в разных обстоятельствах.</p>'+
   '<p>В каждой сцене выбери то, что чаще появляется первым. Если бывает и другой вариант, его можно отметить дополнительно. Здесь нет правильных ответов: важнее обычная реакция, а не образ себя, каким хотелось бы быть.</p>'+
   '<div class="bg16-card"><b>Две стороны картины</b><p>Мы отдельно рассмотрим ресурсные состояния — то, что помогает жить, выбирать и чувствовать полноту опыта, — и защитные ожидания, которые могут добавлять напряжение.</p><p class="bg16-muted">«По-разному» и «ни один вариант» не будут насильно распределяться по категориям.</p></div>'+
   (count?'<p class="bg16-muted">Сохранено: '+count+' из 16 сцен. Можно продолжить с того же места.</p>':'')+
   (saved&&!retake?'<p class="bg16-muted">Исследование уже пройдено. Предыдущий результат сохранен.</p>':'')+
   '<div class="bg16-actions"><button type="button" class="bg16-hero-btn" id="bg16Start">'+(count?'Продолжить':saved?'Начать заново':'Начать исследование')+'</button>'+
   (saved&&!retake?'<button type="button" id="bg16Show">Посмотреть результат</button>':'')+'</div>');
 }
 function question(){
  stage='questions';
  var qid=draft.order[step],q=qById(qid),a=draft.answers[qid]||{},indices=draft.optionOrder[qid]||[0,1,2,3];
  var opts=indices.map(function(i){return {text:q[3][i][0],key:q[3][i][1]}}),primary=a.primary;
  var primaryHtml=opts.map(function(o){return '<button type="button" class="bg16-choice '+(primary===o.key?'selected':'')+'" data-bg16-primary="'+o.key+'">'+esc(tx(o.text))+'</button>'}).join('');
  var specialHtml=D.SPECIAL.map(function(o){return '<button type="button" class="bg16-special '+(primary===o[1]?'selected':'')+'" data-bg16-primary="'+o[1]+'">'+esc(o[0])+'</button>'}).join('');
  var secondaryHtml='';
  if(primary&&isFamily(primary)){
   secondaryHtml='<div class="bg16-secondary"><h3>Дополнительное наблюдение</h3><p class="bg16-note">Необязательно. А какой вариант тоже иногда бывает? Отметь его, если узнаешь в нём свою реакцию.</p>'+
    opts.filter(function(o){return o.key!==primary}).map(function(o){return '<button type="button" class="bg16-choice '+(a.secondary===o.key?'selected':'')+'" data-bg16-secondary="'+o.key+'">'+esc(tx(o.text))+'</button>'}).join('')+
    '<button type="button" class="bg16-special '+(!a.secondary?'selected':'')+'" data-bg16-secondary="">Не добавлять</button></div>';
  }else if(primary==='v'||primary==='x'){
   secondaryHtml='<p class="bg16-muted">Этот ответ останется отдельным наблюдением и не будет распределен между семействами.</p>';
  }
  shell('<span class="tag">Фоновое состояние · '+(step+1)+' из 16</span><div class="bg16-kicker">'+esc(D.SPHERES[q[1]])+'</div>'+
   '<progress max="16" value="'+(step+1)+'"></progress><h2>'+esc(tx(q[2]))+'</h2>'+
   '<p>Что у тебя внутри появляется первым?</p><div class="bg16-choices">'+primaryHtml+specialHtml+'</div>'+
   secondaryHtml+
   '<div class="bg16-actions"><button type="button" id="bg16Next" '+(primary==null?'disabled':'')+'>'+(step===15?'К уточнениям':'Далее')+'</button><button type="button" class="gh" id="bg16Back" '+(step===0?'disabled':'')+'>Назад</button><button type="button" class="gh" id="bg16Skip">Пропустить сцену</button></div>'+
   '<p class="bg16-muted">Порядок сцен и вариантов перемешан. Ответы сохраняются в этом браузере; пропуск не считается ответом.</p>');
 }
 function preliminary(){
  return E.calculate(draft.answers,{}, {startedAt:draft.startedAt,seed:draft.seed});
 }
 var FOLLOW={
  protectiveRecovery:['Несколько минут','До нескольких часов','До конца дня','Несколько дней','По-разному','Пока не могу сказать'],
  protectiveContext:['Чаще есть конкретные факты или ограничения, которые это объясняют.','Иногда есть факты, но моя реакция бывает сильнее самой ситуации.','Часто ощущение возникает раньше, чем я проверю факты и доступные варианты.','По-разному; зависит от ситуации и сферы.','Пока не могу оценить.'],
  resourceDuration:['Только пока длится ситуация','Еще несколько минут или часов','Большую часть дня','Несколько дней','По-разному','Пока не могу сказать'],
  resourceTransfer:['Да, легко переходит в другие сферы','Иногда переносится','Обычно остается в одной сфере','Зависит от обстоятельств','Пока не могу сказать']
 };
 function followup(){
  stage='followup';
  var r=preliminary(),need=E.needsFollowup(r),html='<span class="tag">Предварительная карта</span><div class="bg16-kicker">Короткая сверка</div><h1>Как долго это состояние остается с тобой?</h1><p>Уточним не только частоту выбора, но и то, как состояние проявляется во времени. Ресурс и напряженная реакция измеряются по-разному.</p>';
  if(need.protective){
   html+='<div class="bg16-card"><b>Если включается защитная реакция</b><p>Сколько обычно проходит времени, прежде чем ты возвращаешься к обычному состоянию и снова можешь спокойно выбирать, что делать?</p>'+radios('protectiveRecovery',FOLLOW.protectiveRecovery,draft.followup.protectiveRecovery)+'<div class="bg16-secondary"><b>Контекстная сверка</b><p>Насколько это ощущение связано с реальными обстоятельствами — конкретными действиями других людей, объективной нехваткой ресурсов или настоящими ограничениями?</p>'+radios('protectiveContext',FOLLOW.protectiveContext,draft.followup.protectiveContext)+'</div></div>';
  }
  if(need.resource){
   html+='<div class="bg16-card"><b>Если доступно ресурсное состояние</b><p>Как долго оно обычно сохраняется после ситуации?</p>'+radios('resourceDuration',FOLLOW.resourceDuration,draft.followup.resourceDuration)+
   '<p>Насколько легко перенести его в другие сферы жизни?</p>'+radios('resourceTransfer',FOLLOW.resourceTransfer,draft.followup.resourceTransfer)+'</div>';
  }
  if(!need.any)html+='<div class="bg16-card"><p>Пока нет достаточно повторяющегося сигнала, чтобы задавать уточняющий вопрос. Это нормальный результат: возможно, реакции заметно меняются в зависимости от обстоятельств.</p></div>';
  html+='<div class="bg16-actions"><button type="button" id="bg16BackToQuestions">Назад к сценам</button><button type="button" id="bg16Finish">Собрать карту</button></div><p class="bg16-muted">Можно оставить уточнения без ответа. Они дополняют картину, но не меняют баллы выбранных сцен.</p>';
  shell(html);
 }
 function radios(key,options,current){
  return '<div class="bg16-choices">'+options.map(function(o){return '<label class="bg16-option"><input type="radio" name="'+key+'" value="'+esc(o)+'" '+(current===o?'checked':'')+' data-bg16-follow="'+key+'">'+esc(o)+'</label>'}).join('')+'</div>';
 }
 function groupLabel(status){
  return status==='leading'?'Предварительно выделяется один ведущий сигнал':status==='two_close'?'Два близких сигнала':'Пока нет одного ведущего сигнала';
 }
 function groupHtml(group,title,all){
  var html='<section class="bg16-card"><h2>'+title+'</h2><p>'+groupLabel(group.status)+'.</p>';
  if(group.leaders.length){
   group.leaders.forEach(function(id){var f=all.filter(function(x){return x.id===id})[0];if(!f)return;
    html+='<div class="bg16-result"><b>'+esc(f.title)+'</b><p>'+esc(f.description)+'</p><span class="bg16-tag">'+f.sphereCount+' из 8 сфер</span><span class="bg16-tag">Баллы: '+f.points+'/8</span></div>';
   });
  }else{
   var candidates=group.families.filter(function(x){return x.points>0}).slice(0,2);
   if(candidates.length)html+='<p class="bg16-muted">Есть отдельные сигналы, но пока недостаточно повторений в разных сферах, чтобы выделить ведущее состояние.</p>';
   else html+='<p class="bg16-muted">В выбранных ответах пока не проявился повторяющийся сигнал этой группы.</p>';
  }
  return html+'</section>';
 }
 function result(){
  stage='result';
  var r=saved||preliminary(),html='<span class="tag">Фоновое состояние · результат</span><div class="bg16-kicker">Предварительная карта</div><h1>Что повторяется в разных сферах</h1>'+
   '<div class="bg16-card"><b>'+r.coverage.answered+' из 16 сцен отвечено</b><p>'+r.coverage.spheres+' сфер охвачено ответами. Дополнительных выборов: '+r.coverage.secondary+'. «По-разному»: '+r.coverage.depends+'. «Ни один вариант»: '+r.coverage.none+'.</p></div>'+
   groupHtml(r.groups.resource,'Ресурсные состояния',r.families)+groupHtml(r.groups.protective,'Защитные ожидания',r.families)+
   '<h2>Другие замеченные сигналы</h2>';
  var others=r.families.filter(function(f){return f.points>0&&r.groups.resource.leaders.indexOf(f.id)<0&&r.groups.protective.leaders.indexOf(f.id)<0}).sort(function(a,b){return b.points-a.points});
  if(others.length)others.forEach(function(f){html+='<article class="bg16-card"><b>'+esc(f.title)+'</b><div class="bg16-bar"><i style="width:'+Math.max(0,Math.min(100,f.share*100))+'%"></i></div><p class="bg16-muted">'+esc(f.repeatLabel)+'. Баллы: '+f.points+'/8. Основных выборов: '+f.primaryCount+', дополнительных: '+f.secondaryCount+'.</p></article>'});
  else html+='<p class="bg16-muted">Других повторяющихся сигналов пока нет.</p>';
  if(r.followup&&Object.keys(r.followup).length){
   html+='<div class="bg16-card"><h2>Временная характеристика</h2>';
   if(r.followup.protectiveRecovery)html+='<p><b>Возврат к обычному состоянию:</b> '+esc(r.followup.protectiveRecovery)+'</p>';
   if(r.followup.protectiveContext)html+='<p><b>Связь с внешними обстоятельствами:</b> '+esc(r.followup.protectiveContext)+'</p>';
   if(r.followup.resourceDuration)html+='<p><b>Сохранение ресурса:</b> '+esc(r.followup.resourceDuration)+'</p>';
   if(r.followup.resourceTransfer)html+='<p><b>Перенос в другие сферы:</b> '+esc(r.followup.resourceTransfer)+'</p>';
   html+='</div>';
  }
  html+='<p class="bg16-muted">Это гипотеза по ответам в 16 предложенных сценах, а не ярлык и не диагноз. Реальная нехватка ресурсов, опасность, неравное отношение и объективные ограничения не объясняются внутренним состоянием автоматически. Позже мы сопоставим эту карту с другими исследованиями и конкретными эпизодами.</p>'+
   '<div class="bg16-actions"><button type="button" id="bg16Continue">'+(preview||retake?'Вернуться к заданиям':'Продолжить путь')+'</button><button type="button" id="bg16Retake">Пройти заново</button></div>';
  shell(html);
 }
 function bind(){
  var start=box.querySelector('#bg16Start');if(start)start.onclick=function(){if(!draft)draft=freshDraft();step=firstMissing();if(step>=16)followup();else question()};
  var show=box.querySelector('#bg16Show');if(show)show.onclick=function(){result()};
  box.querySelectorAll('[data-bg16-primary]').forEach(function(b){b.onclick=function(){
   var qid=draft.order[step],a=draft.answers[qid]||{};a.primary=b.dataset.bg16Primary;a.secondary=null;delete a.skipped;draft.answers[qid]=a;saveDraft();question();
  }});
  box.querySelectorAll('[data-bg16-secondary]').forEach(function(b){b.onclick=function(){
   var qid=draft.order[step],a=draft.answers[qid]||{};a.secondary=b.dataset.bg16Secondary||null;draft.answers[qid]=a;saveDraft();question();
  }});
  var back=box.querySelector('#bg16Back');if(back)back.onclick=function(){if(step>0){step--;question()}};
  var skip=box.querySelector('#bg16Skip');if(skip)skip.onclick=function(){var qid=draft.order[step];draft.answers[qid]={primary:null,secondary:null,skipped:true};saveDraft();step++;if(step>=16)followup();else question()};
  var next=box.querySelector('#bg16Next');if(next)next.onclick=function(){var qid=draft.order[step],a=draft.answers[qid];if(!a||a.primary==null)return;step++;saveDraft();if(step>=16)followup();else question()};
  box.querySelectorAll('[data-bg16-follow]').forEach(function(b){b.onchange=function(){draft.followup[b.dataset.bg16Follow]=b.value;saveDraft()}});
  var backQ=box.querySelector('#bg16BackToQuestions');if(backQ)backQ.onclick=function(){step=15;question()};
  var finish=box.querySelector('#bg16Finish');if(finish)finish.onclick=function(){var r=E.calculate(draft.answers,draft.followup,{startedAt:draft.startedAt,seed:draft.seed});saveResult(r);result()};
  var cont=box.querySelector('#bg16Continue');if(cont)cont.onclick=function(){
   if(preview||retake){location.href='tasks.html'+(retake?'#skipped':'');return}
   if(root.GRoute&&GRoute.advance)location.href=GRoute.advance();else location.href='tasks.html';
  };
  var again=box.querySelector('#bg16Retake');if(again)again.onclick=function(){draft=freshDraft();step=0;saveDraft();intro()};
 }
 if(saved&&!(draft&&draft.updatedAt&&draft.updatedAt>(saved.completedAt||saved.at||0))&&!retake){result();return}
 intro();
}
root.GBackgroundState16Test={mount:mount};
})(window);
