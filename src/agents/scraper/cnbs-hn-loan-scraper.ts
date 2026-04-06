/**
 * CNBS Honduras Loan Rate Scraper
 * Scrapes Comisión Nacional de Bancos y Seguros (Honduras) published rates.
 * URL: https://www.cnbs.gob.hn/
 * CNBS publishes "Tasas de Interés" for all regulated entities.
 * Runs daily via cron.
 */

import { db } from "@/lib/db";
import { loanProviders, loanProducts, rateChangeEvents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import pino from "pino";

const logger = pino({ name: "cnbs-hn-loan-scraper" });

// CNBS publishes monthly lending rate tables
const CNBS_RATES_URL =
  "https://www.cnbs.gob.hn/estadisticas/tasas-de-interes/";

const CNBS_RATES_FALLBACK_URL =
  "https://www.cnbs.gob.hn/sector-bancario/tasas-activas-promedio/";

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
        "Accept-Language": "es-HN,es;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      logger.warn({ url, status: res.status }, "CNBS page non-200");
      return null;
    }
    return res.text();
  } catch (err) {
    logger.error({ err, url }, "Failed to fetch CNBS page");
    return null;
  }
}

function parseCNBSRates(html: string): ParsedLoanRate[] {
  const rates: ParsedLoanRate[] = [];

  const tableRowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;

  // Known HN banks
  const knownBanks = [
    "Atlántida", "Occidente", "BAC", "Ficohsa", "Davivienda",
    "Banhprovi", "Lafise", "Popular", "Promerica", "Honduras",
    "Bancatlan", "Continental", "Citi", "BCIE", "Banpaís",
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

    const bankName = cells[0];
    const productDesc = cells[1] ?? "personal";
    const rateStr = cells[cells.length - 1];
    const currency = cells.some((c) => c.includes("USD") || c.includes("US")) ? "USD" : "HNL";

    const rate = parseFloat(rateStr.replace(",", ".").replace("%", ""));
    if (isNaN(rate) || rate <= 0 || rate > 100) continue;

    const isBankRow = knownBanks.some((b) =>
      bankName.toLowerCase().includes(b.toLowerCase())
    ) || /banco|financiera|cooperativa|ahorro/i.test(bankName);

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
      rateMin: parseFloat((rate * 0.92).toFixed(2)),
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
    .where(eq(loanProviders.country, "HN"));

  const provider = existing.find(
    (p) => p.name.toLowerCase().includes(rate.bankName.toLowerCase().split(" ")[0])
  );

  if (!provider) {
    const slug = rate.bankName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-hn";

    const [created] = await db
      .insert(loanProviders)
      .values({
        name: rate.bankName,
        slug,
        providerType: "bank",
        country: "HN",
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
      ssfRateSource: true,
    });

    logger.info({ bank: rate.bankName }, "Created new HN provider");
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
      oldValue: { rateMin: prevMin, country: "HN" },
      newValue: { rateMin: rate.rateMin, country: "HN" },
    });
    logger.info({ bank: rate.bankName, old: prevMin, new: rate.rateMin }, "HN rate change");
  }
}

export async function runCNBSHNScraper(): Promise<void> {
  logger.info("Starting CNBS Honduras loan rate scraper");

  let html = await fetchPage(CNBS_RATES_URL);
  if (!html) {
    logger.warn("Primary CNBS URL failed, trying fallback");
    html = await fetchPage(CNBS_RATES_FALLBACK_URL);
  }
  if (!html) {
    logger.error("Both CNBS HN URLs failed");
    return;
  }

  const rates = parseCNBSRates(html);
  logger.info({ count: rates.length }, "Parsed HN rates");

  if (rates.length === 0) {
    logger.warn("No HN rates parsed — CNBS page structure may differ, check manually");
    return;
  }

  for (const rate of rates) {
    await upsertRate(rate);
  }

  logger.info("CNBS Honduras scraper complete");
}

if (require.main === module) {
  runCNBSHNScraper().catch((err) => {
    logger.error(err, "CNBS HN scraper failed");
    process.exit(1);
  });
}
