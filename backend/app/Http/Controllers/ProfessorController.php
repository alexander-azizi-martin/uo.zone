<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProfessorResource;
use App\Models\Professor;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class ProfessorController extends Controller
{
    public function allProfessors(Request $request): JsonResponse
    {
        $limiterKey = 'all-professors:' . $request->ip;
        abort_if(
            RateLimiter::tooManyAttempts($limiterKey, 5),
            429,
            'To many requests to api/professors.'
        );
        RateLimiter::hit($limiterKey, 60);

        if (!Cache::has('professors')) {
            $professors = Professor::cursor()->pluck('id')->all() ?? [];
            Cache::put('professors', $professors);
        }

        return response()->json(Cache::get('professors'));
    }

    public function getProfessor(string $id): ProfessorResource
    {
        if (!is_numeric($id)) {
            throw (new ModelNotFoundException())->setModel(Professor::class);
        }

        $professor = Professor::with(['sections' => ['course'], 'surveys'])
            ->findOrFail($id);

        return (new ProfessorResource($professor))->withCourses();
    }
}
