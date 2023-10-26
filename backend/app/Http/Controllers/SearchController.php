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

        $courses = Course::search($query)
            ->select(['code', 'title'])
            ->orderByDesc('total_enrolled')
            ->limit(10)
            ->get();

        $subjects = Subject::search($query)
            ->select(['code', 'subject'])
            ->limit(10)
            ->get();
        
        $professors = Professor::search($query)
            ->select(['id', 'name'])
            ->limit(10)
            ->get();

        return response()->json([
            'courses' => CourseResource::collection($courses->sortBy('code')),
            'subjects' => SubjectResource::collection($subjects->sortBy('name')),
            'professors' => ProfessorResource::collection($professors->sortBy('code')),
        ]);
    }
}
