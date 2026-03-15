### How to add a new CRUD module

1. **Backend preparation**
   - Require any packages needed (e.g., `kalnoy/nestedset`) and run migrations for the new model.
   - Create the migration with all required columns plus indexes/traits (`NestedSet::columns` if hierarchical).
   - Add the Eloquent model under `App\Models` with `$fillable`, casts (Malaysia `d/m/Y H:i` format when needed), and trait usage.
   - Implement `Store`, `Update`, and any auxiliary `Order` requests validating uniqueness, relationships, and enum constraints.
   - Build the controller mirroring `DepartmentController`: paginate in `index`, use transformer helpers, handle parent assignment/deletion constraints, and add special endpoints (`order`, etc.).
   - Register the resource route (and any custom actions) under `routes/api.php` inside the `auth:sanctum` + `role:Admin|System` group.
   - Seed sample data via new seeder and register it in `DatabaseSeeder`.

2. **Shared APIs/Stores**
   - Add an API helper under `ui/src/modules/{area}/api` pointing to `/admin/<resource>` REST endpoints plus any custom patch actions.
   - Create a Zustand store under `ui/src/modules/{area}/store` that mirrors existing stores: manage data/pagination/filters, track loading/saving, handle validation errors, and expose CRUD/ordering helpers.
   - Use shared components (`Pagination`, `ConfirmModal`, `BackLink`, etc.) so the module keeps the same feel.

3. **Pages & Components**
   - Build `index`, `show`, `create`, and `edit` pages under `ui/src/modules/{area}/pages`, each reusing `PageHeader`, `FeedbackAlert`, `LoadingBlock`, and form/table components.
   - Implement the table component to show necessary columns plus actions and reorder controls (up/down arrows hitting the store’s `order` method).
   - Build a reusable form component for create/edit that accepts `form`, `validationErrors`, and helper props like parent options and status toggles.
   - Use `ConfirmModal` for delete actions and `BackLink` for navigation.

4. **Routing**
   - Update `ui/src/routes/index.jsx` to import the new pages and replace any placeholder `ComingSoonPage` entries with the real routes for both `/admin` and `/system` sections.
   - Ensure the layout stays within the shared `AdminLayout` (or other role-based layout) so nav/sidebar remains consistent.

5. **Documentation/Test**
   - Run `npm run build` (front-end) and `php artisan migrate`/`db:seed` (backend) to ensure everything compiles and the data exists.
   - Document the new module in this file so future CRUD work can follow the same sequence.
