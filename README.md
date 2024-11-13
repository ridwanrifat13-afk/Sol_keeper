# Sol Keeper

**Junior Astronaut Mission Trainer** — a NASA Space Apps Challenge 2026 submission for
*"Build a Junior Astronaut Mission Trainer"*.

**Live app:** [build-a-junior-astronaut-mission-tr.vercel.app](https://build-a-junior-astronaut-mission-tr.vercel.app) · **Static About Page:** [`about.html`](apps/web/public/about.html)

Sol Keeper is a browser-based, offline-ready mission simulator designed for students ages 7–12 (with depths flexing to high school and classroom use) that transforms deep space survival constraints into gameplay. Operating lunar and Martian outposts across 5 training missions and 3 historical crisis replays, players make real decisions across five station consoles—balancing life support, power load shedding, radiation sheltering, food production, and communication light delays. Every number the simulation computes traces directly to authenticated NASA technical standards (BVAD, OCHMO, APR 8070.1) or real space weather and orbital telemetry (DONKI, OSDR, Horizons, Trek). Through the **Reality Dial**, the same deterministic physics engine is presented at three cognitive depths—Cadet (visual gauges, qualitative status words, Flesch–Kincaid Grade 3.6), Specialist (SI engineering units), and Commander (mathematical rates and equations)—ensuring that no choice is free and every decision teaches something true.

Built by **Projonmo Apollo**, from CUET.

---

## 60-Second Judge Path

Experience the core mechanics, real data grounding, and Reality Dial in 60 seconds:

1. **0:00 – Launch in One Click**:
   - Open the live app and click **[Fast Play (Jezero Outpost)](https://build-a-junior-astronaut-mission-tr.vercel.app/?fastPlay=1)** (or launch with pre-configured telemetry via [Deep Link](https://build-a-junior-astronaut-mission-tr.vercel.app/?v=9&sc=jezero-outpost&d=nominal&cs=4&site=jezero&p=solarBattery&sh=regolithBerm&sd=42)) to bypass setup and land directly on the Mission Briefing.
2. **0:15 – Review Real Space Agency Data**:
   - Inspect the Martian environmental conditions (30 sols, solar-only architecture, impending 60-hour dust storm). Check **Today on the Sun** for real solar flare telemetry from NASA DONKI and inspect the **Astronaut Science** card derived from NASA OSDR space biology studies.
3. **0:30 – Experience the Reality Dial**:
   - Tap **Cockpit** to enter the visual command deck. Click **Run the Sol** to advance mission time. Toggle the **Reality Dial** in the header from **Cadet** (simplified icons and plain-word status, Flesch–Kincaid Grade 3.6) to **Specialist** (numerical values in kW, kg/day, mmHg) to **Commander** (rate equations). Notice that the underlying simulation state remains byte-identical.
4. **0:45 – Execute a Genuine Trade-Off**:
   - Open the **Life Support Console** to toggle the CO₂ scrubber or Brine Processor Assembly (saving water at the cost of 1.5 daily crew-hours), or open the **Power Console** to reorder the load-shedding priority list before nightfall. Every decision enforces a real resource cost—no action is free.
5. **1:00 – Verify Scientific Traceability**:
   - Click **Data Sources** or **Data Passport** in the header or footer. Inspect all 59 cataloged datasets, each with its primary source reference (BVAD, OCHMO, NASA NTRS, Science, Frontiers) and verification status.

---

## Judges Guide

### Challenge Statement Requirements

| Requirement Clause | Sol Keeper Feature | Where to See It | Evidence & Verification |
|---|---|---|---|
| **Kids ages 7–12 managing a lunar or Martian outpost** | Core web simulation with Martian outposts (*Jezero Outpost*, *Storm Watch*) and lunar bases (*First Light*, *The Long Night*, *Green Thumb*). | Homepage Launch Windows & Setup Wizard | `packages/sim/src/data/scenarios/`, audited in [`docs/STATEMENT_AUDIT.md`](docs/STATEMENT_AUDIT.md) (Clause 1). |
| **Real decisions on life support, radiation, power, food, comms** | Five operational consoles (Life Support, Power, Comms, Incident Command, Mission Command) with 11 distinct active control levers. | Cockpit View and Station Tabs | `packages/sim/src/models/`, validated in `packages/sim/src/validation/`. |
| **Competing resources; no choice is free** | Zero-sum resource mechanics: Brine Processor recovery costs 1.5 crew-h/day; CO₂ enrichment accelerates crops but risks hypoxia; sheltering halts science and grow lights. | Life Support dials, Incident Command, Decision Cards | `packages/sim/src/engine/crewHours.ts`, `packages/sim/src/validation/co2ScrubberDutyCycle.test.ts`, `packages/sim/src/validation/waterReclamationMode.test.ts`. |
| **Grounding in real NASA open data (DONKI, OSDR, surface data)** | Real solar flare & CME feeds via DONKI; NASA OSDR space biology research cards; MSL Curiosity & Chang'e-4 surface radiation measurements; NASA Trek LRO/Viking maps. | Today on the Sun, Astronaut Science, Landing Site Map | `apps/web/api/space-weather.ts`, [`docs/OSDR_PICKS.md`](docs/OSDR_PICKS.md), [`docs/DATA_PASSPORT.md`](docs/DATA_PASSPORT.md) (59 rows). |
| **Plain language over jargon (accessible to young kids)** | Cadet Reality Dial tier written at average Flesch–Kincaid Grade 3.6; contextual `?` help buttons on all gauges; inline explanations for technical terms. | Dial Switch (Cadet mode), Gauge `?` buttons | Scored in [`docs/STATEMENT_AUDIT.md`](docs/STATEMENT_AUDIT.md) §2 Metric 1 (205 strings, 3.6 avg grade). |
| **No NASA insignia; full data attribution** | Zero NASA logos or insignia anywhere in the application (compliant with Challenge rules); comprehensive in-app attribution modal and Data Passport. | Footer disclaimer, Data Sources view, Data Passport view | `apps/web/src/views/DataSources/DataSourcesView.tsx`, [`docs/CREDITS.md`](docs/CREDITS.md). |
| **Replayability & learning from failure** | 5 standard scenarios + 3 historical crisis replays; deterministic seed-based RNG; 1-click Try Again / Rewind; post-mission Big Idea concept checks. | Crisis Selection View, Debrief, Big Idea checks | `packages/sim/src/engine/replay.ts`, `apps/web/tests/tryAgainRewind.test.ts`, `apps/web/tests/bigIdeaCheck.test.ts`. |

### Official Space Apps Judging Criteria

| Criterion | Project Execution | Where to See It | Evidence Link |
|---|---|---|---|
| **Impact** | Solves the STEM translation gap by turning authentic space agency engineering trade-offs into playable, age-tiered learning without dumbing down the science. | Reality Dial (Cadet mode), printable Mission Report, reproducible run links | [`docs/STATEMENT_AUDIT.md`](docs/STATEMENT_AUDIT.md), `apps/web/src/share/runLink.ts` |
| **Creativity** | Reality Dial architecture (one immutable, deterministic simulation engine powering three cognitive presentations); dual-mode dashboard + photographed 3D cockpit. | Dial switch, Cockpit mode toggle, Crisis Selection view | `apps/web/src/dial/types.ts`, `apps/web/src/cockpit/CockpitTarget.tsx` |
| **Validity** | 100% of physical simulation parameters trace to peer-reviewed agency literature. Pure TypeScript engine validated by 75 test suites, 691 tests, and a 4,050-seed Monte Carlo bot balance suite. | Data Sources, Data Passport, test suite | `packages/sim/src/validation/` (691 tests), [`docs/BALANCE.md`](docs/BALANCE.md), [`docs/DATA_PASSPORT.md`](docs/DATA_PASSPORT.md) |
| **Relevance** | Directly answers the challenge brief: kids ages 7–12 managing lunar/Martian bases, making real resource decisions grounded in real NASA open datasets. | 5 training missions, live DONKI feeds, OSDR science cards | [`docs/CHALLENGE_STATEMENT.md`](docs/CHALLENGE_STATEMENT.md), [`docs/STATEMENT_AUDIT.md`](docs/STATEMENT_AUDIT.md) |
| **Presentation** | Fully responsive, offline-ready PWA with zero download or login barrier; bilingual (English & বাংলা); WCAG AAA contrast; scroll-contained modals; print-ready debriefs. | Live web app, language switch, PWA service worker | `apps/web/src/styles.css`, `apps/web/tests/render.test.tsx` |

---

## The Reality Dial

The core idea: **one simulation, shown at three depths.**

| Depth | Audience | What changes |
|---|---|---|
| Cadet | Ages 8–11 | Pictures and bars — plain-word status, icons |
| Specialist | Ages 12–14 | Real numbers and units |
| Commander | Ages 15+ | Thresholds, rates, and the underlying equations |

The simulation itself never changes between levels — only how it's explained. Flip the
dial mid-mission and the numbers underneath stay identical.

## Five real missions & three historical crisis replays

### Training Missions

| Mission | Body | Site | Length | Defining hazard |
|---|---|---|---|---|
| Jezero Outpost | Mars | Jezero Crater | 30 sols | A 2018-scale global dust storm |
| First Light | Moon | Connecting Ridge | 31 days | One 354-hour polar night |
| The Long Night | Moon | Connecting Ridge | 89 days | Three lunar nights, reactor-powered |
| Green Thumb | Moon | Marius Hills | 14 days | Closed-loop lunar greenhouse & crop light schedule |
| Storm Watch | Mars | Jezero Crater | 3 days | NASA DONKI-archived May 10, 2024 extreme solar storm |

### Historical Crisis Scenarios

| Crisis Scenario | Spacecraft / Station | Historical Date | Key Emergency |
|---|---|---|---|
| Apollo 13 CO₂ Buildup | LM Aquarius | April 1970 | Improvised square-to-round LiOH scrubber adapter |
| Solar Particle Event 1972 | Apollo Outpost (Descartes) | August 1972 | Extreme solar proton storm evacuation to regolith shelter |
| Mir Space Station Fire 1997 | Mir Kvant-1 Module | February 1997 | Solid-fuel oxygen candle (Vika) fire and smoke mitigation |

Mission Setup also lets a player choose difficulty, crew size (2–6), landing site, power
architecture (solar/battery, fission, or hybrid), and shielding approach (hull only,
water wall, or a regolith berm) — each real trade-off computed live from the same sourced
constants, not a second set of numbers. Or, jump straight into action with **1-Click Fast Play** or the daily rotating **Mission of the Day**.

## Real incidents, not scripted drama

Every Decision Card a player faces is drawn from real spaceflight history, not invented
for the game:

- **Fire aboard Mir**, February 1997
- **Progress–Mir collision and depressurization**, June 1997
- **Apollo 13's CO₂ scrubber failure** and improvised fix
- **Soyuz MS-22's coolant leak**, December 2022
- **The August 1972 solar particle event**
- **The 2018 Mars global dust storm** that ended *Opportunity*'s mission
- **Recurring ISS CO₂ scrubber (CDRA) failures**

## Five stations, one crew

Power, Life Support, Comms, Incident Command, and Mission Command each get their own
console — reachable as a classic dashboard or, on desktop, a photographed "cockpit" view
with the real consoles mapped onto physical screens. A sixth tab, Habitat, renders a live
cutaway of the outpost itself. In **Cadet mode**, younger learners get an illustrated visual cockpit with dedicated Air Gauges and simplified priority cards.

## Built for the classroom, not just the browser

- **Offline after first load** — a service worker precaches the app shell, station art,
  and NASA snapshot data, so a spotty school network doesn't stop a mission mid-sol.
- **Mission of the Day & Live Space Weather** — daily UTC rotation ladder tied to NASA DONKI solar flare telemetry.
- **NASA OSDR Astronaut Science Cards** — peer-reviewed space biology studies integrated into briefings and mission logs.
- **Try Again / Rewind** — students can rewind station decisions back to Sol Planning to evaluate how alternative choices affect outpost survival.
- **Big Idea Concept Checks** — formative conceptual science questions reinforcing the physics and operational trade-offs of each scenario.
- **Accessible by construction** — state is never carried by colour alone: every gauge pairs an icon, a pattern, and a status word; all modal dialogs support scroll containment and Lenis smooth-scroll isolation.
- **Two languages from day one** — English and বাংলা (Bangla), including every Decision
  Card, mission guide, and gauge explanation at all three Reality Dial depths.
- **No NASA insignia anywhere** — per the Challenge's own branding rule. Every dataset is
  credited in text, below.

## Data sources

Every physical or mission parameter in `packages/sim/src/data/constants.ts` carries a
`source`, a `confidence` (`measured` / `derived` / `tuned` / `placeholder`), and — for
anything short of a direct measurement — a disclosed note on how it was derived. The full
registry, including per-document page/table references and verification status, lives in
[`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md). The sections below group that same
registry by what it's used for.

#### Life support & crew physiology

| Source | Used for |
|---|---|
| [NASA BVAD (2022)](https://ntrs.nasa.gov/citations/20210024855) | Crew O₂/CO₂/food/water rates, metabolic rate, ESM factors, crop cycles |
| [NASA OCHMO Radiation Protection Brief](https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf) | Career/per-event radiation dose limits |
| [NASA OCHMO Crew Survivability Brief (TB-047)](https://www.nasa.gov/wp-content/uploads/2024/07/ochmo-tb-047-crew-survivability.pdf) | Survival-mode kcal/water/temperature/CO₂ thresholds |
| [NASA OCHMO Habitable Atmosphere Brief (TB-003)](https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-003-habitable-atmosphere.pdf) | Habitat oxygen set point and sea-level-equivalent ppO₂ |
| [NASA OCHMO CO₂ Technical Brief (TB-004)](docs/DATA_SOURCES.md) | CO₂ immediately-dangerous-to-life-or-health threshold |
| [NASA HRP Acute Radiation Syndrome evidence report](docs/DATA_SOURCES.md) | Onset/severe/lethal acute radiation dose bands |
| [Resupply mass for life support (ICES-2017-87)](https://ntrs.nasa.gov/api/citations/20170010337/downloads/20170010337.pdf) | Open-loop resupply mass per crew-day |
| [NASA water recovery milestone](https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station) | ISS water recovery rate (93→98%) |
| [ISS air/water recovery review, Frontiers (2024)](https://www.frontiersin.org/journals/space-technologies/articles/10.3389/frspt.2024.1461389/full) | O₂ recovery from CO₂, recovery goals |
| [MOXIE completes its Mars mission, MIT AeroAstro](https://aeroastro.mit.edu/news-impact/oxygen-generating-experiment-moxie-completes-mars-mission) | MOXIE production rate and total yield |
| [Elevated-CO₂ salad crop study (2024)](https://www.tandfonline.com/doi/full/10.1080/17429145.2023.2292219) | Crop CO₂-enrichment growth-rate shape |
| Space Biology and Medicine (NTRS), Nutritional Biochemistry of Spaceflight (NTRS), cold-survival study (NTRS) | Thirst/starvation/hypothermia survival clocks |

#### Radiation

| Source | Used for |
|---|---|
| [Hassler et al. 2014, *Science*](https://doi.org/10.1126/science.1244797) | Mars surface radiation dose |
| [Zeitlin et al. 2013, *Science*](https://doi.org/10.1126/science.1235989) | Earth–Mars cruise radiation dose |
| [Zhang et al. 2020, *Science Advances*](https://www.science.org/doi/10.1126/sciadv.aaz1334) | Moon surface radiation dose |
| [Knipp et al. 2018, *Space Weather*](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2018SW002024) | 1972 solar-storm electronics/solar-array degradation |
| [Al Zaman & Kunja 2023, *AIP Advances*](https://pubs.aip.org/aip/adv/article/13/8/085108/2905736) | Regolith + polymer shielding effectiveness |

#### Power & engineering mass

| Source | Used for |
|---|---|
| [NASA Fission Surface Power](https://www.nasa.gov/exploration-systems-development-mission-directorate/fission-surface-power) · [IAC 2024 status](https://ntrs.nasa.gov/api/citations/20240011694/downloads/IAC%202024%20Manuscript_FSP%20FINAL.pdf) | Reactor power, mass, and lifetime |
| [Rucker, "Integrated Surface Power Strategy for Mars"](https://ntrs.nasa.gov/api/citations/20150000526/downloads/20150000526.pdf) | Power distribution hardware mass |
| [NASA CR-189186 subsystem mass/power](https://ntrs.nasa.gov/api/citations/19920019663/downloads/19920019663.pdf) | Communications hardware mass |
| [MIT 16.851 Water Recovery System portfolio](https://ocw.mit.edu/courses/16-851-satellite-engineering-fall-2003/1b24b751674a5d7db79cad58eefe2ade_16_851_portfolio.pdf) | Water recovery hardware mass/volume/power/crew-time |
| [NASA Science — Perseverance instruments](https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/) | MOXIE hardware mass and power |
| [Miyajima 2020, lunar life-support trade study](https://doi.org/10.15011/ijmsa.37.3.370304) | CO₂ scrubber / thermal control / O₂ generator mass and cooling load |
| NASA Ames APR 8070.1 · GSFC-STD-1000H · THEMIS margin policy | Mass-margin schedules by mission review phase |

#### Planetary & orbital data

| Source | Used for |
|---|---|
| [NASA planetary fact sheets](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) | Gravity, day length, solar irradiance, orbital distance/period |
| [JPL Horizons](https://ssd.jpl.nasa.gov/api/horizons.api) (live API) | Real-time Earth–Mars / Earth–Moon light-time |

#### Historical incidents

| Source | Used for |
|---|---|
| NASA SP-4030 · [NASA "25 Years Ago: Fire Aboard Mir"](https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/) · [Linenger crew account](https://www.sciencefocus.com/space/fire-in-space-jerry-linenger) | The Mir fire incident |
| NASA Shuttle-Mir history · [Spektr module page](https://spaceflight.nasa.gov/history/shuttle-mir/spacecraft/s-mir-spektr-main.htm) | The Progress–Mir collision/depressurization incident |
| [Apollo 13 CO₂ account](https://www.universetoday.com/articles/13-things-that-saved-apollo-13-part-10-duct-tape) | The O₂ tank / CO₂ rationing incident |
| [Soyuz MS-22 coolant leak reporting](https://tass.com/science/1552657) · [post-MS-22 thermal criteria](https://www.nasaspaceflight.com/2023/03/soyuz-ms-22-return/) | The coolant leak incident |
| [JPL, "Opportunity Hunkers Down During Dust Storm"](https://www.jpl.nasa.gov/news/opportunity-hunkers-down-during-dust-storm/) · [Lorenz et al. 2020, InSight dust](https://pmc.ncbi.nlm.nih.gov/articles/PMC7375148/) | The dust storm incident |
| [Cmarik & Knox 2019, ICES](https://ntrs.nasa.gov/api/citations/20190030370/downloads/20190030370.pdf) | The CO₂ scrubber (CDRA) failure incident |
| NASA Orion quick facts | Lunar-return transit time |

#### Landing sites

| Source | Used for |
|---|---|
| NASA Mars 2020 Perseverance landing site | Jezero Crater coordinates |
| NASA Mars Science Laboratory landing site | Gale Crater coordinates |
| [Morgan et al. 2021, *Nature Astronomy*](https://www.nature.com/articles/s41550-020-01290-z) (SWIM project) | Subsurface water-ice availability, Arcadia Planitia |
| [Luzzi et al. 2025, *JGR Planets*](https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2024JE008724) | Shallow ice-depth mapping follow-up |
| [NASA Artemis III candidate regions](https://www.nasa.gov/news-release/nasa-identifies-candidate-regions-for-landing-next-americans-on-Moon/) | Lunar landing-site candidates |
| [Wueller et al. 2026, *JGR Planets*](https://agupubs.onlinelibrary.wiley.com/doi/10.1029/2025JE009434) | Lunar site terrain suitability |

#### Operations & maintenance

| Source | Used for |
|---|---|
| [Lynch et al. 2022, lunar crew-time assessment, IEEE Aerospace](https://ntrs.nasa.gov/citations/20220002626) | Scheduled-maintenance crew-hour budget |
| [NASA, ISS 3-D-printed ratchet wrench](https://www.nasa.gov/missions/station/space-station-3-d-printer-builds-ratchet-wrench-to-complete-first-phase-of-operations/) | "Print a spare" lever's wall-clock time |

#### Live APIs and map services

| Service | Used for | Credit |
|---|---|---|
| [NASA DONKI](https://api.nasa.gov/DONKI/) | Live Sky — real recent solar flares/particle events drive in-game radiation storms | NASA CCMC / Space Weather Research Center |
| [JPL Horizons](https://ssd.jpl.nasa.gov/api/horizons.api) | Real Earth–Mars / Earth–Moon light-time | NASA/JPL Solar System Dynamics |
| [NASA Image and Video Library](https://images-api.nasa.gov/search) | Fact-card photography | Per-image credit from the API |
| [NASA Moon Trek](https://trek.nasa.gov/) (LRO WAC Mosaic) | Lunar landing-site map tiles | NASA/GSFC/Arizona State University |
| [NASA Mars Trek](https://trek.nasa.gov/) (Viking MDIM2.1) | Martian landing-site map tiles | NASA Ames / USGS Astrogeology |

Game-balance constants with no NASA source (failure-rate tuning, shielding curves, crop
photoperiod, etc.) are explicitly labelled `GAME-DESIGN` with `confidence: "tuned"` or
`"placeholder"` wherever they appear — never presented as measured fact. The in-app
**Data Sources** screen shows this same registry to players directly.

### Data Passport & Evidence Pedigree

Every single dataset in Sol Keeper is cataloged in the **Data Passport** ([`docs/DATA_PASSPORT.md`](docs/DATA_PASSPORT.md) and the in-app **Data Passport** screen):
- **Pedigree Labels**: `Live`, `Snapshot`, `Archived`, `Published`, `Derived`, or `Tuned`.
- **Human Evidence Standards**: Distinguished between `read by a person` (audited directly in literature) vs `wording adopted, quote not confirmed`.
- **Verification Status**: Validated against primary documentation and verified by the development lead.
- **Traceability**: An automated integrity test suite enforces that 100% of physical simulation constants link to an authenticated entry in the Data Passport.

## Credits & Licenses

Every number in Sol Keeper comes from published space agency research, and all open source software, media assets, and AI tools are fully credited:

- **Software Licenses**: Sol Keeper's runtime stack uses permissive open-source packages (MIT, ISC, BSD-2-Clause, 0BSD, Apache-2.0). See [`docs/CREDITS.md`](docs/CREDITS.md) for the complete dependency manifest generated via `pnpm licenses list --prod`.
- **Scientific Sources**: NASA technical standards (BVAD-2022, OCHMO technical briefs), NOAA space weather indices, NIOSH/NCRP health thresholds, and peer-reviewed literature across *Science*, *Frontiers*, and *ICES*. Full catalog in [`docs/DATA_SOURCES.md`](docs/DATA_SOURCES.md) and [`docs/DATA_PASSPORT.md`](docs/DATA_PASSPORT.md).
- **NASA Image Library**: Hardware photography across console fact cards renders each photo's official agency credit line directly underneath the thumbnail.
- **AI Use Disclosure**: Developed with Claude Code for engineering and verification. Media includes one AI-generated illustrative video (`launch-windows-astronaut.mp4`). **Zero AI services are called at runtime**, and **no player data leaves the device**.
- **Media & Artwork**: Background space artwork by Pinterest artist `tarekjasem1981`. Station cockpit views are illustrative artwork (not NASA photography), and **no NASA insignia appears anywhere in the application**.
- **Planetary Basemaps**: Real Mars and Moon orbital photography via NASA Trek (LRO WAC mosaic for Moon, Viking Orbiter MDIM 2.1 color mosaic for Mars). The Jezero Crater briefing displays this real Mars photography with attribution.

For complete license texts, agency citations, and asset provenance, see [`docs/CREDITS.md`](docs/CREDITS.md).

## Tech stack

- **pnpm workspaces** monorepo, TypeScript strict (`noUncheckedIndexedAccess`,
  `exactOptionalPropertyTypes`), Vitest, ESLint + Prettier, Playwright for real-browser
  checks.
- **`packages/sim`** — the simulation itself: pure TypeScript, no DOM/fetch/`Date.now`/
  `Math.random`. A seeded RNG and injected clock make the same seed + inputs byte-identical
  every run.
- **`apps/web`** — Vite + React 18 + Zustand, Leaflet for the Moon/Mars Trek landing-site
  maps, d3-force for the Incident Command dependency graph, i18next (English + Bangla),
  vite-plugin-pwa for offline support.
- **`apps/web/api`** — Vercel Functions proxying DONKI, JPL Horizons, and the NASA Image
  and Video Library, each with an explicit query-parameter whitelist.

## Running locally

```bash
pnpm install
pnpm --filter @sol-keeper/web dev    # dev server
pnpm verify                          # typecheck + lint + test
pnpm e2e                             # Playwright, against a production build
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full system design and
[`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) for the complete project brief.
