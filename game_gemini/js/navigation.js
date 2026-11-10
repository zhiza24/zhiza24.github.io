/* Единая навигация игры «Архитектура Личности». */
(function () {
  'use strict';

  const LINKS = [
    { label: 'Карта мира', href: 'world_map.html', page: 'world_map.html' },
    { label: 'Паспорт', href: 'index.html', page: 'index.html' },
    { label: 'Колесо сфер', href: 'research.html#wheel-panel', page: 'research.html', hash: '#wheel-panel' },
    { label: 'Исследования', href: 'research.html#research-modules', page: 'research.html', hash: '#research-modules' },
    { label: 'Фрактальная карта', href: 'fractal_map.html', page: 'fractal_map.html' },
    { label: 'Персональный маршрут', href: 'personal_route.html', page: 'personal_route.html' },
    { label: 'Трекер', href: 'tracker.html', page: 'tracker.html' }
  ];

  function addStyles() {
    if (document.getElementById('alchemist-global-nav-style')) return;
    const style = document.createElement('style');
    style.id = 'alchemist-global-nav-style';
    style.textContent = `
      #alchemist-global-nav {
        position: sticky; top: 0; z-index: 1000; width: 100%;
        box-sizing: border-box; display: flex; align-items: center;
        justify-content: space-between; gap: 18px; padding: 11px 20px;
        background: rgba(250,246,237,.97); border-bottom: 1px solid #e5e0d8;
        box-shadow: 0 2px 8px rgba(0,0,0,.035); backdrop-filter: blur(10px);
        font: inherit; font-size: 13px;
      }
      #alchemist-global-nav .alchemist-nav-brand {
        flex: 0 0 auto; color: #2c221e; font-size: 11px; font-weight: 700;
        letter-spacing: .07em; text-transform: uppercase; white-space: nowrap;
      }
      #alchemist-global-nav .alchemist-nav-links {
        display: flex; align-items: center; justify-content: flex-end;
        gap: 7px 15px; min-width: 0; flex-wrap: wrap;
      }
      #alchemist-global-nav a {
        color: #6d625b; text-decoration: none; white-space: nowrap;
        transition: color .2s ease;
      }
      #alchemist-global-nav a:hover,
      #alchemist-global-nav a[aria-current="page"] { color: #a8874d; }
      #alchemist-global-nav a[aria-current="page"] { font-weight: 700; }
      @media (max-width: 760px) {
        #alchemist-global-nav { align-items: flex-start; flex-direction: column; gap: 8px; padding: 10px 14px; }
        #alchemist-global-nav .alchemist-nav-links {
          width: 100%; flex-wrap: nowrap; justify-content: flex-start;
          overflow-x: auto; overflow-y: hidden; padding-bottom: 3px;
          scrollbar-width: thin;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function init() {
    if (document.getElementById('alchemist-global-nav')) return;
    addStyles();

    const nav = document.createElement('nav');
    nav.id = 'alchemist-global-nav';
    nav.setAttribute('aria-label', 'Навигация по игре');

    const brand = document.createElement('div');
    brand.className = 'alchemist-nav-brand';
    brand.textContent = 'Архитектура Личности';

    const links = document.createElement('div');
    links.className = 'alchemist-nav-links';

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash;

    LINKS.forEach(function (item) {
      const link = document.createElement('a');
      link.href = item.href;
      link.textContent = item.label;
      const isCurrent = currentPage === item.page &&
        (item.hash ? currentHash === item.hash : !currentHash);
      if (isCurrent) link.setAttribute('aria-current', 'page');
      links.appendChild(link);
    });

    nav.append(brand, links);
    document.body.insertBefore(nav, document.body.firstChild);

    if (currentPage === 'research.html' && currentHash === '#wheel-panel') {
      const wheelTab = document.querySelector('[data-tab="wheel"]');
      if (wheelTab) {
        wheelTab.click();
        const panel = document.getElementById('wheel-panel');
        if (panel) panel.scrollIntoView({ block: 'start' });
      }
    } else if (currentPage === 'research.html' && currentHash === '#research-modules') {
      const target = document.getElementById('research-modules');
      if (target) target.scrollIntoView({ block: 'start' });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
