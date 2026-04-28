import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getUsArticleBySlug,
  getAllUsArticleSlugs,
  getUsRelatedArticles,
  getUsAuthorByDisplayName,
} from "@/lib/queries/us-articles";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { ArticleHeader } from "@/components/us/article/ArticleHeader";
import { ArticleProse } from "@/components/us/article/ArticleProse";
import { RelatedArticles } from "@/components/us/article/RelatedArticles";
import { ArticleCTACard } from "@/components/us/article/ArticleCTACard";

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

  return {
    title:
      article.title.length > 60
        ? article.title.slice(0, 57) + "…"
        : article.title,
    description: article.metaDescription ?? undefined,
    keywords: article.keywords ?? undefined,
    alternates: {
      canonical,
      languages: {
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
      parentOrganization: { "@type": "Organization", name: "Kornugle" },
    },
    breadcrumb: {
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
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Nav currentPath="/us/guias" />

      <main className="us-page-shell">
        <UsBreadcrumb
          crumbs={[
            { label: "Inicio", href: "/us" },
            { label: "Guías", href: "/us/guias" },
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
          />

          <ArticleProse content={article.content} />
        </article>

        <RelatedArticles
          articles={related}
          categoryLabel={categoryLabel}
          categoryHref="/us/guias"
        />

        <ArticleCTACard />
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
