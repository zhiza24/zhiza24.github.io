/* Подсчет ведущих фоновых состояний.
   Первая реакция = 2 балла, дополнительная = 1.
   Четыре защитные посадки считаются отдельно от ресурсной опоры. */
(function(root){
'use strict';
var D=root.GBGS16;
function round(n){return Math.round(n*100)/100}
function calculate(answers,followup,meta){
 if(!D)throw new Error('GBGS16 is not loaded');
 answers=answers&&typeof answers==='object'?answers:{};
 followup=followup&&typeof followup==='object'?followup:{};
 meta=meta&&typeof meta==='object'?meta:{};
 var families={},answered=0,skipped=0,evidence=[],sphereCoverage={};
 Object.keys(D.PROFILES).forEach(function(id){
  var p=D.PROFILES[id];
  families[id]={id:id,group:p.group,title:p.title,formula:p.formula,summary:p.summary,mechanism:p.mechanism,manifestations:p.manifestations,cost:p.cost,direction:p.direction,question:p.question,points:0,primaryCount:0,secondaryCount:0,situations:[],spheres:[],evidence:[]};
 });
 D.Q.forEach(function(q){
  var a=answers[q[0]];
  if(!a||typeof a!=='object')return;
  if(a.skipped){skipped++;return}
  if(a.primary==null)return;
  answered++;
  var sphere=D.SPHERES[q[1]];
  sphereCoverage[sphere]=(sphereCoverage[sphere]||0)+1;
  function add(id,role){
   if(!families[id])return;
   var f=families[id],pts=role==='primary'?2:1;
   f.points+=pts;
   if(role==='primary')f.primaryCount++;else f.secondaryCount++;
   if(f.situations.indexOf(q[0])<0)f.situations.push(q[0]);
   if(f.spheres.indexOf(sphere)<0)f.spheres.push(sphere);
   var opt=q[3].filter(function(x){return x[1]===id})[0];
   var ev={qid:q[0],sphere:sphere,prompt:q[2],optionText:opt?opt[0]:'',role:role,points:pts};
   f.evidence.push(ev);evidence.push(Object.assign({family:id},ev));
  }
  add(a.primary,'primary');
  if(a.secondary&&a.secondary!==a.primary)add(a.secondary,'secondary');
 });
 var familyList=Object.keys(families).map(function(id){
  var f=families[id];
  f.points=round(f.points);f.sphereCount=f.spheres.length;f.situationCount=f.situations.length;
  f.share=round(f.points/48);
  f.repeatLabel=f.sphereCount?('Проявилось в '+f.sphereCount+' из 8 сфер'):'В выбранных ответах пока не проявилось';
  return f;
 });
 function group(ids){
  var list=familyList.filter(function(f){return ids.indexOf(f.id)>=0}).sort(function(a,b){return b.points-a.points||b.sphereCount-a.sphereCount||a.id.localeCompare(b.id)});
  var eligible=list.filter(function(f){return f.sphereCount>=3&&f.points>0});
  var leaders=[],status='no_clear_leader',gap=null;
  if(eligible.length){
   leaders=[eligible[0]];status='leading';
   if(eligible.length>1){
    gap=round(eligible[0].points-eligible[1].points);
    if(gap<=eligible[0].points*.10){leaders=[eligible[0],eligible[1]];status='two_close'}
   }
  }
  return {status:status,leaders:leaders.map(function(f){return f.id}),scoreGap:gap,families:list.map(function(f){return {id:f.id,points:f.points,share:f.share,sphereCount:f.sphereCount,primaryCount:f.primaryCount,secondaryCount:f.secondaryCount}})};
 }
 var protective=group(['O','D','K','R']),resource=group(['S']);
 var r={
  version:3,algoVersion:3,type:'background-state',status:answered>=12?'reviewable':'preliminary',
  at:Date.now(),completedAt:Date.now(),startedAt:meta.startedAt||null,seed:meta.seed||null,
  answers:Object.assign({},answers),followup:Object.assign({},followup),
  coverage:{answered:answered,total:D.Q.length,skipped:skipped,spheres:Object.keys(sphereCoverage).length,sphereAnswers:sphereCoverage},
  groups:{protective:protective,resource:resource},families:familyList,evidence:evidence,
  followupNeeded:{protective:protective.leaders.length>0,resource:resource.leaders.length>0},
  methodology:{primary:2,secondary:1,maxPerFamily:48,minSpheresForLead:3,closeGap:'10% от баллов лидера',note:'Рабочие правила авторского инструмента самонаблюдения; не являются валидированными психометрическими нормативами.'},
  note:'Карта показывает повторяющиеся ответы в предложенных ситуациях. Она не является диагнозом и не объясняет причины автоматически. Реальные ограничения, опасность и неравное отношение требуют отдельной оценки.'
 };
 return r;
}
function needsFollowup(result){
 var n=result&&result.followupNeeded||{};
 return {protective:!!n.protective,resource:!!n.resource,any:!!(n.protective||n.resource)};
}
root.GBackgroundState16={calculate:calculate,needsFollowup:needsFollowup};
})(window);
