import Link from "next/link";
import type { Metadata } from "next";
import { getRemittanceRates } from "@/lib/queries/remittances";
import { RemittanceTable } from "@/components/comparison/RemittanceTable";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Comparar Remesas — EE.UU. a El Salvador",
  description:
    "Compara las comisiones y velocidad de Wise, Remitly, Western Union, MoneyGram y WorldRemit para envíos de EE.UU. a El Salvador. Datos actualizados automáticamente.",
  alternates: { canonical: "https://finazo.lat/remesas" },
  openGraph: {
    title: "Comparar Remesas — EE.UU. a El Salvador | Finazo",
    description:
      "¿Quién cobra menos? Compara Wise, Remitly, Western Union y más para envíos de EE.UU. a El Salvador.",
    url: "https://finazo.lat/remesas",
  },
};

// Revalidate every 6 hours — matches scraper cadence
export const revalidate = 21600;

const CORRIDORS = [
  { from: "US", to: "SV", label: "EE.UU. → El Salvador" },
  { from: "US", to: "GT", label: "EE.UU. → Guatemala" },
  { from: "US", to: "HN", label: "EE.UU. → Honduras" },
  { from: "ES", to: "SV", label: "España → El Salvador" },
];

type SearchParams = { desde?: string; hacia?: string };

const remittanceSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuál es el servicio de remesas más barato de EE.UU. a El Salvador?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wise y Remitly suelen ofrecer las comisiones más bajas para envíos de EE.UU. a El Salvador. Compara las tarifas actuales en Finazo para encontrar la opción más económica hoy.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cuesta enviar $200 de EE.UU. a El Salvador?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La comisión varía según el proveedor. Con Wise puede ser menos de $2, mientras que Western Union puede cobrar entre $4-$8. Compara en tiempo real en Finazo.",
      },
    },
  ],
};

export default async function RemesasPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const fromCountry = params.desde ?? "US";
  const toCountry = params.hacia ?? "SV";

  const rates = await getRemittanceRates(fromCountry, toCountry);

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(remittanceSchema) }}
      />
      <Header activePath="/remesas" />

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-700">
            Inicio
          </Link>
          <span className="mx-2">›</span>
          <span>Remesas</span>
        </div>

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900">
            Comparar remesas internacionales
          </h1>
          <p className="text-slate-600">
            ¿Cuánto llega después de comisiones? Compara los principales
            servicios de envío de dinero. Actualizado automáticamente cada 6
            horas.
          </p>
        </div>

        {/* Corridor selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CORRIDORS.map((c) => {
            const isActive = c.from === fromCountry && c.to === toCountry;
            return (
              <Link
                key={`${c.from}-${c.to}`}
                href={`/remesas?desde=${c.from}&hacia=${c.to}`}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-slate-100 p-6 shadow-sm">
          <RemittanceTable
            rates={rates}
            fromCountry={fromCountry}
            toCountry={toCountry}
          />
        </div>

        {/* How to read */}
        <div className="mt-10 rounded-2xl bg-sky-50 p-6">
          <h2 className="mb-3 font-semibold text-slate-900">
            ¿Cómo comparar correctamente?
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li>
              <strong>Comisión fija:</strong> Lo que cobran por cada envío, sin
              importar el monto.
            </li>
            <li>
              <strong>Tasa de cambio:</strong> Para El Salvador no aplica (USD →
              USD), pero sí para Guatemala y Honduras.
            </li>
            <li>
              <strong>Velocidad:</strong> "Inmediato" significa minutos; "1–3
              días" es transferencia bancaria tradicional.
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-slate-400">
          Las tarifas mostradas son aproximadas y pueden variar según el monto
          enviado, el método de pago y la fecha. Verifica el costo exacto en el
          sitio de cada proveedor antes de enviar. Algunos enlaces son de
          afiliado — esto no afecta las tarifas comparadas.
        </p>
      </main>

      <Footer />
    </div>
  );
}
