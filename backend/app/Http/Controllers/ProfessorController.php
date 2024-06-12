<?php

namespace App\Http\Controllers;

use App\Http\Resources\Course\CourseWithSectionsResource;
use App\Http\Resources\Professor\ProfessorResource;
use App\Http\Resources\Survey\SurveyQuestionResource;
use App\Models\Grades;
use App\Models\Professor\Professor;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ProfessorController extends Controller
{
    public function getAllProfessors(): JsonResponse
    {
        if (! Cache::has('professors')) {
            $professors = Professor::cursor()->pluck('id')->all() ?? [];
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
            ->groupby('course.id')
            ->map(function ($sections) {
                $grades = Grades::new();
                $sections->pluck('grades')->each([$grades, 'mergeGrades']);

                $course = $sections->first()->course;
                $course->setRelation('sections', $sections);
                $course->setRelation('grades', $grades->total > 0 ? $grades : null);

                return $course;
            })
            ->values()
            ->all();

        return CourseWithSectionsResource::collection($courses);
    }

    public function getProfessorSurvey(Professor $professor)
    {
        $professor->load(['survey']);

        return SurveyQuestionResource::collection($professor->survey);
    }
}
