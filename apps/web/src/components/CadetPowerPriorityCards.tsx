import type { SystemId, SystemState } from "@sol-keeper/sim";
import { useAppLanguage } from "../i18n/useAppLanguage.js";
import "./CadetPowerPriorityCards.css";

export type CadetPowerPresetId = "crew" | "science" | "garden";

export interface CadetPowerPreset {
  readonly id: CadetPowerPresetId;
  readonly titleEn: string;
  readonly titleBn: string;
  readonly descEn: string;
  readonly descBn: string;
  readonly costEn: string;
  readonly costBn: string;
  readonly icon: string;
  readonly targetOrder: readonly SystemId[];
}

export const CADET_POWER_PRESETS: readonly CadetPowerPreset[] = [
  {
    id: "crew",
    titleEn: "Protect the Crew",
    titleBn: "ক্রুদের সুরক্ষিত রাখো",
    descEn: "Keeps air cleaner, fresh oxygen, and habitat heaters on first.",
    descBn: "বাতাস ফিল্টার, তাজা অক্সিজেন এবং হিটার সবার আগে সচল রাখে।",
    costEn: "Price: Science experiments pause during dark periods.",
    costBn: "মূল্য: রাতের অন্ধকারে বিজ্ঞান গবেষণার কাজ স্থগিত থাকবে।",
    icon: "🧑‍🚀",
    targetOrder: [
      "lifeSupport",
      "co2Scrubber",
      "oxygenGenerator",
      "thermalControl",
      "waterRecovery",
      "powerDistribution",
      "greenhouse",
      "moxie",
      "comms",
    ],
  },
  {
    id: "science",
    titleEn: "Protect the Science",
    titleBn: "বিজ্ঞান ও গবেষণা অগ্রাধিকার",
    descEn: "Keeps radio comms and science instruments running at full speed.",
    descBn: "রেডিও যোগাযোগ এবং গবেষণার যন্ত্রপাতি সর্বোচ্চ সচল রাখে।",
    costEn: "Price: Greenhouses lose power first; crops grow slower.",
    costBn: "মূল্য: গ্রিনহাউস আগে বন্ধ হবে; ফসল বাড়তে দেরি হতে পারে।",
    icon: "📡",
    targetOrder: [
      "comms",
      "moxie",
      "lifeSupport",
      "co2Scrubber",
      "oxygenGenerator",
      "thermalControl",
      "powerDistribution",
      "waterRecovery",
      "greenhouse",
    ],
  },
  {
    id: "garden",
    titleEn: "Protect the Garden",
    titleBn: "ফসল ও বাগান অগ্রাধিকার",
    descEn: "Keeps greenhouse grow-lights and water recycling pumps alive.",
    descBn: "গ্রিনহাউসের আলো ও পানি রিসাইক্লিং পাম্প সচল রাখে।",
    costEn: "Price: Radio updates to Earth take longer.",
    costBn: "মূল্য: পৃথিবীতে রেডিও বার্তা পাঠাতে বেশি সময় লাগবে।",
    icon: "🌱",
    targetOrder: [
      "greenhouse",
      "waterRecovery",
      "lifeSupport",
      "co2Scrubber",
      "oxygenGenerator",
      "thermalControl",
      "powerDistribution",
      "moxie",
      "comms",
    ],
  },
];

export function detectActiveCadetPreset(
  systems: Record<string, SystemState | undefined>,
): CadetPowerPresetId | "custom" {
  const ordered = Object.values(systems)
    .filter((s): s is SystemState => s !== undefined)
    .sort((a, b) => a.priority - b.priority)
    .map((s) => s.id);

  if (ordered.length === 0) return "crew";

  // Check which preset has the highest rank matching the top 2 priorities
  if (ordered[0] === "comms" || ordered[1] === "comms") return "science";
  if (ordered[0] === "greenhouse" || ordered[1] === "greenhouse") return "garden";
  if (ordered[0] === "lifeSupport" || ordered[0] === "co2Scrubber") return "crew";

  return "crew";
}

interface CadetPowerPriorityCardsProps {
  readonly systems: Record<string, SystemState | undefined>;
  readonly locked: boolean;
  readonly onSetPriority: (id: SystemId, direction: -1 | 1) => void;
}

export function CadetPowerPriorityCards({
  systems,
  locked,
  onSetPriority,
}: CadetPowerPriorityCardsProps) {
  const language = useAppLanguage();
  const activePreset = detectActiveCadetPreset(systems);

  const applyPreset = (targetOrder: readonly SystemId[]) => {
    if (locked) return;

    const current = Object.values(systems)
      .filter((s): s is SystemState => s !== undefined)
      .sort((a, b) => a.priority - b.priority)
      .map((s) => s.id);

    for (let i = 0; i < targetOrder.length; i++) {
      const targetId = targetOrder[i];
      if (targetId === undefined) continue;
      const currentIndex = current.indexOf(targetId);
      if (currentIndex === -1) continue;

      for (let j = currentIndex; j > i; j--) {
        onSetPriority(targetId, -1);
        const temp = current[j];
        const prev = current[j - 1];
        if (temp !== undefined && prev !== undefined) {
          current[j] = prev;
          current[j - 1] = temp;
        }
      }
    }
  };

  return (
    <div className="cadet-power-cards-container">
      <div className="cadet-power-cards-grid" role="radiogroup" aria-label="Power Priority Presets">
        {CADET_POWER_PRESETS.map((preset) => {
          const isSelected = activePreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={locked}
              className={`cadet-power-card ${isSelected ? "is-selected" : ""}`}
              onClick={() => applyPreset(preset.targetOrder)}
            >
              <div className="cadet-power-card-header">
                <span className="cadet-power-card-icon" aria-hidden="true">
                  {preset.icon}
                </span>
                <span className="cadet-power-card-title">
                  {language === "bn" ? preset.titleBn : preset.titleEn}
                </span>
                {isSelected && (
                  <span className="cadet-power-card-badge">
                    {language === "bn" ? "সক্রিয়" : "Active"}
                  </span>
                )}
              </div>
              <p className="cadet-power-card-desc">
                {language === "bn" ? preset.descBn : preset.descEn}
              </p>
              <div className="cadet-power-card-cost">
                {language === "bn" ? preset.costBn : preset.costEn}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

