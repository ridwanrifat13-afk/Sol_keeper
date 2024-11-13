/**
 * In-situ resource utilisation — MOXIE.
 *
 * Runs between the water and food stages: it consumes power like the water loop does, and
 * produces oxygen, but unlike electrolysis it costs no water. That trade is the point.
 *
 * Scale reference for players: MOXIE produced 122 g of oxygen across the entire
 * Perseverance mission, while one crew member breathes 840 g every day. It takes about
 * 2.9 MOXIEs running at peak just to keep one person alive.
 */
import { crew as crewConstants, habitat, lifeSupport } from "../data/constants.js";
import type { TickContext } from "../engine/context.js";
import { gramsToKg, kgToGrams, perDayToPerHour } from "../units.js";

/** One crew member's oxygen demand, in grams per hour. */
export function hourlyCrewO2Grams(): number {
  return kgToGrams(perDayToPerHour(crewConstants.o2ConsumptionKgPerCrewDay.value));
}

/** How many MOXIE units, at peak rate, one crew member's oxygen demand requires. */
export function moxiesPerCrewMember(): number {
  return hourlyCrewO2Grams() / lifeSupport.moxieO2GramsPerHourPeak.value;
}

export function isruStage(ctx: TickContext): void {
  const { state, log } = ctx;
  const moxie = state.systems.moxie;

  // MOXIE consumes the Martian CO2 atmosphere, which the Moon does not have — a Moon
  // scenario correctly omits it from its system list entirely, rather than including a
  // system that could never really fly there, so `moxie` is `undefined` here, not merely
  // unpowered.
  if (moxie === undefined) {
    state.isru.moxieRunning = false;
    return;
  }

  // Like the electrolyser, MOXIE regulates against the cabin set point rather than running
  // continuously — there is no sense spending power to push the habitat into fire risk.
  // M14: respects moxieMode lever ("off" | "eco" | "full").
  const mode = state.isru.moxieMode ?? "full";
  const needsOxygen =
    state.atmosphere.o2PartialPressureMmHg < habitat.targetO2PartialPressureMmHg.value;
  const running = moxie.operational && moxie.poweredThisHour && needsOxygen && mode !== "off";
  state.isru.moxieRunning = running;
  if (!running) return;

  const modeMultiplier = mode === "eco" ? 0.5 : 1.0;
  const producedKg =
    gramsToKg(lifeSupport.moxieO2GramsPerHourNominal.value) *
    lifeSupport.moxieO2PurityFraction.value *
    modeMultiplier *
    ctx.dtHours;

  state.atmosphere.o2Kg += producedKg;
  state.isru.moxieO2ProducedKg += producedKg;
  // M14: MOXIE oxygen gives no science points — science is an active player choice.

  // Log the first time the outpost passes the real MOXIE's whole-mission total.
  const totalG = state.isru.moxieO2ProducedKg * 1000;
  const milestoneG = lifeSupport.moxieTotalProducedGrams.value;
  if (totalG >= milestoneG && totalG - producedKg * 1000 < milestoneG) {
    log.log({
      kind: "milestone",
      severity: "info",
      code: "isru.passedMoxieMissionTotal",
      system: "moxie",
      data: { producedG: Math.round(totalG), moxieMissionTotalG: milestoneG },
    });
  }
}
