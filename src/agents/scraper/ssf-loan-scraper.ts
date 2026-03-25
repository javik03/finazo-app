/**
 * SSF Loan Rate Scraper
 * Scrapes Superintendencia del Sistema Financiero (El Salvador) published rates.
 * URL: https://www.ssf.gob.sv/
 * Runs daily via cron — SSF updates rates monthly but we check daily.
 */

import { db } from "@/lib/db";
import { loanProviders, loanProducts, rateChangeEvents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import pino from "pino";

const logger = pino({ name: "ssf-loan-scraper" });

// SSF publishes "Tasas de Interés del Sistema Financiero" as an HTML table
// This is public, authoritative, zero legal risk data
const SSF_RATES_URL =
  "https://www.ssf.gob.sv/estadisticas/tasas-de-interes/tasas-de-interes-del-sistema-financiero/";

type ParsedLoanRate = {
  bankName: string;
  loanType: string;
  rateMin: number;
  rateMax: number;
};

async function fetchSSFPage(): Promise<string | null> {
  try {
    const res = await fetch(SSF_RATES_URL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FinazoBot/1.0)" },
    });
    if (!res.ok) {
      logger.warn({ status: res.status }, "SSF page returned non-200");
      return null;
    }
    return res.text();
  } catch (err) {
    logger.error({ err }, "Failed to fetch SSF page");
    return null;
  }
}

function parseSSFRates(html: string): ParsedLoanRate[] {
  const rates: ParsedLoanRate[] = [];

  // SSF HTML table structure: parse rows containing bank rates
  // Table rows typically: | Bank Name | Product | Rate Min | Rate Max |
  // Simple regex approach — upgrade to cheerio if structure changes significantly
  const tableRowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;

  let match;
  while ((match = tableRowRegex.exec(html)) !== null) {
    const rowContent = match[1];
    const cells: string[] = [];
    let cellMatch;
    const cellRegexCopy = new RegExp(cellRegex.source, cellRegex.flags);
    while ((cellMatch = cellRegexCopy.exec(rowContent)) !== null) {
      // Strip HTML tags and trim
      const text = cellMatch[1].replace(/<[^>]+>/g, "").trim();
      cells.push(text);
    }

    if (cells.length >= 4) {
      const rateMin = parseFloat(cells[2].replace(",", ".").replace("%", ""));
      const rateMax = parseFloat(cells[3].replace(",", ".").replace("%", ""));

      if (!isNaN(rateMin) && !isNaN(rateMax) && cells[0] && cells[1]) {
        rates.push({
          bankName: cells[0],
          loanType: cells[1].toLowerCase().includes("personal") ? "personal" : "other",
          rateMin,
          rateMax,
        });
      }
    }
  }

  return rates;
}

export async function runSSFScraper(): Promise<void> {
  logger.info("Starting SSF loan rate scraper");

  const html = await fetchSSFPage();
  if (!html) {
    logger.warn("No HTML from SSF, skipping");
    return;
  }

  const parsed = parseSSFRates(html);
  logger.info({ count: parsed.length }, "Parsed rates from SSF");

  if (parsed.length === 0) {
    logger.warn("No rates parsed — SSF page structure may have changed");
    return;
  }

  const existingProviders = await db
    .select()
    .from(loanProviders)
    .where(eq(loanProviders.country, "SV"));

  for (const rate of parsed) {
    const provider = existingProviders.find(
      (p) => p.name.toLowerCase() === rate.bankName.toLowerCase()
    );

    if (!provider) {
      logger.info({ bankName: rate.bankName }, "Provider not in DB, skipping — add manually");
      continue;
    }

    // Check for existing product to detect rate changes
    const existing = await db
      .select()
      .from(loanProducts)
      .where(eq(loanProducts.providerId, provider.id))
      .limit(1);

    const prev = existing[0];

    const [inserted] = await db
      .insert(loanProducts)
      .values({
        providerId: provider.id,
        productName: `Préstamo ${rate.loanType} - ${rate.bankName}`,
        loanType: rate.loanType,
        rateMin: rate.rateMin.toString(),
        rateMax: rate.rateMax.toString(),
        ssfRateSource: true,
      })
      .returning();

    if (prev) {
      const prevMin = parseFloat(prev.rateMin ?? "0");
      const changed = Math.abs(rate.rateMin - prevMin) > 0.01;
      if (changed) {
        await db.insert(rateChangeEvents).values({
          entityType: "loan_product",
          entityId: inserted.id,
          oldValue: { rateMin: prevMin },
          newValue: { rateMin: rate.rateMin },
        });
        logger.info({ bank: rate.bankName, old: prevMin, new: rate.rateMin }, "Rate change logged");
      }
    }
  }

  logger.info("SSF scraper complete");
}

if (require.main === module) {
  runSSFScraper().catch((err) => {
    logger.error(err, "SSF scraper failed");
    process.exit(1);
  });
}
