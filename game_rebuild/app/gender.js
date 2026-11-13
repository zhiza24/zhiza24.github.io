/* Выбор готовой формы обращения, без автоматического изменения окончаний. */
window.GG=function(m,f){try{return (JSON.parse(localStorage.getItem('alch_v5_profile'))||{}).gender==='f'?f:m}catch(e){return m}};
window.GEsc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
window.GGender=function(P){
  try{P=P||JSON.parse(localStorage.getItem('alch_v5_profile'))||{}}catch(e){P={}}
  var g=String((P&&P.gender)||'').toLowerCase();
  return (g==='f'||g==='ж'||g==='female'||g==='жен'||g==='женский'||g==='woman')?'f':'m';
};
window.GHeroSrc=function(kind){
  var f=window.GGender()==='f';
  if(kind==='portrait')return f?'img/hero_f_portrait.jpg?v=h3':'img/hero_m_portrait.jpg?v=h3';
  return f?'img/hero_f_full.jpg?v=h3':'img/hero_m_full.jpg?v=h3';
};
window.GHeroApply=function(){
  document.querySelectorAll('[data-hero-img]').forEach(function(el){
    el.src=window.GHeroSrc(el.getAttribute('data-hero-img')==='full'?'full':'portrait');
  });
};
