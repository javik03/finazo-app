import type { Metadata } from "next";
import { ClusterLanding, type ClusterCopy } from "@/components/us/cluster/ClusterLanding";

export const revalidate = 3600;

const COPY: ClusterCopy = {
  path: "/banco-sin-ssn",
  shortName: "Cuenta bancaria sin SSN",
  h1: "Abrir cuenta bancaria en EE.UU. sin Social Security en 2026",
  metaTitle: "Cuenta bancaria sin SSN — bancos que aceptan ITIN, neobancos 2026 | Finazo",
  metaDescription:
    "Bancos y neobancos que aceptan ITIN sin Social Security en 2026. Chase, Bank of America, Wells Fargo, Chime, Cash App — qué te piden y qué cubre cada uno.",
  kicker: "Banking · ITIN OK",
  lead: [
    "Abrir cuenta bancaria sin SSN en Estados Unidos es legal — la Patriot Act exige identificación verificada, no específicamente un Social Security. ITIN, pasaporte, matrícula consular o IDNYC funcionan, dependiendo del banco.",
    "Esta guía cubre los bancos grandes (Chase, Bank of America, Wells Fargo) y los neobancos (Chime, Cash App, Current, Majority) que aceptan ITIN para abrir cuenta de cheques y de ahorros en 2026, y qué documentos te van a pedir según cada uno.",
  ],
  articleSlugIncludes: ["banco", "cuenta-bancaria", "sin-ssn", "sin-social-security", "neobanco"],
  realDataBlock: {
    title: "Bancos y neobancos que aceptan ITIN para abrir cuenta en 2026",
    body:
      "Según las políticas publicadas por cada institución y verificadas con clientes Hispanos en 2025-2026: Chase, Bank of America y Wells Fargo aceptan ITIN para checking y savings con verificación adicional. Citi también. TD Bank acepta ITIN solo en algunas sucursales. Entre neobancos: Chime (Spending Account con ITIN o pasaporte), Cash App (con cualquier ID gubernamental), Current, y Majority (pensado para inmigrantes, $5.99/mes pero incluye llamadas internacionales).",
    sourceLabel: "FDIC — Considerations for Banking the Unbanked",
    sourceUrl: "https://www.fdic.gov/analysis/household-survey/",
  },
  keyPoints: [
    {
      eyebrow: "BANCOS GRANDES",
      title: "Chase, BofA, Wells Fargo",
      body: "Aceptan ITIN o pasaporte para abrir checking. Necesitás presentarte en persona la primera vez. Algunas sucursales son más bilingües que otras — Miami, Houston, LA tienen las mejores.",
    },
    {
      eyebrow: "NEOBANCOS",
      title: "Chime, Cash App, Current",
      body: "Aplicás desde el celular en 5-10 minutos. No tienen sucursal física pero todo el servicio es bilingüe. Chime tiene Credit Builder integrado que reporta a las tres bureaus.",
    },
    {
      eyebrow: "DOCUMENTOS",
      title: "Lo que casi siempre te piden",
      body: "Un documento de identidad gubernamental (ITIN del IRS, pasaporte, matrícula consular, o IDNYC), comprobante de domicilio (utility bill o lease), y depósito inicial de $25-100 en bancos grandes (los neobancos suelen ser $0).",
    },
  ],
  faqs: [
    {
      q: "¿Es legal abrir cuenta bancaria sin SSN en 2026?",
      a: "Sí. La Patriot Act exige identificación verificada pero no específicamente SSN. ITIN, pasaporte, matrícula consular o IDNYC son aceptados por la mayoría de bancos. La regulación es bancaria, no migratoria.",
    },
    {
      q: "¿Qué bancos grandes aceptan ITIN?",
      a: "Chase, Bank of America, Wells Fargo, Citi y TD Bank (en algunas sucursales) aceptan ITIN para abrir cuenta de cheques y ahorros. La primera vez tenés que ir en persona; después podés operar todo desde la app.",
    },
    {
      q: "¿Chime acepta ITIN para abrir Spending Account?",
      a: "Sí. Chime acepta ITIN o pasaporte para abrir Spending Account. La aplicación es desde el celular, toma 5-10 minutos. Chime también tiene Credit Builder, una cuenta de crédito que reporta a las tres bureaus sin depósito tradicional.",
    },
    {
      q: "¿Cuál cuenta es mejor para empezar a construir crédito?",
      a: "Si tu prioridad es construir credit, Chime Credit Builder es la opción más simple — viene con la cuenta bancaria sin annual fee. Si querés banco tradicional, Discover it Secured se asocia con cualquier cuenta bancaria y reporta también.",
    },
    {
      q: "¿Puedo recibir mi paycheck en una cuenta con ITIN?",
      a: "Sí. Tu empleador deposita en cualquier cuenta válida con número de routing y account. ITIN no afecta direct deposit — afecta la declaración de impuestos pero no la mecánica del depósito.",
    },
    {
      q: "¿Qué es Majority y por qué cobra $5.99/mes?",
      a: "Majority es un neobanco específicamente diseñado para inmigrantes. Cobra $5.99/mes pero incluye: llamadas internacionales ilimitadas, remesas gratis a 25+ países, tarjeta sin foreign transaction fees, y servicio al cliente 100% en español. Si mandás dinero a casa con frecuencia, suele salir más barato que pagar las comisiones de los bancos.",
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
