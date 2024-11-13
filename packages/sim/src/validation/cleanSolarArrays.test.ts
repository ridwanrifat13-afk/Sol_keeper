/**
 * Player request (M9.x): "quiet sol" interactivity — a routine, any-sol array-cleaning action,
 * not gated behind the one scripted dust-storm incident. Reuses environmentStage's own real
 * per-sol dust accumulation (power.dustLossPerSolFraction, NSSDC-FACTS) and
 * engine/incidents.ts's own real EVA-dose physics (applyCleaningEvaDose) — this only checks
 * that the new lever actually moves those real numbers, not a second, invented mechanic.
 */
import { describe, expect, it } from "vitest";
import { power } from "../data/constants.js";
import { applyInput, replayRun } from "../engine/replay.js";
import { createInitialState } from "../engine/state.js";
import { getScenario } from "../data/scenarios/index.js";
import { EventLogger } from "../engine/log.js";
import { Rng } from "../engine/rng.js";
import { tick } from "../engine/tick.js";
import { runFingerprint } from "../engine/fingerprint.js";
import type { Params } from "../types.js";
import type { TickContext } from "../engine/context.js";

const marsParams: Params = {
  scenarioId: "jezero-outpost",
  seed: 12345,
  crewSize: 4,
  missionStartIso: "2033-03-01",
  difficulty: "nominal",
};

const moonParams: Params = { ...marsParams, scenarioId: "first-light" };

function buildCtx(params: Params): TickContext {
  const scenario = getScenario(params.scenarioId);
  const state = createInitialState(params);
  // Give the dust obscuration a real, nonzero starting value to clean, and confirm the
  // floor/removable split behaves as documented.
  state.environment.dustObscurationFraction = 0.2;
  state.environment.dustObscurationFloorFraction = 0.05;
  return {
    state,
    params,
    scenario,
    rng: new Rng(state.rng),
    log: new EventLogger(state.log, state.hour),
    dtHours: 1,
  };
}

describe("cleanSolarArrays input", () => {
  it("clears dust obscuration down to the permanent floor, not to zero", () => {
    const ctx = buildCtx(marsParams);
    applyInput(ctx, { kind: "cleanSolarArrays" });
    expect(ctx.state.environment.dustObscurationFraction).toBe(0.05);
  });

  it("spends the real, sourced crew-hours cost", () => {
    const ctx = buildCtx(marsParams);
    const before = ctx.state.crewHours.spentTodayHours;
    applyInput(ctx, { kind: "cleanSolarArrays" });
    expect(ctx.state.crewHours.spentTodayHours - before).toBe(power.routineArrayCleaningCrewHours.value);
  });

  it("applies a real, nonzero EVA radiation dose to exactly one living crew member", () => {
    const ctx = buildCtx(marsParams);
    const dosesBefore = ctx.state.crew.map((c) => c.cumulativeDoseMSv);
    applyInput(ctx, { kind: "cleanSolarArrays" });
    const dosesAfter = ctx.state.crew.map((c) => c.cumulativeDoseMSv);
    const increased = dosesAfter.filter((d, i) => d > (dosesBefore[i] ?? 0));
    expect(increased.length).toBe(1);
  });

  it("logs a real decision entry", () => {
    const ctx = buildCtx(marsParams);
    applyInput(ctx, { kind: "cleanSolarArrays" });
    expect(ctx.state.log.some((e) => e.code === "decision.cleanSolarArrays.performed")).toBe(true);
  });

  it("declines, with no effect, when today's crew-hours budget can't cover it", () => {
    const ctx = buildCtx(marsParams);
    ctx.state.crewHours.spentTodayHours = ctx.state.crewHours.budgetTodayHours; // nothing left
    const before = ctx.state.environment.dustObscurationFraction;
    applyInput(ctx, { kind: "cleanSolarArrays" });
    expect(ctx.state.environment.dustObscurationFraction).toBe(before);
    expect(ctx.state.log.some((e) => e.code === "decision.cleanSolarArrays.insufficientTime")).toBe(true);
  });

  it("is a real no-op on a Moon scenario — the Moon has no atmosphere to carry dust", () => {
    const ctx = buildCtx(moonParams);
    const before = ctx.state.environment.dustObscurationFraction;
    const spentBefore = ctx.state.crewHours.spentTodayHours;
    applyInput(ctx, { kind: "cleanSolarArrays" });
    expect(ctx.state.environment.dustObscurationFraction).toBe(before);
    expect(ctx.state.crewHours.spentTodayHours).toBe(spentBefore);
  });

  it("cleaning changes the final-state hash on a dust-storm seed", () => {
    const scenario = getScenario(marsParams.scenarioId);

    // Run A: Mars Jezero Outpost through hour 240 (covers the scripted dust storm starting at hour 200).
    // No cleaning performed.
    const stateA = createInitialState(marsParams, scenario);
    for (let h = 0; h < 240 && stateA.status === "running"; h++) {
      tick(stateA, marsParams, scenario);
    }

    // Run B: Identical seed and scenario, but player cleans the solar panels at hour 215 during the storm.
    const stateB = createInitialState(marsParams, scenario);
    for (let h = 0; h < 215 && stateB.status === "running"; h++) {
      tick(stateB, marsParams, scenario);
    }
    // Verify dust is elevated above permanent floor before cleaning
    expect(stateB.environment.dustObscurationFraction).toBeGreaterThan(0.08);

    const ctxB: TickContext = {
      state: stateB,
      params: marsParams,
      scenario,
      rng: new Rng(stateB.rng),
      log: new EventLogger(stateB.log, stateB.hour),
      dtHours: 1,
    };
    applyInput(ctxB, { kind: "cleanSolarArrays" });

    // Continue running through hour 240
    for (let h = 215; h < 240 && stateB.status === "running"; h++) {
      tick(stateB, marsParams, scenario);
    }

    const hashA = runFingerprint(stateA);
    const hashB = runFingerprint(stateB);
    expect(hashB).not.toBe(hashA);

    // Verify replay reproducibility: replaying Run B's decision log produces the exact same hash
    const replayedB = replayRun(
      marsParams,
      scenario,
      [{ hour: 215, input: { kind: "cleanSolarArrays" } }],
      240,
    );
    expect(runFingerprint(replayedB)).toBe(hashB);
  });
});
