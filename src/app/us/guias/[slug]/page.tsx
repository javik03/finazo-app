import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getUsArticleBySlug,
  getAllUsArticleSlugs,
  getUsRelatedArticles,
  getUsAuthorByDisplayName,
  getTranslationCounterpartSlug,
} from "@/lib/queries/us-articles";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { ArticleHeader } from "@/components/us/article/ArticleHeader";
import { ArticleProse } from "@/components/us/article/ArticleProse";
import { RelatedArticles } from "@/components/us/article/RelatedArticles";
import { StateAwareCTA } from "@/components/us/article/StateAwareCTA";
import { extractFaqEntries, buildFaqSchema } from "@/lib/faq-extractor";
import { resolveArticleGeo } from "@/lib/article-geo";

export const revalidate = 3600;

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    return await getAllUsArticleSlugs();
  } catch {
    return [];
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  seguros: "Seguros",
  educacion: "Educación financiera",
  tarjetas: "Crédito",
  ahorro: "Ahorro",
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getUsArticleBySlug(slug);
  if (!article) return {};

  const canonical = `https://finazo.us/guias/${slug}`;

  // Per spec §1.7.3 — if an English counterpart exists, emit it under en-US.
  // Spanish is always the x-default since it's the primary audience.
  const counterpart = await getTranslationCounterpartSlug({
    id: article.id,
    language: article.language,
    translationOf: article.translationOf,
  }).catch(() => null);

  const languages: Record<string, string> = {
    "es-US": canonical,
    "x-default": canonical,
  };
  if (counterpart?.language === "en") {
    languages["en-US"] = `https://finazo.us/en/${counterpart.slug}`;
  }

  return {
    title:
      article.title.length > 60
        ? article.title.slice(0, 57) + "…"
        : article.title,
    description: article.metaDescription ?? undefined,
    keywords: article.keywords ?? undefined,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription ?? undefined,
      url: canonical,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      images: article.featuredImageUrl
        ? [{ url: article.featuredImageUrl, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

export default async function UsGuiaPage({
  params,
}: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const article = await getUsArticleBySlug(slug);
  if (!article) notFound();

  const [related, author] = await Promise.all([
    getUsRelatedArticles(slug, article.category, 5).catch(() => []),
    article.authorSlug
      ? null // future: getUsAuthorBySlug(article.authorSlug)
      : article.authorName
        ? getUsAuthorByDisplayName(article.authorName).catch(() => null)
        : null,
  ]);

  const authorDisplayName =
    author?.displayName ?? article.authorName ?? "Equipo Finazo";
  const authorSlug = author?.slug ?? article.authorSlug ?? null;
  const authorInitial = authorDisplayName.charAt(0).toUpperCase();

  const categoryLabel = CATEGORY_LABELS[article.category] ?? article.category;

  const faqEntries = extractFaqEntries(article.content);
  const faqSchema = buildFaqSchema(faqEntries);
  const geo = resolveArticleGeo(
    slug,
    article.category,
    (article.templateVariables ?? null) as Parameters<typeof resolveArticleGeo>[2],
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://finazo.us",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guías",
        item: "https://finazo.us/guias",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://finazo.us/guias/${slug}`,
      },
    ],
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    inLanguage: article.language === "en" ? "en-US" : "es-US",
    author: author
      ? {
          "@type": "Person",
          name: author.displayName,
          url: `https://finazo.us/autor/${author.slug}`,
          ...(author.linkedinUrl
            ? { sameAs: [author.linkedinUrl] }
            : {}),
        }
      : {
          "@type": "Organization",
          name: "Finazo",
          url: "https://finazo.us",
        },
    publisher: {
      "@type": "Organization",
      name: "Finazo",
      url: "https://finazo.us",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Nav currentPath="/guias" />

      <main className="us-page-shell">
        <UsBreadcrumb
          crumbs={[
            { label: "Inicio", href: "/" },
            { label: "Guías", href: "/guias" },
            { label: article.title },
          ]}
        />

        <article>
          <ArticleHeader
            category={article.category}
            title={article.title}
            deck={article.metaDescription}
            authorDisplayName={authorDisplayName}
            authorSlug={authorSlug}
            authorInitial={authorInitial}
            publishedAt={article.publishedAt}
            updatedAt={article.updatedAt}
            wordCount={article.wordCount}
            featuredImageUrl={article.featuredImageUrl}
          />

          <ArticleProse content={article.content} />
        </article>

        <RelatedArticles
          articles={related}
          categoryLabel={categoryLabel}
          categoryHref="/guias"
        />

        <StateAwareCTA state={geo.state} product={geo.product} />
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
