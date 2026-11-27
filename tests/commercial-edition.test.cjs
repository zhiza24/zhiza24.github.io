'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'../game_commercial');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const flow=read('flow.js');
const steps=[...flow.matchAll(/\{u:'([^']+)',pt:'([^']+)',t:'([^']+)'\}/g)].map(m=>({url:m[1],point:m[2],title:m[3]}));
assert.equal(steps.length,35,'commercial route must contain exactly 35 steps');
assert.deepEqual([...new Set(steps.map(x=>x.point))],['0','А','Б','С','Финал']);
for(const s of steps)assert.ok(fs.existsSync(path.join(root,s.url.split('?')[0])),s.url+' must resolve to a file');
for(const required of ['slot.html?id=dialog','slot.html?id=bg16','ego.html','betray.html','slot.html?id=im','swipe.html','wheel8.html','values.html','slot.html?id=vsort','slot.html?id=evidence','slot.html?id=sort','slot.html?id=eraser','slot.html?id=lab_d','wish.html','slot.html?id=leverage','slot.html?id=builder','reactor.html'])assert.ok(steps.some(x=>x.url===required),'missing core step '+required);
for(const removed of ['slot.html?id=mechanism','slot.html?id=km','slot.html?id=arch_b','slot.html?id=fs','wheel-test.html','slot.html?id=ct','slot.html?id=pi','slot.html?id=rs','slot.html?id=sv'])assert.ok(!steps.some(x=>x.url===removed),'extended module must not be mandatory: '+removed);

class MemoryStorage{
 constructor(){this.data=new Map()}
 getItem(k){return this.data.has(String(k))?this.data.get(String(k)):null}
 setItem(k,v){this.data.set(String(k),String(v))}
 removeItem(k){this.data.delete(String(k))}
 key(i){return [...this.data.keys()][i]??null}
 get length(){return this.data.size}
 clear(){this.data.clear()}
}
const storage=new MemoryStorage();
const nativeGet=MemoryStorage.prototype.getItem;
nativeGet.call(storage,'alch_v5_profile'); // keep native reference for the pre-existing main-game key
storage.setItem('alch_v5_profile','MAIN_PROFILE');
const win={Storage:MemoryStorage,localStorage:storage};
vm.runInNewContext(flow,{window:win});
assert.equal(storage.getItem('alch_v5_profile'),null,'commercial app must not read main-game profile');
storage.setItem('alch_v5_profile','COMMERCIAL_PROFILE');
assert.equal(nativeGet.call(storage,'alch_v5_profile'),'MAIN_PROFILE','main-game profile must remain untouched');
assert.equal(nativeGet.call(storage,'alch_commercial_profile'),'COMMERCIAL_PROFILE','commercial profile must use its own namespace');
storage.setItem('alch_v5_author_seen','1');
assert.equal(nativeGet.call(storage,'alch_commercial_author_seen'),'1');
assert.equal(storage.length,2,'commercial length should hide main-game keys');
storage.clear();
assert.equal(nativeGet.call(storage,'alch_v5_profile'),'MAIN_PROFILE','commercial clear must not erase main-game data');
assert.equal(nativeGet.call(storage,'alch_commercial_profile'),null);

const gate=read('route-gate.js'),tracker=read('track28.js');
for(const id of ['mechanism','km','arch_b','fs','ct','pi','rs','sv'])assert.ok(gate.includes("'"+id+"'")&&tracker.includes('slot.html?id='+id+'&lab=1'),'optional lab link missing: '+id);
assert.match(gate,/q.get\('lab'\)==='1'/);
const sw=read('sw.js');
assert.match(sw,/alch-commercial-shell-/);
assert.match(sw,/alch-commercial-runtime/);
assert.doesNotMatch(sw,/alch-v5-shell-|alch-v5-runtime/);
const theme=read('theme.js'),sound=read('sound.js');
assert.match(theme,/alch_commercial_theme/);
assert.match(sound,/alch_commercial_sound/);
const manifest=JSON.parse(read('manifest.webmanifest'));
assert.equal(manifest.scope,'./');
assert.equal(manifest.start_url,'./map.html');

 // Strategy-choice test: verify the four answer slots retain their intended behavioral meaning.
 const pocherkCtx={window:{GG:(m)=>m}};
 vm.runInNewContext(read('pocherk-data.js'),pocherkCtx);
 const PQ=pocherkCtx.window.POCHERK_Q;
 assert.equal(pocherkCtx.window.POCHERK_VERSION,6,'strategy test data version must be explicit');
 assert.equal(PQ.length,10,'strategy test must contain ten questions');
 assert.deepEqual([...pocherkCtx.window.POCHERK_KEY],['act','obs','cre','sup']);
 for(const q of PQ){
  assert.equal(q.a.length,4,'question '+q.id+' must have four answer strategies');
  assert.deepEqual([...q.perm].sort(),[0,1,2,3],'question '+q.id+' display order must be a permutation');
 }
 assert.match(PQ[0].a[1],/прислушаюсь/,'Q1 B must be observation');
 assert.match(PQ[0].a[2],/отметку/,'Q1 C must be a self-created method');
 assert.match(PQ[1].a[2],/ответный сигнал/,'Q2 C must be an experiment, not risk assessment');
 assert.match(PQ[2].a[0],/сразу отправлюсь/,'Q3 A must be direct action');
 assert.match(PQ[2].a[3],/Окликну/,'Q3 D must seek support');
 assert.match(PQ[4].a[2],/Меняю способ движения/,'Q5 C must be an adaptive self-created method');
 assert.match(PQ[5].a[1],/оцениваю расстояние/,'Q6 B must gather information');
 assert.match(PQ[5].a[3],/прошу помочь/,'Q6 D must seek support');
 assert.match(PQ[7].a[0],/Подкидываю ветки/,'Q8 A must be action');
 assert.match(PQ[7].a[1],/наблюдаю/,'Q8 B must be observation');
 assert.match(PQ[7].a[2],/Собираю сухие ветки/,'Q8 C must create a resource');
 assert.match(PQ[7].a[3],/Повторяю за Старцем/,'Q8 D must be social support/approval');
 assert.match(PQ[3].a[0],/первый шаг/,'Q4 A must be action');
 assert.match(PQ[3].a[1],/Осмотрю/,'Q4 B must be observation');
 assert.match(PQ[3].a[2],/Обвяжу пояс/,'Q4 C must be a created safety method');
 assert.match(PQ[3].a[3],/Оглянусь/,'Q4 D must seek support');
 assert.match(PQ[4].a[0],/Ускоряю шаг/,'Q5 A must be action');
 assert.match(PQ[4].a[1],/ловлю ритм/,'Q5 B must be observation');
 assert.match(PQ[4].a[3],/Оглядываюсь на берег/,'Q5 D must seek support');
 assert.match(PQ[5].a[0],/перешагиваю/,'Q6 A must be action');
 assert.match(PQ[5].a[2],/Использую посох/,'Q6 C must create a new support');
 assert.match(PQ[6].a[0],/Ускорю шаг/,'Q7 A must be action');
 assert.match(PQ[6].a[1],/проверять каждую доску/,'Q7 B must be observation');
 assert.match(PQ[6].a[2],/перепрыгнуть/,'Q7 C must be an alternative move');
 assert.match(PQ[6].a[3],/попрошу помочь/,'Q7 D must seek support');
 assert.match(PQ[8].a[0],/Сразу пробую открыть/,'Q9 A must be action');
 assert.match(PQ[8].a[1],/Внимательно рассматриваю/,'Q9 B must be observation');
 assert.match(PQ[8].a[2],/Пробую нажать/,'Q9 C must be an experiment');
 assert.match(PQ[8].a[3],/Спрашиваю Старца/,'Q9 D must seek support');
 assert.match(PQ[9].a[0],/Собираю вещи/,'Q10 A must be action');
 assert.match(PQ[9].a[1],/не принимаю решения/,'Q10 B must be observation');
 assert.match(PQ[9].a[2],/собственный подход/,'Q10 C must be self-created strategy');
 assert.match(PQ[9].a[3],/Расспрашиваю Старца/,'Q10 D must seek support');
 assert.doesNotMatch(JSON.stringify(pocherkCtx.window.POCHERK_TEXT),/превращать идеи в новые возможности|учитывать возможности других людей|предвидеть последствия/,'result copy must not make unsupported personality claims');
 const pocherkJs=read('pocherk.js');
 assert.doesNotMatch(pocherkJs,/В ответах несколько способов набрали одинаковое число выборов|Распределение:/,'player result must not expose internal score counts');
 assert.match(pocherkJs,/P\.handTop=r\.mixed\?null:OLD\[r\.lead\]/,'a tie must not be stored as an arbitrary single lead');
 const legacyBlock=pocherkJs.match(/var LEGACY_DIRS=(\{[^;]+\});/);
 assert.ok(legacyBlock,'old strategy results must have an explicit migration map');
 const legacy=vm.runInNewContext('('+legacyBlock[1]+')');
 assert.deepEqual([...legacy[3]],['sup','obs','cre','act'],'Q3 legacy answers must retain their behavioral meaning');
 assert.deepEqual([...legacy[8]],['sup','cre','act','obs'],'Q8 legacy answers must retain their behavioral meaning');
 const scoreBlock=pocherkJs.match(/function score\(ans\)\{[\s\S]*?\n\}/);
 assert.ok(scoreBlock,'strategy scoring function must be testable');
 const scoreCtx={window:{}};
 vm.runInNewContext("var ORDER=['act','obs','cre','sup'];"+scoreBlock[0]+";window.result=score([{dir:'act'},{dir:'obs'}]);",scoreCtx);
 assert.equal(scoreCtx.window.result.mixed,true,'a tie is represented internally as a tie');
 assert.deepEqual([...scoreCtx.window.result.leads],['act','obs']);

console.log('Commercial edition checks passed: 35 route entries, all route files resolve, localStorage namespace isolation, PWA cache namespace.');
