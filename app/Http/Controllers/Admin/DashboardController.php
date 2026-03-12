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

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentContacts' => $recentContacts,
            'recentArticles' => $recentArticles,
            'contactsByMonth' => $contactsByMonth,
        ]);
    }
}
