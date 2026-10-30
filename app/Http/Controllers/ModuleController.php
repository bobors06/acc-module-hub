<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\ModuleAccessRequest;
use App\Models\ModuleFeedback;
use App\Models\ModuleLike;
use App\Notifications\ModuleAccessApprovedNotification;
use App\Notifications\ModuleAccessRequestedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ModuleController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $selectedYear = trim((string) $request->query('year_level', ''));
        $search = trim((string) $request->query('search', ''));
        $myUploads = $request->boolean('my_uploads');
        $with = ['uploader', 'likes', 'feedback.user', 'feedback.replyBy'];

        if ($user?->role === 'student') {
            $with['accessRequests'] = fn ($query) => $query->where('student_id', $user->id);
        } elseif (in_array($user?->role, ['admin', 'teacher'], true)) {
            $with['accessRequests.student'] = fn ($query) => $query->latest();
        }

        $modules = Module::with($with)
            ->when(
                $user?->role === 'student',
                function ($query) use ($user) {
                    $studentYear = Str::lower(trim((string) $user->year_level));

                    return $query
                        ->where('is_active', true)
                        ->where(function ($audienceQuery) use ($studentYear) {
                            $audienceQuery
                                ->whereRaw("LOWER(TRIM(year_level)) IN ('all', 'all students')")
                                ->when(
                                    $studentYear !== '',
                                    fn ($query) => $query->orWhereRaw(
                                        'LOWER(TRIM(year_level)) = ?',
                                        [$studentYear]
                                    )
                                );
                        });
                }
            )
            ->when(
                $selectedYear !== '' && Str::lower($selectedYear) !== 'all',
                fn ($query) => $query->whereRaw(
                    'LOWER(TRIM(year_level)) = ?',
                    [Str::lower($selectedYear)]
                )
            )
            ->when(
                $search !== '',
                function ($query) use ($search) {
                    $term = '%' . Str::lower($search) . '%';

                    return $query->where(function ($searchQuery) use ($term) {
                        $searchQuery
                            ->whereRaw('LOWER(title) LIKE ?', [$term])
                            ->orWhereRaw('LOWER(subject) LIKE ?', [$term])
                            ->orWhereRaw('LOWER(year_level) LIKE ?', [$term])
                            ->orWhereHas('uploader', fn ($uploaderQuery) => $uploaderQuery->whereRaw('LOWER(name) LIKE ?', [$term]));
                    });
                }
            )
            ->when(
                $myUploads && in_array($user?->role, ['admin', 'teacher'], true),
                fn ($query) => $query->where('uploaded_by', $user->id)
            )
            ->latest()
            ->get();

        $modules->each(function (Module $module) use ($user): void {
            $accessRequest = $module->accessRequests->first();
            $module->setAttribute('likes_count', $module->likes->count());
            $module->setAttribute('user_has_liked', $user
                ? $module->likes->contains('user_id', $user->id)
                : false);
            $module->setAttribute('feedbacks', $module->feedback->map(fn (ModuleFeedback $feedback) => [
                'id' => $feedback->id,
                'comment' => $feedback->comment,
                'user_name' => $feedback->user?->name,
                'reply' => $feedback->reply,
                'reply_by_name' => $feedback->replyBy?->name,
                'created_at' => $feedback->created_at,
            ])->values());
            $module->unsetRelation('likes');
            $module->unsetRelation('feedback');

            if ($user?->role === 'student') {
                $module->setAttribute(
                    'access_status',
                    $accessRequest?->verified_at ? 'verified' : ($accessRequest?->status ?? 'not_requested')
                );
                $module->setAttribute('access_request_id', $accessRequest?->id);
                $module->unsetRelation('accessRequests');
            } elseif (in_array($user?->role, ['admin', 'teacher'], true)) {
                $requests = $user->role === 'admin' || $module->uploaded_by === $user->id
                    ? $module->accessRequests
                    : collect();

                $module->setAttribute(
                    'access_requests',
                    $requests->map(fn (ModuleAccessRequest $request) => [
                        'id' => $request->id,
                        'student_id' => $request->student_id,
                        'student_name' => $request->student?->name,
                        'status' => $request->status,
                        'access_code' => $request->access_code,
                        'approved_at' => $request->approved_at,
                    ])->values()
                );
                $module->unsetRelation('accessRequests');
            }
        });

        return Inertia::render('dashboard', [
            'modules' => $modules,
            'filters' => [
                ...$request->only(['year_level', 'search']),
                'my_uploads' => $myUploads && in_array($user?->role, ['admin', 'teacher'], true),
            ],
            'notifications' => $user->notifications()->latest()->limit(20)->get(),
            'unreadNotificationsCount' => $user->unreadNotifications()->count(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('modules/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject' => 'required|string|max:255',
            'year_level' => 'required|string',
            'file' => 'required|file|max:20480',
        ]);

        if (! $request->hasFile('file') || ! $request->file('file')->isValid()) {
            return back()->withErrors([
                'file' => 'The file failed to upload — it may be too large or the connection was interrupted.',
            ]);
        }

        $file = $request->file('file');
        $path = $file->store('modules', 'public');
        $yearLevel = $validated['year_level'] === 'All Students'
            ? 'All'
            : $validated['year_level'];

        Module::create([
            'title' => $validated['title'],
            'subject' => $validated['subject'],
            'year_level' => $yearLevel,
            'file_path' => $path,
            'file_type' => $file->extension(),
            'file_size' => $file->getSize(),
            'uploaded_by' => $request->user()->id,
        ]);

        return to_route('dashboard')->with('success', 'Module uploaded.');
    }

    public function requestAccess(Module $module, Request $request)
    {
        abort_unless($request->user()?->role === 'student', 403);
        abort_unless($module->is_active, 403, 'This module is currently disabled.');
        $this->ensureStudentAudience($module, $request);

        $accessRequest = ModuleAccessRequest::updateOrCreate(
            [
                'module_id' => $module->id,
                'student_id' => $request->user()->id,
            ],
            [
                'status' => 'pending',
                'access_code' => null,
                'approved_at' => null,
                'verified_at' => null,
            ],
        );

        $module->loadMissing('uploader');
        $module->uploader?->notify(new ModuleAccessRequestedNotification($module, $accessRequest->load('student')));

        return back()->with('success', 'Access request sent. Please wait for the uploader to provide your code.');
    }

    public function approveAccessRequest(Module $module, ModuleAccessRequest $accessRequest, Request $request)
    {
        $user = $request->user();
        abort_unless(in_array($user?->role, ['admin', 'teacher'], true), 403);
        abort_unless($accessRequest->module_id === $module->id, 404);
        abort_unless($user->role === 'admin' || $module->uploaded_by === $user->id, 403);

        $accessRequest->update([
            'status' => 'approved',
            'access_code' => Str::upper(Str::random(6)),
            'approved_at' => now(),
            'verified_at' => null,
        ]);

        $accessRequest->load('student');
        $accessRequest->student?->notify(new ModuleAccessApprovedNotification($module, $accessRequest));

        return back()->with('success', 'Request approved. Give the displayed access code to the student.');
    }

    public function denyAccessRequest(Module $module, ModuleAccessRequest $accessRequest, Request $request)
    {
        $user = $request->user();
        abort_unless(in_array($user?->role, ['admin', 'teacher'], true), 403);
        abort_unless($accessRequest->module_id === $module->id, 404);
        abort_unless($user->role === 'admin' || $module->uploaded_by === $user->id, 403);

        $accessRequest->delete();

        return back()->with('success', 'Access request denied.');
    }

    public function cancelAccessRequest(Module $module, Request $request)
    {
        abort_unless($request->user()?->role === 'student', 403);

        ModuleAccessRequest::where('module_id', $module->id)
            ->where('student_id', $request->user()->id)
            ->where('status', 'pending')
            ->delete();

        return back()->with('success', 'Access request cancelled.');
    }

    public function verifyAccess(Module $module, Request $request)
    {
        abort_unless($request->user()?->role === 'student', 403);
        abort_unless($module->is_active, 403, 'This module is currently disabled.');
        $this->ensureStudentAudience($module, $request);

        $validated = $request->validate([
            'access_code' => ['required', 'string', 'size:6'],
        ]);

        $accessRequest = ModuleAccessRequest::where('module_id', $module->id)
            ->where('student_id', $request->user()->id)
            ->where('status', 'approved')
            ->first();

        if (! $accessRequest || ! hash_equals(
            Str::upper((string) $accessRequest->access_code),
            Str::upper(trim($validated['access_code']))
        )) {
            return back()->withErrors(['access_code' => 'That access code is invalid. Please ask the uploader to confirm it.']);
        }

        $accessRequest->update(['verified_at' => now()]);

        return back()->with('success', 'Access granted. You can now preview and download this module.');
    }

    public function toggleLike(Module $module, Request $request)
    {
        $like = ModuleLike::where('module_id', $module->id)
            ->where('user_id', $request->user()->id)
            ->first();

        $like ? $like->delete() : ModuleLike::create([
            'module_id' => $module->id,
            'user_id' => $request->user()->id,
        ]);

        return back();
    }

    public function storeFeedback(Module $module, Request $request)
    {
        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:2000'],
        ]);

        ModuleFeedback::create([
            'module_id' => $module->id,
            'user_id' => $request->user()->id,
            'comment' => $validated['comment'],
        ]);

        return back()->with('success', 'Feedback submitted.');
    }

    public function replyToFeedback(Module $module, ModuleFeedback $feedback, Request $request)
    {
        $user = $request->user();
        abort_unless(in_array($user?->role, ['admin', 'teacher'], true), 403);
        abort_unless($feedback->module_id === $module->id, 404);
        abort_unless($user->role === 'admin' || $module->uploaded_by === $user->id, 403);

        $validated = $request->validate([
            'reply' => ['required', 'string', 'max:2000'],
        ]);

        $feedback->update([
            'reply' => $validated['reply'],
            'reply_by' => $user->id,
            'replied_at' => now(),
        ]);

        return back()->with('success', 'Reply submitted.');
    }

    public function download(Module $module, Request $request)
    {
        $this->ensureModuleAccess($module, $request);

        $request->user()->downloadedModules()->syncWithoutDetaching([
            $module->id => ['updated_at' => now()],
        ]);

        return Storage::disk('public')->download($module->file_path, $module->title);
    }

    public function preview(Module $module, Request $request)
    {
        $this->ensureModuleAccess($module, $request);

        $disk = Storage::disk('public');
        abort_unless($disk->exists($module->file_path), 404);

        $extension = strtolower(pathinfo($module->file_path, PATHINFO_EXTENSION));
        $mimeType = $disk->mimeType($module->file_path) ?: 'application/octet-stream';

        if ($mimeType === 'application/octet-stream') {
            $mimeType = match ($extension) {
                'pdf' => 'application/pdf',
                'txt', 'text' => 'text/plain; charset=utf-8',
                'png' => 'image/png',
                'jpg', 'jpeg' => 'image/jpeg',
                'gif' => 'image/gif',
                'webp' => 'image/webp',
                'svg' => 'image/svg+xml',
                'bmp' => 'image/bmp',
                default => $mimeType,
            };
        }

        return response()->file($disk->path($module->file_path), [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="' . basename($module->file_path) . '"',
            'Cache-Control' => 'private, max-age=0, must-revalidate',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function ensureModuleAccess(Module $module, Request $request): void
    {
        abort_unless($module->is_active || in_array($request->user()?->role, ['admin', 'teacher'], true), 403);

        if ($request->user()?->role !== 'student') {
            return;
        }

        $this->ensureStudentAudience($module, $request);

        $hasAccess = ModuleAccessRequest::where('module_id', $module->id)
            ->where('student_id', $request->user()->id)
            ->where('status', 'approved')
            ->whereNotNull('verified_at')
            ->exists();

        abort_unless($hasAccess, 403, 'Enter the access code provided by the uploader first.');
    }

    private function ensureStudentAudience(Module $module, Request $request): void
    {
        $studentYear = Str::lower(trim((string) $request->user()?->year_level));
        $moduleAudience = Str::lower(trim((string) $module->year_level));

        abort_unless(
            in_array($moduleAudience, ['all', 'all students'], true)
                || ($studentYear !== '' && $moduleAudience === $studentYear),
            403,
            'This module is not assigned to your year level.'
        );
    }

    public function disable(Module $module, Request $request)
    {
        abort_unless(in_array($request->user()?->role, ['admin', 'teacher'], true), 403);

        $module->update([
            'is_active' => false,
            'disabled_at' => now(),
            'disabled_by' => $request->user()->id,
        ]);

        return back()->with('success', 'Module disabled successfully.');
    }

    public function enable(Module $module, Request $request)
    {
        abort_unless(in_array($request->user()?->role, ['admin', 'teacher'], true), 403);

        $module->update([
            'is_active' => true,
            'disabled_at' => null,
            'disabled_by' => null,
        ]);

        return back()->with('success', 'Module enabled successfully.');
    }

    public function myDownloads(Request $request): Response
    {
        $modules = $request->user()
            ->downloadedModules()
            ->with('uploader')
            ->orderByPivot('updated_at', 'desc')
            ->get();

        return Inertia::render('downloads/index', ['modules' => $modules]);
    }

    public function removeDownload(Module $module, Request $request)
    {
        $request->user()->downloadedModules()->detach($module->id);

        return back();
    }

    public function markNotificationRead(string $notification, Request $request)
    {
        $request->user()->notifications()->whereKey($notification)->firstOrFail()->markAsRead();

        return back();
    }

    public function deleteNotification(string $notification, Request $request)
    {
        $request->user()->notifications()->whereKey($notification)->firstOrFail()->delete();

        return back();
    }
}
