/* Маршрут хранит посещение и подтвержденное завершение раздельно. */
(function(){
'use strict';
const K='alch_v5_profile';
function relocate(p){p=p||{};const f=p.flow;if(!f)return p;let ch=false;if(f.current==='scene.html?k=start'){f.current='choose.html';ch=true}if(f.last==='scene.html?k=start'){f.last='choose.html';ch=true}
 if(f.current==='scene.html?k=road'){f.current='bridge.html';ch=true}if(f.last==='scene.html?k=road'){f.last='bridge.html';ch=true}
 if(f.current==='sum.html'){f.current='slot.html?id=dialog';ch=true}if(f.last==='sum.html'){f.last='slot.html?id=dialog';ch=true}
 /* Фонари убраны из маршрута, их место заняла дыхательная пауза. Выданный «Фонарь» остается.
    Заставка «Я есмь» стала шагом маршрута после дыхания; уже просмотренная считается пройденной. */
 const B='breath.html?at=p0',C='cutscene.html';f.completed=f.completed||{};if(f.current==='lanterns.html'){f.current=B;ch=true}if(f.last==='lanterns.html'){f.last=B;ch=true}if(f.completed['lanterns.html']&&!f.completed[B]){f.completed[B]=f.completed['lanterns.html'];ch=true}
 let seen=null;try{seen=localStorage.getItem('alch_v5_cutscene_iam')}catch(e){}if(seen&&f.completed[B]&&!f.completed[C]&&f.current!==B&&f.current!==C){f.completed[C]=+seen||Date.now();ch=true}/* Новые шаги большого теста: если игрок уже прошел что-то дальше по маршруту, шаг не возвращает его назад. */
 const FL=window.GFLOW||[];['slot.html?id=arch_b','slot.html?id=arch_v','slot.html?id=arch_p','slot.html?id=arch_d','slot.html?id=km','slot.html?id=fs','slot.html?id=lab_d','slot.html?id=pi','slot.html?id=rs','slot.html?id=ct','slot.html?id=sv','slot.html?id=vsort','wish.html','betray.html','slot.html?id=bg16','slot.html?id=mechanism','slot.html?id=im'].forEach(u=>{const i=FL.findIndex(x=>x.u===u);if(i<0||f.completed[u])return;const currentIndex=FL.findIndex(x=>x.u===f.current),laterSeen=currentIndex>i||FL.slice(i+1).some(x=>f.completed[x.u]||f.visited&&f.visited[x.u]);if(laterSeen){f.completed[u]=Date.now();f.archSkipped=f.archSkipped||{};f.archSkipped[u]=1;ch=true}});
 if(ch){try{localStorage.setItem(K,JSON.stringify(p))}catch(e){}}return p}
function load(){try{return relocate(JSON.parse(localStorage.getItem(K))||{})}catch(e){return {}}}
function save(p){localStorage.setItem(K,JSON.stringify(p))}
function index(u){return (window.GFLOW||[]).findIndex(x=>x.u===u)}
function currentUrl(){const i=window.gIdx?gIdx():-1;return i<0?null:GFLOW[i].u}
function mirrorReadonly(){const q=new URLSearchParams(location.search);return q.get('id')==='mirrors'&&(q.get('preview')==='1'||q.has('review'));}
function visualReview(u){return ['cutscene.html','index.html','form.html','elder.html','sum.html','fin.html','scene.html?k=ego','scene.html?k=pa','scene.html?k=pa_test','slot.html?id=source','slot.html?id=pa_end','slot.html?id=pb_intro','slot.html?id=pc_intro','slot.html?id=mirage'].includes(u);}
function isVisualReview(){if(window.GOpening&&GOpening.active)return false;const q=new URLSearchParams(location.search),f=location.pathname.split('/').pop()||'index.html';const u=f==='scene.html'?f+'?k='+q.get('k'):f==='slot.html'?f+'?id='+q.get('id'):f;return q.get('review')==='1'&&visualReview(u);}
function ready(u,p){
 if(isVisualReview())return false;
 if(u==='slot.html?id=mirrors')return !mirrorReadonly()&&!((p.mirrors||{}).draft)&&!!(p.mirror_exercise&&p.mirror_exercise.completed_at);
 if(u==='slot.html?id=bg16')return !!(p.backgroundProfile&&p.backgroundProfile.backgroundState&&p.backgroundProfile.backgroundState.version===2&&p.backgroundProfile.backgroundState.completedAt);
 if(u==='slot.html?id=mechanism')return !!(p.innerMechanism&&p.innerMechanism.completedAt);
 if(u==='form.html')return !!(p.name&&window.GPassport&&GPassport.parse(p.birth)&&['m','f'].includes(p.gender)&&p.points);
 if((p.flow||{}).completed&&p.flow.completed[u])return true;
 if(u==='bridge.html')return !!(p.pocherk&&p.pocherk.doneAt);
 if(u==='choose.html')return !!p.mapStyle;
 if(u==='ego.html')return !!p.ego;
 if(u==='betray.html')return !!(p.betray&&(p.betray.done||p.betray.skipped));
 if(u==='swipe.html')return !!p.dq;
 if(u==='wheel8.html')return Array.isArray(p.wheel)&&p.wheel.length===8;
 if(u==='wheel-test.html')return !!(p.wheelTest&&p.wheelTest.completed);
 if(u==='values.html')return p.valuesStage==='done';
 if(u==='reactor.html')return !!(p.tracker&&p.tracker.finale&&p.tracker.finale.done)||(+(p.reactor||{}).day>=21&&!(p.tracker&&p.tracker.start));
 if(u==='wish.html')return !!(p.tracker&&p.tracker.declared&&Array.isArray(p.tracker.directions)&&p.tracker.directions.length===3);
 if(u==='slot.html?id=dialog')return !!p.dialog;
 if(u==='slot.html?id=sort')return !!(p.lab&&p.lab.sort&&p.lab.sort.length===6);
 if(u==='slot.html?id=evidence')return !!(p.fractal&&p.fractal.evidence&&p.fractal.evidence.length>=1);
 if(u==='slot.html?id=leverage')return !!(p.fractal&&p.fractal.lever);
 if(u==='slot.html?id=guard')return !!(p.guard&&p.guard.answers&&p.guard.answers.length);
 if(u==='slot.html?id=retest')return !!p.retest;
 if(u==='slot.html?id=wish_back')return !!(p.wishBack&&p.wishBack.done);
 if(u==='slot.html?id=builder')return !!(p.pathPlan&&p.pathPlan.done);
 if(u==='fin.html')return !!(p.portrait&&p.portrait.done);
 if(u==='slot.html?id=arch_b')return !!p.archB;
 if(u==='slot.html?id=arch_v')return !!p.archV;
 if(u==='slot.html?id=arch_p')return !!p.archP;
 if(u==='slot.html?id=arch_d')return !!p.archD;
 {const NT={km:'kmTest',fs:'firstSet',lab_d:'desireLab',pi:'interact',rs:'respTest',ct:'ctTest',sv:'selfWorth',vsort:'valuesCore',im:'im'},m=/^slot\.html\?id=(\w+)$/.exec(u);if(m&&NT[m[1]])return !!(p[NT[m[1]]]&&p[NT[m[1]]].v);}
 return false;
}
/* A cursor is a checkpoint only when its preceding step was actually completed.
   Visited pages, legacy last/max and query strings never unlock a step. */
function state(p){
 p=p||load();const flow=window.GFLOW||[],f=p.flow||{},done=f.completed||{};
 let at=1,candidate=index(f.current);
 if(f.version>=2&&candidate>=1&&(candidate===1||done[flow[candidate-1].u]))at=candidate;
 while(at<flow.length-1&&done[flow[at].u])at++;
 const finished=at===flow.length-1&&!!done[flow[at].u];
 return {index:at,url:flow[at]?flow[at].u:'form.html',finished};
}
function status(u,p){const i=index(u),s=state(p);if(i<0)return 'resource';return i<s.index||s.finished&&i===s.index?'done':i===s.index?'current':'locked';}
function resume(){return state().url;}
function reviewUrl(u){return visualReview(u)?u+(u.includes('?')?'&':'?')+'review=1':'tasks.html?review='+encodeURIComponent(u);}
function complete(u,p){
 u=u||currentUrl();p=p||load();
 if(isVisualReview()||mirrorReadonly()||status(u,p)==='locked'||((u==='slot.html?id=mirrors'||u==='bridge.html')&&!ready(u,p)))return false;
 if(!u||index(u)<0)return false;
 p.flow=p.flow||{};const f=p.flow;f.completed=f.completed||{};
 // Revisiting an already completed step must not change its date or route.
 if(f.completed[u]&&!(u==='slot.html?id=mirrors'&&p.mirror_exercise))return false;
 const at=index(u),checkpoint=state(p);f.completed[u]=Date.now();
 // Keep a compact immutable result snapshot for safe review, not a mutable scene replay.
 f.results=f.results||{};if(!f.results[u])f.results[u]=snapshot(u,p);
 if(at>=checkpoint.index){const next=GFLOW[at+1];f.current=next?next.u:u;f.last=f.current;}
 f.version=2;recordVisit(u,p);save(p);return true;
}
const ADV_KEY='alch_v5_justAdvanced',ADV_MS=1500;
function markAdvance(){try{sessionStorage.setItem(ADV_KEY,String(Date.now()))}catch(e){}}
function justAdvanced(ms){try{const t=+sessionStorage.getItem(ADV_KEY)||0;return !!t&&(Date.now()-t)<(ms==null?ADV_MS:ms)}catch(e){return false}}
function advance(){const u=currentUrl(),repeat=window.GOpening&&GOpening.active;if(!(repeat&&status(u)==='done')&&!complete(u))return 'tasks.html';const i=index(u),next=i>=0&&GFLOW[i+1]?GFLOW[i+1].u:'tasks.html';markAdvance();return repeat?GOpening.url(next):next;}
function recordVisit(u,p){
 const passed=arguments.length>1&&!!p;
 u=u||currentUrl();p=p||load();
 if(isVisualReview()||mirrorReadonly()||!u||index(u)<0)return p;
 if(status(u,p)==='locked')return p;
 p.flow=p.flow||{};const f=p.flow;f.visited=f.visited||{};
 // Первая отметка сохраняется, повторный заход ее не переписывает.
 if(f.visited[u]==null)f.visited[u]=Date.now();
 if(!passed)save(p);
 return p;
}
function init(){
 const p=load(),u=currentUrl();if(isVisualReview()||mirrorReadonly()||!u)return;
 const st=status(u,p);if(st!=='current'&&st!=='done')return;
 p.flow=p.flow||{};const f=p.flow;
 if(!f.version){f.legacy={last:f.last||null,max:f.max||0};f.completed=f.completed||{};f.current=state(p).url;f.last=f.current;f.version=2;}
 recordVisit(u,p);save(p);
 try{
  const i=index(u),nx=i>=0&&GFLOW[i+1]?GFLOW[i+1].u:null;
  if(nx&&document.head){
   const ln=document.createElement('link');ln.rel='prefetch';ln.href=nx;document.head.appendChild(ln);
   const PRE={'bridge.html':['img/map_bg.jpg','img/chasm_top.webp?v=pc1','img/fire_camp.webp?v=pc1','img/scene_fire.jpg'],
    'cutscene.html':['img/sphere.png'],'slot.html?id=dialog':['img/scene_fire.jpg',p.gender==='f'?'img/triangle_f.jpg':'img/triangle_m.jpg'],
    'scene.html?k=ego':['img/scene_mage.jpg'],'scene.html?k=pa':['img/scene_architect.jpg'],'slot.html?id=pb_intro':['img/scene_point_b.jpg'],'slot.html?id=pc_intro':['img/scene_point_c.jpg']};
   (PRE[nx]||[]).forEach(src=>{const im=new Image();im.src=src});
  }
 }catch(e){}
}
function snapshot(u,p){
 const keys={
  'form.html':['name','birth','gender'], 'choose.html':['mapStyle'], 'bridge.html':['pocherk','hand','handTop'],
  'ego.html':['ego'], 'betray.html':['betray'], 'swipe.html':['dq'], 'res.html':['res','body'], 'wheel8.html':['wheel'],
  'wheel-test.html':['wheelTest'], 'values.html':['values','egoSelf','focuses'],
  'slot.html?id=mirrors':['mirror_exercise'], 'slot.html?id=dialog':['dialog'],
  'slot.html?id=evidence':['fractal'], 'slot.html?id=sort':['lab'], 'slot.html?id=found':['lab'],
  'slot.html?id=pb_end':['lab'], 'slot.html?id=fractal':['fractal'], 'slot.html?id=leverage':['fractal'],
  'slot.html?id=guard':['guard'], 'reactor.html':['reactor','tracker'], 'slot.html?id=retest':['retest'],
  'slot.html?id=compare':['wheel','retest'], 'slot.html?id=end':['reactor','retest','arts'],
  'slot.html?id=km':['kmTest'], 'slot.html?id=fs':['firstSet'], 'slot.html?id=bg16':['backgroundProfile'], 'slot.html?id=mechanism':['innerMechanism'], 'slot.html?id=im':['im'], 'slot.html?id=lab_d':['desireLab'], 'wish.html':['tracker','wishMod'], 'slot.html?id=pi':['interact'],
  'slot.html?id=rs':['respTest'], 'slot.html?id=ct':['ctTest'], 'slot.html?id=sv':['selfWorth'], 'slot.html?id=vsort':['valuesCore','reactorIn']};
 const arch={'ego.html':'ego','slot.html?id=arch_b':'archB','slot.html?id=arch_v':'archV','slot.html?id=arch_p':'archP','slot.html?id=arch_d':'archD'}[u],ar=arch&&p[arch];
 if(ar&&ar.v&&(arch!=='ego'||ar.v===2)){const t={archResult:ar.top||''};if(ar.map)t.archMap=ar.map;return JSON.parse(JSON.stringify({data:t,logs:(p.log||[]).slice(-3)}));}
 const data={};(keys[u]||['arts']).forEach(k=>{if(p[k]!==undefined)data[k]=p[k]});
 const logs=(p.log||[]).slice(-3);return JSON.parse(JSON.stringify({data,logs}));
}
function reading(u){if(isVisualReview())return false;return u==='elder.html'||u==='hero.html'||u==='sum.html'||u==='fin.html'||u.startsWith('scene.html')||['pa_end','pb_intro','pc_intro','compare'].some(k=>u==='slot.html?id='+k)}
/* день трекера: по дате начала, завершенный финал считается как 28 */
function trackDay(p){p=p||load();const T=p.tracker||{};let day=0,filled=0;
 if(T.finale&&T.finale.done)day=28;else if(T.start){day=Math.floor((Date.now()-T.start)/86400000)+1;day=Math.max(1,Math.min(28,day));}
 else day=Math.min(28,+(p.reactor||{}).day||0);
 const D=T.days||{};for(const k in D){const d=D[k]||{};if(Object.keys(d).length)filled++;}
 return {day,filled:Math.min(28,filled),done:!!(T.finale&&T.finale.done)||day>=28};}
window.GTrackDay=trackDay;
window.GRoute={load,resume,complete,advance,markAdvance,justAdvanced,init,recordVisit,currentUrl,ready,reading,state,status,reviewUrl,snapshot,visualReview,isVisualReview};
})();
/* Нить Самости и вау-моменты: подключаются на всех страницах маршрута. */
(function(){if(window.GSelf||document.querySelector('script[src*="self-thread.js"]'))return;var s=document.currentScript||document.querySelector('script[src*="route.js"]'),b=s&&s.src?s.src.replace(/[^/]+(?:\?.*)?$/,''):'';var x=document.createElement('script');x.src=b+'self-thread.js?v=self1';x.defer=true;(document.head||document.documentElement).appendChild(x)})();
