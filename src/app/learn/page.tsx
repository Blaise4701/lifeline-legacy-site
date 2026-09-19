import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ReviewInvite } from "@/components/review-invite";
import { workshops } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Learning Center",
  description:
    "Plain-language guides, workshops, and educational frameworks for retirement income, family continuity, business continuity, and legacy planning.",
};

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

export default function LearnPage() {
  return (
    <>
      <main id="main-content">
        <PageHero
          eyebrow="The LLFG learning center"
          title={<>Learn the structure before you choose a solution.</>}
          description="Better decisions begin with better questions. Explore plain-language guides and conversations that show how income, protection, people, and documents fit together."
          primary={{ href: "#resources", label: "Browse the resources" }}
          secondary={{ href: "/checkup", label: "Take the Continuity Checkup" }}
        />

        <section className="section" id="resources">
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
                    <Link className="text-link" href={resource.href}>{resource.action} <span aria-hidden="true">→</span></Link>
                  ) : (
                    <span className="status-label">{resource.action}</span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark" id="workshops" aria-labelledby="workshops-title">
          <div className="container">
            <div className="section-heading centered-heading heading-light">
              <p className="eyebrow eyebrow-light">Fall 2026 retirement education series</p>
              <h2 id="workshops-title">Retirement Should Feel Like Freedom.</h2>
              <p>Ten education-first seminars and hands-on workshops are scheduled at public libraries in Dallas and Wylie. Online registration will open shortly.</p>
            </div>
            <div className="workshop-card-grid">
              {workshops.map((workshop, index) => (
                <article className="workshop-card" id={workshop.id} key={workshop.id}>
                  <div className="workshop-meta">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="workshop-format">{workshop.eventType}</p>
                      <time dateTime={workshop.dateTime}>{workshop.date} · {workshop.time}</time>
                    </div>
                  </div>
                  <h3>{workshop.title}</h3>
                  <p>{workshop.description}</p>
                  <div className="workshop-card-footer">
                    <p className="workshop-location">{workshop.location}</p>
                    <p className="workshop-address">{workshop.address}</p>
                    <span className="registration-status">Registration coming soon</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-paper">
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
    </>
  );
}
