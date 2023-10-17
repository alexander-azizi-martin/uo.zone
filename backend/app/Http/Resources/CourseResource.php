<?php

namespace App\Http\Resources;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    protected bool $withProfessor = false;
    protected bool $withSections = false;

    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'title' => $this->title,
            'description' => $this->whenHas('description'),
            'units' => $this->whenHas('units'),
            'grades' => $this->whenHas('grades'),
            'total_enrolled' => $this->whenHas('total_enrolled'),
            'surveys' => $this->whenLoaded('surveys', function () {
                return SurveyResource::collection($this->surveys);
            }),
            'professors' => $this->when($this->withProfessor, function () {
                $professors = new Collection($this->sections->loadMissing('professor')->pluck('professor'));
                $groupedSections = $this->sections->groupby('professor.id');

                foreach ($groupedSections as $professorId => $sections) {
                    $professors->find($professorId)->setRelation('sections', $sections);
                }

                return ProfessorResource::collection($professors)->collection->map->withSections();
            }),
            'sections' => $this->when($this->withSections, function () {
                return CourseSectionResource::collection($this->sections);
            }),
        ];
    }

    public function withProfessor(): static
    {
        $this->withProfessor = true;
        return $this;
    }

    public function withSections(): static
    {
        $this->withSections = true;
        return $this;
    }
}
