<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioPageController extends Controller
{
    public function index(Request $request)
    {
        $portfolios = Portfolio::published()
            ->ordered()
            ->when($request->category, fn($q, $cat) => $q->where('category', $cat))
            ->paginate(9);

        $categories = Portfolio::published()
            ->select('category')
            ->distinct()
            ->pluck('category')
            ->filter();

        return Inertia::render('Portfolio/Index', [
            'portfolios' => $portfolios,
            'categories' => $categories,
            'filters' => $request->only('category'),
            'settings' => Setting::getGroup('seo'),
        ]);
    }

    public function show(string $slug)
    {
        $portfolio = Portfolio::published()->where('slug', $slug)->firstOrFail();

        $portfolio->increment('view_count');

        $related = Portfolio::published()
            ->where('id', '!=', $portfolio->id)
            ->where('category', $portfolio->category)
            ->limit(3)
            ->get();

        return Inertia::render('Portfolio/Show', [
            'portfolio' => $portfolio,
            'related' => $related,
        ]);
    }
}
