/* Commercial edition: compact route. Full research modules remain in this isolated copy. */
/* Storage is namespaced because /game_v5 and /game_commercial share the same browser origin. */
(function(w){
  var p=w.Storage&&w.Storage.prototype;
  if(!p||p.__alchCommercialNamespace)return;
  var get=p.getItem,set=p.setItem,remove=p.removeItem,key=p.key,clear=p.clear;
  var length=Object.getOwnPropertyDescriptor(p,'length');
  var OLD='alch_v5_',NEW='alch_commercial_';
  var SPECIAL={'alch_samost':'samost','alch_pattern_map_v1':'pattern_map_v1'};
  function mapped(k){
    k=String(k);
    if(k.indexOf(OLD)===0)return NEW+k.slice(OLD.length);
    return SPECIAL[k]?NEW+SPECIAL[k]:k;
  }
  function viewed(k){
    if(!k||k.indexOf(NEW)!==0)return k;
    var suffix=k.slice(NEW.length);
    if(suffix==='samost')return 'alch_samost';
    if(suffix==='pattern_map_v1')return 'alch_pattern_map_v1';
    return OLD+suffix;
  }
  Object.defineProperty(p,'__alchCommercialNamespace',{value:true});
  p.getItem=function(k){return get.call(this,mapped(k))};
  p.setItem=function(k,v){return set.call(this,mapped(k),v)};
  p.removeItem=function(k){return remove.call(this,mapped(k))};
  function appStorage(store){return store===w.localStorage||store===w.sessionStorage}
  p.key=function(i){
    if(!appStorage(this))return key.call(this,i);
    var wanted=Number(i);
    if(!isFinite(wanted)||wanted<0||Math.floor(wanted)!==wanted)return null;
    var seen=0,total=length.get.call(this);
    for(var j=0;j<total;j++){
      var k=key.call(this,j);
      if(k&&k.indexOf(NEW)===0){if(seen===wanted)return viewed(k);seen++}
    }
    return null;
  };
  if(length&&length.get)Object.defineProperty(p,'length',{configurable:true,get:function(){
    if(!appStorage(this))return length.get.call(this);
    var n=0,total=length.get.call(this);
    for(var i=0;i<total;i++){var k=key.call(this,i);if(k&&k.indexOf(NEW)===0)n++}
    return n;
  }});
  p.clear=function(){
    if(!appStorage(this))return clear.call(this);
    for(var i=length.get.call(this)-1;i>=0;i--){var k=key.call(this,i);if(k&&k.indexOf(NEW)===0)remove.call(this,k)}
  };
})(window);

window.GFLOW=[
{u:'index.html',pt:'0',t:'Вход в игру'},
{u:'form.html',pt:'0',t:'Инициация: имя и дата рождения'},
{u:'elder.html',pt:'0',t:'Заставка: Старец'},
{u:'hero.html',pt:'0',t:'Герой'},
{u:'choose.html',pt:'0',t:'Выбор карты'},
{u:'bridge.html',pt:'0',t:'Твоя стратегия выбора'},
{u:'breath.html?at=p0',pt:'0',t:'Дыхание'},
{u:'cutscene.html',pt:'0',t:'Заставка: Я есмь'},
{u:'slot.html?id=dialog',pt:'0',t:'Кто сейчас выбирает'},
{u:'slot.html?id=bg16',pt:'0',t:'Ведущее фоновое состояние'},
{u:'ego.html',pt:'0',t:'Маг: повторяющийся эмоциональный итог'},
{u:'betray.html',pt:'0',t:'Колесо самопредательства'},
{u:'slot.html?id=im',pt:'0',t:'Зал зеркал: синтез исследований'},
{u:'swipe.html',pt:'0',t:'Практика: свайп хорошего'},
{u:'fin.html',pt:'0',t:'Мой первый портрет'},
{u:'scene.html?k=pa',pt:'А',t:'Зодчий'},
{u:'wheel8.html',pt:'А',t:'Колесо сфер жизни'},
{u:'values.html',pt:'А',t:'Карта ценностей и направления'},
{u:'slot.html?id=vsort',pt:'А',t:'Три ориентира моего выбора'},
{u:'slot.html?id=pa_end',pt:'А',t:'Карта исходного положения'},
{u:'slot.html?id=pb_intro',pt:'Б',t:'Заставка Точки Б'},
{u:'slot.html?id=evidence',pt:'Б',t:'Где повторяется схема'},
{u:'slot.html?id=sort',pt:'Б',t:'Проверка внутреннего правила'},
{u:'slot.html?id=eraser',pt:'Б',t:'Перенастройка привычного правила'},
{u:'slot.html?id=lab_d',pt:'Б',t:'Лабиринт желаний'},
{u:'wish.html',pt:'Б',t:'Звездное небо и карта желаний'},
{u:'slot.html?id=leverage',pt:'Б',t:'Точка влияния'},
{u:'slot.html?id=pb_end',pt:'Б',t:'Итог Точки Б'},
{u:'slot.html?id=pc_intro',pt:'С',t:'От понимания к действию'},
{u:'slot.html?id=arch_d',pt:'С',t:'Архитектор: выбор состояния'},
{u:'slot.html?id=builder',pt:'С',t:'Конструктор пути'},
{u:'reactor.html',pt:'С',t:'Реактор 28 дней'},
{u:'slot.html?id=retest',pt:'Финал',t:'Финальный замер'},
{u:'slot.html?id=compare',pt:'Финал',t:'Было и стало'},
{u:'slot.html?id=end',pt:'Финал',t:'Личная карта пути'}
];
