/* Карта истинных желаний — интерактивный ежедневник-игра */
(() => {
"use strict";
const DONATE_URL = "#";
const KEY = "karta.v1";
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const uid = () => Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
const clamp = (n,a,b) => Math.max(a, Math.min(b, n));
const pad = n => (n<10?"0":"")+n;
const avg = a => { const x=a.filter(v=>v||v===0).filter(v=>v>0); return x.length? x.reduce((s,v)=>s+v,0)/x.length : 0; };
const r1 = n => Math.round(n*10)/10;

const SPH = [
  {id:"health", name:"Здоровье", bagua:"me", freq:"Как часто удается заботиться о теле без чувства вины?"},
  {id:"money", name:"Деньги", bagua:"wealth", freq:"Как часто хватает средств на то, что важно именно вам?"},
  {id:"work", name:"Дело", bagua:"career", freq:"Как часто в деле есть ясный следующий шаг?"},
  {id:"love", name:"Любовь", bagua:"love", freq:"Как часто есть близость, в которой можно быть собой?"},
  {id:"family", name:"Семья", bagua:"family", freq:"Как часто отношения в семье дают опору?"},
  {id:"friends", name:"Друзья и помощники", bagua:"helpers", freq:"Как часто рядом есть люди, на которых можно опереться?"},
  {id:"growth", name:"Знания и рост", bagua:"knowledge", freq:"Как часто есть время учиться или пробовать новое?"},
  {id:"rest", name:"Отдых и творчество", bagua:"children", freq:"Как часто удается отдыхать и делать что-то для радости?"}
];
const VALS = ["Свобода","Любовь","Семья","Здоровье","Творчество","Развитие","Смысл","Стабильность","Приключения","Служение","Признание","Красота","Деньги","Спокойствие","Дружба","Сила","Честность","Любознательность","Гармония","Лидерство"];
const BAGUA = [
  {id:"wealth", title:"Богатство"},
  {id:"fame", title:"Слава"},
  {id:"love", title:"Любовь"},
  {id:"family", title:"Семья"},
  {id:"me", title:"Я и здоровье"},
  {id:"children", title:"Дети и творчество"},
  {id:"knowledge", title:"Знания"},
  {id:"career", title:"Карьера"},
  {id:"helpers", title:"Помощники и путешествия"}
];
const EMBLEMS = ["✦","❀","☉","☾","❧","◎","☆","◈","◇"];
const SEASONS = [
  {key:"spring", name:"Весна", sub:"запуск", hex:"#7FA968"},
  {key:"summer", name:"Лето", sub:"действие", hex:"#D9A441"},
  {key:"autumn", name:"Осень", sub:"корректировка", hex:"#B4552D"},
  {key:"winter", name:"Зима", sub:"итог", hex:"#6C86A0"}
];
const MET = [
  {key:"well", name:"Самочувствие", color:"#6C86A0"},
  {key:"energy", name:"Энергия", color:"#C4A35A"},
  {key:"mood", name:"Настроение", color:"#7FA968"},
  {key:"matrix", name:"Сам / Надо", color:"#B4552D"}
];
const RULES = [
  ["Будильник звонит в 7:00 в пн, ср или пт","надеваю форму, которая с вечера лежит на стуле"],
  ["Вышла из подъезда, а на улице дождь","иду в зал вместо прогулки"],
  ["Закрыла ноутбук в конце рабочего дня","сразу иду на прогулку на 20 минут"],
  ["Села за стол утром","первым делом открываю задачу номер один из вчерашнего списка и ничего больше"],
  ["Взяла телефон в руки без конкретной цели","кладу его экраном вниз и вслух называю, зачем он был нужен"],
  ["Будильник прозвенел","сажусь на край кровати и ставлю обе ноги на пол"],
  ["Поставила чайник","пока он закипает, наливаю стакан воды и выпиваю его"],
  ["Открыла дверь холодильника вечером без плана","закрываю его и режу заранее готовые овощи"],
  ["Села в транспорт","первые две остановки смотрю в окно, а не в телефон"],
  ["Появилось сообщение, которое хочется сразу ответить с раздражением","откладываю ответ на десять минут"],
  ["Закончилось одно дело","встаю, делаю три вдоха и только потом выбираю следующее"],
  ["Легла в кровать","кладу телефон на тумбочку экраном вниз"],
  ["Прозвенело напоминание о еде","останавливаюсь и сажусь поесть, даже если хочется доделать еще одну мелочь"],
  ["Вышла на лестничную площадку","спускаюсь пешком на один пролет"],
  ["Села ждать встречу","достаю блокнот и записываю один маленький шаг на сегодня"],
  ["Услышала критику в свой адрес","сначала записываю факт, и только потом решаю, что с ним делать"]
];
const BELIEFS = [
  ["Отдых надо заслужить","Я отдыхаю, и это часть дня, а не награда"],
  ["Если не идеально, лучше не показывать","Я показываю один незаконченный результат и оставляю его как есть"],
  ["Мои желания — это эгоизм","Я могу хотеть своего, и это не отнимает у других"],
  ["Сначала все для других","Я делаю одно дело для себя до того, как возьмусь за чужие просьбы"],
  ["Ошибаться стыдно","Я замечаю ошибку и делаю следующий маленький шаг"],
  ["Надо быть сильной всегда","Я могу попросить о простой помощи"],
  ["Деньги даются тяжело","Я спокойно принимаю оплату за свою работу"],
  ["Если меня не хвалят, я недостаточно хороша","Я сама отмечаю, что сегодня получилось"],
  ["Нельзя начинать, пока не готова полностью","Я начинаю с пяти минут и останавливаюсь, когда решу"],
  ["Мое мнение никому не нужно","Я высказываю одну мысль вслух"],
  ["Если откажу, меня не полюбят","Я говорю одно спокойное нет"],
  ["Успех — это когда все довольно","Я считаю день состоявшимся, если сделала выбранный шаг"],
  ["Нельзя выделяться","Я показываю одну свою работу человеку, которому доверяю"],
  ["Надо все контролировать","Я отпускаю один пункт, который и так не в моих руках"],
  ["Я слишком много хочу","Я оставляю одно желание и даю ему место"],
  ["Без спешки ничего не успею","Я делаю одно дело в своем темпе до конца"],
  ["Чужие нужды важнее моих","Я сначала закрываю свою базовую нужду, потом отвечаю другим"],
  ["Если не получилось сразу, это не мое","Я повторяю маленький шаг еще раз"],
  ["Надо заслуживать любовь","Я принимаю простой знак внимания без отработки"],
  ["Я должна все помнить сама","Я записываю одно дело и больше его не кручу в голове"]
];
const MOTIVE_PICS = [
  {id:"p1", title:"Человек у порога", hint:"Кто-то стоит у открытой двери и смотрит вперед."},
  {id:"p2", title:"Двое за столом", hint:"Два человека сидят напротив, между ними чашка и письмо."},
  {id:"p3", title:"Гора и тропа", hint:"Тропа поднимается в гору, на полпути стоит рюкзак."},
  {id:"p4", title:"Сцена и свет", hint:"Пустой зал, на сцене горит один фонарь."},
  {id:"p5", title:"Река и лодка", hint:"Лодка у берега, на другой стороне виден дом."},
  {id:"p6", title:"Мастерская", hint:"Стол с инструментами, одна вещь почти закончена, другая только начата."}
];
const MOTIVE_OPTS = [
  {k:"ach", t:"Довести дело до ясного результата"},
  {k:"aff", t:"Быть рядом с близким человеком"},
  {k:"pow", t:"Повлиять на ход событий"},
  {k:"aut", t:"Идти своим путем, без чужой указки"}
];
const MINI = ["Три спокойных вдоха","Стакан воды","Две минуты тишины","Записать одну мысль и отложить","Выйти к окну на минуту","Поблагодарить за одну мелочь"];
const ONB = ["apply","needs","wishes","rings","pair","motive","clean","gains","result","values","goals","map"];
const ONB_TITLE = {apply:"Заявка",needs:"Уточним заявку",wishes:"Другие желания",rings:"Близость",pair:"Одно рядом",motive:"Что в образе",clean:"Образ желания",gains:"Что держит",result:"Моя карта",values:"Ценности",goals:"Три цели",map:"Карта желаний"};

function g(m,f){ return (S.user.gender==="m")?m:f; }
function delWord(n){ const m=Math.abs(n)%100, m1=m%10; if(m>10&&m<20) return "дел"; if(m1===1) return "дело"; if(m1>=2&&m1<=4) return "дела"; return "дел"; }
function fmtDur(ms){ const m=Math.max(0,Math.round((ms||0)/60000)); const h=Math.floor(m/60), mm=m%60; if(h&&mm) return h+" ч "+mm+" мин"; if(h) return h+" ч"; if(!m) return "меньше минуты"; return mm+" мин"; }
function fmtClock(ts){ if(!ts) return "—"; const d=new Date(ts); return pad(d.getHours())+":"+pad(d.getMinutes()); }
function iso(d){ d=d||new Date(); return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
function isoFrom(k){ const [y,m,d]=k.split("-").map(Number); return new Date(y,m-1,d); }
function addDays(k,n){ const d=isoFrom(k); d.setDate(d.getDate()+n); return iso(d); }
function diffDays(a,b){ return Math.round((isoFrom(b)-isoFrom(a))/86400000); }
function todayISO(){ return iso(new Date()); }
function volumeLine(n, ms, period){
  const verb=g("сделал","сделала");
  const dur=fmtDur(ms);
  if(period==="day") return "Сегодня ты "+verb+" "+n+" "+delWord(n)+" — "+dur+". Это твой реальный объем дня";
  if(period==="week") return "За эту неделю ты "+verb+" "+n+" "+delWord(n)+" — "+dur+". Это твой реальный объем недели";
  return "За 28 дней ты "+verb+" "+n+" "+delWord(n)+" — "+dur+". Это твой реальный объем цикла";
}

const MONTHS=["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
function fmtLong(k){ const d=isoFrom(k); return d.getDate()+" "+MONTHS[d.getMonth()]; }

function def(){
  return {
    version:1,
    user:{name:"", gender:"f", sounds:true},
    onb:{step:"apply", done:false, idx:0},
    wish:{text:"", history:[], approach:"to", launchedAt:null, origin:null, refined:null, status:"active"},
    wishes:[],
    rings:{order:[], moves:{}, think:{}, pair:null, pairPick:null},
    needs:{wheel:{}, worth:5, bg:"", startWheel:null},
    motive:{picks:{}, note:"", kind:null},
    clean:{q1:"",q2:"",q3:""},
    gains:{items:[], note:"", skipped:false},
    values:{ranked:[]},
    goals:[],
    map:{sectors:{}},
    cycle:{startedOn:null},
    days:{},
    proofs:[],
    phrases:[],
    rules:[],
    dump:[],
    aff:{belief:null, text:"", feel:"", ev:[]},
    tune:{feel:[], ev:[]},
    grat:{mode:"diary", min:10, target:50, log:{}},
    silence:{secs:0, on:false},
    assistant:{messages:[]},
    archive:[],
    weekReviews:{},
    final:null,
    ui:{tab:"today", modal:null, dayTab:null, hourOpen:null, prac:null}
  };
}
let S = def();
let holdT=null, holdP=0, silTimer=null, sessTimer=null, toastT=null;

function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){ console.warn(e); } }
function load(){
  try{ const raw=localStorage.getItem(KEY); if(raw){ const o=JSON.parse(raw); S=Object.assign(def(), o); S.user=Object.assign(def().user, o.user||{}); S.wish=Object.assign(def().wish, o.wish||{}); S.ui=Object.assign(def().ui, o.ui||{}); }
  }catch(e){ S=def(); }
}

/* ---------- sound ---------- */
let actx=null;
function ctx(){ if(!actx){ try{ actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } return actx; }
function beep(freq, dur, type, vol, delay){
  if(!S.user.sounds) return;
  const c=ctx(); if(!c) return;
  const t=c.currentTime+(delay||0);
  const o=c.createOscillator(), g=c.createGain();
  o.type=type||"sine"; o.frequency.value=freq;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol||0.05,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+(dur||0.12));
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+(dur||0.15)+0.02);
}
function clickSnd(){ beep(660,0.07,"sine",0.04); }
function launchSnd(){ beep(392,0.18,"sine",0.06); beep(523,0.22,"sine",0.05,0.12); beep(659,0.4,"sine",0.05,0.26); }
function celebSnd(){ beep(784,0.1,"triangle",0.05); beep(988,0.16,"triangle",0.04,0.09); }

/* ---------- photos (idb) ---------- */
const photoCache={};
function idbOpen(){ return new Promise((res,rej)=>{ const r=indexedDB.open("karta-photos",1); r.onupgradeneeded=()=>r.result.createObjectStore("p"); r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); }
async function photoPut(id, blob){ try{ const db=await idbOpen(); await new Promise((res,rej)=>{ const tx=db.transaction("p","readwrite"); tx.objectStore("p").put(blob,id); tx.oncomplete=res; tx.onerror=()=>rej(tx.error); }); photoCache[id]=URL.createObjectURL(blob); }catch(e){ console.warn(e); } }
async function photoGet(id){ if(photoCache[id]) return photoCache[id]; try{ const db=await idbOpen(); const blob=await new Promise((res,rej)=>{ const tx=db.transaction("p","readonly"); const q=tx.objectStore("p").get(id); q.onsuccess=()=>res(q.result); q.onerror=()=>rej(q.error); }); if(blob){ photoCache[id]=URL.createObjectURL(blob); return photoCache[id]; } }catch(e){} return null; }
async function photoAll(){ const out={}; try{ const db=await idbOpen(); const keys=await new Promise((res,rej)=>{ const tx=db.transaction("p","readonly"); const q=tx.objectStore("p").getAllKeys(); q.onsuccess=()=>res(q.result||[]); q.onerror=()=>rej(q.error); }); for(const k of keys){ const blob=await new Promise((res,rej)=>{ const tx=db.transaction("p","readonly"); const q=tx.objectStore("p").get(k); q.onsuccess=()=>res(q.result); q.onerror=()=>rej(q.error); }); if(blob){ out[k]=await new Promise(r=>{ const fr=new FileReader(); fr.onload=()=>r(fr.result); fr.readAsDataURL(blob); }); } } }catch(e){} return out; }
async function photoImport(map){ if(!map) return; for(const [k,url] of Object.entries(map)){ const blob=await fetch(url).then(r=>r.blob()).catch(()=>null); if(blob) await photoPut(k, blob); } }

function compressFile(file){ return new Promise((res,rej)=>{ const img=new Image(); const url=URL.createObjectURL(file); img.onload=()=>{ const s=Math.min(1, 1000/Math.max(img.width,img.height)); const c=document.createElement("canvas"); c.width=Math.round(img.width*s); c.height=Math.round(img.height*s); c.getContext("2d").drawImage(img,0,0,c.width,c.height); c.toBlob(b=>{ URL.revokeObjectURL(url); res(b); },"image/jpeg",0.86); }; img.onerror=rej; img.src=url; }); }

/* ---------- cycle / days ---------- */
function launched(){ return !!(S.cycle && S.cycle.startedOn); }
function dayNum(k){ if(!S.cycle.startedOn) return 0; return clamp(diffDays(S.cycle.startedOn, k||todayISO())+1, 1, 28); }
function todayNum(){ return launched()? clamp(dayNum(todayISO()),1,28) : 1; }
function seasonOf(n){ n=n||todayNum(); return SEASONS[clamp(Math.ceil(n/7),1,4)-1]; }
function drec(k){
  k=k||todayISO();
  if(!S.days[k]) S.days[k]={metrics:{}, hours:{}, steps:[], evening:{}, impulses:[], tabs:{ch:false,grat:false,tune:false}, ch:{on:false, start:null, end:null, stop:null, rows:[]}, gratList:[], weekly:null};
  const d=S.days[k]; d.metrics=d.metrics||{}; d.hours=d.hours||{}; d.steps=d.steps||[]; d.evening=d.evening||{}; d.impulses=d.impulses||[]; d.tabs=d.tabs||{ch:false,grat:false,tune:false}; d.ch=d.ch||{on:false,start:null,end:null,stop:null,rows:[]}; d.ch.rows=d.ch.rows||[]; d.gratList=d.gratList||[];
  return d;
}
function hourRec(k,h){ const d=drec(k); d.hours[h]=d.hours[h]||{text:"",flag:false}; return d.hours[h]; }
function wishText(){ return (S.wish.refined||S.wish.text||"").trim(); }
function toast(t){ clearTimeout(toastT); let el=$(".toast"); if(!el){ el=document.createElement("div"); el.className="toast"; document.body.appendChild(el); } el.textContent=t; el.style.display="block"; toastT=setTimeout(()=>{ el.remove(); }, 2400); }
function celebrate(t){ celebSnd(); const el=document.createElement("div"); el.className="celebrate"; el.textContent=t||"✦"; document.body.appendChild(el); setTimeout(()=>el.remove(),900); }

/* volume of choose-do-done deeds (bonus rows excluded) */
function deedStats(keys){
  let n=0, ms=0, rows=[];
  (keys||[]).forEach(k=>{
    const d=S.days[k]; if(!d||!d.ch) return;
    (d.ch.rows||[]).forEach(r=>{
      if(r.bonus) return;
      if(r.status==="done"||r.status==="switched"){
        n++; const a=r.tDo||r.tChoose, b=r.tDone;
        if(a&&b&&b>a) ms+= (b-a);
        rows.push(Object.assign({day:k}, r));
      }
    });
  });
  return {n, ms, rows};
}
function dayKeysInRange(fromN, toN){
  if(!S.cycle.startedOn) return [];
  const out=[];
  for(let i=fromN;i<=toN;i++){ out.push(addDays(S.cycle.startedOn, i-1)); }
  return out;
}
function weekKeys(n){ n=n||todayNum(); const w=clamp(Math.ceil(n/7),1,4); return dayKeysInRange((w-1)*7+1, Math.min(w*7, n, 28)); }

function syncDeedToHours(k, row){
  if(!row||row.bonus) return;
  const a=row.tDo||row.tChoose, b=row.tDone||Date.now();
  if(!a) return;
  const start=new Date(a), end=new Date(b);
  let h0=start.getHours(), h1=end.getHours();
  if(iso(start)!==k) h0=0;
  if(iso(end)!==k) h1=23;
  if(h1<h0) h1=h0;
  for(let h=h0;h<=h1;h++){
    const hr=hourRec(k,h);
    hr.deeds=hr.deeds||[];
    if(!hr.deeds.some(x=>x.id===row.id)) hr.deeds.push({id:row.id, text:row.choice||"", status:row.status, bonus:!!row.bonus});
  }
}

function maybeBonus(k){
  const d=drec(k);
  const doneRows=(d.ch.rows||[]).filter(r=>!r.bonus && (r.status==="done"||r.status==="switched"));
  const bonuses=(d.ch.rows||[]).filter(r=>r.bonus).length;
  const should=Math.floor(doneRows.length/3);
  if(should>bonuses){
    d.ch.rows.push({id:uid(), bonus:true, choice:wishText(), status:"bonus", tChoose:Date.now(), noticed:null, note:""});
    save();
  }
}

function CONFIRM(){ return "Все мои желания исполняются быстро, просто и легко наилучшим образом для меня"; }
const BONUS_HINT = "Эта строчка — подсказка для внимания. Когда мозг знает, что для тебя важно, он чаще замечает похожее вокруг: людей, идеи, возможности. Отмечай, что попадается на глаза, и продолжай: выбираю сделать, делаю, сделано";


/* ---------- origin ---------- */
function originSignals(){
  const sig=[];
  if((S.wish.approach||"to")==="to") sig.push({ok:true, t:"Желание сформулировано как «прийти к», а не как «уйти от»."});
  else sig.push({ok:false, t:"Сейчас это больше похоже на «уйти от». Можно уточнить, к чему хочется прийти."});
  const v=S.values.ranked||[];
  const w=wishText().toLowerCase();
  const hit=v.slice(0,5).some(x=>w.includes(String(x).toLowerCase().slice(0,5)));
  if(v.length && (hit || (S.goals||[]).some(g=> (S.values.ranked.slice(0,5)||[]).includes(g.value))))
    sig.push({ok:true, t:"Оно согласуется с выбранными ценностями."});
  else if(v.length) sig.push({ok:false, t:"Пока не видно ясной связи с верхними ценностями. Это не приговор, просто заметка."});
  const days=Object.keys(S.days).sort();
  const recent=days.slice(-10);
  let self=0, tot=0;
  recent.forEach(k=>{ const h=S.days[k].hours||{}; Object.values(h).forEach(x=>{ if(x && x.matrix){ tot++; if(x.matrix>=6) self++; } if(x && x.energy) tot+=0; }); const m=S.days[k].metrics||{}; if(m.matrix){ tot++; if(m.matrix>=6) self++; }});
  if(tot>=4){
    if(self/tot>=0.6) sig.push({ok:true, t:"По отметкам «сам / надо» желание чаще опирается на собственный интерес."});
    else sig.push({ok:false, t:"По отметкам «сам / надо» чаще слышится «надо». Стоит посмотреть, откуда это."});
  }
  const motive=S.motive.kind;
  if(motive) sig.push({ok:true, t:"В образах проявился свой мотив: "+motiveName(motive)+"."});
  const clean=S.clean||{};
  if((clean.q1||"").trim() && (clean.q2||"").trim()) sig.push({ok:true, t:"Образ желания уже описан своими словами: что это и где это."});
  return sig.slice(0,4);
}
function motiveName(k){ return {ach:"достижение",aff:"близость",pow:"влияние",aut:"самостоятельность"}[k]||k; }
function originLabel(){
  const sig=originSignals();
  const ok=sig.filter(s=>s.ok).length;
  let label="предварительно";
  let kind="истинное";
  const to=(S.wish.approach||"to")==="to";
  const gains=(S.gains.items||[]).length>0 && !S.gains.skipped;
  if(ok>=3 && to && !gains) { label="уверенно"; kind="истинное"; }
  else if(!to && ok<3) { kind="защита"; label=ok>=2?"предварительно":"предварительно"; }
  else if(gains && ok<3) { kind="компенсация"; }
  else if(!to) { kind="пришло извне"; }
  else { kind="истинное"; label=ok>=3?"уверенно":"предварительно"; }
  return {kind, label, ok, need:3, sig};
}
function setOrigin(){ S.wish.origin=originLabel(); save(); }

/* ---------- render shell ---------- */
function shell(inner, opts){
  opts=opts||{};
  const name=S.user.name? esc(S.user.name)+", " : "";
  const n=launched()? todayNum(): 0;
  const sea=launched()? seasonOf(n): null;
  const started=launched();
  const showOnb=!S.onb.done && !opts.forceApp;
  let progress="";
  if(showOnb && !opts.noProg){
    const i=Math.max(0, ONB.indexOf(S.onb.step));
    progress=`<div class="progress" aria-hidden="true">${ONB.map((_,k)=>`<i class="${k<=i?"on":""}"></i>`).join("")}</div>`;
  }
  let top="";
  if(started && !showOnb){
    top=`<header class="top">
      <div class="who">${name}${esc(sea.name)} · день ${n} из 28</div>
      <div class="wishline">${esc(wishText()||"Мое желание")}</div>
    </header>`;
  } else if(!showOnb){
    top=`<header class="top"><div class="who">${name}Карта истинных желаний</div></header>`;
  }
  const tabs=(!showOnb || opts.forceApp)?`
    <nav class="tabbar" id="tabbar">
      <button type="button" data-nav="today" class="${S.ui.tab==="today"?"on":""}">Сегодня</button>
      <button type="button" data-nav="map" class="${S.ui.tab==="map"?"on":""}">Карта</button>
      <button type="button" data-nav="prac" class="${S.ui.tab==="prac"?"on":""}">Практики</button>
      <button type="button" data-nav="rep" class="${S.ui.tab==="rep"?"on":""}">Итоги</button>
    </nav>`:"";
  const fab=(!showOnb)?`<button type="button" class="fab" data-act="help" aria-label="Помощник">?</button>`:"";
  return `${top}${progress}<div class="wrap">${inner}</div>${tabs}${fab}`;
}

function dots(step){
  const i=Math.max(0, ONB.indexOf(step));
  return `<div class="progress">${ONB.map((_,k)=>`<i class="${k<=i?"on":""}"></i>`).join("")}</div>`;
}

function goOnb(step){ S.onb.step=step; S.onb.idx=Math.max(0,ONB.indexOf(step)); save(); render(); window.scrollTo(0,0); }
function nextOnb(){ const i=ONB.indexOf(S.onb.step); if(i<ONB.length-1) goOnb(ONB[i+1]); else startCycle(); }

function startCycle(){
  S.onb.done=true;
  if(!S.cycle.startedOn) S.cycle.startedOn=todayISO();
  setOrigin();
  placeOnMap();
  S.ui.tab="today";
  save(); render(); window.scrollTo(0,0);
  toast("Цикл начат. Сегодня — день 1");
}

function placeOnMap(){
  S.map.sectors=S.map.sectors||{};
  BAGUA.forEach(b=>{ if(!S.map.sectors[b.id]) S.map.sectors[b.id]={text:"",emblem:"",photos:[]}; });
  const w=wishText();
  if(w){
    const sec=guessSector(w);
    const c=S.map.sectors[sec];
    if(!c.text) c.text=w;
  }
  (S.goals||[]).forEach(g=>{
    const sph=SPH.find(s=>s.id===g.sphere);
    const id=sph?sph.bagua:"career";
    const c=S.map.sectors[id];
    if(g.title && c && !c.text) c.text=g.title;
  });
}
function guessSector(t){
  t=(t||"").toLowerCase();
  const map=[["wealth","деньг,богат,доход,финанс"],["fame","известн,признан,слав,видимость"],["love","любов,отношен,партнер,пара"],["family","семья,род,родител,дом"],["me","здоров,тело,сон,я сам,я сама"],["children","дет,творч,радость,проект"],["knowledge","знан,уче,книг,навык"],["career","работ,карьер,дел,проект,профес"],["helpers","помощ,друг,путеш,дорог"]];
  for(const [id,ks] of map){ if(ks.split(",").some(k=>t.includes(k))) return id; }
  return "me";
}


/* ---------- onboarding views ---------- */
function vApply(){
  const w=S.wish.text||"";
  return `<div class="card hero">
    <p class="kicker">Карта истинных желаний</p>
    <h1>Заявка</h1>
    <p class="lead">Напиши желание своими словами. Это станет нитью всего блокнота.</p>
    <label class="field">Имя
      <input id="nm" maxlength="40" value="${esc(S.user.name)}" placeholder="как к тебе обращаться">
    </label>
    <div class="muted" style="font-size:12px;margin:4px 0 6px">Обращение</div>
    <div class="seg" style="margin:0 0 14px">
      <button type="button" data-act="gender" data-v="f" class="${S.user.gender!=="m"?"on":""}">Ж</button>
      <button type="button" data-act="gender" data-v="m" class="${S.user.gender==="m"?"on":""}">М</button>
    </div>
    <label class="field">Мое желание
      <textarea id="wish" rows="3" placeholder="Я хочу…">${esc(w)}</textarea>
    </label>
    <div class="seg" style="margin:12px 0">
      <button type="button" data-act="approach" data-v="to" class="${S.wish.approach!=="from"?"on":""}">Хочу прийти к…</button>
      <button type="button" data-act="approach" data-v="from" class="${S.wish.approach==="from"?"on":""}">Хочу уйти от…</button>
    </div>
    <div class="launch-wrap">
      <button type="button" class="launch" id="launch" data-act="launch-down" aria-label="Принять желание">
        <img src="img/launch-btn.svg" alt="">
        <span>Удерживай<br>или нажми</span>
      </button>
    </div>
    <p class="center muted">Заявка запускает тетрадь. Дальше все можно уточнить.</p>
  </div>`;
}
function vAccepted(){
  return `<div class="card hero center">
    <p class="kicker">Заявка принята</p>
    <h1 class="wishline" style="font-size:22px">${esc(wishText())}</h1>
    <p class="lead">Твое желание принято и реализуется в максимально возможные сроки наилучшим образом для тебя.</p>
    <button type="button" class="btn" data-act="after-accept">Дальше: уточним заявку</button>
  </div>`;
}

function vNeeds(){
  const w=S.needs.wheel||{};
  const rows=SPH.map(s=>{
    const v=w[s.id]||{};
    return `<div class="card" style="padding:14px 16px">
      <h3>${esc(s.name)}</h3>
      <p class="muted">${esc(s.freq)}</p>
      <div class="slider"><input type="range" min="1" max="10" value="${v.freq||5}" data-act="need" data-id="${s.id}" data-f="freq"><div class="ends"><span>редко</span><b data-need="${s.id}-freq">${v.freq||5}</b><span>часто</span></div></div>
      <label class="field">Что чувствуется
        <input data-act="need-text" data-id="${s.id}" data-f="feel" value="${esc(v.feel||"")}" placeholder="одним словом или короткой фразой">
      </label>
      <label class="field">Что есть по факту
        <input data-act="need-text" data-id="${s.id}" data-f="fact" value="${esc(v.fact||"")}" placeholder="конкретное, без оценки">
      </label>
    </div>`;
  }).join("");
  return `<div class="card">
    <p class="kicker">Шаг 2</p>
    <h1>Как часто это есть в жизни</h1>
    <p>Сначала чувство, потом факт. Это не оценка «хорошо / плохо», а снимок сейчас.</p>
    <label class="field">Общий фон последних недель
      <input id="bg" value="${esc(S.needs.bg||"")}" placeholder="например: много работы и мало сна">
    </label>
    <div class="slider">
      <div class="muted">Ощущение своей ценности сейчас</div>
      <input type="range" min="1" max="10" value="${S.needs.worth||5}" data-act="worth">
      <div class="ends"><span>1</span><b id="worthv">${S.needs.worth||5}</b><span>10</span></div>
    </div>
  </div>${rows}
  ${needHint()}
  <button type="button" class="btn" data-act="save-needs">Дальше: другие желания</button>
  <button type="button" class="btn ghost" data-act="skip-onb" data-to="wishes">Пока пропустить</button>`;
}
function needHint(){
  const w=wishText().toLowerCase();
  const low=SPH.filter(s=>{ const v=(S.needs.wheel[s.id]||{}).freq; return v && v<=4; });
  if(!low.length) return "";
  const hit=low.find(s=> w.includes(s.name.toLowerCase().slice(0,5)) || guessSector(w)===s.bagua);
  if(!hit) return `<div class="note">В нескольких сферах оценка невысокая. Это может быть потребность, а не само желание. Можно просто иметь в виду.</div>`;
  return `<div class="note">Похоже, желание «${esc(wishText())}» близко к сфере «${esc(hit.name)}», где сейчас не хватает опоры. Стоит отдельно посмотреть, чего именно не хватает, и чего хочется сверх этого.</div>`;
}

function vWishes(){
  const list=(S.wishes||[]).map((w,i)=>`<li class="item"><div><b>${esc(w.text)}</b></div><button type="button" class="iconbtn" data-act="del-wish" data-i="${i}" aria-label="Убрать">×</button></li>`).join("");
  return `<div class="card">
    <p class="kicker">Шаг 3</p>
    <h1>Другие желания</h1>
    <p>Главное уже есть. Сюда можно дописать еще несколько — они тоже попадут на карту близости.</p>
    <label class="field">Еще одно желание
      <input id="morew" placeholder="коротко, своими словами">
    </label>
    <button type="button" class="btn secondary" data-act="add-wish">Добавить</button>
    <ul class="list" style="margin-top:12px">${list||"<li class='muted'>Пока только одно главное.</li>"}</ul>
  </div>
  <button type="button" class="btn" data-act="to-rings">Дальше: близость</button>`;
}

function allWishItems(){
  const arr=[{id:"main", text:wishText()||"Мое желание", main:true}].concat((S.wishes||[]).map((w,i)=>({id:w.id||("w"+i), text:w.text})));
  return arr.filter(x=>x.text);
}
function vRings(){
  const items=allWishItems();
  const order=S.rings.order&&S.rings.order.length? S.rings.order.slice() : items.map(x=>x.id);
  S.rings.order=order;
  const by=id=>items.find(x=>x.id===id);
  const inner=order[0], mid=order.slice(1,3), out=order.slice(3);
  const pill=id=>{ const it=by(id); if(!it) return ""; return `<span class="chip">${esc(it.text)}</span>`; };
  return `<div class="card">
    <p class="kicker">Шаг 4</p>
    <h1>Кольца близости</h1>
    <p>В центре — ты. Во внутреннем кольце помещается одно желание, в среднем — два, остальные остаются во внешнем. Это про близость к тебе сейчас, не про важность навсегда.</p>
    <div class="rings">
      <div class="ring outer"><div class="lbl">Внешнее</div><div>${out.map(pill).join("")||"<span class='muted'>пока пусто</span>"}</div></div>
      <div class="ring mid"><div class="lbl">Среднее · два</div><div>${mid.map(pill).join("")||"<span class='muted'>два места</span>"}</div></div>
      <div class="ring inner"><div class="lbl">Внутреннее · одно</div><div>${inner?pill(inner):""}</div></div>
      <div class="me">Я</div>
    </div>
    <p class="muted">Перетащи мысль ближе, нажимая «ближе» или «дальше».</p>
    <ul class="list">${order.map((id,i)=>{ const it=by(id); if(!it) return ""; return `<li class="item"><div><b>${esc(it.text)}</b><div class="muted">${i===0?"внутреннее":i<3?"среднее":"внешнее"}</div></div><span class="row"><button type="button" class="iconbtn" data-act="ring-up" data-i="${i}" ${i===0?"disabled":""}>↑</button><button type="button" class="iconbtn" data-act="ring-down" data-i="${i}" ${i===order.length-1?"disabled":""}>↓</button></span></li>`; }).join("")}</ul>
  </div>
  <button type="button" class="btn" data-act="to-pair">Дальше: одно рядом</button>`;
}
function vPair(){
  const items=allWishItems();
  if(items.length<2){
    return `<div class="card"><p class="kicker">Шаг 5</p><h1>Одно рядом</h1><p>Пока желаний меньше двух, этот шаг можно пропустить. Когда появятся еще, к нему можно вернуться.</p></div>
    <button type="button" class="btn" data-act="skip-onb" data-to="motive">Дальше: что в образе</button>`;
  }
  if(!S.rings.pair){
    const a=items[0], b=items[1];
    S.rings.pair={a:a.id,b:b.id,t0:Date.now()};
  }
  const itemsBy=id=>items.find(x=>x.id===id);
  const a=itemsBy(S.rings.pair.a), b=itemsBy(S.rings.pair.b);
  return `<div class="card">
    <p class="kicker">Шаг 5</p>
    <h1>Если оставить рядом только одно…</h1>
    <p>Не нужно объяснять выбор. Просто отметь, какое сейчас ближе.</p>
    <div class="grid2">
      <button type="button" class="pick" data-act="pair-pick" data-id="${a.id}">${esc(a.text)}</button>
      <button type="button" class="pick" data-act="pair-pick" data-id="${b.id}">${esc(b.text)}</button>
    </div>
    <p class="muted">Порядок, пауза и перестановки сохраняются тихо, только для тебя.</p>
  </div>`;
}

function svgScene(id){
  const pal={"p1":["#E8D9B8","#C4A35A","#6C4A2D"],"p2":["#F0E6D4","#B4552D","#3A2A22"],"p3":["#E4E0D4","#7FA968","#3F5A3A"],"p4":["#2A2420","#C4A35A","#F3EFE6"],"p5":["#D7E3EA","#6C86A0","#3A4A55"],"p6":["#EFE6D6","#8A5A3A","#3A2A22"]}[id]||["#EFE8DA","#C4A35A","#3A2A22"];
  const [bg,accent,ink]=pal;
  return `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="320" height="180" fill="${bg}"/>
    ${id==="p1"?`<path d="M40 160 L40 60 L140 60 L140 160" fill="none" stroke="${ink}" stroke-width="3"/><circle cx="200" cy="90" r="22" fill="none" stroke="${accent}" stroke-width="3"/><path d="M200 112 L200 150 M180 160 L200 150 L220 160" fill="none" stroke="${ink}" stroke-width="3"/>`:""}
    ${id==="p2"?`<rect x="50" y="100" width="220" height="14" fill="${ink}" opacity=".5"/><circle cx="110" cy="80" r="16" fill="none" stroke="${ink}" stroke-width="3"/><circle cx="210" cy="80" r="16" fill="none" stroke="${accent}" stroke-width="3"/><rect x="148" y="88" width="24" height="10" rx="3" fill="${accent}"/>`:""}
    ${id==="p3"?`<path d="M0 150 L80 90 L140 120 L220 40 L320 130 L320 180 L0 180 Z" fill="${accent}" opacity=".55"/><path d="M40 160 L120 110 L180 90" fill="none" stroke="${ink}" stroke-width="3"/><rect x="112" y="96" width="16" height="20" fill="${ink}"/>`:""}
    ${id==="p4"?`<rect x="0" y="0" width="320" height="180" fill="${bg}"/><rect x="130" y="40" width="60" height="80" fill="${accent}" opacity=".35"/><circle cx="160" cy="50" r="10" fill="${accent}"/><line x1="20" y1="140" x2="300" y2="140" stroke="${accent}" stroke-width="2"/>`:""}
    ${id==="p5"?`<path d="M0 110 C80 90 140 130 200 110 C260 90 300 120 320 110 L320 180 L0 180 Z" fill="${accent}" opacity=".5"/><path d="M70 120 L110 120 L100 108 L80 108 Z" fill="${ink}"/><rect x="230" y="70" width="36" height="28" fill="${ink}" opacity=".6"/>`:""}
    ${id==="p6"?`<rect x="40" y="90" width="240" height="50" fill="${ink}" opacity=".25"/><rect x="70" y="70" width="70" height="20" fill="${accent}"/><rect x="180" y="80" width="40" height="10" fill="${ink}"/><circle cx="90" cy="130" r="8" fill="${ink}"/>`:""}
  </svg>`;
}
function vMotive(){
  const picks=S.motive.picks||{};
  const cards=MOTIVE_PICS.map(p=>`<div class="card scene">
    ${svgScene(p.id)}
    <h3>${esc(p.title)}</h3>
    <p class="muted">${esc(p.hint)}</p>
    <div class="list">${MOTIVE_OPTS.map(o=>`<button type="button" class="pick ${picks[p.id]===o.k?"on":""}" data-act="motive" data-p="${p.id}" data-k="${o.k}">${esc(o.t)}</button>`).join("")}</div>
  </div>`).join("");
  return `<div class="card">
    <p class="kicker">Шаг 6</p>
    <h1>Что откликается в образе</h1>
    <p>Картинки нарочно неясные. Выбери, что ближе, не подгоняя ответ под желание.</p>
  </div>${cards}
  <label class="field card">Короткий комментарий, если хочется
    <input id="motn" value="${esc(S.motive.note||"")}">
  </label>
  <button type="button" class="btn" data-act="save-motive">Дальше: образ желания</button>`;
}
function vClean(){
  const c=S.clean||{};
  return `<div class="card">
    <p class="kicker">Шаг 7</p>
    <h1>Образ желания</h1>
    <p>Отвечай своими словами, коротко. Не нужно «правильно».</p>
    <label class="field">И какое это…?
      <input id="cq1" value="${esc(c.q1||"")}" placeholder="форма, цвет, характер…">
    </label>
    <label class="field">И где это?
      <input id="cq2" value="${esc(c.q2||"")}" placeholder="место, расстояние, сторона…">
    </label>
    <label class="field">И что происходит прямо перед этим?
      <input id="cq3" value="${esc(c.q3||"")}" placeholder="что уже есть за мгновение до">
    </label>
  </div>
  <button type="button" class="btn" data-act="save-clean">Дальше: что держит</button>
  <button type="button" class="btn ghost" data-act="skip-onb" data-to="gains">Пока пропустить</button>`;
}
function vGains(){
  const items=S.gains.items||[];
  return `<div class="card">
    <p class="kicker">Шаг 8</p>
    <h1>Что еще держит это желание</h1>
    <p>Иногда желание поддерживает не только прямой смысл. Можно отметить тихо, а можно пропустить.</p>
    <label class="field">Если есть, одной фразой
      <input id="gain" placeholder="например: так я могу не начинать новое">
    </label>
    <button type="button" class="btn secondary" data-act="add-gain">Добавить заметку</button>
    <ul class="list">${items.map((t,i)=>`<li class="item"><div>${esc(t)}</div><button type="button" class="iconbtn" data-act="del-gain" data-i="${i}">×</button></li>`).join("")}</ul>
  </div>
  <button type="button" class="btn" data-act="save-gains">Дальше: моя карта</button>
  <button type="button" class="btn ghost" data-act="skip-gains">Пропустить этот шаг</button>`;
}
function vResult(){
  const o=originLabel(); S.wish.origin=o;
  const sig=o.sig.map(s=>`<li class="signal"><i></i><span>${esc(s.t)}</span></li>`).join("");
  return `<div class="card hero">
    <p class="kicker">Снимок сейчас</p>
    <h1>Мои потребности сейчас</h1>
    <p>Короткий обзор по тому, что уже отмечено.</p>
    ${SPH.map(s=>{ const v=S.needs.wheel[s.id]||{}; return `<div class="item"><div><b>${esc(s.name)}</b><div class="muted">${v.feel||v.fact||"без заметки"} · ${v.freq||"—"}/10</div></div></div>`; }).join("")}
  </div>
  <div class="card">
    <h2>Мое истинное желание</h2>
    <p class="wishline">${esc(wishText())}</p>
    <p>Метка: <b>${esc(o.kind)}</b> · ${esc(o.label)} (${o.ok} из ${o.need} сигналов)</p>
    <ul class="signals">${sig}</ul>
    <p class="muted">Метка не приговор. Ее можно пересмотреть позже, когда накопится больше дней.</p>
    <label class="field">Если хочется уточнить формулировку
      <input id="refw" value="${esc(S.wish.refined||"")}" placeholder="оставить как есть или переписать">
    </label>
    <button type="button" class="btn secondary" data-act="relaunch">Повторить заявку с новой формулировкой</button>
  </div>
  <button type="button" class="btn" data-act="to-values">Дальше: ценности</button>`;
}
function vValues(){
  const ranked=S.values.ranked||[];
  const left=VALS.filter(v=>!ranked.includes(v));
  return `<div class="card">
    <p class="kicker">Шаг 9</p>
    <h1>Ценности</h1>
    <p>Отметь те, что живые сейчас. Затем поставь первые пять по порядку.</p>
    <div class="chips">${left.map(v=>`<button type="button" class="chip" data-act="add-val" data-v="${esc(v)}">${esc(v)}</button>`).join("")}</div>
    <h3 style="margin-top:16px">Порядок</h3>
    <ul class="list">${ranked.map((v,i)=>`<li class="item"><div><b>${i+1}.</b> ${esc(v)}</div><span class="row"><button type="button" class="iconbtn" data-act="val-up" data-i="${i}">↑</button><button type="button" class="iconbtn" data-act="val-down" data-i="${i}">↓</button><button type="button" class="iconbtn" data-act="val-del" data-i="${i}">×</button></span></li>`).join("")||"<li class='muted'>Пока пусто</li>"}</ul>
  </div>
  <button type="button" class="btn" data-act="save-vals">Дальше: три цели</button>`;
}
function vGoals(){
  while(S.goals.length<3) S.goals.push({id:uid(), title:"", sphere:"", value:"", step:"", when:""});
  const top=(S.values.ranked||[]).slice(0,5);
  const cards=S.goals.slice(0,3).map((g,i)=>`<div class="card">
    <h3>Цель ${i+1}</h3>
    <label class="field">Что хочу
      <input data-act="goal" data-i="${i}" data-f="title" value="${esc(g.title||"")}">
    </label>
    <label class="field">Сфера
      <select data-act="goal" data-i="${i}" data-f="sphere">${SPH.map(s=>`<option value="${s.id}" ${g.sphere===s.id?"selected":""}>${esc(s.name)}</option>`).join("")}</select>
    </label>
    <label class="field">Какой ценности это служит
      <select data-act="goal" data-i="${i}" data-f="value"><option value="">не выбирать</option>${top.map(v=>`<option ${g.value===v?"selected":""}>${esc(v)}</option>`).join("")}${g.value&&!top.includes(g.value)?`<option selected>${esc(g.value)}</option>`:""}</select>
    </label>
    <label class="field">Маленький первый шаг, около пяти минут
      <input data-act="goal" data-i="${i}" data-f="step" value="${esc(g.step||"")}" placeholder="конкретное действие, которое можно сделать сегодня">
    </label>
  </div>`).join("");
  return `<div class="card">
    <p class="kicker">Шаг 10</p>
    <h1>Три цели</h1>
    <p>Цель — это шаг в сфере. Желание живет отдельно, импульсами и практиками. Здесь — понятные шаги.</p>
    ${top.length?`<p class="muted">Верхние ценности: ${top.map(esc).join(", ")}</p>`:"<p class='muted'>Если ценности еще не выбраны, цели все равно можно записать.</p>"}
  </div>${cards}
  <button type="button" class="btn" data-act="save-goals">Дальше: карта желаний</button>`;
}
function vOnbMap(){
  return `<div class="card">
    <p class="kicker">Последний шаг перед циклом</p>
    <h1>Карта желаний</h1>
    <p>Классическое поле из девяти секторов. Главное желание и цели уже можно разместить. Фото и гербы удобнее добавить уже в тетради, во вкладке «Карта».</p>
    ${mapGrid(false)}
  </div>
  <button type="button" class="btn" data-act="start-cycle">Начать 28 дней</button>`;
}


/* ---------- map ---------- */
function mapGrid(editable){
  placeOnMap();
  const cells=BAGUA.map((b,i)=>{
    const c=S.map.sectors[b.id]||{text:"",emblem:"",photos:[]};
    const ph=(c.photos||[]).slice(0,3);
    const thumbs=ph.map((id,j)=>`<img data-act="photo-open" data-id="${esc(id)}" data-sec="${b.id}" alt="">`).join("") + (editable && ph.length<3?`<button type="button" class="addph" data-act="photo-add" data-sec="${b.id}">+</button>`:"");
    return `<div class="bagua-cell" data-act="sec-open" role="button" tabindex="0" data-sec="${b.id}" data-editable="${editable?1:0}">
      <div class="bt">${esc(b.title)}</div>
      <div class="be">${esc(c.emblem||EMBLEMS[i])}</div>
      <div class="bx">${esc(c.text||"")}</div>
      <div class="thumbs">${thumbs}</div>
    </div>`;
  }).join("");
  return `<div class="bagua">${cells}</div>`;
}

/* ---------- today ---------- */
function dayAverages(k){
  const d=drec(k);
  const out={};
  MET.forEach(m=>{
    const hs=Object.values(d.hours||{}).map(h=>h[m.key]).filter(v=>v>0);
    if(hs.length) out[m.key]=avg(hs);
    else if(d.metrics[m.key]) out[m.key]=d.metrics[m.key];
    else out[m.key]=0;
  });
  return out;
}

function vToday(){
  const k=todayISO();
  const d=drec(k);
  const n=todayNum();
  const sea=seasonOf(n);
  const av=dayAverages(k);
  const hours=Array.from({length:24},(_,h)=>vHourRow(k,h,d)).join("");
  const tabs=`<div class="daytabs">
    <button type="button" data-act="daytab" data-v="day" class="${!d.tabs.ch && !d.tabs.grat && !d.tabs.tune?"on":""}">Часы</button>
    <button type="button" data-act="daytab" data-v="ch" class="${d.tabs.ch?"on":""}">Выбираю сделать</button>
    <button type="button" data-act="daytab" data-v="grat" class="${d.tabs.grat?"on":""}">Благодарности</button>
    <button type="button" data-act="daytab" data-v="tune" class="${d.tabs.tune?"on":""}">Настройка</button>
  </div>`;
  let body="";
  if(d.tabs.ch) body=vChoose(k);
  else if(d.tabs.grat) body=vGratDay(k);
  else if(d.tabs.tune) body=vTune(k);
  else body=`<div class="card">
      <p class="kicker">${esc(sea.name)} · ${esc(sea.sub)}</p>
      <h2>День ${n} · ${fmtLong(k)}</h2>
      <p>В любом часе можно отметить самочувствие, энергию, настроение и «сам / надо», а также коротко записать, чем занята${g("","")}.</p>
      <div class="hours">${hours}</div>
    </div>
    ${volumeCard(k,"day")}
    ${vDailyAv(k,av)}
    ${vImpulse(k)}
    ${vTodaySteps(k)}`;
  return `<div class="card hero season-${sea.key}" style="padding-bottom:16px">
    <p class="kicker">Сегодня</p>
    <h1>День ${n} из 28</h1>
    <p class="wishline">${esc(wishText()||"Мое желание")}</p>
  </div>${tabs}${body}`;
}
function vHourRow(k,h,d){
  const hr=d.hours[h]||{text:"",flag:false};
  const marks=MET.filter(m=>hr[m.key]).map(m=>`<i title="${m.name}" style="background:${m.color}"></i>`).join("");
  const deeds=(hr.deeds||[]).filter(x=>!x.bonus);
  const open=S.ui.hourOpen===h;
  return `<div class="hour ${open?"open":""}" data-h="${h}">
    <button type="button" class="hour-h" data-act="toggle-hour" data-h="${h}">
      <b>${pad(h)}:00</b>
      <span class="muted">${esc(hr.text||"")}</span>
      <span class="marks">${marks}</span>
    </button>
    ${open? hourForm(k,h,hr): ""}
    ${deeds.length? `<div class="hour-deeds">${deeds.map(x=>esc(x.text||"дело")).join(" · ")}</div>`:""}
  </div>`;
}
function hourForm(k,h,hr){
  const sl=MET.map(m=>`<div class="slider"><div class="muted">${m.name}</div>
    <input type="range" min="0" max="10" value="${hr[m.key]||0}" data-act="hour-met" data-h="${h}" data-k="${m.key}">
    <div class="ends"><span>0</span><b>${hr[m.key]||"—"}</b><span>10</span></div></div>`).join("");
  return `<div class="hour-b">
    <label class="field">Что происходит
      <input data-act="hour-text" data-h="${h}" value="${esc(hr.text||"")}" placeholder="коротко">
    </label>
    ${sl}
    <label class="check"><input type="checkbox" data-act="hour-flag" data-h="${h}" ${hr.flag?"checked":""}> отметить час как важный</label>
  </div>`;
}
function vDailyAv(k,av){
  const sl=MET.map(m=>`<div class="slider"><div class="muted">${m.name} за день ${av[m.key]? "· среднее "+r1(av[m.key]): ""}</div>
    <input type="range" min="0" max="10" value="${Math.round(av[m.key]||0)}" data-act="day-met" data-k="${m.key}">
    <div class="ends"><span>0</span><b>${av[m.key]?r1(av[m.key]):"—"}</b><span>10</span></div></div>`).join("");
  return `<div class="card"><h2>Если отмечать один раз за день</h2><p class="muted">Среднее считается по часовым отметкам, если они есть. Если нет — по этой строке.</p>${sl}</div>`;
}
function vImpulse(k){
  const d=drec(k);
  return `<div class="card">
    <h2>Импульс к желанию</h2>
    <p class="muted">Коротко: что сегодня само пришло в сторону желания.</p>
    <label class="field"><input id="imp" placeholder="одна фраза"></label>
    <button type="button" class="btn secondary" data-act="add-imp">Записать импульс</button>
    <ul class="list">${(d.impulses||[]).map(t=>`<li>${esc(t)}</li>`).join("")}</ul>
  </div>`;
}
function vTodaySteps(k){
  const d=drec(k);
  const goals=(S.goals||[]).filter(g=>g.step);
  if(!goals.length) return "";
  return `<div class="card"><h2>Шаги целей</h2>
    ${goals.map(g=>{ const done=(d.steps||[]).includes(g.id); return `<label class="check"><input type="checkbox" data-act="step-done" data-id="${g.id}" ${done?"checked":""}> ${esc(g.step||g.title)} ${g.value?`<span class="muted"> · ${esc(g.value)}</span>`:""}</label>`; }).join("")}
  </div>`;
}

function volumeCard(k, period){
  let keys, per;
  if(period==="week"){ keys=weekKeys(); per="week"; }
  else if(period==="cycle"){ keys=dayKeysInRange(1, todayNum()); per="cycle"; }
  else { keys=[k]; per="day"; }
  const st=deedStats(keys);
  const line=volumeLine(st.n, st.ms, per);
  const link=per==="day"?`<p style="margin-top:10px"><button type="button" class="quiet" data-act="worth-open">Самоценность и самооценка</button></p>`:"";
  if(!st.n && per==="day"){
    return `<div class="volume-card" id="volume">
      <p>Пока нет отмеченных дел за сегодня. Когда появятся «сделано» или «другое», здесь будет виден объем дня.</p>
      ${link}
    </div>`;
  }
  return `<div class="volume-card" id="volume">
    <p>${esc(line)}</p>
    ${link}
  </div>`;
}

const WORTH_TEXT = [
  "Самооценка — это то, как я оцениваю свои дела и качества. Она меняется от ситуации: в одном деле я могу быть собою довольна, в другом — нет. Это не приговор и не постоянная величина.",
  "Самоценность — это ощущение, что я ценна сама по себе, без заслуг. Не за список дел и не за чужую похвалу, а просто потому, что я есть.",
  "Оба этих чувства складываются из опыта. На них влияет детство и то, как относились близкие люди. Влияет и то, что я сама замечаю за собой каждый день, и то, как я с собой разговариваю.",
  "Когда день проходит быстро, легко не увидеть, сколько на самом деле было сделано. Мелкие дела сливаются и кажутся «просто жизнью», хотя на них уходят часы внимания и сил.",
  "Поэтому здесь собирается объем дня: сколько дел отмечено и сколько времени на них ушло. Не чтобы поставить себе оценку, а чтобы просто увидеть свою реальную нагрузку.",
  "Увидеть объем полезно еще и потому, что тогда легче относиться к себе справедливее. Часто человек делает гораздо больше, чем привык замечать, и этого уже достаточно, чтобы не обесценивать свой день."
];
function worthCardHtml(){
  const t = S.user.gender==="m"
    ? WORTH_TEXT.map(s=>s.replace(/ценна сама/g,"ценен сам").replace(/довольна/g,"доволен").replace(/я сама замечаю/g,"я сам замечаю"))
    : WORTH_TEXT;
  return `<aside class="sheet" role="dialog" aria-label="Самоценность и самооценка">
    <button type="button" class="iconbtn close" data-act="close">×</button>
    <div class="worth-card">
      <h2>Самоценность и самооценка</h2>
      ${t.map(p=>`<p>${esc(p)}</p>`).join("")}
    </div>
  </aside>`;
}

/* ---------- choose / do / done ---------- */
function vChoose(k){
  const d=drec(k);
  const ch=d.ch;
  const running=!!(ch.on && ch.start && !ch.stop);
  let left="";
  if(running){
    const end=ch.end|| (ch.start+2.5*3600000);
    left = "осталось "+fmtDur(Math.max(0,end-Date.now()));
  }
  const rows=(ch.rows||[]).map(r=>sessRow(k,r)).join("") || `<p class="muted">Строк пока нет. Можно добавить первую, когда начнется сессия — или сразу, если хочется зафиксировать дело вне сессии.</p>`;
  return `<div class="card">
    <h2>Выбираю → делаю → сделано</h2>
    <p>Не нужно себя заставлять. Если передумал${g("","а")}, отвлек${g("ся","лась")} или планы изменились, отметь «сделано» или «решила делать другое» и запиши следующий выбор.</p>
    ${!running? `<button type="button" class="btn" data-act="sess-start">Включить на сегодня</button>
      <p class="muted">Сессия обычно идет два-три часа. Таймер будет на экране, остановить можно раньше.</p>`:
      `<div class="note">Сессия идет · ${left} · начата в ${fmtClock(ch.start)}</div>
       <button type="button" class="btn secondary" data-act="sess-stop">Стоп</button>`}
    <div class="sess">
      ${rows}
    </div>
    <button type="button" class="btn secondary" data-act="sess-add">Добавить строку</button>
    ${volumeCard(k,"day")}
  </div>`;
}
function sessRow(k,r){
  if(r.bonus){
    const noticed=r.noticed? `<p class="muted">Заметил${g("","а")} ${fmtLong(iso(new Date(r.noticed)))}${r.note?": "+esc(r.note):""}</p>`:"";
    return `<div class="sess-row bonus-row" data-id="${r.id}">
      <div class="kicker">Бонусная строка</div>
      <label class="field">Выбираю…
        <input data-act="row-choice" data-id="${r.id}" value="${esc(r.choice||"")}" placeholder="подставь свое желание или любое другое">
      </label>
      <p class="muted">${esc(BONUS_HINT)}</p>
      ${noticed}
      ${r.noticed? "": `<label class="field">Что попалось на глаза
        <input id="bn-${r.id}" placeholder="коротко, по желанию">
      </label>
      <button type="button" class="btn" data-act="bonus-notice" data-id="${r.id}">${g("Заметил","Заметила")}</button>`}
    </div>`;
  }
  const st=r.status||"choose";
  const times=`<div class="times">выбрал${g("","а")} ${fmtClock(r.tChoose)} · делаю ${fmtClock(r.tDo)} · готово ${fmtClock(r.tDone)}${r.tDo&&r.tDone? " · "+fmtDur(r.tDone-r.tDo):""}</div>`;
  let actions="";
  if(st==="choose" || !st){
    actions=`<button type="button" class="btn" data-act="row-do" data-id="${r.id}">Делаю</button>`;
  } else if(st==="doing"){
    actions=`<div class="row">
      <button type="button" class="btn" data-act="row-done" data-id="${r.id}">Сделано</button>
      <button type="button" class="btn ghost" data-act="row-switch" data-id="${r.id}">${g("Решил","Решила")} делать другое</button>
    </div>`;
  } else if(st==="done"){
    actions=`<p class="okline">${esc(CONFIRM())}</p><p class="muted">Эта фраза помогает вниманию замечать связанные случаи.</p>`;
  } else if(st==="switched"){
    actions=`<p class="muted">${g("Решил","Решила")} делать другое · это тоже завершение, не ошибка.</p>`;
  }
  return `<div class="sess-row" data-id="${r.id}">
    <label class="field">Выбираю сделать
      <input data-act="row-choice" data-id="${r.id}" value="${esc(r.choice||"")}" placeholder="своими словами, что выбираешь сейчас">
    </label>
    ${actions}
    ${times}
  </div>`;
}


function vGratDay(k){
  const g0=S.grat; const d=drec(k);
  const list=d.gratList||[];
  const days=Object.keys(S.grat.log||{}).sort();
  const streak=gratStreak();
  const total=Object.values(S.grat.log||{}).reduce((s,a)=>s+(a||[]).length,0)+list.length;
  return `<div class="card">
    <h2>Благодарности</h2>
    <p>Можно вести свободный дневник или 30-дневный сбор. Цель мягкая: не меньше ${g0.min}, ориентир ${g0.target}.</p>
    <div class="seg">
      <button type="button" data-act="grat-mode" data-v="diary" class="${g0.mode!=="challenge"?"on":""}">Дневник</button>
      <button type="button" data-act="grat-mode" data-v="challenge" class="${g0.mode==="challenge"?"on":""}">Сбор 30 дней</button>
    </div>
    <p class="muted">Сегодня ${list.length} · всего ${total} · подряд ${streak} ${delWord(streak).replace("дел","дней").replace("дело","день").replace("дела","дня")}</p>
    <label class="field">За что сегодня
      <input id="gratt" placeholder="одно конкретное">
    </label>
    <div class="seg" style="margin:8px 0">
      <button type="button" class="chip on" data-act="grat-layer" data-v="out">во внешнем</button>
      <button type="button" class="chip" data-act="grat-layer" data-v="self">в себе</button>
      <button type="button" class="chip" data-act="grat-layer" data-v="hard">в трудности</button>
    </div>
    <button type="button" class="btn" data-act="add-grat">Добавить</button>
    <ol class="list">${list.map((x,i)=>`<li>${i+1}. ${esc(x.text)} <span class="muted">${layerName(x.layer)}</span></li>`).join("")}</ol>
  </div>`;
}
function layerName(l){ return {out:"во внешнем",self:"в себе",hard:"в трудности"}[l]||""; }
function gratStreak(){
  let n=0; let k=todayISO();
  for(let i=0;i<60;i++){
    const d=S.days[k]; const has=(d&&d.gratList&&d.gratList.length) || ((S.grat.log[k]||[]).length);
    if(has) n++; else break;
    k=addDays(k,-1);
  }
  return n;
}

function vTune(k){
  const proofs=S.proofs||[];
  const ev=S.tune.ev||[];
  return `<div class="card">
    <h2>Настройка на желание</h2>
    <p class="wishline">${esc(wishText()||"Мое желание")}</p>
    <p>Сначала собери случаи, где уже было похожее. Затем — коротко, как ты себя чувствуешь, когда желаемое уже есть.</p>
    <h3>Мои доказательства</h3>
    <ul class="list">${proofs.map(p=>`<li><b>${esc(p.text)}</b> <span class="muted">${fmtLong(p.day||iso(new Date(p.at)))}</span></li>`).join("")||"<li class='muted'>Пока пусто. Сюда попадут и заметки «заметила» из бонусной строки.</li>"}</ul>
    <label class="field">Добавить доказательство
      <input id="proof" placeholder="конкретный случай">
    </label>
    <button type="button" class="btn secondary" data-act="add-proof">Сохранить</button>
  </div>
  <div class="card">
    <h3>Как я себя чувствую, когда желаемое уже есть</h3>
    <ol>
      <li>Сядь удобно и назови желание вслух или про себя.</li>
      <li>Заметь, где в теле отклик — тепло, простор, тишина.</li>
      <li>Опиши одним предложением, что ты делаешь в этом уже случившемся дне.</li>
      <li>Какой самый простой признак, что это уже так?</li>
    </ol>
    <label class="field">Мое описание
      <textarea id="tunef" rows="3">${esc((S.tune.feel||[]).slice(-1)[0]||"")}</textarea>
    </label>
    <button type="button" class="btn" data-act="save-tune">Сохранить ощущение</button>
    <ul class="list muted">${(S.tune.feel||[]).slice().reverse().slice(0,5).map(t=>`<li>${esc(t)}</li>`).join("")}</ul>
  </div>`;
}

/* ---------- practices tab ---------- */
const PRACS = [
  {id:"choose", name:"Выбираю → делаю → сделано", short:"Рабочая сессия дня"},
  {id:"grat", name:"Благодарности", short:"Дневник или 30-дневный сбор"},
  {id:"tune", name:"Настройка на желание", short:"Доказательства и ощущение уже есть"},
  {id:"hoo", name:"Хоопонопоно", short:"Четыре фразы принятия"},
  {id:"aff", name:"Новая формулировка", short:"Заменить ограничивающее убеждение"},
  {id:"sense", name:"Осмысление, предвкушение, предположение", short:"Три коротких письма себе"},
  {id:"silence", name:"Тишина 10 минут", short:"Просто присутствовать"},
  {id:"now", name:"Настоящий момент: присутствие и принятие", short:"Совмещенная короткая практика"},
  {id:"samost", name:"Самость", short:"Поддерживающая фраза дня"},
  {id:"breath", name:"Держи палец, а не дыхание", short:"Круг вдоха и выдоха"},
  {id:"mini", name:"Мини-практики", short:"Две-пять минут в любом часе"},
  {id:"rules", name:"Мои правила", short:"Если — тогда"}
];

function vPrac(){
  if(S.ui.prac) return vPracPage(S.ui.prac);
  return `<div class="card"><h1>Практики</h1><p>Открой одну и вернись, когда захочешь. Ничего не пропадает.</p></div>
    <div class="list">${PRACS.map(p=>`<button type="button" class="item" data-act="open-prac" data-id="${p.id}"><div><b>${esc(p.name)}</b><div class="muted">${esc(p.short)}</div></div></button>`).join("")}</div>`;
}
function pracHead(id, extra){
  const p=PRACS.find(x=>x.id===id);
  return `<p><button type="button" class="quiet" data-act="prac-back">К практикам</button></p>
    <div class="card"><h1>${esc(p.name)}</h1>${extra||""}</div>`;
}
function vPracPage(id){
  if(id==="choose") return pracHead(id)+vChoose(todayISO());
  if(id==="grat") return pracHead(id)+vGratDay(todayISO());
  if(id==="tune") return pracHead(id)+vTune(todayISO());
  if(id==="hoo") return pracHead(id, `<p>Произнеси четыре фразы в своем темпе, можно шепотом.</p>`) +
    `<div class="card center" style="font-size:20px;line-height:1.8"><p>Извини.</p><p>Прости.</p><p>Спасибо.</p><p>Я люблю тебя.</p></div>
     <button type="button" class="btn" data-act="celeb" data-t="Четыре фразы сказаны">Готово</button>`;
  if(id==="aff") return vAff();
  if(id==="sense") return pracHead(id, `<p>Три коротких текста: что уже было, чего ждешь, что предполагаешь дальше.</p>`)+
    `<div class="card">
      <label class="field">Осмысление<input id="s1" placeholder="что уже произошло и какой в этом смысл"></label>
      <label class="field">Предвкушение<input id="s2" placeholder="чего ждешь с теплом"></label>
      <label class="field">Предположение<input id="s3" placeholder="что может случиться дальше"></label>
      <button type="button" class="btn" data-act="save-sense">Сохранить три записи</button>
    </div>`;
  if(id==="silence") return vSilence();
  if(id==="now") return pracHead(id, `<p>Сначала заметь, что есть сейчас. Потом прими это без исправления. Потом выбери один маленький шаг или паузу.</p>`)+
    `<div class="card">
      <label class="field">Что есть сейчас<input id="n1"></label>
      <label class="field">Что я в этом принимаю<input id="n2"></label>
      <label class="field">Какой один шаг или пауза<input id="n3"></label>
      <button type="button" class="btn" data-act="save-now">Сохранить</button>
    </div>`;
  if(id==="samost") return vSamost();
  if(id==="breath") return vBreath();
  if(id==="mini") return pracHead(id, `<p>Выбери одну и встрой в любой час дня.</p>`)+
    `<div class="list">${MINI.map(t=>`<button type="button" class="item" data-act="mini-do" data-t="${esc(t)}"><div>${esc(t)}</div></button>`).join("")}</div>`;
  if(id==="rules") return vRules();
  return pracHead(id);
}
function vAff(){
  const cur=S.aff.belief;
  const pair=cur!=null? BELIEFS[cur]: null;
  return pracHead("aff", `<p>Выбери формулировку, которая знакома, и замени ее на новую: чувство, опора и действие.</p>`)+
    `<div class="card">
      ${BELIEFS.map((b,i)=>`<button type="button" class="pick ${cur===i?"on":""}" data-act="aff-pick" data-i="${i}"><div class="muted">${esc(b[0])}</div><b>${esc(b[1])}</b></button>`).join("")}
      ${pair? `<label class="field">Своими словами<textarea id="afft" rows="3">${esc(S.aff.text||pair[1])}</textarea></label>
        <button type="button" class="btn" data-act="save-aff">Сохранить свою формулировку</button>`:""}
    </div>`;
}
function vSilence(){
  const sec=S.silence.secs||0;
  const left=Math.max(0, 600-sec);
  const mm=pad(Math.floor(left/60)), ss=pad(left%60);
  return pracHead("silence", `<p>Десять минут без задачи. Можно просто сидеть. Таймер тихий.</p>`)+
    `<div class="card center">
      <div style="font-size:48px;font-family:var(--serif)">${mm}:${ss}</div>
      <button type="button" class="btn" data-act="sil-toggle">${S.silence.on?"Пауза":"Начать"}</button>
      <button type="button" class="btn ghost" data-act="sil-reset">Сначала</button>
    </div>`;
}
function vSamost(){
  const today=S.phrases.filter(p=>p.day===todayISO());
  const suggest=suggestPhrase();
  return pracHead("samost", `<p>Фраза от первого лица, в настоящем времени, про конкретный факт сегодня. Без сравнений, без «должна» и без преувеличений.</p>`)+
    `<div class="card">
      <p class="muted">Шаблон: «Я заметила / сделала…, и это говорит о моей…»</p>
      <label class="field">Фраза дня
        <textarea id="ph" rows="3">${esc((today[0]&&today[0].text)||suggest)}</textarea>
      </label>
      <button type="button" class="btn" data-act="save-phrase">Сохранить фразу</button>
    </div>
    <div class="card"><h3>Собрание</h3>
      <ul class="list">${S.phrases.slice().reverse().map(p=>`<li>${esc(p.text)} <span class="muted">${fmtLong(p.day)}</span></li>`).join("")||"<li class='muted'>Пока пусто</li>"}</ul>
    </div>`;
}
function suggestPhrase(){
  const k=todayISO(); const d=drec(k);
  const done=(d.ch.rows||[]).filter(r=>!r.bonus && (r.status==="done"||r.status==="switched") && r.choice);
  const verb=g("заметил","заметила"), did=g("сделал","сделала");
  if(done.length){
    const t=done[done.length-1].choice;
    return "Я "+did+" «"+t+"», и это говорит о моей способности держать свой выбор.";
  }
  if((d.gratList||[]).length) return "Я "+verb+" одну благодарность сегодня, и это говорит о моем внимании к уже имеющемуся.";
  if((d.steps||[]).length) return "Я "+did+" маленький шаг к цели, и это говорит о моей последовательности.";
  return "Я "+verb+" этот день таким, какой он есть, и это говорит о моем уважении к себе.";
}
function vBreath(){
  return pracHead("breath", `<p>Вдох три секунды, выдох четыре. Держи палец на круге, не контролируй дыхание силой.</p>`)+
    `<div class="card center">
      <div class="breath" id="breath"><i></i></div>
      <p id="brlab">Нажми, чтобы начать</p>
      <button type="button" class="btn" data-act="breath-toggle">Начать круг</button>
    </div>`;
}
function vRules(){
  const list=S.rules||[];
  return pracHead("rules", `<p>Правило пишется заранее: заметный повод и одно действие. Потом можно отметить, сработало ли оно.</p>`)+
    `<div class="card">
      <h3>Заготовки</h3>
      ${RULES.map((r,i)=>`<button type="button" class="pick" data-act="rule-tpl" data-i="${i}"><div class="muted">Если ${esc(r[0])}</div><b>тогда ${esc(r[1])}</b></button>`).join("")}
    </div>
    <div class="card">
      <h3>Свое правило</h3>
      <label class="field">Если (заметный повод)<input id="rif" placeholder="конкретное событие"></label>
      <label class="field">Тогда (одно действие)<input id="rthen" placeholder="одно понятное действие"></label>
      <label class="field">К какой цели относится
        <select id="rgoal"><option value="">не связывать</option>${(S.goals||[]).map(g=>`<option value="${g.id}">${esc(g.title||g.step||"цель")}</option>`).join("")}</select>
      </label>
      <button type="button" class="btn" data-act="add-rule">Сохранить правило</button>
    </div>
    <div class="card"><h3>Мои правила</h3>
      <ul class="list">${list.map(r=>`<li class="item"><div>Если ${esc(r.if)}, тогда ${esc(r.then)}</div>
        <span class="row">
          <button type="button" class="chip ${r.ok===true?"on":""}" data-act="rule-ok" data-id="${r.id}" data-v="1">сработало</button>
          <button type="button" class="chip ${r.ok===false?"on":""}" data-act="rule-ok" data-id="${r.id}" data-v="0">нет</button>
        </span></li>`).join("")||"<li class='muted'>Пока пусто</li>"}</ul>
    </div>`;
}


/* ---------- map tab ---------- */
function vMap(){
  const sea=launched()? seasonOf(todayNum()): SEASONS[0];
  return `<div class="card hero season-${sea.key}">
    <p class="kicker">Карта</p>
    <h1>Карта желаний</h1>
    <p>Нажми сектор, чтобы открыть его крупно, добавить текст, герб или до трех фото.</p>
  </div>
  ${mapGrid(true)}
  <div class="card">
    <button type="button" class="btn" data-act="map-png">Сохранить картинкой</button>
    <p class="muted">Получится изображение, которым можно поделиться в сторис.</p>
  </div>
  <div class="card">
    <h2>Мое истинное желание</h2>
    <p class="wishline">${esc(wishText())}</p>
    ${S.wish.origin? `<p>Метка: <b>${esc(S.wish.origin.kind)}</b> · ${esc(S.wish.origin.label)}</p>`:""}
    <p><button type="button" class="quiet" data-act="origin-open">Посмотреть сигналы</button></p>
  </div>`;
}
function sectorSheet(id){
  const b=BAGUA.find(x=>x.id===id); if(!b) return "";
  const c=S.map.sectors[id]||{text:"",emblem:"",photos:[]};
  const ph=(c.photos||[]);
  return `<aside class="sheet" role="dialog">
    <button type="button" class="iconbtn close" data-act="close">×</button>
    <h2>${esc(b.title)}</h2>
    <label class="field">Текст сектора
      <textarea id="sect" rows="3">${esc(c.text||"")}</textarea>
    </label>
    <div class="muted">Герб</div>
    <div class="chips">${EMBLEMS.map(e=>`<button type="button" class="chip ${c.emblem===e?"on":""}" data-act="emblem" data-sec="${id}" data-e="${e}">${e}</button>`).join("")}</div>
    <div class="muted" style="margin-top:12px">Фото · до трех</div>
    <div class="thumbs big" id="sect-ph">${ph.map(pid=>`<span class="ph"><img data-act="photo-open" data-id="${pid}" alt=""><button type="button" class="iconbtn" data-act="photo-del" data-sec="${id}" data-id="${pid}">×</button></span>`).join("")}
      ${ph.length<3?`<button type="button" class="addph" data-act="photo-add" data-sec="${id}">+</button>`:""}
    </div>
    <button type="button" class="btn" data-act="sec-save" data-sec="${id}">Сохранить сектор</button>
  </aside>`;
}

/* ---------- reports ---------- */
function vRep(){
  if(S.ui.rep==="final" || (launched() && todayNum()>=28 && S.ui.rep!=="main")){
    /* stay on chosen; final available as button */
  }
  const period=S.ui.period||"day";
  const n=todayNum();
  return `<div class="card">
    <h1>Итоги</h1>
    <div class="seg wrap">
      ${[["day","День"],["week","Неделя"],["w2","2 недели"],["w3","3 недели"],["cycle","4 недели"],["all","Все"]].map(([k,t])=>`<button type="button" data-act="period" data-v="${k}" class="${period===k?"on":""}">${t}</button>`).join("")}
    </div>
  </div>
  ${volumeCard(todayISO(), period==="day"?"day": (period==="week"?"week":"cycle"))}
  ${vCharts(period)}
  ${vInsights(period)}
  ${vWeekReview()}
  ${vProofsBlock()}
  ${n>=28 || S.final? `<div class="card"><button type="button" class="btn" data-act="open-final">Итог 28 дней</button></div>`:""}
  <div class="card">
    <h2>Инструменты</h2>
    <button type="button" class="pick" data-act="open-matrix">Матрица решений</button>
    <button type="button" class="pick" data-act="open-assoc">16 ассоциаций</button>
  </div>
  ${vSettings()}`;
}
function rangeKeys(period){
  const n=Math.max(1, todayNum());
  if(!S.cycle.startedOn) return [todayISO()];
  if(period==="day") return [todayISO()];
  if(period==="week") return weekKeys(n);
  if(period==="w2") return dayKeysInRange(1, Math.min(14,n));
  if(period==="w3") return dayKeysInRange(1, Math.min(21,n));
  if(period==="cycle") return dayKeysInRange(1, Math.min(28,n));
  return Object.keys(S.days).sort();
}
function vCharts(period){
  const keys=rangeKeys(period);
  const series=MET.map(m=>{
    const pts=keys.map(k=>dayAverages(k)[m.key]||0);
    return {m, pts, mid:avg(pts.filter(Boolean))};
  });
  const w=300,h=80;
  const polylines=series.map(s=>{
    if(keys.length<1) return "";
    const pts=s.pts.map((v,i)=>{
      const x=keys.length===1? w/2 : i*(w/(keys.length-1));
      const y=h- (clamp(v,0,10)/10)*h;
      return x+","+y;
    }).join(" ");
    return `<polyline fill="none" stroke="${s.m.color}" stroke-width="2" points="${pts}"/>`;
  }).join("");
  return `<div class="card">
    <h2>Самочувствие, энергия, настроение, «сам / надо»</h2>
    <svg viewBox="0 0 ${w} ${h}" class="chart" aria-hidden="true">${polylines}</svg>
    <div class="chips">${series.map(s=>`<span class="chip">${esc(s.m.name)} ${s.mid?r1(s.mid):"—"}</span>`).join("")}</div>
  </div>
  ${vHourDist(keys)}`;
}
function vHourDist(keys){
  const hours=Array.from({length:24},()=>({n:0, energy:0, eN:0, mood:0, mN:0}));
  keys.forEach(k=>{
    const d=S.days[k]; if(!d) return;
    Object.entries(d.hours||{}).forEach(([h,hr])=>{
      const i=+h; if(i<0||i>23) return;
      const deeds=(hr.deeds||[]).filter(x=>!x.bonus);
      hours[i].n += deeds.length || (hr.text?1:0);
      if(hr.energy){ hours[i].energy+=hr.energy; hours[i].eN++; }
      if(hr.mood){ hours[i].mood+=hr.mood; hours[i].mN++; }
    });
    (d.ch&&d.ch.rows||[]).forEach(r=>{
      if(r.bonus||!(r.status==="done"||r.status==="switched")) return;
      const a=r.tDo||r.tChoose; if(!a) return;
      const hh=new Date(a).getHours();
      hours[hh].n += 0;
    });
  });
  const max=Math.max(1,...hours.map(h=>h.n));
  const bars=hours.map((h,i)=>`<i title="${pad(i)}:00 · дел: ${h.n}" style="height:${Math.round(h.n/max*64)}px"></i>`).join("");
  return `<div class="card">
    <h2>Куда уходит время</h2>
    <p class="muted">Часы, в которых были дела или записи. Рядом — энергия и настроение, если их отмечали.</p>
    <div class="bars">${bars}</div>
    <div class="bars-lbl"><span>0</span><span>12</span><span>23</span></div>
  </div>`;
}
function vInsights(period){
  const keys=rangeKeys(period);
  if(keys.length<3) return `<div class="card"><p class="muted">После нескольких дней здесь появятся простые наблюдения: в какие дни энергия выше и с чем это рядом.</p></div>`;
  const lines=[];
  const withWalk=keys.filter(k=>{ const d=S.days[k]; if(!d) return false; return Object.values(d.hours||{}).some(h=>/прогул|ходил|шла пеш|гуля/i.test(h.text||"")); });
  const noWalk=keys.filter(k=>!withWalk.includes(k));
  const e=ks=>avg(ks.map(k=>dayAverages(k).energy).filter(Boolean));
  if(withWalk.length>=2 && noWalk.length>=2){
    const a=e(withWalk), b=e(noWalk);
    if(a && b && a>b+0.6) lines.push("Энергия выше в дни с прогулкой ("+r1(a)+" против "+r1(b)+").");
  }
  const selfHigh=keys.filter(k=>dayAverages(k).matrix>=7);
  if(selfHigh.length>=2){
    const a=e(selfHigh), b=e(keys.filter(k=>!selfHigh.includes(k)));
    if(a&&b&&a>b+0.5) lines.push("В дни, где больше «сам», энергия тоже выше.");
  }
  const st=deedStats(keys);
  if(st.n) lines.push("За выбранный период отмечено "+st.n+" "+delWord(st.n)+", всего "+fmtDur(st.ms)+".");
  if(!lines.length) lines.push("Пока закономерности слабые. Можно просто смотреть графики как есть.");
  return `<div class="card"><h2>Что заметно</h2>${lines.map(t=>`<p>${esc(t)}</p>`).join("")}</div>`;
}
function vWeekReview(){
  const n=todayNum();
  const week=clamp(Math.ceil(n/7),1,4);
  const due=[7,14,21,28].includes(n) || n>7;
  if(!due && n<7) return `<div class="card"><p class="muted">Короткий обзор недели откроется на 7, 14, 21 и 28 день.</p></div>`;
  const keys=weekKeys(Math.min(week*7,n));
  const st=deedStats(keys);
  const stepsAll=(S.goals||[]).filter(g=>g.step).length*keys.length;
  let stepsDone=0; keys.forEach(k=>{ stepsDone+=(S.days[k]&&S.days[k].steps||[]).length; });
  const pct=stepsAll? Math.round(100*stepsDone/Math.max(1,(S.goals||[]).filter(g=>g.step).length*Math.min(7,keys.length))) : (st.n? Math.min(100, st.n*8): 0);
  return `<div class="card">
    <h2>Обзор недели ${week}</h2>
    <p>Сделано ${st.n} ${delWord(st.n)} · ${fmtDur(st.ms)}. Шаги целей: ${stepsDone}. Оценка недели: ${pct}%.</p>
    <label class="field">Короткое резюме
      <textarea id="wrev" rows="2">${esc((S.weekReviews[week]||""))}</textarea>
    </label>
    <button type="button" class="btn secondary" data-act="save-week" data-w="${week}">Сохранить обзор</button>
  </div>`;
}
function vProofsBlock(){
  return `<div class="card">
    <h2>Мои доказательства</h2>
    <ul class="list">${(S.proofs||[]).slice().reverse().map(p=>`<li>${esc(p.text)} <span class="muted">${fmtLong(p.day||iso(new Date(p.at)))}</span></li>`).join("")||"<li class='muted'>Пока пусто</li>"}</ul>
  </div>`;
}
function vFinal(){
  const start=S.needs.startWheel||S.needs.wheel||{};
  const now=S.needs.wheel||{};
  const w1=dayKeysInRange(1,7), w4=dayKeysInRange(22, Math.min(28,todayNum()));
  const avW=keys=>{ const o={}; MET.forEach(m=>o[m.key]=avg(keys.map(k=>dayAverages(k)[m.key]).filter(Boolean))); return o; };
  const a1=avW(w1), a4=avW(w4);
  const st=deedStats(dayKeysInRange(1, Math.min(28,todayNum())));
  const o=S.wish.origin||originLabel();
  return `<div class="card hero">
    <p class="kicker">День 28</p>
    <h1>Итог цикла</h1>
    <p class="wishline">${esc(wishText())}</p>
  </div>
  <div class="card">
    <h2>Желание</h2>
    <div class="seg">
      ${[["done","сбылось"],["near","приблизилось"],["let","отпущено"]].map(([k,t])=>`<button type="button" data-act="wish-status" data-v="${k}" class="${(S.wish.status||"active")===k?"on":""}">${t}</button>`).join("")}
    </div>
    <p>Метка сейчас: <b>${esc(o.kind)}</b> · ${esc(o.label)}</p>
  </div>
  <div class="card">
    <h2>Сферы: начало и сейчас</h2>
    ${SPH.map(s=>{ const a=(start[s.id]||{}).freq, b=(now[s.id]||{}).freq; return `<p>${esc(s.name)}: ${a||"—"} → ${b||"—"}</p>`; }).join("")}
  </div>
  <div class="card">
    <h2>Неделя 1 и неделя 4</h2>
    ${MET.map(m=>`<p>${esc(m.name)}: ${a1[m.key]?r1(a1[m.key]):"—"} → ${a4[m.key]?r1(a4[m.key]):"—"}</p>`).join("")}
  </div>
  <div class="card">
    <h2>Объем цикла</h2>
    <p>${esc(volumeLine(st.n, st.ms, "cycle"))}</p>
    <p>Поддерживающих фраз: ${(S.phrases||[]).length}. Доказательств: ${(S.proofs||[]).length}. Благодарностей за дни: ${gratTotal()}.</p>
  </div>
  <div class="card">
    <button type="button" class="btn" data-act="final-png">Сохранить итог картинкой</button>
    <button type="button" class="btn secondary" data-act="new-cycle">Начать новый цикл</button>
    <p style="margin-top:12px"><a class="quiet" href="${DONATE_URL}" data-act="donate">Поблагодарить автора</a></p>
  </div>`;
}
function gratTotal(){ let n=0; Object.values(S.days).forEach(d=>{ n+=(d.gratList||[]).length; }); return n; }

function vSettings(){
  return `<div class="card" id="settings">
    <h2>Настройки</h2>
    <label class="field">Имя<input id="set-nm" value="${esc(S.user.name||"")}"></label>
    <div class="seg">
      <button type="button" data-act="gender" data-v="f" class="${S.user.gender!=="m"?"on":""}">Ж</button>
      <button type="button" data-act="gender" data-v="m" class="${S.user.gender==="m"?"on":""}">М</button>
    </div>
    <label class="check"><input type="checkbox" data-act="sounds" ${S.user.sounds?"checked":""}> звуки кнопок</label>
    <p class="muted">18+</p>
    <button type="button" class="btn secondary" data-act="export">Сохранить копию</button>
    <button type="button" class="btn ghost" data-act="import">Загрузить</button>
    <input type="file" id="impfile" accept="application/json" hidden>
    <button type="button" class="btn ghost" data-act="reset-ask">Сбросить все данные</button>
    <p style="margin-top:12px"><a class="quiet" href="${DONATE_URL}" data-act="donate">Поблагодарить автора</a></p>
  </div>`;
}

function helpSheet(){
  const w=wishText();
  const n=launched()? todayNum(): 0;
  const st=launched()? deedStats([todayISO()]): {n:0,ms:0};
  return `<aside class="sheet" role="dialog">
    <button type="button" class="iconbtn close" data-act="close">×</button>
    <h2>Помощник</h2>
    <p>Я помню твой путь в этой тетради. Все ответы остаются только на этом устройстве.</p>
    ${w?`<p>Твое желание: «${esc(w)}».</p>`:"<p>Заявка еще не сделана.</p>"}
    ${n?`<p>Сейчас день ${n} из 28, ${esc(seasonOf(n).name).toLowerCase()}.</p>`:""}
    ${st.n?`<p>Сегодня уже видно ${st.n} ${delWord(st.n)}.</p>`:""}
    <p class="muted">Если застряла${g("","")} на желании, можно открыть настройку на желание или записать импульс в дне.</p>
    <button type="button" class="btn" data-act="close">Хорошо</button>
  </aside>`;
}
function matrixSheet(){
  return `<aside class="sheet" role="dialog">
    <button type="button" class="iconbtn close" data-act="close">×</button>
    <h2>Матрица решений</h2>
    <p>Два простых вопроса: что будет, если сделать, и что будет, если не делать. Запиши коротко.</p>
    <label class="field">Если сделаю<input id="mx1"></label>
    <label class="field">Если не сделаю<input id="mx2"></label>
    <label class="field">Что из этого ближе к моему желанию<input id="mx3"></label>
    <button type="button" class="btn" data-act="save-mx">Сохранить заметку</button>
  </aside>`;
}
function assocSheet(){
  const words="вода,огонь,дорога,дом,дверь,мост,сад,ключ,письмо,окно,гора,река,хлеб,нить,зеркало,свет".split(",");
  return `<aside class="sheet" role="dialog">
    <button type="button" class="iconbtn close" data-act="close">×</button>
    <h2>16 ассоциаций</h2>
    <p>К каждому слову — первая короткая связь с желанием, без цензуры.</p>
    ${words.map((w,i)=>`<label class="field">${esc(w)}<input data-assoc="${i}" placeholder="первая мысль"></label>`).join("")}
    <button type="button" class="btn" data-act="save-assoc">Сохранить</button>
  </aside>`;
}
function originSheet(){
  const o=originLabel();
  return `<aside class="sheet" role="dialog">
    <button type="button" class="iconbtn close" data-act="close">×</button>
    <h2>Сигналы желания</h2>
    <p>Метка: <b>${esc(o.kind)}</b> · ${esc(o.label)} (${o.ok} из ${o.need})</p>
    <ul class="signals">${o.sig.map(s=>`<li class="signal"><i></i><span>${esc(s.t)}</span></li>`).join("")}</ul>
    <p class="muted">Три из четырех сигналов — уверенно, меньше — предварительно. Это не диагноз.</p>
  </aside>`;
}


/* ---------- render ---------- */
function closeModal(){ S.ui.modal=null; const ov=$("#ov"); if(ov){ ov.className="ov"; ov.innerHTML=""; } }
function openModal(html){ const ov=$("#ov"); ov.className="ov on"; ov.innerHTML=html; bindPhotos(ov); }

function render(){
  const app=$("#app");
  if(!S.onb.done && S.onb.step==="accepted"){ app.innerHTML=shell(vAccepted(), {noProg:true}); bind(); return; }
  if(!S.onb.done){
    const map={apply:vApply,needs:vNeeds,wishes:vWishes,rings:vRings,pair:vPair,motive:vMotive,clean:vClean,gains:vGains,result:vResult,values:vValues,goals:vGoals,map:vOnbMap};
    const fn=map[S.onb.step]||vApply;
    app.innerHTML=shell(fn());
    bind(); return;
  }
  const tab=S.ui.tab||"today";
  let inner="";
  if(tab==="today") inner=vToday();
  else if(tab==="map") inner=vMap();
  else if(tab==="prac") inner=vPrac();
  else if(tab==="rep") inner=S.ui.rep==="final"? vFinal(): vRep();
  else inner=vToday();
  app.innerHTML=shell(inner, {forceApp:true});
  bind();
  fillPhotos(app);
  if(S.ui.modal==="worth") openModal(worthCardHtml());
  if(S.ui.modal==="help") openModal(helpSheet());
  if(S.ui.modal==="sector") openModal(sectorSheet(S.ui.sec));
  if(S.ui.modal==="matrix") openModal(matrixSheet());
  if(S.ui.modal==="assoc") openModal(assocSheet());
  if(S.ui.modal==="origin") openModal(originSheet());
  if(S.ui.modal==="photo") openPhoto(S.ui.photo);
  tickTimers();
}

function bind(){
  /* live inputs already have data-act; also persist name/wish fields on input */
  const app=$("#app");
  if($("#nm")) $("#nm").oninput=()=>{ S.user.name=$("#nm").value; save(); };
  if($("#wish") && S.onb.step==="apply") $("#wish").oninput=()=>{ S.wish.text=$("#wish").value; };
  if($("#set-nm")) $("#set-nm").onchange=()=>{ S.user.name=$("#set-nm").value; save(); toast("Имя сохранено"); };
  if($("#launch")) bindLaunch();
}

function bindLaunch(){
  const el=$("#launch");
  if(!el) return;
  const up=()=>{
    if(holdP>=100){ holdP=0; return; }
    clearInterval(holdT); holdT=null;
    if(holdP>0 && holdP<15){ holdP=0; el.classList.remove("holding"); el.style.setProperty("--p","0%"); doLaunch(); return; }
    holdP=0; el.classList.remove("holding"); el.style.setProperty("--p","0%");
  };
  el.onpointerdown=e=>{
    e.preventDefault();
    if(holdT) return;
    holdP=1; el.classList.add("holding");
    holdT=setInterval(()=>{
      holdP+=4;
      el.style.setProperty("--p", holdP+"%");
      if(holdP>=100){ clearInterval(holdT); holdT=null; holdP=100; doLaunch(); }
    }, 28);
  };
  el.onpointerup=up;
  el.onpointercancel=up;
  el.onpointerleave=()=>{ if(holdT && holdP<100){ clearInterval(holdT); holdT=null; holdP=0; el.classList.remove("holding"); el.style.setProperty("--p","0%"); } };
  el.onclick=e=>e.preventDefault();
}

function doLaunch(){
  const t=($("#wish")||{}).value;
  const name=($("#nm")||{}).value;
  if(name!=null) S.user.name=name;
  if(t!=null) S.wish.text=String(t).trim();
  if(!S.wish.text){ toast("Напиши желание своими словами"); return; }
  S.wish.history=S.wish.history||[];
  S.wish.history.push({text:S.wish.text, at:Date.now()});
  S.wish.launchedAt=Date.now();
  S.onb.step="accepted";
  launchSnd();
  save(); render();
}

/* ---------- events ---------- */
document.addEventListener("click", ev=>{
  const t=ev.target.closest("[data-act],[data-nav]");
  if(!t) return;
  if(t.dataset.nav){ clickSnd(); S.ui.tab=t.dataset.nav; S.ui.prac=null; S.ui.rep=null; save(); render(); window.scrollTo(0,0); return; }
  const act=t.dataset.act;
  if(!act) return;
  handle(act, t, ev);
});
document.addEventListener("input", ev=>{
  const t=ev.target;
  const act=t.dataset.act;
  if(!act) return;
  handleInput(act, t);
});
document.addEventListener("change", ev=>{
  const t=ev.target;
  const act=t.dataset.act;
  if(!act) return;
  handleInput(act, t);
});
$("#ov").addEventListener("click", ev=>{
  if(ev.target.id==="ov"){ clickSnd(); closeModal(); S.ui.modal=null; }
});

function handle(act, t, ev){
  const k=todayISO();
  clickSnd();
  if(act==="gender"){ S.user.gender=t.dataset.v; save(); render(); return; }
  if(act==="approach"){ S.wish.approach=t.dataset.v; save(); render(); return; }
  if(act==="launch-down"){ return; }
  if(act==="after-accept"){ goOnb("needs"); return; }
  if(act==="skip-onb"){ goOnb(t.dataset.to); return; }
  if(act==="save-needs"){
    if($("#bg")) S.needs.bg=$("#bg").value;
    if(!S.needs.startWheel) S.needs.startWheel=JSON.parse(JSON.stringify(S.needs.wheel||{}));
    save(); goOnb("wishes"); return;
  }
  if(act==="add-wish"){
    const v=($("#morew")||{}).value; if(!v||!v.trim()) return toast("Напиши желание");
    S.wishes.push({id:uid(), text:v.trim()}); $("#morew").value=""; save(); render(); return;
  }
  if(act==="del-wish"){ S.wishes.splice(+t.dataset.i,1); save(); render(); return; }
  if(act==="to-rings"){ save(); goOnb("rings"); return; }
  if(act==="ring-up"){ const i=+t.dataset.i; const a=S.rings.order; if(i>0){ [a[i-1],a[i]]=[a[i],a[i-1]]; S.rings.moves=S.rings.moves||{}; S.rings.moves[a[i-1]]=(S.rings.moves[a[i-1]]||0)+1; save(); render(); } return; }
  if(act==="ring-down"){ const i=+t.dataset.i; const a=S.rings.order; if(i<a.length-1){ [a[i+1],a[i]]=[a[i],a[i+1]]; S.rings.moves=S.rings.moves||{}; S.rings.moves[a[i]]=(S.rings.moves[a[i]]||0)+1; save(); render(); } return; }
  if(act==="to-pair"){ save(); goOnb("pair"); return; }
  if(act==="pair-pick"){
    const dt=Date.now()-(S.rings.pair&&S.rings.pair.t0||Date.now());
    S.rings.think=S.rings.think||{}; S.rings.think[t.dataset.id]=dt;
    S.rings.pairPick=t.dataset.id;
    /* move picked closer if not already first */
    const a=S.rings.order||[];
    const i=a.indexOf(t.dataset.id); if(i>0){ a.splice(i,1); a.unshift(t.dataset.id); }
    save(); goOnb("motive"); return;
  }
  if(act==="motive"){ S.motive.picks[t.dataset.p]=t.dataset.k; save(); render(); return; }
  if(act==="save-motive"){
    if($("#motn")) S.motive.note=$("#motn").value;
    const cnt={}; Object.values(S.motive.picks||{}).forEach(k=>cnt[k]=(cnt[k]||0)+1);
    S.motive.kind=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0]||null;
    save(); goOnb("clean"); return;
  }
  if(act==="save-clean"){
    S.clean={q1:($("#cq1")||{}).value||"", q2:($("#cq2")||{}).value||"", q3:($("#cq3")||{}).value||""};
    save(); goOnb("gains"); return;
  }
  if(act==="add-gain"){ const v=($("#gain")||{}).value; if(!v||!v.trim()) return; S.gains.items.push(v.trim()); if($("#gain")) $("#gain").value=""; save(); render(); return; }
  if(act==="del-gain"){ S.gains.items.splice(+t.dataset.i,1); save(); render(); return; }
  if(act==="skip-gains"){ S.gains.skipped=true; save(); goOnb("result"); return; }
  if(act==="save-gains"){ save(); goOnb("result"); return; }
  if(act==="relaunch"){
    const v=($("#refw")||{}).value; if(v&&v.trim()){ S.wish.history.push({text:S.wish.text, at:Date.now()}); S.wish.refined=v.trim(); }
    S.onb.step="accepted"; launchSnd(); save(); render(); return;
  }
  if(act==="to-values"){ const v=($("#refw")||{}).value; if(v&&v.trim()) S.wish.refined=v.trim(); setOrigin(); save(); goOnb("values"); return; }
  if(act==="add-val"){ S.values.ranked.push(t.dataset.v); save(); render(); return; }
  if(act==="val-up"){ const i=+t.dataset.i,a=S.values.ranked; if(i>0){[a[i-1],a[i]]=[a[i],a[i-1]];} save(); render(); return; }
  if(act==="val-down"){ const i=+t.dataset.i,a=S.values.ranked; if(i<a.length-1){[a[i+1],a[i]]=[a[i],a[i+1]];} save(); render(); return; }
  if(act==="val-del"){ S.values.ranked.splice(+t.dataset.i,1); save(); render(); return; }
  if(act==="save-vals"){ save(); goOnb("goals"); return; }
  if(act==="save-goals"){ save(); placeOnMap(); goOnb("map"); return; }
  if(act==="start-cycle"){ startCycle(); return; }

  if(act==="daytab"){
    const d=drec(k);
    d.tabs={ch:false,grat:false,tune:false};
    if(t.dataset.v==="ch") d.tabs.ch=true;
    if(t.dataset.v==="grat") d.tabs.grat=true;
    if(t.dataset.v==="tune") d.tabs.tune=true;
    save(); render(); return;
  }
  if(act==="toggle-hour"){ S.ui.hourOpen = S.ui.hourOpen===+t.dataset.h ? null : +t.dataset.h; save(); render(); return; }
  if(act==="add-imp"){ const v=($("#imp")||{}).value; if(!v||!v.trim()) return; drec(k).impulses.push(v.trim()); save(); render(); return; }
  if(act==="sess-start"){
    const d=drec(k); d.ch.on=true; d.ch.start=Date.now(); d.ch.end=Date.now()+2.5*3600000; d.ch.stop=null;
    if(!(d.ch.rows||[]).length) d.ch.rows.push({id:uid(), choice:"", status:"choose", tChoose:Date.now()});
    d.tabs={ch:true,grat:false,tune:false};
    save(); render(); startSessTick(); return;
  }
  if(act==="sess-stop"){
    const d=drec(k); d.ch.stop=Date.now(); d.ch.on=false;
    const st=deedStats([k]);
    toast("Сессия завершена. "+st.n+" "+delWord(st.n)+", "+fmtDur(st.ms));
    save(); render(); return;
  }
  if(act==="sess-add"){
    const d=drec(k); d.ch.rows=d.ch.rows||[];
    d.ch.rows.push({id:uid(), choice:"", status:"choose", tChoose:Date.now()});
    save(); render(); return;
  }
  if(act==="row-do"){ const r=findRow(k,t.dataset.id); if(r){ r.status="doing"; r.tDo=Date.now(); save(); render(); } return; }
  if(act==="row-done"){ const r=findRow(k,t.dataset.id); if(r){ r.status="done"; r.tDone=Date.now(); syncDeedToHours(k,r); maybeBonus(k); celebrate(); save(); render(); } return; }
  if(act==="row-switch"){ const r=findRow(k,t.dataset.id); if(r){ r.status="switched"; r.tDone=Date.now(); syncDeedToHours(k,r); maybeBonus(k); save(); render(); } return; }
  if(act==="bonus-notice"){
    const r=findRow(k,t.dataset.id); if(!r) return;
    const note=($("#bn-"+r.id)||{}).value||"";
    r.noticed=Date.now(); r.note=note;
    S.proofs.push({id:uid(), text: (r.choice||wishText()||"желание")+(note?": "+note:""), day:k, at:Date.now(), from:"bonus"});
    save(); render(); toast("Запись попала в «Мои доказательства»"); return;
  }
  if(act==="worth-open"){ S.ui.modal="worth"; openModal(worthCardHtml()); return; }
  if(act==="close"){ closeModal(); return; }
  if(act==="help"){ S.ui.modal="help"; openModal(helpSheet()); return; }
  if(act==="open-prac"){ S.ui.prac=t.dataset.id; save(); render(); window.scrollTo(0,0); return; }
  if(act==="prac-back"){ S.ui.prac=null; save(); render(); return; }
  if(act==="celeb"){ celebrate(t.dataset.t||""); return; }
  if(act==="grat-mode"){ S.grat.mode=t.dataset.v; save(); render(); return; }
  if(act==="grat-layer"){ S.ui.gratLayer=t.dataset.v; $$(".chip[data-act=grat-layer]").forEach(x=>x.classList.toggle("on", x===t)); return; }
  if(act==="add-grat"){
    const v=($("#gratt")||{}).value; if(!v||!v.trim()) return toast("Напиши, за что");
    const layer=S.ui.gratLayer||"out";
    drec(k).gratList.push({text:v.trim(), layer, at:Date.now()});
    S.grat.log[k]=S.grat.log[k]||[]; S.grat.log[k].push(v.trim());
    if($("#gratt")) $("#gratt").value="";
    save(); render(); return;
  }
  if(act==="add-proof"){
    const v=($("#proof")||{}).value; if(!v||!v.trim()) return;
    S.proofs.push({id:uid(), text:v.trim(), day:k, at:Date.now()});
    save(); render(); return;
  }
  if(act==="save-tune"){ const v=($("#tunef")||{}).value; if(v&&v.trim()){ S.tune.feel=S.tune.feel||[]; S.tune.feel.push(v.trim()); } save(); render(); toast("Сохранено"); return; }
  if(act==="aff-pick"){ S.aff.belief=+t.dataset.i; S.aff.text=BELIEFS[S.aff.belief][1]; save(); render(); return; }
  if(act==="save-aff"){ S.aff.text=($("#afft")||{}).value||S.aff.text; save(); toast("Формулировка сохранена"); return; }
  if(act==="save-sense"){
    S.dump.push({type:"sense", at:Date.now(), day:k, a:($("#s1")||{}).value, b:($("#s2")||{}).value, c:($("#s3")||{}).value});
    save(); toast("Три записи сохранены"); return;
  }
  if(act==="save-now"){
    S.dump.push({type:"now", at:Date.now(), day:k, a:($("#n1")||{}).value, b:($("#n2")||{}).value, c:($("#n3")||{}).value});
    save(); toast("Сохранено"); return;
  }
  if(act==="sil-toggle"){
    S.silence.on=!S.silence.on; save();
    if(S.silence.on) startSil(); else stopSil();
    render(); return;
  }
  if(act==="sil-reset"){ stopSil(); S.silence={secs:0,on:false}; save(); render(); return; }
  if(act==="save-phrase"){
    const v=($("#ph")||{}).value; if(!v||!v.trim()) return;
    const i=S.phrases.findIndex(p=>p.day===k);
    const rec={day:k, text:v.trim(), at:Date.now()};
    if(i>=0) S.phrases[i]=rec; else S.phrases.push(rec);
    save(); render(); toast("Фраза сохранена"); return;
  }
  if(act==="breath-toggle"){ startBreath(); return; }
  if(act==="mini-do"){ drec(k).impulses.push("Мини-практика: "+t.dataset.t); celebrate("Готово"); save(); toast(t.dataset.t); return; }
  if(act==="rule-tpl"){
    const r=RULES[+t.dataset.i];
    if($("#rif")) $("#rif").value=r[0];
    if($("#rthen")) $("#rthen").value=r[1];
    return;
  }
  if(act==="add-rule"){
    const iff=($("#rif")||{}).value||"", th=($("#rthen")||{}).value||"";
    if(!iff.trim()||!th.trim()) return toast("Нужны и повод, и одно действие");
    S.rules.push({id:uid(), if:iff.trim(), then:th.trim(), goal:($("#rgoal")||{}).value||"", ok:null, at:Date.now()});
    save(); render(); return;
  }
  if(act==="rule-ok"){ const r=S.rules.find(x=>x.id===t.dataset.id); if(r){ r.ok=t.dataset.v==="1"; save(); render(); } return; }
  if(act==="sec-open"){ ev.preventDefault(); ev.stopPropagation(); S.ui.modal="sector"; S.ui.sec=t.dataset.sec; openModal(sectorSheet(t.dataset.sec)); fillPhotos($("#ov")); return; }
  if(act==="sec-save"){
    const id=t.dataset.sec; S.map.sectors[id]=S.map.sectors[id]||{text:"",emblem:"",photos:[]};
    S.map.sectors[id].text=($("#sect")||{}).value||"";
    save(); closeModal(); render(); toast("Сектор сохранен"); return;
  }
  if(act==="emblem"){ S.map.sectors[t.dataset.sec].emblem=t.dataset.e; save(); openModal(sectorSheet(t.dataset.sec)); fillPhotos($("#ov")); return; }
  if(act==="photo-add"){ ev.preventDefault(); ev.stopPropagation(); pickPhoto(t.dataset.sec); return; }
  if(act==="photo-del"){ ev.preventDefault(); ev.stopPropagation(); const c=S.map.sectors[t.dataset.sec]; c.photos=(c.photos||[]).filter(x=>x!==t.dataset.id); save(); openModal(sectorSheet(t.dataset.sec)); fillPhotos($("#ov")); return; }
  if(act==="photo-open"){ ev.preventDefault(); ev.stopPropagation(); S.ui.modal="photo"; S.ui.photo=t.dataset.id; openPhoto(t.dataset.id); return; }
  if(act==="map-png"){ exportMapPng(); return; }
  if(act==="origin-open"){ S.ui.modal="origin"; openModal(originSheet()); return; }
  if(act==="period"){ S.ui.period=t.dataset.v; save(); render(); return; }
  if(act==="save-week"){ S.weekReviews[t.dataset.w]=($("#wrev")||{}).value||""; save(); toast("Обзор сохранен"); return; }
  if(act==="open-final"){ S.ui.rep="final"; save(); render(); window.scrollTo(0,0); return; }
  if(act==="wish-status"){ S.wish.status=t.dataset.v; save(); render(); return; }
  if(act==="final-png"){ exportFinalPng(); return; }
  if(act==="new-cycle"){
    if(!confirm("Начать новый цикл? Текущие записи останутся в архиве на этом устройстве.")) return;
    S.archive.push({at:Date.now(), wish:S.wish, cycle:S.cycle, days:S.days, goals:S.goals, final:S.final});
    S.cycle={startedOn:todayISO()}; S.days={}; S.wish.status="active"; S.final=null; S.ui.tab="today"; S.ui.rep=null;
    S.needs.startWheel=JSON.parse(JSON.stringify(S.needs.wheel||{}));
    save(); render(); toast("Новый цикл начат"); return;
  }
  if(act==="open-matrix"){ S.ui.modal="matrix"; openModal(matrixSheet()); return; }
  if(act==="open-assoc"){ S.ui.modal="assoc"; openModal(assocSheet()); return; }
  if(act==="save-mx"){ S.dump.push({type:"mx", at:Date.now(), a:($("#mx1")||{}).value, b:($("#mx2")||{}).value, c:($("#mx3")||{}).value}); save(); closeModal(); toast("Заметка сохранена"); return; }
  if(act==="save-assoc"){ const arr=$$("[data-assoc]").map(x=>x.value); S.dump.push({type:"assoc", at:Date.now(), arr}); save(); closeModal(); toast("Сохранено"); return; }
  if(act==="sounds"){ S.user.sounds=t.checked; save(); if(t.checked) clickSnd(); return; }
  if(act==="export"){ doExport(); return; }
  if(act==="import"){ const f=$("#impfile"); if(f){ f.onchange=()=>doImport(f.files[0]); f.click(); } return; }
  if(act==="reset-ask"){
    if(!confirm("Сбросить все данные на этом устройстве? Это нельзя отменить.")) return;
    localStorage.removeItem(KEY); S=def(); save(); render(); toast("Данные сброшены"); return;
  }
  if(act==="donate"){ ev.preventDefault(); if(DONATE_URL==="#") toast("Ссылка появится позже"); return; }
  if(act==="step-done"){ /* change event */ return; }
}

function handleInput(act, t){
  const k=todayISO();
  if(act==="need"){ S.needs.wheel[t.dataset.id]=S.needs.wheel[t.dataset.id]||{}; S.needs.wheel[t.dataset.id][t.dataset.f]=+t.value; const b=document.querySelector("[data-need='"+t.dataset.id+"-"+t.dataset.f+"']"); if(b) b.textContent=t.value; save(); return; }
  if(act==="need-text"){ S.needs.wheel[t.dataset.id]=S.needs.wheel[t.dataset.id]||{}; S.needs.wheel[t.dataset.id][t.dataset.f]=t.value; save(); return; }
  if(act==="worth"){ S.needs.worth=+t.value; const b=$("#worthv"); if(b) b.textContent=t.value; save(); return; }
  if(act==="goal"){ S.goals[+t.dataset.i][t.dataset.f]=t.value; save(); return; }
  if(act==="hour-met"){ const hr=hourRec(k,+t.dataset.h); hr[t.dataset.k]=+t.value; const b=t.parentNode.querySelector("b"); if(b) b.textContent=t.value; save(); return; }
  if(act==="hour-text"){ hourRec(k,+t.dataset.h).text=t.value; save(); return; }
  if(act==="hour-flag"){ hourRec(k,+t.dataset.h).flag=t.checked; save(); return; }
  if(act==="day-met"){ drec(k).metrics[t.dataset.k]=+t.value; save(); return; }
  if(act==="row-choice"){ const r=findRow(k,t.dataset.id); if(r){ r.choice=t.value; save(); } return; }
  if(act==="step-done"){
    const d=drec(k); d.steps=d.steps||[];
    if(t.checked && !d.steps.includes(t.dataset.id)) d.steps.push(t.dataset.id);
    if(!t.checked) d.steps=d.steps.filter(x=>x!==t.dataset.id);
    if(t.checked) celebrate();
    save(); return;
  }
  if(act==="sounds"){ S.user.sounds=t.checked; save(); return; }
}
function findRow(k,id){ return (drec(k).ch.rows||[]).find(r=>r.id===id); }


/* ---------- photos / png / export ---------- */
function pickPhoto(sec){
  const c=S.map.sectors[sec]=S.map.sectors[sec]||{text:"",emblem:"",photos:[]};
  if((c.photos||[]).length>=3){ toast("Уже три фото в секторе"); return; }
  const inp=document.createElement("input"); inp.type="file"; inp.accept="image/*";
  inp.onchange=async()=>{
    const f=inp.files&&inp.files[0]; if(!f) return;
    try{
      const blob=await compressFile(f);
      const id=uid();
      await photoPut(id, blob);
      c.photos=c.photos||[]; c.photos.push(id);
      save();
      if(S.ui.modal==="sector"){ openModal(sectorSheet(sec)); fillPhotos($("#ov")); }
      else render();
    }catch(e){ toast("Не получилось загрузить фото"); }
  };
  inp.click();
}
async function fillPhotos(root){
  if(!root) return;
  const imgs=$$("img[data-id], img[data-act=photo-open]", root);
  for(const img of imgs){
    const id=img.dataset.id; if(!id) continue;
    const url=await photoGet(id); if(url) img.src=url;
  }
}
function bindPhotos(){}
async function openPhoto(id){
  const url=await photoGet(id);
  openModal(`<aside class="sheet" role="dialog"><button type="button" class="iconbtn close" data-act="close">×</button>${url?`<img src="${url}" alt="" style="width:100%;border-radius:12px">`:"<p>Фото не найдено</p>"}</aside>`);
}

function downloadUrl(url, name){ const a=document.createElement("a"); a.href=url; a.download=name; a.click(); }

function exportMapPng(){
  const size=1080, pad=48, cell=(size-pad*2)/3;
  const c=document.createElement("canvas"); c.width=size; c.height=size;
  const g=c.getContext("2d");
  g.fillStyle="#F6F0E4"; g.fillRect(0,0,size,size);
  g.strokeStyle="rgba(196,163,90,.55)"; g.strokeRect(24,24,size-48,size-48);
  g.fillStyle="#3A2A22"; g.font="24px Georgia, serif";
  g.fillText("Карта истинных желаний", pad, 36);
  const wish=wishText();
  Promise.all(BAGUA.map(async (b,i)=>{
    const x=pad+(i%3)*cell, y=pad+36+Math.floor(i/3)*((size-pad*2-36)/3);
    const h=(size-pad*2-36)/3;
    const sec=S.map.sectors[b.id]||{};
    g.strokeStyle="rgba(58,42,34,.2)"; g.strokeRect(x+6,y+6,cell-12,h-12);
    g.fillStyle="#8A6A3A"; g.font="22px Georgia, serif"; g.fillText(b.title, x+20, y+36);
    g.fillStyle="#3A2A22"; g.font="36px Georgia, serif"; g.fillText(sec.emblem||EMBLEMS[i], x+20, y+78);
    wrapText(g, sec.text||"", x+20, y+110, cell-40, 24);
    const photos=(sec.photos||[]).slice(0,3);
    for(let j=0;j<photos.length;j++){
      const url=await photoGet(photos[j]);
      if(!url) continue;
      await new Promise(res=>{ const im=new Image(); im.onload=()=>{ const s=72; g.drawImage(im, x+20+j*(s+8), y+h-90, s, s); res(); }; im.onerror=res; im.src=url; });
    }
  })).then(()=>{
    if(wish){ g.fillStyle="#3A2A22"; g.font="20px Georgia, serif"; g.fillText(wish, pad, size-18); }
    c.toBlob(b=>{ if(!b) return; downloadUrl(URL.createObjectURL(b), "karta.png"); toast("Картинка сохранена"); });
  });
}
function wrapText(g, text, x, y, max, lh){
  if(!text) return;
  g.font="20px Georgia, serif";
  const words=String(text).split(/\s+/); let line="", yy=y;
  for(const w of words){
    const t=line? line+" "+w : w;
    if(g.measureText(t).width>max){ g.fillText(line,x,yy); line=w; yy+=lh; if(yy>y+lh*4) break; }
    else line=t;
  }
  if(line) g.fillText(line,x,yy);
}
function exportFinalPng(){
  const c=document.createElement("canvas"); c.width=1080; c.height=1350;
  const g=c.getContext("2d");
  g.fillStyle="#F6F0E4"; g.fillRect(0,0,1080,1350);
  g.fillStyle="#3A2A22"; g.font="40px Georgia, serif"; g.fillText("Итог 28 дней", 64, 90);
  g.font="28px Georgia, serif"; wrapText(g, wishText(), 64, 150, 950, 36);
  const st=deedStats(dayKeysInRange(1, Math.min(28,todayNum())));
  g.font="24px system-ui, sans-serif";
  g.fillText(volumeLine(st.n, st.ms, "cycle"), 64, 280);
  g.fillText("Фраз: "+(S.phrases||[]).length+" · доказательств: "+(S.proofs||[]).length, 64, 330);
  c.toBlob(b=>{ if(!b) return; downloadUrl(URL.createObjectURL(b), "itog-28.png"); toast("Картинка сохранена"); });
}

async function doExport(){
  const photos=await photoAll();
  const blob=new Blob([JSON.stringify({v:1, state:S, photos}, null, 2)], {type:"application/json"});
  downloadUrl(URL.createObjectURL(blob), "karta-kopiya.json");
  toast("Копия сохранена");
}
async function doImport(file){
  if(!file) return;
  try{
    const data=JSON.parse(await file.text());
    if(!data || !data.state){ toast("Файл не похож на копию"); return; }
    S=Object.assign(def(), data.state);
    S.user=Object.assign(def().user, data.state.user||{});
    if(data.photos) await photoImport(data.photos);
    save(); render(); toast("Копия загружена");
  }catch(e){ toast("Не получилось прочитать файл"); }
}

/* ---------- timers ---------- */
function startSessTick(){
  clearInterval(sessTimer);
  sessTimer=setInterval(()=>{
    const d=drec(todayISO());
    if(!(d.ch && d.ch.on && !d.ch.stop)) { clearInterval(sessTimer); return; }
    const note=$(".note"); // refresh leftover if visible
    if(S.ui.tab==="today" && d.tabs.ch){ /* light update without full rerender of inputs */
      const end=d.ch.end|| (d.ch.start+2.5*3600000);
      if(note && /Сессия идет/.test(note.textContent||"")) note.textContent="Сессия идет · осталось "+fmtDur(Math.max(0,end-Date.now()))+" · начата в "+fmtClock(d.ch.start);
    }
  },1000);
}
function startSil(){
  clearInterval(silTimer);
  silTimer=setInterval(()=>{
    if(!S.silence.on){ clearInterval(silTimer); return; }
    S.silence.secs=(S.silence.secs||0)+1;
    if(S.silence.secs>=600){ S.silence.on=false; clearInterval(silTimer); celebSnd(); toast("Десять минут тишины прошли"); }
    save();
    if(S.ui.prac==="silence"){
      const left=Math.max(0,600-S.silence.secs);
      const el=$(".card.center div"); if(el && el.style && el.style.fontSize){ /* skip */ }
      const box=document.querySelector(".card.center div[style]");
      if(box) box.textContent=pad(Math.floor(left/60))+":"+pad(left%60);
    }
  },1000);
}
function stopSil(){ S.silence.on=false; clearInterval(silTimer); }
let breathOn=false, breathInt=null;
function startBreath(){
  const el=$("#breath"); const lab=$("#brlab"); if(!el) return;
  breathOn=!breathOn;
  if(!breathOn){ clearInterval(breathInt); el.classList.remove("in","out"); if(lab) lab.textContent="Пауза"; return; }
  let phase="in", t=0;
  const tick=()=>{
    if(phase==="in"){ el.classList.add("in"); el.classList.remove("out"); if(lab) lab.textContent="Вдох"; if(++t>=3){ phase="out"; t=0; } }
    else { el.classList.add("out"); el.classList.remove("in"); if(lab) lab.textContent="Выдох"; if(++t>=4){ phase="in"; t=0; } }
  };
  tick(); clearInterval(breathInt); breathInt=setInterval(tick,1000);
}
function tickTimers(){
  const d=drec(todayISO());
  if(d.ch && d.ch.on && !d.ch.stop) startSessTick();
  if(S.silence.on) startSil();
}

/* ---------- init ---------- */
function boot(){
  load();
  render();
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  }
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
})();
