# Credits, Attributions & Open Source Licenses

Sol Keeper is an educational mission trainer created for the NASA Space Apps Challenge 2026. Every calculation, threshold, and operational trade-off in the simulation is grounded in published space agency research, peer-reviewed literature, and open data.

---

## 1. Legal Disclaimer & Agency Attribution

- **NASA Disclaimer**: Sol Keeper is not affiliated with, endorsed by, or sponsored by NASA or any other government agency.
- **NASA Insignia**: In compliance with NASA Space Apps Challenge branding policies, **no NASA insignia, logo, identifier, or "meatball" appears** anywhere within the application or its station console artwork.
- **Data Attribution**: All mission data, physical constants, and planetary photography are credited to NASA, NOAA, NIOSH, NCRP, and the respective academic researchers cited throughout the simulation and Data Passport.

---

## 2. Open Source Software Dependencies & Licenses

All runtime dependencies utilized by `apps/web` and `packages/sim` were generated and verified directly using `pnpm licenses list --prod`:

| License | Package | Version | Homepage / Repository | Usage in Sol Keeper |
| :--- | :--- | :--- | :--- | :--- |
| **0BSD** | `tslib` | 2.8.1 | https://www.typescriptlang.org/ | Runtime helper library for TypeScript |
| **Apache-2.0** | `typescript` | 5.9.3 | https://www.typescriptlang.org/ | Static typing and language execution |
| **BSD-2-Clause** | `leaflet` | 1.9.4 | https://leafletjs.com/ | Interactive Equirectangular planetary map engine |
| **ISC** | `d3-force` | 3.0.0 | https://d3js.org/d3-force/ | Force-directed dependency graph simulation |
| **ISC** | `d3-dispatch` | 3.0.1 | https://d3js.org/d3-dispatch/ | Event dispatching for graph layouts |
| **ISC** | `d3-quadtree` | 3.0.1 | https://d3js.org/d3-quadtree/ | Spatial subdivision for particle collision |
| **ISC** | `d3-timer` | 3.0.1 | https://d3js.org/d3-timer/ | Animation timing loop for graph visualization |
| **ISC** | `lucide-react` | 1.48.0 | https://lucide.dev | Lucide iconography |
| **MIT** | `react` | 18.3.1 | https://reactjs.org/ | Component framework and UI runtime |
| **MIT** | `react-dom` | 18.3.1 | https://reactjs.org/ | DOM rendering engine |
| **MIT** | `zustand` | 5.0.15 | https://github.com/pmndrs/zustand | Deterministic state management store |
| **MIT** | `framer-motion` | 13.4.4 | https://github.com/motiondivision/motion | Physics-based animation and transitions |
| **MIT** | `motion-dom` | 13.4.4 | https://github.com/motiondivision/motion | Motion DOM bindings |
| **MIT** | `motion-utils` | 13.4.4 | https://github.com/motiondivision/motion | Motion calculation utilities |
| **MIT** | `lenis` | 1.3.26 | https://github.com/darkroomengineering/lenis | Smooth scrolling engine |
| **MIT** | `i18next` | 26.4.2 | https://www.i18next.com | Internationalization core framework |
| **MIT** | `react-i18next` | 17.0.14 | https://react.i18next.com/ | React hooks and providers for i18n |
| **MIT** | `react-icons` | 5.7.0 | https://react-icons.github.io/react-icons/ | Feather icon set (`react-icons/fi`) |
| **MIT** | `html-parse-stringify` | 4.0.1 | https://github.com/i18next/html-parse-stringify | Lightweight AST parser for i18n text interpolation |
| **MIT** | `csstype` | 3.2.3 | https://github.com/frenic/csstype | Strict TypeScript style declarations |
| **MIT** | `js-tokens` | 4.0.0 | https://github.com/lydell/js-tokens | JavaScript tokenization regex |
| **MIT** | `loose-envify` | 1.4.0 | https://github.com/zertosh/loose-envify | Fast environment variable replacement |
| **MIT** | `scheduler` | 0.23.2 | https://reactjs.org/ | Task scheduling for browser runtimes |
| **MIT** | `use-sync-external-store` | 1.7.0 | https://github.com/react/react | Backwards-compatible external store hook |
| **MIT** | `@babel/runtime` | 7.29.7 | https://babel.dev/ | Modular runtime helpers |
| **MIT** | `@types/prop-types` | 15.7.15 | DefinitelyTyped | TypeScript definitions |
| **MIT** | `@types/react` | 18.3.31 | DefinitelyTyped | TypeScript definitions for React |

- **`packages/sim` Dependencies**: 0 runtime dependencies. The simulation engine is 100% pure, self-contained deterministic TypeScript.
- **Fonts**: Sol Keeper bundles no external webfont binaries. The application relies entirely on modern OS system font stacks (`system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` and `ui-monospace, "SF Mono", Menlo, monospace`).
- **Icon Sets**: Feather Icons (`react-icons/fi`, MIT License) and Lucide Icons (`lucide-react`, ISC License).

---

## 3. Scientific Data Registry & Citations

Every numerical value used in Sol Keeper is mapped to a registered `SourceId` in [`docs/DATA_SOURCES.md`](DATA_SOURCES.md) and [`apps/web/src/data/sourceRegistry.ts`](../apps/web/src/data/sourceRegistry.ts):

### NASA Standards & Technical Publications
- **BVAD-2022**: *NASA Life Support Baseline Values and Assumptions Document*, NASA/TP-20210024855 (Metabolic baseline NASA/TP-2015-218570). Drives crew $O_2$, $CO_2$, water and caloric consumption, crop yields, and ISS baseline power loads.
- **OCHMO-RAD**: *NASA Office of the Chief Health and Medical Officer (OCHMO) Radiation Protection Technical Brief*, NASA-STD-3001. Establishes the 600 mSv career limit, 250 mGy-Eq SPE 30-day limit, and 0.8 / 1.3 mSv/day habitat design limits.
- **OCHMO-TB047**: *NASA OCHMO Crew Survivability Technical Brief (TB-047)*. Grounds survival mode caloric, hydration, thermal, and $CO_2$ limits.
- **OCHMO-TB003**: *NASA OCHMO Habitable Atmosphere Technical Brief (TB-003 Rev A)*. Establishes the 160 mmHg sea-level equivalent $ppO_2$ setpoint.
- **OCHMO-TB004 & HRP-ARS**: NASA Human Research Program clinical acute radiation sickness thresholds.
- **NASA-AMES-STD8070**: *Ames Space Flight System Design and Environmental Test Standard (APR 8070.1)*. Establishes phase-based mass margins (SRR 30%, PDR 20%, CDR 15%, SIR 5%).
- **GSFC-STD-1000H**: *Goddard Space Flight Center Rules for Flight Systems (Rev H)*. Grounds predicted mass contingency growth rules.
- **NASA-WATER-2023**: *NASA ISS Water Recovery Milestone*. Establishes the 98% water recovery baseline achieved via the Brine Processor Assembly.
- **NASA-FSP & NASA-FSP-IAC2024**: NASA Fission Surface Power project specifications (40 kWe reactor sizing).
- **NASA-SPACEBIO-1975, NASA-NUTRITION-2015, NASA-HYPOTHERMIA-2008, NASA-ORION-FS, NASA-SP-4030**: Foundational space physiology, clinical hypothermia, nutritional, and life support parameters.
- **NASA-TP-3643**: Wilson et al. (1997), *Transport Methods and Interactions for Space Radiations*. Grounds August 1972 SPE spacesuit and BFO radiation doses.
- **NASA-SMA-MIR-COLLISION, NASA-SHUTTLE-MIR, NASA-MIR-FIRE-25YR**: Historical Mir station collision, depressurization, Spektr module volume (62 m³), and Vika oxygen generator fire data.
- **NASA-M2020-LANDING & NASA-MSL-LANDING**: Landing site science and surface conditions at Jezero Crater and Gale Crater.
- **NASA-ARTEMIS-CLR**: Artemis lunar South Pole candidate landing region lighting and topography.
- **NASA-AMF-RATCHET & NTRS-LUNAR-MAINT-CREWTIME**: Additive Manufacturing Facility tool printing speeds and Langley lunar surface maintenance crew-hour allocations.
- **MOXIE-MASS-NASA & SPACECRAFT-SUBSYS-NTRS**: Mars 2020 MOXIE hardware mass specifications and NTRS spacecraft subsystem mass estimation models.
- **NSSDC-FACTS**: Planetary physical properties and solar distances from NASA NSSDC.
- **JPL-DUSTSTORM2018-TAU**: Mars Reconnaissance Orbiter and Opportunity Mars 2018 global dust storm optical depth measurements ($\tau = 10.8$).

### NOAA & Space Weather
- **AGU-KNIPP-2018**: Knipp et al. (2018), *On the Little-Known Consequences of the 4 August 1972 Ultra-Fast Coronal Mass Ejecta*, Space Weather 16(11).
- **NOAA SWPC**: Real-time solar observations, flare indices, and geomagnetic storm alerts via Data Passport live feeds.

### NIOSH & NCRP
- **NCRP (National Council on Radiation Protection and Measurements)**: NCRP Report No. 98 and Report No. 132 career radiation exposure limits for astronauts.
- **NIOSH (National Institute for Occupational Safety and Health)**: Criteria for recommended standard on occupational heat strain and environmental $CO_2$ toxicity thresholds.

### Academic & Peer-Reviewed Research
- **MIT-MOXIE-2023**: MIT AeroAstro Mars MOXIE oxygen generation results (6–12 g/h, $\ge 98\%$ purity, 122 g total produced).
- **FRONTIERS-2024**: Frontiers in Space Technologies, *ISS Air and Water Recovery Review* (51% $O_2$ recovery from $CO_2$ baseline).
- **MSL-RAD-SURFACE, MSL-RAD-CRUISE, MSL-RAD-SUMMARY**: Hassler et al. (*Science* 343), Zeitlin et al. (*Science* 340), and Reitz et al. (DLR/ICES 2016) measuring Mars surface dose ($0.64 \pm 0.12\text{ mSv/day}$) and cruise dose ($1.84 \pm 0.30\text{ mSv/day}$).
- **CE4-LND-2020**: Zhang et al. (2020), *First Measurements of the Radiation Dose on the Lunar Surface*, Science Advances 6(39), measuring $1,369\ \mu\text{Sv/day}$.
- **THEMIS-MARGINS**: UC Berkeley / NASA THEMIS resource margin policy.
- **ICES-2017 & ICES-2019-CDRA**: ICES resupply mass baselines and CDRA silica-gel sorbent degradation.
- **MIYAJIMA-LSS & MIT-16851-WRS**: Equivalent System Mass (ESM) metrics and water recovery subsystem scaling.
- **RUCKER-2015-SURFACE-POWER**: Michelle Rucker (NASA JSC), surface power transmission cable sizing and mass equations.
- **SWIM-2021, LUZZI-2025, WUELLER-2026**: Mars Subsurface Water Ice Mapping and Lunar South Pole slope/terrain traversability modeling.
- **AIP-2023-REGOLITH-SHIELD**: American Institute of Physics regolith radiation shielding attenuation modeling.
- **WHEELER-2024-CO2-SALAD**: Wheeler et al. (2024), elevated $CO_2$ impact on crop productivity.
- **LORENZ-2020-INSIGHT-DUST**: Ralph Lorenz et al. (2020), InSight solar array dust accumulation and wind-cleaning physics.

### Historical Mission Case Studies
- **A13-CO2**: Apollo 13 Mission Report (MSC-01880) and crew debriefs on the improvised lithium hydroxide adapter.
- **MS22-THERMAL & NSF-MS22**: Soyuz MS-22 external coolant leak thermal telemetry and crewed thermal abort limits.
- **MIR-FIRE-LINENGER**: Dr. Jerry Linenger firsthand debrief on the 1997 Mir solid-fuel oxygen generator fire.

---

## 4. NASA Image Library & Live APIs

- **NASA Image and Video Library (`API-IMAGES`)**: Hardware photography across console fact-card galleries (CDRA, Veggie, MOXIE, Artemis, etc.) is fetched from NASA's official endpoint:
  - **Endpoint**: `https://images-api.nasa.gov/search`
  - **Credit Display**: Every image displays its official agency credit line (e.g., `NASA/JPL-Caltech`, `NASA/Johnson Space Center`, `HQ`) directly beneath the image thumbnail.
- **Live Data Feeds (Data Passport)**:
  - **NASA DONKI (`API-DONKI`)**: Space weather events driving Live Sky alerts (`https://api.nasa.gov/DONKI/`).
  - **JPL Horizons (`API-HORIZONS`)**: High-precision ephemeris driving Earth–Mars and Earth–Moon radio light-time calculation (`https://ssd.jpl.nasa.gov/api/horizons.api`).
  - **NASA Moon Trek (`TREK-MOON`) & Mars Trek (`TREK-MARS`)**: Planetary cartographic WMTS tiles (`https://trek.nasa.gov/`).

---

## 5. Artificial Intelligence & Privacy Disclosure

- **Development Tooling**: Sol Keeper was developed with **Claude Code** (Anthropic) for engineering design, verification scripting, and pair programming.
- **AI-Generated Media**:
  - The hero background video `apps/web/public/videos/launch-windows-astronaut.mp4` is an AI-generated artistic video depicting an astronaut on a planetary surface.
- **Runtime AI & Privacy Guarantee**:
  - **Zero AI services are called at runtime**: No AI model, agent, or LLM API is invoked when running the application.
  - **Grepped Verification**: Confirmed zero references or outbound network calls to `api.anthropic.com` or `api.openai.com` anywhere in `apps/web` or `packages/sim`.
  - **Privacy Guarantee**: All game simulation logic runs locally in the player's web browser. **No player data leaves the device.** No player data, decisions, or telemetry leave the user's device.

---

## 6. Artwork & Visual Assets Provenance

- **Homepage Background Image**: `apps/web/public/images/_ (10).jpeg` is original space artwork by Pinterest artist **tarekjasem1981**, used with credit.
- **Launch Windows Background Video**: `apps/web/public/videos/launch-windows-astronaut.mp4` is AI-generated illustrative video.
- **Station Cockpit Views**: The cockpit backgrounds (`/stations/moon-*`, `/stations/mars-*`) are illustrative artwork created to represent futuristic multi-monitor mission-control operations. **They are not NASA photography, and they feature no NASA insignia, logos, or meatballs.**
- **Planetary Basemap Attribution**:
  - **Moon Basemap**: NASA Lunar Reconnaissance Orbiter Camera (LROC) Wide Angle Camera (WAC) Global Photographic Mosaic, via **NASA Moon Trek** (NASA/GSFC/Arizona State University).
  - **Mars Basemap & Jezero Crater**: Viking Orbiter MDIM 2.1 color global photographic mosaic, via **NASA Mars Trek** (NASA Ames / USGS Astrogeology Science Center). The Jezero Crater briefing displays this real Mars photographic basemap with the credit rendered directly on the map.

