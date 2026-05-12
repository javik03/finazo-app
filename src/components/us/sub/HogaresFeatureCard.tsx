/**
 * Above-fold Hogares product card for the mortgage sub-page.
 */

const WA_BASE = "https://wa.me/13055551234";
const WA_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.52 3.48A11.82 11.82 0 0012.04 0C5.46 0 .1 5.36.1 11.94a11.9 11.9 0 001.6 5.97L0 24l6.27-1.64a11.9 11.9 0 005.77 1.47h.01c6.58 0 11.94-5.36 11.94-11.94a11.86 11.86 0 00-3.47-8.41z" />
  </svg>
);

export function HogaresFeatureCard(): React.ReactElement {
  const waUrl = `${WA_BASE}?text=${encodeURIComponent("Hola Sofía, pre-calificar hipoteca")}`;

  return (
    <div className="us-product-feature">
      <div>
        <div className="us-product-feature-eyebrow">
          <span className="us-dot" />
          HOGARES · BROKER DE HIPOTECAS
        </div>
        <h2 className="us-serif">
          Si el banco te dijo que no, <i>Sofía sí</i>.
        </h2>
        <p>
          Hogares te conecta con 4+ wholesalers que prestan a clientes ITIN, self-employed
          y bank-statement loans. Pre-calificación por WhatsApp en 24 horas. La comisión la
          paga el wholesaler, no tú.
        </p>
        <div className="us-product-feature-stats">
          <div className="us-product-feature-stat">
            <div className="us-n">ITIN</div>
            <div className="us-l">sin SSN</div>
          </div>
          <div className="us-product-feature-stat">
            <div className="us-n">10%</div>
            <div className="us-l">down desde</div>
          </div>
          <div className="us-product-feature-stat">
            <div className="us-n">24h</div>
            <div className="us-l">pre-calificación</div>
          </div>
        </div>
      </div>
      <a href={waUrl} className="us-hard-cta-primary">
        {WA_SVG}
        Hablar con Sofía
      </a>
    </div>
  );
}
