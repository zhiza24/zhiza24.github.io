/* Runs synchronously in <head>, before legacy scenes can write any data. */
(function(){
'use strict';
const file=location.pathname.split('/').pop()||'index.html',q=new URLSearchParams(location.search);
let target=null,u=null;window.GReview=GRoute.isVisualReview();
for(const step of GFLOW){const [name,query]=step.u.split('?'),params=new URLSearchParams(query||'');if(name!==file)continue;if(params.has('k')&&params.get('k')!==q.get('k'))continue;if(params.has('id')&&params.get('id')!==q.get('id'))continue;if(params.has('at')&&params.get('at')!==q.get('at'))continue;u=step.u;break;}
// Hero, diary and map remain permanent resources, not an alternate route.
const resource=['index.html','cover_v1.html','map.html','diary.html','hero.html','tasks.html','critical-situations.html','cognition.html','atlas.html','adaptations.html','practice.html'].includes(file);
if(['path.html','stage.html','wheel.html','crystal.html'].includes(file)||file==='slot.html'&&q.get('id')==='map_all')target='tasks.html';
if(!u&&['scene.html','slot.html'].includes(file)&&!['info','theme'].includes(q.get('id')))target='tasks.html';
const archPreview=q.get('preview')==='1'&&['ego.html','slot.html?id=arch_b','slot.html?id=arch_v','slot.html?id=arch_p','slot.html?id=arch_d','slot.html?id=km','slot.html?id=fs','slot.html?id=lab_d','slot.html?id=pi','slot.html?id=rs','slot.html?id=ct','slot.html?id=sv','slot.html?id=vsort','slot.html?id=dialog'].includes(u);
const retake=q.get('retake')==='1'&&['slot.html?id=arch_b','slot.html?id=arch_v','slot.html?id=arch_p','slot.html?id=arch_d','slot.html?id=km','slot.html?id=fs','slot.html?id=lab_d','slot.html?id=pi','slot.html?id=rs','slot.html?id=ct','slot.html?id=sv','slot.html?id=vsort'].includes(u)&&GRoute.status(u)==='done';
window.GRetake=retake;
if(u&&!resource&&!archPreview&&!retake){
 const status=GRoute.status(u),preview=(u==='slot.html?id=mirrors'||file==='breath.html')&&q.get('preview')==='1';
 if(status==='locked'&&!(preview&&file==='breath.html'))target='tasks.html?locked=1';
 if(!preview){
  if(status==='locked')target='tasks.html?locked=1';
  else if(status==='done'&&!(window.GOpening&&GOpening.active)&&!window.GReview&&!(u==='slot.html?id=mirrors'&&q.has('review')))target=GRoute.reviewUrl(u);
 }
}
// One-time cutscene before the Ego/Self dialogue; never changes route or saves.
// «Я есмь» теперь отдельный шаг маршрута после дыхания (flow.js), отдельный переход перед диалогом не нужен.
if(file==='scene.html'&&(!q.get('k')||q.get('k')==='start')){target=window.GOpening&&GOpening.active?GOpening.url('choose.html'):'choose.html';}
if(target){
 location.replace(target);
 // The remaining legacy document is parsed as inert template content while
 // navigation is pending. No old scripts, counters or autosaves can execute.
 document.write('<template data-route-redirect>');
}
})();
