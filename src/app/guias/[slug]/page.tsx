import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticleSlugs, getRelatedArticles } from "@/lib/queries/articles";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CommentSection } from "@/components/articles/CommentSection";
import { ArticleMarkdown } from "@/components/articles/ArticleMarkdown";

export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    return await getAllArticleSlugs();
  } catch {
    // DB not available at build time — pages will be generated on first request
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const canonical = `https://finazo.lat/guias/${slug}`;

  return {
    title: article.title.length > 60 ? article.title.slice(0, 57) + "…" : article.title,
    description: article.metaDescription ?? undefined,
    keywords: article.keywords ?? undefined,
    alternates: {
      canonical,
      languages: {
        "es-SV": canonical,
        "es-GT": canonical,
        "es-HN": canonical,
        "es-US": canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription ?? undefined,
      url: canonical,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      images: article.featuredImageUrl ? [{ url: article.featuredImageUrl, width: 1200, height: 630 }] : undefined,
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  tarjetas: "Tarjetas",
  seguros: "Seguros",
  educacion: "Educación financiera",
};

export default async function GuiaPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(slug, article.category, 5).catch(() => []);

  const authorDisplayName = article.authorName ?? "Equipo Finazo";
  const isNamedAuthor = Boolean(article.authorName);

  const categoryLabel = article.category ? (CATEGORY_LABELS[article.category] ?? null) : null;
  const categoryPath = article.category ? `/guias/${article.category}` : "/guias";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    author: isNamedAuthor
      ? {
          "@type": "Person",
          name: article.authorName,
          url: "https://finazo.lat/autor/javier-keough",
        }
      : {
          "@type": "Organization",
          name: "Finazo",
          url: "https://finazo.lat",
        },
    publisher: {
      "@type": "Organization",
      name: "Finazo",
      url: "https://finazo.lat",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
        { "@type": "ListItem", position: 2, name: "Guías", item: "https://finazo.lat/guias" },
        ...(categoryLabel
          ? [{ "@type": "ListItem", position: 3, name: categoryLabel, item: `https://finazo.lat${categoryPath}` }]
          : []),
        {
          "@type": "ListItem",
          position: categoryLabel ? 4 : 3,
          name: article.title,
          item: `https://finazo.lat/guias/${slug}`,
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header activePath="/guias" />

      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-1 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">Inicio</Link>
          <span className="mx-1">›</span>
          <Link href="/guias" className="hover:text-slate-700">Guías</Link>
          {categoryLabel && (
            <>
              <span className="mx-1">›</span>
              <Link href={categoryPath} className="hover:text-slate-700">{categoryLabel}</Link>
            </>
          )}
          <span className="mx-1">›</span>
          <span className="line-clamp-1">{article.title}</span>
        </div>

        <article>
          <header className="mb-8 border-b border-slate-100 pb-8">
            {/* Category badge */}
            {categoryLabel && (
              <span className="mb-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                {categoryLabel}
              </span>
            )}

            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {article.title}
            </h1>

            {article.metaDescription && (
              <p className="text-lg text-slate-600 leading-relaxed">{article.metaDescription}</p>
            )}

            {article.featuredImageUrl && (
              <div className="mt-6 overflow-hidden rounded-2xl">
                <Image
                  src={article.featuredImageUrl}
                  alt={article.title}
                  width={1200}
                  height={630}
                  className="w-full object-cover"
                  priority
                />
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              {article.publishedAt && (
                <span>
                  Actualizado:{" "}
                  {new Date(article.publishedAt).toLocaleDateString("es-SV", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {article.wordCount && (
                <>
                  <span>·</span>
                  <span>{Math.ceil(article.wordCount / 200)} min de lectura</span>
                </>
              )}
              <span>·</span>
              {isNamedAuthor ? (
                <Link
                  href="/autor/javier-keough"
                  className="font-medium text-emerald-600 hover:underline"
                >
                  {authorDisplayName}
                </Link>
              ) : (
                <span className="font-medium text-emerald-600">{authorDisplayName}</span>
              )}
            </div>
          </header>

          <ArticleMarkdown content={article.content} />
        </article>

        <CommentSection articleSlug={slug} />

        {/* Related articles */}
        {related.length > 0 && (
          <aside className="mt-12 border-t border-slate-100 pt-10">
            <h2 className="mb-5 text-lg font-bold text-slate-900">
              {categoryLabel ? `Más guías de ${categoryLabel}` : "Guías relacionadas"}
            </h2>
            <ul className="space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/guias/${r.slug}`}
                    className="group flex items-start gap-3 rounded-lg border border-slate-100 p-4 transition-shadow hover:shadow-sm"
                  >
                    <span
                      className="mt-0.5 shrink-0 text-emerald-500"
                      aria-hidden="true"
                    >
                      →
                    </span>
                    <div>
                      <p className="font-medium text-slate-900 group-hover:text-emerald-700 leading-snug">
                        {r.title}
                      </p>
                      {r.publishedAt && (
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(r.publishedAt).toLocaleDateString("es-SV", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {categoryLabel && (
              <Link
                href={categoryPath}
                className="mt-4 inline-block text-sm text-emerald-600 hover:underline"
              >
                Ver todas las guías de {categoryLabel} →
              </Link>
            )}
          </aside>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="mb-2 font-semibold text-slate-900">
            Compara tasas en tiempo real
          </h2>
          <p className="mb-4 text-sm text-slate-600">
            Usa Finazo para comparar remesas y préstamos con datos oficiales y
            actualizados.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/remesas"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Comparar remesas
            </Link>
            <Link
              href="/prestamos"
              className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Comparar préstamos
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
