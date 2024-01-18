<?php

namespace App\Http\Resources;

use App\Models\Grades;
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
            'components' => $this->whenHas('components'),
            'requirements' => $this->whenHas('requirements'),
            'units' => $this->whenHas('units'),
            'gradeInfo' => $this->whenLoaded('grades', function () {
                return isset($this->grades) ? new GradesResource($this->grades) : null;
            }),
            'subject' => $this->whenLoaded('subject', function () {
                return new SubjectResource($this->subject);
            }),
            'survey' => $this->whenLoaded('survey', function () {
                return SurveyQuestionResource::collection($this->survey);
            }),
            'professors' => $this->when($this->withProfessors, function () {
                $professors = $this->sections
                    ->sortByDesc('term_id')
                    ->loadMissing('professor')
                    ->groupby('professor.id')
                    ->map(function ($sections) {
                        $grades = Grades::new();
                        $sections->pluck('grades')->each([$grades, 'mergeGrades']);

                        $professor = $sections->first()->professor;
                        $professor->setRelation('sections', $sections);
                        $professor->setRelation('grades', $grades);

                        return $professor;
                    })
                    ->values();

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
