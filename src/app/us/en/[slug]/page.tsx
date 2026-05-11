import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getUsArticleBySlug,
  getUsAuthorByDisplayName,
  getTranslationCounterpartSlug,
} from "@/lib/queries/us-articles";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { ArticleHeader } from "@/components/us/article/ArticleHeader";
import { ArticleProse } from "@/components/us/article/ArticleProse";
import { StateAwareCTA } from "@/components/us/article/StateAwareCTA";
import { extractFaqEntries, buildFaqSchema } from "@/lib/faq-extractor";
import { resolveArticleGeo } from "@/lib/article-geo";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export const revalidate = 3600;

/**
 * English article route — Finazo Lane A and Lane B per spec §1.4.1.b.
 * Reads articles where language='en' and country='US'. Hreflang back to
 * Spanish counterpart is emitted when one exists.
 *
 * Until English content begins publishing (spec §6.5: month 2+ for Lane A,
 * month 3+ for Lane B), this route returns 404 for every slug — which is
 * exactly the right behavior. The scaffold is in place so adding English
 * articles is just a DB insert.
 */

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const rows = await db
      .select({ slug: articles.slug })
      .from(articles)
      .where(
        and(
          eq(articles.status, "published"),
          eq(articles.country, "US"),
          eq(articles.language, "en"),
        ),
      );
    return rows;
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

async function getEnglishArticle(slug: string) {
  const article = await getUsArticleBySlug(slug);
  if (!article || article.language !== "en") return null;
  return article;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getEnglishArticle(slug);
  if (!article) return {};

  const canonical = `https://finazo.us/en/${slug}`;

  const counterpart = await getTranslationCounterpartSlug({
    id: article.id,
    language: article.language,
    translationOf: article.translationOf,
  }).catch(() => null);

  const languages: Record<string, string> = {
    "en-US": canonical,
  };
  // Spanish is always x-default; emit es-US if a Spanish counterpart exists.
  if (counterpart?.language === "es") {
    const spanishUrl = `https://finazo.us/guias/${counterpart.slug}`;
    languages["es-US"] = spanishUrl;
    languages["x-default"] = spanishUrl;
  } else {
    languages["x-default"] = "https://finazo.us";
  }

  return {
    title:
      article.title.length > 60
        ? article.title.slice(0, 57) + "…"
        : article.title,
    description: article.metaDescription ?? undefined,
    keywords: article.keywords ?? undefined,
    alternates: { canonical, languages },
    openGraph: {
      title: article.title,
      description: article.metaDescription ?? undefined,
      url: canonical,
      type: "article",
      locale: "en_US",
      publishedTime: article.publishedAt?.toISOString(),
      images: article.featuredImageUrl
        ? [{ url: article.featuredImageUrl, width: 1200, height: 630 }]
        : undefined,
    },
  };
}

export default async function EnGuiaPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const article = await getEnglishArticle(slug);
  if (!article) notFound();

  const author = article.authorName
    ? await getUsAuthorByDisplayName(article.authorName).catch(() => null)
    : null;

  const authorDisplayName = author?.displayName ?? article.authorName ?? "Finazo Editorial";
  const authorSlug = author?.slug ?? article.authorSlug ?? null;
  const authorInitial = authorDisplayName.charAt(0).toUpperCase();

  const faqEntries = extractFaqEntries(article.content);
  const faqSchema = buildFaqSchema(faqEntries);
  const geo = resolveArticleGeo(
    slug,
    article.category,
    (article.templateVariables ?? null) as Parameters<typeof resolveArticleGeo>[2],
  );

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    inLanguage: "en-US",
    author: author
      ? {
          "@type": "Person",
          name: author.displayName,
          url: `https://finazo.us/autor/${author.slug}`,
          ...(author.linkedinUrl ? { sameAs: [author.linkedinUrl] } : {}),
        }
      : { "@type": "Organization", name: "Finazo", url: "https://finazo.us" },
    publisher: {
      "@type": "Organization",
      name: "Finazo",
      url: "https://finazo.us",
      parentOrganization: { "@type": "Organization", name: "Kornugle" },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://finazo.us" },
        { "@type": "ListItem", position: 2, name: "English", item: "https://finazo.us/en" },
        { "@type": "ListItem", position: 3, name: article.title, item: `https://finazo.us/en/${slug}` },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Nav currentPath="/en" />

      <main className="us-page-shell">
        <UsBreadcrumb
          crumbs={[
            { label: "Home", href: "/" },
            { label: "English", href: "/en" },
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
            wordCount={article.wordCount}
            featuredImageUrl={article.featuredImageUrl}
          />
          <ArticleProse content={article.content} />
        </article>

        <StateAwareCTA state={geo.state} product={geo.product} />
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
