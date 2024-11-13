1. Header, add: "M10 (seeded links, mission report) and M11 (Bangla shells, device test) are
   complete. Extend them; do not rebuild."
2. M13, replace the Crisis Replay line with:
   - Crisis Replay: Apollo 13, the 1972 storm and the Mir fire are available at every depth.
     At Cadet depth, fire and depressurization text stays calm and non-graphic (no injuries
     described), routed through presentation/crewLoss.ts or a new presentation/hazardText.ts.
     The Black Box and "What NASA did" card still appear.
3. M13, replace the Bangla line with: "Export all Junior view, Briefing, Decision Card and
   Debrief strings to docs/i18n/bn_review.csv as a priority batch for the native reviewer."
4. M15, replace the OSDR bullet with:
   - Use @docs/OSDR_PICKS.md as the ONLY source of astronaut-science cards. Build
     scripts/fetch-osdr.ts (I run it) to save study metadata to docs/api-samples/osdr_*.json
     and generate public/snapshots/astronaut-science.json. Render only cards with
     verified:true. Label them "Archived NASA data (OSDR)".
   - RadLab card: follow the UNIT RULE in OSDR_PICKS.md. Never plot absorbed dose and dose
     equivalent on the same axis.
5. M16, ?playtest=1: also record whether each Big Idea check was answered correctly on the
   first try.


## Amendments from STATEMENT_AUDIT.md

### Verify first (report only, before M13)
V1. Jezero primaryGoal: docs/DECISION_AUDIT.md says surviveWithDoseUnderLimit returns true
    unconditionally; M7.7 says it was replaced. Run a seed where all science is skipped and
    assert the primary goal is FALSE. If it returns true, fix it before anything else and keep
    the test permanently.
V2. Does /api/mission-debrief exist, and does the client call it? Report yes/no with file
    evidence.
V3. Where is science produced? List what generates science points, whether the player
    assigns it, and what it costs in crew-hours, power and air. Same for crop tasks, ISRU
    and cleaning.
V4. Extend the readability script to Briefing, Debrief, ScoreCard reason strings, crisis
    briefings, coach marks and any Cadet strings built at runtime.

### M13 targets (measurable; audit baselines in brackets)
- "Play" on Home starts First Light in Junior view with defaults, skipping the 7-step wizard
  (the wizard stays for Free Play). First meaningful decision in <= 30 s and <= 3 taps
  [11 taps]. "Meaningful" = a choice a later gauge visibly reflects, not just any control.
- First Junior screen has <= 10 interactive elements [~37]: 3 gauges (Air, Power, Shield),
  ONE pending decision, Play/Pause, help, menu. Speed toggles, the dial switch and the 9-item
  sidebar are hidden until unlocked.
- At Cadet depth, replace the nine-row arrow priority list with three big choice cards
  ("When power is low, protect: the crew / the science / the garden"), each mapping to a
  preset priority order and showing its price. Commander depth keeps the full list.
- Merge O2 and CO2 into one "Air" gauge at Cadet depth, with detail one tap away.
- Relabel the Cadet age band as 7–12 in dial/types.ts and any copy that says 8–11.
- Readability: bring goalText (avg 7.0), the 28 strings above grade 6 and the crisis goal
  strings (max 11.3) to <= grade 5. Ignore negative grades; Flesch–Kincaid is meaningless for
  three-word sentences. Add a hard-word rule: every domain term (radiation, shielding,
  battery, sol, light-time, oxygen) is wrapped in <Term>.
- Provenance: add "Archived" wording to ProvenanceBadge. Label Trek imagery, crisis briefings
  and baselines.json (as "practice crew results") as archived reference data.

### M14 additions
- Replace the read-only crop and MOXIE panels with real levers: tray count and light schedule;
  MOXIE on/off or power share. The reactor stays fixed-output: hide it in Junior view and
  label it honestly in Commander view.
- Free levers: crew location moves and station reassignments cost a small crew-hour or
  fatigue transition. Show overtime's cost at the moment it is authorized.
- Make "Research Opportunity" a PLAYER choice that spends air, power or dose margin for
  science. Automatic MOXIE science does not satisfy the statement's own example.

## Amendments 2 (from the pre-M13 verification)

### Do first
A1. Keep Jezero goal tests permanently: (a) 0 science -> primaryGoal false; (b) target met,
    all crew alive, dose under limit -> true; (c) idleBot never reaches it.
A2. Remove apps/web/api/mission-debrief.ts from the deployed API surface. First report
    whether it calls api.anthropic.com and whether an Anthropic key is configured. Remove any
    docs or README claim that an AI debrief exists.

### Cadet copy (before the Bangla export)
A3. Write dedicated Cadet strings at <= grade 5 for: the 51 mission guides (separate cadet
    keys; Specialist keeps the current text), the 6 crisis briefings, the 9 debrief/ScoreCard
    callouts, goalText (12) and the 28 strings above grade 6. Sentences <= 10 words, active
    voice, one idea per sentence, concrete nouns, domain terms wrapped in <Term>.
A4. Debrief best/costliest lines are generated from the decision's causal chain:
    "On day {n} you {action}. That {effect}." No generic praise.
A5. Readability check ignores strings under 4 words. A science teammate signs off on accuracy.

### Reorder
M13 = Junior shell + First Light, Storm Warning, Hello Earth missions.
M14 = science redesign + crop and MOXIE levers + the Green Thumb mission (it needs the levers).

### M14 science redesign
- Harvests give food only. MOXIE oxygen gives no science points (an optional one-time
  "technology demonstration" bonus is allowed). Comms science uplink no longer closes the goal.
- Research is a PLAYER choice: Lab run, Sample trip (EVA), Extended experiment, each with
  its price shown at Cadet depth. Check whether the engine has an EVA/airlock air cost; if
  not, STOP and ask before adding one.
- Set scienceTargetPoints so the goal needs about 2-3 chosen tasks per mission.
- Crop lever: garden light schedule trading growth against power. MOXIE: power-share lever.
- Free actions (crew moves, station reassignments) cost a small crew-hour or fatigue
  transition; show overtime's cost when it is authorized.
- After the redesign, re-run the balance harness and report whether the Flight-Rated
  prudentBot rate moved. Do not tune hazard rates first.