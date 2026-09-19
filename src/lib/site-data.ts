export const site = {
  name: "Lifeline Legacy Financial Group",
  shortName: "LLFG",
  phone: "972-764-8516",
  phoneHref: "tel:+19727648516",
  cell: "469-354-9924",
  cellHref: "tel:+14693549924",
  email: "info@lifelinelegacyfinancial.com",
  emailHref: "mailto:info@lifelinelegacyfinancial.com",
  location: "Dallas–Fort Worth, Texas",
  title:
    "Founder & CEO · Retirement Income & Legacy Protection Specialist",
};

export const primaryNav = [
  { href: "/continuity-bridge", label: "The Bridge" },
  { href: "/retirement-income", label: "Retirement" },
  { href: "/family-continuity", label: "Families" },
  { href: "/business-continuity", label: "Business" },
  { href: "/learn", label: "Learn" },
  { href: "/about", label: "About" },
] as const;

export const pillars = [
  {
    key: "continuity",
    number: "01",
    name: "Continuity",
    definition:
      "Keeping income, responsibilities, and family life moving when disruption occurs.",
    questions: [
      "If income paused, what keeps life moving?",
      "Who steps in, and do they know what to do?",
      "What protections back the plan?",
    ],
    coordinates: [
      "Income sources",
      "Household and business obligations",
      "Protection, healthcare, and caregiving plans",
    ],
    missing:
      "The rest of the plan may depend on income or people who are no longer available.",
  },
  {
    key: "certainty",
    number: "02",
    name: "Certainty",
    definition:
      "Turning separate financial pieces into one organized strategy with clearer decisions.",
    questions: [
      "Which resource is used first—and why?",
      "How do benefits, taxes, and timing interact?",
      "Where is the written sequence?",
    ],
    coordinates: [
      "Accounts and income sources",
      "Benefit and distribution timing",
      "Tax conversations with your tax professional",
    ],
    missing:
      "Good pieces can work at cross-purposes when each decision is made in isolation.",
  },
  {
    key: "legacy",
    number: "03",
    name: "Legacy",
    definition:
      "Helping what you built reach the people and purposes you intend, with less confusion.",
    questions: [
      "Do beneficiaries and documents still agree?",
      "Could the right people find what they need?",
      "How should ownership and responsibility transfer?",
    ],
    coordinates: [
      "Beneficiary intentions",
      "Legal documents and ownership",
      "Family and business transition conversations",
    ],
    missing:
      "Assets, documents, and intentions can drift apart as life and relationships change.",
  },
] as const;

export const pathways = [
  {
    label: "Retirement",
    href: "/retirement-income",
    title: "Turn accumulated assets into a written income sequence.",
    points: [
      "Monthly income needs",
      "Social Security and pension timing",
      "Withdrawal order and taxes",
      "Healthcare and long-term care",
    ],
  },
  {
    label: "Family",
    href: "/family-continuity",
    title: "Keep the household steady when life changes unexpectedly.",
    points: [
      "Income continuity",
      "Protection and responsibilities",
      "Documents and beneficiaries",
      "A clear family action plan",
    ],
  },
  {
    label: "Business",
    href: "/business-continuity",
    title: "Coordinate the company, the owner, and the people who rely on both.",
    points: [
      "Owner interruption",
      "Key people and obligations",
      "Ownership transition",
      "Owner retirement income",
    ],
  },
] as const;

export const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

export const licensedStates = [
  "Texas",
  "Arizona",
  "Florida",
  "Kansas",
  "Maine",
  "Michigan",
  "North Carolina",
  "Ohio",
] as const;

export const licensedStateCodes = ["TX", "AZ", "FL", "KS", "ME", "MI", "NC", "OH"] as const;

export const workshops = [
  {
    id: "retirement-countdown",
    eventType: "Seminar",
    dateTime: "2026-09-29T18:00:00-05:00",
    date: "September 29, 2026",
    shortDate: "Sep 29",
    time: "6:00 PM",
    title: "The 10-Year Retirement Countdown",
    description:
      "An educational seminar focused on the critical decisions to make during the 10 years leading up to retirement, including retirement income versus savings, Social Security timing, income sources, taxes, healthcare, and when retirement planning should begin.",
    location: "Renner Frankford Branch Library",
    address: "Dallas, Texas",
  },
  {
    id: "assumptions-meet-reality",
    eventType: "Seminar",
    dateTime: "2026-10-01T18:00:00-05:00",
    date: "October 1, 2026",
    shortDate: "Oct 01",
    time: "6:00 PM",
    title: "When Assumptions Meet Reality",
    description:
      "An educational seminar focused on the hidden risks that can disrupt a retirement plan, including market and sequence-of-returns risk, inflation, longevity, survivor income, estate-plan gaps, and what happens when retirement does not go according to plan.",
    location: "Renner Frankford Branch Library",
    address: "Dallas, Texas",
  },
  {
    id: "written-retirement-income-plan",
    eventType: "Workshop",
    dateTime: "2026-10-03T11:00:00-05:00",
    date: "October 3, 2026",
    shortDate: "Oct 03",
    time: "11:00 AM",
    title: "Build Your Written Retirement Income Plan",
    description:
      "A hands-on retirement income planning workshop where attendees can bring their numbers and begin building a written retirement income plan, covering income sources and needs, Social Security decisions, and withdrawal strategy.",
    location: "Renner Frankford Branch Library",
    address: "Dallas, Texas",
  },
  {
    id: "wylie-october-06",
    eventType: "Seminar",
    dateTime: "2026-10-06T18:00:00-05:00",
    date: "October 6, 2026",
    shortDate: "Oct 06",
    time: "6:00 PM",
    title: "Retirement Should Feel Like Freedom",
    description:
      "An education-first seminar about the decisions that shape retirement income, including Social Security timing, income sources, taxes, healthcare, market risk, inflation, longevity, and survivor income.",
    location: "Rita & Truett Smith Public Library",
    address: "300 Country Club Road, Building 300 · Wylie, Texas",
  },
  {
    id: "wylie-october-12",
    eventType: "Seminar",
    dateTime: "2026-10-12T18:00:00-05:00",
    date: "October 12, 2026",
    shortDate: "Oct 12",
    time: "6:00 PM",
    title: "Retirement Should Feel Like Freedom",
    description:
      "An education-first seminar about the decisions that shape retirement income, including Social Security timing, income sources, taxes, healthcare, market risk, inflation, longevity, and survivor income.",
    location: "Rita & Truett Smith Public Library",
    address: "300 Country Club Road, Building 300 · Wylie, Texas",
  },
  {
    id: "wylie-october-29",
    eventType: "Seminar",
    dateTime: "2026-10-29T18:00:00-05:00",
    date: "October 29, 2026",
    shortDate: "Oct 29",
    time: "6:00 PM",
    title: "Retirement Should Feel Like Freedom",
    description:
      "An education-first seminar about the decisions that shape retirement income, including Social Security timing, income sources, taxes, healthcare, market risk, inflation, longevity, and survivor income.",
    location: "Rita & Truett Smith Public Library",
    address: "300 Country Club Road, Building 300 · Wylie, Texas",
  },
  {
    id: "renner-november-10",
    eventType: "Seminar",
    dateTime: "2026-11-10T18:00:00-06:00",
    date: "November 10, 2026",
    shortDate: "Nov 10",
    time: "6:00 PM",
    title: "Retirement Should Feel Like Freedom",
    description:
      "An education-first seminar about the decisions that shape retirement income, including Social Security timing, income sources, taxes, healthcare, market risk, inflation, longevity, and survivor income.",
    location: "Renner Frankford Branch Library",
    address: "Dallas, Texas",
  },
  {
    id: "fretz-november-12-afternoon",
    eventType: "Seminar",
    dateTime: "2026-11-12T14:00:00-06:00",
    date: "November 12, 2026",
    shortDate: "Nov 12",
    time: "2:00 PM",
    title: "Retirement Should Feel Like Freedom",
    description:
      "An education-first seminar about the decisions that shape retirement income, including Social Security timing, income sources, taxes, healthcare, market risk, inflation, longevity, and survivor income.",
    location: "Fretz Park Branch Library",
    address: "Dallas, Texas",
  },
  {
    id: "fretz-november-12-evening",
    eventType: "Seminar",
    dateTime: "2026-11-12T18:00:00-06:00",
    date: "November 12, 2026",
    shortDate: "Nov 12",
    time: "6:00 PM",
    title: "Retirement Should Feel Like Freedom",
    description:
      "An education-first seminar about the decisions that shape retirement income, including Social Security timing, income sources, taxes, healthcare, market risk, inflation, longevity, and survivor income.",
    location: "Fretz Park Branch Library",
    address: "Dallas, Texas",
  },
  {
    id: "renner-november-14-workshop",
    eventType: "Workshop",
    dateTime: "2026-11-14T10:00:00-06:00",
    date: "November 14, 2026",
    shortDate: "Nov 14",
    time: "10:00 AM",
    title: "Retirement Should Feel Like Freedom",
    description:
      "A hands-on workshop for organizing income needs, Social Security and pension decisions, account information, and a first-draft withdrawal approach into a written retirement income plan.",
    location: "Renner Frankford Branch Library",
    address: "Dallas, Texas",
  },
] as const;

export const disclosure =
  "Lifeline Legacy Financial Group provides life insurance and annuity education and services. Blaise Tamo is a licensed insurance professional and does not offer securities or investment advisory services. Content is for general educational purposes only and is not legal, tax, or investment advice. Product availability and features vary by state and carrier, and all applications are subject to carrier approval. Guarantees are backed by the claims-paying ability of the issuing insurance company.";
