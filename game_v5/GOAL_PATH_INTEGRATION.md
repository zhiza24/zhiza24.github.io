# Goal Path Planning Layer — isolated review branch

**Branch:** `feature/goal-path-planning-layer`  
**Base:** `main`  
**Scope:** goal decomposition, readiness, personalization, stable goal identity, lifecycle history and fixed 28-day calendar.  
**Status:** isolated engine + tests + integration contract. No published route or production module is changed by this branch.

## Product decisions

1. The eight life-wheel areas and the existing wish constellation remain the discovery layer. The engine reads wheel scores and `wheelTest.spheres[].improvements` as context, including the user's own urgency answers.
2. The engine never decides whether a wish is authentic, borrowed, or "wrong". It does not infer motives or classify the person. The selected wish remains the user's decision.
3. After choosing up to three directions, each direction gets a short readiness check:
   - the basics are already available;
   - time/rhythm is the main constraint;
   - one or more skills/resources are missing;
   - the foundation is not yet in place.
   Missing items are user-selected. A result changes the first step, not the value of the wish.
4. The style of guidance is adapted from the already-collected `P.nature.primary` (initiator, observer, creator, architect, researcher). It changes the way the next step is presented, not the goal itself. The user can override the style.
5. Each goal can be cascaded into: desired outcome → first milestone → four weekly stages → action → minimum version → evidence of progress.
6. Each plan includes a light WOOP/implementation-intention prompt: wish, desired outcome, likely obstacle, and "if X happens, I will do Y". These are editable prompts, not mandatory forms.
7. Habits remain in their own Reactor tab. Goal plans may link to an existing habit later, but do not create a parallel habit tracker.
8. No punitive streaks, lost XP, reset-to-zero counters, or penalties for missed days.

## App patterns adopted

- **Griply:** life areas → goal → subgoals → linked tasks/habits. We reuse the hierarchy, not its interface.
- **GoalsOnTrack:** multi-level subgoals and milestones. We reuse progressive decomposition without forcing a long SMART questionnaire.
- **Dreamfora:** convert an ambition into suggested small actions. We reuse editable starter scaffolds; no opaque auto-plan.
- **TickTick:** calendar and habit/task visibility. We reuse calendar awareness only; habits already exist in Reactor.
- **WOOP / if-then planning:** anticipate one likely obstacle and decide in advance on a small response.

## Engine files

- `goal-path-engine.js` — pure UMD module; no DOM, network or direct localStorage access. Functions:
  - `wheelSignals`, `priorityContext`, `contextFor`: read wheel/wish/strategy signals without modifying source data;
  - `styleFor`: map the existing nature profile to a guidance style;
  - `assessReadiness`, `scaffold`: create a user-editable 4-week plan and WOOP prompt;
  - `registerGoals`, `attachPlan`: stable IDs and ID-keyed plans;
  - `activateCycle`, `calendarDay`: anchor the cycle to its original calendar date;
  - `snapshotDay`: create a once-only daily snapshot;
  - `replaceActiveGoal`, `setGoalStatus`: preserve status history and active-slot changes without resetting the cycle.
- `tests/goal-path-engine.test.js` — Node built-in tests.
- This document — integration and review contract.

## Calendar and change rules

- The cycle start date is the single calendar anchor. Replacing, pausing, deferring or completing a wish never changes it.
- A day number is derived from local calendar dates, not elapsed 24-hour blocks, so daylight-saving transitions do not shift the calendar.
- A daily snapshot is created once and is never rewritten after a wish changes. Later changes are recorded as timestamped events in `goalPath.history`.
- Goal plans are keyed by stable wish IDs, not `goalSteps[0..2]`. Existing positional `goalSteps` must not be deleted until a migration is tested.
- Replacing one active direction affects only that slot. A wish already active in another slot cannot be duplicated.
- The existing 28-day cycle is not restarted; missed days remain elapsed calendar days and are not granted back.

## Existing code findings to account for during integration

- `wish.js` stores wish IDs and writes selected directions to `P.tracker.directions`.
- `strategy.js` already uses `P.nature.primary`, decision facets, wheel data, values and research outputs. Do not rebuild this personalization from scratch. Reuse its strategy as an input/context layer.
- `track28.js` currently stores weekly steps in positional `T.goalSteps[i]`; this is unsafe when a direction changes.
- `track28.js` currently computes day number from `T.start`, but its initialization path can assign `T.start` when three directions exist, before the visible "Начать 28 дней" action. Integration must make the Start action the only authoritative activation point (with a safe migration for already-started cycles).
- `reactor-core.js` currently renders four weekly steps and reads the directions by array position. Integrate ID-keyed plans without destroying legacy progress.
- Existing direction changes should be available from the "Мои желания" area; replacement must write history and leave the cycle anchor unchanged.

## Suggested integration sequence (do not perform before review)

1. Add `goal-path-engine.js` to the script loading order on the Reactor page only.
2. On Start, call `activateCycle(T, now)`; persist the original anchor and freeze the initial three goal IDs.
3. At day open, call `snapshotDay(T, day, now)` only if no snapshot exists for that date/day.
4. Build readiness and plan drafts for each active direction, using existing strategy outputs and `nature.primary`; let the player edit/confirm.
5. Move weekly plan storage to `T.goalPath.plans[goalId]`; provide a read-through migration for `T.goalSteps[i]` and retain old records.
6. Add lifecycle controls to "Мои желания": pause, defer, complete, remove, replace. Replacement uses `replaceActiveGoal` and never changes `T.start`.
7. Keep all existing wish and tracker source fields. Do not scan free diary text, send data to an external AI, or introduce network dependencies.
8. Include the new local data in the app's existing export/import and backup flows before any production release.

## Review checklist for the second bot

- [ ] Check that the branch is based on current `main` and does not alter it.
- [ ] Run `node --test game_v5/tests/goal-path-engine.test.js`.
- [ ] Review DST/local-date behavior on iOS Safari and desktop browsers.
- [ ] Verify stable IDs for legacy directions without IDs and duplicate titles.
- [ ] Verify that replacing one goal does not change the other two active slots.
- [ ] Verify that old daily snapshots remain unchanged after a replacement.
- [ ] Verify that history survives reload/export/import after later integration.
- [ ] Verify that readiness and psychotype only shape the suggested route, never determine which desire is "real".
- [ ] Verify accessibility, small-screen layout, long text and keyboard operation once UI integration is built.
- [ ] Do not merge into `main` until the author approves the review.

## Explicitly not included in this branch

- No changes to `wish.js`, `wish.html`, `strategy.js`, `track28.js`, `reactor-core.js`, navigation, service worker or production storage.
- No UI integration into the live Reactor yet.
- No new tests or scores that judge the person or the authenticity of a wish.
- No automatic goal switching, no automatic "three best goals" override, and no changes to the separate quantum wish mechanism.
