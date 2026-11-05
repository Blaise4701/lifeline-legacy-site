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
    id: "plano-november-21-catch-up",
    series: "november-fall",
    eventType: "Workshop + Q&A",
    dateTime: "2026-11-21T10:00:00-06:00",
    endDateTime: "2026-11-21T12:30:00-06:00",
    registrationDeadline: "2026-11-19T00:00:00-06:00",
    date: "November 21, 2026",
    shortDate: "Nov 21",
    time: "10:00 AM to 12:30 PM",
    title: "You’re Not Too Late: A 10-Year Retirement Catch-Up Plan",
    subtitle: "Practical retirement planning and a fresh mindset, starting where you are.",
    description: "Join Blaise D. Tamo and May K. Li, PhD for a free public workshop combining retirement education, mindset, and practical next steps for people who feel behind on retirement preparation.",
    outcome: "Leave with a clearer picture of your retirement income needs, priorities for the next decade, and practical next steps to discuss with your financial and tax professionals.",
    highlights: [
      "Assess where you are and define a realistic retirement income goal",
      "Explore saving priorities and Social Security considerations",
      "Identify risks, income gaps, and decisions to coordinate",
      "Build your next steps with a more constructive mindset",
    ],
    location: "Harrington Library",
    address: "1501 18th St, Plano, TX 75074",
    preparation: standardEventPreparation,
    reminders: standardEventReminders,
    capacity: null,
  },
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
    eventType: "Workshop + Seminar",
    dateTime: "2026-11-12T14:00:00-06:00",
    // The evening seminar can still be booked after the afternoon workshop starts.
    // The API closes each session at its own start time.
    registrationDeadline: "2026-11-12T17:00:00-06:00",
    date: "November 12, 2026",
    shortDate: "Nov 12",
    time: "2:00 PM to 7:00 PM",
    title: "Retirement Income Explained",
    subtitle: "How to Turn Your Retirement Savings Into a Retirement Paycheck",
    description:
      "A free Dallas retirement education event. Choose the hands-on afternoon workshop, the evening educational seminar, or attend both.",
    outcome:
      "Leave with a clearer understanding of how your retirement income sources work together and the decisions to review before choosing a strategy.",
    highlights: [
      "How Social Security, pensions, and savings fit together",
      "Monthly income needs and potential income gaps",
      "Withdrawal order and tax considerations",
      "Inflation, market volatility, longevity, and survivor income",
    ],
    parts: [
      {
        time: "2:00 PM to 5:00 PM",
        title: "Afternoon Workshop: Build Your Written Retirement Paycheck Plan",
        outcome: "A hands-on working session toward a first-draft retirement income map.",
      },
      {
        time: "5:00 PM to 7:00 PM",
        title: "Evening Seminar: Retirement Income Explained",
        outcome: "An educational presentation on the major retirement income decisions.",
      },
    ],
    location: "Fretz Park Branch Library",
    address: "6990 Belt Line Road · Dallas, TX 75254",
    endDateTime: "2026-11-12T19:00:00-06:00",
    registrationHref: "/retirement-income-explained",
    registrationLabel: "Reserve My Free Seat",
    preparation:
      "Workshop attendees may bring general information about their retirement income goals, expenses, and income sources. Please do not bring or share account numbers, Social Security numbers, or passwords.",
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
