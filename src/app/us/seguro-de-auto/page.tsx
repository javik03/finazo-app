import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { CubiertoFeatureCard } from "@/components/us/sub/CubiertoFeatureCard";
import { HardCubiertoCTA } from "@/components/us/sub/HardCubiertoCTA";
import { WhyBetterGrid } from "@/components/us/sub/WhyBetterGrid";
import { buildOpenGraph } from "@/lib/og-defaults";

export const metadata: Metadata = {
  title: "Seguro de auto para Hispanos en EE.UU.",
  description:
    "Tarifas promedio por estado, requisitos legales, factores que afectan tu prima. Cotiza con 8+ aseguradoras por WhatsApp en 90 segundos con Cubierto. ITIN OK.",
  alternates: { canonical: "https://finazo.us/seguro-de-auto" },
  openGraph: buildOpenGraph({
    title: "Seguro de auto para Hispanos en EE.UU.",
    description:
      "Tarifas promedio por estado, requisitos legales, factores que afectan tu prima. Cotiza con 8+ aseguradoras por WhatsApp en 90 segundos con Cubierto. ITIN OK.",
    url: "https://finazo.us/seguro-de-auto",
  }),
};

const STATE_RATES = [
  { state: "Texas", abbr: "TX", annualAvg: "$2,490", minReq: "30/60/25", note: "Mercado más grande para Hispanos" },
  { state: "Florida", abbr: "FL", annualAvg: "$3,240", minReq: "10/20/10", note: "PIP obligatorio · estado no-fault" },
  { state: "California", abbr: "CA", annualAvg: "$2,190", minReq: "15/30/5", note: "Prohíbe usar credit · acepta licencia AB-60" },
  { state: "Nueva York", abbr: "NY", annualAvg: "$2,860", minReq: "25/50/10", note: "PIP requerido · primas elevadas" },
  { state: "Nueva Jersey", abbr: "NJ", annualAvg: "$2,710", minReq: "15/30/5", note: "PIP $15K obligatorio" },
  { state: "Illinois", abbr: "IL", annualAvg: "$1,710", minReq: "25/50/20", note: "Chicago: primas 40% más altas" },
  { state: "Arizona", abbr: "AZ", annualAvg: "$1,680", minReq: "25/50/15", note: "Phoenix concentra el mercado" },
  { state: "Georgia", abbr: "GA", annualAvg: "$2,120", minReq: "25/50/25", note: "Atlanta es el mercado clave" },
  { state: "Carolina del Norte", abbr: "NC", annualAvg: "$1,440", minReq: "30/60/25", note: "Una de las primas más bajas" },
  { state: "Nevada", abbr: "NV", annualAvg: "$2,310", minReq: "25/50/20", note: "Las Vegas tiene primas elevadas" },
];

const FAQS = [
  {
    q: "¿Qué pasa si no tengo licencia de EE.UU. todavía?",
    a: "Varias aseguradoras cotizan con licencia de tu país de origen, matrícula consular, o licencias estatales para inmigrantes (AB-60 en CA, IDNYC en NY). Cubierto sabe cuáles aceptan tu situación específica — pregúntale a Carmen por WhatsApp.",
  },
  {
    q: "¿Necesito SSN para sacar seguro de auto?",
    a: "No. La mayoría de aseguradoras aceptan ITIN o pasaporte. Lo que sí piden es un domicilio en EE.UU. y prueba de residencia (utility bill, lease, etc.).",
  },
  {
    q: "¿Por qué California es tan diferente?",
    a: "California prohíbe a las aseguradoras usar tu credit score para calcular tu prima — es uno de tres estados con esa ley (junto con Hawaii y Massachusetts). Eso ayuda a Hispanos sin historial crediticio largo.",
  },
  {
    q: "¿Cuánto puedo ahorrar comparando con Cubierto vs. ir directo?",
    a: "Entre 15% y 40% según el caso. Cubierto cotiza con 8+ aseguradoras simultáneamente — incluyendo Infinity, Progressive, Ocean Harbor, Windhaven y más. Una sola conversación, múltiples cotizaciones reales.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Seguro de auto", item: "https://finazo.us/seguro-de-auto" },
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

export default function UsSeguroAutoPage(): React.ReactElement {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav currentPath="/seguros" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[
              { label: "Inicio", href: "/" },
              { label: "Seguros", href: "/seguros" },
              { label: "Seguro de auto" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Seguros · Auto</div>
            <h1 className="us-serif">
              Seguro de auto en español, <i>sin pagar de más</i>.
            </h1>
            <p>
              Tarifas promedio por estado, requisitos legales y los factores reales que
              afectan tu prima. Cuando estés listo para cotizar, no llames a 8 aseguradoras —
              Cubierto lo hace por ti en 90 segundos por WhatsApp.
            </p>

            <CubiertoFeatureCard variant="auto" />
          </header>

          {/* State rates table */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Tarifas promedio <i>por estado</i>
              </h2>
              <p>
                Prima anual promedio para conductor de 35 años con historial limpio y vehículo
                sedán 2020. Tu cotización real puede variar 30%+ según ZIP, tipo de cobertura
                y aseguradora.
              </p>
            </div>
            <div className="us-data-table-wrap">
              <table className="us-data-table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Prima promedio/año</th>
                    <th>Mínimo legal</th>
                    <th>Notas para Hispanos</th>
                  </tr>
                </thead>
                <tbody>
                  {STATE_RATES.map((row) => (
                    <tr key={row.abbr}>
                      <td className="us-strong">
                        {row.state} <span style={{ color: "var(--us-ink-3)", fontSize: 12 }}>{row.abbr}</span>
                      </td>
                      <td className="us-num">{row.annualAvg}</td>
                      <td style={{ fontFamily: "var(--font-jetbrains-mono), monospace", fontSize: 13 }}>
                        {row.minReq}
                      </td>
                      <td style={{ fontSize: 13 }}>{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="us-data-source">
              FUENTE: NAIC PROFILES + STATE DOI RATE FILINGS · ACTUALIZADO 2026
            </div>
          </section>

          {/* Factors */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Qué afecta <i>tu prima</i> como conductor Hispano
              </h2>
              <p>
                Los factores que más mueven tu cotización — y los que puedes mejorar.
              </p>
            </div>
            <div className="us-info-grid">
              <div className="us-info-card">
                <h3 className="us-serif">↑ Sube tu prima</h3>
                <ul>
                  <li><span className="us-bullet-up">↑</span> Sin historial de manejo en EE.UU. (0–3 años)</li>
                  <li><span className="us-bullet-up">↑</span> Sin historial crediticio (excepto CA, HI, MA)</li>
                  <li><span className="us-bullet-up">↑</span> ZIP urbano de alto riesgo</li>
                  <li><span className="us-bullet-up">↑</span> Conductor menor de 25 años</li>
                  <li><span className="us-bullet-up">↑</span> Vehículo nuevo o de alto valor</li>
                </ul>
              </div>
              <div className="us-info-card">
                <h3 className="us-serif">↓ Reduce tu prima</h3>
                <ul>
                  <li><span className="us-bullet-down">↓</span> Carta de buen historial de tu aseguradora del país de origen</li>
                  <li><span className="us-bullet-down">↓</span> Construir crédito 12 meses (descuento en 47 estados)</li>
                  <li><span className="us-bullet-down">↓</span> Curso de manejo defensivo (5–15%)</li>
                  <li><span className="us-bullet-down">↓</span> Bundle auto + renters/home (10–25%)</li>
                  <li><span className="us-bullet-down">↓</span> Comparar con 8+ aseguradoras (lo hace Cubierto)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Coverage types */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Tipos de <i>cobertura</i>
              </h2>
              <p>Qué cubre cada nivel y cuándo conviene cada uno.</p>
            </div>
            <div className="us-info-grid us-info-grid-3">
              <div className="us-info-card">
                <span className="us-info-emoji">🛡️</span>
                <h3 className="us-serif">Responsabilidad civil</h3>
                <p>
                  Obligatoria en todos los estados. Cubre daños que causes a otros.
                  <strong> No cubre tu vehículo.</strong>
                </p>
                <div className="us-info-foot">~$400–800 / año</div>
              </div>
              <div className="us-info-card">
                <span className="us-info-emoji">🔧</span>
                <h3 className="us-serif">Cobertura completa (Full)</h3>
                <p>
                  Responsabilidad + colisión + comprensivo. Cubre tu auto.
                  <strong> Requerida si tienes préstamo o lease.</strong>
                </p>
                <div className="us-info-foot">~$1,400–3,000 / año</div>
              </div>
              <div className="us-info-card">
                <span className="us-info-emoji">🏥</span>
                <h3 className="us-serif">PIP / MedPay</h3>
                <p>
                  Cubre tus gastos médicos sin importar quién tuvo la culpa.
                  <strong> Obligatorio en FL, NY, NJ y otros no-fault.</strong>
                </p>
                <div className="us-info-foot">~$100–400 / año</div>
              </div>
            </div>
          </section>

          {/* Why Cubierto */}
          <WhyBetterGrid
            title={<>Por qué cotizar con <i>Cubierto</i></>}
            subtitle="En vez de llamar a 8 aseguradoras una por una, Carmen lo hace en una conversación de WhatsApp."
            reasons={[
              {
                num: "1",
                title: "8+ aseguradoras a la vez",
                body: "Infinity, Progressive, Windhaven, Ocean Harbor, GEICO, Direct General y más. Una conversación, múltiples cotizaciones reales.",
              },
              {
                num: "2",
                title: "100% en español",
                body: "Carmen entiende texto y notas de voz. Sin llamadas en inglés, sin oficinas, sin gerente bilingüe que te transfieran.",
              },
              {
                num: "3",
                title: "Acepta ITIN y matrícula",
                body: "Conoce qué aseguradoras aceptan tu situación migratoria — sin licencia, con AB-60, con IDNYC, con pasaporte.",
              },
              {
                num: "4",
                title: "Gratis para ti",
                body: "La aseguradora paga la comisión, no tú. Y como Cubierto compara 8+ opciones, casi siempre encuentras prima más baja que ir directo.",
              },
            ]}
          />

          {/* Hard CTA */}
          <HardCubiertoCTA variant="cubierto-auto" />

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

          {/* Related guides */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">Guías <i>relacionadas</i></h2>
            </div>
            <ul className="us-related-list">
              <li>
                <Link href="/guias/fred-loya-alternativa-mejores-aseguradoras-hispanos" className="us-related-item">
                  <svg className="us-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                  <div>
                    <div className="us-related-item-title">Fred Loya: 5 alternativas más baratas para Hispanos</div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/guias/estrella-insurance-alternativa-mejor-seguro-hispanos-florida" className="us-related-item">
                  <svg className="us-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                  <div>
                    <div className="us-related-item-title">Estrella Insurance: 4 alternativas más seguras en Florida</div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/guias/es-obligatorio-seguro-auto-texas-hispanos" className="us-related-item">
                  <svg className="us-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                  <div>
                    <div className="us-related-item-title">¿Es obligatorio el seguro de auto en Texas? Guía 2026</div>
                  </div>
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
