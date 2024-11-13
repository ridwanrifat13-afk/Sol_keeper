import { describe, expect, it, beforeEach } from "vitest";
import {
  applyInput,
  createRun,
  getScenario,
  replayRun,
  runFingerprint,
  tick,
  EventLogger,
  Rng,
  type Params,
  type RecordedInput,
  type TickContext,
} from "@sol-keeper/sim";
import { useRun } from "../src/store/run.js";
import { getMissionOfTheDayInfo } from "../src/components/MissionOfTheDayCard.js";

const TEST_PARAMS: Params = {
  scenarioId: "jezero-outpost",
  seed: 42,
  crewSize: 4,
  missionStartIso: "2033-03-01",
  difficulty: "nominal",
};

describe("M16 MUST 2: Try Again (Rewind to Decision)", () => {
  beforeEach(() => {
    useRun.getState().reset(TEST_PARAMS);
  });

  it("test (iii): a recorded run replays to an identical hash", () => {
    const scenario = getScenario(TEST_PARAMS.scenarioId);
    const state = createRun(TEST_PARAMS, scenario);
    const recordedInputs: RecordedInput[] = [];

    // Simulate 10 hours of play
    for (let h = 0; h < 10; h++) {
      tick(state, TEST_PARAMS, scenario);
      if (h === 4) {
        // Player action at hour 4: set comms priority to science
        const input = { kind: "commsPriority" as const, priority: "science" as const };
        const ctx: TickContext = {
          state,
          params: TEST_PARAMS,
          scenario,
          rng: new Rng(state.rng),
          log: new EventLogger(state.log, state.hour),
          dtHours: 1,
        };
        applyInput(ctx, input);
        recordedInputs.push({ hour: state.hour, input });
      }
      if (h === 7) {
        // Player action at hour 7: clean solar arrays
        const input = { kind: "cleanSolarArrays" as const };
        const ctx: TickContext = {
          state,
          params: TEST_PARAMS,
          scenario,
          rng: new Rng(state.rng),
          log: new EventLogger(state.log, state.hour),
          dtHours: 1,
        };
        applyInput(ctx, input);
        recordedInputs.push({ hour: state.hour, input });
      }
    }

    const originalFingerprint = runFingerprint(state);

    // Replay with replayRun
    const replayedState = replayRun(TEST_PARAMS, scenario, recordedInputs, 10);
    const replayedFingerprint = runFingerprint(replayedState);

    expect(replayedFingerprint).toBe(originalFingerprint);
  });

  it("test (i): rewinding and choosing the SAME option yields an identical final-state hash", () => {
    // Run store up to 10 hours with 2 decisions
    const store = useRun.getState();
    store.step(4);
    store.setCommsPriority("science");
    store.step(3); // reaches hour 7
    store.cleanSolarArrays();
    store.step(3); // reaches hour 10

    const finalStateA = { ...useRun.getState().state };
    const hashA = runFingerprint(finalStateA);
    const recordedInputs = [...useRun.getState().inputLog];
    expect(recordedInputs.length).toBe(2);

    // Rewind to decision index 1 (cleanSolarArrays at hour 7)
    useRun.getState().rewindToDecision(1);
    expect(useRun.getState().isSecondTry).toBe(true);
    expect(useRun.getState().inputLog.length).toBe(1);
    expect(useRun.getState().state.hour).toBe(7);

    // Choose the SAME option again
    useRun.getState().cleanSolarArrays();
    useRun.getState().step(3); // reaches hour 10

    const finalStateB = { ...useRun.getState().state };
    const hashB = runFingerprint(finalStateB);

    expect(hashB).toBe(hashA);
  });

  it("test (ii): choosing a DIFFERENT option diverges", () => {
    useRun.getState().reset(TEST_PARAMS);
    const store = useRun.getState();
    store.step(4);
    store.setCommsPriority("science");
    store.step(6); // reaches hour 10

    const finalStateOriginal = { ...useRun.getState().state };
    const hashOriginal = runFingerprint(finalStateOriginal);

    // Rewind to decision index 0 (hour 4)
    useRun.getState().rewindToDecision(0);
    expect(useRun.getState().isSecondTry).toBe(true);
    expect(useRun.getState().state.hour).toBe(4);

    // Choose a DIFFERENT option: comms priority personal instead of science
    useRun.getState().setCommsPriority("personal");
    useRun.getState().step(6); // reaches hour 10

    const finalStateDiverged = { ...useRun.getState().state };
    const hashDiverged = runFingerprint(finalStateDiverged);

    expect(hashDiverged).not.toBe(hashOriginal);
  });

  it("sets isSecondTry: true on rewind, and resets to false on fresh reset", () => {
    useRun.getState().step(2);
    useRun.getState().setCommsPriority("personal");
    expect(useRun.getState().isSecondTry).toBe(false);

    useRun.getState().rewindToDecision(0);
    expect(useRun.getState().isSecondTry).toBe(true);

    useRun.getState().reset(TEST_PARAMS);
    expect(useRun.getState().isSecondTry).toBe(false);
  });
});

describe("M16 SHOULD 3: Mission of the Day", () => {
  it("derives deterministic UTC date seed and valid ladder mission scenario", () => {
    const info = getMissionOfTheDayInfo();
    expect(info.utcDateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(info.utcSeed).toBeGreaterThan(20240101);
    expect(["first-light", "storm-watch", "green-thumb", "jezero-outpost"]).toContain(
      info.scenarioId,
    );
  });

  it("toggles isMissionOfTheDay on the store", () => {
    expect(useRun.getState().isMissionOfTheDay).toBe(false);
    useRun.getState().setMissionOfTheDay(true);
    expect(useRun.getState().isMissionOfTheDay).toBe(true);
    useRun.getState().reset(TEST_PARAMS);
    expect(useRun.getState().isMissionOfTheDay).toBe(false);
  });
});

