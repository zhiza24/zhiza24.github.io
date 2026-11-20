/* Двустороннее колесо: где человек теряет себя и где опирается на себя.
   Данные: P.betray.start / P.betray.end ({sh:{id:1..3|null}, sp:{id:1..3|null}}), P.betray.days[ГГГГ-ММ-ДД] = {sh:[ids], sp:[ids]}.
   Ничего не назначается заранее: пустой сектор значит «нет отметки», а не ноль. */
(function(){
'use strict';
var S=[
 {id:'ctrl',t:'Гиперконтроль',goal:'Оставаться главным, контролировать все',how:'Микроменеджмент, чрезмерное планирование, контроль над результатом, чтобы чувствовать себя в безопасности.',
  m:{id:'trust',t:'Доверие процессу',how:'Делаешь свою часть и отпускаешь то, что не в твоей власти. Можешь поручить и не перепроверять.'}},
 {id:'perf',t:'Перфекционизм',goal:'Быть идеальным',how:'Переработки, чрезмерная подготовка, безупречность, чтобы чувствовать себя достойным.',
  m:{id:'enough',t:'Достаточно хорошо',how:'Завершаешь без идеала и засчитываешь сделанное. Ошибка не отменяет твою ценность.'}},
 {id:'please',t:'Угождение людям',goal:'Заслужить одобрение, сохранить мир',how:'Соглашаешься, когда хочется отказать. Подстраиваешься, чтобы никто не расстроился.',
  m:{id:'bound',t:'Свои границы',how:'Говоришь «нет» спокойно и просишь о своем. Отношения выдерживают твое мнение.'}},
 {id:'numb',t:'Оцепенение',goal:'Быть занятым',how:'Скроллинг, бесконечные дела или еда, чтобы не чувствовать.',
  m:{id:'alive',t:'Живое действие',how:'Замечаешь, что чувствуешь, и делаешь маленький живой шаг вместо замирания.'}},
 {id:'detach',t:'Отстранение',goal:'Не раскрываться',how:'Уходишь в себя, прячешь чувства, держишь дистанцию даже с близкими.',
  m:{id:'near',t:'Присутствие и близость',how:'Остаешься в контакте, говоришь о том, что чувствуешь, и принимаешь тепло.'}},
 {id:'over',t:'Чрезмерная отдача',goal:'Заслужить любовь',how:'Отдаешь больше, чем есть сил, и ждешь, что это заметят.',
  m:{id:'care',t:'Забота о себе',how:'Отдаешь из полноты, а не из страха. Восстанавливаешь силы до того, как они закончатся.'}}
];
var LEGACY={ctrl:'ctrl',perf:'perf',please:'please',numb:'numb'};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function byId(id){for(var i=0;i<S.length;i++){if(S[i].id===id||S[i].m.id===id)return S[i]}return null}
function pt(r,a){a=(a-90)*Math.PI/180;return [Math.round(r*Math.cos(a)*10)/10,Math.round(r*Math.sin(a)*10)/10]}
function wedge(r0,r1,a0,a1){var p1=pt(r1,a0),p2=pt(r1,a1),p3=pt(r0,a1),p4=pt(r0,a0),lg=(a1-a0)>180?1:0;
 return 'M'+p1+' A'+r1+' '+r1+' 0 '+lg+' 1 '+p2+' L'+p3+' A'+r0+' '+r0+' 0 '+lg+' 0 '+p4+'Z'}
var uidN=0;
/* vals: {sh:{id:0..1}, sp:{id:0..1}} доли заливки; o.hi — подсветить сектор; o.size; o.labels */
function svg(vals,o){o=o||{};vals=vals||{sh:{},sp:{}};var R=160,r0=38,uid='bw'+(++uidN),h='';
 var size=o.size||320;
 h+='<svg class="bw-svg" viewBox="-170 -170 340 340" width="'+size+'" height="'+size+'" role="img" aria-label="Колесо: где ты теряешь себя и где опираешься на себя">';
 h+='<defs><filter id="'+uid+'r"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter>'+
  '<radialGradient id="'+uid+'g" r="0.75"><stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#d9a441"/></radialGradient>'+
  '<radialGradient id="'+uid+'s" r="0.75"><stop offset="0" stop-color="#8a7a72"/><stop offset="1" stop-color="#5d514c"/></radialGradient></defs>';
 h+='<circle r="'+R+'" fill="#17110a"/>';
 S.forEach(function(s,i){var a=i*60;
  [['sh',s.id,a,a+30],['sp',s.m.id,a+30,a+60]].forEach(function(z){var v=(vals[z[0]]||{})[z[1]];
   if(v!=null&&v>0){var r1=r0+(R-r0)*Math.min(1,v);h+='<path d="'+wedge(r0,r1,z[2]+.6,z[3]-.6)+'" fill="url(#'+uid+(z[0]==='sp'?'g':'s')+')" opacity="'+(z[0]==='sp'?.9:.75)+'"/>'}
   else if(v===0||v==null){/* нет отметки */}
  });
  if(o.hi===s.id)h+='<path d="'+wedge(r0,R,a,a+60)+'" fill="none" stroke="#ffe9a8" stroke-width="2.5"/>';
 });
 /* рисованные линии */
 h+='<g filter="url(#'+uid+'r)" fill="none" stroke="#c9a46a" stroke-linecap="round">';
 h+='<circle r="'+R+'" stroke-width="2"/><circle r="'+(R-38)+'" stroke-width="1" stroke-dasharray="3 4" opacity=".7"/><circle r="'+(R-80)+'" stroke-width="1" stroke-dasharray="3 4" opacity=".7"/><circle r="'+r0+'" stroke-width="1.6"/>';
 S.forEach(function(s,i){var a=i*60,p=pt(R,a),q=pt(r0,a),m1=pt(R,a+30),m2=pt(r0,a+30);h+='<line x1="'+q[0]+'" y1="'+q[1]+'" x2="'+p[0]+'" y2="'+p[1]+'" stroke-width="1.6"/><line x1="'+m2[0]+'" y1="'+m2[1]+'" x2="'+m1[0]+'" y2="'+m1[1]+'" stroke-width=".7" opacity=".55"/>'});
 h+='</g>';
 if(o.labels!==false){S.forEach(function(s,i){var a=i*60;
  [[s.t,a+15,'#e8dccf'],[s.m.t,a+45,'#ffe2a0']].forEach(function(z){var ang=z[1],flip=ang>180,rot=flip?ang+90:ang-90,anchor=flip?'end':'start',x=pt(r0+8,ang);
   h+='<text transform="translate('+x[0]+' '+x[1]+') rotate('+rot+')" text-anchor="'+anchor+'" dominant-baseline="middle" font-family="Manrope,sans-serif" font-size="'+(z[0].length>17?8.8:10.5)+'" font-weight="700" fill="'+z[2]+'" stroke="#120d07" stroke-width="2.4" paint-order="stroke">'+esc(z[0])+'</text>'})})}
 h+='<circle r="'+(r0-3)+'" fill="#120d07"/><text text-anchor="middle" font-family="Cormorant Garamond,serif" font-weight="700" fill="#f0c870" font-size="9.5"><tspan x="0" y="-5">САМО-</tspan><tspan x="0" y="6">ПРЕДАТЕЛЬСТВО</tspan></text><text x="0" y="17" text-anchor="middle" font-family="Manrope,sans-serif" font-size="6.5" fill="#c9a46a">и опора на себя</text>';
 return h+'</svg>'}
/* оценки 1..3 -> доли */
function fromRates(r){var o={sh:{},sp:{}};if(!r)return o;['sh','sp'].forEach(function(k){var x=r[k]||{};Object.keys(x).forEach(function(id){var v=x[id];o[k][id]=typeof v==='number'?v/3:null})});return o}
function summary(r,g){g=g||function(m){return m};var sp=[],sh=[];if(!r)return {sp:sp,sh:sh};
 S.forEach(function(s){var a=(r.sh||{})[s.id],b=(r.sp||{})[s.m.id];if(typeof b==='number'&&b>=2)sp.push({s:s,v:b});if(typeof a==='number'&&a>=2)sh.push({s:s,v:a})});
 sp.sort(function(a,b){return b.v-a.v});sh.sort(function(a,b){return b.v-a.v});return {sp:sp,sh:sh}}
function summaryHtml(r,gx){gx=gx||function(s){return s};var x=summary(r),h='';
 h+='<div class="bw-sum"><p><b class="bw-gold">На что ты опираешься:</b> '+(x.sp.length?esc(x.sp.map(function(z){return z.s.m.t}).join(', '))+'.':esc(gx('Пока ни одна опора не отмечена как частая. Это не приговор: в трекере ты будешь замечать, где уже {поддержал|поддержала} себя.')))+'</p>';
 h+='<p><b class="bw-mute">Где чаще теряешь себя:</b> '+(x.sh.length?esc(x.sh.map(function(z){return z.s.t}).join(', '))+'.':'Ни один сектор не отмечен как частый.')+'</p></div>';return h}
function isoDay(t){var d=new Date(t),m=d.getMonth()+1,dd=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(dd<10?'0':'')+dd}
/* агрегат отметок дня за период: доли от максимума */
function daysAgg(P,from,to){var D=(P.betray&&P.betray.days)||{},c={sh:{},sp:{}},mx=0,n=0;
 Object.keys(D).forEach(function(k){if(from&&k<from)return;if(to&&k>to)return;var d=D[k]||{};var any=false;['sh','sp'].forEach(function(z){(d[z]||[]).forEach(function(id){c[z][id]=(c[z][id]||0)+1;any=true;if(c[z][id]>mx)mx=c[z][id]})});if(any)n++});
 var o={sh:{},sp:{}};['sh','sp'].forEach(function(z){Object.keys(c[z]).forEach(function(id){o[z][id]=mx?c[z][id]/Math.max(mx,3):0})});return {vals:o,counts:c,days:n}}
function legacyPicked(r){var out=[];S.forEach(function(s){var v=(r.sh||{})[s.id];if(LEGACY[s.id]&&typeof v==='number'&&v>=2)out.push(LEGACY[s.id])});return out}
function css(){if(document.getElementById('bw-css'))return;var st=document.createElement('style');st.id='bw-css';st.textContent=
 '.bw-svg{display:block;margin:6px auto 10px;max-width:100%;height:auto}.bw-sum p{margin:6px 0;line-height:1.45}.bw-gold{color:#f0c870}.bw-mute{color:#b9a89a}'+
 '.bw-leg{display:flex;justify-content:center;gap:16px;font-size:13px;color:#c9a46a;margin:0 0 10px}.bw-leg i{display:inline-block;width:12px;height:12px;border-radius:3px;margin-right:5px;vertical-align:-1px}'+
 '.bw-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}.bw-chips button{border:1px solid #6a4e28;background:transparent;color:inherit;border-radius:999px;padding:7px 11px;font:600 14px Manrope,sans-serif;cursor:pointer}'+
 '.bw-chips.sh button.on{background:#5d514c;border-color:#8a7a72;color:#fff}.bw-chips.sp button.on{background:#d9a441;border-color:#f0c870;color:#2a1606}'+
 '.bw-pair{display:flex;gap:8px;justify-content:center}.bw-pair>div{flex:1;text-align:center;font-size:13px;color:#c9a46a}';document.head.appendChild(st)}
function legend(){return '<div class="bw-leg"><span><i style="background:#6d605a"></i>где теряешь себя</span><span><i style="background:#e0a940"></i>где опираешься на себя</span></div>'}
window.GBW={S:S,byId:byId,svg:svg,fromRates:fromRates,summary:summary,summaryHtml:summaryHtml,daysAgg:daysAgg,isoDay:isoDay,legacyPicked:legacyPicked,css:css,legend:legend,esc:esc};
})();
