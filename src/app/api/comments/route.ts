import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { articles, articleComments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";

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

const ALLOWED_ORIGINS = [
  "https://finazo.lat",
  "https://www.finazo.lat",
  "http://localhost:3000",
];

// POST /api/comments — create comment (goes to pending moderation)
export async function POST(req: NextRequest): Promise<NextResponse> {
  // CSRF: reject requests not originating from our own domain
  const origin = req.headers.get("origin") ?? "";
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Rate limit: 5 comments per IP per 60 seconds
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const rl = await rateLimit(ip);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rl.reset - Math.floor(Date.now() / 1000)),
          "X-RateLimit-Limit": String(rl.limit),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreateCommentSchema.safeParse(body);
  if (!parsed.success) {
    // Return generic error — don't expose field-level validation details
    return NextResponse.json({ error: "Datos inválidos" }, { status: 422 });
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
