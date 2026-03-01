# AGENTS.md

## What is this

Next.js 14 App Router personal finance app. tRPC + Drizzle ORM + PostgreSQL + Inversify DI. All TypeScript.

## Rules

- Use `bun`, never `npm` or `yarn`
- No semicolons. Double quotes. 120 char line width. Trailing commas (es5)
- Path alias: `@/*` maps to project root (e.g., `@/modules/...`, `@/db/schema`)
- All app pages are `"use client"` components
- Never use server actions — all server communication goes through tRPC
- Use `privateProcedure` for any authenticated route, `publicProcedure` only for unauthenticated (login/register)
- Serialization is `superjson` — dates and other complex types work automatically through tRPC

## Architecture: Clean Architecture + DI

Business logic lives in `modules/` following strict layering. **Never skip layers or instantiate classes directly.**

To add a new feature, follow this exact order:

1. **Domain** (`modules/{module}/domain/`) — define interface (repository or entity)
2. **Infra** (`modules/{module}/infra/`) — implement with Drizzle
3. **Use-case** (`modules/{module}/use-cases/`) — business logic class with `@injectable()` + `@inject(TYPES.X)`
4. **DI binding** — add symbol in `modules/container/types.ts`, bind in `modules/container/inversify.config.ts`
5. **Client** (`modules/{module}/clients/`) — public facade that resolves from DI container
6. **tRPC router** (`server/routers/`) — call the client, never the use-case directly

Existing modules: `users`, `transactions`, `accounts`. Each has `domain/`, `infra/`, `use-cases/`, `clients/`.

## tRPC

- Router definitions in `server/routers/`, composed in `server/index.ts`
- Context extracts JWT user via NextAuth's `getToken()` — see `server/context.ts`
- Client-side: use `trpc.{module}.{method}.useQuery()` / `.useMutation()` from `src/utils/_trpc/client.ts`

## Database

- Drizzle ORM with PostgreSQL. Schema in `db/schema/index.ts`
- Table names are PascalCase in DB, camelCase fields in code
- Generate migrations: `bun run db:generate`. Apply: `bun run db:migrate`
- DB client is singleton in `db/index.ts`

## Frontend Conventions

- UI components from shadcn/ui live in `src/ui-lib/components/ui/` — don't modify these unless necessary
- Use `cn()` from `src/ui-lib/lib/utils.ts` for conditional Tailwind classes
- Forms: always use `react-hook-form` + `zod` schema + `zodResolver`
- No Redux/Zustand — server state via React Query (through tRPC), client state via React hooks
- Mobile-first design, max-width `480px` (`max-w-slim`)
- Responsive modals: use Drawer on mobile, Dialog on desktop
- Feature components live in `src/{feature}/components/`

## Auth Flow (middleware)

Middleware chain in `middlewares/` enforces this order: unauthenticated → `/login`, unverified email → `/verify-email`, not onboarded → `/onboarding`. All `/dashboard` routes are protected.

## Cron

`/api/cron/generateRecurrentTransactions` runs daily via Vercel cron. Requires `Authorization: Bearer {CRON_SECRET}`.
