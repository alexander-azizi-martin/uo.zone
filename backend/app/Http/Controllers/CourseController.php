<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

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

    public function getCourse(Course $course): CourseResource
    {
        $course->load([
            'sections' => ['professor' => ['rmpReview', 'grades'], 'grades'],
            'survey',
            'subject',
            'grades',
            'frenchEquivalent',
            'englishEquivalent',
        ]);

        return (new CourseResource($course))->withProfessors();
    }
}
