/**
 * Resolves the US state and product (auto vs mortgage) an article is about
 * so the article page can render a state-aware CTA.
 *
 * Phase 3 takes the pragmatic path: parse the slug. Slugs already encode
 * state and city from the programmatic templates (e.g. "seguro-auto-texas-
 * hispanos-2026", "comprar-casa-itin-houston-2026", "alternativa-a-freeway-
 * insurance-florida-2026"). Future work: store this explicitly in
 * articles.templateVariables and use that when present.
 */

import { US_STATES, getStateBySlug, type UsState } from "@/lib/constants/states";
import { US_TIER_1_SECONDARY } from "@/lib/constants/geos";

type Product = "auto" | "mortgage";

export type ArticleGeoContext = {
  state: UsState | null;
  product: Product;
};

const CITY_TO_STATE_SLUG: Record<string, string> = Object.fromEntries(
  US_TIER_1_SECONDARY.map((c) => [c.slug, c.stateSlug]),
);

// Map well-known city slugs from the primary-metros template (not in tier-1
// secondary list) to their states. Source: PRIORITY_CITIES in us-topic-templates.
const PRIMARY_CITY_TO_STATE_SLUG: Record<string, string> = {
  "houston": "texas",
  "dallas": "texas",
  "san-antonio": "texas",
  "los-angeles": "california",
  "miami": "florida",
  "phoenix": "arizona",
  "chicago": "illinois",
  "new-york-city": "new-york",
  "atlanta": "georgia",
  "denver": "colorado",
  "las-vegas": "nevada",
  "charlotte": "north-carolina",
};

const STATE_SLUGS_LOOKUP = new Set(US_STATES.map((s) => s.slug));

/**
 * Find a state slug embedded in the article slug. Walks the slug parts and
 * returns the first hit against either a US state slug or a known city slug.
 */
function findStateInSlug(slug: string): string | null {
  // First try multi-word state slugs (e.g. "new-york-city", "north-carolina")
  // by checking the full slug against known compound states.
  for (const state of US_STATES) {
    if (state.slug.includes("-") && slug.includes(state.slug)) {
      return state.slug;
    }
  }

  // Then walk parts and check single-word matches.
  const parts = slug.split("-");
  for (const part of parts) {
    if (STATE_SLUGS_LOOKUP.has(part)) return part;
  }

  // Multi-part city slugs ("san-antonio", "el-paso") — check consecutive pairs.
  for (let i = 0; i < parts.length - 1; i += 1) {
    const pair = `${parts[i]}-${parts[i + 1]}`;
    if (PRIMARY_CITY_TO_STATE_SLUG[pair]) return PRIMARY_CITY_TO_STATE_SLUG[pair];
    if (CITY_TO_STATE_SLUG[pair]) return CITY_TO_STATE_SLUG[pair];
  }
  // Triple-part city slugs ("corpus-christi" is two words, "new-york-city" is 3).
  for (let i = 0; i < parts.length - 2; i += 1) {
    const triple = `${parts[i]}-${parts[i + 1]}-${parts[i + 2]}`;
    if (PRIMARY_CITY_TO_STATE_SLUG[triple]) return PRIMARY_CITY_TO_STATE_SLUG[triple];
    if (CITY_TO_STATE_SLUG[triple]) return CITY_TO_STATE_SLUG[triple];
  }

  // Single-word cities.
  for (const part of parts) {
    if (PRIMARY_CITY_TO_STATE_SLUG[part]) return PRIMARY_CITY_TO_STATE_SLUG[part];
    if (CITY_TO_STATE_SLUG[part]) return CITY_TO_STATE_SLUG[part];
  }

  return null;
}

/**
 * Decide whether the article funnels to auto insurance or to mortgage.
 * Mortgage signals win when present; everything else defaults to auto.
 */
function inferProduct(slug: string, category: string): Product {
  if (
    slug.includes("hipoteca") ||
    slug.includes("mortgage") ||
    slug.includes("comprar-casa") ||
    slug.includes("first-time-buyer")
  ) {
    return "mortgage";
  }
  if (category === "prestamos" && slug.includes("casa")) return "mortgage";
  return "auto";
}

/**
 * Optional structured variables persisted on articles.templateVariables
 * (jsonb). When present, take precedence over slug parsing.
 */
export type StoredTemplateVariables = {
  stateSlug?: string;
  city?: string;
  cohort?: string;
  intent?: string;
  competitor?: string;
};

export function resolveArticleGeo(
  slug: string,
  category: string,
  variables?: StoredTemplateVariables | null,
): ArticleGeoContext {
  // Prefer persisted variables when available — they're authoritative.
  if (variables?.stateSlug) {
    const state = getStateBySlug(variables.stateSlug) ?? null;
    return { state, product: inferProduct(slug, category) };
  }
  if (variables?.city) {
    const cityStateSlug =
      PRIMARY_CITY_TO_STATE_SLUG[variables.city] ??
      CITY_TO_STATE_SLUG[variables.city];
    if (cityStateSlug) {
      const state = getStateBySlug(cityStateSlug) ?? null;
      return { state, product: inferProduct(slug, category) };
    }
  }

  // Fallback: slug parsing for legacy articles that pre-date templateVariables.
  const stateSlug = findStateInSlug(slug);
  const state = stateSlug ? getStateBySlug(stateSlug) ?? null : null;
  return {
    state,
    product: inferProduct(slug, category),
  };
}
