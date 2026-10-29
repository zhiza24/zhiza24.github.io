(function(){var cur=document.body.dataset.page||'';
var built={'index.html':1,'map.html':1};
function L(h,t,k){return '<a href="'+h+'"'+(k==cur?' class="cur"':'')+'>'+t+'</a>'}
var d=document.createElement('div');d.className='gdraw';d.innerHTML='<div class="sh"></div><div class="pn"><h3>Меню</h3>'+
L('./','Главный вход','cover')+L('map.html','Карта пути','map')+L('#soon','Герой','hero')+L('#soon','Задание','task')+L('#soon','Дневник','diary')+L('#soon','Путь по шагам','steps')+L('#soon','Информация и правила','info')+L('#soon','Тема','theme')+'</div>';
var n=document.createElement('nav');n.className='gnav';
function B(h,i,t,k){return '<a href="'+h+'"'+(k==cur?' class="on"':'')+'><span class="i">'+i+'</span>'+t+'</a>'}
n.innerHTML=B('#soon','📜','Задание','task')+B('map.html','🗺','Карта','map')+'<a href="#soon" class="hero'+(cur=='hero'?' on':'')+'"><img src="img/sphere.png" alt="">Герой</a>'+B('#soon','🪶','Дневник','diary')+'<a href="#menu" data-menu><span class="i">☰</span>Меню</a>';
var t=document.createElement('div');t.className='gtoast';t.textContent='Скоро откроется';
document.body.append(n,d,t);
function toast(){t.classList.add('on');setTimeout(function(){t.classList.remove('on')},1600)}
document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;var h=a.getAttribute('href');
if(a.hasAttribute('data-menu')){e.preventDefault();d.classList.add('open');return}
if(h=='#soon'){e.preventDefault();d.classList.remove('open');toast()}});
d.querySelector('.sh').onclick=function(){d.classList.remove('open')};
window.gToast=toast;})();
