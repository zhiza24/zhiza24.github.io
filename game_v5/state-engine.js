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
var FAMILIES=[
 {id:'SIG_WRT',states:['SIG','WRT']},
 {id:'MIS_TRU',states:['MIS','TRU']},
 {id:'INC_EFF',states:['INC','EFF']},
 {id:'DEF_SCO',states:['DEF','SCO']},
 {id:'STD_MAS',states:['STD','MAS']},
 {id:'MIS_AUT',states:['MIS','AUT']},
 {id:'AUT_SEC',states:['AUT','SEC']}
].map(function(f){
 var d=discriminatorFor(f.states[0],f.states[1]);
 f.question=d?d.question:'Для этой пары требуется дополнительное различение.';
 f.discriminator=d;
 f.choices=f.states.map(function(id){return {state:id,label:choiceText(d,id)}});
 return f;
});
var MAGE_CODES={A1:'DEF',A2:'SIG',A3:'ABD',A4:'MIS',A6:'INC',A8:'STD',A9:'ABD'};
var ECHO_CODES={B8:'EFF'},ECHO_FAMILIES={B1:'SIG_WRT'};
var SCALE_FAMILIES={
 KM04:['MIS_TRU'],KM05:['INC_EFF'],
 SV01:['SIG_WRT'],SV02:['DEF_SCO'],SV03:['MIS_AUT'],SV05:['SIG_WRT','STD_MAS'],
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
 var wheel=P.betray&&P.betray.start||P.betrayWheel||P.wheelTest||null;
 var values=arr(P.values&&P.values.order);
 return {
  reactionStrategy:lead?{id:lead,label:labels[lead]||lead,secondary:arr(lab.queue||calc&&calc.queue).slice(0,2),userAdjusted:lab.agree!=null,weak:lab.weak!=null?!!lab.weak:!!(calc&&calc.weak),tie:lab.tie!=null?!!lab.tie:!!(calc&&calc.tie)}:null,
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
 var mage=resultOf(P,'ego','ego');
 if(mage&&mage.answers){
  Object.keys(mage.answers).forEach(function(q){
   var code=mage.answers[q],id=MAGE_CODES[code];
   if(id)add(id,'CH','mage',q,'Ситуационный выбор Мага: '+String(code),false);
  });
 }
 /* Эхо: используем только семантически достаточно близкие соответствия. Остальные коды не приравниваем к состояниям. */
 var echo=resultOf(P,'archB','archB');
 if(echo&&echo.answers){
  Object.keys(echo.answers).forEach(function(q){
   var code=echo.answers[q],id=ECHO_CODES[code],family=ECHO_FAMILIES[code];
   if(id)add(id,'CH','echo',q,'Ситуационный выбор Эха: '+String(code),false);
   else if(family)addFamily(family,'CH','echo',q,'Ситуационный выбор Эха: '+String(code));
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
   if(!SCALE_FAMILIES[id])return;
   SCALE_FAMILIES[id].forEach(function(fid){addFamily(fid,'SR',entry.source,id,'Ведущая шкала самоотчета: '+id)});
  });
 });
 /* Первые настройки и GLead/GPAT описывают стратегии адаптации, а не состояния из каталога. Сохраняем их отдельно. */
 var fs=resultOf(P,'firstSet','firstSet');
 if(fs&&fs.v)unknown.push('«Первые настройки» описывают динамику адаптации; без отдельного различителя они не засчитываются как прямое доказательство одного из 19 состояний.');
 var kmContext=resultOf(P,'kmTest','km');
 if(kmContext&&arr(kmContext.leadingScales).indexOf('KM02')>=0)unknown.push('Шкала KM02 показывает условную самоценность, но пока не распределяется между конкретными состояниями: для этого требуется дополнительное различение.');
 if(P.betray&&P.betray.start)unknown.push('Колесо показывает конкретные формы поведения и опоры. Пока оно используется как контекст, а не как прямой балл одного из 19 состояний: соответствия требуют отдельной проверки.');
 if(P.lab)unknown.push('GLead/GPAT описывают привычный способ реагирования и его стратегию. Они учитываются отдельно и не считаются независимым подтверждением состояния.');
 unknown.push('Нарративный слой пока не оценивается автоматически. Личные записи не анализируются без отдельного явного согласия.');
 var savedProfileState=obj(P.backgroundProfile&&P.backgroundProfile.stateModel),savedAnswers=obj(savedProfileState.discriminatorAnswers),savedGoals=obj(savedProfileState.stateGoals);
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
  if(s.needsDiscriminator.length){s.status='needs_discriminator';s.confidence='гипотеза, требуется различитель';}
  /* Без NR и данных о сферах глобальная устойчивость не присваивается. */
  s.globalTrait=false;
  s.layersConfirmed=['SR','CH','NR'].filter(function(k){return s.signals[k].length>0});
  s.situationsCount=situations;
  s.spheresKnown=0;
 });
 return {
  version:'1.0.0',sourceModelVersion:DATA.version||'0.1',at:Date.now(),
  context:context,
  note:'Рабочая модель самонаблюдения; статусы предварительные, не клиническая диагностика.',
  rules:{requiredLayers:2,requiredSituations:3,globalTraitRequiresSpheres:2,highConfidenceAvailable:false},
  layers:{SR:layers.SR,CH:layers.CH,NR:layers.NR},
  states:Object.keys(states).map(function(id){return states[id]}),
  families:familyList,
  discriminatorAnswers:savedAnswers,
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
