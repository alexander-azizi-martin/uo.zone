<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function allCourses(): JsonResponse
    {
        if (! Cache::has('courses')) {
            $courses = Course::cursor()->pluck('code')->all();
            Cache::put('courses', $courses);
        }

        return response()->json(Cache::get('courses'));
    }

    public function getCourse(string $code): CourseResource
    {
        $course = Course::with(['sections' => ['professor' => ['rmpReview']], 'survey', 'subject'])
            ->where('code', Str::lower($code))
            ->firstOrFail();

        return (new CourseResource($course))->withProfessors();
    }
}
