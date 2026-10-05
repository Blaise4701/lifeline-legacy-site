import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { WylieSeminarRegistration } from "./wylie-seminar-registration";
import styles from "./wylie.module.css";

export const metadata: Metadata = {
  title: "Free Retirement Seminar in Wylie - October 12",
  description:
    "Join Lifeline Legacy Financial Group in Wylie on October 12 at 6:00 PM for a free educational seminar on building a clearer retirement roadmap.",
  openGraph: {
    title: "Build Your Retirement Roadmap - Free Wylie Seminar",
    description:
      "Learn how retirement income, Social Security, taxes, withdrawals, healthcare, longevity, and survivor planning fit together.",
    url: "https://lifelinelegacyfinancial.com/wylie-retirement-seminar",
    type: "website",
  },
};

const topics = [
  "How to turn retirement savings into retirement income",
  "How Social Security fits into your retirement roadmap",
  "Why market losses can affect retirement differently",
  "How taxes and withdrawal order can affect what you keep",
  "How to identify potential retirement income gaps",
  "Why a written retirement income plan matters",
];

export default function WylieRetirementSeminarPage() {
  return (
    <main id="main-content" className={`${styles.page} wylie-landing-page`}>
      <section className={styles.topBar}>
        <div className={styles.topBarInner}>
          <Image
            src="/brand/llfg-logo.png"
            alt="Lifeline Legacy Financial Group"
            width={260}
            height={87}
            priority
            className={styles.logo}
          />
          <a className={styles.phone} href="tel:+19727648516">Questions? 972-764-8516</a>
        </div>
      </section>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Free Educational Retirement Seminar · Wylie, Texas</p>
            <h1>Are You Within 10 Years of Retirement?</h1>
            <p className={styles.heroLead}>
              Build a clearer retirement roadmap before the paycheck stops.
            </p>
            <p className={styles.heroSupport}>
              Learn how retirement income, Social Security, taxes, withdrawals, healthcare,
              longevity, and survivor planning fit together - so you can make better decisions
              before retirement.
            </p>

            <div className={styles.eventStrip}>
              <div>
                <span>MON</span>
                <strong>OCT 12</strong>
              </div>
              <div>
                <span>TIME</span>
                <strong>6:00 PM</strong>
              </div>
              <div>
                <span>LOCATION</span>
                <strong>Wylie, TX</strong>
              </div>
            </div>

            <a className={styles.primaryCta} href="#register">Reserve My Free Seat</a>
            <p className={styles.microcopy}>No charge to attend · Designed for adults age 50+ · Seating is limited</p>
          </div>

          <aside className={styles.heroCard} aria-label="Seminar details">
            <p className={styles.cardKicker}>Retirement Mindset &amp; Roadmap</p>
            <h2>Turn uncertainty into a coordinated retirement plan.</h2>
            <div className={styles.locationBlock}>
              <strong>Rita &amp; Truett Smith Public Library</strong>
              <span>300 Country Club Road, Building 300</span>
              <span>Wylie, TX 75098</span>
            </div>
            <ul>
              <li>Monday, October 12</li>
              <li>6:00 PM</li>
              <li>Free educational event</li>
            </ul>
            <a className={styles.secondaryCta} href="#register">Save My Seat</a>
          </aside>
        </div>
      </section>

      <section className={styles.proofBand}>
        <div className={styles.proofInner}>
          <div><strong>Education first</strong><span>No sales presentation</span></div>
          <div><strong>Practical roadmap</strong><span>Focus on real retirement decisions</span></div>
          <div><strong>Local event</strong><span>Hosted in Wylie</span></div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contentNarrow}>
          <p className={styles.eyebrowDark}>What you&apos;ll learn</p>
          <h2>A retirement date is not a retirement plan.</h2>
          <p className={styles.sectionIntro}>
            Many people spend decades accumulating money, then reach retirement without a written
            strategy for how those resources will actually create income. This seminar is designed
            to help you organize the decisions that matter most before retirement.
          </p>

          <div className={styles.topicGrid}>
            {topics.map((topic) => (
              <div className={styles.topicCard} key={topic}>
                <span aria-hidden="true">✓</span>
                <p>{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.framework}>
        <div className={styles.frameworkInner}>
          <p className={styles.frameworkQuote}>
            Retirement should not be a collection of accounts. It should be a coordinated plan.
          </p>
          <div className={styles.frameworkLabel}>The Continuity Bridge™ Framework</div>
          <div className={styles.frameworkPillars}>
            <span>Continuity</span><span>Certainty</span><span>Legacy</span>
          </div>
        </div>
      </section>

      <section className={styles.sectionAlt}>
        <div className={styles.whyGrid}>
          <div>
            <p className={styles.eyebrowDark}>Why attend?</p>
            <h2>Retirement changes the questions you need to answer.</h2>
            <p>
              Once the paycheck stops, performance is only one part of the picture. You also need
              to think about how much income you need, where it comes from first, when to claim
              Social Security, how taxes affect withdrawals, and how your plan holds up if life or
              markets do not cooperate.
            </p>
            <p>
              You will leave with a clearer understanding of what is already in place, where
              potential gaps may exist, and which retirement decisions deserve attention next.
            </p>
            <div className={styles.presenter}>
              <Image
                src="/brand/blaise-tamo.png"
                alt="Blaise Tamo"
                width={110}
                height={110}
                className={styles.presenterImage}
              />
              <div>
                <strong>Blaise Tamo</strong>
                <span>Founder &amp; CEO</span>
                <span>Retirement Income &amp; Legacy Protection Specialist</span>
              </div>
            </div>
          </div>

          <div className={styles.questionCard}>
            <p>Can your current plan answer these questions?</p>
            <ul>
              <li>How much monthly income will retirement require?</li>
              <li>Which income source should be used first?</li>
              <li>When should Social Security begin?</li>
              <li>What happens during a market downturn?</li>
              <li>How will taxes affect your withdrawals?</li>
              <li>What happens if retirement lasts 25 or 30 years?</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.registrationSection} id="register">
        <div className={styles.registrationInner}>
          <div className={styles.registrationCopy}>
            <p className={styles.eyebrow}>Monday, October 12 · 6:00 PM</p>
            <h2>Reserve your seat while space is available.</h2>
            <p>
              Registration takes about one minute. Bring your questions - no preparation is required.
            </p>
            <div className={styles.locationMini}>
              <strong>Rita &amp; Truett Smith Public Library</strong>
              <span>300 Country Club Road, Building 300</span>
              <span>Wylie, TX 75098</span>
            </div>
          </div>
          <div className={styles.formWrap}>
            <WylieSeminarRegistration />
          </div>
        </div>
      </section>

      <footer className={styles.localFooter}>
        <div>
          <Image
            src="/brand/llfg-logo.png"
            alt="Lifeline Legacy Financial Group"
            width={220}
            height={73}
            className={styles.footerLogo}
          />
          <p>Protecting Families. Building Legacies.</p>
        </div>
        <div className={styles.footerLegal}>
          <p>
            This event is for educational purposes only. No products will be sold at the event.
            Lifeline Legacy Financial Group provides life insurance and annuity education and services.
            This presentation is not intended to provide individualized legal, tax, or investment advice.
          </p>
          <p>
            This event is not sponsored by, affiliated with, or endorsed by the Rita &amp; Truett Smith
            Public Library or the City of Wylie.
          </p>
          <p>
            <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms</Link> · <Link href="/disclosures">Disclosures</Link>
          </p>
        </div>
      </footer>

      <a className={styles.mobileStickyCta} href="#register">Reserve My Free Seat</a>
    </main>
  );
}
