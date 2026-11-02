import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";
import styles from "./featured-workshop.module.css";
import { PageHero } from "@/components/page-hero";
import { ReviewInvite } from "@/components/review-invite";
import { WorkshopCard } from "@/components/workshop-card";
import { hasWorkshopEnded } from "@/lib/workshop-status";
import { connection } from "next/server";
import { workshops } from "@/lib/site-data";

export const metadata = pageMetadata({
  title: "Retirement Planning Workshops & Financial Education",
  description: "Explore retirement planning workshops, guides, and financial education in Dallas-Fort Worth covering retirement income, continuity, protection, and legacy planning.",
  path: "/learn",
});

const resources = [
  {
    type: "Framework",
    title: "The Continuity Bridge™ overview",
    text: "Understand the three questions every coordinated plan must answer: what keeps moving, what works together, and what carries forward.",
    href: "/continuity-bridge",
    action: "Explore the framework",
    ready: true,
  },
  {
    type: "Interactive",
    title: "The Continuity Checkup",
    text: "Five questions that organize what appears to be in place, what may need coordination, and where to learn next.",
    href: "/checkup",
    action: "Start the Checkup",
    ready: true,
  },
  {
    type: "Retirement guide",
    title: "The Written Retirement Income Sequence™",
    text: "A guide to documenting what funds which years, how benefit timing fits, and what can trigger a change in sequence.",
    href: "",
    action: "In development",
    ready: false,
  },
  {
    type: "Family guide",
    title: "The Family Continuity Map",
    text: "A practical worksheet for responsibilities, contacts, document locations, and the first actions a household may need to take.",
    href: "/family-continuity-map",
    action: "Explore the Family Continuity Map",
    ready: true,
  },
  {
    type: "Owner guide",
    title: "The Owner Interruption Conversation",
    text: "A future question guide for leadership, obligations, agreements, owner income, and ownership transition.",
    href: "",
    action: "In development",
    ready: false,
  },
  {
    type: "Conversation series",
    title: "Coffee & Financial Conversations",
    text: "Small-group education built around questions, plain language, and practical examples rather than product presentations.",
    href: "#workshops",
    action: "See the event schedule",
    ready: true,
  },
] as const;

// Add future featured flyers here; each flyer follows its event's lifecycle.
const featuredFlyers = [
  {
    eventId: "plano-november-21-catch-up",
    href: "/retirement-catch-up",
    image: "/events/retirement-catch-up.svg",
    alt: "You’re Not Too Late: A 10-Year Retirement Catch-Up Plan. Free workshop with Blaise D. Tamo and May K. Li, PhD, November 21 at Harrington Library in Plano.",
    width: 1024,
    height: 1536,
  },
] as const;

export default async function LearnPage() {
  await connection();
  const now = Date.now();
  const upcoming = workshops.filter((workshop) => !hasWorkshopEnded(workshop, now) && !("cancelled" in workshop && workshop.cancelled))
    .sort((a, b) => Date.parse(a.dateTime) - Date.parse(b.dateTime));
  const activeFlyers = featuredFlyers.filter((flyer) => upcoming.some((workshop) => workshop.id === flyer.eventId));
  return (
    <div className="learn-page-shell">
      <main id="main-content">
        <PageHero
          className="learn-hero"
          eyebrow="The LLFG learning center"
          title={<><span>Learn the structure before</span>{" "}<span>you choose a solution.</span></>}
          description="Better decisions begin with better questions. Explore plain-language guides and conversations that show how income, protection, people, and documents fit together."
          primary={{ href: "#resources", label: "Browse the resources" }}
          secondary={{ href: "/checkup", label: "Take the Continuity Checkup" }}
        />

        <section className="section learn-resources-section" id="resources">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">Guides and tools</p>
                <h2>Start with the question in front of you.</h2>
              </div>
              <p>Resources marked “in development” are intentionally not linked yet. They will only be published when the content and compliance review are complete.</p>
            </div>

            <div className="resource-grid">
              {resources.map((resource) => (
                <article className="resource-card" key={resource.title}>
                  <p className="card-kicker">{resource.type}</p>
                  <h3>{resource.title}</h3>
                  <p>{resource.text}</p>
                  {resource.ready ? (
                    <Link className="text-link" href={resource.href}>
                      {resource.action} <span aria-hidden="true">→</span>
                    </Link>
                  ) : (
                    <span className="status-label">{resource.action}</span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark learn-workshops-section" id="workshops" aria-labelledby="workshops-title">
          <div className="container">
            <div className="section-heading centered-heading heading-light">
              <p className="eyebrow eyebrow-light">Upcoming retirement education sessions</p>
              <h2 id="workshops-title">Retirement Should Feel Like Freedom.</h2>
              <p>Choose the conversation that matches the decision in front of you. Each seminar stands on its own, while the series builds from awareness to a written retirement-income plan.</p>
            </div>

            {activeFlyers.length > 0 && (
              <div className={styles.gallery} aria-label="Featured seminar flyers">
                {activeFlyers.map((flyer) => (
                  <Link key={flyer.eventId} href={flyer.href} className={styles.flyerLink} aria-label={flyer.alt}>
                    <Image src={flyer.image} alt={flyer.alt} width={flyer.width} height={flyer.height} unoptimized className={styles.flyer} />
                  </Link>
                ))}
              </div>
            )}
            <div className="workshop-card-grid">
              {upcoming.map((workshop, index) => (
                <WorkshopCard key={workshop.id} workshop={workshop} index={index} now={now} />
              ))}
            </div>
            {upcoming.length === 0 && <p>New sessions will be announced here. Please check back for upcoming dates.</p>}
            <p><Link className="button button-secondary" href="/learn/seminar-archive">Browse past seminars</Link></p>
          </div>
        </section>

        <section className="section section-paper learn-guided-section">
          <div className="container sequence-callout">
            <div>
              <p className="eyebrow">Prefer a guided starting point?</p>
              <h2>Let the Checkup suggest what to learn next.</h2>
              <p>Your educational summary connects you to retirement, family, business, or one section of the Continuity Bridge.</p>
            </div>
            <Link className="button" href="/checkup">Take the Continuity Checkup</Link>
          </div>
        </section>
      </main>
      <ReviewInvite />
    </div>
  );
}
