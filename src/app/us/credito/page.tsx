import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { ClusterArticlesSection } from "@/components/us/cluster/ClusterArticlesSection";
import { ClusterFilterNav } from "@/components/us/cluster/ClusterFilterNav";
import { buildOpenGraph } from "@/lib/og-defaults";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Construir credit score sin Social Security 2026",
  description:
    "Cómo construir tu credit score desde cero, con ITIN o sin SSN. Tarjetas aseguradas, credit-builder loans, y cómo subir el score rápido.",
  alternates: { canonical: "https://finazo.us/credito" },
  openGraph: buildOpenGraph({
    title: "Construir credit score sin Social Security 2026",
    description:
      "Cómo construir tu credit score desde cero, con ITIN o sin SSN. Tarjetas aseguradas, credit-builder loans, y cómo subir el score rápido.",
    url: "https://finazo.us/credito",
  }),
};

const SECURED_CARDS = [
  { card: "Discover it Secured", deposit: "$200 mín.", apr: "27.74% var.", annual: "$0", reports: "3 bureaus", itin: "Sí" },
  { card: "Capital One Platinum Secured", deposit: "$49–$200", apr: "29.74% var.", annual: "$0", reports: "3 bureaus", itin: "Sí" },
  { card: "OpenSky Plus Secured", deposit: "$300 mín.", apr: "29.99% fija", annual: "$35", reports: "3 bureaus", itin: "Sí" },
  { card: "Self Visa", deposit: "Combina con CB loan", apr: "28.24% var.", annual: "$25", reports: "3 bureaus", itin: "Sí" },
  { card: "Chime Credit Builder", deposit: "Sin depósito tradicional", apr: "0%", annual: "$0", reports: "3 bureaus", itin: "Sí" },
];

const TIMELINE = [
  { month: "Mes 0", action: "Sacar ITIN si no lo tienes (formulario W-7) + abrir cuenta de banco" },
  { month: "Mes 1", action: "Solicitar tarjeta asegurada + credit-builder loan (Self o Kikoff)" },
  { month: "Mes 2–3", action: "Usar 10–30% del límite, pagar al 100% cada mes. No abrir más cuentas." },
  { month: "Mes 6", action: "Score esperado: 600–650. Pedir aumento de límite (sin hard pull si es posible)." },
  { month: "Mes 9", action: "Score esperado: 650–700. Considerar segunda tarjeta para mix de crédito." },
  { month: "Mes 12+", action: "Score 700+. Listo para hipoteca con Hogares o seguro mejor con Cubierto." },
];

const FAQS = [
  {
    q: "¿Puedo construir credit score con ITIN sin SSN?",
    a: "Sí. Las tarjetas aseguradas y credit-builder loans listadas arriba aceptan ITIN y reportan a las 3 bureaus (Experian, Equifax, TransUnion). En 9–12 meses puedes llegar a 650+.",
  },
  {
    q: "¿Cuántas tarjetas debo tener?",
    a: "Empieza con 1, agrega la segunda al mes 9–12 cuando tu score llegue a 650+. Más tarjetas = más mix de crédito (15% del FICO), pero abrirlas todas a la vez baja el promedio de edad de cuentas.",
  },
  {
    q: "¿Cuándo debo pasar de tarjeta asegurada a regular?",
    a: "Cuando tu score llegue a 700+ y tengas 12 meses de historial. Las tarjetas como Discover y Capital One se convierten automáticamente. Otras requieren que apliques a una nueva — entonces pides cancelación de la asegurada para recuperar el depósito.",
  },
  {
    q: "¿De qué sirve tener buen credit score?",
    a: "Hipoteca: el banco te aprueba con tasa más baja. Hogares te conecta con wholesalers ITIN si tu score está en 620+. Seguro de auto: en 47 estados un buen credit baja tu prima 15–40%. Cubierto compara con esa ventaja.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Crédito", item: "https://finazo.us/credito" },
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

export default async function UsCreditoPage(): Promise<React.ReactElement> {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav currentPath="/credito" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[
              { label: "Inicio", href: "/" },
              { label: "Crédito" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Crédito · Sin SSN OK</div>
            <h1 className="us-serif">
              Construye tu credit score <i>de 0 a 700+</i> en 12 meses.
            </h1>
            <p>
              Si tienes ITIN — o ni siquiera eso — sí puedes construir credit en EE.UU.
              Te explicamos los pasos exactos, cuáles tarjetas reportan a las 3 bureaus, y
              cómo el credit te abre seguros, hipoteca y mejores tasas con Cubierto y Hogares.
            </p>
          </header>

          <ClusterFilterNav active="credito" />

          {/* Timeline */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                El plan <i>mes por mes</i>
              </h2>
              <p>El cronograma realista para subir de 0 a 700+ FICO con ITIN o sin SSN.</p>
            </div>
            <div className="us-data-table-wrap">
              <table className="us-data-table">
                <thead>
                  <tr>
                    <th style={{ width: 110 }}>Mes</th>
                    <th>Qué hacer</th>
                  </tr>
                </thead>
                <tbody>
                  {TIMELINE.map((row) => (
                    <tr key={row.month}>
                      <td className="us-strong">{row.month}</td>
                      <td>{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Secured cards */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Tarjetas <i>aseguradas</i> que aceptan ITIN
              </h2>
              <p>
                Las que reportan a las 3 bureaus (sino, no sirven para construir score).
                Todas aceptan ITIN.
              </p>
            </div>
            <div className="us-data-table-wrap">
              <table className="us-data-table">
                <thead>
                  <tr>
                    <th>Tarjeta</th>
                    <th>Depósito</th>
                    <th>APR</th>
                    <th>Cuota anual</th>
                    <th>Reporta</th>
                  </tr>
                </thead>
                <tbody>
                  {SECURED_CARDS.map((row) => (
                    <tr key={row.card}>
                      <td className="us-strong">{row.card}</td>
                      <td>{row.deposit}</td>
                      <td className="us-num">{row.apr}</td>
                      <td>{row.annual}</td>
                      <td style={{ fontSize: 13 }}>{row.reports}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="us-data-source">
              FUENTE: TÉRMINOS PÚBLICOS DE CADA BANCO · ACTUALIZADO 2026
            </div>
          </section>

          {/* What's next - cross-funnel to Cubierto + Hogares */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                ¿Qué hacer con <i>el credit</i> que construyes?
              </h2>
              <p>
                Buen credit score abre puertas concretas — Cubierto y Hogares son las dos más
                grandes para Hispanos.
              </p>
            </div>
            <div className="us-info-grid">
              <div className="us-info-card">
                <span className="us-info-emoji">🚗</span>
                <h3 className="us-serif">Mejor seguro de auto con Cubierto</h3>
                <p>
                  En 47 estados un buen credit baja tu prima 15–40%. Cubierto cotiza con 8+
                  aseguradoras y aplica el descuento automáticamente.
                </p>
                <Link href="/seguro-de-auto" className="us-tool-link" style={{ marginTop: 12, display: "inline-flex" }}>
                  Cotizar con Cubierto →
                </Link>
              </div>
              <div className="us-info-card">
                <span className="us-info-emoji">🏡</span>
                <h3 className="us-serif">Hipoteca ITIN con Hogares</h3>
                <p>
                  Una vez tu score llegue a 620+, Hogares te conecta con wholesalers que
                  prestan a clientes ITIN, self-employed y bank-statement loans.
                </p>
                <Link href="/hipotecas" className="us-tool-link" style={{ marginTop: 12, display: "inline-flex" }}>
                  Pre-calificar con Hogares →
                </Link>
              </div>
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

          <ClusterArticlesSection clusterKey="credito" />
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
