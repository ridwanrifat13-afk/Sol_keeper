/**
 * M7.7 §1: the real, pooled, per-day crew-hours budget and its deferred-work queue —
 * replacing `crewHoursCost` fields that docs/DECISION_AUDIT.md found declared everywhere and
 * enforced nowhere. One pool across the living crew (health/morale-scaled, the same pattern
 * `models/crew.ts`'s own — until now dead — `availableCrewHours()` already used, finally
 * wired in as the brief's single source of truth), reset every 24 Earth-hours (BVAD-2022's
 * crewtime figures are stated per Earth-CM-day, not per sol — the same reasoning
 * `units.ts`'s `perDayToPerHour` already uses everywhere else).
 */
import { crew as crewConstants, lifeSupport, management, science as scienceConstants } from "../data/constants.js";
import { availableCrewHours } from "../models/crew.js";
import { clamp } from "../units.js";
import type { TickContext } from "./context.js";
import { INCIDENT_CATALOG, resolveResponseAttempt } from "./incidents.js";

const round = (x: number): number => Math.round(x * 100) / 100;

/** Pays down the queue FIFO from whatever's left of today's budget, applying (via
 *  `resolveResponseAttempt`, so a queued item goes through the same spares/success-roll
 *  logic a same-hour response would) any item that finishes. */
function payDownQueue(ctx: TickContext): void {
  const { state } = ctx;

  for (const item of state.crewHours.queue) {
    if (item.hoursRemaining <= 0) continue;
    const remaining = state.crewHours.budgetTodayHours - state.crewHours.spentTodayHours;
    if (remaining <= 0) break;
    const pay = Math.min(remaining, item.hoursRemaining);
    item.hoursRemaining = round(item.hoursRemaining - pay);
    state.crewHours.spentTodayHours = round(state.crewHours.spentTodayHours + pay);
  }

  const completed = state.crewHours.queue.filter((item) => item.hoursRemaining <= 0);
  if (completed.length === 0) return;

  state.crewHours.queue = state.crewHours.queue.filter((item) => item.hoursRemaining > 0);
  for (const item of completed) {
    const incident = state.activeIncidents.find((i) => i.id === item.incidentId);
    const def = INCIDENT_CATALOG.find((d) => d.id === item.definitionId);
    if (incident === undefined || def === undefined) continue;
    resolveResponseAttempt(ctx, def, incident, item.responseId);
  }
}

/** Player request: Incident Command's print-a-spare lever — resolves any `PrintJob` whose
 *  real wall-clock print time (management.printSpareWallClockHours) has elapsed. Unlike
 *  `payDownQueue`, nothing here touches the crew-hours budget: the only cost was paid up
 *  front when the job was queued (engine/replay.ts's "printSpare" case). */
function resolvePrintQueue(ctx: TickContext): void {
  const { state, log } = ctx;
  const ready = state.printQueue.filter((job) => state.hour >= job.readyAtHour);
  if (ready.length === 0) return;

  state.printQueue = state.printQueue.filter((job) => state.hour < job.readyAtHour);
  for (const job of ready) {
    const system = state.systems[job.systemId];
    if (system === undefined) continue;
    system.spares += management.printSpareYieldCount.value;
    log.log({
      kind: "decision",
      severity: "info",
      code: "decision.printSpare.completed",
      system: job.systemId,
      data: { spares: system.spares },
    });
  }
}

/** M9.x (player request, batch 2): applies real fatigue for the day just ending, before its
 *  own budget/spent figures are overwritten by the next day's reset. Reads
 *  crew.overtimeFatiguePerHourAboveCeiling (BVAD-2022, already sourced and declared, never
 *  read by any model until now) against however many hours were actually spent past that
 *  day's own un-boosted ceiling — authorizing overtime that goes unused costs nothing; only
 *  hours actually worked above the ordinary budget do. */
function applyOvertimeFatigue(ctx: TickContext): void {
  const { state } = ctx;
  if (!state.crewHours.overtimeAuthorized) return;

  const excessHours = Math.max(
    0,
    state.crewHours.spentTodayHours - state.crewHours.unboostedBudgetTodayHours,
  );
  if (excessHours <= 0) return;

  const fatigueGain = crewConstants.overtimeFatiguePerHourAboveCeiling.value * excessHours;
  for (const member of state.crew) {
    if (!member.alive) continue;
    member.fatigueFraction = clamp(member.fatigueFraction + fatigueGain, 0, 1);
  }
}

export function crewHoursStage(ctx: TickContext): void {
  const { state } = ctx;

  // Day 0's budget is already set by engine/state.ts's createInitialState; only reset on
  // later boundaries so hour 0 isn't double-applied.
  if (state.hour > 0 && state.hour % 24 === 0) {
    applyOvertimeFatigue(ctx);
    const baseline = availableCrewHours(ctx);
    state.crewHours.unboostedBudgetTodayHours = baseline;
    state.crewHours.budgetTodayHours = state.crewHours.overtimeAuthorized
      ? baseline * crewConstants.overtimeCeilingFractionOfAverage.value
      : baseline;
    // M9.x & M14: daily recurring commitments (Brine Processor, farming upkeep, ISRU oversight)
    // are pre-spent the moment the new day's budget exists.
    let preSpent = 0;
    if (state.water.reclamationMode === "brineProcessor") {
      preSpent += lifeSupport.brineProcessorCrewHoursPerDay.value;
    }
    const greenhouse = state.systems.greenhouse;
    if (greenhouse !== undefined && greenhouse.operational) {
      preSpent += scienceConstants.farmingCrewHoursPerTrayPerDay.value * state.food.trays.length;
    }
    const moxie = state.systems.moxie;
    if (moxie !== undefined && moxie.operational && (state.isru.moxieMode ?? "full") !== "off") {
      preSpent += scienceConstants.isruCrewHoursPerDay.value;
    }
    state.crewHours.spentTodayHours = Math.min(state.crewHours.budgetTodayHours, round(preSpent));
  }

  payDownQueue(ctx);
  resolvePrintQueue(ctx);
}
