import Link from "next/link";
import type { Metadata } from "next";
import { getRemittanceRates } from "@/lib/queries/remittances";
import { RemittanceTable } from "@/components/comparison/RemittanceTable";

export const metadata: Metadata = {
  title: "Comparar Remesas — EE.UU. a El Salvador",
  description:
    "Compara las comisiones y velocidad de Wise, Remitly, Western Union, MoneyGram y WorldRemit para envíos de EE.UU. a El Salvador. Datos actualizados automáticamente.",
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
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">
            finazo<span className="text-blue-600">.lat</span>
          </Link>
          <nav className="hidden gap-6 text-sm text-gray-600 sm:flex">
            <Link href="/remesas" className="font-semibold text-gray-900">Remesas</Link>
            <Link href="/prestamos" className="hover:text-gray-900">Préstamos</Link>
            <Link href="/seguros" className="hover:text-gray-900">Seguros</Link>
            <Link href="/articulos" className="hover:text-gray-900">Artículos</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700">Inicio</Link>
          <span className="mx-2">›</span>
          <span>Remesas</span>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Comparar remesas internacionales
        </h1>
        <p className="mb-8 text-gray-600">
          ¿Cuánto llega después de comisiones? Compara los principales servicios
          de envío de dinero. Actualizado automáticamente cada 6 horas.
        </p>

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
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="rounded-2xl border border-gray-100 p-6 shadow-sm">
          <RemittanceTable
            rates={rates}
            fromCountry={fromCountry}
            toCountry={toCountry}
          />
        </div>

        {/* How to read */}
        <div className="mt-10 rounded-2xl bg-blue-50 p-6">
          <h2 className="mb-3 font-semibold text-gray-900">
            ¿Cómo comparar correctamente?
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              <strong>Comisión fija:</strong> Lo que cobran por cada envío,
              sin importar el monto.
            </li>
            <li>
              <strong>Tasa de cambio:</strong> Para El Salvador no aplica (USD
              → USD), pero sí para Guatemala y Honduras.
            </li>
            <li>
              <strong>Velocidad:</strong> "Inmediato" significa minutos;
              "1-3 días" es transferencia bancaria tradicional.
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-gray-400">
          Las tarifas mostradas son aproximadas y pueden variar según el monto
          enviado, el método de pago y la fecha. Verifica el costo exacto en el
          sitio de cada proveedor antes de enviar. Algunos enlaces son de
          afiliado — esto no afecta las tarifas comparadas.
        </p>
      </main>

      <footer className="mt-16 border-t border-gray-100 px-6 py-8">
        <div className="mx-auto max-w-5xl text-center text-sm text-gray-500">
          <p>Finazo.lat — Comparador financiero para Centroamérica.</p>
        </div>
      </footer>
    </div>
  );
}
