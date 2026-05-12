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
  title: "Seguro de salud para Hispanos — ACA y Medicaid",
  description:
    "Marketplace ACA, Medicaid expansion, planes para indocumentados, subsidios. Cubierto te ayuda a encontrar el plan correcto en español por WhatsApp.",
  alternates: { canonical: "https://finazo.us/seguro-de-salud" },
};

const METAL_TIERS = [
  { tier: "Bronze", premium: "$280", deductible: "$7,500", coinsurance: "40%", who: "Joven y saludable, no usa mucho doctor" },
  { tier: "Silver", premium: "$420", deductible: "$4,800", coinsurance: "30%", who: "El más común — califica para CSR si <250% FPL" },
  { tier: "Gold", premium: "$540", deductible: "$1,800", coinsurance: "20%", who: "Familia con uso frecuente o condiciones crónicas" },
  { tier: "Platinum", premium: "$680", deductible: "$500", coinsurance: "10%", who: "Embarazo, cirugía planeada, alto uso médico" },
];

const STATE_MEDICAID = [
  { state: "California", expansion: "Sí", indoc: "Sí — Medi-Cal cubre adultos indocumentados" },
  { state: "Nueva York", expansion: "Sí", indoc: "Sí — programas estatales para indocumentados" },
  { state: "Illinois", expansion: "Sí", indoc: "Sí — adultos 42+ indocumentados" },
  { state: "Texas", expansion: "No", indoc: "Solo emergencias y embarazo" },
  { state: "Florida", expansion: "No", indoc: "Solo emergencias y embarazo" },
  { state: "Washington", expansion: "Sí", indoc: "Cascade Care para algunos casos" },
];

const FAQS = [
  {
    q: "¿Puedo aplicar a ACA si tengo ITIN pero no SSN?",
    a: "Sí. Los miembros de tu familia con SSN o estatus legal pueden inscribirse y recibir subsidios. Tú declaras household income. HealthCare.gov no rechaza familias mixtas.",
  },
  {
    q: "¿Hay seguro de salud para indocumentados?",
    a: "Depende del estado. California (Medi-Cal), NY, IL, WA tienen programas estatales para adultos indocumentados. En estados sin expansion, los community health centers (FQHC) cobran según ingreso.",
  },
  {
    q: "¿Qué pasa si no califico para Medicaid pero ACA es muy caro?",
    a: "Hay opciones — short-term plans, FQHC para visitas, programas de asistencia farmacéutica. Carmen de Cubierto te ayuda a navegar tu situación específica por WhatsApp.",
  },
  {
    q: "¿Cuándo es Open Enrollment 2026?",
    a: "Del 1 de noviembre 2025 al 15 de enero 2026 en la mayoría de estados. Si tienes evento calificador (matrimonio, hijo, mudanza, pérdida de trabajo) puedes inscribirte fuera de esas fechas vía Special Enrollment Period.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Seguro de salud", item: "https://finazo.us/seguro-de-salud" },
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

export default function UsSeguroSaludPage(): React.ReactElement {
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
              { label: "Seguro de salud" },
            ]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Seguros · Salud</div>
            <h1 className="us-serif">
              Seguro de salud en español, <i>sin la frustración del Marketplace</i>.
            </h1>
            <p>
              ACA, Medicaid, planes estatales para indocumentados, subsidios. La elegibilidad
              depende de tu ingreso y estado — Cubierto te ayuda a navegarlo por WhatsApp.
            </p>

            <CubiertoFeatureCard variant="salud" />
          </header>

          {/* Metal tiers table */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Planes ACA <i>por nivel</i>
              </h2>
              <p>
                Prima mensual aproximada para adulto de 40 años, antes de subsidios. Tu costo
                real puede ser $0 si calificas para APTC + CSR.
              </p>
            </div>
            <div className="us-data-table-wrap">
              <table className="us-data-table">
                <thead>
                  <tr>
                    <th>Nivel</th>
                    <th>Prima mensual</th>
                    <th>Deducible</th>
                    <th>Coaseguro</th>
                    <th>Para quién</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="us-strong">Bronze</td>
                    <td className="us-num">{METAL_TIERS[0].premium}</td>
                    <td>{METAL_TIERS[0].deductible}</td>
                    <td>{METAL_TIERS[0].coinsurance}</td>
                    <td style={{ fontSize: 13 }}>{METAL_TIERS[0].who}</td>
                  </tr>
                  <tr className="us-row-highlight">
                    <td className="us-strong">Silver ★</td>
                    <td className="us-num">{METAL_TIERS[1].premium}</td>
                    <td>{METAL_TIERS[1].deductible}</td>
                    <td>{METAL_TIERS[1].coinsurance}</td>
                    <td style={{ fontSize: 13 }}>{METAL_TIERS[1].who}</td>
                  </tr>
                  <tr>
                    <td className="us-strong">Gold</td>
                    <td className="us-num">{METAL_TIERS[2].premium}</td>
                    <td>{METAL_TIERS[2].deductible}</td>
                    <td>{METAL_TIERS[2].coinsurance}</td>
                    <td style={{ fontSize: 13 }}>{METAL_TIERS[2].who}</td>
                  </tr>
                  <tr>
                    <td className="us-strong">Platinum</td>
                    <td className="us-num">{METAL_TIERS[3].premium}</td>
                    <td>{METAL_TIERS[3].deductible}</td>
                    <td>{METAL_TIERS[3].coinsurance}</td>
                    <td style={{ fontSize: 13 }}>{METAL_TIERS[3].who}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="us-data-source">
              FUENTE: HEALTHCARE.GOV PROFILES + KFF · ACTUALIZADO 2026
            </div>
          </section>

          {/* Medicaid by state */}
          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Medicaid <i>por estado</i>
              </h2>
              <p>
                Medicaid expansion + cobertura para indocumentados. Tabla parcial — Cubierto
                tiene la lista completa de los 50 estados actualizada al día.
              </p>
            </div>
            <div className="us-data-table-wrap">
              <table className="us-data-table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Medicaid expansion</th>
                    <th>Cobertura indocumentados</th>
                  </tr>
                </thead>
                <tbody>
                  {STATE_MEDICAID.map((row) => (
                    <tr key={row.state}>
                      <td className="us-strong">{row.state}</td>
                      <td className={row.expansion === "Sí" ? "us-num" : ""}>{row.expansion}</td>
                      <td style={{ fontSize: 13 }}>{row.indoc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="us-data-source">
              FUENTE: KFF MEDICAID EXPANSION TRACKER · CMS · ESTADO 2026
            </div>
          </section>

          {/* Why Cubierto */}
          <WhyBetterGrid
            title={<>Por qué usar <i>Cubierto</i> para salud</>}
            subtitle="HealthCare.gov es complejo. Carmen lo simplifica en una conversación de WhatsApp."
            reasons={[
              {
                num: "1",
                title: "Calcula tu subsidio en segundos",
                body: "Con tu ingreso y tamaño de familia, Carmen te dice tu APTC + CSR en menos de un minuto. Sin formularios infinitos.",
              },
              {
                num: "2",
                title: "Sabe qué cubre tu estado",
                body: "Medicaid expansion, programas estatales para indocumentados, FQHC, CHIP — Carmen conoce las reglas específicas de tu estado.",
              },
              {
                num: "3",
                title: "Compara Bronze, Silver, Gold",
                body: "Te explica cuándo Silver+CSR conviene más que Gold, cuándo Bronze es la mejor opción, y cuándo no necesitas nada del Marketplace.",
              },
              {
                num: "4",
                title: "Open Enrollment + SEP",
                body: "Si te perdiste Open Enrollment, Carmen identifica si tienes un Special Enrollment Period y te ayuda a inscribirte hoy.",
              },
            ]}
          />

          {/* Hard CTA */}
          <HardCubiertoCTA variant="cubierto-salud" />

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
                <Link href="/guias/seguro-salud-sin-social-security-aca-2026" className="us-related-item">
                  <svg className="us-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                  <div>
                    <div className="us-related-item-title">Seguro de salud sin Social Security: opciones reales 2026</div>
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
