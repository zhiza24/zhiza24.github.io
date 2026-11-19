(function(){
'use strict';
function ready(fn){if(typeof fn==='function')fn()}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function render(el){
 if(!el||!window.GAtlas||!window.GPro){if(el)el.textContent='Атлас пока недоступен.';return}
 var P=GPro.load(),changed=GAtlas.sync(P);if(changed)GPro.save(P);
 var S=GAtlas.state(P),labels={locked:'Закрыто',available:'Открыто',in_progress:'В пути',completed:'Завершено'};
 el.innerHTML='<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px">'+S.regions.map(function(r){return '<a href="atlas.html" style="display:block;text-decoration:none;border:1px solid #4a5d4b;border-radius:12px;background:#17231b;padding:12px;color:#e9dfcc;min-width:0"><small style="font:600 9px system-ui,sans-serif;letter-spacing:.1em;color:#c7a76a">ЗЕМЛЯ '+esc(r.number)+' · '+esc(labels[r.state]||r.state)+'</small><b style="display:block;font:600 15px/1.2 Georgia,serif;margin:7px 0">'+esc(r.title)+'</b><span style="font:10px system-ui,sans-serif;color:#b8c4b4">'+r.done+' из '+r.total+' шагов</span><div style="height:4px;background:#35443a;border-radius:8px;margin-top:8px;overflow:hidden"><i style="display:block;height:100%;width:'+r.progress+'%;background:#c7a76a"></i></div></a>'}).join('')+'</div><p style="text-align:center;margin:12px 0"><a href="atlas.html" style="color:#d9c18a;font:600 11px system-ui,sans-serif">Открыть полный Атлас →</a></p>';
}
window.GHM={ready:ready,render:render};
})();