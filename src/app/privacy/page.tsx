import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";
import { licensedStateCodes, site } from "@/lib/site-data";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy information for Lifeline Legacy Financial Group website visitors.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      intro="This policy explains the information this website may collect, why it is used, and the choices available to you."
    >
      <p className="effective-date">Effective date: September 21, 2026</p>

      <h2>Information you choose to provide</h2>
      <p>The educational pages and Continuity Checkup can be used without providing account numbers, balances, Social Security numbers, or other sensitive financial credentials.</p>
      <p>When you request a Continuity Review, you may choose to provide your first name, email address, mobile number, state, selected pathway, preparation answers, and—only with your permission—the descriptive labels from your Checkup summary. Raw Checkup answers are not sent to Lifeline Legacy through the Checkup itself.</p>

      <h2>Lifeline Guide conversations</h2>
      <p>The Lifeline Guide may assign an anonymous session identifier and store a redacted copy of the conversation, page context, general topic classifications, and interactions with suggested educational next steps. LLFG may review this information to improve educational content, identify recurring visitor questions, understand broad patterns and needs, and improve the Guide.</p>
      <p>Guide questions and answers are processed by an AI service provider. Automated redaction is designed to remove obvious sensitive identifiers such as Social Security numbers, payment-card numbers, account identifiers, email addresses, phone numbers, credentials, and detailed health information before text is sent to that provider or stored in LLFG’s conversation repository. Automated redaction cannot be guaranteed to identify every sensitive detail, so visitors should not enter sensitive financial credentials, passwords, or detailed medical information into the Guide.</p>

      <h2>How information may be used</h2>
      <p>Information you submit may be used to respond to your request, improve the Lifeline Guide and educational resources, understand aggregate visitor needs and trends, confirm whether insurance services are available in your state, schedule a conversation, provide requested educational material, maintain records, and protect the website from misuse.</p>

      <h2>Service providers</h2>
      <p>LLFG may use service providers for website hosting, scheduling, customer relationship management, email, analytics, and security. Those providers should receive only the information reasonably needed to perform their services.</p>

      <h2>Cookies and analytics</h2>
      <p>Analytics and cookie choices will be documented here before launch. Nonessential tracking should not be enabled until the final tools, consent requirements, and privacy configuration are approved.</p>

      <h2>State availability</h2>
      <p>LLFG is currently licensed to offer insurance services in {licensedStateCodes.join(", ")}. Providing a state helps confirm whether a review can be offered where you live. Submitting a request does not guarantee product availability or approval.</p>

      <h2>Retention and security</h2>
      <p>LLFG intends to retain personal information only as long as reasonably necessary for the purpose collected and to use reasonable administrative and technical safeguards. No internet transmission or storage system can be guaranteed completely secure.</p>

      <h2>Your choices and contact</h2>
      <p>To ask a privacy question or request an update or deletion, contact <a href={site.emailHref}>{site.email}</a> or call <a href={site.phoneHref}>{site.phone}</a>. Additional rights may apply based on your location.</p>
    </LegalPage>
  );
}
