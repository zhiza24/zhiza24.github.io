const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const store=Object.create(null);
const localStorage={
 getItem:k=>Object.prototype.hasOwnProperty.call(store,k)?store[k]:null,
 setItem:(k,v)=>{store[k]=String(v)},
 removeItem:k=>{delete store[k]},
 key:i=>Object.keys(store)[i]||null,
 get length(){return Object.keys(store).length}
};
const sessionStore=Object.create(null);
const sessionStorage={
 getItem:k=>Object.prototype.hasOwnProperty.call(sessionStore,k)?sessionStore[k]:null,
 setItem:(k,v)=>{sessionStore[k]=String(v)},
 removeItem:k=>{delete sessionStore[k]},
 key:i=>Object.keys(sessionStore)[i]||null,
 get length(){return Object.keys(sessionStore).length}
};
class FakeFileReader{readAsText(file){this.result=file.content;this.onload()}}
let clock=1764000000000;
class FakeDate extends Date{constructor(...args){super(...(args.length?args:[clock]))}static now(){return clock}}
store.alch_v5_profile=JSON.stringify({name:'До импорта'});
const window={};
const context={window,localStorage,sessionStorage,FileReader:FakeFileReader,Date:FakeDate,Math,JSON,isFinite};
vm.createContext(context);
vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../game_v5/engine.js'),'utf8'),context);
context.window.GPro.save({name:'Автокопия день 1'});
let autoBackups=JSON.parse(store.alch_v5_profile_backups||'[]');
assert.equal(autoBackups.length,1,'first profile save should create a local backup');
assert.equal(JSON.parse(autoBackups[0].raw).profile.name,'Автокопия день 1');
context.window.GPro.save({name:'Повторное сохранение в тот же день'});
assert.equal(JSON.parse(store.alch_v5_profile_backups).length,1,'repeated saves in one day must not create backup spam');
clock+=24*60*60*1000+1;
context.window.GPro.save({name:'Автокопия день 2'});
autoBackups=JSON.parse(store.alch_v5_profile_backups);
assert.equal(autoBackups.length,2,'a new backup should be created after 24 hours');
assert.equal(JSON.parse(autoBackups[1].raw).profile.name,'Автокопия день 2');
const importFile=(payload)=>{
 let result=null;
 context.window.GPro.importFile({size:Buffer.byteLength(JSON.stringify(payload)),content:JSON.stringify(payload)},ok=>{result=ok});
 return result;
};
store.alch_v5_hold='old-hold';
store.alch_v5_sound='off';
store.alch_v5_theme='dark';
store.alch_v5_book_seen='3';
store.alch_v5_birth_preview_v1='old-draft';
store.alch_v5_scroll_chapter='old-scroll';
store.unrelated_app_key='keep-me';
const v2={
 format:'put-alhimika-backup',version:2,
 profile:{name:'После импорта',schemaVersion:3},
 local:{
  alch_samost:null,alch_v5_hold:'new-hold',
  alch_v5_belief_lab_v1:null,alch_v5_belief_lab_backup_v1:null,
  alch_v5_sound:'on',alch_v5_theme:'light',alch_v5_book_seen:'8',
  alch_v5_birth_preview_v1:'new-draft',alch_v5_scroll_chapter:'new-scroll'
 }
};
assert.equal(importFile(v2),true,'version 2 backup should import');
assert.equal(JSON.parse(store.alch_v5_profile).name,'После импорта');
assert.equal(store.alch_v5_hold,'new-hold');
assert.equal(store.alch_v5_sound,'on');
assert.equal(store.alch_v5_theme,'light');
assert.equal(store.alch_v5_book_seen,'8');
assert.equal(store.alch_v5_birth_preview_v1,'new-draft');
assert.equal(store.alch_v5_scroll_chapter,'new-scroll');
assert.equal(store.unrelated_app_key,'keep-me');
assert.ok(store.alch_v5_profile_backups,'pre-import rollback snapshot should be created');

// A version 1 backup from an earlier release did not contain the newly managed settings.
// Importing it must not erase current settings or reading progress.
store.alch_v5_theme='dark';
store.alch_v5_scroll_chapter='keep-scroll';
const v1={format:'put-alhimika-backup',version:1,profile:{name:'Старая копия'},local:{
 alch_samost:null,alch_v5_hold:'v1-hold',alch_v5_belief_lab_v1:null,alch_v5_belief_lab_backup_v1:null
}};
assert.equal(importFile(v1),true,'legacy version 1 backup remains importable');
assert.equal(store.alch_v5_theme,'dark','legacy import must preserve settings absent from v1');
assert.equal(store.alch_v5_scroll_chapter,'keep-scroll','legacy import must preserve scroll progress absent from v1');
assert.equal(store.alch_v5_hold,'v1-hold');

// Reject a backup that attempts to write arbitrary browser storage keys.
const before=store.alch_v5_profile;
const bad={format:'put-alhimika-backup',version:2,profile:{name:'bad'},local:{session_token:'must-not-write'}};
assert.equal(importFile(bad),false,'unknown localStorage keys must be rejected');
assert.equal(store.alch_v5_profile,before,'invalid import must not replace the profile');
store.alch_v5_cutscene_iam='seen';
store.alch_v5_scroll_chapter='17';
store.alch_samost='standalone';
store.unrelated_app_key='keep-me';
sessionStore.alch_v5_read='1';
sessionStore.heroRef='hero.html';
sessionStore.unrelated_session='keep-session';
assert.equal(context.window.GPro.deleteAll(),true,'delete-all should complete');
assert.ok(!Object.keys(store).some(k=>k.indexOf('alch_v5_')===0||k==='alch_samost'),'all game-owned localStorage keys should be removed');
assert.equal(store.unrelated_app_key,'keep-me','unrelated localStorage keys must remain untouched');
assert.ok(!Object.keys(sessionStore).some(k=>k.indexOf('alch_v5_')===0||k==='heroRef'),'game-owned sessionStorage keys should be removed');
assert.equal(sessionStore.unrelated_session,'keep-session','unrelated sessionStorage keys must remain untouched');
console.log('PASS: backup v2 restores profile, standalone modules, settings and dynamic reading progress; v1 remains compatible and delete-all is scoped.');
