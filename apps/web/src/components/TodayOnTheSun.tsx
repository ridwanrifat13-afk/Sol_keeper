import { FiAlertCircle, FiSun } from "react-icons/fi";
import { useSpaceWeather } from "../data/spaceWeather.js";
import { ProvenanceBadge } from "./ProvenanceBadge.js";

interface TodayOnTheSunProps {
  readonly onOpenStormWatch?: () => void;
}

export function TodayOnTheSun({ onOpenStormWatch }: TodayOnTheSunProps) {
  const spaceWeather = useSpaceWeather();

  const isCalm = spaceWeather.status === "live" && spaceWeather.events.length === 0;

  return (
    <section className="panel today-on-the-sun" aria-labelledby="today-on-sun-heading">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <h2 id="today-on-sun-heading" style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
          <FiSun aria-hidden="true" style={{ color: "#f59e0b" }} /> Today on the Sun
        </h2>
        <ProvenanceBadge status={spaceWeather.status} fetchedAt={spaceWeather.fetchedAt} />
      </header>

      {isCalm ? (
        <div
          className="calm-sun-notice"
          style={{
            padding: "0.75rem",
            backgroundColor: "rgba(34, 197, 94, 0.08)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "6px",
          }}
        >
          <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>
            <strong>The Sun is calm today.</strong> Space weather instruments report no active coronal mass ejections or major solar proton events affecting the inner solar system right now.
          </p>
          {onOpenStormWatch && (
            <button
              type="button"
              className="btn btn-quiet"
              onClick={onOpenStormWatch}
              style={{ fontSize: "0.85rem", textDecoration: "underline" }}
            >
              See historical archive in Storm Watch →
            </button>
          )}
        </div>
      ) : spaceWeather.events.length > 0 ? (
        <div className="space-weather-events">
          <p className="panel-hint" style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            {spaceWeather.status === "live"
              ? "Live space weather telemetry from NASA DONKI."
              : "Saved NASA DONKI space weather snapshot."}
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {spaceWeather.events.slice(0, 3).map((event, i) => (
              <li
                key={`${event.type}-${event.startTime}-${i}`}
                style={{
                  padding: "0.5rem",
                  borderBottom: "1px solid var(--border-dim, rgba(255,255,255,0.08))",
                  fontSize: "0.85rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <strong>
                    {event.type.toUpperCase()}
                    {event.classType ? ` (${event.classType})` : ""}
                  </strong>
                  <span style={{ fontSize: "0.75rem", opacity: 0.75 }}>
                    {new Date(event.startTime).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="panel-hint" style={{ fontSize: "0.85rem" }}>
          <FiAlertCircle aria-hidden="true" /> Fetching space weather conditions from NASA DONKI...
        </p>
      )}
    </section>
  );
}
