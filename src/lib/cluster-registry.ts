/**
 * Cluster registry — single source of truth for the finazo.us cluster
 * pages (/seguros, /hipotecas, /credito, /remesas, /fiscal, /prestamos).
 *
 * Each entry describes which articles should auto-surface on the cluster
 * hub. The <ClusterArticlesSection> component reads this config and
 * queries the DB at render time, so adding a new article in the right
 * category instantly appears on its cluster hub without code changes.
 *
 * ─── Adding a new cluster ──────────────────────────────────────────────
 * 1. Add an entry to CLUSTERS below with a unique key.
 * 2. Set `dbCategories` to the DB `category` values that surface there
 *    (DB enum is `seguros | prestamos | remesas | educacion | tarjetas`
 *    as of 2026-05-12 — extend the strategist if a new one is needed).
 * 3. If multiple clusters share a category (e.g. /hipotecas and
 *    /prestamos both pull from category='prestamos'), use slugIncludes
 *    or slugExcludes to split the pool by slug pattern.
 * 4. Create the page at `src/app/us/<path>/page.tsx` (copy an existing
 *    cluster page as a starting template).
 * 5. Include `<ClusterArticlesSection clusterKey="your-key" />` in the
 *    new page.
 * 6. (Optional) Add the path to the global Nav if it's a top-level
 *    cluster surface.
 */

export type ClusterDefinition = {
  /** Canonical URL path (no /us prefix — middleware handles that). */
  path: string;
  /** Human label shown as the eyebrow/category tag on each card. */
  label: string;
  /** Lower-cased descriptor used in the section sub-heading copy. */
  topicDescription: string;
  /** DB `category` values to pull from. Empty = pull all and slug-filter. */
  dbCategories: string[];
  /** Optional slug-fragment whitelist — article surfaces only if its slug
   *  contains at least one of these fragments. */
  slugIncludes?: string[];
  /** Optional slug-fragment blacklist — article excluded if its slug
   *  contains any of these fragments. Useful for splitting one DB
   *  category across multiple cluster pages. */
  slugExcludes?: string[];
};

export type ClusterKey =
  | "seguros"
  | "hipotecas"
  | "prestamos"
  | "credito"
  | "remesas"
  | "fiscal";

// Slug fragments that mark a `category='prestamos'` article as
// mortgage-related (surfaces on /hipotecas) vs personal-loan
// (surfaces on /prestamos). Used by both clusters with opposite
// polarity so the same slug never appears on both.
const MORTGAGE_SLUG_FRAGMENTS = [
  "hipoteca",
  "mortgage",
  "fha",
  "non-qm",
  "acc-mortgage",
  "arc-home",
  "comprar-casa",
];

// Slug fragments that identify credit/credit-card content. Spans
// `tarjetas` (primary) and the one stray `educacion` article on
// credit-score building.
const CREDITO_SLUG_FRAGMENTS = [
  "credit",
  "credito",
  "credit-score",
  "secured",
  "kikoff",
  "self-financial",
  "self-vs",
  "discover",
  "capital-one",
  "oportun",
];

// Slug fragments that identify tax / ITIN / IRS content within the
// broader `educacion` category.
const FISCAL_SLUG_FRAGMENTS = [
  "itin",
  "tax",
  "impuesto",
  "w7",
  "w-7",
  "irs",
  "declarar",
];

export const CLUSTERS: Record<ClusterKey, ClusterDefinition> = {
  seguros: {
    path: "/seguros",
    label: "Seguros",
    topicDescription: "seguros",
    dbCategories: ["seguros"],
  },
  hipotecas: {
    path: "/hipotecas",
    label: "Hipotecas",
    topicDescription: "hipotecas",
    dbCategories: ["prestamos"],
    slugIncludes: MORTGAGE_SLUG_FRAGMENTS,
  },
  prestamos: {
    path: "/prestamos",
    label: "Préstamos personales",
    topicDescription: "préstamos personales",
    dbCategories: ["prestamos"],
    slugExcludes: MORTGAGE_SLUG_FRAGMENTS,
  },
  credito: {
    path: "/credito",
    label: "Crédito",
    topicDescription: "crédito y tarjetas",
    dbCategories: ["tarjetas", "educacion"],
    slugIncludes: CREDITO_SLUG_FRAGMENTS,
  },
  remesas: {
    path: "/remesas",
    label: "Remesas",
    topicDescription: "remesas",
    dbCategories: ["remesas"],
  },
  fiscal: {
    path: "/fiscal",
    label: "Fiscal",
    topicDescription: "impuestos e ITIN",
    dbCategories: ["educacion"],
    slugIncludes: FISCAL_SLUG_FRAGMENTS,
  },
};

export function getClusterDefinition(key: ClusterKey): ClusterDefinition {
  return CLUSTERS[key];
}
