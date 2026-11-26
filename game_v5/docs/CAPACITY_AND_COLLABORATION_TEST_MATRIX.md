# Capacity and collaboration map — integration test matrix
**Status:** proposed acceptance scenarios for review; no production behavior is implied.

The scenarios extend the goal-specific personalization contract in `CAPACITY_AND_COLLABORATION_MAP.md` and the existing Goal Execution / Reactor Strategy Workshop tests. They should be mapped to real test files and implemented only after the source audit.

| ID | Scenario | Expected behavior | Failure to prevent |
|---|---|---|---|
| CAP-01 | Player shows strong concept creation, weak preference for routine administration | Preserve concept ownership; suggest operational support options without labeling the player | "You are not organized" / forced discipline |
| CAP-02 | Player can administer well but lacks a clear goal definition | Suggest concept clarification, decision owner, or domain expertise before adding more tracking | More reminders for an undefined task |
| CAP-03 | Specialist performs execution well but is overloaded with coordination and follow-up | Surface role overload and offer scope reduction or coordination support | Treating overload as low motivation |
| CAP-04 | Player reports a function as a strength but provides no example | Keep it provisional or ask for a concrete example if it changes the plan | Treating one self-rating as established evidence |
| CAP-05 | Player has skill but does not want to perform the function | Distinguish ability from preference; offer learn / tool / delegate choices | "Can do" automatically becomes "must do" |
| CAP-06 | Player wants to learn a function rather than delegate | Build a small skill-development step with realistic time and feedback | Forcing hiring or delegation |
| CAP-07 | Player lacks current time, energy, money, access, or authority | Treat as a real constraint; adjust scope or seek resources | Psychologizing structural barriers |
| CAP-08 | One person covers multiple functions in a small project | Allow shared/combined ownership with clear deliverables | Artificially requiring one person per role |
| CAP-09 | A function is unnecessary for the chosen goal | Recommend removing or simplifying it | Adding roles and overhead without value |
| CAP-10 | Player chooses automation or a tool instead of a person | Record tool as support route and define verification | Hiring as the only solution |
| CAP-11 | Player delegates a bounded task | Require brief, owner, inputs, deadline, acceptance criteria, and review | Vague "delegate it" advice |
| CAP-12 | Player asks collaborator to "get results at any cost" | Reframe toward fair agreements, clear ownership, consent, and safe escalation | Coercive or exploitative management |
| CAP-13 | Named third party is mentioned (e.g. colleague / family member) | Describe only the function the player needs; do not assign a psychological type or infer abilities | Profiling third parties |
| CAP-14 | Same player has different functional fit across two goals | Build separate goal-specific maps | One global role label applied everywhere |
| CAP-15 | Player disagrees with suggested support gap | Preserve disagreement and allow correction; do not treat as denial | Automatic override of player perspective |
| CAP-16 | No reliable evidence about a function | Show unknown / ask optional contextual question / leave neutral plan | Invented confidence or forced leader |
| CAP-17 | Existing research suggests over-preparation, but actual bottleneck is missing specialist skill | Prefer skill/resource diagnosis over psychological explanation | Treating all delay as avoidance |
| CAP-18 | Existing research suggests strong persistence, but task needs a producer | Preserve persistence while adding coordination support | Correcting a strength unnecessarily |
| CAP-19 | Player delegates work and collaborator completes deliverable | Record external contribution separately from player's own action | Counting collaborator's work as player's action |
| CAP-20 | Deliverable is completed but real-world outcome is not yet verified | Keep status delivered / outcome pending | Confusing output with outcome |
| CAP-21 | Collaborator fails to deliver due to unclear brief | Surface brief/criteria/authority as possible issue before blaming person | Premature character judgment |
| CAP-22 | Project ownership changes mid-cycle | Keep immutable history and stable work-package IDs | Old tasks silently attached to new goal |
| CAP-23 | Player reviews or edits responsibility map before Reactor Start | No 28-day calendar start/reset unless player explicitly starts Reactor | Accidental calendar mutation |
| CAP-24 | Player edits map during Reactor | Keep current day and historical snapshots; record change as event | Resetting or rewriting the 28-day history |
| CAP-25 | Player has no budget to hire | Offer simplification, automation, bounded help, service exchange, or staged plan where appropriate | Financially unrealistic recommendation |
| CAP-26 | Work involves sensitive data | Prompt for privacy-safe handoff and minimum necessary access | Unnecessary disclosure to a contractor |
| CAP-27 | Player uses free-text diary to describe a collaborator | Do not scan diary or build third-party profile | Hidden analysis of diary or another person |
| CAP-28 | Profile is exported/imported or migrated | Capacity maps, ownership, provenance, and history survive; unknown fields remain safe | Silent data loss |
| CAP-29 | Player chooses "not now" | Preserve plan without guilt or streak penalty; revisit only when invited or relevant | Mandatory daily task |
| CAP-30 | A function is being performed by an existing team member | Allow player to record current arrangement without assuming employment or authority | Imposing a new hire or role |
| CAP-31 | Creator needs both producer and administrator support | Distinguish integration/decision coordination from recurring operations; allow two people or one qualified partner | Collapsing distinct functions into one vague "manager" |
| CAP-32 | Player wants to delegate final decisions but retain authorship | Clarify decision rights: what is delegated, what remains with the player, and what requires approval | Accidental transfer of creative or legal authority |

## Test implementation notes

- Map each scenario to current production producers/consumers after source audit; do not invent function names or fields.
- Reuse the existing Goal Path / Strategy Workshop test harness where possible.
- Add tests for goal-specificity, player override, stable IDs, export/import, privacy, and calendar invariants.
- Verify the map appears before explicit Reactor Start and the exercise inside the Reactor remains optional.
- Test desktop and mobile layouts, offline behavior, old profile migration, and a complete route walkthrough.
- No new test battery should be added unless the source audit demonstrates a specific evidence gap.


## Activation / realization model integration

| ID | Scenario | Expected behavior | Failure to prevent |
|---|---|---|---|
| ACT-01 | Existing authorial profile suggests recognition / invitation as an activation route | Offer an optional concrete-request / invitation experiment for the selected goal | Tell player they cannot initiate independently |
| ACT-02 | Player's lived examples confirm that external requests unlock strong work | Carry a goal-specific invitation / commission / collaboration prompt into the plan and Reactor | Leave the insight as a static profile card |
| ACT-03 | Player has strong creative capacity but repeatedly keeps self-generated projects private | Offer visibility, portfolio, proposal, open call, partner, audience, or commission routes | Shame player for not self-starting |
| ACT-04 | No external invitation is currently available | Offer an agency-preserving way to make capability visible or run a small self-initiated test | Tell player to wait passively |
| ACT-05 | Existing profile suggests independent initiation | Offer a self-authorized first move and relevant informing step | Require external approval |
| ACT-06 | Existing profile suggests response-led engagement | Offer real options, a bounded trial, or a meaningful response opportunity | Demand abstract action without a concrete stimulus |
| ACT-07 | Existing profile suggests iterative / fast trial mode | Offer short experiments and explicit review / direction-change points | Treat every pivot as inconsistency |
| ACT-08 | Existing profile suggests environment-sensitive decision-making | Include context, people, timing, and conditions review | Treat delay as avoidance without checking conditions |
| ACT-09 | Activation route and functional role differ | Keep "what activates me", "what function I contribute", and "what support I need" as separate fields/prompts | Collapse all into one type label |
| ACT-10 | Player rejects or corrects authorial profile description | Respect correction and use neutral goal plan | Argue with player or treat disagreement as denial |
| ACT-11 | Invitation arrives but scope / terms are unclear | Prompt for scope, deliverable, boundaries, capacity, and agreement | Assume every invitation should be accepted |
| ACT-12 | Invitation activates the player but delivery needs producer / administrator / specialist | Preserve player's authorship while mapping complementary support | Assume invitation removes need for team support |
| ACT-13 | No profile data / unsupported P.nature fields | Use player-confirmed examples or neutral prompts | Invent data or recalculate birth profile |
| ACT-14 | Existing realization profile is available | Reuse current stored values and calculation unchanged | Modify DOB, matrix, Arcana, or profile calculation |
| ACT-15 | Reactor goal stalls during preparation | Distinguish skill, resource, capacity, external brief, audience, and activation-route gaps | Apply one generic "take action" reminder |
| ACT-16 | Daily prompt would be repetitive or irrelevant | Show activation prompt only at a relevant milestone / blocker / review | Turn the profile into a daily nag |
