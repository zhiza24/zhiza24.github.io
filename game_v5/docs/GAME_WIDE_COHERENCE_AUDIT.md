# Whole-game coherence audit and integration contract
**Review branch:** `feature/game-wide-coherence-audit`  
**Base:** `main` at `f05fc482ae38278c9246c5cb2fcbc6d65a86cc55`  
**Audit date:** 2026-11-26  
**Purpose:** a source-grounded review package for the second reviewer/bot. This document does not change production behavior.

## Executive conclusion

The game already has a substantial research and reuse architecture. It is not accurate to say that test results are simply collected and then ignored: BG16, the inner-mechanism lab, the 19-state model, values, the wheel, and other results are consumed by the mirror, hero summary, strategy, practice recommendations, diary, and Reactor in different ways.

The remaining product risk is not the absence of all connections. It is **uneven continuity and explainability**:
- some results have a clear downstream consumer, while others are only stored or shown in one synthesis;
- the same finding can be presented with different levels of certainty in different screens;
- the player is not always shown why a recommendation appeared or which earlier answer informed it;
- some intended Self-thread support in the Reactor is explicitly documented as not automatically connected;
- the new Goal Path layer is not integrated into the production Reactor, and its calendar/identity rules must be reconciled with existing positional goal storage and Start behavior;
- the route, data, and UI need one end-to-end contract so changes do not silently break old saves.

The goal is not to force every test result into every screen. The goal is to make every meaningful result do one or more useful jobs, and to make the reason visible.

## Scope and source hierarchy

This audit uses the current `main` source and the following project contracts:
- `README_AI.md` — current file map, route and storage rules;
- `RESEARCH_MAP.md` — methodological model and data consumers;
- `STATE_MODEL_INTEGRATION.md` — the 19-state evidence rules;
- `SELF_LINKS.md` — result-to-Self-thread map;
- `RELEASE_AUDIT_2026-11-24.md` — latest release hardening and verified test coverage;
- production modules including `flow.js`, `route.js`, `state-engine.js`, `inner-mirror.js`, `strategy.js`, `practice-engine.js`, `wish.js`, `track28.js`, and `reactor-core.js`.

When documents disagree, inspect current source and tests. The release audit is newer than older backlog notes. Do not treat a design document or a separate feature branch as a production capability.

## 1. The player's mental model: what the game should explain

The player should understand five things at every major transition:

1. **What we are exploring now.** A plain-language explanation before a test or practice.
2. **What the result means.** A description of the observed response, not a label for the whole person.
3. **What the result is based on.** The relevant answers, scenes, repeated signals, life areas, or self-reported examples.
4. **What remains uncertain.** Missing evidence, mixed signals, context, and counterexamples.
5. **How this will be useful next.** A visible next step, a relevant question, a strategy adjustment, or an optional practice.

Do not tell the player that the system has discovered their "true type", diagnosed a cause, or proven a hidden belief. Use formulations such as:
- "В этих ответах чаще встречался такой способ реагирования…"
- "Пока это предварительное наблюдение."
- "Похоже, это проявляется в таких-то обстоятельствах."
- "Есть и примеры, которые не укладываются в эту картину."
- "Проверь, насколько это узнается в твоей реальной жизни."
- "Можно оставить вывод без оценки и вернуться к нему позже."

## 2. Research layers: current use and required continuity

### 2.1 BG16 — background state across eight spheres

**Current contract:** results are stored under `P.backgroundProfile.backgroundState` (v2), with draft and repeat history stored separately. The map is a standalone view of repeated first reactions/expectations across eight life spheres. It is not a direct crosswalk into the 19-state catalogue.

**Already used:** GInner synthesis, compact Reactor input, strategy, practice recommendations, hero summary/portrait, and comparison after a retake (verify each consumer in source).

**Required player explanation:** explain which spheres supplied answers, whether there is a clear leading theme or only close signals, and that the result describes a recurring background response rather than a fixed personality. Show the player's own sphere context and allow "узнаю / отчасти / не про меня / пока не знаю" where appropriate.

**Do not:** add BG16 points to the 19-state scores; equate a low sphere rating with a psychological state; treat an unanswered sphere as zero; or turn a one-sphere result into a global trait.

### 2.2 Inner-mechanism laboratory

**Current contract:** ten blocks / sixty items capture triggers, interpretations, emotional and bodily responses, adaptation, cycle maintenance, needs, protective function, costs, resources, and counterexamples. Data is stored in `P.innerMechanism`.

**Already used:** strategy's `testsLayer` and `practRec` read resource and protective signals separately. A family is surfaced only after the documented minimum evidence (at least three answers). A resource signal may suggest an optional support practice. A protective signal should prompt contextual checking and must not automatically trigger a corrective practice.

**Required player explanation:** distinguish "what this response may help with" from "what it may cost"; show that a protective response can be understandable in a real external situation; offer an experiment, not a verdict.

### 2.3 19-state model

**Current contract:** `state-model-data.js` is the descriptive catalogue; `state-engine.js` evaluates only supported structured evidence. Free-text narrative is not automatically analyzed. The NR layer remains deliberately manual/opt-in. BG16, Echo strategies, and adaptation codes are not automatically converted into 19-state evidence.

**Already used:** GInner / Зал зеркал, state-specific discriminators and falsifier prompts, strategy context and selected recommendations.

**Required player explanation:** for each displayed state, show evidence coverage and status; explain why a discriminator is asked; preserve "не знаю"; show counterexamples as limits on generalization rather than deleting the finding. The player may disagree. A disagreement must be stored as feedback, not treated as a scoring error.

**Do not:** broaden crosswalks to make the report look complete; count one answer as several independent confirmations; treat the same underlying response copied into two fields as two sources; imply psychometric validation or diagnosis.

### 2.4 Echo, Mag, Ideal Crooked World, self-betrayal wheel, and situational tests

These modules measure different things: situation choices, emotional interpretations, perception filters, and behavior/support. Keep those roles distinct.

- Mag A1–A4 have explicitly documented direct situation mappings. A9 and other codes may remain context where the contract says so.
- Echo B1–B8 are adaptation strategies, not direct state scores.
- Ideal Crooked World, self-worth, and responsibility scales enter the state engine only through documented crosswalks/discriminators.
- The self-betrayal wheel is behavioral/contextual evidence and an input to daily reflection, not a diagnosis.
- Critical-thinking results should inform how the player checks assumptions and evidence, not be repurposed as a personality label.

**Required:** on a result screen, explain the measured layer in ordinary language and link it to one useful next question or practice only where a supported connection exists.

### 2.5 Values atlas and values

The values atlas has six research layers in the current release: declared orientations, choices under constraint, repeated decisions, episodes, desires/envy/regret, and threat/protection. Adaptive follow-up branching is documented as not part of this release.

**Required downstream use:** the selected values should influence the way a goal is pursued, not only appear as a static top-three list. Strategy should make the connection explicit ("this route protects the value of autonomy because…") and let the player reject or edit the interpretation.

**Do not:** assume that a declared value always wins in a conflict; treat an inferred pattern as more authoritative than the player's explicit choice.

### 2.6 Wheel of Life and factual wheel

Keep distinct:
- the eight-sphere balance wheel (self-rated state);
- the factual wheel / improvement and urgency answers (what the player says needs change, and how urgent it feels).

For desire selection, use the player's own urgency and improvement answers as contextual signals. A low score can help surface a sphere, but it must not automatically decide which desire becomes a priority. Explain the signal in the UI and allow the player to select a different direction.

### 2.7 Desire Lab and Sky of Wishes

The Desire Lab explores meaning, motive, needs, and context. Sky of Wishes collects wishes in eight constellations and allows three directions to be confirmed for the Reactor. The separate quantum/central wish remains separate from the three goal directions.

**Current limitations to verify in source/UI:**
- the constellation suggestions are short chips, not yet a comprehensive annual wish catalogue;
- the existing prioritization is a simple signal score, not a full hierarchy of authentic/borrowed wishes;
- there is no automatic authority to decide whether a wish is "truly yours"; do not add such a verdict;
- the full wish catalogue and lifecycle controls need a clear, lossless path into the Reactor;
- the player should be able to keep all collected wishes, even when they are not in the active three.

**Required product behavior:** show the three proposed priorities with transparent reasons, but let the player confirm or replace them. All three may be in one life sphere. Keep the central/quantum wish separate.

### 2.8 Psychotype / nature

The current project has a `P.nature.primary` signal consumed by the Goal Path prototype and other personalization code. Verify the exact production producer, possible missing/legacy values, and fallback before using it as a hard dependency.

Use this profile only to adapt **presentation and pacing**:
- action-first;
- reflective / understand first;
- creative / experiment;
- structured / step-by-step;
- exploratory / research first.

These are guidance modes, not immutable categories. Explain "может подойти такой формат" rather than "ты такой человек". Always allow a user override. Never let psychotype determine which desire is valid or limit the player to a single method.

### 2.9 Strategy and practices

**Current architecture:** `strategy.js` builds/adapts personal strategy from the profile; `practice-engine.js` owns catalogue, availability, recommendations, activation, and run history. The strategy also consumes values, wheel, BG16/state-model context, and inner-mechanism signals where supported.

**Required:** every recommendation needs a concise "why this is offered" and a source reference (e.g. "ты отметил…", "в нескольких ответах…", "в этой сфере…"). Show no more than a small number of relevant next steps. Separate:
- a resource to strengthen;
- a protective response to observe;
- a skill/resource gap;
- an external constraint that requires practical planning rather than psychological reframing.

Do not make a protective signal auto-activate a practice. Existing practice caps and load safeguards remain in force. Habits and ascetic commitments remain separate user-controlled areas.

### 2.10 Self-thread, Hero, diary, and wow moments

**Current contract:** `P.diary.blocks[]` stores test result summaries; `P.diary.ins[]` stores the player's own insights; `GSelf.insights(P)` gathers without duplicating data; `GHeroSum.build(P)` synthesizes supports, difficulties, and cross-module links; `P.self` stores read scrolls and wow moments.

**Known explicit gap in `SELF_LINKS.md`:** the Reactor's "Возвращение к себе в обычном дне" scroll is not automatically opened on Reactor entry, and the daily Self-thread question is not connected to the day entry. This should be checked against current source before implementation, then either wired in or the contract updated.

**Required:** do not show the same insight repeatedly as if it were new. Distinguish the player's own words from generated interpretation. Let the player revisit earlier insights and see what has changed.

### 2.11 Reactor 28 and Lived Life Mirror

**Current contract:** five Reactor spaces, day records, events and quick marks, state-of-hero measures, wheel baseline and retake, weekly goal steps, practices, habits, ascetic commitments, and final mirror. The Lived Life Mirror uses baseline data, recorded events, mood/energy checkpoints, a new wheel assessment, and repeat research. Missing days are not zero activity; overlapping events are not double-counted as unique time.

**Required:** keep completion share separate from life quality. Do not infer causality from daily signs. When data is sparse, explicitly say the picture is incomplete. Do not treat skipped days as proof of failure.

## 3. Goal Path and calendar contract

The separate Goal Path prototype in PR #22 is not yet production-integrated. It must be reviewed as a separate change set.

Required production integration contract:
1. Keep the entire wish catalogue and all statuses; never discard non-active wishes.
2. Use stable wish IDs. Do not attach history or progress to array positions `[0..2]`.
3. Store each goal's readiness, milestones, weekly steps, minimum action, evidence of progress, obstacle, and if-then response under that stable ID.
4. Reuse Wheel urgency, values, psychotype/nature, existing strategy, and research context without inventing new tests.
5. Readiness changes the first step, not the worth or authenticity of the wish.
6. Allow pause, defer, complete, remove-from-active, and replace. Keep an event history.
7. The player may replace one active direction without changing the other two.
8. The cycle Start action is the only authoritative point that starts the 28-day calendar. Verify and correct any initialization path that writes `T.start` before the explicit Start action.
9. The cycle start date remains immutable for the active cycle. Changing a wish never resets the cycle.
10. Each elapsed calendar day gets a stable day identity. A missed day remains elapsed; it is not silently moved forward or given back.
11. A daily snapshot records the active goal IDs and the relevant plan version for that day. Later goal changes must not rewrite old snapshots.
12. Use local calendar-date arithmetic, test DST transitions, midnight boundaries, travel/time-zone changes, and iOS Safari date parsing.
13. Preserve legacy positional `T.goalSteps[i]` and `directionPlans[i]` until a tested read-through migration exists. Never delete old data during migration.
14. Rebuild or version cached strategy after a goal change; do not keep a stale plan for a previous desire.
15. Include all new state in export/import and automatic backups before release.

**Important route mismatch to reconcile:** the current route contract in `README_AI.md` says `wish.html` is complete only with a declared central wish and exactly three `tracker.directions`. The Goal Path prototype currently describes "up to three" active directions. Decide and document one product rule; do not ship an engine/UI/route mismatch.

## 4. Player-facing explanation standard

Every major result and recommendation should follow this structure:

- **Что ты исследовал:** one plain sentence.
- **Что заметно в ответах:** one to three concrete observations.
- **На чем основано:** name the test, sphere, scene, or repeated answers.
- **Что пока неясно:** missing coverage, mixed signals, context, or counterexamples.
- **Твоя проверка:** "Насколько это узнается?" with "узнаю / отчасти / не про меня / пока не знаю".
- **Что можно попробовать:** one optional small action or question, not a prescription.

For strategy cards:
- "Почему это появилось" must be visible and traceable to source data.
- "Что это даст" should be framed as a possible benefit, not a guaranteed effect.
- "Минимальная версия" should be genuinely smaller, not the same task with a shorter timer.
- "Если помешает…" should be an editable implementation intention.
- The player must be able to say "не подходит" without losing progress.

## 5. Safety, agency, and privacy invariants

- All personal data stays local unless the user explicitly chooses otherwise. No hidden analytics, remote profiling, or network dependency.
- Do not scan free diary text automatically. Explicitly selected text may be used only after a clear opt-in, if such a feature is designed later.
- No diagnosis, treatment claim, or claims of validated psychometric accuracy.
- Do not reframe abuse, unsafe conditions, exploitation, poverty, illness, or external barriers as the player's faulty belief.
- Do not label a wish as borrowed/false. Ask questions and let the player decide.
- Do not force practices or interventions.
- No punishment, lost progress, streak reset, or calendar reset for missed days.
- Preserve the player's raw answers, original timestamps, prior results, and ability to disagree.
- Every derived finding should be traceable to versioned source answers and algorithm version.

## 6. Prioritized worklist

### P0 — correctness and data integrity before integration
- [ ] Reconcile exact-three versus up-to-three direction contract.
- [ ] Make explicit Start the only cycle activation point; migrate existing started cycles safely.
- [ ] Stable goal IDs and ID-keyed plans; preserve legacy progress.
- [ ] Immutable per-day snapshots and lifecycle history.
- [ ] Ensure replacing a goal does not alter previous days, other active slots, or cycle start.
- [ ] Ensure strategy is rebuilt/versioned after goal changes.
- [ ] Include new data in export/import/backup and test round trips.
- [ ] Audit local date/DST/time-zone behavior.

### P1 — complete the result-to-action chain
- [ ] Verify Self-thread tracker scroll/question connection against source; implement if absent.
- [ ] Audit every recommendation from `GStrategy` and `GPract`: source, threshold, reason text, player override.
- [ ] Verify every test result is visible in at least one useful place (result card, Hero, mirror, strategy, practice, or diary) and is not duplicated as a new finding.
- [ ] Make values influence goal execution style and trade-offs, not just display.
- [ ] Add "why this is suggested" and evidence/uncertainty text to strategy and practice cards.
- [ ] Ensure all wishes remain accessible after choosing the active three.

### P2 — comprehension and UX
- [ ] Review every test intro, result, synthesis, and transition for clear explanation.
- [ ] Separate fact, self-report, interpretation, and suggestion visually and verbally.
- [ ] Check long results, low-data states, no-leading-result states, contradictory signals, and returning-player states.
- [ ] Verify gender grammar, "ты" voice, no "ё", readable text on mobile/desktop, keyboard access and focus states.
- [ ] Ensure the player can revisit explanations without repeating the test.

### P3 — release verification
- [ ] Run current Node/jsdom and Chromium suites.
- [ ] Add full interaction walkthrough across all 57 route entries and key branches.
- [ ] Test import/export/restore with old and new profile versions.
- [ ] Test iOS Safari on a real device; current Chromium mobile viewport is not a substitute.
- [ ] Test offline reload, missing Google Fonts, and video poster fallbacks.
- [ ] Re-run deployment smoke after merge.

## 7. Out of scope / separate decisions

- Quantum/central wish mechanics: separate design decision; do not merge with the three goal directions.
- Adaptive values-atlas branching: documented as not part of current release.
- Automatic narrative analysis: not permitted by the current privacy/methodology contract.
- Payments and paid-cycle activation: deferred.
- New server services or remote AI: not required for this layer.
- Changes to Pythagorean, arcana, or birth-matrix calculations: prohibited by current project rules.

## 8. Reviewer instructions

Review current `main`, this audit, PR #22 (Goal Path), and PR #21 (Pattern Map) as distinct change sets.

Return findings in four groups:
1. **Verified implemented** — cite exact file/function and tests.
2. **Partial / inconsistent** — identify the two sides of the mismatch.
3. **Missing / not verified** — state what source or device test is needed.
4. **Risks / regressions** — include severity, reproduction steps, and a proposed fix.

Do not merge, push to main, or silently rewrite production modules. Do not call a feature implemented merely because a specification describes it. For each P0/P1 item, propose a test before proposing a UI patch.
