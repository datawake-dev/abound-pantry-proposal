/**
 * SITE — typed copy constants for the proposal site.
 *
 * Every string here is rendered to a grant reviewer or a coalition partner.
 * Rules (enforced by tests/unit/site-copy-lint.test.ts):
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

export interface HeatMapNudgeAction {
  site: string;
  action: string;
}

export interface PictureCopy extends SimpleSectionCopy {
  heatMap: {
    heading: string;
    legendLow: string;
    legendHigh: string;
    overlayLabel: string;
    disclaimer: string;
  };
  nudge: {
    heading: string;
    summary: string;
    actions: HeatMapNudgeAction[];
    ctaLabel: string;
    rationale: string;
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
  footer: FooterCopy;
}

export const SITE: Site = {
  nav: {
    brand: "OC Pantry Coordination",
    proposalTag: "Proposal",
    links: [
      { label: "Planner view", href: "#picture" },
      { label: "Pantry self-service", href: "#coordination" },
      { label: "Scope", href: "#scope" },
    ],
  },

  hero: {
    eyebrow: "Proposal for Abound Food Care",
    headline: [
      { text: "A coordination data layer for " },
      { text: "Orange County", accent: "teal" },
      { text: " food distribution." },
    ],
    subline: {
      lead: "Open pantry directory.",
      rest: " Weekly distribution schedule. Public read APIs. Owned by Abound Food Care, built and maintained by Datawake, in collaboration with A Million Dreams Consulting.",
    },
    ctas: [],
    overlapCaption: {
      metric: "Sat 9:00am",
      body: "Three pantries are scheduled within a 300m radius at the same hour. Representative of the overlap patterns the planner view flags.",
      disclaimer: "Representative demo data. Live coordination layer in development.",
    },
  },

  sharedDatabase: {
    eyebrow: "Directory",
    headline: [
      { text: "Pantries, grocery-store supply partners, and family resource centers. " },
      { text: "One map", accent: "teal" },
      { text: " and one table." },
    ],
    body: "Church and community pantries, school shelves, mobile markets, appointment hubs, family resource centers, and the grocery stores supplying them. The map and the table are two views of the same records. Filter by capability. Export to CSV. Query the public read API. Participation is open to any food distribution site in the network.",
    hints: [
      "Hover a row to highlight its map dot",
      "Tab focuses rows; Enter or Space sorts on a column header",
      "Click any chip above to filter both map and table",
    ],
    filterLabel: "Filter",
    footerTemplate: "{n} of {total} sites shown",
  },

  problem: {
    eyebrow: "Current state",
    headline: "What the current coordination picture looks like.",
    body: "Saturday morning in central Anaheim. Three pantries open at the same hour within a five-minute walk of each other. A block south, a fourth neighborhood has no distribution until Wednesday. Abound moves food through this network every week. Second Harvest, 211 OC, CalOptima, and the coalition agencies each keep their own spreadsheets and calendars. No single source shows the whole network at the same time. The consequence is duplicated distributions, stale pantry profiles, and food dispatched without current visibility into which pantry has the capacity to accept it.",
  },

  picture: {
    eyebrow: "Strategic planner view",
    headline: "A planning view for food distribution leaders.",
    body: "The planner view layers SNAP density, school homeless rosters, and the week's distribution calendar onto a coverage heat map. A weekly brief written by an LLM ranks the overlaps and gaps in plain English and drafts suggested nudges for specific pantries: shift a Saturday 9am distribution, merge two neighboring church pantries, cover a Wednesday afternoon gap. The planner sends each nudge to the pantry operator as a suggestion, not a directive. The operator decides. Projected shift effects are shown as (representative projection) until the live heat map ships in V1.",
    heatMap: {
      heading: "Coverage heat map · Central Anaheim",
      legendLow: "Thin coverage",
      legendHigh: "Dense overlap",
      overlayLabel: "Saturday 9:00am",
      disclaimer: "Representative density layout. Live heat map ships in V1.",
    },
    nudge: {
      heading: "Weekly brief · Saturday 9am cluster",
      summary:
        "Three church pantries are scheduled within a 300m radius on Saturday at 9:00am. 92804 on Wednesday afternoon has no scheduled coverage.",
      actions: [
        {
          site: "St. Luke's Lutheran",
          action: "Suggested shift to Sunday 9:00am. Covers the 92804 Wednesday gap. Upgrade from box to choice market.",
        },
        {
          site: "Community Presbyterian",
          action: "Suggested merge into the Anaheim FRC Saturday 9:00am choice market. Same block, higher capacity.",
        },
        {
          site: "First Baptist Lincoln",
          action: "Hold Saturday 9:00am. Anchor site with the best cold storage on the block.",
        },
      ],
      ctaLabel: "Draft messages to pantry leads",
      rationale:
        "The planner is not sending orders. The platform drafts a short message to each pantry lead explaining the suggestion and asking whether it works. The operator replies yes, no, or with a counter-suggestion. The pantry decides.",
    },
  },

  coordination: {
    eyebrow: "Pantry self-service",
    headline: "How pantries update their information.",
    body: "Each pantry operator can see which other pantries, mobile distributions, and supply pickups are scheduled nearby, and can tell the platform what the site is short on this week: pasta, diapers, cold storage, bilingual volunteers. On Sunday evening the platform sends each site a short SMS asking about the week ahead. The operator replies in plain language. An LLM parses the reply, updates the site profile and the individual distribution record, and confirms the interpretation back to the operator. Mid-week, when Abound routes food to the site, the operator gets a text with the estimated composition and ETA. After the distribution the operator replies with the served count. No login. No app install.",
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
    eyebrow: "Abound dispatch console",
    headline: "The dispatch console used by the Abound team.",
    body: "One screen. Supply pipeline on the left: today's scheduled pickups and estimated composition. Distribution calendar in the middle: every site in the network this week, color-coded by supply state. Routing queue on the right: LLM-ranked assignments waiting on one-click confirmation. Alert bar across the top flags gaps, overlaps, and stale profiles. Data pulls live from the pantry operator loop and the partner feeds.",
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
    eyebrow: "Case manager directory search",
    headline: "Plain-English pantry search for case managers.",
    body: "One search field. The case manager types what the family needs in plain English. Ranked pantry results come back with the reasoning attached: open hours, storage capability, distribution model, language support, walking distance, kid-friendly lobby, appointment requirements. The case manager can share a single result with the family by text. No family account is required. The partner organization can optionally require a case-manager login, or leave the search open. The search uses the same directory powering the rest of the site.",
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
    eyebrow: "Open source and public APIs",
    headline: "Open-source codebase. Documented read APIs.",
    body: "The codebase lives in a public GitHub repository under an MIT or Apache 2.0 license. The read API is documented with an OpenAPI specification. Other counties or coalitions can fork the repository, point it at their own data, and run their own instance. Datawake maintains the upstream. Abound owns the Orange County instance and its data.",
    badges: [
      "GitHub",
      "OpenAPI",
      "MIT or Apache 2.0",
      "Forkable for other counties",
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
    headline: "Three partners and their roles.",
    partners: [
      {
        name: "Abound Food Care",
        role: "Product owner. Grant applicant. Long-term operator.",
        body: "Hosts the Orange County instance. Owns the operational data, the pantry relationships, and the routing decisions. The Abound dispatch team opens the console each morning and is accountable for the network.",
        initials: "AFC",
      },
      {
        name: "A Million Dreams Consulting",
        role: "Co-product manager. Domain expert. Adoption lead.",
        body: "Holds the coalition relationships across the OC Hunger Alliance, 211 OC, CalOptima, and the Anaheim school districts. Leads the planner-view workflow design and the pantry rollout.",
        initials: "AMDC",
      },
      {
        name: "Datawake",
        role: "Builder and maintainer.",
        body: "Software consultancy building the system. Long-term maintenance included. Open-source codebase on GitHub.",
        initials: "DW",
      },
    ],
  },

  scope: {
    eyebrow: "V1 scope and timeline",
    headline: "V1 feature set.",
    bullets: [
      {
        label: "Pantry directory",
        body: "Every participating site with current profile, storage capability, distribution model, and schedule.",
      },
      {
        label: "Pantry self-service over SMS and email",
        body: "Short messages capture weekly schedule changes, capacity, and specific needs. An LLM parses the reply and confirms the interpretation back to the operator. No login. No app install.",
      },
      {
        label: "Abound dispatch console",
        body: "Supply pipeline, distribution calendar, LLM-ranked routing queue, alert bar.",
      },
      {
        label: "Strategic planner view",
        body: "Coverage heat map, weekly brief from the LLM, and planner-drafted nudges suggesting pantries shift or merge their distribution times and locations.",
      },
      {
        label: "Case-manager search",
        body: "Natural-language query field returning ranked pantries with plain-English reasoning.",
      },
      {
        label: "Public read APIs",
        body: "Read endpoints for the directory and schedule, documented and versioned with OpenAPI.",
      },
      {
        label: "Partner feeds",
        body: "Imports from 211 OC and coalition agencies where data contracts allow. Second Harvest remains separate per their policy.",
      },
      {
        label: "Open-source release",
        body: "Public GitHub repository under an MIT or Apache 2.0 license. Other counties can fork it.",
      },
    ],
    timeline: [
      { when: "Grant award", what: "Kickoff. Data contracts. Governance model signed." },
      { when: "Month 3", what: "MVP: directory, pantry self-service, case-manager search." },
      { when: "Month 6", what: "Full V1: dispatch console, planner view, public read APIs." },
      { when: "Ongoing", what: "Maintenance, partner onboarding, quarterly releases." },
    ],
  },

  footer: {
    credit: "Built with Abound Food Care by Datawake. © 2026.",
    disclaimer: "All distribution data shown is representative demo data. Live coordination layer in development.",
  },
};
