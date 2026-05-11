import type { Metadata } from "next";
import { ClusterLanding, type ClusterCopy } from "@/components/us/cluster/ClusterLanding";

export const revalidate = 3600;

const COPY: ClusterCopy = {
  path: "/seguro-auto-sin-social-security",
  shortName: "Seguro de auto sin Social Security",
  h1: "Seguro de auto sin Social Security en EE.UU.: aseguradoras que sí aceptan 2026",
  metaTitle: "Seguro de auto sin Social Security — aseguradoras que aceptan ITIN 2026 | Finazo",
  metaDescription:
    "Sí podés sacar seguro de auto en EE.UU. sin Social Security. Las 4 aseguradoras que aceptan ITIN, pasaporte o matrícula consular en 2026. Tarifas reales por estado.",
  kicker: "Seguros · Sin SSN",
  lead: [
    "No tener Social Security no te deja fuera del mercado de seguro de auto en Estados Unidos. Cuatro aseguradoras nacionales emiten póliza con ITIN, pasaporte o matrícula consular, y un broker bilingüe te conecta con las que aceptan tu situación migratoria específica en 90 segundos por WhatsApp.",
    "Esta guía cubre las aseguradoras concretas que aceptan conductores sin SSN, las tarifas promedio recientes según los rate filings públicos de las DOIs estatales, y los documentos que tenés que llevar para sacar póliza válida en cualquier estado.",
  ],
  articleSlugIncludes: ["seguro-auto", "sin-social-security", "sin-ssn", "itin"],
  realDataBlock: {
    title: "Tarifas promedio para conductores sin Social Security en 2025",
    body:
      "Según los Personal Auto rate filings publicados por las DOIs estatales, las primas anuales promedio para conductores sin SSN (con ITIN o licencia extranjera) entre 25-50 años con historial limpio están entre $1,440 (Carolina del Norte) y $3,240 (Florida) en 2025. La variación responde al ZIP code, vehículo y deductible — Cubierto cotiza con 8+ aseguradoras para encontrar la mejor combinación para tu situación específica.",
    sourceLabel: "Florida OIR + Texas TDI rate filings públicos 2025",
    sourceUrl: "https://www.floir.com/",
  },
  keyPoints: [
    {
      eyebrow: "ELEGIBILIDAD",
      title: "Sí podés sacar seguro sin SSN",
      body: "Las aseguradoras no exigen Social Security para emitir póliza. El criterio real es: licencia válida (estatal, AB-60 en CA, IDNYC en NY, o extranjera durante periodo de transición) y comprobante de residencia.",
    },
    {
      eyebrow: "ASEGURADORAS",
      title: "Cuatro grandes aceptan sin SSN consistentemente",
      body: "Progressive, GEICO (via brokerage hispano), Direct General y Bristol West son las cuatro que aparecen consistentemente en los rate filings con apetito por conductores sin SSN. Hay más, pero estas son las grandes.",
    },
    {
      eyebrow: "DOCUMENTOS",
      title: "Lo que necesitás llevar",
      body: "ITIN del IRS si lo tenés (o pasaporte / matrícula consular), licencia (estatal, AB-60, IDNYC, o extranjera reciente), comprobante de domicilio (utility bill / lease), VIN del vehículo, y prueba de propiedad del carro.",
    },
  ],
  faqs: [
    {
      q: "¿Necesito Social Security para sacar seguro de auto en EE.UU. en 2026?",
      a: "No. Ningún estado exige SSN para emitir póliza de seguro de auto. La mayoría de aseguradoras grandes aceptan ITIN, número de pasaporte o licencia consular como identificación.",
    },
    {
      q: "¿Cuáles aseguradoras aceptan conductores sin SSN en 2026?",
      a: "Progressive, GEICO, Direct General, Bristol West, Infinity y Windhaven son las que aparecen con más frecuencia en los rate filings con apetito por conductores sin Social Security. Cubierto cotiza con todas ellas simultáneamente.",
    },
    {
      q: "¿Pago más caro por no tener Social Security?",
      a: "No necesariamente por la falta de SSN en sí. El sobrecosto típico viene del 'thin file' — pocos años de historial de manejo en EE.UU., crédito limitado, etc. Una vez tengás 2-3 años de manejo limpio y empieces a construir credit, la prima baja.",
    },
    {
      q: "¿Qué hago si recién llegué y no tengo licencia americana todavía?",
      a: "La mayoría de estados aceptan tu licencia extranjera por 30-90 días después de tu llegada. Mientras convertís a licencia estatal podés tener seguro válido con tu licencia de origen. Florida acepta 30 días, Texas 90, California 10 días.",
    },
    {
      q: "¿California es diferente para conductores sin SSN?",
      a: "Sí, en dos aspectos: (1) California prohíbe a las aseguradoras usar credit score para calcular prima — eso ayuda a conductores nuevos sin historial crediticio largo. (2) La licencia AB-60 (sin SSN) es aceptada por aseguradoras igual que la licencia regular.",
    },
    {
      q: "¿Qué es ITIN y por qué lo mencionamos?",
      a: "ITIN (Individual Taxpayer Identification Number) es el número que emite el IRS para gente que tiene que declarar impuestos pero no califica para Social Security. Muchas aseguradoras lo aceptan como identificación. Pero NO hace falta tener ITIN para sacar seguro — pasaporte o matrícula consular también funcionan en la mayoría de casos.",
    },
  ],
  ctaProduct: "auto",
};

export const metadata: Metadata = {
  title: COPY.metaTitle,
  description: COPY.metaDescription,
  alternates: { canonical: `https://finazo.us${COPY.path}` },
  openGraph: {
    title: COPY.h1,
    description: COPY.metaDescription,
    url: `https://finazo.us${COPY.path}`,
    locale: "es_US",
    type: "website",
  },
};

export default async function Page(): Promise<React.ReactElement> {
  return <ClusterLanding copy={COPY} />;
}
