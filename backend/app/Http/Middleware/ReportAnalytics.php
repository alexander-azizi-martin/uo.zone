<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use League\StatsD\Laravel5\Facade\StatsdFacade as Statsd;
use Symfony\Component\HttpFoundation\Response;

class ReportAnalytics
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    /**
     * Handle tasks after the response has been sent to the browser.
     */
    public function terminate(Request $request, Response $response)
    {
        $metrics = [
            'request.code.' . $response->getStatusCode(),
            'request.method.' . $request->method(),
            'request.path.' . $request->path(),
        ];

        $route = $request->route();
        if (isset($route)) {
            $metrics[] = 'request.route.' . $route->uri();
        }

        Statsd::increment($metrics);

        $responseTime = ((microtime(true) - $request->server('REQUEST_TIME_FLOAT')) * 1000);
        Statsd::timings(['request.response_time' => $responseTime]);

        Log::channel('requests')->info("{$response->getStatusCode()} {$request->method()} {$request->path()}");
    }
}
