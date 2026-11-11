/* Runs synchronously in <head>, before legacy scenes can write any data. */
(function(){
'use strict';
const file=location.pathname.split('/').pop()||'index.html',q=new URLSearchParams(location.search);
let target=null,u=null;window.GReview=GRoute.isVisualReview();
for(const step of GFLOW){const [name,query]=step.u.split('?'),params=new URLSearchParams(query||'');if(name!==file)continue;if(params.has('k')&&params.get('k')!==q.get('k'))continue;if(params.has('id')&&params.get('id')!==q.get('id'))continue;u=step.u;break;}
// Hero, diary and map remain permanent resources, not an alternate route.
const resource=['index.html','cover_v1.html','map.html','diary.html','hero.html','tasks.html'].includes(file);
if(['path.html','stage.html','wheel.html','crystal.html'].includes(file)||file==='slot.html'&&q.get('id')==='map_all')target='tasks.html';
if(!u&&['scene.html','slot.html'].includes(file)&&!['info','theme'].includes(q.get('id')))target='tasks.html';
if(u&&!resource){
 const status=GRoute.status(u),preview=u==='slot.html?id=mirrors'&&q.get('preview')==='1';
 if(status==='locked')target='tasks.html?locked=1';
 if(!preview){
  if(status==='locked')target='tasks.html?locked=1';
  else if(status==='done'&&!(window.GOpening&&GOpening.active)&&!window.GReview&&!(u==='slot.html?id=mirrors'&&q.has('review')))target=GRoute.reviewUrl(u);
 }
}
// One-time cutscene before the Ego/Self dialogue; never changes route or saves.
if(!target&&u==='slot.html?id=dialog'&&!window.GReview&&GRoute.status(u)==='current'){let seen=null;try{seen=localStorage.getItem('alch_v5_cutscene_iam')}catch(e){}if(!seen)target=window.GOpening&&GOpening.active?GOpening.url('cutscene.html'):'cutscene.html';}
if(file==='scene.html'&&(!q.get('k')||q.get('k')==='start')){target=window.GOpening&&GOpening.active?GOpening.url('choose.html'):'choose.html';}
if(target){
 location.replace(target);
 // The remaining legacy document is parsed as inert template content while
 // navigation is pending. No old scripts, counters or autosaves can execute.
 document.write('<template data-route-redirect>');
}
})();
