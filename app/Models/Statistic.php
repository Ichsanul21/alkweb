<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    protected $fillable = [
        'key', 'value', 'suffix', 'label_en', 'label_id',
        'sort_order', 'is_visible',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
    ];

    public function getLabelAttribute(): string
    {
        $locale = app()->getLocale();
        return $this->{"label_{$locale}"} ?? $this->label_en;
    }

    public function scopeVisible($query)
    {
        return $query->where('is_visible', true)->orderBy('sort_order');
    }
}
