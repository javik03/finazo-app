import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { HardCubiertoCTA } from "@/components/us/sub/HardCubiertoCTA";

export const metadata: Metadata = {
  title: "Cotizador de seguro — 8+ aseguradoras por WhatsApp",
  description:
    "Cotiza seguro de auto, salud o vida con 8+ aseguradoras en una sola conversación de WhatsApp. ITIN OK. Gratis para ti. Carmen, agente virtual de Cubierto.",
  alternates: { canonical: "https://finazo.us/herramientas/cotizador-seguro" },
  openGraph: {
    title: "Cotizador de seguro en español por WhatsApp",
    description:
      "8+ aseguradoras, una conversación, 90 segundos. ITIN OK.",
    url: "https://finazo.us/herramientas/cotizador-seguro",
    locale: "es_US",
    type: "website",
  },
};

const STEPS = [
  {
    n: "1",
    title: "Abres WhatsApp con Carmen",
    body: "Un solo botón. Carmen es la agente virtual de Cubierto — entiende texto y notas de voz en español.",
  },
  {
    n: "2",
    title: "Le das 5 datos",
    body: "Tipo de seguro, estado, edad, situación migratoria (ITIN/SSN/pasaporte) y vehículo o tamaño de familia.",
  },
  {
    n: "3",
    title: "Carmen cotiza con 8+ aseguradoras",
    body: "Infinity, Progressive, Windhaven, Ocean Harbor, GEICO, Direct General y más, según tu estado y tipo de seguro.",
  },
  {
    n: "4",
    title: "Recibes 3 opciones reales en 90 segundos",
    body: "Con prima mensual, deducible y cobertura. Eliges, firmas digital y quedas asegurado el mismo día.",
  },
];

const FAQS = [
  {
    q: "¿Necesito Social Security para cotizar?",
    a: "No. Carmen sabe qué aseguradoras aceptan ITIN, matrícula consular, AB-60 o pasaporte según tu estado.",
  },
  {
    q: "¿El cotizador es gratis?",
    a: "Sí, 100% gratis para ti. La aseguradora paga la comisión a Cubierto cuando contratas — tu prima no sube por eso.",
  },
  {
    q: "¿Cuánto tarda?",
    a: "Cotización inicial: 90 segundos. Si decides contratar, la póliza queda emitida el mismo día.",
  },
  {
    q: "¿Y si no me gusta ninguna opción?",
    a: "No pasa nada. Carmen te explica por qué cada aseguradora cotizó así y qué puedes cambiar (cobertura, deducible, bundle) para bajar la prima.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://finazo.us/herramientas" },
    { "@type": "ListItem", position: 3, name: "Cotizador de seguro", item: "https://finazo.us/herramientas/cotizador-seguro" },
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

export default function CotizadorSeguroPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Nav currentPath="/herramientas" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[
              { label: "Inicio", href: "/" },
              { label: "Herramientas", href: "/herramientas" },
              { label: "Cotizador de seguro" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Herramienta · Cotizador</div>
            <h1 className="us-serif">
              Cotiza con 8+ aseguradoras <i>en una sola conversación</i>.
            </h1>
            <p>
              En vez de llamar 8 oficinas en inglés y dar tus datos cada vez,
              Carmen (agente virtual de Cubierto) lo hace por WhatsApp en 90
              segundos. Auto, salud o vida — con ITIN o sin SSN.
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Cómo <i>funciona</i>
              </h2>
              <p>Cuatro pasos, una sola conversación de WhatsApp.</p>
            </div>
            <div className="us-info-grid">
              {STEPS.map((s) => (
                <div key={s.n} className="us-info-card">
                  <div className="us-eyebrow">PASO {s.n}</div>
                  <h3 className="us-serif">{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </section>

          <HardCubiertoCTA variant="cubierto-auto" />

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

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Más sobre <i>seguros</i>
              </h2>
            </div>
            <ul className="us-related-list">
              <li>
                <Link href="/seguros" className="us-related-item">
                  <div>
                    <div className="us-related-item-title">
                      Hub de seguros: auto, salud, vida
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/seguro-de-auto" className="us-related-item">
                  <div>
                    <div className="us-related-item-title">
                      Seguro de auto: tarifas por estado
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/seguro-de-salud" className="us-related-item">
                  <div>
                    <div className="us-related-item-title">
                      Seguro de salud (ACA) explicado
                    </div>
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
