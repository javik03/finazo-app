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
  keywords: text("keywords").array(),
  status: text("status").default("draft"), // draft | published | archived
  featuredImageUrl: text("featured_image_url"),
  wordCount: integer("word_count"),
  generatedBy: text("generated_by").default("claude"), // claude | human
  authorName: text("author_name"), // null = "Equipo Finazo" fallback
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
