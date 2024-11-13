/**
 * "Green Thumb" — a dedicated greenhouse survival challenge.
 *
 * 14 days (336 hours) on the Moon at Marius Hills. 3 crew members relying on crop yields
 * to sustain outpost stores. Requires active management of the crop lighting schedule:
 * extended lighting accelerates growth to harvest fresh crops before mission end, while
 * balancing power against battery depletion during the lunar night.
 */
import type { Scenario } from "../../types.js";

export const greenThumb: Scenario = {
  id: "green-thumb",
  body: "moon",
  site: { name: "Marius Hills Greenhouse", latDeg: 14.2, lonDeg: -56.0 },
  primaryGoal: { id: "surviveFullDurationNoLoss", briefKey: "scenario.greenThumb.goal.primary" },
  stretchGoal: { id: "harvestAllCropTrays", briefKey: "scenario.greenThumb.goal.stretch" },
  scienceTargetPoints: 0,
  durationHours: 336,
  crewSize: 3,

  initial: {
    o2Kg: 40,
    co2Kg: 0.3,
    potableWaterKg: 600,
    foodDryMassKg: 35,
    batteryEnergyKwh: 2200,
    batteryCapacityKwh: 2500,
    habitatVolumeM3: 140,
    solarArrayAreaM2: 120,
    fissionReactorKwe: 0,
    shieldingGPerCm2: 9,
    cropTrays: [
      { crop: "lettuce", areaM2: 4, initialLightHours: 150 },
      { crop: "lettuce", areaM2: 4, initialLightHours: 150 },
    ],
  },

  systems: [
    { id: "powerDistribution", trl: 9, nominalPowerKw: 0.1, priority: 0, spares: 2 },
    { id: "lifeSupport", trl: 8, nominalPowerKw: 0.5, priority: 1, spares: 2 },
    { id: "co2Scrubber", trl: 8, nominalPowerKw: 0.8, priority: 2, spares: 2 },
    { id: "greenhouse", trl: 7, nominalPowerKw: 1.2, priority: 3, spares: 1 },
    { id: "thermalControl", trl: 8, nominalPowerKw: 4.5, priority: 4, spares: 1 },
    { id: "oxygenGenerator", trl: 7, nominalPowerKw: 0.8, priority: 5, spares: 1 },
    { id: "waterRecovery", trl: 7, nominalPowerKw: 0.4, priority: 6, spares: 1 },
    { id: "comms", trl: 9, nominalPowerKw: 0.2, priority: 7, spares: 1 },
  ],

  scripted: [
    { atHour: 72, hazard: "solarParticleEvent", durationHours: 12, magnitude: 0.4 },
  ],

  briefingKey: "scenario.greenThumb.briefing",
};

