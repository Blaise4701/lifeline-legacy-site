import type { Metadata } from "next";

export const canonicalSiteUrl = "https://lifelinelegacyfinancial.com";
export const organizationName = "Lifeline Legacy Financial Group";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noindex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  keywords,
  noindex = false,
}: PageMetadataOptions): Metadata {
  const canonical = path === "/" ? canonicalSiteUrl : `${canonicalSiteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    keywords,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: organizationName,
      title,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: noindex
      ? {
          index: false,
          follow: true,
          googleBot: { index: false, follow: true },
        }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
  };
}
