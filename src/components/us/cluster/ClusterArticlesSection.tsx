import Link from "next/link";
import { getPublishedUsArticles } from "@/lib/queries/us-articles";
import {
  getClusterDefinition,
  type ClusterDefinition,
  type ClusterKey,
} from "@/lib/cluster-registry";
import {
  formatRelativeDate,
  readingTime,
} from "@/components/us/lib/format";

/**
 * Cluster hub article list — dynamic.
 *
 * Drop this server component into any cluster page (e.g. /us/seguros)
 * and it auto-surfaces every published article whose category + slug
 * pattern matches the registry entry for that cluster.
 *
 * Adding a new article in the right category → it appears here on the
 * next revalidate (no code edit).
 *
 * Adding a new cluster → add an entry to cluster-registry.ts, drop
 * this component into the new cluster page with the right clusterKey.
 *
 * See cluster-registry.ts for the full add-new-cluster recipe.
 */

type Props = {
  clusterKey: ClusterKey;
  /** Override the section heading. Default: "Guías relacionadas" */
  heading?: string;
  /** Max number of articles to display. Default 12. */
  limit?: number;
};

async function fetchClusterArticles(
  def: ClusterDefinition,
  limit: number,
): Promise<
  Array<{
    slug: string;
    title: string;
    metaDescription: string | null;
    publishedAt: Date | null;
    wordCount: number | null;
    authorName: string | null;
  }>
> {
  // Fetch a wide pool of US-published articles, then filter in JS by
  // category + slug rules. Total US published count is small (<150)
  // so this is much cheaper than running 2-3 parallel category queries
  // and deduping.
  const pool = await getPublishedUsArticles({ limit: 200 }).catch(() => []);

  let filtered = pool;

  if (def.dbCategories.length > 0) {
    const allowed = new Set(def.dbCategories);
    filtered = filtered.filter((a) => allowed.has(a.category));
  }

  if (def.slugIncludes && def.slugIncludes.length > 0) {
    filtered = filtered.filter((a) =>
      def.slugIncludes!.some((frag) => a.slug.includes(frag)),
    );
  }

  if (def.slugExcludes && def.slugExcludes.length > 0) {
    filtered = filtered.filter(
      (a) => !def.slugExcludes!.some((frag) => a.slug.includes(frag)),
    );
  }

  return filtered.slice(0, limit);
}

export async function ClusterArticlesSection({
  clusterKey,
  heading = "Guías relacionadas",
  limit = 12,
}: Props): Promise<React.ReactElement | null> {
  const def = getClusterDefinition(clusterKey);
  const articles = await fetchClusterArticles(def, limit);

  if (articles.length === 0) return null;

  // Split heading on last space so the final word renders italic
  // (matches the existing Lora-italic emphasis pattern site-wide).
  const headingWords = heading.split(" ");
  const headingPrefix = headingWords.slice(0, -1).join(" ");
  const headingTail = headingWords[headingWords.length - 1];

  return (
    <section className="us-sub-section">
      <div className="us-sub-section-head">
        <h2 className="us-serif">
          {headingPrefix}{" "}
          <i>{headingTail}</i>
        </h2>
        <p>
          Las guías más recientes de Finazo sobre {def.topicDescription}.
        </p>
      </div>
      <div className="us-hub-grid">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/guias/${a.slug}`}
            className="us-list-art"
          >
            <span className="us-art-cat">{def.label}</span>
            <h3 className="us-serif">{a.title}</h3>
            {a.metaDescription && <p>{a.metaDescription}</p>}
            <div className="us-art-meta">
              {a.authorName && <span>{a.authorName}</span>}
              {a.authorName && <span className="us-sep" />}
              <span>{readingTime(a.wordCount)}</span>
              <span className="us-sep" />
              <span>{formatRelativeDate(a.publishedAt)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
