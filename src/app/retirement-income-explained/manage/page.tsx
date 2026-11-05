import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { RIE_PATH, rieEvent } from "@/lib/retirement-income-explained";
import { ChangeRequestForm } from "./change-request-form";
import styles from "../rie.module.css";

export const metadata = pageMetadata({
  title: "Change or Cancel Your Registration: Retirement Income Explained",
  description: "Request a session change, guest change, or cancellation for Retirement Income Explained on November 12, 2026.",
  path: `${RIE_PATH}/manage`,
  noindex: true,
});

export default function ManageRegistrationPage() {
  return (
    <main id="main-content" className={`${styles.page} ${styles.thanks}`}>
      <div className="container">
        <article className={styles.thanksCard}>
          <p className={styles.formKicker}>{rieEvent.title} · {rieEvent.dayDate}</p>
          <h1>Change or cancel your registration</h1>
          <p>
            Tell us what you would like to change. We will stop your automatic reminders, make the update, and confirm it with you personally.
          </p>
          <ChangeRequestForm />
          <p className={styles.small}>
            <Link href={RIE_PATH}>Back to event details</Link>
          </p>
        </article>
      </div>
    </main>
  );
}
