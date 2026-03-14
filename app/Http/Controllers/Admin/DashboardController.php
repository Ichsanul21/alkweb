<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Contact;
use App\Models\Portfolio;
use App\Models\Statistic;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_articles' => Article::count(),
            'published_articles' => Article::published()->count(),
            'article_views' => Article::sum('view_count'),
            'total_portfolios' => Portfolio::count(),
            'published_portfolios' => Portfolio::published()->count(),
            'portfolio_views' => Portfolio::sum('view_count'),
            'total_contacts' => Contact::count(),
            'new_contacts' => Contact::new()->count(),
        ];

        // Contacts by month (last 6 months)
        $contactsByMonth = Contact::selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, COUNT(*) as count')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->orderByRaw('YEAR(created_at), MONTH(created_at)')
            ->get();

        // Visitor Stats
        $todayVisitors = \App\Models\Visitor::where('visited_date', now()->format('Y-m-d'))->count();
        $totalVisitors = \App\Models\Visitor::count();
        
        // Visitors by month
        $visitorsByMonth = \App\Models\Visitor::selectRaw('MONTH(visited_date) as month, YEAR(visited_date) as year, COUNT(*) as count')
            ->where('visited_date', '>=', now()->subMonths(6))
            ->groupByRaw('YEAR(visited_date), MONTH(visited_date)')
            ->orderByRaw('YEAR(visited_date), MONTH(visited_date)')
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentContacts' => fn () => Contact::latest()->take(5)->get(['id', 'name', 'email', 'status', 'created_at']),
            'recentArticles' => fn () => Article::with('author:id,name')
                ->latest()->take(5)->get(['id', 'title_en', 'title_id', 'slug', 'status', 'author_id', 'published_at']),
            'contactsByMonth' => Inertia::lazy(fn () => $contactsByMonth),
            'todayVisitors' => $todayVisitors,
            'totalVisitors' => $totalVisitors,
            'visitorsByMonth' => Inertia::lazy(fn () => $visitorsByMonth),
        ]);
    }
}
