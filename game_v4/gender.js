/* Выбор готовой формы обращения, без автоматического изменения окончаний. */
window.GG=function(m,f){try{return (JSON.parse(localStorage.getItem('alch_profile'))||{}).gender==='f'?f:m}catch(e){return m}};
window.GEsc=function(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
