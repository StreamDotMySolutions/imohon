<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\DepartmentController;
use App\Http\Controllers\Api\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('me', [AuthController::class, 'me'])->name('me');
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
});

Route::middleware(['auth:sanctum', 'role:Admin|System'])
    ->prefix('admin')
    ->group(function (): void {
        Route::apiResource('users', UserController::class);
        Route::apiResource('departments', DepartmentController::class);
        Route::patch('categories/{category}/order', [CategoryController::class, 'order']);
        Route::apiResource('categories', CategoryController::class);
    });
