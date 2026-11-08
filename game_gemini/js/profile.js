/* Единый профиль героя. Все игровые модули работают только через этот менеджер. */
(function (global) {
  'use strict';
  const PROFILE_KEY = 'alchemist_hero_profile_gemini';
  const LEGACY_KEYS = ['gemini_game_profile_v1', 'alchemist_hero_profile_gemini'];
  const SCHEMA_VERSION = 1;

  function emptyProfile() {
    return {
      schemaVersion: SCHEMA_VERSION,
      meta: { name: '', birthdate: '', gender: 'female', createdAt: null, updatedAt: null },
      symbolic: {
        status: 'not_calculated',
        methodVersion: null,
        matrix: {},
        arcana: {
          personality: null,
          intuition: null,
          challenge: null,
          key: null
        }
      },
      research: {
        adaptations: { status: 'pending', rawAnswers: {}, results: {}, completedAt: null },
        cognitive: { status: 'pending', rawAnswers: {}, results: {}, completedAt: null },
        crookedWorld: { status: 'pending', rawAnswers: {}, results: {}, completedAt: null },
        selfWorth: { status: 'pending', rawAnswers: {}, results: {}, completedAt: null },
        responsibility: { status: 'pending', rawAnswers: {}, results: {}, completedAt: null },
        criticalThinking: { status: 'pending', rawAnswers: {}, results: {}, completedAt: null }
      },
      hypotheses: [],
      lifeAreas: { status: 'pending', areas: {}, priorities: [] },
      desires: { status: 'pending', entries: [], externalConstraints: [], experiments: [] },
      pathway: { currentStage: 'birth', currentLocation: null, progress: {}, completed: [] },
      personalRoute: { status: 'not_created', priorities: [], tasks: [] },
      tracker: { status: 'not_started', startedAt: null, days: {}, summary: {} },
      inventory: { artifacts: [], helpers: [] },
      history: []
    };
  }

  function validBirth(data) {
    return !!(data && typeof data.name === 'string' && data.name.trim() &&
      typeof data.birthdate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.birthdate) &&
      (data.gender === 'female' || data.gender === 'male'));
  }

  function migrateLegacy(raw) {
    const p = emptyProfile();
    if (!raw || typeof raw !== 'object') return p;
    // Поддерживаем прежний плоский профиль рождения и прежнюю форму с meta.
    const source = raw.meta && typeof raw.meta === 'object' ? raw.meta : raw;
    const birth = {
      name: source.name || '',
      birthdate: source.birthdate || source.birth || '',
      gender: source.gender || 'female',
      createdAt: source.createdAt || null
    };
    if (validBirth(birth)) {
      p.meta = { ...p.meta, ...birth, updatedAt: new Date().toISOString() };
      p.pathway.currentStage = 'birth';
      p.history.push({ type: 'migration', fromSchema: raw.schemaVersion || 0, at: new Date().toISOString(), note: 'Перенесены исходные данные рождения героя.' });
    }
    if (raw.modules && typeof raw.modules === 'object') {
      Object.keys(raw.modules).forEach(key => {
        if (p.research[key]) p.research[key] = { ...p.research[key], ...raw.modules[key] };
      });
    }
    if (Array.isArray(raw.artifacts)) p.inventory.artifacts = raw.artifacts;
    if (raw.research && typeof raw.research === 'object') {
      Object.keys(raw.research).forEach(key => {
        if (p.research[key]) p.research[key] = { ...p.research[key], ...raw.research[key] };
      });
    }
    return p;
  }

  function normalize(raw) {
    const base = emptyProfile();
    if (!raw || typeof raw !== 'object') return base;
    if (!raw.schemaVersion) return migrateLegacy(raw);
    const merged = {
      ...base, ...raw,
      meta: { ...base.meta, ...(raw.meta || {}) },
      symbolic: { ...base.symbolic, ...(raw.symbolic || {}), arcana: { ...base.symbolic.arcana, ...((raw.symbolic || {}).arcana || {}) } },
      research: { ...base.research, ...(raw.research || {}) },
      lifeAreas: { ...base.lifeAreas, ...(raw.lifeAreas || {}) },
      desires: { ...base.desires, ...(raw.desires || {}) },
      pathway: { ...base.pathway, ...(raw.pathway || {}) },
      personalRoute: { ...base.personalRoute, ...(raw.personalRoute || {}) },
      tracker: { ...base.tracker, ...(raw.tracker || {}) },
      inventory: { ...base.inventory, ...(raw.inventory || {}) },
      hypotheses: Array.isArray(raw.hypotheses) ? raw.hypotheses : [],
      history: Array.isArray(raw.history) ? raw.history : []
    };
    merged.schemaVersion = SCHEMA_VERSION;
    return merged;
  }

  function load() {
    let raw = null;
    try {
      raw = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
      if (!raw) {
        for (const key of LEGACY_KEYS) {
          if (key === PROFILE_KEY) continue;
          const legacy = JSON.parse(localStorage.getItem(key) || 'null');
          if (legacy) { raw = legacy; break; }
        }
      }
    } catch (error) {
      console.error('Не удалось прочитать профиль героя', error);
    }
    const profile = normalize(raw);
    if (raw) {
      // Сначала сохраняем новую копию; исходный ключ не удаляем до проверки.
      save(profile);
    }
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

  function hasBirth(profile) { return validBirth(profile && profile.meta); }

  global.AlchemistProfile = {
    key: PROFILE_KEY, schemaVersion: SCHEMA_VERSION,
    create: emptyProfile, load, save, update, hasBirth,
    getKey: () => PROFILE_KEY
  };
})(window);
