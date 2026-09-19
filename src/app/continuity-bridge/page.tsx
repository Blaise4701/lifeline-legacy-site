import type { Metadata } from "next";
import Link from "next/link";
import { ContinuityBridge } from "@/components/continuity-bridge";
import { PageHero } from "@/components/page-hero";
import { ReviewInvite } from "@/components/review-invite";
import { pathways, pillars } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "The Continuity Bridge™ Framework",
  description:
    "Learn how the Continuity Bridge™ coordinates Continuity, Certainty, and Legacy across retirement, family, and business planning.",
};

export default function ContinuityBridgePage() {
  return (
    <>
      <main id="main-content">
        <PageHero
          eyebrow="The LLFG methodology"
          title={<>Three sections. One plan that can keep moving.</>}
          description="The Continuity Bridge™ is a way to organize the questions your financial pieces need to answer together—before a product, account, or document is considered on its own."
          primary={{ href: "#explore", label: "Explore the three sections" }}
          secondary={{ href: "/checkup", label: "Take the Continuity Checkup" }}
          aside={
            <div className="method-card">
              <p className="eyebrow">The order matters</p>
              <ol className="numbered-method">
                <li><span>01</span><strong>Understand</strong><small>What must keep working?</small></li>
                <li><span>02</span><strong>Coordinate</strong><small>How do the pieces interact?</small></li>
                <li><span>03</span><strong>Protect</strong><small>Who carries it forward?</small></li>
              </ol>
            </div>
          }
        />

        <section className="content-section">
          <div className="container intro-statement">
            <p className="eyebrow">Why a bridge?</p>
            <h2>A plan should carry people across change.</h2>
            <p>
              Accounts, policies, benefits, documents, and business agreements are important pieces. The bridge asks whether they carry the same priorities in the same direction—especially when income changes, health changes, an owner steps away, or a family has to act.
            </p>
          </div>
        </section>

        <section className="section section-dark" id="explore">
          <div className="container">
            <div className="section-heading centered-heading heading-light">
              <p className="eyebrow eyebrow-light">Explore the framework</p>
              <h2>Continuity. Certainty. Legacy.</h2>
              <p>Each section has a distinct job. The value comes from how all three work together.</p>
            </div>
            <ContinuityBridge />
          </div>
        </section>

        <section className="section section-paper">
          <div className="container">
            <div className="section-heading split-heading">
              <div>
                <p className="eyebrow">What the method does</p>
                <h2>It creates a clearer order for decisions.</h2>
              </div>
              <p>The bridge is not a product and it does not replace legal, tax, or investment advice. It is an educational structure for seeing connections.</p>
            </div>
            <div className="principle-grid">
              {pillars.map((pillar) => (
                <article key={pillar.key}>
                  <span>{pillar.number}</span>
                  <h3>{pillar.name} asks a different kind of question.</h3>
                  <p>{pillar.definition}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading centered-heading">
              <p className="eyebrow">See it in your situation</p>
              <h2>One method, three starting points.</h2>
            </div>
            <div className="feature-path-grid">
              {pathways.map((pathway) => (
                <article key={pathway.label}>
                  <p className="card-kicker">{pathway.label}</p>
                  <h3>{pathway.title}</h3>
                  <ul className="line-list">
                    {pathway.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  <Link className="text-link" href={pathway.href}>Explore this pathway <span aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <ReviewInvite />
    </>
  );
}
