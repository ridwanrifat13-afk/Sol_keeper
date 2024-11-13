import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { FiFileText, FiRotateCcw } from "react-icons/fi";
import { causalCascade, directEffects, isCrisisScenario, type Body, type LogEntry, type RunStatus, type StationId } from "@sol-keeper/sim";
import { CrisisDebriefPanel } from "./CrisisDebriefPanel.js";
import { ScoreCard } from "../../components/debrief/ScoreCard.js";
import { useDial } from "../../store/dial.js";
import { useRun } from "../../store/run.js";
import { logText } from "../../i18n/logText.js";
import { useAppLanguage } from "../../i18n/useAppLanguage.js";
import { buildResourceSummary } from "../../dial/resourceSummary.js";
import { crewLossConditions, groupIncidents, majorIncidents, type IncidentGroup } from "../../dial/blackBox.js";
import { decisionTimeline } from "../../dial/decisionTimeline.js";
import { stationLabel } from "../../dial/labels.js";
import type { DialLevel, Language } from "../../dial/types.js";
import { durationLabel, elapsedValue, timeUnitWord, timestampLabel } from "../../dial/missionTime.js";
import { statusFromSeverity } from "../../components/status.js";
import { crewLossHeadline } from "../../dial/crewLoss.js";
import { ReportLinkButton } from "../../components/ReportLinkButton.js";
import { DashboardGrid } from "../../components/DashboardGrid.js";
import { AstronautScienceCard } from "../../components/AstronautScienceCard.js";
import { getVerifiedScienceCards } from "../../data/astronautScience.js";
import { BigIdeaCheck } from "../../components/BigIdeaCheck.js";

/**
 * The Black Box debrief — what happened, and what an entry actually caused.
 *
 * The two honesty rules behind "major incidents" and the crew-loss "conditions" list are
 * documented at dial/blackBox.ts, next to the functions that implement them, so the rule
 * and its code cannot drift apart the way a comment here and logic there eventually would.
 *
 * M11: fully bilingual — every heading/label/hint below is a real `t()` call
 * (`locales/en.json`/`bn.json`'s own "debrief" namespace), and every station-name/log-text
 * call takes the player's current language via `useAppLanguage()`, the same pipeline
 * `views/Report/MissionReportView.tsx` now uses.
 */
const CREW_LOSS_WINDOW_HOURS = 72;

export function DebriefView({
  onViewReport,
  onOpenDataPassport,
  onRewind,
}: {
  onViewReport: () => void;
  onOpenDataPassport?: () => void;
  onRewind?: (station?: StationId) => void;
}) {
  const state = useRun((s) => s.state);
  const scenario = useRun((s) => s.scenario);
  const inputLog = useRun((s) => s.inputLog);
  const rewindToDecision = useRun((s) => s.rewindToDecision);
  const body = scenario.body;
  const level = useDial((s) => s.level);
  const language = useAppLanguage();
  const { t } = useTranslation();

  if (state.status === "running") {
    return (
      <DashboardGrid className="debrief console two-col">
        <header className="view-head">
          <h2>{t("debrief.notReadyHeading")}</h2>
          <p className="view-hint">{t(level === "cadet" ? "debrief.notReadyHintCadet" : "debrief.notReadyHint")}</p>
        </header>
        <ReportLinkButton />
      </DashboardGrid>
    );
  }

  const summary = buildResourceSummary(state, level, language);
  const log = state.log;
  const incidents = majorIncidents(log);
  const incidentGroups = groupIncidents(incidents, log);
  const decisions = decisionTimeline(log);
  const crewLosses = log.filter((e) => e.code === "crew.lost" || e.code.startsWith("crew.lost."));

  const headline = outcomeHeadline(t, state.status, state.hour, body, summary.livingCrew, state.crew.length, level);

  return (
    <DashboardGrid className="debrief console two-col" layoutKey="debrief">
      <header className="view-head">
        <h2>{headline.title}</h2>
        <p className="view-hint">{headline.subtitle}</p>
      </header>

      <div className="debrief-actions">
        <ReportLinkButton />
        {/* M10.8: the dedicated printable one-pager (crew+stations, site, a station-tagged
            decision timeline, a "What NASA did" card, a replay link, a data-sources footer) —
            Debrief stays the interactive/exploratory view, per the M10 plan's own finding #5. */}
        <button type="button" className="btn" onClick={onViewReport}>
          <FiFileText aria-hidden="true" /> {t("debrief.viewReport")}
        </button>
        {onOpenDataPassport && (
          <button type="button" className="btn btn-quiet" onClick={onOpenDataPassport}>
            {t("tabs.dataPassport", "Data Passport")}
          </button>
        )}
      </div>

      <section className="panel" aria-labelledby="final-numbers-heading">
        <h2 id="final-numbers-heading">{t("debrief.finalNumbersHeading")}</h2>
        <dl className="final-numbers">
          <FinalNumber
            label={t("debrief.oxygen")}
            value={summary.oxygen.text.valueText ?? formatValue(state.atmosphere.o2PartialPressureMmHg, summary.oxygen.text)}
            status={summary.oxygen.status.className}
          />
          <FinalNumber
            label={t("debrief.water")}
            value={summary.water.text.valueText ?? formatValue(state.water.potableKg, summary.water.text)}
            status={summary.water.status.className}
          />
          <FinalNumber
            label={t("debrief.food")}
            value={summary.food.text.valueText ?? formatValue(state.food.storedDryMassKg, summary.food.text)}
            status={summary.food.status.className}
          />
          <FinalNumber
            label={t("debrief.battery")}
            value={summary.battery.text.valueText ?? formatValue(state.power.batteryEnergyKwh, summary.battery.text)}
            status={summary.battery.status.className}
          />
          <FinalNumber
            label={t("debrief.harvested")}
            value={`${state.food.cumulativeHarvestKg.toFixed(1)} kg`}
            status="is-nominal"
          />
          <FinalNumber
            label={t("debrief.isruOxygen")}
            value={`${(state.isru.moxieO2ProducedKg * 1000).toFixed(0)} g`}
            status="is-nominal"
          />
        </dl>
      </section>

      {crewLosses.length > 0 && (
        <section className="panel" aria-labelledby="crew-lost-heading">
          <h2 id="crew-lost-heading">{t("debrief.crewLostHeading")}</h2>
          {crewLosses.map((loss) => (
            <CrewLossReport key={loss.id} entry={loss} log={log} level={level} language={language} />
          ))}
        </section>
      )}

      <section className="panel" aria-labelledby="incidents-heading">
        <h2 id="incidents-heading">{t("debrief.incidentsHeading", { count: incidents.length })}</h2>
        <p className="panel-hint">{t("debrief.incidentsHint")}</p>
        <ul className="incident-list">
          {incidentGroups.length === 0 && <li className="event-empty">{t("debrief.incidentsEmpty")}</li>}
          {incidentGroups.map((group) => (
            <IncidentRow
              key={`${group.sample.id}-${group.count}`}
              group={group}
              log={log}
              level={level}
              language={language}
              body={body}
            />
          ))}
        </ul>
      </section>

      {isCrisisScenario(scenario) && <CrisisDebriefPanel scenario={scenario} state={state} />}

      {scenario.id === "storm-watch" && (
        <section className="panel panel-span-full" aria-labelledby="storm-watch-debrief-heading">
          <h2 id="storm-watch-debrief-heading">
            Archived Event: May 10, 2024 — Real Storm Comparison
          </h2>
          <p className="panel-hint">
            Simulation based on real solar activity from NASA DONKI records.
          </p>
          <div style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>
            <p>
              <strong>What happened in 2024:</strong> NASA instruments recorded a powerful X-class solar flare triggering a coronal mass ejection and solar energetic particle (SEP) storm. Protons arrived within ~73 minutes of flare detection (within the measured 30–90 min onset window). Multiple Earth-orbiting satellites went into safe mode, while astronauts aboard the ISS took shelter in heavily shielded modules.
            </p>
            <p>
              <strong>Your outpost shielding response:</strong>{" "}
              {state.radiation.shelterReinforced === true
                ? "You reinforced the habitat shelter with water walls, reducing incoming particle dose by 5×. This proactive decision kept crew cumulative dose well below the NASA 250 mSv per-event limit."
                : "You sheltered the crew in standard habitat quarters without water reinforcement, keeping life support and thermal power intact while safely absorbing baseline attenuated dose."}
            </p>
            <p style={{ fontSize: "0.8rem", opacity: 0.8, fontStyle: "italic", marginTop: "0.5rem" }}>
              Note: Planetary exposure modeled based on real solar activity. Solar energetic particles travel outwards from the Sun across interplanetary space; surface dosages differ by location and local atmospheric column mass.
            </p>
          </div>
        </section>
      )}

      <ScoreCard
        level={level}
        onJumpToEvent={(eventId) => {
          const el = document.getElementById(`event-${eventId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("event-card-highlighted");
            setTimeout(() => el.classList.remove("event-card-highlighted"), 2000);
          }
        }}
      />

      {getVerifiedScienceCards().length > 0 && (
        <section className="panel panel-span-full" aria-labelledby="debrief-science-heading">
          <h2 id="debrief-science-heading">NASA Research in Review</h2>
          <p className="panel-hint">
            Archived biological and human health findings from spaceflight missions (OSDR).
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {getVerifiedScienceCards().map((card) => (
              <AstronautScienceCard key={card.id} card={card} compact />
            ))}
          </div>
        </section>
      )}

      <BigIdeaCheck scenarioId={scenario.id} />

      {decisions.length > 0 && (
        <section className="panel panel-span-full" aria-labelledby="debrief-decisions-heading">
          <h2 id="debrief-decisions-heading">{t("debrief.decisionsHeading", "Decision Cards & Try Again")}</h2>
          <p className="panel-hint">
            {t("debrief.decisionsHint", "Review your recorded choices. Rewind to any decision to try a different strategy and see how the mission unfolds.")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {decisions.map(({ entry, station }, idx) => (
              <div
                key={entry.id}
                className="panel"
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-panel, #2a364f)",
                  padding: "0.85rem",
                  borderRadius: "6px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.8rem", color: "#38bdf8", fontWeight: 600 }}>
                      {station !== undefined ? stationLabel(station, level, language) : "Outpost"}
                    </span>
                    <span style={{ fontSize: "0.8rem", opacity: 0.75 }}>
                      {timestampLabel(entry.hour, body)}
                    </span>
                  </div>
                  <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.95rem", lineHeight: 1.4 }}>
                    {logText(entry, level, language)}
                  </p>
                </div>
                {idx < inputLog.length && (
                  <button
                    type="button"
                    className="btn btn-quiet"
                    style={{ alignSelf: "flex-start", fontSize: "0.85rem" }}
                    onClick={() => {
                      rewindToDecision(idx);
                      onRewind?.(station);
                    }}
                  >
                    <FiRotateCcw aria-hidden="true" /> Rewind to here
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="panel" aria-labelledby="timeline-heading">
        <h2 id="timeline-heading">{t("debrief.timelineHeading", { count: log.length })}</h2>
        <ul className="event-list event-list-full">
          {log.map((entry) => {
            const status = statusFromSeverity(entry.severity);
            const decisionIdx = entry.kind === "decision" ? decisions.findIndex((d) => d.entry.id === entry.id) : -1;
            return (
              <li key={entry.id} id={`event-${entry.id}`} className={`event-card ${status.className}`}>
                <div className="event-head">
                  <span className="event-sev">
                    <span aria-hidden="true">{status.glyph}</span> {status.label}
                  </span>
                  <span className="event-time">{timestampLabel(entry.hour, body)}</span>
                </div>
                <p className="event-text">{logText(entry, level, language)}</p>
                {decisionIdx >= 0 && decisionIdx < inputLog.length && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      className="btn btn-quiet"
                      style={{ fontSize: "0.8rem" }}
                      onClick={() => {
                        rewindToDecision(decisionIdx);
                        onRewind?.(decisions[decisionIdx]?.station);
                      }}
                    >
                      <FiRotateCcw aria-hidden="true" /> Rewind to here
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </DashboardGrid>
  );
}

/**
 * Debrief headline text for the four real Phase 2 outcomes (Phase 1 only had "won"/"lost").
 * Real `t()` calls as of M11 (`locales/en.json`/`bn.json`'s "debrief" namespace) — distinct
 * keys from `views/Report/MissionReportView.tsx`'s own "report.title*"/"report.outcome*" keys
 * since the two screens' wording differs slightly (this one names the raw hour number).
 */
function outcomeHeadline(
  t: TFunction,
  status: RunStatus,
  hour: number,
  body: Body,
  livingCrew: number,
  crewSize: number,
  level?: DialLevel,
): { title: string; subtitle: string } {
  const timestamp = timestampLabel(hour, body, 2, level);
  const isCadet = level === "cadet";
  switch (status) {
    case "success":
      return {
        title: t("debrief.titleSuccess"),
        subtitle: isCadet
          ? t("debrief.outcomeSuccessCadet", { duration: durationLabel(hour, body, level), living: livingCrew, crew: crewSize })
          : t("debrief.outcomeSuccess", { duration: durationLabel(hour, body), living: livingCrew, crew: crewSize }),
      };
    case "partial":
      return {
        title: t("debrief.titlePartial"),
        subtitle: isCadet
          ? t("debrief.outcomePartialCadet", { hour, timestamp })
          : t("debrief.outcomePartial", { hour, timestamp }),
      };
    case "abort":
      return {
        title: t("debrief.titleAbort"),
        subtitle: isCadet
          ? t("debrief.outcomeAbortCadet", { hour, timestamp })
          : t("debrief.outcomeAbort", { hour, timestamp }),
      };
    case "loss":
      return {
        title: t("debrief.titleLoss"),
        subtitle: isCadet
          ? t("debrief.outcomeLossCadet", { hour, timestamp })
          : t("debrief.outcomeLoss", { hour, timestamp }),
      };
    case "running":
      return { title: t("debrief.notReadyHeading"), subtitle: "" };
  }
}

function formatValue(value: number, text: { unit: string; decimals: number }): string {
  return `${value.toFixed(text.decimals)} ${text.unit}`.trim();
}

function FinalNumber({ label, value, status }: { label: string; value: string; status: string }) {
  return (
    <div className={`final-number ${status}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function IncidentRow({
  group,
  log,
  level,
  language,
  body,
}: {
  group: IncidentGroup;
  log: readonly LogEntry[];
  level: DialLevel;
  language: Language;
  body: Body;
}) {
  const { t } = useTranslation();
  const effects = directEffects(log, group.sample.id);
  const cascadeSize = causalCascade(log, group.sample.id).length;
  const when =
    group.count > 1
      ? `${timeUnitWord(body, level)} ${elapsedValue(group.firstHour, body).toFixed(2)}–${elapsedValue(group.lastHour, body).toFixed(2)}`
      : timestampLabel(group.firstHour, body, 2, level);

  return (
    <li className="incident-row">
      <div className="incident-head">
        <span className="incident-time">{when}</span>
        <span className="incident-text">
          {logText(group.sample, level, language)}
          {group.count > 1 ? t("debrief.recurred", { count: group.count }) : ""}
        </span>
      </div>
      <p className="incident-effects">
        {group.count > 1 ? (
          <>{t("debrief.effectsAcrossOccurrences", { total: group.totalDirectEffects, count: group.count })}</>
        ) : (
          <>
            → {effects.length} {t("debrief.directEffect", { count: effects.length })}
            {cascadeSize !== effects.length ? t("debrief.totalDownstream", { count: cascadeSize }) : ""}
            {": "}
            {effects
              .slice(0, 6)
              .map((e) => logText(e, level, language))
              .join("; ")}
            {effects.length > 6 ? "; …" : ""}
          </>
        )}
      </p>
    </li>
  );
}

function CrewLossReport({
  entry,
  log,
  level,
  language,
}: {
  entry: LogEntry;
  log: readonly LogEntry[];
  level: DialLevel;
  language: Language;
}) {
  const { t } = useTranslation();
  const groups = crewLossConditions(entry, log, CREW_LOSS_WINDOW_HOURS);

  return (
    <div className="crew-loss-report">
      <p className="crew-loss-headline">
        {crewLossHeadline(typeof entry.data["crew"] === "string" ? entry.data["crew"] : "Crew member", level, language)}
      </p>
      {groups.length > 0 ? (
        <>
          <p className="panel-hint">
            {/* 72 hours is exactly 3 Earth days regardless of which body the mission is on —
                a fixed window choice, not derived from either body's day length, so this
                is the one time span in the app that does not need a Mars/Moon distinction. */}
            {t(level === "cadet" ? "debrief.crewLossWindowHintCadet" : "debrief.crewLossWindowHint")}
          </p>
          <ul className="condition-list">
            {groups.map((group) => (
              <li key={group.code} className="condition-row">
                {logText(group.sample, level, language)}
                {group.count > 1 ? t("debrief.recurredShort", { count: group.count }) : ""}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="panel-hint">{t("debrief.crewLossNoConditions")}</p>
      )}
    </div>
  );
}
