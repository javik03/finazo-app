import type { Metadata } from "next";
import { ClusterLanding, type ClusterCopy } from "@/components/us/cluster/ClusterLanding";
import { AcaDisclaimer } from "@/components/us/aca/AcaDisclaimer";

export const revalidate = 3600;

const COPY: ClusterCopy = {
  path: "/aca-familias-mixtas",
  shortName: "Familias mixed-status (ACA)",
  h1: "Familias mixed-status: cómo enrolar a los miembros que califican en ACA 2026",
  metaTitle: "Familias mixed-status ACA — enrolar miembros elegibles 2026 | Finazo",
  metaDescription:
    "Cómo enrolar a los miembros de tu familia que SÍ califican para ACA cuando hay mixed-status migratorio. Subsidio se calcula sobre income familiar, no individual.",
  kicker: "ACA · Familias mixed-status",
  lead: [
    "Una 'familia mixed-status' es la situación donde algunos miembros del hogar tienen estatus migratorio que califica para ACA (ciudadanos US, residentes permanentes, asilados, etc.) y otros no (indocumentados, ciertos visa-holders, etc.). Esto es extremadamente común en hogares Hispanos — y altamente subutilizado en el Marketplace.",
    "El error más común: la familia asume que como el padre o madre indocumentado no califica, nadie califica. No es así. Los miembros elegibles pueden enrolarse en Marketplace y recibir subsidios calculados sobre el income del tax-filing-unit completo.",
  ],
  articleSlugIncludes: ["mixed-status", "familias-mixtas", "ninos-citizen"],
  realDataBlock: {
    title: "Hogares mixed-status en EE.UU. — datos demográficos 2026",
    body:
      "Según el Migration Policy Institute, en 2023 había aproximadamente 16.7 millones de personas viviendo en hogares mixed-status en EE.UU., incluyendo 5.9 millones de niños ciudadanos americanos con al menos un padre indocumentado. KFF estima que más del 60% de los niños US-citizen elegibles para Medicaid/CHIP en hogares mixed-status NO están enrolados — usualmente por miedo de los padres a que afecte su estatus migratorio (no lo hace).",
    sourceLabel: "Migration Policy Institute — Mixed-Status Family Estimates",
    sourceUrl: "https://www.migrationpolicy.org/research",
  },
  keyPoints: [
    {
      eyebrow: "PRINCIPIO",
      title: "Los elegibles SÍ pueden enrolarse",
      body: "La elegibilidad ACA se evalúa individuo por individuo. Si vos no calificás pero tu cónyuge o hijos sí, ellos pueden enrolarse en Marketplace. La familia entera no queda fuera por un miembro inelegible.",
    },
    {
      eyebrow: "SUBSIDIO",
      title: "Income del tax-filing-unit completo",
      body: "El subsidio se calcula sobre el Modified Adjusted Gross Income de toda la familia (incluyendo income del miembro inelegible). Por eso es importante reportar income honestamente — afecta el subsidio de los miembros elegibles.",
    },
    {
      eyebrow: "PUBLIC CHARGE",
      title: "Enrolar a tus hijos NO es public charge",
      body: "Bajo la regla actual (2022), enrolar a tus hijos en Medicaid/CHIP no cuenta como 'public charge' contra ellos en su futuro. Tampoco contra los padres en aplicaciones migratorias. Solo cash assistance y long-term care institucional cuentan.",
    },
  ],
  faqs: [
    {
      q: "¿Si yo soy indocumentado pero mis hijos son US-citizen, califican mis hijos para Medicaid en 2026?",
      a: "Sí. Los niños US-citizen califican para Medicaid o CHIP según el income familiar y el estado, sin importar el estatus migratorio de los padres. En 2026 más del 60% de niños US-citizen elegibles en hogares mixed-status NO están enrolados — usualmente por miedo infundado al public charge.",
    },
    {
      q: "¿Aplicar a Medicaid para mis hijos afecta mi proceso migratorio?",
      a: "No. Bajo la regla de Public Charge vigente desde 2022, recibir Medicaid o CHIP para tus hijos US-citizen no cuenta contra los padres en cualquier aplicación migratoria. Solo cash assistance (TANF, SSI) y long-term care institucional financiado por Medicaid cuentan — y aún esos no aplican retroactivamente.",
    },
    {
      q: "¿Mi cónyuge residente permanente puede enrolarse en Marketplace si yo soy indocumentado?",
      a: "Sí. Tu cónyuge LPR califica para Marketplace + subsidios, calculados sobre el income del tax-filing-unit completo (incluyendo el tuyo si filean conjuntos). Vos no te enrolás, pero tu cónyuge sí. El subsidio puede ser materialmente más alto si tu income es modesto.",
    },
    {
      q: "¿Cómo aplico al Marketplace para algunos miembros pero no todos?",
      a: "Cuando aplicás en Healthcare.gov, indicás cuáles miembros del hogar buscan cobertura y cuáles no. Para los que no buscan cobertura (porque no califican), Healthcare.gov no les pide documentación migratoria. Solo verifica el estatus de los que sí están aplicando.",
    },
    {
      q: "¿El income que reporto incluye el income del miembro indocumentado?",
      a: "Sí, si está en el mismo tax-filing-unit. El Modified Adjusted Gross Income (MAGI) se calcula sobre toda la familia que filea junta. Es importante reportar honestamente — afecta el subsidio de los miembros elegibles. El income reportado no se comparte con USCIS para propósitos migratorios.",
    },
    {
      q: "¿Mis hijos US-citizen también califican para CHIP si no califican para Medicaid?",
      a: "Sí. CHIP (Children's Health Insurance Program) extiende la cobertura a niños cuyas familias tienen income demasiado alto para Medicaid pero demasiado bajo para pagar seguro comercial — típicamente hasta 200-300% FPL según el estado. La aplicación es la misma que para Medicaid; el sistema te asigna al programa correcto.",
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
