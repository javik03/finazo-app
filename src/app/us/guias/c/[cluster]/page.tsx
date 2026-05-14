import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedUsArticles,
} from "@/lib/queries/us-articles";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import {
  FeaturedGrid,
  type FeaturedArticle,
} from "@/components/us/home/FeaturedGrid";
import { MoreArticles } from "@/components/us/home/MoreArticles";
import { ClusterFilterNav } from "@/components/us/cluster/ClusterFilterNav";
import {
  CLUSTERS,
  type ClusterKey,
  getClusterDefinition,
} from "@/lib/cluster-registry";
import {
  formatRelativeDate,
  readingTime,
} from "@/components/us/lib/format";

/**
 * Filtered article archive for a single cluster — the SEO-friendly
 * sibling of /guias. Renders the same magazine layout but filtered
 * to one cluster's articles.
 *
 * URL: /guias/c/<cluster>  (e.g. /guias/c/seguros, /guias/c/hipotecas)
 *
 * Distinct from the editorial cluster hub at /<cluster> (e.g.
 * /seguros) which carries the hero + product cards + FAQs + brand
 * messaging. This route is pure archive.
 */

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  seguros: "Seguros",
  educacion: "Educación",
  tarjetas: "Crédito",
  ahorro: "Ahorro",
};

type RawArticle = Awaited<ReturnType<typeof getPublishedUsArticles>>[number];

function toFeatured(article: RawArticle, label: string): FeaturedArticle {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.metaDescription ?? "",
    category: label,
    authorName: article.authorName,
    readingTime: readingTime(article.wordCount),
    publishedRelative: formatRelativeDate(article.publishedAt as Date | null),
    featuredImageUrl: article.featuredImageUrl,
  };
}

type Params = { cluster: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { cluster } = await params;
  if (!(cluster in CLUSTERS)) return {};
  const def = getClusterDefinition(cluster as ClusterKey);
  return {
    title: `Guías de ${def.label} para Hispanos en EE.UU.`,
    description: `Todas las guías de Finazo sobre ${def.topicDescription}. En español, con datos reales y citas a fuentes oficiales.`,
    alternates: {
      canonical: `https://finazo.us/guias/c/${cluster}`,
    },
    openGraph: {
      title: `Guías de ${def.label}`,
      description: `Todas las guías de Finazo sobre ${def.topicDescription}.`,
      url: `https://finazo.us/guias/c/${cluster}`,
      locale: "es_US",
      type: "website",
    },
  };
}

type SearchParams = { page?: string };

const PAGE_SIZE = 18;

export default async function UsGuiasClusterPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}): Promise<React.ReactElement> {
  const { cluster } = await params;
  if (!(cluster in CLUSTERS)) notFound();

  const clusterKey = cluster as ClusterKey;
  const def = getClusterDefinition(clusterKey);
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);

  // Fetch a wide pool then JS-filter via the registry rules. Reuses
  // the same logic as ClusterArticlesSection so /guias/c/<X> and
  // the editorial cluster hub's article-grid surface the same set.
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

  const offset = (page - 1) * PAGE_SIZE;
  const total = filtered.length;
  const articles = filtered.slice(offset, offset + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const isFirstPage = page === 1;
  const hero = isFirstPage && articles[0] ? toFeatured(articles[0], def.label) : null;
  const columnLeft = isFirstPage
    ? articles.slice(1, 3).map((a) => toFeatured(a, def.label))
    : [];
  const columnRight = isFirstPage
    ? articles.slice(3, 5).map((a) => toFeatured(a, def.label))
    : [];
  const restStart = isFirstPage ? 5 : 0;
  const rest = articles.slice(restStart).map((a) => toFeatured(a, def.label));

  return (
    <>
      <Nav currentPath="/guias" />

      <main className="us-container">
        <div className="us-hub-head">
          <h1 className="us-serif">
            Guías de <i>{def.label}</i>
          </h1>
          <p>
            Todas las guías de Finazo sobre {def.topicDescription}. Escritas
            en español por nuestro equipo editorial, con citas a fuentes
            oficiales y datos verificados.
          </p>
        </div>

        <ClusterFilterNav active={clusterKey} />

        {isFirstPage && hero && (
          <FeaturedGrid
            hero={hero}
            columnLeft={columnLeft}
            columnRight={columnRight}
          />
        )}

        {rest.length > 0 && (
          <>
            {isFirstPage && (
              <div className="us-section-head" style={{ paddingTop: 48 }}>
                <h2 className="us-serif">
                  Más <i>guías</i>
                </h2>
              </div>
            )}
            <MoreArticles articles={rest} variant="list" />
          </>
        )}

        {articles.length === 0 && (
          <p
            style={{
              textAlign: "center",
              padding: "48px 0",
              color: "var(--us-ink-3)",
            }}
          >
            Aún no hay guías publicadas en esta categoría. Vuelve pronto.
          </p>
        )}

        {totalPages > 1 && (
          <nav className="us-pager" aria-label="Paginación">
            {page > 1 && (
              <Link href={`/guias/c/${cluster}?page=${page - 1}`}>← ANTERIOR</Link>
            )}
            <span className="us-pager-current">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/guias/c/${cluster}?page=${page + 1}`}>SIGUIENTE →</Link>
            )}
          </nav>
        )}
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
