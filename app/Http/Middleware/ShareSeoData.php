<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShareSeoData
{
    public function handle(Request $request, Closure $next)
    {
        $seo = Setting::getGroup('seo');
        $general = Setting::getGroup('general');

        Inertia::share('seoDefaults', [
            'title' => $seo['seo_title'] ?? 'Alenkosa - Tech & Intelligence',
            'description' => $seo['seo_description'] ?? '',
            'keywords' => $seo['seo_keywords'] ?? '',
            'siteName' => $general['company_name'] ?? 'Alenkosa',
            'siteUrl' => config('app.url'),
        ]);

        return $next($request);
    }
}
