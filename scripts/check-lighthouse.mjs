#!/usr/bin/env node
/**
 * Parse ./lighthouse.json and assert our DESIGN.md §10.2 thresholds.
 * Deterministic — no jq dependency, runs on any Node.
 */
import { readFileSync } from "node:fs";

const report = JSON.parse(readFileSync("./lighthouse.json", "utf-8"));
const audits = report.audits;
const lcp = audits["largest-contentful-paint"].numericValue;
const cls = audits["cumulative-layout-shift"].numericValue;
const tbt = audits["total-blocking-time"].numericValue;

// INP isn't always reported in lab mode; TBT is the honest proxy for this run.
const thresholds = { lcp: 2500, cls: 0.05, tbt: 300 };
const results = [
  ["LCP", lcp, thresholds.lcp, "ms", 0],
  ["CLS", cls, thresholds.cls, "", 3],
  ["TBT", tbt, thresholds.tbt, "ms", 0],
];

let failed = 0;
for (const [metric, value, threshold, unit, digits] of results) {
  const pass = value < threshold;
  if (!pass) failed++;
  console.log(
    `${pass ? "PASS" : "FAIL"} ${metric}: ${value.toFixed(digits)}${unit} (threshold ${threshold}${unit})`,
  );
}

if (failed === 0) {
  const perfScore = Math.round((report.categories?.performance?.score ?? 0) * 100);
  console.log(`Summary: LCP ${Math.round(lcp)}ms · CLS ${cls.toFixed(3)} · TBT ${Math.round(tbt)}ms · Perf score ${perfScore}`);
}

process.exit(failed ? 1 : 0);
