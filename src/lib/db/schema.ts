import {
  pgTable,
  uuid,
  text,
  boolean,
  decimal,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------------
// Remittances
// ---------------------------------------------------------------------------

export const remittanceProviders = pgTable("remittance_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  logoUrl: text("logo_url"),
  affiliateUrl: text("affiliate_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const remittanceRates = pgTable("remittance_rates", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerId: uuid("provider_id").references(() => remittanceProviders.id),
  fromCountry: text("from_country").notNull(),
  toCountry: text("to_country").notNull(),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  exchangeRate: decimal("exchange_rate", { precision: 10, scale: 6 }),
  feeFlat: decimal("fee_flat", { precision: 10, scale: 2 }),
  feePercent: decimal("fee_percent", { precision: 5, scale: 4 }),
  transferSpeed: text("transfer_speed"),
  minAmount: decimal("min_amount", { precision: 10, scale: 2 }),
  maxAmount: decimal("max_amount", { precision: 10, scale: 2 }),
  scrapedAt: timestamp("scraped_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// Loans
// ---------------------------------------------------------------------------

export const loanProviders = pgTable("loan_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  logoUrl: text("logo_url"),
  affiliateUrl: text("affiliate_url"),
  providerType: text("provider_type").notNull(), // bank | fintech | cooperativa
  country: text("country").notNull().default("SV"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const loanProducts = pgTable("loan_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerId: uuid("provider_id").references(() => loanProviders.id),
  productName: text("product_name").notNull(),
  loanType: text("loan_type").notNull(), // personal | vehicle | mortgage | microcredito
  rateMin: decimal("rate_min", { precision: 6, scale: 4 }),
  rateMax: decimal("rate_max", { precision: 6, scale: 4 }),
  amountMin: decimal("amount_min", { precision: 12, scale: 2 }),
  amountMax: decimal("amount_max", { precision: 12, scale: 2 }),
  termMinMonths: integer("term_min_months"),
  termMaxMonths: integer("term_max_months"),
  ssfRateSource: boolean("ssf_rate_source").default(false),
  scrapedAt: timestamp("scraped_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// Insurance
// ---------------------------------------------------------------------------

export const insuranceProviders = pgTable("insurance_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  logoUrl: text("logo_url"),
  affiliateUrl: text("affiliate_url"),
  country: text("country").notNull().default("SV"),
  active: boolean("active").default(true),
});

export const insuranceProducts = pgTable("insurance_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerId: uuid("provider_id").references(() => insuranceProviders.id),
  productName: text("product_name").notNull(),
  insuranceType: text("insurance_type").notNull(), // auto | vida | salud | hogar
  priceFrom: decimal("price_from", { precision: 10, scale: 2 }),
  coverageAmount: decimal("coverage_amount", { precision: 12, scale: 2 }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  metaDescription: text("meta_description"),
  content: text("content").notNull(), // Markdown
  category: text("category").notNull(), // remesas | prestamos | seguros | educacion
  country: text("country").default("SV"),
  language: text("language").notNull().default("es"), // "es" | "en"
  translationOf: uuid("translation_of"), // FK → articles.id (set after creation to allow circular)
  keywords: text("keywords").array(),
  status: text("status").default("draft"), // draft | published | archived
  featuredImageUrl: text("featured_image_url"),
  wordCount: integer("word_count"),
  generatedBy: text("generated_by").default("claude"), // claude | human
  authorName: text("author_name"), // null = "Equipo Finazo" fallback
  authorSlug: text("author_slug"), // FK-ish → us_authors.slug, joined in app code
  templateType: text("template_type"), // editorial | pseo_city_product | pseo_carrier_alt | pseo_state_legal | pseo_corridor | pseo_calculator | pseo_qa
  templateVariables: jsonb("template_variables"), // {"state":"FL","city":"Hialeah",...}
  dataPayload: jsonb("data_payload"), // cached real data for the page
  lastDataRefresh: timestamp("last_data_refresh", { withTimezone: true }),
  humanReviewed: boolean("human_reviewed").default(false),
  humanReviewedAt: timestamp("human_reviewed_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// Rate change events (triggers article generation)
// ---------------------------------------------------------------------------

export const rateChangeEvents = pgTable("rate_change_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityType: text("entity_type").notNull(), // loan_product | remittance_rate
  entityId: uuid("entity_id").notNull(),
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  articleGenerated: boolean("article_generated").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// US Market — Personal Loans
// ---------------------------------------------------------------------------

export const usLoanProviders = pgTable("us_loan_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  logoUrl: text("logo_url"),
  affiliateUrl: text("affiliate_url"),
  providerType: text("provider_type").notNull(), // bank | fintech | credit-union | cdfi
  acceptsItin: boolean("accepts_itin").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const usLoanProducts = pgTable("us_loan_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerId: uuid("provider_id").references(() => usLoanProviders.id),
  productName: text("product_name").notNull(),
  loanType: text("loan_type").notNull(), // personal | auto | business | credit-builder
  // APR stored as percentage value (e.g. 59.99 = 59.99%, 160.00 = 160%).
  // Widened from decimal(6,4) — OppLoans / payday-tier ITIN loans hit 100%+.
  aprMin: decimal("apr_min", { precision: 6, scale: 2 }),
  aprMax: decimal("apr_max", { precision: 6, scale: 2 }),
  amountMin: decimal("amount_min", { precision: 12, scale: 2 }),
  amountMax: decimal("amount_max", { precision: 12, scale: 2 }),
  termMinMonths: integer("term_min_months"),
  termMaxMonths: integer("term_max_months"),
  minCreditScore: integer("min_credit_score"),
  originationFeePercent: decimal("origination_fee_percent", { precision: 5, scale: 4 }),
  fundingDays: integer("funding_days"), // typical days to fund
  scrapedAt: timestamp("scraped_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// US Market — Health Insurance (ACA / Marketplace)
// ---------------------------------------------------------------------------

export const usHealthPlans = pgTable("us_health_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  cmsplanId: text("cms_plan_id").notNull(),   // CMS plan ID from the API
  planName: text("plan_name").notNull(),
  issuerName: text("issuer_name").notNull(),
  state: text("state").notNull(),             // 2-letter state code
  countyFips: text("county_fips"),            // FIPS code for county-level data
  metalLevel: text("metal_level").notNull(),  // Bronze | Silver | Gold | Platinum | Catastrophic
  planType: text("plan_type"),               // HMO | PPO | EPO | POS
  premiumAdult40: decimal("premium_adult_40", { precision: 10, scale: 2 }), // monthly for 40yr old
  deductibleIndividual: decimal("deductible_individual", { precision: 10, scale: 2 }),
  oopMaxIndividual: decimal("oop_max_individual", { precision: 10, scale: 2 }),
  planYear: integer("plan_year").notNull(),
  scrapedAt: timestamp("scraped_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// US Market — Auto Insurance (state averages + provider ranges)
// ---------------------------------------------------------------------------

export const usAutoInsurance = pgTable("us_auto_insurance", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerName: text("provider_name").notNull(),
  state: text("state").notNull(),
  coverageType: text("coverage_type").notNull(), // liability | full | comprehensive
  annualPremiumAvg: decimal("annual_premium_avg", { precision: 10, scale: 2 }),
  annualPremiumMin: decimal("annual_premium_min", { precision: 10, scale: 2 }),
  annualPremiumMax: decimal("annual_premium_max", { precision: 10, scale: 2 }),
  sourceUrl: text("source_url"),
  dataYear: integer("data_year"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// US Market — Life Insurance (term life rate tables)
// ---------------------------------------------------------------------------

export const usLifeInsurance = pgTable("us_life_insurance", {
  id: uuid("id").primaryKey().defaultRandom(),
  providerName: text("provider_name").notNull(),
  providerSlug: text("provider_slug").notNull(),
  affiliateUrl: text("affiliate_url"),
  productType: text("product_type").notNull(), // term | whole | universal
  termYears: integer("term_years"),            // 10 | 15 | 20 | 30 — null for whole/universal
  coverageAmount: decimal("coverage_amount", { precision: 12, scale: 2 }).notNull(),
  ageGroup: integer("age_group").notNull(),    // representative age: 25 | 30 | 35 | 40 | 45 | 50
  gender: text("gender").notNull(),            // M | F
  healthClass: text("health_class").notNull(), // preferred-plus | preferred | standard
  monthlyPremium: decimal("monthly_premium", { precision: 8, scale: 2 }).notNull(),
  scrapedAt: timestamp("scraped_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// US Market — Authors (E-E-A-T)
// ---------------------------------------------------------------------------

export const usAuthors = pgTable("us_authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").unique().notNull(),       // "javier-keough" | "sabrina-keough"
  displayName: text("display_name").notNull(),
  bioShort: text("bio_short"),                 // 1-2 sentences for byline cards
  bioLong: text("bio_long"),                   // full bio for /us/autor/[slug]
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  avatarUrl: text("avatar_url"),
  expertise: text("expertise").array(),        // ["seguros","hipotecas","remesas"]
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// US Market — Mortgage rates (FRED PMMS, Freddie Mac)
// ---------------------------------------------------------------------------

export const usMortgageRates = pgTable("us_mortgage_rates", {
  id: uuid("id").primaryKey().defaultRandom(),
  product: text("product").notNull(),          // 30yr_conv | 15yr_conv | fha | non_qm | itin
  rate: decimal("rate", { precision: 6, scale: 4 }).notNull(),
  source: text("source").notNull(),            // FRED_PMMS | Freddie_Mac
  observationDate: text("observation_date").notNull(), // YYYY-MM-DD
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// US Market — Carrier alternativas (for "{carrier}-alternativa" pSEO pages)
// ---------------------------------------------------------------------------

export const usCarrierAlternatives = pgTable("us_carrier_alternatives", {
  id: uuid("id").primaryKey().defaultRandom(),
  carrierSlug: text("carrier_slug").unique().notNull(), // "fred-loya"
  carrierName: text("carrier_name").notNull(),          // "Fred Loya Insurance"
  whySearchAlt: text("why_search_alt"),                 // factual context: complaints, pricing
  cubiertoAlternatives: jsonb("cubierto_alternatives"), // [{carrier, whyBetter}]
  statesActive: text("states_active").array(),
  sourceUrls: text("source_urls").array(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// US Market — Programmatic SEO seed list (master list of pages to publish)
// ---------------------------------------------------------------------------

export const usPseoPagesSeed = pgTable("us_pseo_pages_seed", {
  id: uuid("id").primaryKey().defaultRandom(),
  templateType: text("template_type").notNull(),
  variables: jsonb("variables").notNull(),    // {"state":"FL","city":"Hialeah",...}
  language: text("language").notNull().default("es"),
  priority: integer("priority").default(50),
  status: text("status").default("pending"),  // pending | generated | failed | live
  generatedArticleId: uuid("generated_article_id").references(() => articles.id),
  failureReason: text("failure_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// US Market — Lead attribution (every WA click / tool conversion)
// ---------------------------------------------------------------------------

export const usLeadAttribution = pgTable("us_lead_attribution", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmContent: text("utm_content"),
  utmTerm: text("utm_term"),
  landingPage: text("landing_page"),
  pageAtClick: text("page_at_click"),
  destination: text("destination").notNull(), // cubierto | hogares | bot_general | external_lead
  state: text("state"),
  productIntent: text("product_intent"),     // auto | casa | remesa | salud | vida | info
  ipHash: text("ip_hash"),                   // sha256 of IP — never raw
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// US Market — Topic proposals (self-update loop for the strategist)
// ---------------------------------------------------------------------------
// Sources of proposals:
//   - "gsc"           — derived from Search Console queries with high
//                       impressions but no dedicated finazo.us page
//   - "internal"      — derived from internal analytics / Claude reflection
//                       on existing successful articles
//   - "manual"        — added by hand via admin UI or psql
// Status flow: pending → approved → published (or rejected)
// The strategist consumes status='approved' rows alongside the calendar.

export const usTopicProposals = pgTable("us_topic_proposals", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: text("source").notNull(),               // gsc | internal | manual
  slug: text("slug").notNull().unique(),
  category: text("category").notNull(),           // matches articles.category
  preferredAuthor: text("preferred_author").notNull(), // javier-keough | sabrina-keough
  imageQuery: text("image_query"),
  promptText: text("prompt_text").notNull(),
  rationale: text("rationale"),                   // why proposed; useful for review
  /** GSC signal that triggered this — query string, impressions, etc. */
  signalContext: jsonb("signal_context"),
  status: text("status").notNull().default("pending"), // pending | approved | rejected | published
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  publishedSlug: text("published_slug"),          // set when strategist generates the article
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// US Market — Search Console performance snapshots
// ---------------------------------------------------------------------------
// One row per (date, page, query) — 16-month max retention to match GSC.
// Used by the topic-proposer to find:
//  - High-impression queries with no dedicated landing page (new topic)
//  - Pages with high impressions but low CTR (rewrite title/meta)
//  - Pages with strong position but no clicks (improve content)

export const usGscSnapshots = pgTable("us_gsc_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  snapshotDate: timestamp("snapshot_date", { withTimezone: true }).notNull(),
  page: text("page").notNull(),                   // canonical URL
  query: text("query").notNull(),                 // search query
  impressions: integer("impressions").notNull().default(0),
  clicks: integer("clicks").notNull().default(0),
  ctr: decimal("ctr", { precision: 6, scale: 4 }), // 0.0000–1.0000
  position: decimal("position", { precision: 6, scale: 2 }),
  country: text("country"),                       // typically "usa"
  device: text("device"),                         // mobile | desktop | tablet
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// ---------------------------------------------------------------------------
// Article comments
// ---------------------------------------------------------------------------

export const articleComments = pgTable("article_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  articleId: uuid("article_id").references(() => articles.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  content: text("content").notNull(),
  status: text("status").default("pending"), // pending | approved | spam
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
