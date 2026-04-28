import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllUsAuthors,
  getUsAuthorBySlug,
  getPublishedUsArticles,
} from "@/lib/queries/us-articles";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import {
  formatRelativeDate,
  readingTime,
} from "@/components/us/lib/format";

export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const authors = await getAllUsAuthors();
    return authors.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = await getUsAuthorBySlug(slug).catch(() => null);
  if (!author) return {};

  const canonical = `https://finazo.us/autor/${slug}`;

  return {
    title: `${author.displayName} — autor en Finazo`,
    description: author.bioShort ?? `Artículos de ${author.displayName} en Finazo.`,
    alternates: { canonical },
    openGraph: {
      title: `${author.displayName} — Finazo`,
      description: author.bioShort ?? undefined,
      url: canonical,
      type: "profile",
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  seguros: "Seguros",
  educacion: "Educación",
  tarjetas: "Crédito",
  ahorro: "Ahorro",
};

export default async function AutorPage({
  params,
}: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const author = await getUsAuthorBySlug(slug).catch(() => null);
  if (!author) notFound();

  // Author's articles via legacy authorName match.
  // Once authorSlug is backfilled, this will use the FK directly.
  const allArticles = await getPublishedUsArticles({ limit: 50 }).catch(
    () => [],
  );
  const authorArticles = allArticles.filter(
    (a) =>
      a.authorSlug === author.slug || a.authorName === author.displayName,
  );

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.displayName,
    description: author.bioShort,
    url: `https://finazo.us/autor/${author.slug}`,
    ...(author.linkedinUrl ? { sameAs: [author.linkedinUrl] } : {}),
    jobTitle: "Editor / Redactor en Finazo",
    worksFor: {
      "@type": "Organization",
      name: "Finazo",
      url: "https://finazo.us",
    },
    knowsAbout: author.expertise ?? [],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Nav currentPath="/us/acerca" />

      <main className="us-page-shell">
        <UsBreadcrumb
          crumbs={[
            { label: "Inicio", href: "/us" },
            { label: "Acerca", href: "/us/acerca" },
            { label: author.displayName },
          ]}
        />

        <div className="us-author-hero">
          <div className="us-big-avatar">
            {author.displayName.charAt(0)}
          </div>
          <div>
            <h1 className="us-serif">{author.displayName}</h1>
            <div className="us-author-role">
              EQUIPO EDITORIAL · FINAZO
            </div>
            {author.linkedinUrl && (
              <div className="us-author-links">
                <a
                  href={author.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn ↗
                </a>
                {author.twitterUrl && (
                  <a
                    href={author.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter / X ↗
                  </a>
                )}
              </div>
            )}
            {author.expertise && author.expertise.length > 0 && (
              <div className="us-author-expertise">
                {author.expertise.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {author.bioLong && (
          <div className="us-prose" style={{ marginBottom: 48 }}>
            <p>{author.bioLong}</p>
          </div>
        )}

        <h2
          className="us-serif"
          style={{
            fontSize: 22,
            fontWeight: 500,
            marginBottom: 18,
            color: "var(--us-ink)",
          }}
        >
          Artículos de {author.displayName.split(" ")[0]}
        </h2>

        {authorArticles.length === 0 ? (
          <p style={{ color: "var(--us-ink-3)", padding: "20px 0" }}>
            Aún no hay artículos publicados de este autor.
          </p>
        ) : (
          <ul className="us-related-list">
            {authorArticles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/us/guias/${article.slug}`}
                  className="us-related-item"
                  style={{ alignItems: "flex-start" }}
                >
                  <svg
                    className="us-arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ marginTop: 6 }}
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                  <div>
                    <div className="us-related-item-title">
                      {article.title}
                    </div>
                    <div className="us-related-item-meta">
                      {CATEGORY_LABELS[article.category] ?? article.category}
                      {" · "}
                      {readingTime(article.wordCount)}
                      {" · "}
                      {formatRelativeDate(
                        article.publishedAt as Date | null,
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
