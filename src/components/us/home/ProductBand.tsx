/**
 * Editorial endorsement band for Cubierto (insurance) + Hogares (mortgage).
 * Disclosure copy reflects the affiliate-partner commission model — Cubierto
 * and Hogares are independent partners of Finazo, not corporate siblings.
 */

type ProductCardData = {
  brand: string;
  brandSub: string;
  ribbon: string;
  rating: number;
  tagline: string;
  bullets: Array<{ bold: string; text: string }>;
  stats: Array<{ value: string; label: string }>;
  ctaLabel: string;
  ctaUrl: string;
  disclosure: string;
};

const CHECK_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const WA_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.52 3.48A11.82 11.82 0 0012.04 0C5.46 0 .1 5.36.1 11.94a11.9 11.9 0 001.6 5.97L0 24l6.27-1.64a11.9 11.9 0 005.77 1.47h.01c6.58 0 11.94-5.36 11.94-11.94a11.86 11.86 0 00-3.47-8.41z" />
  </svg>
);

const CUBIERTO: ProductCardData = {
  brand: "Cubierto",
  brandSub: "AGENCIA DE SEGUROS · FL + TX",
  ribbon: "Mejor para seguro de auto",
  rating: 4.9,
  tagline:
    "Cotiza con 8+ aseguradoras por WhatsApp en 90 segundos. Sin oficina, sin llamadas, sin inglés forzado.",
  bullets: [
    {
      bold: "Infinity, Progressive, Windhaven, Ocean Harbor",
      text: "— y 4 más",
    },
    {
      bold: "Auto, hogar, renters y vida",
      text: "bajo una sola conversación",
    },
    {
      bold: "Notas de voz en español",
      text: "— perfecto si estás manejando",
    },
  ],
  stats: [
    { value: "$68", label: "desde /mes FL" },
    { value: "90s", label: "cotización" },
    { value: "$0", label: "para ti" },
  ],
  ctaLabel: "Hablar con Carmen por WhatsApp",
  ctaUrl: "https://wa.me/13055551234?text=Hola%20Carmen",
  disclosure: "CUBIERTO ES PARTE DE KORNUGLE · DIVULGACIÓN DE COMISIÓN",
};

const HOGARES: ProductCardData = {
  brand: "Hogares",
  brandSub: "BROKERAGE · 4 WHOLESALERS",
  ribbon: "Mejor para hipoteca sin SSN",
  rating: 4.8,
  tagline:
    "Hipoteca sin Social Security (ITIN), non-QM, FHA, Conventional. Si el banco te dijo que no, te pre-calificamos el mismo día.",
  bullets: [
    {
      bold: "ACC, Arc Home, NE1st, NFM",
      text: "— wholesalers no-QM",
    },
    {
      bold: "Self-employed, ITIN, non-W2",
      text: "— sin ingreso tradicional",
    },
    {
      bold: "Pre-calificación por WhatsApp",
      text: "en 24 horas",
    },
  ],
  stats: [
    { value: "ITIN", label: "sin SSN" },
    { value: "10%", label: "down desde" },
    { value: "34d", label: "cierre promedio" },
  ],
  ctaLabel: "Hablar con Sofía por WhatsApp",
  ctaUrl: "https://wa.me/13055551234?text=Hola%20Sofia",
  disclosure: "HOGARES ES PARTE DE KORNUGLE · NMLS PENDIENTE",
};

function ProductCard({
  data,
}: {
  data: ProductCardData;
}): React.ReactElement {
  return (
    <div className="us-product">
      <div className="us-product-ribbon">{data.ribbon}</div>

      <div className="us-product-head">
        <div>
          <div className="us-product-brand">{data.brand}</div>
          <div className="us-product-brand-sub">{data.brandSub}</div>
        </div>
        <div className="us-product-rating">
          <span className="us-product-rating-stars">★★★★★</span> {data.rating}
        </div>
      </div>

      <p className="us-product-tagline">{data.tagline}</p>

      <div className="us-product-bullets">
        {data.bullets.map((bullet, idx) => (
          <div key={idx} className="us-product-b">
            {CHECK_SVG}
            <span>
              <b>{bullet.bold}</b> {bullet.text}
            </span>
          </div>
        ))}
      </div>

      <div className="us-product-stats">
        {data.stats.map((stat) => (
          <div key={stat.label} className="us-p-stat">
            <div className="us-n">{stat.value}</div>
            <div className="us-l">{stat.label}</div>
          </div>
        ))}
      </div>

      <a href={data.ctaUrl} className="us-product-cta">
        <span>{data.ctaLabel}</span>
        {WA_SVG}
      </a>
      <div className="us-product-disc">{data.disclosure}</div>
    </div>
  );
}

export function ProductBand(): React.ReactElement {
  return (
    <section className="us-products">
      <div className="us-products-inner">
        <div className="us-products-head">
          <h2 className="us-serif">
            Los <i>servicios</i> que Finazo recomienda.
          </h2>
          <p>
            Ganamos comisión cuando nos conectas con un agente — no de ti, de la
            aseguradora o el wholesaler. Por eso podemos comparar sin decirle sí a
            todo. <b>Estos son los dos socios que usamos nosotros mismos.</b>
          </p>
        </div>

        <div className="us-product-grid">
          <ProductCard data={CUBIERTO} />
          <ProductCard data={HOGARES} />
        </div>
      </div>
    </section>
  );
}
