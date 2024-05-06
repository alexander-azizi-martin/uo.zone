<?php

namespace App\Http\Controllers;

use App\Http\Resources\Professor\ProfessorResource;
use App\Models\Professor\Professor;
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

    public function getProfessor(Professor $professor): ProfessorResource
    {
        $professor->load([
            'sections' => ['course' => ['grades'], 'grades'],
            'survey',
            'rmpReview',
            'grades',
        ]);

        return (new ProfessorResource($professor))->withCourses();
    }
}
