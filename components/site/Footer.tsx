import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §7.14 — single-line desktop, stacked mobile.
 */

export default function Footer() {
  const copy = SITE.footer;

  return (
    <footer className="border-t border-[var(--rule-cool)] bg-[var(--surface-muted)] py-8">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-4 px-6 md:flex-row md:items-center md:justify-between">
        <p
          className="text-[13px] text-[var(--ink-muted)]"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {copy.credit}
        </p>
        <p className="max-w-[480px] text-[11.5px] text-[var(--ink-faint)]">
          {copy.disclaimer}
        </p>
        <span
          aria-hidden
          className="h-5 w-5 rounded-[6px]"
          style={{
            background:
              "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%)",
          }}
        />
      </div>
    </footer>
  );
}
