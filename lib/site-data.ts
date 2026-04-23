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
      lead: "An open pantry directory",
      rest: " with a weekly distribution schedule and public read APIs, owned by Abound Food Care and built and maintained by Datawake, in collaboration with A Million Dreams Consulting.",
    },
    ctas: [],
    overlapCaption: {
      metric: "Sat 9:00am",
      body: "Three pantries are scheduled to open within a 300m radius at the same hour, which is the kind of overlap pattern the planner view would flag for coalition leaders to review. The pantries shown here are fabricated for this demo.",
      disclaimer: "Mock data only. Nothing on this page is in operation yet.",
    },
  },

  sharedDatabase: {
    eyebrow: "Directory",
    headline: [
      { text: "Pantries, grocery-store supply partners, and family resource centers. " },
      { text: "One map", accent: "teal" },
      { text: " and one database." },
    ],
    body: "The database covers church and community pantries, school shelves, mobile markets, appointment-based distribution hubs, family resource centers, and the grocery stores that supply them. The map and the data table are two views of the same records, so a filter applied in one view narrows both at once. Each record can be exported to CSV or queried through the public read API, and participation is open to any food distribution site operating in the network.",
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
    body: "On a typical Saturday morning in central Anaheim, three pantries open within a five-minute walk of each other at the same hour, while a block south a fourth neighborhood has no distribution scheduled until Wednesday. Abound Food Care moves food through this network every week, but Second Harvest, 211 OC, CalOptima, and the other coalition agencies each maintain their own spreadsheets and calendars, and no single source shows the whole network at the same time. The result is duplicated distributions, pantry profiles that drift out of date, and food dispatched without current visibility into which sites actually have the capacity to accept it.",
  },

  picture: {
    eyebrow: "Strategic planner view",
    headline: "A planning view for food distribution leaders.",
    body: "The planner view layers SNAP density, school homeless rosters, and the week's distribution calendar onto a coverage heat map, and a weekly brief written by an LLM ranks the overlaps and gaps in plain English. The brief drafts suggested nudges for specific pantries, such as shifting a Saturday 9am distribution, merging two neighboring church pantries, or covering a Wednesday afternoon gap in a ZIP code that currently has none. Each nudge goes to the pantry operator as a suggestion rather than a directive, and the operator decides whether to act on it. Projected effects are shown as (representative projection) until the live heat map ships in V1.",
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
        "Three church pantries are scheduled to open within a 300m radius on Saturday at 9:00am, while ZIP 92804 has no scheduled coverage on Wednesday afternoon.",
      actions: [
        {
          site: "St. Luke's Lutheran",
          action: "Shift the Saturday distribution to Sunday at 9:00am to cover the 92804 Wednesday gap, and upgrade the site from a box model to a choice market.",
        },
        {
          site: "Community Presbyterian",
          action: "Merge into the Anaheim FRC Saturday 9:00am choice market on the same block, which has more capacity than the current host site.",
        },
        {
          site: "First Baptist Lincoln",
          action: "Hold the Saturday 9:00am distribution as the anchor site for the cluster, since this location has the best cold storage on the block.",
        },
      ],
      ctaLabel: "Draft messages to pantry leads",
      rationale:
        "The planner is not sending orders. Instead, the platform drafts a short message to each pantry lead explaining the suggestion and asking whether it would work, and the operator replies with a yes, a no, or a counter-suggestion of their own. The pantry decides.",
    },
  },

  coordination: {
    eyebrow: "Pantry self-service",
    headline: "How pantries update their information.",
    body: "Each pantry operator can see which other pantries, mobile distributions, and supply pickups are scheduled nearby, and they can tell the platform what the site is short on in a given week, whether that is pasta, diapers, cold storage, or bilingual volunteers. On Sunday evenings the platform sends each site a short SMS asking about the week ahead, and the operator replies in plain language. An LLM parses the reply, updates the site profile and the individual distribution record, and confirms the interpretation back to the operator. Mid-week, when Abound routes food to the site, the operator receives a second text with the estimated composition and ETA, and after the distribution they reply with the served count. The entire loop runs over the operator's existing inbox, without a login or an app install.",
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
    body: "The console presents the full network on a single screen. The left column shows the supply pipeline, including today's scheduled pickups and their estimated composition. The middle column is the distribution calendar, which lists every site in the network for the current week, color-coded by supply state. The right column is the routing queue, where LLM-ranked assignments wait on one-click confirmation. An alert bar across the top flags gaps, overlaps, and stale pantry profiles, and the entire view updates live from the pantry operator loop and the partner data feeds.",
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
    caption: "Representative layout; the live console will run inside the Abound Food Care account once the platform ships.",
  },

  caseManager: {
    eyebrow: "Case manager directory search",
    headline: "Plain-English pantry search for case managers.",
    body: "The case manager types what the family needs into a single search field in plain English, and the platform returns ranked pantry results with the reasoning attached, covering open hours, storage capability, distribution model, language support, walking distance, lobby environment, and appointment requirements. A case manager can share any single result with the family by text message, and no family-side account is required to receive it. The partner organization can optionally require a case-manager login or leave the search open to any staff member, and the search reads from the same directory that powers the rest of the site.",
    queryPrefill: "walkable 92804 open today spanish-speaking no appointment kid friendly",
    results: [
      {
        siteName: "Anaheim FRC",
        neighborhood: "Central Anaheim · 92802",
        reasoning: "Open today until 5 pm as a choice market, with a Spanish-speaking volunteer on shift and a kid-friendly lobby, a short walk from 92804.",
      },
      {
        siteName: "St. Mark's Tuesday pantry",
        neighborhood: "West Anaheim · 92804",
        reasoning: "Opens today at 4 pm as a box-model pantry with bilingual staff and no appointment required, inside the requested ZIP.",
      },
      {
        siteName: "Calvary Chapel Ball Rd",
        neighborhood: "South Anaheim · 92804",
        reasoning: "Open this afternoon with an appointment-friendly drop-in lane and on-site cold storage for dairy.",
      },
    ],
    detailHeading: "Share this result",
  },

  publicInfrastructure: {
    eyebrow: "Open source and public APIs",
    headline: "Open-source codebase. Documented read APIs.",
    body: "The codebase lives in a public GitHub repository under an MIT or Apache 2.0 license, and the read API is documented with an OpenAPI specification. Other counties or coalitions that want the same infrastructure can fork the repository, point it at their own data, and run their own instance. Datawake maintains the upstream project, and Abound Food Care owns the Orange County instance along with the data within it.",
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
        role: "Product owner, grant applicant, long-term operator",
        body: "Abound Food Care hosts the Orange County instance and owns the operational data, the pantry relationships, and the routing decisions. The Abound dispatch team opens the console each morning and is accountable for the health of the network as a whole.",
        initials: "AFC",
      },
      {
        name: "A Million Dreams Consulting",
        role: "Co-product manager, domain expert, adoption lead",
        body: "A Million Dreams Consulting holds the coalition relationships across the OC Hunger Alliance, 211 OC, CalOptima, and the Anaheim school districts, and leads both the planner-view workflow design and the rollout to participating pantries.",
        initials: "AMDC",
      },
      {
        name: "Datawake",
        role: "Builder and maintainer",
        body: "Datawake is the software consultancy building the system, and long-term maintenance is included in the engagement. The codebase is open source on GitHub, and Datawake maintains the upstream project across instances.",
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
        body: "Every participating site is listed with its current profile, storage capability, distribution model, and weekly schedule.",
      },
      {
        label: "Pantry self-service over SMS and email",
        body: "Short messages capture weekly schedule changes, capacity, and specific needs, and an LLM parses each reply and confirms the interpretation back to the operator without requiring a login or an app install.",
      },
      {
        label: "Abound dispatch console",
        body: "A single screen combining the supply pipeline, the distribution calendar, an LLM-ranked routing queue, and an alert bar for gaps, overlaps, and stale profiles.",
      },
      {
        label: "Strategic planner view",
        body: "A coverage heat map with a weekly LLM-authored brief and planner-drafted nudges suggesting pantries shift or merge their distribution times and locations.",
      },
      {
        label: "Case-manager search",
        body: "A natural-language query field that returns ranked pantries with plain-English reasoning attached to each result.",
      },
      {
        label: "Public read APIs",
        body: "Read endpoints for the directory and schedule, documented and versioned with OpenAPI.",
      },
      {
        label: "Partner feeds",
        body: "Imports from 211 OC and coalition agencies where data-sharing contracts allow, while Second Harvest remains separate in keeping with their policy.",
      },
      {
        label: "Open-source release",
        body: "A public GitHub repository under an MIT or Apache 2.0 license, available for other counties or coalitions to fork and deploy.",
      },
    ],
    timeline: [
      { when: "Grant award", what: "Project kickoff, data-sharing contracts, and a signed governance model." },
      { when: "Month 3", what: "MVP release covering the directory, pantry self-service, and case-manager search." },
      { when: "Month 6", what: "Full V1 adds the dispatch console, the planner view, and the public read APIs." },
      { when: "Ongoing", what: "Ongoing maintenance, partner onboarding, and a quarterly release cadence." },
    ],
  },

  footer: {
    credit: "",
    disclaimer: "This site is a proposal demo. Every pantry, supplier, and distribution shown is fabricated; none of the names, addresses, or schedules refer to real Anaheim sites. The live coordination platform will ship with real data once Abound and the coalition agencies are on board.",
  },
};
