/* «Колесо самопредательства»: 6 пар направлений (левая тень / правая опора) × 24 ветви × 48 проявлений.
   Каждая ситуация предлагает два реальных способа реагирования. Выборы по обеим сторонам
   накапливаются независимо в 24 ячейках; во время ответов подписи скрыты и проявляются в финале. */
(function(){
'use strict';
function gf(s){
 var f=false;
 try{
  if(window.GGender)f=GGender()==='f';
  else f=(JSON.parse(localStorage.getItem('alch_v5_profile')||'{}').gender==='f');
 }catch(e){}
 return String(s==null?'':s).replace(/\{([^{}|]*)\|([^{}]*)\}/g,function(_,m,w){return f?w:m});
}
var S=[
{id:'perf',t:'Перфекционизм',forms:[
{id:'ideal',sh:'Быть идеальным',sp:'Допускать несовершенство',shHow:'Перерабатывать, чрезмерно готовиться и откладывать завершение, пока результат не станет безупречным.',spHow:'Определять достаточный уровень качества, завершать работу и спокойно исправлять то, что действительно требует исправления.',why:'Стремление к безупречности может помогать справляться с важными задачами, но иногда забирает силы и мешает двигаться дальше.',q:[
['Если важная работа затягивается и ты уже {потратил|потратила} на нее больше времени, чем {планировал|планировала}, ты чаще…','Продолжаю, потому что не могу остановиться, пока не доведу результат до идеала.','Завершаю на согласованном уровне качества, даже если дальше можно бесконечно улучшать.'],
['Перед важным делом ты обычно…','Готовлюсь снова и снова, пока не почувствую, что {предусмотрел|предусмотрела} почти все и точно не ошибусь.','Начинаю, когда уже достаточно {подготовлен|подготовлена}, а недостающие детали уточняю по ходу.']
]},
{id:'approval',sh:'Заслужить одобрение',sp:'Доверять собственной оценке',shHow:'Ориентироваться на похвалу и внешнее подтверждение, чтобы почувствовать, что результат и ты {сам|сама} достаточно хороши.',spHow:'Учитывать обратную связь, но сохранять собственное понимание ценности сделанного.',why:'Внешняя оценка может быть важна, но не обязана становиться единственным подтверждением собственной ценности.',q:[
['После важного для тебя дела, если никто этого не заметил, ты чаще…','Чувствую, что усилия как будто не имеют веса, пока их не оценили другие.','Могу признать ценность сделанного, даже без похвалы.'],
['Когда мнения о твоей работе расходятся, ты обычно…','Стараюсь получить еще чье-то одобрение, чтобы понять, имею ли право быть {довольным|довольной}.','Слушаю мнения, но сопоставляю их со своими критериями и обстоятельствами.']
]}
]},
{id:'please',t:'Угождение людям',forms:[
{id:'peace',sh:'Сохранить мир',sp:'Выдерживать разногласия',shHow:'Уступать или замалчивать несогласие, чтобы не допустить напряжения и риска испортить отношения.',spHow:'Оставаться в разговоре, даже если мнения расходятся, и искать решение без отказа от своей позиции.',why:'Сохранение мира может быть важным, но постоянное избегание разногласий оставляет собственные потребности без голоса.',q:[
['В разговоре близкий человек предлагает решение, которое тебе не подходит. Ты чаще…','Соглашаюсь, чтобы не начинать неприятный разговор.','Говорю, что думаю иначе, и обсуждаю, как учесть обе стороны.'],
['Когда в отношениях возникает напряжение, ты обычно…','Первым делом стараюсь сгладить ситуацию, даже если для этого приходится промолчать о важном.','Могу выдержать паузу и вернуться к разговору, не отказываясь от своей точки зрения.']
]},
{id:'pleasant',sh:'Оставаться приятным',sp:'Быть искренним',shHow:'Подстраивать слова и поведение под ожидания окружающих, чтобы оставаться {удобным|удобной} и нравиться.',spHow:'Быть доброжелательным, не скрывая собственное мнение и не соглашаясь автоматически.',why:'Доброжелательность не требует постоянно нравиться всем или отказываться от своей подлинной реакции.',q:[
['Когда тебя просят о том, на что у тебя нет времени, ты чаще…','Ищу способ согласиться или обещаю, а потом пытаюсь все успеть.','Честно говорю, что сейчас не могу, и при необходимости предлагаю другой вариант.'],
['Когда твое мнение может кому-то не понравиться, ты обычно…','Смягчаю или меняю его, чтобы не выглядеть неприятным человеком.','Выбираю уважительную форму, но не прячу само мнение.']
]}
]},
{id:'numb',t:'Оцепенение',forms:[
{id:'busy',sh:'Быть постоянно занятым',sp:'Давать себе паузу',shHow:'Заполнять свободное время делами и задачами, чтобы не оставаться наедине с переживаниями.',spHow:'Замечать потребность остановиться и позволять себе паузу без необходимости немедленно чем-то ее заполнить.',why:'Занятость может быть естественной частью жизни, но иногда становится способом не замечать собственное состояние.',q:[
['Когда появляется свободный вечер и нет срочных дел, ты чаще…','Быстро нахожу себе занятия, потому что просто сидеть и ничего не делать неуютно.','Могу оставить время свободным и прислушаться, чего сейчас хочется.'],
['После напряженного дня ты обычно…','Сразу переключаюсь на дела, экран или задачи, чтобы не думать о прошедшем.','Сначала замечаю свое состояние и решаю, нужен ли мне отдых, разговор или действие.']
]},
{id:'disconnect',sh:'Отключаться от чувств',sp:'Замечать свои чувства',shHow:'Уходить в бесконечный контент, еду, алкоголь или другие отвлекающие действия, чтобы не встречаться с неприятными чувствами.',spHow:'Замечать, что именно чувствуешь, и выбирать способ поддержать себя, не подавляя переживание.',why:'Отвлечение иногда помогает передохнуть. Важно замечать, когда оно становится единственным способом обходиться с переживаниями.',q:[
['Когда внутри появляется тревога или грусть, ты чаще…','Стараюсь чем-то заглушить это ощущение: включаю видео, листаю ленту или ищу другое отвлечение.','Пытаюсь понять, что именно чувствую и что могло бы сейчас поддержать меня.'],
['Если неприятное чувство возвращается несколько раз за день, ты обычно…','Снова переключаю внимание на что-нибудь внешнее, чтобы не сталкиваться с ним.','Нахожу возможность побыть с этим чувством и при необходимости обратиться за поддержкой.']
]}
]},
{id:'detach',t:'Отстранение',forms:[
{id:'closed',sh:'Закрываться',sp:'Оставаться открытым в безопасном контакте',shHow:'Прятать переживания и держать дистанцию, даже когда рядом есть человек, с которым можно поговорить.',spHow:'Постепенно делиться тем, что происходит внутри, выбирая людей и степень открытости по ситуации.',why:'Дистанция может защищать, но привычка закрываться даже там, где безопасно, мешает получать близость и поддержку.',q:[
['Когда тебя что-то задело, а рядом близкий человек спрашивает, что случилось, ты чаще…','Отвечаю, что все нормально, и стараюсь пережить это внутри себя.','Говорю хотя бы часть правды о том, что меня задело.'],
['Когда кто-то проявляет к тебе искренний интерес и хочет поговорить о важном, ты обычно…','Перевожу разговор на нейтральные темы или держу переживания при себе.','Решаю, чем {готов|готова} поделиться, и позволяю разговору стать немного ближе.']
]},
{id:'alone',sh:'Справляться в одиночку',sp:'Принимать поддержку',shHow:'Не просить о помощи, брать все на себя и считать, что свои трудности нужно решать самостоятельно.',spHow:'Обращаться за конкретной помощью и принимать участие другого человека, сохраняя собственную самостоятельность.',why:'Самостоятельность — ресурс. Но если помощь недоступна даже тогда, когда она нужна, нагрузка становится тяжелее.',q:[
['Когда у тебя одновременно несколько сложных задач, ты чаще…','Стараюсь справиться самостоятельно, даже если уже понимаю, что не успеваю.','Обсуждаю, что можно разделить или о чем попросить помощи.'],
['Когда тебе предлагают помощь, которая действительно пригодилась бы, ты обычно…','Отказываюсь или говорю, что {сам|сама} разберусь, даже если мне трудно.','Могу принять помощь и прямо сказать, что именно мне сейчас нужно.']
]}
]},
{id:'over',t:'Чрезмерная отдача',forms:[
{id:'love',sh:'Заслужить любовь',sp:'Принимать любовь без заслуг',shHow:'Стараться быть незаменимым, постоянно доказывать свою полезность и ждать, что это обеспечит любовь и близость.',spHow:'Позволять отношениям строиться не только на услугах и достижениях, но и на взаимном присутствии.',why:'Забота укрепляет отношения, но любовь не должна становиться наградой за постоянную полезность.',q:[
['Когда близкий человек занят собой и не уделяет тебе привычного внимания, ты чаще…','Стараюсь сделать для него еще больше, чтобы снова почувствовать свою нужность.','Могу сказать, что скучаю или хочу внимания, не пытаясь сначала заслужить его делами.'],
['Если несколько дней подряд ты не делаешь для близких ничего сверх обычного, ты обычно…','Чувствую беспокойство, будто недостаточно вкладываюсь в отношения.','Могу оставаться в отношениях и принимать тепло, даже когда ничего не делаю сверх обычного.']
]},
{id:'good',sh:'Доказать свою доброту',sp:'Заботиться, сохраняя себя',shHow:'Брать чужие обязанности и отдавать больше сил, чем есть, чтобы подтвердить, что ты хороший и надежный человек.',spHow:'Помогать по собственному выбору, соразмеряя помощь со своими силами и не отменяя собственные потребности.',why:'Доброта не измеряется количеством принесенных в жертву сил. Забота может учитывать и другого человека, и себя.',q:[
['Кто-то просит тебя о помощи, хотя у тебя {самого|самой} уже много дел. Ты чаще…','Соглашаюсь, потому что неудобно отказать человеку, которому трудно.','Смотрю на свои возможности и решаю, какую помощь действительно могу дать.'],
['После того как ты {помог|помогла} другому, а собственные дела остались несделанными, ты обычно…','Все равно считаю, что {должен был|должна была} помочь, и откладываю свои потребности.','Замечаю цену помощи и в следующий раз стараюсь учесть свои силы и дела.']
]}
]},
{id:'ctrl',t:'Гиперконтроль',forms:[
{id:'safety',sh:'Контролировать все',sp:'Различать свою зону влияния',shHow:'Проверять, предусматривать и пытаться управлять всеми деталями, чтобы избежать неопределенности и почувствовать безопасность.',spHow:'Отделять то, на что можно повлиять, от того, что остается вне контроля, и направлять силы на свою часть.',why:'Планирование помогает, но попытка удержать все переменные не гарантирует безопасности и может лишать гибкости.',q:[
['Когда исход дела зависит не только от тебя, ты чаще…','Пытаюсь предусмотреть все варианты и держать ситуацию под постоянным наблюдением.','Определяю, что зависит от меня, делаю свою часть и оставляю место для неизвестного.'],
['Если обстоятельства меняются и прежний план больше не подходит, ты обычно…','Стараюсь вернуть все к первоначальному плану и раздражаюсь, когда это не получается.','Пересматриваю план с учетом новых условий и выбираю следующий разумный шаг.']
]},
{id:'chief',sh:'Оставаться главным',sp:'Разделять ответственность',shHow:'Брать решения и управление на себя, вмешиваться в чужую часть, чтобы быть {уверенным|уверенной} в результате.',spHow:'Договариваться о распределении ответственности и позволять другим выполнять свою часть по-своему.',why:'Ответственность важна, но не обязательно лично управлять каждым шагом, чтобы дело состоялось.',q:[
['Ты делаешь общее дело вместе с другим человеком, и он предлагает выполнить свою часть самостоятельно. Ты чаще…','Предпочитаю {сам|сама} определить, как именно все будет сделано, и проверять ход работы.','Договариваюсь о результате и сроках, оставляя человеку свободу в способе выполнения.'],
['Когда другой человек принимает решение, которое может повлиять и на тебя, ты обычно…','Стараюсь вмешаться и направить решение, чтобы сохранить контроль над итогом.','Обсуждаю последствия и свою часть ответственности, не забирая чужое решение себе.']
]}
]}
];
var LEGACY_SUPPORT={
 perf:{id:'enough',t:'Достаточно хорошо'},
 please:{id:'bound',t:'Собственные границы'},
 numb:{id:'alive',t:'Замечать и проживать чувства'},
 detach:{id:'near',t:'Присутствие и близость'},
 over:{id:'care',t:'Забота о себе'},
 ctrl:{id:'trust',t:'Доверие процессу'}
};
S.forEach(function(s){s.m=LEGACY_SUPPORT[s.id]});
var FORMS=[];S.forEach(function(s){s.forms.forEach(function(f){f.sector=s;FORMS.push(f)})});
var LEAF_LABELS={
 ideal:[['Работать сверх меры','Завершать в разумных границах'],['Готовиться до полной уверенности','Начинать с достаточной готовностью']],
 approval:[['Ждать признания','Замечать собственный вклад'],['Искать внешнее подтверждение','Доверять своей оценке']],
 peace:[['Соглашаться ради тишины','Обсуждать несогласие'],['Сглаживать любой ценой','Выдерживать сложный разговор']],
 pleasant:[['Обещать сверх своих сил','Честно обозначать возможности'],['Менять мнение ради симпатии','Говорить уважительно и прямо']],
 busy:[['Заполнять свободное время','Оставлять место паузе'],['Уходить в дела после стресса','Сначала замечать свое состояние']],
 disconnect:[['Глушить чувства отвлечением','Замечать и называть чувства'],['Снова переключаться от переживаний','Искать подходящую поддержку']],
 closed:[['Скрывать, что тебя задело','Делиться переживанием'],['Уводить разговор от близости','{Самому|Самой} выбирать степень открытости']],
 alone:[['Тянуть все самостоятельно','Разделять нагрузку'],['Отказываться от помощи','Принимать конкретную помощь']],
 love:[['Становиться нужным ради внимания','Просить о близости прямо'],['Тревожиться, если нечего дать','Принимать тепло без заслуг']],
 good:[['Помогать вопреки своим возможностям','Учитывать собственные силы'],['Ставить чужие дела выше своих','Не отменять собственные потребности']],
 safety:[['Проверять все варианты','Определять свою зону влияния'],['Возвращать все к прежнему плану','Перестраиваться по обстоятельствам']],
 chief:[['Забирать управление себе','Доверять чужому способу'],['Вмешиваться в чужие решения','Отвечать за свою часть']]
};
var QUESTIONS=[];FORMS.forEach(function(f){f.q.forEach(function(q,i){var labels=LEAF_LABELS[f.id][i];QUESTIONS.push({id:f.id+'_'+(i+1),form:f.id,sector:f.sector.id,text:q[0],left:q[1],right:q[2],leftLeaf:{id:f.id+'_'+(i+1)+'_sh',title:labels[0],side:'sh',detail:q[1]},rightLeaf:{id:f.id+'_'+(i+1)+'_sp',title:labels[1],side:'sp',detail:q[2]}})})});
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function pt(r,a){a=(a-90)*Math.PI/180;return [Math.round(r*Math.cos(a)*10)/10,Math.round(r*Math.sin(a)*10)/10]}
function wedge(r0,r1,a0,a1){var p1=pt(r1,a0),p2=pt(r1,a1),p3=pt(r0,a1),p4=pt(r0,a0);return 'M'+p1+' A'+r1+' '+r1+' 0 0 1 '+p2+' L'+p3+' A'+r0+' '+r0+' 0 0 0 '+p4+'Z'}
var uid=0;
function blank(){var a={};FORMS.forEach(function(f){a[f.id]={sh:0,sp:0,answered:0,answers:[]}});return a}
function aggregate(answers){var cells=blank();QUESTIONS.forEach(function(q){var v=answers[q.id];if(v==null||v==='none')return;var c=cells[q.form];c.answered++;if(v==='left')c.sh++;else if(v==='right')c.sp++;else if(v==='both'){c.sh+=.5;c.sp+=.5}c.answers.push(v)});return cells}
function isoDay(ts){var d=new Date(ts||Date.now());return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function daysAgg(P,fromIso,toIso){
 var daysMap=(P&&P.betray&&P.betray.days)||{},keys=Object.keys(daysMap).filter(function(k){
  if(fromIso&&k<fromIso)return false;if(toIso&&k>toIso)return false;
  var r=daysMap[k];return r&&((r.sh&&r.sh.length)||(r.sp&&r.sp.length));
 }),sh={},sp={},days=keys.length;
 S.forEach(function(s){sh[s.id]=0;sp[s.m.id]=0});
 keys.forEach(function(k){var r=daysMap[k]||{};(r.sh||[]).forEach(function(id){if(sh[id]!=null)sh[id]++});(r.sp||[]).forEach(function(id){if(sp[id]!=null)sp[id]++})});
 if(days){S.forEach(function(s){sh[s.id]=sh[s.id]/days;sp[s.m.id]=sp[s.m.id]/days})}
 return {days:days,vals:{sh:sh,sp:sp}};
}
function fromRates(rec){
 if(!rec)return {};
 if(rec.answers&&typeof rec.answers==='object'&&Object.keys(rec.answers).length)return rec.answers;
 var sh={},sp={};
 if(Array.isArray(rec.sectors)){
  rec.sectors.forEach(function(sec){
   var sObj=S.filter(function(x){return x.id===sec.id})[0];if(!sObj)return;
   var nSum=0,pSum=0,cnt=0;
   (sec.forms||[]).forEach(function(f){if(f.shadow&&typeof f.shadow.score==='number'){nSum+=f.shadow.score/100;pSum+=f.support.score/100;cnt++}});
   sh[sObj.id]=cnt?nSum/cnt:0;sp[sObj.m.id]=cnt?pSum/cnt:0;
  });
  return {sh:sh,sp:sp};
 }
 S.forEach(function(s){sh[s.id]=Math.min(1,((rec.sh&&rec.sh[s.id])||0)/3);sp[s.m.id]=Math.min(1,((rec.sp&&rec.sp[s.m.id])||0)/3)});
 return {sh:sh,sp:sp};
}
function summary(r){
 var sp=[],sh=[];if(!r)return {sp:sp,sh:sh};
 if(Array.isArray(r.sectors)){
  r.sectors.forEach(function(sec){
   var sObj=S.filter(function(x){return x.id===sec.id})[0];if(!sObj)return;
   var nSum=0,pSum=0,den=0;
   (sec.forms||[]).forEach(function(f){if(!f.answered||f.shadow.score==null)return;nSum+=f.shadow.score*f.answered;pSum+=f.support.score*f.answered;den+=f.answered});
   if(!den)return;
   var nv=nSum/den,pv=pSum/den;
   if(pv>=50)sp.push({s:sObj,v:pv});
   if(nv>=50)sh.push({s:sObj,v:nv});
  });
 }else{
  S.forEach(function(s){
   var pv=(r.sp&&r.sp[s.m.id])||0,nv=(r.sh&&r.sh[s.id])||0;
   if(pv>0)sp.push({s:s,v:pv/3*100});
   if(nv>0)sh.push({s:s,v:nv/3*100});
  });
 }
 sp.sort(function(a,b){return b.v-a.v});sh.sort(function(a,b){return b.v-a.v});
 return {sp:sp,sh:sh};
}
function radText(r,ang,isLeft,lines,cls,fill,op,fs,fw){
 var p=pt(r,ang),rot=isLeft?(ang+90):(ang-90);
 var body=lines.length===1?esc(lines[0]):'<tspan x="'+p[0]+'" dy="-2.5">'+esc(lines[0])+'</tspan><tspan x="'+p[0]+'" dy="5.8">'+esc(lines[1])+'</tspan>';
 return '<text class="'+cls+'" x="'+p[0]+'" y="'+p[1]+'" transform="rotate('+rot+' '+p[0]+' '+p[1]+')" text-anchor="middle" dominant-baseline="middle" font-family="Manrope,sans-serif" font-size="'+fs+'" font-weight="'+fw+'" fill="'+fill+'" fill-opacity="'+op+'">'+body+'</text>';
}
function svg(answers,o){
 o=o||{};answers=answers||{};
 var R=160,id='bw'+(++uid),size=o.size||340,r0=32,r1=76,r2=124,r3=160;
 var isRates=!!(answers&&(answers.sh||answers.sp)&&!answers.ideal_1&&!answers.peace_1);
 var shShort={perf:['Перфек-','ционизм'],please:['Угождение','людям'],numb:['Оцепе-','нение'],detach:['Отстра-','нение'],over:['Чрезмер.','отдача'],ctrl:['Гипер-','контроль']};
 var spShort={perf:['Достат.','хорошо'],please:['Свои','границы'],numb:['Живые','чувства'],detach:['Близость','и опора'],over:['Забота','о себе'],ctrl:['Доверие','процессу']};
 var brShort={
  'Быть идеальным':'Быть идеальным',
  'Заслужить одобрение':'Одобрение',
  'Сохранить мир':'Сохранить мир',
  'Оставаться приятным':'Быть приятным',
  'Быть постоянно занятым':'Занятость',
  'Отключаться от чувств':'Отключаться',
  'Закрываться':'Закрываться',
  'Справляться в одиночку':'В одиночку',
  'Заслужить любовь':'Заслужить любовь',
  'Доказать свою доброту':'Быть удобным',
  'Контролировать все':'Контроль всего',
  'Оставаться главным':'Быть главным',
  'Допускать несовершенство':'Неидеальность',
  'Доверять собственной оценке':'Своя оценка',
  'Выдерживать разногласия':'Разногласия',
  'Быть искренним':'Искренность',
  'Давать себе паузу':'Пауза себе',
  'Замечать свои чувства':'Чувства',
  'Оставаться открытым в безопасном контакте':'Открытость',
  'Принимать поддержку':'Поддержка',
  'Принимать любовь без заслуг':'Тепло без заслуг',
  'Заботиться, сохраняя себя':'Забота о себе',
  'Различать свою зону влияния':'Зона влияния',
  'Разделять ответственность':'Разделение дел'
 };
 var h='<svg class="bw-svg'+(o.labels&&o.reveal?' bw-revealing':'')+'" viewBox="-170 -170 340 340" width="'+size+'" height="'+size+'" role="img" aria-label="Круговая карта: слева шесть направлений самопредательства, справа шесть зеркальных направлений опоры на себя">';
 h+='<defs><linearGradient id="'+id+'sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e48d83"/><stop offset="1" stop-color="#94393e"/></linearGradient><linearGradient id="'+id+'sp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0bd"/><stop offset="1" stop-color="#b9c9a2"/></linearGradient></defs><circle r="'+R+'" fill="#120d07" fill-opacity="0.62"/>';
 var ring1='',ring2='',ring3='';
 ['sp','sh'].forEach(function(side){
  var isLeft=side==='sh',baseAng=isLeft?180:0;
  S.forEach(function(s,i){
   var a=baseAng+i*30,mid=a+15,secFill=0;
   h+='<path d="'+wedge(r0,r1,a+.45,a+29.55)+'" fill="'+(isLeft?'#3c2924':'#26291e')+'" fill-opacity="0.78" stroke="#c9a46a" stroke-width=".75"/>';
   s.forms.forEach(function(f,j){
    var ba=a+j*15,bmid=ba+7.5,qs=QUESTIONS.filter(function(q){return q.form===f.id}),brFill=0;
    h+='<path d="'+wedge(r1,r2,ba+.35,ba+14.65)+'" fill="'+(isLeft?'#2d1f1d':'#23261c')+'" fill-opacity="0.80" stroke="#9c7b4c" stroke-width=".6"/>';
    qs.forEach(function(q,qi){
     var a0=ba+qi*7.5,a1=a0+7.5,fill=0;
     if(isRates){fill=Math.max(0,Math.min(1,Number(isLeft?(answers.sh&&answers.sh[s.id]):(answers.sp&&answers.sp[s.m.id]))||0))}
     else{var v=answers[q.id];fill=v===(isLeft?'left':'right')?1:v==='both'?.5:0}
     if(fill>0){brFill=Math.max(brFill,fill);secFill=Math.max(secFill,fill)}
     h+='<path d="'+wedge(r2,r3,a0+.25,a1-.25)+'" fill="'+(isLeft?'#5c3835':'#565e46')+'" fill-opacity="0.72" stroke="#b89b70" stroke-width=".45"/>';
     if(fill>0){h+='<path d="'+wedge(r2,r2+(r3-r2)*fill,a0+.42,a1-.42)+'" fill="url(#'+id+side+')" opacity=".98"/>'}
     if(o.labels){
      var lp=pt(142,a0+3.75),num=QUESTIONS.indexOf(q)*2+(isLeft?1:2);
      ring3+='<text class="bw-lbl bw-lbl-num'+(fill>0?' is-on':'')+'" x="'+lp[0]+'" y="'+lp[1]+'" text-anchor="middle" dominant-baseline="middle" font-family="Manrope,sans-serif" font-size="5.5" font-weight="800" fill="'+(fill>0?'#fff8e8':'#d9c5a2')+'" fill-opacity="'+(fill>0?'1':'0.26')+'">'+num+'</text>';
     }
    });
    if(o.labels){
     var btitle=isLeft?f.sh:f.sp,blab=brShort[btitle]||btitle;
     ring2+=radText(100,bmid,isLeft,[blab],'bw-lbl'+(brFill>0?' is-on':''),brFill>0?'#fff3dc':'#cfb892',brFill>0?'1':'0.5','4.65','700');
    }
   });
   if(o.labels){
    var dlines=isLeft?(shShort[s.id]||[s.t]):(spShort[s.id]||[s.m.t]);
    ring1+=radText(54,mid,isLeft,dlines,'bw-lbl'+(secFill>0?' is-on':''),secFill>0?'#fff5dd':'#e4cca0',secFill>0?'1':'0.62','5.25','800');
   }
   h+='<path d="'+wedge(r0,r3,a,a+30)+'" fill="none" stroke="#c9a46a" stroke-width=".95"/>';
  });
 });
 h+='<line x1="0" y1="-'+r3+'" x2="0" y2="-'+r0+'" stroke="#f0c870" stroke-width="1.4"/><line x1="0" y1="'+r0+'" x2="0" y2="'+r3+'" stroke="#f0c870" stroke-width="1.4"/>';
 if(o.labels){
  var rCls=o.reveal?' bw-reveal':'';
  h+='<g class="bw-labels'+rCls+'"><g class="bw-ring bw-ring-1">'+ring1+'</g><g class="bw-ring bw-ring-2">'+ring2+'</g><g class="bw-ring bw-ring-3">'+ring3+'</g></g>';
 }
 h+='<circle r="'+r0+'" fill="#120d07" stroke="#f0c870" stroke-width="1.4"/><text x="0" y="7" text-anchor="middle" font-family="Cormorant Garamond,serif" font-weight="700" fill="#f0c870" font-size="22">Я</text></svg>';
 return '<div class="bw-wheel-wrap'+(o.labels&&o.reveal?' bw-revealing-wrap':'')+'" style="max-width:'+size+'px"><img class="bw-bg-tex" src="img/betray_bg.jpg?v=1" alt="" aria-hidden="true">'+h+'</div>';
}
function result(answers){answers=answers||{};var c=aggregate(answers),sectors=[];S.forEach(function(s){sectors.push({id:s.id,title:s.t,forms:s.forms.map(function(f){var x=c[f.id],den=x.answered||0,qs=QUESTIONS.filter(function(q){return q.form===f.id});return {id:f.id,title:f.sh+' / '+f.sp,shadow:{title:f.sh,score:den?x.sh/den*100:null,how:f.shHow},support:{title:f.sp,score:den?x.sp/den*100:null,how:f.spHow},answered:x.answered,why:f.why,items:qs.map(function(q){var v=answers[q.id];return {id:q.id,question:q.text,choice:v||'none',label:v==='right'?q.rightLeaf.title:q.leftLeaf.title,detail:v==='right'?q.rightLeaf.detail:q.leftLeaf.detail,alternative:v==='right'?q.leftLeaf.title:q.rightLeaf.title,leafLeft:q.leftLeaf,leafRight:q.rightLeaf}})}})})});return {version:3,sectors:sectors,cells:c,answers:answers,completedAt:Date.now()}}
function detailsHtml(r,fn){var g=fn||gf,h='',n=0;(r.sectors||[]).forEach(function(s){var sObj=S.filter(function(x){return x.id===s.id})[0];h+='<section class="bw-sector"><h2>'+esc(s.title)+(sObj&&sObj.m?' ↔ '+esc(sObj.m.t):'')+'</h2>';s.forms.forEach(function(f){h+='<article><h3>'+esc(g(f.title))+'</h3><p class="bw-why">'+esc(g(f.why))+'</p>';f.items.forEach(function(it){[['leafLeft',it.choice==='left'||it.choice==='both'],['leafRight',it.choice==='right'||it.choice==='both']].forEach(function(pair){var leaf=it[pair[0]],active=pair[1],status=it.choice==='none'?'ответ не дан':active?(it.choice==='both'?'оба способа бывают':'отмечено в ответе'):'не выбрано в этой ситуации';n++;h+='<div class="bw-leaf"><b>'+n+'. '+esc(g(leaf.title))+'</b><p>'+esc(g(leaf.detail))+'</p><small>'+status+'</small></div>'})});h+='<p><b>Самопредательство:</b> '+(f.shadow.score==null?'недостаточно ответов':Math.round(f.shadow.score)+'%')+' · <b>Опора:</b> '+(f.support.score==null?'недостаточно ответов':Math.round(f.support.score)+'%')+'</p></article>'});h+='</section>'});return h}
function intro(){return 'Иногда один и тот же человек в одних обстоятельствах отодвигает себя, а в других умеет опираться на себя. Здесь мы посмотрим на конкретные ситуации из обычной жизни. Выбирай то, что чаще похоже на твое поведение сейчас. Здесь нет правильных ответов.'}
function shuffleSeed(seed){var x=2166136261;seed=String(seed||'');for(var i=0;i<seed.length;i++){x^=seed.charCodeAt(i);x=Math.imul(x,16777619)}return x>>>0}
function ordered(seed){var a=QUESTIONS.slice(),x=shuffleSeed(seed)||1;for(var i=a.length-1;i>0;i--){x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;var j=x%(i+1),t=a[i];a[i]=a[j];a[j]=t}return a}
function progress(answers){return Object.keys(answers||{}).filter(function(k){return QUESTIONS.some(function(q){return q.id===k})}).length}
function legacyPicked(rec){var out=[];S.forEach(function(s){var v=rec&&rec.sectors&&rec.sectors.filter(function(x){return x.id===s.id})[0];if(v&&v.forms.some(function(f){return f.shadow.score>=50}))out.push(s.id)});return out}
function summaryHtml(r,fn){var g=fn||gf,h='<div class="bw-sum"><p><b class="bw-gold">Как читать карту.</b> Проценты показывают долю каждого способа среди отвеченных ситуаций, относящихся к этой паре. Это не процент личности и не оценка человека.</p>';(r.sectors||[]).forEach(function(s){var sObj=S.filter(function(x){return x.id===s.id})[0];h+='<p><b>'+esc(s.title)+(sObj&&sObj.m?' ↔ '+esc(sObj.m.t):'')+':</b> ';h+=s.forms.map(function(f){return esc(g(f.shadow.title))+' — '+(f.shadow.score==null?'нет данных':Math.round(f.shadow.score)+'%')+'; '+esc(g(f.support.title))+' — '+(f.support.score==null?'нет данных':Math.round(f.support.score)+'%')}).join('. ')+'.</p>'});return h+'</div>'}
function css(){if(document.getElementById('bw-css'))return;var st=document.createElement('style');st.id='bw-css';st.textContent=
'.bw-wheel-wrap{position:relative;width:100%;aspect-ratio:1/1;margin:10px auto;border-radius:50%;overflow:hidden;background:#120d07;box-shadow:0 0 28px rgba(0,0,0,.55),0 0 0 1px rgba(201,164,106,.35)}'+
'.bw-bg-tex{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 52%;opacity:.25;pointer-events:none;z-index:1;filter:saturate(.9) contrast(1.05)}'+
'.bw-wheel-wrap .bw-svg{position:relative;z-index:2;display:block;width:100%;height:100%;margin:0}'+
'.bw-svg{display:block;margin:8px auto;max-width:100%;height:auto}'+
'.bw-labels text{paint-order:stroke;stroke:rgba(14,10,5,.92);stroke-width:1.8px;stroke-linejoin:round}'+
'@keyframes bwRevealRing{0%{opacity:0;filter:blur(6px)}100%{opacity:1;filter:blur(0)}}'+
'@keyframes bwRevealAura{0%{box-shadow:0 0 0 rgba(240,200,112,0)}45%{box-shadow:0 0 40px rgba(240,200,112,.42),0 0 0 1.5px rgba(240,200,112,.75)}100%{box-shadow:0 0 28px rgba(0,0,0,.55),0 0 0 1px rgba(201,164,106,.45)}}'+
'.bw-revealing-wrap{animation:bwRevealAura 1.8s ease-out both}'+
'.bw-reveal .bw-ring{opacity:0;animation:bwRevealRing .72s cubic-bezier(.22,.72,.28,1) forwards}'+
'.bw-reveal .bw-ring-1{animation-delay:.18s}'+
'.bw-reveal .bw-ring-2{animation-delay:.64s}'+
'.bw-reveal .bw-ring-3{animation-delay:1.1s}'+
'@media(prefers-reduced-motion:reduce){.bw-revealing-wrap{animation:none}.bw-reveal .bw-ring{opacity:1;filter:none;animation:none}}'+
'.bw-gold{color:#f0c870}.bw-sum p{line-height:1.55}.bw-sector{margin:20px 0}.bw-sector h2{color:#f0c870}.bw-sector article{padding:12px 0;border-top:1px solid #6a4e28}.bw-sector h3{font-size:18px;color:#f0c870;margin:12px 0 5px}.bw-sector p{font-size:16px;line-height:1.55}.bw-why{color:#c9a46a}.bw-leg{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;font-size:13px;color:#c9a46a;margin:8px 0}.bw-leg i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:5px;vertical-align:-1px}.bw-card{border:1px solid #9e783a;border-radius:16px;padding:16px;background:#17110a;margin:14px 0}.bw-choice{display:block;width:100%;text-align:left;margin:9px 0;padding:14px;border:1px solid #6a4e28;border-radius:14px;background:#120e08;color:#f4ecdf;font:500 16px/1.5 Manrope,sans-serif}.bw-choice small{display:block;color:#c9a46a;font-size:12px;margin-bottom:5px}.bw-mid{display:block;margin:8px auto;background:none;border:0;color:#c9a46a;font:500 14px Manrope;padding:8px}.bw-progress{height:6px;background:#3a2a18;border-radius:8px;overflow:hidden}.bw-progress i{display:block;height:100%;background:#e0a940}.bw-legend{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;font-size:13px;color:#c9a46a}.bw-legend span{white-space:nowrap}.bw-map-key{text-align:center;color:#c9a46a;font-size:12px;line-height:1.45;margin:6px 0 12px}.bw-leaf{padding:9px 0;border-top:1px solid rgba(201,164,106,.2)}.bw-leaf b{color:#f0c870}.bw-leaf p{margin:4px 0}.bw-leaf small{color:#c9a46a;font-size:12px}';document.head.appendChild(st)}
function legend(){return '<div class="bw-legend"><span><i style="background:linear-gradient(135deg,#e48d83,#94393e)"></i>Левая половина · Самопредательство</span><span><i style="background:linear-gradient(135deg,#fff0bd,#b9c9a2)"></i>Правая половина · Опора на себя</span></div><p class="bw-map-key">В центре — Я. Слева 6 направлений самопредательства и 12 ветвей, справа 6 зеркальных направлений опоры и 12 ветвей. Внешний круг — 48 проявлений по номерам ниже.</p>'}
window.GBW={S:S,FORMS:FORMS,QUESTIONS:QUESTIONS,gf:gf,blank:blank,aggregate:aggregate,isoDay:isoDay,daysAgg:daysAgg,fromRates:fromRates,summary:summary,svg:svg,result:result,detailsHtml:detailsHtml,intro:intro,ordered:ordered,progress:progress,legacyPicked:legacyPicked,summaryHtml:summaryHtml,css:css,legend:legend};
})();
