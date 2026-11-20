/* Вкладка «Герой» — личное досье путешественника.
   1) портрет и личность, 2) «Моя природа», 3) «Моя история»: 5 глав по точкам маршрута GFLOW,
   внутри каждой: что исследовал, что открыл о себе, мой инсайт, что получил (артефакты главы).
   Главы наполняются по мере прохождения; закрытые приглушены. Данные: alch_v5_profile. */
(function(){
var H=window.GHeroData||{},P=H.P||{},female=P.gender==='f',esc=H.esc||function(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
function g(m,f){return female?f:m}
var FL=window.GFLOW||[],comp=(P.flow||{}).completed||{},curU=(P.flow||{}).current||'';
var CH=[
 {pt:'0',name:'Начало пути',sub:'Точка 0 · Знакомство с собой',desc:'Кто я, как устроена моя природа, какие стратегии и привычные реакции влияют на мой выбор.',links:[['nature','Моя природа'],['positions','Грани героя']]},
 {pt:'А',name:'Моя исходная точка',sub:'Точка А · Реальная картина жизни',desc:'Что происходит в моей жизни сейчас, где есть удовлетворенность, где дефицит, какие сферы требуют внимания.',links:[['numbers','Мои опоры']]},
 {pt:'Б',name:'Мой перекресток',sub:'Точка Б · Установки и желания',desc:g('Какие внутренние схемы повторяются, что удерживает меня на месте, чего я действительно хочу и на что готов опираться.','Какие внутренние схемы повторяются, что удерживает меня на месте, чего я действительно хочу и на что готова опираться.'),links:[['directions','13 направлений'],['hypotheses','Мои наблюдения'],['library','Все 22 аркана']]},
 {pt:'С',name:'Мой путь к цели',sub:'Точка С · Действия и новый опыт',desc:'Мои ориентиры, выбранное желание, стратегия действий и 28-дневный цикл изменений.',links:[]},
 {pt:'Финал',big:'✦',name:'Мои перемены',sub:'Финал · Замер результатов',desc:g('Что изменилось, что я понял о себе, какие действия сработали и что беру с собой дальше.','Что изменилось, что я поняла о себе, какие действия сработали и что беру с собой дальше.'),links:[]}];
var ART={
 crystal_1:['0','Твой первый выбор стратегии','Опору, которая уже есть внутри','Я могу выбирать, как действовать.'],
 mirror:['0','Диалог «Кто сейчас выбирает»','Умение различать привычную защиту и осознанный выбор','Прежде чем ответить, я замечаю, кто во мне выбирает.'],
 black_crystal:['0','Тест фонового состояния','Принятие своего фона без борьбы с ним','Мое состояние — сигнал, а не приговор.'],
 bridge:['0','Переход от знакомства к пути','Связь между тем, кто я есть, и тем, куда иду','Я могу сделать шаг, не зная всего заранее.'],
 compass:['0','Выбор направления','Внутренний ориентир','Я сверяюсь с собой, а не только с чужими ожиданиями.'],
 fire:['0','Встреча с собственной энергией','Живую силу и интерес','Мой интерес подсказывает, куда вкладывать силы.'],
 lantern:['0','Работа со вниманием','Свет внимания в непонятной ситуации','Я могу посмотреть внимательнее, прежде чем решать.'],
 path_crystal:['0','Начало маршрута','Ясность пути','Мой путь складывается из маленьких шагов.'],
 hero_passport:['0','Мой первый портрет','Исходный образ себя','Я знаю, каким начал'+g('','а')+' этот путь.'],
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
function steps(pt){return FL.filter(function(s){return s.pt===pt&&!/^(index|form|elder|hero)\.html/.test(s.u)})}
function status(c){var st=steps(c.pt),d=st.filter(function(s){return comp[s.u]}).length,now=st.some(function(s){return s.u===curU});if(st.length&&d===st.length)return 'done';if(d||now)return 'now';return c.pt==='Финал'?'ahead':'lock'}
var SL={done:'Пройдено',now:'В процессе',lock:'Закрыто',ahead:'Еще впереди'};
var arts=(P.arts||[]).map(idOf).filter(Boolean);
function $(id){return document.getElementById(id)}
/* 1. портрет */
var n=H.layers&&H.layers.positions&&H.layers.positions.A,nat=H.nature;
$('hName').textContent=P.name||g('Герой','Героиня');
$('hRole').textContent=n?H.title(n):'Нужна дата рождения';
$('hArc').textContent=n?String(n):'—';
$('hMech').textContent=nat&&window.GNature?GNature.name(nat.primary,female):'—';
$('hNat').onclick=function(){if(window.openPassport)openPassport('nature')};
/* 3. главы */
$('hist').innerHTML=CH.map(function(c,i){var s=status(c),A=arts.filter(function(a){return artPt(a)===c.pt});
 return '<button type="button" class="ch '+s+'" data-ch="'+i+'"><span class="big">'+esc(c.big||c.pt)+'</span><span class="cb"><b>'+esc(c.name)+'</b><small>'+esc(c.sub)+'</small><em class="st">'+SL[s]+'</em><span class="ds">'+esc(s==='lock'||s==='ahead'?'Откроется: '+c.desc.charAt(0).toLowerCase()+c.desc.slice(1):c.desc)+'</span>'+(A.length?'<span class="ai">'+A.map(function(a){return '<i title="'+esc(artName(a))+'">'+esc(artIcon(a))+'</i>'}).join('')+'</span>':'')+'</span></button>'}).join('');
var dlg=$('chD');
function open(h,t){$('chT').textContent=t;$('chB').innerHTML=h;$('chB').scrollTop=0;if(!dlg.open)dlg.showModal()}
function insights(c){return ((P.diary||{}).ins||[]).filter(function(e){var a=String(e.at||'');return a==='Герой · '+c.name||a==='Герой · Точка '+c.pt||(c.pt==='А'&&a==='Герой · Исходная точка')||(c.pt==='Б'&&a==='Герой · Перекресток')||(c.pt==='0'&&a==='Герой · Начало пути')||(c.pt==='С'&&a==='Герой · Путь к цели')})}
function chapter(i){var c=CH[i],s=status(c),st=steps(c.pt),D=st.filter(function(x){return comp[x.u]});
 if(s==='lock'||s==='ahead')return open('<p class="pnotice">Эта глава откроется, когда ты до нее дойдешь.</p><p>'+esc(c.desc)+'</p>',c.name);
 var B=(P.diary||{}).blocks||[],h='<p class="pmuted">'+esc(c.sub)+' · '+SL[s]+'</p>';
 h+='<h3>Что я исследовал'+g('','а')+'</h3>'+(D.length?'<ul class="ptl">'+D.map(function(x){return '<li>'+esc(x.t)+'</li>'}).join('')+'</ul>':'<p class="pmuted">Пока ничего не пройдено.</p>');
 var found=[];if(c.pt==='0'&&nat&&window.GNature){var A0=GNature.A[nat.primary];found.push(['Моя ведущая механика: '+GNature.name(nat.primary,female),A0.lead])}
 D.forEach(function(x){var b=B.find(function(b){return b.step===x.u});if(b){var t=b.insight||b.lead||b.strong;if(t)found.push([b.title||x.t,String(t)])}});
 if(c.pt==='Финал'&&P.pathFinal){[['Что изменилось',P.pathFinal.changed],['Что сработало',P.pathFinal.worked],['Что беру с собой',P.pathFinal.next]].forEach(function(r){if(r[1])found.push(r)})}
 var L=(c.links||[]).filter(function(x){return x[0]==='nature'||(H.OPEN&&H.OPEN[x[0]]&&H.layers)});
 h+='<h3>Что я открыл'+g('','а')+' о себе</h3>'+(found.length?found.map(function(f){return '<p><b>'+esc(f[0])+'</b><br>'+esc(f[1].length>220?f[1].slice(0,217)+'…':f[1])+'</p>'}).join(''):'<p class="pmuted">Выводы появятся здесь по мере прохождения заданий.</p>')+(L.length?'<div class="pbtns">'+L.map(function(x){return '<button type="button" data-open="'+x[0]+'">'+esc(x[1])+'</button>'}).join('')+'</div>':'');
 var I=insights(c);h+='<h3>Мой инсайт</h3>'+(I.length?I.map(function(e){return '<blockquote>'+esc(e.x)+'</blockquote>'}).join(''):'<p class="pmuted">«Я заметил'+g('','а')+', что часто… Теперь я понимаю, что…»</p>')+'<textarea id="insTx" rows="3" maxlength="4000" placeholder="Запиши свой инсайт"></textarea><div class="pbtns"><button type="button" id="insSave" data-ch="'+i+'">Записать в дневник</button></div><p class="pmuted" id="insFb" aria-live="polite"></p>';
 var A=arts.filter(function(a){return artPt(a)===c.pt});h+='<h3>Что я получил'+g('','а')+'</h3>'+(A.length?'<div class="artgrid">'+A.map(function(a){return '<button type="button" class="art" data-art="'+esc(a)+'"><span>'+esc(artIcon(a))+'</span><small>'+esc(artName(a))+'</small></button>'}).join('')+'</div>':'<p class="pmuted">Артефакты этой главы появятся после заданий.</p>');
 open(h,c.name)}
function artCard(a){var m=ART[a]||['','Пройденный шаг','Пройденный этап пути','Я иду своим путем.'],at=(P.artsAt||{})[a],st=at&&FL.find(function(s){return s.u===at.src});
 open('<div class="artbig">'+esc(artIcon(a))+'</div><p><b>За что получен</b><br>'+esc(st?st.t:m[1])+(at&&at.t?' · '+new Date(at.t).toLocaleDateString('ru-RU'):'')+'</p><p><b>Что символизирует</b><br>'+esc(m[2])+'</p><p><b>Какую опору напоминает</b><br>«'+esc(m[3])+'»</p><div class="pbtns"><button type="button" data-back="'+esc(CH.findIndex(function(c){return c.pt===artPt(a)}))+'">← К главе</button></div>',artName(a))}
$('hist').onclick=function(e){var b=e.target.closest('[data-ch]');if(b)chapter(+b.dataset.ch)};
$('chX').onclick=function(){dlg.close()};dlg.addEventListener('click',function(e){if(e.target===dlg)return dlg.close();var o=e.target.closest('[data-open]'),ar=e.target.closest('[data-art]'),bk=e.target.closest('[data-back]');
 if(o){dlg.close();if(window.openPassport)openPassport(o.dataset.open)}else if(ar)artCard(ar.dataset.art);else if(bk)chapter(+bk.dataset.back);
 else if(e.target.id==='insSave'){var v=$('insTx').value.trim();if(!v){$('insFb').textContent='Сначала напиши пару слов.';return}var c=CH[+e.target.dataset.ch],S=JSON.parse(localStorage.getItem('alch_v5_profile'))||{};S.diary=S.diary||{};S.diary.ins=S.diary.ins||[];var rec={x:v,d:Date.now(),at:'Герой · '+c.name};S.diary.ins.push(rec);localStorage.setItem('alch_v5_profile',JSON.stringify(S));P.diary=P.diary||{};P.diary.ins=P.diary.ins||[];P.diary.ins.push(rec);chapter(+e.target.dataset.ch);$('insFb').textContent='Записано в дневник.'}});
/* 5. кнопки */
function dest(doComplete){if(window.GReview)return 'tasks.html';if(!window.GRoute)return 'choose.html';if(doComplete&&GRoute.resume()==='hero.html')GRoute.complete('hero.html');var href=GRoute.resume();if(href==='hero.html')href='choose.html';return window.GOpening?GOpening.url(href):href}
$('hGo').onclick=function(){try{location.href=dest(true)}catch(e){location.href='choose.html'}};
$('hBack').onclick=function(){if(history.length>1&&document.referrer&&document.referrer.indexOf(location.host)>=0)history.back();else location.href=window.GOpening?GOpening.url('map.html'):'map.html'};
var q=new URLSearchParams(location.search).get('section');if(q==='arts'){var k=CH.findIndex(function(c){return status(c)!=='lock'&&status(c)!=='ahead'&&arts.some(function(a){return artPt(a)===c.pt})});if(k>=0)chapter(k)}
})();
