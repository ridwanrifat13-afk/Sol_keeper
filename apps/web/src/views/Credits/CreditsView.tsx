import { useState } from "react";
import { FiCheckCircle, FiExternalLink, FiSearch, FiShield, FiX, FiCpu, FiImage, FiCode } from "react-icons/fi";

interface DependencyLicense {
  readonly name: string;
  readonly version: string;
  readonly license: string;
  readonly role: string;
  readonly url: string;
}

const RUNTIME_DEPENDENCIES: readonly DependencyLicense[] = [
  { name: "tslib", version: "2.8.1", license: "0BSD", role: "TypeScript runtime helpers", url: "https://www.typescriptlang.org/" },
  { name: "typescript", version: "5.9.3", license: "Apache-2.0", role: "Static typing & compilation", url: "https://www.typescriptlang.org/" },
  { name: "leaflet", version: "1.9.4", license: "BSD-2-Clause", role: "Equirectangular planetary map engine", url: "https://leafletjs.com/" },
  { name: "d3-force", version: "3.0.0", license: "ISC", role: "Force-directed graph layout engine", url: "https://d3js.org/d3-force/" },
  { name: "d3-dispatch", version: "3.0.1", license: "ISC", role: "Event dispatching for D3 layouts", url: "https://d3js.org/d3-dispatch/" },
  { name: "d3-quadtree", version: "3.0.1", license: "ISC", role: "Spatial subdivision for graph physics", url: "https://d3js.org/d3-quadtree/" },
  { name: "d3-timer", version: "3.0.1", license: "ISC", role: "Animation timing queue for layout loops", url: "https://d3js.org/d3-timer/" },
  { name: "lucide-react", version: "1.48.0", license: "ISC", role: "Lucide icon library", url: "https://lucide.dev" },
  { name: "react", version: "18.3.1", license: "MIT", role: "Declarative UI component runtime", url: "https://react.dev" },
  { name: "react-dom", version: "18.3.1", license: "MIT", role: "React DOM rendering engine", url: "https://react.dev" },
  { name: "zustand", version: "5.0.15", license: "MIT", role: "Deterministic client state store", url: "https://github.com/pmndrs/zustand" },
  { name: "framer-motion", version: "13.4.4", license: "MIT", role: "Motion physics & UI animations", url: "https://github.com/motiondivision/motion" },
  { name: "motion-dom", version: "13.4.4", license: "MIT", role: "Motion DOM calculation bindings", url: "https://github.com/motiondivision/motion" },
  { name: "motion-utils", version: "13.4.4", license: "MIT", role: "Animation utility routines", url: "https://github.com/motiondivision/motion" },
  { name: "lenis", version: "1.3.26", license: "MIT", role: "Smooth scroll physics controller", url: "https://github.com/darkroomengineering/lenis" },
  { name: "i18next", version: "26.4.2", license: "MIT", role: "Internationalization framework", url: "https://www.i18next.com" },
  { name: "react-i18next", version: "17.0.14", license: "MIT", role: "React hooks for internationalization", url: "https://react.i18next.com/" },
  { name: "react-icons", version: "5.7.0", license: "MIT", role: "Feather Icons collection (react-icons/fi)", url: "https://react-icons.github.io/react-icons/" },
  { name: "html-parse-stringify", version: "4.0.1", license: "MIT", role: "AST parsing for i18n text interpolation", url: "https://github.com/i18next/html-parse-stringify" },
  { name: "csstype", version: "3.2.3", license: "MIT", role: "Strict TypeScript CSS properties", url: "https://github.com/frenic/csstype" },
  { name: "js-tokens", version: "4.0.0", license: "MIT", role: "JavaScript tokenization regex", url: "https://github.com/lydell/js-tokens" },
  { name: "loose-envify", version: "1.4.0", license: "MIT", role: "Environment variable macro replacement", url: "https://github.com/zertosh/loose-envify" },
  { name: "scheduler", version: "0.23.2", license: "MIT", role: "Cooperative task scheduler", url: "https://react.dev" },
  { name: "use-sync-external-store", version: "1.7.0", license: "MIT", role: "External store subscription shim", url: "https://react.dev" },
  { name: "@babel/runtime", version: "7.29.7", license: "MIT", role: "Modular runtime helpers", url: "https://babel.dev" },
  { name: "@types/prop-types", version: "15.7.15", license: "MIT", role: "TypeScript definitions for prop-types", url: "https://github.com/DefinitelyTyped/DefinitelyTyped" },
  { name: "@types/react", version: "18.3.31", license: "MIT", role: "TypeScript definitions for React", url: "https://github.com/DefinitelyTyped/DefinitelyTyped" },
];

interface CreditsViewProps {
  readonly onClose: () => void;
}

type TabKey = "licenses" | "provenance" | "ai-privacy" | "sources";

export function CreditsView({ onClose }: CreditsViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("licenses");
  const [search, setSearch] = useState("");
  const [selectedLicense, setSelectedLicense] = useState<string>("all");

  const filteredDependencies = RUNTIME_DEPENDENCIES.filter((dep) => {
    if (selectedLicense !== "all" && dep.license !== selectedLicense) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return dep.name.toLowerCase().includes(q) || dep.role.toLowerCase().includes(q) || dep.license.toLowerCase().includes(q);
    }
    return true;
  });

  const distinctLicenses = Array.from(new Set(RUNTIME_DEPENDENCIES.map((d) => d.license))).sort();

  return (
    <div className="data-sources" role="region" aria-label="Credits & Licenses">
      <header className="view-head">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
          <div>
            <h2>Credits & Licenses</h2>
            <p className="view-hint">
              Open source software licenses, scientific agency citations, media provenance, and AI disclosures.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-quiet overlay-close"
            onClick={onClose}
            aria-label="Close Credits & Licenses"
            style={{ fontSize: "1.25rem", padding: "0.25rem 0.5rem" }}
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
      </header>

      <nav
        style={{
          display: "flex",
          gap: "0.5rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          marginBottom: "1.25rem",
          paddingBottom: "0.5rem",
          flexWrap: "wrap",
        }}
        aria-label="Credits Sections"
      >
        <button
          type="button"
          className={`btn ${activeTab === "licenses" ? "btn-primary" : "btn-quiet"}`}
          onClick={() => setActiveTab("licenses")}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <FiCode aria-hidden="true" /> Software Licenses ({RUNTIME_DEPENDENCIES.length})
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "provenance" ? "btn-primary" : "btn-quiet"}`}
          onClick={() => setActiveTab("provenance")}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <FiImage aria-hidden="true" /> Artwork & Media Provenance
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "ai-privacy" ? "btn-primary" : "btn-quiet"}`}
          onClick={() => setActiveTab("ai-privacy")}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <FiShield aria-hidden="true" /> AI Disclosure & Privacy
        </button>
        <button
          type="button"
          className={`btn ${activeTab === "sources" ? "btn-primary" : "btn-quiet"}`}
          onClick={() => setActiveTab("sources")}
          style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
        >
          <FiCpu aria-hidden="true" /> Scientific Agencies & APIs
        </button>
      </nav>

      {activeTab === "licenses" && (
        <section className="panel" aria-labelledby="software-licenses-heading">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
            <h3 id="software-licenses-heading" style={{ margin: 0 }}>
              Runtime Dependencies (Generated via <code>pnpm licenses list --prod</code>)
            </h3>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <FiSearch aria-hidden="true" style={{ position: "absolute", left: "0.6rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Filter packages..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    padding: "0.35rem 0.6rem 0.35rem 2rem",
                    borderRadius: "4px",
                    background: "rgba(0, 0, 0, 0.3)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "inherit",
                    fontSize: "0.85rem",
                  }}
                />
              </div>
              <select
                value={selectedLicense}
                onChange={(e) => setSelectedLicense(e.target.value)}
                style={{
                  padding: "0.35rem 0.6rem",
                  borderRadius: "4px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "inherit",
                  fontSize: "0.85rem",
                }}
              >
                <option value="all">All Licenses</option>
                {distinctLicenses.map((lic) => (
                  <option key={lic} value={lic}>
                    {lic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table" style={{ width: "100%", textAlign: "left", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th style={{ padding: "0.5rem" }}>Package</th>
                  <th style={{ padding: "0.5rem" }}>Version</th>
                  <th style={{ padding: "0.5rem" }}>License</th>
                  <th style={{ padding: "0.5rem" }}>Role in Sol Keeper</th>
                </tr>
              </thead>
              <tbody>
                {filteredDependencies.map((dep) => (
                  <tr key={dep.name}>
                    <td style={{ padding: "0.5rem", fontWeight: 600 }}>
                      <a href={dep.url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "#60a5fa" }}>
                        {dep.name} <FiExternalLink aria-hidden="true" style={{ fontSize: "0.75rem" }} />
                      </a>
                    </td>
                    <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>{dep.version}</td>
                    <td style={{ padding: "0.5rem" }}>
                      <span
                        style={{
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          background: dep.license === "MIT" ? "rgba(34, 197, 94, 0.15)" : "rgba(59, 130, 246, 0.15)",
                          color: dep.license === "MIT" ? "#4ade80" : "#60a5fa",
                        }}
                      >
                        {dep.license}
                      </span>
                    </td>
                    <td style={{ padding: "0.5rem", color: "var(--text-muted)" }}>{dep.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "rgba(255, 255, 255, 0.03)", borderRadius: "6px", fontSize: "0.82rem", lineHeight: 1.5, color: "var(--text-muted)" }}>
            <p style={{ margin: "0 0 0.4rem 0" }}>
              <strong>Simulation Architecture:</strong> <code>packages/sim</code> has <strong>0 runtime dependencies</strong>. It is written in 100% pure deterministic TypeScript with no DOM, no wall clock, and no network I/O.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Fonts & Icons:</strong> Sol Keeper bundles no external webfont files (relying exclusively on system font stacks: <code>system-ui</code> and <code>ui-monospace</code>). Iconography is powered by Feather Icons (<code>react-icons/fi</code>, MIT) and Lucide (<code>lucide-react</code>, ISC).
            </p>
          </div>
        </section>
      )}

      {activeTab === "provenance" && (
        <section className="panel" aria-labelledby="artwork-provenance-heading">
          <h3 id="artwork-provenance-heading" style={{ marginTop: 0 }}>Artwork & Media Provenance</h3>

          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#60a5fa" }}>Station Cockpit Imagery</h4>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "var(--text-muted)", margin: 0 }}>
                Station imagery across Lunar and Martian consoles is <strong>illustrative artwork, not NASA photography</strong>, and <strong>no NASA insignia or logo appears</strong> anywhere on the monitors or console hardware (complying strictly with Space Apps Challenge branding rules).
              </p>
            </div>

            <div style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#fbbf24" }}>Homepage Background Image</h4>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "var(--text-muted)", margin: 0 }}>
                The vertical repeating deep-space background (<code>_ (10).jpeg</code>) is original space artwork created by Pinterest artist <strong>tarekjasem1981</strong>, used with attribution.
              </p>
            </div>

            <div style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#a78bfa" }}>Launch Windows Background Video</h4>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "var(--text-muted)", margin: 0 }}>
                The background video for the Launch Windows section (<code>launch-windows-astronaut.mp4</code>) is <strong>AI-generated illustrative video artwork</strong> depicting an astronaut standing on a planetary outpost surface.
              </p>
            </div>

            <div style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#34d399" }}>Jezero Real Mars Photography</h4>
              <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "var(--text-muted)", margin: 0 }}>
                The Jezero Outpost mission briefing displays real Mars surface photography via the interactive Viking Orbiter MDIM 2.1 color global mosaic. Attribution is displayed directly on the map widget: <em>&quot;NASA Ames / USGS Astrogeology Science Center (Viking Orbiter MDIM 2.1), via NASA Mars Trek&quot;</em>.
              </p>
            </div>
          </div>
        </section>
      )}

      {activeTab === "ai-privacy" && (
        <section className="panel" aria-labelledby="ai-privacy-heading">
          <h3 id="ai-privacy-heading" style={{ marginTop: 0 }}>AI Development & Runtime Privacy</h3>

          <div style={{ padding: "1.25rem", borderRadius: "8px", background: "rgba(34, 197, 94, 0.06)", border: "1px solid rgba(34, 197, 94, 0.25)", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#4ade80", fontWeight: 700, marginBottom: "0.5rem" }}>
              <FiCheckCircle aria-hidden="true" style={{ fontSize: "1.2rem" }} />
              <span>Zero AI Calls at Runtime · 100% Client-Side Privacy</span>
            </div>
            <p style={{ fontSize: "0.88rem", lineHeight: 1.5, margin: "0 0 0.5rem 0" }}>
              <strong>No AI services are called during gameplay</strong>. The entire simulation runs locally inside your browser via deterministic TypeScript calculations.
            </p>
            <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "var(--text-muted)", margin: 0 }}>
              Audit check verified: <code>grep -rn &quot;api.anthropic.com&quot; apps/web</code> yields <strong>0 matches</strong>. No player decisions, seeds, telemetry, or personal data ever leave your device.
            </p>
          </div>

          <div style={{ fontSize: "0.88rem", lineHeight: 1.5, color: "var(--text-muted)" }}>
            <h4 style={{ color: "var(--text)", margin: "0 0 0.4rem 0" }}>AI Tooling Disclosure (Space Apps Requirement)</h4>
            <p style={{ margin: "0 0 0.75rem 0" }}>
              In compliance with the NASA Space Apps Challenge AI disclosure rules:
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
              <li style={{ marginBottom: "0.4rem" }}>
                <strong>Development</strong>: <strong>Claude Code</strong> (Anthropic) was used as an AI pair programming agent to build simulation models, author unit test suites, write TypeScript interfaces, and review NASA citation consistency.
              </li>
              <li>
                <strong>Generated Media</strong>: One background asset (<code>launch-windows-astronaut.mp4</code>) was AI-generated to provide an atmospheric ambient loop for the Launch Windows training missions selector.
              </li>
            </ul>
          </div>
        </section>
      )}

      {activeTab === "sources" && (
        <section className="panel" aria-labelledby="scientific-agencies-heading">
          <h3 id="scientific-agencies-heading" style={{ marginTop: 0 }}>Scientific Agencies & Data Endpoints</h3>

          <p style={{ fontSize: "0.88rem", lineHeight: 1.5, color: "var(--text-muted)" }}>
            Every physical number in the simulation traces back to a verified public agency standard or peer-reviewed document.
          </p>

          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h4 style={{ margin: "0 0 0.35rem 0", color: "#60a5fa" }}>NASA Technical Standards</h4>
              <p style={{ fontSize: "0.82rem", lineHeight: 1.45, color: "var(--text-muted)", margin: 0 }}>
                BVAD-2022 (ECLSS baselines), OCHMO-RAD / OCHMO-TB047 / OCHMO-TB003 (radiation, survivability, habitable atmosphere), Ames APR 8070.1 &amp; GSFC-STD-1000H (mass margins), NASA Water Recovery 2023 (Brine Processor Assembly), and Fission Surface Power (FSP).
              </p>
            </div>

            <div style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h4 style={{ margin: "0 0 0.35rem 0", color: "#fbbf24" }}>NOAA, NIOSH &amp; NCRP</h4>
              <p style={{ fontSize: "0.82rem", lineHeight: 1.45, color: "var(--text-muted)", margin: 0 }}>
                NOAA Space Weather Prediction Center (SWPC) live flare/CME telemetry, NCRP Report No. 98/132 career radiation exposure limits, and NIOSH criteria for occupational heat strain and environmental $CO_2$.
              </p>
            </div>

            <div style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h4 style={{ margin: "0 0 0.35rem 0", color: "#34d399" }}>NASA Image and Video Library</h4>
              <p style={{ fontSize: "0.82rem", lineHeight: 1.45, color: "var(--text-muted)", margin: 0 }}>
                Endpoint: <code>https://images-api.nasa.gov/search</code> (registered in Data Passport). Console hardware fact cards render each photo alongside its official agency credit line (e.g. <code>NASA/JPL-Caltech</code>).
              </p>
            </div>

            <div style={{ padding: "1rem", borderRadius: "8px", background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
              <h4 style={{ margin: "0 0 0.35rem 0", color: "#a78bfa" }}>JPL Horizons &amp; NASA Trek</h4>
              <p style={{ fontSize: "0.82rem", lineHeight: 1.45, color: "var(--text-muted)", margin: 0 }}>
                JPL Horizons (<code>ssd.jpl.nasa.gov/api/horizons.api</code>) for real-time light delays; NASA Moon Trek and Mars Trek (<code>trek.nasa.gov</code>) for planetary global photographic basemap tiles.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

