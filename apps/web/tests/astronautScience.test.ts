import { describe, expect, it } from "vitest";
import {
  ALL_ASTRONAUT_SCIENCE_CARDS,
  formatCardVerification,
  getVerifiedCardsForSystem,
  getVerifiedScienceCards,
} from "../src/data/astronautScience.js";

describe("Astronaut-Science Cards (M15 MUST 2 & COULD 6)", () => {
  it("loads snapshot cards with required schema fields", () => {
    expect(ALL_ASTRONAUT_SCIENCE_CARDS.length).toBeGreaterThanOrEqual(4);

    for (const card of ALL_ASTRONAUT_SCIENCE_CARDS) {
      expect(card.id).toBeTruthy();
      expect(card.title).toBeTruthy();
      expect(card.plainFinding).toBeTruthy();
      expect(card.caveat).toBeTruthy();
      expect(card.gameSystem).toBeTruthy();
      expect(card.url).toMatch(/^https?:\/\//);
      expect(card.accessedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(card.archivedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof card.verified).toBe("boolean");
    }
  });

  it("strictly excludes unverified or unsigned cards from getVerifiedScienceCards()", () => {
    const verifiedCards = getVerifiedScienceCards();
    expect(verifiedCards.length).toBeGreaterThanOrEqual(3);

    // Ensure all verified cards have true flag, reviewer name, and date
    for (const card of verifiedCards) {
      expect(card.verified).toBe(true);
      expect(card.verifiedBy).toBeTruthy();
      expect(card.verifiedAt).toBeTruthy();
    }

    // radiation-RadLab-ALTEA-Survey is unsigned and must NEVER be in verified cards
    const altea = verifiedCards.find((c) => c.id === "radiation-RadLab-ALTEA-Survey");
    expect(altea).toBeUndefined();

    // radiation-iss-published is unsigned (COULD 6) and must NEVER be in verified cards
    const narici = verifiedCards.find((c) => c.id === "radiation-iss-published");
    expect(narici).toBeUndefined();
  });

  it("formats reviewer badge strictly with initials and date: 'Checked by <initials>, <date>'", () => {
    const verifiedCards = getVerifiedScienceCards();
    for (const card of verifiedCards) {
      const formatted = formatCardVerification(card);
      expect(formatted).toMatch(/^Checked by [A-Z]+, \d{4}-\d{2}-\d{2}$/);
    }
  });

  it("enforces findings word count limits (<= 25 words per plain finding)", () => {
    for (const card of ALL_ASTRONAUT_SCIENCE_CARDS) {
      const words = card.plainFinding.trim().split(/\s+/);
      expect(
        words.length,
        `Card ${card.id} finding exceeds 25 words: "${card.plainFinding}"`,
      ).toBeLessThanOrEqual(25);
    }
  });

  it("filters verified cards by game system properly", () => {
    const cropCards = getVerifiedCardsForSystem("Crops");
    expect(cropCards.length).toBeGreaterThanOrEqual(2);
    expect(cropCards.every((c) => c.gameSystem === "Crops")).toBe(true);

    const welfareCards = getVerifiedCardsForSystem("Crew Welfare");
    expect(welfareCards.length).toBeGreaterThanOrEqual(1);
    expect(welfareCards.every((c) => c.gameSystem === "Crew Welfare")).toBe(true);

    const radiationCards = getVerifiedCardsForSystem("Radiation");
    // No radiation cards signed yet -> must be 0 verified cards
    expect(radiationCards.length).toBe(0);
  });
});

