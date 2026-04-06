import type { MetadataRoute } from "next";
import { CORRIDORS } from "@/lib/constants/corridors";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://finazo.lat";
  const now = new Date();

  // Lazy-import DB query modules so the DB connection is never established
  // at build time (DATABASE_URL is not available in the build environment).
  let loanSlugs: { slug: string }[] = [];
  let articleSlugs: { slug: string }[] = [];
  try {
    const [{ getAllLoanProviderSlugs }, { getAllArticleSlugs }] = await Promise.all([
      import("@/lib/queries/loans"),
      import("@/lib/queries/articles"),
    ]);
    [loanSlugs, articleSlugs] = await Promise.all([
      getAllLoanProviderSlugs().catch(() => [] as { slug: string }[]),
      getAllArticleSlugs().catch(() => [] as { slug: string }[]),
    ]);
  } catch {
    // DB not available at build time — return static URLs only
  }

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/remesas`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${base}/prestamos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/guias`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    // Legacy query-param URLs for backwards compatibility
    {
      url: `${base}/remesas?desde=US&hacia=SV`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.5,
    },
    {
      url: `${base}/prestamos?tipo=personal`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];

  const corridorUrls: MetadataRoute.Sitemap = CORRIDORS.map((c) => ({
    url: `${base}/remesas/${c.slug}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.8,
  }));

  const bankUrls: MetadataRoute.Sitemap = loanSlugs.map((r) => ({
    url: `${base}/prestamos/${r.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const articleUrls: MetadataRoute.Sitemap = articleSlugs.map((r) => ({
    url: `${base}/guias/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticUrls, ...corridorUrls, ...bankUrls, ...articleUrls];
}
