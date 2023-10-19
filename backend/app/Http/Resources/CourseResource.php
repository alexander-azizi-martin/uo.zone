<?php

namespace App\Http\Resources;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    protected bool $withProfessors = false;
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
            'subject' => $this->whenLoaded('subject', function () {
                return new SubjectResource($this->subject);
            }),
            'surveys' => $this->whenLoaded('surveys', function () {
                return SurveyResource::collection($this->surveys);
            }),
            'professors' => $this->when($this->withProfessors, function () {
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

    /**
     * Add the course's professors with the sections they taught to the output.
     */
    public function withProfessors(): static
    {
        $this->withProfessors = true;
        return $this;
    }

    /**
     * Add the course's sections to the output.
     */
    public function withSections(): static
    {
        $this->withSections = true;
        return $this;
    }
}
