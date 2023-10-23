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
        $languages = array_intersect($request->getLanguages(), config('app.valid_locales'));

        abort_if(empty($languages), 406, 'Languages not supported');

        App::setLocale(head($languages));

        return $next($request);
    }
}
