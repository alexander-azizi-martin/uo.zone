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
        $course->incrementViewCount();

        return response()->json($course->toArray());
    }
}
