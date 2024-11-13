import { useEffect, useState } from "react";
import { FiActivity, FiDownload, FiRefreshCw } from "react-icons/fi";
import {
  exportPlaytestJson,
  isPlaytestActive,
  loadPlaytestTelemetry,
  savePlaytestTelemetry,
  type PlaytestTelemetry,
} from "../store/playtest.js";

export function PlaytestBanner() {
  const [active, setActive] = useState(false);
  const [telemetry, setTelemetry] = useState<PlaytestTelemetry | null>(null);

  useEffect(() => {
    const isAct = isPlaytestActive();
    setActive(isAct);
    if (isAct) {
      setTelemetry(loadPlaytestTelemetry());
      const interval = setInterval(() => {
        setTelemetry(loadPlaytestTelemetry());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  if (!active || !telemetry) {
    return null;
  }

  const handleDownload = () => {
    const jsonStr = exportPlaytestJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sol-keeper-playtest-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    const resetData: PlaytestTelemetry = {
      sessionStartedAt: Date.now(),
      retriesCount: 0,
      bigIdeaAnswers: {},
    };
    savePlaytestTelemetry(resetData);
    setTelemetry(resetData);
  };

  const firstDecisionSeconds =
    telemetry.timeToFirstDecisionMs !== undefined
      ? `${(telemetry.timeToFirstDecisionMs / 1000).toFixed(1)}s`
      : "Pending";

  return (
    <aside
      className="playtest-banner"
      role="region"
      aria-label="Playtest telemetry"
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 9999,
        background: "rgba(17, 24, 39, 0.95)",
        border: "1px solid #10b981",
        borderRadius: "8px",
        padding: "0.5rem 0.75rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        fontSize: "0.8rem",
        color: "#f3f4f6",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <FiActivity aria-hidden="true" style={{ color: "#10b981" }} />
        <strong>Playtest Active</strong>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", opacity: 0.85 }}>
        <span>1st Decision: <strong>{firstDecisionSeconds}</strong></span>
        <span>Retries: <strong>{telemetry.retriesCount}</strong></span>
      </div>

      <div style={{ display: "flex", gap: "0.35rem" }}>
        <button
          type="button"
          className="btn btn-quiet"
          onClick={handleDownload}
          title="Download playtest telemetry as JSON"
          style={{ padding: "0.2rem 0.4rem", fontSize: "0.75rem" }}
        >
          <FiDownload aria-hidden="true" /> Export
        </button>
        <button
          type="button"
          className="btn btn-quiet"
          onClick={handleReset}
          title="Reset playtest telemetry"
          style={{ padding: "0.2rem 0.4rem", fontSize: "0.75rem" }}
        >
          <FiRefreshCw aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}

