/* Реактор 28 дней: Состояние Героя (Sims), быстрые отметки по сферам для «Зеркала прожитой жизни»,
   три картины колеса, шаги целей по неделям, карта разделов. Подключается из track28.js через GReactor.init. */
(function(){
'use strict';
var H={};
var SPH=[{k:'health',n:'Здоровье',s:'Здор.'},{k:'money',n:'Финансы',s:'Фин.'},{k:'work',n:'Карьера',s:'Карьера'},{k:'relationships',n:'Отношения',s:'Отнош.'},{k:'family',n:'Семья',s:'Семья'},{k:'friends',n:'Друзья',s:'Друзья'},{k:'growth',n:'Рост',s:'Рост'},{k:'rest',n:'Отдых',s:'Отдых'}];
var STATE=[
 {key:'energy',name:'Энергия',q:'Сколько у меня сейчас сил?',color:'#C4A35A'},
 {key:'mood',name:'Настроение',q:'Каков мой эмоциональный фон?',color:'#7FA968'},
 {key:'well',name:'Самочувствие',q:'Как я ощущаю себя физически?',color:'#6C86A0'},
 {key:'presence',name:'Присутствие',q:'Насколько я здесь, в настоящем?',color:'#B4552D'},
 {key:'support',name:'Внутренняя опора',q:'Насколько я чувствую опору на себя?',color:'#C47A8A'}
];
var PERIODS=[{a:1,b:7,t:'Настройка и наблюдение'},{a:8,b:14,t:'Обнаружение повторяющихся закономерностей'},{a:15,b:21,t:'Проверка новых решений в жизни'},{a:22,b:28,t:'Закрепление и подготовка итогов'}];
var KIND=[['act','{делал|делала}'],['mind','{думал|думала}, {переживал|переживала}'],['wish','хотелось, но не случилось']];
var INIT=[['self','сам{|а}'],['must','надо']];
var EMO=[['joy','радость'],['calm','спокойствие'],['interest','интерес'],['tension','напряжение'],['anxiety','тревога'],['fatigue','усталость']];
var AFTER=[['better','стало лучше'],['same','так же'],['worse','стало хуже']];
var DUR=[[15,'15 мин'],[30,'30 мин'],[60,'1 ч'],[120,'2 ч'],[180,'3 ч+']];
var SELF_MOT={own:1,important:1,care:1,restore:1};
var MUST_MOT={duty:1,need:1,external:1};
var GOOD_EMO={joy:1,calm:1,interest:1,satisfaction:1};
var HEAVY_EMO={tension:1,anxiety:1,irritation:1,fatigue:1,emptiness:1,sadness:1};
var SECTIONS=[
 ['Самость','фундаментальная работа с собой','href','samost.html'],
 ['Мой день','день, состояние, дела','space','day'],
 ['Колесо и Зеркало','начало, наблюдение, финал','space','wheel'],
 ['Состояние Героя','пять показателей и графики','space','state'],
 ['Мои желания','цели и шаги по неделям','space','directions'],
 ['Благодарность','дневник благодарности','pr','grat'],
 ['Выбираю — делаю','импульс и его завершение','pr','choose'],
 ['Присутствие','тишина и возвращение в момент','pr','pract'],
 ['Новые привычки','новое действие день за днем','pr','habit'],
 ['Аскеза','добровольное обязательство','pr','askeza'],
 ['Практики','каталог, включить на выбор','space','practs'],
 ['Герой','персонаж и его развитие','space','hero'],
 ['Путь','этапы и итоги Реактора','space','results']
];
function esc(s){return H.esc?H.esc(s):String(s==null?'':s)}
function gx(s){return H.gx?H.gx(s):s}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function num(v){return v==null||v===''||!isFinite(+v)?null:+v}
function avg(a){a=a.filter(function(v){return v!=null});return a.length?a.reduce(function(p,c){return p+c},0)/a.length:null}
function sphName(k){var s=SPH.filter(function(x){return x.k===k})[0];return s?s.n:k}

function periodOf(n){n=clamp(+n||1,1,28);return PERIODS[Math.floor((n-1)/7)]}
function periodLine(n){var p=periodOf(n);return '<p class="rx-period">Дни '+p.a+'–'+p.b+' · '+esc(p.t)+'</p>'}

/* ---------- state values ---------- */
function stateVal(d,key){var v=num(d&&d.sliders&&d.sliders[key]);if(v==null)v=num(d&&d.am&&d.am[key]);return v}
function dayOf(T,n){return H.dayRec?H.dayRec(T,n):((T.days||{})[String(n)]||{})}

/* ---------- quick marks + events per sphere ---------- */
function marksOf(T,n){T.marks24=T.marks24||{};return T.marks24[n]||[]}
function sphereStats(T){
 var S={},recs=0,days={},act=0,mind=0;
 SPH.forEach(function(x){S[x.k]={time:0,att:0,act:0,mind:0,wish:0,self:0,must:0,good:0,heavy:0,better:0,worse:0,wishes:[]}});
 var ms=H.mirrorActivityStats?H.mirrorActivityStats(T):null;
 if(ms)SPH.forEach(function(x){S[x.k].time+=ms.bySphere[x.k]||0});
 var ev=T.events24||{};
 Object.keys(ev).forEach(function(n){(ev[n]||[]).forEach(function(e){var s=S[e.sphere];if(!s)return;recs++;days[n]=1;s.att++;if(e.completion!=='not_done'){s.act++;act++}
  if(SELF_MOT[e.motive])s.self++;if(MUST_MOT[e.motive])s.must++;if(GOOD_EMO[e.emotion])s.good++;if(HEAVY_EMO[e.emotion])s.heavy++;if(e.after==='better')s.better++;if(e.after==='worse')s.worse++;if(e.alternative)s.wishes.push(e.alternative)})});
 var mk=T.marks24||{};
 Object.keys(mk).forEach(function(n){(mk[n]||[]).forEach(function(m){var s=S[m.sph];if(!s)return;recs++;days[n]=1;
  if(m.kind==='wish'){s.wish++;if(m.text)s.wishes.push(m.text);return}
  s.att++;if(m.kind==='mind'){s.mind++;mind++}else{s.act++;act++;if(m.dur)s.time+=+m.dur||0}
  if(m.init==='self')s.self++;if(m.init==='must')s.must++;if(GOOD_EMO[m.emo])s.good++;if(HEAVY_EMO[m.emo])s.heavy++;if(m.after==='better')s.better++;if(m.after==='worse')s.worse++})});
 var maxT=0,maxA=0;SPH.forEach(function(x){maxT=Math.max(maxT,S[x.k].time);maxA=Math.max(maxA,S[x.k].att)});
 var totalT=SPH.reduce(function(p,x){return p+S[x.k].time},0);
 var useTime=totalT>=120;
 var wheel=SPH.map(function(x){var s=S[x.k];if(!maxA&&!maxT)return null;var a=maxA?s.att/maxA:0,t=maxT?s.time/maxT:0;return Math.round((useTime?(a+t)/2:a)*100)/10});
 return {S:S,records:recs,days:Object.keys(days).length,wheel:wheel,useTime:useTime,totalTime:totalT,act:act,mind:mind};
}
function fewData(st){return st.records<10||st.days<7}
function fewDataNote(st){
 if(!st.records)return '<p class="rx-note">Записей со сферами пока нет. Картина появится, когда ты начнешь отмечать дела в «Моем дне».</p>';
 if(fewData(st))return '<p class="rx-note">Записей пока мало: '+st.records+' за '+st.days+' дн. Картина неполная, выводы очень предварительные.</p>';
 return '';
}

/* ---------- mini wheel ---------- */
function miniWheel(values,label,sub){
 var cx=70,cy=70,r=44,pts=[],all=true,svg='';
 [0.5,1].forEach(function(v){svg+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*v)+'" fill="none" stroke="#8a795f" stroke-opacity=".4"/>'});
 SPH.forEach(function(x,i){var an=-Math.PI/2+i*Math.PI/4,ex=cx+Math.cos(an)*r,ey=cy+Math.sin(an)*r,lx=cx+Math.cos(an)*(r+15),ly=cy+Math.sin(an)*(r+15);
  svg+='<line x1="'+cx+'" y1="'+cy+'" x2="'+ex.toFixed(1)+'" y2="'+ey.toFixed(1)+'" stroke="#8a795f" stroke-opacity=".35"/><text x="'+lx.toFixed(1)+'" y="'+(ly+3).toFixed(1)+'" text-anchor="middle" font-size="8.5" fill="#d7c6a7">'+x.s+'</text>';
  var v=values&&values[i];if(typeof v==='number'&&isFinite(v)){var rr=clamp(v,0,10)/10*r;pts.push([cx+Math.cos(an)*rr,cy+Math.sin(an)*rr])}else{all=false;pts.push(null)}});
 var ok=pts.filter(Boolean);
 if(ok.length>=3)svg+='<polygon points="'+ok.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' ')+'" fill="#a8b294" fill-opacity=".28" stroke="#d1b27b" stroke-width="1.6"/>';
 ok.forEach(function(p){svg+='<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="2.4" fill="#e4c58d"/>'});
 return '<figure class="rx-wheel"><svg viewBox="0 0 140 140" role="img" aria-label="'+esc(label)+'">'+svg+'</svg><figcaption><b>'+esc(label)+'</b><span>'+esc(sub)+'</span></figcaption></figure>';
}
function fmtMin(m){m=Math.round(m||0);if(!m)return '0';var h=Math.floor(m/60),mm=m%60;return (h?h+' ч':'')+(mm?(h?' ':'')+mm+' мин':'')}

function observations(init,fin,st){
 var out=[],S=st.S;
 SPH.forEach(function(x,i){
  var a=num(init&&init[i]),c=num(fin&&fin[i]),o=st.wheel[i],s=S[x.k],q='«'+x.n+'»';
  if(a!=null&&o!=null&&a>=7&&o>=6)out.push([2,q+': высокая оценка, и по твоим записям сфера часто была в днях. Здесь восприятие и повседневность совпадают.']);
  if(a!=null&&o!=null&&a>=7&&o<=3)out.push([1,q+': в начале '+a+' из 10, а по твоим записям сфера редко появлялась в делах и мыслях ('+s.att+'). Это расхождение, его стоит рассмотреть, а не оценивать.']);
  if(a!=null&&o!=null&&a<=4&&o>=7)out.push([1,q+': по твоим записям сфера занимала много места, а оценка в начале была '+a+' из 10. Возможно, сил туда уходит много, а удовлетворения пока мало.']);
  if(s.mind>=3&&s.mind>=s.act)out.push([1,q+': внимание чаще уходило в мысли и переживания ('+s.mind+'), чем в действия ('+s.act+').']);
  if(s.must>=3&&s.must>=2*s.self)out.push([1,q+': по твоим записям действия чаще шли из «надо» ('+s.must+'), чем по собственной инициативе ('+s.self+').']);
  if(s.self>=3&&s.self>=2*s.must)out.push([3,q+': здесь ты чаще '+gx('{действовал|действовала}')+' по собственной инициативе ('+s.self+').']);
  if(s.wish>=2)out.push([2,q+': '+s.wish+' раз хотелось, но не случилось.'+(s.wishes.length?' Например: «'+s.wishes[s.wishes.length-1]+'».':'')]);
  if(a!=null&&c!=null&&Math.abs(c-a)>=2)out.push([2,q+': оценка изменилась с '+a+' на '+c+'.']);
  if(s.better>=3&&s.better>s.worse*2)out.push([3,q+': после дел здесь чаще было «стало лучше». Это замечено вместе и не говорит о причине.']);
 });
 out.sort(function(p,q){return p[0]-q[0]});
 return out.slice(0,7).map(function(x){return x[1]});
}
function threeWheels(P,T,init,fin){
 var st=sphereStats(T),h='<section class="rx-three"><h2>Три картины рядом</h2><p class="mute">Первая и третья картины — твоя оценка удовлетворенности. Вторая — сколько места сфера заняла в твоих записях за 28 дней (самая частая = 10). Это не объективная истина, а картина по твоим собственным записям.</p>';
 h+='<div class="rx-three-grid">'+miniWheel(init,'В начале','восприятие')+miniWheel(st.records>=3?st.wheel:null,'По записям',st.useTime?'время и внимание':'внимание')+miniWheel(fin,'Сейчас','новое восприятие')+'</div>';
 h+=fewDataNote(st);
 h+='<div class="rx-table"><div class="rx-tr rx-th"><span>Сфера</span><span>Было</span><span>Записи</span><span>Сам/надо</span><span>Стало</span></div>';
 SPH.forEach(function(x,i){var s=st.S[x.k];h+='<div class="rx-tr"><b>'+x.n+'</b><span>'+(num(init&&init[i])==null?'—':init[i])+'</span><span>'+s.att+(s.time?' · '+fmtMin(s.time):'')+'</span><span>'+s.self+'/'+s.must+'</span><span>'+(num(fin&&fin[i])==null?'—':fin[i])+'</span></div>'});
 h+='</div>';
 var obs=observations(init,fin,st);
 h+='<h3>Что видно</h3>'+(obs.length?'<ul class="rx-obs">'+obs.map(function(o){return '<li>'+esc(o)+'</li>'}).join('')+'</ul>':'<p class="mute">Явных совпадений или расхождений по твоим записям пока не видно.</p>');
 h+='<p class="mute">Расхождение не ошибка: время, внимание и удовлетворенность — разные стороны жизни.</p></section>';
 return h;
}

/* ---------- Мой день: Состояние Героя ---------- */
function simsBars(vals,editable,part){
 return STATE.map(function(m){var v=vals[m.key],pct=v==null?0:v*10;
  var h='<div class="rx-bar"><div class="rx-bar-h"><b>'+m.name+'</b><span>'+(v==null?'нет отметки':pct+'/100')+'</span></div><small>'+esc(m.q)+'</small><div class="rx-track"><i style="width:'+pct+'%;background:'+m.color+'"></i></div>';
  if(editable){h+='<div class="rx-ten">';for(var i=1;i<=10;i++)h+='<button type="button" class="'+(v===i?'on':'')+'" data-act="rx-state" data-k="'+m.key+'" data-v="'+i+'" data-part="'+part+'">'+i+'</button>';h+='</div>'}
  return h+'</div>'}).join('');
}
function dayResources(T,n){
 var d=dayOf(T,n),ms=marksOf(T,n),evs=(T.events24||{})[n]||[],min=0,act=0,mind=0,planned=0,done=0;
 evs.forEach(function(e){var a=+e.startMin,b=+e.endMin;if(isFinite(a)&&isFinite(b)&&b>a)min+=Math.min(b,1440)-a;if(e.completion!=='not_done')act++});
 ms.forEach(function(m){if(m.kind==='mind')mind++;else if(m.kind==='act'){act++;min+=+m.dur||0}});
 (d.choose||[]).forEach(function(c){if(c.bonus)return;planned++;if(c.status==='done')done++});
 if(d.res&&d.res.v){planned++;if(d.res.v==='done'||d.res.v==='part'||d.res.v==='min')done++}else if(T.strategy)planned++;
 (d.dirState||[]).forEach(function(s){if(s==='done')act++});
 return {min:min,act:act,mind:mind,planned:planned,done:done};
}
function resourcesHtml(T,n){
 var r=dayResources(T,n);
 var rows=[['Время',r.min?fmtMin(r.min)+' записано':'нет записей',clamp(r.min/480,0,1)],['Внимание',(r.act+r.mind)?'в делах '+r.act+' · в мыслях '+r.mind:'нет отметок',(r.act+r.mind)?r.act/(r.act+r.mind):0],['Действия',r.act?String(r.act):'пока нет',clamp(r.act/5,0,1)],['Намерения',r.planned?r.done+' из '+r.planned+' подтверждено делом':'нет намерений',r.planned?r.done/r.planned:0]];
 return '<div class="rx-res"><p class="dk">Ресурсы дня · считаются из записей</p>'+rows.map(function(x){return '<div class="rx-res-row"><b>'+x[0]+'</b><div class="rx-track sm"><i style="width:'+Math.round(x[2]*100)+'%"></i></div><span>'+esc(x[1])+'</span></div>'}).join('')+'</div>';
}
function simsBlock(T,n){
 var d=dayOf(T,n),part=T.statePart||(new Date().getHours()<12?'am':'pm');
 var vals={};STATE.forEach(function(m){vals[m.key]=part==='am'?num(d.am&&d.am[m.key]):num(d.sliders&&d.sliders[m.key])});
 var h='<div class="rx-seg"><button type="button" class="'+(part==='am'?'on':'')+'" data-act="rx-part" data-p="am">Настрой дня · утро</button><button type="button" class="'+(part==='pm'?'on':'')+'" data-act="rx-part" data-p="pm">Итог дня · вечер</button></div>';
 h+='<p class="mute">'+(part==='am'?'Необязательно. Коротко отметь, с чем входишь в день.':'Главная отметка дня. Коснись числа от 1 до 10.')+'</p>';
 h+=simsBars(vals,true,part)+resourcesHtml(T,n);
 h+='<button type="button" class="quiet-btn" data-act="space" data-s="state">Графики состояния за 28 дней</button>';
 return h;
}
function simsSub(T,n){var d=dayOf(T,n),c=0;STATE.forEach(function(m){if(stateVal(d,m.key)!=null)c++});return c?'отмечено '+c+' из 5':'утро по желанию · вечером итог'}

/* ---------- Мой день: быстрая отметка ---------- */
function chips(field,items,cur){return '<div class="chips rx-chips">'+items.map(function(x){return '<button type="button" class="'+(String(cur)===String(x[0])?'on':'')+'" data-act="rx-md" data-f="'+field+'" data-v="'+x[0]+'">'+esc(gx(x[1]))+'</button>'}).join('')+'</div>'}
function quickBody(T,n){
 var dr=(T.markDraft&&T.markDraft.n===n)?T.markDraft:{n:n,kind:'act'},list=marksOf(T,n);
 var h='<p class="mute">Одно касание по сфере, остальное по желанию. Из этих отметок складывается вторая картина колеса.</p>';
 if(list.length)h+=list.map(function(m){var bits=[sphName(m.sph),gx((KIND.filter(function(k){return k[0]===m.kind})[0]||['',''])[1])];if(m.init)bits.push(gx((INIT.filter(function(k){return k[0]===m.init})[0]||['',''])[1]));if(m.emo)bits.push((EMO.filter(function(k){return k[0]===m.emo})[0]||['',''])[1]);if(m.after)bits.push((AFTER.filter(function(k){return k[0]===m.after})[0]||['',''])[1]);if(m.dur)bits.push(fmtMin(m.dur));
  return '<div class="rx-mark"><span>'+(m.text?'<b>'+esc(m.text)+'</b> · ':'')+esc(bits.join(' · '))+'</span><button type="button" class="quiet-btn" data-act="rx-mdel" data-id="'+esc(m.id)+'">×</button></div>'}).join('');
 h+='<p class="rx-lab">Сфера</p>'+chips('sph',SPH.map(function(x){return [x.k,x.n]}),dr.sph||'');
 h+='<p class="rx-lab">Что было</p>'+chips('kind',KIND,dr.kind||'act');
 if(dr.kind!=='wish'){
  h+='<p class="rx-lab">Почему</p>'+chips('init',INIT,dr.init||'');
  h+='<p class="rx-lab">Что чувствовал'+gx('{|а}')+'</p>'+chips('emo',EMO,dr.emo||'');
  h+='<p class="rx-lab">Как стало после</p>'+chips('after',AFTER,dr.after||'');
  if(dr.kind==='act')h+='<p class="rx-lab">Сколько времени</p>'+chips('dur',DUR,dr.dur||'');
 }
 h+='<input type="text" maxlength="120" data-act="rx-mtext" value="'+esc(dr.text||'')+'" placeholder="'+(dr.kind==='wish'?'Что хотелось сделать':'Пара слов, по желанию')+'">';
 h+='<button type="button" class="add" data-act="rx-madd"'+(dr.sph?'':' disabled')+'>Сохранить отметку</button>';
 return h;
}
function quickSub(T,n){var c=marksOf(T,n).length;return c?'отметок: '+c:'сфера, сам или надо, отклик'}

/* ---------- цели и шаги ---------- */
function goals(P,T){
 var ds=H.dirs?H.dirs(T):[];
 if(ds.length)return ds.map(function(d){return d.text});
 var w=(H.wishText&&H.wishText(T))||(P.pathPlan&&P.pathPlan.wish)||((P.desireLab&&typeof P.desireLab.desire==='string')?P.desireLab.desire:'');
 return w?[w]:[];
}
function ladder(T,i,text){
 T.goalSteps=T.goalSteps||{};var g=T.goalSteps[i];
 if(!g||(g.goal&&text&&g.goal!==text&&!g.weeks.some(function(w){return w.t}))){g={goal:text,weeks:[{},{},{},{}]};T.goalSteps[i]=g}
 if(!g.goal)g.goal=text;g.weeks=g.weeks||[{},{},{},{}];while(g.weeks.length<4)g.weeks.push({});
 return g;
}
function goalProgress(T,i){var g=(T.goalSteps||{})[i],wd=0,dd=0;if(g)g.weeks.forEach(function(w){if(w.done)wd++});for(var n=1;n<=28;n++){var d=dayOf(T,n);if((d.dirState||[])[i]==='done')dd++}return {weeks:wd,days:dd}}
/* ---------- движок целей: готовность, минимум, план на помеху (только выбор из вариантов) ---------- */
var gpOpen=-1;
function gpId(P,T,i){var GP=window.GGoalPath;if(!GP)return '';var ds=T.directions||[];if(ds[i])return GP.goalId(ds[i],i);var gs=goals(P,T);return gs[i]?GP.goalId({text:gs[i]},i):''}
function gpPlan(P,T,i){var GP=window.GGoalPath;if(!GP)return {};try{GP.syncDirections(T)}catch(e){}return GP.planFor(T,gpId(P,T,i))||{}}
function gpIfThen(P,T,i){
 var GP=window.GGoalPath;if(!GP)return '';
 var pl=gpPlan(P,T,i),w=pl.woop||{},o=GP.ifThenOptions(w.obstacle),line=GP.ifThenText(w);
 var h='<details class="rx-if"'+(gpOpen===i?' open':'')+'><summary>'+(line?esc(line):'Если что-то помешает')+'</summary><p class="mute">Что может помешать?</p><div class="chips">'+o.obstacles.map(function(x){return '<button type="button" class="'+(w.obstacle===x.id?'on':'')+'" data-act="rx-ob" data-g="'+i+'" data-v="'+x.id+'">'+esc(x.t)+'</button>'}).join('')+'</div>';
 if(w.obstacle)h+='<p class="mute">Тогда я…</p><div class="chips">'+o.responses.map(function(x){return '<button type="button" class="'+(w.response===x.id?'on':'')+'" data-act="rx-if" data-g="'+i+'" data-v="'+x.id+'">'+esc(x.t)+'</button>'}).join('')+'</div>';
 return h+'</details>';
}
var READY_CHIPS=[['ready','Можно начинать'],['time','Нужно найти время'],['gaps','Чего-то не хватает'],['foundation','Сначала подготовиться']];
var STEP_HINT=['Первый маленький шаг: прояснить и начать','Повторять и замечать, что мешает','Попробовать новое решение','Закрепить и подвести итог'];
function goalsEditor(P,T){
 var gs=goals(P,T);if(!gs.length)return '';
 var h='<section class="rx-goals"><h2>Шаги по неделям</h2><p class="mute">Разбей каждую цель на четыре небольших шага, по одному на период. В «Моем дне» появится шаг текущей недели. Шаг можно уменьшить, если он не идет.</p>';
 gs.forEach(function(text,i){
  var g=ladder(T,i,text),pr=goalProgress(T,i);
  var pl=gpPlan(P,T,i),hints=STEP_HINT.slice();
  if(window.GGoalPath&&pl.readiness){try{var sc=GGoalPath.scaffold({id:gpId(P,T,i),text:text},{level:pl.readiness},GGoalPath.styleFor(P));hints=sc.weeks.map(function(x){return x.title})}catch(e){}}
  h+='<div class="rx-goal"><p class="dk">Цель '+(i+1)+'</p><b>'+esc(text)+'</b><div class="rx-track sm"><i style="width:'+Math.round(pr.weeks/4*100)+'%"></i></div><p class="mute">Шагов недели сделано: '+pr.weeks+' из 4 · дней с шагом: '+pr.days+'</p>';
  if(window.GGoalPath)h+='<p class="mute">С чего начать</p><div class="chips">'+READY_CHIPS.map(function(r){return '<button type="button" class="'+(pl.readiness===r[0]?'on':'')+'" data-act="rx-ready" data-g="'+i+'" data-v="'+r[0]+'">'+esc(r[1])+'</button>'}).join('')+'</div>';
  PERIODS.forEach(function(p,w){var W=g.weeks[w]||{};
   h+='<div class="rx-step"><label>Дни '+p.a+'–'+p.b+' · '+esc(p.t)+'<input type="text" maxlength="160" data-act="rx-step" data-g="'+i+'" data-w="'+w+'" value="'+esc(W.t||'')+'" placeholder="'+esc(hints[w])+'"></label>';
   if(W.small!=null)h+='<label class="rx-small">Версия поменьше<input type="text" maxlength="160" data-act="rx-small" data-g="'+i+'" data-w="'+w+'" value="'+esc(W.small||'')+'" placeholder="Что точно получится даже в трудный день"></label>';
   h+='<div class="chips"><button type="button" class="'+(W.done?'on':'')+'" data-act="rx-wdone" data-g="'+i+'" data-w="'+w+'">'+(W.done?'Шаг недели сделан':'Отметить шаг недели')+'</button>'+(W.small==null&&W.t?'<button type="button" data-act="rx-shrink" data-g="'+i+'" data-w="'+w+'">Шаг не идет, уменьшить</button>':'')+'</div></div>';
  });
  h+='</div>';
 });
 return h+'</section>';
}
var capOpen=-1;
function capBlock(P,T,n,i,w,W,step){
 var GP=window.GGoalPath,GC=window.GCapacity;if(!GP||!GC)return {hint:'',edit:''};
 var plan=gpPlan(P,T,i),stalled=false;
 if(n>3){stalled=true;for(var k=n-1;k>=n-3;k--){if(((dayOf(T,k).dirState)||[])[i]==='done'){stalled=false;break}}}
 var wsE=(P.strategyWorkshop&&P.strategyWorkshop.entries||[]).slice(-1)[0];
 var gsph=null;try{var gid=gpId(P,T,i),gg=((T.goalPath||{}).goals||{})[gid];gsph=gg&&gg.sphere}catch(e){}
 var hn=step?GC.hint(P,plan,{day:n,sphere:gsph,stalled:stalled,people:!!(wsE&&wsE.group==='people'),calc:window.GNature&&GNature.calc,name:function(k){try{return GNature.name(k,window.GGender?GGender(P)==='f':P.gender==='f')}catch(e){return ''}}}):null;
 var hint=hn?'<p class="rx-cap"><b>'+esc(gx('Формат шага: '+hn.tag))+'.</b> '+esc(gx(hn.text))+'</p>':'';
 var pc=plan.capacity||{},gc=P.capacity||{},cs=pc.start||gc.start,su=pc.support||gc.support,ch=function(act,f,list,cur){return '<div class="chips">'+list.map(function(x){return '<button type="button" class="'+(cur===x.id?'on':'')+'" data-act="'+act+'" data-g="'+i+'"'+(f?' data-f="'+f+'"':'')+' data-w="'+w+'" data-v="'+x.id+'">'+esc(gx(x.t))+'</button>'}).join('')+'</div>'};
 var edit='<details class="rx-if rx-capd"'+(capOpen===i?' open':'')+'><summary>Как тебе легче идти к этой цели</summary><p class="mute">Мне проще начинать, когда…</p>'+ch('rx-cap','start',GC.start,cs)+'<p class="mute">'+esc(gx('Что лучше не тянуть одн{ому|ой}?'))+'</p>'+ch('rx-cap','support',GC.support,su)+'<p class="mute">Как поймешь, что цель сдвинулась?</p>'+ch('rx-crit','',GP.criteria,plan.criterion)+'</details>';
 if(W.done){var oc=((plan.outcomes||{})[w]||{}).status;edit+='<p class="mute">Шаг недели сделан. Что с результатом?'+(plan.criterion?' Ориентир: '+esc(gx(GC.label(GP.criteria,plan.criterion)).toLowerCase())+'.':'')+'</p>'+ch('rx-out','',GP.outcomes,oc);if(oc==='none')edit+='<p class="mute">Так бывает. Можно спокойно посмотреть, что поменять в способе.</p><button type="button" class="quiet-btn" data-act="space" data-s="workshop">Открыть Мастерскую стратегий</button>'}
 return {hint:hint,edit:edit,why:hn?gx(hn.why):''};
}
function goalToday(P,T,n,focus){
 var gs=goals(P,T);if(!gs.length)return '';
 var i=(focus!=null&&focus>=0&&focus<gs.length)?focus:((n-1)%gs.length),w=Math.floor((clamp(n,1,28)-1)/7),g=ladder(T,i,gs[i]),W=g.weeks[w]||{},d=dayOf(T,n);
 var step=(W.small||W.t||'').trim(),doneToday=(d.dirState||[])[i]==='done';
 var h='<div class="rx-today"><p class="dk">Шаг по цели · неделя '+(w+1)+'</p><span class="ftag">'+esc(gs[i])+'</span>';
 if(step)h+='<p class="main">'+esc(step)+'</p><div class="chips"><button type="button" class="'+(doneToday?'on':'')+'" data-act="rx-gday" data-g="'+i+'">'+(doneToday?'Сегодня сделано':'Сделано сегодня')+'</button><button type="button" class="'+(W.done?'on':'')+'" data-act="rx-wdone" data-g="'+i+'" data-w="'+w+'">'+(W.done?'Шаг недели закрыт':'Закрыть шаг недели')+'</button>'+(W.small==null?'<button type="button" data-act="rx-shrink" data-g="'+i+'" data-w="'+w+'" data-go="1">Уменьшить</button>':'')+'</div>';
 else h+='<p class="mute">Для этой недели шаг еще не задан.</p><button type="button" class="quiet-btn" data-act="space" data-s="directions">Разбить цель на шаги</button>';
 var vals=((P.valuesCore&&P.valuesCore.top3)||(P.values&&P.values.order)||[]).slice(0,3).filter(function(v){return typeof v==='string'&&v});
 var cap={hint:'',edit:'',why:''};try{cap=capBlock(P,T,n,i,w,W,step)}catch(e){}
 h+=cap.hint;
 if(step&&(W.t||cap.why)){var wl=[];if(W.t)wl.push('это твой шаг на неделю '+(w+1));if(vals.length)wl.push('тебе важно: '+vals.join(', '));if(cap.why)wl.push('формат шага: '+cap.why.replace(/\.$/,''));h+='<p class="mute rx-why">Почему так: '+esc(wl.join('; '))+'.</p>'}
 var dpl=(T.directionPlans||{})[i]||{};if(step&&!W.small&&dpl.minimum)h+='<p class="mute">На трудный день: '+esc(dpl.minimum)+'</p>';
 if(step&&window.GWorkshop){try{var wsE=(P.strategyWorkshop&&P.strategyWorkshop.entries||[]).slice(-1)[0];if(wsE&&wsE.experiment&&wsE.experiment!=='none'&&(wsE.cycle||1)===(T.cycle||1)&&n>=wsE.day&&n-wsE.day<7)h+='<p class="mute rx-ws">Эксперимент недели: '+esc(gx(GWorkshop.label(GWorkshop.options(wsE.strategy).experiments,wsE.experiment)).toLowerCase())+'. После шага посмотри, что изменилось.</p>'}catch(e){}}
 if(step)h+=gpIfThen(P,T,i);
 h+=cap.edit;
 var pr=goalProgress(T,i);h+='<p class="mute">Прогресс цели: шагов недели '+pr.weeks+' из 4 · дней с шагом '+pr.days+'</p>';
 return h+'</div>';
}

/* ---------- разделы ---------- */
function sectionsBlock(){
 return '<details class="rx-sections"><summary>Разделы Реактора</summary><div class="rx-sec-grid">'+SECTIONS.map(function(s){
  var inner='<b>'+esc(s[0])+'</b><span>'+esc(s[1])+'</span>';
  if(s[2]==='href')return '<a href="'+s[3]+'">'+inner+'</a>';
  if(s[2]==='pr')return '<button type="button" data-act="rx-pr" data-id="'+s[3]+'">'+inner+'</button>';
  return '<button type="button" data-act="space" data-s="'+s[3]+'">'+inner+'</button>';
 }).join('')+'</div></details>';
}

/* ---------- графики состояния ---------- */
function lineChart(T,keys,title,to){
 var W=320,Hh=150,pl=26,pr=8,pt=12,pb=22,iw=W-pl-pr,ih=Hh-pt-pb,svg='';
 [0,50,100].forEach(function(g){var y=pt+ih-ih*g/100;svg+='<line x1="'+pl+'" y1="'+y+'" x2="'+(W-pr)+'" y2="'+y+'" stroke="#8a795f" stroke-opacity=".3"/><text x="2" y="'+(y+4)+'" font-size="10" fill="#c9a46a">'+g+'</text>'});
 [1,7,14,21,28].forEach(function(dn){var x=pl+iw*(dn-1)/27;svg+='<text x="'+x.toFixed(1)+'" y="'+(Hh-6)+'" font-size="10" fill="#c9a46a" text-anchor="middle">'+dn+'</text>'});
 [7.5,14.5,21.5].forEach(function(b){var x=pl+iw*(b-1)/27;svg+='<line x1="'+x.toFixed(1)+'" y1="'+pt+'" x2="'+x.toFixed(1)+'" y2="'+(pt+ih)+'" stroke="#8a795f" stroke-opacity=".18" stroke-dasharray="2 3"/>'});
 var legend='';
 keys.forEach(function(k){var m=STATE.filter(function(x){return x.key===k})[0],dpath='',dots='';
  for(var n=1;n<=to;n++){var v=stateVal(dayOf(T,n),k);if(v==null)continue;var x=pl+iw*(n-1)/27,y=pt+ih-ih*(v*10)/100;dpath+=(dpath?' L':'M')+x.toFixed(1)+','+y.toFixed(1);dots+='<circle cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" r="2.4" fill="'+m.color+'"/>'}
  svg+=(dpath?'<path d="'+dpath+'" fill="none" stroke="'+m.color+'" stroke-width="2"/>':'')+dots;legend+='<span><i style="background:'+m.color+'"></i>'+m.name+'</span>'});
 return '<div class="rx-chart"><p class="dk">'+esc(title)+'</p><div class="rx-legend">'+legend+'</div><svg viewBox="0 0 '+W+' '+Hh+'" role="img" aria-label="'+esc(title)+'">'+svg+'</svg></div>';
}
function weekAvg(T,w,k){var a=[];for(var n=w*7+1;n<=w*7+7;n++)a.push(stateVal(dayOf(T,n),k));return avg(a)}
function weekCompare(T,today){
 var last=Math.floor((clamp(today,1,28)-1)/7);if(last<1)return '<div class="rx-chart"><p class="dk">Неделя 1 и неделя 4</p><p class="mute">Сравнение появится, когда начнется вторая неделя.</p></div>';
 var lw=last,h='<div class="rx-chart"><p class="dk">Неделя 1 и неделя '+(lw+1)+(lw<3?' (4-я еще впереди)':'')+'</p>';
 STATE.forEach(function(m){var a=weekAvg(T,0,m.key),b=weekAvg(T,lw,m.key);
  h+='<div class="rx-wk"><b>'+m.name+'</b><div><div class="rx-track sm"><i style="width:'+(a==null?0:Math.round(a*10))+'%;background:'+m.color+';opacity:.55"></i></div><div class="rx-track sm"><i style="width:'+(b==null?0:Math.round(b*10))+'%;background:'+m.color+'"></i></div></div><span>'+(a==null?'—':Math.round(a*10))+' → '+(b==null?'—':Math.round(b*10))+'</span></div>'});
 return h+'<p class="mute">Бледная полоса — неделя 1, яркая — неделя '+(lw+1)+'. Значения 0–100 из твоих отметок 1–10.</p></div>';
}
function together(T,today){
 var rows=[];for(var n=1;n<=today;n++){var d=dayOf(T,n),e=stateVal(d,'energy');if(e==null)continue;var r=dayResources(T,n);rows.push({n:n,e:e,m:stateVal(d,'mood'),a:r.act,min:r.min})}
 if(rows.length<5)return '<p class="mute">Для сопоставлений нужно хотя бы 5 дней с отметкой энергии. Сейчас: '+rows.length+'.</p>';
 var out=[],med=rows.map(function(r){return r.a}).sort(function(a,b){return a-b})[Math.floor(rows.length/2)];
 var hi=rows.filter(function(r){return r.a>med}),lo=rows.filter(function(r){return r.a<=med});
 if(hi.length>=2&&lo.length>=2){var eh=avg(hi.map(function(r){return r.e})),el=avg(lo.map(function(r){return r.e}));if(Math.abs(eh-el)>=1)out.push('В дни, когда дел было больше, энергия в среднем была '+(eh>el?'выше':'ниже')+': '+Math.round(eh*10)+' против '+Math.round(el*10)+' из 100.')}
 var byS={};Object.keys(T.marks24||{}).forEach(function(n){(T.marks24[n]||[]).forEach(function(m){if(!m.after||!m.sph)return;var s=byS[m.sph]=byS[m.sph]||{b:0,w:0,c:0};s.c++;if(m.after==='better')s.b++;if(m.after==='worse')s.w++})});
 Object.keys(T.events24||{}).forEach(function(n){(T.events24[n]||[]).forEach(function(e){if(!e.after||!e.sphere)return;var s=byS[e.sphere]=byS[e.sphere]||{b:0,w:0,c:0};s.c++;if(e.after==='better')s.b++;if(e.after==='worse')s.w++})});
 Object.keys(byS).forEach(function(k){var s=byS[k];if(s.c>=3&&s.b/s.c>=0.6)out.push('После дел в сфере «'+sphName(k)+'» чаще отмечено «стало лучше» ('+s.b+' из '+s.c+').');if(s.c>=3&&s.w/s.c>=0.5)out.push('После дел в сфере «'+sphName(k)+'» чаще отмечено «стало хуже» ('+s.w+' из '+s.c+').')});
 if(!out.length)return '<p class="mute">Устойчивых совпадений пока не видно.</p>';
 return '<ul class="rx-obs">'+out.slice(0,4).map(function(o){return '<li>'+esc(o)+'</li>'}).join('')+'</ul><p class="mute">Это замечено вместе и не говорит о причине.</p>';
}
function viewState(P,T){
 var today=H.todayNum?H.todayNum(T):1,n=+T.openDay||today,d=dayOf(T,n),vals={};STATE.forEach(function(m){vals[m.key]=stateVal(d,m.key)});
 var h='<div class="t28"><p class="dk">Состояние Героя · день '+n+'</p><h1>Как ты сейчас</h1>'+periodLine(n);
 h+='<div class="rx-sims">'+simsBars(vals,false)+'</div>'+resourcesHtml(T,n);
 h+='<button type="button" class="quiet-btn" data-act="space" data-s="day">Отметить в «Моем дне»</button>';
 h+='<h2>Динамика за 28 дней</h2>';
 h+=lineChart(T,['energy','mood'],'Энергия и настроение',today)+lineChart(T,['well','presence'],'Самочувствие и присутствие',today)+lineChart(T,['support'],'Внутренняя опора',today);
 h+=weekCompare(T,today);
 h+='<h2>Замечено вместе</h2>'+together(T,today);
 return h+'</div>';
}
function viewWheel(P,T){
 var M=T.mirror||{},init=M.initialWheel||((P.cycleBaseline&&P.cycleBaseline.wheel)||P.wheel||[]),today=H.todayNum?H.todayNum(T):1,st=sphereStats(T);
 var h='<div class="t28"><p class="dk">Колесо баланса · Зеркало прожитой жизни</p><h1>Как ты живешь и как это ощущаешь</h1><p class="cap28">Начало — твое колесо из «Пути Алхимика». 28 дней ты отмечаешь дела по сферам. В конце снова оценишь сферы, не видя прежних чисел, и увидишь три картины рядом.</p>';
 h+='<div class="rx-three-grid two">'+miniWheel(init,'В начале','восприятие')+miniWheel(st.records>=3?st.wheel:null,'По записям','пока '+st.records+' зап.')+'</div>'+fewDataNote(st);
 if(M.phase==='report')h+='<button type="button" class="go" data-act="space" data-s="mirror">Открыть три картины</button>';
 else if(M.phase==='self'||M.phase==='research')h+='<button type="button" class="go" data-act="space" data-s="mirror">Продолжить финальную оценку</button>';
 else if(today>=28)h+='<button type="button" class="go" data-act="mirror-start">Оценить сферы заново</button><p class="mute">Сначала ответишь сам'+gx('{|а}')+', прежние оценки будут скрыты.</p>';
 else h+='<p class="mute">Финальное колесо откроется на 28-й день. Сейчас день '+today+'.</p>';
 h+='<button type="button" class="quiet-btn" data-act="space" data-s="day">Отметить дело в «Моем дне»</button>';
 return h+'</div>';
}

/* ---------- события ---------- */
function click(act,b,P,T,n){
 var d=dayOf(T,n);
 if(act==='rx-state'){var k=b.getAttribute('data-k'),v=+b.getAttribute('data-v'),part=b.getAttribute('data-part');if(part==='am'){d.am=d.am||{};d.am[k]=v}else d.sliders[k]=v;H.save(P);H.render();H.openAcc('state');return true}
 if(act==='rx-part'){T.statePart=b.getAttribute('data-p');H.save(P);H.render();H.openAcc('state');return true}
 if(act==='rx-md'){var dr=(T.markDraft&&T.markDraft.n===n)?T.markDraft:{n:n,kind:'act'},f=b.getAttribute('data-f'),v2=b.getAttribute('data-v');if(f==='dur')v2=+v2;dr[f]=(dr[f]===v2&&f!=='sph'&&f!=='kind')?'':v2;T.markDraft=dr;H.save(P);H.render();H.openAcc('quick');return true}
 if(act==='rx-madd'){var dr2=T.markDraft;if(!dr2||dr2.n!==n||!dr2.sph)return true;T.marks24=T.marks24||{};T.marks24[n]=T.marks24[n]||[];var m={id:'m'+Date.now().toString(36),t:Date.now(),sph:dr2.sph,kind:dr2.kind||'act'};['init','emo','after'].forEach(function(k){if(dr2[k]&&m.kind!=='wish')m[k]=dr2[k]});if(dr2.dur&&m.kind==='act')m.dur=+dr2.dur;if(dr2.text)m.text=String(dr2.text).trim().slice(0,120);T.marks24[n].push(m);T.markDraft={n:n,kind:m.kind};H.save(P);H.render();H.openAcc('quick');return true}
 if(act==='rx-mdel'){var id=b.getAttribute('data-id');T.marks24[n]=marksOf(T,n).filter(function(x){return x.id!==id});H.save(P);H.render();H.openAcc('quick');return true}
 if(act==='rx-ob'||act==='rx-if'||act==='rx-ready'){var GP=window.GGoalPath;if(!GP)return true;var gi2=+b.getAttribute('data-g'),id2=gpId(P,T,gi2),v3=b.getAttribute('data-v'),cur=gpPlan(P,T,gi2);
  if(act==='rx-ready')GP.setReadiness(T,id2,cur.readiness===v3?null:v3);
  else{var w3=cur.woop||{};if(act==='rx-ob')GP.setIfThen(T,id2,w3.obstacle===v3?'':v3,'');else GP.setIfThen(T,id2,w3.obstacle,w3.response===v3?'':v3);gpOpen=gi2}
  H.save(P);H.render();return true}
 if(act==='rx-cap'||act==='rx-crit'||act==='rx-out'){var GP4=window.GGoalPath;if(!GP4)return true;var gi4=+b.getAttribute('data-g'),id4=gpId(P,T,gi4),v4=b.getAttribute('data-v'),pl4=gpPlan(P,T,gi4);
  if(act==='rx-cap'){var f4=b.getAttribute('data-f'),cur4=(pl4.capacity||{})[f4];var nv=cur4===v4?null:v4;GP4.setCapacity(T,id4,f4,nv);if(nv&&window.GCapacity&&!(P.capacity&&P.capacity[f4]))GCapacity.setGlobal(P,f4,nv);capOpen=gi4}
  else if(act==='rx-crit'){GP4.setCriterion(T,id4,pl4.criterion===v4?null:v4);capOpen=gi4}
  else{var w4=+b.getAttribute('data-w'),c4=((pl4.outcomes||{})[w4]||{}).status;GP4.setOutcome(T,id4,w4,c4===v4?null:v4)}
  H.save(P);H.render();return true}
 if(act==='rx-wdone'){var g=ladder(T,+b.getAttribute('data-g'),goals(P,T)[+b.getAttribute('data-g')]),W=g.weeks[+b.getAttribute('data-w')];W.done=!W.done;H.save(P);H.render();return true}
 if(act==='rx-gday'){var gi=+b.getAttribute('data-g');d.dirState=d.dirState||['','',''];d.dirState[gi]=d.dirState[gi]==='done'?'':'done';H.save(P);H.render();return true}
 if(act==='rx-shrink'){var g2=ladder(T,+b.getAttribute('data-g'),goals(P,T)[+b.getAttribute('data-g')]),W2=g2.weeks[+b.getAttribute('data-w')];if(W2.small==null)W2.small='';var pl=(T.directionPlans||{})[+b.getAttribute('data-g')];if(!W2.small&&pl&&pl.minimum)W2.small=pl.minimum;if(b.getAttribute('data-go')){T.space='directions';T.view='directions'}H.save(P);H.render();return true}
 if(act==='rx-pr'){var pid=b.getAttribute('data-id');T.space='practs';T.view='practs';H.save(P);H.render();setTimeout(function(){var el=document.querySelector('[data-pr="'+pid+'"]');if(el){el.scrollIntoView({block:'center'});el.classList.add('rx-flash')}},30);return true}
 return false;
}
function input(act,el,P,T,n){
 if(act==='rx-mtext'){var dr=(T.markDraft&&T.markDraft.n===n)?T.markDraft:{n:n,kind:'act'};dr.text=el.value;T.markDraft=dr;H.save(P);return true}
 if(act==='rx-step'||act==='rx-small'){var gi=+el.getAttribute('data-g'),g=ladder(T,gi,goals(P,T)[gi]),W=g.weeks[+el.getAttribute('data-w')];if(act==='rx-step')W.t=el.value;else W.small=el.value;H.save(P);return true}
 return false;
}
function init(h){H=h||{}}
window.GReactor={init:init,PERIODS:PERIODS,STATE:STATE,periodOf:periodOf,periodLine:periodLine,simsBlock:simsBlock,simsSub:simsSub,quickBody:quickBody,quickSub:quickSub,goalToday:goalToday,goalsEditor:goalsEditor,sectionsBlock:sectionsBlock,viewState:viewState,viewWheel:viewWheel,threeWheels:threeWheels,sphereStats:sphereStats,observations:observations,click:click,input:input};
})();
