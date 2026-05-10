# Trends Landing

Investment landing page for the Trends Telegram Mini App — a Reels-style video feed built inside Telegram.

## Run & Operate

- `pnpm --filter @workspace/trends-landing run dev` — run the landing page (port 22520)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — build lib/db declarations (run before api-server typecheck)
- `pnpm --filter @workspace/db run push` — push DB schema changes to PostgreSQL

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS v4 + shadcn/ui + framer-motion
- API: Express 5 + JWT auth (jsonwebtoken) + bcryptjs
- DB: PostgreSQL + Drizzle ORM
- Build: esbuild (CJS bundle)

## Where things live

### Frontend (`artifacts/trends-landing/src/`)
- `pages/Landing.tsx` — main landing page (hero, sections, FAQ, roadmap)
- `pages/Cabinet.tsx` — investor personal cabinet (investments, MLM stats, wallet settings)
- `pages/Login.tsx` — login page
- `pages/Register.tsx` — registration page with referral code support
- `pages/Admin.tsx` — admin panel (confirm investments)
- `pages/not-found.tsx` — 404 page
- `components/InvestmentModal.tsx` — investment package modal
- `components/SceneBackground.tsx` — animated background
- `hooks/useAuth.tsx` — auth context (JWT stored in localStorage)
- `lib/api.ts` — typed API client (all fetch calls)
- `index.css` — CSS variables, themes, styles
- `attached_assets/` — images (logo, app screenshots)

### Backend (`artifacts/api-server/src/`)
- `routes/auth.ts` — POST /api/auth/register, POST /api/auth/login
- `routes/cabinet.ts` — GET /api/cabinet/me, GET /api/cabinet/referrals, PATCH /api/cabinet/wallet
- `routes/investments.ts` — POST /api/investments, GET /api/investments, admin confirm endpoint
- `middlewares/auth.ts` — requireAuth / requireAdmin JWT middleware
- `lib/jwt.ts` — signToken / verifyToken (uses SESSION_SECRET env var)
- `lib/referral.ts` — MLM bonus calculation (5 levels: 10%, 5%, 3%, 1%, 1%)

### Database (`lib/db/src/schema/`)
- `users.ts` — users table (email, passwordHash, referralCode, referredById, isAdmin, walletAddress)
- `investments.ts` — investments table (userId, packageId, amount, shares, status, txHash)
- `transactions.ts` — transactions table (userId, type, amount, description, referenceId)
- `referrals.ts` — referral_bonuses table (beneficiaryId, fromUserId, investmentId, level, percent, amount)

## Architecture

- JWT auth: token stored in localStorage, sent as `Authorization: Bearer <token>`
- MLM system: 5-level referral bonuses triggered when admin confirms an investment
  - Level 1: 10%, Level 2: 5%, Level 3: 3%, Level 4-5: 1% each
- Investment packages: founder1 ($100), founder2 ($250), founder3 ($1000), founder4 ($5000), founder5 ($25000), founder6 ($100000)
- Images imported via `@assets` alias → resolves to `/home/runner/workspace/attached_assets/`
- Primary color: cyan `#00D4FF`, secondary: purple `#7B5EFF`
- Framer Motion used for scroll-triggered animations throughout

## Product

Trends is described as "the first Reels inside Telegram" — an algorithmic video feed for Telegram's 1 billion users. The landing page targets Pre-Seed investors with a $1M target raise.

## GitHub & Deploy

- Repo: `https://github.com/darcynj757-svg/trends-landing`
- Secret: `GITHUB_PERSONAL_ACCESS_TOKEN` (stored as Replit secret)
- Push: use Replit Git panel (Commit & Push) — `bash scripts/push-github.sh` may fail if token is expired
- Railway auto-deploys from GitHub main branch
- Railway build: `pnpm install --no-frozen-lockfile --ignore-scripts && pnpm --filter @workspace/trends-landing run build:railway`
- Railway start: `pnpm --filter @workspace/trends-landing run serve:railway`

## Environment variables

- `DATABASE_URL` — PostgreSQL connection string (provisioned by Replit)
- `SESSION_SECRET` — JWT signing secret (stored as Replit secret)

## User preferences

- Редактировать только `artifacts/trends-landing/src/`, `artifacts/api-server/src/`, `lib/db/src/` и `attached_assets/`
- Не трогать `.replit-artifact/artifact.toml`
- После каждого изменения — git push в main (через Replit Git panel)
- Цвета: primary cyan `#00D4FF`, secondary purple `#7B5EFF`

## Gotchas

- `@assets` alias in vite.config.ts resolves to `/home/runner/workspace/attached_assets/`
- After adding new tables to `lib/db/src/schema/`, run `pnpm run typecheck:libs` then `pnpm --filter @workspace/db run push`
- Railway config in `vite.config.railway.ts` is for production builds
- `scripts/push-github.sh` uses GITHUB_PERSONAL_ACCESS_TOKEN — if it times out, use Replit Git panel instead
