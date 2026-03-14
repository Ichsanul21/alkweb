<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Portfolio;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Statistic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Home', [
            'statistics' => Statistic::visible()->get(),
            'services' => Service::visible()->get(),
            'portfolios' => Portfolio::published()->featured()->ordered()->get(),
            'articles' => \App\Models\Article::published()
                ->with('author:id,name')
                ->latest('published_at')
                ->limit(3)
                ->get(),
            'settings' => [
                'general' => Setting::getGroup('general'),
                'social' => Setting::getGroup('social'),
                'seo' => Setting::getGroup('seo'),
            ],
        ]);
    }

    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'whatsapp_number' => 'required|string|max:255',
            'company_name' => 'nullable|string|max:255',
            'service_type' => 'required|string|in:Intelligent Software,Smart Infrastructure,Digital Media,Other',
            'message' => 'required|string|max:2000',
        ]);

        Contact::create([
            ...$validated,
            'source' => 'website',
            'status' => 'new',
        ]);

        return redirect()->back()->with('success', 'Thank you! We will get back to you soon.');
    }
}
