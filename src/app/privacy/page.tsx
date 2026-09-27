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
      <p className="effective-date">Effective date: September 27, 2026</p>

      <h2>Information you choose to provide</h2>
      <p>The educational pages and Continuity Checkup can be used without providing account numbers, balances, Social Security numbers, or other sensitive financial credentials.</p>
      <p>When you request a Continuity Review, you may choose to provide your first name, email address, mobile number, state, selected pathway, preparation answers, and—only with your permission—the descriptive labels from your Checkup summary. Raw Checkup answers are not sent to Lifeline Legacy through the Checkup itself.</p>

      <h2>Lifeline Guide conversations</h2>
      <p>The Lifeline Guide keeps the open conversation in your browser page while you chat. The website does not save a conversation transcript, session identifier, or Guide interaction history in an LLFG database. Refreshing or leaving the page clears the chat. A requested short summary is shown on screen; it is emailed only if you choose a recipient and complete the email steps. A summary shared only with LLFG has no visitor contact address; if you choose both recipients, your confirmed email address is shared with LLFG along with the summary so the firm can reply. No transcript is attached. Email copies are retained by the recipient and email service according to their own settings and policies.</p>
      <p>Guide questions, answers, and requested summaries are processed by an AI service provider. Automated redaction is designed to remove obvious sensitive identifiers such as Social Security numbers, payment-card numbers, account identifiers, email addresses, phone numbers, credentials, and detailed health information before text is sent to that provider or placed in a summary. Automated redaction cannot be guaranteed to identify every sensitive detail, so visitors should not enter sensitive financial credentials, passwords, or detailed medical information into the Guide. The AI provider may retain content in safety and abuse-monitoring logs under its policies; the website does not control that provider retention.</p>

      <h2>How information may be used</h2>
      <p>Information you submit may be used to respond to your request, provide a summary you choose to email, improve educational resources, confirm whether insurance services are available in your state, schedule a conversation, provide requested educational material, maintain records for separately requested services, and protect the website from misuse. Requesting a Guide summary is not consent to marketing emails.</p>

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
