<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SeoController extends Controller
{
    /**
     * Generate sitemap.xml dynamically.
     */
    public function sitemap()
    {
        $sitemap = Sitemap::create();

        // Homepage
        $sitemap->add(
            Url::create('/')
                ->setLastModificationDate(now())
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(1.0)
        );

        // Public portfolio listing
        $sitemap->add(
            Url::create('/portfolio')
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.8)
        );

        // Individual portfolios
        Portfolio::published()->get()->each(function ($portfolio) use ($sitemap) {
            $sitemap->add(
                Url::create("/portfolio/{$portfolio->slug}")
                    ->setLastModificationDate($portfolio->updated_at)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                    ->setPriority(0.7)
            );
        });

        // Public articles listing
        $sitemap->add(
            Url::create('/articles')
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
                ->setPriority(0.8)
        );

        // Individual articles
        Article::published()->get()->each(function ($article) use ($sitemap) {
            $sitemap->add(
                Url::create("/articles/{$article->slug}")
                    ->setLastModificationDate($article->updated_at)
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_MONTHLY)
                    ->setPriority(0.7)
            );
        });

        return $sitemap->toResponse(request());
    }

    /**
     * Generate robots.txt dynamically.
     */
    public function robots()
    {
        $content = implode("\n", [
            'User-agent: *',
            'Allow: /',
            '',
            'Disallow: /admin',
            'Disallow: /login',
            'Disallow: /register',
            'Disallow: /profile',
            '',
            'Sitemap: ' . config('app.url') . '/sitemap.xml',
        ]);

        return response($content, 200)->header('Content-Type', 'text/plain');
    }
}
