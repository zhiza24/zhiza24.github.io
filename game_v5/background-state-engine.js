/* Фоновое состояние: расчет наблюдений по банку GIMD.
   Это авторская модель самонаблюдения, не психометрическая диагностика.
   Ситуации и эмоциональное послевкусие считаются раздельно; баллы не трактуются как диагноз. */
(function(root){
'use strict';
function list(x){return Array.isArray(x)?x:[]}
function round(x){return Math.round(x*100)/100}
function parseTags(raw){
 var out={families:{},adaptations:{},resources:{}};
 String(raw||'').split(/\s+/).filter(Boolean).forEach(function(token){
  var parts=token.split('/');
  if(parts.every(function(x){return /^S[1-8]$/.test(x)})){
   var w=1/parts.length;
   parts.forEach(function(x){out.families[x]=(out.families[x]||0)+w});
  }else if(parts.every(function(x){return /^A[1-6]$/.test(x)})){
   var aw=1/parts.length;
   parts.forEach(function(x){if(+x.slice(1)<=4)out.adaptations[x]=(out.adaptations[x]||0)+aw;else out.resources[x]=(out.resources[x]||0)+aw});
  }else if(token==='joy'||token==='help'||token==='rest'||token==='near'){
   out.resources[token]=(out.resources[token]||0)+1;
  }
 });
 return out;
}
function calculate(answers,aftertaste){
 var D=root.GIMD;if(!D)throw new Error('GIMD is not loaded');
 answers=answers&&typeof answers==='object'?answers:{};
 aftertaste=aftertaste&&typeof aftertaste==='object'?aftertaste:{};
 var families={},adaptations={},resources={},chapters={},answered=0,afterCount=0,co=[];
 Object.keys(D.FAM).forEach(function(id){families[id]={id:id,title:D.FAM[id].t,description:D.FAM[id].x,orientation:D.FAM[id].pos?'resource':'attention',weight:0,situations:[],chapters:{},aftertaste:0}});
 Object.keys(D.ADAPT).forEach(function(id){adaptations[id]={id:id,title:D.ADAPT[id].t,description:D.ADAPT[id].x,weight:0,situations:[],chapters:{}}});
 Object.keys(D.RES).forEach(function(id){resources[id]={id:id,description:D.RES[id],weight:0,situations:[]}});
 function add(target,id,weight,qid,chapter){
  if(!target[id])return;
  target[id].weight+=weight;
  if(qid&&target[id].situations.indexOf(qid)<0)target[id].situations.push(qid);
  if(chapter!=null&&target[id].chapters)target[id].chapters[chapter]=true;
 }
 list(D.Q).forEach(function(q){
  var index=answers[q[0]];
  if(index==null||!Number.isInteger(Number(index)))return;
  index=Number(index);var opt=list(q[3])[index];if(!opt)return;
  answered++;chapters[q[1]]=(chapters[q[1]]||0)+1;
  var tags=parseTags(opt[1]);
  Object.keys(tags.families).forEach(function(id){add(families,id,tags.families[id],q[0],q[1])});
  Object.keys(tags.adaptations).forEach(function(id){add(adaptations,id,tags.adaptations[id],q[0],q[1])});
  Object.keys(tags.resources).forEach(function(id){add(resources,id,tags.resources[id],q[0],q[1])});
 });
 list(D.AFTER_AT).forEach(function(qid){
  var index=aftertaste[qid];
  if(index==null||!Number.isInteger(Number(index)))return;
  index=Number(index);var opt=list(D.AFTER)[index];if(!opt)return;
  afterCount++;var tags=parseTags(opt[1]);
  Object.keys(tags.families).forEach(function(id){if(families[id])families[id].aftertaste+=tags.families[id]});
  Object.keys(tags.resources).forEach(function(id){if(resources[id])resources[id].weight+=tags.resources[id]});
 });
 var familyList=Object.keys(families).map(function(id){
  var f=families[id],ch=Object.keys(f.chapters).map(Number).sort();
  f.chapterList=ch.map(function(i){return D.CH[i]?D.CH[i].t:String(i)});
  f.chapterCount=ch.length;f.situationCount=f.situations.length;
  f.weight=round(f.weight);f.aftertaste=round(f.aftertaste);
  f.repeatLabel=ch.length>=3?'Проявляется в нескольких областях':ch.length===2?'Отмечено в двух областях':ch.length===1?'Есть отдельные сигналы':'Пока не проявилось';
  f.aftertasteLabel=f.aftertaste>=2?'Повторяется в эмоциональном послевкусии':f.aftertaste>0?'Есть отдельный сигнал в послевкусии':'';
  return f;
 }).sort(function(a,b){return b.chapterCount-a.chapterCount||b.weight-a.weight});
 var adaptationList=Object.keys(adaptations).map(function(id){var a=adaptations[id];a.chapterCount=Object.keys(a.chapters).length;a.weight=round(a.weight);return a}).filter(function(a){return a.situations.length}).sort(function(a,b){return b.weight-a.weight});
 var resourceList=Object.keys(resources).map(function(id){var r=resources[id];r.weight=round(r.weight);return r}).filter(function(r){return r.weight>0}).sort(function(a,b){return b.weight-a.weight});
 var combinations=[];
 Object.keys(D.MIX).forEach(function(key){
  var ids=key.split('+'),a=families[ids[0]],b=families[ids[1]];
  if(!a||!b||a.chapterCount<2||b.chapterCount<2)return;
  var overlap=a.chapterList.filter(function(x){return b.chapterList.indexOf(x)>=0});
  if(overlap.length)combinations.push({id:key,title:ids.map(function(id){return families[id].title}).join(' + '),description:D.MIX[key],sharedChapters:overlap});
 });
 return {
  version:1,algoVersion:1,status:answered>=12?'reviewable':'preliminary',at:Date.now(),
  coverage:{answered:answered,total:list(D.Q).length,aftertasteAnswered:afterCount,aftertasteTotal:list(D.AFTER_AT).length,chapters:Object.keys(chapters).length,chapterAnswers:chapters},
  families:familyList,adaptations:adaptationList,resources:resourceList,combinations:combinations,
  note:'Сигналы показывают повторяющиеся варианты ответов в предложенных ситуациях. Это не диагноз, не оценка личности и не доказательство причин.'
 };
}
root.GBackgroundState={calculate:calculate,parseTags:parseTags};
})(window);
