# ACC Module Hub — Administrator User Management

This package includes the administrator user-management feature.

## Included behavior

- Administrators can open **Administration → User Management**.
- Administrators can view active and deactivated users.
- Administrators can change roles between Student, Teacher, and Administrator.
- Administrators can deactivate and reactivate accounts without deleting user records or related module activity.
- Deactivated users cannot log in successfully and cannot continue using authenticated pages.
- The current administrator cannot deactivate their own account or change their own administrator role.
- The last active administrator cannot be demoted or deactivated.

## Setup

From the project directory, install dependencies and run the migration:

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
npm run build
```

For development:

```bash
composer run dev
```

The administrator user-management page is available at `/admin/users` after signing in as an administrator.
