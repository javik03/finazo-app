@AGENTS.md

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
- **Finazo US V2 redesign (Phase 1 foundation deployed)** — host routing, schema migration, authors seeded, fonts loaded. Live at https://finazo.us. Component port + redesigned homepage pending.
- PR #11 awaiting merge: feat/finazo-us-v2 → master

### Done ✅
- Next.js scaffold with TypeScript strict mode
- NerdWallet-inspired homepage redesign with Header/Footer
- SEO foundation (corridors, banks, guides routes)
- Drizzle ORM integration
- LATAM content engine — 45+ guides published across remesas/préstamos/tarjetas/seguros/educación
- LATAM scrapers live: SSF (SV), SIB (GT), CNBS (HN), remittance (every 6h)
- LATAM country pages: SV, GT, HN, MX, DO
- /guias hub with category pages, related articles, breadcrumbs, featured images, pagination
- /metodologia + /terminos + /privacidad legal pages
- Author bylines + LinkedIn sameAs structured data
- IndexNow integration (Bing/Yandex instant indexing)
- Bing Webmaster verification meta tag + AI crawler permissions in robots.txt
- Existing US pages: /us, /us/credito, /us/prestamos, /us/seguro-de-auto, /us/seguro-de-salud, /us/seguro-de-vida
- US Hispanic content pivot — strategist agent + CMS ACA scraper + US loans scraper
- Geo-routing middleware (Accept-Language → /us redirect)
- Docker + Hetzner deploy config (live on 5.78.42.188)
- GitHub Actions auto-deploy on push to master
- **finazo.us domain live with HTTPS** — Let's Encrypt cert covers finazo.us + www.finazo.us, HTTP→HTTPS 301
- **Host-header middleware routing** — finazo.us rewrites root + sub-paths into /us tree, finazo.lat untouched
- **Schema additions** — articles += language/translation_of/author_slug/template_type/template_variables/data_payload/last_data_refresh/human_reviewed/human_reviewed_at; new tables us_authors, us_mortgage_rates, us_carrier_alternatives, us_pseo_pages_seed, us_lead_attribution
- **US authors seeded** — Javier Keough + Sabrina Keough with placeholder bios
- **US layout shell** — Fraunces + Inter + JetBrains Mono via next/font, v2 design tokens scoped under .finazo-us

### Next ⬜
- Component port: v2 HTML → React (MastheadTop, Nav, Hero, QuizAside, FeaturedGrid, ProductBand, ToolsStrip, ConvoProof, NewsletterBand, QuotesGrid, Footer, FloatingWA)
- New `/us/page.tsx` assembled from v2 components (replaces transitional state)
- E-E-A-T pages: /us/metodologia, /us/estandares-editoriales, /us/acerca, /us/autor/[slug]
- Phase 1.5: Google Search Console + Bing Webmaster Tools verify finazo.us, GA4 cross-domain, Meta/TikTok/LinkedIn pixels via GTM, us_lead_attribution wiring, cookie consent
- Phase 2: 4 working tools — cotizador-seguro (state DOI data), simulador-hipoteca (FRED PMMS), comparador-remesas (existing scraper), credit-tracker (12-month plan)
- Phase 3: programmatic SEO engine — 50+ templates, scrapers (state DOI, FRED, CFPB), generator agent, 1000+ pages
- Phase 4: Content engine v2 — plain-Spanish-first headlines (sin Social Security primary, ITIN secondary), carrier alternativa templates, awareness templates, health/life expansion
- Phase 5: Parasite SEO — Medium/Substack/LinkedIn syndication, Reddit/Quora playbook, HARO outreach
- Phase 6: GEO scaffolding — llms.txt v2, Wikidata/Wikipedia seeding, AI citation tracking
- English mirror at /en/* with hreflang pairs
- WhatsApp AI bot (separate PLAN-WA-BOT.md)
- Hogares AI mortgage broker product (separate repo)
- YouTube animated explainer pipeline (separate plan)
- Finazo Score algorithm
- Comparison widget (embeddable for Credimovil/Cubierto referral)

### Blocked ⛔
