import type { MetadataRoute } from "next";
import { canonicalSiteUrl } from "@/lib/seo";

const routes = [
  "",
  "/continuity-bridge",
  "/checkup",
  "/retirement-income",
  "/family-continuity",
  "/business-continuity",
  "/learn",
  "/about",
  "/privacy",
  "/terms",
  "/disclosures",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${canonicalSiteUrl}${route}`,
  }));
}
