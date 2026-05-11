import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";

export const metadata: Metadata = {
  title: "Comparador de remesas EE.UU. — México, GT, SV, HN | Finazo",
  description:
    "Compara tasas de remesas en vivo: Wise, Remitly, Western Union, MoneyGram. Envía a México, Guatemala, El Salvador y Honduras al mejor tipo de cambio.",
  alternates: { canonical: "https://finazo.us/herramientas/comparador-remesas" },
  openGraph: {
    title: "Comparador de remesas EE.UU. → LATAM",
    description:
      "Tasas reales de Wise, Remitly, WU y MoneyGram. México, GT, SV, HN.",
    url: "https://finazo.us/herramientas/comparador-remesas",
    locale: "es_US",
    type: "website",
  },
};

const CORRIDORS = [
  { country: "México", flag: "🇲🇽", currency: "MXN", typicalSpread: "1–4%", best: "Wise para >$500; Remitly Express para urgente" },
  { country: "Guatemala", flag: "🇬🇹", currency: "GTQ", typicalSpread: "2–5%", best: "Remitly tasa Economy; Banrural pickup en cash" },
  { country: "El Salvador", flag: "🇸🇻", currency: "USD", typicalSpread: "0%", best: "USD directo — solo comparas fee. Wise o Xoom suelen ganar." },
  { country: "Honduras", flag: "🇭🇳", currency: "HNL", typicalSpread: "3–6%", best: "BAC Credomatic o Tigo Money para depósito en banco vs. cash pickup" },
  { country: "Nicaragua", flag: "🇳🇮", currency: "NIO", typicalSpread: "3–5%", best: "Western Union por cobertura física; Xoom para depósito en cuenta" },
  { country: "Rep. Dominicana", flag: "🇩🇴", currency: "DOP", typicalSpread: "2–4%", best: "Remitly o Xoom; Banco Popular y Banreservas son las redes más densas" },
];

const HIDDEN_COSTS = [
  {
    name: "Spread del tipo de cambio",
    body: "El verdadero costo de la remesa. WU y MoneyGram suelen tener spreads de 3–6%; Wise opera al mid-market real (~0%) y cobra fee fijo.",
  },
  {
    name: "Fee fijo de envío",
    body: "Visible y comparable. Wise: ~$1–4; Remitly Economy: $1.99–3.99; WU: $5–15 según método.",
  },
  {
    name: "Fee del payout",
    body: "Algunas redes locales cobran al recipiente por retirar en efectivo. Pregunta primero — afecta el monto neto.",
  },
];

const FAQS = [
  {
    q: "¿Cuál es el servicio más barato hoy?",
    a: "Cambia día a día. En general: Wise gana para montos >$500 a México y Guatemala. Remitly Economy gana en montos chicos. WU sigue siendo rey para cash pickup rural. Comparar antes de cada envío.",
  },
  {
    q: "¿Por qué Western Union es más caro?",
    a: "Mantiene la red física más grande del mundo (miles de agentes en LATAM) — eso cuesta. Para algunos casos (recipiente sin banco, zona rural) sigue siendo la única opción. Para todo lo demás, hay opciones digitales 2–4% más baratas.",
  },
  {
    q: "¿Necesito Social Security para enviar dinero?",
    a: "No. Wise, Remitly, WU, MoneyGram y Xoom aceptan ITIN, matrícula consular o pasaporte. La verificación de identidad es legal por anti-lavado (Patriot Act), no migratorio.",
  },
  {
    q: "¿Cómo evito que mi familia pierda dinero en el pickup?",
    a: "Depósito directo a cuenta de banco siempre es más barato que pickup en cash. Si la familia no tiene cuenta, abrirles una en Banrural (GT), Banco Agrícola (SV) o BAC (HN) cuesta nada y ahorra ~2% en cada remesa.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://finazo.us/herramientas" },
    { "@type": "ListItem", position: 3, name: "Comparador de remesas", item: "https://finazo.us/herramientas/comparador-remesas" },
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

export default function ComparadorRemesasPage(): React.ReactElement {
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
              { label: "Comparador de remesas" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Herramienta · Remesas</div>
            <h1 className="us-serif">
              Envía a tu familia <i>sin pagar de más</i>.
            </h1>
            <p>
              La diferencia entre el peor y el mejor servicio en el mismo
              corredor puede ser de 5–8% del monto enviado. En $300/mes, eso es
              $180–300/año en comisiones invisibles. Acá te decimos qué mirar
              corredor por corredor.
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Por <i>corredor</i>
              </h2>
              <p>
                EE.UU. a los seis destinos LATAM más comunes. Los spreads son
                indicativos — verifica con el comparador antes de cada envío.
              </p>
            </div>
            <div className="us-data-table-wrap">
              <table className="us-data-table">
                <thead>
                  <tr>
                    <th>Destino</th>
                    <th>Moneda</th>
                    <th>Spread típico</th>
                    <th>Mejor opción general</th>
                  </tr>
                </thead>
                <tbody>
                  {CORRIDORS.map((c) => (
                    <tr key={c.country}>
                      <td className="us-strong">
                        {c.flag} {c.country}
                      </td>
                      <td>{c.currency}</td>
                      <td className="us-num">{c.typicalSpread}</td>
                      <td style={{ fontSize: 13 }}>{c.best}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="us-data-source">
              FUENTE: WORLD BANK REMITTANCE PRICES WORLDWIDE + COMPARACIÓN DIRECTA · 2026
            </div>
          </section>

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Los 3 <i>costos ocultos</i>
              </h2>
              <p>El fee fijo se ve. Lo demás no.</p>
            </div>
            <div className="us-info-grid us-info-grid-3">
              {HIDDEN_COSTS.map((c) => (
                <div key={c.name} className="us-info-card">
                  <h3 className="us-serif">{c.name}</h3>
                  <p>{c.body}</p>
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

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Más sobre <i>remesas</i>
              </h2>
            </div>
            <ul className="us-related-list">
              <li>
                <Link href="/remesas" className="us-related-item">
                  <div>
                    <div className="us-related-item-title">
                      Hub de remesas EE.UU. → LATAM
                    </div>
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/guias" className="us-related-item">
                  <div>
                    <div className="us-related-item-title">
                      Guías sobre envío de dinero
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
