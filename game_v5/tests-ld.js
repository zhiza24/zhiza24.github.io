/* Лабиринт желаний, чистовая редакция: 18 основных вопросов + адаптивный банк из 18 вопросов о возможных функциях привычного положения.
   Данные: window.GTESTS.ld. Подключается после tests.js. Остальные тесты не меняет. */
(function(){
'use strict';
var T=window.GTESTS, G=window.GTests;if(!T||!T.ld||!G)return;
var D=T.ld, Q={};(D.q||[]).forEach(function(x){Q[x.id]=x});
var ME={};(D.sg.mechs||[]).forEach(function(m){ME[m.id]=m});
var ED=2, MOD='desireLab', KEY=null;

function load(){return G.load()}
function persist(P){return G.persist(P)}
function g(s){return G.g(s)}
function esc(s){return G.esc(s)}
function h(s){return G.h(s)}
function P_(s){return G.P_(s)}
function preview(){return G.preview}
function fem(){return G.fem()}

function cssLab(){
 if(document.getElementById('ld-css'))return;
 var s=document.createElement('style');s.id='ld-css';
 s.textContent=
  '.ld-sc{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 8px}'+
  '.ld-sc button{flex:1 1 18%;min-width:48px;min-height:48px;padding:8px 4px;border:1px solid #9e783a;border-radius:12px;background:#20170e;color:#f4ecdf;font:700 18px Manrope,sans-serif;cursor:pointer}'+
  '.ld-sc button.ar-on{background:linear-gradient(#ffe9a8,#e0a940)!important;color:#2a1606!important;border-color:#6a3a12!important}'+
  '.ld-ends{display:flex;justify-content:space-between;gap:10px;font-size:15px;opacity:.85;margin:0 0 12px;line-height:1.35}'+
  '.ld-ends span{flex:1}.ld-ends span:last-child{text-align:right}'+
  '.ld-fade{transition:opacity .2s ease}'+
  '.ld-hyp{font-size:14px;letter-spacing:.04em;text-transform:uppercase;opacity:.8;margin:8px 0 0}'+
  '.ld-k{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#c9a24a;margin:10px 0 4px}'+
  '.ld-own{margin:16px 0}';
 document.head.appendChild(s);
}

function arr(a){return Array.isArray(a)?a.slice():[]}
function num(v){return typeof v==='number'&&isFinite(v)?v:null}
function isDk(v){return v==null||v==='dk'||v==='skip'||v===''||(typeof v==='string'&&!String(v).trim())}
function txt(a){return typeof a==='string'&&a!=='dk'&&a!=='skip'&&a.trim()?a.trim():null}
function Qid(id){return Q[id]||{id:id,t:id,o:[]}}
function lab(id,code){
 var q=Qid(id),o=(q.o||[]).filter(function(x){return String(x[0])===String(code)})[0];
 return o?o[1]:String(code);
}
function labs(id,codes){return arr(codes).map(function(c){return lab(id,c)}).join(', ')}
function has(a,c){return arr(a).indexOf(String(c))>=0}
function otherTxt(ans,id){return txt(ans[id+'_text'])}

function optLabel(id,code,ans){
 var t=g(lab(id,code)),x=otherTxt(ans,id);
 if((Qid(id).other&&String(code)===String(Qid(id).other)||String(code)==='other')&&x) t+=': '+x;
 return t;
}
function showAns(ans,id){
 var q=Qid(id),a=ans[id];
 if(a==='dk') return q.dk||'Пока не знаю';
 if(a==='skip'||a==null||a==='') return 'Пропущено';
 if(q.kind==='text') return txt(a)||(q.dk||'Пока не знаю');
 if(q.kind==='scale') return String(a);
 if(q.kind==='one') return optLabel(id,a,ans);
 if(q.kind==='multi') return arr(a).map(function(c){return optLabel(id,c,ans)}).join('; ');
 if(typeof a==='number') return String(a);
 return String(a);
}

function isOldAns(ans){
 if(!ans||typeof ans!=='object')return true;
 if(ans.LD18!=null||ans.LD17!=null||ans.LD16!=null)return false;
 for(var k in ans){if(/^SG\d+/.test(k))return false}
 return true;
}

/* ---------- старый расчет (сохранения до новой редакции) ---------- */
function buildOld(ans){
 var L=D.legacy||{},R=L.res||{},out={v:1,answers:ans,at:Date.now(),edition:1};
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
 var W=G.W||{},GM={'Защиту от риска или оценки':'Защита.','Предсказуемость':'Предсказуемость.','Сохранение принадлежности к людям или группе':'Принадлежность.','Сохранение привычного представления о себе':'Привычная идентичность.','Немедленное облегчение':'Немедленное облегчение.'};
 var gh=arr(ans.LD11).indexOf('Пока не знаю')>=0&&!gain.length?'<p>'+esc(W.ldUnknown||'')+'</p>':gain.map(function(x){var k=GM[x];return '<div class="gt-lv">'+esc(k?k.replace('.',''):'Сохранение ресурсов')+'</div>'+P_(esc(k?g((L.gain||{})[k]):(W.ldSave||'')))}).join('');
 var prac=arr(ans.LD12).filter(function(x){return /не хватает (времени|денег|навыка|поддержки)/i.test(x)});
 var price=arr(ans.LD13),pr=ans.LD14||{},PL={real:'реально неизбежно',maybe:'пока предполагаю',dk:'не знаю'};
 out.desire=txt(ans.LD07)||(conc06?ld06:null)||txt(ans.LD01);out.step=txt(ans.LD15);out.gains=gain;out.risks=risk;out.obstacles=arr(ans.LD12);out.price=price.map(function(p){return {item:p,status:pr[p]||null}});
 var mine=[['Что хочется изменить',txt(ans.LD01)],['Направление',conc06?ld06:null],['Желаемый результат',txt(ans.LD07)],['Признак изменения',txt(ans.LD08)],['Маленький шаг',txt(ans.LD15)]].filter(function(x){return x[1]});
 var main='<div class="al">Что видно сейчас</div><div class="aq">'+esc(r.replace('.',''))+'</div>'+P_(esc(g(R[r]||'')))+(out.step?'<p class="ar-pt">Твой маленький шаг: '+esc(out.step)+'</p>':'');
 var det=(mine.length?'<details class="ar-det"><summary>Твои ответы</summary>'+mine.map(function(x){return '<p><b>'+esc(x[0])+':</b> '+esc(x[1])+'</p>'}).join('')+'</details>':'')+
  (gh?'<details class="ar-det"><summary>Что дает привычное положение</summary>'+gh+'</details>':'')+
  (prac.length?'<details class="ar-det"><summary>Препятствия</summary><p>'+esc(prac.join(', '))+'</p>'+P_(esc(g((L.gain||{})['Реальное ограничение ресурса.']||'')))+'</details>':'')+
  (price.length?'<details class="ar-det"><summary>Цена перемен</summary>'+P_(esc(g(L.price||'')))+'<ul class="gt-sum">'+price.map(function(p){return '<li>'+esc(p)+(pr[p]?': '+esc(PL[pr[p]]||pr[p]):'')+'</li>'}).join('')+'</ul></details>':'');
 out.top=r.replace('.','')+(out.desire?': '+out.desire:'');
 return {res:out,html:'<span class="tag">Точка Б</span><span class="tag">Лабиринт желаний</span>'+main+det,log:'Лабиринт желаний: '+out.top};
}

/* ---------- ясность, промежуточные итоги, механизмы ---------- */
function clarity(ans){
 var n=num(ans.LD06);if(n==null)return null;
 if(n<=3)return {n:n,k:'low',t:'низкая ясность'};
 if(n<=6)return {n:n,k:'mid',t:'направление обозначено, детали требуют прояснения'};
 if(n<=8)return {n:n,k:'ok',t:'достаточно ясная формулировка'};
 return {n:n,k:'high',t:'высокая субъективная ясность'};
}
function mid1Key(ans){
 var form=txt(ans.LD01),res=txt(ans.LD03),ch=txt(ans.LD05),cl=clarity(ans);
 var sphere=ans.LD02&&ans.LD02!=='12'&&ans.LD02!=='dk'&&ans.LD02!=='skip';
 var image=ans.LD04&&ans.LD04!=='11'&&ans.LD04!=='dk'&&ans.LD04!=='skip';
 if((form&&(res||ch)&&(cl&&(cl.k==='ok'||cl.k==='high')))||(form&&cl&&(cl.k==='ok'||cl.k==='high')))return 'clear';
 if(form||sphere||image||res||ch||(cl&&cl.k==='mid'))return 'mid';
 return 'hard';
}
function mid2Key(ans){
 var src=ans.LD11,ext=src==='3'||src==='4'||src==='5'||src==='6'||ans.LD12==='4'||ans.LD12==='5';
 var st=arr(ans.LD08).filter(function(x){return x!=='15'}),nd=arr(ans.LD09).filter(function(x){return x!=='12'}),val=arr(ans.LD10).filter(function(x){return x!=='17'});
 var unclear=(ans.LD07==='9'||isDk(ans.LD07))&&(has(ans.LD08,'15')||!st.length)&&(has(ans.LD09,'12')||!nd.length)||ans.LD11==='7'&&ans.LD12==='6';
 var many=st.length>=2||nd.length>=2||val.length>=2;
 var sense=ans.LD07&&ans.LD07!=='9'&&!isDk(ans.LD07)&&(st.length||nd.length||val.length);
 if(unclear&&!ext&&!many)return 'unclear';
 if(ext)return 'outer';
 if(many)return 'many';
 if(sense)return 'sense';
 return 'unclear';
}

function signalScore(ans,mid){
 var s=0;
 arr(ans.LD15).forEach(function(c){if(D.sg.map15[c]===mid)s+=2});
 arr(ans.LD13).forEach(function(c){if(D.sg.map13[c]===mid)s+=1});
 var p14=ans.LD14;if(p14&&D.sg.map14[p14]===mid)s+=1;
 var d16=arr(ans.LD16);
 if(mid==='A'||mid==='C'){if(has(d16,'9'))s+=1}
 if(mid==='F'&&(has(d16,'1')||has(d16,'2')||has(d16,'3')))s+=1;
 return s;
}
function mechSet(ans){
 var picked=arr(ans.LD15);
 if(has(picked,'8'))return {mode:'none',mechs:[],rest:[]};
 var from15=[];
 picked.forEach(function(c){var m=D.sg.map15[c];if(m&&from15.indexOf(m)<0)from15.push(m)});
 var set=from15.slice();
 if(!has(picked,'8')){
  var d16=arr(ans.LD16);
  if(has(d16,'1')||has(d16,'2')||has(d16,'3')){if(set.indexOf('F')<0)set.push('F')}
  if(has(d16,'9')){if(set.indexOf('A')<0)set.push('A');if(set.indexOf('C')<0)set.push('C')}
 }
 if(has(picked,'9')&&!from15.length&&!(has(arr(ans.LD16),'1')||has(arr(ans.LD16),'2')||has(arr(ans.LD16),'3')||has(arr(ans.LD16),'9')))
  return {mode:'unk',mechs:[],rest:[]};
 if(!set.length)return {mode:'unk',mechs:[],rest:[]};
 var shown=set,rest=[];
 if(shown.length>3){
  shown=set.slice().sort(function(a,b){return signalScore(ans,b)-signalScore(ans,a)||a.localeCompare(b)}).slice(0,3);
  rest=set.filter(function(m){return shown.indexOf(m)<0});
 }
 return {mode:'pick',mechs:shown,rest:rest};
}
function activeMechs(ans){
 var base=mechSet(ans);
 if(base.mode==='none'){
  if(ans._sgCheck==='no')return {mode:'none',mechs:[],rest:[]};
  if(ans._sgCheck==='yes'){
   var pick=arr(ans._sgPick);
   if(!pick.length)return {mode:'choose',mechs:[],rest:[],pick:1};
   return {mode:'pick',mechs:pick,rest:[]};
  }
  return {mode:'none',mechs:[],rest:[],ask:1};
 }
 if(base.mode==='unk'){
  if(ans._sgSkip)return {mode:'skip',mechs:[],rest:[]};
  var p=arr(ans._sgPick);
  if(p.length)return {mode:'pick',mechs:p.slice(0,2),rest:[]};
  return {mode:'unk',mechs:[],rest:[],ask:1};
 }
 return base;
}

function sgStat(ans,m){
  var vals=[],items=[];
  m.ids.forEach(function(id){
    var a=ans[id],t=m.q[id];
    if(a==='dk')items.push({id:id,t:t,a:D.sg.dk,v:null});
    else if(a==='skip'||a==null)items.push({id:id,t:t,a:'Пропущено',v:null});
    else if(typeof a==='number'){vals.push(a);items.push({id:id,t:t,a:a+' — '+((D.sg.scale.filter(function(x){return x[0]===a})[0]||[])[1]||''),v:a})}
    else items.push({id:id,t:t,a:String(a),v:null});
  });
  if(vals.length<2)return {id:m.id,name:m.name,score:null,level:'Недостаточно данных',items:items,high:null,status:'few'};
  var sc=vals.reduce(function(x,y){return x+y},0)/vals.length,lv='';
  (D.sg.levels||[]).forEach(function(L){if(sc>=L[0]&&sc<=L[1])lv=L[2]});
  var high=sc>=2?m.high:null;
  return {id:m.id,name:m.name,score:Math.round(sc*100)/100,level:lv||'',items:items,high:high,status:'ok'};
}

function savedValues(){
 var P=load(),out=[];
 if(P.valuesCore&&arr(P.valuesCore.top3).length)out=arr(P.valuesCore.top3);
 else if(P.values&&arr(P.values.order).length)out=arr(P.values.order);
 return out;
}

/* ---------- сборка итога ---------- */
function row(k,v){if(!v)return '';return '<p><b>'+esc(g(k))+':</b> '+esc(v)+'</p>'}
function typ(kind,body){return '<div class="ld-k">'+esc(kind)+'</div>'+body}

function buildNew(ans,meta){
 meta=meta||{};
 var out={v:1,edition:ED,answers:ans,at:Date.now(),startedAt:meta.startedAt||null};
 var cl=clarity(ans);
 out.desire=txt(ans.LD01)||null;
 out.result=txt(ans.LD03)||null;
 out.sphere=ans.LD02?optLabel('LD02',ans.LD02,ans):null;
 out.image=ans.LD04?optLabel('LD04',ans.LD04,ans):null;
 out.change=txt(ans.LD05)||null;
 out.clarity=cl;
 out.step=txt(ans.LD18)||null;
 out.status=mid1Key(ans)==='hard'?'tentative':(cl&&(cl.k==='ok'||cl.k==='high')?'supported':'tentative');
 var act=activeMechs(ans);
 out.mechs=(act.mechs||[]).map(function(id){return sgStat(ans,ME[id])}).filter(Boolean);
 out.untested=(act.rest||[]).map(function(id){return ME[id]&&ME[id].name}).filter(Boolean);
 out.top=(out.desire||'Исследование желания')+(cl?'; '+cl.t:'');
 if(out.step)out.desireStep=out.step;

 var F=D.final,html='',i;
 html+='<span class="tag">Точка Б</span><span class="tag">Лабиринт желаний</span>';
 html+='<div class="al">Моя карта желания</div><div class="aq">'+h(F.title)+'</div>';
 g(F.lead).split('\n').forEach(function(p){if(p.trim())html+=P_(esc(p.trim()))});

 /* 1 */
 html+='<div class="ar-blk"><h3>'+esc(F.sec[0])+'</h3>';
 html+=row('Исходная формулировка',out.desire||showAns(ans,'LD01'));
 html+=row('Сфера жизни',out.sphere);
 html+=row('Уточненный результат',out.result||showAns(ans,'LD03'));
 html+=row('Образ желаемой жизни',out.image);
 html+=row('Критерий изменения',out.change||showAns(ans,'LD05'));
 html+=row('Уровень ясности',cl?cl.n+' из 10 — '+cl.t:showAns(ans,'LD06'));
 html+='</div>';

 /* 2 */
 html+='<div class="ar-blk"><h3>'+esc(F.sec[1])+'</h3>';
 html+=row('Почему это важно',showAns(ans,'LD07'));
 html+=row('Ожидаемые состояния',showAns(ans,'LD08'));
 html+=row('Связанные потребности',showAns(ans,'LD09'));
 html+=row('Связанные ориентиры',showAns(ans,'LD10'));
 var vals=savedValues(),sel=arr(ans.LD10).map(function(c){return lab('LD10',c).replace(/\.$/,'')}).filter(function(x){return x&&x!=='Пока не знаю'&&x!=='Другое'});
 var hit=sel.filter(function(x){return vals.some(function(v){return String(v).toLowerCase()===x.toLowerCase()||String(v).toLowerCase().indexOf(x.toLowerCase())>=0||x.toLowerCase().indexOf(String(v).toLowerCase())>=0})});
 if(hit.length)html+='<p class="ar-ctx">С твоими уже выбранными ориентирами игры совпадают: '+esc(hit.join(', '))+'. Это совпадение, а не замена твоего ответа.</p>';
 html+=row('Откуда знакомо желание',showAns(ans,'LD11'));
 html+=row('Если никто не узнает',showAns(ans,'LD12'));
 html+='</div>';

 /* 3 */
 html+='<div class="ar-blk"><h3>'+esc(F.sec[2])+'</h3>';
 if(!(out.mechs||[]).length){
  if(act.mode==='none')html+='<p>По твоим ответам важное в привычном положении пока не видно. Это тоже наблюдение, а не ошибка прохождения.</p>';
  else if(act.mode==='skip'||act.mode==='unk')html+='<p>Этот блок ты {решил|решила} не проходить сейчас. Отсутствие ответов не считается отрицательным результатом.</p>'.replace(/\{([^|}]*)\|([^}]*)\}/g,function(_,m,w){return fem()?w:m});
  else html+='<p>Дополнительные вопросы этого блока не открывались или остались без расчета.</p>';
 }else{
  out.mechs.forEach(function(r){
   html+='<div class="ar-blk" style="padding-left:0"><h3 style="text-transform:none;letter-spacing:0;font:700 18px Manrope">'+esc(r.name)+'</h3>';
   if(r.score!=null)html+='<p><b>Показатель:</b> '+esc(String(r.score))+' из 4 — '+esc(r.level)+'</p>';
   else html+='<p><b>Показатель:</b> '+esc(r.level)+'</p>';
   html+=typ('Мой ответ', '<ul class="gt-sum">'+r.items.map(function(it){return '<li>'+esc(it.t)+' — '+esc(it.a)+'</li>'}).join('')+'</ul>');
   if(r.score!=null)html+=typ('Расчет системы','<p>Среднее по валидным ответам (не менее двух из трех). «Не могу определить» и пропуски в расчет не входят и не равны нулю.</p>');
   if(r.high)html+=typ('Гипотеза для исследования',P_(esc(g(r.high)))+'<p class="ld-hyp">'+esc(F.hypTag)+'</p>');
   html+='</div>';
  });
 }
 if(out.untested&&out.untested.length)html+='<p class="ar-ctx">Непроверенные гипотезы, которые пока не исследовались: '+esc(out.untested.join(', '))+'. Они не считаются установленным фактом.</p>';
 html+='</div>';

 /* 4 */
 html+='<div class="ar-blk"><h3>'+esc(F.sec[3])+'</h3>';
 html+=row('Что может стать сложнее',showAns(ans,'LD13'));
 html+=row('Что труднее отпустить',showAns(ans,'LD14'));
 html+=row('Что сохраняется, пока ничего не меняется',showAns(ans,'LD15'));
 var k1=mid1Key(ans),k2=mid2Key(ans);
 if(k2==='outer')html+='<p>Ты {заметил|заметила} возможное влияние внешних ожиданий. Это повод для исследования, а не метка, что желание чужое.</p>'.replace(/\{([^|}]*)\|([^}]*)\}/g,function(_,m,w){return fem()?w:m});
 html+='</div>';

 /* 5 */
 html+='<div class="ar-blk"><h3>'+esc(F.sec[4])+'</h3>';
 html+=row('Что затрудняет движение',showAns(ans,'LD16'));
 html+=row('Какую цену ты {готов|готова} учитывать',showAns(ans,'LD17'));
 var prac=arr(ans.LD16).filter(function(c){return ['1','2','3','4','5','6','7','8'].indexOf(c)>=0});
 if(prac.length)html+='<p>Отмеченные ограничения ресурсов, информации, навыков или условий не объявляются внутренним сопротивлением.</p>';
 html+='</div>';

 /* 6 */
 html+='<div class="ar-blk"><h3>'+esc(F.sec[5])+'</h3>';
 if(out.step)html+='<p class="ar-pt">'+esc(out.step)+'</p><p class="ar-ctx">Это исследовательский шаг, а не обязательство и не цель следующего этапа пути.</p>';
 else html+='<p>'+esc(g(F.noStep))+'</p>';
 html+='</div>';

 var own=txt(ans._own)||txt(meta.own);
 html+='<div class="ld-own ar-blk"><h3>'+h(F.own)+'</h3><p class="ar-ctx">'+h(F.ownPh)+'</p>';
 html+='<textarea class="ar-ta" id="ldOwn" rows="3" maxlength="600" placeholder="'+esc(g(F.ownPh))+'">'+(own?esc(own):'')+'</textarea>';
 html+='<button type="button" class="next" id="ldOwnGo">'+esc(F.ownBtn)+'</button><p class="ar-ctx" id="ldOwnOk" hidden>Сохранено в дневнике.</p></div>';

 var sgAns=[];
 (D.sg.mechs||[]).forEach(function(m){m.ids.forEach(function(id){if(ans[id]!=null){var a=ans[id],tx=a==='dk'?D.sg.dk:a==='skip'?'Пропущено':(typeof a==='number'?a+' — '+(((D.sg.scale.filter(function(x){return x[0]===a})[0]||[])[1])||a):String(a));sgAns.push(id+'. '+m.q[id]+' — '+tx)}})});
 var answers=D.q.map(function(q){return q.id+'. '+g(q.t)+' — '+showAns(ans,q.id)}).concat(sgAns);

 var diary={
  id:'test_lab_d',
  step:'slot.html?id=lab_d',
  title:'Моя карта желания',
  passed:'Лабиринт желаний',
  lead:(out.desire||'Исследование желания')+(cl?'. Ясность: '+cl.n+' из 10 — '+cl.t:''),
  insight:g(F.title),
  insightMore:html.replace(/<textarea[\s\S]*$/,'') /* not used */,
  answers:answers
 };
 /* insightMore: compact typed summary, без поля ввода */
 var more='';
 more+=typ('Мой ответ','<p>'+esc((out.desire||showAns(ans,'LD01')))+'</p>');
 if(out.mechs&&out.mechs.length){
  more+=typ('Расчет системы',out.mechs.map(function(r){return '<p>'+esc(r.name)+': '+(r.score!=null?r.score+' из 4 — '+r.level:r.level)+'</p>'}).join(''));
  var hy=out.mechs.filter(function(r){return r.high});
  if(hy.length)more+=typ('Гипотеза для исследования',hy.map(function(r){return '<p><b>'+esc(r.name)+'.</b> '+esc(g(r.high))+'</p>'}).join(''));
 }
 if(own)more+=typ('Мой ответ','<p>Собственный вывод: '+esc(own)+'</p>');
 diary.insightMore=more;
 diary.insightLabel='Моя карта желания';

 function bind(box){
  var ta=box.querySelector('#ldOwn'),go=box.querySelector('#ldOwnGo'),ok=box.querySelector('#ldOwnOk');
  if(!ta||!go)return;
  go.onclick=function(){
   var v=ta.value.trim();
   ans._own=v||undefined;
   var P=load();
   if(P.desireLab&&P.desireLab.answers){P.desireLab.answers._own=ans._own;P.desireLab.own=v||null;G.persist(P)}
   if(window.GResultCard&&GResultCard.saveToDiary){
    diary.answers=answers.slice();
    if(v){diary.insightMore=more+typ('Мой ответ','<p>Собственный вывод: '+esc(v)+'</p>');diary.answers.push('Собственный вывод: '+v)}
    GResultCard.saveToDiary(diary);
   }
   var Pr=load();Pr.diary=Pr.diary||{};Pr.diary.ins=Pr.diary.ins||[];
   if(v){
    var ins=Pr.diary.ins.filter(function(n){return n.blockId==='test_lab_d'&&n.at==='Моя карта желания — вывод'});
    var rec={x:v,d:Date.now(),at:'Моя карта желания — вывод',blockId:'test_lab_d'};
    if(ins.length)Pr.diary.ins[Pr.diary.ins.indexOf(ins[ins.length-1])]=rec;else Pr.diary.ins.push(rec);
    G.persist(Pr);
   }
   if(ok){ok.hidden=false}
  };
 }
 return {res:out,html:html,log:'Лабиринт желаний: '+out.top,diary:diary,bind:bind};
}

function build(ans,meta){
 try{
  if(isOldAns(ans))return buildOld(ans);
  return buildNew(ans,meta);
 }catch(e){
  try{console.error('lab_d build',e)}catch(err){}
  return {res:{v:1,answers:ans||{},at:Date.now(),status:'tentative',top:'Исследование желания'},html:'<span class="tag">Точка Б</span><span class="tag">Лабиринт желаний</span><div class="aq">Лабиринт желаний</div><p>Не удалось показать прежние ответы. Можно пройти исследование заново — старые данные не будут переписаны, пока ты не завершишь новый проход.</p>',log:'Лабиринт желаний: ошибка показа'};
 }
}

/* ---------- маршрут экранов ---------- */
function pathOf(ans){
 var L=['intro','g1','LD01','LD02','LD03','LD04','LD05','LD06','m1','g2','LD07','LD08','LD09','LD10','LD11','LD12','m2','g3','LD13','LD14','LD15','LD16','LD17','LD18','m3'];
 var act=activeMechs(ans);
 if(act.ask&&act.mode==='none')L.push('sgNone');
 else if(act.ask&&act.mode==='unk')L.push('sgUnk');
 else if(act.mode==='choose'||act.pick)L.push('sgPick');
 else if(act.mechs&&act.mechs.length){
  act.mechs.forEach(function(mid){
   L.push('sgi_'+mid);
   (ME[mid].ids||[]).forEach(function(id){L.push(id)});
  });
 }
 L.push('done');
 return L;
}
function stageOf(id){
 if(/^(g1|LD0[1-6]|m1)$/.test(id))return D.stages[0];
 if(/^(g2|LD0[7-9]|LD1[0-2]|m2)$/.test(id))return D.stages[1];
 if(/^(g3|LD1[3-8]|m3)$/.test(id))return D.stages[2];
 if(/^sg|SG/.test(id))return {name:D.sg.partName,id:'sg'};
 return null;
}
function progLabel(id,ans){
 var st=stageOf(id);if(!st)return '';
 if(st.id==='sg')return st.name;
 var qs=st.qs||[],ix=qs.indexOf(id);
 if(ix>=0)return st.name+' · '+(ix+1)+' из '+qs.length;
 return st.name;
}

/* ---------- экранный раннер ---------- */
window.GLabD={build:build,mount:function(box){mountLab(box)},isOld:isOldAns};


function mountLab(box){
 G.css();cssLab();
 var have=(load().desireLab)||null;
 function startFresh(){
  var P=load();delete P.desireLabDraft;persist(P);
  play(null);
 }
 if(have&&have.v&&have.answers&&!preview()){
  G.result(box,'lab_d',build(have.answers,{startedAt:have.startedAt,own:have.own}),startFresh);
  return;
 }
 play((preview()?null:load().desireLabDraft)||null);

 function play(draft){
  var ans=(draft&&draft.ans)?Object.assign({},draft.ans):{};
  var step=(draft&&draft.step)||'intro';
  var hist=(draft&&draft.hist)?draft.hist.slice():[];
  var startedAt=(draft&&draft.startedAt)||Date.now();
  var timer=null;
  function saveDraft(){
   if(preview())return;
   var P=load();P.desireLabDraft={ans:ans,step:step,hist:hist,startedAt:startedAt};persist(P);
  }
  function raw(id,v){
   if(preview()||!window.GProfile)return;
   try{GProfile.recordRaw(MOD,id,v,{v:ED})}catch(e){}
  }
  function setAns(id,v){
   if(v===undefined)delete ans[id];else ans[id]=v;
   raw(id,v===undefined?null:v);
   saveDraft();
  }
  function queue(){return pathOf(ans)}
  function go(to){
   if(timer){clearTimeout(timer);timer=null}
   hist.push(step);step=to;saveDraft();draw();
  }
  function fwd(){
   var L=queue(),i=L.indexOf(step),n=i>=0?L[i+1]:L[0];
   if(!n||n==='done'||step==='done'){finish();return}
   go(n);
  }
  function back(){
   if(timer){clearTimeout(timer);timer=null}
   if(!hist.length)return false;
   step=hist.pop();saveDraft();draw();return true;
  }
  window.gBack=function(){return back()};

  function finish(){
   if(timer){clearTimeout(timer);timer=null}
   var built=build(ans,{startedAt:startedAt,own:txt(ans._own)});
   if(!preview()){
    var P=load();delete P.desireLabDraft;persist(P);
    G.store('lab_d',built.res,built.log);
   }
   G.result(box,'lab_d',built,startFresh);
  }

  function fade(html,bind){
   box.classList.add('ld-fade');box.style.opacity='0';
   setTimeout(function(){
    box.innerHTML=html;if(bind)bind();box.style.opacity='1';scrollTo(0,0);
   },180);
  }
  function head(id,title,ctx){
   var p=progLabel(id,ans),h='';
   if(p)h+='<div class="al">'+hEsc(p)+'</div>';
   if(title)h+='<div class="aq">'+hEsc(title)+'</div>';
   if(ctx)h+='<p class="ar-ctx">'+hEsc(ctx)+'</p>';
   return h;
  }
  function hEsc(s){return h(s)}

  function paintIntro(){
   var I=D.intro;
   fade('<div class="gt-ph"><b>'+esc(I.z)+'</b>'+esc(I.who)+' · здесь будет картинка или видео<small>'+esc(I.zdesc)+'</small></div><div class="aq">'+h(I.title)+'</div>'+I.text.split('\n').filter(Boolean).map(function(p){return P_(h(p))}).join('')+'<button class="next" id="gtGo">'+esc(I.btn)+'</button>',
    function(){box.querySelector('#gtGo').onclick=function(){fwd()}});
  }
  function paintGate(st){
   fade(head('g'+(D.stages.indexOf(st)+1),'', '')+'<div class="aq">'+h(st.name)+'</div>'+st.lead.split('\n').filter(Boolean).map(function(p){return P_(h(p))}).join('')+'<button class="next" id="gtGo">Дальше</button>',
    function(){box.querySelector('#gtGo').onclick=function(){fwd()}});
  }
  function midHtml(k){
   if(k==='m1'){
    var M=D.mid.s1,key=mid1Key(ans),v=M[key]||M.hard;
    var body='<div class="al">'+h(M.title)+'</div><div class="aq">'+h(v[0])+'</div>'+P_(h(v[1]));
    body+='<div class="ar-blk">'+row('Желание',txt(ans.LD01)||showAns(ans,'LD01'))+row('Сфера',ans.LD02?optLabel('LD02',ans.LD02,ans):'')+row('Результат',txt(ans.LD03)||showAns(ans,'LD03'))+row('Образ жизни',ans.LD04?optLabel('LD04',ans.LD04,ans):'')+row('Критерий изменения',txt(ans.LD05)||showAns(ans,'LD05'))+row('Ясность',(clarity(ans)?clarity(ans).n+' из 10 — '+clarity(ans).t:showAns(ans,'LD06')))+'</div>';
    return body+'<button class="next" id="gtGo">Дальше</button>';
   }
   if(k==='m2'){
    var M2=D.mid.s2,key2=mid2Key(ans),v2=M2[key2]||M2.unclear;
    var body2='<div class="al">'+h(M2.title)+'</div><div class="aq">'+h(v2[0])+'</div>'+P_(h(v2[1]));
    body2+='<div class="ar-blk">'+row('Почему важно',showAns(ans,'LD07'))+row('Ожидаемые состояния',showAns(ans,'LD08'))+row('Потребности',showAns(ans,'LD09'))+row('Ориентиры',showAns(ans,'LD10'))+row('Источник',showAns(ans,'LD11'))+row('Без внешней оценки',showAns(ans,'LD12'))+'</div>';
    return body2+'<button class="next" id="gtGo">Дальше</button>';
   }
   var M3=D.mid.s3;
   var body3='<div class="al">'+h(M3.title)+'</div>'+P_(h(M3.lead));
   body3+='<div class="ar-blk">'+row('Что может стать сложнее',showAns(ans,'LD13'))+row('Что труднее отпустить',showAns(ans,'LD14'))+row('Что сохраняется',showAns(ans,'LD15'))+row('Что затрудняет движение',showAns(ans,'LD16'))+row('Цена, которую {готов|готова} учитывать',showAns(ans,'LD17'))+row('Следующий шаг',txt(ans.LD18)||showAns(ans,'LD18'))+'</div>';
   return body3+'<button class="next" id="gtGo">Дальше</button>';
  }

  function paintOne(q){
   var cur=ans[q.id],html=head(q.id,q.t)+(q.ex?'<p class="ar-ctx">Пример: '+h(q.ex)+'</p>':'');
   html+='<div id="gtOp">'+q.o.map(function(o){return '<button class="ao'+(String(cur)===String(o[0])?' ar-on':'')+'" data-c="'+esc(o[0])+'">'+h(o[1])+'</button>'}).join('')+'</div><div id="gtEx"></div>';
   fade(html,function(){
    var ex=box.querySelector('#gtEx');
    function showOther(c){
     if(q.other&&String(c)===String(q.other)){
      ex.innerHTML='<textarea class="ar-ta" id="gtTx" rows="2" maxlength="300" placeholder="Если выбрано «Другое», напиши коротко"></textarea><button class="next" id="gtOk">Сохранить и продолжить</button>';
      var ta=box.querySelector('#gtTx');ta.value=otherTxt(ans,q.id)||'';
      box.querySelector('#gtOk').onclick=function(){setAns(q.id,c);var t=ta.value.trim();setAns(q.id+'_text',t||undefined);fwd()};
      return true;
     }
     ex.innerHTML='';return false;
    }
    if(q.other&&String(cur)===String(q.other))showOther(cur);
    box.querySelectorAll('#gtOp button').forEach(function(x){
     x.onclick=function(){
      var c=x.dataset.c;
      box.querySelectorAll('#gtOp button').forEach(function(z){z.classList.toggle('ar-on',z===x)});
      setAns(q.id,typeof Qid(q.id).o[0][0]==='number'?+c:c);
      if(q.other&&String(c)!==String(q.other))setAns(q.id+'_text',undefined);
      if(showOther(c))return;
      try{navigator.vibrate&&navigator.vibrate(12)}catch(e){}
      timer=setTimeout(function(){fwd()},280);
     };
    });
   });
  }
  function paintMulti(q){
   var sel=arr(ans[q.id]).map(String),excl=arr(q.excl).map(String),html=head(q.id,q.t);
   html+='<p class="ar-ctx">'+(q.max?'Можно выбрать до '+q.max+'. ':'Можно выбрать несколько. ')+'Нажми «Зафиксировать выбор», когда будешь готов'+ (fem()?'а':'') +'.</p>';
   html+='<div id="gtOp">'+q.o.map(function(o){return '<button class="ao" data-c="'+esc(o[0])+'">'+h(o[1])+'</button>'}).join('')+'</div>';
   if(q.other)html+='<textarea class="ar-ta" id="gtTx" rows="2" maxlength="300" placeholder="Если «Другое», напиши коротко" style="display:none"></textarea>';
   html+='<button class="next" id="gtGo">Зафиксировать выбор</button>';
   fade(html,function(){
    var tx=box.querySelector('#gtTx');if(tx)tx.value=otherTxt(ans,q.id)||'';
    function mark(){
     box.querySelectorAll('#gtOp button').forEach(function(x){x.classList.toggle('ar-on',sel.indexOf(x.dataset.c)>=0)});
     if(tx)tx.style.display=q.other&&sel.indexOf(String(q.other))>=0?'':'none';
     box.querySelector('#gtGo').disabled=!sel.length;
    }
    box.querySelectorAll('#gtOp button').forEach(function(x){
     x.onclick=function(){
      var c=x.dataset.c,n=sel.indexOf(c);
      if(n>=0)sel.splice(n,1);
      else if(excl.indexOf(c)>=0)sel=[c];
      else{
       sel=sel.filter(function(z){return excl.indexOf(z)<0});
       if(!q.max||sel.length<q.max)sel.push(c);
      }
      mark();
     };
    });
    mark();
    box.querySelector('#gtGo').onclick=function(){
     if(!sel.length)return;
     setAns(q.id,sel.slice());
     if(tx){var t=tx.value.trim();setAns(q.id+'_text',q.other&&sel.indexOf(String(q.other))>=0&&t?t:undefined)}
     fwd();
    };
   });
  }
  function paintText(q){
   var html=head(q.id,q.t)+(q.ph?'<p class="ar-ctx">'+h(q.ph)+'</p>':'')+(q.ex?'<p class="ar-ctx">Пример: '+h(q.ex)+'</p>':'');
   html+='<textarea class="ar-ta" id="gtTx" rows="4" maxlength="400" placeholder="'+esc(g(q.ph||'Напиши своими словами'))+'"></textarea>';
   html+='<button class="next" id="gtGo">Сохранить и продолжить</button>';
   if(q.dk)html+='<button class="ar-skip" id="gtDk">'+h(q.dk)+'</button>';
   fade(html,function(){
    var t=box.querySelector('#gtTx');t.value=txt(ans[q.id])||'';
    box.querySelector('#gtGo').onclick=function(){var v=t.value.trim();setAns(q.id,v||'skip');fwd()};
    var dk=box.querySelector('#gtDk');if(dk)dk.onclick=function(){setAns(q.id,'dk');fwd()};
   });
  }
  function paintScale(q){
   var cur=num(ans[q.id]),html=head(q.id,q.t);
   html+='<div class="ld-ends"><span>'+h(q.lo||'')+'</span><span>'+h(q.hi||'')+'</span></div>';
   html+='<div class="ld-sc" id="gtOp">';
   for(var i=q.min;i<=q.max;i++)html+='<button data-c="'+i+'" class="'+(cur===i?'ar-on':'')+'">'+i+'</button>';
   html+='</div><button class="next" id="gtGo" '+(cur==null?'disabled':'')+'>Дальше</button>';
   fade(html,function(){
    var go=box.querySelector('#gtGo');
    function arm(v){
     setAns(q.id,v);
     box.querySelectorAll('#gtOp button').forEach(function(z){z.classList.toggle('ar-on',+z.dataset.c===v)});
     go.disabled=false;
     if(timer)clearTimeout(timer);
     timer=setTimeout(function(){fwd()},700);
    }
    box.querySelectorAll('#gtOp button').forEach(function(x){x.onclick=function(){arm(+x.dataset.c)}});
    go.onclick=function(){if(num(ans[q.id])==null)return;if(timer){clearTimeout(timer);timer=null}fwd()};
   });
  }
  function paintSG(id){
   var m=null,t='';
   (D.sg.mechs||[]).forEach(function(x){if(x.q[id]){m=x;t=x.q[id]}});
   var cur=ans[id],html=head(id,t);
   html+='<div id="gtOp">';
   D.sg.scale.forEach(function(o){
    html+='<button class="ao'+(cur===o[0]?' ar-on':'')+'" data-c="'+o[0]+'">'+h(o[1])+'</button>';
   });
   html+='<button class="ao'+(cur==='dk'?' ar-on':'')+'" data-c="dk">'+h(D.sg.dk)+'</button></div>';
   html+='<button class="next" id="gtGo" '+(cur==null?'disabled':'')+'>Дальше</button>';
   html+='<button class="ar-skip" id="gtSk">'+h(D.sg.skipQ)+'</button>';
   fade(html,function(){
    var go=box.querySelector('#gtGo');
    function pick(v){
     setAns(id,v);
     box.querySelectorAll('#gtOp button').forEach(function(z){z.classList.toggle('ar-on',String(z.dataset.c)===String(v==='dk'?'dk':v))});
     go.disabled=false;
     if(timer)clearTimeout(timer);
     if(v!=='dk')timer=setTimeout(function(){fwd()},700);
    }
    box.querySelectorAll('#gtOp button').forEach(function(x){x.onclick=function(){var c=x.dataset.c;pick(c==='dk'?'dk':+c)}});
    go.onclick=function(){if(ans[id]==null)return;if(timer){clearTimeout(timer);timer=null}fwd()};
    box.querySelector('#gtSk').onclick=function(){if(timer){clearTimeout(timer);timer=null}setAns(id,'skip');fwd()};
   });
  }
  function paintSgi(mid){
   var m=ME[mid];if(!m){fwd();return}
   fade(head('sgi_'+mid,m.name)+P_(h(m.intro))+'<button class="next" id="gtGo">Дальше</button><button class="ar-skip" id="gtSk">'+h(D.sg.skipBlock)+'</button>',function(){
    box.querySelector('#gtGo').onclick=function(){fwd()};
    box.querySelector('#gtSk').onclick=function(){
     m.ids.forEach(function(id){if(ans[id]==null)setAns(id,'skip')});
     /* jump after this block */
     var L=queue(),i=L.indexOf('sgi_'+mid),n=i;
     while(n<L.length&&(L[n]==='sgi_'+mid||(ME[mid].ids.indexOf(L[n])>=0)))n++;
     var to=L[n]||'done';hist.push(step);step=to;saveDraft();if(to==='done')finish();else draw();
    };
   });
  }
  function paintNone(){
   fade('<div class="al">'+h(D.sg.partName)+'</div><div class="aq">'+h(D.sg.noneTitle)+'</div><p>'+h(D.sg.noneAsk)+'</p><button class="next" id="gtY">'+esc(D.sg.noneYes)+'</button><button class="next" id="gtN" style="background:#20170e;color:#f4ecdf;border:1px solid #9e783a">'+esc(D.sg.noneNo)+'</button>',function(){
    box.querySelector('#gtY').onclick=function(){setAns('_sgCheck','yes');hist.push(step);step='sgPick';saveDraft();draw()};
    box.querySelector('#gtN').onclick=function(){setAns('_sgCheck','no');fwd()};
   });
  }
  function paintPick(limit,title,canSkip){
   limit=limit||6;
   var sel=arr(ans._sgPick),html='<div class="al">'+h(D.sg.partName)+'</div><div class="aq">'+h(title||D.sg.pickTitle)+'</div>';
   if(limit<6)html+='<p class="ar-ctx">Можно выбрать не больше '+limit+'.</p>';
   html+='<div id="gtOp">'+D.sg.mechs.map(function(m){return '<button class="ao" data-c="'+m.id+'">'+h(m.name)+'</button>'}).join('')+'</div>';
   html+='<button class="next" id="gtGo">'+esc(D.sg.pickBtn)+'</button>';
   if(canSkip)html+='<button class="ar-skip" id="gtSk">'+h(D.sg.unkSkip)+'</button>';
   fade(html,function(){
    function mark(){
     box.querySelectorAll('#gtOp button').forEach(function(x){x.classList.toggle('ar-on',sel.indexOf(x.dataset.c)>=0)});
     box.querySelector('#gtGo').disabled=canSkip?!sel.length:!sel.length;
    }
    box.querySelectorAll('#gtOp button').forEach(function(x){x.onclick=function(){var c=x.dataset.c,n=sel.indexOf(c);if(n>=0)sel.splice(n,1);else if(sel.length<limit)sel.push(c);mark()}});
    mark();
    box.querySelector('#gtGo').onclick=function(){if(!sel.length)return;setAns('_sgPick',sel.slice());fwd()};
    var sk=box.querySelector('#gtSk');if(sk)sk.onclick=function(){setAns('_sgSkip',1);fwd()};
   });
  }

  function draw(){
   if(timer){clearTimeout(timer);timer=null}
   var L=queue();
   if(L.indexOf(step)<0){
    /* шаг исчез после смены ответа — перейти к ближайшему допустимому */
    step=L[L.length-2]||'intro';
   }
   if(step==='done'){finish();return}
   if(step==='intro'){paintIntro();return}
   if(step==='g1'){paintGate(D.stages[0]);return}
   if(step==='g2'){paintGate(D.stages[1]);return}
   if(step==='g3'){paintGate(D.stages[2]);return}
   if(step==='m1'||step==='m2'||step==='m3'){fade(midHtml(step),function(){box.querySelector('#gtGo').onclick=function(){fwd()}});return}
   if(step==='sgNone'){paintNone();return}
   if(step==='sgUnk'){fade('<div class="al">'+h(D.sg.partName)+'</div><div class="aq">'+h(D.sg.unkTitle)+'</div><p>'+h(D.sg.unkAsk)+'</p><button class="next" id="gtGo">Выбрать направления</button><button class="ar-skip" id="gtSk">'+h(D.sg.unkSkip)+'</button>',function(){
     box.querySelector('#gtGo').onclick=function(){hist.push(step);step='sgPick';saveDraft();draw()};
     box.querySelector('#gtSk').onclick=function(){setAns('_sgSkip',1);fwd()};
    });return}
   if(step==='sgPick'){paintPick(ans._sgCheck==='yes'?6:2, ans._sgCheck==='yes'?D.sg.pickTitle:D.sg.unkTitle, ans._sgCheck!=='yes');return}
   if(step.indexOf('sgi_')===0){paintSgi(step.slice(4));return}
   if(/^SG\d+/.test(step)){paintSG(step);return}
   var q=Q[step];
   if(!q){fwd();return}
   if(q.kind==='one')paintOne(q);
   else if(q.kind==='multi')paintMulti(q);
   else if(q.kind==='text')paintText(q);
   else if(q.kind==='scale')paintScale(q);
   else fwd();
  }
  draw();
 }
}

G.BUILD.lab_d=function(ans){return build(ans)};
G.ITEMS.lab_d=function(){return []};
})();
