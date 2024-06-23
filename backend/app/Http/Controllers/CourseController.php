<?php

namespace App\Http\Controllers;

use App\Http\Resources\Course\CourseResource;
use App\Http\Resources\Professor\ProfessorWithSectionsResource;
use App\Http\Resources\Survey\SurveyQuestionResource;
use App\Models\Course\Course;
use App\Models\Course\CourseSection;
use App\Models\Grades;
use App\Models\Professor\Professor;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class CourseController extends Controller
{
    public function getAllCourses(): JsonResponse
    {
        if (! Cache::has('courses')) {
            $courses = Course::cursor()->pluck('code')->all();
            Cache::put('courses', $courses);
        }

        /** @var array<string> */
        return response()->json(Cache::get('courses'));
    }

    public function getCourse(Course $course): CourseResource
    {
        $course->load([
            'sections',
            'subject',
            'grades',
            'frenchEquivalent',
            'englishEquivalent',
        ]);

        return new CourseResource($course);
    }

    public function getCourseProfessors(Course $course)
    {
        $course->load(['sections' => ['professors', 'grades']]);

        /** @var array<\App\Models\Professor> */
        $professors = $course->sections
            ->sortByDesc('term_id')
            ->loadMissing('professors')
            ->groupby(function (CourseSection $section) {
                return $section->professors->pluck('id')->all() ?: [0];
            })
            ->map(function ($sections, $professorId) {
                $grades = Grades::new();
                $sections->pluck('grades')->each([$grades, 'mergeGrades']);

                $professor = $professorId === 0
                    ? Professor::unknown()
                    : $sections->first()->professors->find($professorId);

                $professor->setRelation('sections', $sections);
                $professor->setRelation('grades', $grades->total > 0 ? $grades : null);

                return $professor;
            })
            ->values()
            ->all();

        return ProfessorWithSectionsResource::collection($professors);
    }

    public function getCourseSurvey(Course $course)
    {
        $course->load(['survey']);

        return SurveyQuestionResource::collection($course->survey);
    }
}
