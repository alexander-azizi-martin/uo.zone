<?php

use App\Actions\ConfigureExceptions;
use App\Http\Middleware\ReportMetrics;
use App\Http\Middleware\ValidateLanguage;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*');
        $middleware->throttleApi(redis: true);
        $middleware->appendToGroup('api', ValidateLanguage::class);
        $middleware->append(ReportMetrics::class);
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        (new ConfigureExceptions)($exceptions);
    })->create();
