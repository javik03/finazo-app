import { db } from "@/lib/db";
import { usLoanProviders, usLoanProducts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export type UsLoanProduct = {
  provider: string;
  slug: string;
  affiliateUrl: string | null;
  providerType: string;
  acceptsItin: boolean | null;
  productName: string;
  loanType: string;
  aprMin: string | null;
  aprMax: string | null;
  amountMin: string | null;
  amountMax: string | null;
  termMinMonths: number | null;
  termMaxMonths: number | null;
  minCreditScore: number | null;
  originationFeePercent: string | null;
  fundingDays: number | null;
};

export async function getUsLoanProducts(
  loanType: string = "personal"
): Promise<UsLoanProduct[]> {
  const rows = await db
    .select({
      provider: usLoanProviders.name,
      slug: usLoanProviders.slug,
      affiliateUrl: usLoanProviders.affiliateUrl,
      providerType: usLoanProviders.providerType,
      acceptsItin: usLoanProviders.acceptsItin,
      productName: usLoanProducts.productName,
      loanType: usLoanProducts.loanType,
      aprMin: usLoanProducts.aprMin,
      aprMax: usLoanProducts.aprMax,
      amountMin: usLoanProducts.amountMin,
      amountMax: usLoanProducts.amountMax,
      termMinMonths: usLoanProducts.termMinMonths,
      termMaxMonths: usLoanProducts.termMaxMonths,
      minCreditScore: usLoanProducts.minCreditScore,
      originationFeePercent: usLoanProducts.originationFeePercent,
      fundingDays: usLoanProducts.fundingDays,
    })
    .from(usLoanProducts)
    .innerJoin(usLoanProviders, eq(usLoanProducts.providerId, usLoanProviders.id))
    .where(
      and(
        eq(usLoanProducts.loanType, loanType),
        eq(usLoanProviders.active, true)
      )
    );

  return rows;
}
