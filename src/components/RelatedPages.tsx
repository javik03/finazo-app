import Link from "next/link";
import {
  computeRelatedPages,
  type RelatedPage,
} from "@/lib/linker/compute-related-pages";

/**
 * Server component — bottom-of-article related-pages block.
 *
 * Reads from page_embeddings via cosine similarity. Returns null when
 * the source page has no embedding yet (graceful degradation during
 * Phase 1 backfill and when OPENAI_API_KEY is unset).
 *
 * Uses the existing us-info-card grid so it matches the visual
 * language of cluster pages.
 */

type Props = {
  sourceUrl: string;
  language: "es" | "en";
  /** How many cards to show. Default 5. */
  limit?: number;
  /** Heading override. Default "También te puede interesar". */
  heading?: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  seguros: "Seguros",
  educacion: "Educación",
  tarjetas: "Crédito",
  ahorro: "Ahorro",
  hipotecas: "Hipotecas",
  credito: "Crédito",
  fiscal: "Fiscal",
};

function labelFor(cluster: string): string {
  return CATEGORY_LABELS[cluster] ?? cluster;
}

export async function RelatedPages({
  sourceUrl,
  language,
  limit = 5,
  heading = "También te puede interesar",
}: Props): Promise<React.ReactElement | null> {
  let pages: RelatedPage[] = [];
  try {
    pages = await computeRelatedPages(sourceUrl, {
      limit,
      minSameCluster: 2,
      maxSameCluster: 3,
      language,
    });
  } catch {
    return null;
  }
  if (pages.length === 0) return null;

  const headingWords = heading.split(" ");
  const prefix = headingWords.slice(0, -1).join(" ");
  const tail = headingWords[headingWords.length - 1];

  return (
    <section className="us-sub-section">
      <div className="us-sub-section-head">
        <h2 className="us-serif">
          {prefix} <i>{tail}</i>
        </h2>
      </div>
      <div className="us-info-grid us-info-grid-3">
        {pages.map((page) => (
          <Link
            key={page.url}
            href={pathFromUrl(page.url)}
            className="us-info-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="us-eyebrow">{labelFor(page.cluster)}</div>
            <h3 className="us-serif">{page.title}</h3>
            <p>{page.description}</p>
            <div className="us-tool-link" style={{ marginTop: 16 }}>
              Leer la guía →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/**
 * page_embeddings stores fully-qualified URLs but the live site
 * routes off the path. Strip the origin if present.
 */
function pathFromUrl(url: string): string {
  if (url.startsWith("http")) {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }
  return url;
}
