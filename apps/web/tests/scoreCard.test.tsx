import { describe, expect, it } from "vitest";
import "../src/i18n/config.js";
import { renderToString } from "react-dom/server";
import { ScoreCard } from "../src/components/debrief/ScoreCard.js";
import { useDial } from "../src/store/dial.js";
import { SCENARIOS, createInitialState, prudentBot, runWithBot, scoreMission } from "@sol-keeper/sim";

describe("ScoreCard Component (M9.4)", () => {
  function getSampleScore() {
    const scenario = SCENARIOS["jezero-outpost"];
    const params = {
      scenarioId: "jezero-outpost" as const,
      seed: 42,
      crewSize: scenario.crewSize,
      missionStartIso: "2033-01-01",
      difficulty: "nominal" as const,
    };
    const state = createInitialState(params);
    runWithBot(state, params, scenario, scenario.durationHours, prudentBot);
    return scoreMission(state.log, state, scenario, params.difficulty);
  }

  function render(el: React.ReactElement): string {
    return renderToString(el).replace(/<!--.*?-->/g, "");
  }

  it("renders total score, evaluation grade, and category breakdown", () => {
    const score = getSampleScore();
    const html = render(<ScoreCard score={score} />);

    // Total score and grade
    expect(html).toContain(String(score.total));
    expect(html).toContain(score.grade);
    expect(html).toContain("Mission Performance Score");

    // Category progress bars
    expect(html).toContain("Category Evaluation");
    expect(html).toContain("Mission Outcome");
    expect(html).toContain("Safety Margin");
    expect(html).toContain("Decision Quality");
    expect(html).toContain("Resource Efficiency");
    expect(html).toContain("Crew Welfare");

    // Highlighted decisions
    expect(html).toContain("Best Decision");
    expect(html).toContain("Critical Friction Point");
  });

  it("resolves chosenOption and alternativeOption to Cadet labels when available and shows 'Day'", () => {
    useDial.getState().setLevel("cadet");
    const baseScore = getSampleScore();
    const scoreWithLabels = {
      ...baseScore,
      bestDecision: {
        sol: 4,
        station: "Incident Command",
        chosenOption: "incident.fire-mir97.response.fight",
        alternativeOption: "incident.fire-mir97.response.evacuate",
        netEffect: 12,
        explanation: "scoring.decision.fastResponse",
      },
      costliestDecision: {
        sol: 7,
        station: "Incident Command",
        chosenOption: "incident.depress-mir97.response.ignoreLeak",
        alternativeOption: "incident.depress-mir97.response.patchHull",
        netEffect: -15,
        explanation: "scoring.decision.unaddressedIncident",
      },
    };

    const html = render(<ScoreCard score={scoreWithLabels} level="cadet" />);

    // Meta displays "Day", not "Sol"
    expect(html).toContain("Day 4");
    expect(html).toContain("Day 7");
    expect(html).not.toContain("Sol 4");
    expect(html).not.toContain("Sol 7");

    // Best decision resolved text
    expect(html).toContain("On day 4 you picked");
    expect(html).toContain("Try to put the fire out yourself.");
    expect(html).toContain("It worked better than");
    expect(html).toContain("Get everyone out and shut the door.");

    // Costliest decision resolved text
    expect(html).toContain("On day 7 you picked");
    expect(html).toContain("Don&#x27;t fix the leak.");
    expect(html).toContain("Patch the hole with spare parts. Costs some supplies and takes a while.");
    expect(html).toContain("would have cost the crew less.");
  });

  it("falls back to Cadet default phrases when options cannot be resolved or for zero cost", () => {
    useDial.getState().setLevel("cadet");
    const baseScore = getSampleScore();

    // 1. Unmatched / generic options with non-zero cost
    const scoreWithFallback = {
      ...baseScore,
      bestDecision: {
        sol: 2,
        station: "Incident Command",
        chosenOption: "mitigate",
        alternativeOption: "default",
        netEffect: 5,
        explanation: "scoring.decision.acceptableResponse",
      },
      costliestDecision: {
        sol: 5,
        station: "Incident Command",
        chosenOption: "default",
        alternativeOption: "mitigate",
        netEffect: -8,
        explanation: "scoring.decision.costlyResponse",
      },
    };

    const html = render(<ScoreCard score={scoreWithFallback} level="cadet" />);
    expect(html).toContain("On day 2 you made a great call.");
    expect(html).toContain(
      "On day 5 something cost the crew a lot of safety. Open the Black Box to see what happened.",
    );

    // 2. Zero costliest error
    const scoreWithZeroCost = {
      ...baseScore,
      costliestDecision: {
        sol: 1,
        station: "Incident Command",
        chosenOption: "nominal",
        alternativeOption: "none",
        netEffect: 0,
        explanation: "scoring.decision.noCostlyErrors",
      },
    };
    const htmlZero = render(<ScoreCard score={scoreWithZeroCost} level="cadet" />);
    expect(htmlZero).toContain("You made no big mistakes. Everything stayed in the safe zone.");

    // Reset dial level back to specialist for other tests
    useDial.getState().setLevel("specialist");
  });
});
