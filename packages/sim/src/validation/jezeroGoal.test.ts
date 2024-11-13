/**
 * Permanent regression test for Jezero Outpost primary goal (M7.7 §4, A1).
 *
 * Verifies that:
 *  (a) 0 science -> primaryGoal is false, ending in partial / end.goalMissed
 *  (b) Target met, all crew alive, dose under limit -> primaryGoal is true
 *  (c) idleBot never reaches primaryGoal across seeds
 */
import { describe, expect, it } from "vitest";
import { radiation as radConstants } from "../data/constants.js";
import { jezeroOutpost } from "../data/scenarios/jezero.js";
import { idleBot } from "../engine/bots.js";
import type { TickContext } from "../engine/context.js";
import { checkGoal } from "../engine/goals.js";
import { determineOutcome } from "../engine/outcome.js";
import { runWithBot } from "../engine/runWithBot.js";
import { createInitialState } from "../engine/state.js";
import type { Params } from "../types.js";

describe("Jezero primary goal (missionGoalsMet)", () => {
  it("fails primaryGoal when science is 0 even if all crew are alive and healthy", () => {
    const params: Params = {
      scenarioId: "jezero-outpost",
      seed: 42,
      difficulty: "nominal",
      crewSize: jezeroOutpost.crewSize,
      missionStartIso: "2033-01-01",
    };
    const state = createInitialState(params, jezeroOutpost);
    state.science.points = 0;

    expect(checkGoal(jezeroOutpost.primaryGoal, state, jezeroOutpost)).toBe(false);

    state.hour = jezeroOutpost.durationHours;
    const ctx = {
      state,
      scenario: jezeroOutpost,
      params,
      log: { log: () => {} },
    } as unknown as TickContext;

    determineOutcome(ctx);
    expect(state.status).toBe("partial");
    expect(state.endReasonCode).toBe("end.goalMissed");
  });

  it("satisfies primaryGoal when science target is met, all crew alive, and career dose under limit", () => {
    const params: Params = {
      scenarioId: "jezero-outpost",
      seed: 42,
      difficulty: "nominal",
      crewSize: jezeroOutpost.crewSize,
      missionStartIso: "2033-01-01",
    };
    const state = createInitialState(params, jezeroOutpost);
    state.science.points = jezeroOutpost.scienceTargetPoints;
    for (const c of state.crew) {
      c.alive = true;
      c.cumulativeDoseMSv = radConstants.careerLimitMSv.value - 10;
    }

    expect(checkGoal(jezeroOutpost.primaryGoal, state, jezeroOutpost)).toBe(true);

    state.hour = jezeroOutpost.durationHours;
    const ctx = {
      state,
      scenario: jezeroOutpost,
      params,
      log: { log: () => {} },
    } as unknown as TickContext;

    determineOutcome(ctx);
    expect(state.status).toBe("success");
    expect(state.endReasonCode).toBe("end.missionComplete");
  });

  it("idleBot never reaches Jezero primaryGoal across test seeds", () => {
    const seeds = [1, 3, 5, 7, 9];
    for (const seed of seeds) {
      const params: Params = {
        scenarioId: "jezero-outpost",
        seed,
        difficulty: "nominal",
        crewSize: jezeroOutpost.crewSize,
        missionStartIso: "2033-01-01",
      };
      const state = createInitialState(params, jezeroOutpost);
      const result = runWithBot(state, params, jezeroOutpost, jezeroOutpost.durationHours, idleBot);
      expect(result.status).not.toBe("success");
      expect(checkGoal(jezeroOutpost.primaryGoal, result, jezeroOutpost)).toBe(false);
    }
  });
});
