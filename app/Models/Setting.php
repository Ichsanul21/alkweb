<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'group'];

    public static function get(string $key, $default = null): ?string
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    public static function set(string $key, ?string $value, string $group = 'general'): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => $group]
        );
    }

    public static function getGroup(string $group): array
    {
        return cache()->remember("settings.{$group}", 60 * 60, function () use ($group) {
            return static::where('group', $group)
                ->pluck('value', 'key')
                ->toArray();
        });
    }

    /**
     * Clear cached settings. Call after any settings update.
     */
    public static function clearCache(string $group = null): void
    {
        if ($group) {
            cache()->forget("settings.{$group}");
        } else {
            foreach (['general', 'social', 'seo'] as $g) {
                cache()->forget("settings.{$g}");
            }
        }
    }
}
