import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { ClusterArticlesSection } from "@/components/us/cluster/ClusterArticlesSection";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Remesas EE.UU. a LATAM — comparar y ahorrar",
  description:
    "Guía editorial sobre remesas de EE.UU. a México, Guatemala, El Salvador, Honduras y más. Compara Wise, Remitly, WU y MoneyGram al mejor tipo de cambio.",
  alternates: { canonical: "https://finazo.us/remesas" },
  openGraph: {
    title: "Remesas EE.UU. → LATAM",
    description:
      "Compara servicios para enviar dinero a tu familia sin pagar de más.",
    url: "https://finazo.us/remesas",
    locale: "es_US",
    type: "website",
  },
};

const FACTS = [
  {
    n: "$65B+",
    label: "Remesas anuales de EE.UU. a LATAM en 2024 (Banco Mundial)",
  },
  {
    n: "5–8%",
    label: "Spread típico entre el servicio más caro y el más barato",
  },
  {
    n: "$180–300",
    label: "Ahorro anual usando el servicio correcto en $300/mes de remesa",
  },
];

const CORRIDORS = [
  {
    country: "México",
    flag: "🇲🇽",
    summary:
      "El corredor más grande del mundo: ~$60B/año. Wise para montos altos, Remitly para urgencia, WU para cash pickup rural.",
  },
  {
    country: "Guatemala",
    flag: "🇬🇹",
    summary:
      "Banrural y BAM dominan el pickup. Remitly Economy gana fee, Wise gana tipo de cambio en montos >$300.",
  },
  {
    country: "El Salvador",
    flag: "🇸🇻",
    summary:
      "USD directo — no hay spread cambiario. Solo comparas fee. Xoom y Wise suelen ganar a montos chicos.",
  },
  {
    country: "Honduras",
    flag: "🇭🇳",
    summary:
      "BAC Credomatic y Tigo Money para depósito en banco; WU/MoneyGram para cash pickup en zonas rurales.",
  },
  {
    country: "Nicaragua",
    flag: "🇳🇮",
    summary:
      "WU sigue siendo la red más densa físicamente. Xoom para depósito en BANPRO o BAC.",
  },
  {
    country: "Rep. Dominicana",
    flag: "🇩🇴",
    summary:
      "Remitly y Xoom dominan; Banco Popular y Banreservas son los payouts más comunes.",
  },
];

const FAQS = [
  {
    q: "¿Cuál es el servicio más barato en general?",
    a: "Cambia día a día y por corredor. Wise gana para montos >$500. Remitly Economy gana para envíos chicos urgentes. WU sigue siendo la única opción para cash pickup en zonas rurales sin acceso a banco.",
  },
  {
    q: "¿Necesito Social Security para enviar dinero a mi familia?",
    a: "No. ITIN, matrícula consular o pasaporte funcionan. La verificación es por anti-lavado (Patriot Act), no migratoria.",
  },
  {
    q: "¿Por qué el monto que recibe mi familia varía tanto?",
    a: "Por el tipo de cambio. Algunos servicios anuncian \"fee $0\" pero te cobran 5% en el spread cambiario. Siempre verifica la tasa final en moneda local antes de enviar.",
  },
  {
    q: "¿Cómo le abro cuenta de banco a mi familia para recibir remesas?",
    a: "En la mayoría de países LATAM solo necesitan DUI/cédula y comprobante de domicilio. Banrural (GT), Banco Agrícola (SV), BAC (HN), BANPRO (NI) y BHD (DO) abren cuentas básicas gratis. Recibir por banco siempre es más barato que en cash.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Remesas", item: "https://finazo.us/remesas" },
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

export default async function UsRemesasHubPage(): Promise<React.ReactElement> {
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
      <Nav currentPath="/remesas" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[{ label: "Inicio", href: "/" }, { label: "Remesas" }]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Remesas · EE.UU. → LATAM</div>
            <h1 className="us-serif">
              Mandar plata a casa, <i>sin que se la coma el servicio</i>.
            </h1>
            <p>
              México, Guatemala, El Salvador, Honduras, Nicaragua, Rep.
              Dominicana — comparados corredor por corredor. La diferencia
              entre el servicio más caro y el más barato en el mismo envío
              puede ser de 5–8%. En $300/mes eso son $180–300 al año.
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-info-grid us-info-grid-3">
              {FACTS.map((f) => (
                <div key={f.label} className="us-info-card">
                  <h3 className="us-serif" style={{ fontSize: 32 }}>{f.n}</h3>
                  <p>{f.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Por <i>corredor</i>
              </h2>
              <p>Cada destino tiene su propia mecánica de payout y su propio servicio ganador.</p>
            </div>
            <div className="us-info-grid">
              {CORRIDORS.map((c) => (
                <div key={c.country} className="us-info-card">
                  <h3 className="us-serif">
                    {c.flag} {c.country}
                  </h3>
                  <p>{c.summary}</p>
                </div>
              ))}
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

          <ClusterArticlesSection clusterKey="remesas" />
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
