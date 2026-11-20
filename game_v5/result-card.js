/* Единый чистый шаблон экрана итога любого блока (в стиле эталона sum.html)
   + автосохранение расшифровки в Дневник (P.diary.blocks) без артефактов
   + быстрая запись инсайта/вопроса в Дневник прямо с экрана итога. */
(function(){
'use strict';
if(window.GResultCard)return;
var K='alch_v5_profile';
function load(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return {}}}
function save(P){try{localStorage.setItem(K,JSON.stringify(P))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function css(){
 if(document.getElementById('grc-css'))return;
 var s=document.createElement('style');s.id='grc-css';
 s.textContent=
  '.grc{background:linear-gradient(#f6e6bf,#e2c78e);color:#3a2410;border-radius:20px;padding:22px 18px 20px;margin:8px 0 18px;box-shadow:0 14px 36px rgba(0,0,0,.45),0 0 0 1px rgba(255,240,198,.55) inset;text-align:left;font-family:Manrope,sans-serif}'+
  '.grc-cap{display:inline-block;padding:4px 12px;border-radius:999px;background:rgba(138,90,34,.14);color:#6e4314;font:700 11.5px Manrope,sans-serif;letter-spacing:.1em;text-transform:uppercase;margin:0 0 10px}'+
  '.grc-h{font:700 25px/1.2 "Cormorant Garamond",Georgia,serif;color:#2c1808;margin:0 0 10px}'+
  '.grc-lead{font:600 16.5px/1.45 Manrope,sans-serif;color:#4a2e12;margin:0 0 14px}'+
  '.grc-sec{padding-top:12px;margin-top:12px;border-top:1px solid rgba(138,90,34,.22)}'+
  '.grc-l{font:800 11.5px Manrope,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#7a4e1c;margin:0 0 6px}'+
  '.grc-p{font:500 16px/1.5 Manrope,sans-serif;color:#2c1808;margin:0 0 8px}'+
  '.grc-p:last-child{margin-bottom:0}'+
  '.grc-det{margin-top:8px;border:1px solid rgba(138,90,34,.26);border-radius:12px;background:rgba(255,248,230,.52);padding:8px 12px}'+
  '.grc-det summary{cursor:pointer;font:700 14.5px Manrope,sans-serif;color:#6e4314;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:8px}'+
  '.grc-det summary::-webkit-details-marker{display:none}'+
  '.grc-det summary:after{content:"▾";font-size:13px;opacity:.75;transition:transform .2s}'+
  '.grc-det[open] summary:after{transform:rotate(180deg)}'+
  '.grc-det-b{margin-top:8px;padding-top:8px;border-top:1px dashed rgba(138,90,34,.22);font:500 15px/1.5 Manrope,sans-serif;color:#3a2410}'+
  '.grc-det-b p{margin:0 0 8px}.grc-det-b p:last-child{margin-bottom:0}'+
  '.grc-det-b ul{margin:4px 0 0;padding-left:18px}.grc-det-b li{margin:4px 0}'+
  '.grc-art{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:14px;background:rgba(58,36,16,.08);border:1px solid rgba(138,90,34,.28);margin-top:6px}'+
  '.grc-art-ic{width:38px;height:38px;flex:0 0 38px;display:flex;align-items:center;justify-content:center}'+
  '.grc-art-ic svg{width:100%;height:100%}.grc-art b{display:block;font:700 16px Manrope,sans-serif;color:#2c1808}.grc-art small{display:block;font:500 13.5px Manrope,sans-serif;color:#6e4314}'+
  '.grc-acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid rgba(138,90,34,.22)}'+
  '.grc-btn{flex:1 1 140px;min-height:42px;padding:9px 14px;border-radius:999px;border:1.5px solid #9c6b26;background:rgba(255,250,236,.72);color:#5c350c;font:700 14px Manrope,sans-serif;cursor:pointer;text-align:center}'+
  '.grc-btn:active{transform:scale(.98)}'+
  '.grc-note{margin-top:12px;padding:12px;border-radius:14px;background:rgba(255,250,236,.86);border:1px solid rgba(138,90,34,.35)}'+
  '.grc-ntabs{display:flex;gap:6px;margin-bottom:8px}'+
  '.grc-ntabs button{flex:1;padding:7px 8px;border-radius:10px;border:1px solid rgba(138,90,34,.35);background:transparent;color:#5c350c;font:700 13.5px Manrope,sans-serif;cursor:pointer}'+
  '.grc-ntabs button.on{background:#6e4314;color:#fff7e4;border-color:#6e4314}'+
  '.grc-note textarea{width:100%;min-height:76px;box-sizing:border-box;border-radius:10px;border:1px solid rgba(138,90,34,.35);background:#fffdf6;color:#2c1808;font:500 15.5px/1.45 Manrope,sans-serif;padding:9px 10px;resize:vertical}'+
  '.grc-nsave{margin-top:8px;width:100%;min-height:40px;border:0;border-radius:10px;background:#6e4314;color:#fff7e4;font:700 14.5px Manrope,sans-serif;cursor:pointer}'+
  '.grc-saved{margin-top:8px;font:700 14px Manrope,sans-serif;color:#5c350c}'+
  '.grc-go{display:block;width:100%;margin:16px 0 0;min-height:52px;padding:13px 20px;border:0;border-radius:999px;background:linear-gradient(180deg,#f5d68a,#cfa046);color:#261606;font:800 17px Manrope,sans-serif;letter-spacing:.02em;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.35)}'+
  '.grc-sub{display:flex;justify-content:center;gap:18px;margin-top:10px;font:600 14px Manrope,sans-serif}'+
  '.grc-sub button,.grc-sub a{background:none;border:0;color:#6e4314;text-decoration:underline;cursor:pointer;padding:4px;font:inherit}'+
  '.grc-bk{margin-top:14px;padding:10px 12px;border-left:2px solid #9c6b26;background:rgba(255,250,236,.45);border-radius:0 10px 10px 0}'+
  '.grc-bk-c{font:700 11px Manrope,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#7a4e1c;margin:0 0 4px}'+
  '.grc-bk-t{font:500 15px/1.45 Manrope,sans-serif;color:#2c1808;margin:0}';
 document.head.appendChild(s);
}

/* Автосохранение расшифровки блока в Дневник (без артефактов) */
function saveToDiary(entry){
 if(!entry||!entry.id)return;
 var P=load();P.diary=P.diary||{};P.diary.blocks=P.diary.blocks||[];
 var rec={
  id:String(entry.id),
  step:entry.step||'',
  title:entry.title||'',
  passed:entry.passed||'',
  lead:entry.lead||'',
  strong:entry.strong||'',
  strongMore:entry.strongMore||'',
  insight:entry.insight||'',
  insightMore:entry.insightMore||'',
  answers:Array.isArray(entry.answers)?entry.answers.slice():[],
  at:Date.now()
 };
 var idx=P.diary.blocks.findIndex(function(b){return b.id===rec.id});
 if(idx>=0)P.diary.blocks[idx]=rec;else P.diary.blocks.push(rec);
 save(P);
}

function openBook(stepKey){
 var q=window.GQuote&&GQuote.Q&&GQuote.Q[stepKey];if(!q)return;
 function go(){window.GBook&&GBook.openChapter(q[0],q[1],'path')}
 if(window.GBook)return go();
 var s=document.createElement('script');s.src='book.js?v=fx1';s.onload=go;document.head.appendChild(s);
}

/* Рендер единой карточки результата блока */
function render(container,opts){
 css();opts=opts||{};
 var stepKey=opts.stepKey||'';
 var bq=stepKey&&window.GQuote&&GQuote.Q&&GQuote.Q[stepKey];
 if(!opts.preview&&opts.id){
  saveToDiary({
   id:opts.id,step:stepKey,title:opts.title||'',passed:opts.passed||'',lead:opts.lead||'',
   strong:opts.strong||'',strongMore:opts.strongMore||'',
   insight:opts.insight||'',insightMore:opts.insightMore||'',
   answers:opts.answers||[]
  });
 }
 var html='<div class="grc">';
 if(opts.passed)html+='<div class="grc-cap">'+esc(opts.passed)+'</div>';
 if(opts.title)html+='<h2 class="grc-h">'+esc(opts.title)+'</h2>';
 if(opts.lead)html+='<p class="grc-lead">'+esc(opts.lead)+'</p>';

 if(opts.strong||opts.strongMore){
  html+='<div class="grc-sec"><div class="grc-l">Твои сильные стороны</div>';
  if(opts.strong)html+='<p class="grc-p">'+esc(opts.strong)+'</p>';
  if(opts.strongMore)html+='<details class="grc-det"><summary>Подробнее</summary><div class="grc-det-b">'+opts.strongMore+'</div></details>';
  html+='</div>';
 }

 if(opts.insight||opts.insightMore){
  html+='<div class="grc-sec"><div class="grc-l">'+(opts.insightLabel||'Мы узнали о тебе · на что обратить внимание')+'</div>';
  if(opts.insight)html+='<p class="grc-p">'+esc(opts.insight)+'</p>';
  if(opts.insightMore)html+='<details class="grc-det"><summary>'+(opts.insightDetLabel||'Развернуть объяснение')+'</summary><div class="grc-det-b">'+opts.insightMore+'</div></details>';
  html+='</div>';
 }

 if(opts.extraHtml)html+='<div class="grc-sec">'+opts.extraHtml+'</div>';

 if(opts.artifact){
  html+='<div class="grc-sec"><div class="grc-l">Артефакт на этом этапе</div><div class="grc-art">'+
   (opts.artifact.icon?'<span class="grc-art-ic">'+opts.artifact.icon+'</span>':'')+
   '<div><b>'+esc(opts.artifact.name)+'</b>'+(opts.artifact.note?'<small>'+esc(opts.artifact.note)+'</small>':'')+'</div></div></div>';
 }

 if(bq){
  html+='<div class="grc-bk"><p class="grc-bk-c">Книга Алхимика</p><p class="grc-bk-t">'+esc(bq[2])+'</p></div>';
 }

 html+='<div class="grc-acts">'+
  (bq?'<button type="button" class="grc-btn" data-grc="book">Прочитать в книге</button>':'')+
  '<button type="button" class="grc-btn" data-grc="diary">Записать в дневник</button>'+
 '</div>';

 html+='<div class="grc-note" hidden>'+
  '<div class="grc-ntabs"><button type="button" class="on" data-kind="ins">Инсайт</button><button type="button" data-kind="q">Вопрос</button></div>'+
  '<textarea placeholder="Запиши мысль или открытие по этому этапу…"></textarea>'+
  '<button type="button" class="grc-nsave">Сохранить в дневник</button>'+
  '<div class="grc-saved" hidden>Сохранено в Дневнике.</div>'+
 '</div>';

 if(opts.preview)html+='<p class="grc-p" style="margin-top:12px;font-size:14px;color:#7a4e1c">Просмотр: ответы не сохраняются в твой путь.</p>';

 if(opts.onNext||opts.nextLabel){
  html+='<button type="button" class="grc-go" id="nx">'+esc(opts.nextLabel||'Дальше')+'</button>';
 }
 if(opts.onRetake){
  html+='<div class="grc-sub"><button type="button" data-grc="retake">Пройти заново</button></div>';
 }
 html+='</div>';

 container.innerHTML=html;

 var bkBtn=container.querySelector('[data-grc="book"]');
 if(bkBtn)bkBtn.onclick=function(){openBook(stepKey)};

 var dBtn=container.querySelector('[data-grc="diary"]'),noteBox=container.querySelector('.grc-note');
 var kind='ins';
 if(dBtn&&noteBox){
  dBtn.onclick=function(){noteBox.hidden=!noteBox.hidden;if(!noteBox.hidden)noteBox.querySelector('textarea').focus()};
  noteBox.querySelectorAll('.grc-ntabs button').forEach(function(b){
   b.onclick=function(){
    kind=b.dataset.kind;
    noteBox.querySelectorAll('.grc-ntabs button').forEach(function(x){x.classList.toggle('on',x===b)});
    noteBox.querySelector('textarea').placeholder=kind==='ins'?'Запиши мысль или открытие по этому этапу…':'Запиши вопрос, который хочется разобрать…';
   };
  });
  noteBox.querySelector('.grc-nsave').onclick=function(){
   var ta=noteBox.querySelector('textarea'),val=ta.value.trim();if(!val)return;
   var P=load();P.diary=P.diary||{};P.diary.ins=P.diary.ins||[];P.diary.q=P.diary.q||[];
   P.diary[kind].push({x:val,d:Date.now(),at:opts.title||opts.passed||'',blockId:opts.id||''});
   save(P);ta.value='';
   var ok=noteBox.querySelector('.grc-saved');ok.hidden=false;
   setTimeout(function(){ok.hidden=true;noteBox.hidden=true},1100);
  };
 }
 var nx=container.querySelector('#nx');
 if(nx){window.nx=nx;if(opts.onNext)nx.onclick=opts.onNext}
 var re=container.querySelector('[data-grc="retake"]');
 if(re&&opts.onRetake)re.onclick=opts.onRetake;
 return container.querySelector('.grc');
}

/* Присоединить быструю кнопку «Записать в дневник» + автосохранение к любому существующему экрану результата (tests.js, arch.js и т.д.) */
function attachDiaryBar(box,opts){
 css();opts=opts||{};
 if(!box)return;
 if(!opts.preview&&opts.id)saveToDiary(opts);
 var old=box.querySelector('.grc-bar');if(old)old.remove();
 var wrap=document.createElement('div');wrap.className='grc-bar';
 wrap.innerHTML='<div class="grc-acts" style="border-top:0;padding-top:4px;margin-top:10px">'+
  '<button type="button" class="grc-btn" data-grc="diary">Записать в дневник</button>'+
 '</div>'+
 '<div class="grc-note" hidden>'+
  '<div class="grc-ntabs"><button type="button" class="on" data-kind="ins">Инсайт</button><button type="button" data-kind="q">Вопрос</button></div>'+
  '<textarea placeholder="Запиши мысль или открытие по этому этапу…"></textarea>'+
  '<button type="button" class="grc-nsave">Сохранить в дневник</button>'+
  '<div class="grc-saved" hidden>Сохранено в Дневнике.</div>'+
 '</div>';
 var before=opts.before||box.querySelector('#nx');
 if(before&&before.parentNode===box)box.insertBefore(wrap,before);else box.appendChild(wrap);
 var kind='ins',noteBox=wrap.querySelector('.grc-note');
 wrap.querySelector('[data-grc="diary"]').onclick=function(){noteBox.hidden=!noteBox.hidden;if(!noteBox.hidden)noteBox.querySelector('textarea').focus()};
 noteBox.querySelectorAll('.grc-ntabs button').forEach(function(b){
  b.onclick=function(){
   kind=b.dataset.kind;
   noteBox.querySelectorAll('.grc-ntabs button').forEach(function(x){x.classList.toggle('on',x===b)});
   noteBox.querySelector('textarea').placeholder=kind==='ins'?'Запиши мысль или открытие по этому этапу…':'Запиши вопрос, который хочется разобрать…';
  };
 });
 noteBox.querySelector('.grc-nsave').onclick=function(){
  var ta=noteBox.querySelector('textarea'),val=ta.value.trim();if(!val)return;
  var P=load();P.diary=P.diary||{};P.diary.ins=P.diary.ins||[];P.diary.q=P.diary.q||[];
  P.diary[kind].push({x:val,d:Date.now(),at:opts.title||'',blockId:opts.id||''});
  save(P);ta.value='';
  var ok=noteBox.querySelector('.grc-saved');ok.hidden=false;
  setTimeout(function(){ok.hidden=true;noteBox.hidden=true},1100);
 };
}

window.GResultCard={render:render,saveToDiary:saveToDiary,attachDiaryBar:attachDiaryBar};
})();
