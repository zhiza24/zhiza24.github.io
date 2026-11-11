/* Shared instruction-scroll template.
   Connect scroll.css + scroll.js, then call:
     Scroll.show({
       id: 'choose',                 // storage flag: alch_v5_scroll_<id>
       title: 'Как выбрать карту',
       html: '<p>Текст инструкции.</p>',
       onClose: function () {}       // after the roll-up animation
     });
   To avoid a flash of hidden task content for a returning player, put this in <head>:
     <script>try{if(localStorage.getItem('alch_v5_scroll_ID'))document.documentElement.classList.add('gsc-seen')}catch(e){}</script>
*/
(function () {
  'use strict';
  var KEY_PREFIX = 'alch_v5_scroll_';
  var root, ov, bodyEl, titleEl, icon, closeBtn, xBtn, auBtn, hideT, autoT, au;
  var state = { id: '', onClose: null, closing: false, open: false, seen: false };

  function assetBase() {
    var s = document.querySelector('script[src*="scroll.js"]');
    if (!s || !s.src) return '';
    return s.src.replace(/[^/]+(?:\?.*)?$/, '');
  }
  function key(id) { return KEY_PREFIX + id; }
  function isSeen(id) {
    try { return !!localStorage.getItem(key(id)); } catch (e) { return false; }
  }
  function markSeen(id) {
    try { localStorage.setItem(key(id), String(Date.now())); } catch (e) {}
    state.seen = true;
    document.documentElement.classList.add('gsc-seen');
  }
  function ensureDom() {
    if (root) return;
    var base = assetBase();
    root = document.createElement('div');
    root.id = 'gsc-root';
    root.innerHTML =
      '<button class="gsc-icon" id="gsc-icon" type="button" aria-label="Открыть инструкцию" hidden>' +
        '<img src="' + base + 'img/scroll_closed.png?v=h8" alt="">' +
      '</button>' +
      '<div class="gsc-ov" id="gsc-ov" role="dialog" aria-modal="true" aria-labelledby="gsc-title">' +
        '<div class="gsc-spp">' +
          '<div class="gsc-clip"><div class="gsc-inner"><div class="gsc-art" aria-hidden="true">' +
            '<img class="gsc-top" src="' + base + 'img/scroll_open_top_f.png?v=h10" decoding="sync" alt="">' +
            '<div class="gsc-mid"></div>' +
          '</div></div></div>' +
          '<div class="gsc-foot">' +
            '<img class="gsc-bot" src="' + base + 'img/scroll_open_bot_f.png?v=h10" decoding="sync" alt="" aria-hidden="true">' +
            '<button class="gsc-close" id="gsc-close" type="button">Закрыть</button>' +
          '</div>' +
          '<button class="gsc-x" id="gsc-x" type="button" aria-label="Свернуть">×</button>' +
          '<button class="gsc-au" id="gsc-au" type="button" aria-label="Слушать">♪</button>' +
          '<div class="gsc-body" id="gsc-body"><h3 id="gsc-title"></h3><div class="gsc-html"></div></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);
    ov = document.getElementById('gsc-ov');
    bodyEl = ov.querySelector('.gsc-html');
    titleEl = document.getElementById('gsc-title');
    icon = document.getElementById('gsc-icon');
    closeBtn = document.getElementById('gsc-close');
    xBtn = document.getElementById('gsc-x');
    auBtn = document.getElementById('gsc-au');
    icon.addEventListener('click', function (e) { e.preventDefault(); open(); });
    closeBtn.addEventListener('click', function (e) { e.preventDefault(); close(); });
    xBtn.addEventListener('click', function (e) { e.preventDefault(); close(); });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.open) close();
    });
    auBtn.addEventListener('click', function () {
      if (!au) return;
      if (au.paused) { au.play(); auBtn.classList.add('on'); }
      else { au.pause(); auBtn.classList.remove('on'); }
    });
  }
  function setAudio(src) {
    if (au) { au.pause(); au = null; }
    auBtn.classList.remove('on');
    auBtn.style.display = 'none';
    if (!src) return;
    au = new Audio(src);
    au.onended = function () { auBtn.classList.remove('on'); };
    auBtn.style.display = 'block';
  }
  function open() {
    if (!ov || state.open || state.closing) return;
    clearTimeout(hideT);
    clearTimeout(autoT);
    ov.classList.remove('gone', 'closing');
    document.body.classList.add('gsc-open');
    ov.classList.add('ready');
    state.open = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { ov.classList.add('on'); });
    });
    setTimeout(function () { try { closeBtn.focus(); } catch (e) {} }, 500);
  }
  function finishClose(cb) {
    state.closing = false;
    state.open = false;
    ov.classList.remove('ready', 'on', 'closing', 'gone');
    document.body.classList.remove('gsc-open', 'gsc-first');
    icon.hidden = false;
    if (cb) cb();
  }
  function close() {
    if (!ov || state.closing || !ov.classList.contains('ready')) return;
    state.closing = true;
    if (!state.seen) markSeen(state.id);
    if (au) { au.pause(); auBtn.classList.remove('on'); }
    clearTimeout(hideT);
    ov.classList.add('closing');
    ov.classList.remove('on');
    var reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    var roll = reduce ? 0 : 620;
    var fade = reduce ? 0 : 560;
    var cb = state.onClose;
    hideT = setTimeout(function () {
      ov.classList.add('gone');
      setTimeout(function () { finishClose(cb); }, fade);
    }, roll);
  }
  function show(opts) {
    opts = opts || {};
    if (!opts.id) return;
    ensureDom();
    state.id = String(opts.id);
    state.onClose = typeof opts.onClose === 'function' ? opts.onClose : null;
    state.closing = false;
    state.open = false;
    state.seen = isSeen(state.id);
    titleEl.textContent = opts.title || '';
    closeBtn.textContent = opts.closeLabel || 'Закрыть';
    bodyEl.innerHTML = opts.html || '';
    setAudio(opts.audio || '');
    var every = !!opts.everyTime;
    var delay = opts.delay != null ? +opts.delay : 900;
    if (opts.fast) document.body.classList.add('gsc-fast');
    else document.body.classList.remove('gsc-fast');
    if (state.seen && !every) {
      icon.hidden = false;
      document.documentElement.classList.add('gsc-seen');
      document.body.classList.remove('gsc-first');
      return;
    }
    icon.hidden = true;
    document.body.classList.add('gsc-first');
    autoT = setTimeout(open, isNaN(delay) ? 900 : delay);
  }

  window.Scroll = {
    show: show,
    open: open,
    close: close,
    seen: isSeen,
    prefetch: function (id) {
      if (isSeen(id)) document.documentElement.classList.add('gsc-seen');
    }
  };
})();
