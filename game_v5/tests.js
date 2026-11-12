/* Семь тестов комплекта 12.11.2026 и шаг «Три ориентира». Данные: tests-data.js (window.GTESTS).
   Экран шага: slot.html?id=km|fs|lab_d|pi|rs|ct|sv|vsort. Пропуск и «Не знаю» не равны нулю. */
(function(){
'use strict';
var T=window.GTESTS;if(!T)return;
var KEY='alch_v5_profile',VER=1,q=new URLSearchParams(location.search),preview=q.get('preview')==='1',retakeMode=!preview&&q.get('retake')==='1';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function persist(P){if(preview)return;try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
function fem(){var P=load();return window.GGender?GGender(P)==='f':P.gender==='f'}
function g(s){if(s==null)return '';var f=fem();return String(s).replace(/\{([^{}|]*)\|([^{}|]*)\}/g,function(_,m,w){return f?w:m})}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function h(s){return esc(g(s))}
function P_(html){return '<p>'+html+'</p>'}

/* ---------- шаги, поля, подписи ---------- */
var STEP={km:{u:'slot.html?id=km',f:'kmTest',mod:'km',name:'Кривой Мир'},fs:{u:'slot.html?id=fs',f:'firstSet',mod:'firstSet',name:'Первые настройки'},
 lab_d:{u:'slot.html?id=lab_d',f:'desireLab',mod:'desireLab',name:'Лабиринт желаний'},pi:{u:'slot.html?id=pi',f:'interact',mod:'interact',name:'Профиль взаимодействия'},
 rs:{u:'slot.html?id=rs',f:'respTest',mod:'respTest',name:'Ответственность'},ct:{u:'slot.html?id=ct',f:'ctTest',mod:'ctTest',name:'Критическое мышление'},
 sv:{u:'slot.html?id=sv',f:'selfWorth',mod:'selfWorth',name:'Самоценность'},vsort:{u:'slot.html?id=vsort',f:'valuesCore',mod:'valuesCore',name:'Три ориентира'}};
var SHORT={'scene.html?k=ego':'Маг','slot.html?id=fs':'Первые настройки','swipe.html':'свайп хорошего','slot.html?id=arch_p':'Страж, точка переключения',
 'slot.html?id=fractal':'Фрактальная карта','slot.html?id=ct':'Критическое мышление','slot.html?id=leverage':'Точка влияния','slot.html?id=vsort':'три ориентира',
 'slot.html?id=guard':'Встреча со Стражем','slot.html?id=rs':'Ответственность','slot.html?id=pi':'Профиль взаимодействия','slot.html?id=sv':'Самоценность'};
function nextOf(u){var F=window.GFLOW||[],i=F.findIndex(function(x){return x.u===u}),n=i>=0?F[i+1]:null;return n?{u:n.u,t:SHORT[n.u]||n.t}:null}
/* Заставки для будущих видео и картинок (номера продолжают 1–5 большого теста). */
var INTRO={
 km:{z:'Заставка 6',who:'Старец',zdesc:'Мир, который кажется идеальным: ровные дороги, яркие витрины. Если присмотреться, отражения в окнах чуть кривые.',title:'Кривой Мир',text:'Каждый смотрит на мир через свои правила: где опасно, чего не хватает, кому можно доверять. Здесь ты посмотришь, какие из этих правил сейчас звучат громче. Отвечай, как обычно бывает. «Не знаю» не считается нулем.',btn:'Начать'},
 fs:{z:'Заставка 7',who:'Эхо',zdesc:'Две тропинки рядом: детская, в мягком утреннем свете, и сегодняшняя. На обеих похожие следы.',title:'Первые настройки',text:'Сначала двенадцать вопросов о детстве, потом двенадцать о том, как ты реагируешь сейчас. Если не помнишь, так и отметь. Если такого не было, это отдельный ответ.',btn:'Начать'},
 lab_d:{z:'Заставка 8',who:'Хранитель желаний',zdesc:'Вход в лабиринт посреди пустыни миражей. У входа горит один фонарь.',title:'Лабиринт желаний',text:'Здесь не нужно сразу знать, чего ты хочешь. Можно отвечать «Пока не знаю» и коротко писать своими словами. Мы ничего не будем додумывать за тебя.',btn:'Войти в лабиринт'},
 pi:{z:'Заставка 9',who:'Зеркальная цитадель',zdesc:'Зал с четырьмя дверями. За каждой своя пара способов действовать.',title:'Как ты взаимодействуешь',text:'Тридцать две короткие ситуации, в каждой два обычных способа действовать. Выбирай тот, что чаще и естественнее. Есть варианты «Оба», «Зависит» и «Ни один не подходит».',hint:T.pi.none,btn:'Начать'},
 rs:{z:'Заставка 10',who:'Кузнец',zdesc:'Кузница выбора. На наковальне лежат три заготовки: мое, чужое, общее.',title:'Ответственность',text:'Двадцать восемь утверждений о том, где проходит граница твоей части. Это не проверка на правильность, а карта: где ты берешь лишнее, а где отдаешь свое.',btn:'Начать'},
 ct:{z:'Заставка 11',who:'Линза ясности',zdesc:'Стол с увеличительным стеклом. Под ним одна и та же записка выглядит по-разному.',title:'Критическое мышление',text:'Сначала двадцать четыре утверждения о том, как ты обычно рассуждаешь. Потом двенадцать вымышленных ситуаций: выбери самый обоснованный ответ и сразу посмотри пояснение. Это тренировка, а не экзамен.',btn:'Начать'},
 sv:{z:'Заставка 12',who:'Старец',zdesc:'Старец у огня, как в начале пути. Рядом тихо светится знак «Я есмь».',title:'Самоценность',text:'Помнишь «Я есмь»? Право быть не нужно заслуживать. Здесь ты посмотришь, где это право уже стало опорой, а где пока хочется получить разрешение снаружи.',btn:'Начать'}};
var LK=[[4,'Точно про меня'],[3,'Скорее да'],[2,'Иногда'],[1,'Скорее нет'],[0,'Совсем не про меня'],['dk','Не знаю']];
var FQ=[[4,'Почти всегда'],[3,'Часто'],[2,'Иногда'],[1,'Редко'],[0,'Никогда или почти никогда'],['nr','Не помню'],['nw','Не было']];
var LVD=['Фоновая опора','Эпизодическое проявление','Заметное влияние','Выраженный автоматизм'],LVC=['Пока неустойчив','Формируется','Уверенно проявляется','Выраженная опора'];
/* Тексты, которых не было в комплекте: написаны по правилам вопросов, перечислены в written_by_bot.md. */
var W={
 few:'Ответов пока мало, чтобы описать результат. Пропуски и «Не знаю» не считаются нулем, поэтому вывода здесь нет. Можно вернуться к тесту, когда будет время ответить на большую часть вопросов.',
 clearRS:'По твоим ответам ни одна из шести областей не выделилась как выраженная трудность. Ты в целом различаешь свою часть и чужую. Это не значит, что сложных ситуаций не бывает: просто сейчас граница ответственности в основном держится.',
 clearKM:'По твоим ответам ни один фильтр не выделился как выраженный. Осторожность, сомнения и нехватка бывают у всех, но сейчас они не задают общий тон восприятия.',
 prelim:'предварительно',
 ctSit:'Учебные ситуации считаются отдельно от утверждений и не складываются с ними. Пропущенная ситуация не считается ошибкой.',
 piWeak:'Есть небольшой перевес в сторону «%P%», но он не настолько выражен, чтобы считать его устойчивым предпочтением. Смотри на конкретные ситуации.',
 piPole:{'Логика / Этика':['Логика','Этика','Ты чаще сначала опираешься на факты, правила и последовательность аргументов. Отношения и чувства людей ты тоже можешь учитывать, но обычно после того, как понятна структура задачи.','Ты чаще сначала учитываешь людей: их чувства, отношения и то, как решение на них отразится. Логику задачи ты тоже видишь, но обычно через контекст отношений.'],
  'Сенсорика / Интуиция':['Сенсорика','Интуиция','Ты чаще опираешься на конкретное: детали, факты, проверенный опыт и практические условия. Возможности и перспективы тебя тоже интересуют, но обычно после того, как понятно, что есть сейчас.','Ты чаще сначала видишь общую картину, связи и возможные направления. Детали ты тоже можешь учитывать, но интерес обычно вызывает то, к чему все может привести.'],
  'Экстраверсия / Интроверсия':['Экстраверсия','Интроверсия','Ты чаще восстанавливаешься и думаешь в контакте с людьми: обсуждаешь, рассказываешь, включаешься по ходу общения.','Ты чаще восстанавливаешься и думаешь наедине с собой: сначала осмысливаешь, потом делишься выводом.'],
  'Рациональность / Иррациональность':['Рациональность','Иррациональность','Тебе чаще удобнее заранее составить план, порядок и сроки, а потом придерживаться их.','Тебе чаще удобнее держать общий ориентир и уточнять детали по ходу, оставляя место для новых возможностей.']},
 piFew:'По этой оси пока мало ответов с выбором одного из двух способов. Вывод не делается.',
 ldSave:'Сохранение привычного положения может беречь силы, время или деньги, которые сейчас уже заняты другим. Это не каприз и не саботаж. Проверь, какой ресурс ты сохраняешь и можно ли выделить на перемену хотя бы небольшую часть.',
 fsWorse:'Заметнее стала стратегия «%S%».',
 fsStronger:'Сейчас эта стратегия звучит даже сильнее, чем в детстве.'};
W.ldUnknown='Пока не определено. Ответ «Пока не знаю» тоже честный. Вернись к этому вопросу после одного конкретного эпизода.';

/* ---------- стиль ---------- */
function css(){if(window.GArch&&GArch.css)GArch.css();if(document.getElementById('gt-css'))return;var s=document.createElement('style');s.id='gt-css';s.textContent=
'.gt-ph{margin:12px 0 14px;border:2px dashed #b8893f;border-radius:16px;padding:18px 14px;text-align:center}.gt-ph b{display:block;font:800 19px Manrope,sans-serif;color:#a8762f;margin-bottom:4px}.gt-ph small{display:block;margin-top:6px;font-size:15px;line-height:1.4;opacity:.8}'+
'.gt-row{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 12px}.gt-row button{flex:1 1 30%;min-height:44px;padding:8px;border:1px solid #9e783a;border-radius:10px;background:transparent;color:inherit;font:600 16px Manrope,sans-serif}.gt-row button.ar-on{border-color:#6a3a12}'+
'.gt-ex{margin:12px 0;padding:12px;border-left:3px solid #c99a45;line-height:1.5}.gt-ok{font-weight:700}.gt-lv{font-size:15px;opacity:.75;text-transform:uppercase;letter-spacing:.05em;margin:12px 0 2px}'+
'.gt-links{margin-top:12px;display:flex;gap:18px;flex-wrap:wrap}.gt-links a,.gt-links button{background:none;border:0;padding:0;color:#a8762f;font:500 15px Manrope,sans-serif;text-decoration:underline;cursor:pointer;min-height:0;width:auto}'+
'.gt-cards{display:grid;grid-template-columns:1fr;gap:8px}.gt-sum li{margin:6px 0}';document.head.appendChild(s)}

/* ---------- раннер ---------- */
function Runner(box,items,done,mod){this.box=box;this.items=items;this.done=done;this.mod=mod;this.i=0;this.hist=[];this.ans={};var self=this;
 window.gBack=function(){if(self.hist.length){self.i=self.hist.pop();self.draw();scrollTo(0,0);return true}return false}}
Runner.prototype.next=function(){this.hist.push(this.i);this.i++;this.draw();scrollTo(0,0)};
Runner.prototype.raw=function(id,v){if(preview||!window.GProfile||!this.mod)return;try{GProfile.recordRaw(this.mod,id,v,{v:VER})}catch(e){}};
Runner.prototype.set=function(id,v){if(v===undefined)delete this.ans[id];else this.ans[id]=v;this.raw(id,v===undefined?null:v)};
Runner.prototype.draw=function(){var it=this.items[this.i],self=this,b=this.box;if(!it){this.done(this.ans);return}
 var qs=this.items.filter(function(x){return x.q}),ix=qs.indexOf(it);
 var head=(ix>=0?'<div class="al">Вопрос '+(ix+1)+' из '+qs.length+'</div>':'')+(it.h?'<div class="al" style="opacity:.8">'+h(it.h)+'</div>':'')+(it.t?'<div class="aq">'+h(it.t)+'</div>':'')+(it.ctx?'<p class="ar-ctx">'+h(it.ctx)+'</p>':'');
 var skip='<button class="ar-skip" id="gtSk">Пропустить</button>';
 function bindSkip(){var s=b.querySelector('#gtSk');if(s)s.onclick=function(){self.set(it.id,'skip');self.next()}}
 if(it.kind==='intro'){var I=it.I;b.innerHTML='<div class="gt-ph"><b>'+esc(I.z)+'</b>'+esc(I.who)+' · здесь будет картинка или видео<small>'+esc(I.zdesc)+'</small></div><div class="aq">'+h(I.title)+'</div><p>'+h(I.text)+'</p>'+(I.hint?'<p class="ar-ctx">'+h(I.hint)+'</p>':'')+'<button class="next" id="gtGo">'+esc(I.btn)+'</button>';b.querySelector('#gtGo').onclick=function(){self.next()};return}
 if(it.kind==='screen'){b.innerHTML=it.html()+'<button class="next" id="gtGo">'+esc(it.btn||'Дальше')+'</button>';b.querySelector('#gtGo').onclick=function(){self.next()};return}
 if(it.kind==='one'){b.innerHTML=head+'<div id="gtOp">'+it.o.map(function(o){return '<button class="ao'+(String(self.ans[it.id])===String(o[0])?' ar-on':'')+'" data-c="'+esc(o[0])+'">'+h(o[1])+'</button>'}).join('')+'</div><div id="gtEx"></div>'+(it.noskip?'':skip);bindSkip();
  b.querySelectorAll('#gtOp button').forEach(function(x){x.onclick=function(){var c=x.dataset.c,o=it.o.filter(function(z){return String(z[0])===c})[0];var v=typeof o[0]==='number'?o[0]:c;
   if(it.feedback){if(self.ans[it.id]==null||self.ans[it.id]==='skip'){self.set(it.id,v)}b.querySelectorAll('#gtOp button').forEach(function(z){z.disabled=true;z.classList.toggle('ar-on',z===x)});var sk=b.querySelector('#gtSk');if(sk)sk.remove();
    b.querySelector('#gtEx').innerHTML=it.feedback(c)+'<button class="next" id="gtOk">Дальше</button>';b.querySelector('#gtOk').onclick=function(){self.next()};return}
   if(it.textOn&&it.textOn.indexOf(c)>=0){b.querySelectorAll('#gtOp button').forEach(function(z){z.classList.toggle('ar-on',z===x)});b.querySelector('#gtEx').innerHTML='<textarea class="ar-ta" id="gtTx" rows="2" maxlength="200" placeholder="Коротко, своими словами"></textarea><button class="next" id="gtOk">Дальше</button>';var ta=b.querySelector('#gtTx');ta.value=self.ans[it.id+'_text']||'';b.querySelector('#gtOk').onclick=function(){self.set(it.id,v);var t=ta.value.trim();self.set(it.id+'_text',t||undefined);self.next()};return}
   self.set(it.id,v);try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}self.next()}});return}
 if(it.kind==='multi'){var sel=Array.isArray(this.ans[it.id])?this.ans[it.id].slice():[];var excl=it.excl||[];
  b.innerHTML=head+(it.max?'<p class="ar-ctx">Можно выбрать до '+it.max+'.</p>':'<p class="ar-ctx">Можно выбрать несколько.</p>')+'<div id="gtOp">'+it.o.map(function(o){return '<button class="ao" data-c="'+esc(o)+'">'+h(o)+'</button>'}).join('')+'</div>'+(it.other?'<textarea class="ar-ta" id="gtTx" rows="2" maxlength="200" placeholder="Если «Другое», напиши коротко" style="display:none"></textarea>':'')+'<button class="next" id="gtGo">Готово</button>'+skip;bindSkip();
  var tx=b.querySelector('#gtTx');if(tx)tx.value=this.ans[it.id+'_text']||'';
  function mark(){b.querySelectorAll('#gtOp button').forEach(function(x){x.classList.toggle('ar-on',sel.indexOf(x.dataset.c)>=0)});if(tx)tx.style.display=sel.indexOf(it.other)>=0?'':'none';b.querySelector('#gtGo').disabled=!sel.length}
  b.querySelectorAll('#gtOp button').forEach(function(x){x.onclick=function(){var c=x.dataset.c,n=sel.indexOf(c);if(n>=0)sel.splice(n,1);else if(excl.indexOf(c)>=0)sel=[c];else{sel=sel.filter(function(z){return excl.indexOf(z)<0});if(!it.max||sel.length<it.max)sel.push(c)}mark()}});mark();
  b.querySelector('#gtGo').onclick=function(){if(!sel.length)return;self.set(it.id,sel.slice());if(tx){var t=tx.value.trim();self.set(it.id+'_text',sel.indexOf(it.other)>=0&&t?t:undefined)}self.next()};return}
 if(it.kind==='text'){b.innerHTML=head+'<textarea class="ar-ta" id="gtTx" rows="3" maxlength="300"></textarea><button class="next" id="gtGo">Дальше</button>'+(it.dk?'<button class="ar-skip" id="gtDk">Пока не знаю</button>':skip);var t=b.querySelector('#gtTx');t.value=typeof this.ans[it.id]==='string'&&this.ans[it.id]!=='dk'&&this.ans[it.id]!=='skip'?this.ans[it.id]:'';
  b.querySelector('#gtGo').onclick=function(){var v=t.value.trim();self.set(it.id,v||'skip');self.next()};var dk=b.querySelector('#gtDk');if(dk)dk.onclick=function(){self.set(it.id,'dk');self.next()};bindSkip();return}
 if(it.kind==='grid'){var rows=it.rows(this.ans);if(!rows.length){this.i++;this.draw();return}var val=Object.assign({},this.ans[it.id]||{});
  b.innerHTML=head+rows.map(function(r,k){return '<div class="gt-lv">'+h(r)+'</div><div class="gt-row" data-k="'+k+'">'+it.o.map(function(o){return '<button data-c="'+o[0]+'">'+h(o[1])+'</button>'}).join('')+'</div>'}).join('')+'<button class="next" id="gtGo">Дальше</button>'+skip;bindSkip();
  function mk(){b.querySelectorAll('.gt-row').forEach(function(rw){var r=rows[+rw.dataset.k];rw.querySelectorAll('button').forEach(function(x){x.classList.toggle('ar-on',val[r]===x.dataset.c)})})}
  b.querySelectorAll('.gt-row button').forEach(function(x){x.onclick=function(){val[rows[+x.parentNode.dataset.k]]=x.dataset.c;mk()}});mk();b.querySelector('#gtGo').onclick=function(){self.set(it.id,val);self.next()};return}
};

/* ---------- подсчет шкал 0–4 ---------- */
function num(v){return typeof v==='number'?v:null}
function scoreScales(sc,ans){return sc.map(function(s){var vals=[];s.items.forEach(function(it){var a=num(ans[it.id]);if(a!=null)vals.push(it.rev?4-a:a)});var n=vals.length,sum=vals.reduce(function(a,b){return a+b},0);
 var score=n===4?sum:n===3?Math.round(sum/3*4*10)/10:null;return {id:s.id,name:s.name,answered:n,possible:4,score:score,status:n===4?'full':n===3?'preliminary':'insufficient',level:score==null?null:score<4?0:score<8?1:score<12?2:3}})}
function answered(sc,ans){var n=0;sc.forEach(function(s){s.items.forEach(function(it){if(num(ans[it.id])!=null)n++})});return n}
function lvText(sc,r){var s=sc.filter(function(x){return x.id===r.id})[0];return r.level==null?'':g(s.lv[r.level])}
function lvName(r,labels){return r.level==null?'Недостаточно данных':labels[r.level]+(r.status==='preliminary'?', '+W.prelim:'')}
function detailsScales(sc,res,labels,title){return '<details class="ar-det"><summary>'+esc(title||'Подробнее по всем шкалам')+'</summary>'+res.map(function(r){return '<div class="gt-lv">'+esc(r.name)+' · '+esc(lvName(r,labels))+'</div>'+(r.level==null?'<p>'+esc(W.few)+'</p>':'<p>'+esc(lvText(sc,r))+'</p>')}).join('')+'</details>'}
function leaders(res,within){var v=res.filter(function(r){return r.score!=null});if(!v.length)return [];var mx=Math.max.apply(null,v.map(function(r){return r.score}));return v.filter(function(r){return mx-r.score<=within+1e-9})}
function statusOf(res){var v=res.filter(function(r){return r.score!=null});if(!v.length)return 'unclear';return v.every(function(r){return r.status==='full'})?'supported':'tentative'}
function likertItems(sc,shuffle){var L=[];sc.forEach(function(s){s.items.forEach(function(it){L.push({kind:'one',q:1,id:it.id,t:it.t,o:LK})})});if(shuffle){var seed=7;L.sort(function(a,b){return (hash(a.id)%97)-(hash(b.id)%97)})}return L}
function hash(s){var x=0;for(var i=0;i<s.length;i++)x=(x*31+s.charCodeAt(i))>>>0;return x}

/* ---------- результаты тестов ---------- */
var BUILD={};
BUILD.sv=function(ans){var sc=T.sv.scales,res=scoreScales(sc,ans),n=answered(sc,ans),out={v:VER,answers:ans,scales:res,answeredCount:n,possibleCount:24,at:Date.now()};
 var main;if(n<18){out.status='insufficient';main=P_(esc(W.few))}
 else{var L=leaders(res,0),mx=L.length?L[0].score:0;out.status=statusOf(res);
  if(!L.length||mx<4){out.leadingScales=[];out.allClear=true;main='<div class="aq">Опора держится</div>'+P_(esc(g(T.sv.allClear)))}
  else{out.leadingScales=L.map(function(r){return r.id});main='<div class="al">'+(L.length>1?'Заметнее всего здесь':'Заметнее всего здесь')+'</div>'+L.slice(0,2).map(function(r){return '<div class="aq">'+esc(r.name)+'</div><div class="gt-lv">'+esc(lvName(r,LVD))+'</div>'+P_(esc(lvText(sc,r)))}).join('')+(L.length>2?P_('Сопоставимо выражены еще: '+esc(L.slice(2).map(function(r){return r.name}).join(', '))+'.'):'')}}
 out.top=out.status==='insufficient'?'Недостаточно данных':out.allClear?'Опора держится во всех шести областях':'Заметнее всего: '+res.filter(function(r){return (out.leadingScales||[]).indexOf(r.id)>=0}).map(function(r){return r.name}).join(', ');
 return {res:out,html:'<span class="tag">Точка Б</span><span class="tag">Самоценность</span>'+main+detailsScales(sc,res,LVD),log:'Самоценность: '+out.top}};
BUILD.rs=function(ans){var sc=T.rs.scales,res=scoreScales(sc,ans),n=answered(sc,ans),out={v:VER,answers:ans,scales:res,answeredCount:n,possibleCount:24,at:Date.now()},main;
 var sk={};['over','away'].forEach(function(k){var S=T.rs.skew[k],v=S.items.map(function(id){return num(ans[id])}).filter(function(x){return x!=null});sk[k]=v.length?{mean:v.reduce(function(a,b){return a+b},0)/v.length,answered:v.length,show:v.reduce(function(a,b){return a+b},0)/v.length>=3,status:v.length===2?'full':'preliminary'}:{answered:0,show:false,status:'insufficient'}});out.skew=sk;
 if(n<18){out.status='insufficient';main=P_(esc(W.few))}else{var L=leaders(res,0),mx=L.length?L[0].score:0;out.status=statusOf(res);
  if(!L.length||mx<4){out.leadingScales=[];main='<div class="aq">Граница держится</div>'+P_(esc(W.clearRS))}
  else{out.leadingScales=L.map(function(r){return r.id});main='<div class="al">Заметнее всего здесь</div>'+L.slice(0,2).map(function(r){return '<div class="aq">'+esc(r.name)+'</div><div class="gt-lv">'+esc(lvName(r,LVD))+'</div>'+P_(esc(lvText(sc,r)))}).join('')+(L.length>2?P_('Сопоставимо выражены еще: '+esc(L.slice(2).map(function(r){return r.name}).join(', '))+'.'):'')}}
 var skh=['over','away'].filter(function(k){return sk[k].show}).map(function(k){return '<div class="gt-lv">'+esc(T.rs.skew[k].name)+(sk[k].status==='preliminary'?', '+W.prelim:'')+'</div>'+P_(esc(g(T.rs.skew[k].t)))}).join('');
 out.top=out.status==='insufficient'?'Недостаточно данных':(out.leadingScales||[]).length?'Заметнее всего: '+res.filter(function(r){return out.leadingScales.indexOf(r.id)>=0}).map(function(r){return r.name}).join(', '):'Граница ответственности в основном держится';
 return {res:out,html:'<span class="tag">Точка Б</span><span class="tag">Ответственность</span>'+main+(skh?'<details class="ar-det" open><summary>Дополнительный перекос</summary>'+skh+'</details>':'')+detailsScales(sc,res,LVD),log:'Ответственность: '+out.top}};
BUILD.km=function(ans){var sc=T.km.scales,res=scoreScales(sc,ans),n=answered(sc,ans),out={v:VER,answers:ans,scales:res,answeredCount:n,possibleCount:24,at:Date.now()},main;
 if(n<18){out.status='insufficient';main=P_(esc(W.few))}else{var L=leaders(res,1),mx=L.length?L[0].score:0;out.status=statusOf(res);
  if(!L.length||Math.max.apply(null,L.map(function(r){return r.score}))<4){out.leadingScales=[];main='<div class="aq">Фильтры не выделились</div>'+P_(esc(W.clearKM))}
  else{L=L.filter(function(r){return r.score>=4});L.sort(function(a,b){return b.score-a.score});out.leadingScales=L.map(function(r){return r.id});out.status=L.length>1?'mixed':out.status;
   if(L.length===1)main='<div class="al">Громче всего звучит</div><div class="aq">'+esc(L[0].name)+'</div><div class="gt-lv">'+esc(lvName(L[0],LVD))+'</div>'+P_(esc(lvText(sc,L[0])));
   else if(L.length===2)main='<div class="al">Два фильтра рядом</div>'+P_(esc(g(T.km.two).replace('{шкала_1}','«'+L[0].name+'»').replace('{шкала_2}','«'+L[1].name+'»')))+L.map(function(r){return '<div class="gt-lv">'+esc(r.name)+' · '+esc(lvName(r,LVD))+'</div>'}).join('');
   else main='<div class="al">Несколько фильтров рядом</div>'+P_(esc(g(T.km.many)))+'<ul class="gt-sum">'+L.map(function(r){return '<li>'+esc(r.name)+' · '+esc(lvName(r,LVD))+'</li>'}).join('')+'</ul>'}}
 out.top=out.status==='insufficient'?'Недостаточно данных':(out.leadingScales||[]).length?res.filter(function(r){return out.leadingScales.indexOf(r.id)>=0}).map(function(r){return r.name}).join(', '):'Выраженных фильтров нет';
 return {res:out,html:'<span class="tag">Точка 0</span><span class="tag">Кривой Мир</span>'+main+detailsScales(sc,res,LVD),log:'Кривой Мир: '+out.top}};
BUILD.ct=function(ans){var sc=T.ct.scales,res=scoreScales(sc,ans),n=answered(sc,ans),out={v:VER,answers:ans,scales:res,answeredCount:n,possibleCount:24,at:Date.now()},main;
 var S=T.ct.sit,st=S.map(function(s){var a=ans[s.id];return {id:s.id,answer:a&&a!=='skip'?a:null,key:s.key,correct:a===s.key}}),ansd=st.filter(function(x){return x.answer}).length,ok=st.filter(function(x){return x.correct}).length;
 out.situations={items:st,answered:ansd,possible:12,reasoned:ok};
 if(n<18){out.status='insufficient';main=P_(esc(W.few))}else{out.status=statusOf(res);var v=res.filter(function(r){return r.score!=null}),mx=Math.max.apply(null,v.map(function(r){return r.score})),mn=Math.min.apply(null,v.map(function(r){return r.score}));
  var top=v.filter(function(r){return r.score===mx}),low=v.filter(function(r){return r.score===mn});out.leadingScales=top.map(function(r){return r.id});out.growthScales=mx===mn?[]:low.map(function(r){return r.id});
  main='<div class="al">Твоя опора в рассуждении</div>'+top.slice(0,2).map(function(r){return '<div class="aq">'+esc(r.name)+'</div><div class="gt-lv">'+esc(lvName(r,LVC))+'</div>'+P_(esc(lvText(sc,r)))}).join('')+(mx!==mn?'<div class="al" style="margin-top:14px">Что можно потренировать</div>'+low.slice(0,1).map(function(r){return '<div class="aq">'+esc(r.name)+'</div><div class="gt-lv">'+esc(lvName(r,LVC))+'</div>'+P_(esc(lvText(sc,r)))}).join(''):'')}
 var sit='<details class="ar-det"><summary>Учебные ситуации: '+ok+' из '+ansd+'</summary><p>'+esc(W.ctSit)+'</p>'+S.map(function(s,i){var x=st[i];return '<div class="gt-lv">'+esc(s.h)+'</div><p>'+(x.answer?(x.correct?'Выбран наиболее обоснованный ответ. ':'Выбран вариант '+x.answer+', наиболее обоснованный: '+s.key+'. ')+esc(s.ex[x.answer]):'Пропущено.')+'</p>'}).join('')+'</details>';
 out.top=out.status==='insufficient'?'Недостаточно данных':'Опора: '+res.filter(function(r){return (out.leadingScales||[]).indexOf(r.id)>=0}).map(function(r){return r.name}).join(', ');
 return {res:out,html:'<span class="tag">Точка Б</span><span class="tag">Критическое мышление</span>'+main+sit+detailsScales(sc,res,LVC),log:'Критическое мышление: '+out.top+'. Учебные ситуации: '+ok+' из '+ansd}};
BUILD.fs=function(ans){var F=T.fs,names=Object.keys(F.str),out={v:VER,answers:ans,at:Date.now()};
 function per(list){var o={};names.forEach(function(n){var a=list.filter(function(q){return q.s===n}).map(function(q){return ans[q.id]}),v=a.filter(function(x){return typeof x==='number'});o[n]={answered:v.length,mean:v.length?v.reduce(function(x,y){return x+y},0)/v.length:null,notRemember:a.filter(function(x){return x==='nr'}).length,notWas:a.filter(function(x){return x==='nw'}).length,allNotWas:a.length===3&&a.every(function(x){return x==='nw'})}});return o}
 var C=per(F.child),N=per(F.now),R={};
 names.forEach(function(n){var c=C[n],x=N[n],r;if(c.allNotWas)r='notwas';else if(c.answered<2||x.answered<2)r='few';
  else if(c.mean>=2&&x.mean>=2&&(Math.abs(x.mean-c.mean)<1||x.mean>c.mean))r='kept';
  else if(c.mean>=2&&c.mean-x.mean>=1){var other=names.filter(function(m){return m!==n&&N[m].answered>=2&&N[m].mean>=2&&N[m].mean-x.mean>=1}).sort(function(a,b){return N[b].mean-N[a].mean})[0];r=other?'changed':'weaker';if(other)R[n+'_to']=other}
  else if(c.mean<1&&x.mean>=2)r='later';else r='none';R[n]=r});
 out.child=C;out.now=N;out.outcome=R;
 var RT={kept:'Стратегия сохранилась.',weaker:'Стратегия ослабла.',changed:'Стратегия изменилась.',later:'Стратегия появилась позже.',none:'Совпадение не выявлено.'};
 var valid=names.filter(function(n){return N[n].answered>=2}),mx=valid.length?Math.max.apply(null,valid.map(function(n){return N[n].mean})):null,lead=valid.filter(function(n){return N[n].mean===mx&&mx>=2});out.leading=lead;
 out.status=!valid.length?'insufficient':lead.length>1?'mixed':lead.length?'supported':'unclear';
 function outTxt(n){var r=R[n];if(r==='notwas')return g(F.sp['Не было.']);if(r==='few')return g(F.sp['Недостаточно данных.']);var t=g(F.res[RT[r]]);if(r==='changed')t+=' '+W.fsWorse.replace('%S%',R[n+'_to']);if(r==='kept'&&N[n].mean-C[n].mean>=1)t+=' '+W.fsStronger;return t}
 function label(n){var r=R[n];return r==='notwas'?'Не было':r==='few'?'Недостаточно данных':RT[r].replace('.','')}
 var main=(lead.length?'<div class="al">Сейчас заметнее всего</div>'+lead.map(function(n){var S=F.str[n];return '<div class="aq">'+esc(n)+'</div><div class="gt-lv">'+esc(label(n))+'</div>'+P_(esc(g(S.now)))+P_(esc(outTxt(n)))}).join(''):P_(esc(valid.length?g(F.res['Совпадение не выявлено.']):g(F.sp['Недостаточно данных.']))));
 var nr=names.some(function(n){return C[n].notRemember||N[n].notRemember});
 var det='<details class="ar-det"><summary>Все четыре стратегии</summary><p class="ar-ctx">'+esc(g(F.intro))+'</p>'+names.map(function(n){var S=F.str[n],x=R[n]==='kept'?S.kept:(R[n]==='weaker'||R[n]==='changed')?S.changed:'';return '<div class="gt-lv">'+esc(n)+' · '+esc(label(n))+'</div><p><b>Детство:</b> '+esc(g(S.child))+'</p><p><b>Сейчас:</b> '+esc(g(S.now))+'</p><p>'+esc(outTxt(n))+'</p>'+(x?'<p>'+esc(g(x))+'</p>':'')}).join('')+(nr?'<div class="gt-lv">Не помню</div><p>'+esc(g(F.sp['Не помню.']))+'</p>':'')+'</details>';
 out.top=lead.length?lead.join(', '):'Ведущая стратегия не выделилась';
 return {res:out,html:'<span class="tag">Точка 0</span><span class="tag">Первые настройки</span>'+main+det,log:'Первые настройки: сейчас заметнее '+out.top}};
var AX=['Логика / Этика','Сенсорика / Интуиция','Экстраверсия / Интроверсия','Рациональность / Иррациональность'];
BUILD.pi=function(ans){var Q=T.pi.q,out={v:VER,answers:ans,axes:{},at:Date.now()};
 var html=AX.map(function(ax,k){var qs=Q.slice(k*8,k*8+8),p1=0,p2=0;qs.forEach(function(x){if(ans[x.id]==='p1')p1++;if(ans[x.id]==='p2')p2++});var n=p1+p2,st,txt,pp=W.piPole[ax];
  if(n<4){st='insufficient';txt=W.piFew}else if(p1>=5&&p1-p2>=2){st='pole1';txt=pp[2]}else if(p2>=5&&p2-p1>=2){st='pole2';txt=pp[3]}else if(Math.abs(p1-p2)<=1){st='balance';txt=g(T.pi.bal[ax+'.'])}else{st='weak';txt=W.piWeak.replace('%P%',p1>p2?pp[0]:pp[1])}
  out.axes[ax]={pole1:p1,pole2:p2,answered:n,status:st};var lab={insufficient:'Недостаточно данных',pole1:pp[0],pole2:pp[1],balance:'Баланс',weak:'Небольшой перевес: '+(p1>p2?pp[0]:pp[1])}[st];out.axes[ax].label=lab;
  return {ax:ax,lab:lab,txt:txt}});
 out.top=html.map(function(x){return x.lab}).join(' · ');out.status=html.every(function(x){return out.axes[x.ax].status==='insufficient'})?'insufficient':'tentative';
 var main='<div class="al">Твои способы взаимодействия</div><ul class="gt-sum">'+html.map(function(x){return '<li><b>'+esc(x.ax)+':</b> '+esc(x.lab)+'</li>'}).join('')+'</ul><p class="ar-ctx">'+esc(g(T.pi.lim))+'</p>';
 var det='<details class="ar-det"><summary>Что это значит по каждой оси</summary>'+html.map(function(x){return '<div class="gt-lv">'+esc(x.ax)+' · '+esc(x.lab)+'</div>'+P_(esc(x.txt))}).join('')+'</details>';
 return {res:out,html:'<span class="tag">Точка Б</span><span class="tag">Профиль взаимодействия</span>'+main+det,log:'Профиль взаимодействия: '+out.top}};
/* Лабиринт желаний */
function opts(f){return f.split(';').map(function(x){x=x.trim();return x.charAt(0).toUpperCase()+x.slice(1)})}
var LDq={};T.ld.q.forEach(function(x){LDq[x.id]=x});
function txt(a){return typeof a==='string'&&a!=='dk'&&a!=='skip'&&a.trim()?a.trim():null}
function arr(a){return Array.isArray(a)?a:[]}
BUILD.lab_d=function(ans){var out={v:VER,answers:ans,at:Date.now()},R=T.ld.res;
 var dk=function(id){var a=ans[id];return a==null||a==='dk'||a==='skip'||(typeof a==='string'&&!a.trim())};
 var filled=['LD01','LD02','LD03','LD04','LD05','LD06','LD07','LD08'].filter(function(id){var a=ans[id];return a!=null&&a!=='skip'&&!(typeof a==='string'&&!a.trim())}).length;
 var ld06=ans.LD06,conc06=typeof ld06==='string'&&ld06!=='Пока не могу выбрать'&&ld06!=='skip';
 var ld02=arr(ans.LD02).filter(function(x){return x!=='Пока не знаю'}),risk=arr(ans.LD10).filter(function(x){return ['Ничего из перечисленного','Пока не знаю'].indexOf(x)<0}),gain=arr(ans.LD11).filter(function(x){return ['Ничего из перечисленного','Пока не знаю'].indexOf(x)<0});
 var desire=!!(txt(ans.LD01)||conc06||txt(ans.LD07)),r;
 if((!txt(ans.LD01)&&!conc06)||filled<4)r='Недостаточно данных.';
 else if(ld06==='Пока не могу выбрать'&&['LD01','LD03','LD05','LD07'].filter(dk).length>=2)r='Сейчас трудно услышать собственное желание.';
 else if(arr(ans.LD09).length===2)r='Два желания конкурируют.';
 else if(desire&&(risk.length||gain.length))r='Желание соседствует с сопротивлением.';
 else if(conc06&&txt(ans.LD07)&&txt(ans.LD08))r='Направление уже обозначено.';
 else if(ld02.length||txt(ans.LD03)||txt(ans.LD05)||conc06)r='Желание есть, формулировка пока размыта.';
 else r='Сейчас трудно услышать собственное желание.';
 out.result=r;out.status=r==='Недостаточно данных.'?'insufficient':r==='Направление уже обозначено.'?'supported':'tentative';
 var GM={'Защиту от риска или оценки':'Защита.','Предсказуемость':'Предсказуемость.','Сохранение принадлежности к людям или группе':'Принадлежность.','Сохранение привычного представления о себе':'Привычная идентичность.','Немедленное облегчение':'Немедленное облегчение.'};
 var gh=arr(ans.LD11).indexOf('Пока не знаю')>=0&&!gain.length?'<p>'+esc(W.ldUnknown)+'</p>':gain.map(function(x){var k=GM[x];return '<div class="gt-lv">'+esc(k?k.replace('.',''):'Сохранение ресурсов')+'</div>'+P_(esc(k?g(T.ld.gain[k]):W.ldSave))}).join('');
 var prac=arr(ans.LD12).filter(function(x){return /не хватает (времени|денег|навыка|поддержки)/i.test(x)});
 var price=arr(ans.LD13),pr=ans.LD14||{},PL={real:'реально неизбежно',maybe:'пока предполагаю',dk:'не знаю'};
 out.desire=txt(ans.LD07)||(conc06?ld06:null)||txt(ans.LD01);out.step=txt(ans.LD15);out.gains=gain;out.risks=risk;out.obstacles=arr(ans.LD12);out.price=price.map(function(p){return {item:p,status:pr[p]||null}});
 var mine=[['Что хочется изменить',txt(ans.LD01)],['Направление',conc06?ld06:null],['Желаемый результат',txt(ans.LD07)],['Признак изменения',txt(ans.LD08)],['Маленький шаг',txt(ans.LD15)]].filter(function(x){return x[1]});
 var main='<div class="al">Что видно сейчас</div><div class="aq">'+esc(r.replace('.',''))+'</div>'+P_(esc(g(R[r])))+(out.step?'<p class="ar-pt">Твой маленький шаг: '+esc(out.step)+'</p>':'');
 var det=(mine.length?'<details class="ar-det"><summary>Твои ответы</summary>'+mine.map(function(x){return '<p><b>'+esc(x[0])+':</b> '+esc(x[1])+'</p>'}).join('')+'</details>':'')+
  (gh?'<details class="ar-det"><summary>Что дает привычное положение</summary>'+gh+'</details>':'')+
  (prac.length?'<details class="ar-det"><summary>Препятствия</summary><p>'+esc(prac.join(', '))+'</p>'+P_(esc(g(T.ld.gain['Реальное ограничение ресурса.'])))+'</details>':'')+
  (price.length?'<details class="ar-det"><summary>Цена перемен</summary>'+P_(esc(g(T.ld.price)))+'<ul class="gt-sum">'+price.map(function(p){return '<li>'+esc(p)+(pr[p]?': '+esc(PL[pr[p]]):'')+'</li>'}).join('')+'</ul></details>':'');
 out.top=r.replace('.','')+(out.desire?': '+out.desire:'');
 return {res:out,html:'<span class="tag">Точка Б</span><span class="tag">Лабиринт желаний</span>'+main+det,log:'Лабиринт желаний: '+out.top}};

/* ---------- списки вопросов ---------- */
var ITEMS={};
ITEMS.sv=function(){return [{kind:'intro',I:INTRO.sv}].concat(likertItems(T.sv.scales))};
ITEMS.rs=function(){var L=likertItems(T.rs.scales);T.rs.rx.forEach(function(x){L.push({kind:'one',q:1,id:x.id,t:x.t,o:LK})});return [{kind:'intro',I:INTRO.rs}].concat(L)};
ITEMS.km=function(){return [{kind:'intro',I:INTRO.km}].concat(likertItems(T.km.scales))};
ITEMS.ct=function(){var L=[{kind:'intro',I:INTRO.ct}].concat(likertItems(T.ct.scales));L.push({kind:'screen',btn:'К ситуациям',html:function(){return '<div class="aq">Двенадцать учебных ситуаций</div><p>Все имена, числа и обстоятельства вымышлены. Выбери один самый обоснованный ответ. После выбора сразу появится пояснение.</p>'}});
 T.ct.sit.forEach(function(s){L.push({kind:'one',q:1,id:s.id,h:s.h,t:s.t,o:s.o.map(function(o){return [o[0],o[0]+'. '+o[1]]}),feedback:function(c){var ok=c===s.key;return '<div class="gt-ex"><p class="gt-ok">'+(ok?'Это наиболее обоснованный ответ.':'Этот ответ слабее обоснован.')+'</p><p>'+esc(s.ex[c])+'</p>'+(ok?'':'<details class="ar-det"><summary>Наиболее обоснованный: '+s.key+'</summary><p>'+esc(s.ex[s.key])+'</p></details>')+'</div>'}})});return L};
ITEMS.fs=function(){var L=[{kind:'intro',I:INTRO.fs},{kind:'screen',btn:'Начать',html:function(){return '<div class="aq">Детство</div><p>Вспоминай обычные ситуации, примерно до двенадцати лет.</p>'}}];
 T.fs.child.forEach(function(x){L.push({kind:'one',q:1,id:x.id,h:'Детство',t:x.t,o:FQ})});L.push({kind:'screen',btn:'Дальше',html:function(){return '<div class="aq">Сейчас</div><p>Теперь о том, как ты реагируешь в последние месяцы.</p>'}});
 T.fs.now.forEach(function(x){L.push({kind:'one',q:1,id:x.id,h:'Сейчас',t:x.t,o:FQ})});return L};
ITEMS.pi=function(){var L=[{kind:'intro',I:INTRO.pi}];T.pi.q.forEach(function(x){L.push({kind:'one',q:1,id:x.id,t:x.t,o:[['p1',x.p1],['p2',x.p2],['both','Оба'],['dep','Зависит'],['none','Ни один не подходит']]})});return L};
ITEMS.lab_d=function(){var Q=LDq,L=[{kind:'intro',I:INTRO.lab_d}];
 L.push({kind:'text',q:1,id:'LD01',t:Q.LD01.t,dk:1});
 L.push({kind:'multi',q:1,id:'LD02',t:Q.LD02.t,o:opts(Q.LD02.f),other:'Другое',excl:['Пока не знаю']});
 L.push({kind:'text',q:1,id:'LD03',t:Q.LD03.t});L.push({kind:'text',q:1,id:'LD04',t:Q.LD04.t,dk:1});L.push({kind:'text',q:1,id:'LD05',t:Q.LD05.t,dk:1});
 L.push({kind:'one',q:1,id:'LD06',t:Q.LD06.t,o:opts(Q.LD06.f).map(function(x){return [x,x]})});
 L.push({kind:'text',q:1,id:'LD07',t:Q.LD07.t});L.push({kind:'text',q:1,id:'LD08',t:Q.LD08.t});
 L.push({kind:'multiDyn',q:1,id:'LD09',t:Q.LD09.t});
 L.push({kind:'multi',q:1,id:'LD10',t:Q.LD10.t,o:opts(Q.LD10.f),other:'Другое',excl:['Ничего из перечисленного','Пока не знаю']});
 L.push({kind:'multi',q:1,id:'LD11',t:Q.LD11.t,o:opts(Q.LD11.f),excl:['Ничего из перечисленного','Пока не знаю']});
 L.push({kind:'multi',q:1,id:'LD12',t:Q.LD12.t,o:opts(Q.LD12.f),other:'Другое',excl:['Пока не знаю']});
 L.push({kind:'multi',q:1,id:'LD13',t:Q.LD13.t,o:opts(Q.LD13.f),other:'Другая цена'});
 L.push({kind:'grid',q:1,id:'LD14',t:Q.LD14.t,o:[['real','Реально неизбежно'],['maybe','Пока предполагаю'],['dk','Не знаю']],rows:function(a){return arr(a.LD13)}});
 L.push({kind:'text',q:1,id:'LD15',t:Q.LD15.t,dk:1});return L};
/* LD09: варианты собираются из ответов LD02 и LD06 */
var drawBase=Runner.prototype.draw;Runner.prototype.draw=function(){var it=this.items[this.i];if(it&&it.kind==='multiDyn'){var a=this.ans,o=arr(a.LD02).filter(function(x){return x!=='Пока не знаю'&&x!=='Другое'});if(typeof a.LD02_text==='string')o.push(a.LD02_text);if(typeof a.LD06==='string'&&a.LD06!=='Пока не могу выбрать'&&o.indexOf(a.LD06)<0)o.push(a.LD06);o.push('Свое направление');
 this.items[this.i]=Object.assign({},it,{kind:'multi',o:o,max:2,other:'Свое направление'})}return drawBase.call(this)};

/* ---------- сохранение, вход в Реактор, дневник ---------- */
function reactorIn(P){var r={v:VER,at:Date.now(),tests:{}};Object.keys(STEP).forEach(function(k){var x=P[STEP[k].f];if(!x||k==='vsort')return;r.tests[k]={status:x.status||'tentative',top:x.top||null,leadingScales:x.leadingScales||x.leading||[]}});if(P.valuesCore)r.values3=P.valuesCore.top3;if(P.desireLab&&P.desireLab.step)r.desireStep=P.desireLab.step;return r}
function store(k,res,log){if(preview)return;var P=load(),S=STEP[k];if(window.GProfile){try{P=GProfile.saveResult(S.mod,res,{version:VER},{profile:P,save:false})}catch(e){P[S.f]=res}}else P[S.f]=res;
 P[S.f]=res;P.reactorIn=reactorIn(P);(P.log=P.log||[]).push({t:Date.now(),x:log});persist(P)}
function quoteKey(k){return STEP[k].u}
function result(box,k,built,retake){var S=STEP[k],n=nextOf(S.u);box.innerHTML=built.html+(preview?'<p class="ar-ctx">Просмотр: ответы не сохраняются в твой путь.</p>':'')+'<button class="next" id="nx">'+(retakeMode?'Дальше: Задания':n?'Дальше: '+esc(n.t):'Дальше')+'</button><div class="gt-links">'+(retake?'<button type="button" id="gtRe">Пройти заново</button>':'')+'<a href="diary.html">В дневник</a></div>';
 if(window.GQuote)GQuote.add(box,quoteKey(k),box.querySelector('#nx'));
 var nx=box.querySelector('#nx');window.nx=nx;nx.onclick=function(){if(preview){location.href=n&&STEP[Object.keys(STEP).filter(function(x){return STEP[x].u===n.u})[0]]?n.u+'&preview=1':'tasks.html';return}if(window.GReview||retakeMode){location.href='tasks.html'+(retakeMode?'#skipped':'');return}location.href=GRoute.advance()};
 var re=box.querySelector('#gtRe');if(re)re.onclick=function(){retake()};scrollTo(0,0)}
function mountTest(k,box){css();var P=load(),S=STEP[k],have=P[S.f];
 function run(){new Runner(box,ITEMS[k](),function(ans){var b=BUILD[k](ans);store(k,b.res,b.log);result(box,k,b,run)},S.mod).draw()}
 if(have&&have.v&&have.answers&&!preview){result(box,k,BUILD[k](have.answers),run);return}
 run()}

/* ---------- три ориентира: важно / отложить / вычеркнуть, затем ровно три ---------- */
var VALS=['Свобода','Безопасность','Любовь','Семья','Здоровье','Деньги','Признание','Творчество','Развитие','Дружба','Красота','Спокойствие','Честность','Помощь людям','Приключения','Духовность','Власть и влияние','Стабильность','Удовольствие','Смысл'];
function mountValues(box){css();var P=load(),have=P.valuesCore,V=(P.values&&P.values.order&&P.values.order.length)?P.values.order:[],list=V.concat(VALS.filter(function(x){return V.indexOf(x)<0})),sort={},i=0,pick=[];
 function intro(){box.innerHTML='<span class="tag">Точка Б</span><span class="tag">Ценности</span><div class="aq">Три ориентира</div><p>'+h(T.link.svToValues)+'</p><p class="ar-ctx">Разложи ценности по трем корзинам: «Важно сейчас», «Отложить», «Вычеркнуть». Потом выбери из важных ровно три.</p><button class="next" id="gtGo">Начать</button>';box.querySelector('#gtGo').onclick=card}
 function card(){window.gBack=function(){if(i>0){i--;card();return true}return false};if(i>=list.length){choose();return}var v=list[i];box.innerHTML='<div class="al">Ценность '+(i+1)+' из '+list.length+'</div><div class="aq" style="text-align:center;margin:24px 0">'+esc(v)+'</div><div id="gtOp">'+[['imp','Важно сейчас'],['later','Отложить'],['cross','Вычеркнуть']].map(function(o){return '<button class="ao'+(sort[v]===o[0]?' ar-on':'')+'" data-c="'+o[0]+'">'+o[1]+'</button>'}).join('')+'</div>';
  box.querySelectorAll('#gtOp button').forEach(function(x){x.onclick=function(){sort[v]=x.dataset.c;i++;card();scrollTo(0,0)}})}
 function choose(){window.gBack=function(){i=list.length-1;card();return true};var imp=list.filter(function(v){return sort[v]==='imp'}),pool=imp.length>=3?imp:imp.concat(list.filter(function(v){return sort[v]==='later'}));
  box.innerHTML='<div class="aq">Выбери ровно три</div><p class="ar-ctx">'+(imp.length>=3?'Из тех, что ты '+g('{отметил|отметила}')+' как важные сейчас.':'Важных меньше трех, поэтому здесь есть и отложенные.')+'</p><div id="gtOp">'+pool.map(function(v){return '<button class="ao'+(pick.indexOf(v)>=0?' ar-on':'')+'" data-c="'+esc(v)+'">'+esc(v)+'</button>'}).join('')+'</div><p class="ar-ctx" id="gtCnt"></p><button class="next" id="gtGo">Готово</button>';
  function mk(){box.querySelectorAll('#gtOp button').forEach(function(x){x.classList.toggle('ar-on',pick.indexOf(x.dataset.c)>=0)});box.querySelector('#gtCnt').textContent='Выбрано: '+pick.length+' из 3';box.querySelector('#gtGo').disabled=pick.length!==3}
  box.querySelectorAll('#gtOp button').forEach(function(x){x.onclick=function(){var c=x.dataset.c,n=pick.indexOf(c);if(n>=0)pick.splice(n,1);else if(pick.length<3)pick.push(c);mk()}});mk();
  box.querySelector('#gtGo').onclick=function(){if(pick.length!==3)return;var res={v:VER,sort:sort,top3:pick.slice(),status:'supported',top:pick.join(', '),answers:sort,at:Date.now()};store('vsort',res,'Три ориентира: '+pick.join(', '));show(res)}}
 function show(res){result(box,'vsort',{html:'<span class="tag">Точка Б</span><span class="tag">Ценности</span><div class="al">Твои три ориентира</div><ol class="gt-sum">'+res.top3.map(function(v){return '<li><b>'+esc(v)+'</b></li>'}).join('')+'</ol>'+P_(h(T.link.valuesToReactor))+'<details class="ar-det"><summary>Как ты '+g('{разложил|разложила}')+' ценности</summary>'+[['imp','Важно сейчас'],['later','Отложить'],['cross','Вычеркнуть']].map(function(o){var l=Object.keys(res.sort).filter(function(v){return res.sort[v]===o[0]});return l.length?'<p><b>'+o[1]+':</b> '+esc(l.join(', '))+'</p>':''}).join('')+'</details>'},function(){sort={};i=0;pick=[];intro()})}
 if(have&&have.top3&&!preview){show(have);return}intro()}

window.GTests={STEP:STEP,BUILD:BUILD,ITEMS:ITEMS,reactorIn:reactorIn,mount:function(k,box){if(k==='vsort')mountValues(box);else mountTest(k,box)},keys:Object.keys(STEP),W:W};
})();
