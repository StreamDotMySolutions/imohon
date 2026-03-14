# Repository Guidelines

## Project Structure & Module Organization
This repository contains the Laravel API application in `api/`. Core domain code lives in `app/`, HTTP entry points in `routes/`, configuration in `config/`, and database migrations, factories, and seeders in `database/`. Frontend build inputs are in `resources/js` and `resources/css`; compiled assets are served from `public/`. Automated tests live in `tests/Feature` and `tests/Unit`.

The business domain is an inventory workflow: requests, distributions, travel, and acceptance. Keep new models, policies, and services aligned with the relationships and rules described in `../requirements.md`.

## Build, Test, and Development Commands
- `composer setup` installs PHP and Node dependencies, creates `.env` if needed, generates an app key, runs migrations, and builds assets.
- `composer dev` starts the local stack: Laravel server, queue listener, log tailing, and Vite.
- `composer test` clears cached config and runs the Laravel test suite.
- `npm run dev` runs the Vite dev server only.
- `npm run build` creates production frontend assets.
- `vendor/bin/pint` formats PHP code to the project standard.

## Coding Style & Naming Conventions
Follow `.editorconfig`: UTF-8, LF line endings, and 4 spaces for indentation; use 2 spaces only for YAML. Use PSR-4 namespaces under `App\\`, `Database\\Factories\\`, and `Database\\Seeders\\`. Name controllers, models, and jobs in singular PascalCase, for example `DistributionTravelController` and `ItemCategory`. Use snake_case for database columns and migration names such as `create_distribution_acceptances_table`.

## Testing Guidelines
Write request and workflow tests in `tests/Feature`; keep isolated logic tests in `tests/Unit`. Name test files after the class under test or behavior, for example `RequestApprovalTest.php`. Prefer descriptive methods such as `test_admin_cannot_create_second_distribution_attempt()`. Add coverage for validation, authorization, Eloquent relationships, and inventory constraints before opening a PR.

## Commit & Pull Request Guidelines
Current Git history is minimal (`init`), so use short, imperative commit subjects going forward, for example `Add distribution approval policy`. Keep each commit focused on one logical change. PRs should include a brief summary, affected routes or models, migration notes, test evidence (`composer test`), and sample payloads or screenshots when response shape or UI-facing assets change.

## Security & Configuration Tips
Do not commit `.env`, secrets, or generated files from `storage/`. Use `.env.example` for new variables. When adding auth or role checks, keep Laravel Sanctum and `spatie/laravel-permission` as the source of truth for API access control.
