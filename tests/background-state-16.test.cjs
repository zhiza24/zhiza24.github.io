const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM}=require('jsdom');
const root=path.join(__dirname,'../game_v5');
function unit(files,seed={}){
 let raw=JSON.stringify(seed),store={alch_v5_profile:raw};
 const w={window:null,Date,Math,URLSearchParams,location:{search:'',pathname:'/slot.html',href:'https://game.test/slot.html'},localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>delete store[k]},sessionStorage:{getItem:()=>null,setItem:()=>{}},console};
 w.window=w;const ctx={window:w,Date,Math,URLSearchParams,localStorage:w.localStorage,sessionStorage:w.sessionStorage,console};
 vm.createContext(ctx);files.forEach(f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx));
 return {w,ctx,store};
}
const x=unit(['background-state-16-data.js','background-state-16-engine.js']);
const D=x.w.GBGS16,E=x.w.GBackgroundState16;
assert.equal(D.Q.length,16);
assert.equal(D.SPHERES.length,8);
assert.equal(Object.keys(D.FAM).length,8);
const counts=Object.fromEntries(Object.keys(D.FAM).map(id=>[id,0]));
const pairs={};
D.Q.forEach(q=>{
 assert.equal(q[3].length,4,q[0]+' must have four core options');
 q[3].forEach(o=>counts[o[1]]++);
 const ids=q[3].map(o=>o[1]);
 for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++){const key=[ids[i],ids[j]].sort().join('+');pairs[key]=(pairs[key]||0)+1}
});
Object.values(counts).forEach(n=>assert.equal(n,8,'each family must occur eight times'));
D.SPHERES.forEach((sphere,i)=>{
 const qs=D.Q.filter(q=>q[1]===i);assert.equal(qs.length,2,sphere+' must have two scenes');
 const seen={};qs.forEach(q=>q[3].forEach(o=>seen[o[1]]=(seen[o[1]]||0)+1));
 Object.keys(seen).forEach(k=>assert.equal(seen[k],1,sphere+' must contain each family once'));
 assert.equal(Object.keys(seen).length,8);
});
const pairDistribution=Object.values(pairs).reduce((o,n)=>(o[n]=(o[n]||0)+1,o),{});
assert.equal(pairDistribution[3],16);
assert.equal(pairDistribution[4],12);
assert.equal(D.SPECIAL.find(x=>x[1]==='v')[0],'По-разному, зависит от обстоятельств');
assert.equal(D.SPECIAL.find(x=>x[1]==='x')[0],'Ни один вариант на меня не похож');

// A resource leader and a protective leader can coexist without collapsing into one score.
const mixed={};
D.Q.forEach(q=>{
 const ids=q[3].map(o=>o[1]);
 if(ids.includes('S1'))mixed[q[0]]={primary:'S1',secondary:ids.includes('S5')?'S5':null};
 else if(ids.includes('S5'))mixed[q[0]]={primary:'S5',secondary:null};
 else mixed[q[0]]={primary:ids[0],secondary:null};
});
const full=E.calculate(mixed,{}, {startedAt:100,seed:7});
assert.equal(full.coverage.answered,16);
assert.equal(full.coverage.secondary,4);
assert.equal(full.groups.resource.status,'leading');
assert.deepEqual(Array.from(full.groups.resource.leaders),['S1']);
assert.equal(full.groups.protective.status,'leading');
assert.deepEqual(Array.from(full.groups.protective.leaders),['S5']);
const s1=full.families.find(f=>f.id==='S1'),s5=full.families.find(f=>f.id==='S5');
assert.equal(s1.points,8);assert.equal(s1.share,1);
assert.equal(s5.points,6);assert.equal(s5.share,.75);
assert.equal(full.methodology.primary,1);assert.equal(full.methodology.secondary,.5);

// Secondary choices add half a point, not a second primary point.
const pairScenes=D.Q.filter(q=>q[3].some(o=>o[1]==='S1')&&q[3].some(o=>o[1]==='S2')).slice(0,3);
assert.equal(pairScenes.length,3);
const close={};
pairScenes.forEach((q,i)=>close[q[0]]=i===1?{primary:'S2',secondary:'S1'}:{primary:'S1',secondary:'S2'});
const closeResult=E.calculate(close);
assert.equal(closeResult.groups.resource.status,'two_close');
assert.equal(closeResult.families.find(f=>f.id==='S1').points,2.5);
assert.equal(closeResult.families.find(f=>f.id==='S2').points,2);

// Fewer than three distinct spheres is not promoted to a leading background hypothesis.
const tooFew={};pairScenes.slice(0,2).forEach(q=>tooFew[q[0]]={primary:'S1'});
assert.equal(E.calculate(tooFew).groups.resource.status,'no_clear_leader');

// Context-dependent and unmatched answers are preserved but never allocated to S families.
const special={};special[D.Q[0][0]]={primary:'v'};special[D.Q[1][0]]={primary:'x'};
const specialResult=E.calculate(special);
assert.equal(specialResult.coverage.depends,1);
assert.equal(specialResult.coverage.none,1);
assert.equal(specialResult.coverage.codedPrimary,0);
assert.equal(specialResult.families.reduce((n,f)=>n+f.points,0),0);

// The 19-state model and the 16-scene background profile remain separate from the Mirror synthesis record.
const profile=unit(['profile-layer.js']);
profile.w.GProfile.saveResult('backgroundProfile',{backgroundState:{version:2,completedAt:123},stateModel:{version:1}});
profile.w.GProfile.saveResult('im',{v:3,type:'synthesis'});
const saved=profile.w.GProfile.load();
assert.equal(saved.backgroundProfile.backgroundState.version,2);
assert.equal(saved.backgroundProfile.stateModel.version,1);
assert.equal(saved.im.v,3);
assert.equal(saved.modules.backgroundProfile.result.backgroundState.version,2);
// Route insertion must not pull an existing player backward, while a fresh player sees the new step.
const freshRoute=unit(['flow.js','route.js'],{flow:{version:2,current:'slot.html?id=bg16',last:'slot.html?id=bg16',completed:{'form.html':1,'elder.html':1,'hero.html':1,'choose.html':1,'bridge.html':1,'breath.html?at=p0':1,'cutscene.html':1,'slot.html?id=dialog':1}}});
assert.equal(freshRoute.w.GRoute.resume(),'slot.html?id=bg16');
const legacyRoute=unit(['flow.js','route.js'],{flow:{version:2,current:'slot.html?id=km',last:'slot.html?id=km',completed:{'form.html':1,'elder.html':1,'hero.html':1,'choose.html':1,'bridge.html':1,'breath.html?at=p0':1,'cutscene.html':1,'slot.html?id=dialog':1}}});
assert.equal(legacyRoute.w.GRoute.resume(),'slot.html?id=km');
assert.ok(legacyRoute.w.GRoute.load().flow.archSkipped['slot.html?id=bg16']);
const routeProfile={backgroundProfile:{backgroundState:{version:2,completedAt:123}},im:{v:3}};
assert.equal(freshRoute.w.GRoute.ready('slot.html?id=bg16',routeProfile),true);
assert.equal(freshRoute.w.GRoute.ready('slot.html?id=im',routeProfile),true);
const slot=fs.readFileSync(path.join(root,'slot.html'),'utf8'),tests=fs.readFileSync(path.join(root,'tests.js'),'utf8'),mirror=fs.readFileSync(path.join(root,'inner-mirror.js'),'utf8');
assert.ok(slot.includes('background-state-16-data.js')&&slot.includes("id==='bg16'"));
assert.ok(tests.includes("im:{u:'slot.html?id=im',f:'im',mod:'im'"));
assert.ok(tests.includes("if(k==='im'&&window.GInner){GInner.mount(box);return}"));
assert.ok(mirror.includes('background.version===2'));
// Exercise the actual 16-scene screen in a browser-like DOM.
const dom=new JSDOM('<!doctype html><html><head></head><body><main id="box"></main></body></html>',{url:'https://game.test/slot.html?id=bg16',runScripts:'dangerously'});
const w=dom.window,box=w.document.getElementById('box');
w.GTests={preview:true,retakeMode:false,load:()=>({})};
w.GRoute={advance:()=>'slot.html?id=km'};
w.GG=(male)=>male;
['background-state-16-data.js','background-state-16-engine.js','background-state-16.js'].forEach(f=>w.eval(fs.readFileSync(path.join(root,f),'utf8')));
w.GBackgroundState16Test.mount(box);
box.querySelector('#bg16Start').click();
for(let i=0;i<16;i++){
 const primary=box.querySelector('[data-bg16-primary]');
 assert.ok(primary,'scene '+(i+1)+' should offer a primary answer');
 primary.click();
 const next=box.querySelector('#bg16Next');
 assert.ok(next&&!next.disabled,'scene '+(i+1)+' should allow continuing after a primary answer');
 next.click();
}
const finish=box.querySelector('#bg16Finish');
assert.ok(finish,'the follow-up screen should offer result calculation');
finish.click();
assert.equal(w.GBackgroundState16PreviewResult.coverage.answered,16);
assert.match(box.textContent,/Предварительная карта/);
assert.match(box.textContent,/16 из 16 сцен отвечено/);
dom.window.close();
console.log('PASS: 16 scenes, eight spheres, balanced family/pair distribution, separate resource/protective leaders, secondary weighting, context answers, three-sphere threshold and profile preservation.');
