<?php

namespace App\Http\Controllers;

use App\Http\Resources\Course\CourseResource;
use App\Http\Resources\CourseSection\SurveyResponseRecourse;
use App\Http\Resources\Professor\ProfessorWithSectionsResource;
use App\Models\Course;
use App\Models\CourseSection\CourseSection;
use App\Models\CourseSection\Grades;
use App\Models\Professor\Professor;
use Illuminate\Database\Eloquent\Collection;
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
            'equivalentCourses',
        ]);

        return new CourseResource($course);
    }

    public function getCourseProfessors(Course $course)
    {
        $course->load(['sections' => ['professors', 'grades']]);

        /** @var array<\App\Models\Professor\Professor> */
        $professors = $course->sections
            ->filter(fn ($s) => ! $s->is_during_covid)
            ->sortByDesc('term_id')
            ->loadMissing('professors')
            ->groupby(function (CourseSection $section) {
                return $section->professors->pluck('id')->all() ?: [0];
            })
            ->map(function (Collection $sections, int $professorId) {
                $grades = Grades::merge($sections->pluck('grades'));

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

    public function getCourseSurveyResponses(Course $course)
    {
        $course->load(['surveyResponses']);

        return SurveyResponseRecourse::collection($course->surveyResponses);
    }
}
