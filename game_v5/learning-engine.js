/* Автономный движок игровых мини-обучений «Открытия».
   Хранит только учебный прогресс в отдельном поле alch_v5_profile.learning. */
(function (g) {
  'use strict';
  if (g.GLearning) return;
  var KEY = 'alch_v5_profile';
  var activeModal = null;

  function data() {
    return g.GLEARNING_DATA || [];
  }

  function read() {
    try {
      var P = JSON.parse(localStorage.getItem(KEY) || '{}');
      return P && typeof P === 'object' && !Array.isArray(P) ? P : {};
    } catch (e) {
      return {};
    }
  }

  function write(P) {
    try {
      localStorage.setItem(KEY, JSON.stringify(P));
      return true;
    } catch (e) {
      return false;
    }
  }

  function obj(v) {
    return v && typeof v === 'object' && !Array.isArray(v) ? v : {};
  }

  function state() {
    var P = read();
    var L = obj(P.learning);
    L.version = L.version || 1;
    L.completed = obj(L.completed);
    L.attempts = obj(L.attempts);
    L.cards = obj(L.cards);
    L.artifacts = obj(L.artifacts);
    L.dismissed = obj(L.dismissed);
    if (L.lastOpened === undefined) L.lastOpened = null;
    P.learning = L;
    return { P: P, L: L };
  }

  function isFemale(P) {
    try {
      if (g.GGender) return g.GGender(P) === 'f';
    } catch (e) {}
    var v = String((P && P.gender) || '').toLowerCase();
    return v === 'f' || v === 'ж' || v === 'female' || v === 'жен' || v === 'женский' || v === 'woman';
  }

  function gx(s, P) {
    var f = isFemale(P);
    return String(s == null ? '' : s).replace(/\{([^{}|]*)\|([^{}|]*)\}/g, function (_, m, w) {
      return f ? w : m;
    });
  }

  function lesson(id) {
    return data().find(function (x) { return x.id === id; }) || null;
  }

  function getProgress() {
    var s = state();
    return {
      completed: Object.keys(s.L.completed),
      artifacts: s.L.artifacts,
      attempts: s.L.attempts,
      cards: s.L.cards,
      dismissed: s.L.dismissed,
      lastOpened: s.L.lastOpened
    };
  }

  function start(id) {
    if (!lesson(id)) return false;
    var s = state();
    s.L.lastOpened = id;
    return write(s.P);
  }

  function answer(id, index, choice) {
    var x = lesson(id);
    var q = x && x.questions && x.questions[index];
    if (!q || !Number.isInteger(choice) || choice < 0 || choice >= q.options.length) return null;
    var s = state();
    var a = obj(s.L.attempts[id]);
    s.L.attempts[id] = a;
    var qKey = q.id || String(index);
    a[qKey] = (a[qKey] || 0) + 1;
    write(s.P);
    return {
      correct: choice === q.correct,
      explanation: gx(q.why, s.P),
      chosen: gx(q.options[choice], s.P),
      correctAnswer: gx(q.options[q.correct], s.P),
      attempt: a[qKey]
    };
  }

  function rateCard(id, cardIndex, known) {
    var x = lesson(id);
    if (!x || !x.cards || !x.cards[cardIndex]) return false;
    var s = state();
    var c = obj(s.L.cards[id]);
    s.L.cards[id] = c;
    c[cardIndex] = !!known;
    return write(s.P);
  }

  function savePractice(id, index, value) {
    var x = lesson(id);
    if (!x || !x.practice || !x.practice.fields[index]) return false;
    var s = state();
    var p = obj(s.L.practice);
    s.L.practice = p;
    p[id] = obj(p[id]);
    p[id][index] = String(value || '').slice(0, 4000);
    return write(s.P);
  }

  function getPractice(id) {
    var s = state();
    return (s.L.practice && obj(s.L.practice[id])) || {};
  }

  function complete(id) {
    var x = lesson(id);
    if (!x) return false;
    var s = state();
    if (!s.L.completed[id]) s.L.completed[id] = { at: Date.now() };
    s.L.artifacts[x.artifact] = true;
    s.L.lastOpened = id;
    return write(s.P);
  }

  function dismiss(id) {
    if (!lesson(id)) return false;
    var s = state();
    if (!s.L.dismissed[id]) s.L.dismissed[id] = Date.now();
    return write(s.P);
  }

  function isComplete(id) {
    return !!state().L.completed[id];
  }

  function isDismissed(id) {
    return !!state().L.dismissed[id];
  }

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>'"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderBlueprint(b, P) {
    return '<div class="lo-flow">' + b.nodes.map(function (n, i) {
      return '<div class="lo-node">' + esc(gx(n, P)) + '</div>' + (i < b.nodes.length - 1 ? '<div class="lo-arrow" aria-hidden="true">↓</div>' : '');
    }).join('') + '</div><p class="lo-note">' + esc(gx(b.description, P)) + '</p>';
  }

  function render(root, id, opts) {
    var x = lesson(id);
    if (!root || !x) return;
    opts = opts || {};
    start(id);
    var s = state();
    var P = s.P;
    var cardState = obj(s.L.cards[id]);
    var t = function (v) { return gx(v, P); };
    var topAction = opts.modal
      ? '<button type="button" class="lo-close" data-lo-close aria-label="Закрыть">Позже ✕</button>'
      : '<a class="lo-back" href="learning.html">← Все открытия</a>';

    var html = '<header class="lo-head">' + topAction +
      '<span class="lo-kicker">ПУТЬ АЛХИМИКА · ОТКРЫТИЕ</span>' +
      '<h1>' + esc(t(x.title)) + '</h1>' +
      '<p>' + esc(t(x.subtitle)) + '</p>' +
      '<span class="lo-time">◷ ' + x.minutes + ' мин</span></header>' +
      '<main class="lo-main">' +
      '<section class="lo-panel"><div class="lo-label">ВХОД В ТЕМУ</div><p class="lo-intro">' + esc(t(x.intro)) + '</p></section>';

    if (x.cheat) {
      html += '<section class="lo-panel"><div class="lo-label">ШПАРГАЛКА</div><h2>Главное</h2><ul class="lo-list">' +
        x.cheat.map(function (item) { return '<li>' + esc(t(item)) + '</li>'; }).join('') +
        '</ul></section>';
    }
    if (x.blueprint) {
      html += '<section class="lo-panel"><div class="lo-label">РАЗБОР</div><h2>' + esc(t(x.blueprint.title)) + '</h2>' + renderBlueprint(x.blueprint, P) + '</section>';
    }
    if (x.cards && x.cards.length) {
      html += '<section class="lo-panel"><div class="lo-label">КАРТОЧКИ</div><h2>Проверь, что запомнилось</h2><div class="lo-cards">' +
        x.cards.map(function (c, i) {
          var k = cardState[i];
          return '<details class="lo-card"><summary>' + esc(t(c[0])) + '</summary><p>' + esc(t(c[1])) + '</p>' +
            '<div class="lo-card-actions">' +
            '<button type="button" class="' + (k === true ? 'is-on' : '') + '" data-card="' + i + '" data-known="1">Знаю</button>' +
            '<button type="button" class="' + (k === false ? 'is-on' : '') + '" data-card="' + i + '" data-known="0">Повторить</button>' +
            '<span>' + (k === true ? '✓ Знаю' : k === false ? '↻ Повторить' : '') + '</span></div></details>';
        }).join('') + '</div></section>';
    }
    if (x.questions && x.questions.length) {
      html += '<section class="lo-panel"><div class="lo-label">ПРОВЕРКА ПОНИМАНИЯ</div><h2>Попробуй применить принцип</h2>' +
        x.questions.map(function (q, i) {
          return '<fieldset class="lo-question" data-question="' + i + '"><legend>' + (i + 1) + '. ' + esc(t(q.q)) + '</legend>' +
            q.options.map(function (o, j) {
              return '<label><input type="radio" name="lo-q-' + esc(id) + '-' + i + '" value="' + j + '"><span>' + esc(t(o)) + '</span></label>';
            }).join('') +
            '<button type="button" class="lo-check" data-check="' + i + '">Проверить</button><div class="lo-feedback" aria-live="polite"></div></fieldset>';
        }).join('') + '</section>';
    }
    if (x.practice) {
      var savedPractice = getPractice(id);
      html += '<section class="lo-panel"><div class="lo-label">ПРИМЕНЕНИЕ К СЕБЕ · ПО ЖЕЛАНИЮ</div><h2>' + esc(t(x.practice.title)) + '</h2>' +
        '<p class="lo-note">' + esc(t(x.practice.hint)) + '</p><div class="lo-fields">' +
        x.practice.fields.map(function (f, i) {
          return '<label>' + esc(t(f)) + '<textarea rows="2" data-practice="' + i + '" placeholder="Можно оставить пустым">' + esc(savedPractice[i] || '') + '</textarea></label>';
        }).join('') + '</div><p class="lo-private">Твои записи остаются на этом устройстве и не отправляются наружу.</p></section>';
    }

    var done = isComplete(id);
    var ctaText = opts.modal ? (done ? 'Дальше' : 'Завершить открытие') : (done ? 'Открытие пройдено' : 'Завершить открытие');
    var footLink = opts.modal ? '' : '<a class="lo-library" href="learning.html">Все открытия и прогресс</a>';
    html += '<section class="lo-finish"><div class="lo-label">ТВОЕ ОТКРЫТИЕ</div><h2>«' + esc(t(x.artifact)) + '»</h2>' +
      '<p>Это отметка о пройденном материале, а не оценка тебя или проверка личного качества.</p>' +
      '<button type="button" id="lo-complete" class="lo-primary">' + ctaText + '</button>' + footLink + '</section></main>';

    root.innerHTML = html;

    root.querySelectorAll('[data-practice]').forEach(function (ta) {
      ta.addEventListener('input', function () {
        savePractice(id, +ta.dataset.practice, ta.value);
      });
    });

    root.querySelectorAll('[data-card]').forEach(function (b) {
      b.addEventListener('click', function () {
        var known = b.dataset.known === '1';
        rateCard(id, +b.dataset.card, known);
        var d = b.closest('details');
        d.querySelectorAll('[data-card]').forEach(function (btn) { btn.classList.remove('is-on'); });
        b.classList.add('is-on');
        d.querySelector('.lo-card-actions span').textContent = known ? '✓ Знаю' : '↻ Повторить';
      });
    });

    root.querySelectorAll('[data-check]').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.dataset.check;
        var field = root.querySelector('[data-question="' + i + '"]');
        var sel = field.querySelector('input:checked');
        var out = field.querySelector('.lo-feedback');
        if (!sel) {
          out.className = 'lo-feedback';
          out.textContent = 'Выбери вариант, чтобы проверить понимание.';
          return;
        }
        var r = answer(id, i, +sel.value);
        out.className = 'lo-feedback ' + (r.correct ? 'is-correct' : '');
        out.textContent = (r.correct ? 'Верно. ' : 'Разберем. ') + r.explanation;
      });
    });

    var closeBtn = root.querySelector('[data-lo-close]');
    if (closeBtn && opts.onClose) {
      closeBtn.addEventListener('click', function () {
        if (!isComplete(id)) dismiss(id);
        opts.onClose();
      });
    }

    var completeBtn = root.querySelector('#lo-complete');
    if (completeBtn) {
      completeBtn.addEventListener('click', function () {
        if (!complete(id)) {
          root.querySelector('.lo-finish p').textContent = 'Не удалось сохранить отметку. Проверь свободное место на устройстве и попробуй еще раз.';
          return;
        }
        if (opts.modal && opts.onClose) {
          opts.onClose();
          return;
        }
        this.textContent = 'Открытие пройдено';
        this.disabled = true;
      });
    }
  }

  function closeModal() {
    if (!activeModal) return;
    var el = activeModal;
    activeModal = null;
    el.remove();
  }

  function openModal(id, opts) {
    if (!lesson(id)) return false;
    closeModal();
    document.querySelectorAll('.lo-modal').forEach(function (el) { el.remove(); });
    opts = opts || {};
    var wrap = document.createElement('div');
    wrap.className = 'lo-modal';
    wrap.setAttribute('role', 'dialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML = '<div class="lo-backdrop"></div><div class="lo-sheet"><div class="lo-wrap"></div></div>';
    document.body.appendChild(wrap);
    activeModal = wrap;

    var doneClose = function () {
      closeModal();
      if (opts.onClose) opts.onClose();
    };
    wrap.querySelector('.lo-backdrop').addEventListener('click', function () {
      if (!isComplete(id)) dismiss(id);
      doneClose();
    });
    var onKey = function (e) {
      if (e.key === 'Escape' && activeModal === wrap) {
        document.removeEventListener('keydown', onKey);
        if (!isComplete(id)) dismiss(id);
        doneClose();
      }
    };
    document.addEventListener('keydown', onKey);

    render(wrap.querySelector('.lo-wrap'), id, {
      modal: true,
      onClose: function () {
        document.removeEventListener('keydown', onKey);
        doneClose();
      }
    });
    return true;
  }

  function currentPageKey() {
    var f = location.pathname.split('/').pop() || 'index.html';
    var q = new URLSearchParams(location.search);
    if (f === 'slot.html') return 'slot.html?id=' + (q.get('id') || '');
    if (f === 'scene.html') return 'scene.html?k=' + (q.get('k') || '');
    return f;
  }

  function hookRoute() {
    var f = location.pathname.split('/').pop() || 'index.html';
    if (f === 'learning.html') return;
    var q = new URLSearchParams(location.search);
    if (g.GReview || g.GRetake || q.get('review') === '1' || q.get('preview') === '1' || q.get('retake') === '1') return;

    var p = currentPageKey();
    var P = state().P;
    var fl = P.flow || {};
    var done = fl.completed || {};
    var skipped = fl.archSkipped || {};
    var id = null;

    if (p === 'slot.html?id=arch_b' && done['betray.html'] && !skipped['betray.html']) id = 'inner-rules';
    else if (p === 'swipe.html' && done['slot.html?id=im'] && !skipped['slot.html?id=im']) id = 'fact-interpretation';
    else if (p === 'slot.html?id=pi' && done['wish.html'] && !skipped['wish.html']) id = 'desire-intention';
    else if (p === 'reactor.html') id = 'observe-without-judgment';
    else if (p === 'slot.html?id=compare') id = 'see-change';

    if (!id || isComplete(id) || isDismissed(id)) return;
    setTimeout(function () {
      if (!activeModal) openModal(id);
    }, 650);
  }

  g.GLearning = {
    data: data(),
    getLesson: lesson,
    getProgress: getProgress,
    start: start,
    submitAnswer: answer,
    rateFlashcard: rateCard,
    savePractice: savePractice,
    getPractice: getPractice,
    complete: complete,
    dismiss: dismiss,
    isComplete: isComplete,
    isDismissed: isDismissed,
    render: render,
    openModal: openModal,
    closeModal: closeModal,
    hookRoute: hookRoute
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hookRoute, { once: true });
  else hookRoute();
})(window);
