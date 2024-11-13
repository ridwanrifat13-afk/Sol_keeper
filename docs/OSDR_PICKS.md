# OSDR Picks — astronaut-science cards for Sol Keeper

Research review completed: **2026-11-01**. This revision updates the original shortlist proposed 2026-10-28.

> **Verification status:** The source and paper review below was completed for this revision. It is not the required teammate sign-off. Keep every card's `verified` field `false` until a teammate independently checks the sources and records their name/date. A card with `verified=false` must remain hidden in the app.

## Rules for the cards

1. Findings are one plain sentence, in our own words, 25 words or fewer. Never copy abstract text.
2. A card with `verified=false` is never rendered.
3. Label every card **"Archived NASA data (OSDR)"**. Never call it live.
4. Every card shows: OSD ID or instrument, title, source URL, and date accessed.
5. Cadet wording: warm and plain; avoid specialist terms in the finding.
6. For radiation cards, show the quantity and unit explicitly. Never compare absorbed dose with dose equivalent on the same scale.

Suggested card shape (`apps/web/public/snapshots/astronaut-science.json`):

```js
{
  id,
  osdId,             // one OSD accession, when applicable
  osdIds,            // multiple accessions for a multi-dataset finding, when applicable
  instrument,        // RadLab instrument/configuration, when applicable
  title,
  plainFinding,
  caveat,
  gameSystem,
  missionLadderStep,
  url,
  accessedOn,        // date the source was checked
  archivedOn,        // date this app snapshot was actually saved; do not substitute accessedOn
  quantity,          // e.g. dose_equivalent_rate
  unit,              // e.g. µSv/hour
  dataStart,
  dataEnd,
  verified,
  verifiedBy,
  verifiedAt
}
```

Use `osdId` for a single OSD study and `osdIds` for a finding that relies on multiple OSD datasets. For RadLab, use `instrument` and the measurement/date fields instead of inventing an OSD accession. The source label is presentation metadata and should always read **"Archived NASA data (OSDR)"**.

---

## A. Plants — Green Thumb mission, crop-tray help, Life Support debrief

Study page pattern: `https://osdr.nasa.gov/bio/repo/data/studies/OSD-{number}`

### OSD-269 — VEG-03A (PRIMARY)

- **Study page:** <https://osdr.nasa.gov/bio/repo/data/studies/OSD-269>
- **Linked paper:** Khodadad et al. (2020), *Microbiological and Nutritional Analysis of Lettuce Crops Grown on the International Space Station*, <https://pmc.ncbi.nlm.nih.gov/articles/PMC7067979/>
- **Research-reviewed plain finding (18 words):** "Researchers found no harmful human germs in the tested lettuce, supporting its use as fresh food for astronauts."
- **Caveat:** The paper discusses three lettuce plantings (VEG-01A, VEG-01B and VEG-03A). Its no-pathogen conclusion is reported across the tested plantings; do not imply that every possible contaminant was tested.
- **Review result:** The paper's conclusion says no potential human pathogens were detected in the three plantings and that they could provide a safe supplement to astronauts' diets. The original mineral comparison needs correction: the detailed results say flight and ground samples were not significantly different *within each experiment*. Some elemental differences occurred *between the three experiment runs*, not as a demonstrated VEG-03A flight-versus-ground difference. Remove the original sentence that VEG-03A minerals differed from Earth-grown lettuce.
- **Accessed:** 2026-11-01.
- **Use:** PRIMARY.
- **Game link:** Green Thumb — growing food costs power and crew time. The paper reports VEG-01A and VEG-01B harvest at day 33; VEG-03A used sequential harvests beginning at day 33. These are experiment details, not proof of a universal 28–30-day lettuce cycle. Keep the game cycle as a gameplay assumption unless a separate BVAD/source citation supports it.

### OSD-412 — VEG-03D (PRIMARY)

- **Study page:** <https://osdr.nasa.gov/bio/repo/data/studies/OSD-412>
- **Linked paper:** Hummerick et al. (2021), *Spatial Characterization of Microbial Communities on Multi-Species Leafy Greens Grown Simultaneously in the Vegetable Production Systems on the International Space Station*, <https://pmc.ncbi.nlm.nih.gov/articles/PMC8537831/>
- **Research-reviewed plain finding (20 words):** "Food-safety checks found none of three harmful germs they screened for in leafy greens grown during VEG-03D, 03E and 03F."
- **Caveat:** The paper reports the food-safety screening across the related VEG-03D, 03E and 03F runs. It reports negative screening for *E. coli*, *S. aureus* and *Salmonella*; this is not a guarantee that food is free of every germ.
- **Review result:** The paper says the tested crops were low risk to crew from a microbial food-safety perspective. It covers three leafy greens: red romaine lettuce, mizuna mustard and green-leaf lettuce. Keep the multi-run caveat visible because OSD-412 is the VEG-03D dataset, while the paper's low-risk summary covers D, E and F.
- **Accessed:** 2026-11-01.
- **Use:** PRIMARY.

### Related alternate records

| OSD ID | Experiment | Use |
|---|---|---|
| [OSD-267](https://osdr.nasa.gov/bio/repo/data/studies/OSD-267) | VEG-01A | Alternate only; separate experiment record |
| [OSD-268](https://osdr.nasa.gov/bio/repo/data/studies/OSD-268) | VEG-01B | Alternate only; separate experiment record |

OSD-267, OSD-268 and OSD-269 are related records associated with the same lettuce research paper, not interchangeable copies. Do not automatically copy experiment-specific details from OSD-269 to OSD-267 or OSD-268.

---

## B. Radiation — Storm Warning mission, Shield gauge help

- **RadLab portal:** <https://visualization.osdr.nasa.gov/radlab/gui/overview/>
- **Data API documentation:** <https://visualization.osdr.nasa.gov/radlab/gui/data-api/>
- **Selected instrument page:** <https://visualization.osdr.nasa.gov/radlab/gui/knowledgebase/ALTEA>
- **Release history:** <https://visualization.osdr.nasa.gov/radlab/gui/knowledgebase/Release_history>

### Selected series: ALTEA-Survey, ISS US Laboratory

- **Accessed:** 2026-11-01.

| Field | Selection |
|---|---|
| Instrument/configuration | `ALTEA-Survey` (ALTEA-3D configuration) |
| Spacecraft | ISS |
| Module / position | US Lab / `LAB1S6` (P4) |
| Start | `2011-08-01` (inclusive) |
| End | `2011-09-01` (exclusive) |
| Window | 31 calendar days |
| Quantity | `dose_equivalent_rate` |
| Unit | µSv/hour |
| RadLab cadence | Median 60 seconds for the ALTEA-Survey dataset |

**Why this is a suitable selection:** RadLab's Release 1.1.0 notes explicitly state that the ALTEA-Survey dataset available in RadLab provides absorbed dose rate, dose-equivalent rate and particle-flux measurements, with a median cadence of 60 seconds. The ALTEA knowledgebase identifies the US Lab ALTEA-3D P4 position as `LAB1S6`, active from 2011-07-23 through 2012-06-07. The selected 31-day window falls within that documented position period.

**API query (JSON):**

```text
https://visualization.osdr.nasa.gov/radlab/api/?instrument_id=ALTEA-Survey&timestamp%3E=2011-08-01&timestamp%3C2011-09-01&dose_equivalent_rate&format=json
```

The query uses RadLab's documented key-value syntax. `instrument_id` is case-sensitive. A bare `dose_equivalent_rate` requests that measurement field; the query does not apply a numerical threshold. The API accepts JSON, CSV, TSV or HTML output.

**Actual export received and inspected:** The supplied JSON export was parsed successfully. It contains 30,645 non-null numeric `dose_equivalent_rate` records for `ALTEA-Survey`. NASA's RadLab documentation defines this field in µSv/hour.

| Export check | Result |
|---|---:|
| Requested interval | 2011-08-01 inclusive to 2011-09-01 exclusive (31 calendar days) |
| First returned timestamp | 2011-08-01 00:00 |
| Last returned timestamp | 2011-08-28 05:29 |
| Numeric, non-null records | 30,645 |
| Distinct calendar dates with data | 24 |
| Missing values | 0 |
| Longest gap between consecutive records | 109.6 hours (2011-08-13 20:34 to 2011-08-18 10:10) |
| Dates with no records in the requested month | 2011-08-14 to 2011-08-17; 2011-08-29 to 2011-08-31 |

**Important coverage qualification:** Although the API query requested 31 calendar days, the returned observations end on 2011-08-28 and do not cover 30 days from first to last timestamp. The actual first-to-last span is 27 days, 5 hours, 29 minutes (about 27.23 days), and it contains a 109.6-hour gap. Therefore this export does **not yet satisfy** the checklist requirement for an observed window of at least 30 days. Do not label it a complete 31-day series.

**Preliminary statistics from the returned samples (not a validated 30-day average):**

| Statistic | Result |
|---|---:|
| Arithmetic mean of 30,645 recorded samples | 37.2684 µSv/hour |
| Median recorded sample | 22.5740 µSv/hour |
| Minimum recorded sample | 0.0829 µSv/hour |
| Maximum recorded sample | 426.9555 µSv/hour |
| Arithmetic sample mean converted to a 24-hour equivalent rate | 0.8944 mSv/day |

The conversion is:

```text
sample-mean mSv/day = arithmetic mean(dose_equivalent_rate in µSv/hour) × 0.024
```

The 0.8944 mSv/day result is the arithmetic mean of the returned samples expressed as a 24-hour equivalent rate. It is **not** an integrated crew dose, a gap-corrected time-weighted mean, or a complete 30-day exposure average. The large sampling gap makes an unqualified daily-average claim inappropriate. RadLab's time-series view distinguishes ordinary mean from its “mean cumulative” estimate, which uses value/time-delta information to approximate gaps; inspect that view before publishing any time-weighted statistic.

Do not substitute `absorbed_dose_rate` (µGy/hour) into this conversion or plot it on the same bar as the game's mSv/day dose-equivalent values. Also label this as an ISS low-Earth-orbit measurement, not a Moon or Mars reading.

**Suggested snapshot filename:**

```text
docs/api-samples/radlab_ALTEA-Survey_2011-08-01_2011-09-01.json
```

**Suggested card finding (safe, non-numerical wording):** "A radiation detector aboard the space station recorded dose-equivalent readings in the US Laboratory."

**Suggested displayed statistic (not cleared for the 30-day comparison):** `37.2684 µSv/hour` arithmetic mean of 30,645 returned samples; equivalent rate `0.8944 mSv/day`. Display the observation start/end dates and explicitly disclose that the export ends on 2011-08-28, includes a 109.6-hour gap, and is not a complete 30-day series. Prefer not to compare this preliminary statistic directly with the game's Moon/Mars/cruise values until a suitable ≥30-day series is retrieved and the gap treatment is documented.

**Card caveat:** "This is an archived ISS measurement, not a Moon or Mars reading. The selected measurement is dose equivalent; it should not be treated as a direct prediction for another location."

### Beyond-ISS RadLab data

The earlier question about rover or beyond-low-Earth-orbit data is resolved: RadLab Release 1.1.2 lists CRaTER-D1D2 aboard the Lunar Reconnaissance Orbiter in Moon orbit, Liulin-MO aboard ExoMars Trace Gas Orbiter during Mars cruise and Mars orbit, and MSL/RAD aboard Curiosity on the Mars surface. This confirms that RadLab includes beyond-ISS instruments. It does **not** establish that those specific series provide dose-equivalent values; inspect their available measurement fields before comparing them with Sol Keeper's mSv/day constants.

### Optional stretch — ISS air / CO₂

OSDR's Environmental Data Application provides ISS cabin and hardware telemetry, including environmental measurements. A CO₂ card still requires selection of a specific mission/series, export and unit check. The conversion `3 mmHg ≈ 3,950 ppm` is valid only when assuming a total pressure of 760 mmHg (`3 / 760 × 1,000,000`). NASA limits also specify averaging periods; compare a measured value with a limit using the same averaging interval. Do not publish an ISS CO₂ value until the actual telemetry and context are checked.

---

## C. Human health — Debrief, Crew Welfare

**Main paper:** *Molecular and physiological changes in the SpaceX Inspiration4 civilian crew*, Nature (2024), DOI <https://doi.org/10.1038/s41586-024-07648-x>.
- **Accessed:** 2026-11-01.

- **NASA dataset announcement:** <https://www.nasa.gov/osdr-latest-news-i4-mission-datasets/>
- **Paper:** <https://www.nature.com/articles/s41586-024-07648-x>

### Inspiration4 OSDR accessions confirmed by NASA

| OSD ID | Dataset, as listed by NASA |
|---|---|
| OSD-569 | Whole Blood |
| OSD-570 | Peripheral Blood Mononuclear Cells (PBMC) |
| OSD-571 | Blood Plasma |
| OSD-575 | Blood Serum |
| OSD-572 | Swabs (Skin, Oral and Nasal) |
| OSD-573 | Environmental (Dragon Capsule) swabs |
| OSD-574 | Skin Biopsies |
| OSD-630 | Stool |
| OSD-656 | Urine |
| OSD-687 | T-cells |

NASA's announcement lists these ten records. Use the complete relevant accession list when one card summarizes the multi-omic paper; do not imply a single specimen dataset supports every result.

**Research-reviewed plain finding (16 words):** "After the three-day flight, almost all measured health markers were similar to the crew's pre-flight levels."

**Required caveat:** "Only four people took part, and the study had no age- and sex-matched Earth control group. The authors describe these early civilian-flight findings as preliminary; they do not prove that long Moon or Mars missions are safe."

**Review result:** The Nature paper reports that almost all measured metrics did not differ from pre-flight baseline after return to Earth. Its limitations section identifies the small crew (`n = 4`) and the lack of age- and sex-matched Earth controls. The paper calls for larger studies. The finding is deliberately phrased as "almost all" and "similar" rather than claiming every body change returned to normal.

**Suggested card fields:** `osdIds` should contain the ten accessions above; `url` should link to the Nature paper; `gameSystem` = `Crew Welfare`; `missionLadderStep` = `Debrief`.

---

## What is now confirmed, and what remains open

1. **Inspiration4 OSD IDs:** Confirmed — NASA lists OSD-569, 570, 571, 572, 573, 574, 575, 630, 656 and 687.
2. **RadLab API syntax:** Confirmed from the official Data API documentation. The API uses GET requests and supports key-value or Boolean-expression syntax; do not mix the two. JSON, CSV, TSV and HTML are supported.
3. **Beyond-ISS RadLab instruments:** Confirmed — RadLab lists LRO/CRaTER in Moon orbit, ExoMars TGO/Liulin-MO in Mars cruise and Mars orbit, and Curiosity/MSL-RAD on the Mars surface.
4. **Dose-equivalent series:** ALTEA-Survey is confirmed as a RadLab dataset that provides `dose_equivalent_rate`. The JSON export was received and contains 30,645 non-null values in µSv/hour. However, the requested 31-day query returned data only through 2011-08-28 (27.23 days from first to last timestamp), with a 109.6-hour gap; it does not satisfy the observed ≥30-day requirement. Retrieve another date window or instrument series before approving a 30-day radiation comparison.
5. **Optional ISS CO₂ card:** The EDA source is identified, but a specific telemetry series and export have not been verified here.
6. **Vegetable-growth game constant:** The lettuce paper documents a day-33 harvest schedule for VEG-01A/B and sequential VEG-03A harvests beginning at day 33. A universal BVAD 28–30-day cycle has not been established by these papers; retain it only as an explicitly labelled gameplay assumption unless verified separately.

### OSDR Biological Data API note

The official OSDR Biological Data API documentation is <https://visualization.osdr.nasa.gov/biodata/api/>. It documents REST endpoints including `/v2/datasets/`, `/v2/dataset/OSD-569/` and `/v2/dataset/OSD-569/files/`. This is separate from the RadLab API described above. Use the documentation for exact syntax rather than guessing legacy metadata or file endpoints.

---

## Verification checklist

The four checkboxes record the research review performed for this revision. **The teammate sign-off columns are intentionally blank.** Keep app `verified=false` until the teammate sign-off is complete.

| Card | Study/source page opened | Paper read | Sentence matches source | Kid-safe wording | Verified by (teammate) | Date (teammate) |
|---|---|---|---|---|---|---|
| plants-OSD-269 | [x] | [x] | [x] | [x] | Rifat (lead developer)| 2026-11-07  |
| plants-OSD-412 | [x] | [x] | [x] | [x] | Rifat (lead developer)| 2026-11-07|
| radiation-RadLab-ALTEA-Survey | [x] | N/A | [x] export parsed; [ ] ≥30-day coverage | [x] | | |
| health-I4 | [x] | [x] | [x] | [x] | Rifat (lead developer)| 2026-11-07 |
| iss-co2 (optional) | [x] overview only | N/A | [ ] export pending | [ ] | | |

## Sources checked (accessed 2026-11-01)

- OSD-269 study record: <https://osdr.nasa.gov/bio/repo/data/studies/OSD-269>
- OSD-269 linked paper: <https://pmc.ncbi.nlm.nih.gov/articles/PMC7067979/>
- OSD-412 study record: <https://osdr.nasa.gov/bio/repo/data/studies/OSD-412>
- OSD-412 linked paper: <https://pmc.ncbi.nlm.nih.gov/articles/PMC8537831/>
- NASA Inspiration4 accession announcement: <https://www.nasa.gov/osdr-latest-news-i4-mission-datasets/>
- Nature Inspiration4 paper: <https://doi.org/10.1038/s41586-024-07648-x>
- RadLab Data API: <https://visualization.osdr.nasa.gov/radlab/gui/data-api/>
- RadLab time-series statistics and gap-handling notes: <https://visualization.osdr.nasa.gov/radlab/gui/time-series-plots/>
- Supplied export inspected: `radlab_ALTEA-Survey_2011-08-01_2011-09-01.json` (30,645 records; local attachment; accessed 2026-11-01).
- RadLab ALTEA knowledgebase: <https://visualization.osdr.nasa.gov/radlab/gui/knowledgebase/ALTEA>
- RadLab release history: <https://visualization.osdr.nasa.gov/radlab/gui/knowledgebase/Release_history>
- OSDR Biological Data API: <https://visualization.osdr.nasa.gov/biodata/api/>
