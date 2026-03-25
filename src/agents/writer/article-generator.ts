/**
 * Article Generation Agent
 * Polls rate_change_events every hour via cron.
 * When unprocessed events exist, generates SEO articles via Claude API.
 * Saves to articles table with status: "draft" (Javier reviews before publish).
 */

import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import {
  rateChangeEvents,
  articles,
  remittanceRates,
  remittanceProviders,
  loanProducts,
  loanProviders,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import pino from "pino";
import { config } from "@/lib/config";

const logger = pino({ name: "article-generator" });
const anthropic = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });

// ---------------------------------------------------------------------------
// Article prompts
// ---------------------------------------------------------------------------

function buildRemittanceArticlePrompt(
  providerName: string,
  fromCountry: string,
  toCountry: string,
  exchangeRate: string,
  feeFlat: string
): string {
  const countryNames: Record<string, string> = {
    SV: "El Salvador",
    GT: "Guatemala",
    HN: "Honduras",
    US: "Estados Unidos",
    ES: "España",
  };

  return `Eres un experto en finanzas personales de América Central. Escribe un artículo SEO en español sobre enviar dinero desde ${countryNames[fromCountry] ?? fromCountry} a ${countryNames[toCountry] ?? toCountry} usando ${providerName}.

Datos actuales:
- Tasa de cambio: ${exchangeRate}
- Comisión fija: $${feeFlat}

El artículo debe:
1. Tener un título optimizado para SEO (incluir "${providerName} envíos ${countryNames[toCountry] ?? toCountry} 2026")
2. Tener entre 700-1000 palabras
3. Incluir secciones: Introducción, Cómo funciona, Tarifas actuales, Ventajas y desventajas, Conclusión
4. Usar lenguaje accesible para usuarios de El Salvador/Centroamérica
5. Incluir ejemplos con montos reales (ej: "si envías $200...")
6. Mencionar alternativas para comparación
7. Incluir un meta description de 155 caracteres al final en formato: META: [texto]

Escribe SOLO el artículo en Markdown, sin comentarios adicionales.`;
}

function buildLoanRateArticlePrompt(
  bankName: string,
  loanType: string,
  rateMin: string,
  rateMax: string
): string {
  return `Eres un experto en finanzas personales de El Salvador. Escribe un artículo SEO en español sobre préstamos personales en ${bankName}.

Datos actuales (fuente: SSF - Superintendencia del Sistema Financiero):
- Tipo de préstamo: ${loanType}
- Tasa mínima: ${rateMin}% anual
- Tasa máxima: ${rateMax}% anual

El artículo debe:
1. Tener un título optimizado para SEO (incluir "${bankName} préstamos ${new Date().getFullYear()}")
2. Tener entre 700-1000 palabras
3. Incluir secciones: Introducción, Tasas de interés actuales, Requisitos, Proceso de solicitud, Comparación con otros bancos, Conclusión
4. Usar lenguaje accesible para salvadoreños
5. Incluir ejemplos concretos: cuánto pagarías mensualmente por $1,000, $5,000, $10,000
6. Mencionar que las tasas son oficiales publicadas por la SSF
7. Incluir un meta description de 155 caracteres al final en formato: META: [texto]

Escribe SOLO el artículo en Markdown, sin comentarios adicionales.`;
}

// ---------------------------------------------------------------------------
// Generate and save one article
// ---------------------------------------------------------------------------

async function generateArticle(prompt: string, slug: string, category: string, country = "SV"): Promise<void> {
  logger.info({ slug }, "Generating article");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    logger.error({ slug }, "Unexpected response type from Claude");
    return;
  }

  const fullText = content.text;

  // Extract meta description if present
  const metaMatch = fullText.match(/META:\s*(.+)$/m);
  const metaDescription = metaMatch ? metaMatch[1].trim() : null;
  const articleContent = fullText.replace(/^META:.*$/m, "").trim();

  // Extract title from first H1
  const titleMatch = articleContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : slug.replace(/-/g, " ");

  const wordCount = articleContent.split(/\s+/).length;

  await db
    .insert(articles)
    .values({
      slug,
      title,
      metaDescription,
      content: articleContent,
      category,
      country,
      wordCount,
      status: "draft",
      generatedBy: "claude",
    })
    .onConflictDoUpdate({
      target: articles.slug,
      set: {
        content: articleContent,
        title,
        metaDescription,
        wordCount,
        updatedAt: new Date(),
      },
    });

  logger.info({ slug, wordCount }, "Article saved as draft");
}

// ---------------------------------------------------------------------------
// Process pending events
// ---------------------------------------------------------------------------

export async function runArticleGenerator(): Promise<void> {
  logger.info("Checking for unprocessed rate change events");

  const pending = await db
    .select()
    .from(rateChangeEvents)
    .where(eq(rateChangeEvents.articleGenerated, false))
    .limit(5); // Process max 5 per run to avoid rate limits

  if (pending.length === 0) {
    logger.info("No pending events");
    return;
  }

  logger.info({ count: pending.length }, "Processing events");

  for (const event of pending) {
    try {
      if (event.entityType === "remittance_rate") {
        const [rate] = await db
          .select({
            exchangeRate: remittanceRates.exchangeRate,
            feeFlat: remittanceRates.feeFlat,
            fromCountry: remittanceRates.fromCountry,
            toCountry: remittanceRates.toCountry,
            providerName: remittanceProviders.name,
            providerSlug: remittanceProviders.slug,
          })
          .from(remittanceRates)
          .innerJoin(remittanceProviders, eq(remittanceRates.providerId, remittanceProviders.id))
          .where(eq(remittanceRates.id, event.entityId))
          .limit(1);

        if (rate) {
          const slug = `${rate.providerSlug}-envios-${rate.fromCountry.toLowerCase()}-a-${rate.toCountry.toLowerCase()}-${new Date().getFullYear()}`;
          const prompt = buildRemittanceArticlePrompt(
            rate.providerName,
            rate.fromCountry,
            rate.toCountry,
            rate.exchangeRate ?? "N/A",
            rate.feeFlat ?? "0"
          );
          await generateArticle(prompt, slug, "remesas", rate.toCountry);
        }
      } else if (event.entityType === "loan_product") {
        const [product] = await db
          .select({
            productName: loanProducts.productName,
            loanType: loanProducts.loanType,
            rateMin: loanProducts.rateMin,
            rateMax: loanProducts.rateMax,
            providerName: loanProviders.name,
            providerSlug: loanProviders.slug,
            country: loanProviders.country,
          })
          .from(loanProducts)
          .innerJoin(loanProviders, eq(loanProducts.providerId, loanProviders.id))
          .where(eq(loanProducts.id, event.entityId))
          .limit(1);

        if (product) {
          const slug = `${product.providerSlug}-prestamos-${product.loanType}-${new Date().getFullYear()}`;
          const prompt = buildLoanRateArticlePrompt(
            product.providerName,
            product.loanType,
            product.rateMin ?? "N/A",
            product.rateMax ?? "N/A"
          );
          await generateArticle(prompt, slug, "prestamos", product.country);
        }
      }

      // Mark as processed
      await db
        .update(rateChangeEvents)
        .set({ articleGenerated: true })
        .where(eq(rateChangeEvents.id, event.id));

      // Throttle between Claude API calls
      await new Promise((r) => setTimeout(r, 3000));
    } catch (err) {
      logger.error({ err, eventId: event.id }, "Failed to process event");
    }
  }

  logger.info("Article generator run complete");
}

if (require.main === module) {
  runArticleGenerator().catch((err) => {
    logger.error(err, "Article generator failed");
    process.exit(1);
  });
}
