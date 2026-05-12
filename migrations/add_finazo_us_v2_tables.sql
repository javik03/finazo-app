-- ============================================================================
-- Finazo US V2 — schema additions
-- Date: 2026-04-28
-- Plan: PLAN-FINAZO-US-V2.md (Phase 1)
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. articles — additive columns for language, programmatic SEO, review state
-- ---------------------------------------------------------------------------

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'es',
  ADD COLUMN IF NOT EXISTS translation_of UUID,
  ADD COLUMN IF NOT EXISTS author_slug TEXT,
  ADD COLUMN IF NOT EXISTS template_type TEXT,
  ADD COLUMN IF NOT EXISTS template_variables JSONB,
  ADD COLUMN IF NOT EXISTS data_payload JSONB,
  ADD COLUMN IF NOT EXISTS last_data_refresh TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS human_reviewed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS human_reviewed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_articles_template
  ON articles(template_type, country, language);

CREATE INDEX IF NOT EXISTS idx_articles_translation
  ON articles(translation_of);

CREATE INDEX IF NOT EXISTS idx_articles_language
  ON articles(language, country, status);

-- ---------------------------------------------------------------------------
-- 2. us_authors — E-E-A-T author table (Javier, Sabrina, future)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS us_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio_short TEXT,
  bio_long TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  avatar_url TEXT,
  expertise TEXT[],
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_us_authors_active ON us_authors(active);

-- ---------------------------------------------------------------------------
-- 3. us_mortgage_rates — daily FRED PMMS rates for simulator + pSEO
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS us_mortgage_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product TEXT NOT NULL,
  rate DECIMAL(6,4) NOT NULL,
  source TEXT NOT NULL,
  observation_date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_us_mortgage_rates_obs
  ON us_mortgage_rates(product, observation_date, source);

CREATE INDEX IF NOT EXISTS idx_us_mortgage_rates_recent
  ON us_mortgage_rates(product, observation_date DESC);

-- ---------------------------------------------------------------------------
-- 4. us_carrier_alternatives — feeds {carrier}-alternativa pSEO pages
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS us_carrier_alternatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carrier_slug TEXT UNIQUE NOT NULL,
  carrier_name TEXT NOT NULL,
  why_search_alt TEXT,
  cubierto_alternatives JSONB,
  states_active TEXT[],
  source_urls TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 5. us_pseo_pages_seed — master list of programmatic pages to publish
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS us_pseo_pages_seed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type TEXT NOT NULL,
  variables JSONB NOT NULL,
  language TEXT NOT NULL DEFAULT 'es',
  priority INT DEFAULT 50,
  status TEXT DEFAULT 'pending',
  generated_article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pseo_seed_status
  ON us_pseo_pages_seed(status, priority DESC);

CREATE INDEX IF NOT EXISTS idx_pseo_seed_template
  ON us_pseo_pages_seed(template_type, language);

-- ---------------------------------------------------------------------------
-- 6. us_lead_attribution — every WA click / conversion is logged here
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS us_lead_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  landing_page TEXT,
  page_at_click TEXT,
  destination TEXT NOT NULL,
  state TEXT,
  product_intent TEXT,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lead_attribution_destination
  ON us_lead_attribution(destination, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_lead_attribution_session
  ON us_lead_attribution(session_id);

CREATE INDEX IF NOT EXISTS idx_lead_attribution_landing
  ON us_lead_attribution(landing_page, destination);

-- ---------------------------------------------------------------------------
-- DONE
-- ---------------------------------------------------------------------------
