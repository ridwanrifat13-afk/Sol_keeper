import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiAlertCircle, FiCheck, FiHelpCircle } from "react-icons/fi";
import { useDial } from "../store/dial.js";
import { useAppLanguage } from "../i18n/useAppLanguage.js";
import { recordBigIdeaAnswer } from "../store/playtest.js";
import {
  getBigIdeaForScenario,
  getStoredBigIdeaAnswer,
  saveStoredBigIdeaAnswer,
} from "../data/bigIdeas.js";
import { Term } from "./Term.js";
import "./BigIdeaCheck.css";

interface BigIdeaCheckProps {
  readonly scenarioId: string;
}

/**
 * Replaces domain terms ("battery", "radiation", "storm shelter", "light-time")
 * with interactive <Term> glossary tooltips.
 */
function renderWithTerms(text: string): React.ReactNode {
  const regex = /\b(storm shelter|light-time|radiation|battery)\b/gi;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const matchedTerm = match[0];
    const lookupKey = matchedTerm.toLowerCase();
    parts.push(
      <Term key={`${match.index}-${lookupKey}`} term={lookupKey}>
        {matchedTerm}
      </Term>,
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

export function BigIdeaCheck({ scenarioId }: BigIdeaCheckProps) {
  const check = getBigIdeaForScenario(scenarioId);
  const level = useDial((s) => s.level);
  const language = useAppLanguage();
  const { t } = useTranslation();

  const [selectedOption, setSelectedOption] = useState<string | null>(() => {
    if (!check) return null;
    return getStoredBigIdeaAnswer(check.key);
  });

  if (!check) return null;

  const showDetail = level === "specialist" || level === "commander";
  const optionKeys: Array<"A" | "B" | "C"> = ["A", "B", "C"];

  const handleSelectOption = (optKey: "A" | "B" | "C") => {
    setSelectedOption(optKey);
    saveStoredBigIdeaAnswer(check.key, optKey);

    const isCorrect = optKey === check.correct;
    // ?playtest=1: records whether first try was correct
    recordBigIdeaAnswer(check.key, isCorrect);
  };

  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === check.correct;

  // Translation helpers: use bn translations if available, fallback to exact English spec
  const ideaText = language === "bn" ? t(`bigIdea.${check.key}.idea`, check.idea) : check.idea;
  const detailText =
    language === "bn" ? t(`bigIdea.${check.key}.detail`, check.detail) : check.detail;
  const questionText =
    language === "bn" ? t(`bigIdea.${check.key}.question`, check.question) : check.question;
  const rightFeedbackText =
    language === "bn"
      ? t(`bigIdea.${check.key}.rightFeedback`, check.rightFeedback)
      : check.rightFeedback;
  const wrongFeedbackText =
    language === "bn"
      ? t(`bigIdea.${check.key}.wrongFeedback`, check.wrongFeedback)
      : check.wrongFeedback;

  return (
    <section className="panel big-idea-panel" aria-labelledby="big-idea-heading">
      <header className="big-idea-header">
        <h2 id="big-idea-heading" className="big-idea-title">
          <FiHelpCircle aria-hidden="true" className="big-idea-icon" />
          {t("bigIdea.heading", "Big Idea Check")}
        </h2>
        <span className="big-idea-badge">{t("bigIdea.badge", "Concept Check")}</span>
      </header>

      <div className="big-idea-callout">
        <p className="big-idea-core">{renderWithTerms(ideaText)}</p>
        {showDetail && <p className="big-idea-detail">{renderWithTerms(detailText)}</p>}
      </div>

      <div className="big-idea-quiz">
        <p className="big-idea-question">{renderWithTerms(questionText)}</p>

        <div className="big-idea-options" role="radiogroup" aria-label={questionText}>
          {optionKeys.map((key) => {
            const rawOptText = check.options[key];
            const optText =
              language === "bn"
                ? t(`bigIdea.${check.key}.options.${key}`, rawOptText)
                : rawOptText;
            const isSelected = selectedOption === key;

            return (
              <button
                key={key}
                type="button"
                className={`btn big-idea-option-btn ${isSelected ? "selected" : ""}`}
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelectOption(key)}
              >
                <span className="option-letter">{key}</span>
                <span className="option-text">{renderWithTerms(optText)}</span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div
            className={`big-idea-feedback ${isCorrect ? "feedback-right" : "feedback-wrong"}`}
            role="status"
          >
            {isCorrect ? (
              <>
                <FiCheck aria-hidden="true" className="feedback-icon" />
                <span>{renderWithTerms(rightFeedbackText)}</span>
              </>
            ) : (
              <>
                <FiAlertCircle aria-hidden="true" className="feedback-icon" />
                <span>{renderWithTerms(wrongFeedbackText)}</span>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

