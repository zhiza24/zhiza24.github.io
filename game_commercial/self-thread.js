/* Нить Самости: голос Самости (свитки), выводы тестов и вау-моменты по маршруту.
   Подключается сам из route.js. Ничего не хранит дважды: выводы тестов берет из P.diary.blocks
   (их пишет result-card.js), слова игрока из P.diary.ins, итог героя из GHeroSum.
   Свое хранит только в P.self: {voice:{id:ts}, wow:{id:{at,title,text}}}.
   Публично: GSelf.voice(id), GSelf.insights(P), GSelf.dailyQuestion(), GSelf.load(). */
(function(){
'use strict';
if(window.GSelf)return;
var K='alch_v5_profile';
var VOICE={"hero": {"title": "Здесь начинается знакомство", "p": ["Прежде чем мы начнем, я хочу предложить тебе одну мысль.", "Ты не обязан{|а} становиться кем-то другим, чтобы иметь право на собственную жизнь.", "Не нужно сначала исправить характер, избавиться от всех сомнений, стать увереннее, успешнее или удобнее для окружающих. Твое существование не является проектом, который необходимо довести до совершенства, прежде чем разрешить себе жить.", "Но со временем человек может настолько привыкнуть учитывать чужие ожидания, требования и представления о правильном, что начинает хуже различать собственные желания.", "Он знает, что должен делать. Знает, чего от него ждут. Иногда даже прекрасно понимает, каким ему следует быть. Но на вопрос «А чего хочу я?» ответить оказывается непросто.", "Эта лаборатория создана для знакомства с собой.", "Здесь мы будем исследовать твои предпочтения, интересы, желания, внутренние правила, привычные запреты и способы обращаться с собой.", "Не для того, чтобы найти в себе очередную ошибку. А для того, чтобы увидеть больше.", "Не нужно отвечать красиво. Не нужно торопиться. Не нужно заполнять все поля, если пока нечего сказать.", "Некоторые ответы могут появиться сразу. Другие — спустя время. А какие-то вопросы, возможно, останутся открытыми.", "Это нормально.", "Попробуй отнестись к себе с любопытством. Не как к человеку, которого нужно оценить, а как к человеку, которого интересно узнать.", "Начнем с самого простого.", "Ты есть. И этого достаточно, чтобы начать."]}, "iam": {"title": "Я есмь", "p": ["Попробуй на несколько мгновений остановиться.", "Не нужно ничего менять. Не нужно специально успокаиваться или создавать правильное настроение.", "Просто заметь: ты сейчас здесь.", "У тебя есть тело, ощущения, мысли, воспоминания, собственное восприятие происходящего. Есть то, что тебе нравится, и то, что не нравится. Есть вопросы, на которые ты пока не знаешь ответа.", "Все это — часть твоего опыта.", "Мы часто привыкаем оценивать свое право на хорошее отношение к себе через достижения, полезность и соответствие ожиданиям.", "Получилось — можно собой гордиться. Не получилось — начинаются претензии к себе.", "Но попробуй разделить две вещи: то, что ты делаешь, и сам факт твоего существования.", "Твои поступки можно пересматривать. Решения можно менять. Навыки можно развивать. Но тебе не нужно каждый день заново заслуживать право быть собой.", "В этом исследовании не требуется придумывать новую личность. Попробуй заметить ту, которая уже проявляется в твоих ощущениях, интересах и взглядах.", "Что ты замечаешь в себе, когда на время перестаешь себя оценивать?", "И что тебе хотелось бы разрешить себе не доказывать?", "Не ищи окончательный ответ. Начни с того, что действительно приходит тебе в голову.", "Magnolia bouquet in glass vase with book and cup of tea | Still life photography, Tea and books, Still life"]}, "wheel": {"title": "Момент, когда я отступаю от себя", "p": ["Иногда мы отказываемся от собственного желания так быстро, что даже не успеваем его рассмотреть.", "Возникает интерес — и тут же появляется мысль: не время.", "Хочется высказать мнение — но мы решаем промолчать.", "Появляется желание попросить о чем-то — и мы заранее убеждаем себя, что это слишком много.", "Иногда за этим стоит забота о безопасности, учет обстоятельств или желание сохранить отношения. И не каждое отступление от собственного желания является предательством себя.", "Но бывает и другое: мы автоматически обесцениваем то, что для нас важно.", "В этой теме не нужно обвинять себя за такие моменты. Попробуй просто восстановить один конкретный эпизод.", "Что ты хотел{|а}? Что произошло? Какая мысль остановила тебя? И что ты почувствовал{|а} после?", "Обрати внимание не только на сам поступок, но и на внутренний разговор, который ему предшествовал.", "Возможно, ты обнаружишь знакомую фразу. Возможно, заметишь, что в похожих ситуациях поступаешь по-разному.", "Наша задача — не запретить себе отступать. Наша задача — научиться замечать момент выбора.", "Потому что только замеченный выбор становится доступен для пересмотра.", "Who Is Speaking in Your Head? 11 Signs Your Inner Voice Is Borrowed | by Chris Mattice | Mar, 2026 | Medium"]}, "guard": {"title": "На чьей я стороне?", "p": ["Внутренний союзник — это не голос, который всегда говорит, что ты прав.", "И не голос, который обещает, что все получится.", "Это способ разговаривать с собой, в котором есть уважение к твоим чувствам, желаниям и реальным обстоятельствам.", "Представь, что тебе рассказывает о своей ситуации человек, который тебе небезразличен.", "Ты можешь не соглашаться с его решением. Можешь видеть ограничения. Можешь предложить другой путь.", "Но тебе ведь не обязательно унижать его, чтобы помочь ему разобраться?", "Попробуй отнестись к себе с таким же уважением.", "Если ты чего-то хочешь, не нужно немедленно объяснять себе, почему это глупо или невозможно.", "Сначала можно признать само желание.", "Затем посмотреть, что за ним стоит. Возможно, это потребность в свободе, красоте, безопасности, близости, признании, интересе или отдыхе.", "А после — решить, что действительно возможно сейчас.", "Поддержка себя не означает исполнение каждого желания. Она означает, что ты перестаешь автоматически отвергать себя еще до того, как услышал{|а}.", "Попробуй найти слова, которым ты сам{|а} можешь поверить.", "Не красивые слова. Не обязательные аффирмации.", "А честный ответ человека, который больше не хочет быть собственным противником.", "A Path to Deeper Human Connection: Gratitude | by Sam | Medium"]}, "tracker": {"title": "Возвращение к себе в обычном дне", "p": ["Переход в Реактор", "Знакомство с собой не заканчивается после заполнения последнего поля.", "Настоящая возможность увидеть себя появляется и в обычной жизни.", "Когда ты выбираешь, как провести время.", "Когда соглашаешься или отказываешься.", "Когда замечаешь, что тебе что-то не подходит.", "Когда хочешь одного, а привычка или обстоятельства ведут тебя в другую сторону.", "Поэтому теперь попробуй перенести внимание из ответов в повседневные ситуации.", "Не нужно постоянно анализировать себя. Не нужно превращать каждый день в проверку на правильность.", "Достаточно иногда задавать себе несколько вопросов.", "Что я сейчас хочу?", "Что для меня действительно важно в этой ситуации?", "Я выбираю это сам{|а} или просто действую по привычке?", "Есть ли возможность учесть себя, не игнорируя реальность и других людей?", "И что я хотел{|а} бы сделать иначе в следующий раз?", "В Реакторе ты сможешь наблюдать не только за выполненными делами и планами, но и за тем, как проживается твоя жизнь.", "Где ты услышал{|а} себя? Где не заметил{|а}? Где выбрал{|а} привычное? Где попробовал{|а} новый способ?", "Не используй эти наблюдения для очередного повода себя критиковать.", "Они нужны не для оценки, а для понимания.", "Постепенно ты сможешь увидеть, как знакомство с собой превращается в реальные решения.", "Не обязательно большие. Иногда достаточно одного небольшого выбора, который действительно учитывает тебя.", "Positive Light - Tangra AI Image Generator"]}, "final": {"title": "Не нужно становиться другим", "p": ["Завершение", "Возможно, за время этого исследования ты узнал{|а} о себе что-то новое.", "Возможно, некоторые вещи стали понятнее. А какие-то вопросы, наоборот, открылись впервые.", "Не торопись подводить окончательный итог.", "Тебе не нужно немедленно менять свою жизнь, принимать важные решения или доказывать, что исследование принесло результат.", "Иногда достаточно начать замечать то, что раньше проходило мимо внимания.", "Собственные желания. Предпочтения. Границы. Интересы. Внутренние правила. Способы, которыми ты разговариваешь с собой.", "И особенно важно помнить: ты не обязан{|а} выбирать между собой и всем остальным миром.", "Можно учитывать свои интересы и оставаться внимательн{ым|ой} к другим людям. Можно менять решения, признавать ограничения, пересматривать убеждения и при этом не отказываться от собственной позиции.", "Самость — не требование всегда поступать только по-своему.", "Это возможность не терять себя в обстоятельствах, ожиданиях и привычных сценариях.", "Тебе не нужно становиться другим человеком, чтобы начать жить более подходящую тебе жизнь.", "Можно начать с того, чтобы внимательнее услышать того, кем ты уже являешься.", "И продолжить свой путь."]}, "portrait": {"title": "Часть I пройдена", "p": ["Ты прош{ел|ла} первую часть пути: увидел{|а}, как ты выбираешь, что тебя держит и где ты чаще отступаешь от себя.", "Это не оценка и не приговор. Это первая честная карта.", "Все, что ты отметил{|а}, не исчезнет: игра будет возвращать тебе твои же ответы на следующих шагах.", "Если хочется побыть с собой глубже, загляни в лабораторию «Знакомство с собой». Первые четыре темы как раз о том, что ты сейчас прош{ел|ла}."]}};
function load(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return {}}}
function patch(fn){var P=load();fn(P);try{localStorage.setItem(K,JSON.stringify(P))}catch(e){}return P}
function fem(P){return (P||load()).gender==='f'}
function gx(s,P){var f=fem(P);return String(s==null?'':s).replace(/\{([^{}|]*)\|([^{}|]*)\}/g,function(_,m,w){return f?w:m})}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function short(s,n){s=String(s||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();n=n||180;return s.length>n?s.slice(0,n-1).replace(/\s+\S*$/,'')+'…':s}
function base(){var s=document.querySelector('script[src*="self-thread.js"]');return s&&s.src?s.src.replace(/[^/]+(?:\?.*)?$/,''):''}
function addScript(src,cb){var s=document.createElement('script');s.src=base()+src;s.onload=s.onerror=function(){cb&&cb()};document.head.appendChild(s)}
function addCss(href){if(document.querySelector('link[href*="'+href.split('?')[0]+'"]'))return;var l=document.createElement('link');l.rel='stylesheet';l.href=base()+href;document.head.appendChild(l)}
function need(list,cb){var i=0;(function nx(){if(i>=list.length){cb();return}var x=list[i++];if(window[x[0]])nx();else addScript(x[1],nx)})()}
/* Текущая страница как в маршруте: slot.html?id=..., scene.html?k=... */
function page(){var q=new URLSearchParams(location.search),f=location.pathname.split('/').pop()||'index.html';
 if(f==='slot.html')return f+'?id='+q.get('id');if(f==='scene.html')return f+'?k='+q.get('k');return f}
function review(){try{return !!(window.GRoute&&GRoute.isVisualReview&&GRoute.isVisualReview())}catch(e){return false}}

/* ---------- Голос Самости (свитки) ---------- */
function voiceHtml(id,P){var v=VOICE[id];if(!v)return '';var h=v.p.map(function(p){return '<p>'+esc(gx(p,P))+'</p>'}).join('');
 if(id==='portrait'||id==='final')h+='<p><a href="samost.html" style="color:#e8c27a">Открыть лабораторию «Знакомство с собой»</a></p>';return h}
function voice(id,opts){opts=opts||{};var v=VOICE[id];if(!v)return;
 need([['Scroll','scroll.js?v=self1']],function(){addCss('scroll.css?v=sb1');if(!window.Scroll)return;
  var P=load();Scroll.show({id:'self_'+id,title:v.title,html:voiceHtml(id,P),closeLabel:'Беру с собой',everyTime:!!opts.everyTime,delay:opts.delay,
   onClose:function(){patch(function(P){P.self=P.self||{};P.self.voice=P.self.voice||{};if(!P.self.voice[id])P.self.voice[id]=Date.now()});if(opts.onClose)opts.onClose()}});
  if(Scroll.seen('self_'+id)&&!opts.everyTime&&opts.onClose)opts.onClose()})}

/* ---------- Выводы тестов: одна выборка из того, что уже сохранено ---------- */
function insights(P){P=P||load();var out=[],D=P.diary||{};
 (D.blocks||[]).forEach(function(b){if(!b||String(b.id).indexOf('wow_')===0)return;var t=b.insight||b.lead||b.strong;if(t)out.push({src:b.step||b.id,title:b.title||'',text:short(t),at:b.at||null,kind:'result'})});
 (D.ins||[]).forEach(function(e){if(e&&e.x)out.push({src:e.blockId||'diary',title:e.at||'Дневник',text:short(e.x,220),at:e.d||null,kind:'own'})});
 if(P.dialog&&(P.dialog.self+P.dialog.ego)>0)out.push({src:'slot.html?id=dialog',title:'Кто сейчас выбирает',text:'Самость: '+P.dialog.self+', Защитник: '+P.dialog.ego,kind:'fact'});
 if(P.dq&&P.dq.accepted!=null)out.push({src:'swipe.html',title:'Твое хорошее',text:'Принято '+P.dq.accepted+'%',kind:'fact'});
 var ld=P.desireLab;if(ld&&ld.desire)out.push({src:'slot.html?id=lab_d',title:'Лабиринт желаний',text:short(ld.desire),kind:'own'});
 var dc=P.tracker&&P.tracker.declared;if(dc&&dc.text)out.push({src:'wish.html',title:'Главное желание',text:short(dc.text),kind:'own'});
 return out}
function heroSum(P,cb){need([['GIMD','inner-mirror-data.js?v=im1'],['GBW','betraywheel.js?v=contact1'],['GHeroSum','hero-sum.js?v=hs1']],function(){var s=null;try{s=window.GHeroSum?GHeroSum.build(P):null}catch(e){}cb(s)})}
function firstOwn(P){var I=((P.diary||{}).ins||[]).filter(function(e){return e&&e.x&&String(e.x).trim().length>3});return I.length?short(I[0].x,200):''}
function dailyQuestion(P){return gx('Где ты сегодня был{|а} на своей стороне?',P)}

/* ---------- Вау-моменты маршрута: текст только из реальных ответов ---------- */
function M(P){var name=String(P.name||'').trim(),f=fem(P);return {
 dialog_support:function(cb){var d=P.dialog;if(!d||!(d.self>0))return cb(null);var n=d.self+d.ego;
  cb({kicker:'Первая опора',title:'Самость уже говорит',text:gx('В диалоге '+d.self+' из '+n+' выборов сделал{|а} ты сам{|а}, из Самости, а не из защиты.',P),sub:'Опору не нужно создавать с нуля. Ее можно замечать.'})},
 good_taken:function(cb){var q=P.dq;if(!q||q.accepted==null||!Array.isArray(q.answers)||!q.answers.length)return cb(null);var ok=q.answers.filter(Boolean).length,v=(q.voices||[])[0];if(!ok)return cb(null);
  cb({kicker:'Сначала опора',title:ok+' из '+q.answers.length,text:gx('Столько своего хорошего ты уже готов{|а} взять себе.',P),quote:v?'«'+v+'»':'',quoteAfter:true,sub:v?'Так звучал голос, который отнимал остальное. Это привычное объяснение, а не факт о тебе.':'Ты не отдал{|а} ни одного своего хорошего события. Это редкая опора.'})},
 portrait_link:function(cb){heroSum(P,function(s){if(!s||!s.good.length)return cb(null);
  var link=(s.learned||[]).filter(function(x){return /разных|нескольк|устойчив/.test(x)})[0]||'';
  cb({kicker:'Твой первый портрет',title:'Сначала — то, что держит',text:s.good[0],quote:link,sub:link?'Это видно не в одном ответе, а сразу в нескольких.':'Это твоя опора по твоим же ответам.'})})},
 desire_seed:function(cb){var ld=P.desireLab;if(!ld||!ld.desire)return cb(null);
  cb({kicker:'Запомни эти слова',title:'Ты сам{|а} это написал{|а}',quote:'«'+short(ld.desire,200)+'»',text:'Сейчас ты будешь заявлять желание.',sub:'Позже игра вернет тебе эти слова, и ты увидишь, что с ними стало.'})},
 own_words:function(cb){var w=firstOwn(P);if(!w)return cb(null);
  cb({kicker:'Перед встречей со Стражем',title:'Твои слова',quote:'«'+w+'»',text:gx('Это ты записал{|а} сам{|а}, когда никто не подсказывал.',P),sub:'Страж говорит голосом привычки. А эти слова — твои.'})},
 wish_return:function(cb){var a=P.desireLab&&P.desireLab.desire,b=P.tracker&&P.tracker.declared&&P.tracker.declared.text;if(!a||!b)return cb(null);
  var same=String(a).toLowerCase().replace(/[^а-яa-z0-9]/g,'')===String(b).toLowerCase().replace(/[^а-яa-z0-9]/g,'');
  cb({kicker:'Что ты писал{|а} в начале',title:same?'Оно прошло весь путь':'Посмотри, как оно изменилось',quote:'«'+short(a,140)+'»'+(same?'':'  →  «'+short(b,140)+'»'),text:same?'Желание из лабиринта и заявка в Небе совпали.':'В лабиринте было первое. В Небе желаний ты заявил{|а} второе.',sub:same?'Оно выдержало все шаги.':'Какое из них ближе тебе сейчас?'})},
 final_letter:function(cb){heroSum(P,function(s){var parts=[],first=(P.desireLab&&P.desireLab.desire)||firstOwn(P),good=s&&s.good&&s.good[0],dc=P.tracker&&P.tracker.declared&&P.tracker.declared.text;
  if(first)parts.push(gx('В начале ты написал{|а}: «'+short(first,140)+'».',P));
  if(good)parts.push('По дороге стало видно, что тебя держит. '+good);
  if(dc)parts.push('Твое желание сейчас: «'+short(dc,140)+'».');
  if(parts.length<2)return cb(null);
  cb({kicker:'Письмо от Самости',title:(name?gx('Дорог{ой|ая} ',P)+name:'Это тебе'),text:parts.join('\n'),sub:gx('Тебе не нужно становиться другим человеком. Можно продолжать слышать того, кем ты уже являешься. Твоя Самость.',P),letter:true})})}
}}
function wow(id,then){if(!window.GWow){then&&then();return}if(GWow.done(id)){then&&then();return}
 var fn=M(load())[id];if(!fn){then&&then();return}
 fn(function(o){if(!o){then&&then();return}var P=load();['kicker','title','text','quote','sub'].forEach(function(k){if(o[k])o[k]=gx(o[k],P)});o.id=id;o.onClose=then;GWow.show(o)})}

/* ---------- Нить Самости в Герое: озарения и свитки, без повтора итогов героя ---------- */
function heroPanel(){var P=load(),S=P.self||{},W=S.wow||{},vs=Object.keys(S.voice||{}).filter(function(k){return VOICE[k]});var ws=Object.keys(W);if(!ws.length&&!vs.length)return;
 var h='<details class="self-thread" style="margin:18px auto;max-width:520px;border:1px solid rgba(232,194,122,.35);border-radius:14px;padding:12px 14px;background:rgba(20,14,8,.6);color:#f4ecdf;text-align:left"><summary style="cursor:pointer;color:#e8c27a;font-weight:600">Нить Самости</summary>';
 ws.forEach(function(k){var w=W[k];h+='<p style="margin:10px 0 0"><b style="color:#e8c27a">'+esc(w.title||'')+'</b><br>'+esc(w.text||'')+'</p>'});
 if(vs.length)h+='<p style="margin:12px 0 4px;opacity:.7">Голос Самости</p>'+vs.map(function(k){return '<button type="button" data-sv="'+k+'" style="display:block;width:100%;margin:6px 0;padding:10px;border-radius:10px;border:1px solid rgba(232,194,122,.4);background:none;color:#f4ecdf;text-align:left">'+esc(VOICE[k].title)+'</button>'}).join('');
 var box=document.createElement('div');box.innerHTML=h+'</details>';var host=document.querySelector('main')||document.querySelector('.w')||document.body;host.appendChild(box);
 box.addEventListener('click',function(e){var b=e.target.closest('[data-sv]');if(b)voice(b.dataset.sv,{everyTime:true,delay:0})})}

/* ---------- Вход в трекер: скрыт до итога Точки Б, потом вау-момент и входы в Герое и меню ---------- */
function trackerOpen(P){P=P||load();try{var T=P.tracker||{};
 if(T.strategySeen||T.finale||Object.keys(T.days||{}).length||+(P.reactor||{}).day>0)return true;
 return !!(window.GRoute&&GRoute.status&&GRoute.status('slot.html?id=pb_end')==='done')}catch(e){return false}}
function trackerEntry(){var open=trackerOpen();
 document.querySelectorAll('.gdraw a[href^="reactor.html"]').forEach(function(a){a.style.display=open?'':'none'});
 if(!open)return;
 var go=document.getElementById('hGo');
 if(go&&!document.getElementById('hTrack')){var b=document.createElement('button');b.type='button';b.id='hTrack';b.textContent='Трекер';
  b.setAttribute('style','flex:0 0 auto;padding:0 14px;background:#2F5E50;color:#fff;border-color:#2F5E50');
  var bk=document.getElementById('hBack');if(bk)bk.style.flex='0 0 auto',bk.style.padding='0 14px';
  b.onclick=function(){location.href='reactor.html'};go.parentNode.insertBefore(b,go)}}
var TRACK_WOW_PAGES={'slot.html?id=pc_intro':1,'slot.html?id=arch_d':1,'slot.html?id=builder':1,'tasks.html':1,'hero.html':1,'map.html':1,'diary.html':1};
function trackerWow(){if(!window.GWow||GWow.done('tracker_open'))return false;
 GWow.show({id:'tracker_open',kicker:'Точка Б пройдена',title:'Твой путь на 28 дней открыт',text:gx('Теперь у тебя есть свой трекер. В нем твое большое желание, три цели и шаги на каждый день.'),sub:'Он будет ждать тебя в Герое и в меню.',button:'Открыть трекер',onClose:function(){location.href='reactor.html'}});return true}

/* ---------- Карта точек маршрута ---------- */
var CHAIN={};
function run(){setTimeout(trackerEntry,0);setTimeout(trackerEntry,600);if(review()||window.GSelfNoAuto){need([['GWow','wow.js?v=self1']],function(){});return}var p=page();
 if(TRACK_WOW_PAGES[p]&&trackerOpen()&&!(load().self&&load().self.wow&&load().self.wow.tracker_open)){setTimeout(function(){need([['GWow','wow.js?v=self1']],function(){if(!trackerWow()){var c=CHAIN[p];c&&c()}})},700);return}
 var chain={
  'hero.html':function(){voice('hero');heroPanel()},
  'slot.html?id=dialog':function(){voice('iam')},
  'slot.html?id=bg16':function(){wow('dialog_support')},
  'res.html':function(){wow('good_taken')},
  'fin.html':function(){wow('portrait_link',function(){voice('portrait')})},
  'wish.html':function(){wow('desire_seed')},
  'slot.html?id=arch_p':function(){voice('guard')},
  'slot.html?id=guard':function(){wow('own_words',function(){voice('guard')})},
  'slot.html?id=wish_back':function(){wow('wish_return')},
  'slot.html?id=end':function(){wow('final_letter',function(){voice('final')})},
  'betray.html':function(){var P0=load(),was=!!(P0.betray&&P0.betray.done);if(was)return;
   var t=setInterval(function(){var P=load();if(P.betray&&P.betray.done){clearInterval(t);setTimeout(function(){if(!window.GSelfNoAuto)voice('wheel')},3500)}},1500)}
 };CHAIN=chain;chain=chain[p];
 need([['GWow','wow.js?v=self1']],function(){});if(chain)setTimeout(function(){need([['GWow','wow.js?v=self1']],chain)},700)}

window.GSelf={trackerOpen:trackerOpen,voice:voice,insights:insights,dailyQuestion:dailyQuestion,load:load,wow:wow,VOICE:VOICE,page:page};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
