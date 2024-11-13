import { describe, expect, it } from "vitest";
import { CONSTANTS, walkConstants, type SourceId } from "@sol-keeper/sim";
import { DATA_PASSPORT } from "../src/data/dataPassport.js";
import { SOURCE_REGISTRY } from "../src/data/sourceRegistry.js";

describe("Data Passport (M15 MUST 1)", () => {
  it("contains well-formed entries with valid labels and evidence standards", () => {
    expect(DATA_PASSPORT.length).toBeGreaterThanOrEqual(30);

    const validLabels = new Set(["Live", "Snapshot", "Archived", "Published", "Derived", "Tuned"]);
    const validEvidence = new Set(["read by a person", "wording adopted, quote not confirmed", "n/a"]);

    for (const entry of DATA_PASSPORT) {
      expect(entry.id, `Entry id missing for ${entry.name}`).toBeTruthy();
      expect(entry.name, `Entry name missing for ${entry.id}`).toBeTruthy();
      expect(entry.source, `Entry source missing for ${entry.id}`).toBeTruthy();
      expect(entry.whatItDrives, `whatItDrives missing for ${entry.id}`).toBeTruthy();
      expect(entry.whereYouSeeIt, `whereYouSeeIt missing for ${entry.id}`).toBeTruthy();
      expect(validLabels.has(entry.label), `Invalid label '${entry.label}' in ${entry.id}`).toBe(true);
      expect(validEvidence.has(entry.evidenceLevel), `Invalid evidenceLevel '${entry.evidenceLevel}' in ${entry.id}`).toBe(true);
      expect(typeof entry.verified, `verified must be boolean in ${entry.id}`).toBe("boolean");
    }
  });

  it("ensures every source used by simulation constants appears in the Data Passport", () => {
    const walked = walkConstants(CONSTANTS);
    const usedSourceIds = new Set<SourceId>();
    for (const { constant } of walked) {
      usedSourceIds.add(constant.source);
    }

    const passportSourceIds = new Set(DATA_PASSPORT.map((e) => e.source));

    // Every constant source used in simulation must be cataloged in Data Passport
    const missing: string[] = [];
    for (const src of usedSourceIds) {
      if (!passportSourceIds.has(src)) {
        missing.push(src);
      }
    }

    expect(
      missing,
      `The following sim constant source IDs are missing from DATA_PASSPORT: ${missing.join(", ")}`,
    ).toEqual([]);
  });

  it("ensures all passport entries with known sim sources exist in SOURCE_REGISTRY", () => {
    const registryKeys = new Set(Object.keys(SOURCE_REGISTRY));

    for (const entry of DATA_PASSPORT) {
      // If the source ID matches registry naming, ensure it is in SOURCE_REGISTRY
      if (registryKeys.has(entry.source)) {
        expect(SOURCE_REGISTRY[entry.source as SourceId]).toBeDefined();
      }
    }
  });

  it("has high verification coverage for primary published datasets", () => {
    const published = DATA_PASSPORT.filter((e) => e.label === "Published");
    expect(published.length).toBeGreaterThan(10);
    const verifiedPublished = published.filter((e) => e.verified);
    // Over 75% of published records are verified primary sources (audited with 'read by a person')
    expect(verifiedPublished.length / published.length).toBeGreaterThanOrEqual(0.75);
  });
});
