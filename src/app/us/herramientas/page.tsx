import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";

export const metadata: Metadata = {
  title:
    "Herramientas financieras gratis en español — Hispanos en EE.UU. | Finazo",
  description:
    "Calculadoras y comparadores en español para seguros, hipotecas, remesas y credit score. Sin registro, sin venta de datos.",
  alternates: { canonical: "https://finazo.us/herramientas" },
  openGraph: {
    title: "Herramientas financieras gratis en español",
    description:
      "Cotizador de seguros, simulador de hipoteca, comparador de remesas, tracker de credit score.",
    url: "https://finazo.us/herramientas",
    locale: "es_US",
    type: "website",
  },
};

const TOOLS = [
  {
    href: "/herramientas/cotizador-seguro",
    category: "SEGUROS",
    title: "Cotizador de seguro",
    body: "Compara con 8+ aseguradoras dándole solo 5 datos por WhatsApp. Auto, salud y vida en una sola conversación.",
    cta: "Abrir cotizador",
  },
  {
    href: "/herramientas/simulador-hipoteca",
    category: "HIPOTECAS",
    title: "Simulador de hipoteca",
    body: "Cuota mensual, down payment, closing costs y DTI para pre-calificación non-QM con ITIN.",
    cta: "Simular cuota",
  },
  {
    href: "/herramientas/comparador-remesas",
    category: "REMESAS",
    title: "Comparador de remesas",
    body: "Envías $X a México, GT, SV o HN — te decimos dónde sale más barato hoy, en tiempo real.",
    cta: "Comparar tasas",
  },
  {
    href: "/herramientas/credit-tracker",
    category: "CRÉDITO",
    title: "Credit score tracker",
    body: "Plan de 12 meses para construir credit desde 0 a 700+ con ITIN. Checklist mes por mes.",
    cta: "Ver plan",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Herramientas", item: "https://finazo.us/herramientas" },
  ],
};

export default function UsHerramientasHubPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Nav currentPath="/herramientas" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[{ label: "Inicio", href: "/" }, { label: "Herramientas" }]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Herramientas · Gratis</div>
            <h1 className="us-serif">
              Calcula tus números <i>antes de firmar</i>.
            </h1>
            <p>
              Cuatro herramientas que la mayoría de Hispanos no usa porque están
              en inglés o piden 20 datos. Nuestras versiones son en español,
              sin registro, y conectan con un agente real en WhatsApp si
              tienes preguntas.
            </p>
          </header>

          <section className="us-sub-section">
            <div className="us-info-grid">
              {TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={t.href}
                  className="us-info-card"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="us-eyebrow">{t.category}</div>
                  <h3 className="us-serif">{t.title}</h3>
                  <p>{t.body}</p>
                  <div className="us-tool-link" style={{ marginTop: 16 }}>
                    {t.cta} →
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
