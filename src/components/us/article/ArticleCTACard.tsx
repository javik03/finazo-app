import Link from "next/link";
import { FINAZO_WA_URL } from "@/lib/wa";

/**
 * End-of-article CTA — points to working tools and the WhatsApp bot.
 * Tone: editorial, not pushy.
 */
export function ArticleCTACard(): React.ReactElement {
  return (
    <div className="us-article-cta-card">
      <h3>¿Quieres pasar de leer a actuar?</h3>
      <p>
        Cotiza tu seguro, simula tu hipoteca o compara remesas. Si necesitas
        que alguien te ayude paso a paso, Carmen y Sofía están en WhatsApp.
      </p>
      <div className="us-article-cta-card-btns">
        <Link
          href="/herramientas/cotizador-seguro"
          className="us-cta-btn us-primary"
        >
          Cotizar seguro
        </Link>
        <Link
          href="/herramientas/simulador-hipoteca"
          className="us-cta-btn us-secondary"
        >
          Simular hipoteca
        </Link>
        <a
          href={FINAZO_WA_URL}
          className="us-cta-btn us-secondary"
        >
          Pregúntale a Finazo
        </a>
      </div>
    </div>
  );
}
