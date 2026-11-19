/* Карта истинных желаний — первая часть цельного приложения */
(() => {
"use strict";
const KEY = "karta.core.v1";
const HOLD_MS = 2500;
const AUTHOR = "Майя Явь";
const CONF = ["Неожиданное предложение","Новое знакомство","Идея","Свое действие","Реальный результат"];
const PHRASE = "Твое желание принято и реализуется в максимально возможные сроки наилучшим образом для тебя";
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const uid = () => Math.random().toString(36).slice(2,9);
const pad = n => (n<10?"0":"")+n;
const pad3 = n => String(n).padStart(3,"0");
const MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
const fmtDay = ts => { const d=new Date(ts); return d.getDate()+" "+MONTHS[d.getMonth()]; };
const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function g(m,f){ return S.user.gender==="m"?m:f; }
function wishWord(n){ const a=Math.abs(n)%100, b=a%10; if(a>10&&a<20) return "желаний"; if(b===1) return "желание"; if(b>=2&&b<=4) return "желания"; return "желаний"; }

function def(){
  return {
    version:1,
    user:{name:"", gender:"f", sounds:true},
    wishes:[],
    declaredId:null,
    seenInvite:false,
    seenSky:false,
    research:{scene:null, history:[], versions:[]},
    directions:[],
    cycle:{startedOn:null},
    days:{},
    ui:{screen:"splash", mode:"collect", pair:null, picks:{}, openId:null, confType:CONF[0], settings:false}
  };
}
let S = def();
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function load(){
  try{ const r=localStorage.getItem(KEY); if(r){ const o=JSON.parse(r); S=Object.assign(def(), o); S.user=Object.assign(def().user, o.user||{}); S.ui=Object.assign(def().ui, o.ui||{}); S.research=Object.assign(def().research, o.research||{}); S.cycle=Object.assign(def().cycle, o.cycle||{}); S.days=o.days||{}; S.directions=Array.isArray(o.directions)?o.directions:[]; } }catch(e){ S=def(); }
}

/* ---------- sound: one gold anchor timbre reused ---------- */
let actx=null;
function ctx(){ if(!actx){ try{ actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(actx&&actx.state==="suspended") actx.resume(); return actx; }
function tone(freq, dur, type, vol, delay){
  if(!S.user.sounds) return;
  const c=ctx(); if(!c) return;
  const t=c.currentTime+(delay||0);
  const o=c.createOscillator(), g=c.createGain();
  o.type=type||"sine"; o.frequency.value=freq;
  g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol||0.05,t+0.02);
  g.gain.exponentialRampToValueAtTime(0.0001,t+(dur||0.18));
  o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+(dur||0.2)+0.05);
}
function clickSnd(){ tone(660,0.07,"sine",0.035); }
function anchorSnd(){ /* same gold anchor every time */ tone(392,0.16,"sine",0.05); tone(523,0.22,"sine",0.045,0.1); tone(659,0.38,"sine",0.05,0.22); }
function softSnd(){ tone(784,0.12,"triangle",0.03); }
function sparkSnd(){ tone(880,0.08,"sine",0.03); tone(1174,0.14,"sine",0.025,0.06); }
function novaSnd(){ tone(261,0.3,"sine",0.06); tone(392,0.35,"sine",0.05,0.12); tone(523,0.5,"sine",0.05,0.28); tone(784,0.7,"sine",0.04,0.4); }

/* ---------- sky canvas ---------- */
const cvs=$("#sky"), cx=cvs.getContext("2d");
let stars=[], raf=0, t0=0;
function resize(){ const d=Math.min(2, window.devicePixelRatio||1); cvs.width=innerWidth*d; cvs.height=innerHeight*d; cvs.style.width=innerWidth+"px"; cvs.style.height=innerHeight+"px"; cx.setTransform(d,0,0,d,0,0); }
function seedSky(){
  const n = innerWidth<400?48:72;
  stars=Array.from({length:n},()=>({
    x:Math.random()*innerWidth, y:Math.random()*innerHeight,
    r:Math.random()*1.4+0.3, a:Math.random(), s:0.002+Math.random()*0.006,
    vx:(Math.random()-0.5)*0.04, vy:(Math.random()-0.5)*0.03
  }));
}
function drawSky(ts){
  if(!t0) t0=ts;
  cx.clearRect(0,0,innerWidth,innerHeight);
  stars.forEach(st=>{
    if(!reduce){ st.x+=st.vx; st.y+=st.vy; st.a+=st.s; if(st.x<0)st.x=innerWidth; if(st.x>innerWidth)st.x=0; if(st.y<0)st.y=innerHeight; if(st.y>innerHeight)st.y=0; }
    const al = reduce?0.55: 0.25+0.55*Math.abs(Math.sin(st.a*3));
    cx.beginPath(); cx.fillStyle="rgba(240,198,116,"+al+")"; cx.arc(st.x,st.y,st.r,0,Math.PI*2); cx.fill();
  });
  raf=requestAnimationFrame(drawSky);
}
function startSky(){ resize(); seedSky(); cancelAnimationFrame(raf); raf=requestAnimationFrame(drawSky); }
window.addEventListener("resize", ()=>{ resize(); });

/* ---------- positions for wish stars ---------- */
function placeWish(i, total){
  const w=innerWidth, h=innerHeight;
  const top=110, bot=230, left=48, right=48;
  const areaW=w-left-right, areaH=Math.max(180,h-top-bot);
  const jitter=(n)=>{ const x=Math.sin((n+1)*12.9898)*43758.5453; return x-Math.floor(x); };
  if(total<=8){
    const cx=left+areaW/2, cy=top+areaH*0.42;
    const rx=areaW*0.34, ry=areaH*0.34;
    const ang=-Math.PI/2 + i*(2*Math.PI/Math.max(total,3)) + 0.12;
    const jx=(jitter(i)-0.5)*10, jy=(jitter(i+9)-0.5)*10;
    return {x: cx+Math.cos(ang)*rx+jx, y: cy+Math.sin(ang)*ry+jy};
  }
  const cols=Math.min(4, Math.max(2, Math.ceil(Math.sqrt(total||3))));
  const rows=Math.ceil((total||1)/cols);
  const col=i%cols, row=Math.floor(i/cols);
  const jx=(jitter(i)-0.5)*28, jy=(jitter(i+9)-0.5)*24;
  return {
    x: left + areaW*(cols===1?0.5:(col+0.5)/cols) + jx,
    y: top + areaH*(rows===1?0.38:(row+0.5)/rows) + jy
  };
}

/* ---------- fx ---------- */
function burst(){ if(reduce) return; const el=document.createElement("div"); el.className="burst"; $("#fx").appendChild(el); setTimeout(()=>el.remove(),900); }
function nova(){ if(reduce) return; const el=document.createElement("div"); el.className="nova"; $("#fx").appendChild(el); setTimeout(()=>el.remove(),1600); }
function sparksTo(x,y, n=14){
  if(reduce){ return; }
  for(let i=0;i<n;i++){
    const s=document.createElement("div"); s.className="spark";
    const x0=innerWidth/2 + (Math.random()-0.5)*80, y0=innerHeight-80;
    s.style.left=x0+"px"; s.style.top=y0+"px";
    $("#fx").appendChild(s);
    const dx=x-x0, dy=y-y0;
    s.animate([{transform:"translate(0,0)",opacity:1},{transform:"translate("+dx+"px,"+dy+"px)",opacity:0.2}],{duration:700+Math.random()*300,easing:"cubic-bezier(.22,1,.36,1)"}).onfinish=()=>s.remove();
  }
}
function press(el){ if(!el) return; el.classList.add("press"); setTimeout(()=>el.classList.remove("press"),160); }

/* ---------- photos ---------- */
function compressFile(file){ return new Promise((res,rej)=>{ const img=new Image(); const url=URL.createObjectURL(file); img.onload=()=>{ const sc=Math.min(1,800/Math.max(img.width,img.height)); const c=document.createElement("canvas"); c.width=Math.round(img.width*sc); c.height=Math.round(img.height*sc); c.getContext("2d").drawImage(img,0,0,c.width,c.height); res(c.toDataURL("image/jpeg",0.82)); URL.revokeObjectURL(url); }; img.onerror=rej; img.src=url; }); }

/* ---------- screens ---------- */
function go(name, extra){
  S.ui.screen=name; if(extra) Object.assign(S.ui, extra); save(); render();
}

function vSplash(){
  return `<section class="scene splash on" data-act="enter" id="sc-splash">
    <p class="kicker">для тебя</p>
    <h1>Карта истинных желаний</h1>
    <p class="author">${esc(AUTHOR)}</p>
    <p class="hint">коснись экрана</p>
  </section>`;
}
function vInvite(){
  return `<section class="scene invite on">
    <p class="line">Сейчас у тебя уникальная возможность загадать свои желания и узнать, какие из них истинные.</p>
    <p class="sub">Пиши все, что приходит. Когда ты увидишь, какие из них по-настоящему твои, небо само это покажет.</p>
    <div class="gold-bar" style="margin-top:28px;width:min(92vw,380px)"><button type="button" class="gold" data-act="to-sky">Начать загадывать</button></div>
  </section>`;
}

function starEls(opts){
  opts=opts||{};
  const list=S.wishes;
  return list.map((w,i)=>{
    const p=w.x?w:{...w, ...placeWish(i, list.length)};
    if(!w.x){ w.x=p.x; w.y=p.y; }
    let cls="star";
    if(w.id===S.declaredId) cls+=" gold"+(w.fulfilled?" ful":"");
    else if(S.seenSky && w.glow) cls+=" glow";
    else if(S.seenSky && w.faint) cls+=" faint";
    if(opts.dimExcept && w.id!==opts.dimExcept && w.id!==S.declaredId) cls+=" dim";
    if(opts.front===w.id) cls+=" front";
    const hideCap=opts.hideCap || S.ui.mode==="pair" || (S.seenSky && w.faint && S.ui.mode==="discover");
    const cap = hideCap? "": `<span class="cap">${esc(w.text)}</span>`;
    return `<button type="button" class="${cls}" data-act="star" data-id="${w.id}" style="left:${w.x}px;top:${w.y}px" aria-label="${esc(w.text)}">${cap}</button>`;
  }).join("");
}

function vSky(){
  const n=S.wishes.length;
  const mode=S.ui.mode||"collect";
  let bar="";
  if(mode==="collect"){
    bar=`<div class="composer">
      <label for="wish">Чего ты хочешь?</label>
      <div class="line">
        <input id="wish" maxlength="120" placeholder="Пиши все, что приходит" autocomplete="off">
        <button type="button" class="send" data-act="add" aria-label="Добавить">✦</button>
      </div>
    </div>`;
    if(n>=3 && !S.seenSky) bar = `<div class="gold-bar"><button type="button" class="gold" data-act="start-see">Посмотреть, какие ближе</button></div>`+bar;
    if(S.seenSky) bar = `<div class="gold-bar"><button type="button" class="gold" data-act="start-choose">Загадать одно</button></div>`+bar;
  } else if(mode==="pair"){
    const pr=S.ui.pair;
    bar=`<p class="hint-choose">Если оставить рядом только одно — какое ближе сейчас?</p>`;
  } else if(mode==="discover"){
    const verb=g("выбирал","выбирала");
    bar=`<p class="discover-line">Когда ты ${verb}, некоторые звезды сами стали ярче. Так сейчас выглядит твое небо.</p>
      <p class="mute" style="text-align:center;margin:0 24px 12px">Это не приговор. Если картина не твоя, ее можно вернуть.</p>
      <div class="gold-bar"><button type="button" class="gold" data-act="start-choose">Загадать одно</button></div>
      <p style="text-align:center"><button type="button" class="quiet" data-act="undo-sky">Вернуть как было</button></p>`;
  } else if(mode==="choose"){
    bar=`<p class="hint-choose">Коснись той звезды, которую хочешь заявить сейчас.</p>`;
  }
  const pace = n? `<div class="counter" id="counter">Уже ${n} ${wishWord(n)}</div>`: `<div class="counter" id="counter"></div>`;
  return `<section class="scene sky-ui on">${pace}
    ${starEls({dimExcept: mode==="pair"?null:null, front: mode==="pair"?null:null})}
    ${bar}
    ${iconBar()}
  </section>`;
}

function iconBar(){
  const snd=S.user.sounds?"♪":"–";
  return `<button type="button" class="icon sound" data-act="sounds" aria-label="Звук">${snd}</button>
    <button type="button" class="icon back" data-act="settings" aria-label="Еще" style="opacity:.7">···</button>`;
}

function vClarify(){
  const w=S.wishes.find(x=>x.id===S.ui.openId); if(!w) return vSky();
  const form=w.form||w.text;
  const ev=w.evidence||"";
  const eco=w.eco||"";
  const br=w.bright||50, cl=w.close||50, big=w.big||50;
  return `<section class="scene ritual on">
    ${starEls({dimExcept:w.id, front:w.id, hideCap:true})}
    <aside class="panel">
      <div class="sheet-body">
        <p class="mute">Ты ${g("выбрал","выбрала")} «${esc(w.text)}».</p>
        <h2>Скажи его так, будто оно уже есть</h2>
        <textarea id="form" rows="2" placeholder="в настоящем времени, своими словами">${esc(form)}</textarea>
        <p class="ex">Например: я живу у воды и каждое утро открываю окно в тишину.</p>
        <label class="mute">Как ты узнаешь, что это уже случилось? Что увидишь, услышишь, почувствуешь?</label>
        <textarea id="ev" rows="2" placeholder="то, что можно заметить в обычном дне">${esc(ev)}</textarea>
        <div class="slider-row"><span>Ярче</span><input type="range" min="0" max="100" value="${br}" data-act="sub" data-k="bright"></div>
        <div class="slider-row"><span>Ближе</span><input type="range" min="0" max="100" value="${cl}" data-act="sub" data-k="close"></div>
        <div class="slider-row"><span>Больше</span><input type="range" min="0" max="100" value="${big}" data-act="sub" data-k="big"></div>
        <label class="mute">Когда это уже есть, что важное рядом с тобой остается на своем месте?</label>
        <textarea id="eco" rows="2" placeholder="по желанию, можно пропустить">${esc(eco)}</textarea>
        <div class="photo-slot" data-act="photo" data-id="${w.id}">${w.photo?`<img src="${w.photo}" alt="">`:"+"}</div>
      </div>
      <div class="sheet-cta">
        <button type="button" class="gold" data-act="to-name">Дальше: как к тебе обращаться</button>
        <p style="text-align:center;margin-top:8px"><button type="button" class="quiet" data-act="back-sky">К небу</button></p>
      </div>
    </aside>
  </section>`;
}

function vName(){
  const have=S.user.name;
  return `<section class="scene ritual on">
    ${starEls({dimExcept:S.ui.openId, front:S.ui.openId, hideCap:true})}
    <aside class="panel">
      <div class="sheet-body">
        <h2>Как к тебе обращаться, когда желание откликнется?</h2>
        <input class="field" id="nm" maxlength="40" value="${esc(S.user.name)}" placeholder="твое имя">
        <div class="orbs">
          <button type="button" class="orb ${S.user.gender!=="m"?"on":""}" data-act="gender" data-v="f">Ж</button>
          <button type="button" class="orb ${S.user.gender==="m"?"on":""}" data-act="gender" data-v="m">М</button>
        </div>
      </div>
      <div class="sheet-cta">
        <button type="button" class="gold" data-act="to-tune">Дальше: настроиться</button>
      </div>
    </aside>
  </section>`;
}

function vTune(){
  return `<section class="scene ritual on">
    <aside class="panel" style="text-align:center">
      <div class="sheet-body">
        <h2>Побудь с ним немного</h2>
        <p>Держи внимание на круге. Можно просто смотреть.</p>
        <div class="breath" id="breath"><i></i></div>
        <p class="breath-lab" id="brlab">вдох</p>
      </div>
      <div class="sheet-cta">
        <button type="button" class="gold" data-act="to-declare">Дальше: заявить желание</button>
        <p><button type="button" class="quiet" data-act="to-declare">Пропустить</button></p>
      </div>
    </aside>
  </section>`;
}

function vDeclare(){
  const w=S.wishes.find(x=>x.id===S.ui.openId);
  const t=(w&&(w.form||w.text))||"";
  return `<section class="scene ritual on" style="align-items:center;justify-content:flex-end;padding-bottom:24px">
    <p class="discover-line">${esc(t)}</p>
    <div class="declare-wrap">
      <button type="button" class="declare-btn" id="declare" data-hold="1">
        <div class="declare-fill"></div>
        <div class="lbl">Заявить желание<small>удерживай 2,5 с</small></div>
      </button>
    </div>
    <p class="mute" style="text-align:center;margin:8px 24px 20px">Этот свет и этот звук — твой якорь. К ним можно возвращаться.</p>
    <p style="text-align:center"><button type="button" class="quiet" data-act="to-tune">Назад</button></p>
  </section>`;
}

function vAccepted(){
  const w=declared();
  const n=w?w.num:1;
  return `<section class="scene accept on">
    <p class="kicker">Желание №${pad3(n)}</p>
    <p class="phrase">${esc(PHRASE)}</p>
    <p class="meta">${w?fmtDay(w.declaredAt):""}</p>
    <div class="gold-bar" style="width:min(92vw,380px);margin-top:28px"><button type="button" class="gold" data-act="to-wish">Открыть желание</button></div>
  </section>`;
}

function declared(){ return S.wishes.find(x=>x.id===S.declaredId); }

function vWish(){
  const w=declared();
  if(!w) return vSky();
  const confs=w.confs||[];
  const pts=confs.map((c,i)=>{
    const a=(i+1)/(confs.length+1);
    return {x: 30+a*60, y: 78-Math.sin(a*Math.PI)*48, c};
  });
  const path = pts.length? pts.map((p,i)=>(i?"L":"M")+p.x+","+p.y).join(" ")+" L50,18":"";
  const nodes=pts.map((p,i)=>`<button type="button" class="node" style="left:${p.x}%;top:${p.y}%" data-act="tip">
      <span class="tip"><b>${esc(p.c.type)}</b><br>${esc(p.c.text||"")}<br><span class="mute">${fmtDay(p.c.ts)}</span></span>
    </button>`).join("");
  return `<section class="scene wish-home on">
    ${iconBar()}
    <p class="num">Желание №${pad3(w.num)} · ${fmtDay(w.declaredAt)}${w.fulfilled?" · сбылось":""}</p>
    <h1>${esc(w.form||w.text)}</h1>
    <div class="path">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${path}" fill="none" stroke="rgba(212,168,87,.55)" stroke-width="0.7"></path></svg>
      <button type="button" class="star gold ${w.fulfilled?"ful":""}" style="left:50%;top:18%;position:absolute" data-act="noop"></button>
      ${nodes}
    </div>
    <div class="actions">
      ${w.fulfilled?"":`<button type="button" class="gold spark-src" data-act="notice">${g("Заметил","Заметила")}</button>
      <button type="button" class="quiet" data-act="fulfill" style="text-align:center">Сбылось</button>`}
      <button type="button" class="quiet" data-act="later" style="text-align:center">Разобраться с остальными желаниями</button>
      <button type="button" class="quiet" data-act="back-sky" style="text-align:center">К небу</button>
    </div>
  </section>`;
}

function vNotice(){
  const t=S.ui.confType||CONF[0];
  return `<section class="scene ritual on">
    <aside class="panel">
      <div class="sheet-body">
        <h2>${g("Что ты заметил","Что ты заметила")}?</h2>
        <div class="types">${CONF.map(c=>`<button type="button" class="${t===c?"on":""}" data-act="ctype" data-v="${esc(c)}">${esc(c)}</button>`).join("")}</div>
        <textarea id="note" rows="2" placeholder="коротко, своими словами"></textarea>
      </div>
      <div class="sheet-cta">
        <button type="button" class="gold" data-act="save-notice">Сохранить</button>
        <p style="text-align:center"><button type="button" class="quiet" data-act="to-wish">Отмена</button></p>
      </div>
    </aside>
  </section>`;
}

function vLater(){
  return `<section class="scene later on">
    <div class="soon-sky" aria-hidden="true"></div>
    <p class="kicker">Следующая глава</p>
    <h2>Разобраться с остальными желаниями</h2>
    <p>Скоро здесь откроется короткая сцена. Небо снова откликнется, и ты увидишь еще яснее, какие звезды ближе.</p>
    <p class="mute">Пока твое заявленное желание уже живет своей историей. К нему можно вернуться в любой момент.</p>
    <div class="gold-bar" style="width:min(92vw,380px);margin-top:24px"><button type="button" class="gold" data-act="to-wish">К желанию</button></div>
    <p><button type="button" class="quiet" data-act="back-sky">К небу</button></p>
  </section>`;
}

function vSettings(){
  return `<section class="scene on">
    <aside class="panel">
      <div class="sheet-body">
        <h2>Настройки</h2>
        <label class="mute">Имя</label>
        <input class="field" id="set-nm" value="${esc(S.user.name)}">
        <div class="orbs">
          <button type="button" class="orb ${S.user.gender!=="m"?"on":""}" data-act="gender" data-v="f">Ж</button>
          <button type="button" class="orb ${S.user.gender==="m"?"on":""}" data-act="gender" data-v="m">М</button>
        </div>
        <p><button type="button" class="quiet" data-act="sounds">Звуки: ${S.user.sounds?"включены":"выключены"}</button></p>
      </div>
      <div class="sheet-cta">
        <p class="mute" style="margin:0 0 4px">18+</p>
        <p class="author" style="margin:0 0 12px">${esc(AUTHOR)}</p>
        <button type="button" class="gold" data-act="close-set">Закрыть</button>
        <p style="text-align:center;margin-top:10px"><button type="button" class="quiet" data-act="reset-ask">Начать сначала</button></p>
      </div>
    </aside>
  </section>`;
}

function vStarEdit(){
  const w=S.wishes.find(x=>x.id===S.ui.openId); if(!w) return vSky();
  return `<section class="scene on">
    ${starEls({front:w.id, dimExcept:w.id})}
    <aside class="panel">
      <div class="sheet-body">
        <h2>Эта звезда</h2>
        <textarea id="ed" rows="2">${esc(w.text)}</textarea>
        <div class="photo-slot" data-act="photo" data-id="${w.id}">${w.photo?`<img src="${w.photo}" alt="">`:"+"}</div>
      </div>
      <div class="sheet-cta">
        <button type="button" class="gold" data-act="save-star">Сохранить</button>
        <p style="text-align:center"><button type="button" class="quiet" data-act="back-sky">Закрыть</button></p>
      </div>
    </aside>
  </section>`;
}

function render(){
  applySubToOpen();
  const map={
    splash:vSplash, invite:vInvite, sky:vSky, clarify:vClarify, name:vName,
    tune:vTune, declare:vDeclare, accepted:vAccepted, wish:vWish, notice:vNotice,
    later:vLater, settings:vSettings, edit:vStarEdit
  };
  const fn=map[S.ui.screen]||vSplash;
  $("#app").innerHTML=fn();
  if(S.ui.screen==="sky" && S.ui.mode==="pair") layoutPair();
  if(S.ui.screen==="clarify") placeFocusStar();
  if(S.ui.screen==="declare") bindHold();
  if(S.ui.screen==="tune" && !reduce) startBreathLab();
  applySubToOpen();
  const inp=$("#wish"); if(inp) setTimeout(()=>inp.focus(),50);
}

function placeFocusStar(){
  const id=S.ui.openId; if(!id) return;
  const el=$(`.star[data-id="${id}"]`);
  if(el){ el.style.left="50%"; el.style.top="16%"; el.classList.add("front"); }
}

function applySubToOpen(){
  if(S.ui.screen!=="clarify") return;
  const w=S.wishes.find(x=>x.id===S.ui.openId); if(!w) return;
  applySub(null, null, true);
}

function layoutPair(){
  const pr=S.ui.pair; if(!pr) return;
  const a=S.wishes.find(x=>x.id===pr.a), b=S.wishes.find(x=>x.id===pr.b);
  $$(".star").forEach(el=>{
    const id=el.dataset.id;
    if(id===pr.a || id===pr.b){
      el.classList.add("front"); el.classList.remove("dim");
      el.style.left = (id===pr.a? "28%":"72%");
      el.style.top = "42%";
    } else el.classList.add("dim");
  });
}

/* ---------- logic ---------- */
function addWish(text){
  text=(text||"").trim(); if(!text) return;
  const i=S.wishes.length;
  const pos=placeWish(i, i+1);
  const w={id:uid(), text, photo:"", x:innerWidth/2, y:innerHeight-90, confs:[], glow:false, faint:false};
  S.wishes.push(w);
  save(); render();
  // fly
  requestAnimationFrame(()=>{
    const el=$(`.star[data-id="${w.id}"]`);
    if(el){ el.classList.add("rising"); el.style.left=w.x+"px"; el.style.top=w.y+"px"; }
  });
  setTimeout(()=>{ w.x=pos.x; w.y=pos.y; save(); const el=$(`.star[data-id="${w.id}"]`); if(el){ el.style.left=pos.x+"px"; el.style.top=pos.y+"px"; } }, 40);
  const c=$("#counter"); if(c){ c.classList.add("pop"); c.textContent="Уже "+S.wishes.length+" "+wishWord(S.wishes.length); }
  anchorSnd();
  if(!reduce) burst();
}

function startSee(){
  if(S.wishes.length<3) return;
  S.ui.picks={}; S.seenSky=false;
  const ids=S.wishes.map(w=>w.id);
  const pairs=[];
  for(let i=0;i<ids.length;i++) for(let j=i+1;j<ids.length;j++) pairs.push([ids[i],ids[j]]);
  // up to 3 pairs, shuffled
  for(let i=pairs.length-1;i>0;i--){ const k=Math.floor(Math.random()*(i+1)); [pairs[i],pairs[k]]=[pairs[k],pairs[i]]; }
  S.ui.pairQueue=pairs.slice(0, Math.min(3, pairs.length));
  S.ui.mode="pair";
  nextPair();
}
function nextPair(){
  const q=S.ui.pairQueue||[];
  if(!q.length){ finishSee(); return; }
  const [a,b]=q.shift();
  S.ui.pair={a,b}; S.ui.mode="pair"; S.ui.screen="sky";
  save(); render();
}
function pickPair(id){
  S.ui.picks[id]=(S.ui.picks[id]||0)+1;
  softSnd(); clickSnd();
  nextPair();
}
function finishSee(){
  const scores=S.ui.picks||{};
  const vals=S.wishes.map(w=>scores[w.id]||0);
  const mx=Math.max(0,...vals), mn=Math.min(...vals);
  S.wishes.forEach(w=>{
    const sc=scores[w.id]||0;
    w.glow = mx>0 && sc===mx;
    w.faint = vals.length>1 && sc===mn && mx!==mn;
  });
  S.seenSky=true; S.ui.mode="discover"; S.ui.pair=null;
  save(); render();
  anchorSnd(); if(!reduce) burst();
}
function undoSky(){
  S.wishes.forEach(w=>{ w.glow=false; w.faint=false; });
  S.seenSky=true; S.ui.mode="discover";
  save(); render(); softSnd();
}

function saveClarify(){
  const w=S.wishes.find(x=>x.id===S.ui.openId); if(!w) return;
  const f=$("#form"), e=$("#ev"), o=$("#eco");
  if(f) w.form=f.value.trim();
  if(e) w.evidence=e.value.trim();
  if(o) w.eco=o.value.trim();
  save();
}
function applySub(k,v, silent){
  const w=S.wishes.find(x=>x.id===S.ui.openId); if(!w) return;
  if(k) { w[k]=+v; save(); }
  const el=$(`.star[data-id="${w.id}"]`);
  if(el){
    const br=(w.bright||50)/100, cl=(w.close||50)/100, big=(w.big||50)/100;
    const sc=1.6 + big*1.1 + cl*0.4;
    el.style.transform=`translate(-50%,-50%) scale(${sc})`;
    el.style.filter=`brightness(${0.8+br*0.8})`;
    el.style.boxShadow=`0 0 ${16+br*40}px rgba(240,198,116,${0.3+br*0.5})`;
  }
  if(!silent) softSnd();
}

/* hold */
let holdStart=0, holdRaf=null;
function bindHold(){
  const btn=$("#declare"); if(!btn) return;
}
function startHold(e){
  e.preventDefault();
  holdStart=Date.now();
  const btn=$("#declare"); if(!btn) return;
  btn.classList.add("holding");
  const fill=btn.querySelector(".declare-fill");
  const tick=()=>{
    const el=Date.now()-holdStart;
    const p=Math.min(100,(el/HOLD_MS)*100);
    if(fill) fill.style.setProperty("--p", p);
    if(el>=HOLD_MS){ holdRaf=null; return; }
    holdRaf=requestAnimationFrame(tick);
  };
  holdRaf=requestAnimationFrame(tick);
}
function endHold(){
  if(!holdStart) return;
  const el=Date.now()-holdStart;
  holdStart=0;
  if(holdRaf){ cancelAnimationFrame(holdRaf); holdRaf=null; }
  const btn=$("#declare");
  if(btn) btn.classList.remove("holding");
  const fill=btn&&btn.querySelector(".declare-fill");
  if(fill) fill.style.setProperty("--p",0);
  if(el>=HOLD_MS) doDeclare();
}
function doDeclare(){
  const w=S.wishes.find(x=>x.id===S.ui.openId); if(!w) return;
  const prev=S.wishes.filter(x=>x.num).map(x=>x.num);
  w.num=(prev.length?Math.max(...prev):0)+1;
  w.declaredAt=Date.now();
  S.declaredId=w.id;
  save();
  anchorSnd(); nova(); burst();
  go("accepted");
}

let brTimer=null;
function startBreathLab(){
  clearInterval(brTimer);
  let phase="вдох";
  const lab=$("#brlab");
  brTimer=setInterval(()=>{
    phase = phase==="вдох"?"выдох":"вдох";
    if(lab) lab.textContent=phase;
  }, 3750);
}

/* events */
document.addEventListener("click", ev=>{
  const t=ev.target.closest("[data-act]");
  if(!t) {
    if(S.ui.screen==="splash"){ clickSnd(); go("invite"); }
    return;
  }
  const act=t.dataset.act;
  if(act==="enter"){ clickSnd(); go("invite"); return; }
  if(act==="to-sky"){ clickSnd(); S.ui.mode="collect"; go("sky"); return; }
  if(act==="add"){ const v=$("#wish")&&$("#wish").value; addWish(v); return; }
  if(act==="start-see"){ clickSnd(); startSee(); return; }
  if(act==="start-choose"){ clickSnd(); S.ui.mode="choose"; S.ui.screen="sky"; save(); render(); return; }
  if(act==="undo-sky"){ undoSky(); return; }
  if(act==="star"){
    const id=t.dataset.id;
    if(S.ui.mode==="pair"){ pickPair(id); return; }
    if(S.ui.mode==="choose"){ clickSnd(); S.ui.openId=id; go("clarify"); return; }
    // collect / discover: open edit
    clickSnd(); S.ui.openId=id; go("edit"); return;
  }
  if(act==="save-star"){ const w=S.wishes.find(x=>x.id===S.ui.openId); if(w&&$("#ed")) w.text=$("#ed").value.trim()||w.text; save(); S.ui.screen="sky"; save(); render(); softSnd(); return; }
  if(act==="back-sky"){ S.ui.mode=S.seenSky&&S.ui.mode==="choose"?"choose": (S.seenSky?"discover":"collect"); if(S.ui.mode==="choose"||S.ui.mode==="discover"){} go("sky"); return; }
  if(act==="to-name"){ saveClarify(); clickSnd(); go("name"); return; }
  if(act==="gender"){ S.user.gender=t.dataset.v; save(); render(); softSnd(); return; }
  if(act==="to-tune"){ const nm=$("#nm"); if(nm) S.user.name=nm.value.trim(); save(); clickSnd(); go("tune"); return; }
  if(act==="to-declare"){ clickSnd(); go("declare"); return; }
  if(act==="to-wish"){ clickSnd(); go("wish"); return; }
  if(act==="notice"){ clickSnd(); go("notice"); return; }
  if(act==="ctype"){ S.ui.confType=t.dataset.v; save(); render(); clickSnd(); return; }
  if(act==="save-notice"){
    const w=declared(); if(!w) return;
    const text=($("#note")&&$("#note").value||"").trim();
    w.confs=w.confs||[]; w.confs.push({type:S.ui.confType||CONF[0], text, ts:Date.now()});
    save(); sparkSnd();
    go("wish");
    const star=$(".wish-home .star.gold")||$(".star.gold");
    if(star){ const r=star.getBoundingClientRect(); sparksTo(r.left+r.width/2, r.top+r.height/2); }
    return;
  }
  if(act==="fulfill"){
    const w=declared(); if(!w) return;
    w.fulfilled=true; w.fulfilledAt=Date.now(); save();
    novaSnd(); nova(); burst();
    go("wish");
    return;
  }
  if(act==="later"){ clickSnd(); go("later"); return; }
  if(act==="sounds"){ S.user.sounds=!S.user.sounds; save(); if(S.user.sounds) anchorSnd(); render(); return; }
  if(act==="settings"){ clickSnd(); S.ui.prev=S.ui.screen; go("settings"); return; }
  if(act==="close-set"){ const nm=$("#set-nm"); if(nm) S.user.name=nm.value.trim(); save(); clickSnd(); go(S.ui.prev||"sky"); return; }
  if(act==="reset-ask"){
    if(t.dataset.ok){ S=def(); save(); go("splash"); return; }
    t.dataset.ok="1"; t.textContent="Еще раз, чтобы стереть все"; return;
  }
  if(act==="photo"){
    const id=t.dataset.id; const inp=$("#photo");
    inp.onchange=async()=>{ const f=inp.files&&inp.files[0]; if(!f) return; try{ const url=await compressFile(f); const w=S.wishes.find(x=>x.id===id); if(w){ w.photo=url; save(); render(); softSnd(); if(!reduce) burst(); } }catch(e){} inp.value=""; };
    inp.click(); return;
  }
  if(act==="tip"){ t.classList.toggle("open"); return; }
  if(act==="noop"){ return; }
});
document.addEventListener("keydown", ev=>{
  if(ev.key==="Enter" && S.ui.screen==="sky" && S.ui.mode==="collect"){
    const v=$("#wish")&&$("#wish").value; if(v){ ev.preventDefault(); addWish(v); }
  }
});
document.addEventListener("input", ev=>{
  const t=ev.target;
  if(t.dataset.act==="sub") applySub(t.dataset.k, t.value);
});
document.addEventListener("pointerdown", ev=>{
  if(ev.target.closest("[data-hold]")) startHold(ev);
  if(ev.target.closest(".gold, .send, .orb, .declare-btn")) press(ev.target.closest(".gold, .send, .orb, .declare-btn"));
});
document.addEventListener("pointerup", ()=>{ if(holdStart) endHold(); });
document.addEventListener("pointercancel", ()=>{ if(holdStart) endHold(); });
window.addEventListener("blur", ()=>{ if(holdStart) endHold(); });

function boot(){
  if(window.__kartaBoot) return; window.__kartaBoot=true;
  load(); startSky();
  if("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(()=>{});
  S.ui.screen="splash"; render();
}
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
})();
