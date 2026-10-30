# ACC Module Hub Login Fix

This corrective update changes the new account-status checks so legacy or NULL `is_active` values are treated as active. Only an explicit `false` value deactivates an account.

The original regression was caused by the new login callback and session middleware using a loose falsey check. Existing accounts could therefore be rejected when their account-status value was missing or NULL.

After copying the two PHP files into the project, run the account-status migration:

```bash
php artisan migrate
```

The migration is still required for the complete User Management feature because the admin page reads and updates `users.is_active` and `users.deactivated_at`.
