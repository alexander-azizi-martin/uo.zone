<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\Course;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function getCourse(string $code): CourseResource
    {
        $course = Course::with(['sections' => ['professor'], 'surveys'])
            ->where('code', Str::lower($code))
            ->firstOrFail();

        return (new CourseResource($course))->withProfessor();
    }
}
