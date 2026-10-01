export const site = {
  name: "Lifeline Legacy Financial Group",
  shortName: "LLFG",
  phone: "972-764-8516",
  phoneHref: "tel:+19727648516",
  cell: "469-354-9924",
  cellHref: "tel:+14693549924",
  email: "info@lifelinelegacyfinancial.com",
  emailHref: "mailto:info@lifelinelegacyfinancial.com",
  location: "Dallas-Fort Worth, Texas",
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
      "Which resource is used first, and why?",
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

export const standardEventPreparation = "No preparation is required. Bring your questions.";
export const writtenPlanPreparation =
  "Please bring any retirement information you are comfortable using during the workshop, such as Social Security estimates, pension information, retirement account statements, or a simple list of your retirement accounts. Do not share sensitive account credentials or passwords.";

// These settings are copied into each event's GHL workflow. They do not schedule messages in the website.
export const standardEventReminders = {
  dayBeforeEmail: true,
  dayBeforeSms: true,
  twoHoursBeforeEmail: true,
  twoHoursBeforeSms: true,
  oneHourBeforeSms: false,
} as const;

export const workshops = [
  {
    id: "retirement-countdown",
    series: "renner-fall",
    eventType: "Seminar",
    dateTime: "2026-09-29T18:00:00-05:00",
    date: "September 29, 2026",
    shortDate: "Sep 29",
    time: "6:00 PM",
    title: "The 10-Year Retirement Countdown",
    subtitle: "What to Know Before the Paycheck Stops",
    description:
      "A practical look at the decisions that become more important in the final 10 years before retirement, from income needs and Social Security timing to taxes, healthcare, market risk, and survivor planning.",
    outcome:
      "Leave knowing which retirement decisions are time-sensitive, what should be coordinated before the paycheck stops, and where your current preparation may have gaps.",
    highlights: [
      "The shift from accumulation to retirement income",
      "Social Security, pension, and benefit timing",
      "Taxes, healthcare, longevity, and sequence risk",
      "The first five years after retirement",
    ],
    location: "Renner Frankford Branch Library",
    address: "6400 Frankford Road · Dallas, TX 75252",
    registrationClosed: true,
    endDateTime: null,
    preparation: standardEventPreparation,
    reminders: standardEventReminders,
    capacity: null,
  },
  {
    id: "assumptions-meet-reality",
    series: "renner-fall",
    eventType: "Seminar",
    dateTime: "2026-10-01T18:00:00-05:00",
    date: "October 1, 2026",
    shortDate: "Oct 01",
    time: "6:00 PM",
    title: "When Assumptions Meet Reality",
    subtitle: "The Hidden Risks That Can Disrupt Your Retirement Plan",
    description:
      "A deeper retirement-risk seminar built around the assumptions many plans depend on, including market returns, spending, inflation, longevity, healthcare, taxes, and survivor income.",
    outcome:
      "Leave knowing which assumptions your retirement plan depends on and which ones deserve to be stress-tested before retirement.",
    highlights: [
      "Sequence-of-returns risk",
      "Inflation, longevity, and healthcare exposure",
      "Survivor income and tax changes",
      "How to stress-test a retirement plan",
    ],
    location: "Renner Frankford Branch Library",
    address: "6400 Frankford Road · Dallas, TX 75252",
    endDateTime: null,
    preparation: standardEventPreparation,
    reminders: standardEventReminders,
    capacity: null,
  },
  {
    id: "written-retirement-income-plan",
    series: "renner-fall",
    eventType: "Workshop",
    dateTime: "2026-10-03T11:00:00-05:00",
    date: "October 3, 2026",
    shortDate: "Oct 03",
    time: "11:00 AM-1:00 PM",
    title: "Build Your Written Retirement Income Plan",
    subtitle: "Leave With a First Draft of Your Retirement Paycheck Plan",
    description:
      "A hands-on working session for organizing retirement income needs, dependable income sources, Social Security and pension decisions, account information, and a first-draft withdrawal approach.",
    outcome:
      "Leave with a first-draft retirement paycheck plan, a list of what is already in place, and a clear list of gaps and next steps.",
    highlights: [
      "Estimate your retirement income need",
      "Map Social Security, pensions, and other income",
      "Inventory retirement accounts",
      "Build and stress-test a first withdrawal sequence",
    ],
    location: "Renner Frankford Branch Library",
    address: "6400 Frankford Road · Dallas, TX 75252",
    endDateTime: "2026-10-03T13:00:00-05:00",
    preparation: writtenPlanPreparation,
    reminders: standardEventReminders,
    capacity: null,
  },
  {
    id: "wylie-october-06",
    series: "wylie-fall",
    eventType: "Seminar",
    dateTime: "2026-10-06T18:00:00-05:00",
    date: "October 6, 2026",
    shortDate: "Oct 06",
    time: "6:00 PM",
    title: "Reduce Retirement Risk. Build More Reliable Income.",
    subtitle: "How to Create a Retirement Income Strategy Designed for Changing Markets and Changing Life",
    description:
      "Learn how market risk, inflation, longevity, taxes, healthcare, and survivor income can affect the retirement paycheck, and how a coordinated income strategy can create more resilience.",
    outcome:
      "Leave able to identify the major risks to your retirement income and the building blocks of a more reliable retirement paycheck.",
    highlights: [
      "Sequence-of-returns risk",
      "Inflation and longevity",
      "Taxes and withdrawal order",
      "Healthcare and survivor income",
    ],
    location: "Rita & Truett Smith Public Library",
    address: "300 Country Club Road, Building 300 · Wylie, TX 75098",
    endDateTime: null,
    preparation: standardEventPreparation,
    reminders: standardEventReminders,
    capacity: null,
  },
  {
    id: "wylie-october-12",
    series: "wylie-fall",
    eventType: "Seminar",
    dateTime: "2026-10-12T18:00:00-05:00",
    date: "October 12, 2026",
    shortDate: "Oct 12",
    time: "6:00 PM",
    title: "Retirement Mindset & Roadmap",
    subtitle: "Turn Uncertainty Into a Retirement Plan",
    description:
      "Shift from accumulation-only thinking to a coordinated retirement roadmap that connects income, Social Security, taxes, withdrawals, healthcare, longevity, and survivor planning.",
    outcome:
      "Leave understanding the retirement decisions you need to make, the order in which they fit together, and where your current roadmap may have gaps.",
    highlights: [
      "Accumulation versus retirement-income thinking",
      "Why performance is only one piece",
      "The retirement decision roadmap",
      "Common gaps before retirement",
    ],
    location: "Rita & Truett Smith Public Library",
    address: "300 Country Club Road, Building 300 · Wylie, TX 75098",
    endDateTime: null,
    preparation: standardEventPreparation,
    reminders: standardEventReminders,
    capacity: null,
  },
  {
    id: "wylie-october-29",
    series: "wylie-fall",
    eventType: "Workshop",
    dateTime: "2026-10-29T18:00:00-05:00",
    date: "October 29, 2026",
    shortDate: "Oct 29",
    time: "6:00 PM",
    title: "Build Your Written Retirement Income Plan",
    subtitle: "Leave With a First Draft of Your Retirement Paycheck Plan",
    description:
      "A hands-on retirement planning workshop for turning your income sources, Social Security and pension decisions, retirement accounts, and withdrawal ideas into a first written retirement-paycheck draft.",
    outcome:
      "Leave with a first-draft retirement income map, a first-draft paycheck plan, and a list of gaps and next steps.",
    highlights: [
      "Define your retirement paycheck",
      "Map dependable income sources",
      "Identify the income gap",
      "Build a first withdrawal sequence",
    ],
    location: "Rita & Truett Smith Public Library",
    address: "300 Country Club Road, Building 300 · Wylie, TX 75098",
    endDateTime: null,
    preparation: writtenPlanPreparation,
    reminders: standardEventReminders,
    capacity: null,
  },
  {
    id: "november-10-first-five-years",
    series: "november-fall",
    eventType: "Seminar",
    dateTime: "2026-11-10T18:00:00-06:00",
    date: "November 10, 2026",
    shortDate: "Nov 10",
    time: "6:00 PM",
    title: "The First Five Years of Retirement",
    subtitle: "How Early Retirement Decisions Can Shape the Years That Follow",
    description:
      "Explore why the first years after the paycheck stops can be especially important, and how withdrawal order, Social Security timing, cash reserves, taxes, healthcare, and market conditions interact.",
    outcome:
      "Leave knowing which early-retirement decisions deserve the most attention and why flexibility can matter during the first five years.",
    highlights: [
      "Early-retirement sequence risk",
      "Withdrawal order and cash reserves",
      "Social Security and tax timing",
      "Building flexibility into the plan",
    ],
    location: "Location to be announced",
    address: "Dallas-Fort Worth area",
    cancelled: true,
    endDateTime: null,
    preparation: standardEventPreparation,
    reminders: standardEventReminders,
    capacity: null,
  },
  {
    id: "fretz-november-12-workshop",
    series: "november-fall",
    eventType: "Two-Part Workshop",
    dateTime: "2026-11-12T14:00:00-06:00",
    date: "November 12, 2026",
    shortDate: "Nov 12",
    time: "2:00-7:30 PM",
    title: "Build Your Written Retirement Income Plan",
    subtitle: "A Two-Part Hands-On Retirement Planning Workshop",
    description:
      "An extended hands-on workshop that moves from building your retirement income map to stress-testing and strengthening a first-draft retirement paycheck plan.",
    outcome:
      "Leave with a first-draft Retirement Paycheck Plan, a clearer withdrawal approach, and a written list of risks, gaps, and next actions.",
    highlights: [
      "Part 1: Build your retirement paycheck and income map",
      "Part 2: Stress-test and strengthen the plan",
      "Withdrawal order, taxes, healthcare, and longevity",
      "Survivor income, legacy coordination, and next steps",
    ],
    parts: [
      {
        time: "2:00-4:15 PM",
        title: "Part 1: Build Your Retirement Paycheck",
        outcome: "Create a first-draft retirement income map.",
      },
      {
        time: "4:45-7:00 PM",
        title: "Part 2: Stress-Test & Complete Your Retirement Paycheck Plan",
        outcome: "Strengthen the draft and identify gaps and next actions.",
      },
      {
        time: "7:00-7:30 PM",
        title: "Q&A and Planning Conversations",
        outcome: "Ask questions and clarify next steps.",
      },
    ],
    location: "Fretz Park Branch Library",
    address: "6990 Belt Line Road · Dallas, TX 75254",
    endDateTime: "2026-11-12T19:30:00-06:00",
    preparation: writtenPlanPreparation,
    reminders: standardEventReminders,
    capacity: null,
  },
  {
    id: "renner-november-14-workshop",
    series: "november-fall",
    eventType: "Workshop",
    dateTime: "2026-11-14T10:00:00-06:00",
    date: "November 14, 2026",
    shortDate: "Nov 14",
    time: "10:00 AM",
    title: "Build Your Written Retirement Income Plan",
    subtitle: "Leave With a First Draft of Your Retirement Paycheck Plan",
    description:
      "A hands-on workshop for organizing income needs, Social Security and pension decisions, account information, and a first-draft withdrawal approach into one written retirement-income structure.",
    outcome:
      "Leave with a first-draft retirement paycheck plan and a practical list of what is in place, what needs review, and what comes next.",
    highlights: [
      "Retirement income target",
      "Income-source and account inventory",
      "Social Security and pension considerations",
      "Withdrawal sequence, risks, and next steps",
    ],
    location: "Renner Frankford Branch Library",
    address: "6400 Frankford Road · Dallas, TX 75252",
    endDateTime: null,
    preparation: writtenPlanPreparation,
    reminders: standardEventReminders,
    capacity: null,
  },
] as const;

export const disclosure =
  "Lifeline Legacy Financial Group provides life insurance and annuity education and services. Blaise Tamo is a licensed insurance professional and does not offer securities or investment advisory services. Content is for general educational purposes only and is not legal, tax, or investment advice. Product availability and features vary by state and carrier, and all applications are subject to carrier approval. Guarantees are backed by the claims-paying ability of the issuing insurance company.";
