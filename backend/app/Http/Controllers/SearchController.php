<?php

namespace App\Http\Controllers;

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
            ->with('viewCount')->orderByDesc('viewCount.views')->limit(10)->get();
        $faculties = Subject::search($query)
            ->with('viewCount')->orderByDesc('viewCount.views')->limit(10)->get();
        $professors = Professor::search($query)
            ->with('viewCount')->orderByDesc('viewCount.views')->limit(10)->get();

        return response()->json([
            'courses' => $courses,
            'faculties' => $faculties,
            'professors' => $professors,
        ]);
    }
}
