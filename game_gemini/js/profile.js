/* Единый профиль героя. Игровые модули сохраняют данные только через этот менеджер. */
(function (global) {
  'use strict';
  const PROFILE_KEY = 'alchemist_hero_profile_gemini';
  const LEGACY_KEYS = ['gemini_game_profile_v1', 'alch_profile'];
  const SCHEMA_VERSION = 2;
  const RESEARCH_KEYS = ['adaptations','cognitive','crookedWorld','selfWorth','responsibility','criticalThinking'];

  function emptyProfile() {
    return {
      schemaVersion: SCHEMA_VERSION,
      meta: { name: '', birthdate: '', gender: 'female', createdAt: null, updatedAt: null },
      symbolic: { status: 'not_calculated', methodVersion: null, matrix: {}, arcana: { personality: null, intuition: null, challenge: null, key: null } },
      research: Object.fromEntries(RESEARCH_KEYS.map(key => [key, { status: 'pending', rawAnswers: {}, results: {}, completedAt: null }])),
      hypotheses: [],
      lifeAreas: { status: 'pending', areas: {}, priorities: [], firstLook: [], wheelTest: null },
      desires: { status: 'pending', entries: [], externalConstraints: [], experiments: [] },
      pathway: { currentStage: 'birth', currentLocation: null, progress: {}, completed: [] },
      personalRoute: { status: 'not_created', priorities: [], tasks: [] },
      tracker: { status: 'not_started', startedAt: null, days: {}, summary: {} },
      inventory: { artifacts: [], helpers: [] },
      diary: { insights: [], questions: [], entries: [] },
      legacy: {},
      history: []
    };
  }

  function validBirth(data) {
    return !!(data && typeof data.name === 'string' && data.name.trim() &&
      typeof data.birthdate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.birthdate) &&
      (data.gender === 'female' || data.gender === 'male'));
  }
  function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function mergeObject(base, source) {
    const out = { ...base };
    if (source && typeof source === 'object' && !Array.isArray(source)) {
      Object.keys(source).forEach(key => {
        const a = out[key], b = source[key];
        out[key] = a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)
          ? mergeObject(a, b) : b;
      });
    }
    return out;
  }
  function normalize(raw) {
    const base = emptyProfile();
    if (!raw || typeof raw !== 'object') return base;
    const p = { ...base, ...raw };
    ['meta','symbolic','lifeAreas','desires','pathway','personalRoute','tracker','inventory','diary','legacy'].forEach(k => {
      p[k] = mergeObject(base[k], raw[k]);
    });
    p.symbolic.arcana = mergeObject(base.symbolic.arcana, (raw.symbolic || {}).arcana);
    p.research = { ...base.research, ...(raw.research || {}) };
    RESEARCH_KEYS.forEach(k => {
      p.research[k] = mergeObject(base.research[k], (raw.research || {})[k]);
    });
    p.hypotheses = Array.isArray(raw.hypotheses) ? raw.hypotheses : [];
    p.history = Array.isArray(raw.history) ? raw.history : [];
    p.schemaVersion = SCHEMA_VERSION;
    return p;
  }

  function legacyBirth(raw) {
    const source = raw.meta && typeof raw.meta === 'object' ? raw.meta : raw;
    let birthdate = source.birthdate || source.birth || '';
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(birthdate)) {
      const [d,m,y] = birthdate.split('.');
      birthdate = y + '-' + m + '-' + d;
    }
    const genderRaw = String(source.gender || '').toLowerCase();
    return { name: source.name || '', birthdate, gender: ['f','ж','female','женский'].includes(genderRaw) ? 'female' : 'male', createdAt: source.createdAt || null };
  }

  function importLegacy(raw, sourceKey) {
    const p = emptyProfile();
    if (!raw || typeof raw !== 'object') return p;
    const birth = legacyBirth(raw);
    if (validBirth(birth)) p.meta = { ...p.meta, ...birth };
    // Старые расчеты и результаты сохраняются без переинтерпретации.
    p.legacy[sourceKey || 'legacy'] = clone(raw);
    if (raw.passport) {
      p.symbolic.matrix.passport = clone(raw.passport);
      p.symbolic.methodVersion = raw.passport.version || null;
      p.symbolic.status = 'imported_legacy';
      if (raw.passport.hypotheses) {
        raw.passport.hypotheses.forEach(h => p.hypotheses.push({
          id: h.id, status: h.status || 'unreviewed', pole: h.pole || 'neutral',
          sources: clone(h.sources || {}), source: 'legacy_passport',
          playerFeedback: h.playerFeedback || null
        }));
      }
    }
    if (Array.isArray(raw.wheel)) p.lifeAreas.firstLook = clone(raw.wheel);
    if (raw.wheelTest) {
      p.lifeAreas.wheelTest = clone(raw.wheelTest);
      p.lifeAreas.status = raw.wheelTest.completed ? 'completed' : 'in_progress';
      if (Array.isArray(raw.wheelTest.spheres)) {
        raw.wheelTest.spheres.forEach(s => {
          p.lifeAreas.areas[s.name] = clone(s);
        });
      }
      if (Array.isArray(raw.wheelTest.priorities)) p.lifeAreas.priorities = clone(raw.wheelTest.priorities);
    }
    if (raw.values) p.research.values = clone(raw.values);
    if (raw.ego) p.research.backgroundState = clone(raw.ego);
    if (raw.egoSelf) p.research.selfWorth.legacyResult = clone(raw.egoSelf);
    if (raw.dq) p.research.goodAcceptance = clone(raw.dq);
    if (raw.focuses) p.personalRoute.priorities = clone(raw.focuses);
    if (raw.path) p.pathway.legacyPath = clone(raw.path);
    if (raw.log) p.pathway.legacyLog = clone(raw.log);
    if (raw.arts) p.inventory.artifacts = clone(raw.arts);
    if (raw.diary) {
      p.diary.insights = clone(raw.diary.ins || []);
      p.diary.questions = clone(raw.diary.q || []);
      p.diary.entries = [...p.diary.insights, ...p.diary.questions];
    }
    p.history.push({ type: 'legacy_profile_imported', source: sourceKey || 'legacy', at: new Date().toISOString(), note: 'Старые данные сохранены в профиле без удаления исходного хранилища.' });
    return p;
  }

  function load() {
    let raw = null, sourceKey = PROFILE_KEY;
    try {
      raw = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
      if (!raw) {
        for (const key of LEGACY_KEYS) {
          const value = JSON.parse(localStorage.getItem(key) || 'null');
          if (value) { raw = value; sourceKey = key; break; }
        }
      }
    } catch (error) { console.error('Не удалось прочитать профиль героя', error); }
    let profile = raw && raw.schemaVersion ? normalize(raw) : importLegacy(raw, sourceKey);
    // Если новый профиль уже создан, отдельно подхватываем прежний alch_profile,
    // не затирая более свежие данные game_gemini.
    try {
      const oldGame = JSON.parse(localStorage.getItem('alch_profile') || 'null');
      if (oldGame && !profile.legacy.game_v4) {
        const imported = importLegacy(oldGame, 'alch_profile');
        profile.legacy.game_v4 = clone(oldGame);
        if (!hasBirth(profile) && hasBirth(imported)) profile.meta = imported.meta;
        if (!Object.keys(profile.symbolic.matrix || {}).length) profile.symbolic.matrix = imported.symbolic.matrix;
        if (!Object.keys(profile.lifeAreas.areas || {}).length) profile.lifeAreas = imported.lifeAreas;
        if (!profile.lifeAreas.firstLook.length) profile.lifeAreas.firstLook = imported.lifeAreas.firstLook;
        if (!profile.personalRoute.priorities.length) profile.personalRoute.priorities = imported.personalRoute.priorities;
        if (!profile.inventory.artifacts.length) profile.inventory.artifacts = imported.inventory.artifacts;
        profile.diary = mergeObject(imported.diary, profile.diary);
        imported.history.forEach(item => profile.history.push(item));
        profile.history.push({ type: 'game_v4_profile_attached', at: new Date().toISOString(), note: 'Старый профиль подключен к единому профилю; исходное хранилище сохранено.' });
      }
    } catch (error) { console.warn('Не удалось подключить старый профиль', error); }
    if (raw || profile.history.length) save(profile);
    return profile;
  }

  function save(profile) {
    const next = normalize(profile);
    next.meta.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      return next;
    } catch (error) {
      throw new Error('Не удалось сохранить профиль. Проверьте доступность хранилища браузера.');
    }
  }
  function update(mutator) {
    const current = load();
    mutator(current);
    return save(current);
  }
  function event(type, details) {
    return update(p => p.history.push({ type, details: clone(details || {}), at: new Date().toISOString() }));
  }
  function recordAnswer(moduleId, questionId, answer, details) {
    if (!moduleId || questionId == null) throw new Error('Не указаны модуль или вопрос.');
    return update(p => {
      const module = p.research[moduleId] || (p.research[moduleId] = { status: 'in_progress', rawAnswers: {}, results: {}, completedAt: null });
      module.rawAnswers[String(questionId)] = { answer: clone(answer), details: clone(details || {}), at: new Date().toISOString() };
      module.status = 'in_progress';
      p.history.push({ type: 'answer_saved', module: moduleId, questionId: String(questionId), at: new Date().toISOString() });
    });
  }
  function setResearchResult(moduleId, result, rawAnswers) {
    if (!moduleId) throw new Error('Не указан исследовательский модуль.');
    return update(p => {
      const module = p.research[moduleId] || (p.research[moduleId] = { status: 'pending', rawAnswers: {}, results: {}, completedAt: null });
      if (rawAnswers) module.rawAnswers = mergeObject(module.rawAnswers || {}, rawAnswers);
      module.results = clone(result || {});
      module.status = 'completed';
      module.completedAt = new Date().toISOString();
      p.history.push({ type: 'research_completed', module: moduleId, at: module.completedAt });
    });
  }
  function setLifeAreas(areas, priorities, firstLook) {
    return update(p => {
      p.lifeAreas.areas = clone(areas || p.lifeAreas.areas);
      if (Array.isArray(priorities)) p.lifeAreas.priorities = clone(priorities);
      if (Array.isArray(firstLook)) p.lifeAreas.firstLook = clone(firstLook);
      p.lifeAreas.status = 'in_progress';
      p.history.push({ type: 'life_areas_updated', at: new Date().toISOString() });
    });
  }
  function addDesire(entry) {
    return update(p => {
      p.desires.entries.push({ ...clone(entry || {}), id: entry && entry.id || 'desire-' + Date.now(), updatedAt: new Date().toISOString() });
      p.desires.status = 'in_progress';
      p.history.push({ type: 'desire_added', at: new Date().toISOString() });
    });
  }
  function addHypothesis(hypothesis) {
    if (!hypothesis || !hypothesis.id) throw new Error('У гипотезы должен быть идентификатор.');
    return update(p => {
      const existing = p.hypotheses.findIndex(h => h.id === hypothesis.id);
      const item = { ...clone(hypothesis), status: hypothesis.status || 'new', updatedAt: new Date().toISOString() };
      if (existing < 0) p.hypotheses.push(item); else p.hypotheses[existing] = { ...p.hypotheses[existing], ...item };
      p.history.push({ type: 'hypothesis_added_or_updated', hypothesisId: hypothesis.id, at: new Date().toISOString() });
    });
  }
  function resolveHypothesis(id, decision, note) {
    if (!['confirmed','rejected','refined'].includes(decision)) throw new Error('Неизвестный вариант ответа на гипотезу.');
    return update(p => {
      const h = p.hypotheses.find(item => item.id === id);
      if (!h) throw new Error('Гипотеза не найдена.');
      h.status = decision;
      h.playerFeedback = { decision: h.status, note: String(note || ''), at: new Date().toISOString() };
      p.history.push({ type: 'hypothesis_feedback', hypothesisId: id, decision: h.status, at: h.playerFeedback.at });
    });
  }
  function recordProgress(stage, location, details) {
    return update(p => {
      if (stage) p.pathway.currentStage = stage;
      if (location !== undefined) p.pathway.currentLocation = location;
      const key = [stage || p.pathway.currentStage, location || ''].join(':');
      p.pathway.progress[key] = { ...(p.pathway.progress[key] || {}), ...clone(details || {}), updatedAt: new Date().toISOString() };
      p.history.push({ type: 'pathway_progress', stage: p.pathway.currentStage, location: p.pathway.currentLocation, at: new Date().toISOString() });
    });
  }
  function hasBirth(profile) { return validBirth(profile && profile.meta); }

  global.AlchemistProfile = {
    key: PROFILE_KEY, schemaVersion: SCHEMA_VERSION,
    create: emptyProfile, load, save, update, hasBirth, event,
    recordAnswer, setResearchResult, setLifeAreas, addDesire,
    addHypothesis, resolveHypothesis, recordProgress,
    getKey: () => PROFILE_KEY
  };
})(window);
