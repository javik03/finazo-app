import { FINAZO_WA_URL } from "@/lib/wa";

/**
 * Top masthead strip — date + FX rates + secondary nav.
 * Mirrors NYT/FT publication strip from finazo-us-v2.html.
 */

type FxRate = {
  pair: string;
  value: string;
};

type MastheadTopProps = {
  date: string;
  fxRates?: FxRate[];
};

const DEFAULT_FX: FxRate[] = [
  { pair: "USD/MXN", value: "17.24" },
  { pair: "USD/GTQ", value: "7.78" },
  { pair: "USD/HNL", value: "24.62" },
];

export function MastheadTop({
  date,
  fxRates = DEFAULT_FX,
}: MastheadTopProps): React.ReactElement {
  return (
    <div className="us-masthead-top">
      <div className="us-container us-masthead-top-inner">
        <div className="us-mt-left">
          <span className="us-mt-date">{date}</span>
          {fxRates.map((rate) => (
            <span key={rate.pair} className="us-fx-pill">
              {rate.pair} <b>{rate.value}</b>
            </span>
          ))}
        </div>
        <div className="us-mt-right">
          <a href={FINAZO_WA_URL}>WhatsApp</a>
        </div>
      </div>
    </div>
  );
}
