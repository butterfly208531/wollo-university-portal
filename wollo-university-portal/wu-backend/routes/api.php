<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\PolicyController;
use App\Http\Controllers\SystemSettingController;
use Illuminate\Support\Facades\Route;

// ── Health check ─────────────────────────────────────────────────────────────
Route::get('/health', fn() => response()->json(['status' => 'ok']));

// ── Public endpoints ─────────────────────────────────────────────────────────
Route::get('/policies',          [PolicyController::class, 'index']);
Route::get('/policies/{id}',     [PolicyController::class, 'show']);
Route::get('/categories',        [CategoryController::class, 'index']);
Route::get('/search',            [PolicyController::class, 'search']);
Route::get('/search/suggest',    [PolicyController::class, 'suggest']);

// ── Auth ─────────────────────────────────────────────────────────────────────
Route::post('/admin/login',      [AuthController::class, 'login']);

// ── Admin (all authenticated admins) ─────────────────────────────────────────
Route::middleware('jwt.admin')->prefix('admin')->group(function () {
    Route::post('/logout',                              [AuthController::class, 'logout']);
    Route::post('/refresh',                             [AuthController::class, 'refresh']);
    Route::get('/profile',                              [AuthController::class, 'me']);
    Route::get('/analytics',                            [AnalyticsController::class, 'index']);

    Route::get('/policies',                             [PolicyController::class, 'adminIndex']);
    Route::post('/policies',                            [PolicyController::class, 'store']);
    Route::put('/policies/{id}',                        [PolicyController::class, 'update']);
    Route::delete('/policies/{id}',                     [PolicyController::class, 'destroy']);
    Route::get('/policies/{id}/versions',               [PolicyController::class, 'versions']);
    Route::post('/policies/{id}/restore/{versionId}',   [PolicyController::class, 'restore']);

    Route::post('/import',                              [ImportController::class, 'import']);
    Route::get('/audit-logs',                           [AuditLogController::class, 'index']);
});

// ── Admin — user & settings management ───────────────────────────────────────
Route::middleware('jwt.admin')->prefix('super-admin')->group(function () {
    Route::get('/admins',          [AdminUserController::class, 'index']);
    Route::post('/admins',         [AdminUserController::class, 'store']);
    Route::put('/admins/{id}',     [AdminUserController::class, 'update']);
    Route::delete('/admins/{id}',  [AdminUserController::class, 'destroy']);

    Route::get('/settings',        [SystemSettingController::class, 'index']);
    Route::put('/settings',        [SystemSettingController::class, 'update']);
});
