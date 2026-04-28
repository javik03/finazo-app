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
