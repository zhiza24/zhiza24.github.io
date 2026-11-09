// game_gemini/js/fractal_analyzer.js
// Сопоставляет только сохраненные результаты. Выводы являются гипотезами для проверки игроком.
(function(global){
  'use strict';

  const MODULES = {
    adaptations: 'Детские адаптации',
    cognitive: 'Когнитивные предпочтения',
    crookedWorld: 'Кривой Мир',
    selfWorth: 'Самоценность',
    responsibility: 'Ответственность',
    criticalThinking: 'Критическое мышление',
    labyrinth: 'Лабиринт желаний'
  };

  function resultOf(module){
    if(!module || typeof module !== 'object') return null;
    if(module.results && typeof module.results === 'object' && Object.keys(module.results).length) return module.results;
    return module;
  }
  function completed(module){
    return !!(module && (module.status === 'completed' || (module.results && Object.keys(module.results).length)));
  }
  function add(out, item){
    out.push({
      id: item.id,
      title: item.title,
      description: item.description,
      modules: item.modules,
      evidence: item.evidence || [],
      reflectionQuestion: item.reflectionQuestion || 'Узнаете ли Вы это проявление в своей жизни? В каких обстоятельствах оно возникает?',
      kind: 'hypothesis'
    });
  }

  class FractalAnalyzer {
    static analyze(profile){
      const research = profile && profile.research || {};
      const patterns = [];

      const adaptationModule = research.adaptations;
      const adaptation = resultOf(adaptationModule) || {};
      const adaptationCode = adaptation.dominantStrategy || adaptation.strategy || adaptation.dominant || null;
      const responsibilityModule = research.responsibility;
      const responsibility = resultOf(responsibilityModule) || {};
      const respScores = responsibility.scores || {};

      if(completed(adaptationModule) && completed(responsibilityModule) && adaptationCode === 'A' &&
        (Number(respScores.boundaries) >= 8 || Number(respScores.guilt) >= 8)){
        const evidence = [
          {module: MODULES.adaptations, detail: 'В результате указан ведущий вариант A — замирание.'},
          {module: MODULES.responsibility, detail: 'В результатах отмечен высокий балл по границам зоны влияния и/или склонности к вине (8 из 12 и выше).'}
        ];
        add(patterns,{
          id:'freeze_responsibility',
          title:'Пауза и избыточная ответственность',
          description:'В одних обстоятельствах может включаться стратегия замирания, а в других — усиленная ответственность за происходящее вокруг. Стоит проверить, не сменяют ли эти реакции друг друга.',
          modules:[MODULES.adaptations,MODULES.responsibility],
          evidence,
          reflectionQuestion:'Бывает ли, что сначала Вы замираете или откладываете действие, а затем пытаетесь взять на себя слишком многое?'
        });
      }

      if(completed(adaptationModule) && completed(research.selfWorth) && adaptationCode === 'C'){
        const selfWorth = resultOf(research.selfWorth) || {};
        const swScores = selfWorth.scores || {};
        add(patterns,{
          id:'adaptation_selfworth',
          title:'Подстройка и право занимать место',
          description:'В исследовании детских адаптаций отмечен вариант C — сокрытие и подстройка. Рядом находятся ответы о праве проявляться, отказывать и опираться на себя. Сама по себе эта пара не доказывает причинной связи: важно проверить, встречается ли она в Вашем опыте.',
          modules:[MODULES.adaptations,MODULES.selfWorth],
          evidence:[
            {module:MODULES.adaptations,detail:'В результате указан вариант C — сокрытие и подстройка.'},
            {module:MODULES.selfWorth,detail:'Сохранены результаты по измерениям: '+Object.keys(swScores).join(', ')+'.'}
          ],
          reflectionQuestion:'В каких ситуациях Вы замечаете, что скрываете собственное мнение или желание, чтобы сохранить принятие и спокойствие?'
        });
      }

      const crookedModule = research.crookedWorld;
      const crooked = resultOf(crookedModule) || {};
      const crookedScores = crooked.scores || {};
      const labyrinthModule = research.labyrinth;
      const labyrinth = resultOf(labyrinthModule) || {};
      const rawLabyrinth = labyrinthModule && labyrinthModule.rawAnswers || {};
      const obstacleIds = rawLabyrinth.multi && rawLabyrinth.multi.obstacles_mapping || [];
      const selectedObstacleIds = Array.isArray(obstacleIds) ? obstacleIds : [];
      if(completed(crookedModule) && completed(labyrinthModule) &&
        (Number(crookedScores.security) >= 8 || Number(crookedScores.trust) >= 8) && selectedObstacleIds.length){
        const selectedNames = {
          obs_1:'нехватка времени или ресурса',
          obs_2:'страх осуждения или отвержения',
          obs_3:'сомнения в компетентности',
          obs_4:'отсутствие ясного плана',
          obs_5:'финансовые или внешние ограничения',
          obs_6:'откладывание важных шагов'
        };
        const selected = selectedObstacleIds.map(id=>selectedNames[id]).filter(Boolean);
        add(patterns,{
          id:'safety_obstacles',
          title:'Фильтр безопасности и препятствия',
          description:'В ответах о восприятии мира заметны высокие значения по шкале безопасности и/или доверия. В Лабиринте желаний одновременно отмечены препятствия на пути к цели. Это повод исследовать, связаны ли осторожность и конкретные барьеры в Ваших обстоятельствах.',
          modules:[MODULES.crookedWorld,MODULES.labyrinth],
          evidence:[
            {module:MODULES.crookedWorld,detail:'Безопасность: '+(crookedScores.security ?? 'нет значения')+'; доверие: '+(crookedScores.trust ?? 'нет значения')+'.'},
            {module:MODULES.labyrinth,detail:'Выбранные препятствия: '+(selected.length?selected.join('; '):'сохранены ответы, требующие уточнения')+'.'}
          ],
          reflectionQuestion:'Какие из выбранных препятствий связаны с реальными внешними условиями, а какие — с ожиданием опасности или негативной реакции?'
        });
      }

      const cognitionModule = research.cognitive;
      const criticalModule = research.criticalThinking;
      const cognition = resultOf(cognitionModule) || {};
      const critical = resultOf(criticalModule) || {};
      if(completed(cognitionModule) && completed(criticalModule) && cognition.scores && critical.scores){
        add(patterns,{
          id:'information_style',
          title:'Стиль обработки информации',
          description:'Сопоставлены предпочтения восприятия и принятия решений с ответами о проверке фактов, источников и предположений. Это не рейтинг критического мышления, а карта двух разных сторон работы с информацией.',
          modules:[MODULES.cognitive,MODULES.criticalThinking],
          evidence:[
            {module:MODULES.cognitive,detail:'Сохранены результаты по четырем осям когнитивных предпочтений.'},
            {module:MODULES.criticalThinking,detail:'Сохранены результаты по шести измерениям критического мышления.'}
          ],
          reflectionQuestion:'Как Ваш привычный способ воспринимать информацию влияет на то, какие аргументы Вы замечаете и каким источникам доверяете?'
        });
      }

      return patterns;
    }

    static moduleStatus(profile){
      const research = profile && profile.research || {};
      return Object.entries(MODULES).map(([key,label])=>({
        key,label,
        status: completed(research[key]) ? 'completed' : (research[key] && research[key].status === 'in_progress' ? 'in_progress' : 'pending')
      }));
    }
  }

  global.FractalAnalyzer = FractalAnalyzer;
})(window);
