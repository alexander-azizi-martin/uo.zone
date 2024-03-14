<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

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

    public function getSubject(string $code)
    {
        $subject = Subject::with('grades')->withCount('courses')->firstWhere(['code' => Str::lower($code)]);
        // $subject->load('grades');
        // $subject->loadCount('courses');

        return new SubjectResource($subject);
    }

    public function getSubjectCourses(string $code)
    {
        $subject = Subject::with(['courses' => ['grades']])->firstWhere(['code' => Str::lower($code)]);
        // $subject->load(['courses' => ['grades']]);

        return CourseResource::collection($subject->courses);
    }
}
