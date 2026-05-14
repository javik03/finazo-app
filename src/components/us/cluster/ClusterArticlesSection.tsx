import { getPublishedUsArticles } from "@/lib/queries/us-articles";
import {
  getClusterDefinition,
  type ClusterDefinition,
  type ClusterKey,
} from "@/lib/cluster-registry";
import {
  FeaturedGrid,
  type FeaturedArticle,
} from "@/components/us/home/FeaturedGrid";
import { MoreArticles } from "@/components/us/home/MoreArticles";
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

type ArticleRow = Awaited<ReturnType<typeof getPublishedUsArticles>>[number];

async function fetchClusterArticles(
  def: ClusterDefinition,
  limit: number,
): Promise<ArticleRow[]> {
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

function toFeatured(a: ArticleRow, label: string): FeaturedArticle {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.metaDescription ?? "",
    category: label,
    authorName: a.authorName,
    readingTime: readingTime(a.wordCount),
    publishedRelative: formatRelativeDate(a.publishedAt),
    featuredImageUrl: a.featuredImageUrl,
  };
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

  // Magazine layout: hero + 2-column featured (4 items) + thumb-list rest
  const hero = articles[0] ? toFeatured(articles[0], def.label) : null;
  const columnLeft = articles.slice(1, 3).map((a) => toFeatured(a, def.label));
  const columnRight = articles.slice(3, 5).map((a) => toFeatured(a, def.label));
  const rest = articles.slice(5).map((a) => toFeatured(a, def.label));

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

      {hero && (
        <FeaturedGrid
          hero={hero}
          columnLeft={columnLeft}
          columnRight={columnRight}
        />
      )}

      {rest.length > 0 && (
        <div style={{ paddingTop: 32 }}>
          <MoreArticles articles={rest} variant="list" />
        </div>
      )}
    </section>
  );
}
