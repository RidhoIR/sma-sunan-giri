<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Operator\SiswaController;
use App\Http\Controllers\Operator\UserController;
use App\Http\Controllers\Operator\WaliController;
use App\Http\Controllers\WaliDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'akses:admin'])->name('admin.')->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::prefix('/admin/user')->name('user.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::put('/{id}', [UserController::class, 'update'])->name('update');
        Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('/admin/wali-murid')->name('wali.')->group(function () {
        Route::get('/', [WaliController::class, 'index'])->name('index');
        Route::post('/', [WaliController::class, 'store'])->name('store');
        Route::put('/{id}', [WaliController::class, 'update'])->name('update');
        Route::delete('/{id}', [WaliController::class, 'destroy'])->name('destroy');
        Route::get('/detail/{id}', [WaliController::class, 'show'])->name('show');
        Route::post('/wali/{id}/siswa', [WaliController::class, 'storeWaliSiswa'])->name('storeWaliSiswa');
    });

    Route::prefix('/admin/siswa')->name('siswa.')->group(function () {
        Route::get('/', [SiswaController::class, 'index'])->name('index');
        Route::post('/', [SiswaController::class, 'store'])->name('store');
        Route::put('/{id}', [SiswaController::class, 'update'])->name('update');
        Route::delete('/{id}', [SiswaController::class, 'destroy'])->name('destroy');
    });
    // route lain untuk operator
});

Route::middleware(['auth', 'akses:wali'])->name('wali.')->group(function () {
    Route::get('/wali/dashboard', [WaliDashboardController::class, 'index'])->name('dashboard');
    // route lain untuk wali murid
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
