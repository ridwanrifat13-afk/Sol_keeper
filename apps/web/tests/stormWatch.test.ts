import { describe, expect, it } from "vitest";
import { createInitialState, getScenario, tick, type Scenario } from "@sol-keeper/sim";
import { SCENARIO_LABELS } from "../src/dial/scenarioLabels.js";
import enLocales from "../src/i18n/locales/en.json" with { type: "json" };

describe("Storm Watch Scenario (M15 SHOULD 5)", () => {
  it("registers storm-watch scenario with proper physics and metadata", () => {
    const scenario: Scenario = getScenario("storm-watch");
    expect(scenario.id).toBe("storm-watch");
    expect(scenario.body).toBe("mars");
    expect(scenario.durationHours).toBe(72);
    expect(scenario.crewSize).toBe(3);
    expect(scenario.scripted.length).toBeGreaterThanOrEqual(1);

    const spe = scenario.scripted.find((s) => s.hazard === "solarParticleEvent");
    expect(spe).toBeDefined();
    expect(spe?.atHour).toBe(13);
  });

  it("labels the event as an archived historical event with date", () => {
    const meta = SCENARIO_LABELS["storm-watch"];
    expect(meta).toBeDefined();
    expect(meta.hint).toContain("Archived event: May 10, 2024");
    expect(meta.hint).toContain("based on real solar activity");
  });

  it("strictly enforces Mars copy rules: says 'based on real solar activity' and NEVER 'this hit Mars'", () => {
    const enScenario = enLocales.scenario as Record<string, { briefing?: { specialist?: string; cadet?: string } }>;
    const briefing = enScenario["stormWatch"]?.briefing;
    expect(briefing).toBeDefined();

    const specialistText = briefing?.specialist ?? "";
    const cadetText = briefing?.cadet ?? "";

    expect(specialistText).toContain("based on real solar activity");
    expect(cadetText).toContain("based on real solar activity");

    expect(specialistText).not.toContain("this hit Mars");
    expect(cadetText).not.toContain("this hit Mars");
  });

  it("runs initial ticks through the storm watch scenario without errors", () => {
    const scenario = getScenario("storm-watch");
    const params = {
      scenarioId: "storm-watch" as const,
      difficulty: "nominal" as const,
      crewSize: 3,
      seed: 42,
      missionStartIso: "2026-10-01T00:00:00.000Z",
    };
    const state = createInitialState(params, scenario);

    expect(state.hour).toBe(0);
    expect(state.crew.length).toBe(3);
    expect(state.crew.every((c) => c.alive)).toBe(true);

    // Run tick 1
    const next = tick(state, params, scenario);
    expect(next.hour).toBe(1);
    expect(next.crew.every((c) => c.alive)).toBe(true);
  });
});
