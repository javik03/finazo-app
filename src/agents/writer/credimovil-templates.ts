/**
 * CrediMóvil pSEO templates — Salvadoran (and broader Central American)
 * car-finance search-intent content hosted on finazo.lat.
 *
 * Architecture per spec §0.1 / §1.4 / §11:
 * - Finazo (the publisher) ranks on user-intent queries like "préstamo por tu
 *   carro" — the queries Salvadoran users actually search.
 * - Inside the article body, the editorial honestly explains that the
 *   legally-correct product is sale-leaseback / arrendamiento financiero.
 * - The CTA routes to credimovil.io (or a finazo.lat preflight page) for the
 *   actual transaction.
 * - CrediMóvil's own site uses leasing terminology only — that's where the
 *   spec §11 firewall lives. This file is publisher content, NOT CrediMóvil
 *   commercial content.
 */

import { SV_PRIMARY_CITIES, SV_AUTO_FINANCE_INTENTS, type SvGeo, type SvAutoFinanceIntent } from "@/lib/constants/geos";

// ─── Topic types (mirrors the LATAM content-strategist's ContentTopic) ─────

export type CredimovilTopic = {
  slug: string;
  /** Maps to articles.category. "prestamos" is the closest existing bucket. */
  category: "prestamos" | "educacion";
  /** ISO country code → articles.country. */
  country: "SV";
  imageQuery: string;
  prompt: string;
  /** Optional quality-gate override (e.g. lower word floor for glossary). */
  qualityGate?: {
    minWordCount?: number;
    allowMissingTable?: boolean;
    allowMissingCallout?: boolean;
  };
};

const SEO_TARGET_YEAR = 2026;
const CREDIMOVIL_AFFILIATE_URL = "https://credimovil.io";

// ─── Shared prompt suffix (LATAM/SV variant — sister to US_SEO_SUFFIX) ────
// Carries the same Welter / E-E-A-T discipline used on the US side, adapted to
// Salvadoran context: SSF / BCR references, Spanish-CA voice, CrediMóvil
// handoff with honest sale-leaseback framing.

export const SV_CREDIMOVIL_SUFFIX = `

REGLAS GEO / WELTER — DISCIPLINA DE ENCABEZADOS (obligatorio):
- Cada H2: mínimo 8 palabras, debe cargar tema + ciudad/departamento + año cuando aplique.
- Cada H3: mínimo 6 palabras, debe responder una sub-pregunta concreta.
- PROHIBIDOS como H2/H3 sueltos: "Conclusión", "Introducción", "Preguntas frecuentes", "Cómo funciona", "Resumen", "Por qué CrediMóvil".
  Permitidos solo expandidos: "## Preguntas frecuentes sobre préstamo por carro en San Salvador en ${SEO_TARGET_YEAR}".

REGLAS GEO — INDEPENDENCIA DE CHUNKS (obligatorio):
- PROHIBIDOS al inicio de párrafo: "Como mencionamos antes", "Como vimos arriba", "Volviendo a", "Más adelante", "Antes vimos".
- Cada párrafo del cuerpo debe contener un dato local específico: una cifra (% interés, monto, plazo en meses), una fecha, una entidad nombrada (SSF, BCR, banco salvadoreño), o una referencia a estatuto.

QUERY FAN-OUT (obligatorio):
- Identifica las 5 sub-preguntas más buscadas para el tema y escribí UN H3 (terminado en signo de pregunta "?") para cada una. Primera oración del párrafo bajo el H3 responde directo.

BLOQUE DE DATOS REALES (obligatorio):
Cita al menos una fuente pública verificable con URL en markdown. Fuentes válidas:
- Superintendencia del Sistema Financiero (SSF) de El Salvador — ssf.gob.sv (datos de tasas, sanciones públicas)
- Banco Central de Reserva (BCR) — bcr.gob.sv (tasas de referencia)
- Defensoría del Consumidor — defensoria.gob.sv
- Ministerio de Hacienda — mh.gob.sv
- DIGESTYC / EHPM (datos demográficos)
- Asamblea Legislativa (asamblea.gob.sv) para textos de Ley de Protección al Consumidor o Ley de Bancos

CITATION DENSITY (obligatorio): mínimo 2 URLs distintas a fuentes autoritativas (no contar credimovil.io ni finazo.lat).

YEAR-STAMPING (obligatorio): todo dato numérico DEBE llevar el año del dato.

PATRONES PROHIBIDOS (bloquean publicación):
- Cifras de ahorro sin sustentar ("ahorrás $500 al mes").
- Marcos conspirativos sobre bancos o casas de empeño.
- Urgencia manipuladora ("solo por hoy", "últimos cupos").
- Promesas sin disclaimer ("definitivamente te aprueban").
- Llamar a CrediMóvil "prestamista" o "préstamo bancario" — es UN ARRENDAMIENTO FINANCIERO / SALE-LEASEBACK. Cuando hablés del producto de CrediMóvil específicamente, usá la terminología legal correcta ("arrendamiento financiero", "sale-leaseback", "venta con opción de recompra"). Cuando hablés del intent del usuario podés usar "préstamo por tu carro" — es la frase de búsqueda.
- Frases que sugieran que CrediMóvil es un banco o que el producto es un préstamo bancario tradicional.

FRAMING HONESTO DEL PRODUCTO (obligatorio en TODOS los artículos):
En al menos un párrafo del cuerpo, explicá la diferencia entre lo que la gente busca ("préstamo con mi carro como garantía") y lo que CrediMóvil ofrece legalmente:
"En El Salvador, lo que mucha gente conoce como 'préstamo con tu carro como garantía' suele ser un arrendamiento financiero (también llamado sale-leaseback): vos vendés tu vehículo a CrediMóvil y al mismo tiempo firmás un contrato de arrendamiento financiero para seguir manejándolo. Al terminar de pagar, recuperás la propiedad. CrediMóvil regula este producto bajo la normativa salvadoreña aplicable."

VENTAJA HONESTA VS CASA DE EMPEÑO (cuando aplique):
A diferencia de empeñar tu carro en una casa de empeño tradicional, con CrediMóvil seguís usando tu vehículo durante el plazo. No entregás llaves ni posesión. Esa es la diferencia operacional principal.

ENLACES INTERNOS — usar SOLO rutas canónicas de finazo.lat:
- Préstamos → "[ver comparador de préstamos en Finazo](/prestamos)"
- Préstamos por carro hub → "[guía de préstamo por tu carro](/prestamos-por-tu-carro)"
- Remesas → "[comparador de remesas](/remesas)"
- Seguros → "[guía de seguros](/seguros)"
- Tarjetas → "[guía de tarjetas](/tarjetas)"
- Educación financiera → "[más guías](/guias)"

ENLACE EXTERNO A CREDIMÓVIL (obligatorio en artículos de préstamo por carro):
"[Cotiza con CrediMóvil](${CREDIMOVIL_AFFILIATE_URL}?utm_source=finazo&utm_medium=editorial&utm_campaign=prestamos-carro)" — usar el UTM exacto para attribution.

DIVULGACIÓN DE AFILIADO — NO incluir dentro del artículo:
La divulgación afiliada (CrediMóvil es socio afiliado de Finazo, comisión por
referidos, etc.) vive en la página /legal y en el footer persistente del sitio
(patrón NerdWallet). NO escribas "> **Divulgación:**..." ni equivalentes
dentro del Markdown del artículo. Mencionar a CrediMóvil por nombre cuando
aplique al tema editorial es OK; agregar un callout o sección de divulgación
en el cuerpo NO es OK.

FORMATO OBLIGATORIO — CALLOUT BOX:
Después de la introducción, antes del primer H2:
> **Lo esencial:** punto 1 brevísimo.
> punto 2 brevísimo.
> punto 3 brevísimo.

Al final del artículo:
META: [meta description 150-160 caracteres con keyword principal]
KEYWORDS: [6-8 keywords separadas por comas]

Solo el artículo en Markdown — sin meta-comentarios sobre el proceso.`;

// ─── Generators ────────────────────────────────────────────────────────────

/**
 * City × intent leaf — the bulk of the cluster.
 * 10 cities × 3 intents = 30 leafs.
 */
function cityIntentTopic(city: SvGeo, intent: SvAutoFinanceIntent): CredimovilTopic {
  return {
    slug: `${intent.slug}-${city.slug}-${SEO_TARGET_YEAR}`,
    category: "prestamos",
    country: "SV",
    imageQuery: `${city.nameEs} El Salvador car driver`,
    prompt: `Eres un editor financiero salvadoreño escribiendo para Finazo. Tu trabajo es responder al usuario que busca "${intent.searchIntent}" en ${city.nameEs}, ${city.department}, en ${SEO_TARGET_YEAR}, con una guía honesta de 1300-1700 palabras en español salvadoreño.

CONTEXTO LOCAL:
- ${city.nameEs}, departamento de ${city.department}. ${city.marketNote}.
- En El Salvador la economía es dolarizada desde 2001 — todos los montos en USD.
- La SSF (Superintendencia del Sistema Financiero) regula bancos; las casas de empeño operan bajo régimen distinto.

CONTEXTO DEL PRODUCTO (este es el punto editorial central — hacelo claro):
${intent.productReality}

Keyword principal: "${intent.searchIntent} en ${city.nameEs}"
Keywords secundarias: "${intent.searchIntent} El Salvador ${SEO_TARGET_YEAR}", "sale-leaseback ${city.nameEs}", "arrendamiento financiero vehículo ${city.nameEs}"
Título H1: "${intent.searchIntent.charAt(0).toUpperCase() + intent.searchIntent.slice(1)} en ${city.nameEs}: guía honesta ${SEO_TARGET_YEAR}"

FAN-OUT OBLIGATORIO — H3 con signo de pregunta para cada sub-consulta:
1. ¿Cómo funciona un ${intent.searchIntent} en ${city.nameEs} en ${SEO_TARGET_YEAR}?
2. ¿Cuánto puedo obtener por mi carro en ${city.nameEs} en ${SEO_TARGET_YEAR}?
3. ¿Qué documentos necesito para un ${intent.searchIntent} en ${city.nameEs}?
4. ¿Cuál es la diferencia entre arrendamiento financiero y empeñar mi carro en El Salvador?
5. ¿Qué pasa si no puedo pagar las cuotas del ${intent.searchIntent} en ${city.nameEs}?

ESTRUCTURA SUGERIDA:
## [H2 expandido sobre la realidad del mercado de financiamiento con vehículo en ${city.nameEs} en ${SEO_TARGET_YEAR}]
(Cita una fuente SSF o BCR sobre tasas de referencia o marco regulatorio aplicable)

## [H2 expandido explicando la diferencia entre 'préstamo por tu carro' (lo que buscás) y arrendamiento financiero / sale-leaseback (lo que legalmente firmás)]
(Esto es CLAVE — la honestidad editorial es la cobertura legal y la confianza del lector)

## [H2 expandido sobre cómo CrediMóvil opera este modelo en El Salvador y cómo se compara con casas de empeño]
(Tabla comparativa: CrediMóvil vs casa de empeño vs préstamo bancario tradicional. Columnas: posesión del vehículo, tiempo de aprobación, requisitos, costo total)

## [H2 expandido con los documentos y requisitos típicos para ${city.nameEs}]
(Lista clara — título de propiedad, tarjeta de circulación, DUI, comprobante de ingresos)

## [H2 expandido sobre riesgos a considerar antes de firmar en ${city.nameEs}]
(Honestidad: cláusulas de incumplimiento, costo total efectivo, alternativas si no es la mejor opción para vos)

## Preguntas frecuentes sobre ${intent.searchIntent} en ${city.nameEs} en ${SEO_TARGET_YEAR}
(Las 5 sub-preguntas del fan-out arriba, cada una como H3 terminando en signo de pregunta)${SV_CREDIMOVIL_SUFFIX}`,
  };
}

/**
 * Glossary / explainer leafs — high-volume informational queries that build
 * topical authority around the sale-leaseback concept.
 */
const GLOSSARY_TOPICS: Array<{
  slug: string;
  term: string;
  category: CredimovilTopic["category"];
  shortDef: string;
  context: string;
}> = [
  {
    slug: "que-es-sale-leaseback-el-salvador",
    term: "sale-leaseback",
    category: "educacion",
    shortDef: "venta de un activo (como tu vehículo) con un contrato de arrendamiento simultáneo para seguir usándolo",
    context: "El modelo legal detrás de los 'préstamos por tu carro' en El Salvador",
  },
  {
    slug: "que-es-arrendamiento-financiero-vehiculo-el-salvador",
    term: "arrendamiento financiero de vehículo",
    category: "educacion",
    shortDef: "contrato regulado donde una compañía financiera adquiere tu vehículo y te lo arrienda con opción de compra al final",
    context: "Cómo funciona el leasing inverso aplicado a vehículos usados en El Salvador",
  },
  {
    slug: "diferencia-empenar-carro-arrendamiento-financiero",
    term: "diferencia entre empeñar carro y arrendamiento financiero",
    category: "educacion",
    shortDef: "empeñar implica entregar el vehículo a la casa de empeño; el arrendamiento financiero te permite seguir manejándolo",
    context: "Comparativa operacional y de riesgos entre los dos modelos en El Salvador",
  },
  {
    slug: "que-pasa-si-no-pago-arrendamiento-financiero-vehiculo",
    term: "incumplimiento en arrendamiento financiero de vehículo",
    category: "educacion",
    shortDef: "qué cláusulas activa el contrato cuando dejás de pagar las cuotas",
    context: "Repossession, periodos de gracia, y derechos del arrendatario en El Salvador",
  },
];

function glossaryTopic(g: typeof GLOSSARY_TOPICS[number]): CredimovilTopic {
  return {
    slug: g.slug,
    category: g.category,
    country: "SV",
    imageQuery: `${g.term} El Salvador car finance document`,
    qualityGate: { minWordCount: 900, allowMissingTable: g.category === "educacion" ? false : true },
    prompt: `Eres un educador financiero salvadoreño. Escribe una guía educativa de 1000-1300 palabras en español salvadoreño sobre "${g.term}" — uno de los conceptos centrales para entender los 'préstamos por tu carro' en El Salvador en ${SEO_TARGET_YEAR}.

Definición corta: ${g.shortDef}.
Contexto: ${g.context}.

Keyword principal: "qué es ${g.term}" / "${g.term} El Salvador"
Título H1: "${g.term.charAt(0).toUpperCase() + g.term.slice(1)} en El Salvador: qué es y cómo funciona (${SEO_TARGET_YEAR})"

FAN-OUT OBLIGATORIO — H3 con signo de pregunta:
1. ¿Qué es ${g.term} legalmente en El Salvador en ${SEO_TARGET_YEAR}?
2. ¿En qué se diferencia ${g.term} de un préstamo bancario tradicional?
3. ¿Qué documentos requiere ${g.term} en El Salvador?
4. ¿Cuáles son los riesgos de ${g.term} para el consumidor?
5. ¿Quién regula ${g.term} en El Salvador?

ESTRUCTURA SUGERIDA:
## [H2 expandido con qué es exactamente ${g.term} bajo la legislación salvadoreña en ${SEO_TARGET_YEAR}]
## [H2 expandido sobre cuándo conviene y cuándo no conviene]
(Casos reales, no marketing)
## [H2 expandido comparando con alternativas — préstamo bancario, empeño tradicional, prenda con desplazamiento]
(Tabla comparativa)
## [H2 expandido sobre quién regula esto y qué derechos tenés como consumidor]
(Cita SSF, Defensoría del Consumidor, Ley de Protección al Consumidor)
## Preguntas frecuentes sobre ${g.term} en El Salvador en ${SEO_TARGET_YEAR}${SV_CREDIMOVIL_SUFFIX}`,
  };
}

/**
 * Comparison leafs — head-to-head pages targeting decision queries.
 */
const COMPARISON_TOPICS: Array<{
  slug: string;
  title: string;
  context: string;
}> = [
  {
    slug: "credimovil-vs-casa-de-empeno-el-salvador",
    title: "CrediMóvil vs casa de empeño en El Salvador",
    context: "El usuario necesita efectivo rápido y considera ambas opciones. Hay que comparar honestamente posesión del vehículo, tasa efectiva, plazo, formalidad legal.",
  },
  {
    slug: "credimovil-vs-prestamo-bancario-con-prenda-el-salvador",
    title: "CrediMóvil vs préstamo bancario con prenda en El Salvador",
    context: "Comparativo de productos financieros formales. Bancos suelen pedir más documentación pero ofrecen mejor tasa nominal. CrediMóvil aprueba más rápido y acepta perfiles que el banco rechaza.",
  },
  {
    slug: "credimovil-vs-prenda-fiduciaria-el-salvador",
    title: "CrediMóvil (sale-leaseback) vs prenda fiduciaria en El Salvador",
    context: "Comparativo legal-financiero. Prenda fiduciaria es otra figura común — el deudor sigue con la posesión del bien pero la propiedad está afecta al pago.",
  },
  {
    slug: "credimovil-vs-prestamo-en-linea-rapido-el-salvador",
    title: "CrediMóvil vs préstamos en línea rápidos en El Salvador",
    context: "Comparativo contra apps de préstamo personal de corto plazo. CrediMóvil suele dar montos mayores porque hay un activo (vehículo) como respaldo.",
  },
];

function comparisonTopic(c: typeof COMPARISON_TOPICS[number]): CredimovilTopic {
  return {
    slug: c.slug,
    category: "prestamos",
    country: "SV",
    imageQuery: `comparison decision finance El Salvador document`,
    prompt: `Eres un editor financiero salvadoreño escribiendo una guía comparativa de 1500-1800 palabras para Finazo en ${SEO_TARGET_YEAR}.

Tema: ${c.title}
Contexto editorial: ${c.context}

Esta es contenido editorial de publisher — el lenguaje comparativo está permitido cuando se sustenta con datos públicos citados. La divulgación de la relación con CrediMóvil es obligatoria.

Keyword principal: "${c.title.toLowerCase()}"
Título H1: "${c.title}: comparativo honesto ${SEO_TARGET_YEAR}"

FAN-OUT OBLIGATORIO — H3 con signo de pregunta:
1. ¿Cuándo conviene cada opción según mi situación?
2. ¿Cuál es la diferencia de costo total entre las dos?
3. ¿Cuál es la diferencia operacional principal (posesión, documentos, tiempo)?
4. ¿Cuáles son los riesgos legales de cada opción?
5. ¿Cuál de las dos es más rápida en El Salvador?

ESTRUCTURA SUGERIDA:
## [H2 expandido sobre cómo funciona cada opción en El Salvador en ${SEO_TARGET_YEAR}]
## [H2 con tabla comparativa lado-a-lado de costo, posesión, plazo, documentos, regulación]
(Tabla con columnas claras y filas por criterio)
## [H2 expandido sobre cuándo conviene cada opción según el perfil del usuario]
## [H2 expandido sobre riesgos a considerar antes de firmar cada producto]
(NO incluyas sección de divulgación dentro del artículo — vive en /legal y en el footer del sitio)
## Preguntas frecuentes sobre ${c.title.toLowerCase()} en ${SEO_TARGET_YEAR}${SV_CREDIMOVIL_SUFFIX}`,
  };
}

/**
 * Pillar landing reference article — anchor of the cluster. Higher word
 * count, broader scope, deep cross-linking to all city/intent leafs.
 */
function pillarTopic(): CredimovilTopic {
  return {
    slug: "prestamo-por-tu-carro-el-salvador-guia-completa-2026",
    category: "prestamos",
    country: "SV",
    imageQuery: "El Salvador hispanic family car ownership",
    qualityGate: { minWordCount: 2000 },
    prompt: `Eres un editor financiero salvadoreño escribiendo el artículo pilar de Finazo sobre 'préstamos por tu carro' en El Salvador en ${SEO_TARGET_YEAR}. Esta es la guía de referencia que Google va a rankear en posición 1 para la keyword head — 2000-2500 palabras, exhaustiva, honesta.

Keyword principal: "préstamo por tu carro El Salvador"
Keywords secundarias: "empeñar carro El Salvador", "dinero rápido con mi carro El Salvador", "sale-leaseback El Salvador", "arrendamiento financiero vehículo El Salvador"
Título H1: "Préstamo por tu carro en El Salvador: guía completa ${SEO_TARGET_YEAR}"

FAN-OUT OBLIGATORIO — H3 con signo de pregunta:
1. ¿Qué es realmente un 'préstamo por tu carro' en El Salvador en ${SEO_TARGET_YEAR}?
2. ¿En qué se diferencia de empeñar mi carro en una casa de empeño tradicional?
3. ¿Cuáles son las opciones reguladas en El Salvador y cuáles son las informales?
4. ¿Qué documentos necesito y cuál es el monto máximo?
5. ¿Qué pasa si no puedo pagar las cuotas?

ESTRUCTURA SUGERIDA:
## [H2 expandido sobre por qué cada vez más salvadoreños buscan financiamiento con su vehículo como garantía en ${SEO_TARGET_YEAR}]
(Cita datos del BCR sobre demanda de crédito, o DIGESTYC sobre ingreso promedio)

## [H2 expandido explicando la diferencia legal entre 'préstamo por tu carro' (lo que la gente busca) y arrendamiento financiero / sale-leaseback (lo que se firma legalmente)]
(Este es el corazón del artículo — honestidad editorial)

## [H2 expandido con las cuatro alternativas reales en El Salvador en ${SEO_TARGET_YEAR}: arrendamiento financiero vehicular (CrediMóvil), casas de empeño tradicionales, préstamos bancarios con prenda, prenda fiduciaria]
(Tabla comparativa exhaustiva)

## [H2 expandido sobre CrediMóvil como el operador formal del modelo sale-leaseback en El Salvador]
(Cómo opera, qué documentos pide, cuánto tarda, monto máximo típico)

## [H2 expandido sobre los riesgos a considerar antes de firmar cualquier opción]
(Cláusulas, costo total, repossession, alternativas si no es la mejor opción)

## [H2 sobre dónde está disponible en El Salvador en ${SEO_TARGET_YEAR}]
(Enlaces internos a las páginas de ciudad: San Salvador, Santa Ana, San Miguel, Soyapango, Mejicanos, Santa Tecla — usá rutas /guias/{slug-de-cada-ciudad})

## Preguntas frecuentes sobre préstamos por tu carro en El Salvador en ${SEO_TARGET_YEAR}${SV_CREDIMOVIL_SUFFIX}`,
  };
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * All programmatic CrediMóvil topics. Order = priority (pillar first, then
 * comparison, then city/intent matrix, then glossary).
 */
export function getAllCredimovilTopics(): CredimovilTopic[] {
  const pillar = pillarTopic();
  const comparisons = COMPARISON_TOPICS.map(comparisonTopic);
  const cityIntent = SV_PRIMARY_CITIES.flatMap((city) =>
    SV_AUTO_FINANCE_INTENTS.map((intent) => cityIntentTopic(city, intent)),
  );
  const glossary = GLOSSARY_TOPICS.map(glossaryTopic);

  return [pillar, ...comparisons, ...cityIntent, ...glossary];
}

/** Count programmatic topics — useful for logging and acceptance checks. */
export function countCredimovilTopics(): number {
  return getAllCredimovilTopics().length;
}
