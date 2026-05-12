import type { Metadata } from "next";
import Link from "next/link";
import { ClusterLanding, type ClusterCopy } from "@/components/us/cluster/ClusterLanding";
import { AcaDisclaimer } from "@/components/us/aca/AcaDisclaimer";

export const revalidate = 3600;

const COPY: ClusterCopy = {
  path: "/aseguranza-salud",
  shortName: "Aseguranza de salud (ACA)",
  h1: "Aseguranza de salud en EE.UU. para Hispanos: guía ACA 2026",
  metaTitle: "Aseguranza de salud ACA — elegibilidad, subsidios, planes 2026 | Finazo",
  metaDescription:
    "Guía completa de aseguranza de salud (ACA / Obamacare) para Hispanos en EE.UU. en 2026. Elegibilidad por estatus migratorio, subsidios, planes, alternativas si no calificás.",
  kicker: "Salud · ACA Marketplace",
  lead: [
    "El Affordable Care Act (ACA) — conocido como Obamacare — es el marketplace federal y estatal donde la mayoría de personas con estatus migratorio legal en EE.UU. consigue aseguranza de salud con subsidios. La eligibilidad varía por estatus migratorio: residentes permanentes, asilados, DACA (en litigio), TPS, H-1B/L-1/F-1 y otros pueden aplicar.",
    "Esta guía cubre quién califica, cómo calcular tu subsidio, qué plan elegir (Bronze/Silver/Gold/Platinum), y qué alternativas tenés si no calificás para ACA — incluyendo FQHCs (clínicas comunitarias) que atienden a todos sin importar estatus migratorio.",
  ],
  articleSlugIncludes: ["aca", "obamacare", "seguro-de-salud", "marketplace", "medicaid"],
  realDataBlock: {
    title: "Open Enrollment Period 2026-2027 y subsidios actuales",
    body:
      "Según Healthcare.gov, el Open Enrollment Period para cobertura ACA 2027 corre del 1 de noviembre 2026 al 15 de enero 2027. Fuera de OEP solo se aplica con Special Enrollment Period (SEP) por evento calificante (pérdida de empleo, matrimonio, mudanza, nacimiento). En 2025 el subsidio promedio del Premium Tax Credit (APTC) según CMS fue de $700/mes para una familia de 4 con ingreso 200% del Federal Poverty Level.",
    sourceLabel: "Healthcare.gov + CMS — Premium Tax Credit reports",
    sourceUrl: "https://www.healthcare.gov/glossary/open-enrollment-period/",
  },
  keyPoints: [
    {
      eyebrow: "ELEGIBILIDAD",
      title: "Quién califica para ACA",
      body: "Ciudadanos, residentes permanentes (green card), asilados, refugiados, visas no-inmigrantes en estatus legal (H-1B, L-1, F-1 con condiciones, TPS), y DACA (en litigio actual — verificá estado en Healthcare.gov). Indocumentados NO califican para marketplace ni subsidios federales.",
    },
    {
      eyebrow: "SUBSIDIOS",
      title: "Premium Tax Credit (APTC)",
      body: "Si tu ingreso familiar está entre 100% y 400%+ del Federal Poverty Level, calificás para subsidio que reduce tu prima mensual. El subsidio se calcula por familia (tax filing unit), no por individuo. Es reconciliable en tu declaración de impuestos del año siguiente.",
    },
    {
      eyebrow: "ALTERNATIVAS",
      title: "Si no calificás para ACA",
      body: "FQHCs (clínicas comunitarias federales) atienden a todos sin importar estatus, con tarifas escalonadas (sliding scale). Emergency Medicaid cubre emergencias para todos. Caridad hospitalaria (charity care) cubre hospitales sin fines de lucro bajo IRS 501(r).",
    },
  ],
  faqs: [
    {
      q: "¿Quién califica para Obamacare con ITIN en 2026?",
      a: "Tener ITIN no determina elegibilidad ACA — el estatus migratorio sí. Si estás en EE.UU. con estatus legal (residente permanente, asilado, refugiado, visa H-1B/L-1/F-1 con condiciones, TPS), calificás aunque uses ITIN. Si sos indocumentado, no calificás para marketplace ni subsidios — pero sí tenés acceso a FQHCs, Emergency Medicaid y caridad hospitalaria.",
    },
    {
      q: "¿DACA califica para ACA en 2026?",
      a: "La elegibilidad de DACA para ACA ha sido litigada en cortes federales 2024-2025. La regulación actual permite que recipientes de DACA apliquen a marketplace, pero el estado puede cambiar — verificá en Healthcare.gov o con un navegador certificado antes de aplicar.",
    },
    {
      q: "¿Cuándo es Open Enrollment para 2027?",
      a: "Del 1 de noviembre 2026 al 15 de enero 2027 para cobertura efectiva en 2027 según Healthcare.gov. Si te enrolás antes del 15 de diciembre 2026, tu cobertura empieza 1 de enero 2027.",
    },
    {
      q: "¿Cuál plan ACA me conviene: Bronze, Silver, Gold o Platinum?",
      a: "Depende de tu uso esperado: Bronze (prima baja, deducible alto) si sos joven y sano. Silver con CSR (Cost-Sharing Reduction) si tu ingreso está entre 100-250% FPL — Silver es el único nivel que te da CSR. Gold/Platinum si tenés condición crónica o uso frecuente de servicios médicos.",
    },
    {
      q: "¿Qué pasa si soy indocumentado y necesito atención médica?",
      a: "FQHCs (community health centers) te atienden con sliding scale sin importar tu estatus migratorio — usá findahealthcenter.hrsa.gov para encontrar uno cerca. Emergency Medicaid cubre emergencias médicas para todos. Hospitales sin fines de lucro tienen políticas de caridad bajo IRS 501(r) que cubren cuentas grandes según tu ingreso.",
    },
    {
      q: "¿Mis hijos US-citizen califican aunque yo no?",
      a: "Sí. Los hijos ciudadanos americanos de padres indocumentados califican para Medicaid o CHIP según el income familiar. Esto es 'mixed-status household' y es altamente subutilizado — millones de niños elegibles no están enrolados porque los padres no saben.",
    },
  ],
  ctaProduct: "auto",
  topNotice: <AcaDisclaimer position="top" />,
  bottomNotice: <AcaDisclaimer position="bottom" />,
  extraSections: (
    <section className="us-sub-section">
      <div className="us-sub-section-head">
        <h2 className="us-serif">
          Marco completo de <i>elegibilidad ACA por estatus migratorio</i>
        </h2>
        <p>
          Per Healthcare.gov y CMS, así se distribuye la elegibilidad — revisá
          el grupo que aplica a tu familia y enlazá al detalle.
        </p>
      </div>
      <div className="us-info-grid">
        <div className="us-info-card">
          <h3 className="us-serif">Califican para marketplace + subsidios</h3>
          <ul>
            <li>Ciudadanos US</li>
            <li>Residentes permanentes (green card)</li>
            <li>Asilados, refugiados, aplicantes de asilo (después de 180 días)</li>
            <li>Visa H-1B, L-1, F-1 (con condiciones), TPS</li>
            <li>DACA (en litigio — verificá Healthcare.gov)</li>
          </ul>
        </div>
        <div className="us-info-card">
          <h3 className="us-serif">No califican para marketplace</h3>
          <ul>
            <li>Indocumentados (sin estatus legal vigente)</li>
            <li>Visitantes turistas o B1/B2</li>
            <li>
              <Link href="/aca-sin-aseguranza-fqhc">
                → Ver alternativas: FQHCs, Emergency Medicaid, caridad
              </Link>
            </li>
          </ul>
        </div>
        <div className="us-info-card">
          <h3 className="us-serif">Familias mixed-status</h3>
          <ul>
            <li>Algunos miembros califican, otros no</li>
            <li>El subsidio se calcula sobre el income del tax-filing-unit</li>
            <li>
              <Link href="/aca-familias-mixtas">
                → Guía para enrolar familias mixed-status
              </Link>
            </li>
          </ul>
        </div>
      </div>
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
