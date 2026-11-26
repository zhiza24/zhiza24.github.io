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

## 10. Interpersonal behavior patterns: how a person acts with others

This is an additional lens **inside the same goal-execution and response-strategy map**, not a separate personality system, role model, or standalone test. The map should examine both (a) how the player moves toward a goal and checks results, and (b) how the player tends to interact with other people when pursuing, protecting, negotiating, or revising that goal.

Do not use role labels such as "victim", "aggressor/persecutor", or "rescuer" as player categories, scores, conclusions, or UI language. Do not map the player onto a drama triangle. The product describes observable behavior in a stated context, not who the person is.

### Candidate patterns to observe (not a fixed taxonomy)

**Ways of accommodating or yielding**
- Over-accommodation: routinely adjusting one's preference to avoid tension or preserve acceptance.
- Approval-seeking: checking whether others approve before allowing oneself to choose.
- Over-responsibility: taking on other people's tasks, feelings, or consequences beyond an agreed role.
- Difficulty asking directly: hinting, waiting, or hoping others will infer a need instead of making a clear request.

**Ways of protecting control or position**
- Over-control: trying to determine how others must act or respond before proceeding.
- Pressure / insistence: pushing for agreement or compliance when a request, negotiation, or boundary would be more appropriate.
- Defensive confrontation: moving quickly into argument or counterattack when disagreement appears.
- Competition / comparison: treating collaboration as a contest or measuring one's worth through another person's result.

**Ways of withdrawing or protecting oneself**
- Conflict avoidance: withholding a concern or preference even when it matters.
- Withdrawal after tension: going silent, disengaging, or ending contact instead of clarifying what happened (while recognizing that leaving can be the safest and wisest choice in unsafe situations).
- Self-silencing: minimizing one's own needs or account to keep a relationship calm.
- Distrust / reluctance to delegate: carrying everything alone because relying on another person feels uncertain.

**Constructive and flexible ways of interacting**
- Clear self-advocacy: expressing a preference, need, disagreement, or refusal without attacking the other person.
- Boundaries: naming what is and is not acceptable, and acting consistently with that limit.
- Negotiation and reciprocity: looking for an arrangement that takes both parties' legitimate interests into account.
- Cooperation and shared responsibility: coordinating roles without taking over or disappearing.
- Appropriate help-seeking and delegation: asking clearly and allowing others to carry their part.
- Repair after disagreement: returning to clarify, acknowledge impact, and agree on a next step where safe and appropriate.
- Context-sensitive firmness: adapting tone and level of directness to the actual stakes, power difference, and safety of the situation.

These are examples for investigation, not labels to assign. A single behavior can serve different functions: silence may be thoughtful restraint, lack of safety, fatigue, or avoidance; directness may be healthy assertiveness or coercive pressure. Context and the player's account decide what can reasonably be said.

### Evidence and assessment rules

1. Reuse existing evidence only as a **lead for a question**, never as proof of an interpersonal pattern. Echo/adaptation signals, Inner Mechanism, First Settings, self-betrayal observations, values, and player-confirmed examples may suggest where to ask for context; none of these sources alone establishes a role or a stable interpersonal habit.
2. The existing tests do not currently constitute a validated, comprehensive interpersonal-style assessment. Do not claim that they already determine these patterns.
3. In the source audit, classify each candidate as implemented evidence, partial/contextual signal, documented-only, or missing. Identify exact producer fields and thresholds before any downstream use.
4. If the current structured results do not support a useful observation, add a small optional set of situational follow-up questions to the existing synthesis—not a large new test. Ask about a recent concrete interaction: what happened, what the player wanted, what they did or did not say, what the other person actually did, what the player inferred, and what happened next. Offer "не было такой ситуации / не помню / не хочу отвечать".
5. Preserve sphere and relationship context (work, family, friendship, partnership, service interaction, etc.) where the player chooses to provide it. Do not generalize one interaction to all relationships.
6. Show the observed action separately from the possible interpretation, need/protective function, cost, and alternative response. Include counterexamples and the player's correction. No forced leading pattern.
7. Never infer that a person caused, invited, or deserved another person's harmful behavior. Distinguish interpersonal habits from external coercion, abuse, harassment, discrimination, power imbalance, and unsafe conditions. Safety and practical support take precedence over communication exercises or reconciliation.
8. Do not equate assertiveness with aggression, yielding with weakness, asking for help with dependence, or leaving a harmful interaction with avoidance.

### How this lens connects to goals

When relevant to a confirmed goal, the synthesis may show how an interpersonal habit affects the route: e.g. not making a request, avoiding a negotiation, taking on another person's workload, failing to communicate a boundary, or not seeking collaboration. It may also identify strengths such as negotiation, clear requests, repair, and appropriate delegation. The player decides whether the connection is relevant.

The Reactor Strategy Workshop may let the player rehearse a concrete alternative: formulate a request, boundary, question, negotiation proposal, or repair attempt; anticipate possible responses without pretending to control them; then record what actually happened. The exercise must never pressure the player to confront an unsafe person.

**Product placement:** this is a sub-layer of the existing pre-Reactor Strategy and Feedback Map and its Reactor Workshop. It is not a new gate, a fourth goal, or an additional calendar. If evidence is insufficient, show that clearly and let the player skip it.


## 11. Personalization contract: how the map changes the player's Reactor plan

The purpose of the synthesis is to change the **support and structure of the chosen goal path**, not merely to produce a report. The confirmed map must feed the existing goal breakdown and Reactor tracker. This is a personalization layer within Goal Path + Reactor, not a separate diagnostic layer, a new calendar, or a new set of goals.

### 11.1 What is personalized

For each of the player's active goals, build a goal-specific execution profile from:
- the player's selected goal, sphere, desired outcome, and their own definition of progress;
- confirmed or player-accepted strategy observations relevant to this goal/context;
- strengths the player wants to preserve;
- readiness, skills, resources, time, access, and external constraints;
- the player's preferred support format (including P.nature only where its actual supported fields justify a presentation preference, never as proof of a behavioral habit);
- the player's edits, declines, counterexamples, and experience from previous experiments.

Do not assume that a pattern applies equally to all three goals or all life spheres. The player can confirm a pattern for work but reject it for relationships, for example. If no relevant evidence exists, use the neutral standard plan.

### 11.2 How the goal path is assembled

Every active goal should be broken down using a common structure, then selectively personalized:

1. **Desired outcome:** what would be observably different, and how will the player recognize it?
2. **Milestones:** meaningful intermediate changes, not just a long to-do list.
3. **Next step:** one concrete action appropriate to current readiness and capacity.
4. **Smallest version:** a low-friction version for difficult days, without turning it into a guilt obligation.
5. **Evidence of progress:** what can be observed or verified; distinguish action completed from outcome achieved.
6. **Feedback point:** when and how to check what happened in reality.
7. **Adjustment rule:** what to keep, change, pause, or investigate based on the feedback.
8. **Support / dependency:** skills, resources, people, permissions, money, time, or external conditions needed.

The player reviews and confirms the proposed plan. The system must explain why a step or support format is suggested and allow editing, replacing, postponing, or declining it. It must not silently rewrite the goal or the player's priorities.

### 11.3 Examples of evidence-led adaptation

| Confirmed, goal-relevant observation | Possible plan adaptation |
|---|---|
| Avoids exposure or first contact | Start with a safe, bounded first contact; define a tolerable audience and a small test |
| Waits for a perfect version | Set a fit-for-purpose first version and a feedback threshold before polishing further |
| Over-prepares | Time-box research; pair each preparation block with one application step |
| Acts quickly but skips verification | Define the intended outcome and a check before action; insert a pause-and-verify point |
| Confuses effort/output with outcome | Track both completed actions and the external result separately |
| Expects a response but does not check it | Record the prediction, define what observable feedback would look like, and review it |
| Ignores or dismisses contradictory feedback | Schedule a neutral evidence review and record what would change the current plan |
| Starts too many directions | Keep one current experiment per goal; park other ideas in a visible later list |
| Overcommits | Check actual weekly capacity and reduce scope before adding steps |
| Has difficulty making requests | Add an optional request-preparation step: what is needed, from whom, by when, and what alternative exists |
| Gives way despite a stated preference | Add a preference-clarification or boundary rehearsal where safe and relevant |
| Takes on others' responsibilities | Clarify ownership, dependencies, and what is genuinely within the player's control |
| Uses pressure or over-control | Add a pause, a clear request/negotiation option, and a check of the other person's autonomy and response |
| Has strong persistence and feedback tolerance | Preserve the existing approach; use milestone and outcome checks without unnecessary remedial exercises |
| Faces an external barrier | Add a resource/access/support step or revise timing/scope; do not prescribe positive thinking as a solution |

These are curated examples, not deterministic rules. The map may suggest an adaptation only when the evidence is sufficiently relevant and the player accepts it.

### 11.4 What the Reactor tracker does with the profile

The tracker should not show the full psychological map every day. It should quietly use the agreed plan to surface **one relevant prompt or checkpoint at the moment it helps**:
- at step start: clarify the next action and smallest version;
- before a consequential action: check the known risk (e.g. over-preparation or rushing);
- after action: record what was done, separately from what changed;
- at a feedback checkpoint: compare prediction with observable response;
- at a weekly review: keep, adjust, pause, or replace the approach;
- when the player reports a barrier: distinguish internal uncertainty from missing skill, resource, time, access, or safety.

Examples of short, non-judgmental prompts:
- "Что будет считаться реальным результатом этого шага?"
- "Ты уже подготовился достаточно, чтобы проверить идею на практике?"
- "Какой отклик ты получил, а что пока только предполагаешь?"
- "Что из сделанного было действием, а что уже изменило ситуацию?"
- "Нужно ли сейчас продолжать, изменить способ или сначала найти ресурс?"
- "Какую часть этой задачи действительно важно взять на себя?"

Prompts are contextual and optional. Do not repeat the same prompt every day, turn it into a streak, or treat a skipped answer as evidence.

### 11.5 Three levels of personalization

- **Plan level:** changes the sequence, size, dependencies, and verification points of goal steps.
- **Tracker level:** changes which brief prompts, reminders, and review questions appear and when.
- **Workshop level:** offers a deeper investigation or rehearsal when the player chooses it.

The plan level is the most important. A friendly daily message cannot compensate for a goal plan that ignores the person's actual obstacles, strengths, and circumstances.

### 11.6 Separation from psychotype

Do not create one rigid template per psychotype or assign every player to one strategy. A psychotype/nature result may inform the presentation format only where supported (e.g. more structured vs exploratory prompts). The content of the plan must be driven by goal-specific, context-checked strategy evidence, readiness, resources, and player choice. Several strategies may coexist; the same player may need different supports for different goals.

### 11.7 Persistence and review

Persist the plan version, goal ID, the evidence/reason for each adaptation, player acceptance/edit/decline, step and checkpoint IDs, predictions, observed outcomes, and review decisions. When a goal is paused or replaced, retain its plan and history under that goal's stable ID. New goals receive their own plan; never attach old goal steps to a replacement goal by array position. The 28-day calendar continues independently.

### 11.8 Completion criteria for useful personalization

The feature is useful only if:
- a confirmed relevant observation changes at least one concrete plan element or tracker checkpoint (or explicitly explains why no change is needed);
- every adaptation has a visible reason and can be changed by the player;
- positive strategies are preserved, not automatically "corrected";
- tracker prompts distinguish action, output, feedback, and outcome;
- different goals can have different profiles for the same player;
- insufficient evidence produces the neutral plan rather than invented personalization;
- the player can see and edit what the system is using;
- goal history and the 28-day calendar remain intact.
