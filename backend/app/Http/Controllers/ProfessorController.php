<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProfessorResource;
use App\Models\Professor;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ProfessorController extends Controller
{
    public function allProfessors(): JsonResponse
    {
        if (!Cache::has('professors')) {
            $professors = Professor::cursor()->pluck('id')->all() ?? [];
            Cache::put('professors', $professors);
        }

        return response()->json(Cache::get('professors'));
    }

    public function getProfessor(string $id): ProfessorResource
    {
        $professor = Professor::with(['sections' => ['course'], 'surveys'])
            ->findOrFail($id);

        return (new ProfessorResource($professor))->withCourses();
    }
}
