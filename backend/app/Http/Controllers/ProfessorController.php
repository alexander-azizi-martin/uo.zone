<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProfessorResource;
use App\Models\Professor;

class ProfessorController extends Controller
{
    public function getProfessor(string $id): ProfessorResource
    {
        $professor = Professor::with(['sections' => ['course'], 'surveys'])
            ->findOrFail($id);

        return (new ProfessorResource($professor))->withCourses();
    }
}
