# MERN + Vite + TypeScript Monorepo

## Overview

- Top-level structure:
  - `platform/`
    - `server/` — Express + Mongoose API (TypeScript, `tsx` runner)
    - `client-admin/` — Admin React app (Vite + React + TS)
    - `shared/` — Shared `ui/`, `types/`, and `hooks/` used by both clients
  - `rations-site/`
    - `client-web/` — Public-facing React site (Vite + React + TS)

## Shared Modules

- Shared components, types, and hooks live under `platform/shared`:
  - `platform/shared/ui` — cross-app presentational components
  - `platform/shared/types` — shared TypeScript interfaces
  - `platform/shared/hooks` — reusable hooks
- Path aliases are configured so both clients can import shared code via:
  - `@shared/ui/*`, `@shared/types`, `@shared/hooks/*`
- Aliases are set in both clients’ `tsconfig.json` and `vite.config.ts`.

## TypeScript Configuration

- Clients use `jsx: "react-jsx"` and `moduleResolution: "bundler"` for Vite.
- `platform/shared/tsconfig.json` extends `platform/client-admin/tsconfig.json` so editors treat shared TSX as part of the React setup.
- To help the editor resolve JSX runtime and Vite types from the client-admin installation, shared tsconfig provides `paths` for:
  - `react` → `../client-admin/node_modules/@types/react`
  - `react/jsx-runtime` → `../client-admin/node_modules/@types/react/jsx-runtime`
  - `vite/client` → `../client-admin/node_modules/vite/client.d.ts`

## Development

- Install dependencies per project:
  - `cd platform/server && npm install`
  - `cd platform/client-admin && npm install`
  - `cd rations-site/client-web && npm install`
- Start servers:
  - API: `cd platform/server && npm run dev`
  - Admin: `cd platform/client-admin && npm run dev`
  - Site: `cd rations-site/client-web && npm run dev`
- Typecheck:
  - API: `cd platform/server && npm run typecheck`
  - Admin: `cd platform/client-admin && npm run typecheck`
  - Site: `cd rations-site/client-web && npm run typecheck`

## Environment

- Server reads environment variables from `platform/server/.env`.
  - Example: `platform/server/.env.example` shows `PORT=6000`.
- Clients proxy API requests to the server via Vite dev server:
  - The site’s `vite.config.ts` proxies `/api` to `process.env.PLATFORM_API_URL` or `process.env.PLATFORM_BASE_URL`, defaulting to `http://localhost:6000`.
  - Ensure the server is running on the same port for local development.

## Conventions

- Keep shared area focused on UI/components, types, and hooks only.
- Do not place business logic or app-specific behavior in `platform/shared`.
- Prefer copy→verify→remove when migrating files; keep changes minimal and reversible.

## Build

- Clients: `npm run build` in each client directory.
- Server: use `npm run start` for production with `tsx`, or compile separately if desired.

## Troubleshooting

- If VS Code shows stale TS errors after refactors:
  - Run “TypeScript: Restart TS Server”.
  - Reload the IDE window.
  - Ensure you opened the repository root containing only `platform/` and `rations-site/`.

