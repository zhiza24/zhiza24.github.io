/* Небо моих желаний: звездное небо, 8 созвездий, три подтвержденные звезды, затем заветное желание в центре.
   Слои: wishes (исходные), links (связи), insights (наблюдения). В трекер три звезды — только после подтверждения. */
(function(){
'use strict';
var KEY='alch_v5_profile';
var HOLD_MS=2500;
var CONS=[
  {id:'health', wheel:'Здоровье', name:'Здоровье и тело', short:'Здоровье', color:'#78b995',
    q:'Как ты хочешь себя чувствовать? Что хотелось бы изменить в теле, самочувствии или облике?',
    chips:['Больше энергии','Высыпаться','Легкость в теле','Регулярное движение','Спокойный ритм']},
  {id:'money', wheel:'Финансы', name:'Деньги и возможности', short:'Финансы', color:'#d8b657',
    q:'Какой уровень материальной свободы ты хочешь создать? Что приобрести или выстроить?',
    chips:['Свой устойчивый доход','Подушка безопасности','Свобода выбирать работу','Крупная покупка']},
  {id:'career', wheel:'Карьера', name:'Дело и самореализация', short:'Карьера', color:'#77a9d3',
    q:'Какое дело ты хочешь создать или развивать? Чем хотите заниматься?',
    chips:['Свой проект','Новая роль','Дело по душе','Профессиональный шаг']},
  {id:'love', wheel:'Отношения', name:'Любовь и отношения', short:'Отношения', color:'#d48eaa',
    q:'Какие отношения и какую близость ты хочешь переживать?',
    chips:['Теплое партнерство','Честный разговор','Взаимность','Новая встреча']},
  {id:'family', wheel:'Семья', name:'Семья', short:'Семья', color:'#b69bd6',
    q:'Как ты хочешь проводить время с близкими? Какие семейные события хотелось бы пережить?',
    chips:['Больше времени вместе','Общее дело','Семейный праздник','Теплый дом']},
  {id:'friends', wheel:'Друзья', name:'Друзья и окружение', short:'Друзья', color:'#dfab77',
    q:'Какое окружение ты хочешь создать вокруг себя?',
    chips:['Живое общение','Новые знакомства','Свои люди рядом','Круг по интересам']},
  {id:'growth', wheel:'Рост', name:'Знания и развитие', short:'Рост', color:'#79c1bf',
    q:'Чему ты хочешь научиться? Что изучить или развить в себе?',
    chips:['Новый язык','Навык, который зовет','Учеба','Внутренняя ясность']},
  {id:'rest', wheel:'Отдых', name:'Отдых и впечатления', short:'Отдых', color:'#a8bb75',
    q:'Какие впечатления, путешествия или отдых Вы хотите себе подарить?',
    chips:['Путешествие','Тихий отдых','Творчество для себя','Праздник, который ждешь']}
];
var HZ=[
  {id:'now', t:'Сейчас'},
  {id:'year', t:'В течение года'},
  {id:'years', t:'Несколько лет'},
  {id:'someday', t:'Когда-нибудь'}
];
var EXTRA=[
  {re:/путешеств|поездк|итал|стран[аыу]|остров|море/i, id:'rest'},
  {re:/язык|учи[тл]|курс|книг|навык/i, id:'growth'},
  {re:/дом|квартир|сад|дач/i, id:'family'},
  {re:/проект|дело|бизнес|работ/i, id:'career'},
  {re:/деньг|доход|зарплат|купи/i, id:'money'},
  {re:/семь|родител|дети|ребен/i, id:'family'},
  {re:/любов|партнер|отношен/i, id:'love'},
  {re:/здоров|тело|спорт|сон/i, id:'health'}
];

function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(P){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function gx(s){return String(s==null?'':s).replace(/\{([^|]*)\|([^}]*)\}/g,function(_,m,f){return window.GG?GG(m,f):m})}
function uid(){return 'w'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function now(){return Date.now()}
function consOf(id){return CONS.filter(function(c){return c.id===id})[0]||null}
function consIndex(id){for(var i=0;i<CONS.length;i++)if(CONS[i].id===id)return i;return -1}
function hzName(id){var h=HZ.filter(function(x){return x.id===id})[0];return h?h.t:''}

function ensure(P){
  P=P||load();
  P.wishMod=P.wishMod||{};
  var W=P.wishMod;
  if(W.v!==2){
    if(Array.isArray(W.wishes)&&W.wishes.length){
      W.wishes.forEach(function(w){if(!w.cid)w.cid='legacy'; if(!w.raw)w.raw=w.text||w.form||''});
    }
    W.v=2;
  }
  if(!Array.isArray(W.wishes))W.wishes=[];
  if(!W.links||typeof W.links!=='object')W.links={};
  if(!Array.isArray(W.insights))W.insights=[];
  if(!Array.isArray(W.pick))W.pick=[];
  var ok=['invite','sky','compare','pick3','center','accepted','map'];
  if(ok.indexOf(W.scene)<0){
    if(P.tracker&&P.tracker.declared&&Array.isArray(P.tracker.directions)&&P.tracker.directions.length===3)W.scene='map';
    else if(W.confirmed&&W.confirmed.length===3)W.scene='center';
    else W.scene='invite';
  }
  if(!W.scene)W.scene='invite';
  P.tracker=P.tracker||{};
  return P;
}

function liveWishes(P){return (P.wishMod.wishes||[]).filter(function(w){return w&&(w.text||w.raw)&&!w.archived})}
function wishById(P,id){return (P.wishMod.wishes||[]).filter(function(w){return w.id===id})[0]||null}
function labelOf(w){return (w&&(w.text||w.form||w.raw))||''}

function autoLinks(w){
  var set={}; if(w.cid&&w.cid!=='legacy')set[w.cid]=1;
  var t=labelOf(w);
  EXTRA.forEach(function(x){if(x.re.test(t)&&x.id!==w.cid)set[x.id]=1});
  return Object.keys(set);
}
function linksOf(P,w){
  var L=(P.wishMod.links&&P.wishMod.links[w.id])||w.spheres||autoLinks(w);
  if(!L.length)L=autoLinks(w);
  return L;
}
function refreshLinks(P,w){
  P.wishMod.links=P.wishMod.links||{};
  P.wishMod.links[w.id]=autoLinks(w);
  return P.wishMod.links[w.id];
}

function wheelInfo(P){
  var names=['Здоровье','Финансы','Карьера','Отношения','Семья','Друзья','Рост','Отдых'];
  var scores=null;
  if(Array.isArray(P.wheel)&&P.wheel.length===8)scores=P.wheel.map(function(x){return +x});
  return CONS.map(function(c,i){
    var sc=scores?scores[i]:null, want=false, urgent=false;
    var WT=P.wheelTest;
    if(WT&&Array.isArray(WT.spheres)){
      var s=WT.spheres.filter(function(x){return x.name===c.wheel||x.name===names[i]})[0];
      if(s&&Array.isArray(s.improvements)){
        s.improvements.forEach(function(im){
          if(im&&im.change==='yes'){want=true; if(im.urgency==='soon'||im.urgency==='now'||im.strength>=7)urgent=true}
        });
      }
      if(s&&s.average!=null&&scores==null)sc=+s.average;
    }
    var low=sc!=null&&sc<=4;
    return {id:c.id, wheel:c.wheel, name:c.name, score:sc, low:low, want:want||low, urgent:urgent, unsatisfied:want||low};
  });
}

function writeDeclared(P){
  var b=P.wishMod.big; if(!b||!(b.text||b.raw))return;
  P.tracker=P.tracker||{};
  P.tracker.declared={id:b.id||'big', text:b.text||b.raw, raw:b.raw||b.text, at:b.at||now(), scheme:'big'};
  P.log=P.log||[];
  P.log.push({t:now(),x:'Главное желание: '+(b.text||b.raw)});
  save(P);
}
function writeDirections(P){
  var ids=P.wishMod.confirmed||P.wishMod.pick||[];
  var list=ids.map(function(id){
    var w=wishById(P,id); if(!w)return null;
    return {id:w.id, text:labelOf(w), cid:w.cid||null, horizon:w.horizon||null};
  }).filter(Boolean);
  P.tracker=P.tracker||{};
  P.tracker.directions=list;
  P.tracker.directionsAt=now();
  if(!P.tracker.start)P.tracker.start=now();
  P.log=P.log||[];
  P.log.push({t:now(),x:'Три звезды ближайшего пути: '+list.map(function(x){return x.text}).join('; ')});
  save(P);
}

function priorityScore(P,w){
  var info=wheelInfo(P), links=linksOf(P,w), s=0;
  links.forEach(function(id){
    var g=info.filter(function(x){return x.id===id})[0];
    if(g&&g.unsatisfied)s+=3;
    if(g&&g.urgent)s+=1;
    if(g&&g.low)s+=1;
  });
  if(w.important)s+=3;
  if(w.horizon==='now')s+=2;
  else if(w.horizon==='year')s+=1;
  if(w.done)s-=8;
  return s;
}
function ranked(P){
  return liveWishes(P).filter(function(w){return !w.done}).slice().sort(function(a,b){
    return priorityScore(P,b)-priorityScore(P,a)||(b.at||0)-(a.at||0);
  });
}
function buildInsights(P){
  var notes=[], info=wheelInfo(P), wishes=liveWishes(P);
  var unsat=info.filter(function(x){return x.unsatisfied});
  var withMatch=wishes.filter(function(w){return linksOf(P,w).some(function(id){return unsat.some(function(u){return u.id===id})})});
  if(withMatch.length) notes.push({k:'match', t:'Есть желания, связанные со сферами, в которых сейчас ощущается неудовлетворенность: '+withMatch.slice(0,4).map(labelOf).join(', ')+'.'});
  var empty=unsat.filter(function(u){return !wishes.some(function(w){return linksOf(P,w).indexOf(u.id)>=0})});
  if(empty.length) notes.push({k:'gap', t:'В сфере «'+empty.map(function(x){return x.wheel}).join('», «')+'» оценка невысока, а звезд пока нет. Это наблюдение, не задача.'});
  var multi=wishes.filter(function(w){return linksOf(P,w).length>1});
  if(multi.length) notes.push({k:'multi', t:'Некоторые желания связаны сразу с несколькими сферами: '+multi.slice(0,3).map(function(w){return '«'+labelOf(w)+'»'}).join(', ')+'.'});
  var L=P.desireLab;
  if(L&&(L.desire||L.top)){
    notes.push({k:'lab', t:gx('В Лабиринте желаний ты уже исследовал(а) тему «'+(L.desire||L.top)+'». Это наблюдение, а не вывод о мотивах.')});
    var hy=(L.mechs||[]).filter(function(m){return m&&m.score!=null&&m.score>=2});
    if(hy.length) notes.push({k:'labm', t:'Там же проявились возможные функции привычного положения: '+hy.map(function(m){return m.name}).join(', ')+'. Это гипотеза для исследования, не диагноз.'});
  }
  P.wishMod.insights=notes;
  return notes;
}

var app=document.getElementById('wapp');
var sky=document.getElementById('wsky');
var starsLayer=null;
var linesEl=null;

function setScene(name){var P=ensure();P.wishMod.scene=name;save(P);render()}
function starSvg(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.2l3.4 8.6 9.2.8-7 6.2 2.2 9-7.8-4.6-7.8 4.6 2.2-9-7-6.2 9.2-.8z"/></svg>'}
function clearStars(){
  if(starsLayer){starsLayer.remove();starsLayer=null}
  if(linesEl){linesEl.remove();linesEl=null}
}

function ringCenter(){
  return {
    x:innerWidth/2,
    y:Math.min(innerHeight*0.28, 200)
  };
}
function constPos(i){
  var a=i*Math.PI/4-Math.PI/2+Math.PI/8;
  var c=ringCenter();
  var rx=Math.min(innerWidth*0.34, 128), ry=Math.min(innerHeight*0.13, 88);
  return {x:c.x+Math.cos(a)*rx, y:c.y+Math.sin(a)*ry, a:a};
}
function placeInConst(w, k, n, cid){
  var i=consIndex(cid);
  if(i<0){var c=ringCenter(); w.x=c.x; w.y=c.y+40+k*16; return}
  var p=constPos(i);
  var ang=p.a+(k-(Math.max(n,1)-1)/2)*0.5;
  var r=14+(k%3)*9;
  w.x=p.x+Math.cos(ang)*r;
  w.y=p.y+Math.sin(ang)*r-6;
  w.x=Math.max(28,Math.min(innerWidth-28,w.x));
  w.y=Math.max(96,Math.min(innerHeight*0.62,w.y));
}

function drawLines(P, wishes){
  if(linesEl)linesEl.remove();
  linesEl=document.createElementNS('http://www.w3.org/2000/svg','svg');
  linesEl.id='wlines';
  linesEl.setAttribute('width',innerWidth);
  linesEl.setAttribute('height',innerHeight);
  linesEl.style.cssText='position:fixed;inset:0;z-index:1;pointer-events:none';
  document.body.appendChild(linesEl);
  CONS.forEach(function(c){
    var pts=wishes.filter(function(w){return w.cid===c.id&&!w.done&&w.x});
    if(pts.length<2)return;
    pts=pts.slice().sort(function(a,b){return a.x-b.x||a.y-b.y});
    var d=pts.map(function(p,i){return (i?'L':'M')+p.x+' '+p.y}).join(' ');
    if(pts.length>=3)d+=' Z';
    var path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',d);
    path.setAttribute('fill',pts.length>=3?'rgba(240,200,112,.05)':'none');
    path.setAttribute('stroke',c.color||'#f0c870');
    path.setAttribute('stroke-opacity','0.55');
    path.setAttribute('stroke-width','1');
    path.setAttribute('stroke-linejoin','round');
    linesEl.appendChild(path);
  });
}

function drawStars(opts){
  opts=opts||{};
  if(starsLayer)starsLayer.remove();
  starsLayer=document.createElement('div');
  starsLayer.id='wstars';
  if(opts.viewonly)starsLayer.className='viewonly';
  document.body.appendChild(starsLayer);
  var P=ensure(), W=liveWishes(P), hide=opts.hideCaps, focus=opts.focus, dimOthers=opts.dim;
  var byC={};
  W.forEach(function(w){var k=w.cid||'legacy';(byC[k]=byC[k]||[]).push(w)});
  Object.keys(byC).forEach(function(cid){
    byC[cid].forEach(function(w,k){placeInConst(w,k,byC[cid].length,cid)});
  });
  var glow=opts.glow||{};
  var pick=opts.pick||[];
  var born=P.wishMod.lastBorn;
  W.forEach(function(w){
    if(opts.minY&&w.y<opts.minY)return;
    var b=document.createElement('button');
    b.type='button';
    var cls='star';
    if(w.important)cls+=' gold';
    if(focus&&w.id===focus)cls+=' front';
    if(dimOthers&&w.id!==focus&&pick.indexOf(w.id)<0)cls+=' dim';
    if(opts.faint&&pick.indexOf(w.id)<0&&w.id!==focus)cls+=' faint';
    if(glow[w.id]||pick.indexOf(w.id)>=0)cls+=' glow pick';
    if(born&&w.id===born)cls+=' born';
    if(w.done)cls+=' dim';
    b.className=cls;
    b.style.left=w.x+'px'; b.style.top=w.y+'px';
    var cap=esc(labelOf(w).slice(0,28));
    var side=w.x<70?'right':(w.x>innerWidth-70?'left':'center');
    b.innerHTML=starSvg()+(hide?'':'<span class="cap cap-'+side+'">'+cap+'</span>');
    b.onclick=function(){if(opts.onStar)opts.onStar(w)};
    starsLayer.appendChild(b);
  });
  drawLines(P,W);
  if(born)setTimeout(function(){P=ensure(); if(P.wishMod.lastBorn===born){P.wishMod.lastBorn=null;save(P)}},800);
}

function drawConstHits(P, onTap){
  CONS.forEach(function(c,i){
    var p=constPos(i);
    var n=liveWishes(P).filter(function(w){return w.cid===c.id&&!w.done}).length;
    var hit=document.createElement('button');
    hit.type='button';
    hit.className='chit'+(n?' has':'')+(P.wishMod.openCid===c.id?' open':'');
    hit.style.left=p.x+'px'; hit.style.top=p.y+'px';
    hit.style.setProperty('--cc',c.color);
    hit.innerHTML='<span class="spark"></span>';
    hit.setAttribute('aria-label',c.short);
    hit.onclick=function(){if(onTap)onTap(c)};
    starsLayer.appendChild(hit);
    if(!n){
      var lab=document.createElement('div');
      lab.className='clab';
      var out=12;
      lab.style.left=(p.x+Math.cos(p.a)*out)+'px';
      lab.style.top=(p.y+Math.sin(p.a)*out+14)+'px';
      lab.textContent=c.short;
      starsLayer.appendChild(lab);
    }
  });
}

function drawSky(){
  if(!sky)return;
  var c=sky.getContext('2d');
  var w=sky.width=innerWidth,h=sky.height=innerHeight;
  c.fillStyle='#0c0804';c.fillRect(0,0,w,h);
  var g=c.createRadialGradient(w*.5,h*.32,8,w*.5,h*.5,h*.85);
  g.addColorStop(0,'rgba(80,50,16,.4)');g.addColorStop(1,'rgba(12,8,4,0)');
  c.fillStyle=g;c.fillRect(0,0,w,h);
  var seed=17;
  function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}
  for(var i=0;i<90;i++){
    c.globalAlpha=.15+rnd()*.4;
    c.fillStyle='#f0c870';
    c.beginPath();c.arc(rnd()*w,rnd()*h,rnd()*1.2+.2,0,Math.PI*2);c.fill();
  }
  /* faint decorative sparks at constellation seats */
  CONS.forEach(function(cons,i){
    var p=constPos(i);
    for(var k=0;k<4;k++){
      var ang=consPosAngle(i)+k*0.8, r=8+k*5;
      c.globalAlpha=.18;
      c.fillStyle=cons.color;
      c.beginPath();c.arc(p.x+Math.cos(ang)*r, p.y+Math.sin(ang)*r, 1.1,0,Math.PI*2);c.fill();
    }
  });
  c.globalAlpha=1;
}
function consPosAngle(i){return i*Math.PI/4-Math.PI/2+Math.PI/8}

function shell(html,cls){
  app.innerHTML='<div class="wsc '+(cls||'')+'">'+html+'</div>';
}

function bindHold(el,done){
  var t0=0,raf=0,fill=el.querySelector('.declare-fill');
  function p(v){if(fill)fill.style.setProperty('--p',Math.max(0,Math.min(100,v)))}
  function stop(){t0=0;el.classList.remove('holding');if(raf)cancelAnimationFrame(raf);p(0)}
  function tick(){if(!t0)return;var k=(performance.now()-t0)/HOLD_MS;p(k*100);if(k>=1){stop();done();return}raf=requestAnimationFrame(tick)}
  function start(e){e.preventDefault();t0=performance.now();el.classList.add('holding');tick()}
  el.addEventListener('pointerdown',start);
  el.addEventListener('pointerup',stop);
  el.addEventListener('pointerleave',stop);
  el.addEventListener('pointercancel',stop);
}

function openWishCard(id){
  var P=ensure(), w=wishById(P,id); if(!w)return;
  var overlay=document.createElement('div'); overlay.className='wpop';
  overlay.innerHTML='<div class="panel wpop-in">'+
    '<b>'+esc(labelOf(w))+'</b>'+
    '<p class="mute">'+esc((consOf(w.cid)||{}).name||'Желание')+'</p>'+
    '<p class="mute">Горизонт</p>'+
    '<div class="chips" id="phz">'+HZ.map(function(h){return '<button type="button" class="chip'+(w.horizon===h.id?' on':'')+'" data-h="'+h.id+'">'+esc(h.t)+'</button>'}).join('')+'</div>'+
    '<label class="imp"><input type="checkbox" id="pimp"'+(w.important?' checked':'')+'> Это для меня важно</label>'+
    '<label class="imp"><input type="checkbox" id="pdone"'+(w.done?' checked':'')+'> Уже сбылось</label>'+
    '<button class="go" id="psave">Сохранить</button>'+
    '<button type="button" class="quiet" id="pclose">Закрыть</button>'+
    '</div>';
  document.body.appendChild(overlay);
  function close(){overlay.remove()}
  document.getElementById('pclose').onclick=close;
  overlay.addEventListener('click',function(e){if(e.target===overlay)close()});
  document.getElementById('psave').onclick=function(){
    P=ensure(); w=wishById(P,id); if(!w)return;
    var on=document.querySelector('#phz .chip.on'); if(on)w.horizon=on.getAttribute('data-h');
    w.important=!!document.getElementById('pimp').checked;
    w.done=!!document.getElementById('pdone').checked;
    save(P); close(); render();
  };
  document.querySelectorAll('#phz .chip').forEach(function(b){
    b.onclick=function(){document.querySelectorAll('#phz .chip').forEach(function(x){x.classList.toggle('on',x===b)})};
  });
}

/* ---------- экраны ---------- */
function inviteView(){
  clearStars();
  shell(
    '<div class="kicker">Точка Б</div>'+
    '<h2>Небо моих желаний</h2>'+
    '<p class="line mute">'+gx('Сначала зажги звезды в восьми созвездиях — областях жизни, которые ты уже {видел|видела} на колесе. Потом выберешь три звезды на 28 дней. В самом конце загадаешь самое заветное желание — оно зажжется в центре неба.')+'</p>'+
    '<button class="go" id="goSky">Открыть небо</button>'
  );
  document.getElementById('goSky').onclick=function(){setScene('sky')};
}

function skyView(){
  var P=ensure();
  var n=liveWishes(P).filter(function(w){return w.cid&&w.cid!=='legacy'&&!w.done}).length;
  var open=consOf(P.wishMod.openCid);
  drawStars({onStar:function(w){openWishCard(w.id)}});
  drawConstHits(P,function(c){
    P=ensure();P.wishMod.openCid=c.id;save(P);skyView();
  });
  var hint=open?open.q:(n?'Небо уже живет. Можешь добавить еще или идти дальше.':'Нажми на созвездие и зажги в нем звезду.');
  var chips=open?('<div class="chips sky-chips" id="chips">'+open.chips.map(function(t){return '<button type="button" class="chip" data-t="'+esc(t)+'">'+esc(t)+'</button>'}).join('')+'</div>'):'';
  shell(
    (n?'<div class="counter">'+n+'</div>':'')+
    '<p class="hint'+(open?' sm':'')+'">'+esc(hint)+'</p>'+
    '<div class="dock">'+
      chips+
      '<div class="composer">'+
        '<label for="wishIn">Я хочу...</label><div class="row"><input id="wishIn" maxlength="160" placeholder="'+(open?'напиши желание':'сначала нажми созвездие')+'" autocomplete="off"'+(open?'':' disabled')+'><button class="send" id="addWish" aria-label="Добавить">✦</button></div>'+
      '</div>'+
      (n>=1?'<button class="go" id="goNext">'+(n>=3?'Дальше':'Этого пока достаточно')+'</button>':'')+
    '</div>',
    'sky-sc'
  );
  /* тап по пустому небу закрывает панель созвездия */
  var sc=app.querySelector('.wsc');
  if(sc)sc.addEventListener('click',function(e){
    if(e.target!==sc && !(e.target.classList&&e.target.classList.contains('hint')))return;
    P=ensure(); if(P.wishMod.openCid){P.wishMod.openCid=null;save(P);skyView()}
  });
  if(open){
    var inp=document.getElementById('wishIn');
    function add(){
      var t=(inp.value||'').trim(); if(!t)return;
      P=ensure();
      var w={id:uid(), text:t, raw:t, cid:open.id, horizon:'now', important:false, done:false, at:now()};
      P.wishMod.wishes.push(w);
      P.wishMod.lastBorn=w.id;
      refreshLinks(P,w);
      save(P); skyView();
    }
    document.getElementById('addWish').onclick=add;
    inp.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();add()}};
    document.querySelectorAll('#chips .chip').forEach(function(b){
      b.onclick=function(){
        inp.value=b.getAttribute('data-t'); inp.focus();
        document.querySelectorAll('#chips .chip').forEach(function(x){x.classList.toggle('on',x===b)});
      };
    });
    setTimeout(function(){try{inp.focus()}catch(e){}},200);
  }
  var nx=document.getElementById('goNext');
  if(nx)nx.onclick=function(){setScene('compare')};
  window.gBack=function(){return false};
}

function compareView(){
  var P=ensure();
  var notes=buildInsights(P); save(P);
  var info=wheelInfo(P), wishes=liveWishes(P);
  var glow={};
  wishes.forEach(function(w){
    if(linksOf(P,w).some(function(id){var g=info.filter(function(x){return x.id===id})[0];return g&&g.unsatisfied}))glow[w.id]=1;
  });
  drawStars({glow:glow, onStar:function(w){openWishCard(w.id)}});
  var rows='';
  CONS.forEach(function(c){
    var list=wishes.filter(function(w){return w.cid===c.id&&!w.done});
    var g=info.filter(function(x){return x.id===c.id})[0]||{};
    rows+='<tr class="'+(g.unsatisfied?'unsat':'')+'"><th>'+esc(c.short)+(g.score!=null?'<small>'+g.score+'</small>':'')+'</th><td>';
    if(!list.length) rows+='<span class="mute">'+(g.unsatisfied?'Звезд пока нет':'—')+'</span>';
    else rows+=list.map(function(w){return '<div class="td-w">'+esc(labelOf(w))+'</div>'}).join('');
    rows+='</td></tr>';
  });
  var obs=notes.map(function(n){return '<p class="obs">'+esc(n.t)+'</p>'}).join('');
  shell(
    '<p class="kicker">Сопоставление</p>'+
    '<h2>Вот что у тебя есть</h2>'+
    '<div class="glass">'+
      '<div class="sky-table-wrap"><table class="sky-table">'+rows+'</table></div>'+
      (obs?'<div class="obs-box">'+obs+'</div>':'')+
      '<button class="go" id="go3">Выбрать три звезды</button>'+
      '<button type="button" class="quiet" id="backSky">К небу</button>'+
    '</div>'
  );
  document.getElementById('go3').onclick=function(){setScene('pick3')};
  document.getElementById('backSky').onclick=function(){setScene('sky')};
  window.gBack=function(){setScene('sky');return true};
}

function pick3View(){
  var P=ensure();
  var list=ranked(P);
  if(list.length<3){
    drawStars({onStar:function(w){openWishCard(w.id)}});
    shell(
      '<p class="hint">Чтобы выбрать три желания, зажги еще звезды. Сейчас их '+list.length+'.</p>'+
      '<button class="go" id="goSky">К небу</button>'
    );
    document.getElementById('goSky').onclick=function(){setScene('sky')};
    window.gBack=function(){setScene('compare');return true};
    return;
  }
  var pick=P.wishMod.pick&&P.wishMod.pick.length===3?P.wishMod.pick.slice():list.slice(0,3).map(function(w){return w.id});
  P.wishMod.pick=pick; save(P);
  function paint(){
    drawStars({
      pick:pick,
      dim:true,
      onStar:function(w){
        var i=pick.indexOf(w.id);
        if(i>=0)pick.splice(i,1);
        else if(pick.length<3)pick.push(w.id);
        P=ensure();P.wishMod.pick=pick.slice();save(P);
        paint(); sync();
      }
    });
  }
  var rows=list.map(function(w,i){
    var on=pick.indexOf(w.id)>=0;
    var hint=[];
    if(i<3)hint.push('подсказка');
    if(w.important)hint.push('важно');
    if(w.horizon==='now')hint.push('сейчас');
    return '<button type="button" class="pick-row'+(on?' on':'')+'" data-id="'+w.id+'">'+
      '<span class="tick"></span><span class="ptx"><b>'+esc(labelOf(w))+'</b>'+
      '<small>'+esc((consOf(w.cid)||{}).short||'')+(hint.length?' · '+hint.join(' · '):'')+'</small></span></button>';
  }).join('');
  shell(
    '<p class="kicker">Три звезды моего ближайшего пути</p>'+
    '<p class="hint">Выбери три желания на 28 дней</p>'+
    '<div class="glass">'+
      '<p class="mute">Верхние три отмечены как подсказка: совпадение с неудовлетворенными сферами, важность и горизонт «Сейчас». Можно нажать на звезду в небе или на строку. Главное желание в эти три само не входит.</p>'+
      '<div class="plist">'+rows+'</div>'+
      '<p class="mute" id="pcnt">Выбрано: '+pick.length+' из 3</p>'+
      '<button class="go" id="goYes"'+(pick.length===3?'':' disabled')+'>Да, работаю над этим</button>'+
      '<button type="button" class="quiet" id="backCmp">К таблице</button>'+
    '</div>'
  );
  function sync(){
    document.querySelectorAll('.pick-row').forEach(function(b){b.classList.toggle('on',pick.indexOf(b.getAttribute('data-id'))>=0)});
    var c=document.getElementById('pcnt'); if(c)c.textContent='Выбрано: '+pick.length+' из 3';
    var y=document.getElementById('goYes'); if(y)y.disabled=pick.length!==3;
  }
  paint();
  document.querySelectorAll('.pick-row').forEach(function(b){
    b.onclick=function(){
      var id=b.getAttribute('data-id'), i=pick.indexOf(id);
      if(i>=0)pick.splice(i,1);
      else if(pick.length<3)pick.push(id);
      P=ensure();P.wishMod.pick=pick.slice();save(P);paint();sync();
    };
  });
  document.getElementById('backCmp').onclick=function(){setScene('compare')};
  document.getElementById('goYes').onclick=function(){
    if(pick.length!==3)return;
    P=ensure();
    P.wishMod.pick=pick.slice();
    P.wishMod.confirmed=pick.slice();
    P.wishMod.confirmedAt=now();
    writeDirections(P);
    setScene('center');
  };
  window.gBack=function(){setScene('compare');return true};
}

function centerView(){
  var P=ensure();
  var lit=!!(P.wishMod.big&&(P.wishMod.big.text||P.wishMod.big.raw));
  var txt=lit?(P.wishMod.big.text||P.wishMod.big.raw):'';
  if(lit)clearStars(); else drawStars({faint:true, hideCaps:true, dim:true, pick:(P.wishMod.confirmed||[])});
  var starBtn=lit
    ?('<p class="mute">Удерживай звезду в центре, пока круг не заполнится. Это заявка.</p><div class="declare-wrap"><button class="declare-btn" id="holdBtn" type="button"><span class="declare-fill"></span><span class="lbl">Заветное<small>удерживай</small></span></button></div>')
    :'';
  shell(
    '<p class="hint">А теперь загадай самое заветное желание</p>'+
    (lit?'<p class="wish-echo">«'+esc(txt)+'»</p>':'<p class="line mute">Напиши его внизу — и в центре неба зажжется большая звезда.</p>')+
    starBtn+
    (lit?'':'<div class="composer"><label for="btx">Я хочу...</label><div class="row"><input id="btx" maxlength="240" placeholder="самое заветное желание" autocomplete="off"><button class="send" id="ignite" aria-label="Зажечь">✦</button></div></div>')
  );
  if(!lit){
    var inp=document.getElementById('btx');inp.value=P.wishMod.bigDraft||'';
    inp.oninput=function(){P=ensure();P.wishMod.bigDraft=inp.value;save(P)};
    function ignite(){
      var t=(inp.value||'').trim(); if(!t){inp.focus();return}
      P=ensure();
      P.wishMod.big={id:P.wishMod.big&&P.wishMod.big.id||uid(), text:t, raw:(P.wishMod.big&&P.wishMod.big.raw)||t, at:now()};delete P.wishMod.bigDraft;
      save(P); centerView();
    }
    document.getElementById('ignite').onclick=ignite;
    inp.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();ignite()}};
    setTimeout(function(){try{inp.focus()}catch(e){}},200);
  }else{
    var hold=document.getElementById('holdBtn');
    bindHold(hold,function(){
      P=ensure();
      writeDeclared(P);
      var chg=false;try{chg=sessionStorage.getItem('alch_v5_wishChange')==='1';sessionStorage.removeItem('alch_v5_wishChange')}catch(e){}
      if(chg){save(P);location.href='slot.html?id=wish_back';return}
      setScene('accepted');
    });
  }
  window.gBack=function(){setScene('pick3');return true};
}

function acceptedView(){
  var P=ensure(), t=(P.wishMod.big&&(P.wishMod.big.text||P.wishMod.big.raw))||'';
  drawStars({faint:true, dim:true, pick:(P.wishMod.confirmed||[])});
  shell(
    '<p class="kicker">Принято</p>'+
    '<h2>Твое желание принято</h2>'+
    '<p class="line">Твой запрос принят.</p>'+
    '<p class="line mute">Следуй импульсам души и наблюдай, как желание проявляется.</p>'+
    (t?'<div class="track-note">Заветное желание записано отдельной строкой:<br><b>'+esc(t)+'</b></div>':'')+
    '<button class="go" id="nx">Дальше</button>'+
    '<button type="button" class="quiet" id="stay">Остаться в небе</button>',
    'ctr'
  );
  var nx=document.getElementById('nx');
  if(window.GQuote)try{GQuote.add(app.querySelector('.wsc')||app,'wish.html',nx)}catch(e){}
  if(window.GSupport)try{GSupport.after(app.querySelector('.wsc')||app,'step',nx)}catch(e){}
  nx.onclick=function(){
    P=ensure();P.wishMod.scene='map';save(P);
    if(window.GReview){location.href='tasks.html';return}
    if(window.GRoute){
      if(!GRoute.complete('wish.html'))GRoute.complete();
      location.href=GRoute.advance();
      return;
    }
    location.href='reactor.html';
  };
  document.getElementById('stay').onclick=function(){var P2=ensure();P2.wishMod.scene='map';save(P2);setScene('map')};
  window.gBack=function(){return false};
}

function mapView(){
  var P=ensure();
  var dirs=(P.tracker&&P.tracker.directions)||[];
  var big=P.wishMod.big||(P.tracker&&P.tracker.declared);
  drawStars({onStar:function(w){openWishCard(w.id)}, pick:(P.wishMod.confirmed||dirs.map(function(d){return d.id}))});
  drawConstHits(P,function(c){
    P=ensure();P.wishMod.openCid=c.id;save(P);setScene('sky');
  });
  var mid=ringCenter();
  if(big&&(big.text||big.raw)){
    var b=document.createElement('button');
    b.type='button'; b.className='star gold front'; b.id='mapBig';
    b.style.left=mid.x+'px'; b.style.top=mid.y+'px';
    b.innerHTML=starSvg()+'<span class="cap cap-center">'+esc((big.text||big.raw).slice(0,28))+'</span>';
    b.onclick=function(){setScene('center')};
    if(starsLayer)starsLayer.appendChild(b);
  }
  shell(
    (big&&(big.text||big.raw)?'<p class="wish-echo">«'+esc(big.text||big.raw)+'»</p>':'')+
    '<div class="composer">'+
      (dirs.length?'<p class="mute">Три звезды: '+dirs.map(function(d){return esc(d.text||d)}).join(' · ')+'</p>':'')+
      '<button class="go" id="go3">Выбрать следующие три</button>'+
      '<button type="button" class="quiet" id="goC">Заветное желание</button>'+
    '</div>',
    'sky-sc'
  );
  document.getElementById('go3').onclick=function(){setScene('pick3')};
  document.getElementById('goC').onclick=function(){setScene('center')};
  window.gBack=function(){return false};
}

var VIEWS={
  invite:inviteView, sky:skyView, compare:compareView, pick3:pick3View,
  center:centerView, accepted:acceptedView, map:mapView
};

function render(){
  var P=ensure();
  (VIEWS[P.wishMod.scene]||inviteView)();
}

var q=new URLSearchParams(location.search);
if(q.get('change')==='1'){
  try{sessionStorage.setItem('alch_v5_wishChange','1')}catch(e){}
  var P0=ensure(),oldBig=P0.wishMod.big||{};P0.wishMod.bigDraft=oldBig.text||oldBig.raw||P0.wishMod.bigDraft||'';delete P0.wishMod.big;P0.wishMod.scene='center';save(P0);
  history.replaceState(null,'','wish.html'+(q.get('u')?'?u='+encodeURIComponent(q.get('u')):''));
}
if(q.get('pick')==='1'){
  var P1=ensure();P1.wishMod.scene='pick3';save(P1);
}

drawSky();
window.addEventListener('resize',function(){drawSky();var P=ensure();if(['sky','map','center','compare','pick3','accepted'].indexOf(P.wishMod.scene)>=0)render()});
render();
})();
