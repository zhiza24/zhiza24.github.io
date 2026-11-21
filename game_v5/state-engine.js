/* Единая модель состояний: консервативное объединение уже сохраненных результатов.
   SR = самоотчет, CH = выбор в ситуациях, NR = нарратив.
   Нарратив не анализируется автоматически; GLead/GPAT остаются отдельным слоем стратегий. */
(function(global){
'use strict';
var DATA=global.GSTATE_DATA||{};
var FAMILIES=[
 {id:'SIG_DEF',states:['SIG','DEF'],scales:{KM02:1},question:'Что сильнее задевает: отсутствие признания вклада или риск, что увидят тебя настоящего?'},
 {id:'SIG_WRT',states:['SIG','WRT'],scales:{SV01:1,SV05:1},question:'Как долго отсутствие признания влияет на отношение к себе?'},
 {id:'MIS_TRU',states:['MIS','TRU'],scales:{KM04:1,RS06:1},question:'Осторожность опирается на конкретные факты и меняется ли при другом поведении человека?'},
 {id:'INC_EFF',states:['INC','EFF'],scales:{KM05:1},question:'Когда не знаешь, как сделать, первая мысль «не справлюсь» или «как разобраться»?'},
 {id:'DEF_SCO',states:['DEF','SCO'],scales:{SV02:1},question:'После ошибки сильнее стыд и желание спрятаться или ответственность без самонаказания?'},
 {id:'STD_MAS',states:['STD','MAS'],scales:{RS05:1,SV05:1},question:'Ты продолжаешь улучшать результат из страха несовершенства или из интереса, получая удовлетворение?'},
 {id:'MIS_TRU_AUT',states:['MIS','TRU','AUT'],scales:{SV03:1,RS06:1},question:'От помощи отказываешься из-за страха подвоха, потому что доверяешь по фактам или потому что действительно предпочитаешь справляться сам?'}
];
var MAGE_CODES={A1:'DEF',A2:'SIG',A3:'ABD',A4:'MIS',A6:'INC',A8:'STD',A9:'ABD'};
var ECHO_CODES={B8:'EFF'},ECHO_FAMILIES={B1:'SIG_DEF'};
var SCALE_FAMILIES={
 KM02:['SIG_DEF'],KM04:['MIS_TRU'],KM05:['INC_EFF'],
 SV01:['SIG_WRT'],SV02:['DEF_SCO'],SV03:['MIS_TRU_AUT'],SV05:['SIG_WRT','STD_MAS'],
 RS05:['STD_MAS'],RS06:['MIS_TRU_AUT']
};
function arr(x){return Array.isArray(x)?x:[]}
function obj(x){return x&&typeof x==='object'?x:{}}
function uniq(a){var o={},r=[];a.forEach(function(x){if(x!=null&&!o[x]){o[x]=1;r.push(x)}});return r}
function resultOf(P,top,module){
 return P[top]||P.modules&&P.modules[module]&&P.modules[module].result||null;
}
function evaluate(P){
 P=obj(P);
 var states={},families={},layers={SR:[],CH:[],NR:[]},unknown=[];
 arr(DATA.states).forEach(function(s){
  states[s.id]={id:s.id,name:s.name,valence:s.valence,stance:s.stance,need:s.need,gives:s.gives,costs:s.costs,
   signals:{SR:[],CH:[],NR:[]},situations:[],spheres:[],falsifiers:0,confidence:'нет данных',status:'unassessed',needsDiscriminator:[]};
 });
 FAMILIES.forEach(function(f){families[f.id]={id:f.id,states:f.states.slice(),question:f.question,evidence:[]}})
 function add(id,layer,source,situation,detail,ambiguous){
  var s=states[id];if(!s)return;
  var item={source:source,situation:situation,detail:detail||'',ambiguous:!!ambiguous};
  var bucket=s.signals[layer];
  if(!bucket.some(function(x){return x.source===source&&x.situation===situation}))bucket.push(item);
  s.situations=uniq(s.situations.concat([situation]));
  if(layers[layer].indexOf(source)<0)layers[layer].push(source);
 }
 function addFamily(fid,layer,source,situation,detail){
  var f=families[fid];if(!f)return;
  if(!f.evidence.some(function(x){return x.source===source&&x.situation===situation}))f.evidence.push({source:source,situation:situation,detail:detail||''});
  f.states.forEach(function(id){add(id,layer,source,situation,detail,true);states[id].needsDiscriminator=uniq(states[id].needsDiscriminator.concat([fid]))});
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
 var fs=resultOf(P,'firstSet','firstSet'),lead=global.GLead?null:null;
 if(fs&&fs.v)unknown.push('«Первые настройки» описывают динамику адаптации; без отдельного различителя они не засчитываются как прямое доказательство одного из 19 состояний.');
 if(P.betray&&P.betray.start)unknown.push('Колесо показывает конкретные формы поведения и опоры. Пока оно используется как контекст, а не как прямой балл одного из 19 состояний: соответствия требуют отдельной проверки.');
 if(P.lab)unknown.push('GLead/GPAT описывают привычный способ реагирования и его стратегию. Они учитываются отдельно и не считаются независимым подтверждением состояния.');
 unknown.push('Нарративный слой пока не оценивается автоматически. Личные записи не анализируются без отдельного явного согласия.');
 var familyList=Object.keys(families).map(function(k){return families[k]}).filter(function(f){return f.evidence.length});
 Object.keys(states).forEach(function(id){
  var s=states[id],sr=s.signals.SR.length,ch=s.signals.CH.length,nr=s.signals.NR.length;
  var layersN=(sr?1:0)+(ch?1:0)+(nr?1:0),situations=s.situations.length;
  if(layersN>=2&&situations>=3){s.confidence='вероятно';s.status='probable';}
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
  note:'Рабочая модель самонаблюдения; статусы предварительные, не клиническая диагностика.',
  rules:{requiredLayers:2,requiredSituations:3,globalTraitRequiresSpheres:2,highConfidenceAvailable:false},
  layers:{SR:layers.SR,CH:layers.CH,NR:layers.NR},
  states:Object.keys(states).map(function(id){return states[id]}),
  families:familyList,
  unknown:uniq(unknown),
  coverage:{stateCount:arr(DATA.states).length,statesWithSignals:Object.keys(states).filter(function(id){return states[id].situationsCount>0}).length,narrativeAvailable:false,spheresAvailable:false}
 };
}
function getState(id){return arr(DATA.states).filter(function(x){return x.id===id})[0]||null}
function interventions(id,goal){return arr(DATA.interventions).filter(function(x){return x.state===id&&(!goal||x.goal===goal)})}
global.GStateEngine={data:DATA,evaluate:evaluate,getState:getState,interventions:interventions,families:FAMILIES};
})(typeof window!=='undefined'?window:globalThis);
