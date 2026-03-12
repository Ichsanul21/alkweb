<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Portfolio extends Model
{
    protected $fillable = [
        'title_en', 'title_id', 'slug', 'description_en', 'description_id',
        'content_en', 'content_id', 'category', 'tags', 'featured_image',
        'gallery', 'is_featured', 'sort_order', 'status',
    ];

    protected $casts = [
        'tags' => 'array',
        'gallery' => 'array',
        'is_featured' => 'boolean',
    ];

    // Auto-generate slug from title
    protected static function booted(): void
    {
        static::creating(function (Portfolio $portfolio) {
            if (empty($portfolio->slug)) {
                $portfolio->slug = Str::slug($portfolio->title_en);
            }
        });
    }

    // Bilingual accessors
    public function getTitleAttribute(): string
    {
        $locale = app()->getLocale();
        return $this->{"title_{$locale}"} ?? $this->title_en;
    }

    public function getDescriptionAttribute(): ?string
    {
        $locale = app()->getLocale();
        return $this->{"description_{$locale}"} ?? $this->description_en;
    }

    public function getContentAttribute(): ?string
    {
        $locale = app()->getLocale();
        return $this->{"content_{$locale}"} ?? $this->content_en;
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderByDesc('created_at');
    }
}
