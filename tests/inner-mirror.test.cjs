global.window={};require(__dirname+'/../game_v5/inner-mirror-data.js');require(__dirname+'/../game_v5/inner-mirror.js');
const D=window.GIMD,G=window.GInner,POS=['S1','S2','S3','S4'],NEG=['S5','S6','S7','S8'];
function w(o,fams){const k=G.parseKey(o[1]);return fams.reduce((a,s)=>a+(k.S[s]||0),0)}
function pick(q,fams){let b=0,bv=-1;q[3].forEach((o,j)=>{const v=w(o,fams);if(v>bv){bv=v;b=j}});return b}
function aft(fams){let b=0;D.AFTER.forEach((o,j)=>{if(fams.includes(o[1]))b=b||j});return D.AFTER.findIndex(o=>fams.includes(o[1]))}
function mk(fn,af){const a={};D.Q.forEach((q,i)=>{const r=fn(q,i);if(r!==undefined)a[q[0]]=r});D.AFTER_AT.forEach((id,i)=>{const r=af(id,i);if(r!==undefined)a['af_'+id]=r});return a}
let seed=3;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
const S={
 positive:mk(q=>pick(q,POS),(id,i)=>[0,1,2,3][i%4]),
 negative:mk(q=>pick(q,NEG),(id,i)=>[6,5,7,8][i%4]),
 mixed:mk((q,i)=>pick(q,i%2?POS:NEG),(id,i)=>[0,6,1,5][i%4]),
 create_lowjoy:mk(q=>pick(q,['S2']),()=>5),
 autonomy_closeness:mk((q,i)=>{const k=q[3].findIndex(o=>(i%2?/A6/:/S4/).test(o[1]));return k>=0?k:pick(q,['S3'])},(id,i)=>[3,1][i%2]),
 spheres:mk(q=>pick(q,q[1]%2?NEG:POS),(id,i)=>[0,6,1,5][i%4]),
 contradictory:mk(()=>Math.floor(rnd()*5),()=>Math.floor(rnd()*11)),
 partial:mk((q,i)=>i<8?pick(q,POS):undefined,()=>undefined),
 all_dep:mk(()=> 'dep',()=>10),
};
let fail=0;
for(const [n,a] of Object.entries(S)){const R=G.score(a),I=G.interp(R,false);
 const neg=R.kind==='negative';
 console.log(n.padEnd(20),R.kind.padEnd(12),'lead',R.leadingStates.join(','),'| lv',JSON.stringify(R.levels),'| res',R.res.join(','),'| good',I.good.length,'| head:',I.head);
 if(n!=='negative'&&neg){console.log('  !!! forced negative');fail++}
 if(n==='negative'&&!(I.points.length))fail++;
}
console.log(fail?'FAIL':'PASS: ни один сценарий не дает принудительно негативный результат');
