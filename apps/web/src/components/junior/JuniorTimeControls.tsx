import { useEffect } from "react";
import {
  FiPlay,
  FiPause,
  FiFastForward,
  FiClock,
  FiChevronRight,
  FiChevronsRight,
} from "react-icons/fi";
import { SPEEDS, useRun } from "../../store/run.js";
import { useAppLanguage } from "../../i18n/useAppLanguage.js";
import "./JuniorTimeControls.css";

export function JuniorTimeControls() {
  const speed = useRun((s) => s.speed);
  const status = useRun((s) => s.state.status);
  const phase = useRun((s) => s.phase);
  const hour = useRun((s) => s.state.hour);
  const step = useRun((s) => s.step);
  const setSpeed = useRun((s) => s.setSpeed);
  const setPhase = useRun((s) => s.setPhase);
  const language = useAppLanguage();

  // Active simulation clock tick loop
  useEffect(() => {
    const ms = SPEEDS[speed];
    if (ms === 0 || status !== "running" || phase !== "running") return;
    const id = setInterval(() => {
      step(1);
    }, ms);
    return () => {
      clearInterval(id);
    };
  }, [speed, status, phase, step]);

  const running = status === "running";
  const planning = phase === "planning";
  const hoursLeft = 24 - (Math.floor(hour) % 24);

  return (
    <div className="junior-time-controls" role="region" aria-label="Junior Time Controls">
      {/* 1. If currently in Planning phase, show primary Run Day banner button */}
      {running && planning ? (
        <div className="junior-run-prompt">
          <button
            type="button"
            className="junior-run-today-btn"
            onClick={() => setPhase("running")}
          >
            <FiPlay aria-hidden="true" />
            <span>
              {language === "bn" ? "আজকের দিন শুরু করুন (Run Day)" : "Run Today's Mission ▶"}
            </span>
          </button>
        </div>
      ) : (
        <div className="junior-speed-bar">
          {/* Day countdown pill */}
          <div className="junior-time-pill" title="Time remaining until nightfall/next day">
            <FiClock aria-hidden="true" />
            <span>
              {language === "bn" ? `দিন শেষ হতে: ${hoursLeft} ঘণ্টা` : `Day ends in: ${hoursLeft}h`}
            </span>
          </div>

          {/* Kid-sized Colorful Speed Toggles */}
          <div className="junior-speed-buttons" role="group" aria-label="Playback Speed">
            <button
              type="button"
              className={`junior-speed-btn speed-pause ${speed === "paused" ? "is-active" : ""}`}
              onClick={() => setSpeed("paused")}
              disabled={!running || planning}
              title={language === "bn" ? "বিরতি" : "Pause"}
            >
              <FiPause aria-hidden="true" />
              <span>{language === "bn" ? "থামুন" : "Pause"}</span>
            </button>

            <button
              type="button"
              className={`junior-speed-btn speed-1x ${speed === "slow" ? "is-active" : ""}`}
              onClick={() => setSpeed("slow")}
              disabled={!running || planning}
              title={language === "bn" ? "স্বাভাবিক গতি" : "Normal 1x Speed"}
            >
              <FiPlay aria-hidden="true" />
              <span>1× {language === "bn" ? "স্বাভাবিক" : "Normal"}</span>
            </button>

            <button
              type="button"
              className={`junior-speed-btn speed-4x ${speed === "normal" ? "is-active" : ""}`}
              onClick={() => setSpeed("normal")}
              disabled={!running || planning}
              title={language === "bn" ? "দ্রুত গতি" : "Fast 4x Speed"}
            >
              <FiFastForward aria-hidden="true" />
              <span>4× {language === "bn" ? "দ্রুত" : "Fast"}</span>
            </button>

            <button
              type="button"
              className={`junior-speed-btn speed-16x ${speed === "fast" ? "is-active" : ""}`}
              onClick={() => setSpeed("fast")}
              disabled={!running || planning}
              title={language === "bn" ? "অতি দ্রুত গতি" : "Super Fast 16x Speed"}
            >
              <FiChevronsRight aria-hidden="true" />
              <span>16× {language === "bn" ? "ওয়ার্প" : "Warp"}</span>
            </button>
          </div>

          {/* Quick jump buttons */}
          <div className="junior-step-buttons">
            <button
              type="button"
              className="junior-step-btn"
              disabled={!running || planning}
              onClick={() => step(1)}
              title={language === "bn" ? "১ ঘণ্টা এগিয়ে যান" : "Jump forward 1 hour"}
            >
              <FiChevronRight aria-hidden="true" /> +1h
            </button>
            <button
              type="button"
              className="junior-step-btn"
              disabled={!running || planning}
              onClick={() => step(24)}
              title={language === "bn" ? "১ দিন এগিয়ে যান" : "Jump forward 1 day"}
            >
              <FiChevronsRight aria-hidden="true" /> +1d
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
