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
        $visitors = Visitor::latest()
            ->paginate(15)
            ->through(function ($visitor) {
                // Calculate visit frequency for this IP (how many days they checked in)
                $visitor->frequency = Visitor::where('ip_address', $visitor->ip_address)->count();
                
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
