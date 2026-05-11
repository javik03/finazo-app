/**
 * Single source of truth for geo permutations across the pSEO engine.
 *
 * Per Finazo PSEO+GEO v2 Spec §2 — secondary cities first, primary metros
 * deprioritized until cluster authority emerges in secondary geos.
 *
 * Tier 1 = generate first (week 1-3). Lower auction CPMs, weaker SERP
 * competition, often higher Hispanic density per ad dollar.
 * Tier 2 = generate after Tier 1 ranks emerge.
 * Tier 3 = primary metros — generate last, only after lateral cluster
 * authority transfers from secondary cities.
 */

export type Tier = 1 | 2 | 3;

export type UsGeo = {
  slug: string;
  nameEs: string;
  state: "Florida" | "Texas" | "California" | "New York" | "Arizona" | "Illinois" | "Nevada" | "Georgia";
  stateSlug: string;
  county: string;
  hispanicPct: string;
  tier: Tier;
  marketNote: string;
};

export type SvGeo = {
  slug: string;
  nameEs: string;
  department: string;
  tier: Tier;
  marketNote: string;
};

/**
 * US Tier 1 secondary cities — spec §2.1 and §2.2 priority order.
 * Florida + Texas because Cubierto is licensed there.
 */
export const US_TIER_1_SECONDARY: UsGeo[] = [
  { slug: "tampa",          nameEs: "Tampa",          state: "Florida", stateSlug: "florida", county: "Hillsborough", hispanicPct: "26%", tier: 1, marketNote: "creciente comunidad cubano-americana y puertorriqueña" },
  { slug: "orlando",        nameEs: "Orlando",        state: "Florida", stateSlug: "florida", county: "Orange",       hispanicPct: "32%", tier: 1, marketNote: "comunidad puertorriqueña grande post-María 2017" },
  { slug: "kissimmee",      nameEs: "Kissimmee",      state: "Florida", stateSlug: "florida", county: "Osceola",      hispanicPct: "57%", tier: 1, marketNote: "mayoría puertorriqueña, demanda alta de servicios en español" },
  { slug: "lakeland",       nameEs: "Lakeland",       state: "Florida", stateSlug: "florida", county: "Polk",         hispanicPct: "23%", tier: 1, marketNote: "mercado hispano de crecimiento rápido" },
  { slug: "fort-myers",     nameEs: "Fort Myers",     state: "Florida", stateSlug: "florida", county: "Lee",          hispanicPct: "22%", tier: 1, marketNote: "comunidad mexicana y centroamericana en construcción" },
  { slug: "pensacola",      nameEs: "Pensacola",      state: "Florida", stateSlug: "florida", county: "Escambia",     hispanicPct: "9%",  tier: 1, marketNote: "mercado más pequeño pero subatendido en español" },
  { slug: "el-paso",        nameEs: "El Paso",        state: "Texas",   stateSlug: "texas",   county: "El Paso",      hispanicPct: "82%", tier: 1, marketNote: "frontera con Ciudad Juárez, mayoría hispana" },
  { slug: "mcallen",        nameEs: "McAllen",        state: "Texas",   stateSlug: "texas",   county: "Hidalgo",      hispanicPct: "91%", tier: 1, marketNote: "Valle del Río Grande, casi totalidad hispana" },
  { slug: "brownsville",    nameEs: "Brownsville",    state: "Texas",   stateSlug: "texas",   county: "Cameron",      hispanicPct: "93%", tier: 1, marketNote: "frontera con Matamoros, mayoría mexicana" },
  { slug: "laredo",         nameEs: "Laredo",         state: "Texas",   stateSlug: "texas",   county: "Webb",         hispanicPct: "95%", tier: 1, marketNote: "ciudad fronteriza hispana en su gran mayoría" },
  { slug: "corpus-christi", nameEs: "Corpus Christi", state: "Texas",   stateSlug: "texas",   county: "Nueces",       hispanicPct: "63%", tier: 1, marketNote: "mayoría mexicano-americana" },
  { slug: "lubbock",        nameEs: "Lubbock",        state: "Texas",   stateSlug: "texas",   county: "Lubbock",      hispanicPct: "38%", tier: 1, marketNote: "mercado hispano en crecimiento" },
  { slug: "amarillo",       nameEs: "Amarillo",       state: "Texas",   stateSlug: "texas",   county: "Potter",       hispanicPct: "30%", tier: 1, marketNote: "comunidad mexicana de larga data" },
];

/**
 * El Salvador geos — primary cities by Hispanic population and CrediMóvil
 * market relevance. CrediMóvil is the offer endpoint; finazo.lat is the
 * publisher surface that ranks on user-intent queries ("préstamo por tu
 * carro", "empeñar vehículo") and routes there.
 */
export const SV_PRIMARY_CITIES: SvGeo[] = [
  { slug: "san-salvador",   nameEs: "San Salvador",   department: "San Salvador", tier: 1, marketNote: "capital, mercado financiero más activo del país" },
  { slug: "santa-tecla",    nameEs: "Santa Tecla",    department: "La Libertad",  tier: 1, marketNote: "Gran San Salvador, clase media en crecimiento" },
  { slug: "soyapango",      nameEs: "Soyapango",      department: "San Salvador", tier: 1, marketNote: "alta densidad poblacional, mucha demanda de crédito alternativo" },
  { slug: "mejicanos",      nameEs: "Mejicanos",      department: "San Salvador", tier: 1, marketNote: "Área metropolitana, demografía trabajadora" },
  { slug: "santa-ana",      nameEs: "Santa Ana",      department: "Santa Ana",    tier: 1, marketNote: "segunda ciudad del país, mercado de occidente" },
  { slug: "san-miguel",     nameEs: "San Miguel",     department: "San Miguel",   tier: 1, marketNote: "principal ciudad del oriente, remesas altas" },
  { slug: "ahuachapan",     nameEs: "Ahuachapán",     department: "Ahuachapán",   tier: 2, marketNote: "occidente, agricultura y comercio fronterizo con Guatemala" },
  { slug: "sonsonate",      nameEs: "Sonsonate",      department: "Sonsonate",    tier: 2, marketNote: "costa pacífica, comercio y turismo" },
  { slug: "la-union",       nameEs: "La Unión",       department: "La Unión",     tier: 2, marketNote: "puerto y frontera con Honduras" },
  { slug: "usulutan",       nameEs: "Usulután",       department: "Usulután",     tier: 2, marketNote: "agroexportador del oriente" },
];

export type UsAutoCohort = {
  slug: string;
  nameEs: string;
  /** Search-intent query the cohort matches. */
  targetQueryStem: string;
  cohortContext: string;
};

export const US_AUTO_COHORTS: UsAutoCohort[] = [
  {
    slug: "itin",
    nameEs: "conductores con ITIN",
    targetQueryStem: "seguro auto con ITIN",
    cohortContext: "conductor sin Social Security pero con ITIN del IRS",
  },
  {
    slug: "licencia-extranjera",
    nameEs: "conductores con licencia extranjera",
    targetQueryStem: "seguro auto con licencia extranjera",
    cohortContext: "conductor con licencia de México, Centroamérica o Suramérica que aún no tiene licencia estatal de EE.UU.",
  },
  {
    slug: "uber-lyft",
    nameEs: "conductores de Uber y Lyft",
    targetQueryStem: "seguro auto rideshare hispanos",
    cohortContext: "conductor gig (Uber, Lyft, DoorDash) que necesita endoso rideshare",
  },
];

export type SvAutoFinanceIntent = {
  slug: string;
  /** What the user types into Google ("préstamo por tu carro", "empeñar carro"). */
  searchIntent: string;
  /** Honest editorial framing of the actual product (sale-leaseback). */
  productReality: string;
};

/**
 * Search intents Salvadoran users actually use when looking for cash secured
 * by their vehicle. Finazo (the publisher) writes against the search intent;
 * each article educates the reader on the sale-leaseback / arrendamiento
 * financiero reality, then routes to CrediMóvil for the transaction.
 */
export const SV_AUTO_FINANCE_INTENTS: SvAutoFinanceIntent[] = [
  {
    slug: "prestamo-por-tu-carro",
    searchIntent: "préstamo por tu carro",
    productReality:
      "Lo que mucha gente busca como 'préstamo por su carro' en El Salvador legalmente es un sale-leaseback (arrendamiento financiero retroactivo): vendés tu vehículo a la compañía y al mismo tiempo firmás un contrato de arrendamiento para seguir usándolo, con opción de recompra al final. CrediMóvil opera bajo este modelo regulado.",
  },
  {
    slug: "empenar-carro",
    searchIntent: "empeñar carro",
    productReality:
      "Empeñar tu carro en una casa de empeño tradicional implica entregar las llaves y la posesión del vehículo. CrediMóvil te ofrece una alternativa: con sale-leaseback (arrendamiento financiero) seguís manejando tu carro mientras pagás cuotas, sin perder posesión.",
  },
  {
    slug: "dinero-rapido-con-mi-carro",
    searchIntent: "dinero rápido con mi carro",
    productReality:
      "Cuando la urgencia es alta y el banco tarda, el sale-leaseback de vehículo es una de las formas más rápidas de convertir el valor de tu carro en efectivo sin perder posesión. CrediMóvil aprueba en 24-48 horas con título de propiedad y tarjeta de circulación al día.",
  },
];
