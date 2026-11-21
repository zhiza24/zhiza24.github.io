/* Единая модель состояний: консервативное объединение уже сохраненных результатов.
   SR = самоотчет, CH = выбор в ситуациях, NR = нарратив.
   Нарратив не анализируется автоматически; GLead/GPAT остаются отдельным слоем стратегий. */
(function(global){
'use strict';
var DATA=global.GSTATE_DATA||{};
function discriminatorFor(a,b){
 return arr(DATA.discriminators).filter(function(x){return (x.a===a&&x.b===b)||(x.a===b&&x.b===a)})[0]||null;
}
function choiceText(d,id){
 if(!d||!d.reading)return 'Ближе к этому варианту';
 var parts=String(d.reading).split(/[.;]/),hit=parts.filter(function(x){return new RegExp('→\\s*'+id+'\\b').test(x)})[0];
 return hit?hit.split('→')[0].trim():'Ближе к этому варианту';
}
var LEGACY_FAMILY_IDS={SIG_WRT:['SIG','WRT'],MIS_TRU:['MIS','TRU'],INC_EFF:['INC','EFF'],DEF_SCO:['DEF','SCO'],STD_MAS:['STD','MAS'],MIS_AUT:['MIS','AUT'],AUT_SEC:['AUT','SEC']};
var FAMILIES=(function(){
 var pairs=arr(DATA.discriminators).map(function(d){
  var states=[d.a,d.b],legacy=Object.keys(LEGACY_FAMILY_IDS).filter(function(k){var x=LEGACY_FAMILY_IDS[k];return x[0]===states[0]&&x[1]===states[1]||x[0]===states[1]&&x[1]===states[0]})[0];
  var id=legacy||states.slice().sort().join('_');
  return {id:id,states:states,question:d.question,discriminator:d,choices:states.map(function(code){return {state:code,label:choiceText(d,code)}})};
 });
 var seen={};return pairs.filter(function(f){if(seen[f.id])return false;seen[f.id]=true;return true});
})();
var MAGE_CODES={A1:'DEF',A2:'SIG',A3:'ABD',A4:'MIS',A9:'ABD'};
var ECHO_CODES={},ECHO_FAMILIES={};
var MAGE_CONTEXT_CODES={A5:'ощущение использования',A6:'ощущение отсутствия влияния',A7:'ожидание угрозы и неопределенности',A8:'ощущение нехватки',A10:'отказ от собственных предпочтений',A11:'ощущение борьбы',A12:'внутренняя опора и выбор следующего шага'};
var ECHO_CONTEXT_CODES={B1:'доказывание ценности',B2:'угадывание ожиданий',B3:'проверка и контроль',B4:'отступление заранее',B5:'спасательство и избыточная ответственность',B6:'борьба и защита',B7:'откладывание выбора',B8:'прояснение и действие'};
var SCALE_FAMILIES={
 KM02:['DEF_SCO'],KM04:['MIS_TRU'],
 SV02:['DEF_SCO'],SV05:['STD_MAS'],
 RS05:['STD_MAS'],RS06:['MIS_TRU','MIS_AUT']
};
function arr(x){return Array.isArray(x)?x:[]}
function obj(x){return x&&typeof x==='object'?x:{}}
function uniq(a){var o={},r=[];a.forEach(function(x){if(x!=null&&!o[x]){o[x]=1;r.push(x)}});return r}
function resultOf(P,top,module){
 return P[top]||P.modules&&P.modules[module]&&P.modules[module].result||null;
}
function contextOf(P){
 var lab=obj(P.lab),calc=null;
 if(!lab.lead&&global.GCalc){try{calc=global.GCalc(P)}catch(e){}}
 var lead=lab.lead||calc&&calc.lead,labels={resp:'Гиперответственность',err:'Страх ошибки',appr:'Зависимость от одобрения',deval:'Обесценивание хорошего',others:'Ориентация на желания других',avoid:'Избегание действий'};
 var pattern=lead&&global.GPAT&&global.GPAT[lead],parts=pattern&&pattern.parts||[];
 function part(n){return parts[n]&&parts[n][1]||''}
 var wheel=P.betray&&P.betray.start||P.betrayWheel||P.wheelTest||null;
 var values=arr(P.values&&P.values.order);
 return {
  reactionStrategy:lead?{id:lead,label:labels[lead]||lead,secondary:arr(lab.queue||calc&&calc.queue).slice(0,2),userAdjusted:lab.agree!=null,weak:lab.weak!=null?!!lab.weak:!!(calc&&calc.weak),tie:lab.tie!=null?!!lab.tie:!!(calc&&calc.tie),pattern:pattern?{trigger:part(0),reaction:part(1),rule:part(2),benefit:part(3),cost:part(4),newSetting:part(5)}:null}:null,
  firstSettingsAvailable:!!P.firstSet,
  wheelAvailable:!!wheel,
  values:values.slice(0,3),
  desireResearchAvailable:!!P.desireLab
 };
}
function evaluate(P){
 P=obj(P);
 var context=contextOf(P),states={},families={},layers={SR:[],CH:[],NR:[]},unknown=[];
 arr(DATA.states).forEach(function(s){
  states[s.id]={id:s.id,name:s.name,valence:s.valence,stance:s.stance,need:s.need,gives:s.gives,costs:s.costs,
   signals:{SR:[],CH:[],NR:[]},situations:[],spheres:[],falsifiers:0,confidence:'нет данных',status:'unassessed',needsDiscriminator:[]};
 });
 FAMILIES.forEach(function(f){families[f.id]={id:f.id,states:f.states.slice(),question:f.question,evidence:[]}})
 function add(id,layer,source,situation,detail,ambiguous){
  var s=states[id];if(!s)return;
  var item={source:source,situation:situation,detail:detail||'',ambiguous:!!ambiguous,discriminator:typeof ambiguous==='string'?ambiguous:null};
  var bucket=s.signals[layer];
  if(!bucket.some(function(x){return x.source===source&&x.situation===situation}))bucket.push(item);
  s.situations=uniq(s.situations.concat([situation]));
  if(layers[layer].indexOf(source)<0)layers[layer].push(source);
 }
 function addFamily(fid,layer,source,situation,detail){
  var f=families[fid];if(!f)return;
  if(!f.evidence.some(function(x){return x.source===source&&x.situation===situation}))f.evidence.push({source:source,situation:situation,detail:detail||''});
  f.states.forEach(function(id){add(id,layer,source,situation,detail,fid);states[id].needsDiscriminator=uniq(states[id].needsDiscriminator.concat([fid]))});
 }
 /* Ситуационные ответы Магa. A11 — эмоциональный итог, не отдельная ситуация, поэтому не учитывается. */
 var mage=resultOf(P,'ego','ego'),mageRepeatability=null,mageContext=[],mageFinal=[];
 if(mage&&mage.answers){
  var repeatCode=mage.answers.A12;
  mageRepeatability=/^R[0-4]$/.test(repeatCode||'')?Number(repeatCode.slice(1)):null;
  mageFinal=arr(mage.answers.A11).map(function(code){return {code:String(code),meaning:({A1:'самокритика и стыд',A2:'потребность в признании',A3:'ощущение отвержения',A4:'настороженность к мотивам других',A5:'ощущение использования',A6:'ощущение отсутствия влияния',A7:'ожидание угрозы',A8:'ощущение нехватки',A9:'одиночество',A10:'отказ от собственных предпочтений',A11:'ощущение борьбы',A12:'внутренняя опора'}[code]||'эмоциональный итог')}});
  Object.keys(mage.answers).forEach(function(q){
   var code=mage.answers[q],id=MAGE_CODES[code];
   if(id)add(id,'CH','mage',q,'Ситуационный выбор Мага: '+String(code),false);
   else if(code&&q!=='A11'&&q!=='A12'){mageContext.push({question:q,code:String(code),meaning:MAGE_CONTEXT_CODES[code]||'контекстный ответ'});unknown.push('Код Мага '+String(code)+' в ситуации '+q+' сохранен как контекст и не засчитывается как прямое доказательство состояния.');}
  });
 }
 /* Эхо описывает способы реагирования, а не состояния. */
 var echo=resultOf(P,'archB','archB'),echoContext=[];
 if(echo&&echo.answers){
  Object.keys(echo.answers).forEach(function(q){
   var code=echo.answers[q];
   if(code&&code!=='0')echoContext.push({question:q,code:String(code),meaning:ECHO_CONTEXT_CODES[code]||'смешанная стратегия'});
  });
 }
 /* Шкалы — только слой самоотчета. Один результат шкалы считается одной областью наблюдения, а не четырьмя независимыми пунктами. */
 var scales=[
  {data:resultOf(P,'kmTest','km'),source:'km',prefix:'KM'},
  {data:resultOf(P,'selfWorth','selfWorth'),source:'selfWorth',prefix:'SV'},
  {data:resultOf(P,'respTest','respTest'),source:'respTest',prefix:'RS'}
 ];
 scales.forEach(function(entry){
  var x=entry.data;if(!x||x.status==='insufficient')return;
  arr(x.leadingScales).forEach(function(id){
   if(!SCALE_FAMILIES[id]){
    if(id!=='KM02')unknown.push('Шкала '+id+' пока не имеет точного соответствия в 19 состояниях и не участвует в их подсчете.');
    return;
   }
   SCALE_FAMILIES[id].forEach(function(fid){addFamily(fid,'SR',entry.source,id,'Ведущая шкала самоотчета: '+id)});
  });
 });
 /* Первые настройки и GLead/GPAT описывают стратегии адаптации, а не состояния из каталога. Сохраняем их отдельно. */
 var fs=resultOf(P,'firstSet','firstSet');
 if(fs&&fs.v)unknown.push('«Первые настройки» описывают динамику адаптации; без отдельного различителя они не засчитываются как прямое доказательство одного из 19 состояний.');

 if(P.betray&&P.betray.start)unknown.push('Колесо показывает конкретные формы поведения и опоры. Пока оно используется как контекст, а не как прямой балл одного из 19 состояний: соответствия требуют отдельной проверки.');
 if(P.lab)unknown.push('GLead/GPAT описывают привычный способ реагирования и его стратегию. Они учитываются отдельно и не считаются независимым подтверждением состояния.');
 unknown.push('Нарративный слой пока не оценивается автоматически. Личные записи не анализируются без отдельного явного согласия.');
 var savedProfileState=obj(P.backgroundProfile&&P.backgroundProfile.stateModel),savedAnswers=obj(savedProfileState.discriminatorAnswers),savedGoals=obj(savedProfileState.stateGoals),savedFalsifiers=obj(savedProfileState.falsifierAnswers);
 var familyList=Object.keys(families).map(function(k){return families[k]}).filter(function(f){return f.evidence.length}).map(function(f){
  var definition=FAMILIES.filter(function(x){return x.id===f.id})[0],answer=savedAnswers[f.id];
  f.question=definition?definition.question:f.question;
  f.choices=definition?definition.choices:[];
  if(f.states.indexOf(answer)>=0){
   f.answer=answer;f.resolved=true;
   f.states.forEach(function(id){
    var state=states[id];
    Object.keys(state.signals).forEach(function(layer){state.signals[layer]=state.signals[layer].filter(function(item){if(item.discriminator!==f.id)return true;if(id===answer)item.ambiguous=false;return id===answer})});
    state.needsDiscriminator=state.needsDiscriminator.filter(function(x){return x!==f.id});
    state.situations=uniq([].concat(state.signals.SR,state.signals.CH,state.signals.NR).map(function(x){return x.situation}));
   });
  }else{f.resolved=false;}
  return f;
 });
 Object.keys(states).forEach(function(id){
  var s=states[id],sr=s.signals.SR.length,ch=s.signals.CH.length,nr=s.signals.NR.length;
  var layersN=(sr?1:0)+(ch?1:0)+(nr?1:0),situations=s.situations.length;
  if(layersN>=2&&situations>=3){s.confidence='вероятно, контекст не определен';s.status='probable';}
  else if(layersN>=1||situations>=2){s.confidence='гипотеза';s.status='hypothesis';}
  else{s.confidence='нет достаточных данных';s.status='unassessed';}
  var falsifierList=arr(DATA.falsifiers).filter(function(x){return x.state===id});
  var falsifierCount=falsifierList.filter(function(x){var v=savedFalsifiers[x.state+'::'+x.question];return v===true||v===1||v==='yes'||v==='present'||v==='да'}).length;
  s.falsifiers=falsifierCount;
  s.falsifierEffect=Math.min(0.75,0.15*falsifierCount);
  if(falsifierCount>0)s.confidence+='; есть контрпример, требуется учитывать контекст';
  if(s.needsDiscriminator.length){s.status='needs_discriminator';s.confidence='гипотеза, требуется различитель';}
  if(!s.needsDiscriminator.length&&s.signals.CH.length&&!s.signals.SR.length&&!s.signals.NR.length&&(mageRepeatability===0||mageRepeatability===1)){s.status='situational';s.confidence='единичные или редкие реакции по самоотчету о повторяемости';}
  /* Без NR и данных о сферах глобальная устойчивость не присваивается. */
  s.globalTrait=false;
  s.layersConfirmed=['SR','CH','NR'].filter(function(k){return s.signals[k].length>0});
  s.situationsCount=situations;
  s.spheresKnown=0;
 });
 return {
  version:'1.0.0',sourceModelVersion:DATA.version||'0.1',at:Date.now(),
  context:Object.assign({},context,{mageRepeatability:mageRepeatability,mageFinal:mageFinal,mageContext:mageContext,echoStrategies:echoContext}),
  note:'Рабочая модель самонаблюдения; статусы предварительные, не клиническая диагностика.',
  rules:{requiredLayers:2,requiredSituations:3,globalTraitRequiresSpheres:2,highConfidenceAvailable:false},
  layers:{SR:layers.SR,CH:layers.CH,NR:layers.NR},
  states:Object.keys(states).map(function(id){return states[id]}),
  families:familyList,
  discriminatorAnswers:savedAnswers,
  falsifierAnswers:savedFalsifiers,
  stateGoals:savedGoals,
  unknown:uniq(unknown),
  coverage:{stateCount:arr(DATA.states).length,statesWithSignals:Object.keys(states).filter(function(id){return states[id].situationsCount>0}).length,narrativeAvailable:false,spheresAvailable:false}
 };
}
function getState(id){return arr(DATA.states).filter(function(x){return x.id===id})[0]||null}
function interventions(id,goal){return arr(DATA.interventions).filter(function(x){return x.state===id&&(!goal||x.goal===goal||String(x.goal||'').indexOf(goal)===0)})}
function discriminators(id){return arr(DATA.discriminators).filter(function(x){return x.a===id||x.b===id})}
function falsifiers(id){return arr(DATA.falsifiers).filter(function(x){return x.state===id})}
global.GStateEngine={data:DATA,evaluate:evaluate,getState:getState,interventions:interventions,discriminators:discriminators,falsifiers:falsifiers,families:FAMILIES};
})(typeof window!=='undefined'?window:globalThis);
