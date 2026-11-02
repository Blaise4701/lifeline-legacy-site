import type { Metadata } from "next";
import { connection } from "next/server";
import { WorkshopRegistration } from "@/components/workshop-registration";
import { workshops, site } from "@/lib/site-data";
import { isRegistrationClosed } from "@/lib/workshop-status";
import { pageMetadata } from "@/lib/seo";
import styles from "./workshop.module.css";

const baseMetadata = pageMetadata({
  title: "You’re Not Too Late: A 10-Year Retirement Catch-Up Plan",
  description: "Free public workshop with Blaise D. Tamo and May K. Li, PhD. November 21, 2026, 10:00 AM to 12:30 PM at Harrington Library in Plano. Reserve by November 18.",
  path: "/retirement-catch-up",
});

const shareImage = {
  url: "https://lifelinelegacyfinancial.com/retirement-catch-up/share-flyer.jpg",
  width: 1024,
  height: 1536,
  type: "image/jpeg",
  alt: "You’re Not Too Late: A 10-Year Retirement Catch-Up Plan. Free workshop, November 21, 2026, 10:00 AM to 12:30 PM, Harrington Library in Plano. Reserve by November 18. Call 972-764-8516.",
};

export const metadata: Metadata = {
  ...baseMetadata,
  openGraph: { ...baseMetadata.openGraph, images: [shareImage] },
  twitter: {
    ...baseMetadata.twitter,
    card: "summary_large_image",
    images: [{ url: shareImage.url, alt: shareImage.alt }],
  },
};

export default async function RetirementCatchUpPage() {
  await connection();
  const workshop = workshops.find((event) => event.id === "plano-november-21-catch-up")!;
  const closed = isRegistrationClosed(workshop);
  return (
    <main id="main-content" className={styles.page}>
      <section className={styles.hero}>
        <p className="eyebrow">Complimentary in-person workshop + Q&amp;A</p>
        <h1>You’re Not Too Late:<br /><span>A 10-Year Retirement Catch-Up Plan</span></h1>
        <p className={styles.intro}>{workshop.subtitle}</p>
        <div className={styles.details}>
          <p><strong>Saturday, November 21, 2026</strong><br />10:00 AM to 12:30 PM · Central Time</p>
          <p><strong>Harrington Library</strong><br />1501 18th St, Plano, TX 75074</p>
          <p><strong>Free and open to the public.</strong><br />Reserve your seat by Nov 18.</p>
        </div>
        <a className="button" href="#registration">{closed ? "Registration details" : "Reserve My Seat"}</a>
        <p>Prefer to register by phone? Call <a href={site.phoneHref}>{site.phone}</a>.</p>
      </section>
      <section className={styles.content}>
        <div>
          <p className="eyebrow">Start where you are.</p>
          <h2>Make the next decade count.</h2>
          <p>{workshop.description}</p>
          <ul>{workshop.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
          <h2>Meet your presenters.</h2>
          <div className={styles.presenters}>
            <div><h3>Blaise D. Tamo</h3><p>Founder &amp; CEO<br />Lifeline Legacy Financial Group</p><p>Retirement income and family protection education.</p></div>
            <div><h3>May K. Li, PhD</h3><p>Founder of Power on the Edge™<br />Author of Millionaire Mindset for Women</p><p>Mindset and practical personal growth.</p></div>
          </div>
          <p>{workshop.preparation}</p>
          <p className={styles.disclaimer}>Educational purposes only. No individualized financial, tax, legal, or investment advice. No specific retirement outcome is guaranteed. This is an independently organized event; use of the library venue does not imply library endorsement.</p>
        </div>
        <aside id="registration" className={styles.registration}>
          <h2>Reserve your seat.</h2>
          <p>Free admission. Please register by November 18, 2026.</p>
          <WorkshopRegistration workshop={{ ...workshop, registrationClosed: closed }} />
          <p>For registration assistance, call <a href={site.phoneHref}>{site.phone}</a>.</p>
        </aside>
      </section>
    </main>
  );
}
