import Link from "next/link";
import type { ReactNode } from "react";

interface Article {
  slug: string;
  title: string;
  metaDescription: string | null;
  category: string;
  publishedAt: Date | null;
  wordCount: number | null;
  featuredImageUrl: string | null;
  authorName: string | null;
}

interface CategoryHubProps {
  category: string;
  label: string;
  headline: string;
  intro: ReactNode;
  articles: Article[];
}

const CATEGORY_COLORS: Record<string, string> = {
  remesas: "bg-sky-100 text-sky-700",
  prestamos: "bg-emerald-100 text-emerald-700",
  tarjetas: "bg-rose-100 text-rose-700",
  seguros: "bg-violet-100 text-violet-700",
  educacion: "bg-amber-100 text-amber-700",
};

const ALL_CATEGORIES = [
  { slug: "remesas", label: "Remesas" },
  { slug: "prestamos", label: "Préstamos" },
  { slug: "tarjetas", label: "Tarjetas" },
  { slug: "seguros", label: "Seguros" },
  { slug: "educacion", label: "Educación" },
];

export function CategoryHub({ category, label, headline, intro, articles }: CategoryHubProps) {
  const colorClass = CATEGORY_COLORS[category] ?? "bg-slate-100 text-slate-700";

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">Inicio</Link>
          <span className="mx-2">›</span>
          <Link href="/guias" className="hover:text-slate-700">Guías</Link>
          <span className="mx-2">›</span>
          <span>{label}</span>
        </div>

        {/* Category badge + headline */}
        <div className="mb-8">
          <span className={`mb-4 inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${colorClass}`}>
            {label}
          </span>
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900">
            {headline}
          </h1>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
            {intro}
          </div>
        </div>

        {/* Category navigation tabs */}
        <nav className="mb-10 flex flex-wrap gap-2 border-b border-slate-100 pb-6">
          <Link
            href="/guias"
            className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-600 hover:border-slate-400 hover:text-slate-900"
          >
            Todas
          </Link>
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/guias/${cat.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                cat.slug === category
                  ? colorClass + " font-semibold"
                  : "border border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </nav>

        {/* Article grid */}
        {articles.length === 0 ? (
          <p className="text-slate-500">Próximamente publicaremos guías en esta categoría.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/guias/${article.slug}`}
                className="group rounded-2xl border border-slate-100 p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {article.featuredImageUrl && (
                  <div className="mb-4 aspect-[16/7] overflow-hidden rounded-xl bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.featuredImageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="mb-3 flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
                    {label}
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
                  <p className="text-sm text-slate-600 line-clamp-2">{article.metaDescription}</p>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  {article.publishedAt && (
                    <span>
                      Actualizado:{" "}
                      {new Date(article.publishedAt).toLocaleDateString("es-SV", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  )}
                  {article.authorName && (
                    <>
                      <span>·</span>
                      <span>{article.authorName}</span>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Internal link footer — drives equity to tool pages */}
        <div className="mt-16 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="mb-2 font-semibold text-slate-900">Compara en tiempo real</h2>
          <p className="mb-4 text-sm text-slate-600">
            Usa los comparadores de Finazo para encontrar la mejor opción con datos oficiales actualizados.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/remesas" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              Comparar remesas
            </Link>
            <Link href="/prestamos" className="rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50">
              Comparar préstamos
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
