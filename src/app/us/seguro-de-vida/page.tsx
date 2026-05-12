import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { CubiertoFeatureCard } from "@/components/us/sub/CubiertoFeatureCard";
import { HardCubiertoCTA } from "@/components/us/sub/HardCubiertoCTA";
import { WhyBetterGrid } from "@/components/us/sub/WhyBetterGrid";

export const metadata: Metadata = {
  title: "Seguro de vida para Hispanos — desde $10/mes",
  description:
    "Term life, whole life, sin examen médico. Para inmigrantes, ITIN, beneficiarios en otro país. Cubierto compara opciones por WhatsApp en español.",
  alternates: { canonical: "https://finazo.us/seguro-de-vida" },
};

const PRODUCT_TYPES = [
  { type: "Term life (10-30 años)", premium: "$10–$45", coverage: "$250K–$1M", who: "El 80% de las familias — más cobertura por menos dinero" },
  { type: "Whole life", premium: "$80–$300", coverage: "$50K–$500K", who: "Quien quiere valor en efectivo + cobertura permanente" },
  { type: "Sin examen médico (simplified)", premium: "$25–$75", coverage: "$50K–$500K", who: "Quien quiere aprobación rápida o tiene condición preexistente" },
  { type: "Guaranteed issue (sin preguntas)", premium: "$50–$150", coverage: "$5K–$25K", who: "Mayores de 50, gastos finales, sin importar salud" },
];

const FAQS = [
  {
    q: "¿Puedo tener seguro de vida con ITIN?",
    a: "Sí. Aseguradoras grandes como Banner Life, Lincoln, Pacific Life y Mutual of Omaha aceptan ITIN. Las aseguradoras 100% online (Ethos, Bestow, Haven Life) varían por estado.",
  },
  {
    q: "¿Puedo poner a alguien en mi país de origen como beneficiario?",
    a: "Sí. Las aseguradoras grandes aceptan beneficiarios internacionales sin problema. Cuando se paga la indemnización, se puede mandar al país del beneficiario por wire o aplicaciones como Wise/Remitly. Carmen de Cubierto te explica los pasos por WhatsApp.",
  },
  {
    q: "¿Cuánta cobertura necesito?",
    a: "Regla simple: 10x tu ingreso anual si tienes hijos pequeños, 5–7x si los hijos son mayores. Si mandas $400/mes a tu familia en LATAM, $400 × 12 × 25 años = $120K como mínimo de cobertura.",
  },
  {
    q: "¿Term life o whole life?",
    a: "Para casi todas las familias: term life. Es 10–20× más barato y cubre los años en que tu familia más te necesita (mientras los hijos crecen, mientras pagas la casa). Whole life conviene en casos específicos — Cubierto te dice cuándo.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Seguro de vida", item: "https://finazo.us/seguro-de-vida" },
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

export default function UsSeguroVidaPage(): React.ReactElement {
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
              { label: "Seguro de vida" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Seguros · Vida</div>
            <h1 className="us-serif">
              Seguro de vida para Hispanos, <i>aquí o en casa</i>.
            </h1>
            <p>
              Si mandas dinero a tu familia, eres su seguro. Term life, whole life, sin examen
              médico, beneficiarios en otro país — Cubierto compara las opciones que más
              importan a inmigrantes Hispanos.
            </p>

            <CubiertoFeatureCard variant="vida" />
          </header>

          {/* Product types */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Tipos de <i>seguro de vida</i>
              </h2>
              <p>
                Prima mensual estimada para adulto sano de 35 años. Tu cotización real depende
                de edad, salud, hábito de fumar, monto de cobertura y aseguradora.
              </p>
            </div>
            <div className="us-data-table-wrap">
              <table className="us-data-table">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Prima mensual</th>
                    <th>Cobertura típica</th>
                    <th>Para quién</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCT_TYPES.map((row, idx) => (
                    <tr key={row.type} className={idx === 0 ? "us-row-highlight" : ""}>
                      <td className="us-strong">{row.type} {idx === 0 && "★"}</td>
                      <td className="us-num">{row.premium}</td>
                      <td>{row.coverage}</td>
                      <td style={{ fontSize: 13 }}>{row.who}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="us-data-source">
              FUENTE: TARIFAS PROMEDIO DE QUOTACY + POLICYGENIUS · ESTADO 2026
            </div>
          </section>

          {/* Why Cubierto */}
          <WhyBetterGrid
            title={<>Por qué usar <i>Cubierto</i> para vida</>}
            subtitle="Las aseguradoras de vida varían 50%+ en precio por el mismo perfil. Carmen compara."
            reasons={[
              {
                num: "1",
                title: "Compara 6+ aseguradoras",
                body: "Banner Life, Pacific Life, Lincoln, Mutual of Omaha, Ethos, Haven Life. Diferencia entre la más cara y la más barata: 30–60%.",
              },
              {
                num: "2",
                title: "ITIN holders aceptados",
                body: "Aseguradoras grandes aceptan ITIN — Carmen sabe cuáles. Sin examen médico también disponible.",
              },
              {
                num: "3",
                title: "Beneficiarios internacionales",
                body: "Tu familia en México, Guatemala, Honduras o El Salvador puede ser beneficiaria sin problema. Carmen explica el proceso de pago.",
              },
              {
                num: "4",
                title: "Sin examen si no quieres",
                body: "Simplified issue te aprueba en 24h con preguntas. Guaranteed issue acepta a cualquiera mayor de 50, sin preguntas de salud.",
              },
            ]}
          />

          {/* Hard CTA */}
          <HardCubiertoCTA variant="cubierto-vida" />

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
                <Link href="/guias" className="us-related-item">
                  <svg className="us-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                  <div>
                    <div className="us-related-item-title">Ver todas las guías de seguros →</div>
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
