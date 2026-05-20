# Trends Landing

Investment landing page for the Trends Telegram Mini App (Reels inside Telegram). Allows investors to learn about the project and select investment packages.

## Run & Operate

- `pnpm --filter @workspace/trends-landing run dev` — run the landing page (port 5000)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — build lib/db declarations (run before api-server typecheck)
- `pnpm --filter @workspace/db run push` — push DB schema changes to PostgreSQL

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS + shadcn/ui + framer-motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
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

### Backend (`artifacts/api-server/src/`)
- `routes/auth.ts` — POST /api/auth/register, POST /api/auth/login
- `routes/cabinet.ts` — GET /api/cabinet/me, GET /api/cabinet/referrals, PATCH /api/cabinet/wallet
- `routes/investments.ts` — POST /api/investments, GET /api/investments, admin confirm endpoint
- `middlewares/auth.ts` — requireAuth / requireAdmin JWT middleware
- `lib/jwt.ts` — signToken / verifyToken (uses SESSION_SECRET env var)
- `lib/referral.ts` — MLM bonus calculation (5 levels: 10%, 5%, 3%, 1%, 1%)

- Frontend-only landing with no required backend for the core investment CTA flow
- Images imported via `@assets` alias → resolves to `attached_assets/` folder
- Colors: primary cyan `#00D4FF`, secondary purple `#7B5EFF` (defined in `index.css`)
- Render CI/CD: every git push to `main` triggers an automatic rebuild on Render

## Product

Investment landing page for Trends — the first Reels platform inside Telegram. Features hero section, monetization pitch, investor packages (Starter $100, Genesis $1000, Growth $10000, Whale $50000), roadmap, and FAQ.

## User preferences

- Edit only `artifacts/trends-landing/src/` and `attached_assets/`
- Do not touch `.replit-artifact/artifact.toml`
- After each change, push to GitHub main → Render auto-deploys
- Colors: primary cyan #00D4FF, secondary purple #7B5EFF

## Gotchas

- Images must be imported via `@assets` alias (resolves to `attached_assets/`)
- GitHub remote: `https://github.com/darcynj757-svg/trends-landing.git`
- Render prod: see Render dashboard for the live URL
- Git push must be done after every file change for Render to pick it up
- Production build uses `vite.config.prod.ts` (no PORT/BASE_PATH env vars required)
- Render build script: `build-render.sh` → calls `build:prod` then API server build

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
