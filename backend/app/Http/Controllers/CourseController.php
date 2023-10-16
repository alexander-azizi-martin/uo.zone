<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    public function getCourse(string $code): JsonResponse
    {
        $course = Course::where('code', $code)
            ->with(['sections' => ['professor'], 'subject'])->firstOrFail();

        return response()->json($course->toArray());
    }
}
