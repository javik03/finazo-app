import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { HardCubiertoCTA } from "@/components/us/sub/HardCubiertoCTA";

export const metadata: Metadata = {
  title: "Simulador de hipoteca — cuota mensual, ITIN OK",
  description:
    "Calcula tu cuota mensual, down payment, closing costs y DTI. Pre-calificación non-QM con ITIN o self-employed con Hogares por WhatsApp.",
  alternates: { canonical: "https://finazo.us/herramientas/simulador-hipoteca" },
  openGraph: {
    title: "Simulador de hipoteca en español — ITIN OK",
    description:
      "Cuota mensual, down payment, closing costs. Pre-calificación con 4 wholesalers non-QM.",
    url: "https://finazo.us/herramientas/simulador-hipoteca",
    locale: "es_US",
    type: "website",
  },
};

const COSTS = [
  {
    name: "Down payment",
    typical: "3.5% – 20%",
    note: "FHA arranca en 3.5%. Non-QM ITIN típicamente pide 15–25%.",
  },
  {
    name: "Closing costs",
    typical: "2% – 5% del precio",
    note: "Origination, appraisal, title insurance, escrow. Negociables.",
  },
  {
    name: "Property tax",
    typical: "0.5% – 2.5% anual",
    note: "Texas y NJ son los más altos; California prop 13 los más bajos.",
  },
  {
    name: "Homeowners insurance",
    typical: "$1,200 – $4,000 / año",
    note: "Florida y costa del Golfo son los más caros por hurricane risk.",
  },
  {
    name: "PMI",
    typical: "0.3% – 1.5% anual",
    note: "Aplica si down payment es menor a 20%. Se quita al 78% LTV.",
  },
  {
    name: "HOA (si aplica)",
    typical: "$200 – $800 / mes",
    note: "Condos y planned communities. Verificar antes de ofertar.",
  },
];

const FAQS = [
  {
    q: "¿Puedo calificar para hipoteca con ITIN sin SSN?",
    a: "Sí. Hogares trabaja con 4 wholesalers non-QM que aceptan ITIN. Típicamente piden 15–25% down, 2 años de tax returns con ITIN y credit score 620+.",
  },
  {
    q: "¿Y si soy self-employed sin W-2?",
    a: "Hay programas bank-statement loan (12–24 meses de bank statements en vez de W-2) y P&L loans para contratistas. La cuota es 0.5–1% más alta que conforming pero te aprueba.",
  },
  {
    q: "¿Cuánto debe ser mi DTI?",
    a: "Conforming: 43% máximo. Non-QM ITIN: hasta 50% en algunos casos. Si tu DTI está alto, Sofía te ayuda a ver qué deudas pagar primero para calificar.",
  },
  {
    q: "¿Cuánto tarda la pre-calificación?",
    a: "24 horas con Sofía por WhatsApp. Necesitas: 2 años de tax returns, 2 meses de bank statements y prueba de ingreso. Sin SSN, agregas ITIN y ID.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://finazo.us/herramientas" },
    { "@type": "ListItem", position: 3, name: "Simulador de hipoteca", item: "https://finazo.us/herramientas/simulador-hipoteca" },
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

export default function SimuladorHipotecaPage(): React.ReactElement {
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
              { label: "Simulador de hipoteca" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Herramienta · Hipoteca</div>
            <h1 className="us-serif">
              Tu cuota real, <i>antes de hablar con el banco</i>.
            </h1>
            <p>
              Calculadoras de banco te enseñan principal + interés y se quedan
              ahí. Las hipotecas reales tienen 6 componentes — todos los miramos
              acá. Después Sofía te pre-califica en 24h por WhatsApp con
              wholesalers non-QM que aceptan ITIN.
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Los <i>6 componentes</i> de tu cuota
              </h2>
              <p>
                La gente compara cuotas mirando solo principal + interés. Eso es
                ~70% de la cuota real. Estos son los otros 30% que el banco
                &ldquo;olvida&rdquo; mencionar.
              </p>
            </div>
            <div className="us-data-table-wrap">
              <table className="us-data-table">
                <thead>
                  <tr>
                    <th>Componente</th>
                    <th>Rango típico</th>
                    <th>Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {COSTS.map((c) => (
                    <tr key={c.name}>
                      <td className="us-strong">{c.name}</td>
                      <td className="us-num">{c.typical}</td>
                      <td style={{ fontSize: 13 }}>{c.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="us-data-source">
              FUENTE: CFPB MORTGAGE COSTS + FANNIE MAE GUIDELINES · 2026
            </div>
          </section>

          <HardCubiertoCTA variant="hogares" />

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
                Más sobre <i>hipoteca</i>
              </h2>
            </div>
            <ul className="us-related-list">
              <li>
                <Link href="/hipotecas" className="us-related-item">
                  <div>
                    <div className="us-related-item-title">
                      Hub de hipotecas con ITIN
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/credito" className="us-related-item">
                  <div>
                    <div className="us-related-item-title">
                      Construir credit score para calificar
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
