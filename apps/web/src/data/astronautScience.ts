import astronautScienceSnapshot from "../../public/snapshots/astronaut-science.json" with { type: "json" };

export interface AstronautScienceCardData {
  readonly id: string;
  readonly osdId?: string;
  readonly osdIds?: readonly string[];
  readonly instrument?: string;
  readonly title: string;
  readonly plainFinding: string;
  readonly caveat: string;
  readonly gameSystem: "Crops" | "Radiation" | "Crew Welfare";
  readonly missionLadderStep: string;
  readonly url: string;
  readonly accessedOn: string;
  readonly archivedOn: string;
  readonly quantity?: string;
  readonly unit?: string;
  readonly dataStart?: string;
  readonly dataEnd?: string;
  readonly verified: boolean;
  readonly verifiedBy?: string;
  readonly verifiedAt?: string;
}

export const ALL_ASTRONAUT_SCIENCE_CARDS: readonly AstronautScienceCardData[] =
  astronautScienceSnapshot as readonly AstronautScienceCardData[];

/**
 * Filter strictly for cards where verified is true AND verification metadata (verifiedBy, verifiedAt)
 * is non-empty. An unverified or unsigned card must NEVER render in the application.
 */
export function getVerifiedScienceCards(): readonly AstronautScienceCardData[] {
  return ALL_ASTRONAUT_SCIENCE_CARDS.filter(
    (card) =>
      card.verified === true &&
      Boolean(card.verifiedBy && card.verifiedBy.trim().length > 0) &&
      Boolean(card.verifiedAt && card.verifiedAt.trim().length > 0),
  );
}

/**
 * Returns verified cards relevant to a specific game system or context.
 */
export function getVerifiedCardsForSystem(
  system: "Crops" | "Radiation" | "Crew Welfare",
): readonly AstronautScienceCardData[] {
  return getVerifiedScienceCards().filter((card) => card.gameSystem === system);
}

/**
 * Formats reviewer attribution strictly adhering to "Checked by <initials>, <date>".
 */
export function formatCardVerification(card: AstronautScienceCardData): string {
  if (!card.verified || !card.verifiedBy || !card.verifiedAt) {
    return "";
  }
  const cleanName = card.verifiedBy.replace(/\([^)]*\)/g, "").trim();
  const initials = cleanName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  const displayInitials = initials.length > 0 ? initials : card.verifiedBy.trim();
  return `Checked by ${displayInitials}, ${card.verifiedAt}`;
}

