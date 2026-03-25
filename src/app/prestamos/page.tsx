import Link from "next/link";
import type { Metadata } from "next";
import { getLoanProducts } from "@/lib/queries/loans";
import { LoanTable } from "@/components/comparison/LoanTable";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Comparar Préstamos Personales — El Salvador, Guatemala, Honduras",
  description:
    "Tasas oficiales de préstamos personales en El Salvador (SSF), Guatemala (SIB) y Honduras (CNBS). Compara todos los bancos regulados.",
  alternates: {
    canonical: "https://finazo.lat/prestamos",
    languages: {
      "es-SV": "https://finazo.lat/prestamos",
      "es-GT": "https://finazo.lat/prestamos",
      "es-HN": "https://finazo.lat/prestamos",
      "x-default": "https://finazo.lat/prestamos",
    },
  },
  openGraph: {
    title: "Comparar Préstamos Personales — El Salvador, Guatemala, Honduras | Finazo",
    description:
      "Tasas oficiales SSF, SIB y CNBS de todos los bancos regulados. Compara préstamos personales, hipotecarios y vehiculares.",
    url: "https://finazo.lat/prestamos",
  },
};

// Revalidate every 24 hours — matches scraper cadence
export const revalidate = 86400;

const LOAN_TYPES = [
  { value: "personal", label: "Personal" },
  { value: "hipotecario", label: "Hipotecario" },
  { value: "vehiculo", label: "Vehículo" },
  { value: "pyme", label: "PYME" },
];

const COUNTRIES = [
  {
    value: "SV",
    label: "El Salvador",
    flag: "🇸🇻",
    regulator: "SSF",
    regulatorUrl: "https://www.ssf.gob.sv/",
  },
  {
    value: "GT",
    label: "Guatemala",
    flag: "🇬🇹",
    regulator: "SIB",
    regulatorUrl: "https://www.sib.gob.gt/",
  },
  {
    value: "HN",
    label: "Honduras",
    flag: "🇭🇳",
    regulator: "CNBS",
    regulatorUrl: "https://www.cnbs.gob.hn/",
  },
];

type SearchParams = { tipo?: string; pais?: string };

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
    { "@type": "ListItem", position: 2, name: "Préstamos", item: "https://finazo.lat/prestamos" },
  ],
};

const loanSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuál es el banco con la tasa de préstamo más baja en El Salvador?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las tasas varían según el tipo de préstamo y tu perfil crediticio. Finazo muestra las tasas mínimas y máximas de todos los bancos regulados por la SSF para que puedas comparar antes de aplicar.",
      },
    },
    {
      "@type": "Question",
      name: "¿Son oficiales las tasas de préstamos que muestra Finazo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Las tasas provienen directamente de la Superintendencia del Sistema Financiero (SSF) de El Salvador, la SIB de Guatemala y la CNBS de Honduras, que obligan a todos los bancos regulados a publicar sus tasas.",
      },
    },
  ],
};

export default async function PrestamosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const loanType = params.tipo ?? "personal";
  const country = params.pais ?? "SV";

  const products = await getLoanProducts(loanType, country);

  const countryMeta = COUNTRIES.find((c) => c.value === country) ?? COUNTRIES[0];

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(loanSchema) }}
      />
      <Header activePath="/prestamos" />

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            Inicio
          </Link>
          <span className="mx-2">›</span>
          <span>Préstamos</span>
        </div>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Comparar préstamos en {countryMeta.label}
            </h1>
            <p className="text-slate-600">
              Tasas oficiales publicadas por la{" "}
              <a
                href={countryMeta.regulatorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-700 hover:underline"
              >
                {countryMeta.regulator}
              </a>
              . Actualizadas diariamente.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Datos {countryMeta.regulator}
          </span>
        </div>

        {/* Country selector */}
        <div className="mb-4 flex flex-wrap gap-2">
          {COUNTRIES.map((c) => {
            const isActive = c.value === country;
            return (
              <Link
                key={c.value}
                href={`/prestamos?tipo=${loanType}&pais=${c.value}`}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {c.flag} {c.label}
              </Link>
            );
          })}
        </div>

        {/* Loan type selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {LOAN_TYPES.map((lt) => {
            const isActive = lt.value === loanType;
            return (
              <Link
                key={lt.value}
                href={`/prestamos?tipo=${lt.value}&pais=${country}`}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {lt.label}
              </Link>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
          <LoanTable products={products} />
        </div>

        {/* Calculator CTA */}
        <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="mb-2 font-semibold text-slate-900">
            ¿Cuánto pagarás cada mes?
          </h2>
          <p className="mb-4 text-sm text-slate-600">
            Usa nuestra calculadora para estimar tu cuota mensual según el
            monto, plazo y tasa de interés.
          </p>
          <div className="text-sm font-medium text-emerald-700">
            Calculadora próximamente →
          </div>
        </div>

        {/* What to know */}
        <div className="mt-8 rounded-2xl bg-slate-50 p-6">
          <h2 className="mb-3 font-semibold text-slate-900">
            ¿Qué debo saber antes de solicitar un préstamo?
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <strong>Tasa anual:</strong> Es el costo del préstamo expresado
              como porcentaje anual. Menor tasa = menor costo total.
            </li>
            <li>
              <strong>Plazo:</strong> Los préstamos personales suelen ser 6–60
              meses. Más plazo = cuota menor, pero más intereses en total.
            </li>
            <li>
              <strong>Fuente oficial:</strong> Los bancos regulados están
              obligados a publicar sus tasas máximas y mínimas ante el regulador.
            </li>
            <li>
              <strong>Historial crediticio:</strong> Tu Buró de Crédito
              determina si calificas y a qué tasa.
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-slate-400">
          Las tasas mostradas son los rangos publicados por los reguladores y pueden
          variar según tu perfil crediticio, ingresos y plazo solicitado. La
          tasa final la determina cada entidad financiera. Algunos enlaces son
          de afiliado.
        </p>
      </main>

      <Footer />
    </div>
  );
}
