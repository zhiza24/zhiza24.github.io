# Whole-game integration test matrix
**Status:** acceptance criteria for review and implementation.  
**Base release:** main revision `f05fc482ae38278c9246c5cb2fcbc6d65a86cc55`.

This matrix turns the whole-game audit into reproducible checks. A feature is "implemented" only when source, UI, persistence, and tests agree.

## A. Route and progression

| ID | Scenario | Expected result |
|---|---|---|
| ROUTE-01 | Fresh profile opens the route | All 57 route entries resolve; gates match the route contract |
| ROUTE-02 | Returning profile has completed later steps before a route update | Migration does not send the player backwards or erase completion |
| ROUTE-03 | Open a completed test again | Raw answers and first completion snapshot remain intact; retake history is stored separately |
| ROUTE-04 | Skip optional reflection | Player can continue unless the route explicitly requires a choice |
| ROUTE-05 | No leading result / ties / low coverage | Screen explains uncertainty; no fabricated winner |

## B. Result provenance and explanation

| ID | Scenario | Expected result |
|---|---|---|
| EXPL-01 | Open any result card | It distinguishes answer, observation, interpretation, and suggestion |
| EXPL-02 | Recommendation appears in strategy | A visible reason references a real source field and threshold |
| EXPL-03 | Same underlying signal appears in two modules | It is not described as two independent confirmations unless the sources are genuinely independent |
| EXPL-04 | Mixed signals | Both are retained with context; no forced single explanation |
| EXPL-05 | Player selects "не про меня" | Feedback persists and the wording/next step respects it |
| EXPL-06 | Player selects "пока не знаю" | Uncertainty persists; it is not scored as zero or agreement |
| EXPL-07 | A result has no downstream consumer | It remains accessible in the result/diary; do not invent a consumer |

## C. BG16 and inner mechanism

| ID | Scenario | Expected result |
|---|---|---|
| BG-01 | Fewer than three meaningful sphere signals | No global leading theme is invented |
| BG-02 | One sphere has low wheel score but no BG16 evidence | Wheel score is contextual, not a BG16 result |
| BG-03 | Player retakes BG16 v2 | New result is versioned; old raw answers/history remain |
| IM-01 | Fewer than three answers in a mechanism family | Family is not surfaced as an established signal |
| IM-02 | Resource and protective answers coexist | Both are preserved as separate dimensions |
| IM-03 | Protective signal with an external safety constraint | No automatic corrective practice is triggered |
| IM-04 | Counterexample is recorded | It qualifies the scope; it does not erase the original answer |

## D. 19-state model

| ID | Scenario | Expected result |
|---|---|---|
| SM-01 | One supported self-report signal only | At most a preliminary signal; no stable/global label |
| SM-02 | Echo B1–B8 appears | Treated as adaptation strategy/context, not direct state score |
| SM-03 | BG16 appears | Kept outside the 19-state score |
| SM-04 | Mag A1–A4 appears | Only documented direct mappings are used |
| SM-05 | Mag A6/A8/A11/A12 appears | Context only unless current source explicitly supports a direct mapping |
| SM-06 | Ambiguous paired states | Ask the matching discriminator; allow uncertain answer |
| SM-07 | Counterexample exists | Show "гипотеза с исключениями" or equivalent qualified wording |
| SM-08 | Player disagrees | Store feedback; do not coerce agreement |

## E. Values, desires, and goal path

| ID | Scenario | Expected result |
|---|---|---|
| GOAL-01 | Player selects many wishes across eight spheres | All remain in the catalogue |
| GOAL-02 | Player confirms three wishes in one sphere | Allowed; no artificial diversity requirement |
| GOAL-03 | Wheel urgency suggests another sphere | It is shown as context/reason, not forced selection |
| GOAL-04 | Player marks missing skills/resources | First plan stage prepares the missing foundation |
| GOAL-05 | Readiness is "time" | Plan focuses on a realistic rhythm, not skill training |
| GOAL-06 | Psychotype/nature data missing or unknown | Balanced fallback; no crash or invented type |
| GOAL-07 | Player overrides guidance style | Override persists and affects presentation only |
| GOAL-08 | Player replaces one active wish | Other active slots and all old history remain unchanged |
| GOAL-09 | Player pauses, defers, completes, or removes a wish | Status event is appended; old plan remains accessible |
| GOAL-10 | Same wish is selected twice | Duplicate active ID is rejected or explicitly resolved |
| GOAL-11 | Route completion checks the number of directions | UI, engine, and `GRoute.ready` agree on exactly three vs up to three |
| GOAL-12 | Quantum/central wish exists | It remains separate from the three active directions |

## F. Reactor calendar and data integrity

| ID | Scenario | Expected result |
|---|---|---|
| RX-01 | Profile has three wishes but Start has not been pressed | Cycle is not active; no start date is silently assigned |
| RX-02 | Player presses Start | One immutable cycle anchor is recorded |
| RX-03 | Player changes wish on day 8 | Calendar remains day 8; cycle end date does not move |
| RX-04 | Player skips days 3–5 | Those dates remain elapsed/missed; they are not granted back |
| RX-05 | Player changes timezone or DST begins/ends | Calendar-day count follows the chosen local-date contract without duplicate/missing day |
| RX-06 | Goal changes after a day snapshot | Previous snapshot remains byte-for-byte unchanged |
| RX-07 | Player reloads app after replacement | Active goal IDs, plans, history, and calendar restore correctly |
| RX-08 | Export then import after replacements | New and legacy goal data round-trip without loss |
| RX-09 | Storage quota error during save | Player gets a visible save warning; UI must not claim success |
| RX-10 | Legacy positional goal data exists | Migration reads old data, preserves it, and does not attach progress to the wrong goal |
| RX-11 | Strategy cache exists for old goal | Goal change invalidates/rebuilds affected strategy only |
| RX-12 | Player has no daily entry | Day is marked as elapsed/missing, not as zero wellbeing or failure |

## G. Self-thread, diary, and practices

| ID | Scenario | Expected result |
|---|---|---|
| SELF-01 | Open Reactor | Verify whether scroll 12 is shown once and remains re-readable |
| SELF-02 | Open daily entry | Verify whether `GSelf.dailyQuestion()` is present and optional |
| SELF-03 | Existing insight already shown | It is not re-presented as a new wow moment |
| SELF-04 | Player writes a personal insight | It remains distinct from generated interpretation |
| PRACT-01 | Practice is recommended | Recommendation includes reason and remains optional |
| PRACT-02 | Two extra practices are already active | Existing load cap remains enforced |
| PRACT-03 | Player pauses a practice | History is retained; no streak penalty |
| PRACT-04 | Habit and ascetic commitment are used | They remain separate features and data histories |

## H. Lived Life Mirror

| ID | Scenario | Expected result |
|---|---|---|
| MIR-01 | Fewer than 10 records or fewer than 7 recorded days | Report explicitly says the picture is incomplete |
| MIR-02 | Event crosses midnight | Event is split across local calendar days correctly |
| MIR-03 | Two events overlap | Overlap is visible but not double-counted as unique time |
| MIR-04 | Some days are missing | Missing is not interpreted as zero activity |
| MIR-05 | Final wheel and baseline wheel differ | Report compares the two without assuming causality |
| MIR-06 | Final retest is already completed | Handoff does not ask the same questions again |
| MIR-07 | Route gate not complete | Comparison screen remains gated |

## I. Offline, backup, and compatibility

| ID | Scenario | Expected result |
|---|---|---|
| DATA-01 | Export v2 then import | Profile and all known app-owned stores restore |
| DATA-02 | Import legacy v1 backup | Backward compatibility remains |
| DATA-03 | Daily snapshot runs repeatedly in 24 hours | At most one snapshot per intended interval |
| DATA-04 | Delete all game data | Only app-owned keys are removed |
| DATA-05 | New goal-path data added | Included in export, import, backup, restore, and delete-all scope |
| DATA-06 | Offline reload | Required local pages/scripts work; known media fallbacks are clear |
| DATA-07 | Local storage quota is exceeded | Primary data is not silently lost; user sees recovery guidance |

## J. Device and interaction verification

The 2026-11-24 release audit reports Chromium route rendering and a 375px viewport smoke test, but not a physical iPhone/Safari test or a full interaction walkthrough.

Before release:
- [ ] Run all current Node/jsdom tests.
- [ ] Run the current Chromium route smoke test for all 57 destinations.
- [ ] Run a full interaction walkthrough of the critical branches, not only page-load smoke.
- [ ] Test on a real iPhone in Safari, including keyboard, safe-area, date inputs, scrolling, audio taps, and localStorage persistence.
- [ ] Test desktop keyboard navigation and focus states.
- [ ] Test old-profile migration and export/import after goal replacement.
- [ ] Test offline first launch and reload.
- [ ] Verify all text against the copy standard in `PLAYER_EXPLANATIONS_AND_COPY.md`.

## K. Reviewer reporting format

For each failed check, report:
- ID;
- exact file/function;
- severity (P0 data loss / P1 incorrect behavior / P2 explanation or UX / P3 polish);
- reproduction steps;
- expected vs actual behavior;
- proposed smallest safe fix;
- regression test to add.

A checklist item is not passed because the intended behavior is described in documentation. It passes only after the relevant code and test demonstrate it.


## K. Goal execution patterns and Strategy Workshop

Use [GOAL_EXECUTION_PATTERN_MAP.md](GOAL_EXECUTION_PATTERN_MAP.md) as the feature contract. These scenarios are additional acceptance tests, not claims that production currently passes them.

| ID | Scenario | Expected result |
|---|---|---|
| PAT-01 | Existing Echo signal suggests adaptation / withdrawal | Shown as contextual adaptation evidence, not a fixed personality type or direct 19-state score |
| PAT-02 | BG16 and Echo suggest related themes | Kept as distinct evidence layers; no causal claim or double-counting |
| PAT-03 | Inner Mechanism has both protective and resource signals | Both remain visible and distinct |
| PAT-04 | Player has a repeated avoidance / postponement signal | Report names context, source, possible function and cost with qualified wording |
| PAT-05 | Player over-prepares without real-world testing | Report distinguishes preparation from feedback-producing action |
| PAT-06 | Player acts rapidly and makes a premature conclusion | Report asks what observable evidence confirms the outcome; does not label the player impulsive |
| PAT-07 | Player mistakes hope, coincidence, or a promise for verified feedback | Separates expectation, interpretation, and externally observable result |
| PAT-08 | Player receives feedback but does not incorporate it | Offers a review/adjustment experiment, not a blame label |
| PAT-09 | Player records many actions but no verified outcome | Separates output/activity from outcome; preserves the value of effort |
| PAT-10 | Player shows effective persistence and adjusts method using feedback | Identifies this as a strength; does not prescribe unnecessary correction |
| PAT-11 | Player demonstrates focused initiation, realistic pacing, boundaries, recovery, or help-seeking | Strengths are included as evidence-based resources |
| PAT-12 | Player is overloaded or lacks time, money, skill, safety, access, or support | Recommends practical planning/resource steps; does not reframe the barrier as an internal block |
| PAT-13 | Same behavior has multiple plausible explanations | Shows alternatives and asks for context; no forced cause |
| PAT-14 | Signals differ by life sphere | Preserves sphere-specific patterns rather than assigning one global type |
| PAT-15 | No clear leading strategy or low evidence coverage | Says so; no invented leader or score |
| PAT-16 | Player disagrees with a synthesis | Stores correction and respects it in later recommendations |
| PAT-17 | Pre-Reactor synthesis is opened before Start | Shows evidence, strengths, limits, and a player check; does not start the 28-day calendar |
| PAT-18 | Player opens Strategy Workshop | Receives the confirmed map context and can choose a short check, full investigation, or experiment review |
| PAT-19 | Player uses critical-thinking prompts | Separates facts, interpretations, assumptions, alternative explanations, and missing evidence |
| PAT-20 | Player revises a limiting belief | New working thought is balanced and evidence-aware, not forced positive affirmation |
| PAT-21 | Player chooses a pause or keeps an old strategy deliberately | Accepted as a valid choice; no streak penalty or guilt language |
| PAT-22 | Player completes an experiment | Prediction and actual observation are compared; result may remain unverified |
| PAT-23 | Player edits/replaces a goal while workshop history exists | Goal and workshop records remain correctly linked by stable IDs; calendar and snapshots unchanged |
| PAT-24 | Export/import/backup/delete-all after workshop use | All new local data round-trips and is removed only within app-owned scope |
| PAT-25 | Free-text diary contains a relevant phrase | No automatic scanning or inference from diary text |
| PAT-26 | Mobile Safari and desktop keyboard use | Tab, forms, prompts, save feedback, and navigation remain accessible |

Additional reviewer output: classify each input and requested pattern as implemented, partial, documented-only, or missing; identify the smallest genuine evidence gap; verify that production main was not modified.
