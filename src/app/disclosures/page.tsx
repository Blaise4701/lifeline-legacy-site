import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { disclosure, licensedStateCodes, site } from "@/lib/site-data";

export const metadata = pageMetadata({
  title: "Disclosures",
  description: "Important insurance, education, and professional-scope disclosures for Lifeline Legacy Financial Group.",
  path: "/disclosures",
});

export default function DisclosuresPage() {
  return (
    <LegalPage
      eyebrow="Important information"
      title="Disclosures"
      intro="Please read these disclosures alongside any specific carrier illustration, contract, or professional guidance you receive."
    >
      <h2>Scope of services</h2>
      <p>{disclosure}</p>

      <h2>Educational frameworks and examples</h2>
      <p>The Continuity Bridge™, Continuity Checkup, Written Retirement Income Sequence™, scenarios, and educational pathways are organizational and educational tools. They do not evaluate all facts, determine suitability, promise a result, or replace individualized advice from the appropriate licensed professional.</p>

      <h2>Insurance and annuity products</h2>
      <p>Product availability, riders, rates, features, limitations, surrender charges, tax treatment, and suitability considerations vary by carrier, contract, and state. Applications are subject to underwriting and carrier approval. Read the applicable contract and carrier materials carefully.</p>

      <h2>Licensing</h2>
      <p>LLFG is currently licensed to offer insurance services in {licensedStateCodes.join(", ")}. Product and carrier availability vary by state. A website inquiry does not establish availability, coverage, or approval.</p>

      <h2>Tax and legal coordination</h2>
      <p>LLFG does not provide legal or tax advice. Consult a qualified attorney or tax professional about legal documents, ownership, estate planning, business agreements, and tax consequences.</p>

      <h2>Contact</h2>
      <p>For questions about an LLFG disclosure, contact <a href={site.emailHref}>{site.email}</a> or call <a href={site.phoneHref}>{site.phone}</a>.</p>
    </LegalPage>
  );
}
