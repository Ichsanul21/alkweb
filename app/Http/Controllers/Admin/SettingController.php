<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Service;
use App\Models\Statistic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => [
                'general' => Setting::getGroup('general'),
                'social' => Setting::getGroup('social'),
                'seo' => Setting::getGroup('seo'),
            ],
            'statistics' => Statistic::orderBy('sort_order')->get(),
            'services' => Service::orderBy('sort_order')->get(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            $setting = Setting::where('key', $key)->first();
            if ($setting) {
                $setting->update(['value' => $value]);
            }
        }

        Setting::clearCache();

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }

    public function updateStatistic(Request $request, Statistic $statistic)
    {
        $validated = $request->validate([
            'value' => 'required|string',
            'suffix' => 'nullable|string',
            'label_en' => 'required|string',
            'label_id' => 'required|string',
            'sort_order' => 'integer',
            'is_visible' => 'boolean',
        ]);

        $statistic->update($validated);

        return redirect()->back()->with('success', 'Statistic updated.');
    }

    public function updateService(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_id' => 'required|string|max:255',
            'description_en' => 'nullable|string',
            'description_id' => 'nullable|string',
            'number' => 'required|string|max:5',
            'sort_order' => 'integer',
            'is_visible' => 'boolean',
        ]);

        $service->update($validated);

        return redirect()->back()->with('success', 'Service updated.');
    }
}
