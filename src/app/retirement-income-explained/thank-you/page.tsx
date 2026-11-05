import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site-data";
import {
  RIE_PATH,
  googleCalendarUrl,
  isRieSession,
  rieEvent,
  rieSessions,
  type RieSessionKey,
} from "@/lib/retirement-income-explained";
import styles from "../rie.module.css";

export const metadata = pageMetadata({
  title: "You’re Registered: Retirement Income Explained",
  description: "Your registration for Retirement Income Explained on November 12, 2026 at Fretz Park Branch Library in Dallas.",
  path: `${RIE_PATH}/thank-you`,
  noindex: true,
});

export default async function RetirementIncomeExplainedThankYou({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const rawSession = typeof params.session === "string" ? params.session : "";
  const session: RieSessionKey | null = isRieSession(rawSession) ? rawSession : null;
  const existing = params.status === "existing";
  const guest = params.guest === "1";
  const details = session ? rieSessions[session] : null;

  return (
    <main id="main-content" className={`${styles.page} ${styles.thanks}`}>
      <div className="container">
        <article className={styles.thanksCard}>
          <p className={styles.formKicker}>{existing ? "Already registered" : "Registration confirmed"}</p>
          <h1>{existing ? "You’re already registered." : "Thank you. Your seat is reserved."}</h1>
          <p>
            {existing
              ? "We found an existing registration for this email address, so we did not create a second one."
              : "A confirmation email is on its way. If you do not see it within a few minutes, please check your spam or promotions folder."}
          </p>

          {details && (
            <div className={styles.sessionBadge}>
              <span>{existing ? "Session on file" : "Your session"}</span>
              <strong>{details.label} · {details.time}</strong>
              <span>{details.title}</span>
            </div>
          )}

          <dl className={styles.facts} data-tone="light">
            <div>
              <dt>Date</dt>
              <dd>{rieEvent.dayDate}<br /><small>All times {rieEvent.timeZoneLabel}</small></dd>
            </div>
            <div>
              <dt>Venue</dt>
              <dd>{rieEvent.venue}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd><a href={rieEvent.mapsUrl} target="_blank" rel="noopener noreferrer">{rieEvent.address}</a></dd>
            </div>
          </dl>

          {session && (
            <>
              <h2>Add it to your calendar</h2>
              <div className={styles.buttonRow}>
                <a className="button" href={googleCalendarUrl(session)} target="_blank" rel="noopener noreferrer">Google Calendar</a>
                <a className="button button-outline" href={`${RIE_PATH}/calendar/${session}`}>Apple / Outlook (.ics)</a>
              </div>
            </>
          )}

          <h2>What to expect</h2>
          <p>This is an educational event. Plan to arrive a few minutes early to find a seat. {session === "seminar"
            ? "The evening seminar is a presentation followed by time for questions."
            : "In the workshop you will work through your retirement income picture toward a first-draft retirement paycheck plan."}
          </p>
          {session !== "seminar" && (
            <p>You may bring general information about your retirement income goals, monthly expenses, and income sources. Please do not bring or share account numbers, Social Security numbers, passwords, or financial statements.</p>
          )}

          <h2>Bringing a guest</h2>
          <p>
            {guest
              ? "Your guest is included in your registration and attends the same session as you. They do not need to register separately."
              : "You are welcome to bring a spouse, partner, or guest. To add a guest to your registration, call or email us and we will update your seat count."}
          </p>

          <h2>Need to change or cancel?</h2>
          <p>
            Reply to your confirmation email, call <a href={site.phoneHref}>{site.phone}</a>, or email{" "}
            <a href={site.emailHref}>{site.email}</a>. We will update your session or release your seat.
          </p>

          <div className={styles.buttonRow}>
            <Link className="button button-outline" href={RIE_PATH}>Back to event details</Link>
            <Link className="button button-outline" href="/learn">Explore LLFG education</Link>
          </div>

          <p className={styles.small}>
            This event is for general educational purposes only and does not provide individualized financial, investment, legal, or tax advice.
          </p>
        </article>
      </div>
    </main>
  );
}
