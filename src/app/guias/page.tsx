import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getPublishedArticles, getPublishedArticlesCount, getArticleCountByCategory } from "@/lib/queries/articles";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guías financieras para Centroamérica | Finazo",
  description:
    "Guías prácticas sobre remesas, préstamos, tarjetas, seguros y educación financiera para El Salvador, Guatemala, Honduras y México. Datos oficiales, sin letra pequeña.",
  alternates: { canonical: "https://finazo.lat/guias" },
  openGraph: {
    title: "Guías financieras para Centroamérica | Finazo",
    description:
      "Aprende sobre remesas, préstamos y finanzas personales con guías prácticas en español para Centroamérica.",
    url: "https://finazo.lat/guias",
  },
};

const PAGE_SIZE = 12;

const CATEGORIES = [
  {
    slug: "remesas",
    label: "Remesas",
    color: "bg-sky-100 text-sky-700",
    border: "border-sky-200",
    description: "Comparativas de servicios de envío y guías para reducir comisiones.",
  },
  {
    slug: "prestamos",
    label: "Préstamos",
    color: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-200",
    description: "Tasas, requisitos y análisis de crédito bancario en Centroamérica.",
  },
  {
    slug: "tarjetas",
    label: "Tarjetas",
    color: "bg-rose-100 text-rose-700",
    border: "border-rose-200",
    description: "Comparativas de tarjetas de crédito: anualidades, beneficios y tasas.",
  },
  {
    slug: "seguros",
    label: "Seguros",
    color: "bg-violet-100 text-violet-700",
    border: "border-violet-200",
    description: "Seguros de vida, salud y automóvil: coberturas y costos reales.",
  },
  {
    slug: "educacion",
    label: "Educación financiera",
    color: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    description: "Ahorro, inversión, presupuesto y salida de deudas para la región.",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  remesas: "bg-sky-100 text-sky-700",
  prestamos: "bg-emerald-100 text-emerald-700",
  tarjetas: "bg-rose-100 text-rose-700",
  seguros: "bg-violet-100 text-violet-700",
  educacion: "bg-amber-100 text-amber-700",
};

const CATEGORY_LABELS: Record<string, string> = {
  remesas: "Remesas",
  prestamos: "Préstamos",
  tarjetas: "Tarjetas",
  seguros: "Seguros",
  educacion: "Educación financiera",
};

const hubSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Guías financieras para Centroamérica — Finazo",
  description:
    "Guías prácticas sobre remesas, préstamos, tarjetas, seguros y educación financiera para El Salvador, Guatemala, Honduras y México.",
  url: "https://finazo.lat/guias",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
      { "@type": "ListItem", position: 2, name: "Guías", item: "https://finazo.lat/guias" },
    ],
  },
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function GuiasPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const [articles, total, categoryCounts] = await Promise.all([
    getPublishedArticles({ limit: PAGE_SIZE, offset, excludeCountry: "US" }).catch(() => []),
    getPublishedArticlesCount({ excludeCountry: "US" }).catch(() => 0),
    getArticleCountByCategory({ excludeCountry: "US" }).catch(() => ({} as Record<string, number>)),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hubSchema) }} />
      <Header activePath="/guias" />

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">Inicio</Link>
          <span className="mx-2">›</span>
          <span>Guías</span>
        </div>

        {/* Hub intro */}
        <div className="mb-10">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900">
            Guías financieras para Centroamérica
          </h1>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
            <p className="mb-4">
              Finazo publica guías financieras independientes para El Salvador, Guatemala, Honduras y México. Cubrimos todo el ciclo de las finanzas personales: cómo enviar dinero al menor costo, qué banco ofrece el préstamo más barato, qué tarjeta de crédito tiene la menor anualidad y cómo construir una base financiera sólida para tu familia.
            </p>
            <p>
              Usamos datos oficiales de la <strong>SSF</strong> (El Salvador), la <strong>SIB</strong> (Guatemala) y la <strong>CNBS</strong> (Honduras), y actualizamos los artículos cuando las tasas cambian. Todos los artículos son escritos por{" "}
              <Link href="/autor/javier-keough" className="text-emerald-600 hover:underline font-medium">
                Javier Keough
              </Link>
              , fundador de Finazo y analista financiero con foco en mercados centroamericanos.
            </p>
          </div>
        </div>

        {/* Category cards */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/guias/${cat.slug}`}
              className={`group rounded-xl border p-5 transition-shadow hover:shadow-md ${cat.border}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cat.color}`}>
                  {cat.label}
                </span>
                {categoryCounts[cat.slug] && (
                  <span className="text-xs text-slate-400">
                    {categoryCounts[cat.slug]} guías
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 group-hover:text-slate-800">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>

        {/* All articles — paginated */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Todas las guías</h2>
          <span className="text-sm text-slate-500">{total} publicadas</span>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-slate-500">Próximamente publicaremos guías financieras.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {articles.map((article, i) => (
              <Link
                key={article.slug}
                href={`/guias/${article.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-100 shadow-sm transition-shadow hover:shadow-md overflow-hidden"
              >
                {/* Featured image */}
                {article.featuredImageUrl ? (
                  <div className="relative h-44 w-full bg-slate-100 shrink-0">
                    <Image
                      src={article.featuredImageUrl}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                      loading={i < 4 ? "eager" : "lazy"}
                    />
                  </div>
                ) : (
                  <div className="h-44 w-full bg-gradient-to-br from-slate-100 to-slate-50 shrink-0 flex items-center justify-center">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${CATEGORY_COLORS[article.category] ?? "bg-slate-100 text-slate-500"}`}>
                      {CATEGORY_LABELS[article.category] ?? article.category}
                    </span>
                  </div>
                )}

                {/* Card body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        CATEGORY_COLORS[article.category] ?? "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {CATEGORY_LABELS[article.category] ?? article.category}
                    </span>
                    {article.wordCount && (
                      <span className="text-xs text-slate-400">
                        {Math.ceil(article.wordCount / 200)} min
                      </span>
                    )}
                  </div>
                  <h2 className="mb-1.5 font-semibold text-slate-900 group-hover:text-emerald-700 leading-snug">
                    {article.title}
                  </h2>
                  {article.metaDescription && (
                    <p className="text-sm text-slate-600 line-clamp-2 flex-1">
                      {article.metaDescription}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    {article.publishedAt && (
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString("es-SV", {
                          year: "numeric",
                          month: "short",
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
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
            {hasPrev ? (
              <Link
                href={`/guias?page=${page - 1}`}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                ← Anterior
              </Link>
            ) : (
              <span />
            )}

            <span className="text-sm text-slate-500">
              Página {page} de {totalPages}
            </span>

            {hasNext ? (
              <Link
                href={`/guias?page=${page + 1}`}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Siguiente →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </main>

      <Footer />
    </div>
  );
}
