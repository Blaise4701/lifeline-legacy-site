import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/public-sans";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lifelinelegacyfinancial.com"),
  title: {
    default: "Lifeline Legacy Financial Group",
    template: "%s | Lifeline Legacy Financial Group",
  },
  description:
    "Education-first retirement income, family protection, business continuity, and legacy planning through the Continuity Bridge™.",
  applicationName: "Lifeline Legacy Financial Group",
  keywords: [
    "retirement income planning",
    "life insurance education",
    "annuities",
    "legacy protection",
    "business continuity",
    "Dallas Fort Worth",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Lifeline Legacy Financial Group",
    title: "Lifeline Legacy Financial Group",
    description:
      "Education first. A clearer way to coordinate continuity, certainty, and legacy.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
