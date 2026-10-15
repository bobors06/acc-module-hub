# ACC Module Hub — Conversation State Restored

This package reflects the latest cumulative implementation from the Manus conversation rather than the older GitHub snapshot.

Included work:

- ACC Module Hub branding and transparent enlarged logo
- Role-based module management
- Year-level filtering and upload targeting
- Protected module access requests and uploader-issued codes
- In-app notifications with delete controls
- Request approval, denial, and student cancellation
- Safe preview behavior that does not auto-download unsupported files
- Module hearts/likes
- Student feedback and uploader/admin replies
- Profile picture upload, preview, student ID, and year-level editing
- Header avatar synchronization
- Compact uploader request dialog
- Header notification bell replacing starter-kit links

Run locally after extracting:

```powershell
php artisan migrate
php artisan storage:link
php artisan optimize:clear
npm run dev
```
