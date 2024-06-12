<?php

namespace App\Http\Controllers;

use App\Http\Resources\Course\CourseResource;
use App\Http\Resources\Subject\SubjectWithGradesResource;
use App\Models\Subject;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SubjectController extends Controller
{
    public function getAllSubjects(): JsonResponse
    {
        if (! Cache::has('subjects')) {
            $subjects = Subject::cursor()->pluck('code')->all();
            Cache::put('subjects', $subjects);
        }

        /** @var array<string> */
        return response()->json(Cache::get('subjects'));
    }

    public function getSubject(Subject $subject): SubjectWithGradesResource
    {
        $subject->load('grades');
        $subject->loadCount('courses');

        return new SubjectWithGradesResource($subject);
    }

    public function getSubjectCourses(Subject $subject)
    {
        $subject->load([
            'courses' => [
                'subject',
                'sections',
                'grades',
                'frenchEquivalent',
                'englishEquivalent',
            ],
        ]);

        return CourseResource::collection($subject->courses);
    }
}
