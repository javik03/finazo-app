/**
 * Themed image-query builder. Avoids the "every article gets a similar
 * stock photo" problem by:
 *
 *   1. Mapping the article to a visual theme (auto, home, health,
 *      credit, remit, tax, life) based on slug + category.
 *   2. Picking one of 10 conceptual variations per theme using a
 *      deterministic hash of the slug — so the same article always
 *      maps to the same query (reproducible), but two near-identical
 *      articles get different variations.
 *
 * Variations focus on conceptual objects (car keys, dashboard, IRS
 * forms, stethoscope) rather than the generic "hispanic family"
 * compositions Pexels overweights for finance queries. Different
 * conceptual queries draw from different Pexels photographer pools
 * → genuinely different visual styles.
 */

type Theme = "auto" | "home" | "health" | "credit" | "remit" | "tax" | "life";

const THEME_VARIATIONS: Record<Theme, string[]> = {
  auto: [
    "car dashboard interior",
    "auto insurance documents",
    "highway road sunset",
    "car keys hands close-up",
    "driver license card",
    "parking lot cars rows",
    "auto repair mechanic garage",
    "speedometer odometer",
    "car insurance policy form",
    "steering wheel close-up",
  ],
  home: [
    "house keys handover",
    "home blueprint architect plans",
    "mortgage documents desk",
    "suburban family house exterior",
    "moving boxes new home",
    "real estate for sale sign",
    "modern living room interior",
    "construction tools home renovation",
    "down payment savings jar",
    "front door welcome mat",
  ],
  health: [
    "doctor stethoscope examination",
    "medical insurance form clipboard",
    "modern clinic waiting room",
    "blood pressure checkup",
    "pharmacy prescription bottles",
    "hospital corridor scrubs",
    "medical health records folder",
    "telehealth video consultation",
    "health insurance card wallet",
    "doctor patient conversation office",
  ],
  credit: [
    "credit card payment terminal",
    "credit score gauge graph",
    "credit report printed document",
    "wallet organized cards",
    "online banking laptop screen",
    "budget spreadsheet calculator",
    "savings coins glass jar",
    "loan application paperwork",
    "personal finance planning notebook",
    "ATM machine cash withdrawal",
  ],
  remit: [
    "money transfer smartphone screen",
    "cash dollars envelope",
    "currency exchange storefront",
    "world map money flows",
    "wire transfer bank counter",
    "video call family overseas",
    "western union money sign",
    "remittance receipt counter",
    "international currencies stacked",
    "money counting machine office",
  ],
  tax: [
    "tax forms calculator pen",
    "IRS Form 1040 document",
    "accountant CPA office desk",
    "receipts organized binder",
    "W-2 paystub paperwork",
    "tax refund envelope mail",
    "online tax filing laptop",
    "tax preparation appointment",
    "filing cabinet documents",
    "tax season clock deadline",
  ],
  life: [
    "family portrait outdoor park",
    "parent child holding hands",
    "grandparents grandchildren",
    "family dinner table together",
    "protecting umbrella family",
    "life insurance policy document",
    "newborn parents hospital",
    "elderly couple beach walking",
    "family generations sofa",
    "child playing parent watching",
  ],
};

function detectTheme(slug: string, category: string): Theme {
  // Order matters — most-specific patterns first.
  if (
    slug.includes("hipoteca") ||
    slug.includes("mortgage") ||
    slug.includes("non-qm") ||
    slug.includes("fha") ||
    slug.includes("acc-mortgage") ||
    slug.includes("arc-home") ||
    slug.includes("comprar-casa")
  ) {
    return "home";
  }
  if (
    slug.includes("aca") ||
    slug.includes("obamacare") ||
    slug.includes("medicaid") ||
    slug.includes("salud") ||
    slug.includes("seguro-de-salud")
  ) {
    return "health";
  }
  if (
    slug.includes("seguro-de-vida") ||
    slug.includes("seguro-vida") ||
    slug.includes("life-insurance") ||
    /(^|-)vida(-|$)/.test(slug)
  ) {
    return "life";
  }
  if (category === "seguros") return "auto";
  if (
    slug.includes("itin") ||
    slug.includes("tax") ||
    slug.includes("impuesto") ||
    slug.includes("w-7") ||
    slug.includes("w7") ||
    slug.includes("declarar") ||
    slug.includes("irs")
  ) {
    return "tax";
  }
  if (category === "tarjetas" || slug.includes("credit") || slug.includes("credito")) {
    return "credit";
  }
  if (category === "remesas") return "remit";
  if (category === "prestamos") return "credit";
  return "credit";
}

function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash << 5) - hash + slug.charCodeAt(i);
    hash |= 0; // force int32
  }
  return Math.abs(hash);
}

/**
 * Build a varied Pexels-friendly query for the given article. Same
 * article always gets the same query (deterministic) — re-running the
 * backfill won't shuffle assignments randomly.
 */
export function buildVariedImageQuery(
  slug: string,
  category: string,
): string {
  const theme = detectTheme(slug, category);
  const variations = THEME_VARIATIONS[theme];
  const index = hashSlug(slug) % variations.length;
  return variations[index];
}
