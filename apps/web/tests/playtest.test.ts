import { beforeEach, describe, expect, it } from "vitest";
import {
  exportPlaytestJson,
  isPlaytestActive,
  loadPlaytestTelemetry,
  recordBigIdeaAnswer,
  recordFirstDecision,
  recordRetry,
} from "../src/store/playtest.js";

describe("Playtest Telemetry (M15 MUST 4)", () => {
  beforeEach(() => {
    localStorage.clear();
    // Configure globalThis.location.search to ?playtest=1 for test cases
    Object.defineProperty(globalThis, "location", {
      value: { search: "?playtest=1" },
      writable: true,
      configurable: true,
    });
  });

  it("detects when playtest mode is active via URL query parameter", () => {
    expect(isPlaytestActive()).toBe(true);

    Object.defineProperty(globalThis, "location", {
      value: { search: "" },
      writable: true,
      configurable: true,
    });
    expect(isPlaytestActive()).toBe(false);
  });

  it("records time-to-first-decision and does not overwrite subsequent decisions", () => {
    const initial = loadPlaytestTelemetry();
    expect(initial.timeToFirstDecisionMs).toBeUndefined();

    recordFirstDecision();
    const afterFirst = loadPlaytestTelemetry();
    expect(afterFirst.timeToFirstDecisionMs).toBeDefined();
    expect(typeof afterFirst.timeToFirstDecisionMs).toBe("number");

    const recordedTime = afterFirst.timeToFirstDecisionMs;
    // Attempt second decision
    recordFirstDecision();
    const afterSecond = loadPlaytestTelemetry();
    expect(afterSecond.timeToFirstDecisionMs).toBe(recordedTime);
  });

  it("tracks retries count correctly", () => {
    expect(loadPlaytestTelemetry().retriesCount).toBe(0);

    recordRetry();
    expect(loadPlaytestTelemetry().retriesCount).toBe(1);

    recordRetry();
    recordRetry();
    expect(loadPlaytestTelemetry().retriesCount).toBe(3);
  });

  it("records big idea check answers preserving first-try outcome", () => {
    recordBigIdeaAnswer("radiation-shielding-check", true);
    let state = loadPlaytestTelemetry();
    expect(state.bigIdeaAnswers["radiation-shielding-check"]?.correctFirstTry).toBe(true);

    // If user answers again incorrectly later, first-try outcome must stay true
    recordBigIdeaAnswer("radiation-shielding-check", false);
    state = loadPlaytestTelemetry();
    expect(state.bigIdeaAnswers["radiation-shielding-check"]?.correctFirstTry).toBe(true);

    // Another check answered wrong on first try
    recordBigIdeaAnswer("co2-scrubber-check", false);
    state = loadPlaytestTelemetry();
    expect(state.bigIdeaAnswers["co2-scrubber-check"]?.correctFirstTry).toBe(false);
  });

  it("exports valid JSON for local download with zero network calls", () => {
    recordRetry();
    recordFirstDecision();
    recordBigIdeaAnswer("check-1", true);

    const json = exportPlaytestJson();
    const parsed = JSON.parse(json) as Record<string, unknown>;

    expect(parsed["retriesCount"]).toBe(1);
    expect(parsed["timeToFirstDecisionMs"]).toBeDefined();
    expect(parsed["bigIdeaAnswers"]).toBeDefined();
  });
});
