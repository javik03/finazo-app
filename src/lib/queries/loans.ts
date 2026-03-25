import { db } from "@/lib/db";
import { loanProviders, loanProducts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export type LoanProduct = {
  provider: string;
  slug: string;
  logoUrl: string | null;
  affiliateUrl: string | null;
  providerType: string;
  productName: string;
  loanType: string;
  rateMin: string | null;
  rateMax: string | null;
  amountMin: string | null;
  amountMax: string | null;
  termMinMonths: number | null;
  termMaxMonths: number | null;
  ssfRateSource: boolean | null;
};

export async function getLoanProducts(
  loanType: string,
  country: string = "SV"
): Promise<LoanProduct[]> {
  const rows = await db
    .select({
      provider: loanProviders.name,
      slug: loanProviders.slug,
      logoUrl: loanProviders.logoUrl,
      affiliateUrl: loanProviders.affiliateUrl,
      providerType: loanProviders.providerType,
      productName: loanProducts.productName,
      loanType: loanProducts.loanType,
      rateMin: loanProducts.rateMin,
      rateMax: loanProducts.rateMax,
      amountMin: loanProducts.amountMin,
      amountMax: loanProducts.amountMax,
      termMinMonths: loanProducts.termMinMonths,
      termMaxMonths: loanProducts.termMaxMonths,
      ssfRateSource: loanProducts.ssfRateSource,
    })
    .from(loanProducts)
    .innerJoin(loanProviders, eq(loanProducts.providerId, loanProviders.id))
    .where(
      and(
        eq(loanProducts.loanType, loanType),
        eq(loanProviders.country, country),
        eq(loanProviders.active, true)
      )
    );

  return rows;
}

export async function getLoanProductsByProvider(
  providerSlug: string
): Promise<LoanProduct[]> {
  const rows = await db
    .select({
      provider: loanProviders.name,
      slug: loanProviders.slug,
      logoUrl: loanProviders.logoUrl,
      affiliateUrl: loanProviders.affiliateUrl,
      providerType: loanProviders.providerType,
      productName: loanProducts.productName,
      loanType: loanProducts.loanType,
      rateMin: loanProducts.rateMin,
      rateMax: loanProducts.rateMax,
      amountMin: loanProducts.amountMin,
      amountMax: loanProducts.amountMax,
      termMinMonths: loanProducts.termMinMonths,
      termMaxMonths: loanProducts.termMaxMonths,
      ssfRateSource: loanProducts.ssfRateSource,
    })
    .from(loanProducts)
    .innerJoin(loanProviders, eq(loanProducts.providerId, loanProviders.id))
    .where(
      and(eq(loanProviders.slug, providerSlug), eq(loanProviders.active, true))
    );

  return rows;
}

export async function getAllLoanProviderSlugs(): Promise<{ slug: string }[]> {
  return db
    .select({ slug: loanProviders.slug })
    .from(loanProviders)
    .where(eq(loanProviders.active, true));
}

export async function getLoanProviderBySlug(slug: string) {
  const rows = await db
    .select({
      name: loanProviders.name,
      slug: loanProviders.slug,
      logoUrl: loanProviders.logoUrl,
      affiliateUrl: loanProviders.affiliateUrl,
      providerType: loanProviders.providerType,
      country: loanProviders.country,
    })
    .from(loanProviders)
    .where(and(eq(loanProviders.slug, slug), eq(loanProviders.active, true)))
    .limit(1);

  return rows[0] ?? null;
}
