import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { getUsLoanProducts } from "@/lib/queries/us-loans";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Préstamos personales sin Social Security 2026",
  description:
    "Préstamos personales para Hispanos en EE.UU. APR desde 7%, opciones con ITIN, sin historial crediticio previo. Para grandes montos (hipoteca), funnel a Hogares.",
  alternates: { canonical: "https://finazo.us/prestamos" },
};

const FAQS = [
  {
    q: "¿Para qué sirve un préstamo personal?",
    a: "Consolidar deuda de tarjetas (más barato), gastos médicos, reparación urgente del auto, o capital para arrancar un negocio pequeño. Para comprar casa NO conviene préstamo personal — usa hipoteca con Hogares.",
  },
  {
    q: "¿Aceptan ITIN?",
    a: "Sí — Oportun, Self Financial, Accion Opportunity Fund y algunos credit unions aceptan ITIN. SoFi, LightStream y los grandes prestamistas requieren SSN. Pregúntale al bot de Finazo qué encaja con tu situación.",
  },
  {
    q: "¿Cuánto puedo pedir?",
    a: "Depende del prestamista y tu credit score. Personal loans típicos: $1,000 a $50,000. Para más de $50K (compra de casa, refinanciamiento), Hogares es el camino correcto.",
  },
  {
    q: "¿Qué APR es razonable?",
    a: "Crédito excelente (740+): 7–12%. Crédito bueno (670–739): 12–20%. Crédito justo (620–669): 20–35%. Si te ofrecen más de 36%, es payday-tier y casi siempre hay mejor opción.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Préstamos", item: "https://finazo.us/prestamos" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

import { FINAZO_WA_URL } from "@/lib/wa";
import { ClusterArticlesSection } from "@/components/us/cluster/ClusterArticlesSection";

const WA_BASE = FINAZO_WA_URL;

function formatPercent(value: string | null): string {
  if (!value) return "—";
  const num = Number.parseFloat(value);
  if (Number.isNaN(num)) return value;
  return `${num.toFixed(2)}%`;
}

function formatMoney(value: string | null): string {
  if (!value) return "—";
  const num = Number.parseFloat(value);
  if (Number.isNaN(num)) return value;
  return `$${num.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export default async function UsPrestamosPage(): Promise<React.ReactElement> {
  const products = await getUsLoanProducts().catch(() => []);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav currentPath="/prestamos" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[
              { label: "Inicio", href: "/" },
              { label: "Préstamos" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Préstamos · Personales · ITIN</div>
            <h1 className="us-serif">
              Préstamos personales <i>en español</i>, con o sin SSN.
            </h1>
            <p>
              Para deuda consolidada, gastos médicos, reparación, o capital de negocio
              pequeño. Para hipoteca o préstamo de auto, redirigimos a la herramienta
              correcta — porque pedir personal loan para comprar casa cuesta 5× más.
            </p>
          </header>

          {/* Live products from us-loans-scraper */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Prestamistas <i>activos</i>
              </h2>
              <p>
                Lista de prestamistas con APR, monto y plazos. Datos del scraper actualizados
                semanalmente.
              </p>
            </div>
            {products.length === 0 ? (
              <div className="us-info-card">
                <p>
                  Datos cargando — el scraper actualiza cada semana. Vuelve pronto o pregúntale
                  al bot por las opciones disponibles para tu situación.
                </p>
              </div>
            ) : (
              <div className="us-data-table-wrap">
                <table className="us-data-table">
                  <thead>
                    <tr>
                      <th>Prestamista</th>
                      <th>APR</th>
                      <th>Monto</th>
                      <th>Plazo</th>
                      <th>ITIN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={`${p.slug}-${p.productName}`}>
                        <td className="us-strong">{p.provider}</td>
                        <td className="us-num">
                          {formatPercent(p.aprMin)} – {formatPercent(p.aprMax)}
                        </td>
                        <td>
                          {formatMoney(p.amountMin)} – {formatMoney(p.amountMax)}
                        </td>
                        <td style={{ fontSize: 13 }}>
                          {p.termMinMonths ?? "—"}–{p.termMaxMonths ?? "—"} meses
                        </td>
                        <td>{p.acceptsItin ? "Sí" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="us-data-source">
              FUENTE: SCRAPER us-loans-scraper · ACTUALIZADO SEMANALMENTE
            </div>
          </section>

          {/* Cross-funnel — when personal loan is NOT the right tool */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                ¿Préstamo personal es <i>realmente</i> lo que necesitas?
              </h2>
              <p>
                Para muchas situaciones hay opciones más baratas o más adecuadas. No
                pierdas dinero usando la herramienta equivocada.
              </p>
            </div>
            <div className="us-info-grid us-info-grid-3">
              <div className="us-info-card">
                <span className="us-info-emoji">🏡</span>
                <h3 className="us-serif">Comprar casa → Hogares</h3>
                <p>
                  Si necesitas más de $50K para casa, hipoteca con Hogares cuesta 60–80%
                  menos en interés total que un préstamo personal. ITIN OK.
                </p>
                <Link href="/hipotecas" className="us-tool-link" style={{ marginTop: 12, display: "inline-flex" }}>
                  Pre-calificar con Hogares →
                </Link>
              </div>
              <div className="us-info-card">
                <span className="us-info-emoji">🚗</span>
                <h3 className="us-serif">Comprar auto → Cubierto</h3>
                <p>
                  Necesitas auto loan + seguro. Cubierto te ayuda con el seguro de auto
                  (no con el loan, pero el bot te orienta a opciones ITIN).
                </p>
                <Link href="/seguro-de-auto" className="us-tool-link" style={{ marginTop: 12, display: "inline-flex" }}>
                  Cotizar seguro con Cubierto →
                </Link>
              </div>
              <div className="us-info-card">
                <span className="us-info-emoji">💳</span>
                <h3 className="us-serif">Construir crédito → secured cards</h3>
                <p>
                  Si vas a pedir préstamo personal solo para construir score, hay opciones
                  más baratas — secured cards o credit-builder loans.
                </p>
                <Link href="/credito" className="us-tool-link" style={{ marginTop: 12, display: "inline-flex" }}>
                  Plan de crédito 0→700+ →
                </Link>
              </div>
            </div>
          </section>

          {/* WA bot CTA */}
          <section className="us-hard-cta">
            <div className="us-eyebrow">PREGÚNTALE AL BOT DE FINAZO</div>
            <h2 className="us-serif">
              ¿No sabes cuál es la herramienta <i>correcta</i> para tu caso?
            </h2>
            <p>
              El bot de Finazo te guía en español por WhatsApp. Te dice si necesitas
              préstamo personal, hipoteca, secured card o algo más — y te conecta con
              Cubierto, Hogares o el partner correcto.
            </p>
            <div className="us-hard-cta-buttons">
              <a
                href={`${WA_BASE}?text=${encodeURIComponent("Hola Finazo, necesito ayuda con un préstamo")}`}
                className="us-hard-cta-primary"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.52 3.48A11.82 11.82 0 0012.04 0C5.46 0 .1 5.36.1 11.94a11.9 11.9 0 001.6 5.97L0 24l6.27-1.64a11.9 11.9 0 005.77 1.47h.01c6.58 0 11.94-5.36 11.94-11.94a11.86 11.86 0 00-3.47-8.41z" />
                </svg>
                Hablar con el bot
              </a>
              <Link href="/credito" className="us-hard-cta-secondary">
                Plan de crédito ITIN
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Preguntas <i>frecuentes</i>
              </h2>
            </div>
            <div className="us-faq-list">
              {FAQS.map((faq) => (
                <div key={faq.q} className="us-faq-item">
                  <h3>{faq.q}</h3>
                  <p>{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          <ClusterArticlesSection clusterKey="prestamos" />
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
