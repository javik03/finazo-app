import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/us/layout/Nav";
import { UsFooter } from "@/components/us/layout/UsFooter";
import { FloatingWA } from "@/components/us/layout/FloatingWA";
import { UsBreadcrumb } from "@/components/us/article/Breadcrumb";
import { ClusterArticlesSection } from "@/components/us/cluster/ClusterArticlesSection";
import { ClusterFilterNav } from "@/components/us/cluster/ClusterFilterNav";
import { CohortLinksSection } from "@/components/us/cluster/CohortLinksSection";
import { buildOpenGraph } from "@/lib/og-defaults";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Declarar impuestos sin Social Security 2026",
  description:
    "Guía editorial sobre impuestos en EE.UU. para la comunidad Hispana sin Social Security: cómo sacar ITIN con Form W-7, declarar con SSN o sin él, créditos para padres, errores que cuestan dinero.",
  alternates: { canonical: "https://finazo.us/fiscal" },
  openGraph: buildOpenGraph({
    title: "Impuestos en EE.UU. para Hispanos",
    description:
      "ITIN, W-7, deducciones y créditos. Sin jerga del IRS, en español.",
    url: "https://finazo.us/fiscal",
  }),
};

const TOPICS = [
  {
    title: "ITIN (Individual Taxpayer Identification Number)",
    body: "El número que el IRS te da si no calificas para Social Security pero sí debes declarar impuestos. Es la puerta de entrada a credit score, hipoteca y muchas cuentas bancarias.",
    bullets: [
      "Quién necesita ITIN y quién puede usar SSN",
      "Formulario W-7 paso a paso",
      "Acceptance Agents vs. enviar al IRS directo",
      "ITIN expirado: cómo renovarlo sin demora en tu refund",
    ],
  },
  {
    title: "Declarar impuestos con ITIN",
    body: "Sí puedes y sí debes — incluso si no tienes ingresos altos. Declarar te construye historial fiscal, te abre la puerta a refund, créditos y demuestra residencia.",
    bullets: [
      "Form 1040 con ITIN: qué cambia vs. SSN",
      "Standard deduction vs. itemized para Hispanos",
      "Estados sin income tax (FL, TX, NV, WA, TN, SD, WY, AK, NH)",
    ],
  },
  {
    title: "Créditos y deducciones que sí aplican con ITIN",
    body: "El Child Tax Credit cambió en 2024 — sigue siendo accesible con ITIN si tus hijos tienen SSN. Hay decenas de créditos que muchos Hispanos no reclaman.",
    bullets: [
      "Child Tax Credit y Credit for Other Dependents",
      "American Opportunity Credit (educación universitaria)",
      "Saver's Credit por aportar a IRA",
      "Premium Tax Credit del ACA (subsidio de seguro)",
    ],
  },
  {
    title: "Errores caros que vemos cada año",
    body: "Estos son los errores que hacen que el IRS te retenga el refund, te audite, o te haga pagar de más. La mayoría son evitables con 10 minutos de prep.",
    bullets: [
      "Usar SSN ajeno o ITIN expirado",
      "No reportar ingresos 1099 (gig work, Doordash, Uber)",
      "Olvidar deducir millas de trabajo o herramientas",
      "Pagar a un preparador que se queda con tu refund",
    ],
  },
];

const FAQS = [
  {
    q: "¿Tengo que declarar impuestos si tengo ITIN y no SSN?",
    a: "Sí, si tienes ingresos reportables en EE.UU. (W-2, 1099, renta, etc.). Es lo que justifica tu presencia en el país y construye historial fiscal — útil para futuras peticiones migratorias, hipotecas, y crédito.",
  },
  {
    q: "¿Cuánto cuesta sacar ITIN?",
    a: "Si envías el W-7 al IRS directamente, $0. Si usas un Acceptance Agent o tax preparer, suele costar $50–$200. Vale la pena el AA porque revisa que tu paquete esté completo — el IRS rechaza ~30% de W-7 enviados solos por errores chicos.",
  },
  {
    q: "¿Puedo recibir refund con ITIN?",
    a: "Sí. Los reintegros vienen igual que con SSN. Para depósito directo necesitas cuenta de banco con ITIN — abrir esa cuenta es el primer paso para Hispanos recién llegados.",
  },
  {
    q: "¿Qué pasa si no he declarado en años pasados?",
    a: "Puedes ponerte al día con declaraciones atrasadas (back taxes). El IRS es más permisivo de lo que la gente cree, y en muchos casos termina debiendo refund. Lo importante es no esconderte — eso sí trae problemas.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.us" },
    { "@type": "ListItem", position: 2, name: "Fiscal", item: "https://finazo.us/fiscal" },
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

export default async function UsFiscalHubPage(): Promise<React.ReactElement> {
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
      <Nav currentPath="/fiscal" />

      <main>
        <div className="us-sub-shell">
          <UsBreadcrumb
            crumbs={[{ label: "Inicio", href: "/" }, { label: "Fiscal" }]}
          />

          <header className="us-sub-hero">
            <div className="us-hero-kicker">Fiscal · ITIN y W-7</div>
            <h1 className="us-serif">
              Impuestos en EE.UU., <i>sin jerga del IRS</i>.
            </h1>
            <p>
              ITIN, declaraciones, créditos para padres y deducciones que la
              mayoría de Hispanos no reclama. Cada año millones se quedan en
              refunds no cobrados — esta sección existe para que el tuyo no.
            </p>
          </header>

          <ClusterFilterNav active="fiscal" />

          <section className="us-sub-section">
            <div className="us-sub-section-head">
              <h2 className="us-serif">
                Lo que <i>cubrimos</i>
              </h2>
              <p>Las cuatro áreas donde más Hispanos pagan de más o pierden refund.</p>
            </div>
            <div className="us-info-grid">
              {TOPICS.map((t) => (
                <div key={t.title} className="us-info-card">
                  <h3 className="us-serif">{t.title}</h3>
                  <p>{t.body}</p>
                  <ul>
                    {t.bullets.map((b) => (
                      <li key={b}>
                        <span className="us-bullet-down">→</span> {b}
                      </li>
                    ))}
                  </ul>
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

          <CohortLinksSection
            heading="Por tu situación"
            intro="Declarar impuestos en EE.UU. con ITIN requiere atención a deducciones, créditos y reglas que la mayoría de Hispanos no conoce."
            links={[
              {
                href: "/impuestos-sin-social-security",
                title: "Declarar impuestos sin Social Security",
                blurb: "Cómo sacar ITIN con Form W-7, qué deducir, créditos que aplican, y los errores que cuestan dinero cada año.",
              },
            ]}
          />

          <ClusterArticlesSection clusterKey="fiscal" />
        </div>
      </main>

      <UsFooter />
      <FloatingWA />
    </>
  );
}
