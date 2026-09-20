import { licensedStates, site } from "@/lib/site-data";
import { canonicalSiteUrl } from "@/lib/seo";

const personId = `${canonicalSiteUrl}/about#blaise-tamo`;
const organizationId = `${canonicalSiteUrl}/#organization`;

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "InsuranceAgency"],
      "@id": organizationId,
      name: site.name,
      url: canonicalSiteUrl,
      logo: `${canonicalSiteUrl}/brand/llfg-logo.png`,
      email: site.email,
      telephone: site.phone,
      slogan: "Protecting families. Building legacies.",
      areaServed: [
        {
          "@type": "AdministrativeArea",
          name: "Dallas–Fort Worth, Texas",
        },
        ...licensedStates.map((state) => ({
          "@type": "State",
          name: state,
        })),
      ],
      founder: {
        "@id": personId,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${canonicalSiteUrl}/#website`,
      url: canonicalSiteUrl,
      name: site.name,
      publisher: {
        "@id": organizationId,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "Person",
      "@id": personId,
      name: "Blaise Tamo",
      url: `${canonicalSiteUrl}/about`,
      jobTitle: "Founder & CEO · Retirement Income & Legacy Protection Specialist",
      worksFor: {
        "@id": organizationId,
      },
      knowsAbout: [
        "Retirement income planning",
        "Life insurance",
        "Annuities",
        "Family continuity planning",
        "Business continuity planning",
        "Legacy planning",
      ],
    },
  ],
};

export function SeoStructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
      }}
    />
  );
}
