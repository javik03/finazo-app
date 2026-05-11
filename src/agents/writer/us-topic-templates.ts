/**
 * US Topic Templates — programmatic topic generators.
 *
 * Each generator returns a UsContentTopic[] derived from a template × a list
 * of variables. This is how we scale from 22 hardcoded topics to ~150+
 * without writing each prompt by hand.
 *
 * The strategist consumes these via getAllProgrammaticTopics() in this file,
 * which is then merged with US_CONTENT_CALENDAR and DB-stored proposals.
 *
 * IMPORTANT: keep prompts terse and parameterized. Don't duplicate the
 * US_SEO_SUFFIX — the calendar already imports and appends it consistently.
 */

import type { UsContentTopic, UsAuthorSlug } from "./us-content-calendar";
import { US_SEO_SUFFIX } from "./us-content-calendar";

// ─── Variable lists ────────────────────────────────────────────────────────

/**
 * Top 12 US states by Hispanic population that also have meaningful auto-
 * insurance pSEO opportunity. Ordered roughly by Hispanic-resident count.
 */
const PRIORITY_STATES: Array<{
  slug: string;
  nameEs: string;
  nameEn: string;
  /** Auto-insurance minimum coverage shorthand, e.g. "30/60/25" */
  autoMinimum: string;
  /** Notable insurance regulator note used in prompts */
  insuranceNote: string;
}> = [
  { slug: "california", nameEs: "California", nameEn: "California", autoMinimum: "15/30/5", insuranceNote: "Programa CLCA para bajo ingreso" },
  { slug: "texas",      nameEs: "Texas",      nameEn: "Texas",      autoMinimum: "30/60/25", insuranceNote: "TX Transportation Code §601" },
  { slug: "florida",    nameEs: "Florida",    nameEn: "Florida",    autoMinimum: "10/20 PIP+PDL", insuranceNote: "Estado no-fault, requiere PIP" },
  { slug: "new-york",   nameEs: "Nueva York", nameEn: "New York",   autoMinimum: "25/50/10", insuranceNote: "NY DFS, requiere PIP" },
  { slug: "arizona",    nameEs: "Arizona",    nameEn: "Arizona",    autoMinimum: "25/50/15", insuranceNote: "Frontera con MX, alta demanda hispana" },
  { slug: "illinois",   nameEs: "Illinois",   nameEn: "Illinois",   autoMinimum: "25/50/20", insuranceNote: "Ofrece licencia TVDL para ITIN" },
  { slug: "new-jersey", nameEs: "Nueva Jersey", nameEn: "New Jersey", autoMinimum: "15/30/5", insuranceNote: "Estado choice no-fault" },
  { slug: "georgia",    nameEs: "Georgia",    nameEn: "Georgia",    autoMinimum: "25/50/25", insuranceNote: "Mercado en crecimiento hispano" },
  { slug: "colorado",   nameEs: "Colorado",   nameEn: "Colorado",   autoMinimum: "25/50/15", insuranceNote: "Estado at-fault, licencia ITIN OK" },
  { slug: "north-carolina", nameEs: "Carolina del Norte", nameEn: "North Carolina", autoMinimum: "30/60/25", insuranceNote: "NC Rate Bureau regula" },
  { slug: "nevada",     nameEs: "Nevada",     nameEn: "Nevada",     autoMinimum: "25/50/20", insuranceNote: "Las Vegas con alta población hispana" },
  { slug: "washington", nameEs: "Washington", nameEn: "Washington", autoMinimum: "25/50/10", insuranceNote: "Programa Cascade Care para indocumentados" },
];

/**
 * Top 12 metros by Hispanic population for ITIN mortgage + housing pSEO.
 */
const PRIORITY_CITIES: Array<{
  slug: string;
  nameEs: string;
  state: string;
  /** Median home price band used in the prompt */
  homePrice: string;
  /** Hispanic-population context for the prompt */
  context: string;
}> = [
  { slug: "houston",      nameEs: "Houston",      state: "Texas",      homePrice: "$280K–$340K", context: "45% hispano, mercado activo non-QM" },
  { slug: "los-angeles",  nameEs: "Los Ángeles",  state: "California", homePrice: "$870K+",      context: "49% hispano, alto down payment requerido" },
  { slug: "miami",        nameEs: "Miami",        state: "Florida",    homePrice: "$520K+",      context: "70% hispano, abundancia de wholesalers ITIN" },
  { slug: "dallas",       nameEs: "Dallas",       state: "Texas",      homePrice: "$340K–$400K", context: "41% hispano, ACC Mortgage activa" },
  { slug: "phoenix",      nameEs: "Phoenix",      state: "Arizona",    homePrice: "$420K+",      context: "42% hispano, mercado caliente" },
  { slug: "chicago",      nameEs: "Chicago",      state: "Illinois",   homePrice: "$320K+",      context: "Comunidad mexicana grande, opciones FHA" },
  { slug: "san-antonio",  nameEs: "San Antonio",  state: "Texas",      homePrice: "$260K+",      context: "Mayoría hispana, precios accesibles" },
  { slug: "new-york-city", nameEs: "Nueva York",  state: "New York",   homePrice: "$680K+ (boroughs)", context: "Mercado dominicano-puertorriqueño" },
  { slug: "atlanta",      nameEs: "Atlanta",      state: "Georgia",    homePrice: "$380K+",      context: "Crecimiento hispano fuerte 2020–2026" },
  { slug: "denver",       nameEs: "Denver",       state: "Colorado",   homePrice: "$560K+",      context: "Mercado moderado, licencia ITIN OK" },
  { slug: "las-vegas",    nameEs: "Las Vegas",    state: "Nevada",     homePrice: "$420K+",      context: "Mexicana-cubana, casinos como empleador" },
  { slug: "charlotte",    nameEs: "Charlotte",    state: "Carolina del Norte", homePrice: "$380K+", context: "Crecimiento hispano más rápido del Sur" },
];

/**
 * Glossary terms — high-volume informational queries.
 */
const GLOSSARY_TERMS: Array<{
  slug: string;
  term: string;
  category: UsContentTopic["category"];
  shortDef: string;
  context: string;
}> = [
  { slug: "que-es-itin",                 term: "ITIN",                  category: "educacion",  shortDef: "número de identificación fiscal del IRS para no-ciudadanos", context: "Form W-7, propósitos fiscales y crediticios" },
  { slug: "que-es-non-qm",               term: "non-QM",                category: "prestamos",  shortDef: "préstamo hipotecario que no cumple las reglas tradicionales de Fannie/Freddie", context: "Para self-employed, ITIN, bank-statement loans" },
  { slug: "que-es-dscr-loan",            term: "DSCR loan",             category: "prestamos",  shortDef: "préstamo basado en el flujo de caja del inmueble (Debt Service Coverage Ratio)", context: "Para inversionistas, no requiere tax returns" },
  { slug: "que-es-bank-statement-loan",  term: "bank statement loan",   category: "prestamos",  shortDef: "préstamo donde se verifican ingresos con bank statements en lugar de W-2", context: "Para self-employed, freelancers, contractors" },
  { slug: "que-es-fha-loan",             term: "FHA loan",              category: "prestamos",  shortDef: "préstamo asegurado por la Federal Housing Administration", context: "First-time buyer, down payment desde 3.5%" },
  { slug: "que-es-credit-score",         term: "credit score",          category: "tarjetas",   shortDef: "puntaje crediticio FICO 300-850 que evalúa tu historial", context: "Reportado por Experian, Equifax, TransUnion" },
  { slug: "que-es-secured-credit-card",  term: "secured credit card",   category: "tarjetas",   shortDef: "tarjeta respaldada por un depósito en efectivo del solicitante", context: "Para construir crédito desde cero" },
  { slug: "que-es-credit-builder-loan",  term: "credit-builder loan",   category: "tarjetas",   shortDef: "préstamo donde el dinero se mantiene en cuenta hasta que termines de pagar", context: "Self, Kikoff, Credit Strong" },
  { slug: "que-es-apr",                  term: "APR",                   category: "educacion",  shortDef: "tasa de porcentaje anual — costo total del préstamo expresado anualmente", context: "Diferente de tasa de interés nominal" },
  { slug: "que-es-aca-marketplace",      term: "ACA Marketplace",       category: "seguros",    shortDef: "el mercado federal/estatal de seguros de salud bajo el Affordable Care Act", context: "HealthCare.gov, subsidios APTC, Open Enrollment" },
  { slug: "que-es-medicaid-expansion",   term: "Medicaid expansion",    category: "seguros",    shortDef: "expansión opcional del programa Medicaid bajo el ACA hasta 138% FPL", context: "40 estados expandieron, otros no" },
  { slug: "que-es-pmi",                  term: "PMI",                   category: "prestamos",  shortDef: "Private Mortgage Insurance — seguro requerido cuando el down payment es <20%", context: "Costo mensual hasta que LTV llega a 78%" },
  { slug: "que-es-pip",                  term: "PIP",                   category: "seguros",    shortDef: "Personal Injury Protection — cobertura no-fault de gastos médicos", context: "Obligatorio en FL, NY, NJ y más" },
  { slug: "que-es-sr-22",                term: "SR-22",                 category: "seguros",    shortDef: "certificado de seguro requerido por la corte después de DUI o conducción sin seguro", context: "No es un seguro, es un papel de prueba" },
  { slug: "que-es-fpl-poverty-level",    term: "Federal Poverty Level (FPL)", category: "educacion", shortDef: "umbral de ingresos que determina elegibilidad para Medicaid, ACA, SNAP", context: "Actualizado anualmente por HHS" },
  { slug: "que-es-w9-vs-w7",             term: "W-9 vs W-7",            category: "educacion",  shortDef: "W-9 verifica TIN existente; W-7 solicita ITIN nuevo", context: "Confusión común entre Hispanos sin SSN" },
  { slug: "que-es-dti-debt-to-income",   term: "DTI (debt-to-income)",  category: "prestamos",  shortDef: "razón entre tu pago mensual de deudas y tu ingreso bruto mensual", context: "Hipoteca: máximo típico 43-50%" },
  { slug: "que-es-ltv-loan-to-value",    term: "LTV (loan-to-value)",   category: "prestamos",  shortDef: "razón entre el monto del préstamo y el valor del inmueble", context: "Determina down payment y PMI" },
  { slug: "que-es-escrow",               term: "escrow",                category: "prestamos",  shortDef: "cuenta donde el banco reserva dinero para impuestos y seguro de hogar", context: "Pagos mensuales con escrow" },
  { slug: "que-es-fafsa-itin",           term: "FAFSA con ITIN",        category: "educacion",  shortDef: "elegibilidad de ayuda financiera estudiantil para padres con ITIN sin SSN", context: "Estados con state aid programs" },
  { slug: "que-es-1099-vs-w2",           term: "1099 vs W-2",           category: "educacion",  shortDef: "1099 es ingreso de contratista independiente; W-2 es de empleo formal", context: "Implicaciones para hipoteca y crédito" },
];

/**
 * Lender / product reviews — high-intent commercial queries.
 */
const LENDER_REVIEWS: Array<{
  slug: string;
  lender: string;
  productType: string;
  category: UsContentTopic["category"];
  context: string;
}> = [
  { slug: "oportun-resena",         lender: "Oportun",         productType: "préstamo personal ITIN",  category: "prestamos",  context: "Líder en préstamos sin historial crediticio, APR 19-36%" },
  { slug: "self-financial-resena",  lender: "Self Financial",  productType: "credit-builder loan",     category: "tarjetas",   context: "Construye credit + ahorra simultáneamente, ITIN OK" },
  { slug: "kikoff-resena",          lender: "Kikoff",          productType: "credit builder line",     category: "tarjetas",   context: "$5/mes, sin hard pull, ITIN OK" },
  { slug: "chime-resena",           lender: "Chime",           productType: "banking + credit builder", category: "educacion", context: "App-only bank, sin SSN para spending account" },
  { slug: "majority-app-resena",    lender: "Majority",        productType: "banca para inmigrantes",  category: "educacion",  context: "$5.99/mes, llamadas internacionales incluidas" },
  { slug: "acc-mortgage-resena",    lender: "ACC Mortgage",    productType: "hipoteca ITIN",           category: "prestamos",  context: "Wholesaler #1 en ITIN loans, líder TX/FL/CA" },
  { slug: "arc-home-resena",        lender: "Arc Home",        productType: "bank statement loan",     category: "prestamos",  context: "Self-employed loans, cobertura nacional" },
  { slug: "discover-it-secured-resena", lender: "Discover it Secured", productType: "tarjeta asegurada", category: "tarjetas", context: "Reporta a las 3 bureaus, gradúa a unsecured automáticamente" },
  { slug: "capital-one-platinum-secured-resena", lender: "Capital One Platinum Secured", productType: "tarjeta asegurada", category: "tarjetas", context: "Depósito desde $49, sin annual fee" },
  { slug: "remitly-resena",         lender: "Remitly",         productType: "remesas",                 category: "remesas",    context: "App-first, fee bajo en corredor MX/CAM" },
  { slug: "wise-resena",            lender: "Wise",            productType: "remesas multi-divisa",    category: "remesas",    context: "FX rate transparente, funciona también para hold USD" },
  { slug: "xoom-paypal-resena",     lender: "Xoom (PayPal)",   productType: "remesas",                 category: "remesas",    context: "Integración PayPal, opciones cash pickup" },
  { slug: "accion-opportunity-fund-resena", lender: "Accion Opportunity Fund", productType: "préstamo a pequeños negocios", category: "prestamos", context: "Microloans con ITIN, foco hispano" },
  { slug: "ethos-life-resena",      lender: "Ethos",           productType: "seguro de vida online",   category: "seguros",    context: "Term life sin examen médico, hasta $2M cobertura" },
  { slug: "haven-life-resena",      lender: "Haven Life",      productType: "seguro de vida MassMutual", category: "seguros",  context: "Aprobación instantánea para perfiles fuertes" },
];

/**
 * Carrier comparison pairs — head-to-head decisions Hispanic users actually search.
 */
const CARRIER_COMPARISONS: Array<{
  slug: string;
  a: string;
  b: string;
  category: UsContentTopic["category"];
  context: string;
}> = [
  { slug: "infinity-vs-fred-loya",        a: "Infinity",      b: "Fred Loya",     category: "seguros",   context: "Ambos foco hispano, comparativo de servicio y precio" },
  { slug: "progressive-vs-geico-hispanos", a: "Progressive",  b: "GEICO",         category: "seguros",   context: "Apps en español, ITIN policies por estado" },
  { slug: "state-farm-vs-allstate-hispanos", a: "State Farm", b: "Allstate",      category: "seguros",   context: "Comparativo de descuentos hispanos y bilingual claims" },
  { slug: "esurance-vs-direct-general",   a: "Esurance",      b: "Direct General", category: "seguros",   context: "Online vs storefront — qué conviene a hispanos" },
  { slug: "remitly-vs-western-union",     a: "Remitly",       b: "Western Union", category: "remesas",   context: "App vs storefront, costo por $200 a México" },
  { slug: "wise-vs-remitly",              a: "Wise",          b: "Remitly",       category: "remesas",   context: "Comparativo FX rate y velocidad" },
  { slug: "xoom-vs-remitly",              a: "Xoom (PayPal)", b: "Remitly",       category: "remesas",   context: "Cash pickup y ATM withdrawal" },
  { slug: "self-vs-kikoff",               a: "Self Financial", b: "Kikoff",       category: "tarjetas",  context: "Credit-builder loans para hispanos sin historial" },
  { slug: "discover-secured-vs-capital-one-secured", a: "Discover it Secured", b: "Capital One Platinum Secured", category: "tarjetas", context: "Tarjetas aseguradas que reportan a las 3 bureaus" },
  { slug: "oportun-vs-self",              a: "Oportun",       b: "Self Financial", category: "prestamos", context: "Préstamo personal vs credit-builder con ITIN" },
  { slug: "fha-vs-conventional-itin",     a: "FHA loan",      b: "Conventional",  category: "prestamos", context: "Para hispanos con SSN — FHA vs conventional" },
  { slug: "non-qm-vs-bank-statement-loan", a: "Non-QM tradicional", b: "Bank statement loan", category: "prestamos", context: "Comparativo para self-employed sin W-2" },
];

/**
 * Remittance corridors — destination-specific pSEO.
 */
const REMITTANCE_DESTINATIONS: Array<{
  slug: string;
  countryEs: string;
  currency: string;
  context: string;
}> = [
  { slug: "mexico",             countryEs: "México",             currency: "MXN", context: "Corredor #1 EE.UU.→LATAM, $63B/año en remesas" },
  { slug: "el-salvador",        countryEs: "El Salvador",        currency: "USD", context: "Economía dolarizada, comisión variable por método" },
  { slug: "guatemala",          countryEs: "Guatemala",          currency: "GTQ", context: "Tigo Money y Banrural como red local" },
  { slug: "honduras",           countryEs: "Honduras",           currency: "HNL", context: "Tigo Money, Banco Atlántida grande" },
  { slug: "republica-dominicana", countryEs: "República Dominicana", currency: "DOP", context: "Mercado dominicano-NY-Boston" },
  { slug: "colombia",           countryEs: "Colombia",           currency: "COP", context: "Bancolombia, Davivienda red de cobro" },
  { slug: "peru",               countryEs: "Perú",               currency: "PEN", context: "BCP y BBVA Continental dominantes" },
  { slug: "ecuador",            countryEs: "Ecuador",            currency: "USD", context: "Dolarizada, transferencia directa más simple" },
];

/**
 * Competitor alternative — Spec §8.5. High-intent commercial cluster targeting
 * unhappy customers of named broker chains. Real public-data citations
 * required (BBB profile, state DOI complaint index, public enforcement
 * records). Cubierto handoff in the disclosure block.
 */
const COMPETITOR_ALTERNATIVES: Array<{
  competitor: string;
  slug: string;
  /** Two-letter state code list this competitor concentrates in */
  states: Array<{ slug: string; nameEs: string; doiNote: string }>;
  /** Public complaint themes (paraphrased, not quoted) */
  complaintThemes: string;
  /** Public BBB profile URL the prompt instructs Claude to reference */
  bbbProfileHint: string;
}> = [
  {
    competitor: "Freeway Insurance",
    slug: "freeway-insurance",
    states: [
      { slug: "florida", nameEs: "Florida", doiNote: "Florida OIR complaint index público" },
      { slug: "texas", nameEs: "Texas", doiNote: "Texas TDI complaint index público" },
      { slug: "california", nameEs: "California", doiNote: "California DOI complaint data" },
    ],
    complaintThemes: "tarifas que suben en renovación sin aviso, dificultad para hablar con un agente bilingüe en horas de trabajo, demoras en pagos de reclamos, cargos por servicios opcionales que el cliente no recuerda haber autorizado",
    bbbProfileHint: "bbb.org perfil de Freeway Insurance (cita el rating BBB actual y el conteo de quejas formales)",
  },
  {
    competitor: "Estrella Insurance",
    slug: "estrella-insurance",
    states: [
      { slug: "florida", nameEs: "Florida", doiNote: "Florida OIR complaint index público" },
      { slug: "texas", nameEs: "Texas", doiNote: "Texas TDI complaint index público" },
    ],
    complaintThemes: "diferencias entre la prima cotizada y la prima real en la póliza, fees de cancelación altos, problemas con SR-22 filings tardíos, oficina cierra a las 6 PM lo que dificulta atención para gente que trabaja",
    bbbProfileHint: "bbb.org perfil de Estrella Insurance (cita el rating BBB actual y el conteo de quejas formales)",
  },
  {
    competitor: "Confie Seguros",
    slug: "confie-seguros",
    states: [
      { slug: "florida", nameEs: "Florida", doiNote: "Florida OIR datos públicos" },
      { slug: "texas", nameEs: "Texas", doiNote: "Texas TDI datos públicos" },
    ],
    complaintThemes: "es la matriz de Freeway/Estrella, las quejas son similares a las dos marcas hijas, falta de transparencia en quién es realmente la aseguradora detrás",
    bbbProfileHint: "bbb.org perfil de Confie Holding Insurance (cita rating BBB actual)",
  },
  {
    competitor: "Acceptance Insurance",
    slug: "acceptance-insurance",
    states: [
      { slug: "florida", nameEs: "Florida", doiNote: "Florida OIR datos públicos" },
      { slug: "texas", nameEs: "Texas", doiNote: "Texas TDI datos públicos" },
      { slug: "georgia", nameEs: "Georgia", doiNote: "Georgia OCI datos públicos" },
    ],
    complaintThemes: "es especialista en non-standard auto (conductores high-risk) por lo que las primas son altas por diseño, clientes reportan que no se les explica esto al cotizar",
    bbbProfileHint: "bbb.org perfil de Acceptance Insurance",
  },
];

/**
 * Spec §2 — Tier 1 secondary cities prioritized. These have lower CPMs and
 * weaker SERP competition than primary metros.
 */
const SECONDARY_CITIES_FL_TX: Array<{
  slug: string;
  nameEs: string;
  state: "Florida" | "Texas";
  county: string;
  hispanicPct: string;
  marketNote: string;
}> = [
  { slug: "tampa",         nameEs: "Tampa",         state: "Florida", county: "Hillsborough", hispanicPct: "26%", marketNote: "creciente comunidad cubano-americana y puertorriqueña" },
  { slug: "orlando",       nameEs: "Orlando",       state: "Florida", county: "Orange",       hispanicPct: "32%", marketNote: "comunidad puertorriqueña grande post-María 2017" },
  { slug: "kissimmee",     nameEs: "Kissimmee",     state: "Florida", county: "Osceola",      hispanicPct: "57%", marketNote: "mayoría puertorriqueña, demanda alta de servicios en español" },
  { slug: "lakeland",      nameEs: "Lakeland",      state: "Florida", county: "Polk",         hispanicPct: "23%", marketNote: "mercado hispano de crecimiento rápido" },
  { slug: "fort-myers",    nameEs: "Fort Myers",    state: "Florida", county: "Lee",          hispanicPct: "22%", marketNote: "comunidad mexicana y centroamericana en construcción" },
  { slug: "pensacola",     nameEs: "Pensacola",     state: "Florida", county: "Escambia",     hispanicPct: "9%",  marketNote: "mercado más pequeño pero subatendido en español" },
  { slug: "el-paso",       nameEs: "El Paso",       state: "Texas",   county: "El Paso",      hispanicPct: "82%", marketNote: "frontera con Ciudad Juárez, mayoría hispana" },
  { slug: "mcallen",       nameEs: "McAllen",       state: "Texas",   county: "Hidalgo",      hispanicPct: "91%", marketNote: "Valle del Río Grande, casi totalidad hispana" },
  { slug: "brownsville",   nameEs: "Brownsville",   state: "Texas",   county: "Cameron",      hispanicPct: "93%", marketNote: "frontera con Matamoros, mayoría mexicana" },
  { slug: "laredo",        nameEs: "Laredo",        state: "Texas",   county: "Webb",         hispanicPct: "95%", marketNote: "ciudad fronteriza hispana en su gran mayoría" },
  { slug: "corpus-christi", nameEs: "Corpus Christi", state: "Texas", county: "Nueces",       hispanicPct: "63%", marketNote: "mayoría mexicano-americana" },
  { slug: "lubbock",       nameEs: "Lubbock",       state: "Texas",   county: "Lubbock",      hispanicPct: "38%", marketNote: "mercado hispano en crecimiento" },
  { slug: "amarillo",      nameEs: "Amarillo",      state: "Texas",   county: "Potter",       hispanicPct: "30%", marketNote: "comunidad mexicana de larga data" },
];

const SECONDARY_CITY_COHORTS = [
  {
    slug: "sin-social-security",
    nameEs: "conductores sin Social Security",
    targetQuery: "seguro auto sin Social Security",
    cohortContext: "conductor sin Social Security — usa ITIN del IRS, pasaporte, o matrícula consular como identificación",
  },
  {
    slug: "licencia-extranjera",
    nameEs: "conductores con licencia extranjera",
    targetQuery: "seguro auto con licencia extranjera",
    cohortContext: "conductor con licencia de México, Centroamérica o Suramérica que aún no tiene licencia estatal de EE.UU.",
  },
  {
    slug: "uber-lyft",
    nameEs: "conductores de Uber y Lyft",
    targetQuery: "seguro auto rideshare hispanos",
    cohortContext: "conductor gig (Uber, Lyft, DoorDash) que necesita endoso rideshare",
  },
];

// ─── Generators ────────────────────────────────────────────────────────────

function autoInsuranceStateTopic(state: typeof PRIORITY_STATES[number]): UsContentTopic {
  return {
    slug: `seguro-auto-${state.slug}-hispanos-2026`,
    category: "seguros",
    imageQuery: `${state.nameEn} highway car driving`,
    preferredAuthor: "javier-keough",
    templateVariables: { stateSlug: state.slug },
    prompt: `Eres un experto en seguros de auto en ${state.nameEs} para la comunidad hispana. Escribe una guía en español de 1100-1300 palabras.

Keyword principal: "seguro de auto en ${state.nameEs} para hispanos"
Título H1: "Seguro de auto en ${state.nameEs} para Hispanos: tarifas y opciones (2026)"

Contexto del estado: cobertura mínima legal ${state.autoMinimum}. ${state.insuranceNote}.

Estructura:
## Introducción (keyword en primeras 100 palabras; menciona la realidad del mercado en ${state.nameEs})
## Cobertura mínima legal en ${state.nameEs} (${state.autoMinimum})
## Tarifas promedio para hispanos en ${state.nameEs}
(Tabla: Aseguradora | Prima mensual estimada | ITIN aceptado | App en español)
## Aseguradoras que aceptan ITIN en ${state.nameEs}
## Programas estatales de bajo costo
## Cómo conseguir SR-22 en ${state.nameEs} (si aplica)
## Cubierto — broker que cotiza con 8+ aseguradoras
(divulgación)
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  };
}

function mortgageItinStateTopic(state: typeof PRIORITY_STATES[number]): UsContentTopic {
  return {
    slug: `comprar-casa-sin-social-security-${state.slug}-2026`,
    category: "prestamos",
    imageQuery: `${state.nameEn} suburban home hispanic family`,
    preferredAuthor: "javier-keough",
    templateVariables: { stateSlug: state.slug, cohort: "sin-ssn" },
    prompt: `Eres un experto en hipotecas para Hispanos sin Social Security en ${state.nameEs}. Escribe una guía en español de 1200-1400 palabras.

Keyword principal: "comprar casa sin Social Security ${state.nameEs}" / "hipoteca sin SSN ${state.nameEs}"
Keywords secundarias: "hipoteca con ITIN ${state.nameEs}" (ITIN se menciona como término técnico, NO en el título principal)
Título H1: "Comprar casa sin Social Security en ${state.nameEs}: cómo calificar a hipoteca (2026)"

Contexto: ${state.insuranceNote}. ITIN (Individual Taxpayer Identification Number) es el número del IRS que sustituye al SSN — pero el usuario busca "sin Social Security" porque eso es lo que sabe que no tiene. Liderá el texto con ese lenguaje plano.

Estructura:
## Introducción (keyword "sin Social Security" primeras 100 palabras; ITIN explicado de pasada)
## Sí se puede comprar casa sin Social Security en ${state.nameEs} (explicá qué es ITIN acá, como término técnico)
## Los wholesalers que sí aceptan ITIN en ${state.nameEs}
(Tabla: Wholesaler | Tasa típica sobre conv. | Down payment mín. | LTV máx.)
## Down payment típico (10-25%)
## Documentos que necesitás sin SSN
## Programas estatales para first-time buyer en ${state.nameEs}
## Hogares — pre-calificación por WhatsApp en 24h
(divulgación)
## Errores que rechazan tu hipoteca cuando no tenés SSN
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  };
}

function cityMortgageTopic(city: typeof PRIORITY_CITIES[number]): UsContentTopic {
  return {
    slug: `comprar-casa-sin-social-security-${city.slug}-2026`,
    category: "prestamos",
    imageQuery: `${city.nameEs} skyline residential homes`,
    preferredAuthor: "javier-keough",
    templateVariables: { city: city.slug, cohort: "sin-ssn" },
    prompt: `Eres un experto en compra de vivienda para Hispanos sin Social Security en ${city.nameEs}, ${city.state}. Escribe una guía en español de 1200-1400 palabras.

Keyword principal: "comprar casa sin Social Security en ${city.nameEs}" / "comprar casa sin SSN ${city.nameEs}"
Keyword secundaria: "comprar casa con ITIN en ${city.nameEs}" (ITIN es el número técnico, no el keyword principal — la gente busca "sin Social Security")
Título H1: "Comprar casa sin Social Security en ${city.nameEs} (${city.state}): guía 2026"

Contexto del mercado: ${city.context}. Precios medianos: ${city.homePrice}. ITIN es el número del IRS que sustituye al SSN — explicalo en el cuerpo del artículo como término técnico, pero el lenguaje del titular y del lead debe ser "sin Social Security".

Estructura:
## Introducción ("sin Social Security" primeras 100 palabras; precio mediano local)
## Realidad del mercado: ${city.nameEs} 2026
(Tabla: Zona | Precio mediano | Tipo de inventario | Tiempo en mercado)
## Wholesalers que aceptan ITIN en ${city.nameEs} (qué es ITIN explicado en una oración)
## Down payment necesario para ${city.homePrice}
## Programas locales/estatales para first-time buyer
## Cómo escoger un agente bilingüe en ${city.nameEs}
## Hogares — broker non-QM
(divulgación)
## Errores comunes que rechazan tu hipoteca sin SSN en ${city.nameEs}
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  };
}

function glossaryTopic(term: typeof GLOSSARY_TERMS[number]): UsContentTopic {
  // Glossary pages favor Javier (mechanics) except seguros which Sabrina handles.
  const author: UsAuthorSlug =
    term.category === "seguros" ? "sabrina-keough" : "javier-keough";

  return {
    slug: term.slug,
    category: term.category,
    imageQuery: `${term.term} financial document explanation`,
    preferredAuthor: author,
    prompt: `Eres un educador financiero hispano. Escribe una guía explicativa en español de 800-1000 palabras sobre "${term.term}".

Keyword principal: "qué es ${term.term}" (también: "${term.term} en español")
Título H1: "${term.term}: qué es y cómo aplica para Hispanos (2026)"

Definición corta: ${term.shortDef}.
Contexto: ${term.context}.

Estructura:
## Introducción (keyword primeras 100 palabras; definición de una oración)
## Qué significa exactamente ${term.term}
## Cuándo importa para Hispanos (caso real)
## Cómo se compara con conceptos relacionados
(Tabla comparativa con 2-3 conceptos parecidos)
## Errores y mitos comunes
## Pasos prácticos para usarlo a tu favor
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  };
}

function lenderReviewTopic(review: typeof LENDER_REVIEWS[number]): UsContentTopic {
  // Insurance reviews → Sabrina; everything else → Javier.
  const author: UsAuthorSlug =
    review.category === "seguros" ? "sabrina-keough" : "javier-keough";

  return {
    slug: review.slug,
    category: review.category,
    imageQuery: `${review.lender} app financial product review`,
    preferredAuthor: author,
    prompt: `Eres un analista financiero independiente. Escribe una reseña en español de 1100-1300 palabras del producto: "${review.lender}" (${review.productType}).

Keyword principal: "${review.lender} reseña" (también: "${review.lender} opiniones hispanos")
Título H1: "${review.lender}: reseña honesta para Hispanos (2026)"

Contexto: ${review.context}.

Estructura:
## Introducción (keyword primeras 100 palabras; veredicto en una oración)
## Qué es ${review.lender}
## Tarifas y costos reales
(Tabla: Concepto | Costo | Comparado con competencia)
## Quién debería usarlo (perfil ideal)
## Quién NO debería usarlo
## Aceptan ITIN / sin SSN
## Cómo se compara con alternativas
## Lo bueno y lo malo (resumen honesto)
## Cómo aplicar paso a paso
## Preguntas frecuentes
## Conclusión + recomendación final${US_SEO_SUFFIX}`,
  };
}

function comparisonTopic(comp: typeof CARRIER_COMPARISONS[number]): UsContentTopic {
  const author: UsAuthorSlug =
    comp.category === "seguros" ? "sabrina-keough" : "javier-keough";

  return {
    slug: comp.slug,
    category: comp.category,
    imageQuery: `${comp.a} vs ${comp.b} comparison choice`,
    preferredAuthor: author,
    prompt: `Eres un analista financiero hispano. Escribe un comparativo head-to-head en español de 1100-1300 palabras.

Keyword principal: "${comp.a} vs ${comp.b}"
Título H1: "${comp.a} vs ${comp.b}: comparativo honesto para Hispanos (2026)"

Contexto: ${comp.context}.

Estructura:
## Introducción (keyword primeras 100 palabras; quién gana en una oración)
## Resumen rápido — quién gana en qué
(Tabla: Categoría | ${comp.a} | ${comp.b} | Ganador)
## Costo real (precios actuales)
## Aceptan ITIN / sin SSN
## Servicio al cliente y reputación CFPB
## App móvil y experiencia digital
## Cuándo elegir ${comp.a}
## Cuándo elegir ${comp.b}
## Mejor alternativa que ambos (CTA suave a Cubierto/Hogares según aplique)
## Preguntas frecuentes
## Veredicto final${US_SEO_SUFFIX}`,
  };
}

function remittanceCorridorTopic(dest: typeof REMITTANCE_DESTINATIONS[number]): UsContentTopic {
  return {
    slug: `enviar-dinero-${dest.slug}-mejor-opcion-2026`,
    category: "remesas",
    imageQuery: `${dest.countryEs} family receiving remittance money`,
    preferredAuthor: "javier-keough",
    prompt: `Eres un experto en remesas EE.UU.→${dest.countryEs}. Escribe una guía en español de 1100-1300 palabras.

Keyword principal: "enviar dinero a ${dest.countryEs}" (también: "mejor app para mandar dinero a ${dest.countryEs}")
Título H1: "Enviar dinero a ${dest.countryEs} desde EE.UU.: mejores apps (2026)"

Contexto: ${dest.context}. Moneda destino: ${dest.currency}.

Estructura:
## Introducción (keyword primeras 100 palabras)
## Qué proveedores conviene comparar
(Tabla: App | Comisión $200 | FX rate spread | Velocidad | Métodos de cobro)
Incluir: Wise, Remitly, Western Union, Xoom (PayPal), MoneyGram
## Costo real por $200 enviados
## Métodos de cobro en ${dest.countryEs} (depósito bancario, cash pickup, mobile money)
## Velocidad de entrega: cuánto tarda cada provider
## Errores que cuestan más
## Cómo escoger según destinatario y monto
## Comparador en vivo de Finazo (CTA al comparador)
## Preguntas frecuentes
## Conclusión${US_SEO_SUFFIX}`,
  };
}

/**
 * Competitor alternative topic — per spec §8.5. Real-data block from BBB +
 * state DOI complaint index. Higher word-count floor; quarterly refresh
 * candidate.
 */
function competitorAlternativeTopic(
  comp: typeof COMPETITOR_ALTERNATIVES[number],
  state: typeof COMPETITOR_ALTERNATIVES[number]["states"][number],
): UsContentTopic {
  return {
    slug: `alternativa-a-${comp.slug}-${state.slug}-2026`,
    category: "seguros",
    imageQuery: `${state.nameEs} family looking at insurance documents`,
    preferredAuthor: "sabrina-keough",
    qualityGate: { minWordCount: 1600 },
    templateVariables: { stateSlug: state.slug, competitor: comp.slug },
    prompt: `Eres un periodista financiero independiente que cubre seguros de auto para la comunidad hispana en EE.UU. Escribe una guía editorial de 1600-2000 palabras sobre alternativas a "${comp.competitor}" en ${state.nameEs}.

Esta es una página comparativa de PUBLISHER (no de broker), por lo tanto el lenguaje comparativo está permitido cuando se sustenta con datos públicos citados. Estás escribiendo bajo Finazo, que tiene relación de afiliado con Cubierto — la divulgación es obligatoria.

Keyword principal: "alternativa a ${comp.competitor} ${state.nameEs}"
Keywords secundarias: "${comp.competitor} reseñas", "${comp.competitor} problemas", "cancelar ${comp.competitor}"
Título H1: "Alternativas a ${comp.competitor} en ${state.nameEs}: comparativo editorial 2026"

Contexto del competidor: ${comp.complaintThemes}.
Fuentes de datos públicas que debes citar con URL:
- ${comp.bbbProfileHint}
- ${state.doiNote}
- Para Cubierto y para 1-2 brokers alternativos: cita su sitio oficial, NPN si está publicado.

REGLAS CRÍTICAS ESPECÍFICAS DE ESTA PÁGINA:
- NUNCA cites verbatim un review individual. Los reviews son propiedad del reviewer; agregar patrones está OK, citar palabras textuales NO.
- NUNCA nombres reviewers individuales ni intentes identificar clientes.
- NUNCA llames "estafa" o "fraude" a ${comp.competitor} a menos que cites un Consent Order específico de DFS/TDI que use esa palabra.
- TODA crítica a ${comp.competitor} debe trazar a una fuente pública (BBB rating, DOI complaint count, enforcement action) — no a tu opinión.
- INCLUYE la cláusula "cuándo Cubierto NO es la opción correcta" en el handoff. La honestidad editorial es la cobertura legal.

Estructura:
## ¿Por qué los clientes buscan alternativa a ${comp.competitor} en ${state.nameEs} en 2026?
(Documenta patrones agregados de quejas con citas a BBB + ${state.doiNote}. Marcos honestos, no acusatorios)

## Lo que deberías evaluar en cualquier alternativa para conductores hispanos en ${state.nameEs}
(Criterios reales — algunos favorecen Cubierto, algunos no. Honestidad = credibilidad)

## Comparación: ${comp.competitor} vs The Zebra vs Cubierto vs un broker local en ${state.nameEs} 2026
(Tabla comparativa con al menos 4 opciones: el competidor, un aggregator nacional, Cubierto, un broker local)

## Cómo cambiar de aseguranza sin pagar cancelación en ${state.nameEs}
(Contenido operacional real: derechos de cancelación estatales, cálculo de refund, timing relativo al renewal)

## Divulgación: Cubierto es nuestro corredor afiliado en ${state.nameEs}
(El handoff estándar — incluye cuándo Cubierto SÍ es la opción correcta Y cuándo NO. Esto es lo que preserva nuestro estatus de publisher)

## Preguntas frecuentes sobre cambiar de ${comp.competitor} a otra aseguranza en ${state.nameEs}
(5-7 Q&A reales)${US_SEO_SUFFIX}`,
  };
}

function secondaryCityCohortTopic(
  city: typeof SECONDARY_CITIES_FL_TX[number],
  cohort: typeof SECONDARY_CITY_COHORTS[number],
): UsContentTopic {
  const stateSlug = city.state === "Florida" ? "florida" : "texas";
  return {
    slug: `${cohort.targetQuery.replace(/\s+/g, "-").toLowerCase()}-${city.slug}-2026`,
    category: "seguros",
    imageQuery: `${city.nameEs} ${city.state} driver hispanic`,
    preferredAuthor: "javier-keough",
    templateVariables: { stateSlug, city: city.slug, cohort: cohort.slug },
    prompt: `Eres un experto en seguros de auto en ${city.nameEs}, ${city.state} para ${cohort.nameEs}. Escribe una guía en español de 1300-1600 palabras siguiendo disciplina GEO Welter.

Contexto del mercado:
- ${city.nameEs} es en ${city.county} County, ${city.state}. Hispanic ${city.hispanicPct} (${city.marketNote}).
- Cohorte target: ${cohort.cohortContext}.

Keyword principal: "${cohort.targetQuery} en ${city.nameEs}"
Título H1: "Seguro de auto en ${city.nameEs} ${city.state} para ${cohort.nameEs}: opciones reales 2026"

FAN-OUT OBLIGATORIO — escribí un H3 (con signo de pregunta al final) que responda EXPLÍCITAMENTE cada una de estas 5 sub-consultas:
1. ¿Cuáles aseguradoras aceptan ${cohort.nameEs} en ${city.nameEs}?
2. ¿Cuánto cuesta el seguro de auto para ${cohort.nameEs} en ${city.nameEs} en 2026?
3. ¿Qué cobertura mínima exige ${city.state} para ${cohort.nameEs}?
4. ¿Cómo cotizar siendo ${cohort.nameEs} en ${city.nameEs} sin SSN?
5. ¿Cómo cambiar a una mejor aseguradora si ya tienes una?

BLOQUE DE DATOS REALES obligatorio:
Cita tarifas promedio de ${city.state} de la Oficina de Regulación de Seguros (Florida OIR / Texas TDI). Año 2024 o 2025. URL.

Estructura sugerida:
## [H2 expandido sobre la realidad del mercado de seguros para ${cohort.nameEs} en ${city.nameEs}]
## [H2 sobre cobertura mínima legal en ${city.state} con cifras OIR/TDI]
(tabla con cobertura mínima + prima promedio mensual citando fuente)
## [H2 sobre las 4-5 aseguradoras reales que aceptan ${cohort.nameEs} en ${city.nameEs}]
(tabla con aseguradora | acepta ITIN/extranjera/rideshare | prima estimada | nota local)
## [H2 sobre cómo cotizar paso a paso por WhatsApp con Cubierto]
## Preguntas frecuentes sobre seguro auto para ${cohort.nameEs} en ${city.nameEs}
(las 5 sub-preguntas de fan-out, cada una como H3 terminando en signo de pregunta)${US_SEO_SUFFIX}`,
  };
}

function glossaryYearStampTopic(
  term: typeof GLOSSARY_TERMS[number],
  year: number,
): UsContentTopic {
  // Year-stamped variant of glossary topic — for terms that have annual
  // updates (IRS thresholds, FPL ranges, ACA OEP dates, ITIN renewal cycle).
  const author: UsAuthorSlug =
    term.category === "seguros" ? "sabrina-keough" : "javier-keough";

  return {
    slug: `${term.slug}-${year}`,
    category: term.category,
    imageQuery: `${term.term} ${year} financial document hispanic`,
    preferredAuthor: author,
    qualityGate: { minWordCount: 900, allowMissingTable: false },
    prompt: `Eres un educador financiero hispano. Escribe la edición ${year} de la guía sobre "${term.term}" en español, 900-1200 palabras.

Esta es la versión actualizada para ${year} — todas las cifras, plazos y umbrales DEBEN ser los vigentes para ${year} o los más recientes publicados. Cita el año del dato siempre.

Keyword principal: "${term.term} ${year}" / "qué es ${term.term} en ${year}"
Título H1: "${term.term} en ${year}: actualización para Hispanos en EE.UU."

Definición corta: ${term.shortDef}.
Contexto: ${term.context}.

FAN-OUT OBLIGATORIO — H3 con signo de pregunta para cada sub-consulta:
1. ¿Qué cambió en ${term.term} para ${year}?
2. ¿Cómo aplica ${term.term} para Hispanos sin Social Security en ${year}?
3. ¿Cuánto cuesta o cuánto da ${term.term} en ${year}? (umbrales/cifras)
4. ¿Cuáles son los plazos clave de ${term.term} en ${year}?
5. ¿Qué errores comunes evitar con ${term.term} en ${year}?

BLOQUE DE DATOS REALES: cita la cifra ${year} con URL a la fuente oficial (IRS.gov si fiscal, HealthCare.gov si ACA, CFPB si crédito, etc.).

Estructura:
## [H2 expandido sobre qué es ${term.term} y por qué importa en ${year}]
## [H2 sobre los umbrales / cifras / plazos ${year} con tabla y fuente]
## [H2 sobre cómo aplica para Hispanos sin SSN o con ITIN en ${year}]
## Preguntas frecuentes sobre ${term.term} en ${year}
(las 5 sub-preguntas de fan-out)${US_SEO_SUFFIX}`,
  };
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Returns ALL programmatic topics expanded from templates.
 * Order matters: high-intent / commercial first so they generate first when
 * the strategist iterates.
 */
export function getAllProgrammaticTopics(): UsContentTopic[] {
  // Year-stamped glossary topics — only for terms that change annually
  // (IRS/CFPB/ACA cycles). Hardcoded list avoids inflating the topic pool.
  const YEAR_STAMPED_SLUGS = new Set([
    "que-es-itin",
    "que-es-aca-marketplace",
    "que-es-medicaid-expansion",
    "que-es-fpl-poverty-level",
    "que-es-w9-vs-w7",
    "que-es-fafsa-itin",
  ]);
  const yearStampedGlossary = GLOSSARY_TERMS
    .filter((g) => YEAR_STAMPED_SLUGS.has(g.slug))
    .map((g) => glossaryYearStampTopic(g, 2026));

  // Competitor alternative cluster (spec §8.5) — one leaf per (competitor × state).
  const competitorAlternatives = COMPETITOR_ALTERNATIVES.flatMap((comp) =>
    comp.states.map((state) => competitorAlternativeTopic(comp, state)),
  );

  // Secondary-city × cohort matrix (spec §2 — secondary cities first).
  // 13 cities × 3 cohorts = 39 leafs.
  const secondaryCityCohorts = SECONDARY_CITIES_FL_TX.flatMap((city) =>
    SECONDARY_CITY_COHORTS.map((cohort) => secondaryCityCohortTopic(city, cohort)),
  );

  return [
    // Highest commercial intent first
    ...competitorAlternatives,      // §8.5 — unhappy-customer high-intent cluster
    ...CARRIER_COMPARISONS.map(comparisonTopic),
    ...LENDER_REVIEWS.map(lenderReviewTopic),
    // Secondary-city cohort matrix — spec priority before primary metros
    ...secondaryCityCohorts,
    // State auto insurance (broad geo volume)
    ...PRIORITY_STATES.map(autoInsuranceStateTopic),
    // State ITIN mortgage (Hogares funnel)
    ...PRIORITY_STATES.map(mortgageItinStateTopic),
    // City ITIN mortgage (Hogares funnel, long-tail)
    ...PRIORITY_CITIES.map(cityMortgageTopic),
    // Remittance corridors
    ...REMITTANCE_DESTINATIONS.map(remittanceCorridorTopic),
    // Year-stamped glossary (annual refresh value)
    ...yearStampedGlossary,
    // Evergreen glossary
    ...GLOSSARY_TERMS.map(glossaryTopic),
  ];
}

/**
 * Count of programmatic topics — useful for logging.
 */
export function countProgrammaticTopics(): number {
  return getAllProgrammaticTopics().length;
}
