import type { MetadataRoute } from "next";
import { canonicalSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${canonicalSiteUrl}/sitemap.xml`,
    host: canonicalSiteUrl,
  };
}
