<?php

use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PortfolioController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PortfolioPageController;
use App\Http\Controllers\ArticlePageController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

// ── Public Routes ───────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::post('/contact', [HomeController::class, 'submitContact'])->name('contact.submit');

// SEO
Route::get('/sitemap.xml', [SeoController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [SeoController::class, 'robots'])->name('robots');

Route::get('/portfolio', [PortfolioPageController::class, 'index'])->name('portfolio.index');
Route::get('/portfolio/{slug}', [PortfolioPageController::class, 'show'])->name('portfolio.show');

Route::get('/articles', [ArticlePageController::class, 'index'])->name('articles.index');
Route::get('/articles/{slug}', [ArticlePageController::class, 'show'])->name('articles.show');

// ── Admin Routes ────────────────────────────────────────────────
Route::middleware(['auth', 'verified', \App\Http\Middleware\EnsureUserHasAdminAccess::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        // Dashboard - All Roles
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Articles - Admin, Editor, Author
        Route::middleware(['role:Admin|Editor|Author'])->group(function () {
            Route::resource('articles', ArticleController::class)->except(['show']);
        });

        // Content Management - Admin & Editor
        Route::middleware(['role:Admin|Editor'])->group(function () {
            Route::resource('portfolios', PortfolioController::class)->except(['show']);
            Route::get('contacts/export', [ContactController::class, 'export'])->name('contacts.export');
            Route::resource('contacts', ContactController::class)->only(['index', 'show', 'update', 'destroy']);
            
            // File Upload
            Route::post('upload', [UploadController::class, 'store'])->name('upload.store');
            Route::delete('upload', [UploadController::class, 'destroy'])->name('upload.destroy');
        });

        // System Settings - Admin Only
        Route::middleware(['role:Admin'])->group(function () {
            Route::resource('users', UserController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::get('visitors', \App\Http\Controllers\Admin\VisitorController::class . '@index')->name('visitors.index');
            Route::post('translate', [\App\Http\Controllers\Admin\AutoTranslateController::class, 'translate'])->name('translate');
            Route::post('generate-tags', [\App\Http\Controllers\Admin\AutoTranslateController::class, 'generateTags'])->name('generate-tags');
            Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
            Route::put('settings', [SettingController::class, 'update'])->name('settings.update');
            Route::put('settings/statistics/{statistic}', [SettingController::class, 'updateStatistic'])->name('settings.statistic.update');
            Route::put('settings/services/{service}', [SettingController::class, 'updateService'])->name('settings.service.update');
        });
    });

// ── Profile Routes ──────────────────────────────────────────────
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
