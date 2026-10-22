import type { MetadataRoute } from "next";
import { canonicalSiteUrl } from "@/lib/seo";

const routes = [
  "",
  "/continuity-bridge",
  "/checkup",
  "/retirement-income-checkup",
  "/retirement-income",
  "/iul-retirement-strategy",
  "/family-continuity",
  "/family-continuity-map",
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
