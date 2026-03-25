import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedArticles } from "@/lib/queries/articles";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Guías financieras para Centroamérica — Finazo",
  description:
    "Guías prácticas sobre remesas, préstamos y educación financiera para El Salvador, Guatemala y Honduras.",
  alternates: { canonical: "https://finazo.lat/guias" },
  openGraph: {
    title: "Guías financieras para Centroamérica | Finazo",
    description:
      "Aprende sobre remesas, préstamos y finanzas personales con guías prácticas en español.",
    url: "https://finazo.lat/guias",
  },
};

export const revalidate = 3600;

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  tarjetas: "Tarjetas",
  seguros: "Seguros",
  educacion: "Educación financiera",
};

const CATEGORY_COLORS: Record<string, string> = {
  remesas: "bg-sky-100 text-sky-700",
  prestamos: "bg-emerald-100 text-emerald-700",
  tarjetas: "bg-rose-100 text-rose-700",
  seguros: "bg-violet-100 text-violet-700",
  educacion: "bg-amber-100 text-amber-700",
};

export default async function GuiasPage() {
  const articles = await getPublishedArticles().catch(() => []);

  return (
    <div className="min-h-screen bg-white">
      <Header activePath="/guias" />

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            Inicio
          </Link>
          <span className="mx-2">›</span>
          <span>Guías</span>
        </div>

        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Guías financieras
          </h1>
          <p className="text-slate-600">
            Aprende sobre remesas, préstamos y finanzas personales con guías
            escritas en español para Centroamérica.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-slate-500">
              Próximamente publicaremos guías financieras.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/guias/${article.slug}`}
                className="group rounded-2xl border border-slate-100 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      CATEGORY_COLORS[article.category] ??
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {CATEGORY_LABELS[article.category] ?? article.category}
                  </span>
                  {article.wordCount && (
                    <span className="text-xs text-slate-400">
                      {Math.ceil(article.wordCount / 200)} min de lectura
                    </span>
                  )}
                </div>
                <h2 className="mb-2 font-semibold text-slate-900 group-hover:text-emerald-700">
                  {article.title}
                </h2>
                {article.metaDescription && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {article.metaDescription}
                  </p>
                )}
                {article.publishedAt && (
                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(article.publishedAt).toLocaleDateString("es-SV", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
