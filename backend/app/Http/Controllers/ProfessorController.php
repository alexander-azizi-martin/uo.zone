<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProfessorResource;
use App\Models\Professor;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ProfessorController extends Controller
{
    public function allProfessors(): JsonResponse
    {
        if (! Cache::has('professors')) {
            $professors = Professor::cursor()->pluck('id')->all() ?? [];
            Cache::put('professors', $professors);
        }

        return response()->json(Cache::get('professors'));
    }

    public function getProfessor(string $id): ProfessorResource
    {
        if (! is_numeric($id)) {
            throw (new ModelNotFoundException())->setModel(Professor::class);
        }

        $professor = Professor::with(
            ['sections' => ['course', 'grades'], 'survey', 'rmpReview', 'grades']
        )->findOrFail($id);

        return (new ProfessorResource($professor))->withCourses();
    }
}
