-- Migration: add author_name to articles table
-- Run manually: psql $DATABASE_URL -f migrations/add_author_name_to_articles.sql

ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_name TEXT;

-- Existing articles keep NULL (will show "Equipo Finazo" fallback in UI)
