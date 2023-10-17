<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;

class CourseController extends Controller
{
    public function getCourse(string $code): CourseResource
    {
        $course = Course::with(['sections' => ['professor']])
            ->where('code', $code)
            ->firstOrFail();

        return (new CourseResource($course))->withProfessor();
    }
}
