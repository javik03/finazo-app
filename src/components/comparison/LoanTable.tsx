import type { LoanProduct } from "@/lib/queries/loans";

type Props = {
  products: LoanProduct[];
};

const PROVIDER_TYPE_LABELS: Record<string, string> = {
  bank: "Banco",
  fintech: "Fintech",
  cooperativa: "Cooperativa",
};

export function LoanTable({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        Actualizando tasas de préstamos...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <p className="mb-3 text-sm text-gray-500">
        Tasas oficiales según la SSF · El Salvador
      </p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase text-gray-500">
            <th className="py-3 pr-4">Entidad</th>
            <th className="py-3 pr-4">Tipo</th>
            <th className="py-3 pr-4">Tasa anual</th>
            <th className="py-3 pr-4">Monto máx.</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => {
            const rate =
              p.rateMin && p.rateMax
                ? `${parseFloat(p.rateMin).toFixed(1)}% – ${parseFloat(p.rateMax).toFixed(1)}%`
                : p.rateMin
                ? `Desde ${parseFloat(p.rateMin).toFixed(1)}%`
                : "Consultar";
            const maxAmount = p.amountMax
              ? `$${parseFloat(p.amountMax).toLocaleString("es-SV")}`
              : "Consultar";
            return (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 pr-4 font-medium">{p.provider}</td>
                <td className="py-4 pr-4 text-gray-500">
                  {PROVIDER_TYPE_LABELS[p.providerType] ?? p.providerType}
                </td>
                <td className="py-4 pr-4 font-semibold text-gray-900">{rate}</td>
                <td className="py-4 pr-4 text-gray-700">{maxAmount}</td>
                <td className="py-4">
                  {p.affiliateUrl && (
                    <a
                      href={p.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      Solicitar →
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {products.some((p) => p.ssfRateSource) && (
        <p className="mt-2 text-xs text-gray-400">
          * Tasas publicadas por la Superintendencia del Sistema Financiero (SSF) de El Salvador.
        </p>
      )}
    </div>
  );
}
