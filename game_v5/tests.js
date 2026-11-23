/* Семь тестов комплекта 12.11.2026 и шаг «Три ориентира». Данные: tests-data.js (window.GTESTS).
   В «Идеальном Кривом Мире» ответ «Не знаю» учитывается как 0; в остальных тестах правила подсчета не меняются. */
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
var STEP={km:{u:'slot.html?id=km',f:'kmTest',mod:'km',name:'Идеальный Кривой Мир'},fs:{u:'slot.html?id=fs',f:'firstSet',mod:'firstSet',name:'Первые настройки'},
 lab_d:{u:'slot.html?id=lab_d',f:'desireLab',mod:'desireLab',name:'Лабиринт желаний'},pi:{u:'slot.html?id=pi',f:'interact',mod:'interact',name:'Профиль взаимодействия'},
 rs:{u:'slot.html?id=rs',f:'respTest',mod:'respTest',name:'Ответственность'},ct:{u:'slot.html?id=ct',f:'ctTest',mod:'ctTest',name:'Критическое мышление'},
 sv:{u:'slot.html?id=sv',f:'selfWorth',mod:'selfWorth',name:'Самоценность'},vsort:{u:'slot.html?id=vsort',f:'valuesCore',mod:'valuesCore',name:'Три ориентира'},
 im:{u:'slot.html?id=im',f:'im',mod:'im',name:'Зеркало внутреннего мира'}};
var SHORT={'scene.html?k=ego':'Маг','slot.html?id=fs':'Первые настройки','swipe.html':'свайп хорошего','slot.html?id=arch_p':'Страж, точка переключения',
 'slot.html?id=fractal':'Фрактальная карта','slot.html?id=ct':'Критическое мышление','slot.html?id=leverage':'Точка влияния','slot.html?id=vsort':'три ориентира',
 'slot.html?id=guard':'Встреча со Стражем','slot.html?id=rs':'Ответственность','slot.html?id=pi':'Профиль взаимодействия','slot.html?id=sv':'Самоценность'};
function nextOf(u){var F=window.GFLOW||[],i=F.findIndex(function(x){return x.u===u}),n=i>=0?F[i+1]:null;return n?{u:n.u,t:SHORT[n.u]||n.t}:null}
/* Заставки для будущих видео и картинок (номера продолжают 1–5 большого теста). */
var INTRO={
 km:{z:'Заставка 6',who:'Старец',zdesc:'Мир, который кажется идеальным: ровные дороги, яркие витрины. Если присмотреться, отражения в окнах чуть кривые.',title:'Идеальный Кривой Мир',text:'В детстве психика собирает свою картину мира из того, что помогает чувствовать себя в безопасности, получать любовь, сохранять близость и справляться с происходящим. Эти правила могут казаться единственно верными — почти идеальными, потому что когда-то помогали. Но человек взрослеет, обстоятельства меняются, а старые настройки продолжают влиять на решения и отношения. То, что раньше защищало, теперь иногда ограничивает или причиняет боль. Здесь мы посмотрим, через какие фильтры ты чаще воспринимаешь мир сегодня. Отвечай так, как обычно бывает сейчас.',btn:'Начать'},
 fs:{z:'Заставка 7',who:'Эхо',zdesc:'Две тропинки рядом: детская, в мягком утреннем свете, и сегодняшняя. На обеих похожие следы.',title:'Первые настройки',text:'Сначала двенадцать вопросов о детстве, потом двенадцать о том, как ты реагируешь сейчас. Если не помнишь, так и отметь. Если такого не было, это отдельный ответ.',btn:'Начать'},
 lab_d:{z:'Заставка 8',who:'Хранитель желаний',zdesc:'Вход в лабиринт посреди пустыни миражей. У входа горит один фонарь.',title:'Лабиринт желаний',text:'Здесь не нужно сразу знать, чего ты хочешь. Можно отвечать «Пока не знаю» и коротко писать своими словами. Мы ничего не будем додумывать за тебя.',btn:'Войти в лабиринт'},
 pi:{z:'Заставка 9',who:'Зеркальная цитадель',zdesc:'Зал с четырьмя дверями. За каждой своя пара способов действовать.',title:'Как ты взаимодействуешь',text:'Тридцать две короткие ситуации, в каждой два обычных способа действовать. Выбирай тот, что чаще и естественнее. Есть варианты «Оба», «Зависит» и «Ни один не подходит».',hint:T.pi.none,btn:'Начать'},
 rs:{z:'Заставка 10',who:'Кузнец',zdesc:'Кузница выбора. На наковальне лежат три заготовки: мое, чужое, общее.',title:'Ответственность',text:'Двадцать восемь утверждений о том, где проходит граница твоей части. Это не проверка на правильность, а карта: где ты берешь лишнее, а где отдаешь свое.',btn:'Начать'},
 ct:{z:'Заставка 11',who:'Линза ясности',zdesc:'Стол с увеличительным стеклом. Под ним одна и та же записка выглядит по-разному.',title:'Критическое мышление',text:'Сначала двадцать четыре утверждения о том, как ты обычно рассуждаешь. Потом двенадцать вымышленных ситуаций: выбери, как ты {поступил|поступила} бы, и сразу посмотри пояснение. Два блока считаются отдельно и не складываются в один балл.',btn:'Начать'},
 sv:{z:'Заставка 12',who:'Старец',zdesc:'Старец у огня, как в начале пути. Рядом тихо светится знак «Я есмь».',title:'Самоценность',text:'Помнишь «Я есмь»? Право быть не нужно заслуживать. Здесь ты посмотришь, где это право уже стало опорой, а где пока хочется получить разрешение снаружи.',btn:'Начать'}};
var LK=[[4,'Точно про меня'],[3,'Скорее да'],[2,'Иногда'],[1,'Скорее нет'],[0,'Совсем не про меня'],['dk','Не знаю']];
var FQ=[[4,'Почти всегда'],[3,'Часто'],[2,'Иногда'],[1,'Редко'],[0,'Никогда или почти никогда'],['nr','Не помню'],['nw','Не было']];
var LVD=['Фоновая опора','Эпизодическое проявление','Заметное влияние','Выраженный автоматизм'],LVC=['Пока неустойчив','Формируется','Уверенно проявляется','Выраженная опора'];
/* Тексты, которых не было в комплекте: написаны по правилам вопросов, перечислены в written_by_bot.md. */
var W={
 few:'Пока ответов недостаточно, чтобы собрать цельную картину. Можно вернуться к оставшимся вопросам и продолжить с того места, где остановился.',
 clearRS:'По твоим ответам ни одна из шести областей не выделилась как выраженная трудность. Ты в целом различаешь свою часть и чужую. Это не значит, что сложных ситуаций не бывает: просто сейчас граница ответственности в основном держится.',
 clearKM:'По твоим ответам ни один фильтр не выделился как выраженный. Осторожность, сомнения и нехватка бывают у всех, но сейчас они не задают общий тон восприятия.',
 prelim:'предварительно',
 ctSit:'Карта ситуаций считается отдельно от 24 утверждений и не складывается с ними. Пропущенная ситуация не считается ошибкой и не идет в три типа карты.',
 piWeak:'Есть небольшой перевес в сторону «%P%», но он не настолько выражен, чтобы считать его устойчивым предпочтением. Смотри на конкретные ситуации.',
 piPole:{'Логика / Этика':['Логика','Этика','Ты чаще сначала опираешься на факты, правила и последовательность аргументов. Отношения и чувства людей ты тоже можешь учитывать, но обычно после того, как понятна структура задачи.','Ты чаще сначала учитываешь людей: их чувства, отношения и то, как решение на них отразится. Логику задачи ты тоже видишь, но обычно через контекст отношений.'],
  'Сенсорика / Интуиция':['Сенсорика','Интуиция','Ты чаще опираешься на конкретное: детали, факты, проверенный опыт и практические условия. Возможности и перспективы тебя тоже интересуют, но обычно после того, как понятно, что есть сейчас.','Ты чаще сначала видишь общую картину, связи и возможные направления. Детали ты тоже можешь учитывать, но интерес обычно вызывает то, к чему все может привести.'],
  'Экстраверсия / Интроверсия':['Экстраверсия','Интроверсия','Ты чаще восстанавливаешься и думаешь в контакте с людьми: обсуждаешь, рассказываешь, включаешься по ходу общения.','Ты чаще восстанавливаешься и думаешь наедине с собой: сначала осмысливаешь, потом делишься выводом.'],
  'Рациональность / Иррациональность':['Рациональность','Иррациональность','Тебе чаще удобнее заранее составить план, порядок и сроки, а потом придерживаться их.','Тебе чаще удобнее держать общий ориентир и уточнять детали по ходу, оставляя место для новых возможностей.']},
 piFew:'По этой оси пока мало ответов с выбором одного из двух способов. Вывод не делается.',
 ldSave:'Сохранение привычного положения может беречь силы, время или деньги, которые сейчас уже заняты другим. Это не каприз и не саботаж. Проверь, какой ресурс ты сохраняешь и можно ли выделить на перемену хотя бы небольшую часть.',
 fsWorse:'Заметнее стала стратегия «%S%».',
 fsStronger:'Сейчас эта стратегия звучит даже сильнее, чем в детстве.',
 fsAbsent:'В детских ответах указано, что такого опыта не было. Сейчас этот способ тоже не выделился как выраженный. Это описание твоих ответов, а не доказательство того, что подобного никогда не случалось.'};
W.ldUnknown='Пока не определено. Ответ «Пока не знаю» тоже честный. Вернись к этому вопросу после одного конкретного эпизода.';

/* ---------- стиль ---------- */
function css(){if(window.GArch&&GArch.css)GArch.css();if(document.getElementById('gt-css'))return;var s=document.createElement('style');s.id='gt-css';s.textContent=
'.gt-ph{margin:12px 0 14px;border:1px solid #b8893f;background:radial-gradient(circle at 50% 20%,rgba(240,200,112,.16),transparent 70%);border-radius:16px;padding:18px 14px;text-align:center}.gt-ph b{display:block;font:800 19px Manrope,sans-serif;color:#a8762f;margin-bottom:4px}.gt-ph small{display:block;margin-top:6px;font-size:15px;line-height:1.4;opacity:.8}.gt-elder{display:block;width:min(100%,240px);height:190px;object-fit:contain;object-position:center;margin:0 auto 12px;filter:drop-shadow(0 0 18px rgba(235,194,119,.35));border-radius:12px}'+
'.gt-row{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 12px}.gt-row button{flex:1 1 30%;min-height:44px;padding:8px;border:1px solid #9e783a;border-radius:10px;background:transparent;color:inherit;font:600 16px Manrope,sans-serif}.gt-row button.ar-on{border-color:#6a3a12}'+
'.gt-ex{margin:12px 0;padding:12px;border-left:3px solid #c99a45;line-height:1.5}.gt-ok{font-weight:700}.gt-lv{font-size:15px;opacity:.75;text-transform:uppercase;letter-spacing:.05em;margin:12px 0 2px}'+
'.gt-links{margin-top:12px;display:flex;gap:18px;flex-wrap:wrap}.gt-links a,.gt-links button{background:none;border:0;padding:0;color:#a8762f;font:500 15px Manrope,sans-serif;text-decoration:underline;cursor:pointer;min-height:0;width:auto}'+
'.gt-cards{display:grid;grid-template-columns:1fr;gap:8px}.gt-sum li{margin:6px 0}';document.head.appendChild(s)}

/* ---------- раннер ---------- */
function Runner(box,items,done,mod){
 this.box=box;this.items=items;this.done=done;this.mod=mod;this.i=0;this.hist=[];this.ans={};
 var P=(!preview&&!retakeMode)?load():{},draft=P.testDrafts&&P.testDrafts[mod];
 if(draft&&draft.v===1){this.i=Math.max(0,Math.min(items.length,+draft.i||0));this.hist=Array.isArray(draft.hist)?draft.hist.slice():[];this.ans=draft.answers&&typeof draft.answers==='object'?Object.assign({},draft.answers):{}}
 var self=this;
 window.gBack=function(){if(self.hist.length){self.i=self.hist.pop();self.saveDraft();self.draw();scrollTo(0,0);return true}return false}
}
Runner.prototype.saveDraft=function(){if(preview||retakeMode||!this.mod)return;var P=load();P.testDrafts=P.testDrafts||{};P.testDrafts[this.mod]={v:1,i:this.i,hist:this.hist.slice(),answers:Object.assign({},this.ans),at:Date.now()};persist(P)};
Runner.prototype.next=function(){this.hist.push(this.i);this.i++;this.saveDraft();this.draw();scrollTo(0,0)};
Runner.prototype.raw=function(id,v){if(preview||!window.GProfile||!this.mod)return;try{GProfile.recordRaw(this.mod,id,v,{v:VER})}catch(e){}};
Runner.prototype.set=function(id,v){if(v===undefined)delete this.ans[id];else this.ans[id]=v;this.raw(id,v===undefined?null:v);this.saveDraft()};
Runner.prototype.draw=function(){var it=this.items[this.i],self=this,b=this.box;if(!it){this.done(this.ans);return}
 var qs=this.items.filter(function(x){return x.q}),ix=qs.indexOf(it);
 var head=(ix>=0?'<div class="al">Вопрос '+(ix+1)+' из '+qs.length+'</div>':'')+(it.h?'<div class="al" style="opacity:.8">'+h(it.h)+'</div>':'')+(it.t?'<div class="aq">'+h(it.t)+'</div>':'')+(it.ctx?'<p class="ar-ctx">'+h(it.ctx)+'</p>':'');
 var skip='<button class="ar-skip" id="gtSk">Пропустить</button>';
 function bindSkip(){var s=b.querySelector('#gtSk');if(s)s.onclick=function(){self.set(it.id,'skip');self.next()}}
 if(it.kind==='intro'){var I=it.I,isKM=I===INTRO.km;b.innerHTML='<div class="gt-ph">'+(isKM?'<img class="gt-elder" src="img/elder.jpg?v=3" alt="Старец"><b>Старец</b>':'<b>'+esc(I.who)+'</b>')+'<small>'+esc(I.zdesc)+'</small></div><div class="aq">'+h(I.title)+'</div><p>'+h(I.text)+'</p>'+(I.hint?'<p class="ar-ctx">'+h(I.hint)+'</p>':'')+'<button class="next" id="gtGo">'+esc(I.btn)+'</button>';b.querySelector('#gtGo').onclick=function(){self.next()};return}
 if(it.kind==='screen'){b.innerHTML=it.html()+'<button class="next" id="gtGo">'+esc(it.btn||'Дальше')+'</button>';b.querySelector('#gtGo').onclick=function(){self.next()};return}
 if(it.kind==='one'){b.innerHTML=head+'<div id="gtOp">'+it.o.map(function(o){return '<button class="ao'+(String(self.ans[it.id])===String(o[0])?' ar-on':'')+'" data-c="'+esc(o[0])+'">'+h(o[1])+'</button>'}).join('')+'</div><div id="gtEx"></div>'+(it.noskip?'':skip);bindSkip();
  b.querySelectorAll('#gtOp button').forEach(function(x){x.onclick=function(){var c=x.dataset.c,o=it.o.filter(function(z){return String(z[0])===c})[0];var v=typeof o[0]==='number'?o[0]:c;
   if(it.feedback){if(self.ans[it.id]==null||self.ans[it.id]==='skip'){self.set(it.id,v)}b.querySelectorAll('#gtOp button').forEach(function(z){z.disabled=true;z.classList.toggle('ar-on',z===x)});var sk=b.querySelector('#gtSk');if(sk)sk.remove();
    b.querySelector('#gtEx').innerHTML=it.feedback(c)+'<button class="next" id="gtOk">Дальше</button>';b.querySelector('#gtOk').onclick=function(){self.next()};return}
   if(it.textOn&&it.textOn.indexOf(c)>=0){b.querySelectorAll('#gtOp button').forEach(function(z){z.classList.toggle('ar-on',z===x)});self.set(it.id,v);b.querySelector('#gtEx').innerHTML='<textarea class="ar-ta" id="gtTx" rows="2" maxlength="200" placeholder="Коротко, своими словами"></textarea><button class="next" id="gtOk">Дальше</button>';var ta=b.querySelector('#gtTx');ta.value=self.ans[it.id+'_text']||'';ta.oninput=function(){self.set(it.id+'_text',ta.value)};b.querySelector('#gtOk').onclick=function(){var t=ta.value.trim();self.set(it.id+'_text',t||undefined);self.next()};return}
   self.set(it.id,v);try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}self.next()}});return}
 if(it.kind==='multi'){var sel=Array.isArray(this.ans[it.id])?this.ans[it.id].slice():[];var excl=it.excl||[];
  b.innerHTML=head+(it.max?'<p class="ar-ctx">Можно выбрать до '+it.max+'.</p>':'<p class="ar-ctx">Можно выбрать несколько.</p>')+'<div id="gtOp">'+it.o.map(function(o){return '<button class="ao" data-c="'+esc(o)+'">'+h(o)+'</button>'}).join('')+'</div>'+(it.other?'<textarea class="ar-ta" id="gtTx" rows="2" maxlength="200" placeholder="Если «Другое», напиши коротко" style="display:none"></textarea>':'')+'<button class="next" id="gtGo">Готово</button>'+skip;bindSkip();
  var tx=b.querySelector('#gtTx');if(tx)tx.value=this.ans[it.id+'_text']||'';
  function mark(){b.querySelectorAll('#gtOp button').forEach(function(x){x.classList.toggle('ar-on',sel.indexOf(x.dataset.c)>=0)});if(tx)tx.style.display=sel.indexOf(it.other)>=0?'':'none';b.querySelector('#gtGo').disabled=!sel.length;self.set(it.id,sel.slice())}
  if(tx)tx.oninput=function(){self.set(it.id+'_text',tx.value)};
  b.querySelectorAll('#gtOp button').forEach(function(x){x.onclick=function(){var c=x.dataset.c,n=sel.indexOf(c);if(n>=0)sel.splice(n,1);else if(excl.indexOf(c)>=0)sel=[c];else{sel=sel.filter(function(z){return excl.indexOf(z)<0});if(!it.max||sel.length<it.max)sel.push(c)}mark()}});mark();
  b.querySelector('#gtGo').onclick=function(){if(!sel.length)return;self.set(it.id,sel.slice());if(tx){var t=tx.value.trim();self.set(it.id+'_text',sel.indexOf(it.other)>=0&&t?t:undefined)}self.next()};return}
 if(it.kind==='text'){b.innerHTML=head+'<textarea class="ar-ta" id="gtTx" rows="3" maxlength="300"></textarea><button class="next" id="gtGo">Дальше</button>'+(it.dk?'<button class="ar-skip" id="gtDk">Пока не знаю</button>':skip);var t=b.querySelector('#gtTx');t.value=typeof this.ans[it.id]==='string'&&this.ans[it.id]!=='dk'&&this.ans[it.id]!=='skip'?this.ans[it.id]:'';t.oninput=function(){self.set(it.id,t.value)};
  b.querySelector('#gtGo').onclick=function(){var v=t.value.trim();self.set(it.id,v||'skip');self.next()};var dk=b.querySelector('#gtDk');if(dk)dk.onclick=function(){self.set(it.id,'dk');self.next()};bindSkip();return}
 if(it.kind==='grid'){var rows=it.rows(this.ans);if(!rows.length){this.i++;this.draw();return}var val=Object.assign({},this.ans[it.id]||{});
  b.innerHTML=head+rows.map(function(r,k){return '<div class="gt-lv">'+h(r)+'</div><div class="gt-row" data-k="'+k+'">'+it.o.map(function(o){return '<button data-c="'+o[0]+'">'+h(o[1])+'</button>'}).join('')+'</div>'}).join('')+'<button class="next" id="gtGo">Дальше</button>'+skip;bindSkip();
  function mk(){b.querySelectorAll('.gt-row').forEach(function(rw){var r=rows[+rw.dataset.k];rw.querySelectorAll('button').forEach(function(x){x.classList.toggle('ar-on',val[r]===x.dataset.c)})})}
  b.querySelectorAll('.gt-row button').forEach(function(x){x.onclick=function(){val[rows[+x.parentNode.dataset.k]]=x.dataset.c;self.set(it.id,Object.assign({},val));mk()}});mk();b.querySelector('#gtGo').onclick=function(){self.set(it.id,val);self.next()};return}
};

/* ---------- подсчет шкал 0–4 ---------- */
function num(v){return typeof v==='number'?v:null}
function scoreScales(sc,ans,unknownAsZero){return sc.map(function(s){var vals=[];s.items.forEach(function(it){var raw=ans[it.id],a=num(raw);if(a!=null)vals.push(it.rev?4-a:a);else if(unknownAsZero&&raw==='dk')vals.push(0)});var n=vals.length,sum=vals.reduce(function(a,b){return a+b},0);
 var score=n===4?sum:n===3?Math.round(sum/3*4*10)/10:null;return {id:s.id,name:s.name,answered:n,possible:4,score:score,status:n===4?'full':n===3?'preliminary':'insufficient',level:score==null?null:score<4?0:score<8?1:score<12?2:3}})}
function answered(sc,ans,unknownAsZero){var n=0;sc.forEach(function(s){s.items.forEach(function(it){if(num(ans[it.id])!=null||(unknownAsZero&&ans[it.id]==='dk'))n++})});return n}
function lvText(sc,r){var s=sc.filter(function(x){return x.id===r.id})[0];return r.level==null?'':g(s.lv[r.level])}
function lvName(r,labels){return r.level==null?'Недостаточно данных':labels[r.level]+(r.status==='preliminary'?', '+W.prelim:'')}
function detailsScales(sc,res,labels,title){return '<details class="ar-det"><summary>'+esc(title||'Подробнее по всем шкалам')+'</summary>'+res.map(function(r){return '<div class="gt-lv">'+esc(r.name)+' · '+esc(lvName(r,labels))+'</div>'+(r.level==null?'<p>'+esc(W.few)+'</p>':'<p>'+esc(lvText(sc,r))+'</p>')}).join('')+'</details>'}
function leaders(res,within){var v=res.filter(function(r){return r.score!=null});if(!v.length)return [];var mx=Math.max.apply(null,v.map(function(r){return r.score}));return v.filter(function(r){return mx-r.score<=within+1e-9})}
function statusOf(res){var v=res.filter(function(r){return r.score!=null});if(!v.length)return 'unclear';return v.every(function(r){return r.status==='full'})?'supported':'tentative'}
function likertItems(sc,shuffle){var L=[];sc.forEach(function(s){s.items.forEach(function(it){L.push({kind:'one',q:1,id:it.id,t:it.t,o:LK})})});if(shuffle){var seed=7;L.sort(function(a,b){return (hash(a.id)%97)-(hash(b.id)%97)})}return L}
function hash(s){var x=0;for(var i=0;i<s.length;i++)x=(x*31+s.charCodeAt(i))>>>0;return x}
var CTS={critical:'Проверяющая стратегия',reactive:'Быстрая реакция',avoidant:'Уход от анализа'};
function ctType(s,c){var o=(s.o||[]).filter(function(x){return String(x[0])===String(c)})[0];return o&&o[2]||(s.types&&s.types[c])||null}
function ctOptText(s,c){var o=(s.o||[]).filter(function(x){return String(x[0])===String(c)})[0];return o?o[1]:''}
function ctProfile(cnt){var c=cnt.critical||0,r=cnt.reactive||0,a=cnt.avoidant||0;
 if(c+r+a!==12)return {title:'Недостаточно ответов',text:'Для составления карты необходимо ответить на все 12 ситуаций.'};
 var mx=Math.max(c,r,a),leaders=[];if(c===mx)leaders.push('critical');if(r===mx)leaders.push('reactive');if(a===mx)leaders.push('avoidant');
 if(leaders.length>1)return {title:'Смешанный способ принятия решений',text:'В разных обстоятельствах ты используешь разные стратегии: иногда проверяешь основания, иногда реагируешь быстро, а иногда предпочитаешь выйти из ситуации. Это не противоречие и не недостаток. Твой способ обращения с информацией зависит от темы, эмоциональной значимости, времени и доступных данных. Посмотри на отдельные ситуации: именно они покажут, в каких обстоятельствах включается каждая стратегия.'};
 if(leaders[0]==='critical')return {title:'Преобладает исследующая стратегия',text:'В большинстве предложенных ситуаций ты {выбирал|выбирала} проверку оснований, сопоставление данных и уточнение причин. Это указывает на готовность не ограничиваться первым впечатлением и учитывать альтернативные объяснения. Важно сохранять гибкость: проверяющая стратегия не означает, что любое найденное доказательство автоматически верно или что решение всегда нужно откладывать до полной определенности.'};
 if(leaders[0]==='reactive')return {title:'Чаще включается быстрая реакция',text:'В предложенных ситуациях ты чаще {выбирал|выбирала} немедленный вывод или действие до полной проверки информации. Это может быть связано с эмоциональной значимостью темы, привычкой быстро принимать решения или доверием к первому убедительному объяснению. Такая стратегия не обязательно проявляется во всех сферах жизни. Полезно замечать моменты, когда уверенность, яркий пример или сильная эмоция начинают заменять проверку оснований.'};
 return {title:'Чаще включается выход из анализа',text:'В предложенных ситуациях ты чаще {выбирал|выбирала} прекратить обсуждение, отказаться от проверки или не делать вывод. Иногда пауза и дистанция действительно помогают: не каждую информацию необходимо изучать немедленно. Важно различать временную паузу и окончательный отказ разбираться. Посмотри, в каких ситуациях ты {выходил|выходила} из анализа из-за нехватки данных, а в каких — из-за дискомфорта, неопределенности или нежелания продолжать спор.'}}
function ctLegacy(ans){return Object.keys(ans).some(function(k){return /^CTSC\d/.test(k)})&&!Object.keys(ans).some(function(k){return /^sit_ct_/.test(k)})}


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
BUILD.km=function(ans){var sc=T.km.scales,res=scoreScales(sc,ans,true),n=answered(sc,ans,true),out={v:VER,answers:ans,scales:res,answeredCount:n,possibleCount:24,at:Date.now(),framework:'ideal_distorted_world',interpretationNote:'Исследуются текущие фильтры восприятия. Их происхождение проверяется сопоставлением с блоком «Первые настройки»; этот тест сам по себе не доказывает детскую причину.'},main;
 if(n<18){out.status='insufficient';main=P_(esc(W.few))}else{var L=leaders(res,1),mx=L.length?L[0].score:0;out.status=statusOf(res);
  if(!L.length||Math.max.apply(null,L.map(function(r){return r.score}))<4){out.leadingScales=[];main='<div class="aq">Фильтры не выделились</div>'+P_(esc(W.clearKM))}
  else{L=L.filter(function(r){return r.score>=4});L.sort(function(a,b){return b.score-a.score});out.leadingScales=L.map(function(r){return r.id});out.status=L.length>1?'mixed':out.status;
   if(L.length===1)main='<div class="al">Похоже, что ты чаще ориентируешься на</div><div class="aq">'+esc(L[0].name)+'</div><div class="gt-lv">'+esc(lvName(L[0],LVD))+'</div>'+P_(esc(lvText(sc,L[0])));
   else if(L.length===2)main='<div class="al">Похоже, что ты чаще ориентируешься на два фильтра</div>'+P_(esc(g(T.km.two).replace('{шкала_1}','«'+L[0].name+'»').replace('{шкала_2}','«'+L[1].name+'»')))+L.map(function(r){return '<div class="gt-lv">'+esc(r.name)+' · '+esc(lvName(r,LVD))+'</div>'}).join('');
   else main='<div class="al">Похоже, что в разных ситуациях ты опираешься на несколько фильтров</div>'+P_(esc(g(T.km.many)))+'<ul class="gt-sum">'+L.map(function(r){return '<li>'+esc(r.name)+' · '+esc(lvName(r,LVD))+'</li>'}).join('')+'</ul>'}}
 out.top=out.status==='insufficient'?'Недостаточно данных':(out.leadingScales||[]).length?res.filter(function(r){return out.leadingScales.indexOf(r.id)>=0}).map(function(r){return r.name}).join(', '):'Выраженных фильтров нет';
 return {res:out,html:'<span class="tag">Точка 0</span><span class="tag">Идеальный Кривой Мир</span><div class="al">Привычные фильтры восприятия</div>'+P_(esc('Когда-то эти способы воспринимать происходящее могли помогать приспособиться к своей среде. Со временем они могли стать автоматическими правилами. Мы исследуем не то, каким мир является на самом деле, а через какие внутренние фильтры ты чаще смотришь на него сейчас.'))+main+detailsScales(sc,res,LVD),log:'Идеальный Кривой Мир: '+out.top}};
BUILD.ct=function(ans){var sc=T.ct.scales,res=scoreScales(sc,ans),n=answered(sc,ans),out={v:VER,answers:ans,scales:res,answeredCount:n,possibleCount:24,at:Date.now()},main;
 var legacy=ctLegacy(ans),S=T.ct.sit,cnt={critical:0,reactive:0,avoidant:0};
 var st=S.map(function(s){var a=ans[s.id],ok=a&&a!=='skip',typ=ok?ctType(s,a):null;if(typ&&cnt[typ]!=null)cnt[typ]++;return {id:s.id,answer:ok?a:null,type:typ,text:ok?ctOptText(s,a):null,explanation:ok?g(s.ex&&s.ex[a]||''):null}});
 var ansd=st.filter(function(x){return x.answer}).length;
 var prof=legacy?{title:'Прежняя редакция',text:'Карта решений в 12 ситуациях была собрана в прежней редакции. Чтобы увидеть новую карту способов принятия решений, можно пройти этот шаг заново.'}:ctProfile(cnt);
 if(!legacy){prof={title:g(prof.title),text:g(prof.text)};}
 out.situations={items:st,answered:ansd,possible:12,score:legacy?null:cnt,profile:prof,total:12,complete:!legacy&&ansd===12};
 if(n<18){out.status='insufficient';main=P_(esc(W.few))}else{out.status=statusOf(res);var v=res.filter(function(r){return r.score!=null}),mx=Math.max.apply(null,v.map(function(r){return r.score})),mn=Math.min.apply(null,v.map(function(r){return r.score}));
  var top=v.filter(function(r){return r.score===mx}),low=v.filter(function(r){return r.score===mn});out.leadingScales=top.map(function(r){return r.id});out.growthScales=mx===mn?[]:low.map(function(r){return r.id});
  main='<div class="al">Часть I. Шесть измерений критического мышления</div><div class="al" style="opacity:.8">Твоя опора в рассуждении</div>'+top.slice(0,2).map(function(r){return '<div class="aq">'+esc(r.name)+'</div><div class="gt-lv">'+esc(lvName(r,LVC))+'</div>'+P_(esc(lvText(sc,r)))}).join('')+(mx!==mn?'<div class="al" style="margin-top:14px">Что можно потренировать</div>'+low.slice(0,1).map(function(r){return '<div class="aq">'+esc(r.name)+'</div><div class="gt-lv">'+esc(lvName(r,LVC))+'</div>'+P_(esc(lvText(sc,r)))}).join(''):'')}
 var sit='<div class="al" style="margin-top:14px">Часть II. Карта решений в 12 ситуациях</div>';
 if(legacy){sit+=P_(esc(prof.text))}
 else{sit+='<div class="gt-lv">'+esc(CTS.critical)+' · '+cnt.critical+'</div><div class="gt-lv">'+esc(CTS.reactive)+' · '+cnt.reactive+'</div><div class="gt-lv">'+esc(CTS.avoidant)+' · '+cnt.avoidant+'</div>';
  sit+='<div class="aq">'+h(prof.title)+'</div>'+P_(h(prof.text));
  sit+='<details class="ar-det"><summary>Как ты '+g('{ответил|ответила}')+' в ситуациях</summary><p>'+esc(W.ctSit)+'</p>'+st.map(function(x,i){var s=S[i];return '<div class="gt-lv">'+esc(s.h)+'</div><p>'+(x.answer?esc(CTS[x.type]||x.type)+'. '+esc(x.answer)+'. '+h(x.explanation||''):'Пропущено. Пропуск не считается ошибкой и не идет в карту.')+'</p>'}).join('')+'</details>'}
 sit+=P_(esc('Эти две части дополняют друг друга и не складываются в один балл. Представление о своих навыках и выбор в конкретной ситуации могут различаться — это наблюдение, а не противоречие.'));
 out.top=out.status==='insufficient'?'Недостаточно данных':'Опора: '+res.filter(function(r){return (out.leadingScales||[]).indexOf(r.id)>=0}).map(function(r){return r.name}).join(', ')+(legacy?'':(prof&&prof.title?', карта: '+prof.title:''));
 return {res:out,html:'<span class="tag">Точка Б</span><span class="tag">Критическое мышление</span>'+main+sit+detailsScales(sc,res,LVC,'Подробнее по всем шести измерениям'),log:'Критическое мышление: '+out.top}};
function fsCrossHtml(ctx){ctx=ctx||{};var h='<section class="ar-compare"><h3>Сопоставление с предыдущими наблюдениями</h3><p>Эти результаты получены в других заданиях. Они не меняют ответы «Первых настроек» и не доказывают причину детских реакций.</p>',any=false;
 var e=ctx.echo;
 if(e&&!e.status&&e.answers&&window.GArch&&GArch.scoreB){
  var calc=GArch.scoreB(e.answers),dict=window.GARCH&&GARCH.resB||{},names=calc.leaders.map(function(c){return dict[c]?dict[c].name:c});
  e={status:calc.status,lead:calc.status==='leading'?calc.leaders[0]:null,top:calc.status==='leading'||calc.status==='mixed'?names.join(' · '):null,leaders:calc.leaders};
 }
 if(e){
  if(e.status==='leading'&&e.lead&&e.top){h+='<p><b>Эхо — чаще повторявшийся ход:</b> '+esc(e.top)+'. Это описание ответов на жизненные ситуации, а не характеристика личности.</p>';any=true}
  else if(e.status==='mixed'&&e.top){h+='<p><b>Эхо — сопоставимые ходы:</b> '+esc(e.top)+'. По ответам не выделяется один общий способ реакции.</p>';any=true}
  else if(e.status==='weak'||e.status==='insufficient'){h+='<p><b>Эхо:</b> устойчивый ведущий ход пока не выделен. Это тоже результат; не нужно назначать его искусственно.</p>';any=true}
  else if(e.top){h+='<p><b>Эхо:</b> '+esc(e.top)+'. Результат приведен рядом, а не используется как объяснение детства.</p>';any=true}
 }
 var w=ctx.wheel,marked=[];
 if(w&&Array.isArray(w.sectors)){w.sectors.forEach(function(sec){(sec.forms||[]).forEach(function(f){if((f.answered||0)<2)return;var a=f.shadow&&f.shadow.score,b=f.support&&f.support.score;if(typeof a==='number'&&a>=50)marked.push(f.shadow.title+' — '+Math.round(a)+'%');if(typeof b==='number'&&b>=50)marked.push(f.support.title+' — '+Math.round(b)+'%')})})}
 if(marked.length){h+='<p><b>Колесо самопредательства:</b> '+marked.map(esc).join('; ')+'.</p>';any=true}
 else if(w){h+='<p>В Колесе нет ветвей с отметкой от 50% при двух отвеченных ситуациях. Это не означает отсутствия таких способов.</p>';any=true}
 if(!any)h+='<p>Колесо и «Эхо» пока не пройдены или их результаты недоступны. «Первые настройки» можно читать самостоятельно.</p>';
 h+='<p>Не нужно искать совпадение любой ценой. Важнее посмотреть, что сохранилось, что изменилось и какие ответы требуют собственного примера.</p></section>';return h}
BUILD.fs=function(ans){var F=T.fs,names=Object.keys(F.str),P0=load(),out={v:VER,answers:ans,context:{wheel:P0.betray&&P0.betray.start?JSON.parse(JSON.stringify(P0.betray.start)):null,echo:P0.archB?{v:P0.archB.v,status:P0.archB.status,top:P0.archB.top,lead:P0.archB.lead,leaders:P0.archB.leaders,answers:P0.archB.answers}:null},at:Date.now()};
 function per(list){var o={};names.forEach(function(n){var a=list.filter(function(q){return q.s===n}).map(function(q){return ans[q.id]}),v=a.filter(function(x){return typeof x==='number'});o[n]={answered:v.length,mean:v.length?v.reduce(function(x,y){return x+y},0)/v.length:null,notRemember:a.filter(function(x){return x==='nr'}).length,notWas:a.filter(function(x){return x==='nw'}).length,allNotWas:a.length===3&&a.every(function(x){return x==='nw'})}});return o}
 var C=per(F.child),N=per(F.now),R={};
 names.forEach(function(n){var c=C[n],x=N[n],r;if(x.answered<2)r='few';
  else if(c.allNotWas)r=x.mean>=2?'later':'notwas';
  else if(c.answered<2)r='few';
  else if(c.mean>=2&&x.mean>=2&&(Math.abs(x.mean-c.mean)<1||x.mean>c.mean))r='kept';
  else if(c.mean>=2&&c.mean-x.mean>=1){var other=names.filter(function(m){return m!==n&&C[m].answered>=2&&N[m].answered>=2&&N[m].mean>=2&&N[m].mean-C[m].mean>=1&&N[m].mean>x.mean}).sort(function(a,b){return (N[b].mean-C[b].mean)-(N[a].mean-C[a].mean)})[0];r=other?'changed':'weaker';if(other)R[n+'_to']=other}
  else if(c.mean<1&&x.mean>=2)r='later';else r='none';R[n]=r});
 out.child=C;out.now=N;out.outcome=R;
 var RT={kept:'Стратегия сохранилась.',weaker:'Стратегия ослабла.',changed:'Стратегия изменилась.',later:'Стратегия появилась позже.',none:'Совпадение не выявлено.'};
 var valid=names.filter(function(n){return N[n].answered>=2}),mx=valid.length?Math.max.apply(null,valid.map(function(n){return N[n].mean})):null,lead=valid.filter(function(n){return N[n].mean===mx&&mx>=2});out.leading=lead;
 out.status=!valid.length?'insufficient':lead.length>1?'mixed':lead.length?'supported':'unclear';
 function outTxt(n){var r=R[n];if(r==='notwas')return W.fsAbsent;if(r==='few')return g(F.sp['Недостаточно данных.']);var t=g(F.res[RT[r]]);if(r==='changed')t+=' '+W.fsWorse.replace('%S%',R[n+'_to']);if(r==='kept'&&N[n].mean-C[n].mean>=1)t+=' '+W.fsStronger;return t}
 function label(n){var r=R[n];return r==='notwas'?'Не было в детстве и сейчас не выделилось':r==='few'?'Недостаточно данных':RT[r].replace('.','')}
 var main=(lead.length?'<div class="al">Сейчас заметнее всего</div>'+lead.map(function(n){var S=F.str[n];return '<div class="aq">'+esc(n)+'</div><div class="gt-lv">'+esc(label(n))+'</div>'+P_(esc(g(S.now)))+P_(esc(outTxt(n)))}).join(''):P_(esc(valid.length?g(F.res['Совпадение не выявлено.']):g(F.sp['Недостаточно данных.']))));
 var nr=names.some(function(n){return C[n].notRemember||N[n].notRemember});
 var det='<details class="ar-det"><summary>Все четыре стратегии</summary><p class="ar-ctx">'+esc(g(F.intro))+'</p>'+names.map(function(n){var S=F.str[n],x=R[n]==='kept'?S.kept:(R[n]==='weaker'||R[n]==='changed')?S.changed:'';return '<div class="gt-lv">'+esc(n)+' · '+esc(label(n))+'</div><p><b>Детство:</b> '+esc(g(S.child))+'</p><p><b>Сейчас:</b> '+esc(g(S.now))+'</p><p>'+esc(outTxt(n))+'</p>'+(x?'<p>'+esc(g(x))+'</p>':'')}).join('')+(nr?'<div class="gt-lv">Не помню</div><p>'+esc(g(F.sp['Не помню.']))+'</p>':'')+'</details>';
 out.top=lead.length?lead.join(', '):'Ведущая стратегия не выделилась';
 return {res:out,html:'<span class="tag">Точка 0</span><span class="tag">Первые настройки</span>'+main+det+fsCrossHtml(out.context),log:'Первые настройки: сейчас заметнее '+out.top}};
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
BUILD.lab_d=function(ans){if(window.GLabD&&GLabD.build)return GLabD.build(ans);var out={v:VER,answers:ans,at:Date.now()},R=(T.ld.legacy||T.ld).res;
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
 var gh=arr(ans.LD11).indexOf('Пока не знаю')>=0&&!gain.length?'<p>'+esc(W.ldUnknown)+'</p>':gain.map(function(x){var k=GM[x];return '<div class="gt-lv">'+esc(k?k.replace('.',''):'Сохранение ресурсов')+'</div>'+P_(esc(k?g((T.ld.legacy||T.ld).gain[k]):W.ldSave))}).join('');
 var prac=arr(ans.LD12).filter(function(x){return /не хватает (времени|денег|навыка|поддержки)/i.test(x)});
 var price=arr(ans.LD13),pr=ans.LD14||{},PL={real:'реально неизбежно',maybe:'пока предполагаю',dk:'не знаю'};
 out.desire=txt(ans.LD07)||(conc06?ld06:null)||txt(ans.LD01);out.step=txt(ans.LD15);out.gains=gain;out.risks=risk;out.obstacles=arr(ans.LD12);out.price=price.map(function(p){return {item:p,status:pr[p]||null}});
 var main='<div class="al">Что видно сейчас</div><div class="aq">'+esc(r.replace('.',''))+'</div>'+P_(esc(g(R[r])))+(out.step?'<p class="ar-pt">Твой маленький шаг: '+esc(out.step)+'</p>':'');
 var det=
  (gh?'<details class="ar-det"><summary>Что дает привычное положение</summary>'+gh+'</details>':'')+
  (prac.length?'<details class="ar-det"><summary>Препятствия</summary><p>'+esc(prac.join(', '))+'</p>'+P_(esc(g((T.ld.legacy||T.ld).gain['Реальное ограничение ресурса.'])))+'</details>':'')+
  (price.length?'<details class="ar-det"><summary>Цена перемен</summary>'+P_(esc(g((T.ld.legacy||T.ld).price)))+'<ul class="gt-sum">'+price.map(function(p){return '<li>'+esc(p)+(pr[p]?': '+esc(PL[pr[p]]):'')+'</li>'}).join('')+'</ul></details>':'');
 out.top=r.replace('.','')+(out.desire?': '+out.desire:'');
 return {res:out,html:'<span class="tag">Точка Б</span><span class="tag">Лабиринт желаний</span>'+main+det,log:'Лабиринт желаний: '+out.top}};

/* ---------- списки вопросов ---------- */
var ITEMS={};
ITEMS.sv=function(){return [{kind:'intro',I:INTRO.sv}].concat(likertItems(T.sv.scales))};
ITEMS.rs=function(){var L=likertItems(T.rs.scales);T.rs.rx.forEach(function(x){L.push({kind:'one',q:1,id:x.id,t:x.t,o:LK})});return [{kind:'intro',I:INTRO.rs}].concat(L)};
ITEMS.km=function(){return [{kind:'intro',I:INTRO.km}].concat(likertItems(T.km.scales))};
ITEMS.ct=function(){var L=[{kind:'intro',I:INTRO.ct}].concat(likertItems(T.ct.scales));L.push({kind:'screen',btn:'К ситуациям',html:function(){return '<div class="aq">Двенадцать учебных ситуаций</div><p>Все имена, числа и обстоятельства вымышлены. Выбери, как ты '+g('{поступил|поступила}')+' бы в этой ситуации. После выбора появится пояснение: его можно спокойно прочитать, прежде чем идти дальше. Это не экзамен и не оценка личности.</p>'}});
 T.ct.sit.forEach(function(s){L.push({kind:'one',q:1,id:s.id,h:s.h,t:s.t,o:s.o.map(function(o){return [o[0],o[0]+'. '+o[1]]}),feedback:function(c){var typ=ctType(s,c);return '<div class="gt-ex"><p class="gt-ok">'+esc(CTS[typ]||'')+'</p><p>'+h(s.ex[c]||'')+'</p></div>'}})});return L};
ITEMS.fs=function(){var L=[{kind:'intro',I:INTRO.fs},{kind:'screen',btn:'Начать',html:function(){return '<div class="aq">Детство</div><p>Вспоминай обычные ситуации, примерно до двенадцати лет. Если не помнишь — выбирай «Не помню», если такого не происходило — «Не было».</p>'}}];
 T.fs.child.forEach(function(x){L.push({kind:'one',q:1,id:x.id,h:'Детство',t:x.t,o:FQ})});L.push({kind:'screen',btn:'Дальше',html:function(){return '<div class="aq">Сейчас</div><p>Теперь о том, как ты реагируешь в последние месяцы. Не пытайся подгонять ответы под детские воспоминания.</p>'}});
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
function reactorIn(P){var r={v:VER,at:Date.now(),tests:{}};Object.keys(STEP).forEach(function(k){var x=P[STEP[k].f];if(!x||k==='vsort'||k==='im')return;r.tests[k]={status:x.status||'tentative',top:x.top||null,leadingScales:x.leadingScales||x.leading||[]}});if(P.valuesCore)r.values3=P.valuesCore.top3;if(P.desireLab&&P.desireLab.step)r.desireStep=P.desireLab.step;return r}
function store(k,res,log){if(preview)return;var P=load(),S=STEP[k];if(P.testDrafts)delete P.testDrafts[S.mod];if(k==='vsort')delete P.valuesCoreDraft;if(window.GProfile){try{P=GProfile.saveResult(S.mod,res,{version:VER},{profile:P,save:false})}catch(e){P[S.f]=res}}else P[S.f]=res;
 P[S.f]=res;P.reactorIn=reactorIn(P);(P.log=P.log||[]).push({t:Date.now(),x:log});persist(P)}
function quoteKey(k){return STEP[k].u}
function result(box,k,built,retake){var S=STEP[k],n=nextOf(S.u);box.innerHTML=built.html+(preview?'<p class="ar-ctx">Просмотр: ответы не сохраняются в твой путь.</p>':'')+'<button class="next" id="nx">'+(retakeMode?'Дальше: Задания':n?'Дальше: '+esc(n.t):'Дальше')+'</button><div class="gt-links">'+(retake?'<button type="button" id="gtRe">Пройти заново</button>':'')+'<a href="diary.html">В дневник</a></div>';
 if(window.GQuote)GQuote.add(box,quoteKey(k),box.querySelector('#nx'));
 if(window.GResultCard){
  var _d=built.diary||{};
  GResultCard.attachDiaryBar(box,{
   id:_d.id||('test_'+k),step:_d.step||S.u,title:_d.title||S.name||k,
   passed:_d.passed||'',lead:_d.lead||'',strong:_d.strong||'',
   strongMore:_d.strongMore||'',insight:_d.insight||'',
   insightMore:_d.insightMore||built.html||'',
   insightLabel:_d.insightLabel||'Расшифровка результата',
   answers:_d.answers||(built.res&&built.res.answers)||[],at:_d.at||(built.res&&built.res.at),preview:preview,before:box.querySelector('#nx')
  });
 }
try{built.bind(box)}catch(e){}
 if(window.GSupport)GSupport.after(box,'test',box.querySelector('#nx'));
 var nx=box.querySelector('#nx');window.nx=nx;nx.onclick=function(){if(preview){location.href=n&&STEP[Object.keys(STEP).filter(function(x){return STEP[x].u===n.u})[0]]?n.u+'&preview=1':'tasks.html';return}if(window.GReview||retakeMode){location.href='tasks.html'+(retakeMode?'#skipped':'');return}location.href=GRoute.advance()};
 var re=box.querySelector('#gtRe');if(re)re.onclick=function(){retake()};scrollTo(0,0)}
function mountTest(k,box){css();var P=load(),S=STEP[k],have=P[S.f];
 function run(){new Runner(box,ITEMS[k](),function(ans){var b=BUILD[k](ans);store(k,b.res,b.log);result(box,k,b,run)},S.mod).draw()}
 if(have&&have.v&&have.answers&&!preview){result(box,k,BUILD[k](have.answers),run);return}
 run()}

/* ---------- три ориентира: важно / отложить / вычеркнуть, затем ровно три ---------- */
var VALS=['Свобода','Безопасность','Любовь','Семья','Здоровье','Деньги','Признание','Творчество','Развитие','Дружба','Красота','Спокойствие','Честность','Помощь людям','Приключения','Духовность','Власть и влияние','Стабильность','Удовольствие','Смысл'];
function mountValues(box){
 css();var P=load(),have=P.valuesCore,V=(P.values&&P.values.order&&P.values.order.length)?P.values.order:[],list=V.concat(VALS.filter(function(x){return V.indexOf(x)<0}));
 var draft=P.valuesCoreDraft&&P.valuesCoreDraft.v===1?P.valuesCoreDraft:null,sort=draft&&draft.sort?Object.assign({},draft.sort):{},i=draft?Math.max(0,Math.min(list.length,+draft.i||0)):0,pick=draft&&Array.isArray(draft.pick)?draft.pick.slice():[],fallback=false;
 function saveDraft(){if(preview||retakeMode)return;var P=load();P.valuesCoreDraft={v:1,sort:Object.assign({},sort),i:i,pick:pick.slice(),at:Date.now()};persist(P)}
 function intro(){box.innerHTML='<span class="tag">Точка Б</span><span class="tag">Ценности</span><div class="aq">Три ориентира</div><p>'+h(T.link.svToValues)+'</p><p class="ar-ctx">Разложи ценности по трем корзинам: «Важно сейчас», «Отложить», «Вычеркнуть». Потом выбери из важных ровно три.</p><button class="next" id="gtGo">Начать</button>';box.querySelector('#gtGo').onclick=card}
 function card(){
  window.gBack=function(){if(i>0){i--;saveDraft();card();return true}return false};
  if(i>=list.length){choose();return}
  var v=list[i];box.innerHTML='<div class="al">Ценность '+(i+1)+' из '+list.length+'</div><div class="aq" style="text-align:center;margin:24px 0">'+esc(v)+'</div><div id="gtOp">'+[['imp','Важно сейчас'],['later','Отложить'],['cross','Вычеркнуть']].map(function(o){return '<button class="ao'+(sort[v]===o[0]?' ar-on':'')+'" data-c="'+o[0]+'">'+o[1]+'</button>'}).join('')+'</div>';
  box.querySelectorAll('#gtOp button').forEach(function(x){x.onclick=function(){sort[v]=x.dataset.c;i++;saveDraft();card();scrollTo(0,0)}})
 }
 function choose(){
  window.gBack=function(){i=list.length-1;saveDraft();card();return true};
  var imp=list.filter(function(v){return sort[v]==='imp'}),later=list.filter(function(v){return sort[v]==='later'}),pool=imp.length>=3?imp:imp.concat(later);
  fallback=pool.length<3;if(fallback)pool=list.slice();
  pick=pick.filter(function(v){return pool.indexOf(v)>=0}).slice(0,3);
  box.innerHTML='<div class="aq">Выбери ровно три</div><p class="ar-ctx">'+(imp.length>=3?'Из тех, что ты '+g('{отметил|отметила}')+' как важные сейчас.':fallback?'Пока в корзинах «Важно сейчас» и «Отложить» меньше трех ценностей. Можно выбрать три из полного списка или вернуться и изменить расклад.':'Важных пока меньше трех, поэтому здесь есть и отложенные.')+'</p><div id="gtOp">'+pool.map(function(v){return '<button class="ao'+(pick.indexOf(v)>=0?' ar-on':'')+'" data-c="'+esc(v)+'">'+esc(v)+'</button>'}).join('')+'</div><p class="ar-ctx" id="gtCnt"></p><button class="next" id="gtGo">Готово</button>';
  function mk(){box.querySelectorAll('#gtOp button').forEach(function(x){x.classList.toggle('ar-on',pick.indexOf(x.dataset.c)>=0)});box.querySelector('#gtCnt').textContent='Выбрано: '+pick.length+' из 3';box.querySelector('#gtGo').disabled=pick.length!==3;saveDraft()}
  box.querySelectorAll('#gtOp button').forEach(function(x){x.onclick=function(){var c=x.dataset.c,n=pick.indexOf(c);if(n>=0)pick.splice(n,1);else if(pick.length<3)pick.push(c);mk()}});
  mk();box.querySelector('#gtGo').onclick=function(){if(pick.length!==3)return;var res={v:VER,sort:sort,top3:pick.slice(),status:fallback?'provisional':'supported',top:pick.join(', '),answers:sort,at:Date.now(),selectionFallback:fallback};var P=load();delete P.valuesCoreDraft;persist(P);store('vsort',res,'Три ориентира: '+pick.join(', '));show(res)}
 }
 function show(res){result(box,'vsort',{html:'<span class="tag">Точка Б</span><span class="tag">Ценности</span><div class="al">Твои три ориентира</div><ol class="gt-sum">'+res.top3.map(function(v){return '<li><b>'+esc(v)+'</b></li>'}).join('')+'</ol>'+P_(h(T.link.valuesToReactor))+'<details class="ar-det"><summary>Как ты '+g('{разложил|разложила}')+' ценности</summary>'+[['imp','Важно сейчас'],['later','Отложить'],['cross','Вычеркнуть']].map(function(o){var l=Object.keys(res.sort||{}).filter(function(v){return res.sort[v]===o[0]});return l.length?'<p><b>'+o[1]+':</b> '+esc(l.join(', '))+'</p>':''}).join('')+'</details>'},function(){sort={};i=0;pick=[];intro()})}
 if(have&&have.top3&&!preview){show(have);return}
 if(draft&&i>0)card();else intro()
}
window.GTests={STEP:STEP,BUILD:BUILD,ITEMS:ITEMS,reactorIn:reactorIn,mount:function(k,box){if(k==='im'&&window.GBackgroundTest){GBackgroundTest.mount(box);return}if(k==='im'&&window.GInner){GInner.mount(box);return}if(k==='vsort')mountValues(box);else if(k==='lab_d'&&window.GLabD)GLabD.mount(box);else mountTest(k,box)},keys:Object.keys(STEP),W:W,css:css,store:store,result:result,load:load,persist:persist,g:g,h:h,esc:esc,P_:P_,fem:fem,preview:preview,retakeMode:retakeMode,VER:VER};
})();
