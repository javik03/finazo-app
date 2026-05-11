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
  formatRelativeDate,
  readingTime,
} from "@/components/us/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guías financieras para Hispanos en EE.UU. | Finazo",
  description:
    "Guías en español sobre seguros, hipotecas, remesas, crédito e impuestos. Sin jerga, sin letra chica.",
  alternates: {
    canonical: "https://finazo.us/guias",
    languages: {
      "es-US": "https://finazo.us/guias",
    },
  },
  openGraph: {
    title: "Guías financieras para Hispanos en EE.UU.",
    description:
      "Guías en español sobre seguros, hipotecas, remesas y crédito.",
    url: "https://finazo.us/guias",
    locale: "es_US",
  },
};

const PAGE_SIZE = 12;

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  seguros: "Seguros",
  educacion: "Educación",
  tarjetas: "Crédito",
  ahorro: "Ahorro",
};

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

        <div className="us-hub-grid">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/us/guias/${article.slug}`}
              className="us-list-art"
            >
              <span className="us-art-cat">
                {CATEGORY_LABELS[article.category] ?? article.category}
              </span>
              <h3 className="us-serif">{article.title}</h3>
              {article.metaDescription && <p>{article.metaDescription}</p>}
              <div className="us-art-meta">
                {article.authorName && <span>{article.authorName}</span>}
                {article.authorName && <span className="us-sep" />}
                <span>{readingTime(article.wordCount)}</span>
                <span className="us-sep" />
                <span>
                  {formatRelativeDate(article.publishedAt as Date | null)}
                </span>
              </div>
            </Link>
          ))}
        </div>

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
              <Link href={`/us/guias?page=${page - 1}`}>← ANTERIOR</Link>
            )}
            <span className="us-pager-current">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/us/guias?page=${page + 1}`}>SIGUIENTE →</Link>
            )}
          </nav>
        )}
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
