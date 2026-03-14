# Imohon – Inventory Tracking System

**Imohon** is an inventory management system designed to streamline the complete lifecycle of item requests, approvals, distributions, and acceptance. It enforces strict role-based workflows and maintains inventory integrity throughout the process.

## Tech Stack

- **Backend**: Laravel 12 API with Sanctum authentication and Spatie Permission
- **Frontend**: React 18 with Vite and Bootstrap
- **Database**: MySQL
- **Architecture**: Monorepo (`/api` and `/ui` directories)

## Roles & Workflow

| Role | Responsibilities |
|------|---|
| **User** | Submits item requests from their department |
| **Manager** | Reviews and approves/rejects requests from users in their department |
| **Admin** | Manages departments, items, categories, and vendors; creates distributions and submits for GeneralManager approval |
| **GeneralManager** | Approves or rejects distributions submitted by Admin |
| **Vendor** | Manages the item catalog |

### Request & Distribution Workflow

```
User submits Request
    ↓
Manager reviews & approves
    ↓
Admin creates Distribution (items by category)
    ↓
GeneralManager approves
    ↓
Distribution travels to destination & items accepted
```

## Module Status

| Module | Status | Feature |
|--------|--------|---------|
| **Auth** | ✅ Implemented | Login, logout, current user |
| **Admin Users** | ✅ Implemented | Create, read, update, delete users |
| **Admin Departments** | 🚧 Coming Soon | Manage departments |
| **Admin Items** | 🚧 Coming Soon | Manage inventory items |
| **Admin Categories** | 🚧 Coming Soon | Manage item categories |
| **Admin Vendors** | 🚧 Coming Soon | Manage vendors |
| **Admin Distributions** | 🚧 Coming Soon | Create & submit distributions |
| **Manager Requests** | 🚧 Coming Soon | Review & approve requests |
| **User Requests** | 🚧 Coming Soon | Submit & track requests |
| **GeneralManager Distributions** | 🚧 Coming Soon | Approve/reject distributions |
| **Vendor Items** | 🚧 Coming Soon | Manage vendor catalog |

## Quick Start

### Prerequisites

- PHP 8.2+, Composer
- Node.js 18+, npm
- MySQL 8.0+

### Setup (5 minutes)

```bash
# Clone and install dependencies
git clone <repo>
cd imohon

# Backend setup
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed

# Frontend setup
cd ../ui
npm install
```

### Development

From the **root directory**:

```bash
cd api && composer run dev
```

This starts:
- Laravel dev server (port 8000)
- Queue listener
- Vite frontend dev server (port 5173)

For full setup details, see [CLAUDE.md](./CLAUDE.md).

## Project Structure

```
imohon/
├── api/                          # Laravel 12 backend
│   ├── app/Http/Controllers/    # Domain-based controllers
│   ├── app/Models/              # Eloquent models
│   ├── database/                # Migrations & seeders
│   ├── routes/api.php           # API route definitions
│   └── config/                  # Sanctum, CORS, app config
├── ui/                           # React 18 frontend
│   ├── src/modules/             # Feature modules (admin/users, etc.)
│   ├── src/shared/              # Layouts, components, utils
│   ├── src/routes/              # React Router config
│   └── vite.config.js           # Build config
└── CLAUDE.md                     # Development guide & architecture
```

## Key Concepts

- **Unit-level tracking**: Every request, distribution, and acceptance is tracked at the individual unit level
- **Partial distributions**: If inventory is insufficient, distributions can be partial (but only one attempt per request)
- **Role isolation**: Users are reviewed only by managers from their own department
- **Workflow immutability**: Certain rejections close the workflow permanently

See [CLAUDE.md](./CLAUDE.md) for complete architecture details.
