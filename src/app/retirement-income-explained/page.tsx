import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMetadata, canonicalSiteUrl } from "@/lib/seo";
import { site } from "@/lib/site-data";
import { RIE_PATH, rieEvent, rieSessions } from "@/lib/retirement-income-explained";
import { RegistrationForm } from "./registration-form";
import { SessionCta } from "./session-cta";
import { PageView } from "./page-view";
import styles from "./rie.module.css";

const baseMetadata = pageMetadata({
  title: "Retirement Income Explained: Free Dallas Retirement Event, Nov 12",
  description:
    "Free retirement education event in Dallas on Thursday, November 12, 2026 at Fretz Park Branch Library. Afternoon workshop 2:00 to 5:00 PM, evening seminar 5:00 to 7:00 PM. Register for one session or both.",
  path: RIE_PATH,
  keywords: ["retirement income seminar Dallas", "retirement workshop Dallas", "Fretz Park Library event", "retirement paycheck plan"],
});

export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: { ...baseMetadata.openGraph, type: "website" },
  twitter: { ...baseMetadata.twitter, card: "summary_large_image" },
};

const eventJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationEvent",
  name: `${rieEvent.title}: ${rieEvent.subtitle}`,
  description:
    "A free educational retirement income event in Dallas with a hands-on afternoon workshop and an evening educational seminar. Attend either session or both.",
  startDate: rieSessions.both.start,
  endDate: rieSessions.both.end,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  isAccessibleForFree: true,
  inLanguage: "en-US",
  url: `${canonicalSiteUrl}${RIE_PATH}`,
  image: [`${canonicalSiteUrl}${RIE_PATH}/opengraph-image`],
  location: {
    "@type": "Place",
    name: rieEvent.venue,
    address: {
      "@type": "PostalAddress",
      streetAddress: rieEvent.street,
      addressLocality: "Dallas",
      addressRegion: "TX",
      postalCode: "75254",
      addressCountry: "US",
    },
  },
  organizer: { "@type": "Organization", name: site.name, url: canonicalSiteUrl },
  performer: { "@type": "Person", name: "Blaise D. Tamo" },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${canonicalSiteUrl}${RIE_PATH}#register`,
    validFrom: "2026-11-05T00:00:00-06:00",
  },
  subEvent: (["workshop", "seminar"] as const).map((key) => ({
    "@type": "EducationEvent",
    name: `${rieSessions[key].label}: ${rieSessions[key].title}`,
    startDate: rieSessions[key].start,
    endDate: rieSessions[key].end,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    isAccessibleForFree: true,
    location: { "@type": "Place", name: rieEvent.venue, address: rieEvent.address },
  })),
};

const workshopItems = [
  "Monthly retirement income needs.",
  "Social Security, pension, and other dependable income sources.",
  "Retirement savings and account inventory.",
  "Potential retirement income gaps.",
  "An initial withdrawal sequence.",
  "Important risks and planning questions.",
];

const seminarItems = [
  "Why a retirement account is not automatically a retirement paycheck.",
  "How Social Security and pensions fit into retirement income.",
  "The role of withdrawal order and tax considerations.",
  "Inflation, market volatility, and longevity.",
  "How income needs change throughout retirement.",
  "Survivor income and family protection considerations.",
];

const questions = [
  "How much monthly income will I need?",
  "When should I consider starting Social Security?",
  "Which retirement accounts might I draw from first?",
  "How could taxes, inflation, and market downturns affect my retirement?",
  "What happens to my spouse or family if something changes?",
];

const audience = [
  "You expect to retire within the next 5 to 10 years.",
  "You recently retired and want a clearer income strategy.",
  "You have retirement accounts but no coordinated written income plan.",
  "You are uncertain how Social Security, taxes, and withdrawals fit together.",
  "You want to better understand risks to your retirement income.",
  "You want practical financial education without a commitment to purchase anything.",
];

const faqs = [
  {
    q: "Is the event free?",
    a: "Yes. Admission is free for both sessions. Registration is required so we can plan seating and send your confirmation.",
  },
  {
    q: "Can I attend only the evening seminar?",
    a: "Yes. Choose “Evening Seminar | 5:00 PM to 7:00 PM” when you register. The seminar stands on its own.",
  },
  {
    q: "Can I attend the afternoon workshop and evening seminar?",
    a: "Yes. Choose “Both Sessions | 2:00 PM to 7:00 PM.” The workshop runs from 2:00 to 5:00 PM and the seminar follows from 5:00 to 7:00 PM.",
  },
  {
    q: "Should I bring my spouse or a guest?",
    a: "You are welcome to. Retirement income decisions often affect both partners. You can register one guest on the form, and your guest is included in your seat count for the same session.",
  },
  {
    q: "What should I bring to the workshop?",
    a: "Bring your questions, and if you like, general information about your retirement income goals, monthly expenses, and income sources. Do not bring or share account numbers, Social Security numbers, passwords, or financial statements.",
  },
  {
    q: "Is this an educational event or a sales presentation?",
    a: "This is an educational event. The focus is on how retirement income works and the questions worth answering. Attending does not create any obligation to purchase anything.",
  },
  {
    q: "Will I receive individual financial advice?",
    a: "No. The event provides general education only, not individualized financial, investment, legal, or tax advice. If you would like to talk about your own situation afterward, you can request a separate Continuity Review.",
  },
  {
    q: "Where is the library located?",
    a: `${rieEvent.venue}, ${rieEvent.address}.`,
  },
];

function EventFacts({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <dl className={styles.facts} data-tone={tone}>
      <div>
        <dt>Date</dt>
        <dd>{rieEvent.dayDate}</dd>
      </div>
      <div>
        <dt>Sessions</dt>
        <dd>
          Afternoon Workshop · {rieSessions.workshop.time}
          <br />
          Evening Seminar · {rieSessions.seminar.time}
          <br />
          <small>{rieEvent.timeZoneLabel}</small>
        </dd>
      </div>
      <div>
        <dt>Location</dt>
        <dd>
          {rieEvent.venue}
          <br />
          <a href={rieEvent.mapsUrl} target="_blank" rel="noopener noreferrer">{rieEvent.address}</a>
        </dd>
      </div>
    </dl>
  );
}

export default function RetirementIncomeExplainedPage() {
  return (
    <main id="main-content" className={styles.page}>
      <PageView />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd).replace(/</g, "\\u003c") }}
      />

      <p className={styles.announce}>
        <span>Free Dallas retirement education event</span>
        <span aria-hidden="true">|</span>
        <span>November 12, 2026</span>
        <span aria-hidden="true">|</span>
        <span>Fretz Park Library</span>
      </p>

      {/* SECTION 1 + 2: Hero and registration */}
      <section className={styles.hero} aria-labelledby="rie-title">
        <Image
          src="/brand/lifeline-home-hero-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.heroImage}
        />
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroIntro}>
            <p className={styles.eyebrow}>With Blaise D. Tamo · Lifeline Legacy Financial Group</p>
            <h1 id="rie-title" className={styles.heroTitle}>Retirement Income Explained</h1>
            <p className={styles.heroSub}>
              You Spent Years Building Your Retirement Savings. Now Learn How to Turn Them Into a Retirement Paycheck.
            </p>
            <p className={styles.heroText}>
              Retirement changes the financial questions you need to answer. It is no longer only about how much you have saved.
              It is about how your savings, Social Security, pensions, and other income sources work together to support the retirement you want.
            </p>
            <p className={styles.heroText}>
              Join Blaise D. Tamo for a free educational event in Dallas. Choose the hands-on afternoon workshop, the evening seminar, or attend both.
            </p>
          </div>

          <div className={styles.heroForm}>
            <RegistrationForm />
          </div>

          <div className={styles.heroMore}>
            <ul className={styles.benefits}>
              <li>Understand how retirement income works.</li>
              <li>Identify important risks and planning decisions.</li>
              <li>Leave with clearer next steps for your retirement.</li>
            </ul>
            <EventFacts />
            <SessionCta className={`button ${styles.heroCta}`}>Reserve My Free Seat</SessionCta>
          </div>
        </div>
      </section>

      {/* SECTION 3: Choose your experience */}
      <section className={`section ${styles.sessions}`} aria-labelledby="rie-sessions">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="eyebrow">Choose your retirement experience</p>
            <h2 id="rie-sessions">Two Ways to Learn. One Important Retirement Conversation.</h2>
          </div>
          <div className={styles.cardGrid}>
            <article className={styles.sessionCard}>
              <p className={styles.cardKicker}>Option A · The Afternoon Workshop</p>
              <p className={styles.cardTime}>{rieSessions.workshop.time}</p>
              <h3>Build Your Written Retirement Paycheck Plan</h3>
              <p>A practical working session to organize your retirement income picture and work toward a first-draft retirement paycheck plan.</p>
              <p className={styles.listLabel}>Participants will work through:</p>
              <ul className={styles.checkList}>
                {workshopItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className={styles.takeaway}><strong>Takeaway:</strong> Leave with a first-draft retirement income map and a list of decisions to review.</p>
              <SessionCta session="workshop">Reserve Workshop Seat</SessionCta>
            </article>

            <article className={styles.sessionCard}>
              <p className={styles.cardKicker}>Option B · The Evening Seminar</p>
              <p className={styles.cardTime}>{rieSessions.seminar.time}</p>
              <h3>Retirement Income Explained</h3>
              <p>An educational presentation on how Social Security, pensions, retirement savings, taxes, withdrawal decisions, and retirement risks interact.</p>
              <p className={styles.listLabel}>Explore:</p>
              <ul className={styles.checkList}>
                {seminarItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className={styles.takeaway}><strong>Takeaway:</strong> Understand the major retirement income decisions and the questions to ask before choosing a strategy.</p>
              <SessionCta session="seminar">Reserve Seminar Seat</SessionCta>
            </article>
          </div>

          <div className={styles.bothBand}>
            <div>
              <p className={styles.cardKicker}>Option C · Both Sessions</p>
              <h3>Attend the workshop and the seminar · {rieSessions.both.time}</h3>
              <p>Build your first-draft income map in the afternoon, then see the bigger retirement income picture in the evening.</p>
            </div>
            <SessionCta session="both" className={`button ${styles.goldButton}`}>Reserve Both Sessions</SessionCta>
          </div>
        </div>
      </section>

      {/* SECTION 4: Why this matters */}
      <section className={`section section-paper ${styles.why}`} aria-labelledby="rie-why">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="eyebrow">Why this matters</p>
            <h2 id="rie-why">You May Have a Retirement Portfolio. But Do You Have a Retirement Income Plan?</h2>
            <p>
              Saving for retirement and planning retirement income are different jobs. During your working years, the focus is on building assets.
              In retirement, those assets, along with Social Security, pensions, and other sources, need to be organized into income you can understand and follow.
            </p>
          </div>
          <div className={styles.compare}>
            <div className={styles.compareCol}>
              <p className={styles.compareLabel}>Saving for retirement</p>
              <p className={styles.compareQuestion}>How much am I accumulating?</p>
            </div>
            <div className={styles.compareArrow} aria-hidden="true">→</div>
            <div className={`${styles.compareCol} ${styles.compareFocus}`}>
              <p className={styles.compareLabel}>Planning retirement income</p>
              <p className={styles.compareQuestion}>
                Where will my monthly income come from, how long might it need to last, and how will my income sources work together?
              </p>
            </div>
          </div>
          <p className={styles.note}>This event is educational. It explains the questions and trade-offs involved. It does not promise any particular income, investment performance, or financial outcome.</p>
        </div>
      </section>

      {/* SECTION 5: Five questions */}
      <section className={`section ${styles.questions}`} aria-labelledby="rie-questions">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="eyebrow">Before you retire</p>
            <h2 id="rie-questions">Five Questions Worth Answering Before You Retire</h2>
          </div>
          <ol className={styles.questionList}>
            {questions.map((question, index) => (
              <li key={question}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p>{question}</p>
              </li>
            ))}
          </ol>
          <p className={styles.centerCta}><SessionCta>Save My Seat</SessionCta></p>
        </div>
      </section>

      {/* SECTION 6: Presenter */}
      <section className={`section section-paper ${styles.presenter}`} aria-labelledby="rie-presenter">
        <div className={`container ${styles.presenterGrid}`}>
          <div className={styles.presenterPhoto}>
            <Image
              src="/brand/blaise-tamo-about.jpg"
              alt="Blaise D. Tamo, Founder and CEO of Lifeline Legacy Financial Group"
              width={1000}
              height={1250}
              sizes="(max-width: 900px) 80vw, 420px"
            />
          </div>
          <div>
            <p className="eyebrow">Meet your presenter</p>
            <h2 id="rie-presenter">Blaise D. Tamo</h2>
            <p className={styles.presenterTitle}>Founder &amp; CEO, Lifeline Legacy Financial Group</p>
            <p>Blaise D. Tamo founded Lifeline Legacy Financial Group to help families, retirees, and business owners better coordinate the financial decisions that affect their future.</p>
            <p>Through the Continuity Bridge™ Framework, his work focuses on three principles: Continuity, Certainty, and Legacy.</p>
            <p>His educational approach begins with understanding people’s circumstances, identifying gaps, and helping them organize the decisions that deserve attention before choosing financial solutions.</p>
            <p className={styles.mission}>Protecting Families. Building Legacies.</p>
            <p className={styles.small}>Blaise D. Tamo is a licensed insurance professional. He is not a registered investment adviser and does not offer securities or investment advisory services.</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: Who should attend */}
      <section className={`section ${styles.audience}`} aria-labelledby="rie-audience">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="eyebrow">Who should attend?</p>
            <h2 id="rie-audience">This Event Is For You If...</h2>
          </div>
          <ul className={styles.audienceGrid}>
            {audience.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className={styles.note}>Open to the public. There is no minimum asset requirement to attend.</p>
        </div>
      </section>

      {/* SECTION 8: What to expect */}
      <section className={`section section-paper ${styles.expect}`} aria-labelledby="rie-expect">
        <div className={`container ${styles.expectGrid}`}>
          <div>
            <p className="eyebrow">What to expect</p>
            <h2 id="rie-expect">Come With Questions. Leave With More Clarity.</h2>
          </div>
          <div>
            <p>This is an educational event. You will hear plain-language explanations, see how the pieces of retirement income fit together, and have time to ask questions.</p>
            <p>Workshop attendees may bring general information about their retirement income goals, monthly expenses, and income sources to work with during the session.</p>
            <p><strong>Please do not bring or share</strong> account numbers, Social Security numbers, passwords, or financial statements. This registration form never asks for them.</p>
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className={`section ${styles.faq}`} aria-labelledby="rie-faq">
        <div className="container">
          <div className={styles.sectionHead}>
            <p className="eyebrow">Questions</p>
            <h2 id="rie-faq">Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map((item) => (
              <details key={item.q} className={styles.faqItem}>
                <summary>{item.q}</summary>
                <p>
                  {item.a}
                  {item.q.startsWith("Where") && (
                    <> <a href={rieEvent.mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps</a>.</>
                  )}
                  {item.q.startsWith("Will I receive") && (
                    <> <Link href="/continuity-review">Learn about the Continuity Review</Link>.</>
                  )}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: Final CTA */}
      <section className={styles.final} aria-labelledby="rie-final">
        <Image src="/brand/lifeline-home-hero-poster.jpg" alt="" fill sizes="100vw" className={styles.finalImage} />
        <div className={`container ${styles.finalInner}`}>
          <h2 id="rie-final">Your Retirement Deserves More Than Guesswork.</h2>
          <p>Join us November 12 in Dallas for a practical conversation about turning retirement savings into an organized retirement income plan.</p>
          <SessionCta className={`button ${styles.finalButton}`}>Reserve My Free Seat</SessionCta>
          <EventFacts tone="dark" />
          <p className={styles.finalHelp}>Questions or prefer to register by phone? Call <a href={site.phoneHref}>{site.phone}</a>.</p>
        </div>
      </section>

      {/* SECTION 11: Event disclosures (site footer follows with logo, links and firm disclosure) */}
      <section className={styles.disclosure} aria-label="Event disclosures">
        <div className="container">
          <p>
            This event is for general educational purposes only and does not provide individualized financial, investment, legal, or tax advice.
            No specific retirement outcome is guaranteed. Lifeline Legacy Financial Group is an independent event organizer.
            Use of the library venue does not imply endorsement by Dallas Public Library.
          </p>
          <p><Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms</Link> · <Link href="/disclosures">Disclosures</Link> · <Link href="/learn">All LLFG education events</Link></p>
        </div>
      </section>
    </main>
  );
}
