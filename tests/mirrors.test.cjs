const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM,ResourceLoader,VirtualConsole}=require('jsdom');
const root=path.join(__dirname,'../game_v4'),D=require('../game_v4/mirrors-data.js');
const scene='slot.html?id=mirrors';
const answer=id=>({option_id:id});
for(const a of [...D.ids,'custom'])for(const b of [...D.ids,'custom','no_event','unknown']){
 const expected=['no_event','unknown'].includes(b)?'insufficient':a==='custom'||b==='custom'?'custom':a==='F'||b==='F'?'situational':a===b?'same':'different';
 assert.equal(D.compare(answer(a),answer(b)),expected,a+' / '+b);
}
assert.equal(D.compare(null,answer('A')),'insufficient');
assert.equal(new Set(D.questions.map(q=>q.id)).size,6);
for(const gender of ['m','f'])for(const q of D.questions){
 for(const phase of ['self','actions'])assert.deepEqual(D.options(q,phase,gender).slice(0,6).map(x=>x.id),D.ids);
 const own=D.create(gender,new Date(2026,10,7,12).getTime());
 assert.equal(own.period_start,'2026-10-25');assert.equal(own.period_end,'2026-11-07');
 D.answer(own,'self',0,'A');D.answer(own,'actions',0,'A');assert.equal(own.self_image.start.question_id,'start');assert.equal(own.actual_actions.start.selected_text,gender==='f'?'Сразу сделала первый конкретный шаг.':'Сразу сделал первый конкретный шаг.');
 own.main_observation={option_id:'A'};own.personal_note='old';own.clarification=[{option_id:'external'}];own.comparison=[{}];own.pair_notes={start:'old'};D.answer(own,'actions',0,'B');assert.equal(own.main_observation,null);assert.deepEqual(own.comparison,[]);assert.deepEqual(own.clarification,[]);assert.equal(own.personal_note,'');assert.deepEqual(own.pair_notes,{});
}
assert.equal(D.options(D.questions[2],'self','f')[0].text,'Стараюсь сохранить время и место для того, чего хочу сама.');
assert.equal(D.options(D.questions[3],'self','f')[2].text,'Могу согласиться внешне, хотя внутри остаюсь несогласной.');
for(const f of ['mirrors-data.js','mirrors.js'])assert.doesNotMatch(fs.readFileSync(path.join(root,f),'utf8'),/ё|innerHTML|fetch\(|XMLHttpRequest/);
const seed={name:'Тест',gender:'f',birth:'10.02.1979',wheel:[1,2,3,4,5,6,7,8],passport:{preserved:true,layers:{positions:{A:10}},answers:{}},reactor:{day:5},other:{untouched:true},flow:{version:2,last:scene,current:scene,completed:{'wheel-test.html':123}},diary:{ins:[],q:[]}};
// Component regressions isolate scene controllers; tasks-browser.py exercises the real entry gate.
class Local extends ResourceLoader{fetch(url){const u=new URL(url);if(u.hostname!=='game.test'||(u.pathname.endsWith('upd.js')||u.pathname.endsWith('route-gate.js')))return Promise.resolve(Buffer.from(''));const f=path.join(root,path.basename(u.pathname));if(!fs.existsSync(f))throw Error('Missing '+f);return Promise.resolve(fs.readFileSync(f));}}
async function page(name,profile=seed,session){const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('navigation'))errors.push(e.message);});const dom=new JSDOM(fs.readFileSync(path.join(root,name.split('?')[0]),'utf8'),{url:'https://game.test/'+name,runScripts:'dangerously',resources:new Local(),virtualConsole:vc,beforeParse(w){w.localStorage.setItem('alch_profile',JSON.stringify(profile));if(session)w.sessionStorage.setItem('alch_mirror_preview',session);w.scrollTo=()=>{};}});await new Promise((yes,no)=>{dom.window.addEventListener('load',yes,{once:true});setTimeout(()=>no(Error('Load timeout '+name)),5000).unref();});assert.deepEqual(errors,[],name+' runtime errors');return dom;}
const profile=dom=>JSON.parse(dom.window.localStorage.getItem('alch_profile'));
function buttons(dom){return [...dom.window.document.querySelectorAll('#m button')];}
function click(dom,text){const b=buttons(dom).find(b=>b.textContent===text);assert.ok(b,'Missing '+text);assert.equal(b.disabled,false,text+' disabled');b.click();}
function input(dom,selector,value){const t=dom.window.document.querySelector(selector);assert.ok(t,selector);t.value=value;t.dispatchEvent(new dom.window.Event('input',{bubbles:true}));}
function choice(dom,id){const b=dom.window.document.querySelector('[data-option="'+id+'"]');assert.ok(b,id);b.click();}
function draft(dom){return profile(dom).mirrors.draft;}
async function reload(dom,url=scene){const next=await page(url,profile(dom),dom.window.sessionStorage.getItem('alch_mirror_preview'));dom.window.close();return next;}
function phase(dom){return draft(dom)?.phase;}
const malicious='<img src=x onerror="window.hacked=1">';
async function fill(dom,selfIds,actionIds,{reloads=false}={}){
 const previous=profile(dom).mirror_exercise,previousComplete=profile(dom).flow.completed[scene];
 click(dom,'Посмотреть в первое зеркало');assert.equal(phase(dom),'self');
 const period=draft(dom).period_start;
 for(let i=0;i<6;i++){
  choice(dom,selfIds[i]);if(selfIds[i]==='custom')input(dom,'.mirror-field textarea',malicious);
  if(reloads){dom=await reload(dom);assert.equal(draft(dom).index,i);assert.equal(draft(dom).period_start,period);}
  click(dom,i===5?'Завершить первое зеркало':'Далее');
 }
 assert.equal(phase(dom),'transition');if(reloads)dom=await reload(dom);
 click(dom,'Перейти ко второму зеркалу');
 for(let i=0;i<6;i++){
  assert.equal(dom.window.document.querySelectorAll('.mirror-pair').length,0,'No first mirror answers during actions');
  choice(dom,actionIds[i]);if(actionIds[i]==='custom')input(dom,'.mirror-field textarea',malicious+' действие');
  if(reloads){dom=await reload(dom);assert.equal(draft(dom).index,i);assert.equal(draft(dom).period_start,period);}
  click(dom,i===5?'Совместить зеркала':'Далее');
 }
 assert.equal(phase(dom),'compare');if(reloads)dom=await reload(dom);
 assert.equal(dom.window.document.querySelectorAll('.mirror-pair').length,6);
 assert.deepEqual(profile(dom).mirror_exercise,previous,'No completion on comparison');
 assert.equal(dom.window.GRoute.ready(scene,profile(dom)),false);dom.window.GRoute.complete(scene);assert.equal(profile(dom).flow.completed[scene],previousComplete,'Cannot bypass save');
 click(dom,'Что я замечаю');if(reloads)dom=await reload(dom);assert.equal(phase(dom),'observe');return dom;
}
function observe(dom,id){dom.window.document.querySelector('[data-observation="'+id+'"]').click();}
function finish(dom){click(dom,'Сохранить наблюдение');assert.ok(profile(dom).mirror_exercise.completed_at);assert.equal(profile(dom).mirrors.draft,null);assert.equal(dom.window.GRoute.ready(scene,profile(dom)),true);}
(async()=>{
 for(const [kind,selfIds,actionIds,status] of [
  ['agree',Array(6).fill('A'),Array(6).fill('A'),'same'],
  ['different',Array(6).fill('A'),Array(6).fill('B'),'different'],
  ['situational',Array(6).fill('F'),Array(6).fill('F'),'situational'],
  ['custom',Array(6).fill('custom'),Array(6).fill('A'),'custom'],
  ['missing',Array(6).fill('custom'),['no_event','unknown','no_event','unknown','no_event','unknown'],'insufficient']]){
  let dom=await page(scene,{...seed,gender:kind==='agree'?'m':'f'});dom=await fill(dom,selfIds,actionIds,{reloads:kind==='agree'});
  assert.deepEqual(draft(dom).comparison.map(c=>c.status),Array(6).fill(status));
  assert.equal(dom.window.document.querySelector('img[src=x]'),null);assert.equal(dom.window.hacked,undefined);
  observe(dom,kind==='different'?'C':'F');if(kind==='different'){
   dom.window.document.querySelector('[data-cause=external]').click();dom.window.document.querySelector('[data-cause=resources]').click();
   input(dom,'label.mirror-field textarea',malicious);
  }
  finish(dom);const p=profile(dom);assert.equal(p.mirrors.history.length,1);assert.equal(p.diary.ins.length,1);assert.ok(p.flow.completed[scene]);assert.equal(p.flow.current,'slot.html?id=source');assert.equal(p.flow.completed['wheel-test.html'],123);assert.deepEqual(p.wheel,seed.wheel);assert.deepEqual(p.passport,seed.passport);assert.deepEqual(p.reactor,seed.reactor);assert.deepEqual(p.other,seed.other);assert.equal(p.mirror_exercise.self_image.start.option_id,selfIds[0]);
  if(kind==='different'){
   assert.deepEqual(p.mirror_exercise.clarification.map(c=>c.option_id),['external','resources']);assert.ok(p.diary.ins[0].x.includes('Повлияли внешние обстоятельства.'));
   const read=await page(scene+'&review='+p.mirror_exercise.id,p);assert.deepEqual(profile(read),p,'Read-only must not change profile');assert.equal(buttons(read).length,0);assert.equal(read.window.GRoute.ready(scene,p),false);read.window.GRoute.complete(scene);assert.deepEqual(profile(read),p);assert.equal(read.window.document.querySelector('img[src=x]'),null);read.window.close();
   const diary=await page('diary.html?tab=tests',p);assert.ok(diary.window.document.querySelector('a[href*="review="]'));assert.equal(diary.window.document.querySelector('img[src=x]'),null);diary.window.close();
   const source=await page('slot.html?id=source',p);assert.ok(source.window.document.querySelector('#m').textContent.includes(p.mirror_exercise.main_observation.selected_text));assert.equal(source.window.document.querySelector('img[src=x]'),null);assert.equal(profile(source).flow.completed['slot.html?id=source'],undefined);source.window.close();
   click(dom,'Пройти еще раз');assert.equal(phase(dom),'intro');assert.equal(dom.window.GRoute.ready(scene,profile(dom)),false);assert.deepEqual(profile(dom).mirrors.history[0],p.mirrors.history[0]);
   dom=await fill(dom,Array(6).fill('B'),Array(6).fill('B'));observe(dom,'custom');input(dom,'.mirror-field textarea','Мое наблюдение');finish(dom);assert.equal(profile(dom).mirrors.history.length,2);assert.equal(profile(dom).diary.ins.length,2);assert.deepEqual(profile(dom).mirrors.history[0],p.mirrors.history[0]);
  }
  dom=await reload(dom);assert.ok(dom.window.document.querySelector('#m').textContent.includes('Отражение собрано'));assert.equal(profile(dom).mirrors.history.length,kind==='different'?2:1);dom.window.close();
 }
 // Editing a previous raw answer must invalidate all derived notes and comparisons.
 let edit=await fill(await page(scene),Array(6).fill('A'),Array(6).fill('B'));observe(edit,'D');input(edit,'label.mirror-field textarea','Устаревающий вывод');click(edit,'Назад');input(edit,'.mirror-pair textarea','Устаревающее уточнение');click(edit,'Назад');assert.equal(draft(edit).index,5);choice(edit,'C');assert.equal(draft(edit).main_observation,null);assert.deepEqual(draft(edit).comparison,[]);assert.deepEqual(draft(edit).pair_notes,{});assert.equal(draft(edit).personal_note,'');edit=await reload(edit);assert.equal(draft(edit).actual_actions.promise.option_id,'C');click(edit,'Совместить зеркала');assert.equal(draft(edit).comparison.length,6);edit.window.close();
 // In-progress cause/observation fields survive exact reload, and changing observation clears causes.
 let obs=await fill(await page(scene),Array(6).fill('A'),Array(6).fill('C'));observe(obs,'B');obs.window.document.querySelector('[data-cause=custom]').click();input(obs,'.mirror-field textarea','Моя причина');input(obs,'.mirror-field:last-of-type textarea','Личная запись');obs=await reload(obs);assert.equal(draft(obs).cause_note,'Моя причина');assert.equal(draft(obs).personal_note,'Личная запись');assert.ok(obs.window.document.body.textContent.includes('Я обнаружила'));observe(obs,'A');assert.deepEqual(draft(obs).clarification,[]);assert.equal(draft(obs).cause_note,'');finish(obs);obs.window.close();
 // A failed storage write cannot mark completion or duplicate a saved result.
 let failure=await fill(await page(scene),Array(6).fill('A'),Array(6).fill('B'));observe(failure,'F');const originalSet=failure.window.Storage.prototype.setItem;failure.window.Storage.prototype.setItem=function(){throw Error('Storage unavailable');};click(failure,'Сохранить наблюдение');assert.equal(profile(failure).mirror_exercise,undefined);assert.equal(profile(failure).flow.completed[scene],undefined);assert.ok(failure.window.document.querySelector('.mirror-save-status').textContent.includes('Не удалось'));failure.window.Storage.prototype.setItem=originalSet;finish(failure);assert.equal(profile(failure).mirrors.history.length,1);assert.equal(profile(failure).diary.ins.length,1);failure.window.close();
 // Preview isolation, including completion and repeat.
 let prev=await page(scene+'&preview=1');const before=profile(prev);click(prev,'Посмотреть в первое зеркало');for(let i=0;i<6;i++){choice(prev,'A');click(prev,i===5?'Завершить первое зеркало':'Далее');}click(prev,'Перейти ко второму зеркалу');for(let i=0;i<6;i++){choice(prev,'B');click(prev,i===5?'Совместить зеркала':'Далее');}click(prev,'Что я замечаю');observe(prev,'F');click(prev,'Сохранить наблюдение');assert.deepEqual(profile(prev),before);assert.ok(JSON.parse(prev.window.sessionStorage.getItem('alch_mirror_preview')).history.length);prev=await reload(prev,scene+'&preview=1');assert.deepEqual(profile(prev),before);prev.window.close();
 // Legacy placeholder completion must not falsely satisfy the new exercise.
 const legacy=await page(scene,{...seed,flow:{version:2,current:'slot.html?id=leverage',last:'slot.html?id=leverage',completed:{'slot.html?id=fractal':1,[scene]:10}}});assert.equal(legacy.window.GRoute.ready(scene,profile(legacy)),false);assert.equal(legacy.window.GRoute.resume(),'slot.html?id=leverage');const flow=Array.from(legacy.window.GFLOW,x=>x.u),i=flow.indexOf(scene);assert.equal(flow[i-1],'wheel-test.html');assert.equal(flow[i+1],'slot.html?id=source');legacy.window.close();
 console.log('PASS: all status combinations/precedence; six matched IDs; M/F copy; 14-day frozen interval; five complete scenarios; every-question and phase reload; no hidden self answers; back/edit invalidation; safe text rendering; real cause labels; explicit completion; diary/source continuity; repeat history; read-only and preview isolation; legacy saves and route order.');
})().catch(e=>{console.error(e);process.exit(1);});
