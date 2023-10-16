<?php

namespace App\Http\Controllers;

use App\Models\Professor;
use Illuminate\Http\JsonResponse;

class ProfessorController extends Controller
{
    public function getProfessor(Professor $professor): JsonResponse
    {
        return response()->json($professor->toArray());
    }
}
