"use client";
import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m } from "motion/react";
import { Command } from "cmdk";
import { MagnifyingGlass, ArrowRight, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §7.9 — live cmdk command palette, not a screenshot.
 *
 * Focus management (§11):
 * - Selecting a result (Enter / click) opens inline detail panel and moves
 *   focus to the panel's heading. Escape or the Back button returns focus to
 *   the originating result button.
 * - Inline expansion, NOT a modal — no focus trap, surrounding nav stays
 *   tab-accessible.
 */

export default function CaseManager() {
  const copy = SITE.caseManager;
  const [query, setQuery] = useState(copy.queryPrefill);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const filteredCount = copy.results.length;

  const panelHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const originTriggerRef = useRef<HTMLElement | null>(null);

  // On expand, move focus to the detail panel heading.
  useEffect(() => {
    if (selectedIndex !== null && panelHeadingRef.current) {
      panelHeadingRef.current.focus();
    }
  }, [selectedIndex]);

  const onSelect = (index: number, el: HTMLElement | null) => {
    originTriggerRef.current = el;
    setSelectedIndex(index);
  };

  const onCollapse = () => {
    setSelectedIndex(null);
    // Return focus to the originating trigger.
    requestAnimationFrame(() => {
      originTriggerRef.current?.focus();
    });
  };

  return (
    <section
      id="case-manager"
      aria-labelledby="case-manager-h2"
      className="relative overflow-hidden py-24 md:py-28"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <LazyMotion features={domAnimation}>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
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
                id="case-manager-h2"
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
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.32, 0.72, 0, 1] }}
              className="rounded-[1.75rem] bg-[rgba(10,10,11,0.04)] p-1.5 ring-1 ring-[rgba(10,10,11,0.06)]"
              data-testid="case-manager-palette"
            >
              <div className="rounded-[calc(1.75rem-0.375rem)] bg-[var(--surface-card)] p-4 ss-float-card">
                <Command
                  label="Find the right pantry"
                  shouldFilter={false}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && selectedIndex !== null) {
                      e.preventDefault();
                      onCollapse();
                    }
                  }}
                >
                  <div className="flex items-center gap-2 border-b border-[var(--rule-cool)] pb-3">
                    <MagnifyingGlass weight="light" className="h-4 w-4 text-[var(--ink-muted)]" aria-hidden />
                    <Command.Input
                      value={query}
                      onValueChange={(v) => {
                        setQuery(v);
                      }}
                      placeholder="Describe who and what the family needs"
                      className="flex-1 bg-transparent text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-faint)] focus:outline-none"
                      style={{ fontFamily: "var(--font-body)" }}
                      aria-label="Pantry search query"
                    />
                  </div>
                  <Command.List
                    className="mt-3 max-h-[320px] overflow-auto"
                    data-testid="cmdk-list"
                  >
                    <Command.Empty className="py-6 text-center text-[13px] text-[var(--ink-muted)]">
                      No pantries match that query.
                    </Command.Empty>
                    {copy.results.map((result, i) => (
                      <Command.Item
                        key={result.siteName}
                        value={`${result.siteName} ${result.neighborhood} ${result.reasoning}`}
                        onSelect={() => {
                          const el = document.activeElement as HTMLElement | null;
                          onSelect(i, el);
                        }}
                        className="group/result mt-2 cursor-pointer rounded-lg border border-transparent px-3 py-3 transition-colors data-[selected=true]:border-[var(--brand-primary)] data-[selected=true]:bg-[var(--brand-primary-light)]"
                        data-testid={`result-${i}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium text-[var(--ink)]">
                              {result.siteName}
                            </p>
                            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                              {result.neighborhood}
                            </p>
                            <p
                              className="mt-2 text-[12.5px] text-[var(--ink-muted)]"
                              style={{ lineHeight: 1.5 }}
                            >
                              {result.reasoning}
                            </p>
                          </div>
                          <CaretRight
                            weight="light"
                            className="h-4 w-4 text-[var(--ink-faint)] transition-transform group-hover/result:translate-x-[2px]"
                            aria-hidden
                          />
                        </div>
                      </Command.Item>
                    ))}
                  </Command.List>
                </Command>

                <p
                  aria-live="polite"
                  className="sr-only"
                  data-testid="cmdk-live"
                >
                  {filteredCount} result{filteredCount === 1 ? "" : "s"} for query.
                </p>

                {selectedIndex !== null ? (
                  <div
                    role="region"
                    aria-label="Result detail"
                    className="mt-4 rounded-lg border border-[var(--rule-cool)] bg-[var(--surface-muted)] p-4"
                  >
                    <button
                      type="button"
                      onClick={onCollapse}
                      className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-muted)] hover:text-[var(--brand-primary)]"
                    >
                      ← Back to results
                    </button>
                    <h3
                      tabIndex={-1}
                      ref={panelHeadingRef}
                      className="mt-2 text-[1.125rem] font-semibold text-[var(--ink)] focus:outline-none"
                    >
                      {copy.detailHeading}: {copy.results[selectedIndex].siteName}
                    </h3>
                    <p
                      className="mt-2 text-[13px] text-[var(--ink-muted)]"
                      style={{ lineHeight: 1.5 }}
                    >
                      {copy.results[selectedIndex].reasoning}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand-primary)] pl-4 pr-2 py-2 text-[12px] font-semibold text-white hover:bg-[var(--brand-primary-dark)]"
                      >
                        <span>Share by text</span>
                        <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-white/20">
                          <ArrowRight weight="light" className="h-3 w-3" aria-hidden />
                        </span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </m.div>
          </div>
        </LazyMotion>
      </div>
    </section>
  );
}
