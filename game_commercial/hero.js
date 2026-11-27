/* Вкладка «Герой» — личное досье путешественника.
   1) портрет и личность, 2) «Моя природа», 3) «Моя история»: 5 глав по точкам маршрута GFLOW,
   внутри каждой: что исследовал, что открыл о себе, мой инсайт, что получил (артефакты главы).
   Главы наполняются по мере прохождения; закрытые приглушены. Данные: alch_v5_profile. */
(function(){
var H=window.GHeroData||{},P=H.P||{},female=P.gender==='f',esc=H.esc||function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function g(m,f){return female?f:m}
var FL=window.GFLOW||[],comp=(P.flow||{}).completed||{},curU=(P.flow||{}).current||'';
var CH=[
 {pt:'0',name:'Начало пути',sub:'Точка 0 · Знакомство с собой',desc:'Кто ты, как устроена твоя природа, какие стратегии и привычные реакции влияют на твой выбор.',links:[['nature','Твоя природа'],['positions','Твои грани']]},
 {pt:'А',name:'Твоя исходная точка',old:'Моя исходная точка',sub:'Точка А · Реальная картина жизни',desc:'Что происходит в твоей жизни сейчас, где есть удовлетворенность, где дефицит, какие сферы требуют внимания.',links:[['numbers','Твои опоры']]},
 {pt:'Б',name:'Твой перекресток',old:'Мой перекресток',sub:'Точка Б · Установки и желания',desc:g('Какие внутренние схемы повторяются, что удерживает тебя на месте, чего ты действительно хочешь и на что готов опираться.','Какие внутренние схемы повторяются, что удерживает тебя на месте, чего ты действительно хочешь и на что готова опираться.'),links:[['directions','Твои направления'],['hypotheses','Твои наблюдения']]},
 {pt:'С',name:'Твой путь к цели',old:'Мой путь к цели',sub:'Точка С · Действия и новый опыт',desc:'Твои ориентиры, выбранное желание, стратегия действий и 28-дневный цикл изменений.',links:[]},
 {pt:'Финал',big:'✦',name:'Твои перемены',old:'Мои перемены',sub:'Финал · Замер результатов',desc:g('Что изменилось, что ты понял о себе, какие действия сработали и что берешь с собой дальше.','Что изменилось, что ты поняла о себе, какие действия сработали и что берешь с собой дальше.'),links:[]}];
var ART={
 crystal_1:['0','Твой первый выбор стратегии','Опору, которая уже есть внутри','Я могу выбирать, как действовать.'],
 mirror:['0','Диалог «Кто сейчас выбирает»','Умение различать привычную защиту и осознанный выбор','Прежде чем ответить, я замечаю, кто во мне выбирает.'],
 black_crystal:['0','Тест фонового состояния','Принятие своего фона без борьбы с ним','Мое состояние — сигнал, а не приговор.'],
 bridge:['0','Переход от знакомства к пути','Связь между тем, кто я есть, и тем, куда иду','Я могу сделать шаг, не зная всего заранее.'],
 compass:['0','Выбор направления','Внутренний ориентир','Я сверяюсь с собой, а не только с чужими ожиданиями.'],
 fire:['0','Встреча с собственной энергией','Живую силу и интерес','Мой интерес подсказывает, куда вкладывать силы.'],
 lantern:['0','Работа со вниманием','Свет внимания в непонятной ситуации','Я могу посмотреть внимательнее, прежде чем решать.'],
 path_crystal:['0','Начало маршрута','Ясность пути','Мой путь складывается из маленьких шагов.'],
 hero_passport:['0','Твой первый портрет','Исходный образ себя','Я знаю, каким начал'+g('','а')+' этот путь.'],
 source:['А','Ресурсы и тело','Источник энергии','Я замечаю, что меня наполняет.'],
 wheel:['А','Карта исходного положения','Честную картину жизни сейчас','Я вижу, где у меня полно, а где пусто.'],
 key:['Б','Разбор установки','Возможность открыть закрытое правило','У любого правила есть дверь.'],
 sword:['Б','Стирание установки','Решимость отсечь лишнее','Я могу отказаться от правила, которое мне мешает.'],
 wish_star:['Б','Заявка желания','Собственное желание','Мое желание имеет право на жизнь.'],
 guardian_measure:['Б','Встреча со Стражем','Чувство меры','Мне не нужно доказывать все сразу.'],
 guardian_experience:['Б','Встреча со Стражем','Опору на опыт','Мой опыт — ресурс, а не груз.'],
 guardian_connection:['Б','Встреча со Стражем','Связь с людьми','Я могу опираться на других.'],
 guardian_clarity:['Б','Встреча со Стражем','Трезвый взгляд','Я отличаю факт от страха.'],
 guardian_boundaries:['Б','Встреча со Стражем','Свои границы','Мое «нет» защищает мое «да».'],
 guardian_pace:['Б','Встреча со Стражем','Свой темп','Я иду в своем ритме.'],
 guardian_companion:['Б','Встреча со Стражем','Внутреннего союзника','Защитник во мне может стать помощником.'],
 proof_sign:['С','Сверка 21 дня в трекере','Подтверждение делом','Я уже делаю, а не только собираюсь.'],
 path_map:['Финал','Личная карта пути','Весь пройденный маршрут','Я вижу, как далеко прошл'+g('ел','а')+'.']};
function idOf(x){return window.GArts&&GArts.idOf?GArts.idOf(x):x}
function artPt(id){var at=(P.artsAt||{})[id];if(at&&at.src){var st=FL.find(function(s){return s.u===at.src});if(st)return st.pt}return (ART[id]||['0'])[0]}
function artName(id){return window.GArts?GArts.label(id,P):id}
function artIcon(id){return window.GArts&&GArts.icon?GArts.icon(id):'✦'}
function artHtml(id){return window.GArts&&GArts.iconHtml?GArts.iconHtml(id):esc(artIcon(id))}
function steps(pt){return FL.filter(function(s){return s.pt===pt&&!/^(index|form|elder|hero)\.html/.test(s.u)})}
function status(c){var st=steps(c.pt),d=st.filter(function(s){return comp[s.u]}).length,now=st.some(function(s){return s.u===curU});if(st.length&&d===st.length)return 'done';if(d||now)return 'now';return c.pt==='Финал'?'ahead':'lock'}
var SL={done:'Пройдено',now:'В процессе',lock:'Закрыто',ahead:'Еще впереди'};
var arts=(P.arts||[]).map(idOf).filter(Boolean);
function $(id){return document.getElementById(id)}
/* 1. портрет */
var n=H.layers&&H.layers.positions&&H.layers.positions.A,nat=H.nature;
$('hName').textContent=P.name||g('Герой','Героиня');
$('hRole').textContent=nat&&window.GNature?GNature.name(nat.primary,female):n?'Профиль героя':'Нужна дата рождения';
$('hArc').textContent=n?'Основной ресурс':'—';
if(n){$('hArcL').textContent='Твой основной ресурс';try{var ar=GPassportData.arcana[n-1],rf=String(ar.resource||'');rf=window.GPassport&&GPassport.say?GPassport.say(rf,P.gender):rf;$('hArcT').textContent=rf.split(/(?<=\.)\s/)[0]}catch(e){}}
if(nat&&window.GNature){var am=GNature.A[nat.primary];$('hMech').textContent=GNature.name(nat.primary,female);$('hMechT').textContent=am.mech+'. '+am.lead.replace('Твоя естественная механика — ','Тебе естественно ').replace(/\.$/,'')+'.'}else $('hMech').textContent='—';
$('cArc').onclick=function(){if(window.openPassport)openPassport('nature')};
$('cMech').onclick=function(){if(window.openPassport)openPassport('nature')};
$('hNat').onclick=function(){if(window.openPassport)openPassport('nature')};
/* 3. главы */
$('hist').innerHTML=CH.map(function(c,i){var s=status(c),A=arts.filter(function(a){return artPt(a)===c.pt});
 return '<button type="button" class="ch '+s+'" data-ch="'+i+'"><span class="big">'+esc(c.big||c.pt)+'</span><span class="cb"><b>'+esc(c.name)+'</b><small>'+esc(c.sub)+'</small><em class="st">'+SL[s]+'</em><span class="ds">'+esc(s==='lock'||s==='ahead'?'Откроется: '+c.desc.charAt(0).toLowerCase()+c.desc.slice(1):c.desc)+'</span>'+(A.length?'<span class="ai">'+A.map(function(a){return '<i title="'+esc(artName(a))+'">'+artHtml(a)+'</i>'}).join('')+'</span>':'')+'</span></button>'}).join('');
var dlg=$('chD');
function open(h,t){$('chT').textContent=t;$('chB').innerHTML=h;$('chB').scrollTop=0;if(!dlg.open)dlg.showModal()}
function insights(c){return ((P.diary||{}).ins||[]).filter(function(e){var a=String(e.at||'');return a==='Герой · '+c.name||(c.old&&a==='Герой · '+c.old)||a==='Герой · Точка '+c.pt||(c.pt==='А'&&a==='Герой · Исходная точка')||(c.pt==='Б'&&a==='Герой · Перекресток')||(c.pt==='0'&&a==='Герой · Начало пути')||(c.pt==='С'&&a==='Герой · Путь к цели')})}
function chapter(i){var c=CH[i],s=status(c),st=steps(c.pt),D=st.filter(function(x){return comp[x.u]});
 if(s==='lock'||s==='ahead')return open('<p class="pnotice">Эта глава откроется, когда ты до нее дойдешь.</p><p>'+esc(c.desc)+'</p>',c.name);
 var B=(P.diary||{}).blocks||[],h='<p class="pmuted">'+esc(c.sub)+' · '+SL[s]+'</p>';
 h+='<h3>Что ты исследовал'+g('','а')+'</h3>'+(D.length?'<ul class="ptl">'+D.map(function(x){return '<li>'+esc(x.t)+'</li>'}).join('')+'</ul>':'<p class="pmuted">Пока ничего не пройдено.</p>');
 var found=[];if(c.pt==='0'&&nat&&window.GNature){var A0=GNature.A[nat.primary];found.push(['Твоя ведущая механика: '+GNature.name(nat.primary,female),A0.lead])}
 D.forEach(function(x){var b=B.find(function(b){return b.step===x.u});if(b){var t=b.insight||b.lead||b.strong;if(t)found.push([b.title||x.t,String(t)])}});
 if(c.pt==='Финал'&&P.pathFinal){[['Что изменилось',P.pathFinal.changed],['Что сработало',P.pathFinal.worked],['Что берешь с собой',P.pathFinal.next]].forEach(function(r){if(r[1])found.push(r)})}
 var L=(c.links||[]).filter(function(x){return x[0]==='nature'||(H.OPEN&&H.OPEN[x[0]]&&H.layers)});
 h+='<h3>Что ты открыл'+g('','а')+' о себе</h3>'+(found.length?found.map(function(f){return '<p><b>'+esc(f[0])+'</b><br>'+esc(f[1].length>220?f[1].slice(0,217)+'…':f[1])+'</p>'}).join(''):'<p class="pmuted">Выводы появятся здесь по мере прохождения заданий.</p>')+(L.length?'<div class="pbtns">'+L.map(function(x){return '<button type="button" data-open="'+x[0]+'">'+esc(x[1])+'</button>'}).join('')+'</div>':'');
 var I=insights(c);h+='<h3>Твой инсайт</h3>'+(I.length?I.map(function(e){return '<blockquote>'+esc(e.x)+'</blockquote>'}).join(''):'<p class="pmuted">«Я заметил'+g('','а')+', что часто… Теперь я понимаю, что…»</p>')+'<textarea id="insTx" rows="3" maxlength="4000" placeholder="Запиши свой инсайт"></textarea><div class="pbtns"><button type="button" id="insSave" data-ch="'+i+'">Записать в дневник</button></div><p class="pmuted" id="insFb" aria-live="polite"></p>';
 var A=arts.filter(function(a){return artPt(a)===c.pt});h+='<h3>Что ты получил'+g('','а')+'</h3>'+(A.length?'<div class="artgrid">'+A.map(function(a){return '<button type="button" class="art" data-art="'+esc(a)+'"><span>'+artHtml(a)+'</span><small>'+esc(artName(a))+'</small></button>'}).join('')+'</div>':'<p class="pmuted">Артефакты этой главы появятся после заданий.</p>');
 open(h,c.name)}
function artCard(a){var m=ART[a]||['','Пройденный шаг','Пройденный этап пути','Я иду своим путем.'],at=(P.artsAt||{})[a],st=at&&FL.find(function(s){return s.u===at.src});
 open('<div class="artbig">'+artHtml(a)+'</div><p><b>За что получен</b><br>'+esc(st?st.t:m[1])+(at&&at.t?' · '+new Date(at.t).toLocaleDateString('ru-RU'):'')+'</p><p><b>Что символизирует</b><br>'+esc(m[2])+'</p><p><b>Какую опору напоминает</b><br>«'+esc(m[3])+'»</p><div class="pbtns"><button type="button" data-back="'+esc(CH.findIndex(function(c){return c.pt===artPt(a)}))+'">← К главе</button></div>',artName(a))}
$('hist').onclick=function(e){var b=e.target.closest('[data-ch]');if(b)chapter(+b.dataset.ch)};
$('chX').onclick=function(){dlg.close()};dlg.addEventListener('click',function(e){if(e.target===dlg)return dlg.close();var o=e.target.closest('[data-open]'),ar=e.target.closest('[data-art]'),bk=e.target.closest('[data-back]');
 if(o){dlg.close();if(window.openPassport)openPassport(o.dataset.open)}else if(ar)artCard(ar.dataset.art);else if(bk)chapter(+bk.dataset.back);
 else if(e.target.id==='insSave'){var v=$('insTx').value.trim();if(!v){$('insFb').textContent='Сначала напиши пару слов.';return}var c=CH[+e.target.dataset.ch],S=JSON.parse(localStorage.getItem('alch_v5_profile'))||{};S.diary=S.diary||{};S.diary.ins=S.diary.ins||[];var rec={x:v,d:Date.now(),at:'Герой · '+c.name};S.diary.ins.push(rec);localStorage.setItem('alch_v5_profile',JSON.stringify(S));P.diary=P.diary||{};P.diary.ins=P.diary.ins||[];P.diary.ins.push(rec);chapter(+e.target.dataset.ch);$('insFb').textContent='Записано в дневник.'}});
/* 4b. Мой портрет коротко (перенесено из темного листа) и все артефакты */
(function(){var L=[],D=window.POCHERK_DIRS||{},CARDS={s:'Тропа молний',n:'Туманная долина',str:'Горный перевал',z:'Река попутчиков',f:'Пусть выберет судьба'};
 if(CARDS[P.mapStyle])L.push(['Твой путь',CARDS[P.mapStyle]]);
 if(P.pocherk&&P.pocherk.lead&&(D[P.pocherk.lead]||P.pocherk.leads))L.push(['Твоя стратегия выбора',P.pocherk.mixed&&P.pocherk.leads?P.pocherk.leads.map(function(k){return D[k]}).filter(Boolean).join(' и '):D[P.pocherk.lead]]);
 if(P.ego&&P.ego.top)L.push(['Знакомое состояние','«'+P.ego.top+'»']);
 if(P.archB&&P.archB.top)L.push(['Привычный ход',P.archB.top]);
 if(P.lab&&P.lab.lead&&window.GPAT&&GPAT[P.lab.lead])L.push(['Установка в работе',GPAT[P.lab.lead].n]);
 var v=(P.valuesCore&&P.valuesCore.top3)||[];if(v.length)L.push(['Три ориентира',v.join(', ')]);
 if(P.fractal&&P.fractal.lever&&P.fractal.lever.title)L.push(['Точка влияния',P.fractal.lever.title]);
 if(P.archD&&P.archD.top&&P.archD.d1t)L.push(['Выбранное состояние',P.archD.top]);
 var el=$('hPort');if(el){if(L.length)el.innerHTML='<div class="hh"><b>ТВОЙ ПОРТРЕТ</b><small>коротко</small></div><div class="prt">'+L.map(function(x){return '<div class="r"><span>'+esc(x[0])+'</span><b>'+esc(x[1])+'</b></div>'}).join('')+'</div>';else el.remove()}
 var es=$('hSum');if(es){var HS=window.GHeroSum?GHeroSum.build(P):null,blk='';if(HS){[['ЧТО У ТЕБЯ УЖЕ ХОРОШО РАБОТАЕТ',HS.good],['ЧТО ЧАЩЕ МЕШАЕТ',HS.hard],['ЧТО ТЫ УЗНАЛ'+(female?'А':'')+' О СЕБЕ',HS.learned]].forEach(function(z){if(z[1].length)blk+='<div class="hh"><b>'+z[0]+'</b></div><div class="prt">'+z[1].map(function(x){return '<div class="r"><b style="font-size:16px">'+esc(x)+'</b></div>'}).join('')+'</div>'})}if(blk)es.innerHTML=blk;else es.remove()}
 var ea=$('hArts');if(ea){if(arts.length)ea.innerHTML='<div class="hh" id="arts"><b>ТВОИ АРТЕФАКТЫ</b><small>'+arts.length+'</small></div><div class="artgrid">'+arts.map(function(a){return '<button type="button" class="art" data-art="'+esc(a)+'"><span>'+artHtml(a)+'</span><small>'+esc(artName(a))+'</small></button>'}).join('')+'</div>';else ea.remove()}
 if(ea)ea.addEventListener('click',function(e){var b=e.target.closest('[data-art]');if(!b)return;var t=$('chB');var tmp=document.createElement('div');tmp.innerHTML='<button data-art="'+b.getAttribute('data-art')+'"></button>';if(!dlg.open){open('',artName(b.getAttribute('data-art')))}t.appendChild(tmp.firstChild);t.lastChild.click()});
 if(location.hash==='#arts'&&ea){setTimeout(function(){try{ea.scrollIntoView({block:'start'})}catch(e){}},300)}
 if(!P.heroSeen){var gt=document.createElement('div');gt.id='heroGate';gt.innerHTML='<h1>'+'Персонаж создан'+'</h1><button type="button" class="go" id="seeHero">Продолжить</button>';document.body.appendChild(gt);
  $('seeHero').onclick=function(){try{var S=JSON.parse(localStorage.getItem('alch_v5_profile'))||{};S.heroSeen=Date.now();localStorage.setItem('alch_v5_profile',JSON.stringify(S))}catch(e){}P.heroSeen=1;gt.remove()}}
})();
/* 5. кнопки */
function dest(doComplete){if(window.GReview)return 'tasks.html';if(!window.GRoute)return 'choose.html';if(doComplete&&GRoute.resume()==='hero.html')GRoute.complete('hero.html');var href=GRoute.resume();if(href==='hero.html')href='choose.html';return window.GOpening?GOpening.url(href):href}
$('hGo').onclick=function(){try{location.href=dest(true)}catch(e){location.href='choose.html'}};
$('hBack').onclick=function(){var r=document.referrer||'',ok=false;if(/herocard\.html/.test(r)){try{r=sessionStorage.getItem('heroRef')||''}catch(e){}}try{var u=new URL(r);ok=u.host===location.host&&!/(hero|herocard)\.html$/.test(u.pathname)&&/\.html$|\/$/.test(u.pathname)}catch(e){}if(ok){location.href=r}else{var q=new URLSearchParams(location.search);q.delete('v');q.delete('section');var m='map.html'+(String(q)?'?'+q:'');location.href=window.GOpening?GOpening.url(m):m}};
var q=new URLSearchParams(location.search).get('section');if(q==='arts'){var k=CH.findIndex(function(c){return status(c)!=='lock'&&status(c)!=='ahead'&&arts.some(function(a){return artPt(a)===c.pt})});if(k>=0)chapter(k)}
})();
