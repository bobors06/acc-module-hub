# ACC Module Hub — User Management UI and Database Fix

This update fixes three issues:

1. The User Management page was wrapping itself in `AppLayout` even though `resources/js/app.tsx` already applies `AppLayout` automatically. This caused the header and footer to appear twice.
2. Missing or NULL account-status values were being displayed as Deactivated. The UI now treats only explicit `is_active = false` as deactivated.
3. The SQLite database must contain the account-status columns before Reactivate/Deactivate can work.

After copying the update files into the existing project, run this from the project directory:

```bash
php artisan migrate
```

If Laravel reports that the migration has already run but SQLite still reports `no such column: is_active`, inspect the migration table and database path. Make sure the command is using the same `.env` and `database/database.sqlite` file used by `php artisan serve`.

After migration, rebuild the frontend:

```bash
npm run build
```

Existing users should display as Active after the migration because the new column defaults to true. Only accounts intentionally deactivated through User Management should display Deactivated and show Reactivate.
