"use client";
import { LazyMotion, domAnimation, m } from "motion/react";
import { GithubLogo, Copy } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §7.10 — open source + public APIs.
 *
 * Rendered with manual span-level syntax highlighting rather than Shiki.
 * Shiki is installed and available for future use (see lib/), but the proposal
 * site only needs a single small code block and a hand-tuned palette maps
 * cleaner to our tokens (teal keys, gold flag values, muted punctuation) than
 * forcing a prebuilt Shiki theme. Zero runtime JS cost: static JSX.
 */

type Token = { text: string; kind?: "key" | "str" | "bool" | "num" | "punct" | "comment" };

const REQUEST_TOKENS: Token[] = [
  { text: "GET", kind: "key" },
  { text: " " },
  { text: "/api/v1/distributions", kind: "str" },
  { text: "?openToday=true&storage=cold", kind: "punct" },
];

const RESPONSE_LINES: Token[][] = [
  [{ text: "{", kind: "punct" }],
  [
    { text: "  " },
    { text: '"total"', kind: "key" },
    { text: ": ", kind: "punct" },
    { text: "6", kind: "num" },
    { text: ",", kind: "punct" },
  ],
  [
    { text: "  " },
    { text: '"filteredBy"', kind: "key" },
    { text: ": { ", kind: "punct" },
    { text: '"openToday"', kind: "key" },
    { text: ": ", kind: "punct" },
    { text: "true", kind: "bool" },
    { text: ", ", kind: "punct" },
    { text: '"storage"', kind: "key" },
    { text: ": ", kind: "punct" },
    { text: '"cold"', kind: "str" },
    { text: " },", kind: "punct" },
  ],
  [
    { text: "  " },
    { text: '"results"', kind: "key" },
    { text: ": [", kind: "punct" },
  ],
  [{ text: "    {", kind: "punct" }],
  [
    { text: "      " },
    { text: '"id"', kind: "key" },
    { text: ": ", kind: "punct" },
    { text: '"anaheim-frc"', kind: "str" },
    { text: ",", kind: "punct" },
  ],
  [
    { text: "      " },
    { text: '"name"', kind: "key" },
    { text: ": ", kind: "punct" },
    { text: '"Anaheim FRC"', kind: "str" },
    { text: ",", kind: "punct" },
  ],
  [
    { text: "      " },
    { text: '"neighborhood"', kind: "key" },
    { text: ": ", kind: "punct" },
    { text: '"Central Anaheim"', kind: "str" },
    { text: ",", kind: "punct" },
  ],
  [
    { text: "      " },
    { text: '"nextDistribution"', kind: "key" },
    { text: ": ", kind: "punct" },
    { text: '"Tue 4–6 pm"', kind: "str" },
    { text: ",", kind: "punct" },
  ],
  [
    { text: "      " },
    { text: '"storage"', kind: "key" },
    { text: ": [", kind: "punct" },
    { text: '"dry"', kind: "str" },
    { text: ", ", kind: "punct" },
    { text: '"cold"', kind: "str" },
    { text: "],", kind: "punct" },
  ],
  [
    { text: "      " },
    { text: '"model"', kind: "key" },
    { text: ": ", kind: "punct" },
    { text: '"choice"', kind: "str" },
    { text: ",", kind: "punct" },
  ],
  [
    { text: "      " },
    { text: '"capacityLabel"', kind: "key" },
    { text: ": ", kind: "punct" },
    { text: '"open"', kind: "str" },
  ],
  [{ text: "    }", kind: "punct" }],
  [{ text: "  ]", kind: "punct" }],
  [{ text: "}", kind: "punct" }],
];

const TOKEN_CLASS: Record<NonNullable<Token["kind"]> | "default", string> = {
  key: "text-[#7FD1DC]", // light teal
  str: "text-[#F5C97A]", // warm gold (lighter than D4A843 for dark bg contrast)
  bool: "text-[#E8B5E5]", // soft magenta for true/false (kept outside brand, common convention)
  num: "text-[#9BE6A5]", // soft green for numbers
  punct: "text-white/55",
  comment: "text-white/40 italic",
  default: "text-white/90",
};

function TokenSpan({ token }: { token: Token }) {
  const cls = TOKEN_CLASS[token.kind ?? "default"];
  return <span className={cls}>{token.text}</span>;
}

export default function PublicInfrastructure() {
  const copy = SITE.publicInfrastructure;

  return (
    <section
      id="public-infrastructure"
      aria-labelledby="public-infrastructure-h2"
      className="relative overflow-hidden py-24 md:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <LazyMotion features={domAnimation}>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <m.div
              initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            >
              <span className="inline-flex items-center gap-[7px] rounded-full border border-[rgba(12,124,138,0.14)] bg-[rgba(12,124,138,0.07)] px-[10px] py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[var(--brand-primary-dark)]">
                <span
                  aria-hidden
                  className="h-[5px] w-[5px] rounded-full bg-[var(--brand-primary)]"
                />
                {copy.eyebrow}
              </span>
              <h2
                id="public-infrastructure-h2"
                className="mt-5 text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
              >
                {copy.headline}
              </h2>
              <p
                className="mt-6 max-w-[58ch] text-[clamp(1rem,1.1vw,1.125rem)] text-[var(--ink-muted)]"
                style={{ lineHeight: 1.58, fontFamily: "var(--font-body)" }}
              >
                {copy.body}
              </p>

              <ul className="mt-6 flex flex-wrap gap-2" data-testid="infra-badges">
                {copy.badges.map((badge) => (
                  <li key={badge}>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-muted)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)]">
                      {badge.toLowerCase() === "github" ? (
                        <GithubLogo weight="light" className="h-3 w-3" aria-hidden />
                      ) : null}
                      {badge}
                    </span>
                  </li>
                ))}
              </ul>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.32, 0.72, 0, 1] }}
              className="rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] p-1.5 ring-1 ring-[rgba(10,10,11,0.06)]"
            >
              <div className="rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-ink)] p-5 ss-float-card">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/60">
                    GET /api/v1/distributions
                  </p>
                  <button
                    type="button"
                    aria-label="Copy API sample to clipboard (mock)"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <Copy weight="light" className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>

                <pre
                  data-testid="code-block"
                  className="mt-4 overflow-auto text-[12.5px] leading-[1.6]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <code>
                    <div>
                      {REQUEST_TOKENS.map((tk, i) => (
                        <TokenSpan key={i} token={tk} />
                      ))}
                    </div>
                    <div className="mt-3">
                      {RESPONSE_LINES.map((line, i) => (
                        <div key={i}>
                          {line.map((tk, j) => (
                            <TokenSpan key={j} token={tk} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </code>
                </pre>
              </div>
            </m.div>
          </div>
        </LazyMotion>
      </div>
    </section>
  );
}
