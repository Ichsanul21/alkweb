<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use hisorange\BrowserDetect\Parser as Browser;

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

        // Only log once per IP per day
        if (! \App\Models\Visitor::where('ip_address', $ip)->where('visited_date', $date)->exists()) {
            try {
                // Get Browser & Device Info
                $browser = \Browser::browserName();
                $deviceType = \Browser::isMobile() ? 'Mobile' : (\Browser::isTablet() ? 'Tablet' : 'Desktop');
                
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
                ]);
            } catch (\Exception $e) {
                // Silently drop if tracking fails (e.g. IP2Location DB missing, permission errors)
                \Illuminate\Support\Facades\Log::error('Visitor tracking failed: ' . $e->getMessage());
            }
        }

        return $next($request);
    }
}
