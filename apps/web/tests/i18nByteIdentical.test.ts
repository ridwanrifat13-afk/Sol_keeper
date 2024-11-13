import { describe, expect, it } from "vitest";
import goalText from "../src/i18n/en/goalText.json";
import logText from "../src/i18n/en/logText.json";
import decisionText from "../src/i18n/en/decisionText.json";
import { MISSION_GUIDES } from "../src/dial/missionGuides";

describe("Specialist and Commander byte-identical parity", () => {
  it("keeps goalText specialist and commander keys intact", () => {
    expect(goalText.specialist["scenario.jezero.goal.primary"]).toBe(
      "Meet the science target, keep every crew member under the radiation limit, and bring the whole crew home.",
    );
    expect(goalText.commander["scenario.jezero.goal.primary"]).toBe(
      "science.points >= scenarioTargetPoints, all crew under career radiation limit, full crew survival (engine/goals.ts's missionGoalsMet).",
    );
    expect(goalText.specialist["crisis.apollo13.goal.primary"]).toBe(
      "Prevent toxic hypercapnia and sustain 3 crew aboard LM Aquarius.",
    );
    expect(goalText.commander["crisis.apollo13.goal.primary"]).toBe(
      "Full crisis elapsed duration survived with zero crew loss (surviveFullDurationNoLoss).",
    );
  });

  it("keeps logText specialist and commander keys intact", () => {
    expect(logText.specialist["incident.coolant-ms22.overheating"]).toBe(
      "Cabin temperature rising {riseC} °C from a coolant leak — thermal control can't hold it.",
    );
    expect(logText.commander["incident.coolant-ms22.overheating"]).toBe(
      "Cabin temperature +{riseC} °C from coolant loss, uncontrolled.",
    );
  });

  it("keeps decisionText specialist and commander keys intact", () => {
    expect(decisionText.specialist["incident.fire-mir97.response.fight"]).toBe(
      "Fight the fire directly using the outpost's fire extinguishers.",
    );
    expect(decisionText.commander["incident.fire-mir97.response.fight"]).toBe(
      "Direct suppression, drawing on the tracked extinguisher stock; reduces the injury already sustained.",
    );
  });

  it("keeps MISSION_GUIDES specialist guides intact", () => {
    expect(MISSION_GUIDES["first-light"].steps[6]).toBe(
      "Around hour 500 (deep in the night, the worst possible time for it), a pump-related failure can hit a system with only one spare part in reserve — the same permanent-loss-versus-costly-repair choice Jezero's pump failure (Sol 12) forces, except now with a drained battery watching. Decide in advance which path you'll take if it happens.",
    );
    expect(MISSION_GUIDES["the-long-night"].paragraphs[0]).toContain(
      "-178°C night alone demands [NSSDC-FACTS]",
    );
    expect(MISSION_GUIDES["crisis-apollo13-co2"].paragraphs[0]).toContain(
      "an 87-hour (~3.6-day) return trajectory [A13-CO2]",
    );
    expect(MISSION_GUIDES["crisis-spe-1972"].paragraphs[1]).toContain(
      ">0.5 Gy over several hours [HRP-ARS]",
    );
  });
});
