# Official Challenge Statement Audit

This document is an exhaustive audit of the official NASA Space Apps Challenge text (`docs/CHALLENGE_STATEMENT.md`) against the Sol Keeper codebase and simulation engine.

Every requirement, potential consideration, and "stand out" suggestion from the official text is evaluated with a status of **Done**, **Partial**, or **Missing**, accompanied by file and test evidence.

---

## 1. Requirements, Considerations & Stand-Out Matrix

| # | Statement Clause | Category | Status | File & Test Evidence |
|---|---|---|---|---|
| **1** | *"Design and build an interactive game or app that lets kids ages 7–12 manage a lunar or Martian outpost"* | Objective | **Done** | Core web app in `apps/web`; lunar scenarios `first-light` (`packages/sim/src/data/scenarios/firstLight.ts`), `the-long-night` (`packages/sim/src/data/scenarios/theLongNight.ts`), and Martian outpost `jezero-outpost` (`packages/sim/src/data/scenarios/jezero.ts`). Cadet Reality Dial tier explicitly designed for ages 8–11 (`apps/web/src/dial/types.ts`). |
| **2** | *"Making real decisions about life support, radiation shielding, power budgeting, food production, and communication delay"* | Objective | **Done** | Physics models in `packages/sim/src/models/` (`atmosphere.ts`, `water.ts`, `thermal.ts`, `radiation.ts`, `power.ts`, `food.ts`, `comms.ts`). Interactive levers in `apps/web/src/views/LifeSupport/LifeSupportConsole.tsx`, `PowerConsole.tsx`, and `CommsConsole.tsx`. Validated in `packages/sim/src/validation/`. |
| **3** | *"Experiencing how those choices play out over the course of a simulated mission"* | Objective | **Done** | Discrete hourly physics simulation (`packages/sim/src/engine/tick.ts`), causal logging (`packages/sim/src/engine/log.ts`), replay engine (`packages/sim/src/engine/replay.ts`), and post-mission debrief (`apps/web/src/views/Debrief/DebriefView.tsx`). |
| **4** | *"Turn genuine mission constraints into gameplay: trade oxygen reserves for extra research, reinforce shielding against radiation at cost of power"* | Objective | **Done** | MOXIE produces O₂ and earns science points at the cost of power and requiring un-sheltered crew (`packages/sim/src/models/isru.ts`). SPE event sheltering diverts crew to safe room, turning off greenhouse grow lights and pausing science to preserve power for life support (`packages/sim/src/engine/incidents.ts`, lines 600–620). |
| **5** | *"Represent competing resources so that no choice is free, and every decision teaches something true"* | Objective | **Done** | All physical parameters grounded in NASA technical standards (BVAD NASA/TP-2015-218570, HIDH NASA/SP-2010-3407, OCHMO-TB003/4, APR 8070.1). Every incident response incurs crew-hours, spares, or permanent penalties (`packages/sim/src/engine/incidents.ts`). Routine actions consume pooled crew-hours (`packages/sim/src/engine/crewHours.ts`). |
| **6** | *"Ground your simulation in real NASA open data wherever possible (DONKI, OSDR, Artemis/Mars surface data)"* | Objective | **Done** | Live DONKI feed integration (`apps/web/api/space-weather.ts`); OSDR astronaut health citations (`docs/OSDR_PICKS.md`); Chang'e-4 and MSL RAD lunar/Martian radiation measurements (`packages/sim/src/data/constants.ts`, lines 450–500). |
| **7** | *"Incorporating live or archived NASA datasets, rather than fabricated numbers"* | Objective | **Done** | Live and snapshot fallback mechanism (`apps/web/src/data/liveOrSnapshot.ts`); explicit data verification registry (`apps/web/src/views/DataSources/DataSourcesView.tsx`). |
| **8** | *"Format is open: working prototype that demonstrates trade-off mechanic clearly enough that a young player walks away understanding real constraints"* | Objective | **Done** | Fully functioning, client-side PWA web application with offline service worker support (`apps/web/vite.config.ts`, `apps/web/src/App.tsx`). |
| **9** | *"Creative interpretations of 'outpost', 'site', or 'mission' beyond the Moon and Mars welcome"* | Objective | **Done** | Includes 3 Historical Crisis Replays beyond planetary surface outposts: Apollo 13 translunar return trajectory (`crisis-apollo13-co2`) and Mir space station (`crisis-mir-fire`) in `packages/sim/src/data/crisisScenario.ts`. |
| **10** | *"Target audience is kids ages 7–12, flex to older siblings, parents, classroom"* | Consideration: Audience | **Done** | Reality Dial mechanism (`apps/web/src/dial/types.ts`) provides 3 presentation tiers: Cadet (8–11), Specialist (standard), Commander (classroom/advanced telemetry). Shareable run links in `apps/web/src/share/runLink.ts`. |
| **11** | *"Favor plain language over jargon; where a scientific term is unavoidable, briefly explain in-context"* | Consideration: Audience | **Done** | Dedicated Cadet string tables in `apps/web/src/i18n/en/`; contextual gauge help buttons (`?`) on gauges (`Gauge.tsx`); explanatory drawers (`<details>`) explaining O₂ limits and CO₂ thresholds in `LifeSupportConsole.tsx` (lines 335–365). |
| **12** | *"Low barrier to entry matters — a browser-playable experience with no download or account required"* | Consideration: Audience | **Done** | Zero user accounts, zero authentication barriers, zero external databases; runs directly in browser via client-side state (`apps/web/src/App.tsx`). |
| **13** | *"Pull from NASA's public APIs and open datasets rather than inventing plausible-sounding numbers"* | Consideration: Real Data | **Done** | DONKI API, NASA Horizons (distance/light-time), NASA Images API, Wheeler 2024 crop enrichment data, ISS CDRA performance data. Tested in `packages/sim/src/validation/constants.test.ts`. |
| **14** | *"Clearly attribute your data sources within the tool itself"* | Consideration: Real Data | **Done** | Dedicated Data Sources modal (`DataSourcesView.tsx`) listing every constant, source citation, and confidence rating; persistent footer attribution banner on all views. |
| **15** | *"If live API calls aren't feasible, curated real dataset embedded; don't present static data as live"* | Consideration: Real Data | **Done** | Embedded fallback snapshots in `apps/web/dist/snapshots/`; explicit provenance badges (`Live`, `Snapshot (date)`, `Historical event`) via `ProvenanceBadge.tsx`. |
| **16** | *"Avoid designing a 'safe' choice that has no cost — every decision involving a genuine trade-off"* | Consideration: Pitfalls | **Partial** | All incident options enforce trade-offs. However, certain background actions (authorizing overtime that goes unused, moving crew locations during nominal sols, or switching back to baseline water recycling) incur zero immediate resource cost. |
| **17** | *"Don't let visual polish substitute for mechanical accuracy"* | Consideration: Pitfalls | **Done** | Simulation logic is completely decoupled from React in `packages/sim/src/engine/`, fully deterministic, tested by 25+ automated physics validation test suites (`packages/sim/src/validation/`). |
| **18** | *"Avoid overwhelming young players with too many simultaneous systems; 2–3 core resources vs 5–6"* | Consideration: Pitfalls | **Partial** | Simulation models 6 primary resources (Battery, O₂, CO₂, Water, Food, Cabin Temp) plus spares, radiation, and crew hours. Mitigated at Cadet level by using qualitative status words instead of engineering units, but cognitive density remains moderately high on initial console landing. |
| **19** | *"Stand out: Real-world consequences linked to actual current space weather data"* | Stand Out | **Done** | Real-time DONKI solar flare/CME/SEP feeds in `PowerConsole.tsx` (lines 160–198) and `EstablishingShot.tsx`. Active radiation shelter decisions directly gate crew dose accumulation in `shielding.ts`. |
| **20** | *"Stand out: Replayability — mechanics or events that vary between playthroughs, learn from failure"* | Stand Out | **Done** | TRL-based stochastic failure generation using seeded RNG streams (`rng.ts`, `risk.ts`); 3 distinct baseline scenarios + 3 historical crisis replays; deterministic run replay and sharing (`replay.ts`). |
| **21** | *"Stand out: Accompanying working prototype with short explanation of which NASA datasets were used and why"* | Stand Out | **Done** | Dynamic `DataSourcesView.tsx` with confidence tags and status; comprehensive documentation in `docs/DATA_SOURCES.md` and `docs/OSDR_PICKS.md`. |

---

## 2. In-Depth Operational & Mechanical Measurements

### Metric 1: Flesch–Kincaid Grade of Every Cadet-Depth String
Across the entire repository, **205 core prose Cadet strings** (plus 31 short UI labels) were extracted and scored using the standard Flesch–Kincaid Grade Level formula:
$$\text{Grade} = 0.39 \left(\frac{\text{words}}{\text{sentences}}\right) + 11.8 \left(\frac{\text{syllables}}{\text{words}}\right) - 15.59$$

- **Overall Average Grade Level:** **3.6** (Matches US Grade 3.6, targeting children ages 8.5–9.5, exactly within the 7–12 target range).
- **Breakdown by Module:**
  - `decisionText.json` (45 strings): **3.2** average grade (e.g., *"Put out the fire"* = 0.8, *"Don't fix the leak"* = -2.2).
  - `logText.json` (118 strings): **3.3** average grade (e.g., *"The air cleaner is off. Bad air is building up."* = 0.8).
  - `gaugeHelp.json` (6 strings): **1.6** average grade (e.g., *"How much power is stored up, like a big phone battery for the whole base."* = 4.4).
  - `onboardingText.json` (5 strings): **3.6** average grade (e.g., *"Power: keeps the lights and the base running."* = 3.2).
  - `locales/en.json` (11 cadet keys): **4.3** average grade (e.g., *"Around day 8, a huge dust storm will block the sun for a couple of days."* = 6.4).
  - `decisionText.ts` dynamic phrases (8 strings): **4.1** average grade (e.g., *"This doesn't fully fix the problem — it can keep getting worse."* = 3.6).
  - `goalText.json` (12 strings): **7.0** average grade (elevated due to technical mission objectives).
- **Outliers:**
  - *Minimum Grade:* **-2.2** (`incident.depress-mir97.response.ignoreLeak`: *"Don't fix the leak."*)
  - *Maximum Grade:* **11.3** (`crisis.mirFire.goal.primary`: *"Extinguish the oxygen generator fire and keep all 6 cosmonauts and astronauts alive."*)
- **Score Distribution:**
  - Grade < 0.0: 9 strings (4.4%)
  - Grade 0.0 – 2.0: 34 strings (16.6%)
  - Grade 2.1 – 4.0: 88 strings (42.9%)
  - Grade 4.1 – 6.0: 46 strings (22.4%)
  - Grade 6.1 – 8.0: 18 strings (8.8%)
  - Grade 8.1 – 10.0: 9 strings (4.4%)
  - Grade > 10.0: 1 string (0.5%)

### Metric 2: Gauges, Controls on First Operate Screen, and Taps to First Meaningful Decision
- **First Operate Screen:** By default navigation and tutorial sequence (`COACH_MARK_ORDER` in `apps/web/src/i18n/onboardingText.ts`), the player arrives at the **Power Console** (`PowerConsole.tsx`).
  - **Gauges Visible:** **1 Gauge** (Battery Gauge, showing icon `⌁`, stored kWh, bar fraction, status word, sparkline history, and contextual `?` help button). *(Note: Life Support Console holds 5 gauges; total across the whole app is 6)*.
  - **Controls Visible:** **~37 interactive elements**:
    - *Persistent Shell Header (7):* Mobile Menu toggle, Home, New Mission, Data Sources modal toggle, Reset Layout, Low-power mode toggle, Language toggle (EN/BN).
    - *Station Navigation Sidebar (9):* Power, Life Support, Comms, Incident Command, Mission Command, Habitat, Crisis, Briefing, Debrief.
    - *Dial & Time Controls (8):* Dial level buttons (Cadet, Specialist, Commander); Time controls ("Run the sol" / Pause, Step +1h, +1 sol, Speed toggles 1x/2x/5x/10x).
    - *Onboarding Card (2):* "Skip tutorial", "Next".
    - *Console Interactive Controls (11+):* Battery `?` button, "Clean solar arrays" button, 16 priority reorder buttons (9 priority rows with up/down arrows), Fact Gallery Prev/Next buttons (2), and DONKI external record links.
- **Taps to First Meaningful Decision:**
  - **Standard Setup Wizard Flow:** **11 taps**
    `"Launch Outpost"` on Home (1) $\rightarrow$ 7 `"Next"` taps through Scenario, Difficulty, Crew size, Landing site, Transit, Power arch, Shielding (2–8) $\rightarrow$ `"Launch Mission"` (9) $\rightarrow$ `"Power"` sidebar tab (10) $\rightarrow$ Tap priority arrow $\uparrow/\downarrow$ or `"Clean solar arrays"` during Sol Planning (11).
  - **Fast Bypass (Direct Tab Selection from Setup):** **3 taps**
    `"Launch Outpost"` (1) $\rightarrow$ `"Power"` tab in sidebar (2) $\rightarrow$ Adjust power priority or array cleaning (3).
  - **Historical Crisis Replay:** **3 taps**
    `"Crisis"` tab $\rightarrow$ Select scenario $\rightarrow$ `"Launch Crisis"` (Decision Card is active immediately at hour 0).

### Metric 3: Read-Only Crop, ISRU, and Reactor Controls
All three systems are intentionally rendered as read-only status displays in the UI:
1. **Crop Controls:** Located in `LifeSupportConsole.tsx` (`lifesupport-crops`, lines 398–429). Explicitly labeled: *"Status only — no adjustable crop-task control exists yet."* Lighting accumulation, health degradation, and harvests run purely automatically via `packages/sim/src/models/food.ts`.
2. **ISRU (MOXIE) Controls:** Located in `LifeSupportConsole.tsx` (`lifesupport-isru`, lines 374–390). Explicitly labeled: *"Status only — no adjustable MOXIE control exists yet."* MOXIE regulates against cabin O₂ target and runs automatically in `packages/sim/src/models/isru.ts`.
3. **Reactor Controls:** Located in `PowerConsole.tsx` (`power-reactor-array`, lines 97–153). Explicitly labeled: *"Reactor and array output are read-only — cleaning is the one real lever here."* Fission reactor generation is a static rated capacity with no throttle control.

### Metric 4: Actions Consuming No Crew-Hours
In `packages/sim/src/engine/replay.ts` (lines 44–63) and `incidents.ts`, the following player actions consume **0 crew-hours**:
- **Console Levers:**
  - `rations`: Switching between `nominal`, `mode1`, and `mode2` (0 hours).
  - `priority`: Reordering load-shed priorities with $\uparrow/\downarrow$ (0 hours).
  - `crewLocation`: Moving crew between habitat, greenhouse, safe room, and rover (0 hours).
  - `station`: Reassigning primary duty station for a crew member (0 hours).
  - `commsPriority`: Switching between `critical`, `science`, and `routine` radio queues (0 hours).
  - `co2ScrubberMode`: Toggling duty cycles `full`, `balanced`, or `eco` (0 hours).
  - `thermalControlMode`: Toggling duty cycles `comfort` or `powerSave` (0 hours).
  - `overtimeAuthorized`: Toggling the overtime authorization switch (0 hours upfront; fatigue only accrues at sol end if excess hours were actually drawn).
  - `reorderRepairQueue`: Reordering incident/repair paydown sequence (0 hours).
  - `waterReclamationMode`: Switching to baseline consumes 0 hours. *(Switching to `brineProcessor` consumes 0 hours at click time, but deducts 1.5 crew-h/day at each subsequent day boundary)*.
- **Incident Responses:**
  - All passive/ignore responses declare 0 crew-hours: `fire-mir97` (`ignore`), `depress-mir97` (`ignoreLeak`), `o2tank-apollo13` (`noResponse`), `coolant-ms22` (`rideItOut`), `spe-1972` (`continueOperations`), `duststorm-2018` (`noResponse`), and `scrubber-iss` (`noResponse`).

### Metric 5: Zero-Cost Choices & Data Provenance Labeling
- **Zero-Cost Choices:**
  - Authorizing overtime (`overtimeAuthorized = true`) without subsequently scheduling work above the unboosted budget incurs zero fatigue, zero health penalties, and zero resources.
  - Moving crew members between rooms during nominal conditions incurs zero cost.
  - In `packages/sim/src/engine/goals.ts`, the Jezero outpost primary goal check (`surviveWithDoseUnderLimit`) was found to return `true` unconditionally (as documented in `docs/DECISION_AUDIT.md`).
- **Static Data Displayed Without an "Archived" Label:**
  - External NASA data: `ProvenanceBadge.tsx` displays labels `"Snapshot"`, `"Snapshot (date)"`, `"Historical event"`, or `"Historical event (date)"`, but **never uses the literal word "Archived"**.
  - Leaflet maps (`LandingSiteMap.tsx` / Trek layers) display static orbital imagery without an archival label.
  - Historical Crisis Briefings (`CrisisSelectionView.tsx`) present static telemetry and dates from 1970/1972/1997 with badges like `HISTORICAL CREW (3)` or `APRIL 13, 1970`, not an "Archived" label.
  - Baseline percentiles: `scoring/baselines.json` are static reference files rendered in Debrief without an archival badge.

### Metric 6: Player Free Text Storage & Transmission
- **Result: ZERO player free text is collected, stored, or transmitted anywhere.**
  - **Inputs:** The web UI contains zero text `<input>` or `<textarea>` elements. The only HTML inputs are numeric range sliders (crew size, packing margin) and a read-only copy-link input.
  - **LocalStorage:** Only stores discrete enums and booleans (`"sol-keeper.language"`, `"sol-keeper.dial"`, `"sol-keeper.cockpit-mode"`, `"sol-keeper.accessibility"`, `"sol-keeper.onboarding"`, and panel layout ID arrays).
  - **Network:** Zero outbound telemetry, tracking, or POST requests are made by the client. All client network traffic consists of read-only `GET` requests for static assets and local API endpoints (`/api/space-weather`, `/api/light-time`, `/api/nasa-images`).

