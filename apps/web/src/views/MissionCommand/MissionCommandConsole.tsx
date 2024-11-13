import { useState } from "react";
import {
  checkGoal,
  crew as crewConstants,
  crewCondition,
  isDoubleCovering,
  stationCoverer,
  stationPerformance,
  inMarsDepartureWindow,
  EventLogger,
  Rng,
  STATION_IDS,
  type ResearchTaskId,
  type StationId,
  type TickContext,
} from "@sol-keeper/sim";
import { FiCalendar, FiUsers, FiAlertTriangle, FiClock } from "react-icons/fi";
import { useRun } from "../../store/run.js";
import { useDial } from "../../store/dial.js";
import { CrewPanel } from "../../components/CrewPanel.js";
import { OrbitalView } from "../../components/OrbitalView.js";
import { ScenarioSwitch } from "../../components/ScenarioSwitch.js";
import { EsmPanel } from "../../components/EsmPanel.js";
import { STATUS } from "../../components/status.js";
import { StatusPill } from "../../components/StatusPill.js";
import {
  co2ScrubberModeLabel,
  stationLabel,
  survivalModeLabel,
  thermalControlModeLabel,
  waterReclamationModeLabel,
} from "../../dial/labels.js";
import { goalText } from "../../i18n/goalText.js";
import { useAppLanguage } from "../../i18n/useAppLanguage.js";
import { durationLabel, elapsedValue, timeUnitWord } from "../../dial/missionTime.js";
import { SCENARIO_LABELS } from "../../dial/scenarioLabels.js";
import { DashboardGrid } from "../../components/DashboardGrid.js";
import { CockpitTarget } from "../../cockpit/CockpitTarget.js";

/**
 * The Mission Command console (M8.3): crew status, which mission is running, and the whole
 * mission's ESM budget — moved wholesale from the old Operate view (M8's settled navigation:
 * crew assignment and daily-plan/goals content are Mission Command concerns; the ESM budget
 * is a whole-mission figure, not any one resource console's).
 *
 * M8.4 Part E, the last of the five: real crew station assignment (assignStation, M8.1 —
 * already wired, no sim change needed), a per-station coverage summary showing the real,
 * already-computed consequence (stationPerformance/isDoubleCovering) of the *current*
 * assignment rather than an invented hypothetical-hover preview, a read-only daily-plan
 * rollup of what the other four consoles currently have set, and a real goals readout
 * (checkGoal, live against the scenario's own primary/stretch goal).
 *
 * M9.x (player request, batch 2): "Crew schedule" — the overtime-authorization toggle, the
 * fourth of four new nominal-conditions levers this batch adds (the other three are the Life
 * Support console's water reclamation and thermal control dials). Reads
 * crew.overtimeCeilingFractionOfAverage/crew.overtimeFatiguePerHourAboveCeiling
 * (BVAD-2022, already sourced, never read by any model before this) via
 * engine/crewHours.ts's own day-boundary bookkeeping.
 *
 * Player request #9's second half: "the mission command panels should look like a real NASA
 * operation center." The `ops-center` class (styles.css) adds a console-room grid backdrop
 * and a "big board" status strip — real, already-live numbers (mission elapsed time, crew
 * alive/total, active alerts) in the large tabular-nums readout a real ops room's main
 * display uses, not new state or invented figures.
 *
 * A later request built on that same theme: "a 3d model like eyes.nasa.gov... to show
 * moon/mars orbiting." That first shipped as an original Three.js/WebGL scene (real orbital
 * periods, synced to store/run.ts's own speed/phase/status) — then the player asked directly
 * whether NASA's own eyes.nasa.gov could be used instead. OrbitalView.tsx is now a direct
 * embed of that real app (its own doc comment has the full investigation: no frame-blocking
 * header, its own documented `logo=false` embed option genuinely removes the NASA insignia —
 * confirmed with the player, since attribution alone doesn't satisfy brief rule 5 — and real
 * `#/mars`/`#/moon` routes). No longer synced to the sim clock: NASA's own app runs on the
 * real live clock with no cross-origin API this page can drive, a real, disclosed trade the
 * player accepted for the real thing over a custom approximation. A plain iframe needs no
 * code-splitting the way the Three.js build it replaced did.
 */
const RESEARCH_OPTIONS = [
  {
    id: "labRun" as ResearchTaskId,
    label: "Lab Run",
    labelCadet: "Inside Lab Test",
    labelBn: "ল্যাব গবেষণা",
    labelCadetBn: "ল্যাব পরীক্ষা",
    crewHours: 2,
    powerKwh: 1.5,
    evaDoseMsv: 0,
    points: 10,
    hint: "2 CM-h, 1.5 kWh. Safe indoor experiment.",
    hintCadet: "Uses 2 crew-hours and 1.5 kWh power.",
    hintBn: "২ ক্রু-ঘণ্টা, ১.৫ kWh। নিরাপদ ইনডোর গবেষণা।",
    hintCadetBn: "২ ক্রু-ঘণ্টা এবং ১.৫ kWh বিদ্যুৎ লাগবে।",
  },
  {
    id: "sampleTrip" as ResearchTaskId,
    label: "Sample Trip (EVA)",
    labelCadet: "Outside Moonwalk",
    labelBn: "নমুনা সংগ্রহ (ইভিএ)",
    labelCadetBn: "বাইরে হেঁটে নমুনা আনা",
    crewHours: 3,
    powerKwh: 0,
    evaDoseMsv: 0.5,
    points: 15,
    hint: "3 CM-h, 0 kWh. Crew receives ~0.5 mSv EVA dose.",
    hintCadet: "Uses 3 crew-hours. Adds space ray dose.",
    hintBn: "৩ ক্রু-ঘণ্টা, ০ kWh। ক্রু ০.৫ mSv ইভিএ বিকিরণ পায়।",
    hintCadetBn: "৩ ক্রু-ঘণ্টা লাগবে। মহাজাগতিক রশ্মির ঝুঁকি আছে।",
  },
  {
    id: "extendedExperiment" as ResearchTaskId,
    label: "Extended Experiment",
    labelCadet: "Deep Study",
    labelBn: "দীর্ঘমেয়াদী পরীক্ষণ",
    labelCadetBn: "গভীর গবেষণা",
    crewHours: 4,
    powerKwh: 3.0,
    evaDoseMsv: 0,
    points: 20,
    hint: "4 CM-h, 3.0 kWh. High-yield science study.",
    hintCadet: "Uses 4 crew-hours and 3.0 kWh power.",
    hintBn: "৪ ক্রু-ঘণ্টা, ৩.০ kWh। সর্বোচ্চ বিজ্ঞান পয়েন্ট।",
    hintCadetBn: "৪ ক্রু-ঘণ্টা এবং ৩.০ kWh বিদ্যুৎ লাগবে।",
  },
] as const;

export function MissionCommandConsole() {
  // `state` is mutated in place (store/run.ts's own doc comment) — subscribing to `version`
  // is what actually triggers a re-render for a console reading it (the same fix M8.2's
  // DecisionCard and M8.4 Part D's IncidentCommandConsole needed for the same reason).
  useRun((s) => s.version);
  const state = useRun((s) => s.state);
  const params = useRun((s) => s.params);
  const scenario = useRun((s) => s.scenario);
  const phase = useRun((s) => s.phase);
  const inputLog = useRun((s) => s.inputLog);
  const assignStation = useRun((s) => s.assignStation);
  const setOvertimeAuthorized = useRun((s) => s.setOvertimeAuthorized);
  const conductResearch = useRun((s) => s.conductResearch);
  const abortMission = useRun((s) => s.abortMission);
  const level = useDial((s) => s.level);
  const language = useAppLanguage();
  const locked = phase !== "planning";
  const [confirmingAbort, setConfirmingAbort] = useState(false);

  const currentDayIndex = Math.floor(state.hour / 24);
  const selectedTaskId = (() => {
    for (let i = inputLog.length - 1; i >= 0; i--) {
      const entry = inputLog[i];
      if (
        entry &&
        Math.floor(entry.hour / 24) === currentDayIndex &&
        entry.input.kind === "conductResearch"
      ) {
        return entry.input.task;
      }
    }
    return null;
  })();

  // Read-only ad hoc TickContext, the same shape resolveIncident/DecisionCard already build —
  // stationPerformance/stationCoverer/isDoubleCovering only ever read ctx.state, never
  // ctx.rng/ctx.log, so building this here has no side effect.
  const ctx: TickContext = {
    state,
    params,
    scenario,
    rng: new Rng(state.rng),
    log: new EventLogger(state.log, state.hour),
    dtHours: 1,
  };

  const primaryMet = checkGoal(scenario.primaryGoal, state, scenario);
  const stretchMet = checkGoal(scenario.stretchGoal, state, scenario);

  const aliveCrewCount = state.crew.filter((c) => c.alive).length;
  const activeAlertCount = state.activeIncidents.filter(
    (i) => i.resolvedAtHour === undefined,
  ).length;

  return (
    <DashboardGrid className="console ops-center two-col" layoutKey="missionCommand">
      <header className="view-head">
        <h2>Mission Command</h2>
        <p className="view-hint">
          Crew status, the current mission, and the whole-mission mass budget.
        </p>
      </header>

      {/* Player request: swapped with the orbital view below — that now takes the top/primary
         screen, this one takes the secondary slot it used to hold. */}
      <CockpitTarget id="mission-ops-board" role="secondary" priority={6} label="Mission status">
        <section className="ops-board panel-span-full" aria-labelledby="ops-board-heading">
          <h2 id="ops-board-heading" className="visually-hidden">
            Mission status board
          </h2>
          <div className="ops-board-row">
            <span className="ops-live-dot" aria-hidden="true" />
            <span className="ops-board-title">
              {SCENARIO_LABELS[scenario.id].label.toUpperCase()} ·{" "}
              {state.status === "running" ? "MISSION IN PROGRESS" : state.status.toUpperCase()}
            </span>
          </div>
          <div className="ops-board-readouts">
            <div className="ops-readout">
              <span className="ops-readout-icon" aria-hidden="true">
                <FiCalendar />
              </span>
              <span className="ops-readout-body">
                <span className="ops-readout-value">
                  {elapsedValue(state.hour, scenario.body).toFixed(2)}
                  <span className="ops-readout-unit">
                    {" "}
                    / {durationLabel(scenario.durationHours, scenario.body)}
                  </span>
                </span>
                <span className="ops-readout-label">{timeUnitWord(scenario.body)} elapsed</span>
              </span>
            </div>
            <div className="ops-readout">
              <span className="ops-readout-icon" aria-hidden="true">
                <FiUsers />
              </span>
              <span className="ops-readout-body">
                <span className="ops-readout-value">
                  {aliveCrewCount}
                  <span className="ops-readout-unit"> / {state.crew.length}</span>
                </span>
                <span className="ops-readout-label">Crew alive</span>
              </span>
            </div>
            <div className="ops-readout">
              <span className="ops-readout-icon" aria-hidden="true">
                <FiAlertTriangle />
              </span>
              <span className="ops-readout-body">
                <span
                  className={`ops-readout-value ${activeAlertCount > 0 ? "ops-readout-alert" : ""}`}
                >
                  {activeAlertCount}
                </span>
                <span className="ops-readout-label">Active alerts</span>
              </span>
            </div>
            <div className="ops-readout">
              <span className="ops-readout-icon" aria-hidden="true">
                <FiClock />
              </span>
              <span className="ops-readout-body">
                <span className="ops-readout-value">{state.hour}</span>
                <span className="ops-readout-label">Mission hour</span>
              </span>
            </div>
          </div>
        </section>
      </CockpitTarget>

      <CockpitTarget id="mission-orbital-view" role="primary" priority={1} label="Orbital view">
        <OrbitalView />
      </CockpitTarget>

      <CockpitTarget id="mission-scenario-switch" role="secondary" priority={7} label="Scenario">
        <ScenarioSwitch />
      </CockpitTarget>
      <CockpitTarget id="mission-crew-panel" role="secondary" priority={8} label="Crew">
        <CrewPanel />
      </CockpitTarget>

      <CockpitTarget
        id="mission-station-coverage"
        role="secondary"
        priority={3}
        label="Station coverage"
      >
        <section className="panel" aria-labelledby="station-coverage-heading">
          <h2 id="station-coverage-heading">Station coverage</h2>
          <p className="panel-hint">Who covers what right now, and how effectively.</p>
          <ul className="status-list">
            {STATION_IDS.map((station) => {
              const coverer = stationCoverer(ctx, station);
              const performance = stationPerformance(ctx, station, crewCondition);
              const doubleCovering = coverer !== undefined && isDoubleCovering(ctx, coverer);
              return (
                <li key={station}>
                  <span className="status-list-label">
                    {stationLabel(station, level, language)}
                  </span>
                  <span className="status-list-value">
                    {coverer !== undefined ? coverer.name : "Unassigned"} ·{" "}
                    {Math.round(performance * 100)}%{doubleCovering ? " (double-covering)" : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </CockpitTarget>

      <CockpitTarget
        id="mission-crew-assignment"
        role="secondary"
        priority={1}
        label="Crew assignment"
      >
        <section className="panel" aria-labelledby="crew-assignment-heading">
          <h2 id="crew-assignment-heading">Crew assignment</h2>
          <p className="panel-hint">
            Which station each crew member covers.
            {locked &&
              (level === "cadet"
                ? " Locked while the day is running — adjust it during Day Planning."
                : " Locked while the sol is running — adjust it during Sol Planning.")}
          </p>
          <ul className="crew-location-list">
            {state.crew
              .filter((c) => c.alive)
              .map((member) => (
                <li key={member.id} className="crew-location-row">
                  <span className="crew-location-name">{member.name}</span>
                  <span className="button-row" role="group" aria-label={`${member.name}'s station`}>
                    {STATION_IDS.map((station: StationId) => (
                      <button
                        key={station}
                        type="button"
                        className={`btn btn-tiny ${member.primaryStation === station ? "btn-active" : ""}`}
                        aria-pressed={member.primaryStation === station}
                        disabled={locked}
                        onClick={() => {
                          assignStation(member.id, station);
                        }}
                      >
                        {stationLabel(station, level, language)}
                      </button>
                    ))}
                  </span>
                </li>
              ))}
          </ul>
        </section>
      </CockpitTarget>

      <CockpitTarget id="mission-crew-schedule" role="secondary" priority={2} label="Crew schedule">
        <section className="panel" aria-labelledby="crew-schedule-heading">
          <h2 id="crew-schedule-heading">Crew schedule</h2>
          <p className="panel-hint">
            A fourth real lever: authorizing overtime raises today's crew-hours ceiling by{" "}
            {Math.round((crewConstants.overtimeCeilingFractionOfAverage.value - 1) * 100)}%
            (BVAD-2022's own "maximum available VST" figure) — more room for incident response and
            repairs — but any hours actually worked past the ordinary budget cost the whole crew
            real, felt fatigue once the sol ends. Costs nothing if the extra hours go unused.
            {locked &&
              (level === "cadet"
                ? " Locked while the day is running — adjust it during Day Planning."
                : " Locked while the sol is running — adjust it during Sol Planning.")}
          </p>
          <div className="button-row" role="group" aria-label="Overtime authorization">
            <button
              type="button"
              className={`btn ${!state.crewHours.overtimeAuthorized ? "btn-active" : ""}`}
              aria-pressed={!state.crewHours.overtimeAuthorized}
              disabled={locked}
              onClick={() => {
                setOvertimeAuthorized(false);
              }}
            >
              Standard hours
              <span className="btn-sub">no fatigue risk</span>
            </button>
            <button
              type="button"
              className={`btn ${state.crewHours.overtimeAuthorized ? "btn-active" : ""}`}
              aria-pressed={state.crewHours.overtimeAuthorized}
              disabled={locked}
              onClick={() => {
                setOvertimeAuthorized(true);
              }}
            >
              Authorize overtime
              <span className="btn-sub">
                up to{" "}
                {(
                  state.crewHours.unboostedBudgetTodayHours *
                  crewConstants.overtimeCeilingFractionOfAverage.value
                ).toFixed(1)}{" "}
                h today
              </span>
            </button>
          </div>
          <p className="panel-hint">
            Today: {state.crewHours.spentTodayHours.toFixed(1)} /{" "}
            {state.crewHours.budgetTodayHours.toFixed(1)} h spent.
          </p>
        </section>
      </CockpitTarget>

      <CockpitTarget id="mission-daily-plan" role="secondary" priority={4} label="Daily plan">
        <section className="panel" aria-labelledby="daily-plan-heading">
          <h2 id="daily-plan-heading">Daily plan</h2>
          <ul className="status-list">
            <li>
              <span className="status-list-label">Rations</span>
              <span className="status-list-value">
                {survivalModeLabel(state.food.mode, level, language)}
              </span>
            </li>
            <li>
              <span className="status-list-label">Downlink priority</span>
              <span className="status-list-value">
                {state.comms.priority === "personal"
                  ? "Personal correspondence"
                  : "Science downlink"}
              </span>
            </li>
            <li>
              <span className="status-list-label">Air cleaner</span>
              <span className="status-list-value">
                {co2ScrubberModeLabel(state.atmosphere.co2ScrubberMode, level, language)}
              </span>
            </li>
            <li>
              <span className="status-list-label">Water reclamation</span>
              <span className="status-list-value">
                {waterReclamationModeLabel(state.water.reclamationMode, level, language)}
              </span>
            </li>
            <li>
              <span className="status-list-label">Thermal control</span>
              <span className="status-list-value">
                {thermalControlModeLabel(state.thermal.controlMode, level, language)}
              </span>
            </li>
            <li>
              <span className="status-list-label">Overtime</span>
              <span className="status-list-value">
                {state.crewHours.overtimeAuthorized ? "Authorized" : "Standard hours"}
              </span>
            </li>
            <li>
              <span className="status-list-label">Repair queue</span>
              <span className="status-list-value">{state.crewHours.queue.length} item(s)</span>
            </li>
          </ul>
        </section>
      </CockpitTarget>

      <CockpitTarget id="mission-research" role="secondary" priority={4} label="Science Research">
        <section className="panel" aria-labelledby="research-heading">
          <h2 id="research-heading">Science Research</h2>
          <p className="panel-hint">
            {level === "cadet"
              ? "Pick science jobs to score points! They cost crew time, battery, or space ray dose."
              : "Invest available crew-hours, power, or radiation margin into research to meet the mission science target."}{" "}
            Progress: {state.science.points.toFixed(0)} / {scenario.scienceTargetPoints} points.
            {locked &&
              (level === "cadet"
                ? " Locked while the day is running — adjust it during Day Planning."
                : " Locked while the sol is running — adjust it during Sol Planning.")}
          </p>
          <div className="button-row" role="group" aria-label="Research choices">
            {RESEARCH_OPTIONS.map((opt) => {
              const hoursRemaining = Math.max(
                0,
                state.crewHours.budgetTodayHours - state.crewHours.spentTodayHours,
              );
              const isSelected = selectedTaskId === opt.id;
              const canAfford =
                hoursRemaining >= opt.crewHours &&
                state.power.batteryEnergyKwh >= opt.powerKwh &&
                !locked;
              const name =
                language === "bn"
                  ? level === "cadet"
                    ? opt.labelCadetBn
                    : opt.labelBn
                  : level === "cadet"
                    ? opt.labelCadet
                    : opt.label;
              const hint =
                language === "bn"
                  ? level === "cadet"
                    ? opt.hintCadetBn
                    : opt.hintBn
                  : level === "cadet"
                    ? opt.hintCadet
                    : opt.hint;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={`btn ${isSelected ? "btn-active" : ""}`}
                  aria-pressed={isSelected}
                  disabled={!canAfford}
                  onClick={() => conductResearch(opt.id)}
                >
                  {name} (+{opt.points} pts)
                  <span className="btn-sub">{hint}</span>
                </button>
              );
            })}
          </div>
        </section>
      </CockpitTarget>

      <CockpitTarget id="mission-goals" role="secondary" priority={5} label="Goals">
        <section className="panel" aria-labelledby="goals-heading">
          <h2 id="goals-heading">Goals</h2>
          <p>
            <StatusPill
              status={STATUS[primaryMet ? "nominal" : "caution"]}
              label={primaryMet ? "Primary goal met" : "Primary goal"}
            />
          </p>
          <p className="panel-hint">{goalText(scenario.primaryGoal.briefKey, level, language)}</p>
          <p>
            <StatusPill
              status={STATUS[stretchMet ? "nominal" : "caution"]}
              label={stretchMet ? "Stretch goal met" : "Stretch goal"}
            />
          </p>
          <p className="panel-hint">{goalText(scenario.stretchGoal.briefKey, level, language)}</p>
          {scenario.scienceTargetPoints > 0 && (
            <p className="panel-hint">
              Science: {state.science.points.toFixed(1)} / {scenario.scienceTargetPoints} points
            </p>
          )}
        </section>
      </CockpitTarget>

      <CockpitTarget
        id="mission-abort-control"
        role="secondary"
        priority={8}
        label="Emergency Abort"
      >
        <section className="panel" aria-labelledby="abort-heading">
          <h2 id="abort-heading">
            {language === "bn" ? "জরুরি মিশন বাতিল (Abort)" : "Emergency Mission Abort"}
          </h2>
          <p className="panel-hint">
            {scenario.body === "moon"
              ? language === "bn"
                ? "চাঁদে যেকোনো সময় মিশন বাতিল করা যায়। তবে পৃথিবীতে ফেরার জন্য ৬ দিন (১৪৪ ঘণ্টা) সময় লাগে, যার জন্য প্রয়োজনীয় সম্পদ হিসেব করা হয়।"
                : "Direct Earth return is available from the Moon at any time. Return transit requires 6 days (144 hours) of resource burn [NASA-ORION-FS]."
              : inMarsDepartureWindow(ctx)
                ? language === "bn"
                  ? "মঙ্গল প্রস্থান উইন্ডো খোলা আছে! এখনই ফিরতি যাত্রা সম্ভব।"
                  : "Mars departure window is OPEN. Earth return trajectory is currently viable."
                : language === "bn"
                  ? "মঙ্গল প্রস্থান উইন্ডো বন্ধ। কক্ষপথের নিয়মে এখন ফিরতি যাত্রা সম্ভব নয় (~৭৮০ দিনের সিনোডিক চক্র)।"
                  : "Mars departure window is CLOSED. Earth return trajectory is unreachable outside the ~780 d synodic conjunction window."}
          </p>

          {state.status === "running" && (
            <div style={{ marginTop: "1rem" }}>
              {!confirmingAbort ? (
                <button
                  type="button"
                  className="btn"
                  style={{
                    borderColor: "var(--caution, #f59e0b)",
                    color: "var(--caution, #f59e0b)",
                  }}
                  onClick={() => setConfirmingAbort(true)}
                >
                  <FiAlertTriangle aria-hidden="true" style={{ marginRight: "6px" }} />
                  {language === "bn" ? "মিশন বাতিল করুন (Abort Mission)" : "Abort Mission"}
                </button>
              ) : (
                <div
                  className="confirm-box"
                  style={{
                    padding: "12px",
                    border: "1px solid var(--caution, #f59e0b)",
                    borderRadius: "6px",
                    background: "rgba(245, 158, 11, 0.08)",
                  }}
                >
                  <p style={{ fontWeight: 600, marginBottom: "8px" }}>
                    {language === "bn"
                      ? "আপনি কি নিশ্চিত যে মিশন বাতিল করতে চান?"
                      : "Confirm emergency mission abort?"}
                  </p>
                  <p className="panel-hint" style={{ marginBottom: "12px" }}>
                    {scenario.body === "moon"
                      ? language === "bn"
                        ? "মিশন তৎক্ষণাৎ সমাপ্ত হবে এবং ক্রু ৬ দিনের ফিরতি যাত্রায় যাবে। জীবিত ক্রু থাকলে আংশিক স্কোর প্রদান করা হবে।"
                        : "Orders immediate evacuation. Adds 144 hours transit to the mission clock and secures living crew for partial score."
                      : language === "bn"
                        ? "যদি উইন্ডো বন্ধ থাকে, তবে মহাকাশ বলবিদ্যার কারণে এটি প্রত্যাখ্যাত হবে।"
                        : "If outside the departure window, orbital dynamics will reject the escape."}
                  </p>
                  <div className="button-row">
                    <button
                      type="button"
                      className="btn"
                      style={{
                        background: "var(--caution, #f59e0b)",
                        color: "#000",
                        fontWeight: 700,
                        borderColor: "var(--caution, #f59e0b)",
                      }}
                      onClick={() => {
                        abortMission();
                        setConfirmingAbort(false);
                      }}
                    >
                      {language === "bn" ? "হ্যাঁ, মিশন বাতিল নিশ্চিত করুন" : "Confirm Abort"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-quiet"
                      onClick={() => setConfirmingAbort(false)}
                    >
                      {language === "bn" ? "বাতিল করুন (Cancel)" : "Cancel"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </CockpitTarget>

      <CockpitTarget id="mission-esm-panel" role="secondary" priority={9} label="ESM budget">
        <EsmPanel className="panel-span-full" />
      </CockpitTarget>
    </DashboardGrid>
  );
}
