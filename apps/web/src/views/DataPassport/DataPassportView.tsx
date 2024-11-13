import { useMemo, useState } from "react";
import { FiCheckCircle, FiExternalLink, FiSearch, FiX } from "react-icons/fi";
import { DATA_PASSPORT, type EvidenceLevel, type PassportEntry, type PassportLabel } from "../../data/dataPassport.js";

interface DataPassportViewProps {
  readonly onClose: () => void;
}

export function DataPassportView({ onClose }: DataPassportViewProps) {
  const [selectedLabel, setSelectedLabel] = useState<PassportLabel | "all">("all");
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceLevel | "all">("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return DATA_PASSPORT.filter((entry: PassportEntry) => {
      if (selectedLabel !== "all" && entry.label !== selectedLabel) return false;
      if (selectedEvidence !== "all" && entry.evidenceLevel !== selectedEvidence) return false;
      if (verifiedOnly && !entry.verified) return false;
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesName = entry.name.toLowerCase().includes(q);
        const matchesSource = entry.source.toLowerCase().includes(q);
        const matchesDrives = entry.whatItDrives.toLowerCase().includes(q);
        const matchesLocation = entry.whereYouSeeIt.toLowerCase().includes(q);
        if (!matchesName && !matchesSource && !matchesDrives && !matchesLocation) return false;
      }
      return true;
    });
  }, [selectedLabel, selectedEvidence, verifiedOnly, searchQuery]);

  const verifiedCount = DATA_PASSPORT.filter((e) => e.verified).length;
  const totalCount = DATA_PASSPORT.length;

  return (
    <div className="data-sources data-passport" role="region" aria-label="Data Passport">
      <header className="view-head">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
          <div>
            <h2>Data Passport</h2>
            <p className="view-hint">
              Every scientific number, baseline constant, and active data pipeline in Sol Keeper.
              Cataloged with source pedigree, gameplay impact, human evidence level, and verification status.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-quiet overlay-close"
            onClick={onClose}
            aria-label="Close Data Passport"
            style={{ fontSize: "1.25rem", padding: "0.25rem 0.5rem" }}
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
      </header>

      <section className="panel" style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.875rem" }}>
            <span><strong>Total Datasets:</strong> {totalCount}</span>
            <span><strong>Verified:</strong> {verifiedCount} / {totalCount}</span>
            <span><strong>Evidence Standard:</strong> Peer-reviewed & NASA Technical Briefs</span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
              <FiSearch style={{ position: "absolute", left: "8px", pointerEvents: "none", opacity: 0.6 }} />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "0.35rem 0.5rem 0.35rem 1.75rem",
                  fontSize: "0.875rem",
                  borderRadius: "4px",
                  border: "1px solid var(--border-color, #444)",
                  background: "var(--bg-input, rgba(0,0,0,0.3))",
                  color: "inherit",
                }}
                aria-label="Search datasets"
              />
            </div>

            <select
              value={selectedLabel}
              onChange={(e) => setSelectedLabel(e.target.value as PassportLabel | "all")}
              aria-label="Filter by dataset label"
              style={{
                padding: "0.35rem",
                fontSize: "0.875rem",
                borderRadius: "4px",
                border: "1px solid var(--border-color, #444)",
                background: "var(--bg-input, rgba(0,0,0,0.3))",
                color: "inherit",
              }}
            >
              <option value="all">All Labels</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
              <option value="Derived">Derived</option>
              <option value="Snapshot">Snapshot</option>
              <option value="Live">Live</option>
              <option value="Tuned">Tuned</option>
            </select>

            <select
              value={selectedEvidence}
              onChange={(e) => setSelectedEvidence(e.target.value as EvidenceLevel | "all")}
              aria-label="Filter by evidence level"
              style={{
                padding: "0.35rem",
                fontSize: "0.875rem",
                borderRadius: "4px",
                border: "1px solid var(--border-color, #444)",
                background: "var(--bg-input, rgba(0,0,0,0.3))",
                color: "inherit",
              }}
            >
              <option value="all">All Evidence Levels</option>
              <option value="read by a person">read by a person</option>
              <option value="wording adopted, quote not confirmed">wording adopted</option>
            </select>

            <label style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.875rem", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
              />
              Verified only
            </label>
          </div>
        </div>
      </section>

      <section className="panel">
        <div style={{ overflowX: "auto" }}>
          <table className="sources-table" style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-color, #444)" }}>
                <th style={{ padding: "0.5rem" }}>Dataset & Source ID</th>
                <th style={{ padding: "0.5rem" }}>What It Drives in Game</th>
                <th style={{ padding: "0.5rem" }}>Where You See It</th>
                <th style={{ padding: "0.5rem" }}>Label</th>
                <th style={{ padding: "0.5rem" }}>Evidence Level</th>
                <th style={{ padding: "0.5rem" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} style={{ borderBottom: "1px solid var(--border-dim, rgba(255,255,255,0.08))" }}>
                  <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                    <strong>{entry.name}</strong>
                    <div style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "0.2rem" }}>
                      <code>{entry.source}</code>
                      {entry.url && (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ marginLeft: "0.4rem", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}
                          aria-label={`Open reference for ${entry.name}`}
                        >
                          <FiExternalLink aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "top", fontSize: "0.875rem" }}>
                    {entry.whatItDrives}
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "top", fontSize: "0.85rem" }}>
                    {entry.whereYouSeeIt}
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "top" }}>
                    <span
                      style={{
                        padding: "0.15rem 0.4rem",
                        borderRadius: "3px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        background:
                          entry.label === "Live"
                            ? "rgba(34, 197, 94, 0.2)"
                            : entry.label === "Published"
                            ? "rgba(59, 130, 246, 0.2)"
                            : entry.label === "Archived"
                            ? "rgba(234, 179, 8, 0.2)"
                            : "rgba(156, 163, 175, 0.2)",
                        border: "1px solid currentColor",
                      }}
                    >
                      {entry.label}
                    </span>
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "top", fontSize: "0.8rem" }}>
                    <span style={{ fontStyle: entry.evidenceLevel === "read by a person" ? "normal" : "italic" }}>
                      {entry.evidenceLevel}
                    </span>
                  </td>
                  <td style={{ padding: "0.5rem", verticalAlign: "top", whiteSpace: "nowrap" }}>
                    {entry.verified ? (
                      <span style={{ color: "var(--color-success, #22c55e)", display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.85rem" }}>
                        <FiCheckCircle aria-hidden="true" /> Verified
                      </span>
                    ) : (
                      <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>Unverified</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2rem", opacity: 0.7 }}>
                    No datasets match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
