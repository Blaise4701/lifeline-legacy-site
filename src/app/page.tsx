import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ContinuityBridge } from "@/components/continuity-bridge";
import { ReviewInvite } from "@/components/review-invite";
import { pathways, site, workshops } from "@/lib/site-data";

export const metadata = pageMetadata({
  title: "Retirement Income & Continuity Planning in DFW",
  description: "Education-first retirement income, family protection, business continuity, and legacy planning for Dallas–Fort Worth families and business owners.",
  path: "/",
});

const scenarios = [
  { pillar: "Continuity", title: "Income and obligations", text: "Bills, benefits, and paychecks do not line up on their own if income pauses." },
  { pillar: "Certainty", title: "Withdrawal order", text: "Accounts opened at different times can work at cross-purposes without a written sequence." },
  { pillar: "Legacy", title: "Beneficiaries and documents", text: "Wishes, paperwork, ownership, and beneficiaries can drift apart as life changes." },
  { pillar: "Continuity", title: "Who steps in", text: "Someone may need to act. Would they know where things are and what comes next?" },
  { pillar: "Certainty", title: "Benefit timing", text: "Social Security, pensions, and savings can each run on a different clock." },
  { pillar: "Legacy", title: "Business ownership", text: "A business can be a family’s largest asset with no clear plan for the next owner." },
] as const;

const scenarioPillarNumbers = {
  Continuity: "01",
  Certainty: "02",
  Legacy: "03",
} as const;

const homePathways = [
  {
    ...pathways[0],
    label: "Retirement",
    title: "Turn your retirement pieces into a written income plan.",
    cta: "Explore retirement planning",
  },
  {
    ...pathways[1],
    label: "Families",
    title: "Keep the household steady when life changes.",
    cta: "Explore family planning",
  },
  {
    ...pathways[2],
    label: "Business",
    title: "Protect the business, the owner, and the people who depend on both.",
    cta: "Explore business planning",
  },
] as const;

export default function Home() {
  return (
    <>
      <main id="main-content">
        <section className="home-hero">
          <div className="container home-hero-grid">
            <div className="home-hero-copy">
              <p className="eyebrow home-hero-eyebrow">Education-first planning · Dallas–Fort Worth</p>
              <h1>
                <span>You’ve built the pieces.</span>
                <span>Do they work as <em>one plan?</em></span>
              </h1>
              <p className="hero-lede">
                Most people already have pieces—retirement accounts, insurance, savings, benefits, documents, or a business. The real question is whether those pieces are coordinated to keep life moving when circumstances change.
              </p>
              <div className="button-row">
                <Link className="button" href="#bridge">Explore the Continuity Bridge</Link>
                <Link className="button button-outline" href="/checkup">Take the Continuity Checkup</Link>
              </div>
              <p className="hero-note">
                <span>Start with the questions</span>
                <span>No account numbers</span>
                <span>No upfront contact form</span>
              </p>
            </div>
            <div className="hero-bridge-visual" aria-label="The Continuity Bridge has three connected sections: Continuity, Certainty, and Legacy">
              <div className="bridge-arch" aria-hidden="true">
                <span className="arch-line arch-one" />
                <span className="arch-line arch-two" />
                <span className="arch-line arch-three" />
                <span className="arch-line arch-four" />
                <span className="arch-line arch-five" />
                <span className="arch-line arch-six" />
                <span className="arch-line arch-seven" />
                <span className="bridge-deck" />
              </div>
              <p>The question behind every plan</p>
              <blockquote>
                <span>If life changes tomorrow,</span>
                <strong className="hero-question">
                  <span>will the people who depend on</span>
                  <span>you be okay?</span>
                </strong>
              </blockquote>
              <div className="hero-pillars"><span>Continuity</span><span>Certainty</span><span>Legacy</span></div>
            </div>
          </div>
        </section>

        <section className="section section-paper pathways-overview">
          <div className="container">
            <div className="pathways-overview-heading">
              <p className="eyebrow">Start where you are</p>
              <h2>
                <span>Different starting points.</span>
                <span>One connected method.</span>
              </h2>
              <p>Each situation begins differently. Every path moves through the same Continuity Bridge™.</p>
            </div>

            <div className="pathways-editorial-grid">
              {homePathways.map((pathway, index) => (
                <article className="pathway-editorial" key={pathway.href}>
                  <div className="pathway-editorial-topline">
                    <p className="card-kicker">{pathway.label}</p>
                    <span className="pathway-editorial-number" aria-hidden="true">0{index + 1}</span>
                  </div>
                  <h3>{pathway.title}</h3>
                  <ul>
                    {pathway.points.slice(0, 3).map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  <Link className="text-link pathway-editorial-link" href={pathway.href}>
                    {pathway.cta} <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-dark bridge-section" id="bridge">
          <div className="container">
            <div className="section-heading centered-heading heading-light">
              <p className="eyebrow eyebrow-light">The methodology</p>
              <h2>The Continuity Bridge™</h2>
              <p>A plan is a bridge with three connected sections. Each carries weight. Explore what each section asks, coordinates, and protects against.</p>
            </div>
            <ContinuityBridge />
          </div>
        </section>

        <section className="section checkup-callout-section">
          <div className="container checkup-callout">
            <div>
              <p className="eyebrow">The Continuity Checkup</p>
              <h2>See where your pieces connect.</h2>
              <p>Five plain-language questions, one at a time. You will see what appears to be in place, what may need coordination, and which educational path fits next.</p>
              <ul className="check-list">
                <li>No balances or account numbers</li>
                <li>No contact details before your summary</li>
                <li>No score, diagnosis, or product recommendation</li>
              </ul>
              <Link className="button" href="/checkup">Start the Checkup</Link>
            </div>
            <div className="sample-question-card">
              <p className="question-tag">Try one question · Continuity</p>
              <h3>If the income you rely on changed, would everyone know what keeps life moving?</h3>
              <div className="sample-options" aria-hidden="true">
                <span><i /> Yes, there is a plan</span>
                <span><i /> Some pieces exist</span>
                <span><i /> We have not planned yet</span>
              </div>
              <p className="sample-caption">Your complete summary is organized by Continuity, Certainty, and Legacy.</p>
            </div>
          </div>
        </section>

        <section className="section section-sage scenario-section">
          <div className="container">
            <div className="scenario-heading">
              <p className="eyebrow">Educational scenarios</p>
              <h2>What can become disconnected?</h2>
              <p>Strong individual pieces do not automatically create a coordinated plan.</p>
            </div>
            <div className="scenario-grid">
              {scenarios.map((scenario) => (
                <article
                  className={`scenario-card scenario-${scenario.pillar.toLowerCase()}`}
                  key={scenario.title}
                >
                  <p className={`pillar-tag pillar-${scenario.pillar.toLowerCase()}`}>
                    <span>{scenarioPillarNumbers[scenario.pillar]}</span> · {scenario.pillar}
                  </p>
                  <h3>{scenario.title}</h3>
                  <p>{scenario.text}</p>
                </article>
              ))}
            </div>
            <p className="fine-print">Illustrative examples for education only. Not tax, legal, or investment advice.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-heading centered-heading">
              <p className="eyebrow">Educational pathways</p>
              <h2>Go deeper on your situation.</h2>
              <p>Learn the questions worth answering before any product or strategy is discussed.</p>
            </div>
            <div className="feature-path-grid">
              {pathways.map((pathway) => (
                <article key={pathway.label}>
                  <p className="card-kicker">{pathway.label}</p>
                  <h3>{pathway.title}</h3>
                  <ul className="line-list">
                    {pathway.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  <Link className="text-link" href={pathway.href}>Open this pathway <span aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-paper learning-preview">
          <div className="container learning-preview-grid">
            <div>
              <p className="eyebrow">Workshops, guides, and conversations</p>
              <h2>Learn it before you decide anything.</h2>
              <p>Ten fall education sessions are scheduled at public libraries in Dallas and Wylie. Online registration will open shortly.</p>
              <Link className="button" href="/learn#workshops">View the full event schedule</Link>
            </div>
            <div className="resource-stack">
              {workshops.slice(0, 4).map((workshop) => (
                <article key={workshop.id}>
                  <span>{workshop.eventType} · <time dateTime={workshop.dateTime}>{workshop.shortDate} · {workshop.time}</time></span>
                  <h3>{workshop.title}</h3>
                  <p>{workshop.location}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section founder-section">
          <div className="container founder-grid">
            <div className="founder-photo-wrap">
              <Image
                src="/brand/blaise-tamo.png"
                alt="Blaise Tamo, Founder and CEO of Lifeline Legacy Financial Group"
                width={836}
                height={941}
                loading="eager"
                className="founder-photo"
                sizes="(max-width: 800px) 100vw, 45vw"
              />
              <div className="founder-photo-caption">Dallas–Fort Worth</div>
            </div>
            <div>
              <p className="eyebrow">Meet Blaise Tamo</p>
              <h2>Built from lived experience.</h2>
              <p className="founder-title">{site.title}</p>
              <p>Personal loss taught Blaise what happens when a family has love and responsibility, but no coordinated structure for what comes next.</p>
              <p>Years later, at kitchen tables across Texas, he saw the same vulnerability in families and business owners. That lived experience became Lifeline Legacy Financial Group and the Continuity Bridge™ Framework.</p>
              <p className="pull-quote">“I didn’t set out to build a company. I set out to build a life.”</p>
              <Link className="text-link" href="/about">Read the founder story <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>
      </main>
      <ReviewInvite />
    </>
  );
}
