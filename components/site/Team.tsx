import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SITE } from "@/lib/site-data";

/**
 * Team roster — vertical list. Each partner renders as a full-width row
 * with the monogram on the left and the name + role + description on the
 * right. Replaced the earlier Z-axis-cascade layout (rotated overlapping
 * cards) because the rotations caused overflow on narrower viewports and
 * the visual novelty pulled focus away from the partner copy.
 */

const INITIALS_STYLES: Record<string, { bg: string; fg: string }> = {
  AFC: { bg: "var(--brand-gold-light)", fg: "var(--brand-gold-dark)" },
  AMDC: { bg: "var(--brand-primary-light)", fg: "var(--brand-primary-dark)" },
  DW: { bg: "#0F0F11", fg: "#FFFFFF" },
};

export default function Team() {
  const copy = SITE.team;

  return (
    <section
      id="team"
      aria-labelledby="team-h2"
      className="relative overflow-hidden py-24 md:py-28"
    >
      <div className="mx-auto max-w-[1100px] px-6">
        <ScrollReveal>
          <span className="inline-flex items-center gap-[7px] rounded-full border border-[rgba(12,124,138,0.14)] bg-[rgba(12,124,138,0.07)] px-[10px] py-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.18em] text-[var(--brand-primary-dark)]">
            <span
              aria-hidden
              className="h-[5px] w-[5px] rounded-full bg-[var(--brand-primary)]"
            />
            {copy.eyebrow}
          </span>
          <h2
            id="team-h2"
            className="mt-5 max-w-[640px] text-[clamp(1.9rem,3.4vw,2.8rem)] font-semibold leading-[1.02] tracking-[-0.04em]"
          >
            {copy.headline}
          </h2>
        </ScrollReveal>

        <ul
          className="mt-12 divide-y divide-[var(--rule-cool)] border-y border-[var(--rule-cool)]"
          data-testid="team-cards"
        >
          {copy.partners.map((partner, i) => {
            const initialsStyle =
              INITIALS_STYLES[partner.initials] ?? INITIALS_STYLES.DW;
            return (
              <li key={partner.name}>
                <ScrollReveal
                  as="article"
                  delayMs={i * 60}
                  rootMargin="-60px 0px"
                  className="grid grid-cols-[auto_1fr] items-start gap-6 py-8 md:grid-cols-[auto_minmax(0,260px)_minmax(0,1fr)] md:gap-10"
                >
                  <div
                    aria-hidden
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl font-mono text-[12px] font-semibold uppercase tracking-[0.14em]"
                    style={{
                      backgroundColor: initialsStyle.bg,
                      color: initialsStyle.fg,
                    }}
                  >
                    {partner.initials}
                  </div>
                  <div className="col-span-1 md:col-auto">
                    <h3 className="text-[1.2rem] font-semibold leading-tight tracking-[-0.01em] text-[var(--ink)]">
                      {partner.name}
                    </h3>
                    <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                      {partner.role}
                    </p>
                  </div>
                  <p
                    className="col-span-2 text-[14.5px] text-[var(--ink-muted)] md:col-auto"
                    style={{ lineHeight: 1.6, fontFamily: "var(--font-body)" }}
                  >
                    {partner.body}
                  </p>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
