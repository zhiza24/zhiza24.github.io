/* Расчет 16-сценного исследования фонового состояния.
   Баллы описывают выборы в предложенных ситуациях, а не диагноз и не тип личности. */
(function(root){
'use strict';
var D=root.GBGS16;
function round(n){return Math.round(n*1000)/1000}
function isFamily(id){return !!(D&&D.FAM&&D.FAM[id])}
function calculate(answers,followup,meta){
 if(!D)throw new Error('GBGS16 is not loaded');
 answers=answers&&typeof answers==='object'?answers:{};
 followup=followup&&typeof followup==='object'?followup:{};
 meta=meta&&typeof meta==='object'?meta:{};
 var families={},special={depends:0,none:0},answered=0,secondaryCount=0,codedPrimary=0,sphereSeen={},evidence=[];
 Object.keys(D.FAM).forEach(function(id){
  var m=D.FAM[id];
  families[id]={id:id,group:m.group,title:m.title,description:m.description,points:0,primaryCount:0,secondaryCount:0,situations:[],spheres:[],evidence:[]};
 });
 D.Q.forEach(function(q){
  var a=answers[q[0]];
  if(!a||typeof a!=='object')return;
  var primary=a.primary,secondary=a.secondary||null;
  if(primary==null)return;
  answered++;
  var sphere=D.SPHERES[q[1]];
  sphereSeen[sphere]=1;
  if(primary==='v'){special.depends++;return}
  if(primary==='x'){special.none++;return}
  if(isFamily(primary)){
   codedPrimary++;
   var option=q[3].filter(function(o){return o[1]===primary})[0];
   var item={qid:q[0],sphere:sphere,prompt:q[2],optionText:option?option[0]:'',role:'primary'};
   families[primary].points+=1;
   families[primary].primaryCount++;
   if(families[primary].situations.indexOf(q[0])<0)families[primary].situations.push(q[0]);
   if(families[primary].spheres.indexOf(sphere)<0)families[primary].spheres.push(sphere);
   families[primary].evidence.push(item);evidence.push(Object.assign({family:primary},item));
  }
  if(isFamily(secondary)&&secondary!==primary){
   secondaryCount++;
   var option2=q[3].filter(function(o){return o[1]===secondary})[0];
   var item2={qid:q[0],sphere:sphere,prompt:q[2],optionText:option2?option2[0]:'',role:'secondary'};
   families[secondary].points+=0.5;
   families[secondary].secondaryCount++;
   if(families[secondary].situations.indexOf(q[0])<0)families[secondary].situations.push(q[0]);
   if(families[secondary].spheres.indexOf(sphere)<0)families[secondary].spheres.push(sphere);
   families[secondary].evidence.push(item2);evidence.push(Object.assign({family:secondary},item2));
  }
 });
 var familyList=Object.keys(families).map(function(id){
  var f=families[id];f.points=round(f.points);f.share=round(f.points/8);f.situationCount=f.situations.length;f.sphereCount=f.spheres.length;
  f.repeatLabel=f.sphereCount?('Сигнал отмечен в '+f.sphereCount+' из 8 сфер'):'Пока не проявился в выбранных ответах';
  return f;
 });
 function group(ids){
  var list=familyList.filter(function(f){return ids.indexOf(f.id)>=0}).sort(function(a,b){return b.points-a.points||b.sphereCount-a.sphereCount||a.id.localeCompare(b.id)});
  var eligible=list.filter(function(f){return f.sphereCount>=3&&f.points>0}),leaders=[],status='no_clear_leader',gap=null;
  if(eligible.length){
   leaders=[eligible[0]];status='leading';
   if(eligible.length>1){gap=round(eligible[0].share-eligible[1].share);if(gap<=0.125+1e-9){leaders=[eligible[0],eligible[1]];status='two_close'}}
  }
  return {status:status,leaders:leaders.map(function(f){return f.id}),scoreGap:gap,families:list.map(function(f){return {id:f.id,points:f.points,share:f.share,sphereCount:f.sphereCount,primaryCount:f.primaryCount,secondaryCount:f.secondaryCount}})};
 }
 var groups={resource:group(['S1','S2','S3','S4']),protective:group(['S5','S6','S7','S8'])};
 return {
  version:2,algoVersion:1,type:'background-state',status:'preliminary',at:Date.now(),
  startedAt:meta.startedAt||null,seed:meta.seed||null,
  answers:Object.assign({},answers),followup:Object.assign({},followup),
  coverage:{answered:answered,total:D.Q.length,codedPrimary:codedPrimary,secondary:secondaryCount,depends:special.depends,none:special.none,spheres:Object.keys(sphereSeen).length},
  special:special,groups:groups,families:familyList,evidence:evidence,
  followupNeeded:{resource:groups.resource.leaders.length>0,protective:groups.protective.leaders.length>0},
  methodology:{primary:1,secondary:0.5,normalizer:8,minSpheresForLead:3,closeGap:0.125,resourceFamilies:['S1','S2','S3','S4'],protectiveFamilies:['S5','S6','S7','S8'],note:'Рабочие правила интерпретации. Не являются валидированными психометрическими порогами.'},
  note:'Это предварительная карта повторяющихся выборов в предложенных ситуациях. Она не объясняет причины, не учитывает автоматически объективные ограничения и не является диагнозом.'
 };
}
function needsFollowup(result){
 result=result||{};
 var n=result.followupNeeded||{};
 return {resource:!!n.resource,protective:!!n.protective,any:!!(n.resource||n.protective)};
}
root.GBackgroundState16={calculate:calculate,needsFollowup:needsFollowup};
})(window);
