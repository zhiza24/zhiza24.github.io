/* Ветпомощник: данные и логика срочности */
const YN = [{ value: "yes", label: "Да" }, { value: "no", label: "Нет" }];
const DURATION = [{ value: "today", label: "Сегодня" }, { value: "days", label: "1–3 дня" }, { value: "week", label: "Больше недели" }];
const STEPS = [
  { id: "pet", label: "Питомец" }, { id: "zone", label: "Зона" }, { id: "symptom", label: "Симптом" },
  { id: "questions", label: "Вопросы" }, { id: "result", label: "Итог" },
];
const ZONES = [
  { id: "mouth", title: "Нос и рот", kind: "hotspot" },
  { id: "eyes", title: "Глаза", kind: "hotspot" },
  { id: "ears", title: "Уши", kind: "hotspot" },
  { id: "chest", title: "Грудь и дыхание", kind: "hotspot" },
  { id: "belly", title: "Живот и кишечник", kind: "hotspot" },
  { id: "rear", title: "Под хвостом и мочеиспускание", kind: "hotspot" },
  { id: "paws", title: "Лапы и движение", kind: "hotspot" },
  { id: "skin", title: "Кожа и шерсть", kind: "chip" },
  { id: "body", title: "Все тело / общее", kind: "chip" },
  { id: "behavior", title: "Поведение", kind: "chip" },
];

const isOpenFemale = (p) => p.sex === "female" && p.sterilized !== "yes";
const isIntactMale = (p) => p.sex === "male" && p.sterilized !== "yes";
const isMaleCat = (p) => p.animal === "cat" && p.sex === "male";
const isFragile = (p) => p.age === "young" || p.age === "senior";

function q(id, text, redIf, bumpIf, showIf) { return { id, text, options: YN, redIf, bumpIf, showIf }; }
const PREGNANCY_Q = { id: "pregnancy", text: (w) => `Сейчас у ${gen(w)} течка или возможна беременность?`, options: YN, showIf: isOpenFemale };
const DURATION_Q = { id: "duration", text: () => "Как давно это началось?", options: DURATION };
const GENERIC_Q = [
  q("danger", (w) => `Есть кровь, ${w.yourPet} ${w.adj("очень вялый", "очень вялая")}, не пьет или не может встать?`, ["yes"]),
  q("worse", () => "Состояние заметно ухудшается или есть сильная боль?", undefined, ["yes"]),
  DURATION_Q,
];
const Q_DISCHARGE = q("dischargeLoop", () => "Есть выделения из петли или живот кажется надутым и болезненным?", ["yes"], undefined, isOpenFemale);
const Q_THIRST = q("thirst", (w) => `${cap(w.yourPet)} пьет намного больше обычного?`, undefined, ["yes"], isOpenFemale);
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

const SYMPTOMS = [
  { id: "badBreath", zoneId: "mouth", title: "Неприятный запах из пасти", base: "plan" },
  { id: "drool", zoneId: "mouth", title: "Обильное слюнотечение", base: "plan", questions: [q("cantSwallow", () => "Не может глотать, давится или вытекает пена?", ["yes"]), q("foreign", () => "Есть подозрение, что в пасти застрял инородный предмет?", ["yes"]), DURATION_Q] },
  { id: "mouthPain", zoneId: "mouth", title: "Отказывается есть из-за боли во рту", base: "soon", fragileAge: true },
  { id: "faceSwell", zoneId: "mouth", title: "Отек морды или губ", base: "soon", questions: [q("fastSwell", () => "Отек растет на глазах или есть зуд, сыпь или тяжелое дыхание?", ["yes"]), ...GENERIC_Q] },
  { id: "nasal", zoneId: "mouth", title: "Истечение из носа", base: "plan" },
  { id: "sneeze", zoneId: "mouth", title: "Чихает или трет морду", base: "plan" },
  { id: "mouthBlood", zoneId: "mouth", title: "Кровь из пасти или носа", base: "soon", questions: [q("heavyBleed", () => "Кровь не останавливается или идет струей?", ["yes"]), ...GENERIC_Q] },
  { id: "badTooth", zoneId: "mouth", title: "Шатается или сломан зуб", base: "soon" },

  { id: "eyeGoop", zoneId: "eyes", title: "Слезятся или гноятся глаза", base: "soon", questions: [q("closed", (w) => `Глаз прищурен, помутнел, или ${w.pet} почти его не открывает?`, ["yes"]), q("pus", () => "Выделения густые, желтые или зеленоватые?", undefined, ["yes"]), q("injury", () => "Недавно была травма глаза или удар головой?", ["yes"])] },
  { id: "redEye", zoneId: "eyes", title: "Красный или опухший глаз", base: "soon", questions: [q("closed", (w) => `Глаз прищурен или ${w.pet} его почти не открывает?`, ["yes"]), ...GENERIC_Q] },
  { id: "squint", zoneId: "eyes", title: "Прищуривает глаз или почти не открывает", base: "soon" },
  { id: "cloudyEye", zoneId: "eyes", title: "Помутнел глаз", base: "soon" },
  { id: "thirdLid", zoneId: "eyes", title: "Третье веко закрывает глаз", base: "soon" },
  { id: "eyeInjury", zoneId: "eyes", title: "Травма глаза", base: "emergency" },
  { id: "rubEye", zoneId: "eyes", title: "Чешет глаз лапой", base: "plan" },

  { id: "earScratch", zoneId: "ears", title: "Чешет ухо и трясет головой", base: "soon", questions: [q("discharge", () => "Из уха идут выделения, есть сильный запах, отек или ранки?", undefined, ["yes"]), q("tilt", (w) => `У ${gen(w)} голова постоянно наклонена набок, ходит кругами или теряет равновесие?`, ["yes"]), q("scratchBlood", () => "Расчесывает так сильно, что появляется кровь?", undefined, ["yes"])] },
  { id: "earGoop", zoneId: "ears", title: "Выделения и запах из уха", base: "soon" },
  { id: "earSwell", zoneId: "ears", title: "Отек уха", base: "soon" },
  { id: "headTilt", zoneId: "ears", title: "Наклоняет голову набок", base: "soon", questions: [q("circles", () => "Ходит кругами, падает или теряет равновесие?", ["yes"]), ...GENERIC_Q] },
  { id: "earPain", zoneId: "ears", title: "Боль при касании уха", base: "soon" },
  { id: "earBleed", zoneId: "ears", title: "Расчесы уха до крови", base: "soon" },

  { id: "cough", zoneId: "chest", title: "Кашель", base: "soon", questions: [q("foam", (w) => `Есть кровь или пена, либо ${w.pet} задыхается и не может свободно вдохнуть?`, ["yes"]), q("exercise", (w) => `Кашель сильнее при нагрузке или ночью, и ${w.pet} быстро устает?`, undefined, ["yes"]), q("fever", (w) => `${cap(w.yourPet)} отказывается от еды или ${w.adj("вялый", "вялая")}?`, undefined, ["yes"])] },
  { id: "breathing", zoneId: "chest", title: "Частое тяжелое дыхание", base: "soon", questions: [q("openMouth", () => "Дышит с открытым ртом в покое (для кошки это особенно тревожно), десны или язык бледные или синюшные?", ["yes"]), q("atRest", () => "Тяжелое дыхание не после игры, а в покое или во сне?", ["yes"]), q("bloated", (w) => `Живот резко раздулся, или ${w.pet} не может лечь и успокоиться?`, ["yes"])] },
  { id: "wheeze", zoneId: "chest", title: "Хрипы или свист при дыхании", base: "soon" },
  { id: "openBreath", zoneId: "chest", title: "Дышит с открытым ртом в покое", base: "emergency" },
  { id: "tireWalk", zoneId: "chest", title: "Быстро устает на прогулке", base: "soon" },
  { id: "sneezeChest", zoneId: "chest", title: "Чихает с выделениями", base: "plan" },
  { id: "foamCough", zoneId: "chest", title: "Кашель с пеной или кровью", base: "emergency" },

  { id: "poison", zoneId: "belly", title: "Съел что-то ядовитое", base: "emergency", questions: [q("knownToxin", () => "Точно известно, что это было: яд, человеческое лекарство, шоколад, лук, ксилит, антифриз, яд от грызунов или опасное растение (для кошек особенно лилии)?", ["yes"]), q("toxinSigns", () => "Уже есть рвота, слюнотечение, слабость, дрожь или судороги?", ["yes"]), q("recent", () => "Это произошло сегодня, в последние часы?", ["yes"], ["no"])] },
  { id: "bloat", zoneId: "belly", title: "Вздутый живот / попытки рвоты", base: "emergency", questions: [q("hardBelly", () => "Живот стал большим и твердым?", ["yes"]), q("dryRetch", () => "Пытается рвать, но почти ничего не выходит?", ["yes"]), q("restless", (w) => `${cap(w.yourPet)} не может лечь и успокоиться?`, ["yes"])] },
  { id: "bloodStool", zoneId: "belly", title: "Кровь в кале", base: "soon", fragileAge: true, questions: [q("blackStool", () => "Стул черный, как деготь, или крови много?", ["yes"]), q("weak", (w) => `${cap(w.yourPet)} ${w.adj("вялый", "вялая")} или отказывается от воды?`, ["yes"]), DURATION_Q, PREGNANCY_Q] },
  { id: "constip", zoneId: "belly", title: "Запор", base: "plan", fragileAge: true, questions: [q("noStool", () => "Не может сходить в туалет уже больше суток и тужится?", undefined, ["yes"]), ...GENERIC_Q] },
  { id: "diarrhea", zoneId: "belly", title: "Понос", base: "plan", fragileAge: true, questions: [q("bloodStoolQ", () => "В стуле есть кровь или он черный, как деготь?", ["yes"]), q("weak", (w) => `${cap(w.yourPet)} ${w.adj("вялый", "вялая")} или отказывается от воды?`, ["yes"]), q("frequent", () => "Стул очень частый, больше четырех-пяти раз за день?", undefined, ["yes"]), PREGNANCY_Q, DURATION_Q] },
  { id: "notEating", zoneId: "belly", title: "Не ест", base: "soon", fragileAge: true, questions: [q("notEatingQ", () => "Совсем не ест: для кошки уже больше половины суток, для собаки больше суток?", ["yes"]), q("otherSigns", () => "Есть рвота, понос, тяжелое дыхание или сильная боль?", ["yes"]), Q_DISCHARGE, Q_THIRST, PREGNANCY_Q, DURATION_Q] },
  { id: "scoot", zoneId: "belly", title: "Ездит на попе", base: "plan" },
  { id: "vomit", zoneId: "belly", title: "Рвота", base: "plan", fragileAge: true, questions: [q("repeat", (w) => `Рвота у ${gen(w)} повторяется несколько раз за короткое время?`, undefined, ["yes"]), q("blood", () => "В рвоте есть кровь или она похожа на кофейную гущу?", ["yes"]), q("noWater", (w) => `${w.adj("Питомец совсем не пьет", "Питомица совсем не пьет")} или воду сразу возвращает?`, ["yes"]), PREGNANCY_Q, DURATION_Q] },

  { id: "urinary", zoneId: "rear", title: "Кровь в моче или частые позывы", base: "soon", questions: [q("blocked", (w) => `${cap(w.yourPet)} тужится, но моча почти не выходит или выходит по капле?`, ["yes"]), q("bloodUrine", () => "В моче видна кровь?", undefined, ["yes"]), q("painUrine", (w) => `${cap(w.yourPet)} очень часто просится или ходит в лоток и при этом беспокоится, кричит или прячется?`, undefined, ["yes"]), Q_DISCHARGE, PREGNANCY_Q, DURATION_Q] },
  { id: "blockedPee", zoneId: "rear", title: "Тужится, но моча почти не выходит", base: "emergency" },
  { id: "rearDischarge", zoneId: "rear", title: "Выделения из петли или под хвостом", base: "soon", questions: [Q_DISCHARGE, Q_THIRST, q("smelly", () => "Выделения с запахом, гноем или кровью?", ["yes"]), PREGNANCY_Q, DURATION_Q] },
  { id: "lickRear", zoneId: "rear", title: "Лижет под хвостом чаще обычного", base: "plan" },
  { id: "prolapse", zoneId: "rear", title: "Отек или выпадение тканей под хвостом", base: "emergency" },
  { id: "painPee", zoneId: "rear", title: "Боль при мочеиспускании", base: "soon" },
  { id: "noPoop", zoneId: "rear", title: "Не может опорожнить кишечник", base: "soon" },

  { id: "limp", zoneId: "paws", title: "Хромота", base: "soon", questions: [q("noWeight", () => "Совсем не опирается, есть сильный отек или лапа под неестественным углом?", ["yes"]), q("afterTrauma", () => "Хромота началась после прыжка, падения или удара?", undefined, ["yes"]), q("longLimp", () => "Хромает уже дольше недели, но на лапу все же встает?", undefined, [])] },
  { id: "noStandPaw", zoneId: "paws", title: "Не опирается на лапу", base: "soon" },
  { id: "pawSwell", zoneId: "paws", title: "Отек лапы или сустава", base: "soon" },
  { id: "padWound", zoneId: "paws", title: "Рана или заноза на подушечке", base: "soon" },
  { id: "lickPaw", zoneId: "paws", title: "Вылизывает лапу до проплешины", base: "plan" },
  { id: "oddAngle", zoneId: "paws", title: "Лапа под неестественным углом", base: "emergency" },
  { id: "afterJump", zoneId: "paws", title: "После прыжка или падения", base: "soon" },

  { id: "itch", zoneId: "skin", title: "Зуд и проплешины", base: "plan", questions: [q("sores", () => "Есть открытые ранки, мокнутие, корочки или сильный запах кожи?", undefined, ["yes"]), q("severeItch", () => "Чешется так, что не может спать, или раздирает кожу до крови?", undefined, ["yes"]), q("fastBald", () => "Залысины появились быстро и за несколько дней заметно выросли?", undefined, ["yes"])] },
  { id: "rash", zoneId: "skin", title: "Красные пятна или сыпь", base: "plan" },
  { id: "crust", zoneId: "skin", title: "Корочки, мокнутие или запах кожи", base: "soon" },
  { id: "lump", zoneId: "skin", title: "Шишка или уплотнение под кожей", base: "plan" },
  { id: "dandruff", zoneId: "skin", title: "Перхоть или жирная шерсть", base: "watch" },
  { id: "parasite", zoneId: "skin", title: "Блохи или клещ", base: "plan" },
  { id: "skinWound", zoneId: "skin", title: "Рана или расчесы до крови", base: "soon", questions: [q("deep", () => "Кровь не останавливается, рана глубокая, или видны глубокие ткани?", ["yes"]), q("bite", () => "Это укус другого животного, или уже есть гной и сильный отек?", undefined, ["yes"]), q("shallow", () => "Кровотечение уже остановилось, и рана поверхностная?")] },

  { id: "lethargy", zoneId: "body", title: "Вялость и отказ от еды", base: "soon", fragileAge: true, questions: [q("notEatingQ", () => "Совсем не ест: для кошки уже больше половины суток, для собаки больше суток?", ["yes"]), q("otherSigns", () => "Есть рвота, понос, тяжелое дыхание или сильная боль?", ["yes"]), q("collapse", (w) => `${cap(w.yourPet)} не может встать, не реагирует на зов или прячется и не выходит?`, ["yes"]), Q_DISCHARGE, Q_THIRST, PREGNANCY_Q, DURATION_Q] },
  { id: "thirstBody", zoneId: "body", title: "Пьет намного больше обычного", base: "soon", questions: [Q_THIRST, Q_DISCHARGE, PREGNANCY_Q, ...GENERIC_Q] },
  { id: "weightChange", zoneId: "body", title: "Резко похудел или поправился", base: "plan" },
  { id: "seizure", zoneId: "body", title: "Дрожь или судороги", base: "emergency" },
  { id: "feverBody", zoneId: "body", title: "На ощупь теплее обычного", base: "soon" },
  { id: "paleGums", zoneId: "body", title: "Бледные или синюшные десны", base: "emergency" },
  { id: "collapse", zoneId: "body", title: "Коллапс, не может встать", base: "emergency" },

  { id: "behLethargy", zoneId: "behavior", title: "Вялость и отказ от еды", base: "soon", fragileAge: true, questions: [q("notEatingQ", () => "Совсем не ест: для кошки уже больше половины суток, для собаки больше суток?", ["yes"]), q("otherSigns", () => "Есть рвота, понос, тяжелое дыхание или сильная боль?", ["yes"]), q("collapse", (w) => `${cap(w.yourPet)} не может встать или не реагирует на зов?`, ["yes"]), Q_DISCHARGE, Q_THIRST, PREGNANCY_Q, DURATION_Q] },
  { id: "aggression", zoneId: "behavior", title: "Агрессия или внезапная раздражительность", base: "soon" },
  { id: "hiding", zoneId: "behavior", title: "Прячется и не выходит", base: "soon" },
  { id: "whine", zoneId: "behavior", title: "Скулит или беспокоится без явной причины", base: "plan" },
  { id: "circles", zoneId: "behavior", title: "Ходит кругами или сбит с ритма сна", base: "soon", questions: [q("neurol", () => "Есть круги, падения, судороги или неузнавание хозяина?", ["yes"]), ...GENERIC_Q] },
  { id: "pica", zoneId: "behavior", title: "Ест несъедобное", base: "plan" },
  { id: "appetiteShift", zoneId: "behavior", title: "Изменился аппетит без других признаков", base: "watch" },
];

const CLINICS = [
  { id: "c1", title: "Круглосуточный ветцентр", place: "м. Северная", hours: "круглосуточно", allDay: true, phone: "+7 (495) 000-00-01", pin: 1 },
  { id: "c2", title: "Ветклиника у дома", place: "м. Садовая", hours: "ежедневно 9:00–21:00", allDay: false, phone: "+7 (495) 000-00-02", pin: 2 },
  { id: "c3", title: "Ветеринарный кабинет", place: "м. Речная", hours: "пн–сб 10:00–20:00", allDay: false, phone: "+7 (495) 000-00-03", pin: 3 },
];

function words(p) {
  const female = p.sex === "female";
  return {
    female,
    pet: female ? "питомица" : "питомец",
    yourPet: female ? "ваша питомица" : "ваш питомец",
    who: female ? "вашу питомицу" : "вашего питомца",
    adj: (m, f) => (female ? f : m),
    youngWord: p.animal === "cat" ? "котенок" : "щенок",
    animalWord: p.animal === "cat" ? "Кошка" : "Собака",
  };
}
// "у питомица" -> род. падеж
function gen(w) { return w.female ? "питомицы" : "питомца"; }

function visibleQuestions(symptom, p) {
  const list = symptom.questions || GENERIC_Q;
  const extra = [];
  if (isOpenFemale(p) && ["belly", "rear", "body", "behavior"].includes(symptom.zoneId)) {
    if (!list.some((x) => x.id === "dischargeLoop")) extra.push(Q_DISCHARGE);
    if (!list.some((x) => x.id === "thirst")) extra.push(Q_THIRST);
    if (!list.some((x) => x.id === "pregnancy")) extra.push(PREGNANCY_Q);
  }
  return [...list, ...extra].filter((it) => !it.showIf || it.showIf(p));
}

const RANK = { watch: 0, plan: 1, soon: 2, emergency: 3 };
const maxL = (a, b) => (RANK[a] >= RANK[b] ? a : b);
const bump = (u) => (u === "watch" ? "plan" : u === "plan" ? "soon" : "emergency");
const unique = (a) => [...new Set(a)];

function buildResult(p, symptom, answers) {
  const w = words(p);
  let level = symptom.base;
  const box = [];
  for (const it of visibleQuestions(symptom, p)) {
    const a = answers[it.id];
    if (!a) continue;
    if (it.redIf && it.redIf.includes(a)) level = maxL(level, "emergency");
    if (it.bumpIf && it.bumpIf.includes(a)) level = maxL(level, "soon");
  }
  if (symptom.zoneId === "rear" && isMaleCat(p)) {
    level = "emergency";
    box.push("У котов-мальчиков любые трудности с мочеиспусканием опасны: уретра может заблокироваться.");
  }
  if (answers.blocked === "yes") { level = "emergency"; box.push("Если моча почти не выходит, это нельзя откладывать."); }
  const pyo = isOpenFemale(p) && (answers.dischargeLoop === "yes" || answers.thirst === "yes");
  if (pyo) { level = "emergency"; box.push("У нестерилизованной самки вялость, жажда или выделения могут быть признаками пиометры. Это срочное состояние."); }
  if (symptom.fragileAge && isFragile(p)) {
    level = bump(level);
    box.push(p.age === "young" ? `${cap(w.youngWord)} быстрее теряет силы при рвоте, поносе или отказе от еды.` : "Пожилые животные слабее переносят обезвоживание и отказ от еды.");
  }
  if (symptom.id === "skinWound" && answers.shallow === "yes" && answers.deep !== "yes" && answers.bite !== "yes" && level !== "emergency") level = "watch";
  if ((symptom.id === "breathing" || symptom.id === "openBreath") && (answers.openMouth === "yes" || answers.atRest === "yes" || answers.bloated === "yes")) level = "emergency";
  if (answers.pregnancy === "yes") box.push("Если возможна беременность или идет течка, скажите об этом врачу. Это не снижает срочность.");
  if (!box.length) {
    if (level === "emergency") box.push(`Есть признаки, при которых лучше не ждать и показать ${w.who} врачу сейчас.`);
    else if (level === "soon") box.push("Симптомы стоит обсудить с врачом в ближайшие дни, не откладывая надолго.");
    else if (level === "plan") box.push("Сейчас это не выглядит как экстренная ситуация, но осмотр лучше запланировать.");
    else box.push("Пока можно наблюдать дома. Если станет хуже, свяжитесь с клиникой.");
  }
  const banners = {
    emergency: "Нужна помощь врача прямо сейчас",
    soon: "Нужен осмотр в ближайшие 1–3 дня",
    plan: "Можно записаться планово",
    watch: "Пока можно наблюдать дома",
  };
  return { level, banner: banners[level], answersBox: unique(box).slice(0, 4), ...contentFor(symptom, p, answers, pyo, w, level) };
}

function contentFor(symptom, p, answers, pyo, w, level) {
  let causes = ["Раздражение или воспаление в этой зоне", "Травма, инородное тело или инфекция", "Аллергия или паразиты", "Системное заболевание, которое дает отклик именно тут"];
  let specialist = "терапевт";
  let specialistWhy = "Первый осмотр, оценка срочности и направление к узкому специалисту, если нужно.";
  let also = [];
  let advice = ["Не давайте человеческие лекарства", "Возьмите ветпаспорт с отметками о прививках и обработке от глистов и паразитов", "Если получится, сфотографируйте или снимите на видео нарушение"];
  const paragraph = `Это не диагноз, а ориентир, куда двигаться с симптомом «${symptom.title.toLowerCase()}». Врач посмотрит ${w.who} и решит, какие обследования нужны.`;
  const z = symptom.zoneId;
  if (z === "mouth") {
    causes = ["Воспаление десен или зубов", "Инородное тело во рту или гортани", "Травма губ, языка или зуба", "Инфекция верхних дыхательных путей или аллергия"];
    specialist = "стоматолог"; specialistWhy = "Оценит полость рта, зубы и десны, если проблема в пасти."; also = ["терапевт"];
  }
  if (z === "eyes") {
    causes = ["Воспаление слизистой оболочки глаза", "Раздражение или инородное тело", "Травма роговицы", "Нарушение оттока слезы или хроническое воспаление"];
    specialist = "офтальмолог"; specialistWhy = "С глазом лучше не тянуть: врач оценит роговицу и слизистую и решит, нужны ли капли или срочная помощь."; also = ["терапевт"];
    advice = ["Не промывайте глаз человеческими каплями", "Не давайте тереть глаз лапой", "Сделайте фото глаза", "Возьмите ветпаспорт"];
  }
  if (z === "ears") {
    causes = ["Воспаление наружного уха", "Ушной клещ", "Аллергия или раздражение кожи слухового прохода", "Инородное тело или воспаление среднего уха"];
    specialist = "терапевт"; specialistWhy = "Осмотрит слуховой проход и решит, нужен ли дерматолог или невролог."; also = ["дерматолог"];
    if (answers.tilt === "yes" || symptom.id === "headTilt") also.push("невролог");
    advice = ["Не чистите ухо глубоко ватными палочками", "Не капайте капли без назначения врача", "Если расчесывает до крови, наденьте защитный воротник", "Возьмите ветпаспорт"];
  }
  if (z === "chest") {
    causes = ["Раздражение горла или дыхательных путей", "Инфекция дыхательных путей", "Хроническое раздражение трахеи или аллергия", "Проблема с сердцем или легкими"];
    specialist = "терапевт"; specialistWhy = "Оценит дыхание и решит, нужен ли осмотр кардиолога или срочная помощь.";
    if (answers.exercise === "yes" || level === "emergency") also = ["кардиолог"];
    if (level === "emergency") also.push("реаниматолог");
    advice = ["Ограничьте бег и сильное возбуждение", "Снимите дыхание или кашель на видео", "Не давайте человеческие сиропы от кашля", "Возьмите ветпаспорт с отметками о прививках"];
  }
  if (z === "belly") {
    causes = ["Расстройство из-за корма или несъедобного", "Глисты или кишечные простейшие", "Воспаление желудка или кишечника", "Инородный предмет, инфекция или отравление"];
    specialist = "терапевт"; specialistWhy = "Оценит живот, рвоту или стул и при необходимости направит к гастроэнтерологу."; also = ["гастроэнтеролог"];
    if (symptom.id === "poison") {
      causes = ["Отравление бытовой химией или ядом", "Отравление человеческим лекарством или продуктами с ксилитом", "Токсичное растение", "Яд против грызунов или насекомых"];
      specialist = "токсиколог / реаниматолог"; specialistWhy = "При подозрении на отравление нужна клиника, где есть срочная помощь."; also = ["терапевт"];
      advice = [`Возьмите упаковку или образец того, что ${w.adj("съел", "съела")} ${w.pet}`, "Не вызывайте рвоту сами, если это была химия, щелочь, кислота или нефтепродукт", "Езжайте в клинику сразу и позвоните по дороге", "Не давайте молоко и человеческие сорбенты без указания врача"];
    }
    if (symptom.id === "bloat") {
      causes = ["Острое расширение желудка, у собак это особенно опасно", "Непроходимость или заворот кишечника", "Скопление газов или жидкости в животе", "Острое хирургическое состояние живота"];
      specialist = "хирург"; specialistWhy = "Вздутый живот и бесплодная рвота: повод ехать в клинику сразу, может потребоваться хирург."; also = ["терапевт", "реаниматолог"];
    }
    if (symptom.id === "vomit" || symptom.id === "diarrhea") {
      advice = [symptom.id === "vomit" ? "Не кормите 6–12 часов, но предлагайте воду маленькими порциями" : "Оставьте воду в доступе", "Не давайте человеческие лекарства", "Сфотографируйте рвоту или стул, если получится", "Возьмите ветпаспорт с отметками о прививках и обработке от глистов и паразитов"];
    }
    if (symptom.id === "scoot") causes = ["Воспаление анальных желез", "Глисты", "Зуд или раздражение кожи под хвостом", "Аллергия"];
  }
  if (z === "rear") {
    causes = ["Воспаление мочевого пузыря", "Камни или кристаллы в мочевых путях"];
    if (isMaleCat(p)) causes.push("Закупорка уретры: опасно для жизни, нужен осмотр сегодня");
    if (isIntactMale(p) && p.animal === "dog") causes.push("Воспаление простаты");
    if (pyo) causes.push("Пиометра, гнойное воспаление матки: состояние срочное");
    if (causes.length < 4) causes.push("Воспаление кожи или анальных желез");
    specialist = "уролог / нефролог"; specialistWhy = "Занимается мочевыми путями; у котов-мальчиков это особенно срочно."; also = ["терапевт"];
    if (isIntactMale(p) && p.animal === "dog") also.push("андролог");
    if (pyo || (isOpenFemale(p) && answers.pregnancy === "yes")) also.push("репродуктолог");
    if (pyo) { specialist = "репродуктолог / гинеколог"; specialistWhy = "При подозрении на пиометру нужен срочный осмотр репродуктолога или хирурга."; }
    advice = ["Если моча не выходит, езжайте в клинику сразу, не ждите утра", "Если получится, соберите свежую мочу в чистую емкость", "Не давайте человеческие спазмолитики и мочегонные", "Возьмите ветпаспорт с отметками о прививках и обработках"];
  }
  if (z === "paws") {
    causes = ["Растяжение или ушиб мягких тканей", "Рана на подушечке или между пальцами", "Вывих или перелом", "Воспаление сустава или хроническая ортопедическая проблема"];
    specialist = "ортопед / хирург"; specialistWhy = "Оценит хромоту и суставы и решит, нужна ли фиксация или операция."; also = ["терапевт"];
    advice = ["Ограничьте прыжки и выгуливайте только на поводке", "Не давайте человеческие обезболивающие, особенно ибупрофен и парацетамол: они опасны", "При свежей травме можно аккуратно охладить место через ткань на короткое время", "Сфотографируйте лапу и возьмите ветпаспорт"];
  }
  if (z === "skin") {
    causes = ["Блохи или другие паразиты", "Аллергия на корм или на окружающее", "Грибковое или бактериальное поражение кожи", "Раздражение от шампуня, химии или рана"];
    specialist = "дерматолог"; specialistWhy = "Разберется с кожей, зудом и проплешинами и подберет обработку."; also = ["терапевт"];
    if (level === "emergency") also.push("хирург");
    advice = [`Наденьте защитный воротник, если ${w.pet} раздирает кожу`, "Не мажьте человеческими мазями и зеленкой", "Вспомните дату последней обработки от блох и клещей", "Сделайте фото участков кожи и возьмите ветпаспорт"];
  }
  if (z === "body" || z === "behavior") {
    causes = ["Инфекционное или воспалительное заболевание", "Боль, тошнота или скрытая травма", "Нарушение обмена веществ или отравление"];
    causes.push(z === "behavior" ? "Стресс, страх или поведенческая проблема на фоне болезни" : "Отказ от еды из-за боли во рту или другого системного состояния");
    specialist = "терапевт"; specialistWhy = "Общее состояние сначала смотрит терапевт, чтобы не пропустить телесную причину.";
    if (z === "behavior" && level !== "emergency") also = ["зоопсихолог"];
    if (answers.collapse === "yes" || symptom.id === "seizure" || symptom.id === "circles") also = unique([...also, "невролог"]);
    if (pyo) { causes.unshift("Пиометра, гнойное воспаление матки: состояние срочное"); also.push("репродуктолог"); }
    advice = ["Не кормите насильно, вода должна быть в доступе", `Запишите, когда ${w.yourPet} в последний раз ${w.adj("ел", "ела")}, ${w.adj("пил", "пила")} и ${w.adj("ходил", "ходила")} в туалет`, "Возьмите ветпаспорт с отметками о прививках и обработке от глистов и паразитов", "Не давайте человеческие лекарства"];
  }
  if (answers.pregnancy === "yes" && !also.includes("репродуктолог") && !specialist.includes("репродуктолог")) also.push("репродуктолог");
  return { paragraph, causes: unique(causes).slice(0, 4), specialist, specialistWhy, also: unique(also.filter((s) => s !== specialist)), advice: advice.slice(0, 5) };
}
