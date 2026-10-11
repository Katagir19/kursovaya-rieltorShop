# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Coursework (курсовая) information system for landlords: tenants (жильцы), apartments (апартаменты), payments (платежи). Dashboard and Settings pages are stubs. Runs locally only, no deploy. All UI text, API messages, and status values are in Russian.

## Commands

There is no test suite and no TypeScript config/typecheck step.

Frontend (run from `frontend/`):
```bash
npm install
npm run dev       # Vite dev server, http://localhost:5173
npm run build
npm run lint      # oxlint (config: frontend/.oxlintrc.json)
```

Backend (run from `backend/`):
```bash
py -m uvicorn backend:app --reload   # http://127.0.0.1:8000, Swagger at /docs
```
There is no `requirements.txt` yet; the backend needs `fastapi uvicorn mysql-connector-python pyjwt bcrypt`.

Database: MySQL via XAMPP (start Apache + MySQL), database `realtor_db`, user `root`, empty password. The schema is not in the repo — tables `users`, `tenants`, `apartments` are inferred from queries in `backend/backend.py`.

## Architecture

**Backend** is a single file, `backend/backend.py` (FastAPI). Each endpoint opens its own `mysql.connector` connection via `get_db_connection()` and uses raw SQL. Auth is JWT (HS256, 24h) via `HTTPBearer`; every data endpoint depends on `get_current_user` and scopes rows by `user_id`. Endpoints: `POST /api/auth/login`, `GET /api/auth/me`, and `GET/POST/DELETE` for `/api/tenants` and `/api/apartments`. There are no update (PUT/PATCH) endpoints and no payments table. `verify_password` is a strict bcrypt check (the `password123` backdoor was removed); the 5 agents and their passwords are created by `py seed_users.py` and listed in `QUICK_USERS` in `Header.tsx`.

**Frontend** (`frontend/src`, React 19 + react-router 7 + Emotion, mixed `.jsx`/`.tsx`) follows a layered data flow:

1. `shared/services/apiClient.ts` — `apiRequest<T>()` wraps fetch with hardcoded `BASE_URL` `http://127.0.0.1:8000`, attaches `Bearer` token from `localStorage.token`, throws `ApiError` using FastAPI's `detail`.
2. `shared/services/*Service.ts` — per-entity services that define the raw API shape (`*Api` interface) and normalize it into domain types (`to*` mappers: nulls → `''`, Decimal strings → numbers, `tenant_id` number → string for `<select>` and back to number on create).
3. `shared/types/` — domain types; `Create*Input = Omit<T, 'id' | 'created_at'>`.
4. `shared/hooks/use*` — load data on mount, hold `{ data, isLoading, error }`, and expose add/delete that update local state optimistically after the API call (no refetch).
5. `pages/<Page>/` — page component, its card/modal subcomponents, and a `style.ts` with Emotion styled components. Search/status filtering is done client-side in the page with `useMemo` + the shared `components/FilterBar`.

Cross-cutting details that are easy to miss:
- **Login lives in `components/Header/Header.tsx`** (no login page). It stores `token` and `user` in localStorage.
- **Payments are derived, not stored**: `usePayments` joins apartments that have a `tenant_id` with tenants; due date = apartment `created_at` + 1 month. Paid amounts are persisted only in browser localStorage (`payment_paid_amount_<id>`) via `usePaymentStorage`.
- Design tokens (colors, fonts, radius, layout sizes) are in `src/theme.ts`; styles import `theme` directly rather than using an Emotion ThemeProvider.
- Naming uses the misspelling "Apartaments" in types and hooks (`Apartaments`, `useApartaments`, `CreateApartamentsInput`) while the service/API use "apartments" — match the existing name when referencing these.
