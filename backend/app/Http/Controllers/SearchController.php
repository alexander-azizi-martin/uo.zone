<?php

namespace App\Http\Controllers;

use App\Http\Resources\Search\CourseSearchRecourse;
use App\Http\Resources\Search\ProfessorSearchRecourse;
use App\Http\Resources\Search\SubjectSearchRecourse;
use App\Models\Course;
use App\Models\Professor\Professor;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Validator;

class SearchController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $query = $request->validate(['q' => 'required|max:255'])['q'];

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
            'courses' => CourseSearchRecourse::collection($courses),
            'professors' => ProfessorSearchRecourse::collection($professors),
            'subjects' => SubjectSearchRecourse::collection($subjects),
        ]);
    }
}
