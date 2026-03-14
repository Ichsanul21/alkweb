<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class LogVisitor
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $ip = $request->ip();
        $date = now()->format('Y-m-d');

        try {
            $visitor = \App\Models\Visitor::where('ip_address', $ip)->where('visited_date', $date)->first();

            if (!$visitor) {
                // Get Browser & Device Info
                $userAgent = $request->userAgent();
                $browser = 'Unknown';
                if (preg_match('/(Chrome|CriOS|Edg|Firefox|Safari|Opera|MSIE|Trident)/i', $userAgent, $matches)) {
                    $browser = $matches[1];
                }
                
                $deviceType = 'Desktop';
                if (preg_match('/(Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini)/i', $userAgent)) {
                    $deviceType = 'Mobile';
                } elseif (preg_match('/(Tablet|iPad)/i', $userAgent)) {
                    $deviceType = 'Tablet';
                }
                
                // Get Location Info
                $location = class_exists(\Ip2location\IP2LocationLaravel\Facade\IP2LocationLaravel::class) 
                    ? \Ip2location\IP2LocationLaravel\Facade\IP2LocationLaravel::get($ip) 
                    : null;

                \App\Models\Visitor::create([
                    'ip_address' => $ip,
                    'device_type' => $deviceType,
                    'browser' => $browser,
                    'country' => $location && $location['countryName'] !== '-' ? $location['countryName'] : null,
                    'region' => $location && $location['regionName'] !== '-' ? $location['regionName'] : null,
                    'city' => $location && $location['cityName'] !== '-' ? $location['cityName'] : null,
                    'latitude' => $location && $location['latitude'] !== 0 ? $location['latitude'] : null,
                    'longitude' => $location && $location['longitude'] !== 0 ? $location['longitude'] : null,
                    'zipcode' => $location && $location['zipCode'] !== '-' ? $location['zipCode'] : null,
                    'timezone' => $location && $location['timeZone'] !== '-' ? $location['timeZone'] : null,
                    'visited_date' => $date,
                    'last_seen_at' => now(),
                ]);
            } else {
                // Update activity timestamp to track session duration
                $visitor->update(['last_seen_at' => now()]);
            }
        } catch (\Throwable $e) {
            // Silently drop if tracking fails
            \Illuminate\Support\Facades\Log::error('Visitor tracking failed: ' . $e->getMessage());
        }

        return $next($request);
    }
}
