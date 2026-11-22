/* «Зеркало внутреннего мира» v2: синтез уже собранных данных, без повторного опросника.
   Никаких причинных выводов: связи показываются как наблюдения/гипотезы с указанием источников. */
(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function arr(x){return Array.isArray(x)?x:[]}
function first(obj,keys){for(var i=0;i<keys.length;i++)if(obj&&obj[keys[i]]!=null)return obj[keys[i]];return null}
function labelEcho(code){
 var names={B1:'Доказывать свою ценность',B2:'Угадывать ожидания и подстраиваться',B3:'Проверять и контролировать',B4:'Отступать заранее',B5:'Спасать и брать чужое на себя',B6:'Защищаться и вступать в борьбу',B7:'Откладывать выбор и ждать ясности',B8:'Прояснять ситуацию и делать шаг'};
 var d=window.GARCH&&GARCH.resB&&GARCH.resB[code];return d&&d.name||names[code]||code;
}
function collect(P){
 var mag=P.ego||P.modules&&P.modules.ego&&P.modules.ego.result||null;
 var fs=P.firstSet||P.modules&&P.modules.firstSet&&P.modules.firstSet.result||null;
 var km=P.kmTest||P.modules&&P.modules.km&&P.modules.km.result||null;
 var echo=P.archB||P.modules&&P.modules.archB&&P.modules.archB.result||null;
 var wheel=P.betray&&P.betray.start||P.betrayWheel||P.modules&&P.modules.betrayWheel&&P.modules.betrayWheel.result||null;
 var out={sources:[],fragments:[],links:[],tensions:[],unknown:[]};
 if(window.GTests&&GTests.preview&&window.GBackgroundPreviewResult){P.backgroundProfile=P.backgroundProfile||{};P.backgroundProfile.backgroundState=window.GBackgroundPreviewResult}
 var background=P.backgroundProfile&&P.backgroundProfile.backgroundState;
 if(background&&background.version===1){
  source('backgroundState','Фоновое состояние','24 ситуации и 8 эмоциональных итогов');
  var BD=window.GIMD||{};
  arr(background.families).forEach(function(f){
   if(!f.situationCount&&!f.aftertaste)return;
   var meta=BD.FAM&&BD.FAM[f.id]||{},ev=arr(f.situations).map(function(id){var q=arr(BD.Q).filter(function(x){return x[0]===id})[0],index=background.answers&&background.answers[id],opt=q&&q[3]&&q[3][index];return q?q[2]+(opt?' → '+opt[0]:''):id});
   arr(f.aftertasteEvidence).forEach(function(x){ev.push('Послевкусие: '+x.text)});
   var detail=(meta.x||f.description||'Наблюдения в ситуациях.')+' '+(f.repeatLabel||'');
   if(f.aftertasteLabel)detail+=' '+f.aftertasteLabel+'.';
   out.fragments.push({domain:'Фоновое состояние',title:meta.t||f.title,detail:detail,source:'backgroundState',evidence:ev});
  });
  arr(background.adaptations).forEach(function(a){if(a.situations&&a.situations.length)out.fragments.push({domain:'Адаптация',title:a.title,detail:a.description+' Отмечено в '+a.situations.length+' ситуациях.',source:'backgroundState'})});
  arr(background.resources).forEach(function(r){if(r.weight>0)out.fragments.push({domain:'Ресурсы',title:(r.id==='A5'?'Гибкая перестройка':r.id==='A6'?'Самостоятельное начало':r.id),detail:r.description||((BD.RES||{})[r.id]||''),source:'backgroundState'})});
  if(background.coverage&&background.coverage.answered<12)out.unknown.push('Фоновое состояние: отвечено меньше половины ситуационных вопросов; картина предварительная.');
 }
 function source(id,name,detail){out.sources.push({id:id,name:name,detail:detail||''})}
 if(mag&&mag.v===2){source('mag','Маг','Повторяющийся эмоциональный итог в разных жизненных ситуациях');}
 if(fs&&fs.v){source('firstSet','Первые настройки','Детские и нынешние стратегии адаптации');}
 if(km&&km.v){source('km','Идеальный Кривой Мир','Текущие фильтры восприятия');}
 if(echo){source('echo','Эхо','Способы реагирования в ситуациях');}
 if(wheel&&Array.isArray(wheel.sectors)){source('wheel','Колесо самопредательства','Конкретные проявления в 24 ветвях');}
 if(mag&&mag.v===2){
  var D=window.GARCH||{},lead=mag.lead,phrase=lead&&D.phrase&&D.phrase[lead],ra=lead&&D.resA&&D.resA[lead],answers=mag.answers||{},ev=[];
  (D.A||[]).forEach(function(q){var code=answers[q.id];if(!code||code==='skip')return;var opt=arr(q.o).filter(function(o){return o[0]===code})[0];ev.push('Маг · '+q.h+': '+(opt?opt[1]:code))});
  arr(mag.a11).forEach(function(code,i){var opt=arr(D.A11&&D.A11.o).filter(function(o){return o[0]===code})[0];ev.push('Маг · эмоциональный итог '+(i+1)+': '+(opt?opt[1]:code))});
  var freq=['Почти никогда','Редко','Иногда','Часто','Очень часто'];
  if(mag.R!=null&&freq[mag.R])ev.push('Маг · частота похожего чувства: '+freq[mag.R]);
  var detail=lead?(ra&&ra.title?ra.title:phrase||lead)+'. Это предварительный повторяющийся эмоциональный итог, а не диагноз и не объяснение его причин.':'По ответам не выделилось одно устойчивое фоновое состояние. Это самостоятельный результат, а не отсутствие данных.';
  if(mag.period)detail+=' Период ответа: '+({P1:'последние 2–3 месяца',P2:'последний год',P3:'сложный текущий период',P4:'период не определен'})[mag.period]+'.';
  if(mag.R!=null&&freq[mag.R])detail+=' Частота по самооценке: '+freq[mag.R].toLowerCase()+'.';
  if(mag.skips!=null)detail+=' Пропущено вопросов: '+mag.skips+'.';
  out.fragments.push({domain:'Фоновое состояние',title:lead?(phrase||mag.top||lead):'Один фон пока не выделился',detail:detail,status:lead?'preliminary':'unclear',source:'mag',evidence:ev});
 }
 if(fs&&fs.v){
  var fl=arr(fs.leading),names=Object.keys(fs.outcome||{});
  names.forEach(function(n){
   var r=fs.outcome[n],c=fs.child&&fs.child[n],now=fs.now&&fs.now[n];
   out.fragments.push({domain:'Адаптация',title:n,detail:r==='kept'?'Этот способ заметен и в детских, и в нынешних ответах.':r==='weaker'?'В нынешних ответах он выражен слабее, чем в детских.':r==='changed'?'В ответах заметен переход к другой стратегии.':r==='later'?'В нынешних ответах способ заметен сильнее, чем в детских.':r==='notwas'?'В детских ответах отмечено «не было»; сейчас способ не выделился.':r==='few'?'Для сопоставления пока недостаточно ответов.':'Устойчивое совпадение не выявлено.',status:r,child:c,now:now,source:'firstSet'});
  });
  if(fl.length)out.fragments.push({domain:'Адаптация',title:'Сейчас заметнее',detail:fl.join(' · '),status:fs.status,source:'firstSet'});
 }
 if(km&&km.v){
  var scales=arr(km.scales),lead=arr(km.leadingScales),top=scales.filter(function(x){return lead.indexOf(x.id)>=0});
  if(top.length)top.forEach(function(x){out.fragments.push({domain:'Картина мира',title:x.name,detail:'В исследовании выделился этот фильтр восприятия (уровень: '+(x.level==null?'не определен':x.level)+').',status:km.status,source:'km',score:x.score})});
  else out.fragments.push({domain:'Картина мира',title:'Выраженный фильтр не выделился',detail:km.status==='insufficient'?'Ответов недостаточно для вывода.':'По текущим ответам ведущий фильтр не определился.',status:km.status,source:'km'});
 }
 var echoCodes=[];
 if(echo){
  var calc=echo;
  if((!calc.leaders||!calc.leaders.length)&&calc.answers&&window.GArch&&GArch.scoreB){try{calc=GArch.scoreB(calc.answers)}catch(e){}}
  echoCodes=arr(calc.leaders);if(calc.lead&&echoCodes.indexOf(calc.lead)<0)echoCodes.push(calc.lead);
  echoCodes.forEach(function(c){out.fragments.push({domain:'Реакции',title:labelEcho(c),detail:'Этот способ выделился в «Эхе». Он описывает ответы в предложенных ситуациях, а не постоянную черту личности.',status:calc.status,source:'echo',code:c})});
  if(!echoCodes.length)out.fragments.push({domain:'Реакции',title:'Один ведущий способ не выделился',detail:'Ответы показывают разные реакции или пока не дают устойчивого результата.',status:calc.status||'unclear',source:'echo'});
 }
 var wheelSectors=[],wheelShadowSectors=[];
 if(wheel&&Array.isArray(wheel.sectors)){
  wheel.sectors.forEach(function(sec){
   var forms=arr(sec.forms),hits=[];
   forms.forEach(function(f){
    var sh=f.shadow&&f.shadow.score,sp=f.support&&f.support.score,n=+f.answered||0;
    if(n>=2&&typeof sh==='number'&&sh>=50){hits.push({side:'shadow',title:f.shadow.title,score:sh,form:f.id});if(wheelShadowSectors.indexOf(sec.id)<0)wheelShadowSectors.push(sec.id)}
    if(n>=2&&typeof sp==='number'&&sp>=50)hits.push({side:'support',title:f.support.title,score:sp,form:f.id});
    if(n>=2&&typeof sh==='number'&&typeof sp==='number'&&sh>=50&&sp>=50){
     out.tensions.push({title:'Два способа в одной области',detail:'В ветви «'+f.title+'» заметны обе стороны. Возможно, способы меняются в зависимости от ситуации; это не ошибка и не взаимоисключающие качества.',sources:['wheel'],kind:'context'});
    }
   });
   if(hits.length){wheelSectors.push(sec.id);hits.forEach(function(h){out.fragments.push({domain:'Самопредательство',title:h.title,detail:'Отмечено в '+Math.round(h.score)+'% отвеченных ситуаций этой ветви. Это доля ответов по конкретной паре, не оценка личности.',status:'observed',source:'wheel',sector:sec.id,form:h.form,side:h.side,score:h.score})})}
  });
 }
 /* Межмодульные связи. Сопоставляем только тематически близкие сигналы. */
 var sectorToEcho={perf:['B1'],please:['B2'],ctrl:['B3'],detach:['B4'],over:['B5']};
 wheelShadowSectors.forEach(function(sec){
  var codes=sectorToEcho[sec]||[];
  codes.forEach(function(c){
   if(echoCodes.indexOf(c)>=0){
    var wName=({perf:'Перфекционизм',please:'Угождение людям',ctrl:'Гиперконтроль',detach:'Отстранение',over:'Чрезмерная отдача'})[sec]||sec;
    var wf=[];arr(wheel.sectors).forEach(function(s){if(s.id!==sec)return;arr(s.forms).forEach(function(f){if(f.shadow&&f.shadow.score>=50&&f.answered>=2)wf.push(f)})});var ev=[];var eq=window.GARCH&&GARCH.B||[];if(echo&&echo.answers)eq.forEach(function(q){var a=echo.answers[q.id];if(a===c){var opt=arr(q.o).filter(function(o){return o[0]===c})[0];ev.push('Эхо · '+(q.h||q.t||q.id)+': '+(opt?opt[1]:c))}});wf.forEach(function(f){arr(f.items).forEach(function(it){if(it.choice==='left'||it.choice==='both')ev.push('Колесо · '+it.question+' → '+it.label)})});out.links.push({title:'Два исследования указывают на близкую тему',detail:'В «Эхе» проявился способ «'+labelEcho(c)+'», а в Колесе отмечены формы из области «'+wName+'». Это независимые наблюдения в разных форматах, а не доказательство единой причины.',sources:['echo','wheel'],evidence:ev,kind:'support'});
   }
  });
 });
 var fsMap={'Замирание и ожидание':'B7','Контроль и самостоятельное удерживание':'B3','Подстройка и сохранение контакта':'B2','Уход в себя и дистанция':'B4'};
 if(fs&&fs.v){
  Object.keys(fsMap).forEach(function(n){
   var code=fsMap[n],r=fs.outcome&&fs.outcome[n];
   if(r&&r!=='few'&&r!=='notwas'&&echoCodes.indexOf(code)>=0&&fs.now&&fs.now[n]&&fs.now[n].answered>=2&&fs.now[n].mean>=2){
    var ev2=['Первые настройки · сейчас: '+n+' — среднее '+Math.round(fs.now[n].mean*100)/100+', статус: '+r];var fd=window.GTESTS&&GTESTS.fs||{},scale=['Никогда или почти никогда','Редко','Иногда','Часто','Почти всегда'];arr(fd.child).concat(arr(fd.now)).forEach(function(q){if(q.s!==n||!fs.answers||fs.answers[q.id]==null)return;var v=fs.answers[q.id],period=arr(fd.child).indexOf(q)>=0?'детство':'сейчас',ans=typeof v==='number'?(scale[v]||String(v)):v==='nr'?'Не помню':v==='nw'?'Не было':String(v);ev2.push('Первые настройки · '+period+' · '+(q.t||q.id)+': '+ans)});var eq2=window.GARCH&&GARCH.B||[];if(echo&&echo.answers)eq2.forEach(function(q){var a=echo.answers[q.id];if(a===code){var opt=arr(q.o).filter(function(o){return o[0]===code})[0];ev2.push('Эхо · '+(q.h||q.t||q.id)+': '+(opt?opt[1]:code))}});
    out.links.push({title:'Похожий ход заметен в разных исследованиях',detail:'«Первые настройки» показывают динамику стратегии «'+n+'», а «Эхо» — близкий способ реагирования: «'+labelEcho(code)+'». Это сходство описаний, не вывод о происхождении реакции.',sources:['firstSet','echo'],evidence:ev2,kind:'support'});
   }
   if(r==='changed'||r==='weaker'){
    var current=fs.leading&&fs.leading.indexOf(n)>=0;
    if(!current)out.tensions.push({title:'Изменение между детскими и нынешними ответами',detail:'В ответах по стратегии «'+n+'» заметно ослабление или изменение. Это не означает, что прежний способ исчез: разные обстоятельства могут вызывать разные реакции.',sources:['firstSet'],kind:'time'});
   }
  });
 }
 if(fs&&fs.status==='mixed')out.tensions.push({title:'Нет одной ведущей стратегии',detail:'В «Первых настройках» несколько стратегий проявились сопоставимо. Картина может зависеть от обстоятельств.',sources:['firstSet'],kind:'context'});
 if(echo&&echo.status==='mixed')out.tensions.push({title:'Разные реакции в разных ситуациях',detail:'В «Эхе» не выделился один общий способ. Это может говорить о контекстной изменчивости, а не о противоречии личности.',sources:['echo'],kind:'context'});
 if(!out.sources.length)out.unknown.push('Предыдущие исследования пока не дали доступных результатов. Зеркалу нечего сопоставлять.');
 else if(out.links.length===0)out.unknown.push('Пока нет достаточно сильных межмодульных совпадений. Отдельные наблюдения сохранены, но объединять их в общий вывод было бы преждевременно.');
 if(!mag)out.unknown.push('«Маг» еще не доступен.');
 if(!fs)out.unknown.push('«Первые настройки» еще не доступны.');
 if(!km)out.unknown.push('«Идеальный Кривой Мир» еще не доступен.');
 if(!echo)out.unknown.push('«Эхо» еще не доступно.');
 if(!wheel)out.unknown.push('Колесо самопредательства еще не доступно.');
 out.stateModel=window.GStateEngine&&GStateEngine.evaluate?GStateEngine.evaluate(P):null;
 if(out.stateModel&&out.stateModel.coverage.statesWithSignals===0)out.unknown.push('Сопоставление с каталогом 19 состояний пока не выделило прямых сигналов. Это не означает отсутствия этих состояний.');
 return out;
}
function mapSvg(data){
 var nodes=[
  ['СЕБЯ','ПРЕДСТАВЛЕНИЕ О СЕБЕ',160,43,['backgroundState','mag','firstSet','echo']],
  ['МИР','ВОСПРИЯТИЕ МИРА',260,105,['km']],
  ['ДРУГИЕ','ОТНОШЕНИЯ И КОНТАКТ',220,202,['echo','wheel']],
  ['ВЫБОР','ЖЕЛАНИЯ И ДЕЙСТВИЯ',100,202,['wheel','firstSet']],
  ['ПРАВИЛА','ПРИВЫЧНЫЕ УСТАНОВКИ',60,105,['firstSet','km']]
 ];
 var active={};data.sources.forEach(function(s){active[s.id]=true});
 var paths=nodes.map(function(n){return '<path d="M160 124L'+n[2]+' '+n[3]+'" />'}).join('');
 var circles=nodes.map(function(n){var ok=n[4].some(function(id){return !!active[id]}),cx=n[2],cy=n[3];return '<circle cx="'+cx+'" cy="'+cy+'" r="31" fill="'+(ok?'#49351d':'#201a14')+'" stroke="'+(ok?'#d4a653':'#66533a')+'" stroke-width="1.2" opacity="'+(ok?'1':'.6')+'"/><text x="'+cx+'" y="'+(cy-2)+'" fill="'+(ok?'#ffe8b2':'#a89a83')+'" text-anchor="middle" font-size="10" font-weight="700">'+n[0]+'</text><text x="'+cx+'" y="'+(cy+11)+'" fill="#c9a46a" text-anchor="middle" font-size="6.5">'+n[1]+'</text><text x="'+cx+'" y="'+(cy+22)+'" fill="#c9a46a" text-anchor="middle" font-size="8">'+(ok?'проявлено':'пока нет')+'</text>'}).join('');
 return '<div class="im-map"><svg viewBox="0 0 320 250" role="img" aria-label="Пять зеркал внутреннего мира и связи с центром"><defs><radialGradient id="imGlow"><stop stop-color="#ffe8a3" stop-opacity=".8"/><stop offset="1" stop-color="#c28b37" stop-opacity=".05"/></radialGradient></defs>'+
 '<g stroke="#9f7944" stroke-opacity=".65" stroke-width="1.4">'+paths+'</g>'+circles+
 '<circle cx="160" cy="124" r="43" fill="url(#imGlow)" stroke="#e4bd70" stroke-width="1.5"/><text x="160" y="119" fill="#ffe8b2" text-anchor="middle" font-size="12" font-weight="700">ВНУТРЕННЯЯ</text><text x="160" y="135" fill="#ffe8b2" text-anchor="middle" font-size="12" font-weight="700">АРХИТЕКТУРА</text>'+
 '</svg><div class="im-legend"><span>● Есть данные</span><span>○ Данных пока нет</span></div></div>';
}
function sourceName(id){return ({backgroundState:'Фоновое состояние',mag:'Маг',firstSet:'Первые настройки',km:'Идеальный Кривой Мир',echo:'Эхо',wheel:'Колесо самопредательства'})[id]||id}
function card(x,idx,interactive){
 var trace=arr(x.sources||[x.source]).filter(Boolean).map(function(s){return '<p>'+esc(sourceName(s))+'</p>'}).join('')+arr(x.evidence).map(function(e){return '<p class="im-evidence">'+esc(e)+'</p>'}).join('');
 return '<article class="im-card"><div class="im-card-k">'+esc(x.domain||'Отражение')+'</div><h3>'+esc(x.title)+'</h3><p>'+esc(x.detail)+'</p>'+
 '<details><summary>Откуда появилось это отражение</summary>'+trace+'</details>'+
 (interactive?'<div class="im-feedback" data-idx="'+idx+'"><b>Узнаешь это в своем опыте?</b><div class="im-actions"><button data-v="yes">Да, узнаю</button><button data-v="part">Отчасти</button><button data-v="no">Нет, не так</button><button data-v="later">Пока не знаю</button></div></div>':'')+'</article>';
}
function mount(box){
 var G=window.GTests;if(!G)return;G.css();var preview=G.preview,retake=G.retakeMode,P=G.load(),data=collect(P),feedback={},scene=0;
 var existing=P.backgroundProfile;
 function intro(){return '<span class="tag">Точка 0</span><span class="tag">Большое отражение</span><div class="im-scene"><div class="im-halo"><div class="im-oval"></div></div><div class="im-elder">Старец</div><div class="im-quote">«Отдельные отражения показывают стороны. Но только вместе они открывают рисунок».</div></div><h1>Зал зеркал</h1><p>Ты уже прошел несколько исследований. Сейчас не нужно отвечать на новый длинный тест. Мы соберем то, что уже проявилось, посмотрим, где наблюдения перекликаются, где расходятся и чего пока нельзя утверждать.</p><p class="im-muted">Каждое отражение можно открыть и посмотреть, из каких исследований оно сложилось. Никаких выводов о причинах без подтверждений.</p><button class="next" id="imNext">Войти в зал</button>'}
 function sceneHtml(){
  var html='';
  if(scene===0)html=intro();
  if(scene===1){
   html='<div class="im-stage"><div class="im-eyebrow">Первое отражение</div><h1>Пять сторон внутреннего мира</h1>'+mapSvg(data)+'<p>Здесь видны не оценки и не типы личности, а области, по которым уже есть сведения. Светятся только те зеркала, для которых найдены данные.</p>';
   var groups=['Фоновое состояние','Адаптация','Картина мира','Реакции','Самопредательство'];
   groups.forEach(function(g){var a=data.fragments.filter(function(x){return x.domain===g});if(a.length)html+='<section class="im-group"><h2>'+esc(g)+'</h2>'+a.map(function(x){return card(x,-1,false)}).join('')+'</section>'});
   if(data.stateModel){
    var active=data.stateModel.states.filter(function(x){return x.status!=='unassessed'});
    html+='<section class="im-group"><h2>Каталог 19 состояний</h2><p>Здесь отмечены только состояния, для которых нашлись прямые или неоднозначные сигналы в уже пройденных исследованиях. Это предварительные гипотезы, а не типы личности.</p>';
    if(active.length)html+=active.map(function(x){
      var count=x.layersConfirmed.length,goal=data.stateModel.stateGoals&&data.stateModel.stateGoals[x.id],selector=x.signals.CH.length>=2&&!x.needsDiscriminator.length?
       '<p>Как Вы хотите обращаться с этой стратегией?</p><div class="im-actions">'+[['Ослабить','Ослабить'],['Усилить','Усилить'],['Оставить','Оставить как есть'],['Не знаю','Пока не определился']].map(function(o){return '<button class="'+(goal===o[0]?'selected':'')+'" data-state-goal="'+esc(x.id)+'" data-goal="'+esc(o[0])+'">'+esc(o[1])+'</button>'}).join('')+'</div>':'';
      return '<article class="im-card"><div class="im-card-k">'+esc(x.valence)+' · '+esc(x.confidence)+'</div><h3>'+esc(x.name)+'</h3><p>'+esc(x.stance)+'</p><p>Сигналы: '+count+' слоя · '+x.situationsCount+' ситуаций. '+(x.needsDiscriminator.length?'Нужен различитель: '+x.needsDiscriminator.map(function(k){return (data.stateModel.families.filter(function(f){return f.id===k})[0]||{}).question||k}).join(' '):'')+'</p>'+selector+'</article>';
     }).join('');
    else html+='<p>Пока нет прямых совпадений. Каталог сохранен, но выводы не подменяются догадками.</p>';
    if(data.stateModel.families.length){
     html+='<section class="im-group"><h2>Уточнить неоднозначные сигналы</h2><p>Это короткие вопросы-различители из модели. Выберите то, что ближе к Вашему опыту. Можно оставить вопрос без ответа.</p>';
     html+=data.stateModel.families.map(function(f){
      return '<article class="im-card"><div class="im-card-k">'+esc(f.states.join(' / '))+'</div><h3>'+esc(f.question)+'</h3>'+
       '<div class="im-actions">'+f.choices.map(function(c){return '<button class="'+(f.answer===c.state?'selected':'')+'" data-discriminator="'+esc(f.id)+'" data-state="'+esc(c.state)+'">'+esc(c.label)+'</button>'}).join('')+
       '<button class="'+(!f.answer?'selected':'')+'" data-discriminator="'+esc(f.id)+'" data-state="skip">Не могу определить</button></div>'+
       (f.resolved?'<p class="im-muted">Уточнение учтено. Его можно изменить.</p>':'<p class="im-muted">Пока обе версии остаются открытыми.</p>')+'</article>';
     }).join('');
     html+='</section>';
    }
    if(active.length){
      var falsifierAnswers=data.stateModel.falsifierAnswers||{},falsifierHtml='';
      active.forEach(function(state){
       var questions=GStateEngine.falsifiers(state.id);
       if(!questions.length)return;
       falsifierHtml+='<article class="im-card"><div class="im-card-k">Проверка гипотезы · '+esc(state.name)+'</div>';
       questions.forEach(function(q,index){
        var key=state.id+'::'+q.question,answer=falsifierAnswers[key];
        falsifierHtml+='<p>'+esc(q.question)+'</p><div class="im-actions">'+
         [['yes','Да, такой пример есть'],['no','Не вспоминаю такого'],['skip','Пока не могу сказать']].map(function(o){var v=o[0]==='yes'?true:o[0]==='no'?false:null;return '<button class="'+(answer===v?'selected':'')+'" data-falsifier-state="'+esc(state.id)+'" data-falsifier-index="'+index+'" data-falsifier-value="'+o[0]+'">'+o[1]+'</button>'}).join('')+
         '</div>';
       });
       falsifierHtml+='</article>';
      });
      if(falsifierHtml)html+='<section class="im-group"><h2>Проверить обратными примерами</h2><p>Вспомните случаи, которые не укладываются в найденную гипотезу. Такие примеры не менее важны, чем совпадения. Можно пропустить любой вопрос.</p>'+falsifierHtml+'</section>';
     }
     if(data.stateModel.context){
     var cx=data.stateModel.context;
     html+='<section class="im-group"><h2>Другие слои картины</h2>';
     if(cx.reactionStrategy){
      var rp=cx.reactionStrategy.pattern;
      html+='<article class="im-card"><div class="im-card-k">GLead / GPAT · способ реагирования</div><h3>'+esc(cx.reactionStrategy.label)+'</h3><p>Это отдельный слой привычной стратегии, а не доказательство одного из 19 состояний.</p>'+
       (rp?'<p><b>Триггер:</b> '+esc(rp.trigger)+'</p><p><b>Автоматическая реакция:</b> '+esc(rp.reaction)+'</p><p><b>Скрытое правило:</b> «'+esc(rp.rule)+'»</p><p><b>Что дает:</b> '+esc(rp.benefit)+'</p><p><b>Цена:</b> '+esc(rp.cost)+'</p><p><b>Новая настройка:</b> '+esc(rp.newSetting)+'</p>':'')+
       (cx.reactionStrategy.secondary.length?'<p>Другие заметные стратегии: '+esc(cx.reactionStrategy.secondary.join(', '))+'</p>':'')+'</article>';
     }
     if(cx.mageRepeatability!=null)html+='<p>Повторяемость эмоционального фона по ответу Мага: '+esc(['почти никогда','редко','иногда','часто','очень часто'][cx.mageRepeatability]) +'. Это влияет на осторожность интерпретации, но не добавляет баллы.</p>';
      if(cx.mageFinal&&cx.mageFinal.length)html+='<p>Эмоциональные итоги Мага: '+esc(cx.mageFinal.map(function(x){return x.meaning}).join('; '))+'. Это контекст, не отдельные ситуационные подтверждения.</p>';
      if(cx.mageContext&&cx.mageContext.length)html+='<p>Другие сигналы Мага, оставленные в контексте: '+esc(cx.mageContext.map(function(x){return x.meaning}).join('; '))+'.</p>';
      if(cx.echoStrategies&&cx.echoStrategies.length)html+='<p>Стратегии реагирования по «Эху»: '+esc(cx.echoStrategies.map(function(x){return x.meaning}).join('; '))+'. Они не приравниваются к состояниям.</p>';
      html+='<p>Первые настройки: '+(cx.firstSettingsAvailable?'результат есть':'пока нет')+' · Колесо: '+(cx.wheelAvailable?'результат есть':'пока нет')+' · Исследование желаний: '+(cx.desireResearchAvailable?'результат есть':'пока нет')+'</p>';
     if(cx.values.length)html+='<p>Выбранные ценности: '+esc(cx.values.join(', '))+'</p>';
     html+='<p class="im-muted">Эти данные помогают понять контекст и подобрать действия, но не прибавляют баллы состояниям автоматически.</p></section>';
    }
    html+='<p class="im-muted">Нарратив и сферы жизни пока не учитываются в расчете: они не должны появляться в выводе без отдельного основания.</p></section>';
   }
   html+='</div><button class="next" id="imNext">Посмотреть связи</button>';
  }
  if(scene===2){
   html='<div class="im-stage"><div class="im-eyebrow">Второе отражение</div><h1>Нити между зеркалами</h1>';
   if(data.links.length)html+='<div class="im-thread"></div>'+data.links.map(function(x){return card(x,-1,false)}).join('');
   else html+='<div class="im-empty"><div class="im-oval"></div><h2>Нить пока не проявилась</h2><p>Есть отдельные отражения, но данных для надежной связи между исследованиями пока недостаточно. Мы не будем соединять их только ради красивой истории.</p></div>';
   html+='<button class="next" id="imNext">Посмотреть расхождения</button></div>';
  }
  if(scene===3){
   html='<div class="im-stage"><div class="im-eyebrow">Третье отражение</div><h1>Там, где картина меняется</h1>';
   if(data.tensions.length)html+=data.tensions.map(function(x){return card(x,-1,false)}).join('');
   else html+='<div class="im-empty"><div class="im-shards">✧</div><h2>Явных расхождений пока нет</h2><p>Это не означает, что внутри нет противоречий. Просто имеющихся результатов недостаточно, чтобы их обозначить.</p></div>';
   html+='<button class="next" id="imNext">Проверить отражения</button></div>';
  }
  if(scene===4){
   html='<div class="im-stage"><div class="im-eyebrow">Четвертое отражение</div><h1>Твое слово важно</h1><p>Игра показывает только предварительные связи. Отметь, насколько они совпадают с твоим реальным опытом. Несогласие не портит результат — оно делает карту точнее.</p>';
   var all=data.links.concat(data.tensions);
   if(all.length)html+=all.map(function(x,i){var v=feedback[i]||'';return '<article class="im-card"><h3>'+esc(x.title)+'</h3><p>'+esc(x.detail)+'</p><div class="im-actions">'+[['yes','Узнаю'],['part','Отчасти'],['no','Не про меня'],['later','Пока не знаю']].map(function(o){return '<button class="'+(v===o[0]?'selected':'')+'" data-feedback="'+i+'" data-v="'+o[0]+'">'+o[1]+'</button>'}).join('')+'</div></article>'}).join('');
   else html+='<div class="im-card"><p>Пока нет межмодульных гипотез, которые можно было бы проверить. Это честный результат, а не незавершенность игрока.</p></div>';
   html+='<button class="next" id="imNext">Собрать карту</button></div>';
  }
  if(scene===5)html=finalHtml();
  return html;
 }
 function finalHtml(){
  var confirmed=data.links.concat(data.tensions).filter(function(x,i){return feedback[i]==='yes'||feedback[i]==='part'});
  var denied=data.links.concat(data.tensions).filter(function(x,i){return feedback[i]==='no'});
  var status=data.links.length?'Связи найдены':'Пока больше отдельных отражений';
  var map=mapSvg(data);
  var modelSummary='';
  if(data.stateModel){
   var marked=data.stateModel.states.filter(function(x){return x.status!=='unassessed'});
   modelSummary='<section class="im-group"><h2>Сверка с 19 состояниями</h2><p>Есть сигналы по '+marked.length+' состояниям из 19. Устойчивые выводы пока не присваиваются: нарративный слой и сферы жизни еще не собраны.</p>'+
    (marked.length?marked.slice(0,8).map(function(x){return '<p><b>'+esc(x.name)+'</b> — '+esc(x.confidence)+(x.needsDiscriminator.length?' · требуется различитель':'')+'</p>'}).join(''):'<p>Прямых совпадений пока нет.</p>')+
    (data.stateModel.families.length?'<p>Семейства, требующие различения: '+data.stateModel.families.map(function(x){return esc(x.states.join(' / '))}).join('; ')+'.</p>':'')+'</section>';
  }
  return '<div class="im-stage"><div class="im-eyebrow">Собранное отражение</div><h1>Твоя карта внутренней архитектуры</h1>'+map+modelSummary+'<div class="im-final"><div class="im-final-num">'+data.sources.length+'</div><div>исследований вошло в карту</div><div class="im-final-line"></div><b>'+esc(status)+'</b></div>'+
  (confirmed.length?'<h2>Что ты подтвердил</h2>'+confirmed.map(function(x){return '<p>✧ '+esc(x.title)+'</p>'}).join(''):'')+
  (denied.length?'<h2>Что ты уточнил</h2>'+denied.map(function(x){return '<p>✧ '+esc(x.title)+' — не совпало с твоим опытом</p>'}).join(''):'')+
  (data.unknown.length?'<h2>Что осталось открытым</h2>'+data.unknown.map(function(x){return '<p>'+esc(x)+'</p>'}).join(''):'')+
  '<p class="im-muted">Карта не ставит диагнозов и не объясняет прошлое настоящим. Она показывает, какие наблюдения уже есть, насколько они согласуются и где требуется больше личного опыта.</p><button class="next" id="imFinish">Сохранить в дневник</button></div>';
 }
 function bind(){
  var n=box.querySelector('#imNext');if(n)n.onclick=function(){scene++;draw()};
  box.querySelectorAll('[data-feedback]').forEach(function(b){b.onclick=function(){feedback[+b.dataset.feedback]=b.dataset.v;draw()}});
  box.querySelectorAll('[data-discriminator]').forEach(function(b){b.onclick=function(){
   if(!P.backgroundProfile||typeof P.backgroundProfile!=='object')P.backgroundProfile={};
   var saved=P.backgroundProfile.stateModel=P.backgroundProfile.stateModel||{},previous=saved.discriminatorAnswers||{};
   previous[b.dataset.discriminator]=b.dataset.state==='skip'?null:b.dataset.state;
   saved.discriminatorAnswers=previous;
   persistStateModel();
   data.stateModel=GStateEngine.evaluate(P);
   draw();
  }});
  box.querySelectorAll('[data-falsifier-state]').forEach(function(b){b.onclick=function(){
    if(!P.backgroundProfile||typeof P.backgroundProfile!=='object')P.backgroundProfile={};
    var saved=P.backgroundProfile.stateModel=P.backgroundProfile.stateModel||{},answers=saved.falsifierAnswers||{};
    var state=b.dataset.falsifierState,items=GStateEngine.falsifiers(state),item=items[+b.dataset.falsifierIndex];
    if(!item)return;
    var key=state+'::'+item.question,value=b.dataset.falsifierValue;
    answers[key]=value==='yes'?true:value==='no'?false:null;
    saved.falsifierAnswers=answers;
    persistStateModel();
    data.stateModel=GStateEngine.evaluate(P);
    draw();
   }});
   box.querySelectorAll('[data-state-goal]').forEach(function(b){b.onclick=function(){
   if(!P.backgroundProfile||typeof P.backgroundProfile!=='object')P.backgroundProfile={};
   var saved=P.backgroundProfile.stateModel=P.backgroundProfile.stateModel||{},goals=saved.stateGoals||{};
   goals[b.dataset.stateGoal]=b.dataset.goal;saved.stateGoals=goals;
   persistStateModel();
   data.stateModel=GStateEngine.evaluate(P);
   draw();
  }});
  var f=box.querySelector('#imFinish');if(f)f.onclick=finish;
 }
 function persistStateModel(){
  if(!P.backgroundProfile||typeof P.backgroundProfile!=='object')P.backgroundProfile={};
  if(!P.backgroundProfile.stateModel)return;
  if(!window.GProfile)return;
  try{
   var profile=GProfile.load(),background=profile.backgroundProfile&&typeof profile.backgroundProfile==='object'?profile.backgroundProfile:{};
   background.stateModel=P.backgroundProfile.stateModel;
   GProfile.saveResult('backgroundProfile',background);
   P.backgroundProfile=background;
  }catch(e){console.warn('Не удалось сохранить ответ модели состояний',e)}
 }
 function draw(){
  var y=typeof window.scrollY==='number'?window.scrollY:0;
  box.innerHTML=sceneHtml();bind();
  if(typeof window.scrollTo==='function')window.scrollTo(0,y);
 }
 function finish(){
  var all=data.links.concat(data.tensions),rec={v:3,version:3,algoVersion:3,type:'synthesis',sources:data.sources,fragments:data.fragments,links:data.links,tensions:data.tensions,unknown:data.unknown,stateModel:data.stateModel||null,feedback:feedback,at:Date.now(),legacy:existing&&existing.answers?{answers:existing.answers,at:existing.at||null}:null};
  var lines=['Карта внутренней архитектуры','Источники: '+data.sources.map(function(x){return x.name}).join(', ')];
  var magFragment=data.fragments.filter(function(x){return x.source==='mag'})[0];if(magFragment)lines.push('Маг: '+magFragment.title+' — '+magFragment.detail+(magFragment.evidence&&magFragment.evidence.length?'\\n'+magFragment.evidence.join('\\n'):''));
  if(data.links.length)lines.push('Межмодульные связи: '+data.links.map(function(x){return x.title+' — '+x.detail}).join('\n'));
  if(data.tensions.length)lines.push('Расхождения и контекст: '+data.tensions.map(function(x){return x.title+' — '+x.detail}).join('\n'));
  if(data.unknown.length)lines.push('Открытые вопросы: '+data.unknown.join('\n'));
  if(data.stateModel){
   var marked=data.stateModel.states.filter(function(x){return x.status!=='unassessed'});
   lines.push('Каталог 19 состояний: '+marked.map(function(x){return x.id+' — '+x.confidence+' ('+x.situationsCount+' ситуаций)'}).join('; '));
   if(data.stateModel.families.length)lines.push('Требуют различения: '+data.stateModel.families.map(function(x){return x.states.join(' / ')+': '+x.question}).join('\n'));
  }
  lines.push('Отклик игрока: '+all.map(function(x,i){return x.title+': '+(feedback[i]||'не отмечено')}).join('; '));
  var diary={id:'inner_mirror',title:'Карта внутренней архитектуры',passed:'Зеркало внутреннего мира',lead:data.links.length?'Обнаружены связи между несколькими исследованиями.':'Собраны отдельные отражения; межмодульных связей пока недостаточно.',strong:data.links.map(function(x){return x.title}).join('; '),insight:data.tensions.length?data.tensions[0].title:'',insightMore:lines.join('\n'),answers:[]};
  if(!preview){
   G.store('im',rec,'Зеркало внутреннего мира: карта собрана');
   /* Отдельно сохраняем вычисленный слой в общий профиль, не заменяя прежние уровни backgroundProfile. */
   if(data.stateModel&&window.GProfile){
    try{
     var profile=GProfile.load(),background=profile.backgroundProfile&&typeof profile.backgroundProfile==='object'?profile.backgroundProfile:{};
     background.stateModel=data.stateModel;
     GProfile.saveResult('backgroundProfile',background);
    }catch(e){console.warn('Не удалось сохранить модель состояний в профиль',e)}
   }
  }
  var html='<span class="tag">Точка 0</span><span class="tag">Зеркало</span>'+finalHtml().replace('<button class="next" id="imFinish">Сохранить в дневник</button>','<p class="im-saved">Карта сохранена в дневнике.</p>');
  G.result(box,'im',{html:html,diary:diary},function(){scene=0;feedback={};draw()});
 }
 css();draw();
}
function css(){
 if(document.getElementById('im-v2-css'))return;
 var s=document.createElement('style');s.id='im-v2-css';s.textContent=
 '.im-scene{position:relative;overflow:hidden;margin:12px 0 18px;padding:25px 18px;border:1px solid #806035;border-radius:20px;text-align:center;background:radial-gradient(ellipse at 50% 28%,rgba(218,172,91,.2),transparent 55%),linear-gradient(150deg,#292016,#0e0c0a 78%)}'+
 '.im-halo{height:145px;display:grid;place-items:center;background:radial-gradient(circle,rgba(232,190,111,.18),transparent 65%)}.im-oval{width:88px;height:116px;border:2px solid #d9b56f;border-radius:50% 50% 46% 46%;background:radial-gradient(ellipse at 40% 32%,rgba(255,239,194,.55),rgba(114,81,40,.2) 58%,#17110a);box-shadow:0 0 22px rgba(235,194,119,.32),inset 0 0 24px rgba(255,224,165,.18)}'+
 '.im-elder{color:#e8c477;font-size:12px;letter-spacing:.2em;text-transform:uppercase}.im-quote{margin-top:12px;color:#f2dfbd;font:italic 19px/1.45 Georgia,serif}.im-muted{color:#bba98d;font-size:15px}.im-stage{margin-top:10px}.im-eyebrow{color:#cba25f;font-size:12px;letter-spacing:.16em;text-transform:uppercase}.im-map{margin:14px auto;padding:8px;border:1px solid rgba(201,164,106,.3);border-radius:18px;background:radial-gradient(ellipse at center,rgba(192,145,70,.12),transparent 70%),#15110d}.im-map svg{display:block;width:100%;height:auto}.im-legend{display:flex;justify-content:center;gap:16px;color:#bba98d;font-size:12px}.im-group{margin:22px 0}.im-group h2{font-size:18px;color:#e7c47d}.im-card{margin:12px 0;padding:15px;border:1px solid rgba(201,164,106,.45);border-radius:16px;background:linear-gradient(145deg,rgba(48,36,22,.8),rgba(18,16,13,.95));box-shadow:inset 0 0 20px rgba(201,164,106,.04)}.im-card-k{font-size:11px;color:#cba25f;letter-spacing:.13em;text-transform:uppercase}.im-card h3{margin:6px 0;color:#f2dfbd;font-size:18px}.im-card p{font-size:15px;line-height:1.55}.im-card details{margin-top:10px;color:#cba25f;font-size:13px}.im-card summary{cursor:pointer}.im-thread{height:3px;width:70%;margin:18px auto;background:linear-gradient(90deg,transparent,#e6bd70,transparent);box-shadow:0 0 18px #d9ad5e}.im-empty{margin:18px 0;padding:22px 14px;border:1px dashed rgba(201,164,106,.5);border-radius:16px;text-align:center;background:rgba(35,27,19,.5)}.im-empty .im-oval{margin:0 auto 14px;width:54px;height:72px}.im-shards{font-size:42px;color:#e8c477}.im-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.im-actions button{flex:1 1 42%;min-height:42px;padding:8px;border:1px solid #927144;border-radius:10px;background:#20180f;color:#f0e2c9;font:600 14px Manrope}.im-actions button.selected{background:linear-gradient(#ffe7a4,#d6a34e);color:#2b1c0c}.im-feedback{margin-top:14px;padding-top:12px;border-top:1px solid rgba(201,164,106,.2);font-size:14px}.im-final{text-align:center;padding:18px;margin:14px 0;border:1px solid #b48a49;border-radius:18px;background:radial-gradient(circle,rgba(214,166,82,.2),transparent 72%),#17110a;color:#e9d4ad}.im-final-num{font:700 46px Georgia;color:#f3d28e}.im-final-line{height:1px;width:60%;margin:12px auto;background:linear-gradient(90deg,transparent,#cba25f,transparent)}.im-saved{padding:12px;text-align:center;color:#d7bd86;border:1px solid #7b693f;border-radius:12px}';
 document.head.appendChild(s);
}
window.GInner={mount:mount,collect:collect};
})();