import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPublishedArticles } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Informes mensuales de remesas — Datos y tendencias | Finazo",
  description:
    "Informes mensuales con datos reales de tasas y comisiones de remesas en Centroamérica. Actualizado el 1ro de cada mes. Wise, Remitly, Western Union, MoneyGram.",
  alternates: { canonical: "https://finazo.lat/informes" },
  robots: { index: true, follow: true },
};

export default async function InformesPage(): Promise<React.ReactElement> {
  const allArticles = await getPublishedArticles({ category: "remesas", excludeCountry: "US" });
  const reports = allArticles.filter((a) => a.slug.startsWith("remesas-"));

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm">
          <Link href="/" className="text-emerald-600 hover:underline">
            Finazo
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-600">Informes</span>
        </div>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">
            Informes mensuales de remesas
          </h1>
          <p className="text-lg text-slate-700">
            Cada mes publicamos un informe con los datos reales de tasas y
            comisiones en los principales corredores de remesas hacia
            Centroamérica y el Caribe. Datos de Wise, Remitly, Western Union y
            MoneyGram.
          </p>
        </div>

        {reports.length > 0 ? (
          <ul className="space-y-4">
            {reports.map((report) => (
              <li key={report.slug}>
                <Link
                  href={`/guias/${report.slug}`}
                  className="group block rounded-lg border border-slate-200 p-6 transition-all hover:border-emerald-300 hover:shadow-sm"
                >
                  <h2 className="mb-2 text-xl font-semibold text-slate-900 group-hover:text-emerald-700">
                    {report.title}
                  </h2>
                  {report.metaDescription && (
                    <p className="text-slate-600 text-sm">{report.metaDescription}</p>
                  )}
                  {report.publishedAt && (
                    <p className="mt-3 text-xs text-slate-400">
                      Publicado:{" "}
                      {new Date(report.publishedAt).toLocaleDateString("es-SV", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-slate-200 p-12 text-center">
            <p className="mb-2 text-lg font-semibold text-slate-700">
              Primer informe próximamente
            </p>
            <p className="text-slate-500">
              Publicamos el primer informe mensual el 1ro de cada mes.
            </p>
          </div>
        )}

        {/* How it works */}
        <div className="mt-16 rounded-lg border border-slate-200 p-8" style={{ background: "#f9fafb" }}>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Cómo se elaboran estos informes
          </h2>
          <ul className="space-y-3 text-slate-700 text-sm">
            <li className="flex gap-2">
              <span style={{ color: "var(--green)" }}>✓</span>
              Los datos de tasas y comisiones se recopilan automáticamente cada 6
              horas desde las APIs oficiales de Wise, Remitly, Western Union y
              MoneyGram.
            </li>
            <li className="flex gap-2">
              <span style={{ color: "var(--green)" }}>✓</span>
              El informe mensual se genera el 1ro de cada mes con los datos del mes
              anterior.
            </li>
            <li className="flex gap-2">
              <span style={{ color: "var(--green)" }}>✓</span>
              Ningún proveedor paga para aparecer en los informes. El análisis es
              completamente independiente.
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
