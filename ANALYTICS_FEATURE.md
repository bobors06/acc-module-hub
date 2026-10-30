# Module Analytics

The implementation provides a read-only platform analytics page for administrators and teachers.

Administrators and teachers can see aggregate usage data across the ACC Module Hub so they can identify high-demand learning materials and plan related uploads. Students do not see analytics.

The page shows total modules, downloads, hearts/likes, feedback comments, combined engagement, activity grouped by year level, and the ten most-engaged modules ranked by downloads and likes.

The results intentionally do not expose student names, student IDs, access-request lists, access codes, or private notification data. The page shows module titles, subjects, year levels, and aggregate counts only.

The route is protected by `can-manage-modules`, and the controller additionally permits only `admin` and `teacher` roles.

## Files changed

- `app/Http/Controllers/AnalyticsController.php`
- `resources/js/pages/analytics/index.tsx`
- `resources/js/components/app-header.tsx`
- `routes/web.php`
