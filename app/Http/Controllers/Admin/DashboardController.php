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
            'total_portfolios' => Portfolio::count(),
            'published_portfolios' => Portfolio::published()->count(),
            'total_articles' => Article::count(),
            'published_articles' => Article::published()->count(),
            'total_contacts' => Contact::count(),
            'new_contacts' => Contact::new()->count(),
        ];

        $recentContacts = Contact::latest()->take(5)->get();
        $recentArticles = Article::with('author')->latest()->take(5)->get();

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
            'recentContacts' => $recentContacts,
            'recentArticles' => $recentArticles,
            'contactsByMonth' => $contactsByMonth,
            'todayVisitors' => $todayVisitors,
            'totalVisitors' => $totalVisitors,
            'visitorsByMonth' => $visitorsByMonth,
        ]);
    }
}
