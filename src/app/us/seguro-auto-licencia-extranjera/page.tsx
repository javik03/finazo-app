import type { Metadata } from "next";
import { ClusterLanding, type ClusterCopy } from "@/components/us/cluster/ClusterLanding";

export const revalidate = 3600;

const COPY: ClusterCopy = {
  path: "/seguro-auto-licencia-extranjera",
  shortName: "Seguro de auto con licencia extranjera",
  h1: "Seguro de auto con licencia extranjera en EE.UU.: lo que aceptan las aseguradoras 2026",
  metaTitle: "Seguro auto con licencia extranjera — qué aseguradoras aceptan 2026 | Finazo",
  metaDescription:
    "Sí podés sacar seguro de auto en EE.UU. con tu licencia mexicana, salvadoreña o de cualquier país de LATAM. Lista de aseguradoras, plazos por estado, requisitos 2026.",
  kicker: "Seguros · Licencia extranjera",
  lead: [
    "Si recién llegaste a Estados Unidos y todavía manejás con tu licencia de México, El Salvador, Guatemala, Honduras o cualquier país de LATAM, esta guía cubre exactamente qué aseguradoras te emiten póliza y por cuánto tiempo es válida tu licencia extranjera mientras tramitás la estatal.",
    "Los plazos varían por estado: Florida acepta 30 días, Texas 90 días, California solo 10 días. Después de ese plazo, manejar con licencia extranjera ya no es legal — pero durante ese periodo, varias aseguradoras te emiten póliza válida.",
  ],
  articleSlugIncludes: ["licencia-extranjera", "seguro-auto"],
  realDataBlock: {
    title: "Plazos de aceptación de licencia extranjera por estado (2026)",
    body:
      "Florida acepta licencia extranjera por 30 días desde la fecha de entrada al país. Texas la acepta por 90 días. California es el más estricto: solo 10 días, después necesitás California DL o AB-60. Nueva York acepta 30 días. Estos plazos los fija el Department of Motor Vehicles de cada estado, no la aseguradora — pero las aseguradoras siguen el plazo para determinar si tu póliza es válida.",
    sourceLabel: "Department of Motor Vehicles de cada estado",
    sourceUrl: "https://www.usa.gov/state-motor-vehicle-services",
  },
  keyPoints: [
    {
      eyebrow: "PLAZOS",
      title: "Validez de tu licencia extranjera",
      body: "FL 30 días, TX 90 días, NY 30 días, CA 10 días, IL 90 días. Antes de que se venza, convertí a licencia estatal o sacá AB-60 (CA) / IDNYC (NY).",
    },
    {
      eyebrow: "ASEGURADORAS",
      title: "Las que más aceptan",
      body: "Progressive, GEICO via brokers, Direct General y Windhaven son las que más consistentemente emiten póliza durante el periodo de transición con licencia extranjera.",
    },
    {
      eyebrow: "DESPUÉS",
      title: "Cuándo convertir a licencia estatal",
      body: "Antes de que se venza el plazo de aceptación de tu estado. La conversión usualmente toma 30-60 días. Algunos estados te permiten manejar con permiso temporal mientras esperás el plástico físico.",
    },
  ],
  faqs: [
    {
      q: "¿Puedo manejar en EE.UU. con licencia mexicana en 2026?",
      a: "Sí, durante el periodo de aceptación de tu estado. Florida: 30 días, Texas: 90 días, California: 10 días, Nueva York: 30 días. Después necesitás licencia estatal o AB-60/IDNYC.",
    },
    {
      q: "¿Las aseguradoras emiten póliza con licencia extranjera?",
      a: "Sí, durante el periodo de aceptación de tu estado. Progressive, GEICO, Direct General y Windhaven son las que más consistentemente lo hacen. Las primas suelen ser un poco más altas porque no hay historial de manejo en EE.UU.",
    },
    {
      q: "¿Qué pasa si me vence el plazo y sigo manejando con licencia extranjera?",
      a: "Legalmente quedás manejando sin licencia válida según el estado, y la aseguradora puede negar el reclamo si tenés accidente. Sacá la conversión antes de que venza.",
    },
    {
      q: "¿Vale licencia internacional (IDP)?",
      a: "El International Driving Permit (IDP) traduce tu licencia pero no la reemplaza — solo es válido junto a tu licencia nacional original. Sirve para los primeros días pero el plazo de aceptación del estado sigue contando igual.",
    },
    {
      q: "¿Cómo es la conversión a licencia estatal sin Social Security?",
      a: "En California, AB-60 te permite licencia sin SSN. En Nueva York, la licencia regular ahora se emite sin SSN (Green Light Law 2019). En la mayoría de los demás estados todavía se necesita SSN o ITIN + carta de denegación de SSA.",
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
