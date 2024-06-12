<?php

namespace App\Http\Controllers;

use App\Http\Resources\Search\CourseSearchRecourse;
use App\Http\Resources\Search\ProfessorSearchRecourse;
use App\Http\Resources\Search\SubjectSearchRecourse;
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
        $query = $request->validate(['q' => 'required|max:255'])['q'];

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
            'courses' => CourseSearchRecourse::collection($courses),
            'professors' => ProfessorSearchRecourse::collection($professors),
            'subjects' => SubjectSearchRecourse::collection($subjects),
        ]);
    }
}
