import type { RemittanceRate } from "@/lib/queries/remittances";

type Props = {
  rates: RemittanceRate[];
  fromCountry: string;
  toCountry: string;
  lang?: "es" | "en";
};

const COUNTRY_NAMES_ES: Record<string, string> = {
  US: "EE.UU.",
  ES: "España",
  CA: "Canadá",
  GB: "Reino Unido",
  IT: "Italia",
  SV: "El Salvador",
  GT: "Guatemala",
  HN: "Honduras",
  MX: "México",
  DO: "República Dominicana",
};

const COUNTRY_NAMES_EN: Record<string, string> = {
  US: "the United States",
  ES: "Spain",
  CA: "Canada",
  GB: "United Kingdom",
  IT: "Italy",
  SV: "El Salvador",
  GT: "Guatemala",
  HN: "Honduras",
  MX: "Mexico",
  DO: "Dominican Republic",
};

export function RemittanceTable({ rates, fromCountry, toCountry, lang = "es" }: Props) {
  const isEn = lang === "en";
  const COUNTRY_NAMES = isEn ? COUNTRY_NAMES_EN : COUNTRY_NAMES_ES;

  if (rates.length === 0) {
    return (
      <div className="rounded-xl border border-slate-100 p-10 text-center text-slate-500">
        {isEn ? "Updating rates… Check back in a few minutes." : "Actualizando tasas... Vuelve en unos minutos."}
      </div>
    );
  }

  // Sort by fee ascending so cheapest is first
  const sorted = [...rates].sort((a, b) => {
    const fa = parseFloat(a.feeFlat ?? "999");
    const fb = parseFloat(b.feeFlat ?? "999");
    return fa - fb;
  });

  const dateLocale = isEn ? "en-US" : "es-SV";

  return (
    <div className="overflow-x-auto">
      <p className="mb-4 text-sm text-slate-500">
        {isEn
          ? <>Sending from {COUNTRY_NAMES[fromCountry] ?? fromCountry} to {COUNTRY_NAMES[toCountry] ?? toCountry} · Updated {sorted[0]?.scrapedAt ? new Date(sorted[0].scrapedAt).toLocaleDateString(dateLocale) : "today"}</>
          : <>Enviando desde {COUNTRY_NAMES[fromCountry] ?? fromCountry} a {COUNTRY_NAMES[toCountry] ?? toCountry} · Actualizado {sorted[0]?.scrapedAt ? new Date(sorted[0].scrapedAt).toLocaleDateString(dateLocale) : "hoy"}</>
        }
      </p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <th className="pb-3 pr-4">#</th>
            <th className="pb-3 pr-4">{isEn ? "Service" : "Servicio"}</th>
            <th className="pb-3 pr-4">{isEn ? "Fee" : "Comisión"}</th>
            <th className="pb-3 pr-4">{isEn ? "Speed" : "Velocidad"}</th>
            <th className="pb-3"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((rate, i) => {
            const fee = rate.feeFlat
              ? `$${parseFloat(rate.feeFlat).toFixed(2)}`
              : isEn ? "Varies" : "Varía";
            const isBest = i === 0;
            return (
              <tr
                key={rate.slug}
                className={`border-b transition-colors ${
                  isBest
                    ? "border-emerald-100 bg-emerald-50/60"
                    : "border-slate-50 hover:bg-slate-50"
                }`}
              >
                <td className="py-4 pr-4">
                  {isBest ? (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      {isEn ? "Best" : "Mejor"}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">{i + 1}</span>
                  )}
                </td>
                <td className="py-4 pr-4 font-semibold text-slate-900">
                  {rate.provider}
                </td>
                <td className="py-4 pr-4">
                  <span
                    className={`font-semibold ${isBest ? "text-emerald-700" : "text-slate-700"}`}
                  >
                    {fee}
                  </span>
                </td>
                <td className="py-4 pr-4">
                  {rate.transferSpeed === "instant" ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      {isEn ? "Instant" : "Inmediato"}
                    </span>
                  ) : (
                    <span className="text-slate-500">{rate.transferSpeed}</span>
                  )}
                </td>
                <td className="py-4">
                  {rate.affiliateUrl && (
                    <a
                      href={rate.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700"
                    >
                      {isEn ? "Send →" : "Enviar →"}
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
