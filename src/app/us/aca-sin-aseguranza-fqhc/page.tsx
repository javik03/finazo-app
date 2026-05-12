import type { Metadata } from "next";
import { ClusterLanding, type ClusterCopy } from "@/components/us/cluster/ClusterLanding";
import { AcaDisclaimer } from "@/components/us/aca/AcaDisclaimer";

export const revalidate = 3600;

const COPY: ClusterCopy = {
  path: "/aca-sin-aseguranza-fqhc",
  shortName: "Atención médica sin seguro",
  h1: "Atención médica en EE.UU. sin seguro: FQHCs, Emergency Medicaid, caridad 2026",
  metaTitle: "Sin seguro médico — FQHCs, Emergency Medicaid, charity care 2026 | Finazo",
  metaDescription:
    "Si no calificás para ACA en 2026, igual hay opciones reales: FQHCs (clínicas comunitarias) atienden a todos, Emergency Medicaid, caridad hospitalaria. Guía completa.",
  kicker: "Salud · Sin seguro",
  lead: [
    "Si sos indocumentado o tu estatus migratorio no te permite enrolarte en ACA Marketplace, no estás sin opciones. Hay tres recursos federales sub-utilizados que cubren atención médica sin importar tu estatus: FQHCs (Federally Qualified Health Centers), Emergency Medicaid, y caridad hospitalaria bajo IRS 501(r).",
    "Esta guía cubre cada uno con datos públicos: cuánto cuestan típicamente, qué cubren, cómo buscarlos, y por qué tantos Hispanos pagan miles de dólares en facturas hospitalarias que nunca tenían que pagar.",
  ],
  articleSlugIncludes: ["fqhc", "sin-seguro", "clinica-comunitaria", "emergency-medicaid", "caridad"],
  realDataBlock: {
    title: "FQHCs en EE.UU. — cobertura y costo en 2026",
    body:
      "Según HRSA (Health Resources and Services Administration), hay más de 1,400 FQHCs federalmente calificados en EE.UU. con 14,000+ sitios atendiendo a 31 millones de pacientes en 2024. Las FQHCs tienen sliding-fee scale obligatorio basado en income y tamaño familiar — gente con income debajo del 100% FPL paga típicamente $0-25 por visita, según los reportes públicos UDS de HRSA. Atienden a todos sin importar estatus migratorio ni capacidad de pago.",
    sourceLabel: "HRSA — Find a Health Center",
    sourceUrl: "https://findahealthcenter.hrsa.gov/",
  },
  keyPoints: [
    {
      eyebrow: "FQHCs",
      title: "Clínicas comunitarias federales",
      body: "1,400+ centros, 14,000+ sitios. Sliding scale obligatorio según income. Atienden a todos sin importar estatus migratorio. Servicios: medicina general, dental, salud mental, OB/GYN, farmacia. Buscá en findahealthcenter.hrsa.gov.",
    },
    {
      eyebrow: "EMERGENCY",
      title: "Emergency Medicaid",
      body: "Cubre emergencias médicas (parto, accidente, condición que pone en peligro la vida) para todos sin importar estatus. El hospital factura a Medicaid directamente — no le facturan al paciente. Requiere aplicación post-emergencia.",
    },
    {
      eyebrow: "CARIDAD",
      title: "Charity Care bajo IRS 501(r)",
      body: "Hospitales sin fines de lucro (501(c)(3)) están obligados por IRS 501(r) a tener política de caridad. Cubre cuentas grandes según tu income — típicamente reducción del 50-100% si estás debajo del 200% FPL. Aplicación con el departamento financiero del hospital.",
    },
  ],
  faqs: [
    {
      q: "¿Las FQHCs me atienden si soy indocumentado en 2026?",
      a: "Sí. Las FQHCs (Federally Qualified Health Centers) están legalmente obligadas a atender a todos sin importar estatus migratorio. No piden documentos migratorios para registrarte. El único documento que piden es comprobante de income para calcular tu sliding-fee.",
    },
    {
      q: "¿Cuánto cuesta una visita a FQHC?",
      a: "Depende de tu income. Para gente debajo del 100% FPL, típicamente $0-25 por visita según los reportes UDS de HRSA. Para income entre 100-200% FPL, $25-50. Para income más alto, paga más cerca de la tarifa completa pero todavía sub-mercado. No hay copay para servicios preventivos.",
    },
    {
      q: "¿Cómo encuentro una FQHC cerca de mi casa?",
      a: "Usá findahealthcenter.hrsa.gov, ingresá tu ZIP code, y te muestra los centros cercanos con sus servicios y horarios. La mayoría de FQHCs en zonas Hispanas tienen personal bilingüe y servicios en español.",
    },
    {
      q: "¿Qué es Emergency Medicaid y cómo aplico?",
      a: "Emergency Medicaid cubre emergencias médicas (parto, accidentes, condiciones que ponen en peligro la vida) para personas sin documentos. El hospital te ayuda a aplicar después del evento — no hay que aplicar antes. La aplicación va al departamento estatal de Medicaid. En FL es DCF, en TX es HHSC.",
    },
    {
      q: "¿Qué es Charity Care y cómo pido reducción de mi factura hospitalaria?",
      a: "Los hospitales sin fines de lucro están obligados por IRS 501(r) a tener política de caridad. Pedí 'Financial Assistance Application' o 'Charity Care' al billing department del hospital. Llevá comprobante de income (paystubs, tax return) y la factura. Pueden reducir 50-100% si estás debajo del 200% FPL.",
    },
    {
      q: "¿Mis hijos US-citizen califican para Medicaid o CHIP aunque yo no?",
      a: "Sí. Los niños ciudadanos americanos de padres indocumentados califican para Medicaid o CHIP según el income familiar y el estado. Esto es altamente subutilizado — millones de niños elegibles no están enrolados porque los padres tienen miedo de aplicar. Aplicar a Medicaid/CHIP para tus hijos US-citizen no afecta tu estatus migratorio y no es 'public charge' para ellos.",
    },
  ],
  ctaProduct: "auto",
  topNotice: <AcaDisclaimer position="top" />,
  bottomNotice: <AcaDisclaimer position="bottom" />,
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
