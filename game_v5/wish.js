/* Небо моих желаний: 8 созвездий по сферам колеса, центральная звезда, три подтвержденных желания для трекера.
   Слои данных в alch_v5_profile.wishMod: wishes (исходные), links (связи), insights (наблюдения).
   В трекер желания попадают только после «Да, работаю над этим». */
(function(){
'use strict';
var KEY='alch_v5_profile';
var CONS=[
  {id:'health', wheel:'Здоровье', name:'Здоровье и тело', color:'#78b995',
    q:'Как ты хочешь себя чувствовать? Что изменить в теле, самочувствии или облике?',
    chips:['Больше энергии','Высыпаться','Легкость в теле','Регулярное движение','Спокойный ритм']},
  {id:'money', wheel:'Финансы', name:'Деньги и возможности', color:'#d8b657',
    q:'Какой уровень материальной свободы ты хочешь создать? Что приобрести или выстроить?',
    chips:['Свой устойчивый доход','Подушка безопасности','Свобода выбирать работу','Крупная покупка']},
  {id:'career', wheel:'Карьера', name:'Дело и самореализация', color:'#77a9d3',
    q:'Какое дело ты хочешь создать или развивать? Чем хочешь заниматься?',
    chips:['Свой проект','Новая роль','Дело по душе','Профессиональный шаг']},
  {id:'love', wheel:'Отношения', name:'Любовь и отношения', color:'#d48eaa',
    q:'Какие отношения и какую близость ты хочешь переживать?',
    chips:['Теплое партнерство','Честный разговор','Взаимность','Новая встреча']},
  {id:'family', wheel:'Семья', name:'Семья', color:'#b69bd6',
    q:'Как ты хочешь проводить время с близкими? Какие семейные события пережить?',
    chips:['Больше времени вместе','Общее дело','Семейный праздник','Теплый дом']},
  {id:'friends', wheel:'Друзья', name:'Друзья и окружение', color:'#dfab77',
    q:'Каким окружением ты хочешь себя наполнить?',
    chips:['Живое общение','Новые знакомства','Свои люди рядом','Круг по интересам']},
  {id:'growth', wheel:'Рост', name:'Знания и развитие', color:'#79c1bf',
    q:'Чему ты хочешь научиться? Что изучить или в себе вырастить?',
    chips:['Новый язык','Навык, который зовет','Учеба','Внутренняя ясность']},
  {id:'rest', wheel:'Отдых', name:'Отдых и впечатления', color:'#a8bb75',
    q:'Какие впечатления, путешествия или отдых ты хочешь себе подарить?',
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
    var ok=['invite','sky','const','center','accepted','compare','pick3','map'];
    if(ok.indexOf(W.scene)<0){
      W.scene=(P.tracker&&P.tracker.declared&&Array.isArray(P.tracker.directions)&&P.tracker.directions.length===3)?'map':'invite';
    }
  }
  if(!Array.isArray(W.wishes))W.wishes=[];
  if(!W.links||typeof W.links!=='object')W.links={};
  if(!Array.isArray(W.insights))W.insights=[];
  if(!Array.isArray(W.pick))W.pick=[];
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

/* Колесо: оценки 0–10 и желание улучшить из фактической картины */
function wheelInfo(P){
  var names=['Здоровье','Финансы','Карьера','Отношения','Семья','Друзья','Рост','Отдых'];
  var scores=null;
  if(Array.isArray(P.wheel)&&P.wheel.length===8)scores=P.wheel.map(function(x){return +x});
  var out=CONS.map(function(c,i){
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
  return out;
}

function writeDeclared(P){
  var b=P.wishMod.big; if(!b||!(b.text||b.raw))return;
  P.tracker=P.tracker||{};
  P.tracker.declared={
    id:b.id||'big',
    text:b.text||b.raw,
    raw:b.raw||b.text,
    at:b.at||now(),
    scheme:'big'
  };
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

var app=document.getElementById('wapp');
var sky=document.getElementById('wsky');
var starsLayer=null;

function setScene(name){var P=ensure();P.wishMod.scene=name;save(P);render()}
function starSvg(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2.2l3.4 8.6 9.2.8-7 6.2 2.2 9-7.8-4.6-7.8 4.6 2.2-9-7-6.2 9.2-.8z"/></svg>'}
function clearStars(){if(starsLayer){starsLayer.remove();starsLayer=null}}

function drawSky(){
  if(!sky)return;
  var c=sky.getContext('2d');
  var w=sky.width=innerWidth,h=sky.height=innerHeight;
  c.fillStyle='#0c0804';c.fillRect(0,0,w,h);
  var g=c.createRadialGradient(w*.5,h*.42,8,w*.5,h*.5,h*.85);
  g.addColorStop(0,'rgba(80,50,16,.4)');g.addColorStop(1,'rgba(12,8,4,0)');
  c.fillStyle=g;c.fillRect(0,0,w,h);
  for(var i=0;i<90;i++){
    c.globalAlpha=.15+Math.random()*.4;
    c.fillStyle='#f0c870';
    c.beginPath();c.arc(Math.random()*w,Math.random()*h,Math.random()*1.2+.2,0,Math.PI*2);c.fill();
  }
  c.globalAlpha=1;
}
function shell(html,cls){
  app.innerHTML='<div class="wsc '+(cls||'')+'">'+html+'</div>';
}

function cx(){return innerWidth/2}
function cy(){return Math.min(innerHeight*0.34, 220)+8}
function constPos(i){
  var a=i*Math.PI/4-Math.PI/2;
  var rx=Math.min(innerWidth*0.38, 148), ry=Math.min(innerHeight*0.18, 118);
  return {x:cx()+Math.cos(a)*rx, y:cy()+Math.sin(a)*ry};
}

/* ---------- приоритет для трех звезд ---------- */
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
  if(withMatch.length) notes.push({k:'match', t:'Есть желания, которые совпадают с сферами, где тебе сейчас тесно: '+withMatch.slice(0,4).map(labelOf).join(', ')+'.'});
  var empty=unsat.filter(function(u){return !wishes.some(function(w){return linksOf(P,w).indexOf(u.id)>=0})});
  if(empty.length) notes.push({k:'gap', t:'В сфере «'+empty.map(function(x){return x.wheel}).join('», «')+'» оценка невысока, а звезд пока нет. Это наблюдение, не задача.'});
  var multi=wishes.filter(function(w){return linksOf(P,w).length>1});
  if(multi.length) notes.push({k:'multi', t:'Некоторые желания связаны сразу с несколькими сферами: '+multi.slice(0,3).map(function(w){return '«'+labelOf(w)+'»'}).join(', ')+'.'});
  var L=P.desireLab;
  if(L&&(L.desire||L.top)){
    notes.push({k:'lab', t:gx('В Лабиринте желаний ты уже {исследовал|исследовала} тему «'+(L.desire||L.top)+'». Это наблюдение, а не вывод о мотивах.')});
    var hy=(L.mechs||[]).filter(function(m){return m&&m.score!=null&&m.score>=2});
    if(hy.length) notes.push({k:'labm', t:'Там же проявились возможные функции привычного положения: '+hy.map(function(m){return m.name}).join(', ')+'. Это гипотеза для исследования, не диагноз.'});
  }
  P.wishMod.insights=notes;
  return notes;
}

/* ---------- экраны ---------- */
function inviteView(){
  clearStars();
  shell(
    '<div class="kicker">Точка Б</div>'+
    '<h2>Небо моих желаний</h2>'+
    '<p class="line mute">'+gx('Сначала зажги звезды в восьми созвездиях — областях жизни, которые ты уже {видел|видела} на колесе. Потом в центре загорится главное желание. Три звезды для 28 дней ты выберешь {сам|сама} и подтвердишь.')+'</p>'+
    '<button class="go" id="goSky">Открыть небо</button>'
  );
  document.getElementById('goSky').onclick=function(){setScene('sky')};
}

function mapHtml(P, opts){
  opts=opts||{};
  var wishes=liveWishes(P), lit=!!(P.wishMod.big&&P.wishMod.big.text);
  var h='<div class="cmap" id="cmap">';
  CONS.forEach(function(c,i){
    var pos=constPos(i), n=wishes.filter(function(w){return w.cid===c.id&&!w.done}).length;
    var dn=wishes.filter(function(w){return w.cid===c.id&&w.done}).length;
    h+='<button type="button" class="cnode'+(n?' has':'')+'" data-cid="'+c.id+'" style="left:'+pos.x+'px;top:'+pos.y+'px;--cc:'+c.color+'">';
    h+='<span class="cdot"></span><span class="cnm">'+esc(c.name)+'</span>';
    if(n||dn)h+='<span class="ccnt">'+(n?n+'★':'')+(dn?' · '+dn+' сбылось':'')+'</span>';
    h+='</button>';
    /* маленькие звезды вокруг узла */
    var mine=wishes.filter(function(w){return w.cid===c.id}).slice(0,5);
    mine.forEach(function(w,k){
      var ang=(k/Math.max(mine.length,1))*Math.PI*1.6-0.8, r=28+k*6;
      var x=pos.x+Math.cos(ang)*r, y=pos.y+Math.sin(ang)*r+10;
      h+='<button type="button" class="star mini'+(w.important?' gold':'')+(w.done?' dim':'')+'" data-wid="'+w.id+'" style="left:'+x+'px;top:'+y+'px" title="'+esc(labelOf(w))+'">'+starSvg()+'</button>';
    });
  });
  h+='<button type="button" class="big-star'+(lit?' on':'')+(opts.center?' pulse':'')+'" id="bigStar" style="left:'+cx()+'px;top:'+cy()+'px">'+starSvg()+'<span>'+(lit?'Главное':'Центр')+'</span></button>';
  h+='</div>';
  return h;
}

function bindMap(P, after){
  document.querySelectorAll('.cnode').forEach(function(b){
    b.onclick=function(){P=ensure();P.wishMod.openCid=b.getAttribute('data-cid');save(P);setScene('const')};
  });
  document.querySelectorAll('.star.mini[data-wid]').forEach(function(b){
    b.onclick=function(){openWishCard(b.getAttribute('data-wid'))};
  });
  var big=document.getElementById('bigStar');
  if(big)big.onclick=function(){setScene('center')};
  if(after)after();
}

function skyView(){
  var P=ensure(); clearStars();
  var n=liveWishes(P).filter(function(w){return w.cid&&w.cid!=='legacy'&&!w.done}).length;
  shell(
    '<div class="kicker">Небо моих желаний</div>'+
    '<p class="hint sky-hint">Нажми на созвездие и зажги звезду</p>'+
    mapHtml(P)+
    '<div class="composer sky-bar">'+
      (n?'<p class="mute">Звезд: '+n+'</p>':'<p class="mute">Можно начать с любого созвездия. Не обязательно заполнять все.</p>')+
      '<button class="go" id="goCenter">К главному желанию</button>'+
    '</div>',
    'sky-sc'
  );
  bindMap(P);
  document.getElementById('goCenter').onclick=function(){setScene('center')};
  window.gBack=function(){return false};
}

function constView(){
  var P=ensure(), c=consOf(P.wishMod.openCid)||CONS[0];
  clearStars();
  var mine=liveWishes(P).filter(function(w){return w.cid===c.id});
  var list=mine.map(function(w){
    return '<div class="wcard'+(w.done?' done':'')+'" data-wid="'+w.id+'">'+
      '<b>'+esc(labelOf(w))+'</b>'+
      '<small>'+esc(hzName(w.horizon)||'без горизонта')+(w.important?' · важно':'')+(w.done?' · сбылось':'')+'</small>'+
      '</div>';
  }).join('')||'<p class="mute">В этом созвездии пока нет звезд.</p>';
  shell(
    '<button type="button" class="quiet back" id="backSky">К небу</button>'+
    '<div class="kicker" style="color:'+c.color+'">'+esc(c.name)+'</div>'+
    '<p class="q-line">'+esc(c.q)+'</p>'+
    '<div class="chips" id="chips">'+c.chips.map(function(t){return '<button type="button" class="chip" data-t="'+esc(t)+'">'+esc(t)+'</button>'}).join('')+'</div>'+
    '<textarea id="wtx" rows="2" maxlength="200" placeholder="Свой вариант: чего ты хочешь здесь"></textarea>'+
    '<p class="mute hz-lab">Когда хочешь к этому приблизиться</p>'+
    '<div class="chips" id="hz">'+HZ.map(function(h){return '<button type="button" class="chip" data-h="'+h.id+'">'+esc(h.t)+'</button>'}).join('')+'</div>'+
    '<label class="imp"><input type="checkbox" id="wimp"> Это для меня важно</label>'+
    '<button class="go" id="addStar">Зажечь новую звезду</button>'+
    '<div class="wlist">'+list+'</div>',
    'const-sc'
  );
  var hz='now';
  document.querySelectorAll('#hz .chip').forEach(function(b){
    if(b.getAttribute('data-h')==='now')b.classList.add('on');
    b.onclick=function(){hz=b.getAttribute('data-h');document.querySelectorAll('#hz .chip').forEach(function(x){x.classList.toggle('on',x===b)})};
  });
  document.querySelectorAll('#chips .chip').forEach(function(b){
    b.onclick=function(){
      var ta=document.getElementById('wtx'); ta.value=b.getAttribute('data-t'); ta.focus();
      document.querySelectorAll('#chips .chip').forEach(function(x){x.classList.toggle('on',x===b)});
    };
  });
  document.getElementById('addStar').onclick=function(){
    var t=(document.getElementById('wtx').value||'').trim(); if(!t)return;
    P=ensure();
    var w={id:uid(), text:t, raw:t, cid:c.id, horizon:hz, important:!!document.getElementById('wimp').checked, done:false, at:now()};
    P.wishMod.wishes.push(w);
    refreshLinks(P,w);
    save(P);
    constView();
  };
  document.getElementById('backSky').onclick=function(){setScene('sky')};
  document.querySelectorAll('.wcard').forEach(function(el){el.onclick=function(){openWishCard(el.getAttribute('data-wid'))}});
  window.gBack=function(){setScene('sky');return true};
}

function openWishCard(id){
  var P=ensure(), w=wishById(P,id); if(!w)return;
  var overlay=document.createElement('div'); overlay.className='wpop';
  overlay.innerHTML='<div class="panel wpop-in">'+
    '<b>'+esc(labelOf(w))+'</b>'+
    '<p class="mute">'+esc((consOf(w.cid)||{}).name||'Желание')+'</p>'+
    '<p class="mute hz-lab">Горизонт</p>'+
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

function centerView(){
  var P=ensure(); clearStars();
  var lit=!!(P.wishMod.big&&P.wishMod.big.text);
  var txt=lit?(P.wishMod.big.text||P.wishMod.big.raw):'';
  shell(
    '<button type="button" class="quiet back" id="backSky">К небу</button>'+
    '<div class="kicker">Главное желание</div>'+
    '<p class="q-line">А теперь напиши свое главное, тайное или масштабное желание</p>'+
    '<button type="button" class="big-star huge'+(lit?' on pulse':'')+'" id="bigStar" style="position:relative;left:auto;top:auto;transform:none;margin:12px auto">'+starSvg()+'<span>'+(lit?'Зажечь снова':'Зажечь')+'</span></button>'+
    '<div class="composer">'+
      '<textarea id="btx" rows="3" maxlength="240" placeholder="Напиши здесь свое главное желание">'+esc(txt)+'</textarea>'+
      '<p class="mute">Сама звезда в центре — кнопка. Она зажжется, когда желание будет записано.</p>'+
    '</div>',
    'center-sc'
  );
  function activate(){
    var t=(document.getElementById('btx').value||'').trim(); if(!t){document.getElementById('btx').focus();return}
    P=ensure();
    P.wishMod.big={id:P.wishMod.big&&P.wishMod.big.id||uid(), text:t, raw:(P.wishMod.big&&P.wishMod.big.raw)||t, at:now()};
    writeDeclared(P);
    setScene('accepted');
  }
  document.getElementById('bigStar').onclick=activate;
  document.getElementById('backSky').onclick=function(){setScene('sky')};
  window.gBack=function(){setScene('sky');return true};
}

function acceptedView(){
  clearStars();
  var P=ensure(), t=(P.wishMod.big&&(P.wishMod.big.text||P.wishMod.big.raw))||'';
  shell(
    '<div class="kicker">Центральная звезда</div>'+
    '<div class="big-star huge on pulse" style="position:relative;left:auto;top:auto;transform:none;margin:16px auto">'+starSvg()+'</div>'+
    '<h2>Твое желание принято</h2>'+
    '<p class="line">Твой запрос принят.</p>'+
    '<p class="line mute">Следуй импульсам души и наблюдай, как желание проявляется.</p>'+
    (t?'<p class="wish-echo">«'+esc(t)+'»</p>':'')+
    '<button class="go" id="goCmp">Дальше</button>'
  );
  document.getElementById('goCmp').onclick=function(){setScene('compare')};
  window.gBack=function(){setScene('center');return true};
}

function compareView(){
  var P=ensure(); clearStars();
  var notes=buildInsights(P); save(P);
  var info=wheelInfo(P), wishes=liveWishes(P);
  var rows='';
  CONS.forEach(function(c){
    var list=wishes.filter(function(w){return w.cid===c.id&&!w.done});
    var g=info.filter(function(x){return x.id===c.id})[0]||{};
    var mark=g.unsatisfied?' unsat':'';
    rows+='<tr class="'+mark+'"><th>'+esc(c.name)+(g.score!=null?'<small> сфера: '+g.wheel+' · '+g.score+'</small>':'')+'</th><td>';
    if(!list.length) rows+='<span class="mute">'+(g.unsatisfied?'Звезд пока нет':'—')+'</span>';
    else rows+=list.map(function(w){
      var ln=linksOf(P,w).filter(function(id){return id!==c.id}).map(function(id){return (consOf(id)||{}).name}).filter(Boolean);
      return '<div class="td-w">'+esc(labelOf(w))+(w.important?' · важно':'')+(w.horizon?' · '+hzName(w.horizon):'')+(ln.length?' <small>еще: '+esc(ln.join(', '))+'</small>':'')+'</div>';
    }).join('');
    rows+='</td></tr>';
  });
  var legacy=wishes.filter(function(w){return w.cid==='legacy'&&!w.done});
  if(legacy.length){
    rows+='<tr><th>Ранее записанные</th><td>'+legacy.map(function(w){return '<div class="td-w">'+esc(labelOf(w))+'</div>'}).join('')+'</td></tr>';
  }
  var obs=notes.map(function(n){return '<p class="obs">'+esc(n.t)+'</p>'}).join('');
  shell(
    '<button type="button" class="quiet back" id="backC">К главной звезде</button>'+
    '<div class="kicker">Сопоставление</div>'+
    '<h2>Вот что у тебя есть</h2>'+
    '<p class="line mute">Слева — созвездие, справа — твои звезды. Подсветка показывает совпадения со сферами колеса. Это наблюдения, не выводы о мотивах.</p>'+
    '<div class="sky-table-wrap"><table class="sky-table">'+rows+'</table></div>'+
    (obs?'<div class="obs-box">'+obs+'</div>':'')+
    '<button class="go" id="go3">Выбрать три звезды</button>',
    'cmp-sc'
  );
  document.getElementById('backC').onclick=function(){setScene('center')};
  document.getElementById('go3').onclick=function(){setScene('pick3')};
  window.gBack=function(){setScene('center');return true};
}

function pick3View(){
  var P=ensure(); clearStars();
  var list=ranked(P);
  if(list.length<3){
    shell(
      '<button type="button" class="quiet back" id="backCmp">К таблице</button>'+
      '<div class="kicker">Три звезды моего ближайшего пути</div>'+
      '<p class="line">Чтобы выбрать три желания, зажги еще звезды в созвездиях. Сейчас их '+list.length+'.</p>'+
      '<button class="go" id="goSky">К небу</button>'
    );
    document.getElementById('backCmp').onclick=function(){setScene('compare')};
    document.getElementById('goSky').onclick=function(){setScene('sky')};
    window.gBack=function(){setScene('compare');return true};
    return;
  }
  var pick=P.wishMod.pick&&P.wishMod.pick.length===3?P.wishMod.pick.slice():list.slice(0,3).map(function(w){return w.id});
  P.wishMod.pick=pick; save(P);
  var bigId=P.wishMod.big&&P.wishMod.big.id;
  var rows=list.map(function(w,i){
    var on=pick.indexOf(w.id)>=0;
    var hint=[];
    if(i<3)hint.push('подсказка');
    if(w.important)hint.push('важно');
    if(w.horizon==='now')hint.push('сейчас');
    var unsat=linksOf(P,w).some(function(id){var g=wheelInfo(P).filter(function(x){return x.id===id})[0];return g&&g.unsatisfied});
    if(unsat)hint.push('совпадает со сферой, где тесно');
    return '<button type="button" class="pick-row'+(on?' on':'')+'" data-id="'+w.id+'">'+
      '<span class="tick"></span><span class="ptx"><b>'+esc(labelOf(w))+'</b>'+
      '<small>'+esc((consOf(w.cid)||{}).name||'')+(hint.length?' · '+hint.join(' · '):'')+'</small></span></button>';
  }).join('');
  shell(
    '<button type="button" class="quiet back" id="backCmp">К таблице</button>'+
    '<div class="kicker">Три звезды моего ближайшего пути</div>'+
    '<h2>Выбери три желания на 28 дней</h2>'+
    '<p class="line mute">Список идет по приоритету: совпадение с неудовлетворенными сферами, важность и горизонт «Сейчас». Верхние три отмечены как подсказка. Главное желание в трекер само не входит — только то, что ты отметишь и подтвердишь.</p>'+
    '<div class="plist">'+rows+'</div>'+
    '<p class="mute" id="pcnt">Выбрано: '+pick.length+' из 3</p>'+
    '<button class="go" id="goYes" '+(pick.length===3?'':'disabled')+'>Да, работаю над этим</button>',
    'pick-sc'
  );
  function sync(){
    document.querySelectorAll('.pick-row').forEach(function(b){b.classList.toggle('on',pick.indexOf(b.getAttribute('data-id'))>=0)});
    document.getElementById('pcnt').textContent='Выбрано: '+pick.length+' из 3';
    document.getElementById('goYes').disabled=pick.length!==3;
  }
  document.querySelectorAll('.pick-row').forEach(function(b){
    b.onclick=function(){
      var id=b.getAttribute('data-id'), i=pick.indexOf(id);
      if(i>=0)pick.splice(i,1);
      else if(pick.length<3)pick.push(id);
      P=ensure();P.wishMod.pick=pick.slice();save(P);sync();
    };
  });
  document.getElementById('backCmp').onclick=function(){setScene('compare')};
  document.getElementById('goYes').onclick=function(){
    if(pick.length!==3)return;
    P=ensure();
    P.wishMod.pick=pick.slice();
    P.wishMod.confirmed=pick.slice();
    P.wishMod.confirmedAt=now();
    writeDeclared(P);
    writeDirections(P);
    P.wishMod.scene='map'; save(P);
    finishAndGo();
  };
  window.gBack=function(){setScene('compare');return true};
}

function finishAndGo(){
  var P=ensure();
  shell(
    '<div class="kicker">Три звезды</div>'+
    '<h2>Выбор подтвержден</h2>'+
    '<p class="line">Три желания записаны в путь на 28 дней. Главная звезда остается в центре неба — это отдельная практика.</p>'+
    '<ul class="sum3">'+((P.tracker.directions)||[]).map(function(d){return '<li>'+esc(d.text)+'</li>'}).join('')+'</ul>'+
    ((P.tracker.declared&&(P.tracker.declared.text||P.tracker.declared.raw))?'<p class="mute">Центральная звезда: «'+esc(P.tracker.declared.text||P.tracker.declared.raw)+'»</p>':'')+
    '<button class="go" id="nx">Дальше</button>'+
    '<button type="button" class="quiet" id="stay">Остаться в небе</button>'
  );
  var nx=document.getElementById('nx');
  if(window.GQuote)try{GQuote.add(app.querySelector('.wsc')||app,'wish.html',nx)}catch(e){}
  nx.onclick=function(){
    if(window.GReview){location.href='tasks.html';return}
    if(window.GRoute){
      if(!GRoute.complete('wish.html'))GRoute.complete();
      location.href=GRoute.advance();
      return;
    }
    location.href='reactor.html';
  };
  document.getElementById('stay').onclick=function(){setScene('map')};
}

function mapView(){
  var P=ensure(); clearStars();
  var dirs=(P.tracker&&P.tracker.directions)||[];
  var big=P.wishMod.big||P.tracker&&P.tracker.declared;
  shell(
    '<div class="kicker">Небо моих желаний</div>'+
    (big&&(big.text||big.raw)?'<p class="wish-echo">«'+esc(big.text||big.raw)+'»</p>':'')+
    mapHtml(P)+
    '<div class="composer sky-bar">'+
      (dirs.length?'<p class="mute">Три звезды: '+dirs.map(function(d){return esc(d.text||d)}).join(' · ')+'</p>':'')+
      '<button class="go" id="go3">Выбрать следующие три</button>'+
      '<button type="button" class="quiet" id="goC">Главная звезда</button>'+
    '</div>',
    'sky-sc'
  );
  bindMap(P);
  document.getElementById('go3').onclick=function(){setScene('pick3')};
  document.getElementById('goC').onclick=function(){setScene('center')};
  window.gBack=function(){return false};
}

var VIEWS={
  invite:inviteView, sky:skyView, 'const':constView, center:centerView,
  accepted:acceptedView, compare:compareView, pick3:pick3View, map:mapView
};

function render(){
  var P=ensure();
  (VIEWS[P.wishMod.scene]||inviteView)();
}

var q=new URLSearchParams(location.search);
if(q.get('change')==='1'){
  try{sessionStorage.setItem('alch_v5_wishChange','1')}catch(e){}
  var P0=ensure();P0.wishMod.scene='center';save(P0);
  history.replaceState(null,'','wish.html'+(q.get('u')?'?u='+encodeURIComponent(q.get('u')):''));
}
if(q.get('pick')==='1'){
  var P1=ensure();P1.wishMod.scene='pick3';save(P1);
}

drawSky();
window.addEventListener('resize',function(){drawSky();var P=ensure();if(['sky','map','center'].indexOf(P.wishMod.scene)>=0)render()});
render();
})();
