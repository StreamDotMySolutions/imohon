<?php

use App\Http\Controllers\Api\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:Admin'])
    ->prefix('admin')
    ->group(function (): void {
        Route::apiResource('users', UserController::class);
    });
