# Release audit — 24.11.2026

This document reconciles the independent static audit with the current source and records the hardening completed for the release candidate. It distinguishes implemented code from checks that still require a real browser, device, or deployment.

## Verified current structure

- The main route contains **57 steps**: 22 at Point 0, 9 at A, 19 at B, 4 at C, and 3 final steps.
- All 57 route entries resolve to existing HTML files. They use 20 distinct route pages.
- The main task runner loads 44 local scripts; all are present in the service-worker precache.
- All route HTML pages are present in the precache. The precache list contains 235 existing local assets.
- The service-worker cache is version v34 (235 unique precache entries). The worker is registered from the shared theme entry on supported secure origins. `ver.txt` remains unchanged by design, per the updater contract in `README_AI.md`; `upd.js` continues to manage the `?u` URL parameter.
- BG16 is followed by the 10-section / 60-item inner-mechanism lab, then the Ideal Crooked World step.
- Referenced local images, stylesheets, audio, video sources, and posters are checked by `tests/asset-integrity.test.cjs`. Used audio is precached. Chromium smoke confirms that the Elder voice plays after a user tap and both cinematic videos decode and play online. Video files are intentionally not precached because of their size; each video screen has a local cached poster fallback.
- The Elder screen uses the existing `media/voice.mp3` from its explicit sound button. The former map-page reference to the nonexistent `snd/author.mp3` was removed. The first-visit author scroll now contains finished text instead of a placeholder; author narration is not included because no matching audio file is present.

## Data integrity and privacy

- Backup envelope v2 includes the main profile plus standalone lab data, sound/theme preferences, book progress, birth-preview draft, author/cutscene progress, and dynamic `alch_v5_scroll_*` keys.
- Version 1 backups remain importable. Importing a v1 backup preserves settings and reading progress that the old format never contained.
- Imports accept only known app-owned storage keys; arbitrary browser storage keys are rejected.
- A local automatic snapshot is created at most once per 24 hours after a profile save. The device keeps the latest three snapshots. Backup failure does not block the primary profile save.
- Settings now provide export, import, restore, and an explicit delete-all action. Deletion removes only game-owned `alch_v5_*` keys and `alch_samost` from local/session storage; unrelated browser storage is preserved.
- The current diary is stored in the profile (`P.diary`). The separate `alch_v5_diary` store cited in the external audit is not used by the current diary screen.

## Research and strategy integration

- BG16 and the inner-mechanism lab remain separate evidence sources.
- Inner-mechanism resource and protective signals now enter the personal strategy as separate preliminary self-report signals. A family is surfaced only after at least three answers in that family.
- A resource signal may suggest one optional supporting practice. A protective signal is presented as a question to check against real episodes and external circumstances; it does not automatically trigger a corrective practice or get forced into the 19-state model.
- The 19-state engine evaluates structured self-report and situation-choice evidence. Free-text narrative is not automatically analyzed; this is an explicit methodological/privacy boundary, not an unfinished AI integration.
- In «Идеальном Кривом Мире», «Не знаю» is excluded from scoring and coverage rather than counted as zero; saved results from the earlier scoring rule are recalculated from their original answers the next time that result screen is opened.
- The «Карта ценностей» now validates the 5–8 selection inline and enforces the eight-item maximum.
- The values atlas has six research layers: declared orientations, choices under constraint, repeated decisions, episodes, desires/envy/regret, and threat/protection. Adaptive follow-up branching is not part of this release.
- The separate «Разбор убеждений» remains an optional bonus laboratory, not a mandatory route step.

## Reactor and Lived Life Mirror

- «Зеркало прожитой жизни» is implemented in `track28.js`; the old “tab stub” assessment is stale.
- It uses the initial wheel and research answers, recorded events with start/end times and contextual fields, mood/energy checkpoints, a new wheel assessment, and 24 repeat research questions.
- Overnight events are split across calendar days; overlapping intervals are reported separately and are not double-counted as unique time.
- Missing days do not become zero activity and do not block the repeat research.
- The final handoff respects route gates: the Reactor final checkpoint must be completed, then the prefilled retest step is completed before the comparison screen opens. The retest page no longer asks the same questions again if the mirror retake is already complete.
- Daily “signs” remain a place to record details that drew attention, but they are not treated as a success factor or evidence of causality. Weekly plan completion is labeled as a share of checked plan items, not as a measure of life quality.

## Regression checks

The GitHub Actions suite now checks:

- JavaScript syntax for the main route, profile engine, Reactor, service worker, BG16, inner mechanism, strategy, and practice engine;
- existing passport, mirror, profile, route, task, and BG16 tests;
- all 57 route targets and the required order of BG16 → inner mechanism → Ideal Crooked World;
- the 10 × 6 inner-mechanism question bank, unique item IDs, and valid family labels/groups;
- all local scripts and route pages in the service-worker precache;
- backup v2 import, v1 compatibility, daily backup rotation, and scoped deletion;
- Lived Life Mirror overnight/overlap accounting, report rendering, and route-gated handoff;
- strategy use of inner-mechanism signals and its minimum-evidence safeguards;
- local asset resolution, offline audio, cached video posters, and inline-script syntax;
- non-causal wording for signs and weekly progress;
- inline validation and scoring behavior when a player answers «Не знаю»;
- 375px mobile viewport layout smoke coverage.

## Still not verified / deliberately deferred

- A focused desktop Chromium smoke suite passes: the map, inner-mechanism lab, new-player Reactor strategy, diary, hero, Elder, and cutscene screens open without page errors or missing local responses; the Elder voice and both cinematic videos play; the service worker installs and the mechanism lab reloads while offline.
- A 375px Chromium mobile-viewport smoke test checks the map, mechanism lab, Reactor, diary, hero, Elder, and cutscene for horizontal page overflow. This is not physical iPhone/Safari testing.
- A full end-to-end walkthrough of all 57 steps and every branch has not been run.
- The user's own iPhone/Safari test is deliberately deferred until the source and media are frozen.
- Payment integration is deliberately deferred.
- GitHub Pages build/deployment completed successfully for main commit `9ca83400d9f45cebe4b3c897d0b625ec4ad482c9`. The web viewer in this session could not independently fetch the live URL, so the final visual check should still be made in a normal browser.
- Google Fonts are external; if unavailable offline, local/system font fallbacks are used.
- MP4 files are not precached offline; their poster images are cached and remain visible as fallbacks.
- Author narration for the map-page scroll is not included until an actual author audio file is supplied.

## Release statement

The code hardening was merged into main in commit `ac1ef374afde38e2d9f367ef2903a7155af04d13`; subsequent main commits added shared service-worker registration, preliminary-strategy safeguards, and desktop browser smoke coverage. GitHub Pages deployment succeeded on `9ca83400d9f45cebe4b3c897d0b625ec4ad482c9`. The automated suite reports 704 local references resolving to existing assets. The app is deployed and passes focused desktop Chromium checks; do not describe it as fully device-tested or fully offline-tested until the real iPhone/Safari check and full 57-step walkthrough are completed.
