import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getUsLoanProducts } from "@/lib/queries/us-loans";

export const revalidate = 604800; // 7 days

const STATE_DATA: Record<string, {
  name: string;
  nameEs: string;
  abbr: string;
  population: string;
  hispanicPct: string;
  avgIncome: string;
  maxLoanable: string;
  topCities: string[];
  localNote: string;
  itinNote: string;
}> = {
  california: {
    name: "California",
    nameEs: "California",
    abbr: "CA",
    population: "39.5 millones",
    hispanicPct: "40%",
    avgIncome: "$47,000",
    maxLoanable: "$100,000",
    topCities: ["Los Ángeles", "San José", "Fresno", "San Diego", "Riverside"],
    localNote: "California tiene protecciones al consumidor entre las más fuertes del país. La tasa de interés máxima para préstamos de $2,500-$10,000 es limitada por ley (CFL). Para préstamos menores a $300,000, se requiere licencia del DFPI.",
    itinNote: "California tiene la mayor concentración de hispanos del país. Varias credit unions locales como Arrowhead CU y Self-Help FCU ofrecen préstamos con ITIN en el área de Los Ángeles y el Valle Central.",
  },
  texas: {
    name: "Texas",
    nameEs: "Texas",
    abbr: "TX",
    population: "30 millones",
    hispanicPct: "40%",
    avgIncome: "$42,000",
    maxLoanable: "$Ilimitado",
    topCities: ["Houston", "San Antonio", "Dallas", "El Paso", "Laredo"],
    localNote: "Texas no tiene topes de tasa de interés estatales — usa la ley federal. OppFi y Avant operan fuertemente en Texas. San Antonio y El Paso tienen alta concentración de CDFIs orientados a la comunidad hispana.",
    itinNote: "El Paso, Laredo y el Valle del Río Grande tienen alta demanda de préstamos con ITIN. Accion Texas (ahora Accion Opportunity Fund) es el prestamista comunitario más activo en el estado con opciones ITIN.",
  },
  florida: {
    name: "Florida",
    nameEs: "Florida",
    abbr: "FL",
    population: "22 millones",
    hispanicPct: "27%",
    avgIncome: "$40,000",
    maxLoanable: "$Ilimitado",
    topCities: ["Miami", "Orlando", "Tampa", "Hialeah", "Jacksonville"],
    localNote: "Florida tiene alta concentración de hispanos del Caribe (cubanos, puertorriqueños) y centroamericanos. Miami es uno de los mercados de préstamos más competitivos del país. Muchas aseguradoras y prestamistas tienen oficinas bilingües en Miami-Dade.",
    itinNote: "Miami-Dade tiene varias instituciones financieras con servicio completo en español. Bancos comunitarios como Amerant Bank y City National Bank of Florida atienden a la comunidad cubano-americana con opciones más flexibles.",
  },
  "nueva-york": {
    name: "Nueva York",
    nameEs: "Nueva York",
    abbr: "NY",
    population: "20 millones",
    hispanicPct: "19%",
    avgIncome: "$48,000",
    maxLoanable: "$Ilimitado",
    topCities: ["Nueva York (NYC)", "El Bronx", "Corona (Queens)", "Brooklyn", "Yonkers"],
    localNote: "Nueva York tiene el Departamento de Servicios Financieros (DFS) con regulación estricta. Los prestamistas deben tener licencia estatal. Los hispanos en NYC son principalmente de República Dominicana, Puerto Rico y México.",
    itinNote: "Lower East Side People's Federal Credit Union y BRT Realty Trust son opciones comunitarias en NYC. Bronx es el distrito con mayor concentración de préstamos ITIN en el noreste del país.",
  },
  illinois: {
    name: "Illinois",
    nameEs: "Illinois",
    abbr: "IL",
    population: "12.6 millones",
    hispanicPct: "18%",
    avgIncome: "$44,000",
    maxLoanable: "$Ilimitado",
    topCities: ["Chicago", "Aurora", "Elgin", "Joliet", "Cicero"],
    localNote: "Illinois tiene el Illinois Predatory Loan Prevention Act que limita tasas al 36% APR máximo. Esto protege a comunidades vulnerables pero reduce opciones para personas sin historial.",
    itinNote: "Pilsen y Little Village en Chicago son los centros de la comunidad mexicana. Accion Chicago y North Side Community Federal Credit Union ofrecen préstamos con ITIN en estas áreas.",
  },
  arizona: {
    name: "Arizona",
    nameEs: "Arizona",
    abbr: "AZ",
    population: "7.4 millones",
    hispanicPct: "32%",
    avgIncome: "$40,000",
    maxLoanable: "$Ilimitado",
    topCities: ["Phoenix", "Tucson", "Mesa", "Chandler", "Glendale"],
    localNote: "Arizona limita APR en préstamos de pequeñas cantidades pero no tiene tope general. Phoenix es el 6to mercado de préstamos más grande del país. La comunidad hispana representa el 32% de la población.",
    itinNote: "Chicanos Por La Causa (CPLC) en Phoenix ofrece préstamos comunitarios con ITIN. LiftFund tiene presencia en Phoenix y Tucson sirviendo a pequeños empresarios hispanos.",
  },
  "nueva-jersey": {
    name: "Nueva Jersey",
    nameEs: "Nueva Jersey",
    abbr: "NJ",
    population: "9.3 millones",
    hispanicPct: "22%",
    avgIncome: "$52,000",
    maxLoanable: "$Ilimitado",
    topCities: ["Newark", "Paterson", "Elizabeth", "Jersey City", "Perth Amboy"],
    localNote: "Nueva Jersey limita APR al 30% para prestamistas no bancarios. Paterson tiene alta concentración de dominicanos; Elizabeth y Perth Amboy de ecuatorianos y centroamericanos.",
    itinNote: "New Jersey Community Capital y Cooperative Business Assistance Corp (CoBAC) atienden a empresarios hispanos con ITIN. Elizabeth Development Company tiene programas en español.",
  },
  colorado: {
    name: "Colorado",
    nameEs: "Colorado",
    abbr: "CO",
    population: "5.8 millones",
    hispanicPct: "22%",
    avgIncome: "$46,000",
    maxLoanable: "$Ilimitado",
    topCities: ["Denver", "Aurora", "Pueblo", "Colorado Springs", "Greeley"],
    localNote: "Colorado limita APR al 36% para préstamos de consumo hasta $3,000. La comunidad hispana en el sur de Colorado lleva generaciones — no todos son inmigrantes recientes.",
    itinNote: "Justine PETERSEN y Adelante Community Development Corp tienen programas de préstamo con ITIN en el área de Denver. Centro San Juan Diego ofrece recursos financieros en español.",
  },
  "nuevo-mexico": {
    name: "Nuevo México",
    nameEs: "Nuevo México",
    abbr: "NM",
    population: "2.1 millones",
    hispanicPct: "47%",
    avgIncome: "$36,000",
    maxLoanable: "$Ilimitado",
    topCities: ["Albuquerque", "Las Cruces", "Santa Fe", "Roswell", "Farmington"],
    localNote: "Nuevo México tiene el mayor porcentaje de hispanos del país (47%). El estado limitó APR de préstamos al 36% en 2023. Muchos hispanos en NM son de familias establecidas por generaciones — opciones comunitarias son abundantes.",
    itinNote: "New Mexico Community Capital y WESST Corp ofrecen préstamos empresariales con ITIN. Accion tiene fuerte presencia en Albuquerque y Las Cruces.",
  },
  nevada: {
    name: "Nevada",
    nameEs: "Nevada",
    abbr: "NV",
    population: "3.2 millones",
    hispanicPct: "28%",
    avgIncome: "$41,000",
    maxLoanable: "$Ilimitado",
    topCities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"],
    localNote: "Nevada no tiene topes de tasa de interés estatales para préstamos. Las Vegas tiene una de las concentraciones más altas de trabajadores hispanos en la industria hotelera y de servicios.",
    itinNote: "Nevada State Bank y Silver State Schools Credit Union atienden a comunidades hispanas en Las Vegas. Prestamistas de día de pago están muy presentes — preferir opciones de CDFI para tasas razonables.",
  },
};

type Props = {
  params: Promise<{ estado: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { estado } = await params;
  const data = STATE_DATA[estado];

  if (!data) {
    return { title: "Estado no encontrado | Finazo" };
  }

  return {
    title: `Préstamos Personales para Hispanos en ${data.name} — Compara APRs 2025 | Finazo`,
    description: `Compara préstamos personales en ${data.name} para hispanos. APRs desde 7.49%, opciones con ITIN sin SSN. Información en español para la comunidad hispana de ${data.name}.`,
    alternates: {
      canonical: `https://finazo.lat/us/prestamos/${estado}`,
      languages: {
        "es-US": `https://finazo.lat/us/prestamos/${estado}`,
        "x-default": `https://finazo.lat/us/prestamos/${estado}`,
      },
    },
    openGraph: {
      title: `Préstamos para Hispanos en ${data.name} | Finazo`,
      description: `Las mejores opciones de préstamo personal para la comunidad hispana en ${data.name}. Con ITIN o SSN.`,
      url: `https://finazo.lat/us/prestamos/${estado}`,
      locale: "es_US",
    },
  };
}

export function generateStaticParams() {
  return Object.keys(STATE_DATA).map((estado) => ({ estado }));
}

type Lender = {
  provider: string;
  aprMin: string;
  aprMax: string;
  amountMin: string;
  amountMax: string;
  termMinMonths: number;
  termMaxMonths: number;
  minCreditScore: number | null;
  acceptsItin: boolean;
  productName: string;
  fundingDays: number | null;
};

const STATIC_LENDERS: Lender[] = [
  { provider: "SoFi", aprMin: "8.99", aprMax: "29.49", amountMin: "5000", amountMax: "100000", termMinMonths: 24, termMaxMonths: 84, minCreditScore: 680, acceptsItin: false, productName: "Préstamo Personal SoFi", fundingDays: 3 },
  { provider: "LightStream", aprMin: "7.49", aprMax: "25.49", amountMin: "5000", amountMax: "100000", termMinMonths: 24, termMaxMonths: 144, minCreditScore: 660, acceptsItin: false, productName: "Préstamo Personal LightStream", fundingDays: 1 },
  { provider: "Upgrade", aprMin: "9.99", aprMax: "35.99", amountMin: "1000", amountMax: "50000", termMinMonths: 24, termMaxMonths: 84, minCreditScore: 580, acceptsItin: true, productName: "Préstamo Personal Upgrade", fundingDays: 4 },
  { provider: "Avant", aprMin: "9.95", aprMax: "35.99", amountMin: "2000", amountMax: "35000", termMinMonths: 12, termMaxMonths: 60, minCreditScore: 550, acceptsItin: false, productName: "Préstamo Personal Avant", fundingDays: 2 },
  { provider: "Self Financial", aprMin: "15.65", aprMax: "15.97", amountMin: "600", amountMax: "1800", termMinMonths: 12, termMaxMonths: 24, minCreditScore: null, acceptsItin: true, productName: "Credit Builder Loan", fundingDays: null },
  { provider: "Accion Opportunity Fund", aprMin: "8.49", aprMax: "24.99", amountMin: "5000", amountMax: "250000", termMinMonths: 12, termMaxMonths: 60, minCreditScore: null, acceptsItin: true, productName: "Préstamo Empresarial / Personal", fundingDays: 14 },
];

export default async function UsPrestamoEstadoPage({ params }: Props) {
  const { estado } = await params;
  const stateData = STATE_DATA[estado];

  if (!stateData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Estado no encontrado</h1>
            <Link href="/us/prestamos" className="text-emerald-600 hover:underline">Ver todos los préstamos</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  let lenders: Lender[] = STATIC_LENDERS;
  try {
    const dbLenders = await getUsLoanProducts("personal");
    if (dbLenders.length > 0) {
      lenders = dbLenders.map((l) => ({
        provider: l.provider,
        aprMin: l.aprMin ?? "0",
        aprMax: l.aprMax ?? "0",
        amountMin: l.amountMin ?? "0",
        amountMax: l.amountMax ?? "0",
        termMinMonths: l.termMinMonths ?? 0,
        termMaxMonths: l.termMaxMonths ?? 0,
        minCreditScore: l.minCreditScore,
        acceptsItin: l.acceptsItin ?? false,
        productName: l.productName,
        fundingDays: l.fundingDays,
      }));
    }
  } catch {
    // use static fallback
  }

  const sortedLenders = [...lenders].sort((a, b) => parseFloat(a.aprMin) - parseFloat(b.aprMin));

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://finazo.lat" },
      { "@type": "ListItem", position: 2, name: "EE.UU.", item: "https://finazo.lat/us" },
      { "@type": "ListItem", position: 3, name: "Préstamos", item: "https://finazo.lat/us/prestamos" },
      { "@type": "ListItem", position: 4, name: stateData.name, item: `https://finazo.lat/us/prestamos/${estado}` },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Dónde pueden obtener préstamos los hispanos en ${stateData.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los hispanos en ${stateData.name} pueden obtener préstamos de: (1) prestamistas en línea como Upgrade, SoFi y LightStream — algunos aceptan ITIN; (2) credit unions locales que sirven a la comunidad hispana en ${stateData.topCities[0]} y ${stateData.topCities[1]}; (3) CDFIs (Instituciones de Desarrollo Financiero Comunitario) como Accion Opportunity Fund que ofrecen préstamos con requisitos flexibles. ${stateData.itinNote}`,
        },
      },
      {
        "@type": "Question",
        name: `¿Qué APR promedio tienen los préstamos personales en ${stateData.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `En ${stateData.name}, los APRs para préstamos personales van desde 7.49% para personas con excelente crédito (740+) hasta 35.99% para personas con crédito regular (550-620). El ingreso promedio en ${stateData.name} es de ${stateData.avgIncome}/año. Con score 670+ y empleo estable, puedes esperar APRs entre 10-18%.`,
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />
      <main className="min-h-screen bg-slate-50">

        <div className="bg-white border-b border-slate-200">
          <div className="mx-auto max-w-5xl px-6 py-3 text-sm text-slate-500">
            <Link href="/" className="hover:text-emerald-600">Inicio</Link>
            {" / "}
            <Link href="/us" className="hover:text-emerald-600">EE.UU.</Link>
            {" / "}
            <Link href="/us/prestamos" className="hover:text-emerald-600">Préstamos</Link>
            {" / "}
            <span className="text-slate-800 font-medium">{stateData.name}</span>
          </div>
        </div>

        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-6 py-12">
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200 mb-4">
              {stateData.abbr} · Datos 2025
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Préstamos personales para hispanos en {stateData.name}
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Compara las mejores opciones de préstamo para la comunidad hispana en {stateData.name}.
              Incluye prestamistas que aceptan ITIN sin necesidad de SSN.
            </p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
                <div className="text-lg font-bold text-slate-900">{stateData.hispanicPct}</div>
                <div className="text-xs text-slate-500">Población hispana</div>
              </div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
                <div className="text-lg font-bold text-slate-900">{stateData.population}</div>
                <div className="text-xs text-slate-500">Población total</div>
              </div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
                <div className="text-lg font-bold text-slate-900">{stateData.avgIncome}</div>
                <div className="text-xs text-slate-500">Ingreso promedio</div>
              </div>
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
                <div className="text-lg font-bold text-slate-900">desde 7.49%</div>
                <div className="text-xs text-slate-500">APR mínimo</div>
              </div>
            </div>
          </div>
        </section>

        {/* State-specific note */}
        <section className="mx-auto max-w-5xl px-6 py-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h2 className="font-semibold text-blue-900 mb-2">
              Contexto de préstamos en {stateData.name}
            </h2>
            <p className="text-sm text-blue-800 leading-relaxed">{stateData.localNote}</p>
          </div>
        </section>

        {/* Lenders table */}
        <section className="mx-auto max-w-5xl px-6 py-4">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Comparación de prestamistas disponibles en {stateData.abbr}
          </h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Prestamista</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">APR</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Monto</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Score mín.</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">ITIN</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Depósito</th>
                </tr>
              </thead>
              <tbody>
                {sortedLenders.map((lender, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{lender.provider}</div>
                      <div className="text-xs text-slate-400">{lender.productName}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-900">{lender.aprMin}%</span>
                      <span className="text-slate-400"> – {lender.aprMax}%</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      ${parseInt(lender.amountMin).toLocaleString()} – ${parseInt(lender.amountMax).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {lender.minCreditScore ? lender.minCreditScore : <span className="text-emerald-600 text-xs">Sin mínimo</span>}
                    </td>
                    <td className="px-4 py-3">
                      {lender.acceptsItin ? (
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Sí</span>
                      ) : (
                        <span className="text-xs text-slate-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {lender.fundingDays ? `${lender.fundingDays} días` : "Variable"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ITIN note */}
        <section className="mx-auto max-w-5xl px-6 py-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <h2 className="font-semibold text-emerald-900 mb-2">
              Opciones ITIN en {stateData.name}
            </h2>
            <p className="text-sm text-emerald-800 leading-relaxed">{stateData.itinNote}</p>
          </div>
        </section>

        {/* Cities */}
        <section className="mx-auto max-w-5xl px-6 py-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Principales ciudades con comunidad hispana en {stateData.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {stateData.topCities.map((city) => (
              <span key={city} className="inline-block bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700">
                {city}
              </span>
            ))}
          </div>
        </section>

        {/* Other states */}
        <section className="mx-auto max-w-5xl px-6 pb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Ver otros estados</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(STATE_DATA)
              .filter(([slug]) => slug !== estado)
              .map(([slug, data]) => (
                <Link
                  key={slug}
                  href={`/us/prestamos/${slug}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-emerald-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <span className="text-xs text-slate-400">{data.abbr}</span>
                  {data.name}
                </Link>
              ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Preguntas frecuentes — Préstamos en {stateData.name}
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                <h3 className="font-medium text-slate-900 mb-2">{faq.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
