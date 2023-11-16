<?php

namespace App\Http\Resources;

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
            'grades' => $this->whenHas('grades'),
            'totalEnrolled' => $this->whenHas('total_enrolled'),
            'survey' => $this->whenLoaded('survey', function () {
                return SurveyQuestionResource::collection($this->survey);
            }),
            'rmpReview' => $this->whenLoaded('rmpReview', function () {
                return isset($this->rmpReview) ? new RateMyProfessorReviewResource($this->rmpReview) : null;
            }),
            'courses' => $this->when($this->withCourses, function () {
                $groupedSections = $this->sections->loadMissing('course')->groupby('course.code');

                $courses = [];
                foreach ($groupedSections as $sections) {
                    $totalGrades = [];
                    $totalEnrolled = 0;
                    foreach ($sections as $section) {
                        foreach ($section->grades as $grade => $value) {
                            $totalGrades[$grade] = ($totalGrades[$grade] ?? 0) + $value;
                            $totalEnrolled += $value;
                        }
                    }

                    $course = $sections->first()->course;
                    $course->grades = $totalGrades;
                    $course->total_enrolled = $totalEnrolled;
                    $course->setRelation('sections', $sections);
                    $courses[] = $course;
                }

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
