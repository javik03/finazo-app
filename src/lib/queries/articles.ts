import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

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
