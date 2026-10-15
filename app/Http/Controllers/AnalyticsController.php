<?php

namespace App\Http\Controllers;

use App\Models\Module;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless(
            in_array($request->user()?->role, ['admin', 'teacher'], true),
            403
        );

        $totalModules = Module::count();
        $totalDownloads = DB::table('downloads')->count();
        $totalLikes = DB::table('module_likes')->count();
        $totalFeedback = DB::table('module_feedback')->count();

        $topModules = Module::query()
            ->withCount(['likes', 'feedback'])
            ->select('modules.id', 'modules.title', 'modules.subject', 'modules.year_level')
            ->selectSub(
                DB::table('downloads')
                    ->selectRaw('COUNT(*)')
                    ->whereColumn('downloads.module_id', 'modules.id'),
                'downloads_count'
            )
            ->orderByDesc('downloads_count')
            ->orderByDesc('likes_count')
            ->limit(10)
            ->get()
            ->map(fn (Module $module) => [
                'id' => $module->id,
                'title' => $module->title,
                'subject' => $module->subject,
                'year_level' => $module->year_level,
                'downloads_count' => (int) $module->downloads_count,
                'likes_count' => (int) $module->likes_count,
                'feedback_count' => (int) $module->feedback_count,
                'engagement_count' => (int) $module->downloads_count
                    + (int) $module->likes_count
                    + (int) $module->feedback_count,
            ])
            ->values();

        $yearBreakdown = DB::table('modules')
            ->leftJoinSub(
                DB::table('downloads')
                    ->select('module_id', DB::raw('COUNT(*) as downloads_count'))
                    ->groupBy('module_id'),
                'download_totals',
                'download_totals.module_id',
                '=',
                'modules.id'
            )
            ->leftJoinSub(
                DB::table('module_likes')
                    ->select('module_id', DB::raw('COUNT(*) as likes_count'))
                    ->groupBy('module_id'),
                'like_totals',
                'like_totals.module_id',
                '=',
                'modules.id'
            )
            ->select(
                'modules.year_level',
                DB::raw('COUNT(modules.id) as modules_count'),
                DB::raw('COALESCE(SUM(download_totals.downloads_count), 0) as downloads_count'),
                DB::raw('COALESCE(SUM(like_totals.likes_count), 0) as likes_count')
            )
            ->groupBy('modules.year_level')
            ->orderBy('modules.year_level')
            ->get()
            ->map(fn ($row) => [
                'year_level' => $row->year_level,
                'modules_count' => (int) $row->modules_count,
                'downloads_count' => (int) $row->downloads_count,
                'likes_count' => (int) $row->likes_count,
            ])
            ->values();

        return Inertia::render('analytics/index', [
            'summary' => [
                'total_modules' => $totalModules,
                'total_downloads' => $totalDownloads,
                'total_likes' => $totalLikes,
                'total_feedback' => $totalFeedback,
                'total_engagement' => $totalDownloads + $totalLikes + $totalFeedback,
            ],
            'topModules' => $topModules,
            'yearBreakdown' => $yearBreakdown,
        ]);
    }
}
