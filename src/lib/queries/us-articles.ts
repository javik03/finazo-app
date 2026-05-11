/**
 * Query helpers for finazo.us — articles + authors.
 * Mirrors lib/queries/articles.ts but always filters country='US'.
 */

import { db } from "@/lib/db";
import { articles, usAuthors } from "@/lib/db/schema";
import { and, asc, count, desc, eq, ne } from "drizzle-orm";

export type UsArticle = Awaited<ReturnType<typeof getUsArticleBySlug>>;

export async function getPublishedUsArticles(options?: {
  category?: string;
  language?: "es" | "en";
  limit?: number;
  offset?: number;
}): Promise<
  Array<{
    slug: string;
    title: string;
    metaDescription: string | null;
    category: string;
    publishedAt: Date | null;
    wordCount: number | null;
    featuredImageUrl: string | null;
    authorName: string | null;
    authorSlug: string | null;
  }>
> {
  const { category, language = "es", limit, offset } = options ?? {};

  const clauses = [
    eq(articles.status, "published"),
    eq(articles.country, "US"),
    eq(articles.language, language),
  ];
  if (category) clauses.push(eq(articles.category, category));

  let query = db
    .select({
      slug: articles.slug,
      title: articles.title,
      metaDescription: articles.metaDescription,
      category: articles.category,
      publishedAt: articles.publishedAt,
      wordCount: articles.wordCount,
      featuredImageUrl: articles.featuredImageUrl,
      authorName: articles.authorName,
      authorSlug: articles.authorSlug,
    })
    .from(articles)
    .where(and(...clauses))
    .orderBy(desc(articles.publishedAt))
    .$dynamic();

  if (limit !== undefined) query = query.limit(limit);
  if (offset !== undefined) query = query.offset(offset);

  return query;
}

export async function getPublishedUsArticlesCount(options?: {
  category?: string;
  language?: "es" | "en";
}): Promise<number> {
  const { category, language = "es" } = options ?? {};

  const clauses = [
    eq(articles.status, "published"),
    eq(articles.country, "US"),
    eq(articles.language, language),
  ];
  if (category) clauses.push(eq(articles.category, category));

  const rows = await db
    .select({ total: count() })
    .from(articles)
    .where(and(...clauses));

  return rows[0]?.total ?? 0;
}

export async function getUsArticleBySlug(slug: string) {
  const rows = await db
    .select()
    .from(articles)
    .where(
      and(
        eq(articles.slug, slug),
        eq(articles.status, "published"),
        eq(articles.country, "US"),
      ),
    )
    .limit(1);

  return rows[0] ?? null;
}

export async function getUsRelatedArticles(
  currentSlug: string,
  category: string,
  limit = 5,
): Promise<
  Array<{
    slug: string;
    title: string;
    category: string;
    publishedAt: Date | null;
  }>
> {
  return db
    .select({
      slug: articles.slug,
      title: articles.title,
      category: articles.category,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .where(
      and(
        eq(articles.status, "published"),
        eq(articles.country, "US"),
        eq(articles.category, category),
        ne(articles.slug, currentSlug),
      ),
    )
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function getAllUsArticleSlugs(): Promise<{ slug: string }[]> {
  return db
    .select({ slug: articles.slug })
    .from(articles)
    .where(
      and(eq(articles.status, "published"), eq(articles.country, "US")),
    );
}

/**
 * Per spec §1.7.3 — find the counterpart slug in the other language for
 * hreflang emission. Looks up the translation_of FK both directions.
 * Returns null when no counterpart exists yet.
 */
export async function getTranslationCounterpartSlug(
  article: { id: string; language: string | null; translationOf: string | null },
): Promise<{ slug: string; language: "es" | "en" } | null> {
  // Case 1: this article is itself a translation OF another → look up parent.
  if (article.translationOf) {
    const parent = await db
      .select({ slug: articles.slug, language: articles.language })
      .from(articles)
      .where(eq(articles.id, article.translationOf))
      .limit(1);
    if (parent[0]) {
      return {
        slug: parent[0].slug,
        language: (parent[0].language as "es" | "en") ?? "es",
      };
    }
  }

  // Case 2: another article translates this one → look up child.
  const child = await db
    .select({ slug: articles.slug, language: articles.language })
    .from(articles)
    .where(
      and(
        eq(articles.translationOf, article.id),
        eq(articles.status, "published"),
        eq(articles.country, "US"),
      ),
    )
    .limit(1);
  if (child[0]) {
    return {
      slug: child[0].slug,
      language: (child[0].language as "es" | "en") ?? "en",
    };
  }

  return null;
}

// ─── Authors ───────────────────────────────────────────────────────────────

export type UsAuthor = Awaited<ReturnType<typeof getUsAuthorBySlug>>;

export async function getUsAuthorBySlug(slug: string) {
  const rows = await db
    .select()
    .from(usAuthors)
    .where(and(eq(usAuthors.slug, slug), eq(usAuthors.active, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function getAllUsAuthors() {
  return db
    .select()
    .from(usAuthors)
    .where(eq(usAuthors.active, true))
    .orderBy(asc(usAuthors.displayName));
}

// Match author by display name (used for legacy articles where authorSlug is NULL)
export async function getUsAuthorByDisplayName(displayName: string) {
  const rows = await db
    .select()
    .from(usAuthors)
    .where(
      and(
        eq(usAuthors.displayName, displayName),
        eq(usAuthors.active, true),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}
