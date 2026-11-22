(function(){
'use strict';
var KEY='alch_v5_hold';
var TITLES=['Неудовлетворенность','Желаемое положение','Фактический выбор','Скрытая функция','Цена привычного выбора','Перенастройка'];
var FIELDS=[
 [['sphere','Сфера жизни','select'],['problem','Что именно сейчас не устраивает?','text'],['when','В каких ситуациях это особенно заметно?','text'],['tried','Что ты уже пробовал(а) изменить?','text']],
 [['desired','Как выглядит положение, которого Вы хотите?','text'],['evidence','По каким наблюдаемым признакам ты поймешь, что стало иначе?','text'],['meaning','Что важного для тебя появится в этом положении?','text']],
 [['actual','Что фактически происходит сейчас?','text'],['pattern','Какой выбор, действие или отказ повторяется?','text'],['constraints','Какие реальные обстоятельства ограничивают выбор?','text']],
 [['functionNote','Возможные функции привычного выбора — это только гипотезы, не готовые ответы. Что из этого может быть близко?','checks'],['benefit','Что привычный выбор дает или сохраняет прямо сейчас?','text'],['avoid','С чем он помогает не сталкиваться?','text'],['functionOther','Если выбрали «Другая функция», опишите ее своими словами','text'],['unknownFunction','Пока не знаю / не вижу скрытой функции','check']],
 [['shortCost','Какова цена этого выбора сегодня или в ближайшее время?','text'],['longCost','Что может измениться, если так будет продолжаться еще полгода?','text'],['lost','Чего ты лишаешься или что постоянно откладываете?','text']],
 [['step','Какой небольшой и безопасный шаг можно проверить?','text'],['conditions','Что должно быть учтено, чтобы этот шаг был реалистичным?','text'],['support','Какая поддержка или ресурс тебе пригодится?','text'],['review','Когда ты вернешься к этому наблюдению?','text'],['safetyConcern','Сейчас есть давление, угроза, принуждение или зависимость, из-за которых изменение может быть небезопасным','check']]
];
var LABELS={sphere:'Сфера',problem:'Неудовлетворенность',when:'Когда проявляется',tried:'Что уже пробовали',desired:'Желаемое положение',evidence:'Признаки изменений',meaning:'Зачем это важно',functionNote:'Возможные функции',functionOther:'Своя формулировка функции',benefit:'Что сохраняет',avoid:'Чего помогает избежать',unknownFunction:'Не знаю',actual:'Фактическая ситуация',pattern:'Повторяющийся выбор',constraints:'Реальные ограничения',shortCost:'Ближайшая цена',longCost:'Цена в перспективе',lost:'Что откладывается',step:'Небольшой шаг',conditions:'Условия безопасности и реалистичности',support:'Поддержка',review:'Вернуться к наблюдению',safetyConcern:'Сначала безопасность'};
var FUNCTIONS=['Сохраняет ощущение безопасности','Помогает избежать конфликта или отказа','Сохраняет отношения или одобрение','Защищает от риска и неопределенности','Экономит силы или другие ресурсы','Позволяет не сталкиваться с возможной ошибкой','Сохраняет привычный порядок','Другая функция — опишу своими словами'];
var app=document.getElementById('app');
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function load(){try{var x=JSON.parse(localStorage.getItem(KEY)||'{}');if(!x||!Array.isArray(x.sessions))return {sessions:[],currentId:null};return x}catch(e){return {sessions:[],currentId:null}}}
var db=load();
function id(){return 'h'+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function current(){return db.sessions.find(function(x){return x.id===db.currentId})||null}
function fresh(){var s={id:id(),createdAt:Date.now(),updatedAt:Date.now(),step:0,answers:{},completedAt:null};db.sessions.unshift(s);db.currentId=s.id;save();render()}
function save(){var s=current();if(s)s.updatedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}}
function field(key,label,type){
 var s=current(),a=s.answers||{},v=a[key];
 if(type==='select'){
  var opts=['Деньги и работа','Здоровье и энергия','Отношения','Семья','Друзья и окружение','Личное развитие','Отдых и качество жизни','Другое'];
  return '<div class="question"><label class="field" for="f-'+key+'">'+esc(label)+'</label><select id="f-'+key+'" data-field="'+key+'"><option value="">Выбери, если это помогает</option>'+opts.map(function(x){return '<option '+(v===x?'selected':'')+'>'+esc(x)+'</option>'}).join('')+'</select></div>';
 }
 if(type==='checks'){
  var selected=Array.isArray(v)?v:[];
  return '<div class="question"><label class="field">'+esc(label)+'</label><div class="choices">'+FUNCTIONS.map(function(x){return '<label class="choice"><input type="checkbox" data-field="functionNote" value="'+esc(x)+'" '+(selected.indexOf(x)>=0?'checked':'')+'><span>'+esc(x)+'</span></label>'}).join('')+'</div></div>';
 }
 if(type==='check')return '<div class="question"><label class="choice"><input type="checkbox" data-field="'+key+'" '+(v?'checked':'')+'><span>'+esc(label)+'</span></label></div>';
 return '<div class="question"><label class="field" for="f-'+key+'">'+esc(label)+'</label><textarea id="f-'+key+'" data-field="'+key+'" rows="3" placeholder="Можно ответить коротко. Можно оставить поле пустым.">'+esc(v||'')+'</textarea></div>';
}
function renderSummary(s){
 var h='<div class="summary"><h3>Карта исследования</h3><p class="muted">Это рабочая запись твоих наблюдений, а не диагноз и не окончательное объяснение.</p>';
 FIELDS.forEach(function(group,i){h+='<h3>'+(i+1)+'. '+TITLES[i]+'</h3>';group.forEach(function(f){var v=s.answers[f[0]];if(Array.isArray(v))v=v.join('; ');if(typeof v==='boolean')v=v?'Да':'Нет';if(v)h+='<p><b>'+esc(LABELS[f[0]]||f[1])+':</b><br>'+esc(v)+'</p>'})});
 return h+'</div>';
}
function render(){
 var s=current();if(!s){fresh();return}
 var step=Math.max(0,Math.min(5,+s.step||0));
 var h='<p class="eyebrow">Лаборатория · исследование без самодиагностики</p><h1>Что удерживает меня на месте?</h1><p class="lead">Не ищем виноватого и не придумываем скрытые мотивы. Разделяем желаемое, фактический выбор, реальные ограничения и возможную пользу привычного сценария.</p>';
 h+='<div class="progress"><i style="width:'+((step+1)/6*100)+'%"></i></div><div class="steps">'+TITLES.map(function(t,i){return '<button type="button" data-nav="'+i+'" class="'+(i===step?'active':(s.answers&&FIELDS[i].some(function(f){return s.answers[f[0]]})?'done':''))+'">'+(i+1)+'</button>'}).join('')+'</div>';
 h+='<section class="panel"><p class="eyebrow">Уровень '+(step+1)+' из 6</p><h2>'+TITLES[step]+'</h2>';
 var intros=[
 'Сначала зафиксируйте конкретное место неудовлетворенности. Не нужно обобщать всю жизнь — выберите один повторяющийся сюжет.',
 'Опишите не идеальную картинку, а положение, которое можно узнать по реальным признакам.',
 'Посмотри на фактические действия и обстоятельства. Важно различать то, что ты выбираешь, и то, что сейчас объективно ограничено.',
 'Привычный выбор может выполнять защитную или практическую функцию. Может и не выполнять — здесь нет обязательного правильного ответа.',
 'Оцените цену сценария без обвинения себя. Привычный выбор мог помогать справляться раньше, даже если сейчас его цена стала высокой.',
 'Не требуется перевернуть жизнь одним решением. Выбери небольшой шаг, который безопасно проверить в реальных условиях.'
 ];
 h+='<p class="lead">'+intros[step]+'</p>';
 if(step>=2)h+='<div class="hint">Если на ситуацию влияют насилие, принуждение, угрозы, финансовая зависимость или риск потерять безопасность, не нужно заставлять себя действовать иначе. Сначала учитывайте безопасность, доступные ресурсы и поддержку.</div>';
 FIELDS[step].forEach(function(f){if(step===5&&f[0]==='step'&&s.answers.safetyConcern)return;h+=field(f[0],f[1],f[2])});
 if(step===5&&s.answers.safetyConcern)h+='<div class="hint">Ты отметил(а) риск для безопасности. Не планируйте проверочный шаг, который может усилить давление или угрозу. Сначала определите безопасные условия и доступную поддержку.</div>';
 h+='<p class="muted">Ответы сохраняются автоматически в этом браузере.</p><div class="actions"><button class="secondary" data-action="back" '+(step===0?'disabled':'')+'>Назад</button><button class="primary" data-action="'+(step===5?'finish':'next')+'">'+(step===5?(s.completedAt?'Обновить итог':'Сохранить итог'):'Сохранить и продолжить')+'</button></div>';
 if(s.completedAt)h+=renderSummary(s);
 h+='</section>';
 var history=db.sessions.filter(function(x){return x.id!==s.id});
 if(history.length){h+='<section class="history"><h3>Предыдущие исследования</h3>'+history.map(function(x){return '<div class="history-item"><span>'+new Date(x.createdAt).toLocaleDateString('ru-RU')+(x.completedAt?' · завершено':' · не завершено')+'</span><button class="secondary" data-open="'+esc(x.id)+'">Открыть</button></div>'}).join('')+'</section>'}
 h+='<div class="actions"><button class="secondary" data-action="new">Начать новое исследование</button><button class="secondary" data-action="clear">Удалить историю</button></div>';
 app.innerHTML=h;
}
function updateField(el){
 var s=current();if(!s)return;
 var key=el.getAttribute('data-field');if(!key)return;
 s.answers=s.answers||{};
 if(el.type==='checkbox'&&key==='unknownFunction'){s.answers.unknownFunction=!!el.checked;if(el.checked){s.answers.functionNote=[];app.querySelectorAll('[data-field="functionNote"]').forEach(function(x){x.checked=false})}save();render();return}
 if(el.type==='checkbox'&&key==='functionNote'){
  var a=Array.isArray(s.answers[key])?s.answers[key].slice():[];
  if(el.checked&&a.indexOf(el.value)<0)a.push(el.value);
  if(!el.checked)a=a.filter(function(x){return x!==el.value});
  if(a.length)s.answers.unknownFunction=false;
  s.answers[key]=a;
 }else if(el.type==='checkbox')s.answers[key]=!!el.checked;
 else s.answers[key]=el.value;
 save();if(key==='safetyConcern'){render();return}if(key==='functionNote'&&s.answers.unknownFunction){var u=app.querySelector('[data-field="unknownFunction"]');if(u)u.checked=false;s.answers.unknownFunction=false;save()}
}
app.addEventListener('input',function(e){if(e.target.hasAttribute('data-field'))updateField(e.target)});
app.addEventListener('change',function(e){if(e.target.hasAttribute('data-field'))updateField(e.target)});
app.addEventListener('click',function(e){
 var nav=e.target.closest('[data-nav]');if(nav){var s=current();s.step=+nav.getAttribute('data-nav');save();render();return}
 var open=e.target.closest('[data-open]');if(open){db.currentId=open.getAttribute('data-open');render();return}
 var b=e.target.closest('[data-action]');if(!b)return;
 var s=current(),a=b.getAttribute('data-action');
 if(a==='back'){s.step=Math.max(0,(+s.step||0)-1);save();render()}
 if(a==='next'){s.step=Math.min(5,(+s.step||0)+1);save();render()}
 if(a==='finish'){s.completedAt=Date.now();save();render()}
 if(a==='new'){if(confirm('Начать новое исследование? Текущая запись останется в истории.'))fresh()}
 if(a==='clear'){if(confirm('Удалить все исследования этой лаборатории из этого браузера? Это действие нельзя отменить.')){try{localStorage.removeItem(KEY)}catch(e){}db={sessions:[],currentId:null};fresh()}}
});
if(!current())fresh();else render();
})();