import { motion } from "framer-motion";
import { FiCalendar, FiSun, FiArrowRight, FiClock } from "react-icons/fi";
import { SCENARIOS, type StandardScenarioId } from "@sol-keeper/sim";
import { useRun } from "../store/run.js";
import { SCENARIO_LABELS } from "../dial/scenarioLabels.js";
import { durationLabel } from "../dial/missionTime.js";
import { ProvenanceBadge } from "./ProvenanceBadge.js";
import { useSpaceWeather } from "../data/spaceWeather.js";

interface MissionOfTheDayCardProps {
  readonly onLaunch: () => void;
}

const LADDER_MISSIONS: readonly StandardScenarioId[] = [
  "first-light",
  "storm-watch",
  "green-thumb",
  "jezero-outpost",
];

export function getMissionOfTheDayInfo() {
  const now = new Date();
  const utcYear = now.getUTCFullYear();
  const utcMonth = String(now.getUTCMonth() + 1).padStart(2, "0");
  const utcDay = String(now.getUTCDate()).padStart(2, "0");
  const utcDateStr = `${utcYear}-${utcMonth}-${utcDay}`;
  const utcSeed = parseInt(`${utcYear}${utcMonth}${utcDay}`, 10);

  const dayNumber = Math.floor(
    Date.UTC(utcYear, now.getUTCMonth(), now.getUTCDate()) / (1000 * 60 * 60 * 24),
  );
  const scenarioId = LADDER_MISSIONS[Math.abs(dayNumber) % LADDER_MISSIONS.length]!;

  return {
    utcDateStr,
    utcSeed,
    scenarioId,
  };
}

export function MissionOfTheDayCard({ onLaunch }: MissionOfTheDayCardProps) {
  const spaceWeather = useSpaceWeather();
  const { utcDateStr, utcSeed, scenarioId } = getMissionOfTheDayInfo();

  const scenario = SCENARIOS[scenarioId];
  const meta = SCENARIO_LABELS[scenarioId];

  const handleLaunch = () => {
    useRun.getState().setMissionOfTheDay(true);
    useRun.getState().reset({
      scenarioId,
      seed: utcSeed,
      difficulty: "nominal",
    });
    onLaunch();
  };

  return (
    <motion.section
      className="modern-hero-motd-card"
      aria-labelledby="motd-heading"
      initial={{ y: 32, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.55 }}
      viewport={{ once: true }}
    >
      <header className="modern-hero-motd-header">
        <div className="modern-hero-motd-badge-group">
          <div className="modern-hero-motd-icon-title">
            <FiCalendar aria-hidden="true" className="modern-hero-motd-icon" />
            <h2 id="motd-heading" className="modern-hero-motd-title">
              Mission of the Day
            </h2>
          </div>
          <span className="modern-hero-motd-seed-pill">
            Daily Seed: {utcSeed}
          </span>
        </div>
        <div className="modern-hero-motd-meta-right">
          <ProvenanceBadge status={spaceWeather.status} fetchedAt={spaceWeather.fetchedAt} />
          <span>UTC: {utcDateStr}</span>
        </div>
      </header>

      <div className="modern-hero-motd-grid">
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.4rem" }}>
            <span className="modern-hero-motd-chip">
              Today&apos;s Challenge
            </span>
            <span className="modern-hero-motd-site">
              {scenario.site.name} · {scenario.body === "mars" ? "Mars" : "Moon"}
            </span>
          </div>
          <h3 className="modern-hero-motd-scenario-title">{meta?.label ?? scenarioId}</h3>
          <p className="modern-hero-motd-desc">
            {meta?.hint ?? ""}
          </p>
          <div className="modern-hero-motd-stats">
            <FiClock aria-hidden="true" />
            <span>Duration: {durationLabel(scenario.durationHours, scenario.body)} · Nominal difficulty</span>
          </div>
        </div>

        <div className="modern-hero-motd-sun-box">
          <div className="modern-hero-motd-sun-head">
            <FiSun aria-hidden="true" style={{ color: "#f59e0b", fontSize: "1.1rem" }} />
            <strong>Today on the Sun:</strong>
          </div>
          <p className="modern-hero-motd-sun-text">
            {spaceWeather.status === "live" && spaceWeather.events.length === 0
              ? "The Sun is calm today. Space weather instruments report no active coronal mass ejections."
              : spaceWeather.events.length > 0
                ? `${spaceWeather.events.length} solar event(s) recorded on NASA DONKI.`
                : "Checking NASA DONKI solar observations..."}
          </p>
          <button
            type="button"
            className="modern-hero-motd-launch-btn"
            onClick={handleLaunch}
          >
            Launch Mission of the Day <FiArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.section>
  );
}

