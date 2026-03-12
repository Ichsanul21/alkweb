<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class Article extends Model
{
    protected $fillable = [
        'author_id', 'title_en', 'title_id', 'slug', 'excerpt_en', 'excerpt_id',
        'content_en', 'content_id', 'featured_image', 'category', 'tags',
        'meta_title', 'meta_description', 'og_image', 'status', 'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'published_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Article $article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title_en);
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    // Bilingual accessors
    public function getTitleAttribute(): string
    {
        $locale = app()->getLocale();
        return $this->{"title_{$locale}"} ?? $this->title_en;
    }

    public function getExcerptAttribute(): ?string
    {
        $locale = app()->getLocale();
        return $this->{"excerpt_{$locale}"} ?? $this->excerpt_en;
    }

    public function getContentAttribute(): ?string
    {
        $locale = app()->getLocale();
        return $this->{"content_{$locale}"} ?? $this->content_en;
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    public function scopeOrdered($query)
    {
        return $query->orderByDesc('published_at');
    }
}
