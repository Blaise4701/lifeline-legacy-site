import Image from "next/image";
import Link from "next/link";
import { disclosure, licensedStateCodes, site } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Image
            src="/brand/llfg-mark-gold.png"
            alt=""
            width={86}
            height={86}
            loading="eager"
            className="footer-mark"
          />
          <p className="footer-name">{site.name}</p>
          <p>Protecting families. Building legacies.</p>
          <p className="footer-motto">Continuity · Certainty · Legacy</p>
        </div>

        <div>
          <h2 className="footer-heading">Explore</h2>
          <ul className="footer-links">
            <li><Link href="/continuity-bridge">The Continuity Bridge™</Link></li>
            <li><Link href="/retirement-income">Retirement income</Link></li>
            <li><Link href="/family-continuity">Family continuity</Link></li>
            <li><Link href="/business-continuity">Business continuity</Link></li>
            <li><Link href="/learn">Learning center</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="footer-heading">Company</h2>
          <ul className="footer-links">
            <li><Link href="/about">About Blaise</Link></li>
            <li><Link href="/checkup">Continuity Checkup</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
            <li><Link href="/disclosures">Disclosures</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="footer-heading">Contact</h2>
          <address className="footer-contact">
            <span>{site.location}</span>
            <a href={site.phoneHref}>Office: {site.phone}</a>
            <a href={site.cellHref}>Direct: {site.cell}</a>
            <a href={site.emailHref}>{site.email}</a>
          </address>
          <p className="license-note">
            Licensed to offer insurance services in {licensedStateCodes.join(", ")}.
          </p>
        </div>
      </div>

      <div className="container footer-legal">
        <p>{disclosure}</p>
        <p>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
