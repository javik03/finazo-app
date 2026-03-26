import { cookies } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { config } from "@/lib/config";
import { getAllArticlesAdmin } from "@/lib/queries/articles";
import { loginAdmin, logoutAdmin, publishArticle, unpublishArticle, regenerateArticle } from "./actions";
import { RegenerateButton } from "@/components/admin/RegenerateButton";

export const metadata: Metadata = { title: "Admin — Finazo", robots: "noindex" };

// Disable ISR — always fetch fresh data
export const revalidate = 0;

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-yellow-100 text-yellow-700",
  archived: "bg-slate-100 text-slate-600",
};

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  tarjetas: "Tarjetas",
  seguros: "Seguros",
  educacion: "Educación",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (!config.ADMIN_SECRET) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <p className="text-red-600 font-medium">ADMIN_SECRET no está configurado en el servidor.</p>
          <p className="text-sm text-slate-500 mt-2">Agrega ADMIN_SECRET al archivo .env y reinicia.</p>
        </div>
      </div>
    );
  }

  const cookieStore = await cookies();
  const isAuthed = cookieStore.get("finazo_admin")?.value === config.ADMIN_SECRET;

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <form action={loginAdmin} className="bg-white p-8 rounded-xl shadow-sm border w-96">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Finazo Admin</h1>
          <p className="text-sm text-slate-500 mb-6">Ingresa el secreto de administrador para continuar.</p>
          {error && (
            <p className="text-sm text-red-600 mb-4">Secreto incorrecto. Intenta de nuevo.</p>
          )}
          <input
            type="password"
            name="token"
            placeholder="Admin secret"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-emerald-700"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  const articles = await getAllArticlesAdmin().catch(() => []);
  const drafts = articles.filter((a) => a.status === "draft");
  const published = articles.filter((a) => a.status === "published");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Artículos generados</h1>
            <p className="text-sm text-slate-500 mt-1">
              {drafts.length} borrador{drafts.length !== 1 ? "es" : ""} · {published.length} publicado{published.length !== 1 ? "s" : ""}
            </p>
          </div>
          <form action={logoutAdmin}>
            <button type="submit" className="text-sm text-slate-500 hover:text-slate-700">
              Cerrar sesión
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            Error al regenerar: {decodeURIComponent(error)}
          </div>
        )}

        {articles.length === 0 ? (
          <div className="bg-white rounded-xl border p-12 text-center">
            <p className="text-slate-500">No hay artículos todavía. El content-strategist genera 3 artículos por día.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl border border-slate-100 p-4 flex items-start gap-4 shadow-sm"
              >
                <span
                  className={`mt-0.5 shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${
                    STATUS_STYLES[article.status ?? "draft"] ?? STATUS_STYLES.draft
                  }`}
                >
                  {article.status}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 leading-snug">{article.title}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {CATEGORY_LABELS[article.category] ?? article.category}
                    {article.wordCount ? ` · ${article.wordCount} palabras` : ""}
                    {article.createdAt
                      ? ` · creado ${new Date(article.createdAt).toLocaleDateString("es-SV", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}`
                      : ""}
                  </p>
                  {article.metaDescription && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{article.metaDescription}</p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/admin/preview/${article.slug}`}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 text-slate-700"
                  >
                    Leer
                  </Link>

                  <form action={regenerateArticle.bind(null, article.slug)}>
                    <RegenerateButton />
                  </form>

                  {article.status === "draft" && (
                    <form action={publishArticle.bind(null, article.id, article.slug)}>
                      <button
                        type="submit"
                        className="text-xs bg-emerald-600 text-white rounded-lg px-3 py-1.5 hover:bg-emerald-700"
                      >
                        Publicar
                      </button>
                    </form>
                  )}

                  {article.status === "published" && (
                    <form action={unpublishArticle.bind(null, article.id, article.slug)}>
                      <button
                        type="submit"
                        className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 text-slate-600"
                      >
                        Revertir
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
