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
