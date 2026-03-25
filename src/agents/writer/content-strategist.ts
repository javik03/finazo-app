/**
 * Content Strategist — NerdWallet-style proactive article generator
 * Runs daily. Checks which evergreen topics are missing from the DB,
 * generates the top 3 unpublished ones via Claude, publishes immediately.
 *
 * Unlike article-generator.ts (reactive to rate changes),
 * this agent drives organic SEO traffic with comparison guides, FAQs,
 * and "best of" lists across all product verticals.
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { articles } from "@/lib/db/schema";
import { inArray } from "drizzle-orm";
import pino from "pino";

const logger = pino({ name: "content-strategist" });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ---------------------------------------------------------------------------
// Content calendar — NerdWallet-style evergreen topics
// Each entry maps to a unique slug. Once published, it won't regenerate.
// ---------------------------------------------------------------------------

type ContentTopic = {
  slug: string;
  category: "remesas" | "prestamos" | "seguros" | "educacion" | "tarjetas";
  country: string;
  prompt: string;
};

const CONTENT_CALENDAR: ContentTopic[] = [
  // ---- Remesas ----
  {
    slug: "como-enviar-dinero-a-el-salvador-guia-2026",
    category: "remesas",
    country: "SV",
    prompt: `Eres un experto en finanzas personales para Centroamérica. Escribe una guía completa en español sobre cómo enviar dinero a El Salvador en 2026.

La guía debe:
1. Título SEO: "Cómo enviar dinero a El Salvador en 2026: guía completa"
2. 900-1100 palabras
3. Secciones: Introducción, Los mejores servicios de remesas (Wise, Remitly, Western Union, MoneyGram), Cómo comparar tarifas, Qué tener en cuenta (tipo de cambio, comisiones, velocidad), Consejos para ahorrar en comisiones, FAQ, Conclusión
4. Mencionar que El Salvador usa el dólar USD (facilita recepción)
5. Incluir ejemplos reales: "si envías $300 desde EE.UU., recibirás..."
6. Lenguaje accesible, español centroamericano
7. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },
  {
    slug: "wise-vs-remitly-comparacion-centroamerica-2026",
    category: "remesas",
    country: "SV",
    prompt: `Eres un experto en finanzas personales para Centroamérica. Escribe un artículo comparativo en español: Wise vs Remitly para enviar remesas a Centroamérica en 2026.

La guía debe:
1. Título SEO: "Wise vs Remitly: ¿cuál es mejor para enviar remesas a Centroamérica? (2026)"
2. 900-1100 palabras
3. Secciones: Introducción, Resumen rápido (tabla comparativa), Wise en detalle (tarifas, pros, contras), Remitly en detalle (tarifas, pros, contras), ¿Cuándo usar cada uno?, Veredicto final
4. Comparar: comisiones, tipo de cambio, velocidad, métodos de pago, métodos de retiro
5. Mencionar datos reales de mercado (Wise cobra comisión baja pero muestra tasa real, Remitly tiene promos para nuevos usuarios)
6. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },
  {
    slug: "mejores-remesadoras-guatemala-2026",
    category: "remesas",
    country: "GT",
    prompt: `Eres un experto en finanzas personales para Guatemala. Escribe una guía en español sobre las mejores opciones para recibir remesas en Guatemala en 2026.

La guía debe:
1. Título SEO: "Las mejores remesadoras para Guatemala en 2026: comparativa completa"
2. 900-1100 palabras
3. Secciones: Introducción, Top 5 servicios (Remitly, Wise, Western Union, MoneyGram, Xoom), Bancos guatemaltecos que reciben remesas (Banrural, Industrial, G&T Continental), Cómo recibir dinero en quetzales vs dólares, Comisiones y tipos de cambio actuales, Consejos prácticos
4. Contexto: Guatemala recibe ~$20B/año en remesas, principalmente desde EE.UU.
5. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },
  {
    slug: "remesas-honduras-como-recibir-dinero-2026",
    category: "remesas",
    country: "HN",
    prompt: `Eres un experto en finanzas personales para Honduras. Escribe una guía en español sobre remesas hacia Honduras en 2026.

La guía debe:
1. Título SEO: "Cómo recibir remesas en Honduras en 2026: guía para familias"
2. 900-1100 palabras
3. Secciones: Introducción, Principales servicios (Remitly, Western Union, Ria Money, MoneyGram, Wise), Bancos hondureños receptores (Atlántida, Ficohsa, Davivienda, BAC), Retiro en lempiras vs dólares, Límites y tiempos de transferencia, Consejos para maximizar lo recibido
4. Contexto: Honduras recibe remesas equivalentes a ~25% del PIB, principalmente desde EE.UU.
5. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },

  // ---- Préstamos ----
  {
    slug: "como-comparar-prestamos-personales-el-salvador-2026",
    category: "prestamos",
    country: "SV",
    prompt: `Eres un experto en finanzas personales salvadoreñas. Escribe una guía completa en español sobre cómo comparar préstamos personales en El Salvador en 2026.

La guía debe:
1. Título SEO: "Cómo comparar préstamos personales en El Salvador 2026: guía oficial SSF"
2. 900-1100 palabras
3. Secciones: Introducción, Qué es la tasa de interés efectiva anual, Cómo funciona la SSF (publica tasas oficiales), Qué bancos tienen los préstamos más baratos, Tabla de tasas por tipo de préstamo, Requisitos típicos, Errores al solicitar un préstamo, FAQ
4. Mencionar: Banco Agrícola, Davivienda, BAC, Promerica, HSBC, Citi El Salvador
5. Incluir cálculo de ejemplo: préstamo $5,000 a 36 meses al 18% vs 22% → diferencia en cuotas
6. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },
  {
    slug: "prestamo-personal-vs-hipotecario-cual-conviene-2026",
    category: "prestamos",
    country: "SV",
    prompt: `Eres un experto en finanzas personales de Centroamérica. Escribe un artículo comparativo en español: préstamo personal vs préstamo hipotecario, ¿cuál te conviene?

La guía debe:
1. Título SEO: "Préstamo personal vs hipotecario: ¿cuál te conviene en 2026?"
2. 900-1100 palabras
3. Secciones: Introducción, Diferencias clave (tabla comparativa), Cuándo elegir préstamo personal, Cuándo elegir hipotecario, Tasas típicas en Centroamérica, Ejemplo numérico detallado, Conclusión
4. Enfoque práctico: compra de auto, remodelación de casa, emergencias médicas
5. Mencionar tasas reales: personal 15-30% anual, hipotecario 6-12% anual en Centroamérica
6. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },
  {
    slug: "mejores-bancos-prestamos-guatemala-sib-2026",
    category: "prestamos",
    country: "GT",
    prompt: `Eres un experto en finanzas personales guatemaltecas. Escribe una guía en español sobre los mejores bancos para préstamos personales en Guatemala en 2026.

La guía debe:
1. Título SEO: "Los mejores bancos para préstamos en Guatemala 2026 (tasas SIB oficiales)"
2. 900-1100 palabras
3. Secciones: Introducción, Cómo la SIB regula las tasas, Top bancos (Industrial, Banrural, G&T Continental, BAC, Agromercantil), Tabla de tasas por banco, Requisitos para aplicar, Cómo mejorar tu historial crediticio en Guatemala, Conclusión
4. Mencionar que la SIB publica tasas máximas y mínimas trimestralmente
5. Ejemplo: préstamo Q50,000 (~$6,400) a 24 meses
6. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },
  {
    slug: "prestamos-pyme-centroamerica-guia-2026",
    category: "prestamos",
    country: "SV",
    prompt: `Eres un experto en finanzas empresariales para Centroamérica. Escribe una guía en español sobre préstamos para PYME en Centroamérica en 2026.

La guía debe:
1. Título SEO: "Préstamos para PYME en Centroamérica 2026: guía completa para emprendedores"
2. 900-1100 palabras
3. Secciones: Introducción, Tipos de préstamos PYME disponibles, Bancos vs cooperativas vs fintechs, Tasas típicas y plazos, Garantías requeridas, Fondos gubernamentales (FONDEPRO El Salvador, PRONACOM Guatemala), Proceso paso a paso, Errores comunes
4. Enfoque práctico: negocio que necesita $10,000-$50,000 de capital de trabajo
5. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },
  {
    slug: "buro-credito-el-salvador-como-funciona-2026",
    category: "educacion",
    country: "SV",
    prompt: `Eres un experto en finanzas personales salvadoreñas. Escribe una guía en español sobre cómo funciona el Buró de Crédito en El Salvador.

La guía debe:
1. Título SEO: "Buró de Crédito en El Salvador 2026: qué es, cómo funciona y cómo mejorar tu historial"
2. 900-1100 palabras
3. Secciones: Introducción, Qué es el Buró de Crédito (DICOM/Equifax en SV), Cómo afecta tu acceso a préstamos, Cómo consultar tu historial de crédito gratis, Qué factores mejoran tu score, Qué errores dañan tu crédito, Cómo recuperar un historial negativo, FAQ
4. Mencionar: SSF supervisa el sistema crediticio en El Salvador
5. Consejos prácticos y accionables
6. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },
  {
    slug: "tasa-de-interes-efectiva-anual-que-es-centroamerica",
    category: "educacion",
    country: "SV",
    prompt: `Eres un experto en finanzas personales de Centroamérica. Escribe una guía educativa en español sobre la tasa de interés efectiva anual (TEA).

La guía debe:
1. Título SEO: "¿Qué es la tasa de interés efectiva anual (TEA)? Guía para Centroamérica"
2. 800-1000 palabras
3. Secciones: Introducción, Tasa nominal vs tasa efectiva anual, Cómo calcular la TEA, Por qué importa al comparar préstamos, Ejemplos concretos con diferentes bancos, Cómo usar Finazo para comparar, Conclusión
4. Incluir fórmula simple: TEA = (1 + tasa nominal/n)^n - 1
5. Ejemplo: banco A ofrece 18% nominal mensual vs banco B 19% anual — ¿cuál es más barato?
6. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },

  // ---- Tarjetas de crédito ----
  {
    slug: "tarjetas-credito-el-salvador-guia-2026",
    category: "tarjetas",
    country: "SV",
    prompt: `Eres un experto en finanzas personales salvadoreñas. Escribe una guía completa en español sobre tarjetas de crédito en El Salvador en 2026.

La guía debe:
1. Título SEO: "Tarjetas de crédito en El Salvador 2026: guía completa para elegir la mejor"
2. 900-1100 palabras
3. Secciones: Introducción, Cómo funcionan las tarjetas de crédito, Principales tarjetas disponibles (Visa/MC de Banco Agrícola, Davivienda, BAC, Promerica), Tasas de interés típicas (20-35% anual en SV), Beneficios y cashback, Cómo evitar caer en deuda, Cuándo conviene usar tarjeta vs efectivo, FAQ
4. Advertencia sobre tasas de interés altas en tarjetas vs préstamos personales
5. Ejemplos concretos de costos si no pagas a tiempo
6. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },
  {
    slug: "como-usar-tarjeta-credito-sin-endeudarse-centroamerica",
    category: "tarjetas",
    country: "SV",
    prompt: `Eres un experto en educación financiera para Centroamérica. Escribe una guía práctica en español sobre cómo usar tarjetas de crédito inteligentemente sin endeudarse.

La guía debe:
1. Título SEO: "Cómo usar tu tarjeta de crédito sin endeudarte: 10 reglas de oro para Centroamérica"
2. 800-1000 palabras
3. Formato: lista de 10 reglas con explicación de cada una
4. Reglas a incluir: pagar el saldo completo cada mes, usar solo el 30% del límite, activar alertas de gasto, evitar sacar efectivo con la tarjeta, comparar tasas antes de aplicar, entender el período de gracia, etc.
5. Lenguaje accesible, ejemplos de la vida cotidiana centroamericana
6. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },

  // ---- Seguros ----
  {
    slug: "seguro-de-vida-el-salvador-guia-2026",
    category: "seguros",
    country: "SV",
    prompt: `Eres un experto en seguros para Centroamérica. Escribe una guía en español sobre el seguro de vida en El Salvador en 2026.

La guía debe:
1. Título SEO: "Seguro de vida en El Salvador 2026: qué es, cuánto cuesta y cómo elegir"
2. 900-1100 palabras
3. Secciones: Introducción, Por qué tener seguro de vida, Tipos de seguro de vida (temporal, permanente, dotal), Cuánto cuesta en El Salvador, Principales aseguradoras (SISA, ASSA, Seguros Universales, Scotia Seguros), Cómo calcular cuánta cobertura necesitas, Pasos para contratar, FAQ
4. Mencionar SSF supervisa aseguradoras en El Salvador
5. Ejemplo de precio: seguro de $50,000 de cobertura para hombre 35 años, no fumador
6. META description 155 caracteres al final: META: [texto]

Solo el artículo en Markdown.`,
  },
];

// ---------------------------------------------------------------------------
// Generate and save one evergreen article (published immediately)
// ---------------------------------------------------------------------------

async function generateEvergreenArticle(topic: ContentTopic): Promise<void> {
  logger.info({ slug: topic.slug }, "Generating evergreen article");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: topic.prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    logger.error({ slug: topic.slug }, "Unexpected response type from Claude");
    return;
  }

  const fullText = content.text;

  const metaMatch = fullText.match(/META:\s*(.+)$/m);
  const metaDescription = metaMatch ? metaMatch[1].trim() : null;
  const articleContent = fullText.replace(/^META:.*$/m, "").trim();

  const titleMatch = articleContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : topic.slug.replace(/-/g, " ");
  const wordCount = articleContent.split(/\s+/).length;

  await db
    .insert(articles)
    .values({
      slug: topic.slug,
      title,
      metaDescription,
      content: articleContent,
      category: topic.category,
      country: topic.country,
      wordCount,
      status: "draft",
      generatedBy: "claude",
    })
    .onConflictDoNothing(); // never overwrite existing articles

  logger.info({ slug: topic.slug, wordCount, category: topic.category }, "Evergreen article saved as draft — review at /admin");
}

// ---------------------------------------------------------------------------
// Main runner
// ---------------------------------------------------------------------------

export async function runContentStrategist(): Promise<void> {
  logger.info("Content strategist starting");

  // Find which slugs already exist
  const allSlugs = CONTENT_CALENDAR.map((t) => t.slug);
  const existing = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(inArray(articles.slug, allSlugs));

  const existingSlugs = new Set(existing.map((r) => r.slug));
  const missing = CONTENT_CALENDAR.filter((t) => !existingSlugs.has(t.slug));

  if (missing.length === 0) {
    logger.info("All evergreen articles already published — nothing to do");
    return;
  }

  logger.info({ total: missing.length }, "Missing evergreen articles found");

  // Generate up to 3 per run to respect API rate limits
  const batch = missing.slice(0, 3);

  for (const topic of batch) {
    try {
      await generateEvergreenArticle(topic);
      // Throttle between Claude API calls
      await new Promise((r) => setTimeout(r, 4000));
    } catch (err) {
      logger.error({ err, slug: topic.slug }, "Failed to generate evergreen article");
    }
  }

  logger.info({ generated: batch.length }, "Content strategist run complete");
}

if (require.main === module) {
  runContentStrategist().catch((err) => {
    logger.error(err, "Content strategist failed");
    process.exit(1);
  });
}
