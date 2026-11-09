// Персональный маршрут: генерация только из фактически сохраненных данных профиля.
(function (global) {
  'use strict';

  const URGENCY_ORDER = ['В течение месяца', 'В течение года', 'В течение трех лет'];

  function mean(values) {
    const valid = (Array.isArray(values) ? values : []).filter(v => typeof v === 'number' && v >= 1 && v <= 10);
    return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
  }

  function confirmedHypotheses(profile) {
    return (Array.isArray(profile.hypotheses) ? profile.hypotheses : [])
      .filter(item => ['confirmed', 'refined'].includes(item.status))
      .map(item => ({
        id: item.id,
        title: item.title || 'Гипотеза фрактальной карты',
        status: item.status,
        note: item.playerFeedback && item.playerFeedback.note || ''
      }));
  }

  function labyrinthData(profile) {
    const module = profile.research && profile.research.labyrinth;
    const raw = module && module.rawAnswers || {};
    const reflections = raw.reflections || {};
    const selected = raw.multi && Array.isArray(raw.multi.obstacles_mapping)
      ? raw.multi.obstacles_mapping : [];
    const obstacleNames = {
      obs_1: 'Нехватка времени или физического ресурса',
      obs_2: 'Страх осуждения, критики или отвержения',
      obs_3: 'Сомнения в собственной компетентности',
      obs_4: 'Отсутствие ясного пошагового плана',
      obs_5: 'Финансовые или внешние ограничения',
      obs_6: 'Откладывание важных шагов'
    };
    return {
      desire: String(reflections.desire_definition || '').trim(),
      secondaryGain: String(reflections.secondary_gain || '').trim(),
      priceOfChange: String(reflections.price_of_change || '').trim(),
      obstacles: selected.map(id => obstacleNames[id]).filter(Boolean),
      completed: !!(module && module.status === 'completed')
    };
  }

  function wheelCandidates(profile) {
    const wheel = profile.lifeAreas && profile.lifeAreas.wheelTest;
    if (!wheel || !Array.isArray(wheel.spheres) || !wheel.spheres.length) return [];
    const priorities = Array.isArray(wheel.priorities) ? wheel.priorities : [];
    const candidates = [];
    const seen = new Set();

    priorities.forEach(id => {
      if (!Number.isInteger(id) || id < 0) return;
      const sphereIndex = Math.floor(id / 3);
      const questionIndex = id % 3;
      const sphere = wheel.spheres[sphereIndex];
      const improvement = sphere && sphere.improvements && sphere.improvements[questionIndex];
      if (!sphere || !improvement || improvement.change !== 'yes' || seen.has(sphereIndex)) return;
      seen.add(sphereIndex);
      candidates.push({
        sphereIndex,
        sphereTitle: sphere.name,
        average: mean(sphere.ratings),
        strength: Number(improvement.strength) || 0,
        urgency: improvement.urgency || '',
        source: 'Вы отметили желание изменить эту сферу в Колесе жизненных сфер.',
        question: ''
      });
    });

    // Если список приоритетов еще не зафиксирован, используем только явные ответы «хочу улучшить».
    if (!candidates.length) {
      wheel.spheres.forEach((sphere, sphereIndex) => {
        (sphere.improvements || []).forEach((improvement, questionIndex) => {
          if (improvement && improvement.change === 'yes' && !seen.has(sphereIndex)) {
            seen.add(sphereIndex);
            candidates.push({
              sphereIndex,
              sphereTitle: sphere.name,
              average: mean(sphere.ratings),
              strength: Number(improvement.strength) || 0,
              urgency: improvement.urgency || '',
              source: 'Вы отметили желание изменить эту сферу в Колесе жизненных сфер.',
              question: ''
            });
          }
        });
      });
      candidates.sort((a, b) =>
        b.strength - a.strength ||
        URGENCY_ORDER.indexOf(a.urgency) - URGENCY_ORDER.indexOf(b.urgency)
      );
    }

    return candidates.slice(0, 3);
  }

  class RouteGenerator {
    static generateRoute(profile) {
      const labyrinth = labyrinthData(profile || {});
      const hypotheses = confirmedHypotheses(profile || {});
      const candidates = wheelCandidates(profile || {});

      return candidates.map((candidate, index) => {
          return {
          id: 'route_priority_' + (index + 1),
          sphereKey: 'wheel_sphere_' + candidate.sphereIndex,
          sphereTitle: candidate.sphereTitle,
          wheelAverage: candidate.average,
          desireStrength: candidate.strength,
          urgency: candidate.urgency,
          targetChange: labyrinth.desire
            ? 'Как именно желание «' + labyrinth.desire.slice(0, 180) + '» может проявиться в этой сфере?'
            : '',
          holdingFactor: '',
          internalRules: '',
          externalLimits: labyrinth.obstacles.join('; '),
          resources: '',
          firstStep: '',
          progressMetric: '',
          evidence: [candidate.source].concat(
            candidate.average === null ? [] : ['Средняя оценка сферы по ответам: ' + candidate.average.toFixed(1) + ' из 10.'],
            candidate.strength ? ['Сила желания изменить выбранный аспект: ' + candidate.strength + ' из 10.'] : []
          ),
          labyrinth: {
            desire: labyrinth.desire,
            secondaryGain: labyrinth.secondaryGain,
            priceOfChange: labyrinth.priceOfChange,
            obstacles: labyrinth.obstacles
          },
        };
      });
    }

    static getInputs(profile) {
      const labyrinth = labyrinthData(profile || {});
      return {
        wheelAvailable: !!(profile.lifeAreas && profile.lifeAreas.wheelTest &&
          Array.isArray(profile.lifeAreas.wheelTest.spheres)),
        wheelCompleted: !!(profile.lifeAreas && profile.lifeAreas.wheelTest &&
          profile.lifeAreas.wheelTest.completed),
        labyrinth,
        confirmedHypotheses: hypotheses
      };
    }
  }

  global.RouteGenerator = RouteGenerator;
})(window);
