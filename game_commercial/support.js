/* Короткий теплый отклик после тестов и важных шагов. Фразы чередуются, пол через GG, без канцелярита. */
(function(){
if(window.GSupport)return;
var KEY='alch_v5_profile';
var PHRASES={
test:[
  'Ты {дошел|дошла} до ясного места. Этого уже достаточно, чтобы идти дальше.',
  'Хорошо, что ты {ответил|ответила} честно. Так карта становится ближе к тебе.',
  'То, что ты сейчас {увидел|увидела}, уже часть пути — не оценка и не приговор.',
  'Спасибо, что {остался|осталась} с этим. Дальше можно опереться на то, что проявилось.',
  'Ты {собрал|собрала} живой след. Он сохранится в карте героя и в дневнике.'
],
praise:[
  'Красиво {прошел|прошла}. Можно выдохнуть и просто заметить, что шаг сделан.',
  'Ты {выбрал|выбрала} идти дальше — в этом уже есть сила.',
  'Тихая, точная работа. Так и собирается ясность.',
  'Хорошо, что ты не спешишь. Присутствие само по себе уже меняет ход.',
  'Ты {сделал|сделала} то, что было по силам сегодня. Этого хватает.'
],
step:[
  'Этот шаг уже записан. Можно идти дальше без спешки.',
  'Ты {оставил|оставила} след. Он никуда не денется.',
  'Есть от чего оттолкнуться. Следующий шаг подождет, пока ты будешь готов'+'{|а}.'
],
week:[
  'Неделя собрана. Посмотри на график: там видны и спады, и опоры.',
  'Ты {донес|донесла} внимание через эти семь дней. Это уже навык.',
  'Даже если день был разным, цикл живой. Можно идти в следующую неделю.'
]
};
function load(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}}
function save(P){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
function gx(s){return String(s).replace(/\{([^|]*)\|([^}]*)\}/g,function(_,m,f){return window.GG?GG(m,f):m})}
function next(kind){
  var P=load(); P.support=P.support||{i:{},used:{}};
  var list=PHRASES[kind]||PHRASES.praise;
  var used=P.support.used[kind]||[];
  var pool=list.map(function(_,i){return i}).filter(function(i){return used.indexOf(i)<0});
  if(!pool.length){used=[]; pool=list.map(function(_,i){return i})}
  var i=pool[(P.support.i[kind]||0)%pool.length];
  used.push(i); P.support.used[kind]=used; P.support.i[kind]=(i+1)%list.length; save(P);
  return gx(list[i]);
}
function css(){if(document.getElementById('gs-css'))return;var s=document.createElement('style');s.id='gs-css';s.textContent='.gs-sup{margin:16px 0 12px;padding:10px 12px;border-left:2px solid #c99a45;color:#f4ecdf;font:500 16px/1.45 Manrope,sans-serif;text-align:left}';document.head.appendChild(s)}
function after(box,kind,before){
  if(!box)return null;
  css();
  var d=document.createElement('div'); d.className='gs-sup'; d.textContent=next(kind||'test');
  if(before&&before.parentNode===box)box.insertBefore(d,before); else box.appendChild(d);
  return d;
}
window.GSupport={after:after,next:next};
})();
