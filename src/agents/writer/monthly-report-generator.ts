/**
 * Monthly Report Generator
 * Runs on the 1st of each month.
 * Queries rate change events from the previous month, generates a data-driven
 * report article via Claude, and publishes it under /guias/remesas-[mes]-[año].
 *
 * This creates a recurring linkable data asset for SEO (journalists and bloggers
 * can cite "according to Finazo's monthly remittance report").
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { articles, rateChangeEvents, remittanceRates, remittanceProviders } from "@/lib/db/schema";
import { and, gte, lt, eq, desc } from "drizzle-orm";
import pino from "pino";
import { config } from "@/lib/config";

const logger = pino({ name: "monthly-report-generator" });
const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

type MonthlyStats = {
  month: string; // "abril 2026"
  slug: string;  // "remesas-abril-2026"
  corridors: CorridorStats[];
  totalEvents: number;
};

type CorridorStats = {
  corridor: string; // "EE.UU. → El Salvador"
  provider: string;
  avgExchangeRate: number | null;
  avgFeeFlat: number | null;
  changeCount: number;
};

const MONTH_NAMES_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

export function getReportSlugForMonth(year: number, month: number): string {
  return `remesas-${MONTH_NAMES_ES[month - 1]}-${year}`;
}

export function getReportTitleForMonth(year: number, month: number): string {
  const monthName = MONTH_NAMES_ES[month - 1];
  return `Informe de remesas ${monthName} ${year}: tasas, comisiones y tendencias`;
}

async function gatherMonthlyStats(year: number, month: number): Promise<MonthlyStats> {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const monthLabel = `${MONTH_NAMES_ES[month - 1]} ${year}`;
  const slug = getReportSlugForMonth(year, month);

  const events = await db
    .select()
    .from(rateChangeEvents)
    .where(
      and(
        gte(rateChangeEvents.createdAt, start),
        lt(rateChangeEvents.createdAt, end),
      ),
    );

  // Get current rates for context
  const rates = await db
    .select({
      fromCountry: remittanceRates.fromCountry,
      toCountry: remittanceRates.toCountry,
      exchangeRate: remittanceRates.exchangeRate,
      feeFlat: remittanceRates.feeFlat,
      providerName: remittanceProviders.name,
    })
    .from(remittanceRates)
    .innerJoin(remittanceProviders, eq(remittanceRates.providerId, remittanceProviders.id))
    .orderBy(desc(remittanceRates.scrapedAt));

  const corridorMap = new Map<string, CorridorStats>();

  for (const rate of rates) {
    const key = `${rate.fromCountry}-${rate.toCountry}-${rate.providerName}`;
    if (!corridorMap.has(key)) {
      const label = corridorLabel(rate.fromCountry, rate.toCountry);
      corridorMap.set(key, {
        corridor: label,
        provider: rate.providerName,
        avgExchangeRate: rate.exchangeRate ? parseFloat(rate.exchangeRate) : null,
        avgFeeFlat: rate.feeFlat ? parseFloat(rate.feeFlat) : null,
        changeCount: 0,
      });
    }
  }

  // Count changes per corridor/provider from events
  for (const event of events) {
    for (const stats of corridorMap.values()) {
      stats.changeCount += 1; // simplified — events don't store corridor directly
      break; // only count once per event
    }
  }

  return {
    month: monthLabel,
    slug,
    corridors: Array.from(corridorMap.values()).slice(0, 15),
    totalEvents: events.length,
  };
}

function corridorLabel(from: string, to: string): string {
  const labels: Record<string, string> = {
    "US-SV": "EE.UU. → El Salvador",
    "US-GT": "EE.UU. → Guatemala",
    "US-HN": "EE.UU. → Honduras",
    "US-MX": "EE.UU. → México",
    "US-DO": "EE.UU. → República Dominicana",
    "ES-SV": "España → El Salvador",
    "CA-SV": "Canadá → El Salvador",
    "IT-SV": "Italia → El Salvador",
    "GB-SV": "Reino Unido → El Salvador",
  };
  return labels[`${from}-${to}`] ?? `${from} → ${to}`;
}

function buildPrompt(stats: MonthlyStats): string {
  const rateRows = stats.corridors
    .map(
      (c) =>
        `- ${c.corridor} via ${c.provider}: tasa ${c.avgExchangeRate?.toFixed(4) ?? "N/A"}, comisión $${c.avgFeeFlat?.toFixed(2) ?? "N/A"}`,
    )
    .join("\n");

  return `Eres un analista financiero experto en remesas para Centroamérica. Escribe el informe mensual de remesas de ${stats.month} para Finazo.lat.

DATOS DEL MES:
${rateRows}
Total de cambios de tarifas detectados: ${stats.totalEvents}

Título H1: "${getReportTitleForMonth(
    parseInt(stats.slug.split("-").pop()!),
    MONTH_NAMES_ES.indexOf(stats.slug.split("-")[1]) + 1,
  )}"
Extensión: 900-1100 palabras

Estructura requerida:
## Resumen ejecutivo
(3-4 oraciones: lo más importante del mes para quien envía remesas)

## Tabla de tasas: ${stats.month}
(Tabla Markdown con columnas: Corredor | Proveedor | Tasa de cambio | Comisión | Lo más barato)

## Tendencias del mes
(2-3 párrafos analizando movimientos de tasas, qué subió, qué bajó, por qué)

## Ganador del mes por corredor
(Para cada corredor principal: quién ofrece la mejor relación precio/velocidad)

## Qué esperar el próximo mes
(Breve análisis de factores macroeconómicos que podrían afectar las remesas)

## Preguntas frecuentes
(3 preguntas sobre remesas de ese mes específico)

REGLAS SEO OBLIGATORIAS:
- Keyword principal "remesas ${stats.month}" en título, primeros 100 palabras y 2 subtítulos H2
- Menciona [Finazo](/remesas) al menos 2 veces con enlaces específicos por corredor:
  * EE.UU. → El Salvador: [comparar remesas EE.UU. El Salvador](/remesas/eeuu-el-salvador)
  * EE.UU. → Guatemala: [comparar remesas EE.UU. Guatemala](/remesas/eeuu-guatemala)
  * EE.UU. → Honduras: [comparar remesas EE.UU. Honduras](/remesas/eeuu-honduras)
  * EE.UU. → México: [comparar remesas EE.UU. México](/remesas/eeuu-mexico)
  * EE.UU. → Rep. Dominicana: [comparar remesas EE.UU. Rep. Dominicana](/remesas/eeuu-republica-dominicana)
- Usa negritas para datos numéricos clave

Inmediatamente después de la introducción incluye:
> **Lo esencial:** punto clave 1 — brevísimo.
> punto clave 2 — brevísimo.
> punto clave 3 — brevísimo.

Al final del artículo:
META: [meta description de 150-160 caracteres]
KEYWORDS: [lista de 6-8 keywords separadas por comas]

Solo el artículo en Markdown.`;
}

function extractMeta(content: string): { clean: string; meta: string | null; keywords: string[] } {
  const metaMatch = content.match(/^META:\s*(.+)$/m);
  const kwMatch = content.match(/^KEYWORDS:\s*(.+)$/m);

  const meta = metaMatch?.[1]?.trim() ?? null;
  const keywords = kwMatch?.[1]?.split(",").map((k) => k.trim()).filter(Boolean) ?? [];

  const clean = content
    .replace(/^META:.*$/m, "")
    .replace(/^KEYWORDS:.*$/m, "")
    .trim();

  return { clean, meta, keywords };
}

async function alreadyPublished(slug: string): Promise<boolean> {
  const rows = await db
    .select({ slug: articles.slug })
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);
  return rows.length > 0;
}

export async function generateMonthlyReport(year: number, month: number): Promise<void> {
  const slug = getReportSlugForMonth(year, month);

  if (await alreadyPublished(slug)) {
    logger.info({ slug }, "Monthly report already published — skipping");
    return;
  }

  logger.info({ year, month, slug }, "Gathering monthly stats");
  const stats = await gatherMonthlyStats(year, month);

  logger.info({ slug, corridors: stats.corridors.length }, "Generating report with Claude");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    messages: [{ role: "user", content: buildPrompt(stats) }],
  });

  const raw = response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const { clean, meta, keywords } = extractMeta(raw);

  const titleMatch = clean.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? getReportTitleForMonth(year, month);

  const wordCount = clean.split(/\s+/).length;

  await db.insert(articles).values({
    slug,
    title,
    metaDescription: meta,
    content: clean,
    category: "remesas",
    country: "LATAM",
    keywords: keywords.length > 0 ? keywords : undefined,
    wordCount,
    status: "published",
    publishedAt: new Date(),
    generatedBy: "claude",
    authorName: "Javier Keough",
  });

  logger.info({ slug, wordCount, title }, "Monthly report published");
}

// ---------------------------------------------------------------------------
// CLI entry point: node -r ts-node/register src/agents/writer/monthly-report-generator.ts
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const now = new Date();
  // Report covers the *previous* month
  const reportDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = reportDate.getFullYear();
  const month = reportDate.getMonth() + 1;

  logger.info({ year, month }, "Starting monthly report generation");

  try {
    await generateMonthlyReport(year, month);
    logger.info("Monthly report generation complete");
  } catch (err) {
    logger.error({ err }, "Monthly report generation failed");
    process.exit(1);
  }
}

// Run when executed directly
if (require.main === module) {
  void main();
}
