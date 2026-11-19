/* Дополнительная интеграция интерактивных шагов game_rebuild.
   Все результаты остаются в локальном профиле. Не заменяет авторские вопросы и шкалы. */
(function(global){
'use strict';
function E(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function P(){return GPro.load()}
function S(p){GPro.save(p)}
function next(){location.href=GRoute.advance()}
function log(p,t,x){p.log=p.log||[];p.log.push({t:Date.now(),x:t+': '+x})}
function checked(id){return document.getElementById(id)}
function val(id){var x=checked(id);return x?x.value.trim():''}
function selected(name){return [].slice.call(document.querySelectorAll('input[name="'+name+'"]:checked')).map(function(x){return x.value})}
function lead(){return GLead().lead}
function genderText(x){return typeof GS==='function'?GS(x):typeof GT==='function'?GT(x):String(x||'')}
function focusList(p){var a=p.focuses||p.valuesCore&&p.valuesCore.top3||p.values&&p.values.order||[];return a.slice(0,3)}
function button(label,id,cls){return '<button type="button" class="'+(cls||'next')+'" id="'+id+'">'+label+'</button>'}
function checkList(name,items,chosen){return items.map(function(x){return '<label class="fc-row"><input type="checkbox" name="'+name+'" value="'+E(x[0])+'" '+(chosen.indexOf(x[0])>=0?'checked':'')+'><span class="fc-tx">'+E(x[1])+'</span></label>'}).join('')}
function install(R){
var fallbackGuardGo=R.guard_go;
/* Точка 0: ресурс, тело и личное подтверждение исходной карты. */
R.source=function(){
 var p=P(),s=p.sourceCheck||{},supports=Array.isArray(p.res)?p.res:[];
 var areas=['Голова и челюсть','Шея и плечи','Грудь','Живот','Спина','Руки и ноги','Напряжение не замечаю','Не хочу отвечать'];
 var limits=[['time','Время'],['money','Деньги'],['energy','Физические силы'],['care','Обязанности и забота о других'],['support','Недостаток поддержки'],['conditions','Внешние условия'],['none','Сейчас явного ограничения нет'],['other','Другое']];
 var summary=typeof FOBS==='function'?FOBS(p):[];
 return '<span class="tag">Точка 0</span><span class="tag">Источник</span><h1>Тело, энергия и реальные условия</h1><p>Сначала мы замечали реакции и привычные правила. Теперь отделим внутренние способы реагирования от реального ресурса и обстоятельств. Низкий ресурс не означает недостаток характера или неправильный настрой.</p>'+
 '<div class="pt"><b>Что уже отмечено как опора</b><p>'+E(supports.join(', ')||'Пока не выбрано')+'</p></div>'+
 '<label>Сколько доступной энергии сейчас, от 0 до 10?</label><input id="srcEnergy" type="range" min="0" max="10" value="'+E(s.energy==null?5:s.energy)+'" oninput="document.getElementById(\'srcEnergyVal\').textContent=this.value"><p id="srcEnergyVal">'+E(s.energy==null?5:s.energy)+'</p>'+
 '<label>Где чаще замечаешь напряжение? Можно выбрать несколько.</label>'+checkList('srcBody',areas,s.tension||[]) +
 '<label>Что сейчас ограничивает твои возможности? Можно выбрать несколько.</label>'+checkList('srcLimits',limits,s.constraints||[]) +
 '<label>Что помогает восстановиться или получить поддержку?</label><textarea id="srcRecovery" rows="2" maxlength="500">'+E(s.recovery||supports.join(', '))+'</textarea>'+
 '<label>Что помогло бы увеличить доступный ресурс хотя бы на 10%?</label><textarea id="srcNeed" rows="3" maxlength="600">'+E(s.need||'')+'</textarea>'+
 '<h2>Итог Точки 0</h2><p>Посмотри на наблюдения, которые накопились. Система не будет решать за тебя, какие из них точны.</p><div class="pt">'+summary.map(function(x){return '<p><small>'+E(x.l)+'</small><br>'+E(x.t)+'</p>'}).join('')+'</div>'+
 '<label>Что из этого ты действительно узнаешь в своем опыте?</label><textarea id="srcConfirm" rows="3" maxlength="600">'+E(s.confirm||'')+'</textarea>'+
 '<label>Что не подходит или требует уточнения?</label><textarea id="srcCorrection" rows="2" maxlength="500">'+E(s.correction||'')+'</textarea>'+
 button('Сохранить и перейти к жизненным сферам','srcSave');
};
R.source_go=function(){
 var p=P(),s=p.sourceCheck||{};
 checked('srcSave').onclick=function(){
  s.energy=+val('srcEnergy');s.tension=selected('srcBody');s.constraints=selected('srcLimits');s.recovery=val('srcRecovery');s.need=val('srcNeed');s.confirm=val('srcConfirm');s.correction=val('srcCorrection');s.at=Date.now();p.sourceCheck=s;p.point0Summary={confirmed:s.confirm,correction:s.correction,at:s.at};log(p,'Источник и итог Точки 0','энергия '+s.energy+'/10; ограничения '+s.constraints.join(', '));S(p);next();
 };
};
/* Пустыня миражей: исследуем собственное желание, не назначая скрытый мотив. */
R.mirage=function(){
 var p=P(),m=p.mirage||{};
 return '<span class="tag">Точка А</span><span class="tag">Проверка желания</span><h1>Пустыня миражей</h1><p>Возьми одно желание, которое сейчас кажется важным. Не нужно заранее решать, правильное оно или чужое. Посмотрим, что именно стоит за ним и какой опыт поможет это уточнить.</p>'+
 '<label>Чего ты хочешь?</label><textarea id="mirWant" rows="2" maxlength="500">'+E(m.want||'')+'</textarea>'+
 '<label>Что, по твоему ощущению, это желание тебе даст?</label><textarea id="mirGain" rows="2" maxlength="500">'+E(m.gain||'')+'</textarea>'+
 '<label>Если бы никто не узнал о результате и не оценил его, ты все равно этого хотел бы?</label><div class="row">'+[['yes','Да'],['maybe','Не уверен / зависит'],['no','Нет'],['unknown','Пока не знаю']].map(function(x){return '<button type="button" data-mir="'+x[0]+'" class="'+(m.privateWant===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div>'+
 '<label>Чье ожидание может быть связано с этим желанием?</label><div class="row">'+[['mine','Мое'],['others','Окружающих'],['mixed','Смешанное'],['unknown','Пока не понимаю']].map(function(x){return '<button type="button" data-owner="'+x[0]+'" class="'+(m.owner===x[0]?'on':'')+'">'+x[1]+'</button>'}).join('')+'</div>'+
 '<label>Какой небольшой опыт поможет проверить, действительно ли тебе это важно?</label><textarea id="mirTest" rows="2" maxlength="500">'+E(m.test||'')+'</textarea>'+
 button('Сохранить мое исследование','mirSave');
};
R.mirage_go=function(){
 var p=P(),m=p.mirage||{};
 var priv=m.privateWant||null,owner=m.owner||null;
 document.querySelectorAll('[data-mir]').forEach(function(b){b.onclick=function(){priv=b.dataset.mir;document.querySelectorAll('[data-mir]').forEach(function(x){x.classList.toggle('on',x===b)})}});
 document.querySelectorAll('[data-owner]').forEach(function(b){b.onclick=function(){owner=b.dataset.owner;document.querySelectorAll('[data-owner]').forEach(function(x){x.classList.toggle('on',x===b)})}});
 checked('mirSave').onclick=function(){m={want:val('mirWant'),gain:val('mirGain'),privateWant:priv,owner:owner,test:val('mirTest'),at:Date.now()};p.mirage=m;log(p,'Пустыня миражей',m.want||'желание пока не сформулировано');S(p);next()};
};
/* Где повторяется схема: три выбранные ситуации, контрпример и внешнее препятствие. */
R.evidence=function(){return '<span class="tag">Точка Б</span><h1>Где повторяется схема?</h1><p>Выбери три сферы, в которых есть конкретный опыт. Можно заменить предложенные системой. В каждой ситуации отдельно отметь совпадение с гипотезой и внешние обстоятельства.</p><div id="ev"></div>'};
R.evidence_go=function(){
 var p=P(),L=lead(),w=p.wheel||[5,5,5,5,5,5,5,5],ix=w.map(function(v,i){return i}).sort(function(a,b){return w[a]-w[b]}).slice(0,3),picked=ix.map(function(i){return WK[i]}),A=[],i=0;
 function choose(){
  var old=(p.fractal&&p.fractal.evidence||[]).map(function(x){return x.sphere});
  var html='<p><b>Выбери ровно три сферы.</b></p>'+WK.map(function(k,j){return '<label class="fc-row"><input type="checkbox" name="evPick" value="'+k+'" '+(picked.indexOf(k)>=0?'checked':'')+'><span class="fc-tx">'+WN[j]+'</span></label>'}).join('')+button('Продолжить','evStart');
  checked('ev').innerHTML=html;
  checked('evStart').onclick=function(){picked=selected('evPick');if(picked.length!==3){checked('ev').insertAdjacentHTML('beforeend','<p class="fb">Выбери три сферы, чтобы сопоставить их на одинаковой основе.</p>');return}i=0;ask()};
 }
 function ask(){
  if(i>=picked.length){p=P();p.fractal=p.fractal||{v:1};p.fractal.evidence=A;p.fractal.evidenceAt=Date.now();log(p,'Проверка повторяющейся схемы',A.map(function(x){return WN[WK.indexOf(x.sphere)]}).join(', '));S(p);next();return}
  var k=picked[i],e=(GFR.evidence||{})[k]||{},t=e.installations&&e.installations[L]||{};
  checked('ev').innerHTML='<div class="pt"><small>'+WN[WK.indexOf(k)]+' · ситуация '+(i+1)+' из 3</small>'+E(GT(e.situation_q||'Вспомни конкретную ситуацию в этой сфере.'))+'</div>'+
  '<label>Что произошло? Опиши один реальный эпизод.</label><textarea id="evSituation" rows="3" maxlength="700"></textarea>'+
  '<p><b>Насколько этот эпизод подтверждает выбранную гипотезу?</b></p><div class="row"><button data-support="2">Похоже</button><button data-support="1">Отчасти</button><button data-support="0">Не похоже</button></div>'+
  '<label>Какой есть контрпример — похожая ситуация, где все сложилось иначе?</label><textarea id="evCounter" rows="2" maxlength="500"></textarea>'+
  '<label>Что здесь зависело от внешних обстоятельств, ресурсов или действий других людей?</label><textarea id="evExternal" rows="2" maxlength="500"></textarea>'+
  '<label>Что ты хочешь уточнить в своей версии?</label><textarea id="evComment" rows="2" maxlength="500"></textarea><div id="evFeedback" class="fb"></div>';
  var support=null;
  checked('ev').querySelectorAll('[data-support]').forEach(function(b){b.onclick=function(){support=+b.dataset.support;checked('ev').querySelectorAll('[data-support]').forEach(function(x){x.classList.toggle('on',x===b)});checked('evFeedback').textContent='Ответ сохранится как твоя оценка этого эпизода.';var old=checked('evNext');if(!old){checked('ev').insertAdjacentHTML('beforeend',button('Сохранить ситуацию','evNext'));checked('evNext').onclick=saveOne}}});
  function saveOne(){if(support===null)return;var rule=t.rule||'',threat=t.threat||'',benefit=t.benefit||'',cost=t.cost||'';A.push({sphere:k,situation:val('evSituation'),supports_rule:support,counterexample:val('evCounter'),external_barrier:val('evExternal'),player_comment:val('evComment'),rule:GT(rule),threat:GT(threat),benefit:GT(benefit),cost:GT(cost)});i++;ask()}
 }
 choose();
};
/* Фрактальная карта: игрок сам выбирает узнаваемую ситуацию и подтверждает/исправляет вывод. */
R.fractal=function(){
 var p=P(),L=lead(),E0=p.fractal&&p.fractal.evidence||[],st=FST(E0),r=(GFR.resource_patterns||{})[L]||{},use=(r.useful_when||[]).map(function(x){return '<li>'+E(GT(x))+'</li>'}).join(''),over=(r.overuse||[]).map(function(x){return '<li>'+E(GT(x))+'</li>'}).join('');
 return '<span class="tag">Точка Б</span><h1>Фрактальная карта</h1><p>Это не портрет, который система выносит за тебя. Выбери, какая из записанных ситуаций действительно узнаваема, а какая гипотеза пока не подтверждается.</p>'+
 '<div class="pt"><small>Текущий статус сопоставления</small>'+E(st[1])+'</div>'+E0.map(function(e,i){return '<label class="fc-row"><input type="radio" name="fractPick" value="'+i+'"><span class="fc-tx"><b>'+E(WN[WK.indexOf(e.sphere)]||e.sphere)+'</b><br>'+E(e.situation||'Ситуация не записана')+'<br><small>'+['Не похоже','Отчасти','Похоже'][e.supports_rule]+'</small></span></label>'}).join('')+
 '<label class="fc-row"><input type="radio" name="fractPick" value="none"><span class="fc-tx">Ни одна ситуация не подходит</span></label>'+
 '<label>Что именно ты узнаешь или что хочешь исправить в описании?</label><textarea id="fractNote" rows="3" maxlength="700">'+E(p.fractal&&p.fractal.recognitionNote||'')+'</textarea>'+
 '<h2>Что в этом способе было полезного</h2><p>'+E(GT(r.protect||''))+'</p><p>'+E(GT(r.ability||''))+'</p><p><b>Когда это действительно помогает</b></p><ul>'+use+'</ul><p><b>Когда способ начинает ограничивать</b></p><ul>'+over+'</ul><p><b>Как использовать ресурс иначе</b></p><p>'+E(GT(r.new_use||''))+'</p>'+button('Сохранить мою карту','fractSave');
};
R.fractal_go=function(){var p=P();checked('fractSave').onclick=function(){var choice=document.querySelector('input[name="fractPick"]:checked');p.fractal=p.fractal||{v:1};p.fractal.recognizedEvidence=choice?choice.value:null;p.fractal.recognitionNote=val('fractNote');p.fractal.status=FST(p.fractal.evidence||[])[0];p.fractal.confirmed=!!choice&&choice.value!=='none';log(p,'Фрактальная карта',p.fractal.confirmed?'ситуация '+choice.value:'пока не подтверждено');S(p);next()}};
/* Точка влияния: выбор не остается абстрактным — уменьшаем шаг под реальные ресурсы. */
R.leverage=function(){var L=lead(),P0=P(),F=(GFR.leverage||{})[L]||[];return '<span class="tag">Точка Б</span><h1>Точка влияния</h1><p>Выбери одно изменение, которое имеет смысл проверить. Затем определи минимальный вариант, время и наблюдаемый признак выполнения.</p>'+F.map(function(o,j){return '<div class="pt"><b>'+E(GT(o.title))+'</b><p>'+E(GT(o.effect))+'</p><p><small>Действие:</small> '+E(GT(o.action))+'</p><p><small>Риск:</small> '+E(GT(o.risk))+'</p><button type="button" data-lev="'+j+'">Выбираю это</button></div>'}).join('')+'<div id="levDetail"></div>'};
R.leverage_go=function(){var F=(GFR.leverage||{})[lead()]||[];document.querySelectorAll('[data-lev]').forEach(function(b){b.onclick=function(){var o=F[+b.dataset.lev];checked('levDetail').innerHTML='<div class="pt"><b>'+E(GT(o.title))+'</b><p>'+E(GT(o.action))+'</p></div><label>Маленькая версия действия, которую реально выполнить сейчас</label><textarea id="levSmall" rows="2" maxlength="500">'+E(GT(o.action))+'</textarea><label>Когда или в какой ситуации?</label><input id="levWhen" maxlength="180" placeholder="Например: в ближайший рабочий день"><label>По какому факту ты поймешь, что действие выполнено?</label><input id="levSignal" maxlength="240" placeholder="Наблюдаемый признак, не обещание результата"><label>Что может помешать и как уменьшить шаг?</label><textarea id="levLimit" rows="2" maxlength="400"></textarea>'+button('Сохранить точку влияния','levSave')+'';
 checked('levSave').onclick=function(){var p=P();p.fractal=p.fractal||{v:1};p.fractal.lever={id:+b.dataset.lev,title:GT(o.title),action:GT(o.action),effect:GT(o.effect),risk:GT(o.risk),small:val('levSmall'),when:val('levWhen'),signal:val('levSignal'),limit:val('levLimit'),at:Date.now()};log(p,'Точка влияния',p.fractal.lever.small);S(p);next()}}})};
/* Основание установки: четыре авторских вопроса + личный пример и проверка практики. */
R.found=function(){var L=lead(),F=(GTXT.found||{})[L],p=P(),summary=typeof FOBS==='function'?FOBS(p):[],focus=focusList(p);return '<span class="tag">Точка Б</span><h1>На чем держится привычное правило?</h1><div class="pt"><b>Итог Точки А</b>'+summary.map(function(x){return '<p><small>'+E(x.l)+'</small><br>'+E(x.t)+'</p>'}).join('')+(focus.length?'<p><b>Три направления:</b> '+E(focus.join(' · '))+'</p>':'')+(p.mirage&&p.mirage.want?'<p><b>Исследуемое желание:</b> '+E(p.mirage.want)+'</p>':'')+'</div><label>Что из этой карты точнее всего описывает твой опыт? Что требует уточнения?</label><textarea id="pointAReview" rows="2" maxlength="600">'+E(p.pointASummary&&p.pointASummary.confirmation||'')+'</textarea><p>Теперь исследуем основание привычного правила. Это рабочая гипотеза, а не объяснение, которое нужно принять. Отвечай по конкретному опыту.</p><div id="fq"></div>'};
R.found_go=function(){
 var L=lead(),F=(GTXT.found||{})[L],Q=[];if(!F){var old=R.__foundFallback;return}
 F.foundations.forEach(function(fd){fd.questions.forEach(function(q){Q.push([fd.id,q])})});
 var i=0,S0={},host=checked('fq');
 function ask(){if(i>=Q.length){finish();return}host.innerHTML='<div class="pt"><small>Вопрос '+(i+1)+' из '+Q.length+'</small>'+E(GS(Q[i][1].text))+'</div><div class="row"><button data-fv="2">Да</button><button data-fv="1">Отчасти</button><button data-fv="0">Нет</button></div>';host.querySelectorAll('[data-fv]').forEach(function(b){b.onclick=function(){S0[Q[i][0]]=(S0[Q[i][0]]||0)+(+b.dataset.fv);i++;ask()}})}
 function finish(){var ids=F.foundations.map(function(x){return x.id}),hits=ids.filter(function(k){return (S0[k]||0)>=3}),id=hits.length===2?'both':hits.length===1?hits[0]:'none',FO=(GTXT.fout||{})[ids[0]]||{},desc,pr;
  if(id==='both')desc=GS(FO.both);else if(id==='none')desc=GS(FO.insufficient);else{var fd=F.foundations.filter(function(x){return x.id===id})[0];desc=GS(fd.explanation)}
  pr=(GTXT.prac||{})[id==='both'?(S0[ids[1]]>S0[ids[0]]?ids[1]:ids[0]):id];
  host.innerHTML='<div class="pt"><b>'+E(id==='both'?'Оба основания заметны':id==='none'?'Основание пока не подтверждено':GS(F.foundations.filter(function(x){return x.id===id})[0].title))+'</b><p>'+E(desc)+'</p></div>'+
  '<label>Вспомни один конкретный пример. Что произошло?</label><textarea id="foundExample" rows="3" maxlength="700"></textarea>'+
  '<label>Насколько предложенная практика подходит тебе сейчас?</label><div class="row"><button data-fit="yes">Подходит</button><button data-fit="part">Частично</button><button data-fit="no">Не подходит</button></div>'+
  '<label>Что стоит изменить, чтобы практика была уместной?</label><textarea id="foundAdjust" rows="2" maxlength="500"></textarea>'+
  (pr?'<div class="pt"><b>Практики на ближайшие недели</b><p>'+E(GS(pr.days_1_7&&pr.days_1_7.task||''))+'</p><p>'+E(GS(pr.days_8_14&&pr.days_8_14.task||''))+'</p><p>'+E(GS(pr.days_15_21&&pr.days_15_21.task||''))+'</p></div>':'')+button('Сохранить и продолжить','foundSave');
  var fit=null;host.querySelectorAll('[data-fit]').forEach(function(b){b.onclick=function(){fit=b.dataset.fit;host.querySelectorAll('[data-fit]').forEach(function(x){x.classList.toggle('on',x===b)})}});
  checked('foundSave').onclick=function(){var p=P();p.lab=p.lab||{};p.lab.found=id;p.lab.foundScore=S0;p.lab.foundStatus=id==='both'?'both':id==='none'?'insufficient':'confirmed';p.lab.foundExample=val('foundExample');p.lab.foundPracticeFit=fit;p.lab.foundAdjustment=val('foundAdjust');p.lab.foundAt=Date.now();p.pointASummary={confirmation:val('pointAReview'),at:Date.now()};log(p,'Основание установки',id+'; практика '+(fit||'не оценена'));S(p);next()};
 }
 ask();
};
/* Итог Б: можно не согласиться с автоматической гипотезой и написать свою версию. */
R.pb_end=function(){var L=GLead(),p=GPAT[L.lead],lab=P().lab||{};return '<span class="tag">Точка Б</span><span class="tag">Итог</span><h1>Главное противоречие</h1><div class="pt">'+E(GContra())+'</div><p>Предложенная система версия: <b>'+E(p.n)+'</b>. Это не окончательное описание. Решение о точности остается за тобой.</p><div class="row"><button id="pbYes">Узнаю</button><button id="pbMaybe">Частично</button><button id="pbNo">Не подходит</button></div><div id="pbAlt"></div><label>Своя формулировка (если готова)</label><textarea id="pbOwn" rows="2" maxlength="500">'+E(lab.playerFormulation||'')+'</textarea>'};
R.pb_end_go=function(){
 var p=P(),L=GLead(),box=checked('pbAlt'),own=checked('pbOwn');
 function finish(agree,choice){var q=P();q.lab=q.lab||{};q.lab.agree=agree;q.lab.leadConfirmed=agree;q.lab.playerFormulation=own.value.trim();if(choice&&choice!==q.lab.lead){q.lab.queue=(q.lab.queue||[]).filter(function(x){return x!==choice});q.lab.lead=choice}log(q,'Подтверждение гипотезы',agree?'узнаю':choice?'выбрана другая версия':'не подтверждена');S(q);next()}
 checked('pbYes').onclick=function(){finish(true,null)};
 checked('pbMaybe').onclick=function(){finish(false,null)};
 checked('pbNo').onclick=function(){var q=P(),queue=(q.lab&&q.lab.queue)||[];box.innerHTML='<p>Можно выбрать другую рабочую гипотезу или оставить вывод неподтвержденным.</p>'+queue.map(function(k){return '<button type="button" data-pb="'+E(k)+'">'+E(GPAT[k].n)+'</button>'}).join('')+button('Ни одна не подходит','pbNone','secondary');box.querySelectorAll('[data-pb]').forEach(function(b){b.onclick=function(){finish(true,b.dataset.pb)}});checked('pbNone').onclick=function(){finish(false,null)}};
};
/* Разбор правила: не тест на правильность, допускает смешанный ответ и личные пояснения. */
R.sort=function(){var p=GPAT[lead()],confirmed=(P().lab||{}).agree;return '<span class="tag">Точка Б</span><h1>Разбор привычного правила</h1><p>'+(confirmed?'Ты подтвердил эту рабочую версию.':'Гипотеза пока не подтверждена полностью. Используй ее только как материал для проверки.')+'</p><p>Для каждой части можно выбрать защиту, потребность, оба аспекта или пока не определять. Свои слова важнее готовой категории.</p><div id="pp"></div><div class="fb" id="fb"></div>'};
R.sort_go=function(){
 var p=GPAT[lead()],i=0,A=[],N=[];
 function draw(){if(i>=6){var P0=P(),e=A.filter(function(a){return a==='e'}).length,sf=A.filter(function(a){return a==='s'}).length,m=A.filter(function(a){return a==='both'}).length;P0.lab=P0.lab||{};P0.lab.sort=A;P0.lab.sortNotes=N;P0.lab.sortSummary={protection:e,need:sf,mixed:m,unclear:6-e-sf-m};log(P0,'Разбор правила','защита '+e+', потребность '+sf+', смешанное '+m);S(P0);checked('pp').innerHTML='<div class="pt"><b>Твоя карта частей</b><p>Защита: '+e+' · Потребность: '+sf+' · Смешанный смысл: '+m+' · Пока не определено: '+(6-e-sf-m)+'</p><p>Это не оценка правильности. Некоторые части действительно могут одновременно защищать и выражать важную потребность.</p></div>'+button('Дальше','sortNext');checked('sortNext').onclick=next;return}
 var part=p.parts[i];checked('pp').innerHTML='<div class="pt"><small>'+E(part[0])+' · '+(i+1)+' из 6</small>'+E(part[1])+'</div><p>Что эта часть делает для тебя?</p><div class="row"><button data-sort="e">Защищает</button><button data-sort="s">Выражает потребность</button><button data-sort="both">И то и другое</button><button data-sort="u">Пока не знаю</button></div><label>Что в этой формулировке именно твое?</label><textarea id="sortNote" rows="2" maxlength="300"></textarea>';
 checked('pp').querySelectorAll('[data-sort]').forEach(function(b){b.onclick=function(){A[i]=b.dataset.sort;N[i]=val('sortNote');i++;draw()}});
 }
 draw();
};
/* Стирание старой формулы: жест необязателен, новая фраза подтверждается человеком. */
R.eraser=function(){var p=GPAT[lead()];return '<span class="tag">Точка Б</span><h1>Сними старую формулу</h1><p>Жест здесь символический. Он не означает, что привычка исчезла. Можно стереть слой пальцем или нажать кнопку, чтобы перейти сразу к выбору новой формулировки.</p><div class="er"><div class="u">'+E(GS(p.parts[5][1]))+'</div><canvas id="eraseCanvas"></canvas></div><button type="button" class="secondary" id="eraseSkip">Показать формулировку без жеста</button><div id="eraseAfter" style="display:none"><label>Предложенная новая формулировка. Можешь изменить ее своими словами.</label><textarea id="erasePhrase" rows="2" maxlength="500">'+E(GS(p.parts[5][1]))+'</textarea><label>Какое небольшое действие поможет проверить ее?</label><textarea id="eraseAction" rows="2" maxlength="500"></textarea>'+button('Сохранить новую формулировку','eraseSave')+'</div>'};
R.eraser_go=function(){
 var p=GPAT[lead()],c=checked('eraseCanvas'),ctx=c.getContext('2d'),r=c.getBoundingClientRect();c.width=Math.max(1,r.width);c.height=Math.max(1,r.height);ctx.fillStyle='#2a2018';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#c9b591';ctx.font='600 18px Manrope';ctx.textAlign='center';ctx.fillText('Старая формула: '+GS(p.parts[2][1]),c.width/2,c.height/2,c.width-28);ctx.globalCompositeOperation='destination-out';
 var shown=false,down=false,count=0;
 function reveal(){if(shown)return;shown=true;checked('eraseAfter').style.display='block';c.style.opacity='.15'}
 function erase(e){var b=c.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;ctx.beginPath();ctx.arc(x,y,26,0,Math.PI*2);ctx.fill();count++;if(count>30)reveal()}
 c.addEventListener('pointerdown',function(e){down=true;c.setPointerCapture(e.pointerId);erase(e)});
 c.addEventListener('pointermove',function(e){if(down)erase(e)});
 c.addEventListener('pointerup',function(){down=false});c.addEventListener('pointercancel',function(){down=false});
 checked('eraseSkip').onclick=reveal;
 checked('eraseSave').onclick=function(){var phrase=val('erasePhrase');if(!phrase){checked('erasePhrase').focus();return}var P0=P();P0.lab=P0.lab||{};P0.lab.newPhrase=phrase;P0.lab.newAction=val('eraseAction');P0.lab.eraserDone=true;if(window.GArts)GArts.grant(p.art,{profile:P0});log(P0,'Новая формулировка',phrase);S(P0);next()};
};
/* Страж отвечает на выбранные реплики, а не выдает одну и ту же трансформацию. */
R.guard=function(){var L=lead(),g6=(GTXT.guard6||{})[L],base=GTXT.guard||{},pat=GPAT[L]||{},parts=pat.parts||[];return '<span class="tag">Точка Б</span><span class="tag">Страж</span><h1>'+E(g6&&g6.name?GS(g6.name):GS(base.title||'Встреча со Стражем'))+'</h1><p>'+E(GS(base.intro||''))+'</p><div class="pt"><small>Твоя рабочая гипотеза</small><b>'+E(GS(pat.n||''))+'</b><p>'+E(GS(parts[2]&&parts[2][1]||''))+'</p><p>'+E(GS(parts[3]&&parts[3][1]||''))+'</p></div><p>Страж не требует уничтожить защиту. Он помогает увидеть, какую задачу она решала и какой другой ход теперь доступен.</p><div id="gd"></div>'};
R.guard_go=function(){
 var g6=(GTXT.guard6||{})[lead()];if(!g6){if(fallbackGuardGo)fallbackGuardGo();return}
 var D=g6.stages||[],i=0,A=[],host=checked('gd');
 function stage(){if(i>=D.length){finish();return}var d=D[i];host.innerHTML='<div class="pt"><small>Этап '+(i+1)+' из '+D.length+'</small>'+GS(d.guardian)+'</div>'+d.responses.map(function(o,j){return '<button type="button" class="next" data-g="'+j+'" style="text-align:left">'+GS(o.text)+'</button>'}).join('');host.querySelectorAll('[data-g]').forEach(function(b){b.onclick=function(){var o=d.responses[+b.dataset.g];A.push({stage:d.id,type:o.type,text:GS(o.text)});host.innerHTML='<div class="pt">'+GS(o.text)+'</div>'+button('Продолжить','guardContinue');checked('guardContinue').onclick=function(){i++;stage()}}})}
 function finish(){var e=A.filter(function(x){return x.type==='ego'}).length,s=A.filter(function(x){return x.type==='self'}).length,summary=e>s?'В этой встрече чаще звучала привычная защитная реакция. Она могла помогать сохранять контроль или безопасность. Теперь можно проверить, где она все еще нужна, а где появился другой выбор.':s>e?'В этой встрече чаще звучали ответы, связанные с потребностями и новым способом действовать. Это не отменяет защиту: важно замечать, в каких обстоятельствах она все еще полезна.':'В ответах сочетаются защитные реакции и новые способы выбора. Не обязательно сводить их к одному сценарию: смотри на контекст каждой ситуации.';
 var f=g6.final||{},tr=f.transformation||{},artifact=tr.artifact&&tr.artifact.id,art=tr.artifact?GS(tr.artifact.name):'';
 host.innerHTML='<div class="pt"><b>Отклик Стража</b><p>'+summary+'</p><p>'+GS(f.guardian||'')+'</p><p>'+GS(f.guardian_dialogue||'')+'</p><p>'+GS(f.player_response||'')+'</p><p><small>Прежняя роль:</small> '+E(tr.old_role||'')+'<br><small>Новая роль:</small> '+E(tr.new_role||'')+'</p><p>'+GS(f.closing||'')+'</p>'+(art?'<p><b>Артефакт:</b> '+E(art)+' — '+GS(tr.artifact.description||'')+'</p>':'')+'</div><label>Насколько это совпадает с твоим опытом?</label><div class="row"><button data-gconfirm="yes">Да</button><button data-gconfirm="part">Частично</button><button data-gconfirm="no">Нет</button></div><label>Что стоит уточнить?</label><textarea id="guardNote" rows="2" maxlength="500"></textarea>'+button('Сохранить встречу','guardSave');
 var confirmation=null;host.querySelectorAll('[data-gconfirm]').forEach(function(b){b.onclick=function(){confirmation=b.dataset.gconfirm;host.querySelectorAll('[data-gconfirm]').forEach(function(x){x.classList.toggle('on',x===b)})}});
 checked('guardSave').onclick=function(){var p=P();p.guard={answers:A,ego:e,self:s,summary:summary,confirmation:confirmation,note:val('guardNote'),at:Date.now()};if(window.GArts&&artifact)GArts.grant(artifact,{profile:p});log(p,'Встреча со Стражем',summary);S(p);next()};
 }
 stage();
};
/* Финальный замер: те же три поведенческих вопроса, что сохранены до Реактора. */
var BQ=['Я замечаю, когда включается моя установка','Я поступаю по-новому хотя бы иногда','Мне легче выбирать свое'];
R.retest=function(){
 var p=P(),R0=p.reactor28||{},base=Array.isArray(R0.baselineBehavior)&&R0.baselineBehavior.length===3;
 if((+R0.day||0)<28)return '<h1>Повторное исследование</h1><p>Сначала заверши четырехнедельный цикл Реактора.</p><a class="st" href="reactor28.html">К Реактору</a>';
 var retrospective=base?'':'<div class="pt"><b>Исходные ответы не были записаны перед циклом.</b><p>Чтобы не подставлять нулевые значения, отметь по памяти, как ты отвечал до начала практики. В сравнении этот замер будет помечен как ретроспективный.</p></div>'+BQ.map(function(q,i){return '<p>'+E(q)+' · до начала цикла</p><div class="row" data-baseq="'+i+'"><button data-v="0">Нет</button><button data-v="1">Иногда</button><button data-v="2">Да</button></div>'}).join('');
 return '<span class="tag">Финал</span><h1>Повторный замер</h1><p>Оцени сферы сейчас, не открывая исходные значения. Затем ответь на те же три поведенческих вопроса, что были перед Реактором.</p>'+retrospective+WN.map(function(n,i){return '<div>'+E(n)+': <b id="v'+i+'">?</b></div><input type="range" min="0" max="10" value="5" id="r'+i+'" data-t="0" oninput="document.getElementById(\'v'+i+'\').textContent=this.value;this.dataset.t=1;this.style.opacity=1">'}).join('')+'<h2>Поведение сейчас</h2>'+BQ.map(function(q,i){return '<p>'+E(q)+'</p><div class="row" data-q="'+i+'"><button data-v="0">Нет</button><button data-v="1">Иногда</button><button data-v="2">Да</button></div>'}).join('')+'<button class="next" id="nx">Сохранить замер</button>';
};
R.retest_go=function(){
 var nx=checked('nx');if(!nx)return;var bh=[null,null,null],base=[null,null,null],R0=P().reactor28||{},retro=!(Array.isArray(R0.baselineBehavior)&&R0.baselineBehavior.length===3);
 document.querySelectorAll('.row[data-baseq]').forEach(function(r){r.querySelectorAll('button').forEach(function(b){b.onclick=function(){base[+r.dataset.baseq]=+b.dataset.v;r.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b)})}})});
 document.querySelectorAll('.row[data-q]').forEach(function(r){r.querySelectorAll('button').forEach(function(b){b.onclick=function(){r.querySelectorAll('button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');bh[+r.dataset.q]=+b.dataset.v}})});
 nx.onclick=function(){
  var miss=[].filter.call(document.querySelectorAll('input[id^=r]'),function(e){return e.dataset.t!=='1'}).length+bh.filter(function(x){return x===null}).length+(retro?base.filter(function(x){return x===null}).length:0);
  if(miss){nx.textContent='Осталось ответить: '+miss;return}
  var p=P(),R0=p.reactor28||{};if(retro){R0.baselineBehavior=base;R0.baselineRetrospective=true;p.reactor28=R0}
  p.retest={wheel:WN.map(function(_,i){return +checked('r'+i).value}),beh:bh,baselineBeh:R0.baselineBehavior||[],baselineRetrospective:!!R0.baselineRetrospective,date:Date.now(),d:new Date().toLocaleDateString('ru')};
  log(p,'Повторный замер','сохранены 8 сфер и 3 поведенческих вопроса');S(p);next();
 };
};
R.compare=function(){var p=P(),a=p.wheel||[],b=(p.retest||{}).wheel||[],bh=(p.retest||{}).beh||[],base=(p.reactor28||{}).baselineBehavior||[];if(!b.length)return '<h1>Было и стало</h1><p>Сначала пройди повторный замер.</p><a class="st" href="slot.html?id=retest">К повторному замеру</a>';var f=focusList(p);return '<span class="tag">Финал</span><h1>Было и стало</h1><p>Сферы сравниваются с исходной оценкой в начале маршрута. Поведенческие вопросы — с ответами перед началом Реактора. Это две разные точки отсчета. Разница в цифрах не доказывает, что перемена произошла из-за одной практики: на результат влияют обстоятельства, ресурсы и действия других людей.</p>'+WN.map(function(n,i){var x=a[i]==null?null:+a[i],y=+b[i],d=x==null?null:y-x;return '<div class="pt">'+E(n)+': '+(x==null?'нет исходной оценки':x)+' → <b>'+y+'</b>'+(d===null?'':(' ('+(d>0?'+':'')+d+')'))+'</div>'}).join('')+'<h2>Поведенческие вопросы</h2>'+BQ.map(function(q,i){return '<div class="pt">'+E(q)+'<br>До Реактора'+((p.reactor28||{}).baselineRetrospective?' (по памяти)':'')+': '+['Нет','Иногда','Да'][base[i]??0]+' · После 28 дней: '+['Нет','Иногда','Да'][bh[i]??0]+'</div>'}).join('')+'<h2>Три направления</h2>'+[0,1,2].map(function(i){return '<label>'+E(f[i]||('Направление '+(i+1)))+' — какой конкретный пример нового выбора появился?</label><textarea id="cmpEx'+i+'" rows="2" maxlength="500">'+E((p.retest.examples||[])[i]||'')+'</textarea>'}).join('')+'<label>Какие внешние обстоятельства повлияли на этот период?</label><textarea id="cmpContext" rows="2" maxlength="600">'+E(p.retest.context||'')+'</textarea><label>Насколько ты удовлетворен тем, что удалось проверить?</label><div class="row">'+[['0','Пока не удовлетворен'],['1','Частично'],['2','В целом да']].map(function(x){return '<button type="button" data-sat="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div><label>Что хочешь продолжить или изменить?</label><textarea id="cmpNext" rows="2" maxlength="500">'+E(p.retest.nextStep||'')+'</textarea>'+button('Сохранить сравнение','cmpSave')};
R.compare_go=function(){if(!checked('cmpSave'))return;var sat=null;document.querySelectorAll('[data-sat]').forEach(function(b){b.onclick=function(){sat=b.dataset.sat;document.querySelectorAll('[data-sat]').forEach(function(x){x.classList.toggle('on',x===b)})}});checked('cmpSave').onclick=function(){var p=P();p.retest.examples=[0,1,2].map(function(i){return val('cmpEx'+i)});p.retest.context=val('cmpContext');p.retest.satisfaction=sat;p.retest.nextStep=val('cmpNext');p.retest.comparedAt=Date.now();log(p,'Сравнение до и после','личные примеры и внешние обстоятельства сохранены');S(p);next()}};
/* Финальный экран: личная сводка, артефакты и выбранное продолжение. */
var oldEnd=R.end,oldEndGo=R.end_go;
R.end=function(){var html=oldEnd(),p=P();if(html.indexOf('Путь собран')<0)return html;var summary=typeof FOBS==='function'?FOBS(p):[],arts=(Array.isArray(p.arts)?p.arts:[]).map(function(a){return typeof a==='string'?(window.GArts&&GArts.label?GArts.label(a):a):(a.name||a.title||'')}).filter(Boolean);var weeks=p.reactor28&&p.reactor28.weeklyReviews||{};return html.replace('<button class="next" id="nx">','<h2>Что ты собрал</h2>'+summary.map(function(x){return '<div class="pt"><small>'+E(x.l)+'</small>'+E(x.t)+'</div>'}).join('')+'<h2>Артефакты пути</h2><p>'+E(arts.join(', ')||'Артефакты пока не отмечены')+'</p><h2>Итоги четырех недель</h2>'+Object.keys(weeks).sort().map(function(k){return '<div class="pt"><small>Неделя '+k+'</small>'+E(weeks[k].text||'')+'</div>'}).join('')+'<div class="pt"><b>Твой следующий шаг</b><p>'+E(p.retest&&p.retest.nextStep||'Можно выбрать продолжение позже. Завершение круга не требует немедленно ставить новую цель.')+'</p></div><button class="next" id="nx">')};
R.end_go=function(){if(typeof oldEndGo==='function')oldEndGo();var nx=checked('nx');if(!nx)return;var old=nx.onclick;nx.onclick=function(e){var p=P();p.finalConfirm={at:Date.now(),reviewed:true};S(p);return old&&old.call(this,e)}};
}
global.GComplete={install:install};
})(window);
