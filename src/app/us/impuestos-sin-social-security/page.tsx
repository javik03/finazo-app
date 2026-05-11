import type { Metadata } from "next";
import { ClusterLanding, type ClusterCopy } from "@/components/us/cluster/ClusterLanding";

export const revalidate = 3600;

const COPY: ClusterCopy = {
  path: "/impuestos-sin-social-security",
  shortName: "Impuestos sin Social Security",
  h1: "Declarar impuestos sin Social Security en EE.UU. en 2026: guía completa",
  metaTitle: "Declarar impuestos sin Social Security — ITIN, W-7, refund 2026 | Finazo",
  metaDescription:
    "Cómo declarar impuestos en EE.UU. sin Social Security en 2026. Sacar ITIN con Form W-7, créditos que sí aplican, errores caros, cómo recibir tu refund.",
  kicker: "Fiscal · Sin SSN",
  lead: [
    "No tener Social Security no te exime de declarar impuestos en Estados Unidos — al contrario, declarar es lo que justifica tu presencia económica y construye historial fiscal útil para futuras peticiones migratorias, hipotecas y crédito. Lo que reemplaza al SSN es el ITIN, un número que emite el IRS específicamente para gente sin Social Security.",
    "Esta guía cubre cómo sacar ITIN con el Form W-7 si todavía no lo tenés, qué créditos sí aplican sin SSN (Child Tax Credit, American Opportunity, Premium Tax Credit del ACA), y los errores más comunes que hacen que el IRS retenga tu refund.",
  ],
  articleSlugIncludes: ["itin", "tax", "w-7", "impuestos", "sin-social-security", "sin-ssn", "que-es-w9"],
  realDataBlock: {
    title: "Créditos fiscales aplicables a contribuyentes sin SSN en 2026",
    body:
      "Según la IRS Publication 519 (US Tax Guide for Aliens) y la Publication 972 (Child Tax Credit), los contribuyentes que declaran con ITIN (en vez de SSN) pueden reclamar: Child Tax Credit cuando los hijos tienen SSN (hasta $2,000 por hijo), Credit for Other Dependents ($500 por dependiente), American Opportunity Credit (educación universitaria), y Premium Tax Credit del ACA si están legalmente presentes. El Earned Income Tax Credit (EITC) NO está disponible sin SSN.",
    sourceLabel: "IRS Publication 519 — US Tax Guide for Aliens",
    sourceUrl: "https://www.irs.gov/forms-pubs/about-publication-519",
  },
  keyPoints: [
    {
      eyebrow: "ITIN",
      title: "Form W-7 paso a paso",
      body: "El W-7 se presenta junto con tu primera declaración de impuestos federal o por separado si ya tenés una declaración previa. Necesitás documento de identidad (pasaporte certificado o dos documentos secundarios) y comprobante de propósito tributario.",
    },
    {
      eyebrow: "CRÉDITOS",
      title: "Lo que sí podés reclamar sin SSN",
      body: "Child Tax Credit (si tus hijos tienen SSN), Credit for Other Dependents, American Opportunity Credit, Saver's Credit, y Premium Tax Credit del ACA. NO EITC — ese requiere SSN.",
    },
    {
      eyebrow: "ERRORES",
      title: "Los que retienen tu refund",
      body: "ITIN expirado (renová cada 3 años de no uso), no reportar todos los 1099 (gig work, Uber, DoorDash), olvidar deducir millas o herramientas si sos contratista, y usar SSN ajeno o duplicado.",
    },
  ],
  faqs: [
    {
      q: "¿Tengo que declarar impuestos si no tengo Social Security en 2026?",
      a: "Sí, si tenés ingresos reportables en EE.UU. (W-2, 1099, renta, etc). Declarar con ITIN construye historial fiscal y es lo que justifica tu presencia económica — útil para futuras peticiones migratorias, hipotecas con Hogares, y crédito con la mayoría de issuers.",
    },
    {
      q: "¿Qué es ITIN y cómo se diferencia de Social Security?",
      a: "ITIN (Individual Taxpayer Identification Number) es el número de 9 dígitos que el IRS emite específicamente para gente que tiene que declarar impuestos pero no califica para Social Security. Sirve solo para impuestos y para abrir cuentas/crédito — no autoriza a trabajar y no es un Social Security alternativo.",
    },
    {
      q: "¿Cuánto cuesta sacar ITIN en 2026?",
      a: "Si enviás el W-7 al IRS directamente: $0. Si usás un Acceptance Agent (recomendado para evitar rechazos): $50-200. El IRS rechaza ~30% de los W-7 enviados solos por errores chicos — el AA revisa que esté completo antes de enviarlo.",
    },
    {
      q: "¿Puedo recibir refund sin SSN?",
      a: "Sí. Los refunds vienen igual que con SSN. Para depósito directo necesitás cuenta bancaria a tu nombre — abrir esa cuenta es el primer paso si todavía no la tenés.",
    },
    {
      q: "¿Qué pasa si no he declarado en años pasados sin Social Security?",
      a: "Podés ponerte al día con declaraciones atrasadas (back taxes). El IRS es más permisivo de lo que la gente piensa, y en muchos casos termina debiendo refund. Lo importante es no esconderte — el IRS no comparte tu información con USCIS para propósitos migratorios.",
    },
    {
      q: "¿Mi ITIN expira?",
      a: "Sí, expira si no lo usás en una declaración federal por 3 años consecutivos. La renovación es con un W-7 nuevo. Si tu ITIN está expirado al momento de declarar, el IRS retiene el refund hasta que renovés.",
    },
    {
      q: "¿Puedo reclamar Child Tax Credit sin Social Security en 2026?",
      a: "Sí, siempre y cuando tus hijos tengan SSN. El crédito es hasta $2,000 por hijo elegible. Si tus hijos también solo tienen ITIN, podés reclamar el Credit for Other Dependents ($500 por dependiente).",
    },
  ],
  ctaProduct: "auto",
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
