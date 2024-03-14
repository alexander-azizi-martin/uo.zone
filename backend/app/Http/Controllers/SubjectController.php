<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SubjectController extends Controller
{
    public function allSubjects(): JsonResponse
    {
        if (! Cache::has('subjects')) {
            $subjects = Subject::cursor()->pluck('code')->all();
            Cache::put('subjects', $subjects);
        }

        return response()->json(Cache::get('subjects'));
    }

    public function getSubject(Subject $subject)
    {
        $subject->load('grades');
        $subject->loadCount('courses');

        return new SubjectResource($subject);
    }

    public function getSubjectCourses(Subject $subject)
    {
        $subject->load(['courses' => ['grades']]);

        return CourseResource::collection($subject->courses);
    }
}
