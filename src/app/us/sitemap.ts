import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const BASE = "https://finazo.us";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let articles: Array<{ slug: string; publishedAt: Date | null }> = [];
  let authors: Array<{ slug: string }> = [];
  try {
    const { getPublishedUsArticles, getAllUsAuthors } = await import(
      "@/lib/queries/us-articles"
    );
    [articles, authors] = await Promise.all([
      getPublishedUsArticles({ language: "es" }).catch(() => []),
      getAllUsAuthors().catch(() => []),
    ]);
  } catch {
    // DB not available at build time — emit static URLs only
  }

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                       lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/seguros`,                lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/seguro-de-auto`,         lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/seguro-de-salud`,        lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/seguro-de-vida`,         lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/hipotecas`,              lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/credito`,                lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/prestamos`,              lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/remesas`,                lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/herramientas`,           lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/guias`,                  lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE}/acerca`,                 lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/metodologia`,            lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/estandares-editoriales`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const articleUrls: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE}/guias/${a.slug}`,
    lastModified: a.publishedAt ?? now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const authorUrls: MetadataRoute.Sitemap = authors.map((a) => ({
    url: `${BASE}/autor/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticUrls, ...articleUrls, ...authorUrls];
}
