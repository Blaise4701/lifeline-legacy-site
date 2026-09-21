import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/public-sans";
import { AttributionCapture } from "@/components/attribution-capture";
import { SeoStructuredData } from "@/components/seo-structured-data";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { LifelineGuide } from "@/components/lifeline-guide";
import "./globals.css";
import "./review.css";
import "./lifeline-guide.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lifelinelegacyfinancial.com"),
  title: {
    default: "Lifeline Legacy Financial Group",
    template: "%s | Lifeline Legacy Financial Group",
  },
  description:
    "Education-first retirement income, family protection, business continuity, and legacy planning for families and business owners in Dallas–Fort Worth.",
  applicationName: "Lifeline Legacy Financial Group",
  creator: "Lifeline Legacy Financial Group",
  publisher: "Lifeline Legacy Financial Group",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Lifeline Legacy Financial Group",
    title: "Lifeline Legacy Financial Group",
    description:
      "Education-first planning built around Continuity, Certainty, and Legacy.",
    url: "https://lifelinelegacyfinancial.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SeoStructuredData />
        <AttributionCapture />
        <SiteHeader />
        {children}
        <SiteFooter />
        <LifelineGuide />
      </body>
    </html>
  );
}
