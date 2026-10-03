<?php

use App\Http\Controllers\ModuleController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [ModuleController::class, 'index'])->name('dashboard');
    Route::get('modules/{module}/preview',[ModuleController::class, 'preview'])->name('modules.preview');
    Route::get('modules/{module}/download', [ModuleController::class, 'download'])->name('modules.download');
    Route::get('downloads', [ModuleController::class, 'myDownloads'])->name('downloads.index');
    Route::delete('downloads/{module}', [ModuleController::class, 'removeDownload'])->name('downloads.destroy');
    Route::patch(
    'modules/{module}/disable',
    [ModuleController::class, 'disable']
)->name('modules.disable');

Route::patch(
    'modules/{module}/enable',
    [ModuleController::class, 'enable']
)->name('modules.enable');


    Route::middleware('can-manage-modules')->group(function () {
    Route::get('modules/create', [ModuleController::class, 'create'])->name('modules.create');
    Route::post('modules', [ModuleController::class, 'store'])->name('modules.store');
});
});     



require __DIR__.'/settings.php';