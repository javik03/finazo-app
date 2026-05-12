import type { Metadata } from "next";
import { ClusterLanding, type ClusterCopy } from "@/components/us/cluster/ClusterLanding";
import { AcaDisclaimer } from "@/components/us/aca/AcaDisclaimer";

export const revalidate = 3600;

const COPY: ClusterCopy = {
  path: "/aca-subsidios",
  shortName: "Subsidios ACA (Premium Tax Credit)",
  h1: "Subsidios ACA: Premium Tax Credit y Cost-Sharing Reduction 2026",
  metaTitle: "Subsidios ACA — Premium Tax Credit y CSR 2026 | Finazo",
  metaDescription:
    "Cómo calcular tu subsidio ACA (Premium Tax Credit) según ingreso familiar en 2026. CSR para Silver, FPL ranges, reconciliación de impuestos.",
  kicker: "ACA · Subsidios financieros",
  lead: [
    "El Premium Tax Credit (APTC) reduce tu prima mensual del Marketplace según tu ingreso familiar y el tamaño del hogar. La American Rescue Plan extendió los subsidios más allá del 400% del Federal Poverty Level hasta el plan year 2025 — verificá el estado de extensión para 2026 en Healthcare.gov.",
    "Esta guía cubre cómo se calcula el APTC, qué es Cost-Sharing Reduction (CSR — disponible solo en planes Silver con income 100-250% FPL), y cómo se reconcilia el subsidio en tu declaración de impuestos del año siguiente.",
  ],
  articleSlugIncludes: ["subsidio", "premium-tax-credit", "aptc", "cost-sharing", "fpl"],
  realDataBlock: {
    title: "Federal Poverty Level (FPL) y rangos de subsidio 2026",
    body:
      "El FPL 2026 publicado por HHS (Department of Health and Human Services) en enero 2026 sirve para calcular los subsidios del año plan 2027. Para una persona en 48 estados continentales, el 100% FPL = $15,650/año (2026); 400% FPL = $62,600/año. Los rangos varían en Alaska y Hawaii. Familia de 4: 100% FPL = $32,150; 400% FPL = $128,600. El subsidio se calcula con tu ingreso esperado del año del plan, no del año anterior.",
    sourceLabel: "ASPE — HHS Poverty Guidelines",
    sourceUrl: "https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines",
  },
  keyPoints: [
    {
      eyebrow: "APTC",
      title: "Premium Tax Credit",
      body: "Subsidio mensual que reduce tu prima. Se calcula con tu ingreso esperado del año plan y el tamaño de tu familia. Aplicable en todos los niveles metálicos (Bronze, Silver, Gold, Platinum).",
    },
    {
      eyebrow: "CSR",
      title: "Cost-Sharing Reduction",
      body: "Reduce deducible, copay y coinsurance — disponible SOLO en planes Silver con income entre 100-250% FPL. Si calificás para CSR, Silver casi siempre te conviene aunque tenga prima mensual igual a Bronze.",
    },
    {
      eyebrow: "RECONCILIACIÓN",
      title: "Form 8962 en abril del año siguiente",
      body: "Cuando hagás taxes el año siguiente, reportás tu ingreso real con Form 8962. Si ganaste más de lo estimado, devolvés parte del subsidio. Si ganaste menos, te dan el subsidio extra.",
    },
  ],
  faqs: [
    {
      q: "¿Cómo calculo cuánto subsidio ACA me toca en 2026?",
      a: "El cálculo es: Healthcare.gov toma tu ingreso esperado del año plan + tamaño familiar + ZIP code, calcula qué porcentaje del FPL representa tu ingreso, y aplica la tabla de 'expected contribution' del IRS. La fórmula está en IRS Publication 974. La calculadora en Healthcare.gov te da el número exacto.",
    },
    {
      q: "¿Qué es 100% FPL y por qué importa?",
      a: "Federal Poverty Level es el umbral de ingreso que define elegibilidad para programas federales. En 2026, 100% FPL para una persona = $15,650 anuales. Para ACA, calificás para subsidio si tu ingreso está entre 100% y al menos 400% FPL — más allá depende de si la extensión post-2025 aplica.",
    },
    {
      q: "¿Qué pasa si gané más de lo que estimé al aplicar?",
      a: "Devolvés parte del subsidio en tu declaración de impuestos del año siguiente con Form 8962. Por eso es importante actualizar Healthcare.gov si tu income cambia durante el año — para evitar 'sorpresa' fiscal en abril.",
    },
    {
      q: "¿Cost-Sharing Reduction (CSR) solo aplica a Silver?",
      a: "Sí. CSR es exclusivo de planes Silver y solo aplica si tu income está entre 100% y 250% FPL. Por eso para muchos Hispanos de income medio-bajo, Silver con CSR es matemáticamente la mejor opción aunque la prima mensual sea similar a Bronze.",
    },
    {
      q: "¿Mi subsidio se calcula sobre el income de toda mi familia?",
      a: "Sí. Healthcare.gov usa el Modified Adjusted Gross Income (MAGI) del tax-filing-unit completo, no solo del aplicante. Eso incluye income de cónyuge, hijos que filean (rare) y dependientes. El cálculo de MAGI está detallado en IRS Publication 974.",
    },
    {
      q: "¿Puedo recibir subsidio si trabajo self-employed con 1099?",
      a: "Sí. Self-employed con 1099 califica igual que W-2. Estimás tu ingreso esperado del año plan (incluyendo ingresos 1099), y Healthcare.gov calcula el subsidio. La diferencia es que vos tenés que estimar tu ingreso — un W-2 tiene salario más predecible, un 1099 varía.",
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
