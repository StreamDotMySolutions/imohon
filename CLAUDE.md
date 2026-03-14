# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Imohon** is an inventory tracking system designed to manage the complete lifecycle of item requests, approvals, distributions, and acceptance. The system enforces strict role-based workflows and maintains inventory integrity throughout the process.

- **Backend**: Laravel 12 API with Sanctum authentication and Spatie Permission for role management
- **Frontend**: React 18 with Vite build tool and Bootstrap for styling
- **Database**: MySQL (or SQLite for development)
- **Architecture**: Monorepo structure with `/api` (Laravel) and `/ui` (React) directories

## Key Architecture Concepts

### Core Domain Models (Eloquent-based)

The system is built around these primary Eloquent relationships:

**Inventory Domain**
- `ItemCategory` → has many `Item`
- `Vendor` → belongs to many `Item` (through pivot table with quantity tracking)
- All measurements tracked in `unit` only

**Organization Domain**
- `Department` → has many `User`
- Each user has exactly one role (User, Manager, Admin, GeneralManager)
- `HQ` is a special department for Admin and GeneralManager roles

**Workflow Domain**
- `User` → has many `Request`
- `Request` → has one `Distribution`
- `Distribution` → has many `DistributionTravel` and `DistributionAcceptance`
- Detail tracking at unit level for Request, Distribution, and Acceptance

### Critical Business Rules

- **Partial distributions** allowed if inventory insufficient, but only one distribution attempt per request
- **Unit-level tracking**: RequestUnit, DistributedUnit, AcceptedUnit records exist for each transaction
- **Inventory validation**: Distribution cannot exceed available inventory
- **Workflow immutability**: Manager/Admin rejections require new requests; GeneralManager rejection closes process permanently
- **Role isolation**: Users reviewed by Manager from same department only

## Setup & Development Commands

### Initial Setup (API)
```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
cd ../ui
npm install
```

### Development Environment

From the **root directory**, run all services concurrently:
```bash
cd api && composer run dev
```

This starts:
- Laravel development server (port 8000)
- Queue listener
- Log viewer (pail)
- Vite dev server for frontend (port 5173)

### API Development (standalone)
```bash
cd api
php artisan serve  # Server at http://localhost:8000
php artisan queue:listen --tries=1 --timeout=0
php artisan migrate  # Run migrations
php artisan migrate:fresh --seed  # Reset with seeders
php artisan tinker  # Interactive shell
```

### Frontend Development (standalone)
```bash
cd ui
npm run dev  # Dev server with HMR
npm run build  # Production build
```

### Testing

**Run all tests** (from api directory):
```bash
composer test
```

**Run specific test suite**:
```bash
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature
```

**Run single test file**:
```bash
php artisan test tests/Feature/AuthAuthenticationTest.php
```

**Run test matching pattern**:
```bash
php artisan test --filter=LoginTest
```

Tests expect MySQL database `imohon_test` (see `phpunit.xml`).

## API Architecture

### Routing & Controllers

API routes located in `api/routes/api.php`:
- **Auth routes**: `/login`, `/me`, `/logout` (no middleware, sanctum-protected, or public)
- **Admin routes**: `/admin/*` (requires `auth:sanctum` + `role:Admin` middleware)
- Pattern: Controllers grouped by domain in `Api\{Domain}\{Resource}Controller`

### Authentication & Authorization

- **Sanctum**: Token-based API authentication with stateful cookie support
- **Spatie Permission**: Role middleware handles `role:Admin` checks
- **CORS**: Configured for `localhost:5173` (frontend dev server)
- **Sanctum config**: See `api/config/sanctum.php`

### Request/Response Patterns

- Use `App\Http\Requests\*` for validation and authorization
- Validation rules should check role dependencies (e.g., UserDepartmentRule ensures users belong to same department as their manager)
- Return API resources or paginated collections from controllers

## Frontend Architecture

### Directory Structure

- `src/shared/` - Global utilities, layouts, auth helpers, constants
  - `lib/authApi.js` - Sanctum token management and login
  - `lib/http.js` - Axios instance with interceptors
  - `layouts/` - RoleLayout (role-based routing), AdminLayout
  - `components/` - Reusable UI components (FeedbackAlert, PageHeader, StatusPill, etc.)
- `src/modules/` - Feature-based modules (e.g., `admin/users/`)
  - Each module: `api/`, `components/`, `pages/`, `store/`, `data/`
  - `store/` - Zustand state management
  - `data/` - Static lists and options
- `src/routes/` - React Router configuration
- `src/main.jsx` - Entry point with providers

### State Management

- **Zustand stores** in each module for local feature state
- **Axios interceptors** for auto-attaching auth tokens
- **Role constants** in `shared/constants/roles.js`

## Database Migrations & Seeders

Located in `api/database/`:

- `migrations/` - Schema changes (run with `php artisan migrate`)
- `seeders/` - Test data population
  - `DatabaseSeeder` - Main seeder
  - `RoleUserSeeder` - Creates roles and initial users

Test database: `imohon_test` (defined in `phpunit.xml`)

## Enums & Constants

Located in `api/app/Enums/`:

- `RoleName` - User, Manager, Admin, GeneralManager
- `DepartmentType` - Department classification (if expanded)

Fixed enums in database migrations for acceptance issues (MISSING, DAMAGED, WRONG_ITEM).

## Configuration Files

- **API**: `api/.env.example` - Database, Sanctum, CORS, queue settings
  - `api/config/app.php` - App name, locale, timezone
  - `api/config/sanctum.php` - Token guards, stateful domains
  - `api/config/cors.php` - Allowed origins (localhost:5173)
- **Frontend**: `ui/.env.example` - API endpoint base URL (if needed)

## Common Patterns & Conventions

### Middleware Stack

Request flows through:
1. CORS middleware (Laravel)
2. Sanctum authentication (for protected routes)
3. Spatie Permission role/permission checks
4. Custom validation in Form Requests

### Error Handling

- Laravel returns JSON responses with HTTP status codes
- Frontend Axios interceptors handle 401/403 redirects
- Use `FeedbackAlert` component for user feedback

### File Organization

- Feature-based modules in UI (grouped by domain)
- Domain-based controllers in API (`Api\{Domain}\{Controller}`)
- Tests mirror source structure (Unit & Feature suites)

## Development Workflow Tips

- **Database reset**: `php artisan migrate:fresh --seed` (starts clean with seeders)
- **View database**: Check `.env` DB settings; use a MySQL client or Laravel Tinker
- **API debugging**: Use `php artisan pail` or check `storage/logs/`
- **Frontend state issues**: Check Zustand store in browser DevTools (if Redux DevTools plugin available)
- **CORS issues**: Verify `SANCTUM_STATEFUL_DOMAINS` and `CORS_ALLOWED_ORIGINS` in `.env`
- **Token issues**: Tokens stored in localStorage (inspect with browser DevTools → Application → Storage)

## Performance Considerations

- Frontend built with Vite (fast HMR in dev, optimized production build)
- Database queries: Use Eloquent lazy loading/eager loading appropriately
- Unit-level detail records (RequestUnit, etc.) may grow large; consider pagination/filtering in list views
