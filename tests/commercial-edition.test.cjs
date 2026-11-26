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
console.log('Commercial edition checks passed: 35 route entries, all route files resolve, localStorage namespace isolation, PWA cache namespace.');
