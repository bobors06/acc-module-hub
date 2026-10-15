# Module Access-Code Feature

## Student flow

1. A student sees module cards but cannot preview or download them immediately.
2. The student clicks **Request access**.
3. The uploader sees the pending request on their own uploaded module card.
4. The uploader clicks **Approve**. The system generates a six-character code.
5. The uploader gives that code to the student outside the system or through the school’s chosen communication channel.
6. The student enters the code in the access dialog.
7. Only after successful verification can the student preview or download the module.

## Files changed

- `database/migrations/2026_10_10_000000_create_module_access_requests_table.php`
- `app/Models/ModuleAccessRequest.php`
- `app/Models/Module.php`
- `app/Models/User.php`
- `app/Http/Controllers/ModuleController.php`
- `routes/web.php`
- `resources/js/pages/dashboard.tsx`

## Local Windows steps

From the Laravel project folder:

```powershell
php artisan migrate
php artisan optimize:clear
npm run build
php artisan serve
```

The access code is encrypted in the database. Students only receive access after the code is approved and verified. Admins can approve requests for any module; teachers can approve requests only for modules they uploaded.
