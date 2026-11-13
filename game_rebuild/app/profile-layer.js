/* Единый слой поверх alch_v5_profile: сырые ответы отдельно от результатов,
   история повторов, артефакты по стабильному строковому коду.
   Старый ключ сохранения не меняется, параллельный профиль не создается. */
(function (global) {
  'use strict';
  var KEY = 'alch_v5_profile';
  var SCHEMA_VERSION = 3;
  var CATALOG = {
    bridge: { name: 'Мост', icon: '🌉', aliases: ['Мост'] },
    compass: { name: 'Компас', icon: '🧭', aliases: ['Компас'] },
    fire: { name: 'Огонь', icon: '🔥', aliases: ['Огонь'] },
    path_crystal: { name: 'Кристалл пути', icon: '💎', aliases: ['Кристалл пути'] },
    lantern: { name: 'Фонарь', icon: '🏮', aliases: ['Фонарь'] },
    black_crystal: { name: 'Черный кристалл', icon: '🖤', aliases: ['Черный кристалл'] },
    crystal_1: { name: 'Кристалл опоры', icon: '🔴', aliases: ['Кристалл опоры'] },
    mirror: { name: 'Зеркало', icon: '🪞', aliases: ['Зеркало'] },
    wheel: { name: 'Колесо', icon: '☸️', aliases: ['Колесо'] },
    sword: { name: 'Меч', icon: '⚔️', aliases: ['Меч'] },
    key: { name: 'Ключ', icon: '🔑', aliases: ['Ключ'] },
    source: { name: 'Источник', icon: '💧', aliases: ['Источник'] },
    childhood_shard: { name: 'Осколок Первичного Детства', icon: '💎', aliases: ['Осколок первичного детства'] },
    truth_lens: { name: 'Линза Истинного Света', icon: '🔍', aliases: ['Линза истинного света'] },
    autonomy_seal: { name: 'Печать Самодержавия', icon: '📜', aliases: ['Печать самодержавия'] },
    intent_compass: { name: 'Компас Намерений', icon: '🧭', aliases: ['Компас намерений'] },
    route_scroll: { name: 'Свиток Дорожных Смягчений', icon: '🗺️', aliases: ['Свиток дорожных смягчений'] },
    golden_atanor: { name: 'Золотой Алхимический Атанор', icon: '🏺', aliases: ['Золотой алхимический атанор'] },
    guardian_measure: { name: 'Печать меры', icon: '◈', aliases: ['Печать меры'] },
    guardian_experience: { name: 'Печать опыта', icon: '✧', aliases: ['Печать опыта'] },
    guardian_connection: { name: 'Печать связей', icon: '⌖', aliases: ['Печать связей'] },
    guardian_clarity: { name: 'Печать трезвости', icon: '◎', aliases: ['Печать трезвости'] },
    guardian_boundaries: { name: 'Печать границ', icon: '◇', aliases: ['Печать границ'] },
    guardian_pace: { name: 'Печать темпа', icon: '◍', aliases: ['Печать темпа'] },
    guardian_companion: { name: 'Хранитель опыта', nameF: 'Хранительница опыта', icon: '🛡', aliases: ['Хранитель опыта', 'Хранительница опыта'] }
  };
  var MODULES = {
    ego: { field: 'ego' },
    dq: { field: 'dq' },
    values: { fields: ['values', 'egoSelf', 'focuses', 'valuesStage'] },
    dialog: { field: 'dialog' },
    guard: { field: 'guard' },
    hand: { fields: ['hand', 'handTop'] },
    pocherk: { field: 'pocherk' },
    mirrors: { field: 'mirror_exercise' },
    wheel: { field: 'wheel' },
    wheelTest: { field: 'wheelTest' },
    archB: { field: 'archB' },
    archV: { field: 'archV' },
    archP: { field: 'archP' },
    archD: { field: 'archD' },
    finalConfirm: { field: 'finalConfirm' },
    km: { field: 'kmTest' },
    firstSet: { field: 'firstSet' },
    desireLab: { field: 'desireLab' },
    interact: { field: 'interact' },
    respTest: { field: 'respTest' },
    ctTest: { field: 'ctTest' },
    selfWorth: { field: 'selfWorth' },
    valuesCore: { field: 'valuesCore' },
    reactorIn: { field: 'reactorIn' }
  };

  var ALIAS = {};
  Object.keys(CATALOG).forEach(function (id) {
    ALIAS[id] = id;
    (CATALOG[id].aliases || []).forEach(function (name) { ALIAS[name] = id; });
    if (CATALOG[id].name) ALIAS[CATALOG[id].name] = id;
    if (CATALOG[id].nameF) ALIAS[CATALOG[id].nameF] = id;
  });

  function clone(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }
  function loadRaw() {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null') || {}; }
    catch (e) { return {}; }
  }
  function persist(P) {
    if (global.GAtlas) global.GAtlas.sync(P);
    localStorage.setItem(KEY, JSON.stringify(P));
    return P;
  }
  function readToken(ref) {
    if (ref == null) return '';
    if (typeof ref === 'object') {
      if (ref.id != null && String(ref.id)) return String(ref.id);
      if (ref.name != null && String(ref.name)) return String(ref.name);
      if (ref.n != null && String(ref.n)) return String(ref.n);
      return '';
    }
    return String(ref);
  }
  function idOf(ref) {
    var token = readToken(ref);
    if (!token) return '';
    return ALIAS[token] || token;
  }
  function femaleProfile(P) {
    var g = String((P && P.gender) || '').toLowerCase();
    return g === 'f' || g === 'ж' || g === 'female' || g === 'жен' || g === 'женский' || g === 'woman';
  }
  function label(ref, P) {
    var id = idOf(ref);
    var meta = CATALOG[id];
    if (meta) return femaleProfile(P || loadRaw()) && meta.nameF ? meta.nameF : meta.name;
    if (ref && typeof ref === 'object') return String(ref.name || ref.n || ref.id || '');
    return String(ref || '');
  }
  function icon(ref) {
    var id = idOf(ref);
    return (CATALOG[id] && CATALOG[id].icon) || '💎';
  }
  function migrateArts(list) {
    var src = Array.isArray(list) ? list : [];
    var out = [];
    var seen = {};
    src.forEach(function (item) {
      var id = idOf(item);
      if (!id) return;
      if (seen[id]) return;
      seen[id] = true;
      out.push(id);
    });
    return out;
  }
  function emptyModule() {
    return { raw: {}, result: null, version: 1, history: [], updatedAt: null };
  }
  function topValue(P, spec) {
    if (spec.field) return P[spec.field];
    var bag = {};
    var has = false;
    (spec.fields || []).forEach(function (key) {
      if (P[key] !== undefined) { bag[key] = P[key]; has = true; }
    });
    return has ? bag : undefined;
  }
  function hasTop(P, spec) {
    if (spec.field) return P[spec.field] != null;
    return (spec.fields || []).some(function (key) { return P[key] != null; });
  }
  function writeThrough(P, moduleId, result) {
    var spec = MODULES[moduleId];
    if (!spec || result == null) return;
    if (spec.field) P[spec.field] = result;
    if (spec.fields && result && typeof result === 'object' && !Array.isArray(result)) {
      spec.fields.forEach(function (key) {
        if (result[key] !== undefined) P[key] = result[key];
      });
    }
  }
  function migrate(P) {
    if (!P || typeof P !== 'object' || Array.isArray(P)) P = {};
    P.arts = migrateArts(P.arts);
    P.modules = P.modules && typeof P.modules === 'object' && !Array.isArray(P.modules) ? P.modules : {};
    Object.keys(MODULES).forEach(function (id) {
      var spec = MODULES[id];
      var existing = P.modules[id];
      if (!existing || typeof existing !== 'object') {
        if (hasTop(P, spec)) {
          P.modules[id] = {
            raw: {},
            result: clone(topValue(P, spec)),
            version: 1,
            history: [],
            updatedAt: null
          };
        }
      } else {
        existing.raw = existing.raw && typeof existing.raw === 'object' ? existing.raw : {};
        existing.history = Array.isArray(existing.history) ? existing.history : [];
        if (!existing.version) existing.version = 1;
        if (existing.result == null && hasTop(P, spec)) existing.result = clone(topValue(P, spec));
      }
    });
    if (!P.schemaVersion || P.schemaVersion < SCHEMA_VERSION) P.schemaVersion = SCHEMA_VERSION;
    return P;
  }
  function load() { return migrate(loadRaw()); }
  function save(P) { return persist(migrate(P || {})); }
  function writeResult(P, moduleId, result, rawAnswers) {
    if (!moduleId) return P;
    migrate(P);
    var mod = P.modules[moduleId] || (P.modules[moduleId] = emptyModule());
    var prev = mod.result;
    var same = prev != null && JSON.stringify(prev) === JSON.stringify(result);
    if (prev != null && !same) {
      mod.history.push({
        result: clone(prev),
        raw: clone(mod.raw || {}),
        version: mod.version || 1,
        savedAt: mod.updatedAt || null
      });
    }
    if (rawAnswers && typeof rawAnswers === 'object') {
      mod.raw = Object.assign({}, mod.raw || {}, clone(rawAnswers));
    }
    mod.result = clone(result);
    mod.updatedAt = Date.now();
    writeThrough(P, moduleId, result);
    return P;
  }
  function recordRaw(moduleId, questionId, answer, details, opts) {
    if (!moduleId || questionId == null) return load();
    var passed = opts && opts.profile;
    var P = migrate(passed || load());
    var mod = P.modules[moduleId] || (P.modules[moduleId] = emptyModule());
    mod.raw[String(questionId)] = { answer: clone(answer), details: clone(details || {}), at: Date.now() };
    if (!passed) save(P);
    return P;
  }
  function saveResult(moduleId, result, rawAnswers, opts) {
    var passed = opts && opts.profile;
    var P = migrate(passed || load());
    writeResult(P, moduleId, result, rawAnswers);
    if (!passed) save(P);
    else if (!opts || opts.save !== false) save(P);
    return P;
  }
  function getModule(moduleId, P) {
    P = migrate(P || load());
    return P.modules[moduleId] || emptyModule();
  }
  function lockedSource(source) {
    if (!source || !global.GRoute || typeof global.GRoute.status !== 'function') return false;
    return global.GRoute.status(source) === 'locked';
  }
  function currentSource(opts) {
    if (opts && opts.source) return opts.source;
    if (global.GRoute && typeof global.GRoute.currentUrl === 'function') return global.GRoute.currentUrl();
    return null;
  }
  function has(ref, P) {
    var id = idOf(ref);
    P = P || loadRaw();
    return (Array.isArray(P.arts) ? P.arts : []).some(function (item) { return idOf(item) === id && id; });
  }
  function grantInto(P, ref, opts) {
    migrate(P);
    var id = idOf(ref);
    if (!id) return false;
    var source = currentSource(opts || {});
    if (lockedSource(source)) return false;
    if (has(id, P)) return false;
    P.arts.push(id);
    P.log = P.log || [];
    P.log.push({ t: Date.now(), x: 'Артефакт: ' + label(id, P) });
    return true;
  }
  function grant(ref, opts) {
    var passed = opts && opts.profile;
    var P = migrate(passed || load());
    var added = grantInto(P, ref, opts);
    if (added || !passed) save(P);
    return added;
  }
  function list(P) {
    P = migrate(P || loadRaw());
    return (P.arts || []).map(function (id) {
      return { id: idOf(id), name: label(id, P), icon: icon(id) };
    });
  }

  global.GArts = {
    catalog: CATALOG,
    idOf: idOf,
    label: function (ref, P) { return label(ref, P); },
    icon: icon,
    has: function (ref, P) { return has(ref, P); },
    grant: grant,
    grantInto: grantInto,
    list: list,
    migrate: migrateArts
  };

  var ATLAS_REGIONS = [
    {id:'origins',number:'I',title:'Башня Рождения и Долина Истоков',subtitle:'Имя, герой, первые настройки и способы адаптации',description:'Здесь герой появляется на карте и замечает первые способы сохранять безопасность: замирать, действовать, подстраиваться или искать опору. Прошлое рассматривается как источник опыта, а не как приговор.',entry:'form.html',awardSource:'form.html',artifact:'childhood_shard',steps:[['form.html','Инициация'],['hero.html','Создание героя'],['choose.html','Карта пути'],['scene.html?k=road','Первый выбор'],['bridge.html','Почерк героя'],['cutscene.html','Точка присутствия'],['slot.html?id=dialog','Диалог'],['ego.html','Фоновое состояние'],['slot.html?id=arch_b','Эхо'],['slot.html?id=fs','Первые настройки']],complete:function(P){return done('slot.html?id=fs')||(P.research&&P.research.adaptations&&P.research.adaptations.status==='completed')}},
    {id:'distortions',number:'II',title:'Долина Искажений и Туманные Озера',subtitle:'Кривой Мир, когнитивные фильтры и критическое мышление',description:'Здесь отделяются событие и его интерпретация. Герой проверяет автоматические выводы, ищет факты, замечает искажения и учится выдерживать неопределенность.',entry:'slot.html?id=km',awardSource:'slot.html?id=ct',artifact:'truth_lens',steps:[['slot.html?id=km','Кривой Мир'],['slot.html?id=ct','Критическое мышление']],complete:function(){return done('slot.html?id=km')&&done('slot.html?id=ct')}},
    {id:'citadel',number:'III',title:'Цитадель Границ и Обязательств',subtitle:'Самоценность, ответственность и право выбирать',description:'Здесь исследуется, где заканчивается собственная ответственность, как человек обходится с ошибками, получением, отказом и правом занимать свое место.',entry:'slot.html?id=rs',awardSource:'slot.html?id=sv',artifact:'autonomy_seal',steps:[['slot.html?id=rs','Ответственность и границы'],['slot.html?id=sv','Самоценность']],complete:function(){return done('slot.html?id=rs')&&done('slot.html?id=sv')}},
    {id:'labyrinth',number:'IV',title:'Лабиринт Ожиданий и Осколки Зеркал',subtitle:'Опыт, желания, вторичные выгоды и фрактальная карта',description:'Здесь сопоставляются ожидания и реальные желания. Важные выводы проверяются на жизненных эпизодах, контрпримерах и внешних обстоятельствах.',entry:'slot.html?id=mirrors',awardSource:'slot.html?id=fractal',artifact:'intent_compass',steps:[['slot.html?id=mirrors','Два зеркала'],['slot.html?id=source','Источник'],['slot.html?id=mirage','Миражи'],['slot.html?id=lab_d','Лабиринт желаний'],['slot.html?id=fractal','Фрактальная карта']],complete:function(){return done('slot.html?id=mirrors')&&done('slot.html?id=source')&&done('slot.html?id=mirage')&&done('slot.html?id=lab_d')&&done('slot.html?id=fractal')}},
    {id:'crossroads',number:'V',title:'Перекресток Судеб',subtitle:'Колесо сфер, ценности и три выбранных направления',description:'Здесь из наблюдений складывается личный маршрут: три направления, конкретные действия, минимальные версии и признаки выполнения.',entry:'values.html',awardSource:'reactor28.html',artifact:'route_scroll',steps:[['wheel8.html','Первый взгляд на сферы'],['wheel-test.html','Проверка реальностью'],['values.html','Ценности и направления'],['slot.html?id=arch_v','Сверка гипотез'],['slot.html?id=arch_d','Выбор нового состояния']],complete:function(P){var r=P.reactor28||{};return done('slot.html?id=arch_d')&&!!r.setupDone&&(r.personalActions||[]).length===3&&(r.personalActions||[]).every(function(a){return !!(a.direction&&a.action)})}},
    {id:'peak',number:'VI',title:'Пик Практики',subtitle:'28 дней, ежедневный выбор и интеграция опыта',description:'Здесь знание превращается в проверяемый опыт. Четыре недели не обещают мгновенной перемены: они дают пространство для повторения, наблюдения и корректировки действий.',entry:'reactor28.html',awardSource:'slot.html?id=compare',artifact:'golden_atanor',steps:[['reactor28.html','Реактор · 28 дней'],['slot.html?id=retest','Повторное исследование'],['slot.html?id=compare','Было и стало']],complete:function(P){var r=P.reactor28||{};return (+r.day||0)>=28&&!!P.retest&&!!P.retest.comparedAt}}
  ];
  function done(url){return !!(global.GRoute&&global.GRoute.status(url)==='done')}
  function regionState(P,r){var statuses=r.steps.map(function(x){return global.GRoute?global.GRoute.status(x[0]):'available'}),total=statuses.length,completed=statuses.filter(function(s){return s==='done'}).length,entry=global.GRoute?global.GRoute.status(r.entry):'available';return {id:r.id,number:r.number,title:r.title,subtitle:r.subtitle,description:r.description,entry:r.entry,artifact:r.artifact,steps:r.steps,unlocked:entry!=='locked',completed:!!r.complete(P),done:completed,total:total,progress:total?Math.round(completed/total*100):0,state:entry==='locked'?'locked':r.complete(P)?'completed':completed?'in_progress':'available'}}
  function sync(P){P=P||((global.GPro&&global.GPro.load)?global.GPro.load():{});if(!global.GArts)return false;var changed=false;ATLAS_REGIONS.forEach(function(r){if(r.complete(P)&&!global.GArts.has(r.artifact,P)){if(global.GArts.grantInto(P,r.artifact,{source:r.awardSource}))changed=true}});return changed}
  function state(P){P=P||global.GPro.load();sync(P);return {regions:ATLAS_REGIONS.map(function(r){return regionState(P,r)}),artifacts:ATLAS_REGIONS.map(function(r){var d=global.GArts.catalog[r.artifact]||{},desc={childhood_shard:'Понимание ранних способов адаптации и их нынешней роли.',truth_lens:'Способность различать факт, интерпретацию и проверяемую гипотезу.',autonomy_seal:'Напоминание о праве на ошибку, границы и собственную ответственность.',intent_compass:'Ориентир для различения собственного желания и чужих ожиданий.',route_scroll:'Три направления и конкретные шаги, соразмерные доступным ресурсам.',golden_atanor:'Завершенный цикл наблюдения, действия и интеграции опыта.'};return {id:r.artifact,name:d.name||r.artifact,icon:d.icon||'💎',description:desc[r.artifact],unlocked:global.GArts.has(r.artifact,P)}})}}
  global.GAtlas={regions:ATLAS_REGIONS,sync:sync,state:state};

  global.GProfile = {
    key: KEY,
    schemaVersion: SCHEMA_VERSION,
    migrate: migrate,
    load: load,
    save: save,
    recordRaw: recordRaw,
    saveResult: saveResult,
    writeResult: writeResult,
    getModule: getModule
  };
})(typeof window !== 'undefined' ? window : global);
