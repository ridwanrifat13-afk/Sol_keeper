/**
 * ScoreCard component (M9.4).
 *
 * Renders the mission score card above the Black Box panel in DebriefView.
 * Supports Cadet, Specialist, and Commander Reality Dial depths.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FiAward,
  FiShield,
  FiCpu,
  FiTool,
  FiHeart,
  FiStar,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  scoreMission,
  type MissionScore,
  type BotBaselines,
  type ScoreComponentId,
  type ScoreEvent,
} from "@sol-keeper/sim";
import { useRun } from "../../store/run.js";
import { useDial } from "../../store/dial.js";
import { useAppLanguage } from "../../i18n/useAppLanguage.js";
import { decisionText, hasDecisionTemplate } from "../../i18n/decisionText.js";
import enDecisionTemplates from "../../i18n/en/decisionText.json" with { type: "json" };
import type { DialLevel, Language } from "../../dial/types.js";
import "./ScoreCard.css";

export interface ScoreCardProps {
  readonly score?: MissionScore;
  readonly level?: DialLevel;
  readonly onJumpToEvent?: (eventId: string) => void;
}

const COMPONENT_ICONS: Record<
  ScoreComponentId,
  { cadet: string; specialist: React.ReactNode; label: string }
> = {
  outcome: { cadet: "🏆", specialist: <FiAward aria-hidden="true" />, label: "Mission Outcome" },
  margin: { cadet: "🛡️", specialist: <FiShield aria-hidden="true" />, label: "Safety Margin" },
  decision: { cadet: "🧠", specialist: <FiCpu aria-hidden="true" />, label: "Decision Quality" },
  efficiency: { cadet: "🔧", specialist: <FiTool aria-hidden="true" />, label: "Resource Efficiency" },
  welfare: { cadet: "❤️", specialist: <FiHeart aria-hidden="true" />, label: "Crew Welfare" },
};

function renderStarRating(grade: MissionScore["grade"]) {
  const count = grade === "A+" || grade === "A" ? 5 : grade === "B" ? 4 : grade === "C" ? 3 : grade === "D" ? 2 : 1;
  return (
    <div className="scorecard-stars" aria-label={`${count} of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <FiStar
          key={i}
          className={`star-icon ${i < count ? "filled" : "empty"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function resolveCadetOptionLabel(optionKey: string, language: Language): string | undefined {
  if (!optionKey) return undefined;
  if (hasDecisionTemplate(optionKey, "cadet", language)) {
    return decisionText(optionKey, "cadet", undefined, language);
  }
  const match = Object.keys(enDecisionTemplates.cadet).find(
    (k) => k.endsWith(`.response.${optionKey}`) || k.endsWith(`.${optionKey}`),
  );
  if (match) {
    return decisionText(match, "cadet", undefined, language);
  }
  return undefined;
}

export function ScoreCard({ score: propScore, level: propLevel, onJumpToEvent }: ScoreCardProps) {
  const { t } = useTranslation();
  const state = useRun((s) => s.state);
  const scenario = useRun((s) => s.scenario);
  const params = useRun((s) => s.params);
  const isSecondTry = useRun((s) => s.isSecondTry);
  const isMissionOfTheDay = useRun((s) => s.isMissionOfTheDay);
  const storeDialLevel = useDial((s) => s.level);
  const dialLevel = propLevel ?? storeDialLevel;
  const language = useAppLanguage();

  const [baselines, setBaselines] = useState<BotBaselines | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/scoring/baselines.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setBaselines(data);
      })
      .catch(() => {
        // Fall back to built-in medians if offline
      });
  }, []);

  const score: MissionScore = useMemo(() => {
    if (propScore) return propScore;
    return scoreMission(state.log, state, scenario, params.difficulty, baselines ?? undefined);
  }, [propScore, state, scenario, params.difficulty, baselines]);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getBotComparison = () => {
    const { total, baselineComparison } = score;
    const { prudentBotMedian, greedyBotMedian, idleBotMedian } = baselineComparison;
    if (total >= prudentBotMedian) {
      return `Exceeded Prudent Bot baseline (${prudentBotMedian} pts) — Exemplary Command Strategy`;
    }
    if (total >= greedyBotMedian) {
      return `Exceeded Greedy Bot baseline (${greedyBotMedian} pts) — Disciplined Hazard Mitigation`;
    }
    if (total >= idleBotMedian) {
      return `Exceeded Idle Bot baseline (${idleBotMedian} pts) — Timely Interventions Averted Loss`;
    }
    return `Below Idle Bot baseline (${idleBotMedian} pts) — Severe Hazard Excursions Compounded`;
  };

  const gradeClass = `grade-${score.grade.toLowerCase().replace("+", "-plus")}`;

  return (
    <section className="panel scorecard-panel" aria-labelledby="scorecard-heading">
      <header className="scorecard-header">
        <div className="scorecard-badge-group">
          <div className={`scorecard-grade-badge ${gradeClass}`}>
            <span className="grade-letter">{score.grade}</span>
            <span className="grade-sublabel">Evaluation Grade</span>
          </div>
          <div className="scorecard-score-group">
            <h2 id="scorecard-heading" className="scorecard-title">
              {isMissionOfTheDay
                ? t("scorecard.motdHeading", "Mission of the Day Score")
                : t("scorecard.heading", "Mission Performance Score")}
            </h2>
            <div className="scorecard-total-row">
              <span className="scorecard-total-number">{score.total}</span>
              <span className="scorecard-total-max">/ 100</span>
              {renderStarRating(score.grade)}
            </div>
          </div>
        </div>

        {isSecondTry ? (
          <div className="scorecard-percentile-card second-try" style={{ borderColor: "#f59e0b" }}>
            <div className="percentile-headline">
              <span
                style={{
                  display: "inline-block",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "4px",
                  background: "rgba(245, 158, 11, 0.2)",
                  color: "#f59e0b",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  marginRight: "0.5rem",
                }}
              >
                Second try
              </span>
              <span className="percentile-bold">Excluded from percentile stats</span>
            </div>
            <div className="percentile-bot-comparison">
              Practice run — rewound runs with &quot;Try Again&quot; are excluded from practice crew rankings and Mission of the Day.
            </div>
          </div>
        ) : (
          <div className="scorecard-percentile-card">
            <div className="percentile-headline">
              <FiTrendingUp className="percentile-icon" aria-hidden="true" />
              <span className="percentile-bold">Better than {score.percentile}%</span> of{" "}
              {params.difficulty} {scenario.site.name} runs
              {isMissionOfTheDay && (
                <span style={{ marginLeft: "0.5rem", opacity: 0.8 }}>(Mission of the Day)</span>
              )}
            </div>
            <div className="percentile-bot-comparison">{getBotComparison()}</div>
          </div>
        )}
      </header>

      {/* Five Category Horizontal Progress Bars */}
      <div className="scorecard-components">
        <h3 className="components-heading">Category Evaluation</h3>
        <div className="components-grid">
          {score.components.map((comp) => {
            const pct = Math.min(100, Math.max(0, (comp.score / comp.maxScore) * 100));
            const iconConfig = COMPONENT_ICONS[comp.id];
            const isExpanded = !!expandedCategories[comp.id];
            const hasEvents = comp.events.length > 0;

            return (
              <div key={comp.id} className="component-card">
                <div className="component-top">
                  <div className="component-label-group">
                    {dialLevel === "cadet" ? (
                      <span className="component-emoji" aria-hidden="true">
                        {iconConfig.cadet}
                      </span>
                    ) : (
                      <span className="component-svg-icon">{iconConfig.specialist}</span>
                    )}
                    <span className="component-name">
                      {t(comp.label, { defaultValue: iconConfig.label })}
                    </span>
                  </div>
                  <div className="component-score-group">
                    <span className="component-score-val">{comp.score}</span>
                    <span className="component-score-max">/ {comp.maxScore}</span>
                  </div>
                </div>

                <div
                  className="component-progress-track"
                  role="progressbar"
                  aria-valuenow={comp.score}
                  aria-valuemin={0}
                  aria-valuemax={comp.maxScore}
                  aria-label={iconConfig.label}
                >
                  <div
                    className={`component-progress-fill ${comp.id}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Commander View: Expandable Event Breakdown */}
                {dialLevel === "commander" && hasEvents && (
                  <div className="component-commander-details">
                    <button
                      type="button"
                      className="commander-expand-btn"
                      onClick={() => toggleCategory(comp.id)}
                      aria-expanded={isExpanded}
                    >
                      <span>
                        {isExpanded ? "Hide" : "Audit"} telemetry ({comp.events.length} factors)
                      </span>
                      {isExpanded ? (
                        <FiChevronUp aria-hidden="true" />
                      ) : (
                        <FiChevronDown aria-hidden="true" />
                      )}
                    </button>

                    {isExpanded && (
                      <ul className="commander-event-list">
                        {comp.events.map((event: ScoreEvent, idx: number) => (
                          <li
                            key={`${event.hour}-${event.reason}-${idx}`}
                            className={`commander-event-item ${event.delta >= 0 ? "positive" : "negative"}`}
                          >
                            <span className="event-meta">
                              Sol {event.sol} (H{event.hour})
                            </span>
                            <span className="event-reason">
                              {t(event.reason, { defaultValue: event.reason })}
                            </span>
                            <span className="event-delta">
                              {event.delta > 0 ? `+${event.delta}` : event.delta} pts
                            </span>
                            {event.causalEventId && (
                              <button
                                type="button"
                                className="event-jump-link"
                                onClick={() => onJumpToEvent?.(event.causalEventId!)}
                                title={`Focus log event ${event.causalEventId}`}
                              >
                                Log #{event.causalEventId}
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Highlighted Decisions */}
      <div className="scorecard-decisions-grid">
        {/* Best Decision */}
        <div className="decision-callout-card positive">
          <div className="decision-callout-header">
            <FiCheckCircle className="decision-header-icon positive" aria-hidden="true" />
            <span className="decision-header-title">
              {dialLevel === "cadet" ? "Top Strategic Call" : "Best Decision"}
            </span>
            <span className="decision-net-pill positive">
              +{score.bestDecision.netEffect} pts
            </span>
          </div>
          <div className="decision-meta-row">
            <span>{dialLevel === "cadet" ? `Day ${score.bestDecision.sol}` : `Sol ${score.bestDecision.sol}`}</span>
            <span>·</span>
            <span>{score.bestDecision.station}</span>
          </div>
          <p className="decision-explanation">
            {(() => {
              if (dialLevel === "cadet") {
                const chosen = resolveCadetOptionLabel(score.bestDecision.chosenOption, language);
                const alt = resolveCadetOptionLabel(score.bestDecision.alternativeOption, language);
                if (chosen && alt) {
                  return `On day ${score.bestDecision.sol} you picked "${chosen}". It worked better than "${alt}".`;
                }
                return `On day ${score.bestDecision.sol} you made a great call.`;
              }
              if (dialLevel === "commander") {
                return `Mitigation call at Sol ${score.bestDecision.sol} averted cascading failure mode (${t(score.bestDecision.explanation, { defaultValue: score.bestDecision.explanation })}). Delta: +${score.bestDecision.netEffect} pts.`;
              }
              return `Proactive management on Sol ${score.bestDecision.sol} outperformed default response (${t(score.bestDecision.explanation, { defaultValue: score.bestDecision.explanation })}).`;
            })()}
          </p>
        </div>

        {/* Costliest Decision */}
        <div className="decision-callout-card negative">
          <div className="decision-callout-header">
            <FiAlertTriangle className="decision-header-icon negative" aria-hidden="true" />
            <span className="decision-header-title">
              {dialLevel === "cadet" ? "Costliest Decision" : "Critical Friction Point"}
            </span>
            <span className="decision-net-pill negative">
              {score.costliestDecision.netEffect} pts
            </span>
          </div>
          <div className="decision-meta-row">
            <span>{dialLevel === "cadet" ? `Day ${score.costliestDecision.sol}` : `Sol ${score.costliestDecision.sol}`}</span>
            <span>·</span>
            <span>{score.costliestDecision.station}</span>
          </div>
          <p className="decision-explanation">
            {(() => {
              if (dialLevel === "cadet") {
                if (score.costliestDecision.netEffect === 0) {
                  return "You made no big mistakes. Everything stayed in the safe zone.";
                }
                const chosen = resolveCadetOptionLabel(score.costliestDecision.chosenOption, language);
                const alt = resolveCadetOptionLabel(score.costliestDecision.alternativeOption, language);
                if (chosen && alt) {
                  return `On day ${score.costliestDecision.sol} you picked "${chosen}". "${alt}" would have cost the crew less.`;
                }
                return `On day ${score.costliestDecision.sol} something cost the crew a lot of safety. Open the Black Box to see what happened.`;
              }
              if (dialLevel === "commander") {
                return score.costliestDecision.netEffect === 0
                  ? "Telemetry shows zero negative penalty events linked to player actions."
                  : `Action on Sol ${score.costliestDecision.sol} incurred penalty: ${t(score.costliestDecision.explanation, { defaultValue: score.costliestDecision.explanation })} (${score.costliestDecision.netEffect} pts).`;
              }
              return score.costliestDecision.netEffect === 0
                ? "Nominal command execution across all incident windows."
                : `Costliest impact on Sol ${score.costliestDecision.sol} (${t(score.costliestDecision.explanation, { defaultValue: score.costliestDecision.explanation })}).`;
            })()}
          </p>
        </div>
      </div>
    </section>
  );
}
