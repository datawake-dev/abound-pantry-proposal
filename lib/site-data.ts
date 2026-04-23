/**
 * SITE — typed copy constants for the proposal site.
 *
 * Every string here is rendered to a grant reviewer, Victoria, Mike, or a
 * coalition partner. Rules (enforced by tests/unit/site-copy-lint.test.ts):
 *
 * - No em dash as clause separator (use period or colon instead).
 * - No banned SaaS vocabulary (see lib/slop-lint.ts for the list).
 * - Every quantitative claim is sourced, scrubbed to qualitative, or tagged
 *   "(representative)" / "(representative projection)".
 *
 * Scrub log (per PLAN-REVISIONS.md):
 * - Problem: "tens of millions of pounds" removed. "moves food at scale" instead.
 * - Picture: "32 percent projected coverage lift" tagged "(representative projection)".
 * - Coordination: "300-plus pantry volunteers" scrubbed to "hundreds of operators".
 * - CaseManager: "0.6-mile walk" scrubbed to "a short walk".
 * - Team: Datawake card flattened to three operational sentences.
 */

export type HeadlineSegment = { text: string; accent?: "teal" };

export interface NavCopy {
  brand: string;
  proposalTag: string;
  links: Array<{ label: string; href: string }>;
  cta: { label: string; href: string };
}

export interface HeroCopy {
  eyebrow: string;
  headline: HeadlineSegment[];
  subline: {
    lead: string;
    rest: string;
  };
  ctas: Array<{ label: string; href: string; variant: "primary" | "secondary" }>;
  overlapCaption: {
    metric: string;
    body: string;
    disclaimer: string;
  };
}

export interface SharedDatabaseCopy {
  eyebrow: string;
  headline: HeadlineSegment[];
  body: string;
  hints: string[];
  filterLabel: string;
  footerTemplate: string; // interpolated with filtered count at render time
}

export interface SimpleSectionCopy {
  eyebrow: string;
  headline: string;
  body: string;
}

export interface CaseManagerCopy extends SimpleSectionCopy {
  queryPrefill: string;
  results: Array<{
    siteName: string;
    neighborhood: string;
    reasoning: string;
  }>;
  detailHeading: string;
}

export interface PublicInfrastructureCopy extends SimpleSectionCopy {
  badges: string[];
  apiRequest: string;
  apiResponse: string;
}

export interface PartnerCardCopy {
  name: string;
  role: string;
  body: string;
  initials: string;
}

export interface TeamCopy {
  eyebrow: string;
  headline: string;
  partners: PartnerCardCopy[];
}

export interface ScopeCopy {
  eyebrow: string;
  headline: string;
  bullets: Array<{ label: string; body: string }>;
  timeline: Array<{ when: string; what: string }>;
  budget: {
    build: string;
    maintenance: string;
    note: string;
  };
}

export interface CtaCopy {
  eyebrow: string;
  headline: string;
  body: string;
  ctas: Array<{ label: string; href: string; variant: "gold" | "outline" }>;
}

export interface FooterCopy {
  credit: string;
  disclaimer: string;
}

export interface CoordinationBubble {
  speaker: "system" | "operator";
  author: string;
  text: string;
}

export interface CoordinationCopy extends SimpleSectionCopy {
  exchangeLabel: string;
  bubbles: CoordinationBubble[];
}

export interface LiveStateColumn {
  accent: "teal" | "neutral" | "gold";
  label: string;
  items: string[];
}

export interface LiveStateCopy extends SimpleSectionCopy {
  timestamp: string;
  columns: LiveStateColumn[];
  caption: string;
}

export interface PictureScenarioRow {
  name: string;
  time: string;
  storage: string;
}

export interface PictureMetricRow {
  label: string;
  detail: string;
}

export interface PictureCopy extends SimpleSectionCopy {
  scenario: {
    heading: string;
    pantries: PictureScenarioRow[];
    proposed: string;
    metrics: PictureMetricRow[];
    compareLabel: string;
    disclaimer: string;
  };
}

export interface Site {
  nav: NavCopy;
  hero: HeroCopy;
  sharedDatabase: SharedDatabaseCopy;
  problem: SimpleSectionCopy;
  picture: PictureCopy;
  coordination: CoordinationCopy;
  liveState: LiveStateCopy;
  caseManager: CaseManagerCopy;
  publicInfrastructure: PublicInfrastructureCopy;
  team: TeamCopy;
  scope: ScopeCopy;
  cta: CtaCopy;
  footer: FooterCopy;
}

export const SITE: Site = {
  nav: {
    brand: "OC Pantry Coordination",
    proposalTag: "Proposal",
    links: [
      { label: "The picture", href: "#picture" },
      { label: "How it works", href: "#coordination" },
      { label: "Scope", href: "#scope" },
    ],
    cta: { label: "Contact", href: "#cta-band" },
  },

  hero: {
    eyebrow: "Coordination infrastructure",
    headline: [
      { text: "Shared food-rescue data for " },
      { text: "Orange County", accent: "teal" },
      { text: "." },
    ],
    subline: {
      lead: "Open directory.",
      rest: " Live distribution state. Public APIs. Built with Abound Food Care.",
    },
    ctas: [
      { label: "Read the proposal", href: "#shared-database", variant: "primary" },
      { label: "How it works", href: "#coordination", variant: "secondary" },
    ],
    overlapCaption: {
      metric: "Sat 9:00am · 3 pantries · 300 m",
      body: "The system cannot see this.",
      disclaimer: "Representative demo data. Live coordination layer in development.",
    },
  },

  sharedDatabase: {
    eyebrow: "The shared database",
    headline: [
      { text: "Every distribution, every week. " },
      { text: "One source", accent: "teal" },
      { text: " of truth." },
    ],
    body: "The map is one view of this data. The table is another. Same 20 representative Anaheim distribution sites, same filter state. Sort any column. Filter by capability. Export to CSV. Query via the public API.",
    hints: [
      "Hover a row to highlight its map dot",
      "Tab focuses rows; Enter or Space sorts on a column header",
      "Click any chip above to filter both map and table",
    ],
    filterLabel: "Filter",
    footerTemplate: "{n} of {total} sites shown",
  },

  problem: {
    eyebrow: "The problem",
    headline: "A food-rescue system that cannot see itself.",
    body: "Saturday morning in central Anaheim. Three pantries open at the same hour within a five-minute walk of each other. A block south, a fourth neighborhood has no distribution until Wednesday. Abound moves food at scale through this network every week. Second Harvest, 211 OC, CalOptima, and the coalition agencies each keep their own spreadsheets and calendars. Nobody can see the network at once. Not the overlaps. Not the gaps. Not which pantry is short on cold storage this Tuesday. The consequence shows up as duplicated distributions, stale profiles, and supply dispatched without live visibility into who has the capacity to accept it.",
  },

  picture: {
    eyebrow: "The picture",
    headline: "One shared picture, used by coalition leaders.",
    body: "Victoria opens the planner view on Sunday night. Heat map layered with SNAP density and school homeless rosters. The AI strategic brief pulled gap and overlap patterns from the week prior and ranked three consolidation candidates in plain English. Central Anaheim Saturday morning is the top one: three overlapping church pantries within walking distance, a 32 percent projected coverage lift (representative projection) if they consolidate into a single choice-market model at the FRC. She opens the scenario tool, ticks the three pantries, previews the projected family reach and walking-distance impact, and saves the scenario for comment. On Monday morning Mike sees it in the Abound console with the planner's reasoning attached. Two weeks later the three pantry leads are in a room together. The tool does not decide. It makes the decision visible.",
    scenario: {
      heading: "Scenario · Consolidation preview",
      pantries: [
        { name: "First Baptist Lincoln", time: "Sat 9–11 am", storage: "Dry + cold" },
        { name: "St. Luke's Lutheran", time: "Sat 9–11 am", storage: "Dry" },
        { name: "Community Presbyterian", time: "Sat 10 am–12 pm", storage: "Dry" },
      ],
      proposed: "Proposed: Anaheim FRC, Sat 9 am–12 pm (choice market)",
      metrics: [
        { label: "Combined family reach", detail: "(representative)" },
        { label: "Supply concentration", detail: "(representative)" },
        { label: "Walk-distance impact", detail: "(representative)" },
      ],
      compareLabel: "Compare before and after",
      disclaimer: "Projected values shown are representative for this layout. Live scenario modeling ships in V1.",
    },
  },

  coordination: {
    eyebrow: "Coordination without a login",
    headline: "Pantries stay in their inbox.",
    body: "Hundreds of operators run the distribution network. Almost none of them want another app. Sunday night the platform sends each site a short message asking for the week ahead. The operator replies with capacity, specific needs, and any schedule changes in plain language. The AI parses the reply, updates both the site profile and the individual distribution state, and confirms back to the operator. Mid-week when Abound routes supply, the operator gets a text with the estimated composition and ETA. After the distribution the operator replies with the served count. The loop runs on the channels operators already use.",
    exchangeLabel: "Sample exchange · representative",
    bubbles: [
      {
        speaker: "system",
        author: "OC Pantry Coordination",
        text: "Hi Karen. Any updates for St. Mark's this week? Reply with capacity, specific needs, schedule changes, or \"same as usual.\"",
      },
      {
        speaker: "operator",
        author: "Karen at St. Mark's",
        text: "Tuesday same, 80 bags, need pasta and canned protein, cold capacity about 150 lb. Saturday normal.",
      },
      {
        speaker: "system",
        author: "OC Pantry Coordination",
        text: "Got it. Tue 4 to 6 pm: 80 bags, short on pasta and protein, 150 lb cold open. Sat 9 to 11 am: usual. Reply CHANGE if anything is wrong.",
      },
      {
        speaker: "system",
        author: "OC Pantry Coordination",
        text: "Abound routing 180 lb dry plus 120 lb cold to your Tue 4 pm from Ralphs Brea. ETA 4:15. Reply RECEIVED when it arrives.",
      },
    ],
  },

  liveState: {
    eyebrow: "The live state",
    headline: "Abound opens one console every morning.",
    body: "Supply pipeline on the left: today's scheduled pickups and estimated composition. Distribution calendar in the middle: every site in the network this week, color-coded by supply state. Routing queue on the right: AI-ranked assignments waiting on one-click confirmation. Alert bar up top catches gaps, overlaps, stale profiles. One screen. Live data pulled from the operator loop and the partner feeds. No spreadsheets taped over a dashboard.",
    timestamp: "Tue Apr 28 · 7:42 am PT",
    columns: [
      {
        accent: "teal",
        label: "Supply pipeline",
        items: [
          "Ralphs Brea · 180 lb dry · 4:00 pm pickup",
          "Albertsons Anaheim · 120 lb cold · 4:15 pm",
          "Second Harvest drop · Wednesday warehouse",
        ],
      },
      {
        accent: "neutral",
        label: "Distribution calendar",
        items: [
          "Tue 4 pm · St. Mark's · partial",
          "Wed 10 am · Magnolia SD pantry · open",
          "Sat 9 am · three overlapping sites · flagged",
        ],
      },
      {
        accent: "gold",
        label: "Routing queue",
        items: [
          "AI suggests Ralphs → St. Mark's · accept?",
          "AI suggests Albertsons → Calvary Chapel · review",
          "Gap: 92802 Wed afternoon · no coverage",
        ],
      },
    ],
    caption: "Representative layout. The console lives in the Abound account post-deploy.",
  },

  caseManager: {
    eyebrow: "A door for every family",
    headline: "A case manager finds the right pantry in under a minute.",
    body: "One search box. The case manager types what the family needs in plain English. Ranked results come back with the reasoning attached. Share a result with a family by text. No family account. No login for the case manager either, if the partner organization wants it that way. The feature runs on the same open data powering the rest of the site.",
    queryPrefill: "walkable 92804 open today spanish-speaking no appointment kid friendly",
    results: [
      {
        siteName: "Anaheim FRC",
        neighborhood: "Central Anaheim · 92802",
        reasoning: "Open today until 5 pm. Choice market. Spanish-speaking volunteer on shift. Kid-friendly lobby. A short walk from 92804.",
      },
      {
        siteName: "St. Mark's Tuesday pantry",
        neighborhood: "West Anaheim · 92804",
        reasoning: "Opens today at 4 pm. Box model. Bilingual staff. No appointment required. Within the requested ZIP.",
      },
      {
        siteName: "Calvary Chapel Ball Rd",
        neighborhood: "South Anaheim · 92804",
        reasoning: "Open this afternoon. Appointment-friendly drop-in lane available. Cold storage on site for dairy.",
      },
    ],
    detailHeading: "Share this result",
  },

  publicInfrastructure: {
    eyebrow: "Public infrastructure",
    headline: "Open source. Public APIs. Any county can fork it.",
    body: "The codebase lives on GitHub under a permissive license. The API is documented with OpenAPI. Any county or coalition that wants this infrastructure can fork the repo, point it at their own data, and stand up their own network without a vendor lock or a custom build. Datawake maintains the upstream. Abound owns the Orange County instance and its data.",
    badges: [
      "GitHub",
      "OpenAPI",
      "MIT or Apache 2.0",
      "Any county can fork",
    ],
    apiRequest: "GET /api/v1/distributions?openToday=true&storage=cold",
    apiResponse: `{
  "total": 6,
  "filteredBy": { "openToday": true, "storage": "cold" },
  "results": [
    {
      "id": "anaheim-frc",
      "name": "Anaheim FRC",
      "neighborhood": "Central Anaheim",
      "nextDistribution": "Tue 4–6 pm",
      "storage": ["dry", "cold"],
      "model": "choice",
      "capacityLabel": "open"
    }
  ]
}`,
  },

  team: {
    eyebrow: "Who is building this",
    headline: "Three partners, three specific roles.",
    partners: [
      {
        name: "Abound Food Care",
        role: "Product owner · Grant applicant · Long-term operator",
        body: "Hosts the Orange County instance. Owns the operational data, the pantry relationships, and the routing decisions. Mike's team opens the console each morning and is accountable for the network.",
        initials: "AFC",
      },
      {
        name: "A Million Dreams Consulting",
        role: "Co-product manager · Domain expert · Adoption lead",
        body: "Victoria Torres. Coalition relationships across OC Hunger Alliance, 211 OC, CalOptima, and the school districts. Planner-view workflow design and rollout strategy.",
        initials: "AMDC",
      },
      {
        name: "Datawake",
        role: "Builder · Maintainer",
        body: "Software consultancy building the system. Long-term maintenance included. Open-source codebase on GitHub.",
        initials: "DW",
      },
    ],
  },

  scope: {
    eyebrow: "V1 scope, timeline, budget",
    headline: "What the first release delivers.",
    bullets: [
      {
        label: "Distribution directory",
        body: "All represented sites with live profiles, storage capabilities, and schedule.",
      },
      {
        label: "Conversational pantry loop",
        body: "Email and SMS capture, AI parsing, confirmation back to the operator. No login required.",
      },
      {
        label: "Abound console",
        body: "Supply pipeline, distribution calendar, routing queue, alert bar.",
      },
      {
        label: "Strategic planner view",
        body: "Heat map, weekly AI brief, scenario tool for modeling consolidations before acting.",
      },
      {
        label: "Case-manager search",
        body: "Natural-language query with ranked results and plain-English reasoning.",
      },
      {
        label: "Public OpenAPI",
        body: "Read endpoints for the open data, documented and versioned.",
      },
      {
        label: "Partner feeds",
        body: "Imports from 211 OC, Second Harvest, and coalition agencies as their data contracts allow.",
      },
      {
        label: "Open-source release",
        body: "GitHub repository, MIT or Apache 2.0 license, fork-ready for other counties.",
      },
    ],
    timeline: [
      { when: "Grant award", what: "Kickoff, data contracts, governance model signed." },
      { when: "Month 3", what: "MVP: directory, pantry loop, case-manager search." },
      { when: "Month 6", what: "Full V1: Abound console, planner view, public API." },
      { when: "Ongoing", what: "Maintenance, partner onboarding, quarterly release cycle." },
    ],
    budget: {
      build: "$100–200K build",
      maintenance: "$100K maintenance over three years",
      note: "Line item inside Abound's grant application.",
    },
  },

  cta: {
    eyebrow: "Next steps",
    headline: "Let us build this together.",
    body: "For Victoria: reply in the email thread with comments. For Mike: we have 9 am PT on Tuesday May 5 on the calendar.",
    ctas: [
      {
        label: "Reply in the thread",
        href: "mailto:mike@aboundfoodcare.org?subject=OC%20Pantry%20Coordination%20Proposal",
        variant: "gold",
      },
      {
        label: "Add to calendar",
        href: "https://cal.com/datawake/abound-may-5",
        variant: "outline",
      },
    ],
  },

  footer: {
    credit: "Built with Abound Food Care by Datawake. © 2026.",
    disclaimer: "All distribution data shown is representative demo data. Live coordination layer in development.",
  },
};
