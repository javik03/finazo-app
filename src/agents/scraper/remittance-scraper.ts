/**
 * Remittance Rate Scraper
 * Runs every 6 hours via cron.
 * Sources: Wise public API, Remitly calculator, Western Union rates page.
 */

import { db } from "@/lib/db";
import { remittanceProviders, remittanceRates, rateChangeEvents } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import pino from "pino";

const logger = pino({ name: "remittance-scraper" });

// Corridors to scrape (MVP)
const CORRIDORS = [
  { fromCountry: "US", toCountry: "SV", fromCurrency: "USD", toCurrency: "USD" },
  { fromCountry: "US", toCountry: "GT", fromCurrency: "USD", toCurrency: "GTQ" },
  { fromCountry: "US", toCountry: "HN", fromCurrency: "USD", toCurrency: "HNL" },
  { fromCountry: "ES", toCountry: "SV", fromCurrency: "EUR", toCurrency: "USD" },
];

// ---------------------------------------------------------------------------
// Wise public rates API (no auth required)
// ---------------------------------------------------------------------------

async function scrapeWise(
  fromCurrency: string,
  toCurrency: string
): Promise<{ exchangeRate: number; feeFlat: number; transferSpeed: string } | null> {
  try {
    const url = `https://wise.com/rates/history+live?source=${fromCurrency}&target=${toCurrency}&length=1&resolution=hourly&unit=day`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const rate = data?.value ?? null;
    if (!rate) return null;
    return {
      exchangeRate: rate,
      feeFlat: toCurrency === "USD" ? 2.0 : 3.5, // approximate flat fee
      transferSpeed: "instant",
    };
  } catch (err) {
    logger.error({ err }, "Wise scrape failed");
    return null;
  }
}

// ---------------------------------------------------------------------------
// Remitly — scrape public calculator
// ---------------------------------------------------------------------------

async function scrapeRemitly(
  fromCountry: string,
  toCountry: string,
  fromCurrency: string,
  toCurrency: string
): Promise<{ exchangeRate: number; feeFlat: number } | null> {
  try {
    // Remitly has a public JSON endpoint used by their calculator
    const url = `https://www.remitly.com/rates/?sendAmount=200&sendCurrency=${fromCurrency}&receiveCountry=${toCountry.toLowerCase()}&receiveCurrency=${toCurrency}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    // Shape varies — parse best effort
    const rate = data?.exchangeRate ?? data?.rate ?? null;
    if (!rate) return null;
    return {
      exchangeRate: parseFloat(rate),
      feeFlat: parseFloat(data?.fee ?? "2.99"),
    };
  } catch (err) {
    logger.error({ err }, "Remitly scrape failed");
    return null;
  }
}

// ---------------------------------------------------------------------------
// Main scraper loop
// ---------------------------------------------------------------------------

async function upsertRate(
  providerId: string,
  corridor: (typeof CORRIDORS)[0],
  rateData: { exchangeRate: number; feeFlat: number; transferSpeed?: string }
): Promise<void> {
  // Check if rate changed significantly (>0.1%)
  const existing = await db
    .select()
    .from(remittanceRates)
    .where(
      and(
        eq(remittanceRates.providerId, providerId),
        eq(remittanceRates.fromCountry, corridor.fromCountry),
        eq(remittanceRates.toCountry, corridor.toCountry)
      )
    )
    .limit(1);

  const prevRate = existing[0];
  const prevValue = prevRate ? parseFloat(prevRate.exchangeRate ?? "0") : 0;
  const changed = Math.abs(rateData.exchangeRate - prevValue) / (prevValue || 1) > 0.001;

  const [inserted] = await db
    .insert(remittanceRates)
    .values({
      providerId,
      fromCountry: corridor.fromCountry,
      toCountry: corridor.toCountry,
      fromCurrency: corridor.fromCurrency,
      toCurrency: corridor.toCurrency,
      exchangeRate: rateData.exchangeRate.toString(),
      feeFlat: rateData.feeFlat.toString(),
      transferSpeed: rateData.transferSpeed ?? "1-3 days",
    })
    .returning();

  if (changed && prevRate) {
    await db.insert(rateChangeEvents).values({
      entityType: "remittance_rate",
      entityId: inserted.id,
      oldValue: { exchangeRate: prevValue },
      newValue: { exchangeRate: rateData.exchangeRate },
    });
    logger.info({ corridor, old: prevValue, new: rateData.exchangeRate }, "Rate change logged");
  }
}

export async function runRemittanceScraper(): Promise<void> {
  logger.info("Starting remittance scraper");

  const providers = await db
    .select()
    .from(remittanceProviders)
    .where(eq(remittanceProviders.active, true));

  for (const corridor of CORRIDORS) {
    // Wise
    const wiseProvider = providers.find((p) => p.slug === "wise");
    if (wiseProvider) {
      const data = await scrapeWise(corridor.fromCurrency, corridor.toCurrency);
      if (data) {
        await upsertRate(wiseProvider.id, corridor, data);
        logger.info({ corridor, provider: "wise", rate: data.exchangeRate }, "Scraped");
      }
    }

    // Remitly
    const remitlyProvider = providers.find((p) => p.slug === "remitly");
    if (remitlyProvider) {
      const data = await scrapeRemitly(
        corridor.fromCountry,
        corridor.toCountry,
        corridor.fromCurrency,
        corridor.toCurrency
      );
      if (data) {
        await upsertRate(remitlyProvider.id, corridor, { ...data, transferSpeed: "instant" });
        logger.info({ corridor, provider: "remitly", rate: data.exchangeRate }, "Scraped");
      }
    }

    // Throttle between requests
    await new Promise((r) => setTimeout(r, 2000));
  }

  logger.info("Remittance scraper complete");
}

// Run directly: npx tsx src/agents/scraper/remittance-scraper.ts
if (require.main === module) {
  runRemittanceScraper().catch((err) => {
    logger.error(err, "Scraper failed");
    process.exit(1);
  });
}
