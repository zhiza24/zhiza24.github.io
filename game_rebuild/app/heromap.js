/* Карта героя: личная карта из всех сохраненных результатов, 7 уровней.
   Тексты результатов берутся из модулей дословно; общего балла нет.
   Связи показываются, только когда совпадают два независимых результата. */
(function(){
'use strict';
var KEY='alch_v5_profile';
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(P){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
function fem(P){return window.GGender?GGender(P)==='f':(P&&P.gender)==='f'}
var CUR=null;
function g(s){if(s==null)return '';var f=fem(CUR||load());return String(s).replace(/\{([^{}|]*)\|([^{}|]*)\}/g,function(_,m,w){return f?w:m})}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function h(s){return esc(g(s))}
function p(s){return '<p>'+s+'</p>'}
function det(sum,body){return body?'<details class="hm-det"><summary>'+esc(sum)+'</summary>'+body+'</details>':''}
function arr(a){return Array.isArray(a)?a:[]}
function word(n,a,b,c){n=Math.abs(n)%100;var x=n%10;if(n>10&&n<20)return c;if(x>1&&x<5)return b;if(x===1)return a;return c}

/* ---------- зависимости: подгружаются, если страница их не подключила ---------- */
var DEPS=[['GPAT','engine.js?v=arch1'],['GPassportData','passport-data.js?v=1'],['GPassport','passport.js?v=opening2'],['GARCH','arch-data.js?v=1'],['GARCH_UPD','arch-copy-updates.js?v=kit1'],['POCHERK_TEXT','pocherk-data.js?v=1794440811'],['GMirrorData','mirrors-data.js?v=2'],['GTESTS','tests-data.js?v=kit2'],['GTests','tests.js?v=kit2']];
function loaded(src){return [].some.call(document.scripts,function(s){return (s.getAttribute('src')||'').split('?')[0]===src.split('?')[0]})}
function ready(cb){var q=DEPS.filter(function(d){return d[0]==='GARCH_UPD'?!loaded(d[1]):!window[d[0]]&&!loaded(d[1])}).map(function(d){return d[1]});
 (function next(){if(!q.length){cb();return}var s=document.createElement('script');s.src=q.shift();s.onload=s.onerror=next;document.head.appendChild(s)})()}

/* ---------- тексты из модулей ---------- */
var CARDS={s:['Тропа молний','Эта дорога полна движения и неожиданных поворотов.'],n:['Туманная долина','Эта дорога открывается постепенно.'],str:['Горный перевал','Эта дорога ведет вверх, туда, откуда открывается широкий обзор.'],z:['Река попутчиков','Эта дорога проходит по течению большой реки.'],f:['Пусть выберет судьба','Перед тобой все дороги.']};
var WN=['Здоровье','Финансы','Карьера','Отношения','Семья','Друзья','Рост','Отдых'];
function testMain(k,P){try{var S=GTests.STEP[k],x=P[S.f];if(!x||!x.v||!x.answers)return null;var html=GTests.BUILD[k](x.answers).html||'';
  html=html.replace(/<span class="tag">[^<]*<\/span>/g,'');var i=html.indexOf('<details');var main=i>=0?html.slice(0,i):html,rest=i>=0?html.slice(i):'';
  return main+rest.replace(/ open>/g,'>')}catch(e){return null}}
function gpat(P){return P.lab&&P.lab.lead&&window.GPAT&&GPAT[P.lab.lead]?GPAT[P.lab.lead]:null}
function lead(res){return arr(res&&res.leadingScales)}
function wheelTop(vals){var L=vals.map(function(v,i){return {n:WN[i],v:v}}).filter(function(x){return typeof x.v==='number'});if(!L.length)return null;
 var mx=Math.max.apply(null,L.map(function(x){return x.v})),mn=Math.min.apply(null,L.map(function(x){return x.v}));
 return {hi:L.filter(function(x){return x.v===mx}).map(function(x){return x.n}),lo:L.filter(function(x){return x.v===mn}).map(function(x){return x.n}),mx:mx,mn:mn,flat:mx===mn}}
function r1(x){return String(Math.round(x*10)/10).replace('.',',')}

/* каждый источник: уровень, ключ, название модуля, шаг маршрута, функция текста */
var SRC=[
 [1,'passport','Паспорт героя','hero.html',function(P){if(!P.passport)return null;var c=window.GPassport?GPassport.context(P):{themes:[]},D=window.GPassportData||{themes:[]};
   if(!c.themes.length)return p('Паспорт открыт. Темы, в которых ты узнаешь себя, пока не отмечены.');
   return p('Темы, в которых ты '+(fem(P)?'узнала':'узнал')+' себя:')+'<ul class="hm-ul">'+c.themes.map(function(t){var d=D.themes.filter(function(x){return x.id===t.id})[0];return '<li><b>'+esc(t.name)+'</b>'+(d&&d.description?'<br><small>'+esc(window.GPassport?GPassport.say(d.description,P.gender):d.description)+'</small>':'')+'</li>'}).join('')+'</ul>'}],
 [1,'path','Выбор пути','choose.html',function(P){var c=CARDS[P.mapStyle];if(!c)return null;return '<div class="hm-q">«'+esc(c[0])+'»</div>'+p(esc(c[1]))}],
 [1,'pocherk','Почерк героя','bridge.html',function(P){var x=P.pocherk;if(!x||!x.lead||!window.POCHERK_TEXT)return null;var k=x.mixed?'mixed':x.lead,T=(POCHERK_TEXT[k]||{})[fem(P)?'F':'M']||[],D=window.POCHERK_DIRS||{};
   var name=x.mixed&&x.leads?arr(x.leads).map(function(l){return D[l]}).join(' и '):D[x.lead];if(!T.length)return '<div class="hm-q">'+esc(name)+'</div>';
   return '<div class="hm-q">'+esc(name)+'</div>'+p(esc(T[0]))+det('Подробнее',T.slice(1).filter(Boolean).map(function(t){return p(esc(t))}).join(''))}],
 [1,'pi','Профиль взаимодействия','slot.html?id=pi',function(P){return testMain('pi',P)}],
 [2,'ego','Фоновое состояние','ego.html',function(P){var e=P.ego;if(!e||!e.top)return null;var A=window.GARCH&&e.lead?GARCH.resA[e.lead]:null;
   if(!A)return '<div class="hm-q">'+h(e.top)+'</div>';return '<div class="hm-q">'+h(A.title)+'</div>'+p(h(A.text))+(A.point?'<p class="hm-pt">Новая точка: «'+h(A.point).replace(/\.$/,'')+'»</p>':'')}],
 [3,'dialog','Диалог: кто сейчас выбирает','slot.html?id=dialog',function(P){var d=P.dialog;if(!d)return null;
   if(d.v===4){var e=d.egoCount||0,s=d.selfCount||0,k=d.doubtCount||0;if(!e&&!s)return p('Сейчас ты сомневаешься во всех фразах. Это честный ответ: голоса пока звучат вместе. Можно вернуться к этим словам позже и заметить, какой из них слышен в обычный день.');
    return p(esc('Защитнику ты '+(fem(P)?'отдала ':'отдал ')+e+' '+word(e,'фразу','фразы','фраз')+', Самости '+s+(k?', в '+k+' сомневаешься':'')+'.'))+p('Куда направлен фокус внимания, там сила и выбор.')}
   return p('Диалог пройден.')}],
 [3,'archB','Эхо: привычный ход','slot.html?id=arch_b',function(P){var b=P.archB;if(!b||!b.top)return null;var R=window.GARCH&&b.lead?GARCH.resB[b.lead]:null,F=window.GARCH&&b.lead&&GARCH.bfull?GARCH.bfull[b.lead]:null;
   if(!R)return '<div class="hm-q">'+h(b.top)+'</div>';var L=GARCH.bfullLabels||{};
   return '<div class="hm-q">'+h(R.name)+'</div>'+p(h(R.text))+(R.sw?'<p class="hm-pt">Переключатель: '+h(R.sw)+'</p>':'')+(F?det('Подробнее об этом ходе',p(h(F.d))+p('<b>'+esc(L.logic||'Внутренняя логика')+':</b> '+h(F.logic))+p('<b>'+esc(L.gain||'Что дает сразу')+':</b> '+h(F.gain))+p('<b>'+esc(L.cost||'Возможная цена')+':</b> '+h(F.cost))):'')}],
 [3,'fs','Первые настройки','slot.html?id=fs',function(P){return testMain('fs',P)}],
 [3,'dq','Свайп хорошего','swipe.html',function(P){var d=P.dq;if(!d||d.accepted==null)return null;var v=arr(d.voices);
   return '<div class="hm-q">'+esc((fem(P)?'Ты приняла ':'Ты принял ')+d.accepted+'% своего хорошего')+'</div>'+(v.length?p('Голоса, которые обесценивают:<br><b>'+v.map(function(x){return '«'+esc(x)+'»'}).join('<br>')+'</b>'):p('Ты умеешь принимать хорошее. Это редкая сила.'))}],
 [4,'wheel','Колесо баланса: первый взгляд','wheel8.html',function(P){var w=Array.isArray(P.wheel)?wheelTop(P.wheel):null;if(!w)return null;
   if(w.flat)return p(esc('Все сферы ты '+(fem(P)?'оценила':'оценил')+' одинаково: '+w.mx+'.'));
   return p('<b>Сильнее всего:</b> '+esc(w.hi.join(', '))+' ('+w.mx+')')+p('<b>Меньше всего:</b> '+esc(w.lo.join(', '))+' ('+w.mn+')')}],
 [4,'wheelTest','Колесо: как на самом деле','wheel-test.html',function(P){var t=P.wheelTest;if(!t||!arr(t.spheres).length||!t.spheres.some(function(s){return s.average!=null}))return null;
   var w=wheelTop(t.spheres.map(function(s){return s.average==null?null:Math.round(s.average*10)/10}));if(!w)return null;w.mx=r1(w.mx);w.mn=r1(w.mn);
   return p('<b>Сильнее всего:</b> '+esc(w.hi.join(', '))+' ('+w.mx+')')+(w.flat?'':p('<b>Меньше всего:</b> '+esc(w.lo.join(', '))+' ('+w.mn+')'))}],
 [4,'mirrors','Два зеркала','slot.html?id=mirrors',function(P){var H=arr(P.mirrors&&P.mirrors.history);if(!H.length)return null;var r=H[H.length-1],t=window.GMirrorData?GMirrorData.observationText(r):((r.main_observation||{}).selected_text||'');
   if(!t)return null;return p(esc(t))+(r.personal_note?p(esc(r.personal_note)):'')}],
 [4,'res','Ресурсы и тело','res.html',function(P){var r=arr(P.res).map(function(x){return typeof x==='string'?x:(x&&(x.t||x.name))||''}).filter(Boolean);if(!r.length&&!P.body)return null;
   return (r.length?p('<b>Опора:</b> '+esc(r.join(', '))):'')+(P.body?p('<b>Тело:</b> '+esc(P.body)):'')}],
 [5,'egoSelf','Эго или Самость в желаниях','values.html',function(P){var s=P.egoSelf;if(!s||s.match==null)return null;var n=arr(s.ans).length||10;
   return p(esc('В '+s.match+' из '+n+' желаний ты '+(fem(P)?'услышала':'услышал')+' голос Эго и Самости так же, как подсказка игры.'+(s.match<n?' Там, где вышло иначе, можно присмотреться: какой страх или какая радость стоит за желанием.':'')))}],
 [5,'archV','Зодчий: сверка догадок','slot.html?id=arch_v',function(P){var v=P.archV;if(!v)return null;return (v.top?'<div class="hm-q">'+h(v.top)+'</div>':'')+(v.quote?p('Твоя фраза: «'+esc(v.quote)+'»'):'')||null}],
 [5,'gap','Первый взгляд и обычные дни','wheel-test.html',function(P){if(!Array.isArray(P.wheel)||!P.wheelTest||!arr(P.wheelTest.spheres).length)return null;
   var L=[];P.wheelTest.spheres.forEach(function(s,i){var a=P.wheel[i];if(typeof a==='number'&&s.average!=null&&Math.abs(a-s.average)>=3)L.push({n:WN[i],a:a,b:r1(s.average)})});
   if(!L.length)return p('Первый взгляд на колесо и ответы о самых обычных днях почти совпали.');
   return L.map(function(x){return p(esc('«'+x.n+'»: на первый взгляд ты '+(fem(P)?'оценила':'оценил')+' эту сферу на '+x.a+', а по ответам о самых обычных днях вышло около '+x.b+'. Здесь впечатление и обычные дни расходятся.'))}).join('')}],
 [6,'km','Кривой Мир','slot.html?id=km',function(P){return testMain('km',P)}],
 [6,'lab','Лабиринт установки','slot.html?id=sort',function(P){var G=gpat(P);if(!G)return null;var pt={};G.parts.forEach(function(x){pt[x[0]]=x[1]});
   return '<div class="hm-q">'+h(G.n)+'</div>'+(pt['Скрытое правило']?p('<b>Скрытое правило:</b> «'+h(pt['Скрытое правило'])+'»'):'')+(pt['Новая настройка']?'<p class="hm-pt">Новая настройка: «'+h(pt['Новая настройка'])+'»</p>':'')+det('Выгода и цена',G.parts.filter(function(x){return x[0]!=='Скрытое правило'&&x[0]!=='Новая настройка'}).map(function(x){return p('<b>'+esc(x[0])+':</b> '+h(x[1]))}).join(''))}],
 [6,'lab_d','Лабиринт желаний','slot.html?id=lab_d',function(P){return testMain('lab_d',P)}],
 [6,'archP','Страж: точка переключения','slot.html?id=arch_p',function(P){var x=P.archP;if(!x||!x.top)return null;return '<div class="hm-q">«'+h(x.top).replace(/\.$/,'')+'»</div>'}],
 [6,'rs','Ответственность','slot.html?id=rs',function(P){return testMain('rs',P)}],
 [6,'ct','Критическое мышление','slot.html?id=ct',function(P){return testMain('ct',P)}],
 [6,'lever','Точка влияния','slot.html?id=leverage',function(P){var l=P.fractal&&P.fractal.lever;if(!l||!l.title)return null;return '<div class="hm-q">'+h(l.title)+'</div>'+(l.action?p(h(l.action)):'')}],
 [7,'sv','Самоценность','slot.html?id=sv',function(P){return testMain('sv',P)}],
 [7,'vsort','Три ориентира','slot.html?id=vsort',function(P){var v=(P.valuesCore&&arr(P.valuesCore.top3))||[];if(!v.length&&P.values&&arr(P.values.order).length)v=P.values.order.slice(0,3);if(!v.length)return null;return '<ol class="hm-ul">'+v.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ol>'}],
 [7,'focuses','Направления на месяц','values.html',function(P){var f=arr(P.focuses).map(function(x){return typeof x==='string'?x:(x&&(x.t||x.name))||''}).filter(Boolean);if(!f.length)return null;return '<ol class="hm-ul">'+f.map(function(x){return '<li>'+esc(x)+'</li>'}).join('')+'</ol>'}],
 [7,'archD','Архитектор: выбранное состояние','slot.html?id=arch_d',function(P){var d=P.archD;if(!d||!d.d1t)return null;
   return '<div class="hm-q">'+esc(d.d1t)+'</div>'+(d.d2t||d.d2own?p('<b>Первый признак:</b> '+esc(d.d2own||d.d2t)):'')+(d.d3t||d.d3own?p('<b>Действие на два дня:</b> '+esc(d.d3own||d.d3t)):'')}],
 [7,'reactor','Реактор','reactor.html',function(P){var r=P.reactor,n=r?Object.keys(r.days||{}).length:0;if(!n)return null;return p(esc('Засчитано дней: '+n+' из 21.'))}],
 [7,'compare','Было и стало','slot.html?id=compare',function(P){var r=P.retest;if(!r||!arr(r.wheel).length||!Array.isArray(P.wheel))return null;
   var up=[],dn=[];r.wheel.forEach(function(v,i){var a=P.wheel[i];if(typeof a!=='number')return;if(v-a>=1)up.push(WN[i]+' '+a+' → '+v);if(a-v>=1)dn.push(WN[i]+' '+a+' → '+v)});
   if(!up.length&&!dn.length)return p('Колесо осталось почти таким же, как в начале пути.');return (up.length?p('<b>Выросло:</b> '+esc(up.join(', '))):'')+(dn.length?p('<b>Стало меньше:</b> '+esc(dn.join(', '))):'')}]
];
var LEVELS=['Исходная архитектура','Ведущее фоновое состояние','Автоматические реакции и защиты','Реальная жизненная картина','Внутренние противоречия','Установки, вторичные выгоды и точки влияния','Ресурсы и направление развития'];

/* ---------- связи: только при совпадении двух независимых результатов ---------- */
function links(P){var L=[],km=lead(P.kmTest),rs=lead(P.respTest),sv=lead(P.selfWorth),fs=P.firstSet||{},fl=arr(fs.leading),fo=fs.outcome||{},d=P.dialog||{};
 function has(a,x){return a.indexOf(x)>=0}
 if(has(km,'KM03')&&has(rs,'RS02'))L.push({k:'L1',a:['km','rs'],t:'Тема вины и ответственности за других появилась в двух разных испытаниях: в Кривом Мире и в Ответственности. Похоже, здесь стоит присмотреться к границе между своим и чужим.'});
 if(has(km,'KM02')&&(has(sv,'SV05')||has(sv,'SV01')))L.push({k:'L2',a:['km','sv'],t:'Условное принятие себя видно и в Кривом Мире, и в Самоценности. Обе находки говорят об одном: право быть собой пока часто приходится заслуживать.'});
 if(has(km,'KM04')&&has(rs,'RS06'))L.push({k:'L3',a:['km','rs'],t:'Осторожность в доверии проявилась дважды: в Кривом Мире и в Ответственности. Отдавать задачи и опираться на других пока непросто.'});
 if(has(rs,'RS05')&&has(sv,'SV02'))L.push({k:'L4',a:['rs','sv'],t:'Строгость к своим ошибкам видна и в Ответственности, и в Самоценности. Право на несовершенство здесь можно тренировать маленькими шагами.'});
 if(has(sv,'SV04')&&fl.indexOf('Подстройка и сохранение контакта')>=0)L.push({k:'L5',a:['sv','fs'],t:'Подстройка под других видна в Первых настройках, а трудность с отказом видна в Самоценности. Похоже, сохранить контакт пока важнее, чем сказать «нет».'});
 if(d.v===4&&(d.egoCount||0)>(d.selfCount||0)&&fl.some(function(n){return fo[n]==='kept'}))L.push({k:'L6',a:['dialog','fs'],t:'В диалоге голос Защитника звучал чаще, а детская стратегия «'+fl.filter(function(n){return fo[n]==='kept'})[0]+'» сохранилась до сих пор. Обе находки говорят о том, что привычная защита пока включается быстро.'});
 if(P.desireLab&&P.desireLab.desire&&P.valuesCore&&arr(P.valuesCore.top3).length){var ds=String(P.desireLab.desire).toLowerCase(),hit=P.valuesCore.top3.filter(function(v){var w=String(v).toLowerCase().replace(/[^а-я]/g,'').slice(0,5);return w.length>=4&&ds.indexOf(w)>=0})[0];
  if(hit)L.push({k:'L7',a:['lab_d','vsort'],t:'Твое желание из Лабиринта перекликается с ориентиром «'+hit+'». Желание и ценность смотрят в одну сторону.'})}
 return L}

/* ---------- сбор ---------- */
function stepDone(P,u){return !!(P.flow&&P.flow.completed&&P.flow.completed[u])}
function entries(P){P=P||load();CUR=P;var out=LEVELS.map(function(t,i){return {lv:i+1,title:t,items:[]}});
 SRC.forEach(function(s){var html=null;try{html=s[4](P)}catch(e){html=null}
  if(html&&window.GT)html=html.replace(/\{([^{}|]*)\|([^{}|]*)\}/g,function(_,m,w){return fem(P)?w:m});
  out[s[0]-1].items.push({key:s[1],name:s[2],u:s[3],done:!!html,html:html||'',mark:((P.heroMap||{}).marks||{})[s[1]]||null})});
 return out}
function count(P){var n=0,m=0;entries(P).forEach(function(l){l.items.forEach(function(x){m++;if(x.done)n++})});return {done:n,all:m}}
function css(){if(document.getElementById('hm-css'))return;var s=document.createElement('style');s.id='hm-css';s.textContent=
 '.hm{color:#f4ecdf;text-align:left;background:#0f0a05;border-radius:16px;padding:10px 10px 12px}.hm-lv{margin:16px 0 8px;font:700 13px Manrope,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#e8c16c}'+
 '.hm-L{border:1px solid #3c2c18;border-radius:14px;margin:8px 0;padding:2px 10px 6px;background:#140e07}.hm-L>summary{cursor:pointer;list-style:none;position:relative;padding-right:22px}.hm-L>summary::-webkit-details-marker{display:none}.hm-L>summary:after{content:"▾";position:absolute;right:2px;top:2px;color:#e8c16c}.hm-L[open]>summary:after{content:"▴"}.hm-sm{font-size:13px!important;color:#a8977c!important;margin-top:3px}#hmBox .hm-sm{color:#a8977c!important}'+
 '.hm-lv small{display:block;font-weight:500;letter-spacing:0;text-transform:none;color:#cbb89a;font-size:14px}'+
 '.hm-it{background:#1c140b;border:1px solid #5a4325;border-radius:14px;padding:12px 14px;margin:8px 0;line-height:1.5}'+
 '.hm-it.no{opacity:.92;border-style:dashed}.hm-it.rej{opacity:.6}.hm-n{font:700 12px Manrope,sans-serif;color:#cbb89a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}'+
 '#hmBox .hm-lv,#hmBox .hm-lv small:not(.hm-sm){color:#e8c16c!important}#hmBox .hm-lv small:not(.hm-sm){color:#cbb89a!important}#hmBox .hm-it p,#hmBox .hm-it li,#hmBox .hm-it small,#hmBox .hm-it .gt-lv,#hmBox .hm-it .al,#hmBox .hm-it b,#hmBox .hm-it summary{color:#f4ecdf!important}#hmBox .hm-it small{color:#cbb89a!important}'+
 '.hm-it p{margin:6px 0;font-size:17px}.hm-q,.hm-it .aq{font:700 19px "Cormorant Garamond",serif;color:#f0c870;margin:2px 0 6px}#hmBox .hm-q,#hmBox .hm-it .aq{color:#f0c870!important}.hm-pt{color:#f0c870}#hmBox .hm-pt{color:#f0c870!important}'+
 '.hm-it .al{font-size:13px;color:#cbb89a;text-transform:uppercase;letter-spacing:.05em;margin-top:6px}.hm-it .gt-lv{font-size:14px;color:#cbb89a}.hm-ul{margin:6px 0;padding-left:20px}.hm-ul li{margin:4px 0}'+
 '.hm-it details,.hm-det{margin-top:8px;border-top:1px solid #3c2c18;padding-top:6px}.hm-it summary{cursor:pointer;color:#e8c16c;font-size:15px}'+
 '.hm-miss{color:#a8977c;font-size:16px}#hmBox .hm-miss{color:#a8977c!important}.hm-mk{display:flex;gap:8px;margin-top:10px}.hm-mk button{flex:1;min-height:40px;border-radius:10px;border:1px solid #9e783a;background:#120c06;color:#f4ecdf;font:600 15px Manrope,sans-serif;cursor:pointer}'+
 '.hm-mk button.on{background:#e8c16c;color:#26190b;border-color:#e8c16c}.hm-ln{background:#241a0c;border:1px solid #9e783a;border-radius:14px;padding:12px 14px;margin:8px 0}.hm-ln p{margin:0;font-size:17px;line-height:1.5}#hmBox .hm-ln p{color:#f4ecdf!important}'+
 '.hm-cnt{font-size:15px;color:#cbb89a}#hmBox .hm-cnt{color:#cbb89a!important}.hm-own{width:100%;box-sizing:border-box;margin-top:8px;padding:10px;border-radius:10px;border:1px solid #9e783a;background:#120c06;color:#f4ecdf;font:inherit;font-size:17px}';
 document.head.appendChild(s)}
/* opts: {marks:true, own:true, levels:[1..7] , compact:false} */
function render(box,opts){opts=opts||{};css();var P=load(),E=entries(P),c=count(P),LK=links(P),HM=P.heroMap||{};
 var html='<div class="hm" id="hmBox"><p class="hm-cnt">Карта растет по мере пути. Здесь нет общего балла: только то, что ты '+(fem(P)?'прошла':'прошел')+', и то, что ты можешь узнать в себе. Открой уровень, чтобы прочитать.</p>';
 E.forEach(function(l){if(opts.levels&&opts.levels.indexOf(l.lv)<0)return;var dn=l.items.filter(function(x){return x.done});html+='<details class="hm-L"'+(opts.open?' open':'')+'><summary class="hm-lv">Уровень '+l.lv+'<small>'+esc(l.title)+'</small><small class="hm-sm">'+(dn.length?esc(dn.map(function(x){return x.name}).join(' · ')):'еще не пройдено')+'</small></summary>';
  l.items.forEach(function(x){if(!x.done){html+='<div class="hm-it no"><div class="hm-n">'+esc(x.name)+'</div><div class="hm-miss">еще не пройдено</div></div>';return}
   html+='<div class="hm-it'+(x.mark==='no'?' rej':'')+'" data-k="'+x.key+'"><div class="hm-n">'+esc(x.name)+'</div>'+x.html+(opts.marks!==false?'<div class="hm-mk"><button type="button" data-m="yes" class="'+(x.mark==='yes'?'on':'')+'">Узнаю себя</button><button type="button" data-m="no" class="'+(x.mark==='no'?'on':'')+'">Не про меня</button></div>':'')+'</div>'});html+='</details>'});
 html+='<div class="hm-lv">Связи<small>Появляются, только когда два разных испытания показывают одно и то же</small></div>'+(LK.length?LK.map(function(x){return '<div class="hm-ln"><p>'+esc(x.t)+'</p></div>'}).join(''):'<div class="hm-it no"><div class="hm-miss">Пока связей нет. Они появятся, когда совпадут результаты двух испытаний.</div></div>');
 if(opts.own!==false)html+='<div class="hm-lv">Своими словами<small>Что ты сейчас знаешь о себе</small></div><textarea id="hmOwn" class="hm-own" rows="3" maxlength="400" placeholder="Своя формулировка">'+esc(HM.own||'')+'</textarea>';
 html+='</div>';box.innerHTML=html;
 box.querySelectorAll('.hm-mk button').forEach(function(b){b.onclick=function(){var it=b.closest('.hm-it'),k=it.dataset.k,m=b.dataset.m,P=load();P.heroMap=P.heroMap||{v:1,marks:{}};P.heroMap.marks=P.heroMap.marks||{};
  if(P.heroMap.marks[k]===m)delete P.heroMap.marks[k];else P.heroMap.marks[k]=m;P.heroMap.at=Date.now();save(P);var cur=P.heroMap.marks[k]||null;
  it.querySelectorAll('.hm-mk button').forEach(function(x){x.classList.toggle('on',x.dataset.m===cur)});it.classList.toggle('rej',cur==='no')}});
 var o=box.querySelector('#hmOwn');if(o)o.onchange=o.onblur=function(){var P=load();P.heroMap=P.heroMap||{v:1,marks:{}};P.heroMap.own=o.value.trim()||null;P.heroMap.at=Date.now();save(P)}}
/* для финала: совместимость с прежней записью finalConfirm */
function confirmSnapshot(){var P=load(),E=entries(P),HM=P.heroMap||{marks:{}},o=document.getElementById('hmOwn');if(o){HM.own=o.value.trim()||null}
 var items=[];E.forEach(function(l){l.items.forEach(function(x){if(x.done){var m=(HM.marks||{})[x.key];items.push({k:x.key,label:x.name,level:l.lv,ok:m==='yes',status:m==='yes'?'confirmed':m==='no'?'rejected':'hypothesis'})}})});
 P.heroMap=Object.assign({v:1,marks:{}},HM,{at:Date.now()});P.finalConfirm={v:2,items:items,own:HM.own||null,at:Date.now()};save(P);
 if(window.GProfile)try{GProfile.saveResult('finalConfirm',P.finalConfirm,{marks:HM.marks,own:HM.own},{profile:P})}catch(e){}return P}
/* для дневника: пройденные результаты в порядке прохождения */
function done(P){P=P||load();var C=(P.flow&&P.flow.completed)||{},L=[];entries(P).forEach(function(l){l.items.forEach(function(x){if(x.done){var t=C[x.u];L.push(Object.assign({lv:l.lv,level:l.title,at:typeof t==='number'?t:(t&&t.at)||null},x))}})});
 var F=(window.GFLOW||[]).map(function(x){return x.u});L.forEach(function(x,i){x.ord=F.indexOf(x.u);x.i=i});L.sort(function(a,b){return (a.ord-b.ord)||(a.i-b.i)});return L}
window.GHM={ready:ready,entries:entries,links:links,render:render,count:count,done:done,confirmSnapshot:confirmSnapshot,css:css,LEVELS:LEVELS};
})();
