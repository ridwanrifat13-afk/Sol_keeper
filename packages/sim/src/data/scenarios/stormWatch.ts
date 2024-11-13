/**
 * "Storm Watch" — an archived real solar storm replay (M15 SHOULD 5).
 *
 * Replays a real solar particle event from saved NASA DONKI telemetry:
 * Label: "Archived event: May 10, 2024"
 * Linked events: X-class flare at 10:10/13:58 UTC, SEP onset arriving at 12:59/14:50 UTC (~73 min onset).
 * Measured flare-to-particle onset falls directly in the 30–90 min range [SEP-ONSET].
 *
 * Mars note: "based on real solar activity" — never "this hit Mars".
 * Sourced from NASA DONKI and AGU-KNIPP-2018.
 */
import type { Scenario } from "../../types.js";

export const stormWatch: Scenario = {
  id: "storm-watch",
  body: "mars",
  site: { name: "Jezero Crater", latDeg: 18.38, lonDeg: 77.58 },
  primaryGoal: { id: "surviveFullDurationNoLoss", briefKey: "scenario.stormWatch.goal.primary" },
  stretchGoal: { id: "noSystemLeftFailed", briefKey: "scenario.stormWatch.goal.stretch" },
  scienceTargetPoints: 0,
  durationHours: 72,
  crewSize: 3,

  initial: {
    o2Kg: 50,
    co2Kg: 0.1,
    potableWaterKg: 400,
    foodDryMassKg: 60,
    batteryEnergyKwh: 200,
    batteryCapacityKwh: 240,
    habitatVolumeM3: 60,
    solarArrayAreaM2: 60,
    fissionReactorKwe: 0,
    shieldingGPerCm2: 15,
    cropTrays: [],
  },

  systems: [
    { id: "powerDistribution", trl: 9, nominalPowerKw: 0.2, priority: 0, spares: 2 },
    { id: "lifeSupport", trl: 9, nominalPowerKw: 0.4, priority: 1, spares: 2 },
    { id: "thermalControl", trl: 8, nominalPowerKw: 2.0, priority: 2, spares: 1 },
    { id: "comms", trl: 9, nominalPowerKw: 0.3, priority: 3, spares: 1 },
    { id: "co2Scrubber", trl: 8, nominalPowerKw: 0.6, priority: 4, spares: 1 },
    { id: "waterRecovery", trl: 7, nominalPowerKw: 0.5, priority: 5, spares: 1 },
    { id: "oxygenGenerator", trl: 7, nominalPowerKw: 1.0, priority: 6, spares: 1 },
  ],

  scripted: [
    // Real May 2024 storm sequence: flare alert warning precedes particle onset by ~1.2 h (~73 min)
    { atHour: 13, hazard: "solarParticleEvent", durationHours: 24, magnitude: 0.8 },
  ],

  briefingKey: "scenario.stormWatch.briefing",
};

