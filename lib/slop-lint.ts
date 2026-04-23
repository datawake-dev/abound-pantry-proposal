/**
 * AI-slop lint for user-facing copy.
 *
 * Catches banned SaaS vocabulary (DESIGN.md §12) and em-dash clause separators
 * before they reach a grant reviewer. Used at the unit level by
 * tests/unit/slop-lint.test.ts (self-test) and at the page level by
 * tests/unit/site-copy-lint.test.ts (every string in SITE).
 *
 * Regexes are intentional: the em-dash rule ONLY flags an em dash with
 * whitespace on both sides (clause separator), not a compound-modifier hyphen
 * or an en dash used as a time range (e.g. "9–11 am").
 */

const BANNED_WORDS: Array<{ rule: string; regex: RegExp }> = [
  { rule: "empower", regex: /\bempower\w*/i },
  // "leverage" as a verb: flag when followed by a word (skip compound nouns like "leverage ratio")
  { rule: "leverage-verb", regex: /\bleverag(?:e[sd]?|ing)\s+\w/i },
  { rule: "unlock", regex: /\bunlock\w*/i },
  { rule: "transform-your", regex: /\btransform\s+your\b/i },
  { rule: "seamless", regex: /\bseamless\w*/i },
  { rule: "game-changer", regex: /\bgame[-\s]?changer\w*/i },
  { rule: "move-the-needle", regex: /\bmove\s+the\s+needle\b/i },
  { rule: "unleash", regex: /\bunleash\w*/i },
  { rule: "fast-paced-world", regex: /\bin\s+today['’]?s\s+fast[-\s]?paced\s+world\b/i },
  { rule: "synergy", regex: /\bsyngerg\w*|\bsynergy|\bsynergies\b/i },
  { rule: "revolutioniz", regex: /\brevolutioniz\w*/i },
  { rule: "revolutionary", regex: /\brevolutionary\b/i },
  { rule: "best-in-class", regex: /\bbest[-\s]?in[-\s]?class\b/i },
  { rule: "cutting-edge", regex: /\bcutting[-\s]?edge\b/i },
  { rule: "world-class", regex: /\bworld[-\s]?class\b/i },
  { rule: "next-level", regex: /\btake\s+(?:it|this|your)\s+to\s+the\s+next\s+level\b/i },
  { rule: "production-grade", regex: /\bproduction[-\s]?grade\b/i },
  { rule: "next-gen", regex: /\bnext[-\s]?gen(?:eration)?\b/i },
];

// Em dash with whitespace on BOTH sides = clause separator usage. Hyphens and
// en-dashes (used as numeric ranges) are fine.
const EM_DASH_CLAUSE = /\s—\s|\s—\s/;

export interface SlopFinding {
  rule: string;
  match: string;
  context: string;
}

export function lintSlop(text: string): SlopFinding[] {
  const findings: SlopFinding[] = [];
  for (const { rule, regex } of BANNED_WORDS) {
    const match = text.match(regex);
    if (match) {
      findings.push({ rule, match: match[0], context: text });
    }
  }
  if (EM_DASH_CLAUSE.test(text)) {
    findings.push({ rule: "em-dash-clause", match: "—", context: text });
  }
  return findings;
}
