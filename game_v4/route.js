/* Маршрут хранит посещение и подтвержденное завершение раздельно. */
(function(){
'use strict';
const K='alch_profile';
function load(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return {}}}
function save(p){localStorage.setItem(K,JSON.stringify(p))}
function index(u){return (window.GFLOW||[]).findIndex(x=>x.u===u)}
function currentUrl(){const i=window.gIdx?gIdx():-1;return i<0?null:GFLOW[i].u}
function ready(u,p){
 if(u==='form.html')return !!(p.name&&window.GPassport&&GPassport.parse(p.birth)&&['m','f'].includes(p.gender)&&p.points);
 if((p.flow||{}).completed&&p.flow.completed[u])return true;
 if(u==='choose.html')return !!p.mapStyle;
 if(u==='ego.html')return !!p.ego;
 if(u==='swipe.html')return !!p.dq;
 if(u==='wheel8.html')return Array.isArray(p.wheel)&&p.wheel.length===8;
 if(u==='wheel-test.html')return !!(p.wheelTest&&p.wheelTest.completed);
 if(u==='values.html')return p.valuesStage==='done';
 if(u==='reactor.html')return +(p.reactor||{}).day>=21;
 if(u==='slot.html?id=dialog')return !!p.dialog;
 if(u==='slot.html?id=sort')return !!(p.lab&&p.lab.sort&&p.lab.sort.length===6);
 if(u==='slot.html?id=evidence')return !!(p.fractal&&p.fractal.evidence&&p.fractal.evidence.length>=3);
 if(u==='slot.html?id=leverage')return !!(p.fractal&&p.fractal.lever);
 if(u==='slot.html?id=guard')return !!(p.guard&&p.guard.answers&&p.guard.answers.length);
 if(u==='slot.html?id=retest')return !!p.retest;
 return false;
}
function resume(){const p=load(),f=p.flow||{};return index(f.current)>=0?f.current:index(f.last)>=0?f.last:'form.html'}
function complete(u){u=u||currentUrl();if(!u||index(u)<0)return false;const p=load();p.flow=p.flow||{};const f=p.flow;f.completed=f.completed||{};f.completed[u]=Date.now();const at=index(u);if(at>=index(resume())){const next=GFLOW[at+1];f.current=next?next.u:u;f.last=f.current}f.version=2;save(p);return true}
function advance(){const u=currentUrl();complete(u);const i=index(u);return i>=0&&GFLOW[i+1]?GFLOW[i+1].u:'map.html'}
function init(){const p=load();p.flow=p.flow||{};const f=p.flow;if(!f.version){f.legacy={last:f.last||null,max:f.max||0};f.completed=f.completed||{};f.current=index(f.last)>=0?f.last:'form.html';f.version=2}f.visited=f.visited||{};const u=currentUrl();if(u)f.visited[u]=Date.now();save(p)}
function reading(u){return u==='elder.html'||u==='hero.html'||u==='sum.html'||u==='fin.html'||u.startsWith('scene.html')||['pa_end','pb_intro','pc_intro','compare'].some(k=>u==='slot.html?id='+k)}
window.GRoute={load,resume,complete,advance,init,ready,reading};
})();
