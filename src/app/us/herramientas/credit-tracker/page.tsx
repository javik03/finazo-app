import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";

export const metadata: Metadata = {
  title: "Credit score tracker — plan de 0 a 700+ con ITIN | Finazo",
  description:
    "Plan de 12 meses para construir credit score desde 0 a 700+ con ITIN o sin SSN. Tarjetas aseguradas, credit-builder loans y checklist mes por mes.",
  alternates: { canonical: "https://finazo.us/herramientas/credit-tracker" },
  openGraph: {
    title: "Credit score tracker en español",
    description:
      "Plan mes por mes para subir de 0 a 700+ FICO con ITIN.",
    url: "https://finazo.us/herramientas/credit-tracker",
    locale: "es_US",
    type: "website",
  },
};

const TIMELINE = [
  { month: "Mes 0", action: "Sacar ITIN si no lo tienes (W-7) + abrir cuenta de banco", target: "—" },
  { month: "Mes 1", action: "Solicitar tarjeta asegurada + credit-builder loan (Self o Kikoff)", target: "Primera cuenta abierta" },
  { month: "Mes 2", action: "Primera factura: usar 10–30% del límite, pagar al 100%", target: "Primer reporte a bureaus" },
  { month: "Mes 3", action: "Mantener uso bajo. No abrir cuentas nuevas.", target: "560–610" },
  { month: "Mes 6", action: "Pedir aumento de límite (sin hard pull si es posible)", target: "600–650" },
  { month: "Mes 9", action: "Considerar segunda tarjeta para mix de crédito", target: "650–700" },
  { month: "Mes 12+", action: "Score 700+. Listo para hipoteca con Hogares.", target: "700+" },
];

const FICO_FACTORS = [
  { factor: "Payment History", weight: "35%", note: "Pagar a tiempo. Un solo late de 30+ días tira el score 60–100 puntos." },
  { factor: "Credit Utilization", weight: "30%", note: "Usar <30% del límite. Ideal: <10%. Reportado el día del corte mensual." },
  { factor: "Age of Credit", weight: "15%", note: "Antigüedad promedio. Por eso no cerrar tarjetas viejas." },
  { factor: "Credit Mix", weight: "10%", note: "Tarjetas + loans. Por eso Self combina tarjeta + credit-builder loan." },
  { factor: "New Credit", weight: "10%", note: "Cada hard pull baja 5–10 puntos por 12 meses. No aplicar a 5 tarjetas a la vez." },
];

const FAQS = [
  {
    q: "¿De verdad puedo construir credit sin SSN?",
    a: "Sí. Las tarjetas aseguradas listadas en /credito reportan a las 3 bureaus con ITIN. El score que construyes es el mismo FICO que cualquiera con SSN.",
  },
  {
    q: "¿Cuánto tarda en aparecer mi primer score?",
    a: "Necesitas 6 meses de historial reportado. La mayoría de tarjetas aseguradas reportan después del primer mes de uso, pero el algoritmo FICO necesita 6 meses para emitir score.",
  },
  {
    q: "¿Qué pasa si me equivoco y hago late payment?",
    a: "Llama al banco al día siguiente. Si es tu primer late en 12+ meses, muchas tarjetas (Capital One, Discover) lo borran como cortesía. No esperes — entre más rápido lo arregles, menos impacto.",
  },
  {
    q: "¿Cuándo paso de tarjeta asegurada a regular?",
    a: "A los 12 meses con score 700+. Muchas aseguradas (Discover, Capital One Platinum) se convierten automáticamente — te devuelven el depósito y suben el límite.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://finazo.us/herramientas" },
    { "@type": "ListItem", position: 3, name: "Credit score tracker", item: "https://finazo.us/herramientas/credit-tracker" },
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

export default function CreditTrackerPage(): React.ReactElement {
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
              { label: "Credit score tracker" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Herramienta · Crédito</div>
            <h1 className="us-serif">
              De cero a 700+, <i>mes por mes</i>.
            </h1>
            <p>
              No hay magia para subir credit score rápido — pero sí hay un
              cronograma probado. Si lo sigues con disciplina, en 12 meses
              calificás para hipoteca con Hogares y para mejor prima de
              seguro con Cubierto.
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                El <i>plan</i>
              </h2>
              <p>Cronograma mes por mes con score esperado al final de cada hito.</p>
            </div>
            <div className="us-data-table-wrap">
              <table className="us-data-table">
                <thead>
                  <tr>
                    <th style={{ width: 100 }}>Mes</th>
                    <th>Qué hacer</th>
                    <th style={{ width: 110 }}>Score esperado</th>
                  </tr>
                </thead>
                <tbody>
                  {TIMELINE.map((row) => (
                    <tr key={row.month}>
                      <td className="us-strong">{row.month}</td>
                      <td>{row.action}</td>
                      <td className="us-num">{row.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Los <i>5 factores</i> del FICO
              </h2>
              <p>Saber qué pesa cada cosa te dice dónde enfocarte.</p>
            </div>
            <div className="us-data-table-wrap">
              <table className="us-data-table">
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th style={{ width: 90 }}>Peso</th>
                    <th>Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {FICO_FACTORS.map((f) => (
                    <tr key={f.factor}>
                      <td className="us-strong">{f.factor}</td>
                      <td className="us-num">{f.weight}</td>
                      <td style={{ fontSize: 13 }}>{f.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="us-data-source">
              FUENTE: FICO + EXPERIAN BUREAU · 2026
            </div>
          </section>

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
                Más sobre <i>crédito</i>
              </h2>
            </div>
            <ul className="us-related-list">
              <li>
                <Link href="/credito" className="us-related-item">
                  <div>
                    <div className="us-related-item-title">
                      Hub de crédito: tarjetas aseguradas comparadas
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/hipotecas" className="us-related-item">
                  <div>
                    <div className="us-related-item-title">
                      Cuando el credit es suficiente: hipoteca con ITIN
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
