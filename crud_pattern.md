### CRUD playbook example

When you add a new resource today, copy the Category/Department pattern:

1. **Backend prep**
   - Install any packages (e.g., `kalnoy/nestedset`), add the migration, and seed some fixtures.
   - Create the model with `$fillable`, casts, and traits (NestedSet if it’s hierarchical) plus any default attribute handling.
   - Write `Store`/`Update` requests that enforce uniqueness, parent relations, enums, etc., and add extra requests such as `OrderCategoryRequest` when you expose a reorder action.
   - Build the controller close to `CategoryController`: paginate with `defaultOrder()` or `latest()`, use a transformer that formats `created_at`/`updated_at`, and guard `destroy` with the same existence checks; add custom actions (ordering, bulk operations) as needed.
   - Register the resource routes (and custom PATCH endpoints) in `routes/api.php` inside `auth:sanctum` + `role:Admin|System`.
   - Seed relevant data and wire the seeder into `DatabaseSeeder`.

2. **Shared API/store**
   - Create `ui/src/modules/<resource>/api/<resource>Api.js` mirroring the HTTP methods your controller exposes (including PATCH for ordering).
   - Add a Zustand store to handle the REST cycle: filters/pagination, loading/saving flags, validationErrors, and CRUD plus order/delete helpers that re-fetch after mutations.
   - Leverage shared UI helpers (Pagination, ConfirmModal, BackLink, StatusPill) so the new module inherits the global behavior.

3. **Pages & components**
   - Duplicate the index/show/create/edit page structure from `admin/categories`: each page uses `PageHeader`, `FeedbackAlert`, and `LoadingBlock`, with the form/table components wired to the store.
   - Provide a table component that renders the columns the backend exposes (statuses, parent info, etc.) and add the rearrange controls (↑/↓ buttons) that call the store’s ordering action.
- Build a form component whose props include the `form` state, `validationErrors`, helper lists (parents/departments), and submit label.
- Handle deletions via `ConfirmModal`, use `BackLink` for navigation, and show status via `StatusPill`.
- If you need to distinguish folders/items, drive the create page with a two-step flow (type choice first, then the form) and hide/require parent selectors accordingly while keeping the form reusable for edits.

4. **Routing updates**
   - Import the new pages into `ui/src/routes/index.jsx` and replace any placeholder `ComingSoon` entries under both `/admin` and `/system`.
   - Keep those routes nested inside the shared `AdminLayout` (or equivalent) so navigation/sidebar remains consistent with the rest of the shell.

5. **Verification**
   - Run `npm run build` to confirm the UI compiles.
   - Run `php artisan migrate`/`db:seed` (with the correct database driver) so the backend schema and seed data exist.
   - Add a bullet or section describing the new resource inside this document so future engineers can reapply the same steps.
