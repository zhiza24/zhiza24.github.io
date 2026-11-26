/* Диспетчер состояния 28-дневного трекера.
   Самооценка (бегунки дня) плюс расчет динамики. Практики сами энергию не поднимают. */
(function(){
'use strict';
var KEYS=['energy','mood','well','presence','support'];
var NAMES={energy:'Энергия',mood:'Настроение',well:'Самочувствие',presence:'Присутствие',support:'Внутренняя опора'};
var MODES=[
  {id:'recovery', t:'Восстановление', d:'Мало сил. Сегодня достаточно минимального шага и мягкой поддержки.'},
  {id:'soft', t:'Мягкий старт', d:'Мотивации мало. Начни с действия на несколько минут.'},
  {id:'work', t:'Рабочий', d:'Состояние устойчивое. Иди основным шагом стратегии.'},
  {id:'develop', t:'Развитие', d:'Ресурсов достаточно. Можно основной шаг и одну дополнительную практику.'},
  {id:'lock', t:'Закрепление', d:'Есть положительная динамика. Повтори то, что уже получается, и заметь, что стало привычным.'}
];

function rec(T,n){return (T.days&&T.days[String(n)])||{}}
function sl(T,n){return rec(T,n).sliders||{}}
function num(v){v=+v;return isFinite(v)?v:null}

function lastFilled(T,key,upto){
  for(var i=upto;i>=1;i--){var v=num(sl(T,i)[key]); if(v!=null)return {n:i,v:v}}
  return null;
}
function avg(T,from,to,key){
  var s=0,c=0; for(var i=from;i<=to;i++){var v=num(sl(T,i)[key]); if(v!=null){s+=v;c++}}
  return c?s/c:null;
}
function trend(T,n,key){
  var a=avg(T,Math.max(1,n-3),n,key), b=avg(T,Math.max(1,n-7),Math.max(1,n-4),key);
  if(a==null||b==null)return 0;
  return a-b;
}
function lastRes(T,n,k){
  var r=[]; for(var i=n-1;i>=1&&r.length<k;i--){var d=rec(T,i); if(d.res&&d.res.v)r.push(d.res.v)}
  return r;
}
function lowDays(T,n,key){
  var c=0; for(var i=n;i>=1&&i>=n-2;i--){var v=num(sl(T,i)[key]); if(v!=null&&v<=3)c++; else if(v==null&&i<n)break} return c;
}

function mode(T,n){
  n=n||1;
  var e=num(sl(T,n).energy); if(e==null){var L=lastFilled(T,'energy',n); e=L?L.v:null}
  var m=num(sl(T,n).mood); if(m==null){var M=lastFilled(T,'mood',n); m=M?M.v:null}
  var res=lastRes(T,n,3);
  var week=Math.floor((n-1)/7);
  var fails=res.filter(function(v){return v==='fail'||v==='min'}).length;
  var goods=res.filter(function(v){return v==='done'||v==='other'}).length;
  var id='work';
  if(e!=null&&e<=3&&lowDays(T,n,'energy')>=3)id='recovery';
  else if(e!=null&&e<=3)id='recovery';
  else if((m!=null&&m<=3)||fails>=2)id='soft';
  else if(week===3&&goods>=2)id='lock';
  else if(e!=null&&e>=7&&(m==null||m>=6)&&goods>=1&&week>=1)id='develop';
  var md=MODES.filter(function(x){return x.id===id})[0];
  return {id:id,t:md.t,d:md.d,energy:e,mood:m};
}

function score100(v){v=num(v); return v==null?null:Math.round(v*10)}

function panel(T,n){
  n=n||1;
  var md=mode(T,n), out={mode:md, items:[]};
  KEYS.forEach(function(k){
    var now=num(sl(T,n)[k]), tr=trend(T,n,k);
    out.items.push({key:k, name:NAMES[k], self:now, show:score100(now), trend:tr});
  });
  return out;
}

function shouldEase(T,n){
  var id=mode(T,n).id;
  return id==='recovery'||id==='soft';
}

window.GSim={KEYS:KEYS,NAMES:NAMES,MODES:MODES,mode:mode,panel:panel,trend:trend,avg:avg,score100:score100,shouldEase:shouldEase,lastFilled:lastFilled,lastRes:lastRes,lowDays:lowDays};
})();
