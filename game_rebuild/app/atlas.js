/* Six thematic lands layered over the approved 40-step route. */
(function(g){
'use strict';
g.renderAtlas=function(){
 var P=GPro.load(),S=GAtlas.state(P),root=document.getElementById('regions'),bag=document.getElementById('artifacts');
 root.replaceChildren();bag.replaceChildren();
 S.regions.forEach(function(r,i){
  var card=document.createElement('article');card.className='land '+r.state;
  var mark=document.createElement('div');mark.className='land-mark';mark.textContent=['✧','◈','⌑','⌘','✦','⌂'][i];
  var body=document.createElement('div');body.className='land-body';
  var state=r.completed?'Земля пройдена':r.unlocked?(r.done?'Открыта · '+r.done+' из '+r.total+' шагов':'Доступна по основному маршруту'):'Откроется дальше по пути';
  body.innerHTML='<div class="land-kicker">Земля '+r.number+' · '+state+'</div><h2>'+r.title+'</h2><div class="land-sub">'+r.subtitle+'</div><p>'+r.description+'</p><p class="land-condition"><b>Условие артефакта:</b> '+r.condition+'</p><div class="meter"><i style="width:'+r.progress+'%"></i></div><div class="land-foot"><span>'+r.done+' / '+r.total+' шагов отмечено</span><span class="artifact-state">'+(S.artifacts[i].unlocked?'Артефакт получен':'Артефакт впереди')+'</span></div>';
  var action=document.createElement('a');action.className='land-link';action.href=r.unlocked?r.entry:'tasks.html';action.textContent=r.unlocked?'Открыть землю':'Продолжить путь';if(!r.unlocked)action.classList.add('locked-link');
  card.append(mark,body,action);root.append(card);
 });
 S.artifacts.forEach(function(a){
  var card=document.createElement('article');card.className='artifact '+(a.unlocked?'unlocked':'locked');
  var icon=document.createElement('div');icon.className='artifact-icon';icon.textContent=a.unlocked?a.icon:'◇';
  var title=document.createElement('b');title.textContent=a.unlocked?a.name:'Неизвестный артефакт';
  var desc=document.createElement('p');desc.textContent=a.unlocked?a.description:'Откроется после завершения соответствующей земли.';
  card.append(icon,title,desc);bag.append(card);
 });
 var name=P.name||P.hero&&P.hero.name||P.profile&&P.profile.name||'Алхимик';
 document.getElementById('heroName').textContent=name;
 document.getElementById('progressText').textContent=S.regions.filter(function(r){return r.completed}).length+' из 6 земель пройдено';
};
})(window);