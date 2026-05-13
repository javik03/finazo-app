-- Internal Linking Automation v2 — Phase 0 schema
-- Spec: ~/Downloads/Finazo_Internal_Linking_Automation_Spec_v2.md
-- Requires the `vector` extension (pgvector). Postgres image switched to
-- pgvector/pgvector:pg16 in the same change.

CREATE EXTENSION IF NOT EXISTS vector;

-- 1. link_graph — every internal link with source, target, anchor, context
CREATE TABLE IF NOT EXISTS link_graph (
  id              BIGSERIAL PRIMARY KEY,
  source_url      TEXT NOT NULL,
  target_url      TEXT NOT NULL,
  anchor_text     TEXT NOT NULL,
  context_block   TEXT NOT NULL,
  position_idx    INTEGER NOT NULL,
  first_seen      TIMESTAMPTZ DEFAULT NOW(),
  last_seen       TIMESTAMPTZ DEFAULT NOW(),
  is_canonical    BOOLEAN DEFAULT TRUE,
  UNIQUE (source_url, target_url, anchor_text, context_block)
);
CREATE INDEX IF NOT EXISTS idx_link_source    ON link_graph (source_url);
CREATE INDEX IF NOT EXISTS idx_link_target    ON link_graph (target_url);
CREATE INDEX IF NOT EXISTS idx_link_last_seen ON link_graph (last_seen);
CREATE INDEX IF NOT EXISTS idx_link_context   ON link_graph (context_block);

-- 2. page_embeddings — 768-dim embeddings per page (text-embedding-3-small)
CREATE TABLE IF NOT EXISTS page_embeddings (
  url           TEXT PRIMARY KEY,
  article_id    BIGINT,
  pillar        TEXT NOT NULL,
  cluster       TEXT NOT NULL,
  language      TEXT NOT NULL,
  embedding     vector(768),
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  is_pillar     BOOLEAN DEFAULT FALSE,
  is_leaf       BOOLEAN DEFAULT TRUE,
  last_indexed  TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_page_emb_pillar   ON page_embeddings (pillar);
CREATE INDEX IF NOT EXISTS idx_page_emb_article  ON page_embeddings (article_id);
CREATE INDEX IF NOT EXISTS idx_page_emb_language ON page_embeddings (language);

-- pgvector ivfflat index for cosine similarity queries.
-- lists=100 is a reasonable default; tune up as the corpus grows past 10K rows.
CREATE INDEX IF NOT EXISTS idx_page_emb_vector
  ON page_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 3. audit_findings — nightly audit output (orphans, hub gaps, broken links, etc.)
CREATE TABLE IF NOT EXISTS audit_findings (
  id                 BIGSERIAL PRIMARY KEY,
  finding_type       TEXT NOT NULL,
  severity           TEXT NOT NULL,
  affected_url       TEXT NOT NULL,
  related_url        TEXT,
  details            JSONB NOT NULL,
  auto_fixable       BOOLEAN NOT NULL,
  auto_fix_applied   BOOLEAN DEFAULT FALSE,
  detected_at        TIMESTAMPTZ DEFAULT NOW(),
  resolved_at        TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_findings_unresolved
  ON audit_findings (detected_at)
  WHERE resolved_at IS NULL;

-- 4. linking_bridge_patterns — cross-cluster phrase rules (editor-controlled)
CREATE TABLE IF NOT EXISTS linking_bridge_patterns (
  id              BIGSERIAL PRIMARY KEY,
  target_cluster  TEXT NOT NULL,
  phrase          TEXT NOT NULL,
  language        TEXT NOT NULL,
  active          BOOLEAN DEFAULT TRUE,
  added_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (target_cluster, phrase, language)
);

-- 5. regeneration_queue — work queue read by strategists at loop start
CREATE TABLE IF NOT EXISTS regeneration_queue (
  id                BIGSERIAL PRIMARY KEY,
  article_id        BIGINT,
  reason            TEXT NOT NULL,
  details           JSONB NOT NULL,
  enqueued_at       TIMESTAMPTZ DEFAULT NOW(),
  processed_at      TIMESTAMPTZ,
  processing_error  TEXT
);
CREATE INDEX IF NOT EXISTS idx_regen_queue_pending
  ON regeneration_queue (enqueued_at)
  WHERE processed_at IS NULL;

-- Seed: cross-cluster bridge phrases for the strategist's bridge-opportunity audit.
INSERT INTO linking_bridge_patterns (target_cluster, phrase, language) VALUES
  ('/credito',          'construir crédito',         'es'),
  ('/credito',          'puntaje de crédito',        'es'),
  ('/credito',          'tarjeta de crédito ITIN',   'es'),
  ('/credito',          'historial crediticio',      'es'),
  ('/fiscal',           'ITIN renovación',           'es'),
  ('/fiscal',           'declaración de impuestos',  'es'),
  ('/seguro-de-salud',  'Obamacare',                 'es'),
  ('/seguro-de-salud',  'seguro médico',             'es'),
  ('/seguro-de-salud',  'ACA marketplace',           'es'),
  ('/hipotecas',        'comprar casa',              'es'),
  ('/hipotecas',        'préstamo hipotecario',      'es'),
  ('/seguro-de-auto',   'seguro auto',               'es'),
  ('/seguro-de-auto',   'seguro de coche',           'es'),
  ('/remesas',          'enviar dinero',             'es'),
  ('/remesas',          'remesas a México',          'es')
ON CONFLICT (target_cluster, phrase, language) DO NOTHING;
