(function(){
  'use strict';

  var TABS = [
    {id:'shtab',  label:'Штаб',  full:'Штаб фонда', icon:'<path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-6h6v6"/>'},
    {id:'sbory',  label:'Сборы',       icon:'<path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9Z"/>'},
    {id:'istorii',label:'Истории',     icon:'<path d="M5 4h9l5 5v11H5z"/><path d="M14 4v5h5"/><path d="M9 13h6M9 16h4"/>'},
    {id:'karta',  label:'Карта',       icon:'<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'},
    {id:'miska',  label:'Миска', full:'Вторая миска',       icon:'<path d="M4 12h16"/><path d="M6 12c0 4 2.7 7 6 7s6-3 6-7"/><path d="M9 8c0-2 1.3-3 3-3s3 1 3 3"/>'},
    {id:'chipy',  label:'Чипы',        icon:'<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3"/>'}
  ];

  var panels = {};
  TABS.forEach(function(t){ panels[t.id] = document.getElementById('tab-'+t.id); });

  /* ---- build nav (desktop) and tabbar (mobile) ---- */
  var deskNav = document.getElementById('desktoptabs');
  var tabbar  = document.getElementById('tabbar');

  TABS.forEach(function(t){
    if(deskNav){
      var b = document.createElement('button');
      b.type='button'; b.setAttribute('role','tab'); b.id='t-'+t.id;
      b.setAttribute('aria-controls','tab-'+t.id); b.setAttribute('aria-selected','false');
      b.textContent = t.label;
      b.title = t.full || t.label;
      deskNav.appendChild(b);
    }
    if(tabbar){
      var m = document.createElement('button');
      m.type='button'; m.setAttribute('role','tab'); m.id='m-'+t.id;
      m.setAttribute('aria-controls','tab-'+t.id); m.setAttribute('aria-selected','false');
      m.setAttribute('aria-label', t.full || t.label);
      m.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+t.icon+'</svg><span>'+t.label+'</span>';
      tabbar.appendChild(m);
    }
  });

  var allBtns = function(){ return document.querySelectorAll('[role="tab"]'); };

  function activate(id, opts){
    opts = opts || {};
    if(!panels[id]) id = 'shtab';
    Object.keys(panels).forEach(function(k){
      if(!panels[k]) return;
      var on = k===id;
      panels[k].classList.toggle('is-active', on);
      if(on){ panels[k].setAttribute('aria-hidden','false'); } else { panels[k].setAttribute('aria-hidden','true'); }
    });
    allBtns().forEach(function(b){
      var on = b.getAttribute('aria-controls') === 'tab-'+id;
      b.setAttribute('aria-selected', on ? 'true':'false');
      b.setAttribute('tabindex', on ? '0':'-1');
    });
    if(opts.push !== false){
      try{ history.replaceState(null,'','#'+id); }catch(e){}
    }
    if(opts.scroll !== false){
      window.scrollTo(0,0);
    }
  }

  document.addEventListener('click', function(e){
    var btn = e.target.closest && e.target.closest('[role="tab"]');
    if(btn){
      var id = btn.getAttribute('aria-controls').replace('tab-','');
      activate(id);
      return;
    }
    var goto = e.target.closest && e.target.closest('[data-goto]');
    if(goto){
      e.preventDefault();
      var target = goto.getAttribute('data-goto');
      if(panels[target]){
        activate(target);
      } else {
        var el = document.getElementById(target);
        if(el){
          var pnl = el.closest('.panel');
          activate(pnl ? pnl.id.replace('tab-','') : 'shtab', {scroll:false, push:false});
          try{ history.replaceState(null,'','#'+target); }catch(err){}
          setTimeout(function(){ el.scrollIntoView({behavior:'smooth', block:'start'}); }, 60);
        }
      }
      return;
    }
  });

  /* keyboard: arrow keys between tabs */
  document.addEventListener('keydown', function(e){
    if(e.key!=='ArrowRight' && e.key!=='ArrowLeft') return;
    var active = document.querySelector('[role="tab"][aria-selected="true"]');
    if(!active || !document.activeElement || !document.activeElement.matches('[role="tab"]')) return;
    var list = Array.prototype.slice.call(allBtns()).filter(function(b){ return b.offsetParent!==null; });
    var i = list.indexOf(active);
    if(i<0) return;
    var next = list[(i + (e.key==='ArrowRight'?1:-1) + list.length) % list.length];
    next.focus(); next.click();
  });

  /* ---- amount chips ---- */
  function fmt(n){ return n.toLocaleString('ru-RU').replace(/\u00A0/g,' ') + ' ₽'; }

  document.addEventListener('click', function(e){
    var chip = e.target.closest && e.target.closest('.amounts .chip');
    if(!chip) return;
    var group = chip.parentNode;
    group.querySelectorAll('.chip').forEach(function(c){ c.setAttribute('aria-pressed','false'); });
    chip.setAttribute('aria-pressed','true');

    var card = chip.closest('.ccard') || chip.closest('.wrap') || document;
    var picked = card.querySelector('[data-picked]');
    var sum = chip.getAttribute('data-sum');
    var val = sum==='custom' ? 1500 : parseInt(sum,10);

    if(picked){
      var monthly = !!(picked.closest && picked.closest('#opeka'));
      if(sum==='custom'){
        picked.textContent = monthly
          ? 'Другая сумма: свой размер опеки — пример 1 500 ₽ в месяц.'
          : 'Другая сумма: введите свою на реальной странице сбора — пример 1 500 ₽.';
      } else {
        picked.textContent = monthly
          ? 'Выбрано: ' + fmt(val) + ' в месяц. На реальной странице откроется оформление опеки.'
          : 'Выбрано: ' + fmt(val) + '. На реальном сборе откроется форма оплаты.';
      }
    }

    var demoSum = card.querySelector('[data-demo-sum]');
    var demoBar = card.querySelector('[data-demo-bar] i');
    if(demoSum) demoSum.textContent = fmt(val);
    if(demoBar){
      var pct = Math.max(4, Math.min(100, Math.round(val/2000*100)));
      demoBar.style.width = pct + '%';
    }
  });

  /* ---- stories filter ---- */
  var storyChips = document.querySelectorAll('.filters .chip');
  var stories = document.querySelectorAll('#storyList .story');
  var storyEmpty = document.getElementById('storyEmpty');

  function filterStories(f){
    var n = 0;
    stories.forEach(function(s){
      var show = (f==='all') || (s.getAttribute('data-status')===f);
      s.hidden = !show;
      if(show) n++;
    });
    if(storyEmpty) storyEmpty.hidden = n>0;
  }
  storyChips.forEach(function(c){
    c.addEventListener('click', function(){
      storyChips.forEach(function(x){ x.classList.remove('is-on'); x.setAttribute('aria-pressed','false'); });
      c.classList.add('is-on'); c.setAttribute('aria-pressed','true');
      filterStories(c.getAttribute('data-filter'));
    });
  });

  /* ---- map ---- */
  var districtChips = document.querySelectorAll('.mapfilters .chip[data-district]');
  var homelessSwitch = document.getElementById('onlyHomeless');
  var pins = document.querySelectorAll('.pin');
  var cards = document.querySelectorAll('.clinic');
  var clinicEmpty = document.getElementById('clinicEmpty');
  var state = {district:'all', homeless:false, selected:null};

  function matches(el){
    var d = el.getAttribute('data-district');
    var h = el.getAttribute('data-homeless')==='1';
    if(state.district!=='all' && d!==state.district) return false;
    if(state.homeless && !h) return false;
    return true;
  }

  function applyMap(){
    var visible = 0;
    cards.forEach(function(c){
      var ok = matches(c);
      c.classList.toggle('is-hidden', !ok);
      if(ok) visible++;
    });
    pins.forEach(function(p){
      var ok = matches(p);
      p.classList.toggle('is-dim', !ok);
      p.setAttribute('tabindex', ok?'0':'-1');
    });
    if(clinicEmpty) clinicEmpty.hidden = visible>0;
    if(state.selected){
      var sel = document.querySelector('.clinic[data-id="'+state.selected+'"]');
      if(sel && sel.classList.contains('is-hidden')){ select(null); }
    }
  }

  function select(id){
    state.selected = id;
    cards.forEach(function(c){ c.classList.toggle('is-sel', c.getAttribute('data-id')===id); });
    pins.forEach(function(p){ p.setAttribute('aria-pressed', p.getAttribute('data-id')===id ? 'true':'false'); });
  }

  function selectAndScroll(id){
    select(id);
    var card = document.querySelector('.clinic[data-id="'+id+'"]');
    if(card && window.innerWidth < 980){
      card.scrollIntoView({behavior:'smooth', block:'center'});
    }
  }

  pins.forEach(function(p){
    p.addEventListener('click', function(){ selectAndScroll(p.getAttribute('data-id')); });
  });
  cards.forEach(function(c){
    c.addEventListener('click', function(){ selectAndScroll(c.getAttribute('data-id')); });
  });
  districtChips.forEach(function(ch){
    ch.addEventListener('click', function(){
      districtChips.forEach(function(x){ x.classList.remove('is-on'); x.setAttribute('aria-pressed','false'); });
      ch.classList.add('is-on'); ch.setAttribute('aria-pressed','true');
      state.district = ch.getAttribute('data-district');
      applyMap();
    });
  });
  if(homelessSwitch){
    homelessSwitch.addEventListener('change', function(){
      state.homeless = homelessSwitch.checked;
      applyMap();
    });
  }

  /* ---- demo range ---- */
  var range = document.getElementById('demoRange');
  if(range){
    var bar = document.getElementById('demoRangeBar');
    var val = document.getElementById('demoRangeVal');
    var upd = function(){
      var v = range.value;
      if(bar) bar.style.width = v+'%';
      if(val) val.textContent = v+'%';
    };
    range.addEventListener('input', upd); upd();
  }

  /* ---- boot ---- */
  var hash = (location.hash||'').replace('#','');
  var valid = TABS.map(function(t){return t.id;});
  // allow deep links to inner anchors
  var jump = null;
  if(hash && valid.indexOf(hash)===-1){
    var el = document.getElementById(hash);
    if(el){
      var p = el.closest('.panel');
      if(p){ hash = p.id.replace('tab-',''); jump = el; }
      else hash = '';
    } else { hash = ''; }
  }
  activate(hash || 'shtab', {push:false, scroll:!jump});
  if(jump){ setTimeout(function(){ jump.scrollIntoView({behavior:'smooth', block:'start'}); },80); }

  window.addEventListener('hashchange', function(){
    var h=(location.hash||'').replace('#','');
    if(valid.indexOf(h)!==-1) activate(h,{push:false});
  });
})();
