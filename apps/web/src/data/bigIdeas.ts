import { environment, getScenario, physics } from "@sol-keeper/sim";

export type BigIdeaKey = "firstLight" | "stormWarning" | "greenThumb" | "helloEarth";

export interface BigIdeaOption {
  readonly id: "A" | "B" | "C";
  readonly text: string;
}

export interface BigIdeaCheckDefinition {
  readonly key: BigIdeaKey;
  readonly scenarioIds: readonly string[];
  readonly idea: string;
  readonly detail: string;
  readonly question: string;
  readonly options: {
    readonly A: string;
    readonly B: string;
    readonly C: string;
  };
  readonly correct: "A" | "B" | "C";
  readonly rightFeedback: string;
  readonly wrongFeedback: string;
}

// Sourced constants placeholders resolved dynamically — never typed by hand
const nightHours = environment.lunarNightHours.value; // 354
const greenThumbScenario = getScenario("green-thumb");
const greenhouseKw =
  greenThumbScenario.systems.find((s) => s.id === "greenhouse")?.nominalPowerKw ?? 1.2;

// Earth-Mars distance ranges 0.3727 AU to 2.675 AU per JPL Horizons ephemerides
const lightSecondsPerAu = physics.lightSecondsPerAu.value; // ~499
const lightTimeMinMin = Math.round((0.3727 * lightSecondsPerAu) / 60); // 3
const lightTimeMaxMin = Math.round((2.675 * lightSecondsPerAu) / 60); // 22

export const BIG_IDEA_CHECKS: Record<BigIdeaKey, BigIdeaCheckDefinition> = {
  firstLight: {
    key: "firstLight",
    scenarioIds: ["first-light"],
    idea: "A base can only use power it has made or saved. The Moon's night lasts about 15 days.",
    detail: `The night lasts ${nightHours} hours. The battery must cover the whole load, so the lowest-priority loads are turned off first.`,
    question: "Why does the crew turn off the garden lights before the long night?",
    options: {
      A: "Plants grow better in the dark.",
      B: "To save battery power for air and heat.",
      C: "The plants are done growing.",
    },
    correct: "B",
    rightFeedback:
      "Right! The battery holds only so much power. The crew needs it for air and heat first.",
    wrongFeedback:
      "Not quite. The night lasts about 15 days. The battery must last the whole time, so the crew saves power for air and heat.",
  },
  stormWarning: {
    key: "stormWarning",
    scenarioIds: ["storm-watch", "crisis-spe-1972", "the-long-night"],
    idea: "Thick walls help keep people safe from radiation. But hiding costs time and power.",
    detail:
      "Shielding thickness (g/cm²) cuts radiation dose. Sheltering costs crew-hours and pauses science and outside work.",
    question: "The crew waits in the storm shelter for many hours. What do they give up?",
    options: {
      A: "Time for outside work and science.",
      B: "Their air.",
      C: "Nothing. Hiding is free.",
    },
    correct: "A",
    rightFeedback:
      "Right! Every hour in the shelter is an hour not spent working. Staying safe has a price.",
    wrongFeedback:
      "Not quite. In the shelter the crew is safe, but they can't do outside work or science. Staying safe has a price.",
  },
  greenThumb: {
    key: "greenThumb",
    scenarioIds: ["green-thumb"],
    idea: "Plants need light to grow. In space, lamps make that light, and lamps use power.",
    detail: `The greenhouse lights draw ${greenhouseKw} kW in this mission. Fewer lit hours means slower growth and less food.`,
    question: "The crew turns the garden lights down to save power. What happens to the plants?",
    options: {
      A: "They grow faster in the dark.",
      B: "Nothing changes.",
      C: "They grow more slowly, so there is less food later.",
    },
    correct: "C",
    rightFeedback: "Right! Less light means slower growth. Saving power can cost food later.",
    wrongFeedback:
      "Not quite. Plants use light to grow. With less light they grow more slowly, so there is less food later.",
  },
  helloEarth: {
    key: "helloEarth",
    scenarioIds: ["jezero-outpost"],
    idea: "A message from Mars takes at least 3 minutes to reach Earth. The crew often has to decide alone.",
    detail: `One-way light-time is about ${lightTimeMinMin} to ${lightTimeMaxMin} minutes, depending on the Earth–Mars distance (JPL Horizons).`,
    question: "A fire alarm sounds on Mars. Should the crew wait for Earth's answer?",
    options: {
      A: "Yes. Earth always knows best.",
      B: "No. The answer would come too late, so the crew acts first.",
      C: "Yes. Messages arrive in one second.",
    },
    correct: "B",
    rightFeedback:
      "Right! A message takes at least 3 minutes to get to Earth, and the answer takes as long to come back. For a fire, the crew must act first.",
    wrongFeedback:
      "Not quite. A message from Mars takes at least 3 minutes to reach Earth. The answer takes as long to come back. For a fire, the crew must act first.",
  },
};

export function getBigIdeaForScenario(scenarioId: string): BigIdeaCheckDefinition | undefined {
  return Object.values(BIG_IDEA_CHECKS).find((check) => check.scenarioIds.includes(scenarioId));
}

const STORAGE_PREFIX = "sol_keeper_big_idea_answer_";

function getStorage(): Storage | undefined {
  if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  if (typeof globalThis !== "undefined" && (globalThis as { localStorage?: Storage }).localStorage) {
    return (globalThis as { localStorage: Storage }).localStorage;
  }
  return undefined;
}

export function getStoredBigIdeaAnswer(checkKey: string): string | null {
  try {
    const storage = getStorage();
    if (storage) {
      return storage.getItem(`${STORAGE_PREFIX}${checkKey}`);
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

export function saveStoredBigIdeaAnswer(checkKey: string, chosenOption: string): void {
  try {
    const storage = getStorage();
    if (storage) {
      storage.setItem(`${STORAGE_PREFIX}${checkKey}`, chosenOption);
    }
  } catch {
    // Ignore storage quota or access errors
  }
}
