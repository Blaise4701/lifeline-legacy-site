import type { MetadataRoute } from "next";

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
    url: `https://lifelinelegacyfinancial.com${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "monthly" : "yearly",
    priority: route === "" ? 1 : route === "/checkup" ? 0.9 : 0.7,
  }));
}
