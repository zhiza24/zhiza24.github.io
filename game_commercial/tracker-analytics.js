/* Аналитика трекера: динамика, три звезды, закономерности, итоги пути. Только локальные данные. */
(function(){
'use strict';
function rec(T,n){return (T.days&&T.days[String(n)])||{}}
function dirs(T){return ((T&&T.directions)||[]).map(function(d){if(typeof d==='string')return {id:d,text:d};return {id:(d&&d.id)||'',text:(d&&(d.text||d.t||d.name))||''}}).filter(function(d){return d.text})}

function weekAvg(T,w,key){
  if(window.GSim&&GSim.avg)return GSim.avg(T,w*7+1,w*7+7,key);
  return null;
}
function starProgress(T){
  return dirs(T).map(function(dir,i){
    var done=0, marks={};
    for(var n=1;n<=28;n++){
      var d=rec(T,n);
      if(d.dirState&&d.dirState[i]==='done')done++;
      var m=d.dirMarks&&d.dirMarks[i]; if(m)marks[m]=(marks[m]||0)+1;
      if(d.res&&d.res.v==='done'){
        var S=T.strategy, st=S&&S.days&&S.days[n-1];
        if(st&&st.dir===i)done++;
      }
    }
    return {text:dir.text, done:done, better:marks.better||0, habit:marks.habit||0, solved:marks.solved||0};
  });
}
function patterns(T,n){
  n=n||28; var notes=[];
  if(window.GSim){
    if(GSim.lowDays(T,n,'energy')>=3) notes.push('Энергия держится низкой несколько дней подряд.');
    if(GSim.lowDays(T,n,'mood')>=3) notes.push('Настроение несколько дней подряд ниже обычного.');
    var r=GSim.lastRes(T,n+1,3);
    if(r.filter(function(v){return v==='fail'}).length>=3) notes.push('Три дня не получилось выполнить даже минимальный шаг. Это не обнуляет путь.');
    var te=GSim.trend(T,n,'energy'), tm=GSim.trend(T,n,'mood');
    if(te>=1) notes.push('Энергия за последнюю неделю чуть выше, чем ранее.');
    if(tm>=1) notes.push('Настроение за последнюю неделю чуть выше, чем ранее.');
  }
  return notes;
}
function compareWeeks(T){
  var keys=['energy','mood','well','presence','support'];
  return keys.map(function(k){
    return {key:k, name:(window.GSim&&GSim.NAMES[k])||k, w1:weekAvg(T,0,k), w4:weekAvg(T,3,k)};
  });
}

window.GTrackA={weekAvg:weekAvg,starProgress:starProgress,patterns:patterns,compareWeeks:compareWeeks,dirs:dirs};
})();
