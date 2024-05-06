<?php

namespace App\Http\Controllers;

use App\Http\Resources\Course\CourseResource;
use App\Http\Resources\Professor\ProfessorResource;
use App\Http\Resources\SubjectResource;
use App\Models\Course\Course;
use App\Models\Professor\Professor;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = str($request->input('q', ''))->limit(255, '');

        $courses = Course::search($query)
            ->orderBy('languages.'.App::getLocale(), 'desc')
            ->orderBy('total_enrolled', 'desc')
            ->take(10)
            ->hydrate();

        $subjects = Subject::search($query)
            ->orderBy('total_enrolled', 'desc')
            ->take(10)
            ->hydrate();

        $professors = Professor::search($query)
            ->orderBy('total_enrolled', 'desc')
            ->take(10)
            ->hydrate();

        return response()->json([
            'courses' => CourseResource::collection($courses),
            'subjects' => SubjectResource::collection($subjects),
            'professors' => ProfessorResource::collection($professors),
        ]);
    }
}
