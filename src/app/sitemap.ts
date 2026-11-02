import type { MetadataRoute } from "next";
import { canonicalSiteUrl } from "@/lib/seo";

const routes = [
  "",
  "/continuity-bridge",
  "/checkup",
  "/retirement-income-checkup",
  "/retirement-income",
  "/family-continuity",
  "/family-continuity-map",
  "/business-continuity",
  "/learn",
  "/retirement-catch-up",
  "/learn/seminar-archive",
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
