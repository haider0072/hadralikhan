import type { MetadataRoute } from "next";
import { seo } from "@/data/seo";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: seo.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${seo.url}/classic`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${seo.url}/work/mochi`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  const workRoutes: MetadataRoute.Sitemap = projects
    .filter((p) => p.slug !== "mochi")
    .map((p) => ({
      url: `${seo.url}/work/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: p.featured ? 0.8 : 0.6,
    }));

  return [...staticRoutes, ...workRoutes];
}
