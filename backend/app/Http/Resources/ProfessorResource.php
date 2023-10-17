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
            'survey' => $this->whenLoaded('surveys', function () {
                return SurveyResource::collection($this->surveys);
            }),
            'courses' => $this->when($this->withCourses, function () {
                $courses = new Collection($this->sections->loadMissing('course')->pluck('course'));
                $groupedSections = $this->sections->groupby('course.id');

                foreach ($groupedSections as $courseId => $sections) {
                    $courses->find($courseId)->setRelation('sections', $sections);
                }

                return CourseResource::collection($courses)->collection->map->withSections();;
            }),
            'sections' => $this->when($this->withSections, function () {
                return CourseSectionResource::collection($this->sections);
            })
        ];
    }

    public function withCourses(): static
    {
        $this->withCourses = true;
        return $this;
    }

    public function withSections(): static
    {
        $this->withSections = true;
        return $this;
    }
}
