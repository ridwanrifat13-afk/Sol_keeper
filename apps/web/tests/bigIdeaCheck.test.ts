import { describe, expect, it, beforeEach } from "vitest";
import {
  BIG_IDEA_CHECKS,
  getBigIdeaForScenario,
  getStoredBigIdeaAnswer,
  saveStoredBigIdeaAnswer,
} from "../src/data/bigIdeas.js";
import {
  loadPlaytestTelemetry,
  recordBigIdeaAnswer,
  savePlaytestTelemetry,
} from "../src/store/playtest.js";

describe("M16 MUST 1: Big Idea Checks per Ladder Mission", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defines Big Idea checks for all four ladder missions", () => {
    const keys = ["firstLight", "stormWarning", "greenThumb", "helloEarth"] as const;
    for (const key of keys) {
      const check = BIG_IDEA_CHECKS[key];
      expect(check).toBeDefined();
      expect(check.idea).toBeTruthy();
      expect(check.detail).toBeTruthy();
      expect(check.question).toBeTruthy();
      expect(check.rightFeedback).toBeTruthy();
      expect(check.wrongFeedback).toBeTruthy();
      expect(["A", "B", "C"]).toContain(check.correct);

      // Options must be unshuffled in A, B, C order
      const optionKeys = Object.keys(check.options);
      expect(optionKeys).toEqual(["A", "B", "C"]);
      expect(check.options.A).toBeTruthy();
      expect(check.options.B).toBeTruthy();
      expect(check.options.C).toBeTruthy();
    }
  });

  it("resolves dynamic constants placeholders correctly without manual hardcoding", () => {
    const firstLight = BIG_IDEA_CHECKS.firstLight;
    expect(firstLight.detail).toContain("354 hours");
    expect(firstLight.detail).not.toContain("{nightHours}");

    const greenThumb = BIG_IDEA_CHECKS.greenThumb;
    expect(greenThumb.detail).toContain("1.2 kW");
    expect(greenThumb.detail).not.toContain("{greenhouseKw}");

    const helloEarth = BIG_IDEA_CHECKS.helloEarth;
    expect(helloEarth.detail).toContain("3 to 22 minutes");
    expect(helloEarth.detail).not.toContain("{lightTimeMinMin}");
    expect(helloEarth.detail).not.toContain("{lightTimeMaxMin}");
  });

  it("maps scenario IDs to the respective Big Idea check", () => {
    expect(getBigIdeaForScenario("first-light")?.key).toBe("firstLight");
    expect(getBigIdeaForScenario("storm-watch")?.key).toBe("stormWarning");
    expect(getBigIdeaForScenario("crisis-spe-1972")?.key).toBe("stormWarning");
    expect(getBigIdeaForScenario("green-thumb")?.key).toBe("greenThumb");
    expect(getBigIdeaForScenario("jezero-outpost")?.key).toBe("helloEarth");
  });

  it("stores and retrieves answers safely via localStorage", () => {
    expect(getStoredBigIdeaAnswer("firstLight")).toBeNull();
    saveStoredBigIdeaAnswer("firstLight", "B");
    expect(getStoredBigIdeaAnswer("firstLight")).toBe("B");
  });

  it("records first-try accuracy with ?playtest=1 and preserves the first attempt", () => {
    // Configure globalThis.location.search to ?playtest=1
    Object.defineProperty(globalThis, "location", {
      value: { search: "?playtest=1" },
      writable: true,
      configurable: true,
    });

    savePlaytestTelemetry({
      sessionStartedAt: Date.now(),
      retriesCount: 0,
      bigIdeaAnswers: {},
    });

    // First try correct
    recordBigIdeaAnswer("firstLight", true);
    let telemetry = loadPlaytestTelemetry();
    expect(telemetry.bigIdeaAnswers["firstLight"]?.correctFirstTry).toBe(true);

    // Subsequent attempt does NOT overwrite the first try
    recordBigIdeaAnswer("firstLight", false);
    telemetry = loadPlaytestTelemetry();
    expect(telemetry.bigIdeaAnswers["firstLight"]?.correctFirstTry).toBe(true);

    // Another check first try incorrect
    recordBigIdeaAnswer("stormWarning", false);
    telemetry = loadPlaytestTelemetry();
    expect(telemetry.bigIdeaAnswers["stormWarning"]?.correctFirstTry).toBe(false);
  });
});
