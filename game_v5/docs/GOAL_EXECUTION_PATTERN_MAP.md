# Goal execution pattern map
**Status:** review-ready methodology, data-integration, pre-Reactor and Reactor UX contract.
**Target:** integrate existing research before the 28-day Reactor; add a linked practice space inside the Reactor.
**Important:** this is a specification, not a claim that the feature is already implemented in production.

## 1. Purpose

The game should help the player understand not only what they want and what resources they have, but also how they move from intention to action, from action to real-world feedback, and from feedback to a verified result.

A person may be highly motivated and active yet repeatedly miss the result because they avoid a risky step; prepare indefinitely without testing; rush into action without checking assumptions; mistake an early impression, promise, coincidence, or imagined outcome for an actual result; ignore feedback; scatter effort; discount progress or overestimate it; or overlook an external constraint or need for recovery.

The system must examine both under-action and over-action, both protective patterns and effective strengths. It must not equate productivity with progress, speed with effectiveness, caution with avoidance, or rest with failure.

Working chain:

**background state and context → internal rules / expectations → chosen strategy → concrete behavior → contact with reality and feedback → observed result → updated or reinforced internal rule.**

This is an explanatory model to investigate, not a proven causal diagnosis. More than one pathway may explain the same behavior.

## 2. Terminology and safeguards

Use "strategy of responding" / "strategy of moving toward a result", not a fixed "type of person". A person may use different strategies in work, relationships, money, health, creativity, and personal goals. Several strategies may coexist; there may be no single leader.

A strategy can be useful in one context and costly in another. The aim is not to delete a strategy, but to expand the player's repertoire and ability to choose deliberately.

Do not diagnose a personality type; blame the player; infer a hidden belief from one answer; assume every delay is fear or every high activity level is impulsivity; psychologize unsafe circumstances, discrimination, lack of money/time, illness, care duties, missing skills, or other real constraints; treat optimism as evidence that an external result happened; or claim causality from correlations between BG16, strategy signals, and outcomes.

## 3. What to reuse from existing research

Reuse existing evidence first. Do not make the player repeat whole tests merely to populate a new report.

| Existing source | What it can contribute | Limits / correct use |
|---|---|---|
| BG16 across eight spheres | Recurrent background reactions and expectations by life area; context for where a strategy may become more likely | Not a strategy score, diagnosis, or causal explanation. Preserve sphere distinctions and ties / no leader |
| Echo B1–B8 | Adaptation strategies and situational response tendencies; useful signals for withdrawal, postponement, approval, control, struggle, rescuing, etc. | Adaptation codes are not direct 19-state scores and do not prove a current behavior pattern |
| First Settings | Earlier and current ways of adapting; possible continuity or change in protective responses | Do not assume an early strategy is still active now; ask for present-day examples |
| Inner Mechanism (10 blocks / 60 items) | Trigger, interpretation, emotion/body, adaptation, cycle, need, protective function, cost, resource, counterexample | Keep protection and resource separate; retain existing evidence threshold; context and counterexamples matter |
| Self-betrayal wheel | Situations where the player may move away from their needs, choice, or interests | Behavioral/contextual evidence, not a global label |
| Critical-thinking research / discriminators | How the player checks assumptions, evidence, alternative explanations, and conclusions | Use only actual fields and supported results; do not invent a generic score |
| Values atlas | What the player wants to preserve while pursuing a goal; conflicts and trade-offs | Values guide the route, not a verdict on which desire is legitimate |
| Wheel of Life and factual wheel | Areas the player wants to change, perceived urgency, and self-assessment | Context for goal selection and strategy; low score or urgency alone does not identify a psychological mechanism |
| Desire Lab / Sky of Wishes | The player's chosen desire, meaning, motive, and context | The player owns meaning and priority; do not declare a desire borrowed or inauthentic |
| Psychotype / P.nature | Optional adaptation of presentation and pacing: action-first, reflective, creative, structured, exploratory | Not a fixed type, cause, or gate on a goal; allow override |
| Strategy and practice engine | Existing recommendations and practice delivery | Reuse only source-supported signals; recommendations need visible reasons and remain optional |
| Reactor records / diary | Player-entered examples, chosen actions, obstacles, and self-reported feedback over time | Do not scan free-text diary automatically; do not infer causality or treat missing days as zero |

### Required source audit

Inspect current main source and tests, not older descriptions alone. For each source, record exact producer file/function and data path; whether raw answers, derived result, and history are retained; current consumers and fields they read; whether the result is displayed and explained; missing fields or unsupported crosswalks; and whether a new assessment is genuinely needed.

Specifically verify the current critical-thinking module and its stored output before designing new questions. Do not assume that a named test or an item in an older plan is present in production.

## 4. Strategy repertoire to examine

These are candidate patterns for observation, not a closed taxonomy, mutually exclusive categories, or a scoring key. Use neutral language and contextual examples. A person may show a strength and a difficulty in the same domain.

### 4.1 Patterns that can reduce action or delay contact with reality

- Avoidance / withdrawal: moving away from a task, conversation, decision, or exposure when discomfort rises.
- Postponement: repeatedly moving the start or decision to a later date.
- Perfectionistic threshold: waiting for ideal readiness or quality before showing or completing anything.
- Over-preparation: learning, planning, collecting tools, and researching without a real-world test.
- Over-control: trying to remove uncertainty or control others' responses before acting.
- Approval dependence / pleasing: changing or withholding a choice to secure acceptance or avoid disapproval.
- Hyper-responsibility / rescuing: spending resources on others or taking on too much, leaving little capacity for one's own direction.
- Self-devaluation: dismissing one's ability, desire, progress, or right to take up space.
- Pre-emptive defeat / helplessness: treating predicted failure as if it were already established.
- Dispersion: repeatedly switching goals or tasks before a meaningful feedback cycle is completed.
- Over-analysis / decision freeze: continuing to compare options after enough information exists for a safe next experiment.

### 4.2 Patterns that can create activity without verified progress

- Rushing / action bias: acting before clarifying the desired outcome, constraints, or next test.
- Premature conclusion: deciding that a result has happened, failed, or been understood before sufficient evidence is available.
- Imagined-feedback substitution: interpreting hope, intuition, coincidence, a promise, or an ambiguous signal as confirmation of an external outcome.
- Confirmation filtering: noticing information that supports the preferred conclusion and overlooking contradictory feedback.
- Ignoring feedback: receiving evidence from people, customers, circumstances, or the task but not incorporating it.
- Output–outcome confusion: counting effort, messages, plans, hours, or completed tasks as proof that the intended change occurred.
- Premature scaling: increasing commitment, expense, or scope before a small test produces reliable feedback.
- Novelty chasing: repeatedly starting exciting initiatives while leaving learning and completion behind.
- Overcommitment / unsustainable pace: taking on more than available time, energy, money, or support can sustain.
- Overconfidence / under-checking: assuming understanding or success without testing important assumptions.
- Excessive optimization: polishing, measuring, or improving a process beyond what the current goal requires.

### 4.3 Effective strategies and strengths to identify

The report must actively look for strengths, not merely append a positive paragraph. Candidate strengths include timely initiation; persistence with willingness to change method; realistic planning and pacing; focused work and completion; asking for help, collaboration, and delegation; seeking and tolerating honest feedback; testing assumptions with small experiments; distinguishing facts, interpretations, and hopes; noticing overload and recovering; setting boundaries and protecting attention; learning from mistakes without global self-devaluation; celebrating progress while checking the actual outcome; and changing or abandoning a goal when new evidence or values justify it.

A strength can become unhelpful when used rigidly or in the wrong context (persistence without feedback, speed without verification, or carefulness that becomes paralysis). Show both resource and possible overuse only when evidence supports it.

## 5. Pre-Reactor synthesis: Strategy and Feedback Map

Place this synthesis after relevant research and goal selection, but before the player starts the 28-day Reactor. It is a meaningful transition, not another long battery of tests.

### 5.1 Inputs and analysis sequence

1. Gather supported results from existing modules.
2. Keep each signal attached to its source, date/version, life sphere, and evidence coverage.
3. Separate reported answer/behavior; repeated observation; possible interpretation or internal rule; player's confirmation or disagreement; counterexample; external constraint; existing resource/effective strategy.
4. Relate signals to chosen goals and spheres only where evidence supports the link.
5. Examine the complete path: intention → preparation → start → execution → contact with people/circumstances → feedback → verification → adjustment/completion.
6. Identify bottlenecks and strong links in that path.
7. If evidence is insufficient or conflicting, ask a small number of targeted situational follow-ups. Ask about concrete recent situations, not "which type are you?". If no reliable signal exists, say so.
8. Invite the player to check the synthesis, add an example, qualify it, or disagree.

### 5.2 When a new assessment is justified

Add a short targeted assessment only if source audit reveals a real evidence gap. It should examine the full action-and-feedback cycle, not merely avoidance. Candidate situations: wanting something but not starting; starting but not showing/testing the result; receiving unexpected or negative feedback; receiving positive but ambiguous feedback; feeling tempted to conclude too soon; a plan becoming too demanding; choosing between persistence, changing method, pausing, or changing the goal.

Allow "depends on the situation", "not sure", and "no recent example". Do not force a leader. Preserve raw answers and version the assessment. Do not claim psychometric validation.

### 5.3 Player-facing report

1. Your chosen direction: what the player wants to move toward.
2. What already works: evidenced strengths and useful strategies.
3. Where the path may lose contact with the goal: observed bottlenecks, including under-action or unverified over-action.
4. What may be happening: a qualified possible explanation / internal rule, clearly distinguished from an answer.
5. What the strategy protects or provides: plausible function only when supported; otherwise ask the player.
6. What it may cost: time, energy, feedback, clarity, relationships, or opportunity, with context.
7. What reality has shown: distinguish completed outputs from verified outcomes and direct feedback.
8. What is not yet known: missing evidence, contradictory examples, and external constraints.
9. Recommended next experiment: one small, reversible, proportionate test, or a practical resource step.
10. Player correction: "узнаю / отчасти / не про меня / пока не знаю", plus optional example.

### 5.4 Evidence and confidence rules

- One signal: "в этом ответе заметен возможный вариант".
- Repeated signals in one context: "в этих обстоятельствах чаще".
- Similar evidence from genuinely independent sources: "несколько исследований указывают на похожую тему".
- Mixed signals: show both with context.
- No clear leader: show several strategies or "пока недостаточно данных".
- A counterexample limits scope; it does not erase the original signal.
- Disagreement is meaningful feedback, not proof of denial.
- Missing answers are not zeros.
- Do not count the same underlying answer copied into derived fields as independent confirmation.
- Do not infer an internal rule as fact. Present it as a question to test.
- Show the source of each meaningful statement in player-readable language.

### 5.5 How background state relates to strategy

Treat BG16 as a possible context layer, not a deterministic cause. A recurring expectation of rejection may be relevant when the player avoids sharing work, but verify this connection with situational evidence and the player's own account. The same behavior may instead reflect workload, skill gaps, privacy preference, or rational risk assessment.

Do not merge BG16 scores with Echo adaptation codes or strategy-pattern counts. Do not map these automatically into the 19-state model.

## 6. From synthesis to goal execution

The map influences the format and first step of the goal plan, not whether the desire is valid.

Examples:
- Avoidance around exposure → a safe, low-stakes test with a trusted audience.
- Perfectionistic threshold → define a "good enough for first feedback" version.
- Over-preparation → set a learning limit and a small application task.
- Rushing / action bias → define outcome, constraints, and a verification point before action.
- Imagined-feedback substitution → distinguish expectation from observable evidence; define what counts as confirmation.
- Ignoring feedback → schedule a review and explicit adjustment decision.
- Dispersion → choose one current experiment and park other ideas without deleting them.
- Overcommitment → reduce scope and check actual capacity.
- Approval dependence → define the player's own success criterion and one autonomous choice.
- External barrier → practical support, access, time, money, safety, or skill planning; not belief replacement.
- Effective persistence with feedback → preserve it; do not prescribe unnecessary correction.

The player may edit, decline, or replace every recommendation. Do not silently alter their three active wishes.

## 7. Reactor tab: Strategy Workshop / «Мастерская стратегий»

Add a dedicated tab/space to the Reactor, linked to the pre-Reactor map. It is a small, repeatable trainer, not another diagnostic test and not a mandatory daily task.

### 7.1 Persistent player context

Carry forward confirmed strategy observations and corrections; source references and uncertainty; selected goal/sphere context; strengths to preserve; current experiment and review date; and the internal rule the player chose to examine.

Do not copy free-text diary content into automated analysis. The player may intentionally select or type a short example inside this workshop; keep it local and user-controlled.

### 7.2 One training loop

1. Notice: what happened, and which situation/goal does it concern?
2. Name the old move: what did I automatically do, avoid, rush, assume, or overlook?
3. Find the rule/assumption: what did I tell myself, and what did I expect?
4. Critical-thinking check: what are facts versus interpretation or prediction? What supports or contradicts it? What else could explain it? What information is missing?
5. Protect the valid need: was this response trying to provide safety, acceptance, certainty, rest, competence, speed, belonging, or something else?
6. Build a more accurate working thought: not a forced positive affirmation, but a balanced statement that fits the evidence and leaves room for uncertainty.
7. Choose a flexible alternative: action, smaller test, asking for help, setting a boundary, pausing, gathering evidence, changing method, or changing the goal.
8. Run a proportionate experiment: define one small action and observable evidence that would count as a result.
9. Review reality: what actually happened, what feedback arrived, what has not happened yet, and what remains unknown?
10. Update: keep, adapt, or discard the new approach. Record learning, not a pass/fail grade.

### 7.3 Critical-thinking module

Reuse existing critical-thinking work only where actual fields support it. Operational prompts:
- What do I know directly?
- What am I assuming or predicting?
- What evidence would support or weaken this conclusion?
- Am I treating one example as a rule?
- What alternative explanation fits the facts?
- What feedback have I not considered?
- What would count as evidence that my first interpretation was wrong?
- What is the smallest safe way to check?

Do not replace every difficult thought with a positive one. The aim is to test and refine beliefs, not suppress emotion or manufacture certainty.

### 7.4 Modes and safeguards

Offer lightweight modes:
- One-minute check: name the pattern and choose one next move.
- Full investigation: examine the belief, evidence, need, and alternative.
- Experiment review: compare prediction with what actually happened.

The player may record: noticed and chose differently; noticed but deliberately kept the old response; tried the experiment; not ready / need a smaller step; paused for a valid reason; external constraint prevented action; received feedback and adjusted; or result is not yet verifiable.

No streak penalty, guilt language, or forced daily completion. A pause or decision not to act can be effective.

## 8. Data and technical contract

Before implementation, inspect the current profile schema and agree a versioned, local-only structure. Adapt to established conventions and avoid duplicate data.

Conceptual fields: map version and generated timestamp; source module/version/record reference, sphere/context, evidence coverage; observed pattern IDs and status (candidate / player-confirmed / disagreed / needs-more-context); possible internal rule as hypothesis; resource/strength and context; external constraint; player correction and optional example; chosen experiment, observable success/feedback criteria, review date; prediction, actual observation, review decision; immutable event history.

Requirements:
- Stable IDs, not array positions.
- Append history instead of overwriting prior observations.
- Preserve original test answers and snapshots.
- Include new data in export/import/backup/delete-all.
- Offline operation; no remote analytics or diary scanning.
- Save/quota failures are visible and do not claim success.
- Migrate old profiles without losing or reassigning goal history.
- New tab does not reset or pause the 28-day calendar.
- Keep goal identity separate from workshop records.
- Local dates and timezone behavior follow the existing Reactor calendar contract.

## 9. Acceptance criteria

The feature is not complete until source, UI, persistence, and tests agree.

- Pre-Reactor map appears after relevant research and goal selection, before explicit Reactor Start.
- It reuses verified existing results and does not repeat completed tests without a documented evidence gap.
- It includes limiting patterns and effective strengths.
- It examines both action avoidance and action without verification.
- It distinguishes intention, effort/output, feedback, and actual outcome.
- It relates patterns to a chosen goal only where evidence supports the link.
- It can show multiple patterns, mixed evidence, no leader, or insufficient data.
- It distinguishes background state, internal rule, strategy, behavior, context, and result.
- It shows source provenance and allows player correction.
- It does not diagnose, blame, or infer a cause from correlation.
- It distinguishes internal barriers from external constraints and skill/resource gaps.
- Reactor workshop receives the confirmed map and offers the critical-thinking / experiment loop.
- Workshop includes one-minute, full-investigation, and experiment-review modes.
- Player can preserve a useful old strategy, pause, decline, or change the goal.
- New data round-trips through backup/export/import and remains local.
- The 28-day calendar and existing daily snapshots remain unchanged.
- Feature is usable on iPhone Safari and desktop with keyboard accessibility.

## 10. Reviewer deliverables

The second reviewer/bot must return:
1. Source-grounded inventory of existing inputs and exact storage locations.
2. Current consumers and gaps.
3. Classification of each requested behavior as implemented, partial, documented-only, or missing.
4. Recommendation on whether a new assessment is needed, with the smallest evidence gap it would fill.
5. Proposed data contract and migration/export plan.
6. Pre-Reactor placement and route/gate implications.
7. Reactor tab integration points and interaction states.
8. Tests for strengths, avoidance, over-preparation, rushing, premature conclusions, ignored feedback, external constraints, mixed evidence, no leader, disagreement, and missing data.
9. Confirmation that production main was not modified during this review.

Do not implement or merge production code as part of this documentation review.