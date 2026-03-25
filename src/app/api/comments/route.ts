import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { articles, articleComments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const CreateCommentSchema = z.object({
  articleSlug: z.string().min(1).max(200),
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email().optional().or(z.literal("")),
  content: z.string().min(5).max(2000),
});

// GET /api/comments?articleSlug=xxx — fetch approved comments
export async function GET(req: NextRequest): Promise<NextResponse> {
  const slug = req.nextUrl.searchParams.get("articleSlug");
  if (!slug) {
    return NextResponse.json({ error: "articleSlug required" }, { status: 400 });
  }

  const article = await db
    .select({ id: articles.id })
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);

  if (!article[0]) {
    return NextResponse.json({ comments: [] });
  }

  const comments = await db
    .select({
      id: articleComments.id,
      authorName: articleComments.authorName,
      content: articleComments.content,
      createdAt: articleComments.createdAt,
    })
    .from(articleComments)
    .where(
      and(
        eq(articleComments.articleId, article[0].id),
        eq(articleComments.status, "approved")
      )
    )
    .orderBy(articleComments.createdAt);

  return NextResponse.json({ comments });
}

// POST /api/comments — create comment (goes to pending moderation)
export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const { articleSlug, authorName, authorEmail, content } = parsed.data;

  const article = await db
    .select({ id: articles.id })
    .from(articles)
    .where(and(eq(articles.slug, articleSlug), eq(articles.status, "published")))
    .limit(1);

  if (!article[0]) {
    return NextResponse.json({ error: "Artículo no encontrado" }, { status: 404 });
  }

  await db.insert(articleComments).values({
    articleId: article[0].id,
    authorName,
    authorEmail: authorEmail || null,
    content,
    status: "pending",
  });

  return NextResponse.json(
    { message: "Comentario enviado. Será publicado tras revisión." },
    { status: 201 }
  );
}
