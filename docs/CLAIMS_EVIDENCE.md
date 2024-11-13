# Claims & Evidence Matrix

This document provides a comprehensive audit of every strong claim made across the Sol Keeper repository, `README.md`, video script, and project page. Every claim is cross-referenced directly against an automated test suite, an authenticated entry in the **Data Passport** (`docs/DATA_PASSPORT.md`), or the automated simulation balance report (`docs/BALANCE.md`).

A dedicated section lists every known limitation, unverified citation, or claim lacking direct empirical measurement.

---

## 1. Verified Claims Matrix

| # | Claim Statement | Source Document | Evidence Type | Evidence File / Registry Row & Verification Details |
|---|---|---|---|---|
| **1** | *"Every number the simulation uses traces back to a published NASA source or a disclosed, clearly-labelled gameplay estimate. Nothing is invented silently."* | `README.md` §1 | Automated Test & Registry | `apps/web/tests/sourceVerification.test.ts` asserts that 100% of physical constants in `packages/sim/src/data/constants.ts` link to an authenticated entry in `docs/DATA_PASSPORT.md` (59 cataloged rows). |
| **2** | *"One simulation, shown at three depths. The simulation itself never changes between levels — only how it's explained. Flip the dial mid-mission and the numbers underneath stay identical."* | `README.md` §The Reality Dial | Unit Test & Pure Model | `apps/web/tests/dial.test.ts` asserts that toggling between Cadet, Specialist, and Commander depths updates presentation strings and units while `SimState` numerical properties remain bit-identical. |
| **3** | *"Cadet depth is calibrated for young audiences with an average Flesch–Kincaid reading level of Grade 3.6."* | Project Page & Video Script | Readability Audit | `docs/STATEMENT_AUDIT.md` §2 Metric 1 audits 205 Cadet prose strings across 7 modules using standard Flesch–Kincaid scoring (mean grade: 3.6, targeting ages 8.5–9.5). |
| **4** | *"Deterministic simulation: identical seed and inputs generate byte-identical outcomes every run."* | `README.md` §Tech Stack | Validation Suite | `packages/sim/src/validation/determinism.test.ts` verifies bit-identical final `SimState` hashes across repeated runs given the same initial seed and input log. |
| **5** | *"Pure TypeScript simulation engine with zero DOM, fetch, Date.now, or Math.random dependencies."* | `README.md` §Tech Stack | Static Analysis Test | `packages/sim/src/validation/purity.test.ts` scans package ASTs and execution context to enforce pure functional determinism. |
| **6** | *"Verified by 75 automated test suites and 691 automated unit and validation tests."* | `README.md` §Tech Stack | Test Runner | Vitest runner (`pnpm test`): 75 test files passed, 691 tests passed (0 failures). |
| **7** | *"Balance verified across 4,050 Monte Carlo seeds using three automated bot architectures (idleBot, greedyBot, prudentBot)."* | Project Page | Simulation Harness | `packages/sim/src/validation/balance.test.ts` & `docs/BALANCE.md` (150 seeds $\times$ 9 scenario/difficulty configurations $\times$ 3 bots = 4,050 simulated runs). |
| **8** | *"PrudentBot clears >=85% success on Training and >=70% on Nominal; idleBot stays <=5% on Nominal and Flight-Rated."* | `docs/BALANCE.md` | Benchmark Assertions | `packages/sim/src/validation/balance.test.ts` asserts bot win rate boundaries established in `docs/PHASE2_BRIEF.md`. |
| **9** | *"Integrates real NASA DONKI space weather telemetry for solar flares and particle events."* | `README.md` §Data Sources | API Integration & Test | `apps/web/api/space-weather.ts`, `apps/web/src/data/spaceWeather.ts`, `apps/web/tests/todayOnTheSun.test.ts`, Registry row `API-DONKI`. |
| **10** | *"Uses real lunar and Martian orbital photography basemaps via NASA Moon Trek and Mars Trek."* | `README.md` §Credits & Licenses | Basemap Layers | `apps/web/src/components/LandingSiteMap.tsx`, `docs/trek_layers.md`, Registry rows `TREK-MOON` (LRO WAC) and `TREK-MARS` (Viking MDIM2.1). |
| **11** | *"Computes real-time interplanetary radio signal delays via JPL Horizons ephemeris."* | `README.md` §Data Sources | Serverless API & Test | `apps/web/api/light-time.ts`, `apps/web/tests/server-lib/horizons.test.ts`, Registry row `API-HORIZONS`. |
| **12** | *"Integrates peer-reviewed space biology research findings from NASA Open Science Data Repository (OSDR)."* | `README.md` §Data Sources | Data Catalog & Test | `apps/web/src/data/astronautScience.ts`, `docs/OSDR_PICKS.md`, `apps/web/tests/astronautScience.test.ts`, Registry row `OSDR-OMICS`. |
| **13** | *"100% offline-ready Progressive Web App via service worker precaching."* | `README.md` §Built for Classroom | Build Artifact | `apps/web/vite.config.ts`, VitePWA precaches 121 entries (10,722 KiB), verified via production build `pnpm build`. |
| **14** | *"Zero player free text collected, stored, or transmitted; zero analytics tracking; zero runtime AI calls."* | `README.md` §Credits & Licenses | Security Audit | Grep scan confirms 0 calls to `api.anthropic.com` or `api.openai.com`; `docs/STATEMENT_AUDIT.md` §2 Metric 6 confirms 0 text input fields and 0 external telemetry requests. |
| **15** | *"Bilingual from day one: English and বাংলা (Bangla)."* | `README.md` §Built for Classroom | Localization Suite | `apps/web/src/i18n/locales/en.json` and `bn.json`, validated by `apps/web/tests/i18nCompleteness.test.ts`. |
| **16** | *"Every Decision Card drawn from real spaceflight emergencies (Mir fire, Progress collision, Apollo 13, Soyuz MS-22, 1972 SPE, 2018 dust storm, ISS CDRA)."* | `README.md` §Real Incidents | Historical Citations | `packages/sim/src/data/incidents.ts`, Registry rows `NASA-SP4030-MIR`, `SHUTTLE-MIR-PROGRESS`, `A13-CO2`, `SOYUZ-MS22-COOLANT`, `KNIPP-2018-SPE`, `JPL-DUSTSTORM2018-TAU`, `CMARIK-KNOX-2019-CDRA`. |
| **17** | *"Five distinct station consoles with specialized operational responsibilities."* | `README.md` §Five stations | Component Structure | `apps/web/src/views/` (`PowerConsole.tsx`, `LifeSupportConsole.tsx`, `CommsConsole.tsx`, `IncidentCommandConsole.tsx`, `MissionCommandConsole.tsx`). |
| **18** | *"Accessible by construction without relying on color alone."* | `README.md` §Built for Classroom | CSS & Component Rules | Every resource gauge pairs an SVG status icon, pattern hatch, and textual state word (`apps/web/src/components/Gauge.tsx`), verified in `apps/web/tests/render.test.tsx`. |
| **19** | *"Mission of the Day features a daily rotating challenge with live space weather telemetry."* | `README.md` §Built for Classroom | Component & Test | `apps/web/src/components/MissionOfTheDayCard.tsx`, `apps/web/src/data/spaceWeather.ts`, `apps/web/tests/todayOnTheSun.test.ts`. |
| **20** | *"Today on the Sun monitors real-time space weather flare alerts and particle flux from NASA DONKI."* | `README.md` §Built for Classroom | API & Component Test | `apps/web/src/components/TodayOnTheSun.tsx`, `apps/web/api/space-weather.ts`, `apps/web/tests/todayOnTheSun.test.ts`. |
| **21** | *"Fast Play provides 1-click launch from the landing page directly into the mission briefing."* | `README.md` §60-Second Judge Path | UI Action & Test | `apps/web/src/components/ui/modern-hero.tsx`, `apps/web/tests/render.test.tsx`. |

---

## 2. Disclosed Gaps and Unverified Claims

To maintain complete scientific and engineering integrity, the following items are disclosed as unverified, simplified, or lacking direct empirical flight measurements:

| # | Item / Claim | Nature of Gap / Limitation | Current Mitigation & Document Reference |
|---|---|---|---|
| **1** | **Unverified Landing Site Parameters (7 rows in Data Passport)** | Primary scientific papers were consulted (SWIM 2021, Luzzi 2025, Wueller 2026, AIP 2023), but direct quote confirmation by an independent human auditor is marked `☐ Unverified`. | Explicitly flagged in `docs/DATA_PASSPORT.md` rows 55–61 (`NASA-M2020-LANDING`, `NASA-MSL-LANDING`, `SWIM-2021`, `LUZZI-2025`, `NASA-ARTEMIS-CLR`, `WUELLER-2026`, `AIP-2023-REGOLITH-SHIELD`). |
| **2** | **"Every decision costs crew-hours"** | Routine console shifts (farming lighting schedules, science downlink prioritization, and air scrubber modes) consume 0 crew-hours; only incident responses and physical repairs deduct from the daily pooled crew-hours budget. | Disclosed in `docs/BALANCE.md` §Known Limitations #1. |
| **3** | **Component Failure Rate MTBF** | Base hourly component failure probability (`componentRiskBaseChancePerHour = 0.0045/h`) translates to an artificial 222-hour MTBF, tuned for gameplay pacing rather than true flight-hardware reliability (2,000–20,000 hours). | Disclosed in `packages/sim/src/data/constants.ts` and `docs/BALANCE.md` §Known Limitations #2 as a `"tuned"` gameplay constant. |
| **4** | **Static Data Archival Badging** | Some static historical datasets (e.g. historical crisis dates, basemap tiles) do not render the literal word `"Archived"` in every UI context. | Disclosed in `docs/STATEMENT_AUDIT.md` §2 Metric 5; `ProvenanceBadge.tsx` uses `"Snapshot"` or `"Historical event"`. |
| **5** | **Historical Jezero Goal Logic Gap** | In earlier versions of `packages/sim/src/engine/goals.ts`, the function `surviveWithDoseUnderLimit` returned `true` unconditionally before being patched in Milestone 10. | Tracked and verified resolved in `docs/STATEMENT_AUDIT.md` §2 Metric 5 and `packages/sim/src/validation/jezeroGoal.test.ts`. |
