/* Каталог и активация практик. История запусков не затирается. Система рекомендует, человек подтверждает или выбирает сам. */
(function(){
'use strict';
var CAT=[
  {id:'signs', lv:1, group:'base', t:'Знаки дня', len:28, load:'2 минуты',
    d:'Записываешь, что в жизни откликнулось на твое желание.',
    why:'Базовая фиксация внимания.',
    effect:'Легче замечать движение к желанию.',
    min:'Одна короткая запись.',
    done:'Хотя бы несколько знаков за цикл.',
    daily:'Запиши один знак дня.'},
  {id:'grat', lv:1, group:'base', t:'Дневник благодарности', len:10, load:'3–5 минут',
    d:'Каждый день минимум 10 благодарностей, цель цикла 50.',
    why:'Базовая опора внимания на то, что уже есть.',
    effect:'Мягче фон дня, больше опоры.',
    min:'Три благодарности.',
    done:'Практика шла задуманное число дней или накопилось 50.',
    daily:'Запиши благодарности дня.'},
  {id:'choose', lv:1, group:'base', t:'Выбираю — делаю — сделано', len:7, load:'5 минут',
    d:'Дела дня по шагам. После каждого третьего появляется строчка с твоим желанием.',
    why:'Собирает внимание на собственных действиях.',
    effect:'Яснее, что ты действительно делаешь.',
    min:'Один шаг «выбрал — сделал».',
    done:'Семь уникальных дней с записью.',
    daily:'Выбери одно дело, сделай, отметь.'},
  {id:'pract', lv:1, group:'base', t:'Вдох-выдох, Я есмь, Тихое внимание', len:7, load:'2 минуты',
    d:'Короткие практики на возвращение в настоящий момент.',
    why:'Базовый возврат в тело и момент.',
    effect:'Больше присутствия.',
    min:'Три медленных вдоха.',
    done:'Семь дней с отметкой.',
    daily:'Сделай короткую практику и поставь отметку.'},
  {id:'brake', lv:2, group:'research', t:'Слова-тормоза', len:7, load:'3 минуты',
    d:'Ловишь слово, которое тормозит, и видишь мягкую замену.',
    why:'Полезно, если в установках часто звучат запреты и «я должен».',
    effect:'Меньше автоматических стоп-фраз.',
    min:'Заметить одно слово-тормоз.',
    done:'Семь дней наблюдений.',
    daily:'Заметь слово и его мягкую замену.',
    need:function(P){return !!(P.lab||P.betray||(P.kmTest&&P.kmTest.v))}},
  {id:'betray', lv:2, group:'research', t:'Колесо тени и опоры', len:28, load:'1 минута',
    d:'Колесо за цикл: где ты теряешь себя и где уже поддерживаешь себя. Отметки ставятся в «Разборе дня».',
    why:'Открывается, если уже было колесо тени и опоры.',
    effect:'Видно и то, где ты себя предаешь, и то, где ты молодец.',
    min:'Одна отметка в разборе дня.',
    done:'Отметки в течение цикла.',
    daily:'Отметь в разборе дня одну тень или одну опору.',
    need:function(P){return !!(P.betray&&(P.betray.done||P.betray.picked))}},
  {id:'hours', lv:2, group:'research', t:'Блоки времени', len:1, load:'10 минут',
    d:'Почасовая сетка дня: куда уходят время, силы и внимание.',
    why:'Когда неясно, куда девается ресурс времени.',
    effect:'Виднее картина дня.',
    min:'Отметь несколько часов.',
    done:'Один заполненный день.',
    daily:'Заполни сетку дня.'},
  {id:'want', lv:2, group:'research', t:'Собственное хочу', len:7, load:'3 минуты',
    d:'Каждый день коротко записываешь, чего хочешь ты сам, отдельно от чужих ожиданий.',
    why:'Полезно при конфликте своих желаний и обязательств.',
    effect:'Яснее собственный выбор.',
    min:'Одна фраза «я хочу».',
    done:'Семь записей.',
    daily:'Напиши одно свое «хочу» сегодня.',
    need:function(P){return !!(P.desireLab||P.selfWorth||P.interact)}, journal:true},
  {id:'bounds', lv:2, group:'research', t:'Границы и распределение сил', len:7, load:'3 минуты',
    d:'Замечаешь, где сегодня отдал силы чужому, и выбираешь одну границу.',
    why:'Если часто уходишь в чужие задачи.',
    effect:'Ровнее расход сил.',
    min:'Заметить одно место, где силы ушли вовне.',
    done:'Семь наблюдений.',
    daily:'Отметь границу дня.', journal:true},
  /* Уровень 2: по результатам исследований. Ежедневная короткая запись. */
  {id:'enough', lv:2, group:'research', journal:true, t:'Достаточно хорошо', len:7, load:'3 минуты',
    d:'Завершаешь одно дело без идеала и засчитываешь его.', why:'Если в результатах заметны перфекционизм и строгая самокритика.',
    effect:'Меньше переработок, больше завершенного.', min:'Одно дело, засчитанное без доделок.', done:'Семь записей.', daily:'Что ты сегодня {засчитал|засчитала} как достаточно хорошее?',
    need:function(P){return hi(P,'respTest','RS05')||hi(P,'selfWorth','SV02')||bw(P,'perf')}},
  {id:'letgo', lv:2, group:'research', journal:true, t:'Отпускаю контроль', len:7, load:'3 минуты',
    d:'Каждый день отпускаешь одну вещь, которая не в твоей власти, или поручаешь ее.', why:'Если заметны гиперконтроль и привычка все удерживать самому.',
    effect:'Ровнее нагрузка, больше доверия.', min:'Назвать одну вещь, которую можно отпустить.', done:'Семь записей.', daily:'Что ты сегодня {отпустил|отпустила} или {поручил|поручила}?',
    need:function(P){return hi(P,'respTest','RS06')||bw(P,'ctrl')||ad(P,'A2')}},
  {id:'guilt', lv:2, group:'research', journal:true, t:'Без лишней вины', len:7, load:'3 минуты',
    d:'Разделяешь свою часть и чужую в одной ситуации дня.', why:'Если вина и ответственность за других звучат громко.',
    effect:'Спокойнее отказывать и не тащить чужое.', min:'Одна фраза «это моя часть, а это не моя».', done:'Семь записей.', daily:'Где сегодня твоя часть, а где не твоя?',
    need:function(P){return hi(P,'respTest','RS02')||hi(P,'selfWorth','SV04')||hi(P,'kmTest','KM03')}},
  {id:'chooseme', lv:2, group:'research', journal:true, t:'Выбираю себя', len:7, load:'2–5 минут',
    d:'Замечаешь ситуацию, где свои потребности снова на последнем месте, и выбираешь одно действие в свою пользу.', why:'Если заметны угождение и чрезмерная отдача.',
    effect:'Свое «хочу» перестает ждать.', min:'Заметить одну такую ситуацию.', done:'Семь записей.', daily:'Что ты сегодня {сделал|сделала} в свою пользу?',
    need:function(P){return bw(P,'please')||bw(P,'over')||ad(P,'A3')}},
  {id:'mine', lv:2, group:'research', journal:true, t:'Присваиваю результат', len:7, load:'2 минуты',
    d:'Каждый день записываешь один результат и говоришь себе: «Это сделал{|а} я».', why:'Если хорошее быстро обесценивается и кажется, что всего мало.',
    effect:'Удовлетворение держится дольше.', min:'Один результат дня.', done:'Семь записей.', daily:'Какой результат ты сегодня {присвоил|присвоила}?',
    need:function(P){return fam(P,'S6')||hi(P,'selfWorth','SV05')||bw(P,'perf')}},
  {id:'risk', lv:2, group:'research', journal:true, t:'Риск или предположение', len:7, load:'3 минуты',
    d:'Одну тревожную мысль делишь на факт и предположение.', why:'Если внимание часто ищет возможные сложности.',
    effect:'Меньше напряжения без потери осторожности.', min:'Одна мысль: факт или догадка.', done:'Семь записей.', daily:'Что сегодня было фактом, а что предположением?',
    need:function(P){return fam(P,'S5')||hi(P,'kmTest','KM01')}},
  {id:'contact', lv:2, group:'research', journal:true, t:'Восстанавливаю контакт', len:7, load:'3 минуты',
    d:'Один раз в день прямо говоришь о своей потребности или делаешь шаг навстречу.', why:'Если ты часто уходишь в себя или отдаляешься.',
    effect:'Больше поддержки рядом.', min:'Одно сообщение или фраза о себе.', done:'Семь записей.', daily:'Кому и о чем ты сегодня {сказал|сказала}?',
    need:function(P){return fam(P,'S7')||fam(P,'S4')||ad(P,'A4')||bw(P,'detach')}},
  {id:'myzone', lv:2, group:'research', journal:true, t:'Шаг в зоне влияния', len:7, load:'2 минуты',
    d:'Находишь одну вещь, которая точно зависит от тебя, и делаешь ее.', why:'Если бывает ощущение, что выбор ограничен.',
    effect:'Возвращается чувство выбора.', min:'Одно маленькое действие.', done:'Семь записей.', daily:'Что сегодня зависело от тебя и ты это {сделал|сделала}?',
    need:function(P){return fam(P,'S8')||hi(P,'kmTest','KM05')||bw(P,'numb')}},
  {id:'mydecision', lv:2, group:'research', journal:true, t:'Мое решение', len:7, load:'2 минуты',
    d:'Фиксируешь одно решение, принятое по своему выбору, без ожидания одобрения.', why:'Если важна внешняя оценка.',
    effect:'Опора на свой выбор.', min:'Одно решение одной фразой.', done:'Семь записей.', daily:'Какое решение сегодня было твоим?',
    need:function(P){return fam(P,'S3')||hi(P,'selfWorth','SV06')||hi(P,'kmTest','KM02')}},
  {id:'acceptsup', lv:2, group:'research', journal:true, t:'Принимаю поддержку', len:7, load:'2 минуты',
    d:'Каждый день принимаешь одну помощь или распределяешь одну задачу.', why:'Если ты привык{|ла} все делать сам{|а}.',
    effect:'Меньше перегрузки.', min:'Принять одну мелочь.', done:'Семь записей.', daily:'Какую поддержку ты сегодня {принял|приняла}?',
    need:function(P){return selfHeavy(P)}},
  /* Новые привычки и аскеза: включаются по выбору, срок можно выбрать. */
  {id:'habit', lv:2, group:'base', journal:true, t:'Новая привычка', len:21, load:'2–5 минут',
    d:'Выбираешь одно небольшое новое действие и повторяешь его каждый день. Пропуск не обнуляет путь.', why:'Новое действие закрепляется повторением, а не силой воли.',
    effect:'Действие становится привычнее и требует меньше усилий.', min:'Сделал{|а} хотя бы минимальную версию.', done:'Двадцать одна запись.', daily:'Какую привычку ты сегодня {повторил|повторила} и как это было?'},
  {id:'askeza', lv:2, group:'base', journal:true, t:'Аскеза', len:14, load:'1–2 минуты',
    d:'Добровольно берешь на себя одно обязательство или отказ на выбранный срок. Срок и правило выбираешь сам{|а}.', why:'Добровольное обязательство укрепляет внутреннюю опору.',
    effect:'Ощущение, что ты можешь опереться на свое слово.', min:'Отметка: удержал{|а} или нет, без оценки.', done:'Запись в каждый день срока.', daily:'Как сегодня прошла твоя аскеза? Что помогало, что мешало?'},
  /* Опорные практики: укрепляют то, что уже работает. */
  {id:'keepgood', lv:2, group:'support', journal:true, t:'Закрепляю хорошее', len:7, load:'2 минуты',
    d:'Записываешь одно хорошее событие дня и что ты почувствовал{|а} после.', why:'Укрепляет уже работающую радость и наполненность.',
    effect:'Хорошее остается с тобой дольше.', min:'Одно хорошее событие.', done:'Семь записей.', daily:'Что хорошего было сегодня и что осталось после?',
    need:function(P){return true}},
  {id:'create', lv:2, group:'support', journal:true, t:'Свое созидание', len:7, load:'10 минут',
    d:'Каждый день немного времени на свой интерес или идею.', why:'Если интерес и движение — твоя сильная сторона.',
    effect:'Энергия от своего дела.', min:'Пять минут на свой интерес.', done:'Семь записей.', daily:'Что ты сегодня {создал|создала} или {попробовал|попробовала}?',
    need:function(P){return fam(P,'S2')}}
];
function lvOf(P,f,id){var x=P[f];if(!x||!x.scales)return null;var s=x.scales.filter(function(z){return z.id===id})[0];return s&&s.level!=null?s.level:null}
function hi(P,f,id){var l=lvOf(P,f,id);return l!=null&&l>=2}
function bw(P,id){var B=P.betray||{},r=B.end||B.start;if(r&&r.sh&&typeof r.sh[id]==='number')return r.sh[id]>=2;return (B.picked||[]).indexOf(id)>=0}
function fam(P,s){var b=P.backgroundProfile,bg=b&&b.backgroundState;if(bg&&bg.version===2){var f=(bg.families||[]).filter(function(x){return x.id===s})[0],g=f&&bg.groups&&bg.groups[f.group];if(!(f&&g&&Array.isArray(g.leaders)&&g.leaders.indexOf(s)>=0))return false;if(f.group==='protective'){var context=bg.followup&&bg.followup.protectiveContext;return context==='Иногда есть факты, но моя реакция бывает сильнее самой ситуации.'||context==='Часто ощущение возникает раньше, чем я проверю факты и доступные варианты.'}return true}return !!(b&&b.levels&&b.levels[s]>=2)}
function ad(P,a){var b=P.backgroundProfile;return !!(b&&(b.adaptHyp||[]).indexOf(a)>=0)}
function selfHeavy(P){var b=P.backgroundProfile;return !!(b&&b.adaptations&&b.adaptations.A6>=5&&(b.adaptations.A3||0)<=2)}

function byId(id){return CAT.filter(function(x){return x.id===id})[0]||null}
function hist(T){T.practHist=T.practHist||[]; return T.practHist}
function act(T){T.act=T.act||{}; return T.act}

function openRun(T,id){var a=act(T)[id]; return a&&!a.stopped?a:null}
function filledOn(T,id,n){
  if(window.prFilledTrack)return window.prFilledTrack(T,id,n);
  var d=(T.days&&T.days[String(n)])||{};
  if(id==='grat')return (d.grat||[]).length>0;
  if(id==='choose')return (d.choose||[]).length>0;
  if(id==='brake')return (d.brakeWords||[]).length>0;
  if(id==='betray')return (d.betrayMarks||[]).length>0;
  if(id==='hours')return d.hours&&Object.keys(d.hours).length>0;
  if(id==='pract')return !!(d.practDone);
  if(id==='signs')return (d.signs||[]).length>0;
  if(id==='want')return !!(d.journal&&d.journal.want);
  if(id==='bounds')return !!(d.journal&&d.journal.bounds);
  return false;
}
function uniqueDays(T,id){
  var h=hist(T).filter(function(x){return x.id===id}), n=0, seen={};
  /* считаем уникальные дни по всем запускам и текущему */
  for(var i=1;i<=28;i++)if(filledOn(T,id,i)){n++; seen[i]=1}
  return n;
}

function unlocked(P,item){
  if(item.lv===1)return true;
  if(item.lv===2)return !item.need||item.need(P);
  return true;
}

function extrasActive(T,n){
  var c=0;
  CAT.forEach(function(x){
    if(x.id==='signs')return;
    var a=openRun(T,x.id);
    if(a&&n>=a.from&&n<a.from+a.len)c++;
  });
  return c;
}

function recs(P,T,n){
  n=n||1;
  var out=[], sim=window.GSim&&GSim.mode(T,n);
  function add(id,reason){
    var it=byId(id); if(!it)return;
    if(openRun(T,id))return;
    out.push({item:it, reason:reason});
  }
  if(sim&&(sim.id==='recovery'||sim.id==='soft')) add('pract','Состояние просит короткую опору, а не новые большие задачи.');
  if(sim&&GSim.lowDays&&GSim.lowDays(T,n,'energy')>=3) add('hours','Энергия низкая несколько дней. Стоит посмотреть, куда уходит ресурс.');
  var fails=(window.GSim&&GSim.lastRes)?GSim.lastRes(T,n,3):[];
  if(fails.filter(function(v){return v==='fail'||v==='min'}).length>=3) add('choose','Три дня не получается шаг. Можно собрать его через «выбираю — делаю».');
  /* уровень 3: по ежедневным отметкам */
  if(window.GSim&&GSim.trend&&GSim.trend(T,n,'mood')<=-1.5) add('keepgood','Настроение несколько дней снижается. Стоит опереться на то, что уже было хорошим.');
  var Bd=(P.betray&&P.betray.days)||{},keys=Object.keys(Bd).sort().slice(-5),sp=0;keys.forEach(function(k){var r=Bd[k]||{};if((r.sh||[]).some(function(x){return x==='please'||x==='over'}))sp++});
  if(sp>=3) add(unlocked(P,byId('chooseme'))?'chooseme':'bounds','Несколько дней подряд ты отмечаешь, что уходишь в чужие задачи и отдаешь больше, чем есть сил.');
  /* персонально по результатам всех исследований (не больше двух) */
  if(window.GStrategy&&GStrategy.practRec){try{GStrategy.practRec(P).forEach(function(r){add(r.id,r.why)})}catch(e){}}
  if(P.betray&&(P.betray.done||P.betray.picked)) add('betray','Колесо тени и опоры за цикл покажет, где ты теряешь себя и где поддерживаешь.');
  if(P.lab||P.kmTest) add('brake','В установках могут звучать слова-тормоза.');
  if(P.desireLab||P.selfWorth) add('want','Исследование желания и самоценности подсказывает практику собственного «хочу».');
  /* уникальные */
  var seen={}; return out.filter(function(x){if(seen[x.item.id])return false; seen[x.item.id]=1; return true}).slice(0,3);
}

function activate(T,id,n){
  var it=byId(id); if(!it)return {ok:false,err:'нет практики'};
  if(id!=='signs'&&extrasActive(T,n)>=2)return {ok:false,err:'Сейчас уже идут две дополнительные практики. Это верхняя граница обычной нагрузки.'};
  var a=act(T);
  a[id]={from:n,len:it.len,at:Date.now()};
  hist(T).push({id:id,from:n,len:it.len,at:Date.now()});
  return {ok:true};
}
function pause(T,id,n){
  var a=act(T)[id]; if(!a)return;
  a.len=Math.max(1,n-a.from+1); a.stopped=Date.now();
  var h=hist(T); for(var i=h.length-1;i>=0;i--){if(h[i].id===id&&!h[i].to){h[i].to=n;h[i].stopped=Date.now();h[i].days=uniqueDays(T,id);break}}
}
function complete(T,id,n){pause(T,id,n)}

function isOn(T,id,n){var a=openRun(T,id); return !!(a&&n>=a.from&&n<a.from+a.len)}

window.GPract={CAT:CAT,byId:byId,recs:recs,unlocked:unlocked,activate:activate,pause:pause,complete:complete,isOn:isOn,openRun:openRun,uniqueDays:uniqueDays,extrasActive:extrasActive,hist:hist,filledOn:filledOn};
})();
