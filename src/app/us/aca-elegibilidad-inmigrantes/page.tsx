import type { Metadata } from "next";
import Link from "next/link";
import { ClusterLanding, type ClusterCopy } from "@/components/us/cluster/ClusterLanding";
import { AcaDisclaimer } from "@/components/us/aca/AcaDisclaimer";

export const revalidate = 3600;

const COPY: ClusterCopy = {
  path: "/aca-elegibilidad-inmigrantes",
  shortName: "Elegibilidad ACA para inmigrantes",
  h1: "Elegibilidad ACA por estatus migratorio: quién califica en 2026",
  metaTitle: "Elegibilidad ACA por estatus migratorio — quién califica 2026 | Finazo",
  metaDescription:
    "Quién califica para Obamacare según su estatus migratorio en 2026. Residentes permanentes, asilados, DACA, TPS, H-1B, F-1, indocumentados — guía completa.",
  kicker: "ACA · Elegibilidad",
  lead: [
    "La elegibilidad para el ACA Marketplace y los subsidios federales (Premium Tax Credit) está determinada por tu estatus migratorio, no por tu nacionalidad ni por si tenés ITIN o SSN. Esta guía detalla cada categoría migratoria, qué exige Healthcare.gov, y dónde buscar alternativas si tu estatus no califica.",
    "Importante: la regla sobre DACA y ACA ha estado en litigio en cortes federales 2024-2025. La regulación actual permite a recipientes de DACA aplicar, pero verificá tu situación específica en Healthcare.gov antes de enrolarte.",
  ],
  articleSlugIncludes: ["elegibilidad", "aca-eligible", "obamacare", "daca", "tps", "green-card", "asilo"],
  realDataBlock: {
    title: "Categorías de elegibilidad ACA según Healthcare.gov en 2026",
    body:
      "Healthcare.gov clasifica la elegibilidad en tres grupos: (1) 'Eligible Immigrants' — pueden enrolarse y recibir subsidios; (2) 'Lawfully Present' — categoría más amplia que incluye visas no-inmigrantes; (3) 'Not Eligible' — indocumentados, B1/B2 turistas, visa waiver. Para el 2026, la lista de status 'lawfully present' incluye 20+ categorías individuales. El National Immigration Law Center publica el árbol completo actualizado.",
    sourceLabel: "National Immigration Law Center — Health Care Coverage Eligibility",
    sourceUrl: "https://www.nilc.org/issues/health-care/",
  },
  keyPoints: [
    {
      eyebrow: "CALIFICAN",
      title: "Estatus elegibles para Marketplace + subsidios",
      body: "Ciudadanos, residentes permanentes (green card), asilados, refugiados, aplicantes de asilo después de 180 días, parolees, víctimas de trata, H-1B, L-1, F-1 (con condiciones), TPS, DACA (en litigio — verificá).",
    },
    {
      eyebrow: "NO CALIFICAN",
      title: "Estatus excluidos del Marketplace",
      body: "Indocumentados (sin estatus legal vigente), turistas con visa B1/B2, beneficiarios de Visa Waiver Program, y personas en proceso de aplicación inicial sin estatus interim.",
    },
    {
      eyebrow: "VERIFICACIÓN",
      title: "Cómo Healthcare.gov verifica tu estatus",
      body: "Healthcare.gov consulta tu Alien Number (A-Number) con USCIS y SSA al aplicar. Si la verificación inicial falla, te dan 90 días para enviar documentación adicional sin perder la elegibilidad.",
    },
  ],
  faqs: [
    {
      q: "¿Califico para ACA si tengo green card en 2026?",
      a: "Sí. Los residentes permanentes (Lawful Permanent Residents) califican para Marketplace y subsidios desde el día que reciben la green card. No hay periodo de espera para ACA (a diferencia de Medicaid, que sí tiene 'five-year bar' en la mayoría de estados).",
    },
    {
      q: "¿Califico si tengo TPS en 2026?",
      a: "Sí. Los recipientes de Temporary Protected Status (TPS) están en la lista de 'lawfully present immigrants' de Healthcare.gov y califican para Marketplace + subsidios mientras su TPS esté vigente. Si TPS termina para tu país, verificá tu nueva elegibilidad antes del cambio.",
    },
    {
      q: "¿DACA califica para ACA en 2026?",
      a: "La regla federal actual permite a recipientes de DACA aplicar al Marketplace y recibir subsidios. La regla ha sido litigada en cortes federales en 2024-2025 — específicamente en el caso State of Kansas et al. v. Becerra. Antes de enrolarte, verificá el estado actual en Healthcare.gov o con un navegador certificado.",
    },
    {
      q: "¿Califico si tengo visa F-1 de estudiante?",
      a: "Sí, bajo condiciones específicas: tu visa debe ser válida, debés estar inscripto en tu institución académica, y debés cumplir con los Substantial Presence Test del IRS. Algunos estudiantes F-1 también califican para Medicaid según el estado.",
    },
    {
      q: "¿Qué pasa si soy aplicante de asilo todavía sin decisión?",
      a: "Los aplicantes de asilo califican para Marketplace 180 días después de aplicar formalmente con USCIS (fecha de submission del Form I-589). Antes de los 180 días no califican para subsidios, pero pueden tener acceso a FQHCs y a Emergency Medicaid.",
    },
    {
      q: "¿Mi familia mixed-status puede aplicar?",
      a: "Sí. En una familia mixed-status, los miembros que califican individualmente pueden enrolarse en Marketplace y recibir subsidios calculados sobre el income del tax-filing-unit completo. Los miembros que no califican simplemente no se enrolan — pero el resto de la familia sí. Ver guía específica.",
    },
  ],
  ctaProduct: "auto",
  topNotice: <AcaDisclaimer position="top" />,
  bottomNotice: <AcaDisclaimer position="bottom" />,
  extraSections: (
    <section className="us-sub-section">
      <div className="us-sub-section-head">
        <h2 className="us-serif">
          Si no califico, <i>qué opciones reales tengo</i>
        </h2>
      </div>
      <ul className="us-related-list">
        <li>
          <Link href="/aca-sin-aseguranza-fqhc" className="us-related-item">
            <div>
              <div className="us-related-item-title">
                FQHCs (clínicas comunitarias) — atienden a todos sin importar estatus
              </div>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/aca-familias-mixtas" className="us-related-item">
            <div>
              <div className="us-related-item-title">
                Familias mixed-status: enrolar a los miembros que sí califican
              </div>
            </div>
          </Link>
        </li>
      </ul>
    </section>
  ),
};

export const metadata: Metadata = {
  title: COPY.metaTitle,
  description: COPY.metaDescription,
  alternates: { canonical: `https://finazo.us${COPY.path}` },
  openGraph: { title: COPY.h1, description: COPY.metaDescription, url: `https://finazo.us${COPY.path}`, locale: "es_US", type: "website" },
};

export default async function Page(): Promise<React.ReactElement> {
  return <ClusterLanding copy={COPY} />;
}
