<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Finazo — Agent Rules

## Stack
Next.js 14 App Router · TypeScript strict · Drizzle ORM · PostgreSQL
Branch: master (not main) · Server: Hetzner (planned)

## Workflow — Git + Test + Deploy (NEVER skip steps)

### Local Dev
```bash
npm install
cp .env.example .env.local        # fill in local values
npm run dev                        # starts on localhost:3000
```

### Before Every Commit
```bash
npx tsc --noEmit                   # TypeScript — zero errors required
npm run lint                       # ESLint
npm run build                      # Next.js build must succeed locally
```

### Git Workflow
```bash
git checkout -b feat/description   # NEVER commit to master directly
# make changes
npx tsc --noEmit && npm run build  # must pass
git add <specific files>           # never git add -A blindly
git status                         # confirm no .env or secrets staged
git commit -m "type(scope): description"
git push origin feat/description
# open PR → review → merge to master → delete branch
```

### Before Deploying to Server
```bash
npm run build                      # must succeed with zero errors
npm test                           # all tests must pass
# CI (GitHub Actions) must be green
# Deploy via GitHub Actions workflow_dispatch — never SSH manually
```

### Commit Message Format
```
feat(seo): add corridor pages
fix(scraper): handle rate API timeout
chore(deps): update next.js
```

## Critical Rules
- TypeScript strict mode — no `any`, use `unknown` and narrow
- Zod validation on all API routes and external data
- No secrets in code — all via environment variables
- SEO: every programmatic page must have proper metadata (title, description, canonical)
- Scraper data must be validated before writing to DB — never trust external APIs blindly
