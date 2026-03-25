import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/queries/articles";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getAllArticleSlugs();
  return slugs;
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const canonical = `https://finazo.lat/guias/${slug}`;

  return {
    title: `${article.title} — Finazo`,
    description: article.metaDescription ?? undefined,
    keywords: article.keywords ?? undefined,
    alternates: {
      canonical,
      languages: {
        "es-SV": canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription ?? undefined,
      url: canonical,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
    },
  };
}

export default async function GuiaPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    publisher: {
      "@type": "Organization",
      name: "Finazo",
      url: "https://finazo.lat",
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: "https://finazo.lat",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Guías",
          item: "https://finazo.lat/guias",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: article.title,
          item: `https://finazo.lat/guias/${slug}`,
        },
      ],
    },
  };

  // Split markdown content into paragraphs for basic rendering
  const paragraphs = article.content
    .split(/\n\n+/)
    .filter((p) => p.trim().length > 0);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header activePath="/guias" />

      <main className="mx-auto max-w-3xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            Inicio
          </Link>
          <span className="mx-2">›</span>
          <Link href="/guias" className="hover:text-slate-700">
            Guías
          </Link>
          <span className="mx-2">›</span>
          <span className="line-clamp-1">{article.title}</span>
        </div>

        <article>
          <header className="mb-8">
            <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900">
              {article.title}
            </h1>
            {article.metaDescription && (
              <p className="text-lg text-slate-600">{article.metaDescription}</p>
            )}
            {article.publishedAt && (
              <p className="mt-3 text-sm text-slate-400">
                Publicado el{" "}
                {new Date(article.publishedAt).toLocaleDateString("es-SV", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {article.wordCount && (
                  <> · {Math.ceil(article.wordCount / 200)} min de lectura</>
                )}
              </p>
            )}
          </header>

          <div className="prose prose-slate max-w-none">
            {paragraphs.map((paragraph, i) => {
              // Heading 2
              if (paragraph.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="mt-8 mb-3 text-xl font-bold text-slate-900"
                  >
                    {paragraph.replace(/^## /, "")}
                  </h2>
                );
              }
              // Heading 3
              if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="mt-6 mb-2 text-lg font-semibold text-slate-900"
                  >
                    {paragraph.replace(/^### /, "")}
                  </h3>
                );
              }
              // Heading 1
              if (paragraph.startsWith("# ")) {
                return (
                  <h2
                    key={i}
                    className="mt-8 mb-3 text-xl font-bold text-slate-900"
                  >
                    {paragraph.replace(/^# /, "")}
                  </h2>
                );
              }
              // Unordered list
              if (paragraph.startsWith("- ") || paragraph.startsWith("* ")) {
                const items = paragraph
                  .split("\n")
                  .filter((l) => l.startsWith("- ") || l.startsWith("* "));
                return (
                  <ul key={i} className="my-3 list-disc pl-6 space-y-1">
                    {items.map((item, j) => (
                      <li key={j} className="text-slate-700">
                        {item.replace(/^[-*] /, "")}
                      </li>
                    ))}
                  </ul>
                );
              }
              // Default paragraph
              return (
                <p key={i} className="my-3 text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>

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
