import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc, and, ne } from "drizzle-orm";

export async function getPublishedArticles(category?: string) {
  const conditions = category
    ? and(eq(articles.status, "published"), eq(articles.category, category))
    : eq(articles.status, "published");

  return db
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
    .where(conditions)
    .orderBy(desc(articles.publishedAt));
}

export async function getArticleBySlug(slug: string) {
  const rows = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);

  return rows[0] ?? null;
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
