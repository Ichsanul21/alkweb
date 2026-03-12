<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function index(Request $request): Response
    {
        $portfolios = Portfolio::query()
            ->when($request->search, fn($q, $s) => $q->where('title_en', 'like', "%{$s}%")->orWhere('title_id', 'like', "%{$s}%"))
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->category, fn($q, $c) => $q->where('category', $c))
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        $categories = Portfolio::whereNotNull('category')->distinct()->pluck('category');

        return Inertia::render('Admin/Portfolios/Index', [
            'portfolios' => $portfolios,
            'categories' => $categories,
            'filters' => $request->only(['search', 'status', 'category']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Portfolios/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_id' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_id' => 'nullable|string',
            'content_en' => 'nullable|string',
            'content_id' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'featured_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'status' => 'in:draft,published',
        ]);

        $validated['slug'] = Str::slug($validated['title_en']);

        // Ensure unique slug
        $slug = $validated['slug'];
        $count = 1;
        while (Portfolio::where('slug', $slug)->exists()) {
            $slug = $validated['slug'] . '-' . $count++;
        }
        $validated['slug'] = $slug;

        Portfolio::create($validated);

        return redirect()->route('admin.portfolios.index')
            ->with('success', 'Portfolio created successfully.');
    }

    public function edit(Portfolio $portfolio): Response
    {
        return Inertia::render('Admin/Portfolios/Form', [
            'portfolio' => $portfolio,
        ]);
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_id' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_id' => 'nullable|string',
            'content_en' => 'nullable|string',
            'content_id' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'featured_image' => 'nullable|string',
            'gallery' => 'nullable|array',
            'is_featured' => 'boolean',
            'sort_order' => 'integer',
            'status' => 'in:draft,published',
        ]);

        $portfolio->update($validated);

        return redirect()->route('admin.portfolios.index')
            ->with('success', 'Portfolio updated successfully.');
    }

    public function destroy(Portfolio $portfolio)
    {
        $portfolio->delete();

        return redirect()->route('admin.portfolios.index')
            ->with('success', 'Portfolio deleted successfully.');
    }
}
