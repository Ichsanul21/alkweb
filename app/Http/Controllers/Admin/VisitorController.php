<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VisitorController extends Controller
{
    public function index(): Response
    {
        $visitors = Visitor::select('visitors.*')
            ->selectSub(
                Visitor::selectRaw('COUNT(*)')
                    ->whereColumn('ip_address', 'visitors.ip_address'),
                'frequency'
            )
            ->latest()
            ->paginate(15)
            ->through(function ($visitor) {
                // Calculate session duration for THIS specific daily visit
                $visitor->duration = $visitor->last_seen_at 
                    ? $visitor->created_at->diffInMinutes($visitor->last_seen_at) 
                    : 0;

                return $visitor;
            });

        return Inertia::render('Admin/Visitors/Index', [
            'visitors' => $visitors,
        ]);
    }
}
