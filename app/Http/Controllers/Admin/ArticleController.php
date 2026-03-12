<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $articles = Article::query()
            ->with('author:id,name')
            ->when($request->search, fn($q, $s) => $q->where('title_en', 'like', "%{$s}%")->orWhere('title_id', 'like', "%{$s}%"))
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->category, fn($q, $c) => $q->where('category', $c))
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        $categories = Article::whereNotNull('category')->distinct()->pluck('category');

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => $request->only(['search', 'status', 'category']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Articles/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_id' => 'required|string|max:255',
            'excerpt_en' => 'nullable|string',
            'excerpt_id' => 'nullable|string',
            'content_en' => 'nullable|string',
            'content_id' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'og_image' => 'nullable|string',
            'status' => 'in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        $validated['author_id'] = $request->user()->id;
        $validated['slug'] = Str::slug($validated['title_en']);

        // Ensure unique slug
        $slug = $validated['slug'];
        $count = 1;
        while (Article::where('slug', $slug)->exists()) {
            $slug = $validated['slug'] . '-' . $count++;
        }
        $validated['slug'] = $slug;

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        Article::create($validated);

        return redirect()->route('admin.articles.index')
            ->with('success', 'Article created successfully.');
    }

    public function edit(Article $article): Response
    {
        return Inertia::render('Admin/Articles/Form', [
            'article' => $article,
        ]);
    }

    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_id' => 'required|string|max:255',
            'excerpt_en' => 'nullable|string',
            'excerpt_id' => 'nullable|string',
            'content_en' => 'nullable|string',
            'content_id' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'og_image' => 'nullable|string',
            'status' => 'in:draft,published',
            'published_at' => 'nullable|date',
        ]);

        if ($validated['status'] === 'published' && empty($validated['published_at'])) {
            $validated['published_at'] = now();
        }

        $article->update($validated);

        return redirect()->route('admin.articles.index')
            ->with('success', 'Article updated successfully.');
    }

    public function destroy(Article $article)
    {
        $article->delete();

        return redirect()->route('admin.articles.index')
            ->with('success', 'Article deleted successfully.');
    }
}
