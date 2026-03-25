import type { RemittanceRate } from "@/lib/queries/remittances";

type Props = {
  rates: RemittanceRate[];
  fromCountry: string;
  toCountry: string;
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "EE.UU.",
  ES: "España",
  SV: "El Salvador",
  GT: "Guatemala",
  HN: "Honduras",
};

export function RemittanceTable({ rates, fromCountry, toCountry }: Props) {
  if (rates.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 p-8 text-center text-gray-500">
        Actualizando tasas... Vuelve pronto.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <p className="mb-3 text-sm text-gray-500">
        Enviando desde {COUNTRY_NAMES[fromCountry] ?? fromCountry} →{" "}
        {COUNTRY_NAMES[toCountry] ?? toCountry} · Actualizado{" "}
        {rates[0]?.scrapedAt
          ? new Date(rates[0].scrapedAt).toLocaleDateString("es-SV")
          : "hoy"}
      </p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase text-gray-500">
            <th className="py-3 pr-4">Servicio</th>
            <th className="py-3 pr-4">Comisión</th>
            <th className="py-3 pr-4">Velocidad</th>
            <th className="py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => {
            const fee = rate.feeFlat ? `$${parseFloat(rate.feeFlat).toFixed(2)}` : "Varía";
            return (
              <tr key={rate.slug} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 pr-4 font-medium">{rate.provider}</td>
                <td className="py-4 pr-4 text-gray-700">{fee}</td>
                <td className="py-4 pr-4 text-gray-700">
                  {rate.transferSpeed === "instant" ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                      Inmediato
                    </span>
                  ) : (
                    <span className="text-gray-500">{rate.transferSpeed}</span>
                  )}
                </td>
                <td className="py-4">
                  {rate.affiliateUrl && (
                    <a
                      href={rate.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Enviar →
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
