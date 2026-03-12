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

        $related = Article::published()
            ->where('id', '!=', $article->id)
            ->latest('published_at')
            ->limit(3)
            ->get();

        return Inertia::render('Articles/Show', [
            'article' => $article,
            'related' => $related,
        ]);
    }
}
