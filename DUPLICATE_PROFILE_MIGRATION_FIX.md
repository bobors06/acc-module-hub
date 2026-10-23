# Duplicate Profile Picture Migration Fix

The migration `2026_10_10_000003_add_profile_picture_to_users_table` is pending, but the `profile_picture` column already exists because an earlier migration added it. The corrected migration now checks whether the column exists before adding or removing it.

Copy the corrected migration into the matching project path, then run:

```powershell
cd C:\Users\ASUS\Desktop\ACCModuleHub
php artisan optimize:clear
php artisan migrate
php artisan migrate:status
```

Do not run `migrate:fresh`, `migrate:refresh`, or delete `database/database.sqlite`; those commands can remove existing project data.

After the migration completes, the account-status migration should run and create `is_active` and `deactivated_at` on `users`.
