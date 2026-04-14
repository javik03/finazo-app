import type { MetadataRoute } from "next";
import { CORRIDORS } from "@/lib/constants/corridors";
import { EN_CORRIDORS, getEnCorridorByEsSlug } from "@/lib/constants/en-corridors";
import { US_CITIES } from "@/lib/constants/us-cities";

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

  // ── Static pages ────────────────────────────────────────────────────────────

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      alternates: {
        languages: {
          "es-SV": `${base}`,
          "es-GT": `${base}`,
          "es-HN": `${base}`,
          "es-MX": `${base}`,
          "es-US": `${base}`,
          "en-US": `${base}/en`,
        },
      },
    },
    {
      url: `${base}/remesas`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
      alternates: {
        languages: {
          "es-SV": `${base}/remesas`,
          "es-GT": `${base}/remesas`,
          "es-HN": `${base}/remesas`,
          "es-MX": `${base}/remesas`,
          "es-US": `${base}/remesas`,
          "en-US": `${base}/en/send-money`,
        },
      },
    },
    {
      url: `${base}/prestamos`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          "es-SV": `${base}/prestamos`,
          "es-GT": `${base}/prestamos`,
          "es-HN": `${base}/prestamos`,
          "es-US": `${base}/prestamos`,
        },
      },
    },
    {
      url: `${base}/guias`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${base}/informes`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/el-salvador`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/guatemala`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/honduras`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/mexico`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/republica-dominicana`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    // English hub pages
    {
      url: `${base}/en`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          "en-US": `${base}/en`,
          "es-SV": `${base}`,
          "es-US": `${base}`,
        },
      },
    },
    {
      url: `${base}/en/send-money`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
      alternates: {
        languages: {
          "en-US": `${base}/en/send-money`,
          "es-SV": `${base}/remesas`,
          "es-US": `${base}/remesas`,
        },
      },
    },
  ];

  // ── Spanish corridor pages (with English alternates where available) ────────

  const corridorUrls: MetadataRoute.Sitemap = CORRIDORS.map((c) => {
    const enCorridor = getEnCorridorByEsSlug(c.slug);
    return {
      url: `${base}/remesas/${c.slug}`,
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.8,
      alternates: enCorridor
        ? {
            languages: {
              "es-SV": `${base}/remesas/${c.slug}`,
              "es-GT": `${base}/remesas/${c.slug}`,
              "es-HN": `${base}/remesas/${c.slug}`,
              "es-MX": `${base}/remesas/${c.slug}`,
              "es-US": `${base}/remesas/${c.slug}`,
              "en-US": `${base}/en/send-money/${enCorridor.slug}`,
            },
          }
        : undefined,
    };
  });

  // ── English corridor pages ───────────────────────────────────────────────────

  const enCorridorUrls: MetadataRoute.Sitemap = EN_CORRIDORS.map((c) => ({
    url: `${base}/en/send-money/${c.slug}`,
    lastModified: now,
    changeFrequency: "hourly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        "en-US": `${base}/en/send-money/${c.slug}`,
        "es-SV": `${base}/remesas/${c.esSlug}`,
        "es-GT": `${base}/remesas/${c.esSlug}`,
        "es-US": `${base}/remesas/${c.esSlug}`,
      },
    },
  }));

  // ── City-level pages (English, US Hispanic) ──────────────────────────────────

  const cityUrls: MetadataRoute.Sitemap = US_CITIES.map((c) => ({
    url: `${base}/en/send-money/from/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
    alternates: {
      languages: {
        "en-US": `${base}/en/send-money/from/${c.slug}`,
        "es-US": `${base}/remesas/${c.esCorridorSlug}`,
      },
    },
  }));

  // ── DB-backed pages ──────────────────────────────────────────────────────────

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

  return [
    ...staticUrls,
    ...corridorUrls,
    ...enCorridorUrls,
    ...cityUrls,
    ...bankUrls,
    ...articleUrls,
  ];
}
