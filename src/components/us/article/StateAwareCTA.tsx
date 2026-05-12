import Link from "next/link";
import type { UsState, UsLicenseStatus } from "@/lib/constants/states";
import { FINAZO_WA_URL } from "@/lib/wa";

/**
 * Per-product CTA variants chosen by license status.
 *
 * - active: Cubierto/Hogares is operational in this state → drive to quote
 * - pending_non_resident: license filed but not issued → waitlist signup
 * - not_licensed: no service today → affiliate fallback with disclosure
 *
 * Spec §5.2 — a Finazo article ranking for "seguro auto Chicago" cannot route
 * to a Cubierto WhatsApp quote, because Cubierto isn't licensed in IL. The
 * article still ranks, still earns the visit; the CTA adapts.
 */

type Product = "auto" | "mortgage";

type Props = {
  /** Resolved state record. If null, falls back to the universal CTA. */
  state?: UsState | null;
  /** Which product the article funnels to. Defaults to "auto". */
  product?: Product;
};

const WHATSAPP_BASE = FINAZO_WA_URL;

function statusFor(state: UsState, product: Product): UsLicenseStatus {
  return product === "auto" ? state.cubiertoStatus : state.hogaresStatus;
}

function productLabel(product: Product): string {
  return product === "auto" ? "seguro de auto" : "hipoteca";
}

function brandFor(product: Product): { brand: string; agent: string } {
  return product === "auto"
    ? { brand: "Cubierto", agent: "Carmen" }
    : { brand: "Hogares", agent: "Sofía" };
}

export function StateAwareCTA({ state, product = "auto" }: Props): React.ReactElement {
  // No state in scope (article isn't geo-specific) — show the universal
  // Finazo CTA pointing at the tool hub. Same behaviour as the original
  // ArticleCTACard, kept as the fallback.
  if (!state) {
    return <UniversalCta />;
  }

  const status = statusFor(state, product);
  const { brand, agent } = brandFor(product);

  if (status === "active") {
    const waMessage = encodeURIComponent(
      `Hola ${agent}, cotizar ${productLabel(product)} en ${state.nameEs}`,
    );
    return (
      <div className="us-article-cta-card">
        <h3>
          ¿Listo para cotizar tu {productLabel(product)} en {state.nameEs}?
        </h3>
        <p>
          {brand} cotiza en {state.nameEs} en menos de 90 segundos por WhatsApp.
          {product === "auto"
            ? " 8+ aseguradoras comparadas en una sola conversación."
            : " 4 wholesalers non-QM, ITIN OK, respuesta en 24 horas."}
        </p>
        <div className="us-article-cta-card-btns">
          <a
            href={`${WHATSAPP_BASE}?text=${waMessage}`}
            className="us-cta-btn us-primary"
          >
            Hablar con {agent} ahora
          </a>
          <Link
            href={
              product === "auto"
                ? "/herramientas/cotizador-seguro"
                : "/herramientas/simulador-hipoteca"
            }
            className="us-cta-btn us-secondary"
          >
            {product === "auto" ? "Ver cotizador" : "Simular cuota"}
          </Link>
        </div>
      </div>
    );
  }

  if (status === "pending_non_resident") {
    return (
      <div className="us-article-cta-card">
        <h3>
          {brand} llega pronto a {state.nameEs}
        </h3>
        <p>
          La licencia de {brand} en {state.nameEs} está en trámite. Apuntate a
          la lista de espera y te avisamos cuando arranquemos — sin spam.
        </p>
        <div className="us-article-cta-card-btns">
          <a
            href={`${WHATSAPP_BASE}?text=${encodeURIComponent(
              `Hola Finazo, quiero entrar a la lista de espera de ${brand} en ${state.nameEs}`,
            )}`}
            className="us-cta-btn us-primary"
          >
            Avisarme cuando arranquen en {state.nameEs}
          </a>
          <Link href="/guias" className="us-cta-btn us-secondary">
            Mientras tanto, leer las guías
          </Link>
        </div>
      </div>
    );
  }

  // not_licensed → affiliate fallback. Disclose the affiliate relationship
  // explicitly so the publisher status is preserved.
  return (
    <div className="us-article-cta-card">
      <h3>
        ¿Necesitás {productLabel(product)} en {state.nameEs} hoy?
      </h3>
      <p>
        {brand} todavía no opera en {state.nameEs}. Mientras tanto, te
        recomendamos comparar con <strong>{state.autoAffiliate.name}</strong>,
        un comparador nacional que cubre tu estado.
      </p>
      <div className="us-article-cta-card-btns">
        <a
          href={state.autoAffiliate.url}
          target="_blank"
          rel="noopener sponsored"
          className="us-cta-btn us-primary"
        >
          Comparar con {state.autoAffiliate.name}
        </a>
        <a
          href={`${WHATSAPP_BASE}?text=${encodeURIComponent(
            `Hola Finazo, busco ${productLabel(product)} en ${state.nameEs}`,
          )}`}
          className="us-cta-btn us-secondary"
        >
          Preguntarle a Finazo
        </a>
      </div>
      <p className="us-cta-disclosure">
        <strong>Divulgación:</strong> {state.autoAffiliate.name} es un socio
        afiliado de Finazo. Recibimos comisión cuando contratás con ellos — la
        paga el comparador, no vos.
      </p>
    </div>
  );
}

function UniversalCta(): React.ReactElement {
  return (
    <div className="us-article-cta-card">
      <h3>¿Quieres pasar de leer a actuar?</h3>
      <p>
        Cotiza tu seguro, simula tu hipoteca o compara remesas. Si necesitas
        que alguien te ayude paso a paso, Carmen y Sofía están en WhatsApp.
      </p>
      <div className="us-article-cta-card-btns">
        <Link href="/herramientas/cotizador-seguro" className="us-cta-btn us-primary">
          Cotizar seguro
        </Link>
        <Link href="/herramientas/simulador-hipoteca" className="us-cta-btn us-secondary">
          Simular hipoteca
        </Link>
        <a href={FINAZO_WA_URL} className="us-cta-btn us-secondary">
          Pregúntale a Finazo
        </a>
      </div>
    </div>
  );
}
