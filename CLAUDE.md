# Finazo — Claude Code Context

## What This Product Is
NerdWallet for Central America. Financial comparison platform for remittances,
loans, and insurance across El Salvador, Guatemala, Honduras, and Mexico.
Revenue model: affiliate/referral fees from financial institutions.
Programmatic SEO is the primary traffic acquisition strategy.

## Architecture
**Runtime:** Node.js + TypeScript (strict mode), Next.js 14 App Router
**Database:** PostgreSQL via Drizzle ORM
**AI:** Anthropic Claude API (article generation, rate summarization)
**Hosting:** Hetzner (Docker + Docker Compose + Nginx) — planned
**Branch:** master (not main)

## Key Directories
```
src/app/              — Next.js App Router pages
src/app/(seo)/        — Programmatic SEO routes (corridors, banks, guides)
src/components/       — Shared UI components (Header, Footer, etc.)
src/lib/db/           — Drizzle ORM schema + queries
src/lib/scrapers/     — Rate scrapers (banks, remittance providers)
src/lib/agents/       — Claude-powered article generator
```

---

## Build Status

### In Progress 🔨
- Programmatic SEO pages (corridors, banks, guides) — routes exist, need real rate data
- Drizzle DB schema and scraper agents setup

### Done ✅
- Next.js scaffold with TypeScript strict mode
- NerdWallet-inspired homepage redesign with Header/Footer
- SEO foundation (corridors, banks, guides routes)
- Drizzle ORM integration

### Next ⬜
- Rate scrapers for top 5 remittance corridors (SV, GT, HN, MX)
- Bank rate data ingestion (Banco Agrícola, Davivienda, BAC)
- Finazo Score algorithm (comparison scoring for each product)
- Comparison widget (embeddable for Credimovil/Cubierto referral flow)
- Admin dashboard for rate management
- Docker + Hetzner deploy config

### Blocked ⛔
