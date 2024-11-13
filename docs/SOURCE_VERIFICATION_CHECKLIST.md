# Source Verification Checklist — Sol Keeper
For: science teammate · Rebuilt 2026-10-30 · Items 1–50 are the original checklist, updated. Items 51–87 are values added since.

## What this is for
Every number in the game comes from a source document. This checklist makes a person open each source and confirm the number. A judge will ask "where does this come from?", and your answer is a page number.

Priority: ★★★ players see it · ★★ drives the simulation · ★ background.
Start with the ★★★ rows. There are 33 of them; allow 1.5 to 2 hours.

## Rules
1. Open the source yourself. Do not ask an AI to confirm a value from memory.
2. For each row fill in: the value the document actually gives, the page or table, the result, and your initials and date.
3. Result codes: ✔ the document matches the game · ⚠ the document differs (write the document's value) · ✖ could not find it.
4. When the document and the game disagree, THE DOCUMENT WINS. Do not edit the code or constants file. Send the developer a list of the ⚠ and ✖ rows: row number, what the game says, what the document says, page.
5. Read the surrounding text. Check the unit, "per person", "per day", and whether it is dose equivalent (mSv) or absorbed dose (Gy).
6. If a link does not open, search the document title on https://ntrs.nasa.gov.

Tip: convert big PDFs to searchable text, then use Ctrl+F or Cmd+F.
macOS: `brew install poppler`, then `pdftotext -layout BVAD-2022.pdf bvad.txt`.
Windows: open the PDF and use its own search.

---

## Sources
| ID | Document | Link |
|---|---|---|
| BVAD-2022 | Life Support Baseline Values and Assumptions Document | https://ntrs.nasa.gov/citations/20210024855 |
| OCHMO-RAD | NASA OCHMO Radiation Protection Technical Brief | https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf |
| OCHMO-TB047 | Crew Survivability Technical Brief | https://www.nasa.gov/wp-content/uploads/2024/07/ochmo-tb-047-crew-survivability.pdf |
| OCHMO-TB-003 | Habitable Atmosphere Technical Brief | https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-003-habitable-atmosphere.pdf |
| OCHMO-TB-004 | Carbon Dioxide Technical Brief | https://www.nasa.gov/ochmo-tb-004-carbon-dioxide-2/ |
| ICES-2017 | Resupply mass paper (ICES-2017-87) | https://ntrs.nasa.gov/api/citations/20170010337/downloads/20170010337.pdf |
| NASA-WATER-2023 | ISS 98% water recovery milestone | https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station |
| FRONTIERS-2024 | ISS air and water recovery review | https://www.frontiersin.org/journals/space-technologies/articles/10.3389/frspt.2024.1461389/full |
| MIT-MOXIE-2023 | MOXIE completes Mars mission | https://aeroastro.mit.edu/news-impact/oxygen-generating-experiment-moxie-completes-mars-mission |
| NASA-M2020-INSTRUMENTS | Perseverance science instruments (MOXIE specs) | https://science.nasa.gov/mission/mars-2020-perseverance/science-instruments/ |
| MSL-RAD-SURFACE | Hassler et al. 2014, Science | https://doi.org/10.1126/science.1244797 |
| MSL-RAD-CRUISE | Zeitlin et al. 2013, Science | https://doi.org/10.1126/science.1235989 |
| MSL-RAD-SUMMARY | Open-access summary of both values | https://elib.dlr.de/106090/1/ME-SBA-2016-Reitz_MSL-RAD_ICES_2016.pdf |
| CE4-LND-2020 | Zhang et al. 2020, Science Advances | https://www.science.org/doi/10.1126/sciadv.aaz1334 |
| NASA-FSP | Fission Surface Power project page | https://www.nasa.gov/exploration-systems-development-mission-directorate/fission-surface-power |
| NASA-FSP-IAC2024 | FSP status paper, IAC 2024 | https://ntrs.nasa.gov/api/citations/20240011694/downloads/IAC%202024%20Manuscript_FSP%20FINAL.pdf |
| NSSDC-FACTS | NASA planetary fact sheets | https://nssdc.gsfc.nasa.gov/planetary/factsheet/ |
| NASA-AMES-STD8070 | Ames spaceflight design standard APR 8070.1 | https://www.nasa.gov/wp-content/uploads/2017/03/std8070.1.pdf |
| THEMIS-MARGINS | THEMIS margin and contingency policy | https://themis.ssl.berkeley.edu/themisftp/1%20Management/1.1%20Management/1.1.4%20Reviews%20and%20Deliverables/RFAs%20(non%20CDR)/thm_SRR_RFA_Response_06_RevA.doc |
| WHEELER-2021 | Supplemental food production with plants, Frontiers 2021 | https://www.frontiersin.org/journals/astronomy-and-space-sciences/articles/10.3389/fspas.2021.734343/full |
| NASA-2025-MARS-POWER | Mars surface power workshop paper, Feb 2025 | https://www.nasa.gov/wp-content/uploads/2025/02/2025-ia-workshop-wp-mars-surface-power.pdf |
| CO2-REVIEW-2026 | CO2 limits review, npj Microgravity | https://www.nature.com/articles/s41526-026-00608-x |
| HRP-ARS | HRP evidence report: acute radiation syndromes | https://humanresearchroadmap.nasa.gov/evidence/reports/ARS.pdf |
| SEP-ONSET | SEP onset and prediction paper (arXiv) | https://arxiv.org/pdf/1712.03998 |
| NOAA-SWPC-PERF | NOAA SWPC warning performance summary | https://repository.library.noaa.gov/view/noaa/44546/noaa_44546_DS1.pdf |
| NASA-SPACEBIO-1975 | Protection Against Adverse Spaceflight Factors | https://ntrs.nasa.gov/api/citations/19760019741/downloads/19760019741.pdf |
| NASA-NUTRITION-2015 | NASA nutrition and starvation document | https://ntrs.nasa.gov/api/citations/20150000512/downloads/20150000512.pdf |
| NASA-HYPOTHERMIA-2008 | Shuttle contingency water-landing survivability | https://ntrs.nasa.gov/api/citations/20080014194/downloads/20080014194.pdf |
| NASA-ORION-FS | Orion overview fact sheet | https://www.nasa.gov/wp-content/uploads/2021/04/617409main_orion_overview_fs_33012.pdf |
| NASA-SP-4030 | NASA SP-4030 (Mir fire) | https://www.nasa.gov/wp-content/uploads/2023/04/sp4030.pdf |
| SHUTTLE-MIR-SPEKTR | Shuttle–Mir history, Spektr module | https://spaceflight.nasa.gov/history/shuttle-mir/spacecraft/s-mir-spektr-main.htm |
| NASA-SMA-MIR | NASA Safety Center, Mir–Progress collision | https://sma.nasa.gov/docs/default-source/safety-messages/safetymessage-2010-11-08-mirprogresscollision-vits.pdf |
| NASA-TP-3643 | NASA TP-3643 (radiation, 1972 event) | https://www.cs.odu.edu/~mln/ltrs-pdfs/NASA-97-tp3643.pdf |
| INSIGHT-OCT22 | InSight power blog, 8 Oct 2022 | https://science.nasa.gov/blogs/insight/2022/10/10/nasa-insights-power-level-as-of-oct-8-2022 |
| INSIGHT-NOV22 | InSight power blog, 29 Nov 2022 | https://blogs.nasa.gov/insight/2022/12/06/nasa-insights-power-level-as-of-nov-29-2022 |
| MER-TAU | SpaceNews on InSight and storm optical depth (secondary) | https://spacenews.com/insight-recovers-from-dust-storm-as-landers-power-continues-to-wane/ |
| A13-CO2 | Universe Today, Apollo 13 CO2 pieces (secondary) | https://www.universetoday.com/articles/13-more-things-that-saved-apollo-13-part-5-the-co2-partial-pressure-sensor |
| MS22-TASS | TASS on Soyuz MS-22 (secondary) | https://tass.com/science/1552657 |
| MS22-NSF | NASASpaceFlight on MS-22 return (secondary) | https://www.nasaspaceflight.com/2023/03/soyuz-ms-22-return/ |

Rows that rest on a SECONDARY source (A13-CO2, MS22-TASS, MS22-NSF, MER-TAU) are marked "secondary". If you can find the original NASA document (Apollo 13 Review Board report on NTRS, a NASA ISS blog post, a JPL news release), use that and say so.

---

## Part 1 — Original checklist (items 1–50)

### 1. BVAD-2022 (life support)
| # | ★ | Game value | Search for | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 1 | ★★★ | O₂ use: 0.84 kg per crewmember per day | `oxygen`, `0.84` | ⚠ the 2022 edition may differ; if so, the document wins | | | ☐ | |
| 2 | ★★★ | CO₂ produced: 1.00 kg per crewmember per day | `carbon dioxide`, `CO2` | | | | ☐ | |
| 3 | ★★ | Metabolic rate: 11.82 MJ/day (136.8 W) | `11.82`, `metabolic` | Check 136.8 W = 11.82 MJ ÷ 86,400 s | | | ☐ | |
| 4 | ★★★ | Dry food: 0.62 kg per crewmember per day | `food`, `dry mass` | ⚠ first came from a secondary summary; find the BVAD's own figure | | | ☐ | |
| 5 | ★★★ | Total water use: 4.35 kg per crewmember per day | `4.35`, `potable` | | | | ☐ | |
| 6 | ★★ | ISS power: ECLSS 5.31 kW, thermal control 8.72 kW | `5.31`, `8.72` | | | | ☐ | |
| 7 | ★★ | ESM factors: 80.8 kg/m³ volume, 136 kg/kWe power | `equivalency`, `80.8` | | | | ☐ | |
| 8 | ★★ | Surface power ESM: 54 / 87 / 338 kg/kW | `338` | Record which power technology each number belongs to | | | ☐ | |
| 9 | ★★ | Crew-time (1.25 kg/CM-h) and cooling (0.14 kg/W) ESM factors | `crewtime`, `cooling` | Table 3-2 crew-time 1.25 kg/CM-h, cooling 0.14 kg/W | 1.25 kg/CM-h crew-time, 0.14 kg/W cooling | Table 3-2 (p. 25) | ✔ | TR 2026-11-02 |
| 10 | ★★ | Crop cycles: lettuce 28–30, wheat 64–86, soybean 90–97, potato 90–105 days | `lettuce`, `potato` | | | | ☐ | |
| 11 | ★ | 5-day workweek, 8 vacation days per year | `vacation` | | | | ☐ | |

### 2. OCHMO-RAD (radiation brief)
| # | ★ | Game value | Search for | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 12 | ★★★ | Career limit: 600 mSv | `600` | | | | ☐ | |
| 13 | ★★★ | Solar particle event limit: 250 mSv per event | `250` | ⚠ check the exact wording; it may be a 30-day limit | | | ☐ | |
| 14 | ★ | Nuclear technology: 20 mSv per mission year | `20 mSv` | | | | ☐ | |
| 15 | ★★ | Cosmic-ray design targets: 0.8 mSv/day on surfaces, 1.3 mSv/day in free space, ~10 g/cm² aluminium | `0.8`, `1.3`, `g/cm` | | | | ☐ | |
| 16 | ★★★ | Earth background: about 3.6 mSv per year | `background`, `3.6` | ⚠ if not in this brief, find a NASA source; common figures are 3.1, 3.6 and 6.2 mSv/yr | | | ☐ | |

### 3. OCHMO-TB047 (survivability brief)
| # | ★ | Game value | Search for | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 17 | ★★★ | Food: 3600 / 1800 / 600 kcal (nominal / mode 1 / mode 2) | `kcal`, `calories` | | | | ☐ | |
| 18 | ★★★ | Water: 4.0 / 1.25 / 0.75 L | `water` | | | | ☐ | |
| 19 | ★★ | Cabin temperature: 22 / 18 / 15 °C | `temperature` | | | | ☐ | |
| 20 | ★★ | CO₂ limit: 3 / 7.6 / 10–15 mmHg | `mmHg` | | | | ☐ | |
| 21 | ★★ | Fever: +10–12% metabolic rate per °C above 37 °C | `fever` | | | | ☐ | |

### 4. Radiation measurement papers
| # | ★ | Game value | Reference · where to look | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 22 | ★★★ | Mars surface dose: 0.64 ± 0.12 mSv/day | MSL-RAD-SURFACE, abstract | If paywalled, use MSL-RAD-SUMMARY. Confirm it is dose EQUIVALENT, not absorbed dose | | | ☐ | |
| 23 | ★★★ | Cruise dose: 1.84 ± 0.30 mSv/day | MSL-RAD-CRUISE, abstract | Same | | | ☐ | |
| 24 | ★★★ | Moon surface dose: 1,369 µSv/day | CE4-LND-2020, Discussion | Confirm dose equivalent; note it was measured at Von Kármán crater, not the pole | | | ☐ | |

### 5. Life support papers and pages
| # | ★ | Game value | Reference | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 25 | ★★★ | Water recovery: 93–94% without, 98% with the brine processor | NASA-WATER-2023 | | | | ☐ | |
| 26 | ★★ | O₂ recovery from CO₂: 51% today, 75% goal | FRONTIERS-2024 | | | | ☐ | |
| 27 | ★★ | Open-loop resupply: about 10 kg per crewmember per day | ICES-2017 (`kg/CM-d`) | | | | ☐ | |
| 28 | ★★★ | MOXIE: 12 g/h peak, ≥98% purity, 122 g total | MIT-MOXIE-2023 | | | | ☐ | |
| 29 | ★★ | MOXIE: 6 g/h nominal | NASA-M2020-INSTRUMENTS | UPDATED: the NASA page lists up to 10 g/h as the spec and 17.1 kg, 300 W. Check where "6 g/h" comes from; if the page does not state it, mark ⚠ | | | ☐ | |

### 6. Power
| # | ★ | Game value | Reference | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 30 | ★★★ | Reactor: 40 kWe, 10-year life, under 6,000 kg, 4 m × 6 m stowed | NASA-FSP-IAC2024, Section 1 | | | | ☐ | |
| 31 | ★ | Lunar operation targeted for the early 2030s | NASA-FSP page | | | | ☐ | |

### 7. NASA planetary fact sheets
Open the Earth, Mars and Moon pages at NSSDC-FACTS.
| # | ★ | Game value | Fact sheet row | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 32 | ★★ | Solar constant: 1361 W/m² | Earth: Solar irradiance | | | | ☐ | |
| 33 | ★★★ | Mars sunlight: about 586–590 W/m² | Mars: Solar irradiance | | | | ☐ | |
| 34 | ★★ | Mars sol: 24.6597 h | Mars: Length of day | Use "length of day", NOT the sidereal rotation period (about 24.62 h) | | | ☐ | |
| 35 | ★ | Mars gravity: 3.71 m/s² | Mars: Surface gravity | ⚠ the sheet may list 3.73 (equatorial); record which row and value | | | ☐ | |
| 36 | ★★ | Mars pressure: about 610 Pa | Mars: Surface pressure | ⚠ the sheet likely says about 636 Pa; use the sheet's value | | | ☐ | |
| 37 | ★ | Mars CO₂: 95% | Mars: Atmospheric composition | | | | ☐ | |
| 38 | ★★ | Mars mean temperature: −63 °C | Mars: Average temperature (in K; subtract 273) | | | | ☐ | |
| 39 | ★ | Mars conjunction cycle: about 780 days | Mars: Synodic period | | | | ☐ | |
| 40 | ★ | Moon gravity: 1.62 m/s² | Moon: Surface gravity | | | | ☐ | |
| 41 | ★★ | Lunar day: 29.53 days | Moon: Synodic period | | | | ☐ | |
| 42 | ★★ | Lunar equator temperature: −173 to +127 °C | Moon: Diurnal temperature range | ⚠ IMPORTANT: I recall the sheet giving about 95 K to 390 K, which is −178 to +117 °C. If so, the constants file is the one to correct. This also decides item 87. Record the sheet's exact numbers | | | ☐ | |

### 8. Margins and management
| # | ★ | Game value | Reference | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 43 | ★★ | Mass margin by phase: 30 / 20 / 15 / 5% | NASA-AMES-STD8070, Table 3.1.1.1-1 | UPDATED source | | | ☐ | |
| 44 | ★★ | Contingency by maturity: 25 / 15 / 7.5 / 4 / 2% | THEMIS-MARGINS | Also check GSFC-STD-1000H for phase-based margin rules | | | ☐ | |
| 45 | ★ | Historical growth: 20–48% from Phase B to launch (JPL) | THEMIS-MARGINS | | | | ☐ | |

### 9. Arithmetic checks (no lookup)
| # | ★ | Value | Check | Result | Initials · date |
|---|---|---|---|---|---|
| 46 | ★★ | 1.125 kg of water per kg of O₂ | 2 H₂O (2 × 18.015) ÷ O₂ (31.998) ≈ 1.126 | ☐ | |
| 47 | ★★ | 499.004784 seconds per AU | 149,597,870.7 km ÷ 299,792.458 km/s | ☐ | |

### 10. Values that had no source
| # | ★ | Value | Reference | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 48 | ★★ | Crop area per person: 40–50 m² | WHEELER-2021, Introduction | UPDATED: now has a source. Confirm the wording is "high light" and per person | | | ☐ | |
| 49 | ★★ | Solar panel dust loss | NASA-2025-MARS-POWER, INSIGHT-OCT22 | UPDATED: partly sourced; see items 74–76. Record whether a per-sol dust accumulation rate exists | | | ☐ | |
| 50 | ★ | Mars conjunction blackout: about 14 days | NASA "Mars solar conjunction" page | Still unsourced. Search nasa.gov for the page and add a new source row | | | ☐ | |

---

## Part 2 — Values added since (items 51–87)

### A. Atmosphere and CO₂
| # | ★ | Game value | Reference | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 51 | ★★★ | Inspired O₂ pressure, normal target: 145–155 mmHg | OCHMO-TB-003 | These are PIO2 (airway), not cabin ppO2 | | | ☐ | |
| 52 | ★★★ | Mild hypoxia lower limit: 127 mmHg | OCHMO-TB-003 | | | | ☐ | |
| 53 | ★★ | Indefinite hyperoxia upper limit: 356 mmHg | OCHMO-TB-003 | | | | ☐ | |
| 54 | ★ | Short-term hyperoxia upper limit: 791 mmHg | OCHMO-TB-003 | | | | ☐ | |
| 55 | ★★ | Total cabin pressure: above 5.0 to 15.0 psia | OCHMO-TB-003 | | | | ☐ | |
| 56 | ★ | Minimum diluent gas: 30% | OCHMO-TB-003 | | | | ☐ | |
| 57 | ★★★ | CO₂ limit: 3 mmHg, 1-hour average | OCHMO-TB-004 | | | | ☐ | |
| 58 | ★★★ | CO₂ immediately dangerous: 4% (30.4 mmHg) | CO2-REVIEW-2026 | Indirect source. If you can, also find NIOSH's IDLH value and record it | | | ☐ | |
| 59 | ★★ | ISS CO₂ removal: six person-equivalents | OCHMO-TB-004 | | | | ☐ | |
| 60 | ★ | Water vapour pressure in the lungs: 47 mmHg | A physiology textbook or NASA human-physiology source | Used to convert cabin pressure to PIO2: (P_total − 47) × FO2. Record which source you used | | | ☐ | |

### B. Radiation events
| # | ★ | Game value | Reference | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 61 | ★★★ | Acute radiation effects begin around 0.1–0.2 Gy | HRP-ARS | | | | ☐ | |
| 62 | ★★★ | About 5% lethality near 2 Gy | HRP-ARS | | | | ☐ | |
| 63 | ★★★ | About 50% mortality within 60 days near 3.25 Gy, without medical care | HRP-ARS | | | | ☐ | |
| 64 | ★★ | Over 1 Gy unlikely if shelter of 5–10 g/cm² is reached in time | HRP-ARS | | | | ☐ | |
| 65 | ★★ | Particle arrival typically about 30 minutes after the flare | SEP-ONSET | Secondary (arXiv). Look for a NASA or NOAA statement | | | ☐ | |
| 66 | ★★★ | NOAA ≥10 MeV warnings: median lead 88 min (Cycle 24), 24% false alarms | NOAA-SWPC-PERF | | | | ☐ | |
| 67 | ★★ | A large unshielded event delivers over 0.5 Gy across several hours | HRP-ARS | The engine's solar-storm multiplier is built on this | | | ☐ | |

### C. Survival clocks
| # | ★ | Game value | Reference | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 68 | ★★★ | No water: up to about 14 days (336 h) in ideal conditions; death within hours in extreme conditions | NASA-SPACEBIO-1975 | | | | ☐ | |
| 69 | ★★★ | No food: about 1–2 months; hunger-strike data up to about 60 days | NASA-NUTRITION-2015 | NASA calls this a projection. Record the exact wording | | | ☐ | |
| 70 | ★★ | About 1000 kcal/day: potentially more than 4–6 months | NASA-NUTRITION-2015 | Projection | | | ☐ | |
| 71 | ★★★ | Hypothermia: over 12 h in 4.4 °C water in the suit; over 22 h in a raft | NASA-HYPOTHERMIA-2008 | These are WATER figures, not cabin air. Confirm the conditions | | | ☐ | |
| 72 | ★★ | Lunar return transit: Artemis I about 6 days; planned 9–19 days | NASA-ORION-FS | ⚠ the 9–19 days may describe whole mission phases. Record the exact wording | | | ☐ | |

### D. Dust and power
| # | ★ | Game value | Reference | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 73 | ★★ | Clear-sky optical depth (tau) 0.6–0.7 | INSIGHT-NOV22 | | | | ☐ | |
| 74 | ★★ | A regional storm cut InSight from 425 to 275 Wh per sol (about 35%) | INSIGHT-OCT22 | | | | ☐ | |
| 75 | ★★ | Opportunity: tau 10.8; about 22 Wh from a normal 300 | MER-TAU | Secondary. Find the JPL or NASA source | | | ☐ | |
| 76 | ★★ | Nominal 450 W/m² versus 100 W/m² in a dust storm | NASA-2025-MARS-POWER | | | | ☐ | |

### E. Incident anchors
| # | ★ | Game value | Reference | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 77 | ★★★ | Mir fire burn time: 14 minutes (disputed; one source says 90 seconds) | NASA-SP-4030 | Record both figures and where each appears | | | ☐ | |
| 78 | ★★ | Spektr module volume: 62 m³ | SHUTTLE-MIR-SPEKTR | | | | ☐ | |
| 79 | ★★ | Sealing Spektr cost about half of Mir's power | NASA-SMA-MIR | | | | ☐ | |
| 80 | ★★★ | Apollo 13: scrubber canisters sized for 2 crew for 2 days, used by 3 for about 4 | A13-CO2, then the Apollo 13 Review Board report on NTRS | Secondary; find the Board report | | | ☐ | |
| 81 | ★★★ | Apollo 13: CO₂ peak about 15 mmHg | Same | Crew recollection; look for the telemetry figure | | | ☐ | |
| 82 | ★★ | Apollo 13: CO₂ below 2 mmHg after the fix | Same | | | | ☐ | |
| 83 | ★★★ | Soyuz MS-22: crew module 30 °C, equipment bay 40 °C; hole about 0.8 mm | MS22-TASS | Secondary. Prefer a NASA ISS blog post | | | ☐ | |
| 84 | ★★ | MS-22 abort criteria: 31 °C at 95% humidity (descent module), 40 °C (service module), 45 °C (computer) | MS22-NSF | Secondary | | | ☐ | |

### F. Fixes from the Cadet rewrite (Section 5)
These overlap with Task 2 in your task list. Record the sources once, here.
| # | ★ | Check | Reference | Note | Document says | Page / table | Result | Initials · date |
|---|---|---|---|---|---|---|---|---|
| 85 | ★★★ | Mir fire: number of extinguishers (3 or 4?), people aboard (6?), time of the fire (22:35 Moscow?), mask type, which Soyuz was blocked | NASA-SP-4030, SHUTTLE-MIR-SPEKTR area | The game currently disagrees with itself | | | ☐ | |
| 86 | ★★★ | August 1972 storm: any dose or flux figure that is shown (4,000 mSv? over 400 rem? 70,000 protons/cm²-s-sr?) | HRP-ARS, NASA-TP-3643 | Skin dose versus blood-forming-organ dose differ. Record which is which | | | ☐ | |
| 87 | ★★ | Long Night text: lunar night temperature | NSSDC-FACTS Moon sheet | Decided by item 42 | | | ☐ | |

---

## Send back
When you finish a section, send the developer this list:
1. Every ⚠ and ✖ row: row number, what the game says, what the document says, page.
2. Every secondary source you could not replace with an original.
3. Any value that is correct but shown in the game with the wrong unit or label.

The developer updates `constants.ts`, then the Data Sources screen shows your page numbers and "verified" status.