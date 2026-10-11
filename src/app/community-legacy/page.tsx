import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Community Legacy Initiative | Lifeline Legacy",
  description: "An integral part of the Continuity Bridge framework: family estate-readiness education, Power of Attorney access through Estate Guru, and community partnerships.",
  path: "/community-legacy",
});

const pathways = [
  { title: "Self Service", description: "Estate Guru sends you a secure link so you can work through the document process independently." },
  { title: "Assisted Service", description: "Lifeline Legacy helps you get connected and complete administrative onboarding with Estate Guru." },
  { title: "Full Service", description: "An Estate Guru advisor offers guidance through the process." },
];

export default function CommunityLegacyPage() {
  return (
    <main id="main-content">
      <section className="section section-dark">
        <div className="container" style={{ maxWidth: 990, paddingTop: 64, paddingBottom: 64 }}>
          <p className="eyebrow eyebrow-light">An integral part of the Continuity Bridge™</p>
          <h1>Protect Your Wishes. Empower Your Loved Ones.</h1>
          <p style={{ maxWidth: 750, fontSize: "1.15rem", lineHeight: 1.7 }}>
            The Lifeline Community Legacy Initiative helps families prepare for life&apos;s unexpected transitions through education, community partnerships, and access to essential estate-planning resources.
          </p>
          <p>Continuity. Certainty. Legacy.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="container" style={{ maxWidth: 990 }}>
          <p className="eyebrow">A real family benefit</p>
          <h2>Financial and Healthcare Powers of Attorney at no cost to the client.</h2>
          <p>Through Lifeline Legacy&apos;s existing Estate Guru relationship, eligible participants can access Financial and Healthcare Powers of Attorney without paying for those documents.</p>
          <p>Optional trust planning is a paid service. A will is included with the purchased trust package.</p>
          <p><strong>No insurance purchase or Lifeline Continuity Review is required to access the POA benefit.</strong></p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 990 }}>
          <p className="eyebrow">Choose the right level of support</p>
          <h2>Three pathways. No additional service fee.</h2>
          <div className="feature-path-grid">
            {pathways.map((pathway) => (
              <article key={pathway.title} style={{ padding: 24, border: "1px solid #d9d5ce", borderRadius: 12 }}>
                <h3>{pathway.title}</h3>
                <p>{pathway.description}</p>
              </article>
            ))}
          </div>
          <p style={{ marginTop: 24 }}>Lifeline provides education and administrative introductions, not legal advice. Estate Guru manages legal-document services and advisor support.</p>
        </div>
      </section>
      <section className="section section-paper">
        <div className="container" style={{ maxWidth: 990 }}>
          <p className="eyebrow">For churches and nonprofits</p>
          <h2>Help the families your organization already serves.</h2>
          <p>We are developing Family Protection and Legacy Workshops with community partners. The objective is to provide useful education and accessible planning resources, without requiring members to meet with an insurance professional.</p>
          <p>Interested in exploring a community partnership? Contact <a href="mailto:info@lifelinelegacyfinancial.com?subject=Community%20Legacy%20Partnership">info@lifelinelegacyfinancial.com</a>.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 990 }}>
          <h2>Part of one coordinated framework</h2>
          <p>The Community Legacy Initiative puts the Legacy pillar of the Continuity Bridge™ into action while supporting the broader goal of family preparedness.</p>
          <p><Link href="/continuity-bridge">Learn about the Continuity Bridge™ framework</Link> · <Link href="/family-continuity-map">Explore the Family Continuity Map™</Link></p>
          <small>Educational information only, not legal, tax, securities, or investment advice. Document availability and the process for preparing and executing documents depend on applicable law and provider requirements.</small>
        </div>
      </section>
    </main>
  );
}