<?php

namespace App\Http\Controllers;

use App\Http\Resources\Course\CourseWithSectionsResource;
use App\Http\Resources\CourseSection\SurveyResponseRecourse;
use App\Http\Resources\Professor\ProfessorResource;
use App\Models\CourseSection\Grades;
use App\Models\Professor\Professor;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ProfessorController extends Controller
{
    public function getAllProfessors(): JsonResponse
    {
        if (! Cache::has('professors')) {
            $professors = Professor::pluck('public_id')->all();
            Cache::put('professors', $professors);
        }

        /** @var array<int> */
        return response()->json(Cache::get('professors'));
    }

    public function getProfessor(Professor $professor): ProfessorResource
    {
        $professor->load(['rmpReview', 'grades']);

        return new ProfessorResource($professor);
    }

    public function getProfessorCourses(Professor $professor)
    {
        $professor->load(['sections' => ['grades']]);

        /** @var array<\App\Models\Course> */
        $courses = $professor->sections
            ->sortByDesc('term_id')
            ->loadMissing('course')
            ->groupby('course.code')
            ->map(function (Collection $sections) {
                $grades = Grades::merge($sections->pluck('grades'));

                $course = $sections->first()->course;
                $course->setRelation('sections', $sections);
                $course->setRelation('grades', $grades->total > 0 ? $grades : null);

                return $course;
            })
            ->values()
            ->all();

        return CourseWithSectionsResource::collection($courses);
    }

    public function getProfessorSurveyResponses(Professor $professor)
    {
        $professor->load(['surveyResponses']);

        return SurveyResponseRecourse::collection($professor->surveyResponses);
    }
}
