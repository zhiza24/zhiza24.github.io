/* Последовательная лаборатория внутреннего механизма: 10 коротких блоков после BG16. */
(function(){
'use strict';
var KEY='alch_v5_profile',DATA=window.GIM_DATA;
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return {}}}
function save(P){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function css(){if(document.getElementById('gim-css'))return;var s=document.createElement('style');s.id='gim-css';s.textContent=
'.gim-progress{height:7px;background:#382b1c;border-radius:9px;overflow:hidden;margin:12px 0 20px}.gim-progress i{display:block;height:100%;background:#d6ad62}.gim-q{padding:13px;margin:12px 0;border:1px solid #634b2a;border-radius:14px;background:#1b140d}.gim-q p{margin:0 0 10px;font-size:16px;line-height:1.5;color:#F4ECDF!important;-webkit-text-fill-color:#F4ECDF!important}.gim-q p b{color:#F0C870!important;-webkit-text-fill-color:#F0C870!important}.gim-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.gim-opt{min-height:42px;padding:8px 6px;border:1px solid #73552e;border-radius:9px;background:#241a10;color:#f3e5ca;font:600 13px Manrope,sans-serif}.gim-opt.sel{background:#e4bd70;color:#2b1c0b;border-color:#e4bd70}.gim-nav{display:flex;gap:8px;margin-top:18px}.gim-nav button{flex:1;min-height:48px;border-radius:11px;border:1px solid #9e783a;background:#20170e;color:#f4ecdf;font:700 15px Manrope}.gim-nav .primary{background:#edc879;color:#291a08;border:0}.gim-note{font-size:14px;color:#cbb895}.gim-field{width:100%;box-sizing:border-box;background:#20170e;color:#f4ecdf;border:1px solid #9e783a;border-radius:9px;padding:10px;font:15px Manrope;margin:5px 0 12px}.gim-result{padding:14px;margin:12px 0;border:1px solid #806035;border-radius:14px;background:#1b140d}.gim-meter{height:8px;background:#392b1a;border-radius:8px;overflow:hidden}.gim-meter i{display:block;height:100%;background:#d6ad62}.gim-small{font-size:13px;color:#bfa77f}.gim-trigger-panel{margin:14px 0;padding:15px;border:1px solid #9e783a;border-radius:14px;background:linear-gradient(160deg,#2a1d10,#17100a);color:#f4ecdf}.gim-trigger-panel h2{margin:0 0 8px;color:#f0c870;font:700 23px Georgia,serif}.gim-trigger-panel p{color:#e6d6bb;font-size:14px;line-height:1.5}.gim-trigger-item{margin:10px 0;padding:11px 12px;border:1px solid #634b2a;border-radius:10px;background:#20170e;color:#f4ecdf;font-size:14px;line-height:1.5}.gim-trigger-item b{display:block;color:#f0c870;margin-bottom:4px}.gim-trigger-pill{display:inline-block;margin:0 0 6px;padding:3px 8px;border-radius:999px;background:#e0a940;color:#291a08;font-size:12px;font-weight:800}.gim-trigger-resource{border-color:#9e783a;background:#241a10}.gim-trigger-empty{padding:11px;border:1px dashed #806035;border-radius:10px;color:#d7c3a2;font-size:14px;line-height:1.5}';
document.head.appendChild(s)}
function mount(box){
 if(!DATA){box.innerHTML='<p>Лаборатория пока не загрузилась. Вернись к карте пути и попробуй еще раз.</p>';return}
 css();var P=load();P.innerMechanism=P.innerMechanism||{version:1,answers:{},sections:{},episodes:{}};var S=P.innerMechanism,idx=0,mode='sections';
 var prior=S.lastSection||0;
 function persist(){S.lastSection=idx;S.updatedAt=Date.now();P.innerMechanism=S;save(P)}
 function progress(){var done=Object.keys(S.sections||{}).filter(function(k){return S.sections[k]&&S.sections[k].completedAt}).length;return done}
 function triggerSignals(){
  var sec=DATA.sections.filter(function(x){return x.id==='triggers'})[0],groups={},resources=[],out=[];
  if(!sec)return {groups:[],resources:[],answered:0};
  sec.items.forEach(function(q){
   var v=S.answers[q[0]],label=S.answerLabels&&S.answerLabels[q[0]];
   if(v===undefined)return;
   if(!label){var opt=DATA.scale.filter(function(o){return o.v===v})[0];label=opt?opt.l:'Не указано'}
   if(typeof v!=='number')return;
   var item={id:q[0],text:q[1],value:v,label:label};
   if(q[3]==='resource'){if(v>=1)resources.push(item);return}
   if(v<1)return;
   var key=q[2];groups[key]=groups[key]||{id:key,name:DATA.families[key]||key,items:[],score:0};
   groups[key].items.push(item);groups[key].score=Math.max(groups[key].score,v);
  });
  Object.keys(groups).forEach(function(k){
   var x=groups[k];x.items.sort(function(a,b){return b.value-a.value});x.support=[];
   DATA.sections.forEach(function(other){
    if(other.id==='triggers')return;
    other.items.forEach(function(q){
     var v=S.answers[q[0]];
     if(q[2]===k&&q[3]==='protective'&&typeof v==='number'&&v>=2){
      var label=S.answerLabels&&S.answerLabels[q[0]];
      if(!label){var opt=DATA.scale.filter(function(o){return o.v===v})[0];label=opt?opt.l:'Не указано'}
      x.support.push({section:other.title,text:q[1],label:label,value:v});
     }
    });
   });
   x.support.sort(function(a,b){return b.value-a.value});
   out.push(x);
  });
  out.sort(function(a,b){return b.score-a.score||b.items.length-a.items.length});
  resources.sort(function(a,b){return b.value-a.value});
  return {groups:out,resources:resources,answered:sec.items.filter(function(q){return S.answers[q[0]]!==undefined}).length};
 }
 function triggerPanel(){
  var data=triggerSignals(),html='<section class="gim-trigger-panel"><h2>Что уже удалось выявить</h2><p>Это не просьба перечислить триггеры вручную. Ниже — ситуации, которые выделились по твоим ответам в первом блоке.</p>';
  if(!data.groups.length)html+='<div class="gim-trigger-empty">Пока недостаточно ответов, чтобы выделить повторяющиеся условия. Они появятся здесь автоматически по мере заполнения первого блока.</div>';
  else data.groups.forEach(function(group){
   var top=group.items[0],rank=top.value===3?'Часто отмечается':top.value===2?'Иногда отмечается':'Редкий сигнал';
   html+='<div class="gim-trigger-item"><b>'+esc(group.name)+'</b><span class="gim-trigger-pill">'+rank+'</span>'+group.items.map(function(item){return '<div>'+esc(item.text)+' <strong>— '+esc(item.label)+'</strong></div>'}).join('')+(group.support.length?'<p class="gim-small">Подтверждающие ответы из других блоков:</p>'+group.support.slice(0,3).map(function(item){return '<div class="gim-small">'+esc(item.section)+': '+esc(item.text)+' — '+esc(item.label)+'</div>'}).join(''):'')+'</div>';
  });
  if(data.resources.length)html+='<div class="gim-trigger-item gim-trigger-resource"><b>Ресурсный сигнал</b>'+data.resources.map(function(item){return '<div>'+esc(item.text)+' <strong>— '+esc(item.label)+'</strong></div>'}).join('')+'</div>';
  html+='<p>Мы показываем только то, что отмечено в ответах. Это рабочие сигналы, а не диагноз и не окончательное объяснение реакции.</p></section>';
  return html;
 }
 function draw(){
  var sec=DATA.sections[idx],done=progress(),html='<span class="tag">Точка 0</span><span class="tag">Лаборатория внутреннего механизма</span><h1>Исследование '+(idx+1)+' из 10</h1><div class="gim-progress"><i style="width:'+Math.round(done/10*100)+'%"></i></div><h2>'+esc(sec.title)+'</h2><p>'+esc(sec.intro)+'</p><p class="gim-note">Выбирай то, что чаще соответствует твоему опыту. Можно отвечать по-разному в разных обстоятельствах. Ответы сохраняются автоматически.</p>';
  sec.items.forEach(function(q,n){var v=S.answers[q[0]],opts=DATA.scale;html+='<div class="gim-q"><p style="color:#F4ECDF!important;-webkit-text-fill-color:#F4ECDF!important"><b style="color:#F0C870!important;-webkit-text-fill-color:#F0C870!important">'+(n+1)+'.</b> '+esc(q[1])+'</p><div class="gim-opts">'+opts.map(function(o){return '<button type="button" class="gim-opt'+(v===o.v&&S.answerLabels&&S.answerLabels[q[0]]===o.l?' sel':'')+'" data-q="'+q[0]+'" data-v="'+(o.v===null?'null':o.v)+'" data-l="'+esc(o.l)+'">'+esc(o.l)+'</button>'}).join('')+'</div></div>'});
  html+='<p class="gim-small">Можно оставить вопрос без ответа. «Зависит от ситуации» сохраняется отдельно и не превращается в балл.</p><div class="gim-nav"><button id="gim-prev" '+(idx===0?'disabled':'')+'>Назад</button><button id="gim-next" class="primary">'+(idx===9?'К эпизоду и результату':'Следующий блок')+'</button></div>';
  box.innerHTML=html;
  box.querySelectorAll('[data-q]').forEach(function(b){b.onclick=function(){var id=b.getAttribute('data-q'),v=b.getAttribute('data-v'),l=b.getAttribute('data-l');S.answers[id]=v==='null'?null:+v;S.answerLabels=S.answerLabels||{};S.answerLabels[id]=l;S.questionContext=S.questionContext||{};if(l==='Зависит от ситуации')S.questionContext[id]=1;else delete S.questionContext[id];persist();draw()}})
  var prev=box.querySelector('#gim-prev'),next=box.querySelector('#gim-next');if(prev)prev.onclick=function(){idx=Math.max(0,idx-1);persist();draw()};if(next)next.onclick=function(){S.sections[sec.id]={completedAt:Date.now(),answered:sec.items.filter(function(q){return S.answers[q[0]]!==undefined}).length};persist();if(idx<9){idx++;persist();draw()}else{mode='episode';episode()}};
 }
 function episode(){
  var e=S.episodes||{},fields=[['event','Что произошло фактически?'],['meaning','Какой смысл ты сразу этому придал(а)?'],['feeling','Что почувствовал(а), в том числе телом?'],['action','Что захотел(а) сделать и что сделал(а)?'],['result','Как ответили другие и чем все закончилось?'],['conclusion','Какой вывод ты унес(ла) из этой ситуации?']];
  box.innerHTML='<span class="tag">Дополнительный слой</span><h1>Один реальный эпизод</h1>'+triggerPanel()+'<p>Триггеры уже выделены по твоим ответам выше. Здесь можно по желанию восстановить один конкретный эпизод, чтобы проверить, как именно развивалась ситуация. Не нужно раскрывать имена или личные данные других людей.</p>'+fields.map(function(f){return '<label style="display:block;color:#e8c477;font-size:14px;margin-top:10px">'+f[1]+'</label><textarea class="gim-field" rows="2" data-episode="'+f[0]+'" placeholder="Необязательно">'+esc(e[f[0]]||'')+'</textarea>'}).join('')+'<p class="gim-note">Отдельно отметь, если в ситуации были реальные внешние ограничения, давление, небезопасность или несправедливое обращение. Их нельзя объяснять только внутренними настройками.</p><textarea class="gim-field" rows="2" data-episode="external" placeholder="Внешние обстоятельства (необязательно)">'+esc(e.external||'')+'</textarea><div class="gim-nav"><button id="gim-back">Назад</button><button id="gim-finish" class="primary">Собрать предварительную карту</button></div>';
  box.querySelectorAll('[data-episode]').forEach(function(t){t.onchange=function(){S.episodes=S.episodes||{};S.episodes[t.getAttribute('data-episode')]=t.value;persist()}})
  box.querySelector('#gim-back').onclick=function(){mode='sections';idx=9;draw()};
  box.querySelector('#gim-finish').onclick=function(){box.querySelectorAll('[data-episode]').forEach(function(t){S.episodes[t.getAttribute('data-episode')]=t.value});finish()};
 }
 function finish(){
  var res={},prot={},resN={},protN={};
  DATA.sections.forEach(function(sec){sec.items.forEach(function(q){var v=S.answers[q[0]];if(v===undefined||v===null)return;var group=q[3]==='resource'?res:prot,nums=q[3]==='resource'?resN:protN;group[q[2]]=(group[q[2]]||0)+v;nums[q[2]]=(nums[q[2]]||0)+1;})});
  function rowsFor(group,nums,kind){return Object.keys(group).map(function(k){return {id:k,kind:kind,name:DATA.families[k]||k,score:group[k],max:(nums[k]||1)*3,answered:nums[k]}}).sort(function(a,b){return b.score/b.max-a.score/a.max})}
  var resourceRows=rowsFor(res,resN,'resource'),protectiveRows=rowsFor(prot,protN,'protective'),rows=protectiveRows.concat(resourceRows);
  var answered=Object.keys(S.answers).filter(function(k){return S.answers[k]!==undefined}).length;
  var triggers=triggerSignals();
  S.result={at:Date.now(),answered:answered,total:60,families:rows,resourceSignals:resourceRows,protectiveSignals:protectiveRows,triggers:triggers,contextAnswers:Object.keys(S.questionContext||{}),episodes:S.episodes||{},interpretation:'Предварительные частотные сигналы самоотчета. Не диагноз, не причинное доказательство и не нормативная шкала.'};
  S.completedAt=Date.now();P.innerMechanism=S;save(P);
  var top=protectiveRows.slice(0,4),resourceTop=resourceRows.slice(0,4),html='<span class="tag">Карта собрана</span><h1>Что повторяется в твоем опыте</h1><p>Это предварительная карта ответов. Она показывает, какие темы чаще отмечались в разных блоках, но сама по себе не доказывает причинность и не определяет личность.</p><div class="gim-result"><b>Отвечено '+answered+' из 60 утверждений</b><p class="gim-small">Ресурсные и защитные сигналы учитываются раздельно. Высокий ресурс не отменяет трудность, а наличие трудности не отменяет ресурс.</p></div>'+triggerPanel();
  top.forEach(function(r){html+='<div class="gim-result"><b>'+esc(r.name)+'</b><p class="gim-small">'+r.answered+' ответов · частотный сигнал '+Math.round(r.score/r.max*100)+'%</p><div class="gim-meter"><i style="width:'+Math.round(r.score/r.max*100)+'%"></i></div></div>'});
  html+='<h2>Ресурсные сигналы</h2>';if(resourceTop.length){resourceTop.forEach(function(r){html+='<div class="gim-result"><b>'+esc(r.name)+'</b><p class="gim-small">'+r.answered+' ответов · частотный сигнал '+Math.round(r.score/r.max*100)+'%</p><div class="gim-meter"><i style="width:'+Math.round(r.score/r.max*100)+'%"></i></div></div>'})}else{html+='<p>Пока недостаточно ответов, чтобы показать ресурсные сигналы.</p>'}html+='<h2>Что мы пока не утверждаем</h2><p>Мы не считаем, что высокий показатель автоматически объясняет твое поведение. Чтобы понять, что запускает реакцию и как она поддерживается, результаты нужно сопоставить с фоновым состоянием BG16, другими тестами и конкретными эпизодами.</p><p>Проверь, насколько эта предварительная карта совпадает с твоим опытом.</p><div class="gim-nav"><button id="gim-retake">Пересмотреть ответы</button><button id="gim-done" class="primary">Продолжить путь</button></div>';
  box.innerHTML=html;
  box.querySelector('#gim-retake').onclick=function(){idx=0;draw()};
  box.querySelector('#gim-done').onclick=function(){if(window.GRoute){GRoute.complete('slot.html?id=mechanism');var n=GRoute.advance();if(n)location.href=n}else location.href='slot.html?id=km'};
 }
 idx=Math.max(0,Math.min(9,prior));draw();
}
window.GInnerMechanism={mount:mount};
})();