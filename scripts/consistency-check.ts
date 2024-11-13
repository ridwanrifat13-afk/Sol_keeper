/**
 * Consistency Check Script
 *
 * Verifies that key project metadata, feature names, dataset catalogs,
 * test counts, and balance metrics remain strictly synchronized across:
 * - README.md
 * - apps/web/public/about.html
 * - docs/DATA_PASSPORT.md
 * - docs/CREDITS.md
 * - docs/CLAIMS_EVIDENCE.md
 * - docs/BALANCE.md
 *
 * Fails with a non-zero exit code on any mismatch.
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

interface CheckResult {
  readonly category: string;
  readonly name: string;
  readonly passed: boolean;
  readonly detail: string;
}

const ROOT = resolve(".");

async function readText(relativePath: string): Promise<string> {
  const fullPath = resolve(ROOT, relativePath);
  return await readFile(fullPath, "utf-8");
}

async function runChecks(): Promise<void> {
  const results: CheckResult[] = [];

  // 1. Load target files
  const files = {
    readme: await readText("README.md"),
    about: await readText("apps/web/public/about.html"),
    passport: await readText("docs/DATA_PASSPORT.md"),
    credits: await readText("docs/CREDITS.md"),
    claims: await readText("docs/CLAIMS_EVIDENCE.md"),
    balance: await readText("docs/BALANCE.md"),
  };

  // Helper assertion
  function assert(category: string, name: string, condition: boolean, detail: string) {
    results.push({ category, name, passed: condition, detail });
  }

  // --------------------------------------------------------------------------
  // Check 1: Project Name
  // --------------------------------------------------------------------------
  const projectName = "Sol Keeper";
  assert("Project Name", "README.md", files.readme.includes(projectName), "Contains 'Sol Keeper'");
  assert("Project Name", "about.html", files.about.includes(projectName), "Contains 'Sol Keeper'");
  assert("Project Name", "DATA_PASSPORT.md", files.passport.includes(projectName), "Contains 'Sol Keeper'");
  assert("Project Name", "CREDITS.md", files.credits.includes(projectName), "Contains 'Sol Keeper'");
  assert("Project Name", "CLAIMS_EVIDENCE.md", files.claims.includes(projectName), "Contains 'Sol Keeper'");

  // --------------------------------------------------------------------------
  // Check 2: Core Feature Names
  // --------------------------------------------------------------------------
  const coreFeatures = [
    "Reality Dial",
    "Data Passport",
    "Data Sources",
    "Mission of the Day",
    "Today on the Sun",
    "Fast Play",
  ];

  for (const feature of coreFeatures) {
    assert("Feature Name", `README.md -> ${feature}`, files.readme.includes(feature), `Contains '${feature}'`);
    assert("Feature Name", `about.html -> ${feature}`, files.about.includes(feature), `Contains '${feature}'`);
    assert("Feature Name", `CLAIMS_EVIDENCE.md -> ${feature}`, files.claims.includes(feature), `Contains '${feature}'`);
  }

  // --------------------------------------------------------------------------
  // Check 3: Key Numerical Metrics
  // --------------------------------------------------------------------------
  // 3a. Actual rows in DATA_PASSPORT.md
  const passportRowMatches = files.passport.match(/^\| \*\*/gm) || [];
  const actualPassportRows = passportRowMatches.length;
  assert(
    "Key Numbers",
    "DATA_PASSPORT.md row count",
    actualPassportRows === 59,
    `Counted ${actualPassportRows} rows (expected exactly 59)`,
  );
  assert("Key Numbers", "README.md cites 59 datasets", files.readme.includes("59 cataloged datasets") || files.readme.includes("59"), "Cites 59 datasets");
  assert("Key Numbers", "about.html cites 59 datasets", files.about.includes("59 cataloged datasets"), "Cites 59 cataloged datasets");
  assert("Key Numbers", "CLAIMS_EVIDENCE.md cites 59 rows", files.claims.includes("59 cataloged rows") || files.claims.includes("59 rows"), "Cites 59 rows");

  // 3b. Test counts
  const expectedSuites = "75";
  const expectedTests = "691";
  assert("Key Numbers", "README.md cites 75 test suites", files.readme.includes(`${expectedSuites} test suites`), `Cites ${expectedSuites} test suites`);
  assert("Key Numbers", "README.md cites 691 tests", files.readme.includes(`${expectedTests} tests`), `Cites ${expectedTests} tests`);
  assert("Key Numbers", "about.html cites 75 test suites", files.about.includes(`${expectedSuites} test suites`), `Cites ${expectedSuites} test suites`);
  assert("Key Numbers", "about.html cites 691 tests", files.about.includes(`${expectedTests} tests`), `Cites ${expectedTests} tests`);
  assert("Key Numbers", "CLAIMS_EVIDENCE.md cites 75 test suites", files.claims.includes(`${expectedSuites} automated test suites`), `Cites ${expectedSuites} test suites`);
  assert("Key Numbers", "CLAIMS_EVIDENCE.md cites 691 tests", files.claims.includes(`${expectedTests} automated unit and validation tests`), `Cites ${expectedTests} tests`);

  // 3c. Monte Carlo Bot Balance Seeds
  assert("Key Numbers", "BALANCE.md cites 4,050 seeds", files.balance.includes("4,050 seeds") || files.balance.includes("150 seeds per row"), "Cites balance harness seed count");
  assert("Key Numbers", "README.md cites 4,050 seeds", files.readme.includes("4,050-seed"), "Cites 4,050-seed balance harness");
  assert("Key Numbers", "about.html cites 4,050 seeds", files.about.includes("4,050 seeds"), "Cites 4,050 seeds");
  assert("Key Numbers", "CLAIMS_EVIDENCE.md cites 4,050 seeds", files.claims.includes("4,050 Monte Carlo seeds") || files.claims.includes("4,050 simulated runs"), "Cites 4,050 seeds");

  // --------------------------------------------------------------------------
  // Check 4: Dataset Identifiers
  // --------------------------------------------------------------------------
  const criticalDatasets = [
    "BVAD-2022",
    "OCHMO-RAD",
    "OCHMO-TB047",
    "OCHMO-TB003",
    "NASA-AMES-STD8070",
    "NASA-WATER-2023",
    "MIT-MOXIE-2023",
    "API-DONKI",
    "API-HORIZONS",
    "API-IMAGES",
    "TREK-MOON",
    "TREK-MARS",
  ];

  for (const ds of criticalDatasets) {
    assert("Datasets", `DATA_PASSPORT.md defines ${ds}`, files.passport.includes(`\`${ds}\``), `Contains code ${ds}`);
    assert("Datasets", `CREDITS.md cites ${ds}`, files.credits.includes(ds), `Cites dataset ${ds}`);
  }

  // --------------------------------------------------------------------------
  // Check 5: Runtime AI & Privacy Safety
  // --------------------------------------------------------------------------
  const forbiddenClaims = ["calls OpenAI at runtime", "calls Anthropic at runtime", "runtime AI service called"];
  for (const claim of forbiddenClaims) {
    assert("AI Safety", `README excludes '${claim}'`, !files.readme.includes(claim), "No runtime AI call claim");
    assert("AI Safety", `about.html excludes '${claim}'`, !files.about.includes(claim), "No runtime AI call claim");
  }

  const explicitDisclosures = [
    "Zero AI services are called at runtime",
    "no player data leaves the device",
  ];
  for (const disclosure of explicitDisclosures) {
    assert(
      "Privacy Disclosures",
      `CREDITS.md has '${disclosure}'`,
      files.credits.toLowerCase().includes(disclosure.toLowerCase()),
      `Contains disclosure: "${disclosure}"`,
    );
  }

  // --------------------------------------------------------------------------
  // Report Summary
  // --------------------------------------------------------------------------
  console.log("\n========================================================");
  console.log("       SOL KEEPER DOCUMENTATION CONSISTENCY REPORT      ");
  console.log("========================================================\n");

  let failures = 0;
  for (const res of results) {
    const statusMark = res.passed ? "✓ PASS" : "✗ FAIL";
    console.log(`[${statusMark}] [${res.category}] ${res.name} — ${res.detail}`);
    if (!res.passed) failures++;
  }

  console.log("\n--------------------------------------------------------");
  console.log(`Total Checks: ${results.length} | Passed: ${results.length - failures} | Failures: ${failures}`);
  console.log("--------------------------------------------------------\n");

  if (failures > 0) {
    console.error(`Consistency check failed with ${failures} error(s).`);
    process.exit(1);
  } else {
    console.log("All documentation, numbers, and dataset consistency checks passed successfully.");
  }
}

runChecks().catch((err) => {
  console.error("Unhandled error during consistency check:", err);
  process.exit(1);
});

