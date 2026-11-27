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
 var s=document.getElementById('bg16-css');
 if(!s){s=document.createElement('style');s.id='bg16-css';}
 s.textContent="#m .bg16{--bg16-ink:#3a2410;--bg16-muted:#6e5028;--bg16-line:#c9a46a;box-sizing:border-box;margin:0 0 28px;padding:22px 16px 28px;border-radius:18px;background:#f4e8cf!important;color:#3a2410!important;font-family:Manrope,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif!important;opacity:1!important}#m .bg16,#m .bg16 *{box-sizing:border-box;text-shadow:none!important;opacity:1!important}#m .bg16 p,#m .bg16 li,#m .bg16 span,#m .bg16 b,#m .bg16 strong,#m .bg16 label,#m .bg16 small{color:#3a2410!important}#m .bg16 h1,#m .bg16 h2,#m .bg16 h3{font-family:'Cormorant Garamond',Georgia,serif!important;color:#5c3a12!important;-webkit-text-fill-color:#5c3a12!important;font-weight:700!important;text-shadow:none!important}#m .bg16 h1{font-size:30px;line-height:1.15;margin:8px 0 14px;text-align:center}#m .bg16 h2{font-size:25px;line-height:1.2;margin:12px 0 14px}#m .bg16 h3{font-size:20px;line-height:1.25;margin:0 0 8px}#m .bg16 p{font-size:16px;line-height:1.6;margin:10px 0;color:#4a3018!important}#m .bg16 .tag{display:inline-block;background:#e8c16c!important;color:#26190b!important;border:1px solid #c99a45!important;border-radius:20px;padding:4px 12px;font-size:14px;font-weight:700}#m .bg16-kicker{display:block;color:#8a5212!important;font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:800;text-align:center;margin:12px 0 7px}#m .bg16-muted,#m .bg16 .bg16-muted{color:#6e5028!important;font-size:14px;line-height:1.5;text-align:center}#m .bg16-card,#m .bg16-secondary{margin:16px 0;padding:17px;border:1px solid #d9bf8c!important;border-radius:14px;background:#fffaf0!important;color:#3a2410!important;box-shadow:none}#m .bg16-card *,#m .bg16-secondary *{color:#3a2410!important}#m .bg16-card h1,#m .bg16-card h2,#m .bg16-card h3,#m .bg16-secondary h3{color:#5c3a12!important;-webkit-text-fill-color:#5c3a12!important}#m .bg16-resource-copy{display:block;margin:12px 0;padding:13px 14px;border:1px solid #c9a46a!important;border-radius:12px;background:#f8efdc!important;color:#4a3018!important;line-height:1.6}#m .bg16 .bg16-note{color:#6e5028!important;font-size:14px;text-align:left}#m .bg16-choices{display:grid;gap:10px;margin:16px 0}#m .bg16-choice,#m .bg16-special{display:block;width:100%;min-height:54px;padding:14px 15px;border:1.5px solid #c9a46a!important;border-radius:12px;background:#fffaf0!important;color:#3a2410!important;text-align:left;font:600 16px/1.45 Manrope,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif!important;white-space:normal;overflow-wrap:anywhere;box-shadow:none}#m .bg16-choice.selected,#m .bg16-special.selected{border:2px solid #9e783a!important;background:linear-gradient(180deg,#ffe9a8,#e0a940)!important;color:#2a1606!important;font-weight:800!important;box-shadow:0 0 0 2px rgba(201,154,69,.22)!important}#m .bg16-choice.selected:before,#m .bg16-special.selected:before{content:'✓';display:inline-block;margin-right:10px;color:#2a1606!important;font-weight:900}#m .bg16-special{margin-top:6px;background:#fff6e2!important;border-color:#b8893f!important;color:#5a3a1a!important;font-size:15px!important}#m .bg16-actions{display:flex;flex-direction:column;gap:10px;margin-top:22px;align-items:center}#m .bg16-actions button,#m .bg16-hero-btn{display:block;width:100%;max-width:340px;min-height:52px;margin:0 auto;padding:13px 18px;border:0!important;border-radius:12px;background:#edc879!important;color:#291a08!important;font:800 17px/1.35 Manrope,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif!important;box-shadow:none!important;text-align:center}#m .bg16-actions button.gh{background:#fffaf0!important;border:1.5px solid #c9a46a!important;color:#3a2410!important;box-shadow:none!important;font-weight:700!important}#m .bg16-actions button:disabled{background:#e8dfcd!important;border-color:#d9bf8c!important;color:#8a7658!important;opacity:1!important}#m .bg16-option{display:flex;align-items:flex-start;gap:10px;margin:9px 0;padding:13px 14px;border-radius:12px;background:#fffaf0!important;border:1px solid #c9a46a!important;color:#3a2410!important;font-size:15px;line-height:1.45}#m .bg16-option input[type=radio]{flex:0 0 20px;width:20px;height:20px;margin:2px 0 0;accent-color:#9e783a}#m .bg16-result{border-left:3px solid #e0a940;padding:9px 0 9px 13px;margin:14px 0;color:#3a2410!important}#m .bg16-result p{color:#4a3018!important}#m .bg16-tag{display:inline-block;padding:5px 9px;border:1px solid #c9a46a!important;border-radius:999px;color:#7a4512!important;font-size:12px;font-weight:800;margin:3px 4px 3px 0;background:#fff6e2!important}#m .bg16 progress{display:block;width:100%;height:8px;accent-color:#e0a940;border-radius:8px;margin:8px 0 16px}#m .bg16 a{color:#7a4512!important;text-decoration:underline}#m .bg16 button:focus-visible,#m .bg16 input:focus-visible{outline:3px solid #9e783a!important;outline-offset:3px}@media(prefers-reduced-motion:no-preference){#m .bg16 button{transition:background-color .15s ease,border-color .15s ease,box-shadow .15s ease}}"
 if(!s.parentNode)document.head.appendChild(s);
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
   '<div class="bg16-card"><b>Две стороны картины</b><p class="bg16-resource-copy">Мы отдельно рассмотрим ресурсные состояния — то, что помогает жить, выбирать и чувствовать полноту опыта, — и защитные ожидания, которые могут добавлять напряжение.</p><p class="bg16-muted">«По-разному» и «ни один вариант» не будут насильно распределяться по категориям.</p></div>'+
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
   secondaryHtml='<div class="bg16-secondary"><h3>Дополнительное наблюдение</h3><p class="bg16-note">Необязательно. А какой вариант тоже иногда бывает? Отметь его, если узнаешь в нем свою реакцию.</p>'+
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
   html+='<div class="bg16-card"><b>Когда внутри становится тяжелее</b><p>Сколько обычно проходит времени, прежде чем ты возвращаешься к обычному состоянию и снова можешь спокойно выбирать?</p>'+radios('protectiveRecovery',FOLLOW.protectiveRecovery,draft.followup.protectiveRecovery)+'<div class="bg16-secondary"><b>Насколько это про реальные обстоятельства</b><p>Это ощущение чаще из-за конкретных действий других людей, нехватки ресурсов или настоящих ограничений — или оно появляется само, даже когда внешне все спокойно?</p>'+radios('protectiveContext',FOLLOW.protectiveContext,draft.followup.protectiveContext)+'</div></div>';
  }
  if(need.resource){
   html+='<div class="bg16-card"><b>Когда внутри легче и яснее</b><p>Как долго это состояние обычно держится после ситуации?</p>'+radios('resourceDuration',FOLLOW.resourceDuration,draft.followup.resourceDuration)+
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
    html+='<div class="bg16-result"><b>'+esc(f.title)+'</b><p>'+esc(f.description)+'</p><span class="bg16-tag">проявилось в '+f.sphereCount+' из 8 сфер</span></div>';
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
  if(others.length)others.forEach(function(f){html+='<article class="bg16-card"><b>'+esc(f.title)+'</b><div class="bg16-bar"><i style="width:'+Math.max(0,Math.min(100,f.share*100))+'%"></i></div><p class="bg16-muted">'+esc(f.repeatLabel)+'.</p></article>'});
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
  if(root.GResultCard&&!preview){
   var resL=(r.groups.resource.leaders||[]).map(function(id){var f=r.families.filter(function(x){return x.id===id})[0];return f?f.title:id});
   var proL=(r.groups.protective.leaders||[]).map(function(id){var f=r.families.filter(function(x){return x.id===id})[0];return f?f.title:id});
   var cardHost=box.querySelector('.bg16')||box;
   root.GResultCard.attachDiaryBar(cardHost,{
    id:'bg16',step:'slot.html?id=bg16',title:'Ведущее фоновое состояние',passed:'Точка 0',
    lead:r.coverage.answered+' из 16 сцен, охвачено сфер: '+r.coverage.spheres+'. Это рабочая карта повторений в разных сферах, а не диагноз.',
    strong:resL.join(' · '),insight:proL.join(' · '),insightLabel:'Защитные ожидания',
    at:r.completedAt||Date.now()
   });
  }
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
