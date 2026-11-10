(function (global) {
  'use strict';
  function initBirthScreen() {
    const api = global.AlchemistProfile;
    const form = document.getElementById('birth-form');
    if (!api || !form) return;
    const nameInput = document.getElementById('hero-name');
    const dateInput = document.getElementById('hero-birthdate');
    const error = document.getElementById('form-error');
    const birthScreen = document.getElementById('birth-screen');
    const bornScreen = document.getElementById('born-screen');
    const nextScreen = document.getElementById('next-screen');
    const summary = document.getElementById('profile-summary');
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0,10);
    dateInput.max = localToday;

    function show(screen) {
      [birthScreen, bornScreen, nextScreen].forEach(el => el.classList.add('hidden'));
      screen.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    function formatDate(value) {
      const parts = String(value || '').split('-');
      return parts.length === 3 ? parts.reverse().join('.') : value;
    }
    function renderProfile(profile) {
      const meta = profile.meta;
      document.getElementById('born-title').textContent = 'Герой рожден';
      summary.replaceChildren();
      const rows = [['Имя', meta.name], ['Дата рождения', formatDate(meta.birthdate)], ['Образ', meta.gender === 'female' ? 'Путница' : 'Путник']];
      rows.forEach(([label, value]) => {
        const row = document.createElement('div'); row.className = 'profile-row';
        const left = document.createElement('span'); const right = document.createElement('strong');
        left.textContent = label; right.textContent = value;
        row.append(left, right); summary.appendChild(row);
      });
    }
    function restoreForm(profile) {
      if (!profile) return;
      nameInput.value = profile.meta.name || '';
      dateInput.value = profile.meta.birthdate || '';
      const radio = form.querySelector('input[name="gender"][value="' + (profile.meta.gender || 'female') + '"]');
      if (radio) radio.checked = true;
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const name = nameInput.value.trim();
      const birthdate = dateInput.value;
      const gender = form.querySelector('input[name="gender"]:checked').value;
      if (!name || !birthdate) {
        error.textContent = 'Заполните имя и дату рождения, чтобы продолжить.';
        error.classList.add('show'); return;
      }
      if (birthdate > localToday) {
        error.textContent = 'Дата рождения не может быть в будущем.';
        error.classList.add('show'); return;
      }
      try {
        const profile = api.update(p => {
          const createdAt = p.meta.createdAt || new Date().toISOString();
          p.meta = { ...p.meta, name, birthdate, gender, createdAt };
          p.pathway.currentStage = 'birth';
          p.history.push({ type: 'birth_profile_saved', at: new Date().toISOString() });
        });
        error.classList.remove('show'); renderProfile(profile); show(bornScreen);
      } catch (e) {
        error.textContent = e.message || 'Не удалось сохранить данные.';
        error.classList.add('show');
      }
    });
    document.getElementById('edit-button').addEventListener('click', () => {
      restoreForm(api.load()); show(birthScreen);
    });
    document.getElementById('continue-button').addEventListener('click', () => { window.location.href = 'world_map.html'; });
    document.getElementById('back-to-hero').addEventListener('click', () => {
      const profile = api.load();
      if (api.hasBirth(profile)) { renderProfile(profile); show(bornScreen); }
      else show(birthScreen);
    });
    const profile = api.load();
    if (api.hasBirth(profile)) { renderProfile(profile); restoreForm(profile); show(bornScreen); }
  }
  global.initBirthScreen = initBirthScreen;
})(window);
