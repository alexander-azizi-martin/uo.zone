<?php

namespace App\Actions;

use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ConfigureExceptions
{
    /**
     * Configure application exception handling.
     */
    public function __invoke(Exceptions $exceptions): void
    {
        $exceptions->render(function (HttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'error' => $e->getMessage(),
                    'code' => $e->getStatusCode(),
                ], $e->getStatusCode());
            }
        });
    }
}
