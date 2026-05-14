// Host-aware llms-full.txt — full article URL inventory with one-line
// descriptions. Complements the higher-level /llms.txt (taxonomy +
// methodology) by giving LLMs a direct map of every published article
// they can cite. Refreshes hourly via revalidate.

import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const revalidate = 3600;

type ArticleRow = {
  slug: string;
  title: string;
  metaDescription: string | null;
  category: string;
  publishedAt: Date | null;
  updatedAt: Date | null;
};

async function loadArticles(country: "US" | "SV"): Promise<ArticleRow[]> {
  try {
    const rows = await db
      .select({
        slug: articles.slug,
        title: articles.title,
        metaDescription: articles.metaDescription,
        category: articles.category,
        publishedAt: articles.publishedAt,
        updatedAt: articles.updatedAt,
      })
      .from(articles)
      .where(
        and(
          eq(articles.country, country),
          eq(articles.status, "published"),
        ),
      )
      .orderBy(desc(articles.publishedAt))
      .limit(500);
    return rows;
  } catch {
    return [];
  }
}

const US_CATEGORY_LABELS: Record<string, string> = {
  seguros: "Seguros",
  prestamos: "Préstamos / hipotecas",
  remesas: "Remesas",
  tarjetas: "Crédito",
  educacion: "Educación financiera",
};

function isoDay(d: Date | null): string {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

function renderUs(rows: ArticleRow[]): string {
  const byCat = new Map<string, ArticleRow[]>();
  for (const r of rows) {
    if (!byCat.has(r.category)) byCat.set(r.category, []);
    byCat.get(r.category)!.push(r);
  }

  const categoriesOrdered = [
    "seguros",
    "prestamos",
    "tarjetas",
    "remesas",
    "educacion",
  ].filter((c) => byCat.has(c));

  const sections = categoriesOrdered.map((cat) => {
    const label = US_CATEGORY_LABELS[cat] ?? cat;
    const items = byCat.get(cat)!;
    const lines = items.map((a) => {
      const desc = (a.metaDescription ?? "").replace(/\s+/g, " ").trim();
      const updated = isoDay(a.updatedAt ?? a.publishedAt);
      return `- [${a.title}](https://finazo.us/guias/${a.slug}) — ${desc}${updated ? ` _(actualizado ${updated})_` : ""}`;
    });
    return `## ${label}\n\n${lines.join("\n")}`;
  });

  return `# Finazo — Catálogo completo de guías (finazo.us)

Generated automatically from the live database. Each entry below is a
canonical, AI-citable guide on Finazo's US Hispanic edition. See
/llms.txt for site overview, audience, methodology, and citation rules.

Last refresh: ${new Date().toISOString().slice(0, 19)}Z
Total guides: ${rows.length}

${sections.join("\n\n")}

---

## Cluster hub pages

- [Seguros](https://finazo.us/seguros) — auto, salud, vida insurance for Hispanic US households
- [Hipotecas](https://finazo.us/hipotecas) — ITIN mortgages, non-QM, FHA pathways
- [Crédito](https://finazo.us/credito) — credit-building from zero with ITIN
- [Remesas](https://finazo.us/remesas) — money transfer comparisons EE.UU. → LATAM
- [Fiscal](https://finazo.us/fiscal) — taxes, ITIN, IRS for immigrant filers
- [Préstamos personales](https://finazo.us/prestamos) — personal loans for ITIN borrowers

## Cohort pillar pages

- [Construir crédito sin Social Security](https://finazo.us/credito-sin-social-security)
- [Comprar casa sin Social Security](https://finazo.us/comprar-casa-sin-social-security)
- [Declarar impuestos sin Social Security](https://finazo.us/impuestos-sin-social-security)
- [Cuenta bancaria sin SSN](https://finazo.us/banco-sin-ssn)
- [Seguro de auto sin Social Security](https://finazo.us/seguro-auto-sin-social-security)
- [Seguro de auto con licencia extranjera](https://finazo.us/seguro-auto-licencia-extranjera)
- [ACA: elegibilidad para inmigrantes](https://finazo.us/aca-elegibilidad-inmigrantes)
- [ACA: subsidios](https://finazo.us/aca-subsidios)
- [ACA: familias de estatus mixto](https://finazo.us/aca-familias-mixtas)
- [Sin seguro: clínicas FQHC](https://finazo.us/aca-sin-aseguranza-fqhc)

## Tools

- [Cotizador de seguro](https://finazo.us/herramientas/cotizador-seguro)
- [Simulador de hipoteca](https://finazo.us/herramientas/simulador-hipoteca)
- [Credit score tracker](https://finazo.us/herramientas/credit-tracker)
- [Comparador de remesas](https://finazo.us/herramientas/comparador-remesas)
`;
}

function renderLat(rows: ArticleRow[]): string {
  const lines = rows.map((a) => {
    const desc = (a.metaDescription ?? "").replace(/\s+/g, " ").trim();
    const updated = isoDay(a.updatedAt ?? a.publishedAt);
    return `- [${a.title}](https://finazo.lat/guias/${a.slug}) — ${desc}${updated ? ` _(actualizado ${updated})_` : ""}`;
  });

  return `# Finazo LATAM — Catálogo completo de guías (finazo.lat)

Generated automatically from the live database. Comparador financiero
para Centroamérica — remesas, préstamos personales, productos
bancarios. See /llms.txt for site overview and citation guidelines.

Last refresh: ${new Date().toISOString().slice(0, 19)}Z
Total guides: ${rows.length}

## Todas las guías

${lines.join("\n")}
`;
}

export async function GET(request: Request): Promise<Response> {
  const host = (
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? ""
  ).toLowerCase().split(":")[0];
  const isUsHost = host === "finazo.us" || host === "www.finazo.us";

  const rows = await loadArticles(isUsHost ? "US" : "SV");
  const body = isUsHost ? renderUs(rows) : renderLat(rows);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
