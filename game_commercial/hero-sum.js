/* Единый итог героя: что уже хорошо работает, что чаще мешает, что ты узнал(а) о себе.
   Источники: Зеркало, колесо тени и опоры, самоценность, ответственность, критическое мышление, Лабиринт желаний, колесо сфер.
   Нет данных — блок не показывается. Связь показывается, только если на нее указывают 2+ модуля. Методики не называются. */
(function(){
'use strict';
var WN=['Здоровье','Финансы','Карьера','Отношения','Семья','Друзья','Рост','Отдых'];
function gx(s,f){return String(s==null?'':s).replace(/\{([^{}|]*)\|([^{}|]*)\}/g,function(_,m,w){return f?w:m})}
function sc(P,fld){var x=P[fld];if(!x||!x.scales||x.status==='insufficient')return null;return x}
function lv(x,id){if(!x)return null;var q=x.scales.filter(function(z){return z.id===id})[0];return q&&q.level!=null?q.level:null}
function build(P){
 P=P||{};var f=P.gender==='f',good=[],hard=[],learned=[],mods={good:{},hard:{}},themes={};
 function th(k,m){themes[k]=themes[k]||{};themes[k][m]=1}
 function G(t,m){good.push(gx(t,f));mods.good[m]=1}
 function H(t,m){hard.push(gx(t,f));mods.hard[m]=1}
 /* Зеркало */
 var bp=P.backgroundProfile,F=window.GIMD&&GIMD.FAM;
 if(bp&&bp.v&&F&&bp.status!=='insufficient'){
  (bp.resources||[]).slice(0,2).forEach(function(s){G(F[s].t+'.','im')});
  (bp.vulnerabilities||[]).slice(0,2).forEach(function(s){H(F[s].t+'.','im')});
  if(bp.interpretation&&bp.interpretation.head)learned.push('Чаще всего с тобой: '+bp.interpretation.head.charAt(0).toLowerCase()+bp.interpretation.head.slice(1)+'.');
  var L=bp.levels||{},A=bp.adaptHyp||[];
  if(L.S5>=2||A.indexOf('A2')>=0)th('ctrl','im');if(A.indexOf('A3')>=0)th('please','im');if(L.S6>=2)th('perf','im');if(L.S7>=2||A.indexOf('A4')>=0)th('distance','im');if(L.S8>=2||A.indexOf('A1')>=0)th('freeze','im');
  if(L.S3>=2)th('+trust','im');if(L.S1>=2)th('+joy','im');if(L.S4>=2)th('+near','im');if(L.S3>=2&&(bp.resTraits||[]).indexOf('A6')>=0)th('+self','im');
 }
 /* колесо тени и опоры: последний круг */
 var B=P.betray||{},r=B.end||B.start;
 if(r&&window.GBW){var sm=GBW.summary(r);
  if(sm.sp.length)G('Твои опоры: '+sm.sp.slice(0,3).map(function(z){return z.s.m.t.toLowerCase()}).join(', ')+'.','bw');
  if(sm.sh.length)H('Где чаще теряешь себя: '+sm.sh.slice(0,3).map(function(z){return z.s.t.toLowerCase()}).join(', ')+'.','bw');
  var MT={ctrl:'ctrl',please:'please',over:'please',perf:'perf',detach:'distance',numb:'freeze'},MP={trust:'+trust',bound:'+self',enough:'+joy',near:'+near',care:'+self',alive:'+self'};
  sm.sh.forEach(function(z){if(MT[z.s.id])th(MT[z.s.id],'bw')});sm.sp.forEach(function(z){if(MP[z.s.m.id])th(MP[z.s.m.id],'bw')});
 }
 /* самоценность и ответственность: высокий уровень = трудность, нулевой = опора */
 [['selfWorth','sv'],['respTest','rs']].forEach(function(o){var x=sc(P,o[0]);if(!x)return;var lead=x.leadingScales||[],gs=[],hs=[];
  x.scales.forEach(function(q){if(q.level===0&&q.status==='full')gs.push(q.name);if(lead.indexOf(q.id)>=0&&q.level>=2)hs.push(q.name)});
  function lc(a){return a.map(function(x){return x.charAt(0).toLowerCase()+x.slice(1)}).join('; ')}if(gs.length)G('Держится: '+lc(gs.slice(0,2))+'.',o[1]);if(hs.length)H('Пока трудно дается: '+lc(hs.slice(0,2))+'.',o[1]);
 });
 var sv=sc(P,'selfWorth'),rs=sc(P,'respTest'),km=sc(P,'kmTest');
 if(lv(rs,'RS06')>=2)th('ctrl','rs');if(lv(rs,'RS05')>=2||lv(sv,'SV02')>=2)th('perf','sv');if(lv(sv,'SV04')>=2||lv(rs,'RS02')>=2)th('please','sv');
 if(lv(km,'KM04')>=2)th('distance','km');if(lv(km,'KM05')>=2)th('freeze','km');if(lv(km,'KM01')>=2)th('ctrl','km');
 if(lv(rs,'RS06')===0)th('+trust','rs');if(lv(sv,'SV04')===0)th('+self','sv');if(lv(sv,'SV05')===0)th('+joy','sv');if(lv(km,'KM04')===0)th('+near','km');
 /* критическое мышление: сильные шкалы — опора */
 var ct=sc(P,'ctTest');if(ct){var cs=ct.scales.filter(function(q){return q.level===3}).map(function(q){return q.name});if(cs.length)G('В мышлении сильная сторона: '+cs.slice(0,2).map(function(x){return x.charAt(0).toLowerCase()+x.slice(1)}).join('; ')+'.','ct')}
 /* Лабиринт желаний */
 var ld=P.desireLab;if(ld&&ld.v&&ld.desire)learned.push('Твое желание сейчас: '+String(ld.desire).replace(/\.$/,'')+'.');
 /* колесо сфер */
 var w=Array.isArray(P.wheel)&&P.wheel.length===8?P.wheel.map(Number):null;
 if(w){var mx=0,mi=0;w.forEach(function(v,i){if(v>w[mx])mx=i;if(v<w[mi])mi=i});if(w[mx]>=7)G('Сфера-опора: '+WN[mx].toLowerCase()+'.','wh');if(w[mi]<=3)H('Просит внимания: '+WN[mi].toLowerCase()+'.','wh')}
 /* связи: только при 2+ модулях */
 var TXT={ctrl:'Привычка удерживать все под контролем видна сразу в нескольких твоих ответах. Отпустить часть — не слабость, а экономия сил.',
  please:'Угождение и отдача другим повторяются в разных местах. Твои потребности тоже имеют право быть первыми.',
  perf:'Строгость к себе и ощущение «недостаточно» повторяются. Засчитывать сделанное — твоя точка роста.',
  distance:'Когда трудно, ты склон{ен|на} отдаляться. Это повторяется в разных ответах. Опора — говорить о себе.',
  freeze:'Иногда ты замираешь в ожидании лучшего момента. Маленький шаг возвращает выбор.',
  '+trust':'Ты умеешь доверять процессу и не держать все в руках. Это подтверждается с разных сторон.',
  '+self':'Ты умеешь выбирать себя и держать свои границы. Это видно в нескольких исследованиях.',
  '+joy':'Ты умеешь радоваться сделанному и чувствовать «достаточно». Это твоя устойчивая опора.',
  '+near':'Близость и контакт с людьми — твой ресурс. Это видно с разных сторон.'};
 var pos=[],neg=[];Object.keys(themes).forEach(function(k){if(Object.keys(themes[k]).length>=2&&TXT[k])(k.charAt(0)==='+'?pos:neg).push(gx(TXT[k],f))});
 /* опоры наравне с трудностями: чередуем */
 var links=[];for(var i=0;i<Math.max(pos.length,neg.length);i++){if(pos[i])links.push(pos[i]);if(neg[i])links.push(neg[i])}
 learned=learned.concat(links);
 return {good:good.slice(0,5),hard:hard.slice(0,5),learned:learned.slice(0,5),count:Object.keys(Object.assign({},mods.good,mods.hard)).length}}
window.GHeroSum={build:build};
})();
