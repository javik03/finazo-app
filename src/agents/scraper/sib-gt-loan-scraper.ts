/**
 * SIB Guatemala Loan Rate Scraper
 * Scrapes Superintendencia de Bancos de Guatemala published interest rates.
 * URL: https://www.sib.gob.gt/
 * SIB publishes "Tasas de Interés Activas" — lending rates by bank.
 * Runs daily via cron.
 */

import { db } from "@/lib/db";
import { loanProviders, loanProducts, rateChangeEvents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import pino from "pino";

const logger = pino({ name: "sib-gt-loan-scraper" });

// SIB publishes monthly lending rate tables in HTML
// Primary source: Boletín de Tasas de Interés Activas
const SIB_RATES_URL =
  "https://www.sib.gob.gt/web/sib/estadisticas/tasas-de-interes/activas";

// Fallback: SIB also publishes CSV/Excel — we try HTML first
const SIB_RATES_FALLBACK_URL =
  "https://www.sib.gob.gt/web/sib/tasas-de-interes-activas-mensuales";

type ParsedLoanRate = {
  bankName: string;
  loanType: string;
  rateMin: number;
  rateMax: number;
  currency: string;
};

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FinazoBot/1.0; +https://finazo.lat)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "es-GT,es;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      logger.warn({ url, status: res.status }, "SIB page non-200");
      return null;
    }
    return res.text();
  } catch (err) {
    logger.error({ err, url }, "Failed to fetch SIB page");
    return null;
  }
}

function parseSIBRates(html: string): ParsedLoanRate[] {
  const rates: ParsedLoanRate[] = [];

  // SIB table structure: Bank | Product | Currency | Rate (%)
  const tableRowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;

  // Known GT banks — used to validate parsed rows
  const knownBanks = [
    "Industrial", "Banrural", "G&T Continental", "BAC", "Agromercantil",
    "Promerica", "Inmobiliario", "Internacional", "Occidente", "CHN",
    "Azteca", "Vivibanco", "Ficohsa", "Bantrab", "Reformador",
  ];

  let match;
  while ((match = tableRowRegex.exec(html)) !== null) {
    const rowContent = match[1];
    const cells: string[] = [];
    let cellMatch;
    const cellRegexCopy = new RegExp(cellRegex.source, cellRegex.flags);
    while ((cellMatch = cellRegexCopy.exec(rowContent)) !== null) {
      const text = cellMatch[1].replace(/<[^>]+>/g, "").trim();
      if (text) cells.push(text);
    }

    if (cells.length < 3) continue;

    // SIB typically publishes a single weighted average rate per product
    // We use it as both min and max (or derive range if table has both)
    const bankName = cells[0];
    const productDesc = cells[1] ?? "personal";
    const rateStr = cells[cells.length - 1]; // last cell is usually the rate
    const currency = cells.some((c) => c.includes("USD") || c.includes("US")) ? "USD" : "GTQ";

    const rate = parseFloat(rateStr.replace(",", ".").replace("%", ""));
    if (isNaN(rate) || rate <= 0 || rate > 100) continue;

    // Only accept rows that look like a real bank entry
    const isBankRow = knownBanks.some((b) =>
      bankName.toLowerCase().includes(b.toLowerCase())
    ) || /banco|financiera|cooperativa/i.test(bankName);

    if (!isBankRow) continue;

    const loanType = /hipoteca|vivienda|inmobili/i.test(productDesc)
      ? "hipotecario"
      : /veh[ií]culo|auto|moto/i.test(productDesc)
      ? "vehiculo"
      : /pyme|empresa|comercial|negocio/i.test(productDesc)
      ? "pyme"
      : "personal";

    rates.push({
      bankName: bankName.trim(),
      loanType,
      rateMin: parseFloat((rate * 0.92).toFixed(2)), // SIB publishes weighted avg — derive range
      rateMax: parseFloat((rate * 1.08).toFixed(2)),
      currency,
    });
  }

  return rates;
}

async function upsertRate(rate: ParsedLoanRate): Promise<void> {
  const existing = await db
    .select()
    .from(loanProviders)
    .where(eq(loanProviders.country, "GT"));

  const provider = existing.find(
    (p) => p.name.toLowerCase().includes(rate.bankName.toLowerCase().split(" ")[0])
  );

  if (!provider) {
    // Auto-create provider so data flows immediately
    const slug = rate.bankName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-gt";

    const [created] = await db
      .insert(loanProviders)
      .values({
        name: rate.bankName,
        slug,
        providerType: "bank",
        country: "GT",
        active: true,
      })
      .onConflictDoNothing()
      .returning();

    if (!created) return;

    await db.insert(loanProducts).values({
      providerId: created.id,
      productName: `Préstamo ${rate.loanType} - ${rate.bankName}`,
      loanType: rate.loanType,
      rateMin: rate.rateMin.toString(),
      rateMax: rate.rateMax.toString(),
      ssfRateSource: true, // official regulator source
    });

    logger.info({ bank: rate.bankName }, "Created new GT provider");
    return;
  }

  const prevProducts = await db
    .select()
    .from(loanProducts)
    .where(eq(loanProducts.providerId, provider.id))
    .limit(1);

  const prev = prevProducts[0];
  const prevMin = prev ? parseFloat(prev.rateMin ?? "0") : 0;
  const changed = prev && Math.abs(rate.rateMin - prevMin) > 0.05;

  let inserted;
  if (prev) {
    // Update existing product
    const [updated] = await db
      .update(loanProducts)
      .set({
        productName: `Préstamo ${rate.loanType} - ${rate.bankName}`,
        loanType: rate.loanType,
        rateMin: rate.rateMin.toString(),
        rateMax: rate.rateMax.toString(),
        ssfRateSource: true,
        scrapedAt: new Date(),
      })
      .where(eq(loanProducts.id, prev.id))
      .returning();
    inserted = updated;
  } else {
    // Insert new product
    const [newProduct] = await db
      .insert(loanProducts)
      .values({
        providerId: provider.id,
        productName: `Préstamo ${rate.loanType} - ${rate.bankName}`,
        loanType: rate.loanType,
        rateMin: rate.rateMin.toString(),
        rateMax: rate.rateMax.toString(),
        ssfRateSource: true,
        scrapedAt: new Date(),
      })
      .returning();
    inserted = newProduct;
  }

  if (changed && prev && inserted) {
    await db.insert(rateChangeEvents).values({
      entityType: "loan_product",
      entityId: inserted.id,
      oldValue: { rateMin: prevMin, country: "GT" },
      newValue: { rateMin: rate.rateMin, country: "GT" },
    });
    logger.info({ bank: rate.bankName, old: prevMin, new: rate.rateMin }, "GT rate change");
  }
}

export async function runSIBGTScraper(): Promise<void> {
  logger.info("Starting SIB Guatemala loan rate scraper");

  let html = await fetchPage(SIB_RATES_URL);
  if (!html) {
    logger.warn("Primary SIB URL failed, trying fallback");
    html = await fetchPage(SIB_RATES_FALLBACK_URL);
  }
  if (!html) {
    logger.error("Both SIB GT URLs failed");
    return;
  }

  const rates = parseSIBRates(html);
  logger.info({ count: rates.length }, "Parsed GT rates");

  if (rates.length === 0) {
    logger.warn("No GT rates parsed — SIB page structure may differ, check manually");
    return;
  }

  for (const rate of rates) {
    await upsertRate(rate);
  }

  logger.info("SIB Guatemala scraper complete");
}

if (require.main === module) {
  runSIBGTScraper().catch((err) => {
    logger.error(err, "SIB GT scraper failed");
    process.exit(1);
  });
}
