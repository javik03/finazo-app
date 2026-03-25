/**
 * Seed initial provider data
 * Run once: npx tsx src/db/seed.ts
 */

import { db } from "@/lib/db";
import {
  remittanceProviders,
  loanProviders,
  insuranceProviders,
  remittanceRates,
  loanProducts,
} from "@/lib/db/schema";
import pino from "pino";

const logger = pino({ name: "seed" });

async function seed() {
  logger.info("Seeding providers...");

  // ---------------------------------------------------------------------------
  // Remittance providers
  // ---------------------------------------------------------------------------
  const [wise, remitly, westernUnion, moneyGram, worldRemit] = await db
    .insert(remittanceProviders)
    .values([
      {
        name: "Wise",
        slug: "wise",
        affiliateUrl: "https://wise.com/invite/u/finazo",
        active: true,
      },
      {
        name: "Remitly",
        slug: "remitly",
        affiliateUrl: "https://www.remitly.com/?utm_source=finazo",
        active: true,
      },
      {
        name: "Western Union",
        slug: "western-union",
        affiliateUrl: "https://www.westernunion.com/?utm_source=finazo",
        active: true,
      },
      {
        name: "MoneyGram",
        slug: "moneygram",
        affiliateUrl: "https://www.moneygram.com/?utm_source=finazo",
        active: true,
      },
      {
        name: "WorldRemit",
        slug: "worldremit",
        affiliateUrl: "https://www.worldremit.com/?utm_source=finazo",
        active: true,
      },
    ])
    .onConflictDoNothing()
    .returning();

  logger.info("Remittance providers seeded");

  // ---------------------------------------------------------------------------
  // Seed static remittance rates (US → SV corridor — updated by scraper later)
  // ---------------------------------------------------------------------------
  if (wise) {
    await db
      .insert(remittanceRates)
      .values({
        providerId: wise.id,
        fromCountry: "US",
        toCountry: "SV",
        fromCurrency: "USD",
        toCurrency: "USD",
        exchangeRate: "1.000000",
        feeFlat: "2.00",
        feePercent: "0.0000",
        transferSpeed: "instant",
        minAmount: "1.00",
        maxAmount: "50000.00",
      })
      .onConflictDoNothing();
  }

  if (remitly) {
    await db
      .insert(remittanceRates)
      .values({
        providerId: remitly.id,
        fromCountry: "US",
        toCountry: "SV",
        fromCurrency: "USD",
        toCurrency: "USD",
        exchangeRate: "1.000000",
        feeFlat: "2.99",
        feePercent: "0.0000",
        transferSpeed: "instant",
        minAmount: "1.00",
        maxAmount: "10000.00",
      })
      .onConflictDoNothing();
  }

  if (westernUnion) {
    await db
      .insert(remittanceRates)
      .values({
        providerId: westernUnion.id,
        fromCountry: "US",
        toCountry: "SV",
        fromCurrency: "USD",
        toCurrency: "USD",
        exchangeRate: "1.000000",
        feeFlat: "5.00",
        feePercent: "0.0000",
        transferSpeed: "1-3 days",
        minAmount: "1.00",
        maxAmount: "5000.00",
      })
      .onConflictDoNothing();
  }

  if (moneyGram) {
    await db
      .insert(remittanceRates)
      .values({
        providerId: moneyGram.id,
        fromCountry: "US",
        toCountry: "SV",
        fromCurrency: "USD",
        toCurrency: "USD",
        exchangeRate: "1.000000",
        feeFlat: "4.99",
        feePercent: "0.0000",
        transferSpeed: "instant",
        minAmount: "1.00",
        maxAmount: "10000.00",
      })
      .onConflictDoNothing();
  }

  if (worldRemit) {
    await db
      .insert(remittanceRates)
      .values({
        providerId: worldRemit.id,
        fromCountry: "US",
        toCountry: "SV",
        fromCurrency: "USD",
        toCurrency: "USD",
        exchangeRate: "1.000000",
        feeFlat: "1.99",
        feePercent: "0.0000",
        transferSpeed: "instant",
        minAmount: "1.00",
        maxAmount: "8000.00",
      })
      .onConflictDoNothing();
  }

  logger.info("Remittance rates seeded");

  // ---------------------------------------------------------------------------
  // Loan providers (El Salvador — SSF-regulated banks)
  // ---------------------------------------------------------------------------
  const loanProviderRows = await db
    .insert(loanProviders)
    .values([
      { name: "Banco Agrícola", slug: "banco-agricola", providerType: "bank", country: "SV", active: true },
      { name: "Banco Davivienda", slug: "davivienda", providerType: "bank", country: "SV", active: true },
      { name: "BAC El Salvador", slug: "bac-el-salvador", providerType: "bank", country: "SV", active: true },
      { name: "Banco Cuscatlán", slug: "banco-cuscatlan", providerType: "bank", country: "SV", active: true },
      { name: "Banco Hipotecario", slug: "banco-hipotecario", providerType: "bank", country: "SV", active: true },
      { name: "Promerica", slug: "promerica", providerType: "bank", country: "SV", active: true },
      { name: "Credimovil", slug: "credimovil", providerType: "fintech", country: "SV", affiliateUrl: "https://credimovil.com?utm_source=finazo", active: true },
    ])
    .onConflictDoNothing()
    .returning();

  logger.info("Loan providers seeded");

  // Seed loan products with approximate SSF rates (scraper will update these)
  const loanData = [
    { slug: "banco-agricola", rateMin: "18.00", rateMax: "24.00", amountMax: "50000.00" },
    { slug: "davivienda", rateMin: "19.00", rateMax: "26.00", amountMax: "40000.00" },
    { slug: "bac-el-salvador", rateMin: "18.50", rateMax: "25.00", amountMax: "45000.00" },
    { slug: "banco-cuscatlan", rateMin: "20.00", rateMax: "28.00", amountMax: "30000.00" },
    { slug: "banco-hipotecario", rateMin: "17.00", rateMax: "22.00", amountMax: "35000.00" },
    { slug: "promerica", rateMin: "21.00", rateMax: "27.00", amountMax: "25000.00" },
    { slug: "credimovil", rateMin: "24.00", rateMax: "36.00", amountMax: "10000.00" },
  ];

  for (const data of loanData) {
    const provider = loanProviderRows.find((p) => p.slug === data.slug);
    if (!provider) continue;
    await db
      .insert(loanProducts)
      .values({
        providerId: provider.id,
        productName: `Préstamo personal - ${provider.name}`,
        loanType: "personal",
        rateMin: data.rateMin,
        rateMax: data.rateMax,
        amountMin: "500.00",
        amountMax: data.amountMax,
        termMinMonths: 6,
        termMaxMonths: 60,
        ssfRateSource: data.slug !== "credimovil",
      })
      .onConflictDoNothing();
  }

  logger.info("Loan products seeded");

  // ---------------------------------------------------------------------------
  // Insurance providers
  // ---------------------------------------------------------------------------
  await db
    .insert(insuranceProviders)
    .values([
      { name: "SISA", slug: "sisa", country: "SV", active: true },
      { name: "Seguros del Pacífico", slug: "seguros-pacifico", country: "SV", active: true },
      { name: "Cubierto", slug: "cubierto", country: "SV", affiliateUrl: "https://cubierto.app?utm_source=finazo", active: true },
    ])
    .onConflictDoNothing();

  logger.info("Insurance providers seeded");
  logger.info("Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
