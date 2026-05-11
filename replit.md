# Trends Landing

Investment landing page for the Trends Telegram Mini App (Reels inside Telegram). Allows investors to learn about the project and select investment packages.

## Run & Operate

- `pnpm --filter @workspace/trends-landing run dev` — run the landing page (port 22520)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + framer-motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/trends-landing/src/pages/Landing.tsx` — main landing page (hero, sections, FAQ, roadmap)
- `artifacts/trends-landing/src/pages/Cabinet.tsx` — investor personal cabinet
- `artifacts/trends-landing/src/pages/not-found.tsx` — 404 page
- `artifacts/trends-landing/src/components/InvestmentModal.tsx` — investment package selection modal
- `artifacts/trends-landing/src/index.css` — CSS variables, themes, styles
- `attached_assets/` — images (logo, app screenshots, etc.)
- `lib/db/src/schema/` — DB schema (users, investments, transactions, referrals)
- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)

## Architecture decisions

- Frontend-only landing with no required backend for the core investment CTA flow
- Images imported via `@assets` alias → resolves to `attached_assets/` folder
- Colors: primary cyan `#00D4FF`, secondary purple `#7B5EFF` (defined in `index.css`)
- Railway CI/CD: every git push to `main` triggers an automatic rebuild on Railway prod

## Product

Investment landing page for Trends — the first Reels platform inside Telegram. Features hero section, monetization pitch, investor packages (Starter $100, Genesis $1000, Growth $10000, Whale $50000), roadmap, and FAQ.

## User preferences

- Edit only `artifacts/trends-landing/src/` and `attached_assets/`
- Do not touch `.replit-artifact/artifact.toml`
- After each change, push to GitHub main → Railway auto-deploys
- Colors: primary cyan #00D4FF, secondary purple #7B5EFF

## Gotchas

- Images must be imported via `@assets` alias (resolves to `attached_assets/`)
- GitHub remote: `https://github.com/darcynj757-svg/trends-landing.git`
- Railway prod: `https://trends-landing-production.up.railway.app`
- Git push must be done after every file change for Railway to pick it up

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
