import type { Metadata } from "next";
import { ClusterLanding, type ClusterCopy } from "@/components/us/cluster/ClusterLanding";

export const revalidate = 3600;

const COPY: ClusterCopy = {
  path: "/credito-sin-social-security",
  shortName: "Crédito sin Social Security",
  h1: "Construir credit score sin Social Security: plan completo 2026",
  metaTitle: "Crédito sin Social Security — tarjetas y plan 12 meses 2026 | Finazo",
  metaDescription:
    "Cómo construir credit score desde cero sin Social Security en 2026. Tarjetas aseguradas que aceptan ITIN, credit-builder loans, plan mes por mes para llegar a 700+.",
  kicker: "Crédito · Sin SSN",
  lead: [
    "El sistema FICO no exige Social Security para emitir score. Si tenés ITIN del IRS, podés construir credit score igual que cualquier ciudadano — usando los mismos productos: tarjetas aseguradas que reportan a las tres bureaus, credit-builder loans, y disciplina mensual.",
    "Esta guía cubre el cronograma realista (de 0 a 700+ en 12 meses), las cinco tarjetas aseguradas que aceptan ITIN consistentemente, y los errores más comunes que arruinan score antes de que despegue.",
  ],
  articleSlugIncludes: ["credito", "credit-score", "tarjeta", "sin-social-security", "sin-ssn", "que-es-credit"],
  realDataBlock: {
    title: "Los 5 factores del FICO score según FICO en 2025",
    body:
      "FICO publica el peso de cada factor: Payment History (35%), Credit Utilization (30%), Age of Credit (15%), Credit Mix (10%), New Credit (10%). Para alguien que empieza desde cero sin SSN, las palancas más importantes son las dos primeras: pagar a tiempo siempre y mantener uso menor al 30% del límite. Las otras tres compounden con el tiempo.",
    sourceLabel: "myFICO — How FICO Scores Are Calculated",
    sourceUrl: "https://www.myfico.com/credit-education/whats-in-your-credit-score",
  },
  keyPoints: [
    {
      eyebrow: "TARJETAS",
      title: "Las cinco que aceptan sin SSN",
      body: "Discover it Secured, Capital One Platinum Secured, OpenSky Plus, Self Visa, y Chime Credit Builder son las cinco que aceptan ITIN (en vez de SSN) consistentemente y reportan a las tres bureaus (Experian, Equifax, TransUnion).",
    },
    {
      eyebrow: "CRONOGRAMA",
      title: "0 a 700+ en 12 meses",
      body: "Mes 1: abrir una tarjeta asegurada + un credit-builder loan. Mes 3: primer score (560-610). Mes 6: 600-650. Mes 9: 650-700. Mes 12: 700+. Funciona si no fallás ningún pago y mantenés uso bajo.",
    },
    {
      eyebrow: "ERRORES",
      title: "Los tres que arruinan score",
      body: "Pagar tarde un solo mes (-60 a -100 puntos), usar más de 30% del límite (-30 puntos por mes), abrir muchas tarjetas a la vez (cada hard pull baja 5-10 puntos).",
    },
  ],
  faqs: [
    {
      q: "¿Puedo construir credit score sin Social Security en 2026?",
      a: "Sí. El sistema FICO no requiere SSN — solo requiere que las cuentas se reporten a las tres bureaus. Las tarjetas aseguradas que aceptan ITIN (el número del IRS que sustituye al SSN) sí reportan, y construyen score igual que las regulares.",
    },
    {
      q: "¿Qué es ITIN y por qué importa para construir crédito?",
      a: "ITIN (Individual Taxpayer Identification Number) es el número que emite el IRS para gente que tiene que declarar impuestos pero no califica para Social Security. Es lo que usás en vez de SSN en la aplicación de la tarjeta asegurada. Discover, Capital One, Self, Kikoff y Chime aceptan ITIN en su flujo de aplicación.",
    },
    {
      q: "¿Cuánto tarda en aparecer mi primer score sin SSN?",
      a: "Necesitás 6 meses de historial reportado para que FICO emita score por primera vez. La mayoría de tarjetas aseguradas reportan después del primer mes de uso. Antes de los 6 meses no hay número — después aparece (típicamente entre 560-610 al principio).",
    },
    {
      q: "¿Cuál tarjeta asegurada es la mejor para empezar sin SSN?",
      a: "Discover it Secured es la opción más recomendada porque (1) acepta ITIN, (2) tiene cashback 2% en gas y restaurantes, (3) reporta a las tres bureaus, (4) se gradúa automáticamente a tarjeta unsecured después de 7 meses de buen historial, y (5) tiene $0 annual fee.",
    },
    {
      q: "¿Cuántas tarjetas debo tener al principio?",
      a: "Solo una al principio. A los 9-12 meses, cuando tu score esté en 650+, agregá una segunda para diversificar el mix de crédito. Más tarjetas al inicio no acelera el score — al contrario, abre muchos hard pulls que bajan el promedio.",
    },
    {
      q: "¿Qué es un credit-builder loan?",
      a: "Es un préstamo donde el dinero se queda en una cuenta de ahorros hasta que termines de pagar — vos no recibís plata, solo construís historial. Self y Kikoff son los más comunes, aceptan ITIN, y cuestan $25-100 al año en intereses.",
    },
    {
      q: "¿Cuándo paso de tarjeta asegurada a tarjeta regular?",
      a: "Cuando tu score llegue a 700+ y tengás 12 meses de historial sin lates. Discover y Capital One Platinum Secured se gradúan automáticamente y te devuelven el depósito. Otras tarjetas requieren que apliques a una nueva y canceles la asegurada.",
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
