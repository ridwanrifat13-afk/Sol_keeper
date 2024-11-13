/**
 * Readability Auditor (Flesch–Kincaid Grade Level).
 *
 * Implements the standard FK formula:
 *   Grade = 0.39 * (words / sentences) + 11.8 * (syllables / words) - 15.59
 *
 * Rules:
 * 1. Replaces {placeholders} and {{placeholders}} with a 1-syllable word ("it") before scoring.
 * 2. Ignores strings under 4 words where FK is statistically undefined / meaningless.
 * 3. Identifies and reports any strings above Grade 5.0 for Cadet tier.
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;
  if (word.length <= 3) return 1;
  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

export interface FkResult {
  readonly grade: number | null;
  readonly words: number;
  readonly ignored: boolean;
}

export function computeFleschKincaid(text: string): FkResult {
  // Strip or replace placeholders with 1-syllable word
  const clean = text
    .replace(/\{\{[^}]+\}\}/g, "it")
    .replace(/\{[^}]+\}/g, "it")
    .replace(/[*_`]/g, "");

  const words = clean
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, ""))
    .filter((w) => w.length > 0);

  if (words.length < 4) {
    return { grade: null, words: words.length, ignored: true };
  }

  const sentences = clean
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) {
    return { grade: 0, words: words.length, ignored: false };
  }

  let syllables = 0;
  for (const w of words) {
    syllables += countSyllables(w);
  }

  const grade = 0.39 * (words.length / sentences.length) + 11.8 * (syllables / words.length) - 15.59;
  return {
    grade: Math.round(grade * 10) / 10,
    words: words.length,
    ignored: false,
  };
}

async function main() {
  const i18nDir = fileURLToPath(new URL("../apps/web/src/i18n/", import.meta.url));

  const goalText = JSON.parse(await readFile(`${i18nDir}en/goalText.json`, "utf8"));
  const logText = JSON.parse(await readFile(`${i18nDir}en/logText.json`, "utf8"));
  const decisionText = JSON.parse(await readFile(`${i18nDir}en/decisionText.json`, "utf8"));
  const crisisText = JSON.parse(await readFile(`${i18nDir}en/crisisText.json`, "utf8"));

  const results: Array<{ module: string; key: string; text: string; grade: number | null; ignored: boolean }> = [];

  for (const [key, text] of Object.entries(goalText.cadet as Record<string, string>)) {
    const res = computeFleschKincaid(text);
    results.push({ module: "goalText", key, text, grade: res.grade, ignored: res.ignored });
  }

  for (const [key, text] of Object.entries(logText.cadet as Record<string, string>)) {
    const res = computeFleschKincaid(text);
    results.push({ module: "logText", key, text, grade: res.grade, ignored: res.ignored });
  }

  for (const [key, text] of Object.entries(decisionText.cadet as Record<string, string>)) {
    const res = computeFleschKincaid(text);
    results.push({ module: "decisionText", key, text, grade: res.grade, ignored: res.ignored });
  }

  for (const [key, text] of Object.entries(crisisText.cadet as Record<string, string>)) {
    const res = computeFleschKincaid(text);
    results.push({ module: "crisisText", key, text, grade: res.grade, ignored: res.ignored });
  }

  const above5 = results.filter((r) => !r.ignored && r.grade !== null && r.grade > 5.0);

  console.log(`Scored ${results.length} Cadet strings.`);
  console.log(`Ignored (<4 words): ${results.filter((r) => r.ignored).length}`);
  console.log(`Grade <= 5.0: ${results.filter((r) => !r.ignored && r.grade !== null && r.grade <= 5.0).length}`);
  console.log(`Grade > 5.0: ${above5.length}`);

  if (above5.length > 0) {
    console.log("\nStrings above Grade 5.0:");
    for (const item of above5) {
      console.log(`- [${item.module}] ${item.key} (Grade ${item.grade}): "${item.text}"`);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

