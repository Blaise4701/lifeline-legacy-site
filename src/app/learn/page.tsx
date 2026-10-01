import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ReviewInvite } from "@/components/review-invite";
import { WorkshopRegistration } from "@/components/workshop-registration";
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
    text: "A future worksheet for responsibilities, contacts, document locations, and the first actions a household may need to take.",
    href: "",
    action: "In development",
    ready: false,
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

const seminarSeries = [
  {
    key: "renner-fall",
    eyebrow: "Renner Frankford · September-October",
    title: "Prepare. Stress-Test. Build.",
    description:
      "Three connected sessions for people approaching retirement: understand the countdown, test the assumptions, then put the first version of the income plan on paper.",
  },
  {
    key: "wylie-fall",
    eyebrow: "Wylie · October",
    title: "Reduce Risk. Build the Roadmap. Create the Plan.",
    description:
      "A three-event progression from retirement-income risk, to the planning roadmap, to a hands-on written retirement-paycheck workshop.",
  },
  {
    key: "november-fall",
    eyebrow: "Dallas-Fort Worth · November",
    title: "Early Decisions. Income Coordination. Written Plan.",
    description:
      "November goes deeper into the first years of retirement and includes an extended two-part workshop at Fretz Park.",
  },
] as const;

export default function LearnPage() {
  return (
    <div className="learn-page-shell">
      <main id="main-content">
        <PageHero
          className="learn-hero"
          eyebrow="The LLFG learning center"
          title={<>Learn the structure before you choose a solution.</>}
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
              <p className="eyebrow eyebrow-light">Fall 2026 retirement education series</p>
              <h2 id="workshops-title">Retirement Should Feel Like Freedom.</h2>
              <p>Choose the conversation that matches the decision in front of you. Each seminar stands on its own, while the series builds from awareness to a written retirement-income plan.</p>
            </div>

            <div className="seminar-series-list">
              {seminarSeries.map((series) => {
                const seriesWorkshops = workshops.filter((workshop) => workshop.series === series.key);

                return (
                  <section className="seminar-series-group" key={series.key} aria-labelledby={`series-${series.key}`}>
                    <div className="seminar-series-heading">
                      <p className="eyebrow eyebrow-light">{series.eyebrow}</p>
                      <h3 id={`series-${series.key}`}>{series.title}</h3>
                      <p>{series.description}</p>
                    </div>

                    <div className="workshop-card-grid">
                      {seriesWorkshops.map((workshop, index) => (
                        <article className="workshop-card workshop-card-detailed" id={workshop.id} key={workshop.id}>
                          <div className="workshop-meta">
                            <span>{String(index + 1).padStart(2, "0")}</span>
                            <div>
                              <p className="workshop-format">{workshop.eventType}</p>
                              <time dateTime={workshop.dateTime}>{workshop.date} · {workshop.time}</time>
                            </div>
                          </div>

                          <h3>{workshop.title}</h3>
                          <p className="workshop-subtitle">{workshop.subtitle}</p>
                          <p className="workshop-description">{workshop.description}</p>

                          <div className="workshop-detail-block">
                            <p className="workshop-detail-label">What you’ll work through</p>
                            <ul className="workshop-highlight-list">
                              {workshop.highlights.map((highlight) => (
                                <li key={highlight}>{highlight}</li>
                              ))}
                            </ul>
                          </div>

                          {"parts" in workshop && (
                            <div className="workshop-parts">
                              {workshop.parts.map((part) => (
                                <div className="workshop-part" key={part.title}>
                                  <span>{part.time}</span>
                                  <strong>{part.title}</strong>
                                  <p>{part.outcome}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="workshop-outcome">
                            <p className="workshop-detail-label">What you’ll leave with</p>
                            <p>{workshop.outcome}</p>
                          </div>

                          <div className="workshop-card-footer">
                            <p className="workshop-location">{workshop.location}</p>
                            <p className="workshop-address">{workshop.address}</p>
                            <WorkshopRegistration workshop={workshop} />
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
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
