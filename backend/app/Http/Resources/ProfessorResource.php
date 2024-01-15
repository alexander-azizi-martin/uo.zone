<?php

namespace App\Http\Resources;

use App\Models\Grades;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfessorResource extends JsonResource
{
    protected bool $withCourses = false;

    protected bool $withSections = false;

    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'gradeInfo' => $this->whenLoaded('grades', function () {
                return isset($this->grades) ? new GradesResource($this->grades) : null;
            }),
            'survey' => $this->whenLoaded('survey', function () {
                return SurveyQuestionResource::collection($this->survey);
            }),
            'rmpReview' => $this->whenLoaded('rmpReview', function () {
                return isset($this->rmpReview) ? new RateMyProfessorReviewResource($this->rmpReview) : null;
            }),
            'courses' => $this->when($this->withCourses, function () {
                $courses = $this->sections
                    ->sortByDesc('term_id')
                    ->loadMissing('course')
                    ->groupby('course.id')
                    ->map(function ($sections) {
                        $grades = new Grades;
                        $sections->pluck('grades')->each([$grades, 'mergeGrades']);

                        $course = $sections->first()->course;
                        $course->setRelation('sections', $sections);
                        $course->setRelation('grades', $grades);

                        return $course;
                    })
                    ->values();

                return CourseResource::collection($courses)->collection->map->withSections();
            }),
            'sections' => $this->when($this->withSections, function () {
                return CourseSectionResource::collection($this->sections);
            }),
        ];
    }

    /**
     * Add the professor's courses with the sections they taught to the output.
     */
    public function withCourses(): static
    {
        $this->withCourses = true;

        return $this;
    }

    /**
     * Add the sections the professor taught to the output.
     */
    public function withSections(): static
    {
        $this->withSections = true;

        return $this;
    }
}
