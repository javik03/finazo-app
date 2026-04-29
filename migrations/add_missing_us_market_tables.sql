-- ============================================================================
-- Add the original US market tables that were never applied to production.
-- Source schema: src/lib/db/schema.ts (us_auto_insurance, us_health_plans,
--                                      us_life_insurance, us_loan_products,
--                                      us_loan_providers)
-- Date: 2026-04-28
-- Idempotent: every CREATE uses IF NOT EXISTS.
-- ============================================================================

CREATE TABLE IF NOT EXISTS us_loan_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  affiliate_url TEXT,
  provider_type TEXT NOT NULL,
  accepts_itin BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS us_loan_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES us_loan_providers(id),
  product_name TEXT NOT NULL,
  loan_type TEXT NOT NULL,
  apr_min DECIMAL(6,4),
  apr_max DECIMAL(6,4),
  amount_min DECIMAL(12,2),
  amount_max DECIMAL(12,2),
  term_min_months INTEGER,
  term_max_months INTEGER,
  min_credit_score INTEGER,
  origination_fee_percent DECIMAL(5,4),
  funding_days INTEGER,
  scraped_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS us_auto_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  state TEXT NOT NULL,
  coverage_type TEXT NOT NULL,
  annual_premium_avg DECIMAL(10,2),
  annual_premium_min DECIMAL(10,2),
  annual_premium_max DECIMAL(10,2),
  source_url TEXT,
  data_year INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_us_auto_insurance_state ON us_auto_insurance(state);

CREATE TABLE IF NOT EXISTS us_health_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cms_plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  issuer_name TEXT NOT NULL,
  state TEXT NOT NULL,
  county_fips TEXT,
  metal_level TEXT NOT NULL,
  plan_type TEXT,
  premium_adult_40 DECIMAL(10,2),
  deductible_individual DECIMAL(10,2),
  oop_max_individual DECIMAL(10,2),
  plan_year INTEGER NOT NULL,
  scraped_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_us_health_plans_state ON us_health_plans(state, plan_year);

CREATE TABLE IF NOT EXISTS us_life_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  provider_slug TEXT NOT NULL,
  affiliate_url TEXT,
  product_type TEXT NOT NULL,
  term_years INTEGER,
  coverage_amount DECIMAL(12,2) NOT NULL,
  age_group INTEGER NOT NULL,
  gender TEXT NOT NULL,
  health_class TEXT NOT NULL,
  monthly_premium DECIMAL(8,2) NOT NULL,
  scraped_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_us_life_insurance_lookup
  ON us_life_insurance(product_type, age_group, gender, health_class);
