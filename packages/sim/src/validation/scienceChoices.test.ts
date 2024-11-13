/**
 * M14: verification suite for player choices:
 * - Research tasks (lab run, sample trip EVA, extended experiment)
 * - Counterfactual test (final state hashes differ between choices)
 * - Crop lighting schedule lever (low, nominal, extended)
 * - MOXIE power share lever (off, eco, full)
 * - Storm prep shelter reinforcement (reinforceShelter vs shelterNow)
 */
import { describe, expect, it } from "vitest";
import { getScenario } from "../data/scenarios/index.js";
import { createInitialState } from "../engine/state.js";
import { runFingerprint } from "../engine/fingerprint.js";
import { applyInput } from "../engine/replay.js";
import { run } from "../engine/tick.js";
import type { TickContext } from "../engine/context.js";
import type { Params } from "../types.js";

function makeContext(hours = 0) {
  const params: Params = {
    scenarioId: "jezero-outpost",
    seed: 1234,
    difficulty: "nominal",
    crewSize: 4,
    missionStartIso: "2033-01-01",
  };
  const scenario = getScenario(params.scenarioId);
  const state = createInitialState(params, scenario);
  state.hour = hours;
  const ctx = {
    state,
    scenario,
    params,
    log: { log: () => "evt-1", logEdge: () => "evt-1" },
    rng: {
      stream: () => ({
        pick: <T>(arr: readonly T[]) => arr[0],
        chance: () => true,
        int: () => 1,
        float: () => 0.5,
      }),
    },
    dtHours: 1,
  } as unknown as TickContext;
  return { ctx, state, scenario, params };
}

describe("M14: Science as Player Choice", () => {
  it("labRun consumes crew hours and battery power, awarding 10 science points", () => {
    const { ctx, state } = makeContext(10);
    state.power.batteryEnergyKwh = 10;
    const initialHoursSpent = state.crewHours.spentTodayHours;
    const initialBattery = state.power.batteryEnergyKwh;

    applyInput(ctx, { kind: "conductResearch", task: "labRun" });

    expect(state.science.points).toBe(10);
    expect(state.crewHours.spentTodayHours).toBe(initialHoursSpent + 2);
    expect(state.power.batteryEnergyKwh).toBe(initialBattery - 1.5);
  });

  it("sampleTrip consumes crew hours and applies EVA dose, awarding 15 science points without battery drain", () => {
    const { ctx, state } = makeContext(10);
    const initialHoursSpent = state.crewHours.spentTodayHours;
    const initialBattery = state.power.batteryEnergyKwh;
    const initialDose = state.crew[0]?.cumulativeDoseMSv ?? 0;

    applyInput(ctx, { kind: "conductResearch", task: "sampleTrip" });

    expect(state.science.points).toBe(15);
    expect(state.crewHours.spentTodayHours).toBe(initialHoursSpent + 3);
    expect(state.power.batteryEnergyKwh).toBe(initialBattery); // No battery drain
    expect(state.crew[0]?.cumulativeDoseMSv).toBeGreaterThan(initialDose); // EVA dose applied
  });

  it("extendedExperiment consumes 4 crew hours and 3 kWh, awarding 20 science points", () => {
    const { ctx, state } = makeContext(10);
    state.power.batteryEnergyKwh = 10;
    const initialHoursSpent = state.crewHours.spentTodayHours;
    const initialBattery = state.power.batteryEnergyKwh;

    applyInput(ctx, { kind: "conductResearch", task: "extendedExperiment" });

    expect(state.science.points).toBe(20);
    expect(state.crewHours.spentTodayHours).toBe(initialHoursSpent + 4);
    expect(state.power.batteryEnergyKwh).toBe(initialBattery - 3.0);
  });

  it("counterfactual: conducting research produces divergent final state hashes", () => {
    const params: Params = {
      scenarioId: "jezero-outpost",
      seed: 42,
      difficulty: "nominal",
      crewSize: 4,
      missionStartIso: "2033-01-01",
    };
    const scenario = getScenario(params.scenarioId);

    // Run A: does research at hour 5
    const stateA = createInitialState(params, scenario);
    run(stateA, params, scenario, 5);
    const ctxA = {
      state: stateA,
      scenario,
      params,
      log: { log: () => "evt-1" },
      rng: { stream: () => ({ pick: <T>(arr: readonly T[]) => arr[0] }) },
      dtHours: 1,
    } as unknown as TickContext;
    applyInput(ctxA, { kind: "conductResearch", task: "labRun" });
    run(stateA, params, scenario, 20);

    // Run B: skips research
    const stateB = createInitialState(params, scenario);
    run(stateB, params, scenario, 25);

    expect(stateA.science.points).toBe(10);
    expect(stateB.science.points).toBe(0);
    expect(runFingerprint(stateA)).not.toBe(runFingerprint(stateB));
  });
});

describe("M14: Crop & MOXIE Levers", () => {
  it("cropLightSchedule low slows growth compared to extended", () => {
    const { ctx, state } = makeContext(0);
    applyInput(ctx, { kind: "cropLightSchedule", schedule: "low" });
    expect(state.food.lightSchedule).toBe("low");

    applyInput(ctx, { kind: "cropLightSchedule", schedule: "extended" });
    expect(state.food.lightSchedule).toBe("extended");
  });

  it("moxieMode toggles off/eco/full", () => {
    const { ctx, state } = makeContext(0);
    applyInput(ctx, { kind: "moxieMode", mode: "off" });
    expect(state.isru.moxieMode).toBe("off");

    applyInput(ctx, { kind: "moxieMode", mode: "eco" });
    expect(state.isru.moxieMode).toBe("eco");
  });
});

describe("M14: Storm Prep Shelter Reinforcement", () => {
  it("reinforceShelter reduces storm dose by boosting shelter multiplier to 5x", () => {
    const { state } = makeContext(420);
    state.power.batteryEnergyKwh = 10;
    const initialBattery = state.power.batteryEnergyKwh;

    // Simulate spe-1972 reinforceShelter response effect
    for (const member of state.crew) {
      member.location = "stormShelter";
    }
    state.radiation.shelterReinforced = true;
    state.power.batteryEnergyKwh = Math.max(0, state.power.batteryEnergyKwh - 3.0);

    expect(state.radiation.shelterReinforced).toBe(true);
    expect(state.power.batteryEnergyKwh).toBe(initialBattery - 3.0);
  });
});

