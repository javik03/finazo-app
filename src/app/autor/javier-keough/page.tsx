import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPublishedArticles } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Javier Keough — Experto en finanzas para Centroamérica | Finazo",
  description:
    "Javier Keough es fundador de Finazo y experto en educación financiera para mercados de Centroamérica y el Caribe. Analiza remesas, préstamos y seguros.",
  alternates: { canonical: "https://finazo.lat/autor/javier-keough" },
  robots: { index: true, follow: true },
};

const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Javier Keough",
  url: "https://finazo.lat/autor/javier-keough",
  jobTitle: "Fundador y Editor en Jefe",
  worksFor: {
    "@type": "Organization",
    name: "Finazo",
    url: "https://finazo.lat",
  },
  knowsAbout: [
    "Remesas internacionales",
    "Préstamos personales",
    "Finanzas personales en Centroamérica",
    "Comparación de servicios financieros",
    "Mercados de El Salvador, Guatemala, Honduras y República Dominicana",
  ],
  description:
    "Fundador de Finazo, el comparador financiero independiente para Centroamérica. Analiza y compara tasas de remesas, préstamos y seguros para ayudar a familias latinoamericanas a tomar mejores decisiones financieras.",
};

export default async function JavierKeoughPage(): Promise<React.ReactElement> {
  const allArticles = await getPublishedArticles({ excludeCountry: "US" });
  const authorArticles = allArticles.filter(
    (a) => a.authorName === "Javier Keough",
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm">
          <Link href="/" className="text-emerald-600 hover:underline">
            Finazo
          </Link>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-600">Autor</span>
          <span className="mx-2 text-slate-400">/</span>
          <span className="text-slate-600">Javier Keough</span>
        </div>

        {/* Author bio */}
        <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-start">
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-bold text-white"
            style={{ background: "var(--green-bg)" }}
            aria-label="Javier Keough"
          >
            JK
          </div>
          <div>
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
              Javier Keough
            </h1>
            <p className="mb-1 text-sm font-semibold text-emerald-600">
              Fundador y Editor en Jefe · Finazo
            </p>
            <p className="mb-4 text-slate-500 text-sm">
              El Salvador · Finanzas personales para Centroamérica
            </p>
            <p className="text-slate-700 leading-relaxed">
              Javier Keough fundó Finazo para dar a las familias centroamericanas
              acceso a comparaciones financieras honestas e independientes. Analiza
              remesas, préstamos y seguros en El Salvador, Guatemala, Honduras,
              México y República Dominicana — con datos actualizados en tiempo real
              y sin recibir pagos de los proveedores por influir en los rankings.
            </p>
          </div>
        </div>

        {/* Expertise areas */}
        <div className="mb-12 rounded-lg border border-slate-200 p-8" style={{ background: "#f9fafb" }}>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            Áreas de especialización
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Remesas internacionales (EE.UU., España, Canadá → LATAM)",
              "Comparación de préstamos bancarios en Centroamérica",
              "Tasas de cambio y costos reales de transferencias",
              "Regulación financiera: SSF El Salvador, BCRD, SIB Guatemala",
              "Educación financiera para comunidades migrantes",
              "Análisis mensual de datos del mercado de remesas",
            ].map((area) => (
              <li key={area} className="flex gap-2 text-slate-700 text-sm">
                <span style={{ color: "var(--green)" }}>✓</span>
                {area}
              </li>
            ))}
          </ul>
        </div>

        {/* Editorial standards */}
        <div className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Metodología editorial
          </h2>
          <p className="mb-4 text-slate-700 leading-relaxed">
            Todos los artículos publicados bajo la firma de Javier Keough siguen
            el estándar editorial de Finazo:
          </p>
          <ul className="space-y-3 text-slate-700">
            <li className="flex gap-3">
              <span style={{ color: "var(--green)" }}>①</span>
              <span>
                <strong>Datos primero:</strong> Las tasas y comisiones se obtienen
                directamente de las APIs y sitios oficiales de cada proveedor, no
                de terceros.
              </span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: "var(--green)" }}>②</span>
              <span>
                <strong>Sin pagos por posición:</strong> Ningún proveedor paga para
                aparecer primero en nuestros rankings. El orden lo determina el
                precio final que recibe el usuario.
              </span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: "var(--green)" }}>③</span>
              <span>
                <strong>Transparencia de afiliados:</strong> Cuando un enlace genera
                comisión, se indica explícitamente. Esto nunca afecta la comparación.
              </span>
            </li>
            <li className="flex gap-3">
              <span style={{ color: "var(--green)" }}>④</span>
              <span>
                <strong>Actualización continua:</strong> Las tarifas se actualizan
                cada 6 horas. Los artículos se revisan cuando hay cambios
                significativos en el mercado.
              </span>
            </li>
          </ul>
        </div>

        {/* Articles by this author */}
        {authorArticles.length > 0 && (
          <div>
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Artículos de Javier Keough
            </h2>
            <ul className="space-y-4">
              {authorArticles.map((article) => (
                <li key={article.slug}>
                  <Link
                    href={`/guias/${article.slug}`}
                    className="group block rounded-lg border border-slate-200 p-5 transition-all hover:border-emerald-300 hover:shadow-sm"
                  >
                    <h3 className="mb-1 font-semibold text-slate-900 group-hover:text-emerald-700">
                      {article.title}
                    </h3>
                    {article.metaDescription && (
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {article.metaDescription}
                      </p>
                    )}
                    {article.publishedAt && (
                      <p className="mt-2 text-xs text-slate-400">
                        {new Date(article.publishedAt).toLocaleDateString("es-SV", {
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
          </div>
        )}

        {authorArticles.length === 0 && (
          <div className="rounded-lg border border-slate-200 p-8 text-center text-slate-500">
            <p>Los artículos de este autor aparecerán aquí próximamente.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
