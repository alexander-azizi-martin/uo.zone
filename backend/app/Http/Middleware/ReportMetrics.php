<?php

namespace App\Http\Middleware;

use Closure;
use Facades\League\StatsD\Client as Statsd;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ReportMetrics
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
        $statsdMetrics = [
            'requests',
            'request.code.'.$response->getStatusCode(),
            'request.method.'.$request->method(),
        ];

        $route = $request->route();
        if (isset($route)) {
            $statsdMetrics[] = 'request.route.'.$route->uri();
        }

        $responseTime = round((microtime(true) - $request->server('REQUEST_TIME_FLOAT')) * 1000, 2);

        Statsd::increment($statsdMetrics);
        Statsd::timings(['request.responseTime' => $responseTime]);

        $axiomData = Arr::whereNotNull([
            'ip' => $request->ip(),
            'method' => $request->method(),
            'path' => $request->path(),
            'status' => $response->getStatusCode(),
            'responseTime' => $responseTime,
            'route' => $route->uri ?? null,
        ]);

        if (App::isProduction()) {
            Http::withToken(config('services.axiom.token'))
                ->withUrlParameters(['dataset' => config('services.axiom.dataset')])
                ->post('https://api.axiom.co/v1/datasets/{dataset}/ingest', [$axiomData]);
        }

        Log::channel('requests')->info(
            "{$request->ip()} {$request->method()} {$request->path()} {$response->getStatusCode()}"
        );
    }
}
