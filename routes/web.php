<?php

use App\Http\Controllers\ModuleController;
use App\Http\Controllers\AnalyticsController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [ModuleController::class, 'index'])->name('dashboard');
    Route::get('analytics', [AnalyticsController::class, 'index'])
        ->middleware('can-manage-modules')
        ->name('analytics.index');
    Route::get('modules/{module}/preview', [ModuleController::class, 'preview'])->name('modules.preview');
    Route::get('modules/{module}/download', [ModuleController::class, 'download'])->name('modules.download');
    Route::post('modules/{module}/access-request', [ModuleController::class, 'requestAccess'])->name('modules.access.request');
    Route::delete('modules/{module}/access-request', [ModuleController::class, 'cancelAccessRequest'])->name('modules.access.cancel');
    Route::post('modules/{module}/access/verify', [ModuleController::class, 'verifyAccess'])->name('modules.access.verify');
    Route::post('modules/{module}/like', [ModuleController::class, 'toggleLike'])->name('modules.like.toggle');
    Route::post('modules/{module}/feedback', [ModuleController::class, 'storeFeedback'])->name('modules.feedback.store');
    Route::post('modules/{module}/feedback/{feedback}/reply', [ModuleController::class, 'replyToFeedback'])->name('modules.feedback.reply');
    Route::patch('notifications/{notification}/read', [ModuleController::class, 'markNotificationRead'])->name('notifications.read');
    Route::delete('notifications/{notification}', [ModuleController::class, 'deleteNotification'])->name('notifications.destroy');
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
    Route::patch(
        'modules/{module}/access-requests/{accessRequest}/approve',
        [ModuleController::class, 'approveAccessRequest']
    )->name('modules.access.approve');
    Route::delete(
        'modules/{module}/access-requests/{accessRequest}',
        [ModuleController::class, 'denyAccessRequest']
    )->name('modules.access.deny');
});
});     



require __DIR__.'/settings.php';
