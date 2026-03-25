import { db } from "@/lib/db";
import { remittanceProviders, remittanceRates } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export type RemittanceRate = {
  provider: string;
  slug: string;
  logoUrl: string | null;
  affiliateUrl: string | null;
  exchangeRate: string | null;
  feeFlat: string | null;
  feePercent: string | null;
  transferSpeed: string | null;
  minAmount: string | null;
  maxAmount: string | null;
  scrapedAt: Date | null;
};

export async function getRemittanceRates(
  fromCountry: string,
  toCountry: string
): Promise<RemittanceRate[]> {
  const rows = await db
    .select({
      provider: remittanceProviders.name,
      slug: remittanceProviders.slug,
      logoUrl: remittanceProviders.logoUrl,
      affiliateUrl: remittanceProviders.affiliateUrl,
      exchangeRate: remittanceRates.exchangeRate,
      feeFlat: remittanceRates.feeFlat,
      feePercent: remittanceRates.feePercent,
      transferSpeed: remittanceRates.transferSpeed,
      minAmount: remittanceRates.minAmount,
      maxAmount: remittanceRates.maxAmount,
      scrapedAt: remittanceRates.scrapedAt,
    })
    .from(remittanceRates)
    .innerJoin(
      remittanceProviders,
      eq(remittanceRates.providerId, remittanceProviders.id)
    )
    .where(
      and(
        eq(remittanceRates.fromCountry, fromCountry),
        eq(remittanceRates.toCountry, toCountry),
        eq(remittanceProviders.active, true)
      )
    )
    .orderBy(desc(remittanceRates.scrapedAt));

  return rows;
}
