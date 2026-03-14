# Repository Guidelines

## Project Structure & Module Organization
This repository has two apps: `api/` for the Laravel 12 backend and `ui/` for the React + Vite frontend. In `api/`, business code lives in `app/`, routes in `routes/`, config in `config/`, and schema/seed data in `database/`. In `ui/`, role-based screens live under `src/modules`, shared layouts and helpers under `src/shared`, and Zustand stores under `src/stores`.

### Frontend Navigation & Layouts
Each role has a dedicated layout wrapper in `ui/src/shared/layouts/` that extends the generic `RoleLayout` with role-specific sidebar menu items:
- **AdminLayout**: Dashboard, Users, Departments, Items, Categories, Vendors
- **ManagerLayout**: Dashboard, Requests
- **UserLayout**: Dashboard, Requests
- **GeneralManagerLayout**: Dashboard, Requests, Distributions
- **VendorLayout**: Dashboard, Items

All new menu routes render `ComingSoonPage` stub until feature implementation begins.

Use [`../requirements.md`](C:\laragon\www\imohon\requirements.md) as the detailed domain source and [`../kehendak.md`](C:\laragon\www\imohon\kehendak.md) as the high-level Malay summary.

## Build, Test, and Development Commands
- `cd api && composer setup` installs backend dependencies, creates `.env`, generates the app key, migrates MySQL, and builds default assets.
- `cd api && php artisan serve` runs the Laravel API at `http://localhost:8000`.
- `cd api && php artisan test` runs the backend test suite against `imohon_test`.
- `cd api && php artisan db:seed --force` seeds roles, departments, and demo accounts such as `admin@local`.
- `cd ui && npm install` installs the React frontend dependencies.
- `cd ui && npm run dev` runs the frontend dev server.
- `cd ui && npm run build` verifies the frontend bundle.

## Coding Style & Naming Conventions
Follow `.editorconfig`: UTF-8, LF, and 4-space indentation. Keep Laravel code in PSR-4 namespaces under `App\\...`; use PascalCase for controllers, models, enums, and seeders. Use snake_case for database columns and migration names. In `ui/`, keep module names aligned to backend resources, for example `admin/users`, and prefer Axios service names that mirror Laravel resource actions such as `users.index` and `users.store`.

## Testing Guidelines
Put backend HTTP/auth/workflow coverage in `api/tests/Feature` and isolated logic in `api/tests/Unit`. Frontend changes must at minimum pass `npm run build`. When changing login, logout, or role access, verify Sanctum SPA auth still works between `http://localhost:5173` and `http://localhost:8000`.

## Commit & Pull Request Guidelines
Use short imperative commits, for example `Add Sanctum login flow`. Keep backend and frontend changes grouped by feature, not by file type. PRs should include migration or seeding notes, test evidence (`php artisan test`, `npm run build`), and screenshots for UI changes.

## Security & Configuration Tips
Do not commit `.env` or secrets. For local SPA auth, keep `SANCTUM_STATEFUL_DOMAINS` and `CORS_ALLOWED_ORIGINS` aligned with the UI dev server. Demo logins are seeded with password `password`; treat them as local-only bootstrap accounts.
