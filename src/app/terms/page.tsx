import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/site-data";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "Website terms for Lifeline Legacy Financial Group.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Website terms"
      title="Terms of Use"
      intro="These terms describe the educational purpose of this website and the limits of the information provided."
    >
      <p className="effective-date">Effective date: September 20, 2026</p>

      <h2>Educational information only</h2>
      <p>Website content, examples, questions, Checkup summaries, workshops, and guides are for general educational purposes. They are not individualized legal, tax, investment, accounting, or financial advice.</p>

      <h2>No advisory or securities services</h2>
      <p>LLFG and Blaise Tamo provide life insurance and annuity education and services. Blaise Tamo does not offer securities or investment advisory services through LLFG.</p>

      <h2>No client relationship created</h2>
      <p>Using this site, completing the Checkup, sending an email, or requesting a conversation does not create a client relationship, bind coverage, guarantee product availability, or obligate either party to proceed.</p>

      <h2>Insurance availability and guarantees</h2>
      <p>Insurance and annuity products are available only where properly licensed and are subject to carrier rules, underwriting, contract terms, and approval. Guarantees are backed by the claims-paying ability of the issuing insurance company.</p>

      <h2>Accuracy and third-party information</h2>
      <p>LLFG aims to keep educational content useful and current but does not warrant that every page is complete or suitable for every situation. Links or references to third parties do not imply control or endorsement of their content.</p>

      <h2>Intellectual property</h2>
      <p>Website copy, graphics, the Continuity Bridge™ Framework, and related educational materials may not be reproduced or distributed for commercial use without written permission, except as allowed by law.</p>

      <h2>Contact</h2>
      <p>Questions about these terms may be sent to <a href={site.emailHref}>{site.email}</a> or discussed by calling <a href={site.phoneHref}>{site.phone}</a>.</p>
    </LegalPage>
  );
}
