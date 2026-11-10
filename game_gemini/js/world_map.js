/* Карта пути и инвентарь. Работает с фактической схемой AlchemistProfile. */
(function (global) {
  'use strict';

  const ARTIFACTS = {
    childhood_shard: { name: 'Осколок Первичного Детства', icon: '◇', region: 'Долина Истоков', description: 'Образ ранних способов приспосабливаться и искать опору.' },
    truth_lens: { name: 'Линза Истинного Света', icon: '◈', region: 'Долина Искажений', description: 'Напоминание различать событие, мысль и собственную интерпретацию.' },
    autonomy_seal: { name: 'Печать Самостоятельности', icon: '✧', region: 'Цитадель Границ', description: 'Символ права занимать свое место, выбирать меру ответственности и обозначать границы.' },
    intent_compass: { name: 'Компас Намерений', icon: '⌖', region: 'Лабиринт Ожиданий', description: 'Собранное направление: желание, препятствия и проверенные гипотезы.' },
    route_scroll: { name: 'Свиток Пути', icon: '▤', region: 'Перекресток Судеб', description: 'Зафиксированные приоритеты и первые шаги.' },
    golden_atanor: { name: 'Золотой Атанор', icon: '◉', region: 'Пик Практики', description: 'Знак завершенного четырехнедельного цикла и собранного опыта.' }
  };

  const REGIONS = [
    {
      id: 'origins', number: 'I', title: 'Долина Истоков', subtitle: 'Первые способы приспособления',
      description: 'Здесь начинается исследование ранних стратегий: замирания, контроля и действия, сокрытия и подстройки, поиска опоры.',
      modules: [{ label: 'Детские адаптации', url: 'adaptations.html' }],
      artifact: 'childhood_shard',
      complete: p => done(p, 'adaptations'),
      unlock: () => true
    },
    {
      id: 'mist', number: 'II', title: 'Долина Искажений', subtitle: 'Линзы восприятия',
      description: 'Исследование того, как мы воспринимаем информацию, объясняем события и проверяем собственные выводы.',
      modules: [
        { label: 'Когнитивные предпочтения', url: 'cognition.html' },
        { label: 'Кривой Мир', url: 'crooked_world.html' },
        { label: 'Критическое мышление', url: 'critical_thinking.html' }
      ],
      artifact: 'truth_lens',
      complete: p => ['cognitive', 'crookedWorld', 'criticalThinking'].every(k => done(p, k)),
      unlock: (p, i) => i === 0 || REGIONS[i - 1].complete(p)
    },
    {
      id: 'citadel', number: 'III', title: 'Цитадель Границ', subtitle: 'Самоценность и ответственность',
      description: 'Право занимать свое место, принимать решения, отказывать и определять собственную зону ответственности.',
      modules: [
        { label: 'Самоценность', url: 'self_worth.html' },
        { label: 'Ответственность', url: 'responsibility.html' }
      ],
      artifact: 'autonomy_seal',
      complete: p => ['selfWorth', 'responsibility'].every(k => done(p, k)),
      unlock: (p, i) => REGIONS[i - 1].complete(p)
    },
    {
      id: 'labyrinth', number: 'IV', title: 'Лабиринт Ожиданий', subtitle: 'Желания и фрактальные отражения',
      description: 'Здесь встречаются сформулированное желание, препятствия, вторичные выгоды и гипотезы, которые Вы сами проверяете.',
      modules: [
        { label: 'Лабиринт желаний', url: 'labyrinth.html' },
        { label: 'Фрактальная карта', url: 'fractal_map.html' }
      ],
      artifact: 'intent_compass',
      complete: p => done(p, 'labyrinth') && !!(p.pathway && p.pathway.progress && p.pathway.progress['labyrinth:fractal_map'] && p.pathway.progress['labyrinth:fractal_map'].visited),
      unlock: (p, i) => REGIONS[i - 1].complete(p)
    },
    {
      id: 'crossroads', number: 'V', title: 'Перекресток Судеб', subtitle: 'Выбор собственного направления',
      description: 'Колесо жизненных сфер помогает увидеть общую картину, а персональный маршрут — выбрать приоритеты и конкретные действия.',
      modules: [
        { label: 'Колесо жизненных сфер', url: 'research.html#wheel-panel' },
        { label: 'Персональный маршрут', url: 'personal_route.html' }
      ],
      artifact: 'route_scroll',
      complete: p => !!(p.lifeAreas && p.lifeAreas.status === 'completed' && p.personalRoute && Array.isArray(p.personalRoute.priorities) && p.personalRoute.priorities.length),
      unlock: (p, i) => REGIONS[i - 1].complete(p)
    },
    {
      id: 'summit', number: 'VI', title: 'Пик Практики', subtitle: '28 дней нового опыта',
      description: 'Знания переходят в повседневную жизнь через наблюдения, эксперименты, действия и личные выводы.',
      modules: [{ label: 'Четырехнедельный трекер', url: 'tracker.html' }],
      artifact: 'golden_atanor',
      complete: p => !!(p.tracker && p.tracker.status === 'completed'),
      unlock: (p, i) => REGIONS[i - 1].complete(p)
    }
  ];

  function done(profile, key) {
    const item = profile && profile.research && profile.research[key];
    return !!(item && item.status === 'completed');
  }

  function getState() {
    const api = global.AlchemistProfile;
    const profile = api.load();
    const regions = REGIONS.map((region, index) => ({
      id: region.id, number: region.number, title: region.title,
      subtitle: region.subtitle, description: region.description,
      modules: region.modules, artifactId: region.artifact, artifact: ARTIFACTS[region.artifact],
      unlocked: !!region.unlock(profile, index),
      completed: !!region.complete(profile)
    }));
    const artifacts = Array.isArray(profile.inventory.artifacts) ? profile.inventory.artifacts.slice() : [];
    let artifactsChanged = false;
    regions.forEach(region => {
      if (!region.completed) return;
      const id = region.artifactId;
      if (ARTIFACTS[id] && !artifacts.some(item => item && (item.id === id || item === id))) {
        artifacts.push({ id, unlockedAt: new Date().toISOString() });
        artifactsChanged = true;
      }
    });
    if (artifactsChanged) {
      api.update(p => { p.inventory.artifacts = artifacts; });
    }
    const inventory = Object.keys(ARTIFACTS).map(id => {
      const found = artifacts.find(item => item && (item.id === id || item === id));
      return { id, ...ARTIFACTS[id], unlocked: !!found, unlockedAt: found && found.unlockedAt || null };
    });
    return { profile, regions, inventory };
  }

  global.WorldMapEngine = { getState };
})(window);
