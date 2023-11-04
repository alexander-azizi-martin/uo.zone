<?php

namespace App\Http\Resources;

use Illuminate\Database\Eloquent\Collection;
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
            'total_enrolled' => $this->whenHas('total_enrolled'),
            'surveys' => $this->whenLoaded('surveys', function () {
                return SurveyResource::collection($this->surveys);
            }),
            'rmp_review' => $this->whenLoaded('rmpReview', function () {
                return isset($this->rmpReview) ? new RateMyProfessorReviewResource($this->rmpReview) : null;
            }),
            'courses' => $this->when($this->withCourses, function () {
                $courses = new Collection($this->sections->loadMissing('course')->pluck('course'));
                $groupedSections = $this->sections->groupby('course.code');

                foreach ($groupedSections as $courseCode => $sections) {
                    $courses->firstWhere('code', $courseCode)->setRelation('sections', $sections);
                }

                return CourseResource::collection($courses->unique('code')->values())->collection->map->withSections();;
            }),
            'sections' => $this->when($this->withSections, function () {
                return CourseSectionResource::collection($this->sections);
            })
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
