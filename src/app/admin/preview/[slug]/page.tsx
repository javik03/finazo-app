import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { config } from "@/lib/config";
import { getArticleBySlugAdmin } from "@/lib/queries/articles";
import { publishArticle, unpublishArticle } from "../../actions";
import { ArticleMarkdown } from "@/components/articles/ArticleMarkdown";

export const revalidate = 0;

type Props = { params: Promise<{ slug: string }> };

export default async function AdminPreviewPage({ params }: Props) {
  const cookieStore = await cookies();
  if (cookieStore.get("finazo_admin")?.value !== config.ADMIN_SECRET) {
    redirect("/admin");
  }

  const { slug } = await params;
  const article = await getArticleBySlugAdmin(slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* Admin bar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-6 py-3 flex items-center gap-4">
          <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-700">
            ← Volver al admin
          </Link>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            article.status === "published"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}>
            {article.status}
          </span>
          <div className="flex-1" />
          {article.status === "draft" && (
            <form action={publishArticle.bind(null, article.id, article.slug)}>
              <button
                type="submit"
                className="bg-emerald-600 text-white rounded-lg px-4 py-1.5 text-sm font-medium hover:bg-emerald-700"
              >
                Publicar artículo
              </button>
            </form>
          )}
          {article.status === "published" && (
            <>
              <Link
                href={`/guias/${article.slug}`}
                target="_blank"
                className="text-sm text-emerald-700 hover:underline"
              >
                Ver en el sitio →
              </Link>
              <form action={unpublishArticle.bind(null, article.id, article.slug)}>
                <button
                  type="submit"
                  className="border rounded-lg px-4 py-1.5 text-sm hover:bg-slate-50"
                >
                  Revertir a borrador
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <article>
          <header className="mb-8">
            <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900">
              {article.title}
            </h1>
            {article.metaDescription && (
              <p className="text-base text-slate-600">{article.metaDescription}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
              <span>Categoría: {article.category}</span>
              {article.wordCount && <span>{article.wordCount} palabras</span>}
              {article.country && <span>País: {article.country}</span>}
              <span>
                Creado:{" "}
                {article.createdAt
                  ? new Date(article.createdAt).toLocaleDateString("es-SV", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </header>

          <ArticleMarkdown content={article.content} />
        </article>
      </main>
    </div>
  );
}
