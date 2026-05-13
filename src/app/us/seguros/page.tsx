import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { HardCubiertoCTA } from "@/components/us/sub/HardCubiertoCTA";
import { buildOpenGraph } from "@/lib/og-defaults";
import { ClusterArticlesSection } from "@/components/us/cluster/ClusterArticlesSection";
import { ClusterFilterNav } from "@/components/us/cluster/ClusterFilterNav";
import { CohortLinksSection } from "@/components/us/cluster/CohortLinksSection";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Seguros para Hispanos en EE.UU. — auto, salud, vida",
  description:
    "Guía editorial sobre seguro de auto, salud y vida para la comunidad Hispana en EE.UU. Tarifas reales por estado, opciones con ITIN, cotización por WhatsApp con Cubierto.",
  alternates: { canonical: "https://finazo.us/seguros" },
  openGraph: buildOpenGraph({
    title: "Seguros en español para Hispanos en EE.UU.",
    description:
      "Guía editorial sobre seguro de auto, salud y vida. Tarifas reales, opciones con ITIN, cotización por WhatsApp con Cubierto.",
    url: "https://finazo.us/seguros",
  }),
};

type ProductLink = {
  href: string;
  category: string;
  title: string;
  body: string;
  bullets: string[];
};

const PRODUCTS: ProductLink[] = [
  {
    href: "/seguro-de-auto",
    category: "AUTO",
    title: "Seguro de auto",
    body: "Tarifas promedio por estado, requisitos legales y los factores que afectan tu prima como conductor Hispano.",
    bullets: [
      "10 estados con tabla de primas y mínimos legales",
      "Qué cambia con ITIN, AB-60 o licencia consular",
      "Cotización con 8+ aseguradoras por WhatsApp",
    ],
  },
  {
    href: "/seguro-de-salud",
    category: "SALUD",
    title: "Seguro de salud (ACA)",
    body: "Cómo elegir Bronze, Silver o Gold, calcular tu subsidio y qué cambia según tu estado migratorio.",
    bullets: [
      "Subsidios premium tax credit explicados",
      "Diferencias por estado en Medicaid expansion",
      "Carmen te ayuda en español, sin formularios",
    ],
  },
  {
    href: "/seguro-de-vida",
    category: "VIDA",
    title: "Seguro de vida",
    body: "Term life vs whole life vs sin examen médico — beneficiarios en cualquier país, desde $10/mes.",
    bullets: [
      "Pólizas que aceptan ITIN sin SSN",
      "Beneficiarios en LATAM permitidos",
      "Sin examen médico hasta $500K en muchos casos",
    ],
  },
];

const FAQS = [
  {
    q: "¿Puedo comprar seguro de auto o salud sin Social Security?",
    a: "Sí. La mayoría de aseguradoras de auto y muchos planes ACA aceptan ITIN o número de pasaporte. La clave es la aseguradora correcta — Cubierto sabe cuáles aceptan tu situación migratoria específica.",
  },
  {
    q: "¿Cubierto cobra por sus servicios?",
    a: "No al consumidor. La aseguradora paga la comisión. Comparar con 8+ aseguradoras en una sola conversación de WhatsApp casi siempre baja la prima vs. ir directo a una sola compañía.",
  },
  {
    q: "¿Qué seguro necesito si recién llegué a EE.UU.?",
    a: "Empieza por seguro de auto (obligatorio en todos los estados si manejas) y seguro de salud (penalidad federal eliminada, pero un día en hospital sin seguro cuesta $5,000+). Vida y disability se agregan cuando hay familia que depende de ti.",
  },
  {
    q: "¿Por qué pagar seguro de vida si soy joven y sano?",
    a: "Porque la prima es 10x más barata a los 30 que a los 50. Una póliza term de 20 años bloqueada hoy te cuesta $15–25/mes y protege a tu familia hasta que tus hijos terminen la universidad.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Seguros", item: "https://finazo.us/seguros" },
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

export default async function UsSegurosHubPage(): Promise<React.ReactElement> {
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
      <Nav currentPath="/seguros" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[{ label: "Inicio", href: "/" }, { label: "Seguros" }]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Seguros · Hispanos en EE.UU.</div>
            <h1 className="us-serif">
              Seguro en español, <i>sin la letra chica</i>.
            </h1>
            <p>
              Auto, salud y vida — explicado con números reales, sin jerga, y
              con opciones que aceptan ITIN o pasaporte. Cuando estés listo
              para cotizar, Carmen lo hace por WhatsApp con 8+ aseguradoras a
              la vez.
            </p>
          </header>

          <ClusterFilterNav active="seguros" />

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Por <i>tipo de seguro</i>
              </h2>
              <p>
                Cada guía cubre tarifas por estado, requisitos para Hispanos, y
                las opciones que realmente aceptan tu situación migratoria.
              </p>
            </div>

            <div className="us-info-grid us-info-grid-3">
              {PRODUCTS.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="us-info-card"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="us-eyebrow">{p.category}</div>
                  <h3 className="us-serif">{p.title}</h3>
                  <p>{p.body}</p>
                  <ul>
                    {p.bullets.map((b) => (
                      <li key={b}>
                        <span className="us-bullet-down">→</span> {b}
                      </li>
                    ))}
                  </ul>
                  <div className="us-tool-link" style={{ marginTop: 16 }}>
                    Leer la guía →
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <CohortLinksSection
            heading="Por tu situación"
            intro="Páginas dedicadas para situaciones específicas de la comunidad Hispana. Sin SSN, con licencia extranjera, familia de estatus mixto, recién llegado al país."
            links={[
              {
                href: "/seguro-auto-sin-social-security",
                title: "Seguro de auto sin Social Security",
                blurb: "Qué aseguradoras aceptan ITIN o pasaporte. Tarifas reales, requisitos por estado, errores comunes.",
              },
              {
                href: "/seguro-auto-licencia-extranjera",
                title: "Seguro de auto con licencia extranjera",
                blurb: "Cobertura con licencia mexicana, salvadoreña, guatemalteca u otra. AB-60, IDP, y reglas por estado.",
              },
              {
                href: "/aca-elegibilidad-inmigrantes",
                title: "ACA: elegibilidad para inmigrantes",
                blurb: "Quién califica al Marketplace según estatus migratorio. ITIN, DACA, TPS, asilados, residentes.",
              },
              {
                href: "/aca-subsidios",
                title: "ACA: cómo funcionan los subsidios",
                blurb: "Premium Tax Credit y Cost Sharing Reductions explicados. Calculá tu ahorro mensual real.",
              },
              {
                href: "/aca-familias-mixtas",
                title: "ACA para familias de estatus mixto",
                blurb: "Cuando un cónyuge tiene SSN y el otro no, qué pasa con los niños ciudadanos, y cómo declarar.",
              },
              {
                href: "/aca-sin-aseguranza-fqhc",
                title: "Sin seguro: clínicas FQHC y caridad",
                blurb: "Atención médica gratuita o de bajo costo cuando no calificás para Marketplace ni Medicaid.",
              },
            ]}
          />

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

          <ClusterArticlesSection clusterKey="seguros" />
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
