-- Self-update infrastructure for the US content strategist.
-- Topic proposals (curated queue of new articles) + Search Console snapshots
-- (raw signal data the topic-proposer reads from).

CREATE TABLE IF NOT EXISTS us_topic_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,                              -- gsc | internal | manual
  slug text NOT NULL UNIQUE,
  category text NOT NULL,
  preferred_author text NOT NULL,
  image_query text,
  prompt_text text NOT NULL,
  rationale text,
  signal_context jsonb,
  status text NOT NULL DEFAULT 'pending',            -- pending | approved | rejected | published
  approved_by text,
  approved_at timestamptz,
  published_slug text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_us_topic_proposals_status_source
  ON us_topic_proposals(status, source);

CREATE TABLE IF NOT EXISTS us_gsc_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date timestamptz NOT NULL,
  page text NOT NULL,
  query text NOT NULL,
  impressions integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  ctr numeric(6,4),
  position numeric(6,2),
  country text,
  device text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_us_gsc_snapshots_date_page
  ON us_gsc_snapshots(snapshot_date DESC, page);

CREATE INDEX IF NOT EXISTS idx_us_gsc_snapshots_query_impressions
  ON us_gsc_snapshots(query, impressions DESC);
