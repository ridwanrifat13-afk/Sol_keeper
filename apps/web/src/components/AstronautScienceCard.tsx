import { FiExternalLink, FiShield } from "react-icons/fi";
import { formatCardVerification, type AstronautScienceCardData } from "../data/astronautScience.js";

interface AstronautScienceCardProps {
  readonly card: AstronautScienceCardData;
  readonly compact?: boolean;
}

export function AstronautScienceCard({ card, compact = false }: AstronautScienceCardProps) {
  // Defensive guard: never render unverified cards under any circumstances
  if (!card.verified || !card.verifiedBy || !card.verifiedAt) {
    return null;
  }

  const attribution = formatCardVerification(card);
  const accession = card.osdId ?? (card.osdIds ? card.osdIds.join(", ") : card.instrument);

  return (
    <article
      className="panel astronaut-science-card"
      style={{
        border: "1px solid var(--border-accent, #2563eb)",
        backgroundColor: "var(--bg-panel-alt, rgba(37, 99, 235, 0.05))",
        borderRadius: "6px",
        padding: compact ? "0.75rem" : "1rem",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
      }}
      aria-label={`Astronaut Science Card: ${card.title}`}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span
            style={{
              padding: "0.15rem 0.4rem",
              borderRadius: "4px",
              fontSize: "0.75rem",
              fontWeight: 600,
              backgroundColor: "rgba(37, 99, 235, 0.2)",
              color: "var(--color-primary, #60a5fa)",
              border: "1px solid rgba(37, 99, 235, 0.4)",
              letterSpacing: "0.02em",
            }}
          >
            Archived NASA data (OSDR)
          </span>
          {accession && (
            <code style={{ fontSize: "0.75rem", opacity: 0.85 }}>{accession}</code>
          )}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--color-success, #34d399)",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          <FiShield aria-hidden="true" />
          <span>{attribution}</span>
        </div>
      </header>

      <h3 style={{ fontSize: compact ? "0.95rem" : "1.05rem", margin: "0 0 0.5rem 0" }}>
        {card.title}
      </h3>

      <blockquote
        style={{
          margin: "0 0 0.5rem 0",
          paddingLeft: "0.75rem",
          borderLeft: "3px solid var(--color-primary, #3b82f6)",
          fontSize: compact ? "0.875rem" : "0.95rem",
          fontStyle: "italic",
        }}
      >
        "{card.plainFinding}"
      </blockquote>

      <p style={{ fontSize: "0.8rem", opacity: 0.85, margin: "0 0 0.5rem 0" }}>
        <strong>Caveat:</strong> {card.caveat}
      </p>

      <footer style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between", opacity: 0.75 }}>
        <span>Archived: {card.archivedOn}</span>
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
          aria-label={`Open research paper for ${card.title}`}
        >
          Study Paper <FiExternalLink aria-hidden="true" />
        </a>
      </footer>
    </article>
  );
}

