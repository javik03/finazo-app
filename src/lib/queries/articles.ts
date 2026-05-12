import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc, and, ne, asc, count } from "drizzle-orm";

export async function getPublishedArticles(options?: {
  category?: string;
  country?: string;
  excludeCountry?: string;
  limit?: number;
  offset?: number;
}) {
  const { category, country, excludeCountry, limit, offset } = options ?? {};

  const clauses = [eq(articles.status, "published")];
  if (category) clauses.push(eq(articles.category, category));
  if (country) clauses.push(eq(articles.country, country));
  if (excludeCountry) clauses.push(ne(articles.country, excludeCountry));

  const conditions = clauses.length === 1 ? clauses[0] : and(...clauses);

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
    })
    .from(articles)
    .where(conditions!)
    .orderBy(desc(articles.publishedAt))
    .$dynamic();

  if (limit !== undefined) query = query.limit(limit);
  if (offset !== undefined) query = query.offset(offset);

  return query;
}

export async function getPublishedArticlesCount(options?: {
  category?: string;
  country?: string;
  excludeCountry?: string;
}): Promise<number> {
  const { category, country, excludeCountry } = options ?? {};

  const clauses = [eq(articles.status, "published")];
  if (category) clauses.push(eq(articles.category, category));
  if (country) clauses.push(eq(articles.country, country));
  if (excludeCountry) clauses.push(ne(articles.country, excludeCountry));

  const conditions = clauses.length === 1 ? clauses[0] : and(...clauses);

  const rows = await db
    .select({ total: count() })
    .from(articles)
    .where(conditions!);

  return rows[0]?.total ?? 0;
}

export async function getArticleBySlug(slug: string) {
  const rows = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);

  return rows[0] ?? null;
}

// Sidebar/footer: articles in the same category, excluding the current slug
export async function getRelatedArticles(
  currentSlug: string,
  category: string,
  limit = 5,
) {
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
        eq(articles.category, category),
        ne(articles.slug, currentSlug),
      ),
    )
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

// Count of published articles per category — used by hub pages
export async function getArticleCountByCategory(options?: {
  excludeCountry?: string;
  country?: string;
}): Promise<Record<string, number>> {
  const { excludeCountry, country } = options ?? {};

  const clauses = [eq(articles.status, "published")];
  if (excludeCountry) clauses.push(ne(articles.country, excludeCountry));
  if (country) clauses.push(eq(articles.country, country));

  const conditions = clauses.length === 1 ? clauses[0] : and(...clauses);

  const rows = await db
    .select({ category: articles.category, slug: articles.slug })
    .from(articles)
    .where(conditions!)
    .orderBy(asc(articles.category));

  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
  }
  return counts;
}

export async function getAllArticleSlugs() {
  return db
    .select({ slug: articles.slug })
    .from(articles)
    .where(eq(articles.status, "published"));
}

// Admin — returns all articles regardless of status
export async function getAllArticlesAdmin() {
  return db
    .select({
      id: articles.id,
      slug: articles.slug,
      title: articles.title,
      metaDescription: articles.metaDescription,
      category: articles.category,
      status: articles.status,
      wordCount: articles.wordCount,
      publishedAt: articles.publishedAt,
      createdAt: articles.createdAt,
    })
    .from(articles)
    .where(ne(articles.status, "archived"))
    .orderBy(desc(articles.createdAt));
}

// Admin — fetch one article by slug, any status
export async function getArticleBySlugAdmin(slug: string) {
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}

// Force-update article content (regenerate action)
export async function updateArticleContent(
  slug: string,
  data: {
    title: string;
    content: string;
    metaDescription: string | null;
    keywords: string[] | null;
    wordCount: number;
    featuredImageUrl?: string | null;
  },
): Promise<void> {
  await db
    .update(articles)
    .set({
      title: data.title,
      content: data.content,
      metaDescription: data.metaDescription,
      keywords: data.keywords ?? undefined,
      wordCount: data.wordCount,
      ...(data.featuredImageUrl !== undefined && { featuredImageUrl: data.featuredImageUrl }),
      updatedAt: new Date(),
    })
    .where(eq(articles.slug, slug));
}

// Update article status (admin action)
export async function updateArticleStatus(
  id: string,
  status: "draft" | "published" | "archived",
): Promise<void> {
  await db
    .update(articles)
    .set({
      status,
      publishedAt: status === "published" ? new Date() : undefined,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id));
}
