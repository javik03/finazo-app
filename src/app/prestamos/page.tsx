import Link from "next/link";
import type { Metadata } from "next";
import { getLoanProducts } from "@/lib/queries/loans";
import { LoanTable } from "@/components/comparison/LoanTable";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Comparar Préstamos Personales — El Salvador",
  description:
    "Tasas oficiales de préstamos personales en El Salvador según la SSF. Compara Banco Agrícola, Davivienda, BAC, Banco Cuscatlán, Hipotecario y Promerica.",
};

// Revalidate every 24 hours — matches SSF scraper cadence
export const revalidate = 86400;

const LOAN_TYPES = [
  { value: "personal", label: "Personal" },
  { value: "hipotecario", label: "Hipotecario" },
  { value: "vehiculo", label: "Vehículo" },
  { value: "pyme", label: "PYME" },
];

type SearchParams = { tipo?: string };

export default async function PrestamosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const loanType = params.tipo ?? "personal";

  const products = await getLoanProducts(loanType, "SV");

  return (
    <div className="min-h-screen bg-white">
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
              Comparar préstamos en El Salvador
            </h1>
            <p className="text-slate-600">
              Tasas oficiales publicadas por la Superintendencia del Sistema
              Financiero (SSF). Actualizadas diariamente.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            Datos SSF
          </span>
        </div>

        {/* Loan type selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {LOAN_TYPES.map((lt) => {
            const isActive = lt.value === loanType;
            return (
              <Link
                key={lt.value}
                href={`/prestamos?tipo=${lt.value}`}
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
              <strong>Tasa SSF:</strong> Los bancos regulados por la SSF están
              obligados a publicar sus tasas máximas y mínimas.
            </li>
            <li>
              <strong>Historial crediticio:</strong> Tu Buró de Crédito
              determina si calificas y a qué tasa.
            </li>
          </ul>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-slate-400">
          Las tasas mostradas son los rangos publicados por la SSF y pueden
          variar según tu perfil crediticio, ingresos y plazo solicitado. La
          tasa final la determina cada entidad financiera. Algunos enlaces son
          de afiliado.
        </p>
      </main>

      <Footer />
    </div>
  );
}
