<?php

namespace App\Actions;

use App\Helpers\HttpStatusCode;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ConfigureExceptions
{
    /**
     * Configure application exception handling.
     */
    public function __invoke(Exceptions $exceptions): void
    {
        $exceptions->render(function (HttpException $e, Request $request) {
            if ($request->is('api*')) {
                return response()->json([
                    'error' => $e->getMessage(),
                    'code' => $e->getStatusCode(),
                ], $e->getStatusCode());
            }
        });

        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api*')) {
                return response()->json([
                    'error' => $e->getMessage(),
                    'code' => HttpStatusCode::BAD_REQUEST,
                ], HttpStatusCode::BAD_REQUEST);
            }
        });
    }
}
