<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class ValidateLanguage
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $requestedLanguages = $request->getLanguages();
        $validLanguages = array_intersect($requestedLanguages, config('app.valid_locales'));

        if (! empty($validLanguages)) {
            App::setLocale(head($validLanguages));
        }

        return $next($request);
    }
}
