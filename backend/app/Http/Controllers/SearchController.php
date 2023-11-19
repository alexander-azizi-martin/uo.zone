<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Http\Resources\ProfessorResource;
use App\Http\Resources\SubjectResource;
use App\Models\Course;
use App\Models\Professor;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = $request->query('q');

        $courses = Course::search($query)->get();
        $subjects = Subject::search($query)->get();
        $professors = Professor::search($query)->get();

        return response()->json([
            'courses' => CourseResource::collection($courses),
            'subjects' => SubjectResource::collection($subjects),
            'professors' => ProfessorResource::collection($professors),
        ]);
    }
}
