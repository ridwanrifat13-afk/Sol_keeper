import { useState } from "react";
import type { DialLevel, Language } from "../dial/types.js";
import type { ResourceReadout } from "../dial/resourceSummary.js";
import { STATUS, type StatusLevel } from "./status.js";
import { Gauge } from "./Gauge.js";
import { Term } from "./Term.js";
import "./AirGauge.css";

export interface AirGaugeProps {
  readonly oxygenValue: number;
  readonly oxygenReadout: ResourceReadout;
  readonly co2Value: number;
  readonly co2Readout: ResourceReadout;
  readonly level: DialLevel;
  readonly language?: Language;
  readonly history?: readonly number[];
}

/**
 * Merged Air gauge for Cadet depth (M13).
 * Combines O2 and CO2 into a single clear readout, with detail one tap away.
 */
export function AirGauge({
  oxygenValue,
  oxygenReadout,
  co2Value,
  co2Readout,
  level,
  language = "en",
  history,
}: AirGaugeProps) {
  const [expanded, setExpanded] = useState(false);

  // At Specialist and Commander depth, return the standard separate gauges
  if (level !== "cadet") {
    return (
      <div className="air-gauge-split">
        <Gauge
          icon="◇"
          label={language === "bn" ? "অক্সিজেন" : "Oxygen"}
          value={oxygenValue}
          unit={oxygenReadout.text.unit}
          decimals={oxygenReadout.text.decimals}
          {...(oxygenReadout.text.valueText !== undefined ? { valueText: oxygenReadout.text.valueText } : {})}
          fraction={oxygenReadout.fraction}
          status={oxygenReadout.status}
          {...(oxygenReadout.text.detail !== undefined ? { detail: oxygenReadout.text.detail } : {})}
          helpKey="gauge.oxygen"
          level={level}
          {...(history !== undefined ? { history } : {})}
        />
        <Gauge
          icon="▽"
          label={language === "bn" ? "কার্বন ডাই-অক্সাইড" : "Carbon dioxide"}
          value={co2Value}
          unit={co2Readout.text.unit}
          decimals={co2Readout.text.decimals}
          {...(co2Readout.text.valueText !== undefined ? { valueText: co2Readout.text.valueText } : {})}
          fraction={co2Readout.fraction}
          status={co2Readout.status}
          {...(co2Readout.text.detail !== undefined ? { detail: co2Readout.text.detail } : {})}
          helpKey="gauge.co2"
          level={level}
        />
      </div>
    );
  }

  // Cadet Merged Gauge Calculation:
  const isCritical = oxygenReadout.status.level === "critical" || co2Readout.status.level === "critical";
  const isCaution = oxygenReadout.status.level === "caution" || co2Readout.status.level === "caution";

  const statusLevel: StatusLevel = isCritical ? "critical" : isCaution ? "caution" : "nominal";
  const statusPresentation = STATUS[statusLevel];

  const statusLabel =
    language === "bn"
      ? statusLevel === "critical"
        ? "বিপজ্জনক"
        : statusLevel === "caution"
          ? "সতর্কতা"
          : "স্বাভাবিক"
      : statusLevel === "critical"
        ? "Dangerous"
        : statusLevel === "caution"
          ? "Stuffy"
          : "Fresh";

  const valueText =
    language === "bn"
      ? statusLevel === "critical"
        ? "বাতাস শ্বাস নেওয়ার অযোগ্য!"
        : statusLevel === "caution"
          ? "বাতাস ভারী হয়ে উঠছে"
          : "শ্বাস নেওয়ার উপযুক্ত বাতাস"
      : statusLevel === "critical"
        ? "Air is dangerous to breathe!"
        : statusLevel === "caution"
          ? "Air is getting stuffy"
          : "Fresh, clean air";

  // Unified fraction: 1.0 down to 0.0 based on safest common denominator
  const airFraction = Math.max(0, Math.min(1, Math.min(oxygenReadout.fraction, 1 - co2Readout.fraction * 0.7)));

  return (
    <div className="air-gauge-merged-wrapper">
      <Gauge
        icon="💨"
        label={language === "bn" ? "বাতাস" : "Air"}
        value={oxygenValue}
        unit="mmHg"
        decimals={0}
        valueText={valueText}
        fraction={airFraction}
        status={statusPresentation}
        statusLabel={statusLabel}
        detail={language === "bn" ? "ট্যাপ করে বিস্তারিত দেখুন" : "Tap for details"}
        helpKey="gauge.oxygen"
        level={level}
        {...(history !== undefined ? { history } : {})}
      />

      <button
        type="button"
        className="btn btn-quiet air-details-toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded
          ? language === "bn"
            ? "▲ সংক্ষেপ করুন"
            : "▲ Hide air breakdown"
          : language === "bn"
            ? "▼ বাতাসের বিস্তারিত উপাদান"
            : "▼ Check oxygen & CO₂"}
      </button>

      {expanded && (
        <div className="air-details-card" role="region" aria-label="Air Breakdown">
          <div className="air-detail-row">
            <span className="air-detail-name">
              <Term term="oxygen">{language === "bn" ? "অক্সিজেন" : "Oxygen"}</Term>:
            </span>
            <span className="air-detail-val">
              {oxygenValue.toFixed(1)} mmHg ({oxygenReadout.status.label})
            </span>
          </div>
          <div className="air-detail-row">
            <span className="air-detail-name">
              <Term term="carbon dioxide">
                {language === "bn" ? "কার্বন ডাই-অক্সাইড" : "Carbon dioxide"}
              </Term>
              :
            </span>
            <span className="air-detail-val">
              {co2Value.toFixed(1)} mmHg ({co2Readout.status.label})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
