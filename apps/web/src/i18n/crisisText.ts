/**
 * Crisis briefing text, at a chosen Reality Dial level.
 * Supports Cadet, Specialist, and Commander depths across English and Bangla.
 */
import type { DialLevel, Language } from "../dial/types.js";
import enTemplates from "./en/crisisText.json" with { type: "json" };
import bnTemplates from "./bn/crisisText.json" with { type: "json" };

type TemplateTable = Record<string, string>;

const { cadet: CADET, specialist: SPECIALIST, commander: COMMANDER }: Record<DialLevel, TemplateTable> = enTemplates;

const { cadet: CADET_BN, specialist: SPECIALIST_BN, commander: COMMANDER_BN }: Record<DialLevel, TemplateTable> =
  bnTemplates as unknown as Record<DialLevel, TemplateTable>;

const TABLES: Record<DialLevel, TemplateTable> = {
  cadet: CADET,
  specialist: SPECIALIST,
  commander: COMMANDER,
};

const TABLES_BN: Record<DialLevel, TemplateTable> = {
  cadet: CADET_BN,
  specialist: SPECIALIST_BN,
  commander: COMMANDER_BN,
};

export function crisisText(key: string, level: DialLevel = "specialist", language: Language = "en"): string {
  const tables = language === "bn" ? TABLES_BN : TABLES;
  return tables[level]?.[key] ?? TABLES[level]?.[key] ?? SPECIALIST[key] ?? key;
}

export function hasCrisisTemplate(key: string, level: DialLevel = "specialist", language: Language = "en"): boolean {
  const tables = language === "bn" ? TABLES_BN : TABLES;
  return key in (tables[level] ?? {});
}

export { CADET_BN, COMMANDER_BN, SPECIALIST_BN };
export { TABLES, TABLES_BN };

