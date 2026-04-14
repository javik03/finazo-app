/**
 * US Personal Loans Scraper
 * Loads APR ranges from major US lenders that serve the Hispanic market.
 * Uses published rate tables — these change infrequently (monthly at most).
 *
 * Sources: lender sites, CFPB consumer credit data
 * Runs: weekly via docker-compose cron loop
 */

import { db } from "@/lib/db";
import { usLoanProviders, usLoanProducts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import pino from "pino";

const logger = pino({ name: "us-loans-scraper" });

// ---------------------------------------------------------------------------
// Published rate data — manually updated from lender sites
// APRs as of 2025 Q1; update quarterly or when lenders announce changes
// ---------------------------------------------------------------------------

interface LenderData {
  provider: {
    name: string;
    slug: string;
    providerType: string;
    acceptsItin: boolean;
    affiliateUrl: string | null;
  };
  products: Array<{
    productName: string;
    loanType: string;
    aprMin: number;
    aprMax: number;
    amountMin: number;
    amountMax: number;
    termMinMonths: number;
    termMaxMonths: number;
    minCreditScore: number | null;
    originationFeePercent: number | null;
    fundingDays: number | null;
  }>;
}

const LENDERS: LenderData[] = [
  {
    provider: {
      name: "SoFi",
      slug: "sofi",
      providerType: "fintech",
      acceptsItin: false,
      affiliateUrl: null,
    },
    products: [
      {
        productName: "SoFi Personal Loan",
        loanType: "personal",
        aprMin: 8.99,
        aprMax: 29.49,
        amountMin: 5000,
        amountMax: 100000,
        termMinMonths: 24,
        termMaxMonths: 84,
        minCreditScore: 680,
        originationFeePercent: 0,
        fundingDays: 3,
      },
    ],
  },
  {
    provider: {
      name: "LightStream",
      slug: "lightstream",
      providerType: "bank",
      acceptsItin: false,
      affiliateUrl: null,
    },
    products: [
      {
        productName: "LightStream Personal Loan",
        loanType: "personal",
        aprMin: 7.49,
        aprMax: 25.49,
        amountMin: 5000,
        amountMax: 100000,
        termMinMonths: 24,
        termMaxMonths: 144,
        minCreditScore: 660,
        originationFeePercent: 0,
        fundingDays: 1,
      },
    ],
  },
  {
    provider: {
      name: "Upgrade",
      slug: "upgrade",
      providerType: "fintech",
      acceptsItin: true,
      affiliateUrl: null,
    },
    products: [
      {
        productName: "Upgrade Personal Loan",
        loanType: "personal",
        aprMin: 9.99,
        aprMax: 35.99,
        amountMin: 1000,
        amountMax: 50000,
        termMinMonths: 24,
        termMaxMonths: 84,
        minCreditScore: 580,
        originationFeePercent: 9.99,
        fundingDays: 4,
      },
    ],
  },
  {
    provider: {
      name: "Avant",
      slug: "avant",
      providerType: "fintech",
      acceptsItin: false,
      affiliateUrl: null,
    },
    products: [
      {
        productName: "Avant Personal Loan",
        loanType: "personal",
        aprMin: 9.95,
        aprMax: 35.99,
        amountMin: 2000,
        amountMax: 35000,
        termMinMonths: 12,
        termMaxMonths: 60,
        minCreditScore: 580,
        originationFeePercent: 9.99,
        fundingDays: 1,
      },
    ],
  },
  {
    provider: {
      name: "OppFi",
      slug: "oppfi",
      providerType: "fintech",
      acceptsItin: false,
      affiliateUrl: null,
    },
    products: [
      {
        productName: "OppLoans Personal Loan",
        loanType: "personal",
        aprMin: 59.0,
        aprMax: 160.0,
        amountMin: 500,
        amountMax: 4000,
        termMinMonths: 9,
        termMaxMonths: 18,
        minCreditScore: null, // no minimum — subprime
        originationFeePercent: 0,
        fundingDays: 1,
      },
    ],
  },
  {
    provider: {
      name: "Self Financial",
      slug: "self-financial",
      providerType: "fintech",
      acceptsItin: true,
      affiliateUrl: null,
    },
    products: [
      {
        productName: "Self Credit Builder Loan",
        loanType: "credit-builder",
        aprMin: 15.65,
        aprMax: 15.97,
        amountMin: 600,
        amountMax: 1800,
        termMinMonths: 12,
        termMaxMonths: 24,
        minCreditScore: null, // no minimum — designed to build credit
        originationFeePercent: 0,
        fundingDays: 0, // funds go to savings account, not direct
      },
    ],
  },
  {
    provider: {
      name: "Accion Opportunity Fund",
      slug: "accion-opportunity-fund",
      providerType: "cdfi",
      acceptsItin: true,
      affiliateUrl: null,
    },
    products: [
      {
        productName: "Small Business Loan",
        loanType: "business",
        aprMin: 8.49,
        aprMax: 24.0,
        amountMin: 5000,
        amountMax: 250000,
        termMinMonths: 12,
        termMaxMonths: 60,
        minCreditScore: 575,
        originationFeePercent: 3.0,
        fundingDays: 5,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Upsert provider and products
// ---------------------------------------------------------------------------

async function upsertLender(lender: LenderData): Promise<void> {
  const { provider, products } = lender;

  // Upsert provider
  const existing = await db
    .select({ id: usLoanProviders.id })
    .from(usLoanProviders)
    .where(eq(usLoanProviders.slug, provider.slug))
    .limit(1);

  let providerId: string;

  if (existing.length > 0) {
    providerId = existing[0].id;
    await db
      .update(usLoanProviders)
      .set({
        name: provider.name,
        providerType: provider.providerType,
        acceptsItin: provider.acceptsItin,
        affiliateUrl: provider.affiliateUrl,
      })
      .where(eq(usLoanProviders.id, providerId));
  } else {
    const [inserted] = await db
      .insert(usLoanProviders)
      .values({
        name: provider.name,
        slug: provider.slug,
        providerType: provider.providerType,
        acceptsItin: provider.acceptsItin,
        affiliateUrl: provider.affiliateUrl,
      })
      .returning({ id: usLoanProviders.id });
    providerId = inserted.id;
    logger.info({ provider: provider.slug }, "New US loan provider inserted");
  }

  // Upsert products for this provider
  for (const product of products) {
    const existingProduct = await db
      .select({ id: usLoanProducts.id })
      .from(usLoanProducts)
      .where(
        eq(usLoanProducts.providerId, providerId)
      )
      .limit(1);

    const values = {
      providerId,
      productName: product.productName,
      loanType: product.loanType,
      aprMin: product.aprMin.toString(),
      aprMax: product.aprMax.toString(),
      amountMin: product.amountMin.toString(),
      amountMax: product.amountMax.toString(),
      termMinMonths: product.termMinMonths,
      termMaxMonths: product.termMaxMonths,
      minCreditScore: product.minCreditScore,
      originationFeePercent: product.originationFeePercent?.toString() ?? null,
      fundingDays: product.fundingDays,
      scrapedAt: new Date(),
    };

    if (existingProduct.length > 0) {
      await db
        .update(usLoanProducts)
        .set(values)
        .where(eq(usLoanProducts.id, existingProduct[0].id));
    } else {
      await db.insert(usLoanProducts).values(values);
    }
  }

  logger.info({ provider: provider.slug, products: products.length }, "Lender upserted");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export async function runUsLoansScraper(): Promise<void> {
  logger.info({ lenders: LENDERS.length }, "Starting US loans scraper");

  for (const lender of LENDERS) {
    await upsertLender(lender);
  }

  logger.info("US loans scraper complete");
}

// Run directly: npx tsx src/agents/scraper/us-loans-scraper.ts
if (require.main === module) {
  runUsLoansScraper().catch((err) => {
    logger.error(err, "US loans scraper failed");
    process.exit(1);
  });
}
