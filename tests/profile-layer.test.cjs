const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'../game_v4');
const dump=x=>JSON.parse(JSON.stringify(x));
function unit(seed={}, pathname='/ego.html'){
  let raw=seed==null?null:JSON.stringify(seed);
  const store={alch_profile:raw};
  const w={
    window:null,Date,URLSearchParams,
    location:{search:'',pathname:pathname,href:'https://game.test'+pathname},
    localStorage:{
      getItem:k=>store[k]??null,
      setItem:(k,v)=>{store[k]=String(v);if(k==='alch_profile')raw=String(v);},
      removeItem:k=>{delete store[k];if(k==='alch_profile')raw=null;}
    }
  };
  w.window=w;
  vm.createContext(w);
  for(const f of ['flow.js','route.js','profile-layer.js','engine.js']){
    vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),w);
  }
  return {w,store,load:()=>JSON.parse(w.localStorage.getItem('alch_profile')||'{}')};
}

const oldSave={
  name:'Светлана',birth:'10.02.1979',gender:'f',
  wheel:[4,5,6,7,8,3,2,9],
  ego:{schema:'ct',mixed:false,mode:'cr',sc:{ct:6},md:{cr:3}},
  dq:{accepted:40,voices:['это мелочь']},
  arts:['Зеркало','Черный кристалл',{n:'Мост'},{id:'lantern',name:'Фонарь'},'Зеркало','неизвестный камень'],
  flow:{version:2,current:'ego.html',last:'ego.html',completed:{'form.html':100,'elder.html':100},visited:{'elder.html':123}}
};

const migrated=unit(oldSave,'/hero.html');
const P=migrated.w.GProfile.migrate(JSON.parse(JSON.stringify(oldSave)));
assert.equal(P.name,'Светлана');
assert.deepEqual(dump(P.wheel),[4,5,6,7,8,3,2,9]);
assert.equal(P.ego.schema,'ct');
assert.equal(P.schemaVersion,3);
assert.deepEqual(dump(P.arts),['mirror','black_crystal','bridge','lantern','неизвестный камень']);
assert.ok(P.modules.ego && P.modules.ego.result && P.modules.ego.result.schema==='ct');
assert.deepEqual(dump(P.modules.ego.history),[]);
assert.equal(P.modules.dq.result.accepted,40);
assert.deepEqual(dump(P.wheel),[4,5,6,7,8,3,2,9]);
assert.equal(migrated.w.GArts.label('mirror',P),'Зеркало');
assert.equal(migrated.w.GArts.idOf({id:'guardian_measure',name:'Печать меры'}),'guardian_measure');
assert.equal(migrated.w.GArts.idOf('Печать меры'),'guardian_measure');
assert.equal(migrated.w.GArts.idOf({n:'Компас'}),'compass');
assert.ok(migrated.w.GArts.has('Зеркало',P));
assert.ok(migrated.w.GArts.has('mirror',P));
assert.ok(migrated.w.GArts.has({id:'black_crystal'},P));
assert.equal(migrated.w.GArts.label('guardian_companion',{gender:'f'}),'Хранительница опыта');
assert.equal(migrated.w.GArts.label('guardian_companion',{gender:'m'}),'Хранитель опыта');

const flowUrls=Array.from(unit({},'/tasks.html').w.GFLOW,x=>x.u);
function checkpoint(url, extra){
  const i=flowUrls.indexOf(url);
  return Object.assign({name:'Тест',gender:'m',flow:{version:2,current:url,completed:Object.fromEntries(flowUrls.slice(1,i).map(u=>[u,100]))}}, extra||{});
}
const fresh=unit(checkpoint('ego.html'),'/ego.html');
assert.equal(fresh.w.GArts.grant('Черный кристалл'),true);
assert.equal(fresh.w.GArts.grant('black_crystal'),false);
assert.equal(fresh.w.GArts.grant({id:'black_crystal',name:'Черный кристалл'}),false);
let saved=fresh.load();
assert.deepEqual(dump(saved.arts),['black_crystal']);
assert.ok(saved.log.some(x=>String(x.x).includes('Черный кристалл')));

assert.equal(fresh.w.GArts.grant('guardian_measure',{source:'reactor.html'}),false);
assert.deepEqual(dump(fresh.load().arts),['black_crystal']);
assert.equal(fresh.w.GArts.grant('guardian_measure',{source:'ego.html'}),true);
assert.ok(fresh.w.GArts.has('Печать меры',fresh.load()));

fresh.w.GProfile.saveResult('ego',{schema:'ct',sc:{ct:4}},{q0:2});
saved=fresh.load();
assert.equal(saved.ego.schema,'ct');
assert.equal(saved.modules.ego.raw.q0,2);
assert.equal(saved.modules.ego.history.length,0);
fresh.w.GProfile.saveResult('ego',{schema:'ab',sc:{ab:5}},{q0:1});
saved=fresh.load();
assert.equal(saved.ego.schema,'ab');
assert.equal(saved.modules.ego.history.length,1);
assert.equal(saved.modules.ego.history[0].result.schema,'ct');
assert.equal(saved.modules.ego.raw.q0,1);
assert.notEqual(JSON.stringify(saved.modules.ego.raw),JSON.stringify(saved.modules.ego.result));

const vis=unit(checkpoint('swipe.html'),'/swipe.html');
assert.equal(vis.w.GRoute.status('swipe.html'),'current');
assert.equal(vis.w.GRoute.status('reactor.html'),'locked');
vis.w.GRoute.recordVisit('swipe.html');
let flow=vis.load().flow;
const first=flow.visited['swipe.html'];
assert.ok(first>0);
vis.w.GRoute.recordVisit('swipe.html');
assert.equal(vis.load().flow.visited['swipe.html'],first);
const beforeLock=JSON.stringify(vis.load().flow);
vis.w.GRoute.recordVisit('reactor.html');
assert.equal(JSON.stringify(vis.load().flow),beforeLock);
assert.equal(vis.w.GRoute.status('reactor.html'),'locked');
assert.equal(vis.w.GRoute.resume(),'swipe.html');

const doneVisit=unit(checkpoint('swipe.html'),'/swipe.html');
doneVisit.w.GRoute.recordVisit('form.html');
assert.ok(doneVisit.load().flow.visited['form.html']);
assert.equal(doneVisit.w.GRoute.resume(),'swipe.html');

const src=fs.readFileSync(path.join(root,'profile-layer.js'),'utf8')+fs.readFileSync(path.join(root,'route.js'),'utf8');
assert.doesNotMatch(src,/диагноз/i);
assert.doesNotMatch(src,/ё/);

const html=fs.readFileSync(path.join(root,'slot.html'),'utf8');
assert.match(html,/GArts\.grant\(f\.artifact/);
assert.match(html,/GArts\.grant\(artRef/);
assert.doesNotMatch(html,/диагноз/i);

console.log('PASS: artifact ids and aliases, no-duplicate migration, locked grant blocked, raw/result split, retake history, idempotent visits, locks unchanged.');
