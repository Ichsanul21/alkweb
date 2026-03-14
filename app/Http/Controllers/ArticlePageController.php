<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArticlePageController extends Controller
{
    public function index(Request $request)
    {
        $articles = Article::published()
            ->with('author:id,name')
            ->when($request->category, fn($q, $cat) => $q->where('category', $cat))
            ->when($request->search, fn($q, $s) => $q->where('title_en', 'like', "%{$s}%")->orWhere('title_id', 'like', "%{$s}%"))
            ->select(['id', 'title_en', 'title_id', 'slug', 'excerpt_en', 'excerpt_id', 'featured_image', 'category', 'author_id', 'published_at', 'view_count'])
            ->latest('published_at')
            ->paginate(9);

        $categories = Article::published()
            ->select('category')
            ->distinct()
            ->pluck('category')
            ->filter();

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => $request->only('category', 'search'),
            'settings' => Setting::getGroup('seo'),
        ]);
    }

    public function show(string $slug)
    {
        $article = Article::published()
            ->with('author:id,name')
            ->where('slug', $slug)
            ->firstOrFail();

        $article->increment('view_count');

        $related = Article::published()
            ->where('id', '!=', $article->id)
            ->select(['id', 'title_en', 'title_id', 'slug', 'excerpt_en', 'excerpt_id', 'featured_image', 'category', 'published_at'])
            ->latest('published_at')
            ->limit(3)
            ->get();

        return Inertia::render('Articles/Show', [
            'article' => $article,
            'related' => $related,
        ]);
    }
}
