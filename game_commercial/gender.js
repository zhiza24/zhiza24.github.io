/* Выбор готовой формы обращения, без автоматического изменения окончаний. */
window.GG=function(m,f){try{return window.GGender&&window.GGender()==='f'?f:m}catch(e){return m}};
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
    var url=window.GHeroSrc(el.getAttribute('data-hero-img')==='full'?'full':'portrait');
    el.style.visibility='hidden';
    var show=function(){
      if(el.getAttribute('src')===url&&el.naturalWidth>0)el.style.visibility='visible';
    };
    el.onload=show;
    el.onerror=function(){
      // Fallback: if female failed, try male; otherwise stay hidden but log.
      if(url.indexOf('hero_f_')!==-1){
        var fallback=url.replace('hero_f_','hero_m_');
        el.src=fallback;
      }else{
        el.style.visibility='hidden';
      }
    };
    if(el.getAttribute('src')!==url){
      el.src=url;
    }else if(el.complete){
      show();
    }
    // Extra safety for cached images that may not fire onload reliably.
    setTimeout(show,50);
  });
};
