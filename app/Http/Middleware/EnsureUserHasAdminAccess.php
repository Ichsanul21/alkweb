<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasAdminAccess
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->hasAnyRole(['Admin', 'Editor', 'Author'])) {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}
