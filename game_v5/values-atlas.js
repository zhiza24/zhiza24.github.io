(function(){
'use strict';
var KEY='alch_v5_profile', P={};try{P=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
var A=P.valuesAtlasV1||{version:1,layer:1,declared:[],ownLabel:'',privateChoice:[],dilemmas:{},episodes:[{text:'',tags:[],voluntary:'',repeat:'',resource:''},{text:'',tags:[],voluntary:'',repeat:'',resource:''}],desire:{want:'',envy:'',regret:'',attempt:'',tags:[],barriers:[]},threat:{loss:'',consequence:'',prevention:'',cost:'',tags:[]},protection:{response:'',context:'',protected:'',outcome:'',repair:'',tags:[]},updatedAt:null};
var VALUES=[
{id:'freedom',name:'Свобода',desc:'Самостоятельность, право выбирать направление и распоряжаться своей жизнью.'},
{id:'closeness',name:'Близость',desc:'Доверие, взаимность, связь и возможность быть собой рядом с другими.'},
{id:'security',name:'Безопасность',desc:'Защищенность, надежная опора, предсказуемость и сохранность важного.'},
{id:'recognition',name:'Признание',desc:'Уважение, видимость, значимость собственного голоса и вклада.'},
{id:'growth',name:'Развитие',desc:'Обучение, мастерство, расширение возможностей и компетентности.'},
{id:'fairness',name:'Справедливость',desc:'Честные правила, равное достоинство, взаимность и соразмерность.'},
{id:'care',name:'Забота',desc:'Поддержка благополучия других и бережный вклад без вынужденного спасательства.'},
{id:'aliveness',name:'Живость',desc:'Интерес, удовольствие, новизна, включенность и ощущение жизни.'},
{id:'meaning',name:'Смысл',desc:'Внутреннее «ради чего», творчество, призвание и значимый вклад.'}
];
var BARRIERS=[{id:'judgment',name:'Страх чужой оценки'},{id:'guilt',name:'Чувство вины или запрет'},{id:'time',name:'Не хватает времени'},{id:'resources',name:'Не хватает денег или других ресурсов'},{id:'obligations',name:'Обязательства перед другими'},{id:'uncertainty',name:'Страх неопределенности или ошибки'},{id:'skills',name:'Не хватает знаний или навыков'},{id:'permission',name:'Не разрешаю себе'},{id:'energy',name:'Не хватает сил или энергии'},{id:'access',name:'Нет подходящей возможности'},{id:'relationship',name:'Опасаюсь последствий для отношений'},{id:'other',name:'Другое / пока не понимаю'}];
var D=[
{id:'D01',title:'Свое решение или надежная опора',text:'Представьте, что у Вас есть два реальных предложения. Первое дает больше самостоятельности и свободы решений, но доход и условия менее предсказуемы. Второе дает надежную опору и понятные условия, но часть решений придется согласовывать. Какой вариант Вы скорее выберете сейчас?',a:'Больше самостоятельности',av:'freedom',b:'Более предсказуемая опора',bv:'security',ask:'Что в другом варианте Вам было бы труднее всего отпустить?'},
{id:'D02',title:'Близость или личное пространство',text:'Важный для Вас человек хочет проводить вместе заметно больше времени. Вам тоже дорога эта связь, но сейчас особенно нужно личное пространство для собственных дел и восстановления. Что Вы скорее выберете на ближайший месяц?',a:'Договориться о большем совместном времени',av:'closeness',b:'Сохранить личное пространство',bv:'freedom',ask:'Какой формат помог бы не потерять ни связь, ни себя?'},
{id:'D03',title:'Видимый результат или дело со смыслом',text:'Есть возможность выбрать один из двух проектов на ближайшие полгода. Один заметен, дает публичное признание и расширяет круг влияния. Другой почти не виден окружающим, но глубоко соответствует тому, что Вы считаете важным. Что выберете?',a:'Видимый проект и признание',av:'recognition',b:'Проект, соответствующий внутреннему смыслу',bv:'meaning',ask:'Что именно дает признание: уважение, влияние, чувство состоятельности или что-то еще?'},
{id:'D04',title:'Общее правило или исключение для близкого',text:'В общей договоренности есть правило, которое одинаково действует для всех. Близкий человек просит Вас сделать для него исключение, хотя это создаст дополнительную нагрузку для остальных. Как поступите?',a:'Сохранить единое правило и равные условия',av:'fairness',b:'Учесть обстоятельства близкого и помочь',bv:'care',ask:'Что здесь было бы несправедливым: нарушить общее правило или не учесть человеческую ситуацию?'},
{id:'D05',title:'Сложная задача или больше живого времени',text:'На ближайшие месяцы есть два пути. Один требует усилий и обучения, но заметно расширит Ваши навыки. Другой оставляет больше времени на удовольствие, интерес, отдых и спонтанность. Что Вы скорее выберете сейчас?',a:'Обучение и мастерство',av:'growth',b:'Больше живого времени и интереса',bv:'aliveness',ask:'Чего Вам сейчас не хватает сильнее — ощущения роста или ощущения, что Вы живете?'},
{id:'D06',title:'Открытость или защищенность',text:'Чтобы отношения стали ближе, можно честно рассказать о том, что для Вас уязвимо. Это может укрепить доверие, но Вы не можете заранее знать реакцию другого человека. Можно оставить эту часть личной и сохранить привычную защищенность. Что выберете сейчас?',a:'Открыться и дать место близости',av:'closeness',b:'Сохранить личную границу и безопасность',bv:'security',ask:'Что именно делает открытость рискованной в этой ситуации?'},
{id:'D07',title:'Помочь или сохранить собственный план',text:'Человек, который Вам дорог, просит о помощи в момент, когда у Вас уже есть важный собственный план. Если Вы согласитесь, придется перенести или сократить свое дело. Если откажете, человек может расстроиться. Что Вы скорее сделаете?',a:'Выделить время и помочь',av:'care',b:'Сохранить свой план и предложить другой формат помощи',bv:'freedom',ask:'Вы выбираете помощь потому, что хотите, или потому, что трудно выдержать чужое разочарование?'},
{id:'D08',title:'Уважение аудитории или внутреннее соответствие',text:'Вы можете сделать работу, которая принесет уважение и высокую оценку профессионального круга, но не вполне соответствует тому, что лично считаете важным. Или выбрать менее заметную работу, которая ближе Вашему внутреннему ориентиру. Что выберете?',a:'Общественное уважение',av:'recognition',b:'Внутреннее соответствие',bv:'meaning',ask:'Если убрать реакцию окружающих, изменится ли Ваш выбор?'},
{id:'D09',title:'Надежный путь или развитие через неопределенность',text:'Есть возможность остаться в знакомой роли, где все понятно, или перейти в новую область, где придется учиться и какое-то время чувствовать себя новичком. Условия нового пути менее предсказуемы. Что Вы скорее выберете?',a:'Сохранить понятные условия',av:'security',b:'Перейти к обучению и расширению возможностей',bv:'growth',ask:'Какая неопределенность для Вас здесь самая существенная?'},
{id:'D10',title:'Справедливое распределение или личное признание',text:'Вы вместе с другими людьми завершили важное дело. Можно настоять, чтобы вклад каждого был назван и оценен соразмерно реальной работе, даже если это не даст Вам особой публичной роли. Или согласиться стать публичным лицом проекта: это даст Вам заметность и профессиональное признание, хотя вклад остальных окажется менее видимым. Что Вы скорее выберете?',a:'Соразмерное признание вклада каждого',av:'fairness',b:'Собственная публичная роль и видимость',bv:'recognition',ask:'Что здесь важнее: честная оценка вклада или видимость Вашего собственного вклада?'},
{id:'D11',title:'Новизна или предсказуемый ритм',text:'В ближайший месяц можно выбрать более насыщенный и новый опыт, который добавит впечатлений, но нарушит привычный ритм. Или сохранить спокойный, предсказуемый распорядок. Что Вам сейчас ближе?',a:'Новый опыт и впечатления',av:'aliveness',b:'Предсказуемый ритм',bv:'security',ask:'Вы выбираете ритм потому, что он Вас поддерживает, или потому, что сейчас нет сил на перемены?'},
{id:'D12',title:'Связь или дело, которое зовет',text:'У Вас появляется возможность посвятить значительную часть свободного времени делу, которое ощущается важным и осмысленным. Но это сократит время на отношения с людьми, которых Вы любите. Какой шаг Вы скорее сделаете?',a:'Сохранить время для близких',av:'closeness',b:'Выделить время делу, которое дает ощущение смысла',bv:'meaning',ask:'Какой способ позволил бы не превращать эти две важные части жизни во врагов?'}
];
var card=document.getElementById('card'),ph=document.getElementById('ph'),title=document.getElementById('t'),desc=document.getElementById('d');
if(!card||!ph||!title||!desc)return;
function save(){A.updatedAt=Date.now();P.valuesAtlasV1=A;try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
function node(tag,txt,cls){var n=document.createElement(tag);if(txt!==undefined)n.textContent=txt;if(cls)n.className=cls;return n}
function button(txt,fn,cls){var b=node('button',txt,cls||'');b.type='button';b.onclick=fn;return b}
function setHead(step,t,d){ph.textContent=step;title.textContent=t;desc.textContent=d}
function field(label,key,obj,placeholder){var wrap=node('div');wrap.style.margin='14px 0';wrap.append(node('label',label));var ta=node('textarea');ta.rows=3;ta.style.cssText='width:100%;margin-top:7px;padding:12px;border-radius:10px;background:#17110b;color:#fff3da;border:1px solid #80633c;font:inherit;';ta.placeholder=placeholder||'Можно ответить своими словами…';ta.value=obj[key]||'';ta.oninput=function(){obj[key]=ta.value;save()};wrap.append(ta);return wrap}
function choices(label,items,current,onChange,multi){var w=node('div');w.style.margin='12px 0';w.append(node('p',label,'hint'));var g=node('div');g.className='grid';items.forEach(function(it){var active=multi?current.indexOf(it.id)>=0:current===it.id;g.append(button(it.name||it.label, function(){if(multi){var i=current.indexOf(it.id);if(i>=0)current.splice(i,1);else current.push(it.id);onChange(current.slice());render()}else{onChange(it.id);render()}},active?'on':''))});w.append(g);return w}
function valueChips(label,current,max){return choices(label,VALUES,current,function(v){if(max&&v.length>max)v=v.slice(0,max);current.splice(0,current.length);v.forEach(function(x){current.push(x)});save()},true)}
function barrierChips(label,current){return choices(label,BARRIERS,current,function(v){current.splice(0,current.length);v.forEach(function(x){current.push(x)});save()},true)}
function nav(next,back){var w=node('div');w.className='two';w.style.marginTop='20px';if(back)w.append(button('Назад',function(){A.layer=back;save();render();scrollTo(0,0)}));w.append(button(next?'Сохранить и продолжить':'Сохранить',function(){if(next){A.layer=next;save();render();scrollTo(0,0)}else{save();render()}},'next'));card.append(w)}
function render(){
card.replaceChildren();
var l=A.layer||1;
if(l===7){renderResult(A.result&&A.result.dilemmas?A.result:calculate());return;}
if(l===1){
setHead('Исследование ценностей · 1 из 6','Что Вы называете важным?','Выберите от пяти до восьми ориентиров, которые действительно хотите видеть в своей жизни. Можно добавить собственную формулировку. Это Ваше самоописание — не обещание всегда поступать именно так.');
card.append(valueChips('Выберите 5–8 ориентиров',A.declared));
if(A.legacySource&&A.legacySource.length)card.append(node('p','Ваши формулировки из прежней версии сохранены: '+A.legacySource.join(' · ')+'. Если среди них есть важное различие, запишите его ниже.','muted'));
card.append(field('Свои формулировки и различия, если их нет в списке','ownLabel',A,'Можно перечислить несколько ориентиров через запятую…'));
card.append(valueChips('Какие два из выбранных Вы особенно не хотели бы потерять?',A.privateChoice,2));
card.append(field('Какой из этих ориентиров Вы выбрали бы, даже если бы никто не узнал о Вашем выборе?','privateNote',A));
var n=button('Перейти к ситуациям',function(){if(A.declared.length<5||A.declared.length>8){alert('Выберите от 5 до 8 ориентиров.');return}if(A.privateChoice.length>2)A.privateChoice=A.privateChoice.slice(0,2);A.layer=2;save();render()},'next');card.append(n);return;
}
if(l===2){
var idx=A.dilemmaIndex||0;
if(idx>=D.length){A.layer=3;save();render();return}
var d=D[idx],ans=A.dilemmas[d.id]||{choice:'',note:'',condition:''};A.dilemmas[d.id]=ans;
setHead('Исследование ценностей · 2 из 6','Выбор в конкретной ситуации','Ситуация '+(idx+1)+' из '+D.length+'. Здесь нет правильного ответа. Выбирайте то, что ближе именно сейчас, а не то, как следовало бы поступить.');
card.append(node('h2',d.title),node('p',d.text,'muted'));
var opts=[{id:'a',name:d.a},{id:'b',name:d.b},{id:'tie',name:'Оба одинаково важны — не хочу выбирать'},{id:'depends',name:'Зависит от обстоятельств'},{id:'neither',name:'Ни один вариант не подходит'},{id:'skip',name:'Не могу ответить / не было такого опыта'}];
var g=node('div');g.className='pair';opts.forEach(function(o){g.append(button(o.name,function(){ans.choice=o.id;A.dilemmaIndex=idx+1;save();render();scrollTo(0,0)},ans.choice===o.id?'on':''))});card.append(g);
card.append(field(d.ask,'note',ans),field('При каких обстоятельствах Вы выбрали бы иначе?','condition',ans));
card.append(button('Сохранить уточнения',function(){save();A.dilemmaIndex=idx+1;render()},'next'));
card.append(button(idx===0?'Вернуться к ориентирам':'Вернуться к предыдущей ситуации',function(){if(idx===0){A.layer=1;save();render()}else{A.dilemmaIndex=idx-1;save();render()}scrollTo(0,0)},'quiet-link'));return;
}
if(l===3){
setHead('Исследование ценностей · 3 из 6','Что Вы поддерживаете поступками?','Вспомните два-три конкретных эпизода за последние 6–12 месяцев. Важны реальные действия, вложенные ресурсы и обстоятельства — не только намерения.');
A.episodes=A.episodes||[];
while(A.episodes.length<3)A.episodes.push({text:'',tags:[],voluntary:'',repeat:'',resource:''});
A.episodes.slice(0,3).forEach(function(ep,i){var box=node('section');box.id='ep'+i;box.style.cssText='border:1px solid #765a32;border-radius:14px;padding:14px;margin:14px 0';box.append(node('h2','Эпизод '+(i+1)));box.append(field('Что произошло и что Вы реально сделали?','text',ep,'Опишите один конкретный случай…'));box.append(valueChips('Какие ориентиры Вы сами связываете с этим поступком?',ep.tags));var v=node('div');v.style.margin='12px 0';v.append(node('p','Насколько свободным был Ваш выбор?','hint'));[['free','Я сам этого хотел'],['partial','Частично был вынужден'],['forced','Почти не было выбора'],['unknown','Трудно сказать']].forEach(function(o){v.append(button(o[1],function(){ep.voluntary=o[0];save();render()},ep.voluntary===o[0]?'on':''))});box.append(v);var r=node('div');r.style.margin='12px 0';r.append(node('p','Это был единичный случай или похожий выбор повторялся?','hint'));[['once','Один раз'],['repeat','Повторялся'],['ongoing','Это постоянная часть жизни'],['unknown','Не могу определить']].forEach(function(o){r.append(button(o[1],function(){ep.repeat=o[0];save();render()},ep.repeat===o[0]?'on':''))});box.append(r,field('Какие ресурсы Вы вложили или чем поступились?','resource',ep));card.append(box)});
nav(4,2);return;
}
if(l===4){
setHead('Исследование ценностей · 4 из 6','Чему Вы хотите дать место?','Здесь важны желания, непрожитый опыт и то, что Вы пока себе не разрешаете. Зависть и сожаление — повод присмотреться, но не готовый ответ о Ваших ценностях.');
card.append(field('Чему Вам хотелось бы дать больше места в жизни, если не нужно было бы никому объяснять свой выбор?','want',A.desire));
card.append(field('Чему или какому опыту Вы иногда завидуете у других людей? Что именно притягивает?','envy',A.desire));
card.append(field('О чем Вы жалеете, что так и не попробовали или не позволили себе?','regret',A.desire));
card.append(field('Что из этого Вы уже пытались приблизить к своей жизни? Что помогло или помешало?','attempt',A.desire));
card.append(valueChips('Какие ориентиры Вы сами видите за этими желаниями? Необязательно выбирать, если пока неясно.',A.desire.tags));
card.append(barrierChips('Что мешает дать этому место? Можно отметить несколько причин.',A.desire.barriers));
nav(5,3);return;
}
if(l===5){
setHead('Исследование ценностей · 5 из 6','Что кажется трудным потерять?','Мы исследуем не «главную ценность», а то, какие угрозы влияют на Ваши решения и какую цену Вы платите, чтобы сохранить привычное.');
card.append(field('Если представить, что в ближайший год одна важная часть нынешней жизни может измениться, что Вы больше всего боитесь потерять?','loss',A.threat));
card.append(field('Что, по Вашему ощущению, произойдет, если это действительно изменится?','consequence',A.threat));
card.append(field('Что Вы делаете, чтобы не допустить этой потери?','prevention',A.threat));
card.append(field('Какую цену Вы уже платите за то, чтобы сохранить все как есть?','cost',A.threat));
card.append(valueChips('Что именно Вы пытаетесь сохранить? Выберите только то, что сами узнаете в своем ответе.',A.threat.tags));
nav(6,4);return;
}
if(l===6){
setHead('Исследование ценностей · 6 из 6','Как Вы защищаете важное?','Вспомните случай, когда кто-то нарушил важную для Вас границу или договоренность. Важно не только то, как Вы отреагировали, но и что пытались сохранить.');
var reactions=[['boundary','Обозначил границу'],['yield','Промолчал или уступил'],['prove','Объяснял и доказывал'],['control','Усилил контроль'],['withdraw','Отстранился'],['attack','Резко ответил'],['freeze','Замер или отложил реакцию'],['support','Попросил поддержки'],['other','Другое / не хочу отвечать']];
var rg=node('div');rg.className='pair';rg.append(node('p','Что Вы сделали первым?','hint'));reactions.forEach(function(o){rg.append(button(o[1],function(){A.protection.response=o[0];save();render()},A.protection.response===o[0]?'on':''))});card.append(rg);
card.append(field('Что произошло и какая граница или договоренность была нарушена?','context',A.protection));
card.append(field('Что Вы в тот момент пытались сохранить или не допустить?','protected',A.protection));
card.append(valueChips('Какие ориентиры Вы сами связываете с тем, что защищали?',A.protection.tags));
card.append(field('Что произошло после Вашей реакции? Она помогла получить то, что было важно?','outcome',A.protection));
card.append(field('Если бы Вы могли вернуться в ту ситуацию, что сделали бы иначе?','repair',A.protection));
card.append(button('Назад к исследованию угроз',function(){A.layer=5;save();render();scrollTo(0,0)},'quiet-link'));
card.append(button('Собрать мою карту ценностей',finish,'next'));return;
}
}
function calculate(){
var counts={};VALUES.forEach(function(v){counts[v.id]={presented:0,eligible:0,selected:0,tied:0,conditional:0,neither:0,noExperience:0,index:null}});
D.forEach(function(d){var a=A.dilemmas[d.id];if(!a||!a.choice)return;[d.av,d.bv].forEach(function(id){counts[id].presented++});if(a.choice==='a'){counts[d.av].eligible++;counts[d.bv].eligible++;counts[d.av].selected++}else if(a.choice==='b'){counts[d.av].eligible++;counts[d.bv].eligible++;counts[d.bv].selected++}else if(a.choice==='tie'){counts[d.av].eligible++;counts[d.bv].eligible++;counts[d.av].tied++;counts[d.bv].tied++}else if(a.choice==='depends'){counts[d.av].conditional++;counts[d.bv].conditional++}else if(a.choice==='neither'){counts[d.av].neither++;counts[d.bv].neither++}else if(a.choice==='skip'){counts[d.av].noExperience++;counts[d.bv].noExperience++}});
VALUES.forEach(function(v){var c=counts[v.id];c.index=c.eligible>=2?Math.round(100*(c.selected+.5*c.tied)/c.eligible):null});
var episodeTags={},episodeEvidence={};(A.episodes||[]).forEach(function(e,i){(e.tags||[]).forEach(function(id){episodeTags[id]=(episodeTags[id]||0)+1;episodeEvidence[id]=episodeEvidence[id]||{episodes:[],free:0,partial:0,forced:0,repeated:0,resources:0};var z=episodeEvidence[id];z.episodes.push(i+1);if(e.voluntary==='free')z.free++;else if(e.voluntary==='partial')z.partial++;else if(e.voluntary==='forced')z.forced++;if(e.repeat==='repeat'||e.repeat==='ongoing')z.repeated++;if((e.resource||'').trim())z.resources++})});
var declared=A.declared.slice(),actionValues=Object.keys(episodeTags),shared=declared.filter(function(x){return actionValues.indexOf(x)>=0});
var links=[];
if(shared.length)links.push({title:'Ориентиры, которым уже находится место в действиях',values:shared});
var wish=(A.desire.tags||[]).slice();if(wish.length&&(A.desire.barriers||[]).length)links.push({title:'Желаемое, которому Вы обозначили препятствия',values:wish,notes:A.desire.barriers.map(barrierName)});
var threat=(A.threat.tags||[]).filter(function(x){return (A.protection.tags||[]).indexOf(x)>=0});if(threat.length)links.push({title:'То, что Вы стараетесь сохранить и защищаете',values:threat});
return {dilemmas:counts,episodeTags:episodeTags,episodeEvidence:episodeEvidence,links:links,answered:D.filter(function(d){return A.dilemmas[d.id]&&A.dilemmas[d.id].choice}).length};
}
function finish(){
save();var result=calculate();A.result=result;A.completedAt=Date.now();A.layer=7;save();renderResult(result);
var summary={version:A.version,declared:A.declared,privateChoice:A.privateChoice,dilemmas:A.dilemmas,episodes:A.episodes,desire:A.desire,threat:A.threat,protection:A.protection,result:result,completedAt:A.completedAt};
P.valuesAtlasV1=A;
if(window.GProfile)try{P=GProfile.saveResult('values_atlas',summary,{declared:A.declared,tradeoffs:result.dilemmas,links:result.links},{profile:P,save:false});P.valuesAtlasV1=A}catch(e){}
try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}
if(window.GResultCard)try{GResultCard.attachDiaryBar(card,{id:'values_atlas_v1',step:'values.html',title:'Карта внутренних приоритетов',passed:'Точка А',lead:'Исследованы названные ориентиры, выборы в дилеммах, реальные действия, желания, угрозы и способы защиты важного.',strong:A.declared.map(name).join(' · '),insight:result.links.map(function(x){return x.title+': '+x.values.map(name).join(', ')}).join(' / '),insightLabel:'Связи между слоями',insightMore:'Карта сохраняет исходные ответы и отдельные показатели каждого слоя. Итог не сводится к единому рейтингу.',answers:['Дилемм отвечено: '+result.answered+' из 12'],at:Date.now()})}catch(e){}
}
function name(id){var v=VALUES.find(function(x){return x.id===id});return v?v.name:id}
function barrierName(id){var v=BARRIERS.find(function(x){return x.id===id});return v?v.name:id}
function renderResult(r){
card.replaceChildren();setHead('Точка А · Итог исследования','Ваша карта внутренних приоритетов','Шесть разных ракурсов показывают не ярлык личности, а то, что Вы называете важным, выбираете, поддерживаете, хотите, сохраняете и защищаете.');
function section(h,body){card.append(node('h2',h));card.append(body)}
var p=node('div');p.append(node('p',A.declared.map(name).join(' · ')||'Пока не выбраны','hint'));if(A.ownLabel)p.append(node('p','Ваши формулировки: '+A.ownLabel,'muted'));if(A.privateChoice.length)p.append(node('p','Особенно не хотели бы потерять: '+A.privateChoice.map(name).join(', '),'muted'));section('1. Ориентиры, которые Вы назвали',p);
var dl=node('div');D.forEach(function(d){var a=A.dilemmas[d.id];if(!a||!a.choice)return;var label=a.choice==='a'?d.a:a.choice==='b'?d.b:a.choice==='tie'?'Оба одинаково важны':a.choice==='depends'?'Зависит от обстоятельств':a.choice==='neither'?'Ни один вариант не подходит':'Не могу ответить';dl.append(node('p',d.title+' — '+label,'muted'));if(a.note)dl.append(node('p','Ваше уточнение: '+a.note))});section('2. Что Вы выбирали в ситуациях с ограничениями',dl);
var scores=node('div');VALUES.forEach(function(v){var c=r.dilemmas[v.id];if(c.presented){scores.append(node('p',v.name+': '+(c.index===null?'пока недостаточно сопоставимых ответов':c.index+'% выбора в сопоставимых ответах')+' · выбрано '+c.selected+', равно важно '+c.tied+', зависит '+c.conditional+', ни один '+c.neither+', не было опыта '+c.noExperience,'muted'))}});section('Показатели по дилеммам',scores);
var ep=node('div');(A.episodes||[]).forEach(function(e,i){if(e.text)ep.append(node('p','Эпизод '+(i+1)+': '+e.text,'muted'))});Object.keys(r.episodeEvidence).forEach(function(id){var z=r.episodeEvidence[id];ep.append(node('p',name(id)+': '+z.episodes.length+' независимых эпизода; свободный выбор — '+z.free+', частично вынужденный — '+z.partial+', почти без выбора — '+z.forced+', повторялось — '+z.repeated+', с описанной ценой/ресурсом — '+z.resources,'hint'))});section('3. Что Вы уже поддерживали действиями',ep);
var want=node('div');['want','envy','regret','attempt'].forEach(function(k,i){var labels=['Хочу дать место','Что притягивает в опыте других','О чем жалею','Что уже пытался приблизить'];if(A.desire[k])want.append(node('p',labels[i]+': '+A.desire[k],'muted'))});if(A.desire.tags.length)want.append(node('p','Связанные ориентиры: '+A.desire.tags.map(name).join(', '),'hint'));if(A.desire.barriers.length)want.append(node('p','Что мешает: '+A.desire.barriers.map(barrierName).join(', '),'hint'));section('4. Чему Вы хотите дать место',want);
var th=node('div');['loss','consequence','prevention','cost'].forEach(function(k,i){var labels=['Что трудно потерять','Чего опасаюсь','Что делаю, чтобы сохранить','Цена сохранения'];if(A.threat[k])th.append(node('p',labels[i]+': '+A.threat[k],'muted'))});if(A.threat.tags.length)th.append(node('p','Связанные ориентиры: '+A.threat.tags.map(name).join(', '),'hint'));section('5. Что кажется трудным потерять',th);
var pr=node('div');var react={boundary:'Обозначаю границу',yield:'Уступаю или молчу',prove:'Объясняю и доказываю',control:'Усиливаю контроль',withdraw:'Отстраняюсь',attack:'Резко отвечаю',freeze:'Замираю или откладываю',support:'Ищу поддержку',other:'Другое'};if(A.protection.response)pr.append(node('p','Первая реакция: '+(react[A.protection.response]||A.protection.response),'muted'));['context','protected','outcome','repair'].forEach(function(k,i){var labels=['Ситуация','Что пытался сохранить','Что произошло','Что сделал бы иначе'];if(A.protection[k])pr.append(node('p',labels[i]+': '+A.protection[k],'muted'))});if(A.protection.tags.length)pr.append(node('p','Что Вы сами связываете с защищаемым: '+A.protection.tags.map(name).join(', '),'hint'));section('6. Как Вы защищаете важное',pr);
var links=node('div');if(r.links.length)r.links.forEach(function(x){links.append(node('p',x.title+': '+x.values.map(name).join(', ')+(x.notes&&x.notes.length?' · препятствия: '+x.notes.join(', '):''),'hint'))});else links.append(node('p','По текущим ответам пока не выделились устойчивые связи между слоями. Это не мешает использовать каждую часть карты отдельно.','muted'));section('Связи между слоями',links);
card.append(node('p','Эта карта остается открытой для дополнений. Новые примеры могут уточнять ее, не отменяя прежний опыт.','muted'));
card.append(button('Вернуться к карте и дополнить ответы',function(){A.layer=1;save();render();scrollTo(0,0)},'next'));
card.append(button('Дальше: Зодчий',function(){location.href=(window.GRoute&&GRoute.advance())||'slot.html?id=arch_v'},'next'));
}
function legacyMap(){
var old=P.values||{},oldList=old.picked||[];
var map={'Свобода':'freedom','Безопасность':'security','Любовь':'closeness','Семья':'closeness','Здоровье':'security','Деньги':'security','Признание':'recognition','Творчество':'meaning','Развитие':'growth','Дружба':'closeness','Красота':'aliveness','Спокойствие':'security','Честность':'fairness','Помощь людям':'care','Приключения':'aliveness','Духовность':'meaning','Власть и влияние':'recognition','Стабильность':'security','Удовольствие':'aliveness','Смысл':'meaning'};
if(!A.migratedLegacy&&oldList.length){A.declared=Array.from(new Set(oldList.map(function(x){return map[x]}).filter(Boolean))).slice(0,8);A.legacySource=oldList.slice();A.migratedLegacy=true;save()}
}
legacyMap();
render();
})();