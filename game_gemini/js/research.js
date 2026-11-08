(function(){
'use strict';
const API=window.AlchemistProfile,profile=API.load();
const passportPanel=document.getElementById('passport-panel'),wheelPanel=document.getElementById('wheel-panel'),status=document.getElementById('save-status');
const gender=profile.meta.gender==='female'?'f':'m';
const fmtBirth=(v)=>String(v||'').split('-').reverse().join('.');
function savePassportAnswer(key,choice,note){
 API.update(p=>{const pass=p.symbolic.matrix.passport;if(!pass)return;
 pass.answers=pass.answers||{};const record={choice,note:String(note||''),at:new Date().toISOString(),question:key};pass.answers[key]=record;
 if(key.startsWith('theme:')){const h=(pass.hypotheses||[]).find(x=>x.id===key.slice(6));if(h)h.status={yes:'confirmed',partly:'checking',no:'revised',unknown:'ambiguous'}[choice];}
 p.diary.insights=p.diary.insights||[];const id='passport:'+key;const entry={id,at:'Паспорт героя',source:{type:'passport',key,choice},text:choice+(note?' · '+note:'')};const i=p.diary.insights.findIndex(x=>x.id===id);if(i<0)p.diary.insights.push(entry);else p.diary.insights[i]=entry;
 p.history.push({type:'passport_answer_saved',key,at:new Date().toISOString()});
 });status.textContent='Ответ паспорта сохранен.';
}
function renderPassport(){
 const birth=fmtBirth(profile.meta.birthdate),layers=window.GPassport.calculate(birth);
 if(!layers){passportPanel.innerHTML='<p>Сначала заполните дату рождения в паспорте героя.</p>';return;}
 const hypotheses=window.GPassport.hypotheses(layers);
 API.update(p=>{const old=p.symbolic.matrix.passport||{};p.symbolic.matrix.passport={...old,version:layers.version,birth,layers,answers:old.answers||{},hypotheses:old.hypotheses||hypotheses,calculatedAt:old.calculatedAt||new Date().toISOString()};p.symbolic.methodVersion=layers.version;p.symbolic.status='calculated';});
 const current=API.load().symbolic.matrix.passport;
 const names=window.GPassportData.arcana;
 const femaleNames=['Создательница','Хранительница','Садовница','Архитектор','Наставница','Дипломат','Путница','Укротительница','Искательница','Навигатор','Судья','Меняющая перспективу','Алхимик','Целительница','Испытательница','Разрушительница','Провидица','Сновидица','Светоносица','Пробужденная','Завершительница','Странница'];
 let out='<h2>Паспорт героя</h2><p class="muted">Расчет выполнен по действующему алгоритму game_v4. Ответы и уточнения сохраняются отдельно от расчетных значений.</p><h3>Девять позиций</h3>';
 window.GPassportData.positions.forEach(pos=>{const n=layers.positions[pos.id],a=names[n-1],key='position:'+pos.id,r=current.answers[key]||{};out+='<details class="position"><summary>'+pos.id+' · '+pos.name+' — '+n+' · '+(a?(gender==='f'?femaleNames[n-1]:a.name):'')+'</summary><p>'+pos.context+'</p><p><b>Ресурс:</b> '+(a?window.GPassport.say(a.resource,gender):'')+'</p><p><b>Возможная тень:</b> '+(a?window.GPassport.say(a.shadow,gender):'')+'</p><p><b>Внутреннее противоречие:</b> '+(a?window.GPassport.say(a.inner_conflict,gender):'')+'</p>'+answerMarkup(key,r)+'</details>';});
 out+='<h3>Матрица Пифагора</h3><div class="wheel-grid">'+[1,4,7,2,5,8,3,6,9].map(n=>'<div class="position"><b>'+n+'</b><div>'+String(n).repeat(layers.pythagoras[n]||0||0)+'</div></div>').join('')+'</div>';
 out+='<h3>13 направлений</h3>'+window.GPassportData.directions.map(d=>{const r=layers.directions.find(x=>x.id===d.id);return '<details class="position"><summary>'+d.id+' · '+d.name+' — '+r.count+'</summary><p>'+d.description+'</p><p>Уровень: '+r.level+'</p>'+answerMarkup('direction:'+d.id,current.answers['direction:'+d.id]||{})+'</details>'}).join('');
 out+='<h3>Гипотезы для наблюдения</h3>'+window.GPassportData.themes.map(t=>{const h=current.hypotheses.find(x=>x.id===t.id)||{},r=current.answers['theme:'+t.id]||{};return '<details class="position"><summary>'+t.name+'</summary><p>'+t.description+'</p>'+answerMarkup('theme:'+t.id,r)+'</details>'}).join('');
 passportPanel.innerHTML=out;
 passportPanel.querySelectorAll('[data-save-answer]').forEach(btn=>btn.addEventListener('click',()=>{const box=btn.closest('[data-answer-box]'),key=box.dataset.answerBox,choice=box.querySelector('select').value,note=box.querySelector('textarea').value;if(!choice){status.textContent='Выберите ответ.';return;}savePassportAnswer(key,choice,note);}));
}
function answerMarkup(key,r){return '<div class="answers" data-answer-box="'+key+'"><select aria-label="Ответ"><option value="">Отметить отклик</option>'+[['yes','Да'],['partly','Частично'],['no','Нет'],['unknown','Не знаю']].map(([v,t])=>'<option value="'+v+'" '+(r.choice===v?'selected':'')+'>'+t+'</option>').join('')+'</select><textarea rows="2" placeholder="Ваш пример или уточнение">'+(r.note||'')+'</textarea><button class="action" type="button" data-save-answer>Сохранить</button></div>'}
const urgency=['В течение месяца','В течение года','В течение трех лет'];
const names=['Здоровье','Финансы','Карьера','Отношения','Семья','Друзья','Рост','Отдых'];
const colors=['#78b995','#d8b657','#77a9d3','#d48eaa','#b69bd6','#dfab77','#79c1bf','#a8bb75'];
function blankWheel(){return {version:3,spheres:WHEEL_QUESTIONS.map(s=>({name:s.name,ratings:[null,null,null],answers:[null,null,null],improvements:[0,1,2].map(()=>({change:null,strength:null,urgency:null})),average:null})),cursor:{sphere:0,question:0},history:[],priorities:[],completed:false};}
function mean(a){const v=a.filter(x=>typeof x==='number'&&x>=1&&x<=10);return v.length?v.reduce((x,y)=>x+y,0)/v.length:null}
let wheel=API.load().lifeAreas.wheelTest;
if(!wheel||wheel.version!==3||!Array.isArray(wheel.spheres)||wheel.spheres.length!==8)wheel=blankWheel();
function persistWheel(){wheel.spheres.forEach(s=>s.average=mean(s.ratings));wheel.averages=wheel.spheres.map(s=>s.average);wheel.updatedAt=new Date().toISOString();API.update(p=>{p.lifeAreas.wheelTest=JSON.parse(JSON.stringify(wheel));p.lifeAreas.areas={};wheel.spheres.forEach(s=>p.lifeAreas.areas[s.name]={name:s.name,ratings:s.ratings,answers:s.answers,improvements:s.improvements,average:s.average});p.lifeAreas.priorities=wheel.priorities||[];p.lifeAreas.status=wheel.completed?'completed':'in_progress';p.history.push({type:'wheel_test_saved',at:new Date().toISOString()});});status.textContent='Ответы колеса сохранены в едином профиле.';}
function ready(s,q){const im=s.improvements[q],answered=s.ratings[q]==='na'||[1,3,5,7,10].includes(s.ratings[q]);return answered&&['yes','no'].includes(im.change)&&(im.change==='no'||(Number.isInteger(im.strength)&&im.strength>=1&&im.strength<=10&&urgency.includes(im.urgency)));}
function advance(){const c=wheel.cursor,s=wheel.spheres[c.sphere];if(!ready(s,c.question))return;wheel.history.push({...c});if(c.sphere===7&&c.question===2)wheel.completed=true;else wheel.cursor=c.question<2?{sphere:c.sphere,question:c.question+1}:{sphere:c.sphere+1,question:0};persistWheel();renderWheel();}
function renderWheel(){
 if(wheel.completed||wheel.cursor.sphere>=8){renderWheelSummary();return;}
 const c=wheel.cursor,s=wheel.spheres[c.sphere],q=WHEEL_QUESTIONS[c.sphere].questions[c.question],selected=s.ratings[c.question],im=s.improvements[c.question];
 let html='<h2>Колесо жизненных сфер</h2><p class="muted">Вопрос '+(c.sphere*3+c.question+1)+' из 24 · '+s.name+'</p><div class="progress"><span style="width:'+((c.sphere*3+c.question)/24*100)+'%"></span></div><h3>'+q.text+'</h3><div class="options">';
 q.options.forEach(o=>{const label=typeof o.text==='object'?(gender==='f'?o.text.f:o.text.m):o.text;html+='<button type="button" class="choice '+(selected===o.score?'on':'')+'" data-rating="'+o.score+'">'+label+'</button>';});
 html+='</div><button type="button" class="choice '+(selected==='na'?'on':'')+'" data-rating="na">Не относится ко мне</button>';
 if(selected!==null){html+='<div class="position"><h3>Хотели бы улучшить?</h3><div class="options"><button class="choice '+(im.change==='yes'?'on':'')+'" data-change="yes">Да</button><button class="choice '+(im.change==='no'?'on':'')+'" data-change="no">Нет</button></div>';
 if(im.change==='yes'){html+='<h3>Насколько сильно?</h3><p>1 — немного, 10 — очень сильно.</p><input id="strength" type="range" min="1" max="10" step="1" value="'+(im.strength||5)+'"><b id="strength-value">'+(im.strength||5)+'</b><h3>Как быстро?</h3><div class="options">'+urgency.map(x=>'<button class="choice '+(im.urgency===x?'on':'')+'" data-urgency="'+x+'">'+x+'</button>').join('')+'</div>';}
 html+='</div>';}
 html+='<div class="actions"><button class="action" id="wheel-back" '+(!wheel.history.length?'disabled':'')+'>Назад</button><button class="action primary" id="wheel-next" '+(!ready(s,c.question)?'disabled':'')+'>Дальше</button></div>';
 wheelPanel.innerHTML=html;
 wheelPanel.querySelectorAll('[data-rating]').forEach(b=>b.onclick=()=>{const v=b.dataset.rating;s.ratings[c.question]=v==='na'?'na':Number(v);const opt=q.options.find(x=>x.score===Number(v));s.answers[c.question]=v==='na'?'Не относится ко мне':(opt?(typeof opt.text==='object'?(gender==='f'?opt.text.f:opt.text.m):opt.text):'');wheel.completed=false;persistWheel();renderWheel();});
 wheelPanel.querySelectorAll('[data-change]').forEach(b=>b.onclick=()=>{im.change=b.dataset.change;if(im.change==='no'){im.strength=null;im.urgency=null;}persistWheel();renderWheel();});
 const range=wheelPanel.querySelector('#strength');if(range){range.oninput=()=>wheelPanel.querySelector('#strength-value').textContent=range.value;range.onchange=()=>{im.strength=Number(range.value);persistWheel();renderWheel();};}
 wheelPanel.querySelectorAll('[data-urgency]').forEach(b=>b.onclick=()=>{im.urgency=b.dataset.urgency;persistWheel();renderWheel();});
 const back=wheelPanel.querySelector('#wheel-back');back.onclick=()=>{if(!wheel.history.length)return;wheel.cursor=wheel.history.pop();wheel.completed=false;persistWheel();renderWheel();};
 wheelPanel.querySelector('#wheel-next').onclick=advance;
}
function wheelSVG(values,title){const size=212,cx=106,cy=106;let out='<svg viewBox="0 0 212 212" role="img" aria-label="'+title+'">';values.forEach((v,i)=>{if(typeof v!=='number')return;const r=Math.max(0,Math.min(10,v))*10,a=i*Math.PI/4-Math.PI/2,b=a+Math.PI/4;out+='<path d="M 106 106 L '+(cx+r*Math.cos(a))+' '+(cy+r*Math.sin(a))+' A '+r+' '+r+' 0 0 1 '+(cx+r*Math.cos(b))+' '+(cy+r*Math.sin(b))+' Z" fill="'+colors[i]+'"/>';});for(let r=10;r<=100;r+=10)out+='<circle cx="106" cy="106" r="'+r+'" fill="none" stroke="#a08045" stroke-width=".7"/>';out+='</svg>';return out;}
function renderWheelSummary(){
 const first=API.load().lifeAreas.firstLook||[],detailed=wheel.spheres.map(s=>mean(s.ratings));
 let html='<h2>Колесо запомнило Ваш путь</h2><p class="muted">Первый взгляд и подробные ответы по восьми сферам.</p><div class="wheel-grid"><div><h3>Первый взгляд</h3>'+wheelSVG(first,'Первый взгляд')+'</div><div><h3>По ответам</h3>'+wheelSVG(detailed,'По ответам')+'</div></div><h3>Сферы</h3>';
 wheel.spheres.forEach((s,i)=>{html+='<div class="sphere"><b>'+s.name+'</b><p>Подробная оценка: '+(detailed[i]===null?'нет применимых ответов':detailed[i].toFixed(2)+' / 10')+'</p></div>';});
 const eligible=[];wheel.spheres.forEach((s,i)=>s.improvements.forEach((im,j)=>{if(im.change==='yes')eligible.push({id:i*3+j,name:s.name,question:WHEEL_QUESTIONS[i].questions[j].text,strength:im.strength,urgency:im.urgency});}));
 if(!wheel.priorities.length)wheel.priorities=eligible.sort((a,b)=>(b.strength||0)-(a.strength||0)||urgency.indexOf(a.urgency)-urgency.indexOf(b.urgency)).map(x=>x.id);
 html+='<h3>Что хочется изменить</h3><ol>'+wheel.priorities.map(id=>{const i=Math.floor(id/3),j=id%3,im=wheel.spheres[i].improvements[j];return '<li>'+wheel.spheres[i].name+': '+WHEEL_QUESTIONS[i].questions[j].text+' · '+im.strength+'/10 · '+im.urgency+'</li>';}).join('')+'</ol><button class="action" id="wheel-revise">Вернуться к ответам</button>';
 wheelPanel.innerHTML=html;wheelPanel.querySelector('#wheel-revise').onclick=()=>{wheel.completed=false;wheel.cursor={sphere:7,question:2};persistWheel();renderWheel();};
 persistWheel();
}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{const key=b.dataset.tab;document.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));passportPanel.hidden=key!=='passport';wheelPanel.hidden=key!=='wheel';});
document.getElementById('back-birth').onclick=()=>location.href='index.html';
renderPassport();renderWheel();
if(!API.hasBirth(profile))status.textContent='Сначала заполните паспорт героя.';
})();