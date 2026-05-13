import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { HogaresFeatureCard } from "@/components/us/sub/HogaresFeatureCard";
import { HardCubiertoCTA } from "@/components/us/sub/HardCubiertoCTA";
import { WhyBetterGrid } from "@/components/us/sub/WhyBetterGrid";
import { ClusterArticlesSection } from "@/components/us/cluster/ClusterArticlesSection";
import { ClusterFilterNav } from "@/components/us/cluster/ClusterFilterNav";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Comprar casa sin Social Security — hipotecas 2026",
  description:
    "Comprar casa sin Social Security en EE.UU. Hipotecas non-QM, FHA, conventional. Hogares te conecta con 4+ wholesalers que prestan a Hispanos sin SSN y self-employed. Pre-calificación en 24h.",
  alternates: { canonical: "https://finazo.us/hipotecas" },
};

const PROGRAMS = [
  {
    program: "ITIN loan",
    down: "10–25%",
    rate: "+1.0–2.0% sobre conv.",
    docs: "ITIN + 2 años de impuestos + bank statements",
    who: "Sin SSN, con ITIN activo",
  },
  {
    program: "Bank statement loan (non-QM)",
    down: "10–20%",
    rate: "+0.75–1.5% sobre conv.",
    docs: "12–24 meses de bank statements",
    who: "Self-employed sin W-2",
  },
  {
    program: "DSCR (investment)",
    down: "20–25%",
    rate: "+0.5–1.25% sobre conv.",
    docs: "Renta del inmueble debe cubrir el pago",
    who: "Inversionista — propiedad genera la renta",
  },
  {
    program: "FHA",
    down: "3.5%",
    rate: "Conv. + MIP",
    docs: "SSN + W-2 / 1099",
    who: "First-time buyer con crédito moderado (≥580)",
  },
  {
    program: "Conventional",
    down: "3–20%",
    rate: "Tasa de mercado",
    docs: "SSN + W-2 + 2 años empleo",
    who: "Crédito estable, ingreso documentado",
  },
];

const WHOLESALERS = [
  {
    name: "ACC Mortgage",
    specialty: "ITIN + non-QM líder en TX, FL, CA",
  },
  {
    name: "Arc Home",
    specialty: "Bank statement + DSCR · estados 30+",
  },
  {
    name: "NE1st Bank",
    specialty: "ITIN aprobaciones rápidas · noreste",
  },
  {
    name: "NFM Lending",
    specialty: "Self-employed friendly · cobertura nacional",
  },
];

const FAQS = [
  {
    q: "¿Puedo comprar casa sin Social Security?",
    a: "Sí. Con ITIN activo y 2 años de declaración de impuestos puedes calificar para una hipoteca ITIN o non-QM. Hogares trabaja con 4+ wholesalers especializados — pre-calificación por WhatsApp en 24h.",
  },
  {
    q: "¿Cuánto down payment necesito si soy ITIN?",
    a: "Típicamente 10–25%. Algunos wholesalers aceptan 10% para perfiles muy fuertes (alto crédito, historial estable de empleo). Hogares te dice cuánto necesitas según tu caso.",
  },
  {
    q: "Soy self-employed sin W-2 — ¿puedo calificar?",
    a: "Sí, vía bank statement loan. En vez de pedirte W-2, miran tus bank statements de 12–24 meses para verificar ingreso. Ingenieros, contratistas, dueños de food truck o limpieza — todos califican si pueden documentar depósitos.",
  },
  {
    q: "¿Qué tasa voy a pagar vs. una hipoteca tradicional?",
    a: "ITIN y non-QM cobran 0.75% a 2% más que conventional. La diferencia se reduce con mejor crédito, mayor down y mejor LTV. Hogares te muestra las tasas actuales antes de aplicar.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Hipotecas", item: "https://finazo.us/hipotecas" },
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

export default async function UsHipotecasPage(): Promise<React.ReactElement> {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Nav currentPath="/hipotecas" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[
              { label: "Inicio", href: "/" },
              { label: "Hipotecas" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Hipotecas · Sin SSN · Non-QM</div>
            <h1 className="us-serif">
              Comprar casa <i>sin Social Security</i> sí se puede.
            </h1>
            <p>
              Hipotecas para clientes ITIN, self-employed, sin W-2 tradicional. Si el banco
              de la esquina te dijo que no, hay 4+ wholesalers que sí prestan — y Hogares
              te conecta con todos en una conversación de WhatsApp.
            </p>

            <HogaresFeatureCard />
          </header>

          <ClusterFilterNav active="hipotecas" />

          {/* Programs table */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Programas <i>de hipoteca</i>
              </h2>
              <p>
                Qué califica para tu situación. Un broker como Hogares accede a los
                wholesalers que el banco de la esquina no maneja.
              </p>
            </div>
            <div className="us-data-table-wrap">
              <table className="us-data-table">
                <thead>
                  <tr>
                    <th>Programa</th>
                    <th>Down payment</th>
                    <th>Tasa</th>
                    <th>Documentación</th>
                    <th>Para quién</th>
                  </tr>
                </thead>
                <tbody>
                  {PROGRAMS.map((row, idx) => (
                    <tr key={row.program} className={idx < 2 ? "us-row-highlight" : ""}>
                      <td className="us-strong">{row.program} {idx < 2 && "★"}</td>
                      <td className="us-num">{row.down}</td>
                      <td>{row.rate}</td>
                      <td style={{ fontSize: 13 }}>{row.docs}</td>
                      <td style={{ fontSize: 13 }}>{row.who}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="us-data-source">
              FUENTE: FREDDIE MAC PMMS + WHOLESALER RATE SHEETS · ACTUALIZADO 2026
            </div>
          </section>

          {/* Wholesalers */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Wholesalers que <i>Hogares</i> trabaja
              </h2>
              <p>
                Los lenders que aceptan ITIN, self-employed y bank statement loans. Hogares
                te conecta con todos según tu perfil — no llamas tú, lo hace Sofía.
              </p>
            </div>
            <div className="us-info-grid">
              {WHOLESALERS.map((w) => (
                <div key={w.name} className="us-info-card">
                  <h3 className="us-serif">{w.name}</h3>
                  <p>{w.specialty}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Why Hogares */}
          <WhyBetterGrid
            title={<>Por qué usar <i>Hogares</i></>}
            subtitle="El banco tradicional rechaza el 60% de aplicaciones ITIN. Hogares trabaja con los wholesalers que sí aceptan."
            reasons={[
              {
                num: "1",
                title: "4 wholesalers, 1 conversación",
                body: "ACC, Arc Home, NE1st, NFM — Sofía te conecta con el que mejor se ajusta a tu perfil. No aplicas 4 veces.",
              },
              {
                num: "2",
                title: "ITIN + non-QM expertise",
                body: "Sabe qué documentación necesitas, qué wholesaler tiene mejor tasa para tu situación, qué errores rechazan tu app.",
              },
              {
                num: "3",
                title: "Pre-calificación en 24h",
                body: "Mandas tus documentos por WhatsApp y Sofía te da una respuesta concreta en 24 horas — no en 2 semanas.",
              },
              {
                num: "4",
                title: "Comisión la paga el wholesaler",
                body: "Tú no pagas a Hogares. La comisión se incluye en el closing como cualquier broker — pero Sofía te ayuda a negociar mejores costos de cierre.",
              },
            ]}
          />

          {/* Hard CTA */}
          <HardCubiertoCTA variant="hogares" />

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

          <ClusterArticlesSection clusterKey="hipotecas" />
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
