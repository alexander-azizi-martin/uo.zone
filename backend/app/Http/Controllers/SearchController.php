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
use Illuminate\Support\Facades\App;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = $request->input('q', '');

        $courses = Course::search($query)
            ->orderBy('languages.'.App::getLocale(), 'desc')
            ->orderBy('total_enrolled', 'desc')
            ->take(10)
            ->get();

        $subjects = Subject::search($query)
            ->orderBy('total_enrolled', 'desc')
            ->take(10)
            ->get();

        $professors = Professor::search($query)
            ->orderBy('total_enrolled', 'desc')
            ->take(10)
            ->get();

        return response()->json([
            'courses' => CourseResource::collection($courses),
            'subjects' => SubjectResource::collection($subjects),
            'professors' => ProfessorResource::collection($professors),
        ]);
    }
}
