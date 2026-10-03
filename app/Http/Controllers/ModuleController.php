<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ModuleController extends Controller
{
    public function index(Request $request): Response
{
    $user = $request->user();

    $modules = Module::with('uploader')
        ->when(
            $user?->role === 'student',
            fn ($query) => $query->where('is_active', true)
        )
        ->when(
            $request->year_level && $request->year_level !== 'All',
            fn ($query, $yearLevel) => $query->where('year_level', $yearLevel)
        )
        ->latest()
        ->get();

    return Inertia::render('dashboard', [
        'modules' => $modules,
        'filters' => $request->only('year_level'),
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
        return back()->withErrors(['file' => 'The file failed to upload — it may be too large or the connection was interrupted.']);
    }

    $path = $request->file('file')->store('modules', 'public');


    Module::create([
        'title' => $validated['title'],
        'subject' => $validated['subject'],
        'year_level' => $validated['year_level'],
        'file_path' => $path,
        'file_type' => $request->file('file')->extension(),
        'file_size' => $request->file('file')->getSize(),
        'uploaded_by' => $request->user()->id,
    ]);

    return to_route('dashboard')->with('success', 'Module uploaded.');
}
   public function download(Module $module, Request $request)
{
    $request->user()->downloadedModules()->syncWithoutDetaching([
        $module->id => ['updated_at' => now()],
    ]);

    return Storage::disk('public')->download($module->file_path, $module->title);
}

public function disable(Module $module, Request $request)
{
    abort_unless(
        in_array($request->user()?->role, ['admin', 'teacher']),
        403
    );

    $module->update([
        'is_active' => false,
        'disabled_at' => now(),
        'disabled_by' => $request->user()->id,
    ]);

    return back()->with('success', 'Module disabled successfully.');
}

public function enable(Module $module, Request $request)
{
    abort_unless(
        in_array($request->user()?->role, ['admin', 'teacher']),
        403
    );

    $module->update([
        'is_active' => true,
        'disabled_at' => null,
        'disabled_by' => null,
    ]);

    return back()->with('success', 'Module enabled successfully.');
}


public function preview(Module $module)
{
    $disk = Storage::disk('public');

    abort_unless($disk->exists($module->file_path), 404);

    $path = $disk->path($module->file_path);
    $mimeType = $disk->mimeType($module->file_path);

    return response()->file($path, [
        'Content-Type' => $mimeType,
        'Content-Disposition' => 'inline; filename="' . basename($module->file_path) . '"',
        'X-Content-Type-Options' => 'nosniff',
    ]);
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
}