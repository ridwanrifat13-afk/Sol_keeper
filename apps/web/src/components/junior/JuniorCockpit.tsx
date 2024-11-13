import { useState } from "react";
import { FiMenu, FiHelpCircle, FiX, FiAlertTriangle } from "react-icons/fi";
import {
  type CropLightSchedule,
  type MoxieMode,
  type ResearchTaskId,
  type TickContext,
  EventLogger,
  Rng,
  inMarsDepartureWindow,
} from "@sol-keeper/sim";
import { useRun } from "../../store/run.js";
import { useDial } from "../../store/dial.js";
import { useAppLanguage } from "../../i18n/useAppLanguage.js";
import { buildResourceSummary } from "../../dial/resourceSummary.js";
import { statusWord } from "../../dial/statusWords.js";
import { SCENARIO_LABELS } from "../../dial/scenarioLabels.js";
import { AirGauge } from "../AirGauge.js";
import { Gauge } from "../Gauge.js";
import { DecisionCard } from "../DecisionCard.js";
import { CadetPowerPriorityCards } from "../CadetPowerPriorityCards.js";
import { RunStatusBadge } from "../RunStatusBadge.js";
import { Term } from "../Term.js";
import { JuniorTimeControls } from "./JuniorTimeControls.js";
import "./JuniorCockpit.css";

const JUNIOR_RESEARCH_TASKS = [
  {
    id: "labRun" as ResearchTaskId,
    titleEn: "Run Lab Test",
    titleBn: "ল্যাব পরীক্ষা",
    costEn: "2 crew-hours · 1.5 kWh",
    costBn: "২ ক্রু-ঘণ্টা · ১.৫ kWh",
    crewHours: 2,
    powerKwh: 1.5,
    points: 10,
  },
  {
    id: "sampleTrip" as ResearchTaskId,
    titleEn: "Outside Moonwalk",
    titleBn: "বাইরে হেঁটে নমুনা আনা",
    costEn: "3 crew-hours · space ray risk",
    costBn: "৩ ক্রু-ঘণ্টা · রশ্মির ঝুঁকি",
    crewHours: 3,
    powerKwh: 0,
    points: 15,
  },
  {
    id: "extendedExperiment" as ResearchTaskId,
    titleEn: "Do Deep Study",
    titleBn: "গভীর গবেষণা",
    costEn: "4 crew-hours · 3.0 kWh",
    costBn: "৪ ক্রু-ঘণ্টা · ৩.০ kWh",
    crewHours: 4,
    powerKwh: 3.0,
    points: 20,
  },
] as const;

const CROP_LIGHT_OPTIONS: readonly { id: CropLightSchedule; labelEn: string; labelBn: string }[] = [
  { id: "low", labelEn: "Low light", labelBn: "কম আলো" },
  { id: "nominal", labelEn: "Normal light", labelBn: "স্বাভাবিক আলো" },
  { id: "extended", labelEn: "Extra light", labelBn: "বাড়তি আলো" },
];

const MOXIE_OPTIONS: readonly { id: MoxieMode; labelEn: string; labelBn: string }[] = [
  { id: "off", labelEn: "Off", labelBn: "বন্ধ" },
  { id: "eco", labelEn: "Eco", labelBn: "ইকো" },
  { id: "full", labelEn: "Full", labelBn: "পুরো" },
];

export interface JuniorCockpitProps {
  readonly onOpenMenu: () => void;
}

/**
 * Junior Cockpit (M13).
 * Sized strictly for <= 10 interactive elements on screen to keep cognitive load low
 * and accelerate players to their first meaningful operational decisions in <= 30 seconds.
 */
export function JuniorCockpit({ onOpenMenu }: JuniorCockpitProps) {
  useRun((s) => s.version);
  const state = useRun((s) => s.state);
  const params = useRun((s) => s.params);
  const scenario = useRun((s) => s.scenario);
  const phase = useRun((s) => s.phase);
  const setPriority = useRun((s) => s.setPriority);
  const conductResearch = useRun((s) => s.conductResearch);
  const abortMission = useRun((s) => s.abortMission);
  const setCropLightSchedule = useRun((s) => s.setCropLightSchedule);
  const setMoxieMode = useRun((s) => s.setMoxieMode);
  const cleanSolarArrays = useRun((s) => s.cleanSolarArrays);
  const oxygenHistory = useRun((s) => s.resourceHistory.oxygen);
  const inputLog = useRun((s) => s.inputLog);
  const level = useDial((s) => s.level);
  const language = useAppLanguage();

  const [helpOpen, setHelpOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const [leversOpen, setLeversOpen] = useState(false);
  const [abortOpen, setAbortOpen] = useState(false);
  const [confirmingAbort, setConfirmingAbort] = useState(false);

  const ctx: TickContext = {
    state,
    params,
    scenario,
    rng: new Rng(state.rng),
    log: new EventLogger(state.log, state.hour),
    dtHours: 1,
  };

  const summary = buildResourceSummary(state, level, language);
  const currentDay = Math.floor(state.hour / 24) + 1;
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
  const locked = phase !== "planning";
  const remainingCrewHours = Math.max(
    0,
    state.crewHours.budgetTodayHours - state.crewHours.spentTodayHours,
  );
  const isDustVisible =
    scenario.body === "mars" &&
    state.environment.dustObscurationFraction >
      state.environment.dustObscurationFloorFraction + 0.03;

  // Shield status
  const stormActive = state.radiation.solarParticleEventActive;
  const shieldStatusLevel = stormActive ? "caution" : "nominal";
  const shieldStatusLabel =
    language === "bn"
      ? stormActive
        ? "ঝড় চলছে"
        : "সুরক্ষিত"
      : stormActive
        ? "Storm Active"
        : "Protected";

  const shieldValueText =
    language === "bn"
      ? stormActive
        ? "সৌর ঝড়! শেল্টারে যান"
        : "তেজস্ক্রিয়তা নিরাপদ"
      : stormActive
        ? "Solar Storm! Shelter now"
        : "Safe from space rays";

  const missionTitle = SCENARIO_LABELS[scenario.id]?.label ?? scenario.site.name;

  return (
    <div className="junior-cockpit-root">
      {/* 1. Header: Brand, Day counter, Menu & Help toggles */}
      <header className="junior-cockpit-head">
        <div className="junior-mission-info">
          <h1 className="junior-title">{missionTitle}</h1>
          <span className="junior-day-badge">
            <Term term="day">{language === "bn" ? `দিন ${currentDay}` : `Day ${currentDay}`}</Term>
          </span>
        </div>

        <div className="junior-head-actions">
          <RunStatusBadge />
          <button
            type="button"
            className="btn btn-quiet junior-icon-btn"
            aria-label={language === "bn" ? "সাহায্য" : "Help"}
            aria-expanded={helpOpen}
            onClick={() => setHelpOpen((prev) => !prev)}
          >
            <FiHelpCircle aria-hidden="true" />
            <span className="junior-btn-label">{language === "bn" ? "সাহায্য" : "Help"}</span>
          </button>
          <button
            type="button"
            className="btn btn-quiet junior-icon-btn"
            aria-label="Menu"
            onClick={onOpenMenu}
          >
            <FiMenu aria-hidden="true" />
            <span className="junior-btn-label">Menu</span>
          </button>
        </div>
      </header>

      {/* Inline Quick Help Panel if toggled */}
      {helpOpen && (
        <aside className="junior-help-panel" role="region" aria-label="Junior Help">
          <div className="junior-help-header">
            <h3>{language === "bn" ? "কীভাবে খেলবেন?" : "How to Play"}</h3>
            <button
              type="button"
              className="btn btn-quiet junior-help-close"
              aria-label="Close help"
              onClick={() => setHelpOpen(false)}
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
          <p>
            {language === "bn"
              ? "১. ৩টি মিটার খেয়াল রাখুন: বাতাস, বিদ্যুৎ এবং ঢাল।"
              : "1. Watch your 3 gauges: Air, Power, and Radiation Shield."}
          </p>
          <p>
            {language === "bn"
              ? "২. হলুদ বা লাল সতর্কতা এলে ডিসিশন কার্ডে সঠিক সমাধান বেছে নিন।"
              : "2. When a yellow or red alert triggers, pick a response on your Decision Card."}
          </p>
          <p>
            {language === "bn"
              ? "৩. দিনের শুরুতে বিদ্যুৎ অগ্রাধিকার ঠিক করুন (ক্রু, বিজ্ঞান নাকি বাগান)।"
              : "3. Choose what to protect first when power is low."}
          </p>
        </aside>
      )}

      {/* 2. Three Primary Gauges: Air (merged O2+CO2), Power, Shield */}
      <section className="junior-gauges-section" aria-label="Life Support Gauges">
        {/* Merged Air Gauge */}
        <div className="junior-gauge-card">
          <AirGauge
            oxygenValue={state.atmosphere.o2PartialPressureMmHg}
            oxygenReadout={summary.oxygen}
            co2Value={state.atmosphere.co2PartialPressureMmHg}
            co2Readout={summary.co2}
            level={level}
            language={language}
            history={oxygenHistory}
          />
        </div>

        {/* Power Reserve Gauge */}
        <div className="junior-gauge-card">
          <Gauge
            icon="⚡"
            label={language === "bn" ? "বিদ্যুৎ" : "Power"}
            value={state.power.batteryEnergyKwh}
            unit="kWh"
            decimals={0}
            fraction={summary.battery.fraction}
            status={summary.battery.status}
            statusLabel={statusWord(
              level,
              summary.battery.status.level,
              summary.battery.status.label,
            )}
            valueText={summary.battery.text.valueText}
            detail={summary.battery.text.detail}
            helpKey="gauge.battery"
            level={level}
          />
        </div>

        {/* Shield / Radiation Gauge */}
        <div className="junior-gauge-card">
          <Gauge
            icon="🛡️"
            label={language === "bn" ? "তেজস্ক্রিয়তা ঢাল" : "Shield"}
            value={state.radiation.shieldingGPerCm2}
            unit="g/cm²"
            decimals={0}
            fraction={stormActive ? 0.4 : 1.0}
            status={{
              level: shieldStatusLevel,
              glyph: stormActive ? "▲" : "●",
              label: shieldStatusLabel,
              className: stormActive ? "is-caution" : "is-nominal",
            }}
            statusLabel={shieldStatusLabel}
            valueText={shieldValueText}
            detail={language === "bn" ? "মহাজাগতিক রশ্মি সুরক্ষা" : "Space ray protection"}
            helpKey="gauge.radiation"
            level={level}
          />
        </div>
      </section>

      {/* 3. Pending Decision Card & Power Priority Choices */}
      <section className="junior-action-section" aria-label="Decisions and Priorities">
        <DecisionCard />

        {/* Contextual Solar Panel Cleaning: Cadet depth, Mars only, when dust exceeds visible threshold */}
        {isDustVisible && (
          <div
            className="junior-clean-arrays-card"
            style={{
              padding: "12px 16px",
              background: "#161b22",
              border: "1px solid #d29922",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "1.1rem" }}>🧹</span>
                <strong style={{ color: "#f0f6fc", fontSize: "0.95rem" }}>
                  {language === "bn" ? "সোলার প্যানেলে ধুলো জমেছে" : "Dust on solar panels"}
                </strong>
                <span style={{ color: "#d29922", fontSize: "0.85rem", fontWeight: 600 }}>
                  ({Math.round(state.environment.dustObscurationFraction * 100)}%)
                </span>
              </div>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.82rem", color: "#8b949e" }}>
                {language === "bn"
                  ? "মূল্য: ২ ঘণ্টা ক্রু সময় এবং কিছুটা রেডিয়েশন"
                  : "Price: 2 hours of crew time and some radiation"}
              </p>
            </div>
            <button
              type="button"
              className="btn"
              disabled={locked || remainingCrewHours < 2}
              onClick={() => cleanSolarArrays()}
              style={{ minWidth: "180px" }}
            >
              {language === "bn" ? "সোলার প্যানেল পরিষ্কার করুন" : "Clean the solar panels"}
              <span className="btn-sub">
                {language === "bn"
                  ? remainingCrewHours < 2
                    ? "আজ পর্যাপ্ত সময় নেই"
                    : "২ ঘণ্টা ক্রু সময়"
                  : remainingCrewHours < 2
                    ? "not enough time today"
                    : "2 hours of crew time"}
              </span>
            </button>
          </div>
        )}

        {/* Research Opportunity Drawer */}
        <div className="junior-priority-drawer">
          <button
            type="button"
            className="btn btn-quiet junior-priority-toggle"
            aria-expanded={researchOpen}
            onClick={() => setResearchOpen((prev) => !prev)}
          >
            {researchOpen
              ? language === "bn"
                ? "▲ বিজ্ঞান গবেষণা লুকান"
                : "▲ Hide Science Research"
              : language === "bn"
                ? `▼ বিজ্ঞান কাজ বেছে নিন (${state.science.points.toFixed(0)} / ${scenario.scienceTargetPoints} পয়েন্ট)`
                : `▼ Science Tasks (Score Points: ${state.science.points.toFixed(0)} / ${scenario.scienceTargetPoints} pts)`}
          </button>

          {researchOpen && (
            <div className="junior-priority-content">
              <p className="panel-hint">
                {language === "bn"
                  ? "বিজ্ঞান কাজের মাধ্যমে পয়েন্ট অর্জন করুন। এতে ক্রু সময় বা বিদ্যুৎ খরচ হয়।"
                  : "Choose a science task to earn points. Each costs crew time or power."}
                {locked &&
                  (language === "bn"
                    ? " দিন চলাকালীন লক করা থাকে — দিন পরিকল্পনার সময় পরিবর্তন করুন।"
                    : " Locked while the day is running — choose during Day Planning.")}
              </p>
              <div className="button-row" role="group" aria-label="Junior science tasks">
                {JUNIOR_RESEARCH_TASKS.map((task) => {
                  const hoursRemaining = Math.max(
                    0,
                    state.crewHours.budgetTodayHours - state.crewHours.spentTodayHours,
                  );
                  const isSelected = selectedTaskId === task.id;
                  const canAfford =
                    hoursRemaining >= task.crewHours &&
                    state.power.batteryEnergyKwh >= task.powerKwh &&
                    !locked;
                  return (
                    <button
                      key={task.id}
                      type="button"
                      className={`btn ${isSelected ? "btn-active" : ""}`}
                      aria-pressed={isSelected}
                      disabled={!canAfford}
                      onClick={() => conductResearch(task.id)}
                    >
                      {language === "bn" ? task.titleBn : task.titleEn} (+{task.points} pts)
                      <span className="btn-sub">
                        {language === "bn" ? task.costBn : task.costEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Garden & MOXIE Settings Drawer */}
        <div className="junior-priority-drawer">
          <button
            type="button"
            className="btn btn-quiet junior-priority-toggle"
            aria-expanded={leversOpen}
            onClick={() => setLeversOpen((prev) => !prev)}
          >
            {leversOpen
              ? language === "bn"
                ? "▲ বাগান ও অক্সিজেন সেটিংস লুকান"
                : "▲ Hide Garden & Oxygen Settings"
              : language === "bn"
                ? "▼ বাগান ও অক্সিজেন সেটিংস পরিবর্তন করুন"
                : "▼ Garden & Oxygen Settings (Light Schedule / MOXIE)"}
          </button>

          {leversOpen && (
            <div className="junior-priority-content">
              <div style={{ marginBottom: "12px" }}>
                <p className="panel-hint" style={{ fontWeight: 600 }}>
                  {language === "bn" ? "বাগানের বাতি:" : "Garden Grow Lights:"}
                </p>
                <div className="button-row" role="group" aria-label="Garden light schedule">
                  {CROP_LIGHT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`btn ${state.food.lightSchedule === opt.id ? "btn-active" : ""}`}
                      aria-pressed={state.food.lightSchedule === opt.id}
                      disabled={locked}
                      onClick={() => setCropLightSchedule(opt.id)}
                    >
                      {language === "bn" ? opt.labelBn : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {state.systems.moxie !== undefined && (
                <div>
                  <p className="panel-hint" style={{ fontWeight: 600 }}>
                    {language === "bn" ? "MOXIE অক্সিজেন মেকার:" : "MOXIE Oxygen Maker:"}
                  </p>
                  <div className="button-row" role="group" aria-label="MOXIE operating mode">
                    {MOXIE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`btn ${state.isru.moxieMode === opt.id ? "btn-active" : ""}`}
                        aria-pressed={state.isru.moxieMode === opt.id}
                        disabled={locked}
                        onClick={() => setMoxieMode(opt.id)}
                      >
                        {language === "bn" ? opt.labelBn : opt.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="junior-priority-drawer">
          <button
            type="button"
            className="btn btn-quiet junior-priority-toggle"
            aria-expanded={priorityOpen}
            onClick={() => setPriorityOpen((prev) => !prev)}
          >
            {priorityOpen
              ? language === "bn"
                ? "▲ বিদ্যুৎ অগ্রাধিকার কার্ড লুকান"
                : "▲ Hide Power Priority Cards"
              : language === "bn"
                ? "▼ বিদ্যুৎ অগ্রাধিকার পরিবর্তন করুন (ক্রু / বিজ্ঞান / বাগান)"
                : "▼ Power Priority Cards (Protect Crew / Science / Garden)"}
          </button>

          {priorityOpen && (
            <div className="junior-priority-content">
              <CadetPowerPriorityCards
                systems={state.systems}
                locked={locked}
                onSetPriority={setPriority}
              />
            </div>
          )}
        </div>

        {/* Emergency Return (Abort) Drawer */}
        <div className="junior-priority-drawer">
          <button
            type="button"
            className="btn btn-quiet junior-priority-toggle"
            aria-expanded={abortOpen}
            onClick={() => setAbortOpen((prev) => !prev)}
          >
            {abortOpen
              ? language === "bn"
                ? "▲ জরুরি ড্রয়ার লুকান"
                : "▲ Hide Emergency Return"
              : language === "bn"
                ? "▼ জরুরি প্রত্যাবর্তন (ক্রু রক্ষা করুন)"
                : "▼ Emergency Return (Bring Crew Home Early)"}
          </button>

          {abortOpen && (
            <div className="junior-priority-content">
              <p className="panel-hint">
                {scenario.body === "moon"
                  ? language === "bn"
                    ? "বিপদ বেশি হলে ক্রুকে বাড়ি ফিরিয়ে আনা যায়। ফিরতি যাত্রায় ৬ দিন সময় লাগে।"
                    : "If danger is too high, call an emergency return to bring the crew home safely. Return transit takes 6 days [NASA-ORION-FS]."
                  : inMarsDepartureWindow(ctx)
                    ? language === "bn"
                      ? "প্রস্থান উইন্ডো খোলা আছে — ক্রুকে বাড়ি ফিরিয়ে আনা যাবে।"
                      : "Departure window is open — you can bring the crew home now."
                    : language === "bn"
                      ? "এখনই ফেরা যাবে না — মঙ্গল গ্রহের প্রস্থান উইন্ডো বন্ধ।"
                      : "Cannot leave yet — Mars departure window is closed."}
              </p>

              {state.status === "running" && (
                <div style={{ marginTop: "8px" }}>
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
                      {language === "bn" ? "ক্রুকে ফেরত আনুন (Abort)" : "Call Emergency Return"}
                    </button>
                  ) : (
                    <div
                      style={{
                        padding: "10px",
                        border: "1px solid var(--caution, #f59e0b)",
                        borderRadius: "6px",
                        background: "rgba(245, 158, 11, 0.08)",
                      }}
                    >
                      <p style={{ fontWeight: 600, marginBottom: "6px" }}>
                        {language === "bn"
                          ? "আপনি কি ক্রুকে এখনই ফেরত আনতে চান?"
                          : "Bring crew home early?"}
                      </p>
                      <p className="panel-hint" style={{ marginBottom: "10px" }}>
                        {language === "bn"
                          ? "মিশনটি শেষ হয়ে যাবে, তবে ক্রু জীবিত থাকলে আপনি পয়েন্ট পাবেন।"
                          : "This ends the mission, but keeps everyone safe for a score."}
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
                          {language === "bn" ? "হ্যাঁ, ফেরত আনুন" : "Yes, Bring Crew Home"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-quiet"
                          onClick={() => setConfirmingAbort(false)}
                        >
                          {language === "bn" ? "থাক (Cancel)" : "Cancel"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 4. Day Running & Simulation Speed Controls */}
      <footer className="junior-cockpit-footer">
        <JuniorTimeControls />
      </footer>
    </div>
  );
}
