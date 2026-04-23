import { SITE } from "@/lib/site-data";

/**
 * DESIGN.md §6.4 — Floating Fluid Island nav.
 *
 * Detached from the top edge (mt-6), centered, rounded-full pill with
 * backdrop-blur white glass, hairline ring, stacked ambient shadow. No scroll
 * behavior change — the nav is already maximally elevated.
 *
 * Below 860px the anchor links hide; brand wordmark only.
 */

export default function Header() {
  const nav = SITE.nav;

  return (
    <header className="sticky top-0 z-40">
      <nav
        aria-label="Primary"
        className="mx-auto mt-6 flex w-max max-w-[92%] items-center gap-4 rounded-full border border-[rgba(10,10,11,0.07)] bg-[var(--surface-card)]/78 py-2 px-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(15,20,30,0.04),0_8px_24px_-8px_rgba(15,20,30,0.08)]"
        style={{ backdropFilter: "blur(14px)" }}
      >
        <a
          href="#hero"
          className="flex items-center gap-2.5 text-[13px]"
          style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.02em" }}
        >
          <span
            aria-hidden
            className="h-5 w-5 rounded-[6px]"
            style={{
              background:
                "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%)",
            }}
          />
          <span className="font-semibold text-[var(--ink)]">{nav.brand}</span>
        </a>

        <span
          aria-hidden
          className="hidden h-4 w-px bg-[var(--rule-cool)] md:block"
        />

        <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--ink-muted)] md:inline">
          {nav.proposalTag}
        </span>

        <ul
          className="hidden items-center gap-4 md:flex"
          data-testid="nav-links"
        >
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[13px] font-medium text-[var(--ink-muted)] transition-colors hover:text-[var(--ink)]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
