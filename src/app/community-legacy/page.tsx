import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import styles from "./community-legacy.module.css";

export const metadata = pageMetadata({
  title: "Community Legacy Initiative | Lifeline Legacy",
  description: "Understand your estate-planning options, explore Powers of Attorney through Estate Guru, and choose the support that works for your family.",
  path: "/community-legacy",
});

const estateDiscoveryCallUrl = "https://api.leadconnectorhq.com/widget/bookings/llfg-estate-discovery-call";

const pathways = [
  { title: "Self Service", label: "Complete it independently", description: "After your Estate Discovery Call, receive a secure link from Estate Guru and complete the document process at your own pace." },
  { title: "Assisted Service", label: "Get help getting started", description: "Lifeline Legacy helps you connect with Estate Guru, arrange your call, and navigate administrative onboarding." },
  { title: "Full Service", label: "Receive guided support", description: "After your Estate Discovery Call, an Estate Guru advisor guides you through the document process." },
];
const steps = [
  { title: "Start with a conversation.", description: "An Estate Discovery Call with Lifeline Legacy explains the documents, their general limitations, and the process." },
  { title: "Choose your support.", description: "Select Self Service, Assisted Service, or Full Service. The Discovery Call comes first for every pathway." },
  { title: "Complete your documents.", description: "Continue with Estate Guru for document preparation and instructions on signing and execution." },
];

export default function CommunityLegacyPage() {
  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero} aria-labelledby="legacy-title">
        <div className={styles.container + " " + styles.heroGrid}>
          <div>
            <p className={styles.kicker}>The Community Legacy Initiative</p>
            <h1 id="legacy-title">Help your loved ones know your wishes.</h1>
            <p className={styles.lede}>Prepare for the moments when someone you trust may need to act on your behalf. Start with clear education and estate-planning resources through Lifeline Legacy and Estate Guru.</p>
            <div className={styles.actions}>
              <a className={styles.primary} href={estateDiscoveryCallUrl}>Schedule your Estate Discovery Call</a>
              <a className={styles.lightLink} href="#how-it-works">See how it works</a>
            </div>
            <p className={styles.heroNote}>No insurance purchase or Lifeline Continuity Review is required.</p>
          </div>
          <aside className={styles.heroCard} aria-label="The purpose of planning ahead">
            <span className={styles.cardLabel}>For the people who matter most</span>
            <p className={styles.cardStatement}>Your wishes.<br />A trusted person.<br />A clearer path forward.</p>
            <p>Part of the Legacy pillar of the Continuity Bridge™.</p>
            <div className={styles.pillars}><span>Continuity.</span><span>Certainty.</span><span>Legacy.</span></div>
          </aside>
        </div>
      </section>

      <section id="your-options" className={styles.section} aria-labelledby="benefits-title">
        <div className={styles.container}>
          <div className={styles.heading}><p className={styles.kicker}>Understand your options</p><h2 id="benefits-title">Practical preparation for your family.</h2><p>Eligible participants can access Financial and Healthcare Powers of Attorney through Estate Guru at no cost for those documents.</p></div>
          <div className={styles.cards}>
            <article className={styles.card}><span className={styles.tag}>Financial decisions</span><h3>Financial Power of Attorney</h3><p>Generally allows someone you authorize to handle specified financial matters on your behalf, subject to the document and applicable law.</p><strong className={styles.benefit}>No cost for eligible participants.</strong></article>
            <article className={styles.card}><span className={styles.tag}>Healthcare decisions</span><h3>Healthcare Power of Attorney</h3><p>Generally names someone to make healthcare decisions when you cannot, subject to the document and applicable law.</p><strong className={styles.benefit}>No cost for eligible participants.</strong></article>
            <article className={styles.card}><span className={styles.tag}>Optional paid service</span><h3>Trust planning</h3><p>Explore trust planning through Estate Guru if you wish to consider additional estate-planning options.</p><strong className={styles.benefit}>A will is included with a purchased trust package.</strong></article>
          </div>
          <p className={styles.note}>Availability, eligibility, and document execution requirements depend on applicable law and provider requirements.</p>
        </div>
      </section>

      <section id="how-it-works" className={styles.softSection} aria-labelledby="steps-title">
        <div className={styles.container}>
          <div className={styles.heading}><p className={styles.kicker}>A clear first step</p><h2 id="steps-title">Understand first. Then move forward.</h2></div>
          <ol className={styles.steps}>{steps.map((step, index) => <li key={step.title}><span className={styles.number} aria-hidden="true">0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
          <div className={styles.callout}><strong>About your Estate Discovery Call</strong><p>This educational call is required before document completion. It is separate from a Lifeline Continuity Review or insurance consultation. Individual legal questions are referred to appropriately qualified Estate Guru professionals.</p><div className={styles.actions}><a className={styles.primary} href={estateDiscoveryCallUrl}>Schedule your Estate Discovery Call</a></div><p className={styles.note}>If you need help scheduling, contact <a href="mailto:info@lifelinelegacyfinancial.com">info@lifelinelegacyfinancial.com</a>. Please do not send legal documents or medical details by email.</p></div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="support-title">
        <div className={styles.container}>
          <div className={styles.heading}><p className={styles.kicker}>Support that fits your needs</p><h2 id="support-title">Choose how you want to proceed.</h2><p>Three service pathways are available, with no additional service fee. Optional trust planning remains a paid service.</p></div>
          <div className={styles.cards}>{pathways.map(path => <article className={styles.card} key={path.title}><span className={styles.tag}>{path.label}</span><h3>{path.title}</h3><p>{path.description}</p></article>)}</div>
          <p className={styles.note}>Lifeline Legacy provides general education and administrative support, not legal advice. Estate Guru manages legal-document services and advisor support.</p>
        </div>
      </section>

      <section className={styles.partnerSection} aria-labelledby="partner-title">
        <div className={styles.container + " " + styles.partnerGrid}>
          <div><p className={styles.kicker}>For churches and nonprofits</p><h2 id="partner-title">Bring the conversation to your community.</h2><p>We are developing Family Protection and Legacy Workshops to help the families your organization serves understand their options and prepare for important decisions.</p><p>Participation does not require an insurance purchase or consent to insurance marketing.</p></div>
          <aside className={styles.partnerCard}><h3>Explore a community workshop.</h3><p>Connect with Lifeline Legacy to discuss a workshop for your church or nonprofit.</p><a className={styles.primary} href="mailto:info@lifelinelegacyfinancial.com?subject=Community%20Legacy%20Partnership">Email us about a workshop</a><p className={styles.note}>Please do not send medical details, legal documents, or other sensitive information by email.</p></aside>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="framework-title">
        <div className={styles.container + " " + styles.closing}>
          <p className={styles.kicker}>Continuity. Certainty. Legacy.</p><h2 id="framework-title">One part of your family&apos;s bigger picture.</h2><p>The Community Legacy Initiative supports the Legacy pillar of the Continuity Bridge™ and helps families prepare for life&apos;s changes.</p>
          <div className={styles.actions}><Link className={styles.outline} href="/continuity-bridge">Explore the Continuity Bridge™</Link><Link className={styles.textLink} href="/family-continuity-map">View the Family Continuity Map™</Link></div>
          <p className={styles.disclaimer}>Educational information only. This is not legal, tax, securities, or investment advice. Document availability, preparation, and execution depend on applicable law and provider requirements. <Link href="/privacy">Read our privacy policy.</Link></p>
        </div>
      </section>
    </main>
  );
}
