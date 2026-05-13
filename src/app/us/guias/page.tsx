import type { Metadata } from "next";
import Link from "next/link";
import {
  getPublishedUsArticles,
  getPublishedUsArticlesCount,
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
  formatRelativeDate,
  readingTime,
} from "@/components/us/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guías financieras para Hispanos en EE.UU.",
  description:
    "Guías en español sobre seguros, hipotecas, remesas, crédito e impuestos. Sin jerga, sin letra chica.",
  alternates: {
    canonical: "https://finazo.us/guias",
  },
  openGraph: {
    title: "Guías financieras para Hispanos en EE.UU.",
    description:
      "Guías en español sobre seguros, hipotecas, remesas y crédito.",
    url: "https://finazo.us/guias",
    locale: "es_US",
  },
};

const PAGE_SIZE = 18;

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  seguros: "Seguros",
  educacion: "Educación",
  tarjetas: "Crédito",
  ahorro: "Ahorro",
};

type RawArticle = Awaited<ReturnType<typeof getPublishedUsArticles>>[number];

function toFeatured(article: RawArticle): FeaturedArticle {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.metaDescription ?? "",
    category: CATEGORY_LABELS[article.category] ?? article.category,
    authorName: article.authorName,
    readingTime: readingTime(article.wordCount),
    publishedRelative: formatRelativeDate(article.publishedAt as Date | null),
    featuredImageUrl: article.featuredImageUrl,
  };
}

type SearchParams = { page?: string };

export default async function UsGuiasHubPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<React.ReactElement> {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [articles, total] = await Promise.all([
    getPublishedUsArticles({ limit: PAGE_SIZE, offset }).catch(() => []),
    getPublishedUsArticlesCount().catch(() => 0),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Magazine layout: hero (1) + 4 column cards (left=2, right=2) + thumb-list (rest)
  // Only on page 1; subsequent pages are flat thumb-list for consistency.
  const isFirstPage = page === 1;
  const hero = isFirstPage && articles[0] ? toFeatured(articles[0]) : null;
  const columnLeft = isFirstPage
    ? articles.slice(1, 3).map(toFeatured)
    : [];
  const columnRight = isFirstPage
    ? articles.slice(3, 5).map(toFeatured)
    : [];
  const restStart = isFirstPage ? 5 : 0;
  const rest = articles.slice(restStart).map(toFeatured);

  return (
    <>
      <Nav currentPath="/guias" />

      <main className="us-container">
        <div className="us-hub-head">
          <h1 className="us-serif">
            Guías de finanzas <i>para los nuestros</i>.
          </h1>
          <p>
            Seguro, hipoteca, remesas, crédito, taxes. Todo en español, escrito
            por nuestro equipo editorial. Sin jerga financiera, con números
            reales y fuentes citadas.
          </p>
        </div>

        <ClusterFilterNav active={null} />

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
            No hay guías publicadas todavía. Vuelve pronto.
          </p>
        )}

        {totalPages > 1 && (
          <nav className="us-pager" aria-label="Paginación">
            {page > 1 && (
              <Link href={`/guias?page=${page - 1}`}>← ANTERIOR</Link>
            )}
            <span className="us-pager-current">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/guias?page=${page + 1}`}>SIGUIENTE →</Link>
            )}
          </nav>
        )}
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
