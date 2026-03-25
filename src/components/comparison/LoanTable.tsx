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
      <div className="rounded-xl border border-slate-100 p-10 text-center text-slate-500">
        Actualizando tasas de préstamos...
      </div>
    );
  }

  // Sort by rateMin ascending so lowest rate is first
  const sorted = [...products].sort((a, b) => {
    const ra = parseFloat(a.rateMin ?? "999");
    const rb = parseFloat(b.rateMin ?? "999");
    return ra - rb;
  });

  return (
    <div className="overflow-x-auto">
      <p className="mb-4 text-sm text-slate-500">
        Tasas oficiales según la SSF · El Salvador
      </p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <th className="pb-3 pr-4">#</th>
            <th className="pb-3 pr-4">Entidad</th>
            <th className="pb-3 pr-4">Tipo</th>
            <th className="pb-3 pr-4">Tasa anual</th>
            <th className="pb-3 pr-4">Monto máx.</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => {
            const rate =
              p.rateMin && p.rateMax
                ? `${parseFloat(p.rateMin).toFixed(1)}% – ${parseFloat(p.rateMax).toFixed(1)}%`
                : p.rateMin
                  ? `Desde ${parseFloat(p.rateMin).toFixed(1)}%`
                  : "Consultar";
            const maxAmount = p.amountMax
              ? `$${parseFloat(p.amountMax).toLocaleString("es-SV")}`
              : "Consultar";
            const isBest = i === 0;
            return (
              <tr
                key={i}
                className={`border-b transition-colors ${
                  isBest
                    ? "border-emerald-100 bg-emerald-50/60"
                    : "border-slate-50 hover:bg-slate-50"
                }`}
              >
                <td className="py-4 pr-4">
                  {isBest ? (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Mejor
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">{i + 1}</span>
                  )}
                </td>
                <td className="py-4 pr-4 font-semibold text-slate-900">
                  {p.provider}
                </td>
                <td className="py-4 pr-4 text-slate-500">
                  {PROVIDER_TYPE_LABELS[p.providerType] ?? p.providerType}
                </td>
                <td className="py-4 pr-4">
                  <span
                    className={`font-semibold ${isBest ? "text-emerald-700" : "text-slate-800"}`}
                  >
                    {rate}
                  </span>
                </td>
                <td className="py-4 pr-4 text-slate-600">{maxAmount}</td>
                <td className="py-4">
                  {p.affiliateUrl && (
                    <a
                      href={p.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
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
      {sorted.some((p) => p.ssfRateSource) && (
        <p className="mt-3 text-xs text-slate-400">
          * Tasas publicadas por la Superintendencia del Sistema Financiero
          (SSF) de El Salvador.
        </p>
      )}
    </div>
  );
}
