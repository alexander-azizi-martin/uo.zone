<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimiterMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        abort_if(RateLimiter::tooManyAttempts($request->ip, 5), 429);
        RateLimiter::hit($request->id, 1);
        return $next($request);
    }
}
