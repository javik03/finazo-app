/**
 * CMS ACA Health Insurance Scraper
 * Pulls Marketplace plan data from the official CMS API (no auth required).
 * Runs daily — plan data is stable but updates each Open Enrollment Period.
 *
 * API docs: https://marketplace.api.healthcare.gov/api-docs
 */

import { db } from "@/lib/db";
import { usHealthPlans } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import pino from "pino";

const logger = pino({ name: "cms-aca-scraper" });

const CMS_API_BASE = "https://marketplace.api.healthcare.gov/api/v1";
const PLAN_YEAR = 2025;

// States with the largest US Hispanic populations — prioritize these
// Add more states as needed; scraping all 50 states is possible but slow
const TARGET_STATES = [
  "CA", // California — largest Hispanic population
  "TX", // Texas
  "FL", // Florida
  "NY", // New York
  "IL", // Illinois
  "AZ", // Arizona
  "NJ", // New Jersey
  "CO", // Colorado
  "NM", // New Mexico
  "NV", // Nevada
];

interface CmsCounty {
  fips: string;
  name: string;
  state: string;
  zipcode?: string;
}

interface CmsPlan {
  id: string;
  name: string;
  issuer: { name: string };
  metal_level: string;
  type: string; // HMO | PPO | EPO | POS
  premium: number;           // for the base person (age varies — normalize to 40)
  premium_w_credit?: number;
  deductibles: Array<{ amount: number; type: string; network_tier?: string }>;
  moops: Array<{ amount: number; type: string; network_tier?: string }>;
}

interface CmsPlansResponse {
  plans: CmsPlan[];
  total: number;
}

// ---------------------------------------------------------------------------
// Fetch a representative county FIPS for each state
// We use the most populous county per state as the representative sample
// ---------------------------------------------------------------------------

const REPRESENTATIVE_COUNTIES: Record<string, { fips: string; name: string }> = {
  CA: { fips: "06037", name: "Los Angeles County" },
  TX: { fips: "48201", name: "Harris County" },
  FL: { fips: "12086", name: "Miami-Dade County" },
  NY: { fips: "36061", name: "New York County" },
  IL: { fips: "17031", name: "Cook County" },
  AZ: { fips: "04013", name: "Maricopa County" },
  NJ: { fips: "34013", name: "Essex County" },
  CO: { fips: "08031", name: "Denver County" },
  NM: { fips: "35001", name: "Bernalillo County" },
  NV: { fips: "32003", name: "Clark County" },
};

// ---------------------------------------------------------------------------
// Fetch plans from CMS API for a given FIPS code
// ---------------------------------------------------------------------------

async function fetchPlansForCounty(
  state: string,
  fips: string,
  zipcode: string
): Promise<CmsPlan[]> {
  const params = new URLSearchParams({
    year: String(PLAN_YEAR),
    fips,
    market: "Individual",
    limit: "100",
    offset: "0",
  });

  const url = `${CMS_API_BASE}/plans/search?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        household: {
          income: 40000,
          people: [
            {
              age: 40,
              aptc_eligible: true,
              gender: "Male",
              uses_tobacco: false,
            },
          ],
        },
        market: "Individual",
        place: {
          countyfips: fips,
          state,
          zipcode,
        },
        year: PLAN_YEAR,
      }),
    });

    if (!res.ok) {
      logger.warn({ state, fips, status: res.status }, "CMS API non-200");
      return [];
    }

    const data: CmsPlansResponse = await res.json();
    return data.plans ?? [];
  } catch (err) {
    logger.error({ err, state, fips }, "CMS API fetch failed");
    return [];
  }
}

// ---------------------------------------------------------------------------
// Representative ZIP codes per state (needed by CMS API)
// ---------------------------------------------------------------------------

const REPRESENTATIVE_ZIPCODES: Record<string, string> = {
  CA: "90001",
  TX: "77001",
  FL: "33101",
  NY: "10001",
  IL: "60601",
  AZ: "85001",
  NJ: "07101",
  CO: "80201",
  NM: "87101",
  NV: "89101",
};

// ---------------------------------------------------------------------------
// Upsert a plan into the database
// ---------------------------------------------------------------------------

async function upsertPlan(
  state: string,
  fips: string,
  plan: CmsPlan
): Promise<void> {
  const deductibleInd = plan.deductibles.find(
    (d) => d.type === "medical" && (!d.network_tier || d.network_tier === "In-Network")
  )?.amount ?? null;

  const oopMax = plan.moops.find(
    (m) => m.type === "Maximum Out of Pocket Payment" && (!m.network_tier || m.network_tier === "In-Network")
  )?.amount ?? null;

  const existing = await db
    .select({ id: usHealthPlans.id })
    .from(usHealthPlans)
    .where(
      and(
        eq(usHealthPlans.cmsplanId, plan.id),
        eq(usHealthPlans.planYear, PLAN_YEAR)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(usHealthPlans)
      .set({
        planName: plan.name,
        issuerName: plan.issuer.name,
        metalLevel: plan.metal_level,
        planType: plan.type,
        premiumAdult40: plan.premium?.toString() ?? null,
        deductibleIndividual: deductibleInd?.toString() ?? null,
        oopMaxIndividual: oopMax?.toString() ?? null,
        scrapedAt: new Date(),
      })
      .where(eq(usHealthPlans.id, existing[0].id));
  } else {
    await db.insert(usHealthPlans).values({
      cmsplanId: plan.id,
      planName: plan.name,
      issuerName: plan.issuer.name,
      state,
      countyFips: fips,
      metalLevel: plan.metal_level,
      planType: plan.type,
      premiumAdult40: plan.premium?.toString() ?? null,
      deductibleIndividual: deductibleInd?.toString() ?? null,
      oopMaxIndividual: oopMax?.toString() ?? null,
      planYear: PLAN_YEAR,
    });
  }
}

// ---------------------------------------------------------------------------
// Main scraper
// ---------------------------------------------------------------------------

export async function runCmsAcaScraper(): Promise<void> {
  logger.info({ states: TARGET_STATES, year: PLAN_YEAR }, "Starting CMS ACA scraper");

  let totalPlans = 0;

  for (const state of TARGET_STATES) {
    const county = REPRESENTATIVE_COUNTIES[state];
    const zipcode = REPRESENTATIVE_ZIPCODES[state];

    if (!county || !zipcode) {
      logger.warn({ state }, "No county/zip configured — skipping");
      continue;
    }

    logger.info({ state, county: county.name, fips: county.fips }, "Fetching plans");

    const plans = await fetchPlansForCounty(state, county.fips, zipcode);
    logger.info({ state, count: plans.length }, "Plans received");

    for (const plan of plans) {
      await upsertPlan(state, county.fips, plan);
      totalPlans++;
    }

    // Throttle between states — CMS API has rate limits
    await new Promise((r) => setTimeout(r, 1500));
  }

  logger.info({ totalPlans }, "CMS ACA scraper complete");
}

// Run directly: npx tsx src/agents/scraper/cms-aca-scraper.ts
if (require.main === module) {
  runCmsAcaScraper().catch((err) => {
    logger.error(err, "CMS ACA scraper failed");
    process.exit(1);
  });
}
