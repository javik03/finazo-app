/**
 * Bottom-of-page hard CTA — funnels to Cubierto or Hogares.
 * Replaces the "providers list" pattern that sent traffic to competitors.
 */

type CTAProps = {
  variant: "cubierto-auto" | "cubierto-salud" | "cubierto-vida" | "hogares";
};

type CTACopy = {
  eyebrow: string;
  headline: React.ReactNode;
  description: string;
  primaryText: string;
  primaryWa: string;
  secondaryText: string;
  secondaryHref: string;
};

const COPY: Record<CTAProps["variant"], CTACopy> = {
  "cubierto-auto": {
    eyebrow: "TU PRÓXIMA CITA SIN CITA",
    headline: (
      <>
        Cotiza con 8+ aseguradoras <i>en una sola conversación</i>.
      </>
    ),
    description:
      "Carmen, la agente virtual de Cubierto, te cotiza en 90 segundos por WhatsApp. Sin oficinas, sin llamadas en inglés, gratis para ti.",
    primaryText: "Hablar con Carmen ahora",
    primaryWa: "Hola Carmen, cotizar seguro de auto",
    secondaryText: "Comparar con calculadora",
    secondaryHref: "/us/herramientas/cotizador-seguro",
  },
  "cubierto-salud": {
    eyebrow: "TU PRÓXIMA CITA SIN CITA",
    headline: (
      <>
        Encuentra el plan ACA correcto <i>en español</i>.
      </>
    ),
    description:
      "Carmen te ayuda a calcular tu subsidio, comparar Bronze/Silver/Gold y entender Medicaid según tu estado. WhatsApp, sin formularios.",
    primaryText: "Hablar con Carmen ahora",
    primaryWa: "Hola Carmen, cotizar seguro de salud",
    secondaryText: "Ver guías de ACA",
    secondaryHref: "/us/guias",
  },
  "cubierto-vida": {
    eyebrow: "TU PRÓXIMA CITA SIN CITA",
    headline: (
      <>
        Protege a tu familia <i>desde $10/mes</i>.
      </>
    ),
    description:
      "Carmen compara term life, whole life y opciones sin examen médico. Beneficiarios en cualquier país. WhatsApp, en español.",
    primaryText: "Hablar con Carmen ahora",
    primaryWa: "Hola Carmen, cotizar seguro de vida",
    secondaryText: "Ver guías de seguros",
    secondaryHref: "/us/guias",
  },
  hogares: {
    eyebrow: "TU PRÓXIMA CITA SIN CITA",
    headline: (
      <>
        Pre-calificación en 24 horas, <i>aunque el banco te haya dicho que no</i>.
      </>
    ),
    description:
      "Sofía te conecta con 4 wholesalers non-QM. ITIN, self-employed, bank-statement loans. WhatsApp, en español.",
    primaryText: "Hablar con Sofía ahora",
    primaryWa: "Hola Sofía, pre-calificar hipoteca",
    secondaryText: "Simulador de hipoteca",
    secondaryHref: "/us/herramientas/simulador-hipoteca",
  },
};

const WA_BASE = "https://wa.me/13055551234";
const WA_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.52 3.48A11.82 11.82 0 0012.04 0C5.46 0 .1 5.36.1 11.94a11.9 11.9 0 001.6 5.97L0 24l6.27-1.64a11.9 11.9 0 005.77 1.47h.01c6.58 0 11.94-5.36 11.94-11.94a11.86 11.86 0 00-3.47-8.41z" />
  </svg>
);

export function HardCubiertoCTA({
  variant,
}: CTAProps): React.ReactElement {
  const copy = COPY[variant];
  return (
    <section className="us-hard-cta">
      <div className="us-eyebrow">{copy.eyebrow}</div>
      <h2 className="us-serif">{copy.headline}</h2>
      <p>{copy.description}</p>
      <div className="us-hard-cta-buttons">
        <a
          href={`${WA_BASE}?text=${encodeURIComponent(copy.primaryWa)}`}
          className="us-hard-cta-primary"
        >
          {WA_SVG}
          {copy.primaryText}
        </a>
        <a href={copy.secondaryHref} className="us-hard-cta-secondary">
          {copy.secondaryText}
        </a>
      </div>
    </section>
  );
}
