/* Ветпомощник: свободный поиск по симптомам */
(function () {
  "use strict";
  const norm = (s) => s.toLowerCase().replace(/\u0451/g, "\u0435").replace(/[^a-zа-я0-9\s-]/g, " ").replace(/-/g, " ").replace(/\s+/g, " ").trim();
  const STOP = new Set("у и в во на с со не ни а но что как мой моя мое мои моего моей кот кота коту кошка кошки кошке кошку собака собаки собаке собаку пес пса псу щенок щенка котенок котенка питомец питомца питомица очень сильно все уже есть его ее он она оно они из по за от до без для это когда там тут еще ли бы же то так".split(" "));
  const ENDS = ["иями", "ями", "ами", "ого", "его", "ому", "ему", "ыми", "ими", "ется", "ются", "ится", "ятся", "ает", "яет", "ует", "ешь", "ишь", "ет", "ит", "ут", "ют", "ат", "ят", "ой", "ей", "ий", "ый", "ая", "яя", "ое", "ее", "ые", "ие", "ом", "ем", "ам", "ям", "ах", "ях", "ов", "ев", "ть", "ся", "сь", "а", "я", "о", "е", "ы", "и", "у", "ю", "ь", "й"];
  function stem(w) {
    for (const e of ENDS) if (w.length - e.length >= 4 && w.endsWith(e)) return w.slice(0, w.length - e.length);
    return w;
  }
  function lev(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 9;
    const m = a.length, n = b.length; let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  const tokens = (s) => norm(s).split(" ").filter((t) => t && !STOP.has(t));
  /* 1 = точное или по основе, 0.6 = с опечаткой, 0 = нет */
  function wmatch(q, d) {
    if (q.length < 3) return q === d ? 1 : 0;
    const sq = stem(q), sd = stem(d);
    if (d.startsWith(sq) || (sd.length >= 4 && q.startsWith(sd)) || sq === sd) return 1;
    if (q.length >= 4 && d.length >= 4) {
      let c;
      if (q.length < 6) c = Math.min(lev(q, d), lev(q, d.slice(0, q.length + 1)));
      else c = Math.min(lev(q, d), lev(sq, sd), lev(sq, d.slice(0, sq.length + 1)));
      if (c <= (q.length >= 7 ? 2 : 1)) return 0.6;
    }
    return 0;
  }

  /* разговорные слова -> симптомы. [ключи, id симптомов, вес] */
  const SYN = [
    [["блю", "блев", "тошн", "рвет", "рвал", "рвот", "рыга", "вырв", "стошн", "срыгив"], ["vomit"]],
    [["рвота с кров", "кофейн"], ["vomit"]],
    [["понос", "диаре", "жидк", "дрищ", "обдрист", "жидкий стул", "водянист"], ["diarrhea"]],
    [["не кака", "не какает", "не ходит в туалет", "запор", "твердый кал", "не может покакать"], ["constip", "noPoop"]],
    [["чеш", "чес", "зуд", "чесотк", "расчес"], ["itch", "earScratch", "rubEye"]],
    [["хрома", "хромает", "поджима", "прихрам", "не наступ", "не опира", "ковыля"], ["limp", "noStandPaw"]],
    [["кашл", "кашел", "кашель", "перхает", "кхека"], ["cough", "foamCough"]],
    [["не ест", "не жрет", "не жре", "не кушает", "отказ от еды", "аппетит", "отказывается от еды", "плохо ест"], ["notEating", "lethargy", "appetiteShift"]],
    [["пьет много", "много пьет", "жажд", "постоянно пьет", "пьет воду"], ["thirstBody"]],
    [["писает кров", "кровь в моч", "моча с кров", "розовая моч", "красная моч"], ["urinary"]],
    [["не писа", "не пописа", "не мочит", "мочеисп", "писа", "ссыт", "лоток", "моч", "часто в туалет"], ["urinary", "blockedPee", "painPee"]],
    [["тужит", "по капле", "не может пописать"], ["blockedPee", "constip"]],
    [["больно писать", "кричит в лотке", "больно в туалет"], ["painPee"]],
    [["гноит", "гной", "слезит", "слезы", "текут глаза", "кислые глаза"], ["eyeGoop"]],
    [["глаз", "глаза", "глазик"], ["eyeGoop", "redEye", "rubEye", "squint"], 4],
    [["красный глаз", "глаз красн", "конъюнктив", "опух глаз"], ["redEye"]],
    [["щурит", "прищур", "не открывает глаз", "жмурит"], ["squint"]],
    [["мутн", "бельмо", "белый глаз", "помутн"], ["cloudyEye"]],
    [["третье веко", "пленка на глаз", "пленка"], ["thirdLid"]],
    [["воня", "вонь", "запах изо рта", "пахнет изо рта", "запах из пасти", "пахнет из пасти", "запах"], ["badBreath"]],
    [["лысе", "облыс", "шерсть лезет", "лезет шерсть", "выпадает шерсть", "линя", "пролыс", "плеш", "залыс", "проплеш"], ["itch", "lickPaw"]],
    [["блох", "клещ", "вши", "власоед", "паразит"], ["parasite"]],
    [["глист"], ["scoot", "diarrhea", "parasite"]],
    [["шишк", "опухол", "бугор", "уплотн", "нарост", "комок", "бородав", "шарик под кож", "киста", "узел"], ["lump"]],
    [["судорог", "трясет", "трясет", "дрож", "дрожит", "конвульс", "припад", "эпилеп", "колотит", "дергает"], ["seizure"]],
    [["вял", "лежит", "спит весь день", "много спит", "апати", "слабост", "грустн", "не играет", "нет сил"], ["lethargy", "behLethargy"]],
    [["температур", "горяч", "жар", "лихорад", "горячие уши"], ["feverBody"]],
    [["теплый нос", "горячий нос", "сухой нос"], ["feverBody"], 18],
    [["отрав", "съел", "сожрал", "проглот", "яд", "крысин", "шоколад", "таблетк", "лекарств", "лили", "ксилит", "антифриз", "химию", "лук"], ["poison"]],
    [["оса", "осы", "осой", "пчел", "ужал", "аллерги", "крапивниц"], ["faceSwell"], 16],
    [["укус", "покусал"], ["skinWound", "faceSwell"]],
    [["отек", "отекла", "опух", "раздул", "распух"], ["faceSwell", "pawSwell", "earSwell"]],
    [["упал", "ударил", "удар", "травм", "сбила машин", "сбила", "перелом", "вывих", "выпал из окна", "прыгнул", "ушиб"], ["afterJump", "oddAngle", "limp"]],
    [["лапа под углом", "вывернут", "сломал"], ["oddAngle"]],
    [["течк", "охот"], ["rearDischarge"]],
    [["беремен", "щенн", "котн", "роды", "рожает", "вязк"], ["rearDischarge"]],
    [["петл", "выделения", "из петли"], ["rearDischarge", "earGoop", "nasal"], 6],
    [["кровь из нос", "носом кров", "кровь изо рта"], ["mouthBlood"]],
    [["сопл", "насморк", "из носа", "течет из нос", "нос"], ["nasal", "sneeze"]],
    [["чих"], ["sneeze", "sneezeChest"]],
    [["слюн", "пена изо рта", "пена", "капает слюна"], ["drool"]],
    [["подавил", "давится", "кость", "застрял", "в горле"], ["drool", "poison"]],
    [["зуб", "десн", "клык", "камень на зуб"], ["badTooth", "mouthPain", "badBreath"]],
    [["морда", "губ", "лицо"], ["faceSwell"], 4],
    [["задых", "одышк", "тяжело дыш", "дышит ртом", "часто дыш", "дыхан", "не может дышать"], ["breathing", "openBreath"]],
    [["хрип", "свист", "сопит", "храп"], ["wheeze"]],
    [["устает", "быстро устае", "не может гулять", "сердц"], ["tireWalk", "breathing"]],
    [["вздут", "живот большой", "живот тверд", "раздуло", "пучит"], ["bloat"]],
    [["живот", "пузо", "брюх"], ["bloat", "vomit", "notEating"], 4],
    [["кровь в кал", "кровь в стул", "черный стул", "кал с кров", "кровь в какашк", "кровавый понос"], ["bloodStool"]],
    [["ездит на поп", "елозит", "трется попой", "попой по полу", "анальн", "параанал", "железы"], ["scoot", "lickRear"]],
    [["лижет под хвост", "под хвост", "попа", "задниц"], ["lickRear", "rearDischarge", "scoot"]],
    [["вылизыва", "лижет лапу", "грызет лапу"], ["lickPaw"]],
    [["выпаден", "выпала", "выпадение", "вылезло"], ["prolapse"]],
    [["лапа", "лапу", "лапы", "лапк", "подушечк", "заноз", "коготь", "палец"], ["padWound", "limp", "pawSwell"], 6],
    [["рана", "ранка", "порез", "порезал", "кровоточ", "кровотеч", "разодрал", "поранил", "царапин", "покусали", "драка"], ["skinWound", "padWound"]],
    [["кровь"], ["skinWound", "mouthBlood", "bloodStool", "urinary"], 4],
    [["сыпь", "покрасн", "прыщ", "пятна", "красные пятна", "раздражен"], ["rash"]],
    [["корк", "мокнет", "мокнут", "пахнет кож", "лишай", "грибок", "экзем"], ["crust"]],
    [["перхот", "жирная шерст", "сальн", "тусклая шерст"], ["dandruff"]],
    [["ухо", "уши", "ушко", "ушн", "ушах"], ["earScratch", "earGoop", "earPain"]],
    [["трясет голов", "мотает голов", "трясет ушами"], ["earScratch"]],
    [["наклон", "голову набок", "голова набок", "кривит голов"], ["headTilt"]],
    [["бледн", "синие десн", "синюшн", "белые десн"], ["paleGums"]],
    [["обморок", "потерял сознан", "коллапс", "не встает", "не может встать", "упал и лежит"], ["collapse"]],
    [["похуд", "худе", "потолст", "поправил", "вес", "толст"], ["weightChange"]],
    [["агресс", "кусается", "кусает", "рычит", "шипит", "злой", "бросается"], ["aggression"]],
    [["прячет", "забился", "не выходит", "боится"], ["hiding"]],
    [["скули", "плачет", "ноет", "мяука", "орет", "кричит", "воет", "стонет"], ["whine"]],
    [["кругами", "по кругу", "шатает", "шата", "координац", "паралич", "отказали лапы", "волочит", "не узнает", "заваливается"], ["circles", "headTilt", "collapse"]],
    [["ест несъед", "грызет", "жрет все", "ест землю", "ест траву", "ест кал", "ест какашки", "копрофаг", "ест пакеты"], ["pica"]],
    [["шов", "после операц", "стерилиз", "кастрац"], ["skinWound"]],
    [["трет морд", "трет глаз", "трет нос", "трет лапой"], ["rubEye", "sneeze"]],
    [["не пьет"], ["vomit", "lethargy", "behLethargy"]],
    [["поведен", "странно себя", "изменился характер"], ["aggression", "hiding", "whine"]],
  ];

  let INDEX = null;
  function build() {
    const P = { animal: "dog", sex: "male", sterilized: "no", age: "adult" };
    const w = words(P);
    const seen = new Set();
    INDEX = [];
    for (const s of SYMPTOMS) {
      if (seen.has(s.title)) continue; seen.add(s.title);
      const z = ZONES.find((x) => x.id === s.zoneId);
      let qtext = "", ctext = "", spec = "";
      try {
        qtext = visibleQuestions(s, P).map((q) => q.text(w)).join(" ");
        const r = buildResult(P, s, {});
        ctext = r.causes.join(" ");
        spec = [r.specialist, ...r.also].join(" ");
      } catch (e) {}
      INDEX.push({ s, z, title: tokens(s.title), zone: tokens(z.title), q: tokens(qtext), c: tokens(ctext), sp: tokens(spec) });
    }
  }
  function keyHit(key, nq, qt) {
    if (key.includes(" ")) return nq.includes(key);
    for (const t of qt) {
      if (t.startsWith(key)) return true;
      if (key.length >= 5 && t.length >= 4 && lev(key, t.slice(0, key.length)) <= 1) return true;
    }
    return false;
  }
  function bestIn(qt, list) { let b = 0; for (const d of list) { const m = wmatch(qt, d); if (m > b) b = m; if (b === 1) break; } return b; }

  function searchSymptoms(query) {
    if (!INDEX) build();
    const nq = norm(query);
    if (!nq) return { list: INDEX.map((e) => e.s), exact: true };
    const rawT = nq.split(" ");
    const qt = rawT.filter((t) => !STOP.has(t));
    const score = new Map();
    const add = (id, v) => score.set(id, (score.get(id) || 0) + v);
    for (const [keys, ids, wgt] of SYN) {
      if (keys.some((k) => keyHit(k, nq, rawT))) ids.forEach((id, i) => add(id, (wgt || 10) - i * 0.5));
    }
    for (const e of INDEX) {
      let sc = 0;
      for (const t of qt) {
        sc += 6 * bestIn(t, e.title) + 3 * bestIn(t, e.zone) + 1.5 * bestIn(t, e.sp) + 1 * bestIn(t, e.c) + 0.8 * bestIn(t, e.q);
      }
      if (sc) add(e.s.id, sc);
    }
    const byId = new Map(INDEX.map((e) => [e.s.id, e]));
    const ranked = [...score.entries()].filter(([id, v]) => v >= 1 && byId.has(id)).sort((a, b) => b[1] - a[1]);
    const top = ranked.length ? ranked[0][1] : 0;
    const list = ranked.filter(([, v]) => v >= top * 0.3).map(([id]) => byId.get(id).s);
    if (list.length) return { list: list.slice(0, 12), exact: true };
    /* ничего: 5 ближайших по написанию */
    const near = INDEX.map((e) => {
      let d = 99;
      for (const t of qt.length ? qt : rawT) for (const x of [...e.title, ...e.zone]) d = Math.min(d, lev(stem(t), stem(x).slice(0, stem(t).length + 1)) + (Math.abs(t.length - x.length) > 2 ? 1 : 0));
      return [e.s, d];
    }).sort((a, b) => a[1] - b[1]).slice(0, 5).map((x) => x[0]);
    return { list: near, exact: false };
  }
  window.searchSymptoms = searchSymptoms;
  window.SEARCH_SYN_COUNT = SYN.length;
})();
