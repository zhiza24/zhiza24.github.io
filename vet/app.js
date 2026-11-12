(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const app = $("#app");
  const S = {
    step: "pet", profile: { animal: null, sex: null, sterilized: null, age: null },
    zoneId: null, symptomId: null, answers: {}, needPet: false, needAnswers: false,
    clinic: null, mode: null, slot: null, booked: {}, pendingZone: null,
  };
  const COLORS = {
    watch: { c: "#2F8F5B", s: "#DDF1E5", t: "#1F6B42", label: "Наблюдать" },
    plan: { c: "#4A7BAE", s: "#D6E5F3", t: "#2C5480", label: "Планово" },
    soon: { c: "#C9781A", s: "#FCEBD3", t: "#8A4E0B", label: "Срочно" },
    emergency: { c: "#C2413A", s: "#FADCD8", t: "#8E2A24", label: "Экстренно" },
  };
  const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
  const BACK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';

  const FACE = {
    dog: '<svg viewBox="0 0 64 64" fill="none" stroke="#355F8C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 22c-6-2-11 3-11 11 0 6 3 10 7 10 2 0 3-2 3-5"/><path d="M46 22c6-2 11 3 11 11 0 6-3 10-7 10-2 0-3-2-3-5"/><path d="M18 22c3-6 8-9 14-9s11 3 14 9c2 5 2 12 0 18-2 8-8 12-14 12s-12-4-14-12c-2-6-2-13 0-18z" fill="#D6E5F3"/><circle cx="25" cy="31" r="2" fill="#355F8C" stroke="none"/><circle cx="39" cy="31" r="2" fill="#355F8C" stroke="none"/><path d="M28 40c0-2 8-2 8 0s-2 3-4 3-4-1-4-3z" fill="#355F8C"/><path d="M32 43v3M28 47c2 1.5 6 1.5 8 0"/></svg>',
    cat: '<svg viewBox="0 0 64 64" fill="none" stroke="#355F8C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 30L12 10l13 9c4-1 10-1 14 0l13-9-2 20c2 4 2 9 0 13-3 7-10 11-18 11s-15-4-18-11c-2-4-2-9 0-13z" fill="#D6E5F3"/><path d="M24 32c1.5-1.5 3-1.5 4.5 0M35.5 32c1.5-1.5 3-1.5 4.5 0"/><path d="M30 39h4l-2 2.4z" fill="#355F8C"/><path d="M32 41.5c-1 2.5-4 3-6 2M32 41.5c1 2.5 4 3 6 2"/><path d="M8 37l10 1M8 43l10-2M56 37l-10 1M56 43l-10-2" stroke-width="1.8"/></svg>',
  };

  /* Side-view illustrations, viewBox 520x300 */
  const DOG_SVG = `<svg viewBox="0 0 520 300" role="img" aria-label="Собака, вид сбоку">
  <ellipse cx="270" cy="288" rx="200" ry="9" fill="#E9EEF4"/>
  <g stroke="#355F8C" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <path d="M232 200 C236 230 238 258 236 278 C236 287 252 288 254 279 C258 256 258 226 256 198 Z" fill="#BCD3EA"/>
    <path d="M380 196 C392 222 398 250 394 278 C393 287 409 288 412 279 C418 250 412 218 404 192 Z" fill="#BCD3EA"/>
    <path d="M438 136 C466 122 482 96 480 64 C479 54 467 53 466 62 C466 92 452 112 430 124 Z" fill="#D6E5F3"/>
    <path d="M30 116 C30 102 48 92 72 88 C80 70 100 58 124 60 C148 62 162 80 162 100 C166 114 178 120 198 120
      C262 112 342 108 400 114 C432 118 450 140 448 166 C447 188 438 202 432 212 L438 278 C439 288 419 290 417 280 L404 224
      C374 226 300 226 244 220 L222 218 L220 278 C220 289 200 290 199 280 L194 214 C178 206 166 192 160 172
      C152 152 132 140 112 138 C90 137 66 134 48 130 C36 128 30 124 30 116 Z" fill="#D6E5F3"/>
    <path d="M120 64 C142 60 158 78 156 106 C154 128 142 140 132 132 C122 112 118 92 112 72 C112 68 115 65 120 64 Z" fill="#BCD3EA"/>
  </g>
  <path d="M168 128 C176 150 178 170 174 186" fill="none" stroke="#355F8C" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>
  <path d="M378 128 C396 142 404 166 398 190" fill="none" stroke="#355F8C" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>
  <ellipse cx="34" cy="110" rx="8" ry="6.5" fill="#24486E"/>
  <circle cx="96" cy="86" r="5" fill="#24486E"/><circle cx="97.5" cy="84.5" r="1.6" fill="#fff"/>
  <path d="M50 126 C62 132 80 132 92 126" fill="none" stroke="#355F8C" stroke-width="3" stroke-linecap="round"/>
  <path d="M160 116 C164 132 168 146 174 156" fill="none" stroke="#F2728C" stroke-width="7" stroke-linecap="round"/>
  <circle cx="176" cy="160" r="6" fill="#F7C04A" stroke="#355F8C" stroke-width="2"/>
  </svg>`;

  const CAT_SVG = `<svg viewBox="0 0 520 300" role="img" aria-label="Кошка, вид сбоку">
  <ellipse cx="270" cy="288" rx="200" ry="9" fill="#E9EEF4"/>
  <g stroke="#355F8C" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
    <path d="M240 204 C244 232 246 258 244 278 C244 287 260 288 262 279 C266 256 266 228 262 200 Z" fill="#BCD3EA"/>
    <path d="M384 200 C394 226 398 252 396 278 C395 287 411 288 413 279 C418 252 414 222 406 196 Z" fill="#BCD3EA"/>
    <path d="M430 150 C474 140 496 100 486 56 C483 44 468 44 469 56 C476 92 460 122 426 132 Z" fill="#D6E5F3"/>
    <path d="M48 112 C50 96 58 82 68 74 L72 32 L100 60 C110 56 122 56 130 60 L156 30 L156 74 C164 86 166 100 164 112
      C176 122 192 124 212 122 C272 114 350 114 400 124 C428 130 440 152 438 176 C436 196 428 206 424 212 L428 278 C428 289 409 290 408 280 L402 222
      C370 226 284 226 238 222 L228 222 L226 278 C226 289 206 290 206 280 L200 216 C184 206 172 190 166 170
      C160 152 146 148 130 150 C102 152 74 144 60 134 C52 128 47 120 48 112 Z" fill="#D6E5F3"/>
  </g>
  <path d="M80 44 L96 62 L82 66 Z M150 44 L146 66 L134 62 Z" fill="#F7C6CF"/>
  <path d="M78 98 C84 92 94 92 100 98 C94 102 84 102 78 98 Z" fill="#24486E"/>
  <path d="M50 106 L60 106 L55 113 Z" fill="#E7889A" stroke="#355F8C" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M55 113 C55 122 64 126 72 122" fill="none" stroke="#355F8C" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M60 114 L18 106 M60 118 L20 122 M66 116 L28 132" stroke="#355F8C" stroke-width="1.8" stroke-linecap="round" opacity=".7"/>
  <path d="M168 128 C176 148 178 168 176 186" fill="none" stroke="#355F8C" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>
  <path d="M380 134 C398 148 404 170 400 194" fill="none" stroke="#355F8C" stroke-width="2.5" stroke-linecap="round" opacity=".35"/>
  </svg>`;

  const DOTS = {
    dog: { mouth: [42, 120], eyes: [98, 82], ears: [140, 112], chest: [180, 176], belly: [310, 196], rear: [436, 160], paws: [210, 262] },
    cat: { mouth: [44, 124], eyes: [92, 94], ears: [116, 40], chest: [184, 180], belly: [314, 200], rear: [428, 170], paws: [216, 262] },
  };

  const DOC_ICO = '<svg viewBox="0 0 32 32" fill="none" stroke="#4A7BAE" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5v8a6 6 0 0 0 12 0V5"/><path d="M15 19v3a5 5 0 0 0 10 0v-2"/><circle cx="25" cy="17" r="3"/><path d="M7 5h4M19 5h4"/></svg>';
  const WARN = (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5L2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.1"/></svg>`;
  const OKI = (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.6 2.6L16 9.5"/></svg>`;

  /* helpers */
  const readyPet = () => { const p = S.profile; return !!(p.animal && p.sex && p.sterilized && p.age); };
  const zone = () => ZONES.find((z) => z.id === S.zoneId);
  const symptom = () => SYMPTOMS.find((s) => s.id === S.symptomId);
  const w = () => words(S.profile);
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 2600);
  }
  function scrollToCard() { app.scrollIntoView({ behavior: "smooth", block: "start" }); }

  function go(step, push = true) {
    S.step = step;
    if (push) history.pushState({ step }, "", "#" + step);
    render();
    scrollToCard();
  }

  function stepBar() {
    const idx = STEPS.findIndex((s) => s.id === S.step);
    return `<div class="steps">
      <button class="back" type="button" data-act="back" aria-label="Назад" ${idx === 0 ? "disabled" : ""}>${BACK}</button>
      <div class="seg">${STEPS.map((s, i) => `<div class="seg__i ${i <= idx ? "on" : ""}"><div class="seg__bar"></div><div class="seg__l">${s.label}</div></div>`).join("")}</div>
    </div>`;
  }
  const pill = (group, value, label, cur) => `<button type="button" class="pill ${cur === value ? "on" : ""}" data-act="set" data-k="${group}" data-v="${value}" aria-pressed="${cur === value}">${label}</button>`;

  function vPet() {
    const p = S.profile;
    const sterLabel = p.sex === "female" ? "Стерилизована?" : p.sex === "male" ? "Кастрирован?" : "Стерилизация";
    return `<div class="eyebrow">Проверка симптомов</div>
      <h2 class="h">Кому нужна помощь?</h2>
      <div class="pets">
        ${[["dog", "Собака"], ["cat", "Кошка"]].map(([id, l]) => `<button type="button" class="pet ${p.animal === id ? "on" : ""}" data-act="set" data-k="animal" data-v="${id}" aria-pressed="${p.animal === id}"><span class="pet__ico">${FACE[id]}</span><span class="pet__l">${l}</span></button>`).join("")}
      </div>
      <div class="field"><div class="field__l">Пол</div><div class="pills">${pill("sex", "female", "Девочка", p.sex)}${pill("sex", "male", "Мальчик", p.sex)}</div></div>
      <div class="field"><div class="field__l">${sterLabel}</div><div class="pills">${pill("sterilized", "yes", "Да", p.sterilized)}${pill("sterilized", "no", "Нет", p.sterilized)}${pill("sterilized", "unknown", "Не знаю", p.sterilized)}</div></div>
      <div class="field"><div class="field__l">Возраст</div><div class="pills">${pill("age", "young", "До 1 года", p.age)}${pill("age", "adult", "1–7 лет", p.age)}${pill("age", "senior", "Старше 7", p.age)}</div></div>
      ${S.needPet && !readyPet() ? `<p class="err">Выберите питомца, пол, стерилизацию и возраст.</p>` : ""}
      <button class="primary" type="button" data-act="next">Далее <span aria-hidden="true">→</span></button>`;
  }

  function vZone() {
    const a = S.profile.animal;
    const dots = DOTS[a];
    return `<div class="eyebrow">${w().animalWord} · Проверка симптомов</div>
      <h2 class="h">Где проблема?</h2>
      <div class="map">${a === "cat" ? CAT_SVG : DOG_SVG}
        ${ZONES.filter((z) => z.kind === "hotspot").map((z) => { const [x, y] = dots[z.id]; return `<button type="button" class="dot" style="left:${(x / 520) * 100}%;top:${(y / 300) * 100}%" data-act="zone" data-id="${z.id}" aria-label="${z.title}"><span class="dot__tip">${z.title}</span></button>`; }).join("")}
      </div>
      <div class="chips">${ZONES.filter((z) => z.kind === "chip").map((z) => `<button type="button" class="chip" data-act="zone" data-id="${z.id}">${z.title}</button>`).join("")}</div>
      <p class="sub">Нажмите на точку там, где проблема, или выберите вариант для всего тела.</p>
      <div class="zlist">${ZONES.filter((z) => z.kind === "hotspot").map((z) => `<button type="button" class="row" data-act="zone" data-id="${z.id}"><span>${z.title}</span>${CHEV}</button>`).join("")}</div>`;
  }

  function vSymptom() {
    const z = zone();
    const list = SYMPTOMS.filter((s) => s.zoneId === z.id);
    return `<div class="eyebrow">${w().animalWord} · ${z.title}</div>
      <h2 class="h">Что вы замечаете?</h2>
      <div class="rows">${list.map((s) => `<button type="button" class="row" data-act="symptom" data-id="${s.id}"><span>${s.title}</span>${CHEV}</button>`).join("")}</div>`;
  }

  function vQuestions() {
    const s = symptom(); const qs = visibleQuestions(s, S.profile); const ww = w();
    const missing = qs.filter((x) => !S.answers[x.id]);
    return `<div class="eyebrow">${ww.animalWord} · ${s.title}</div>
      <h2 class="h">Несколько быстрых вопросов</h2>
      <p class="sub">Ответьте на каждый вопрос, так мы точнее оценим срочность.</p>
      <div class="qs">${qs.map((it, i) => `<div class="qc ${S.needAnswers && !S.answers[it.id] ? "miss" : ""}">
          <div class="qc__t"><span class="qc__n">${i + 1}.</span>${it.text(ww)}</div>
          <div class="pills">${it.options.map((o) => `<button type="button" class="pill ${S.answers[it.id] === o.value ? "on" : ""}" data-act="answer" data-q="${it.id}" data-v="${o.value}" aria-pressed="${S.answers[it.id] === o.value}">${o.label}</button>`).join("")}</div>
        </div>`).join("")}</div>
      ${S.needAnswers && missing.length ? `<p class="err">Осталось ответить: ${missing.length}. Вопросы без ответа выделены красным.</p>` : ""}
      <button class="primary" type="button" data-act="result">Показать результат <span aria-hidden="true">→</span></button>`;
  }

  function mapSvg(level) {
    const pins = [[78, 70, 1], [214, 104, 2], [146, 172, 3]];
    return `<svg viewBox="0 0 300 220" role="img" aria-label="Схема Москвы с примерами клиник">
      <rect width="300" height="220" fill="#EEF3F8"/>
      <path d="M-10 150 C40 120 70 160 120 140 C170 120 190 70 240 80 C270 86 290 60 320 66" fill="none" stroke="#BCD6EE" stroke-width="16" stroke-linecap="round"/>
      <rect x="22" y="112" width="44" height="34" rx="8" fill="#DCEBD9"/><rect x="200" y="140" width="60" height="40" rx="8" fill="#DCEBD9"/>
      <circle cx="150" cy="110" r="78" fill="none" stroke="#fff" stroke-width="8"/>
      <circle cx="150" cy="110" r="40" fill="none" stroke="#fff" stroke-width="6"/>
      <path d="M150 0V220M0 110H300M40 10L260 210M260 10L40 210" stroke="#fff" stroke-width="5"/>
      <circle cx="150" cy="110" r="78" fill="none" stroke="#D9E1EA" stroke-width="1.5"/>
      <circle cx="150" cy="110" r="6" fill="#C2413A" opacity=".8"/>
      ${pins.map(([x, y, n]) => `<g transform="translate(${x},${y})"><ellipse cy="15" rx="7" ry="2.5" fill="rgba(0,0,0,.15)"/><path d="M0 15C0 15-13 1-13-8a13 13 0 0 1 26 0C13 1 0 15 0 15z" fill="${S.clinic === "c" + n ? "#355F8C" : "#4A7BAE"}" stroke="#fff" stroke-width="2"/><circle cy="-8" r="7.5" fill="#fff"/><text y="-4.5" text-anchor="middle" font-size="10" font-weight="800" fill="#1B1F26" font-family="Manrope,Arial">${n}</text></g>`).join("")}
    </svg>`;
  }

  const SLOTS = ["Сегодня 18:30", "Завтра 10:00", "Завтра 14:30", "Завтра 19:00"];
  function clinicCard(c, level) {
    const sel = S.clinic === c.id; const booked = S.booked[c.id];
    let extra = "";
    if (sel && S.mode === "call") extra = `<div class="note">Пример номера: <b>${c.phone}</b>. Клиника здесь условная, поэтому звонок не совершается. В реальной версии кнопка сразу наберет номер.</div>`;
    if (sel && S.mode === "book" && !booked) extra = `<div class="note">Выберите удобное время:<div class="slots">${SLOTS.map((t) => `<button type="button" class="slot ${S.slot === t ? "on" : ""}" data-act="slot" data-v="${t}">${t}</button>`).join("")}</div><button type="button" class="btn2 blue" style="width:100%" data-act="confirm" data-id="${c.id}">Подтвердить запись</button></div>`;
    if (booked) extra = `<div class="note ok">Вы записаны: ${booked}. Это пример записи: заявка сохранена только на этой странице и никуда не отправлена.</div>`;
    return `<div class="clinic ${sel ? "sel" : ""}">
      <div class="clinic__top"><span class="pinno">${c.pin}</span><span class="badge">пример</span>${c.allDay ? '<span class="badge badge--g">24/7</span>' : ""}</div>
      <div class="clinic__n">${c.title}</div>
      <div class="clinic__m">${c.place} · ${c.hours}</div>
      <div class="clinic__b"><button type="button" class="btn2" data-act="call" data-id="${c.id}">Позвонить</button><button type="button" class="btn2 blue" data-act="book" data-id="${c.id}">Записаться онлайн</button></div>
      ${extra}
    </div>`;
  }

  function vResult() {
    const s = symptom(); const r = buildResult(S.profile, s, S.answers); const col = COLORS[r.level];
    const list = [...CLINICS].sort((a, b) => Number(b.allDay) - Number(a.allDay));
    return `<div class="eyebrow">${w().animalWord} · Итог</div>
      <h2 class="h">${s.title}</h2>
      <div class="urg" style="background:${col.s};color:${col.t}">${r.level === "watch" ? OKI(col.c) : WARN(col.c)}<span>${r.banner}</span></div>
      <div class="scale">${["watch", "plan", "soon", "emergency"].map((l) => `<div class="${l === r.level ? "on" : ""}" style="background:${l === r.level ? COLORS[l].c : COLORS[l].s}">${COLORS[l].label.toUpperCase()}</div>`).join("")}</div>
      <div class="box"><div class="eyebrow">По вашим ответам</div><ul class="list">${r.answersBox.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      <p class="para">${r.paragraph}</p>
      <div class="sec"><div class="eyebrow">Возможные причины</div><ul class="causes">${r.causes.map((c) => `<li>${c}</li>`).join("")}</ul></div>
      <div class="sec"><div class="eyebrow">К какому врачу</div>
        <div class="doc"><span class="doc__ico">${DOC_ICO}</span><div><div class="doc__n">${r.specialist}</div><div class="doc__w">${r.specialistWhy}</div></div></div>
        ${r.also.length ? `<p class="also">Также может понадобиться: <b>${r.also.join(", ")}</b></p>` : ""}
      </div>
      <div class="sec"><div class="eyebrow">Что сделать до визита</div><ol class="tips">${r.advice.map((a) => `<li><span>${a}</span></li>`).join("")}</ol></div>
      <div class="sec" id="where"><div class="eyebrow">Где принимает в Москве</div>
        <div class="mapbox">${mapSvg(r.level)}<div class="mapnote">Схема и клиники ниже: примеры, не реальные адреса</div></div>
        ${r.level === "emergency" ? `<div class="alert">При такой срочности езжайте в круглосуточную клинику без записи и позвоните по дороге.</div>` : ""}
        ${list.map((c) => clinicCard(c, r.level)).join("")}
      </div>
      <p class="disc">Это подсказка, а не диагноз. При сомнениях позвоните в клинику.</p>
      <button class="primary ghost" type="button" data-act="restart">Начать заново</button>`;
  }

  function render() {
    let html;
    if (S.step === "zone" && S.profile.animal) html = vZone();
    else if (S.step === "symptom" && zone()) html = vSymptom();
    else if (S.step === "questions" && symptom()) html = vQuestions();
    else if (S.step === "result" && symptom()) html = vResult();
    else { S.step = "pet"; html = vPet(); }
    app.innerHTML = `<div class="fadein">${stepBar()}${html}</div>`;
  }

  function reset() {
    Object.assign(S, { step: "pet", profile: { animal: null, sex: null, sterilized: null, age: null }, zoneId: null, symptomId: null, answers: {}, needPet: false, needAnswers: false, clinic: null, mode: null, slot: null, booked: {}, pendingZone: null });
    closeSheet();
    go("pet");
  }

  function back() {
    const order = ["pet", "zone", "symptom", "questions", "result"];
    const i = order.indexOf(S.step);
    if (i > 0) { S.clinic = null; S.mode = null; go(order[i - 1]); }
  }

  function pickZone(id) {
    S.zoneId = id; S.symptomId = null; S.answers = {}; S.needAnswers = false; go("symptom");
  }
  function pickSymptom(id) {
    const s = SYMPTOMS.find((x) => x.id === id); if (!s) return;
    S.zoneId = s.zoneId; S.symptomId = id; S.answers = {}; S.needAnswers = false; S.clinic = null; S.mode = null;
    closeSheet(); go("questions");
  }

  /* sheet: menu + search */
  const sheet = $("#sheet"), panel = $("#sheetPanel");
  function openSheet(html) { panel.innerHTML = `<div class="sheet__grab"></div>${html}`; sheet.hidden = false; document.body.style.overflow = "hidden"; }
  function closeSheet() { sheet.hidden = true; document.body.style.overflow = ""; }
  function openMenu() {
    const item = (act, title, sub, ico) => `<button class="mitem" type="button" data-act="${act}">${ico}<span>${title}<small>${sub}</small></span></button>`;
    const i1 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M14 6l6 6-6 6"/></svg>';
    const i2 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>';
    const i3 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5L2.8 19.5h18.4z"/><path d="M12 10v4.5M12 17.2v.1"/></svg>';
    const i4 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8.6M4 4v4.6h4.6"/></svg>';
    openSheet(`<div class="sheet__head"><div class="h">Меню</div><button class="x" type="button" data-act="close" aria-label="Закрыть">×</button></div>
      ${item("start", "Проверить симптомы", "Пошагово: питомец, зона, симптом", i1)}
      ${item("search", "Найти симптом", "Поиск по всем симптомам", i2)}
      ${item("sos", "Когда ехать сразу", "Признаки, при которых нельзя ждать", i3)}
      ${item("restart", "Начать заново", "Сбросить все ответы", i4)}
      <p class="sub" style="margin-top:16px">Ветпомощник дает подсказку, а не диагноз. При сомнениях звоните в клинику.</p>`);
  }
  function openSos() {
    openSheet(`<div class="sheet__head"><div class="h">Когда ехать сразу</div><button class="x" type="button" data-act="close" aria-label="Закрыть">×</button></div>
      <ul class="causes" style="margin-bottom:8px">
        <li>Тяжело дышит в покое, синюшные или бледные десны</li><li>Не может встать, судороги, потеря сознания</li>
        <li>Съел яд, лекарство, шоколад, ксилит, лилию</li><li>Живот раздулся и твердый, рвота без результата</li>
        <li>Кот тужится, но моча не выходит</li><li>Сильное кровотечение или глубокая рана</li>
      </ul>
      <button class="primary" type="button" data-act="start">Проверить симптомы <span aria-hidden="true">→</span></button>`);
  }
  function openSearch() {
    openSheet(`<div class="sheet__head"><div class="h">Найти симптом</div><button class="x" type="button" data-act="close" aria-label="Закрыть">×</button></div>
      <input class="search" id="q" type="search" placeholder="Например, рвота или кашель" autocomplete="off">
      <div class="rows" id="hits" style="margin-top:0"></div>`);
    const input = $("#q"); const hits = $("#hits");
    const draw = () => {
      const v = input.value.trim().toLowerCase();
      const seen = new Set();
      const list = SYMPTOMS.filter((s) => (!v || s.title.toLowerCase().includes(v)) && !seen.has(s.title) && seen.add(s.title)).slice(0, 30);
      hits.innerHTML = list.length ? list.map((s) => `<button type="button" class="row" data-act="hit" data-id="${s.id}"><span>${s.title}<small style="display:block;font-size:14px;color:#667085;font-weight:600">${ZONES.find((z) => z.id === s.zoneId).title}</small></span>${CHEV}</button>`).join("") : `<p class="sub">Ничего не нашли. Попробуйте другое слово или выберите зону на схеме.</p>`;
    };
    input.addEventListener("input", draw); draw();
    setTimeout(() => input.focus(), 50);
  }

  /* events */
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const act = b.dataset.act, id = b.dataset.id;
    switch (act) {
      case "home": e.preventDefault(); closeSheet(); window.scrollTo({ top: 0, behavior: "smooth" }); break;
      case "start": closeSheet(); scrollToCard(); break;
      case "hint":
        S.pendingZone = b.dataset.zone;
        if (readyPet()) pickZone(S.pendingZone); else { scrollToCard(); toast("Сначала расскажите о питомце"); }
        break;
      case "menu": openMenu(); break;
      case "search": openSearch(); break;
      case "sos": openSos(); break;
      case "close": closeSheet(); break;
      case "set": S.profile[b.dataset.k] = b.dataset.v; render(); break;
      case "next":
        if (!readyPet()) { S.needPet = true; render(); break; }
        S.needPet = false;
        if (S.pendingZone) { const z = S.pendingZone; S.pendingZone = null; S.zoneId = z; go("symptom"); } else go("zone");
        break;
      case "back": back(); break;
      case "zone": pickZone(id); break;
      case "symptom": pickSymptom(id); break;
      case "hit":
        if (!readyPet()) { const s = SYMPTOMS.find((x) => x.id === id); S.pendingZone = s.zoneId; closeSheet(); go("pet"); toast("Сначала расскажите о питомце"); }
        else pickSymptom(id);
        break;
      case "answer": {
        S.answers[b.dataset.q] = b.dataset.v;
        const card = b.closest(".qc");
        card.querySelectorAll(".pill").forEach((p) => { const on = p === b; p.classList.toggle("on", on); p.setAttribute("aria-pressed", on); });
        card.classList.remove("miss");
        break;
      }
      case "result": {
        const qs = visibleQuestions(symptom(), S.profile);
        const miss = qs.filter((x) => !S.answers[x.id]);
        if (miss.length) { S.needAnswers = true; render(); const m = app.querySelector(".qc.miss"); m && m.scrollIntoView({ behavior: "smooth", block: "center" }); }
        else { S.needAnswers = false; S.clinic = null; S.mode = null; go("result"); }
        break;
      }
      case "call": S.clinic = id; S.mode = "call"; render(); $("#where").scrollIntoView({ block: "start" }); focusClinic(id); break;
      case "book": S.clinic = id; S.mode = "book"; S.slot = null; render(); focusClinic(id); break;
      case "slot": S.slot = b.dataset.v; render(); focusClinic(S.clinic); break;
      case "confirm":
        if (!S.slot) { toast("Выберите время записи"); break; }
        S.booked[id] = S.slot; S.mode = null; render(); focusClinic(id); toast("Запись создана (пример)");
        break;
      case "restart": reset(); break;
    }
  });
  function focusClinic(id) {
    const c = [...app.querySelectorAll(".clinic")].find((el) => el.querySelector(`[data-id="${id}"]`));
    c && c.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });
  window.addEventListener("popstate", (e) => {
    const st = (e.state && e.state.step) || "pet";
    const order = ["pet", "zone", "symptom", "questions", "result"];
    if (order.indexOf(st) < order.indexOf(S.step)) { S.step = st; render(); }
  });

  history.replaceState({ step: "pet" }, "", location.pathname);
  render();
})();
