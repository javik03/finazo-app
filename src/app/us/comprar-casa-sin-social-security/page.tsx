import type { Metadata } from "next";
import { ClusterLanding, type ClusterCopy } from "@/components/us/cluster/ClusterLanding";

export const revalidate = 3600;

const COPY: ClusterCopy = {
  path: "/comprar-casa-sin-social-security",
  shortName: "Comprar casa sin Social Security",
  h1: "Comprar casa sin Social Security en EE.UU.: cómo calificar a hipoteca en 2026",
  metaTitle: "Comprar casa sin Social Security — hipoteca con ITIN 2026 | Finazo",
  metaDescription:
    "Sí se puede comprar casa en EE.UU. sin Social Security. Cómo calificar a hipoteca con ITIN o pasaporte en 2026, wholesalers activos, down payment realista, tasas reales.",
  kicker: "Hipotecas · Sin SSN",
  lead: [
    "Comprar casa sin Social Security en Estados Unidos es posible en 2026 — pero el banco tradicional no es el camino. El producto se llama 'non-QM ITIN loan' y lo emiten wholesalers especializados, no los bancos grandes. ITIN es el número del IRS que sustituye al SSN para propósitos fiscales y bancarios — y muchos wholesalers lo aceptan.",
    "Esta guía cubre los cuatro wholesalers más activos en hipotecas para gente sin SSN, los requisitos típicos, el down payment realista (10-25%), y cómo Hogares te conecta con ellos en una sola pre-calificación de 24 horas por WhatsApp.",
  ],
  articleSlugIncludes: ["hipoteca", "comprar-casa", "sin-social-security", "sin-ssn", "itin"],
  realDataBlock: {
    title: "Tasas y down payment típicos sin Social Security 2026",
    body:
      "Las hipotecas non-QM ITIN en 2026 suelen tener tasas entre 0.5% y 1.5% por encima de las hipotecas conformes Fannie/Freddie. El down payment mínimo está entre 10% y 25% según el wholesaler y el perfil del aplicante. El DTI (debt-to-income) máximo aceptado va hasta 50% en algunos wholesalers, vs 43% en conformes — eso te da más margen si tu ingreso es variable.",
    sourceLabel: "Consumer Financial Protection Bureau — non-QM loan reports",
    sourceUrl: "https://www.cfpb.gov/about-us/blog/",
  },
  keyPoints: [
    {
      eyebrow: "QUIÉN APLICA",
      title: "Tu perfil ideal sin SSN",
      body: "ITIN del IRS al día, 2 años de tax returns presentados con ese ITIN, 2 meses de bank statements, credit score 620+, y un down payment ahorrado de 10-25% del precio de la casa.",
    },
    {
      eyebrow: "WHOLESALERS",
      title: "Los cuatro activos en 2026",
      body: "ACC Mortgage (líder nacional), Citadel Servicing, Athas Capital y Newfi Lending son los wholesalers non-QM que aparecen consistentemente en cierres para compradores sin SSN según los reportes de la MBA.",
    },
    {
      eyebrow: "TIMING",
      title: "Pre-aprobación en 24-48 horas",
      body: "Una vez tengás tax returns, bank statements y credit pull, la pre-aprobación tarda 24-48 horas. El cierre completo (de oferta a llaves) suele tomar 30-45 días.",
    },
  ],
  faqs: [
    {
      q: "¿Puedo comprar casa en EE.UU. sin Social Security en 2026?",
      a: "Sí. Mediante un préstamo non-QM con un wholesaler especializado. Cuatro wholesalers grandes (ACC Mortgage, Citadel, Athas, Newfi) emiten estos préstamos a compradores sin SSN. Los bancos tradicionales generalmente no — necesitás un broker como Hogares para acceder a los wholesalers.",
    },
    {
      q: "¿Cuánto down payment necesito sin Social Security?",
      a: "Entre 10% y 25% del precio de la casa. La mayoría de wholesalers piden 15-20% para perfiles estándar. Si tu credit score es 700+ y tenés 24+ meses de tax returns con tu ITIN, podés calificar para 10-12% en algunos casos.",
    },
    {
      q: "¿Qué es ITIN y para qué sirve al comprar casa?",
      a: "ITIN (Individual Taxpayer Identification Number) es el número que el IRS emite para gente que tiene que declarar impuestos pero no califica para Social Security. Es lo que sustituye al SSN en una aplicación de hipoteca non-QM — los wholesalers especializados lo aceptan como identificación fiscal.",
    },
    {
      q: "¿Cuál es la tasa típica de una hipoteca sin SSN en 2026?",
      a: "Entre 0.5% y 1.5% por encima de la tasa conforme de Fannie/Freddie. Si la tasa conforme actual es 6.5%, esperá entre 7% y 8% para non-QM ITIN. La diferencia es el premium por riesgo non-QM, no por la falta de SSN específicamente.",
    },
    {
      q: "¿Qué documentos necesito para aplicar sin SSN?",
      a: "ITIN del IRS, 2 años de tax returns presentados con ese ITIN, 2 meses de bank statements, comprobante de empleo o ingreso (W-2, 1099, o P&L si sos self-employed), credit pull (Hogares lo corre), ID con foto, y prueba de domicilio actual.",
    },
    {
      q: "¿Sirve si soy self-employed sin W-2 ni Social Security?",
      a: "Sí. Existen bank-statement loans (12-24 meses de bank statements en vez de tax returns) y P&L loans para contratistas. La tasa es 0.5-1% más alta que un non-QM estándar pero te aprueba sin W-2 y sin SSN.",
    },
    {
      q: "¿Hogares aprueba directamente o me conecta con un wholesaler?",
      a: "Hogares es un broker — te conecta con el wholesaler que mejor se adapte a tu perfil. El wholesaler emite el préstamo. Hogares no presta plata directamente.",
    },
  ],
  ctaProduct: "mortgage",
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
