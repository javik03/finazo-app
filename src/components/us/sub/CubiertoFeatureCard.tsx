/**
 * Above-fold Cubierto product card for insurance sub-pages.
 * Single component reused on auto / salud / vida — copy varies by `variant`.
 */

type Variant = "auto" | "salud" | "vida";

const COPY: Record<Variant, {
  headline: React.ReactNode;
  description: string;
  ctaText: string;
  waPrefill: string;
  stats: Array<{ n: string; l: string }>;
}> = {
  auto: {
    headline: <>No compares aseguradoras una por una. <i>Carmen lo hace por ti.</i></>,
    description:
      "Cubierto te conecta con 8+ aseguradoras de auto en 90 segundos por WhatsApp. Sin llamadas, en español, gratis para ti — la comisión la paga la aseguradora, no tú.",
    ctaText: "Hablar con Carmen",
    waPrefill: "Hola Carmen, cotizar seguro de auto",
    stats: [
      { n: "8+", l: "aseguradoras" },
      { n: "90s", l: "cotización" },
      { n: "$0", l: "para ti" },
    ],
  },
  salud: {
    headline: <>El Marketplace en español, <i>sin la frustración</i>.</>,
    description:
      "Cubierto te ayuda a navegar ACA, Medicaid y planes privados — qué te conviene según ingreso, estado y familia. WhatsApp en español, sin formularios infinitos.",
    ctaText: "Hablar con Carmen",
    waPrefill: "Hola Carmen, cotizar seguro de salud",
    stats: [
      { n: "ACA", l: "subsidios" },
      { n: "Medicaid", l: "elegibilidad" },
      { n: "ITIN", l: "OK" },
    ],
  },
  vida: {
    headline: <>Protege a tu familia <i>aquí o en casa</i>.</>,
    description:
      "Cubierto compara seguros de vida — term, whole, sin examen médico, beneficiarios en otro país. Para inmigrantes, ITIN holders, self-employed.",
    ctaText: "Hablar con Carmen",
    waPrefill: "Hola Carmen, cotizar seguro de vida",
    stats: [
      { n: "Term/Whole", l: "todos los tipos" },
      { n: "Sin examen", l: "disponible" },
      { n: "Internacional", l: "beneficiarios" },
    ],
  },
};

const WA_BASE = "https://wa.me/13055551234";
const WA_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.52 3.48A11.82 11.82 0 0012.04 0C5.46 0 .1 5.36.1 11.94a11.9 11.9 0 001.6 5.97L0 24l6.27-1.64a11.9 11.9 0 005.77 1.47h.01c6.58 0 11.94-5.36 11.94-11.94a11.86 11.86 0 00-3.47-8.41z" />
  </svg>
);

export function CubiertoFeatureCard({
  variant,
}: {
  variant: Variant;
}): React.ReactElement {
  const copy = COPY[variant];
  const waUrl = `${WA_BASE}?text=${encodeURIComponent(copy.waPrefill)}`;

  return (
    <div className="us-product-feature">
      <div>
        <div className="us-product-feature-eyebrow">
          <span className="us-dot" />
          CUBIERTO · DISPONIBLE EN WHATSAPP
        </div>
        <h2 className="us-serif">{copy.headline}</h2>
        <p>{copy.description}</p>
        <div className="us-product-feature-stats">
          {copy.stats.map((stat) => (
            <div key={stat.l} className="us-product-feature-stat">
              <div className="us-n">{stat.n}</div>
              <div className="us-l">{stat.l}</div>
            </div>
          ))}
        </div>
      </div>
      <a href={waUrl} className="us-hard-cta-primary">
        {WA_SVG}
        {copy.ctaText}
      </a>
    </div>
  );
}
