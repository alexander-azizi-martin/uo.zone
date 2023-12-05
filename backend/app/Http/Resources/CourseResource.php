<?php

namespace App\Http\Resources;

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
            'title' => $this->title->getLocalTranslation(),
            'description' => $this->whenHas('description', function () {
                return $this->description->getLocalTranslation();
            }),
            'components' => $this->whenHas('components', function () {
                return $this->components->getLocalTranslation();
            }),
            'requirements' => $this->whenHas('requirements', function () {
                return $this->requirements->getLocalTranslation();
            }),
            'units' => $this->whenHas('units'),
            'grades' => $this->whenHas('grades'),
            'totalEnrolled' => $this->whenHas('total_enrolled'),
            'subject' => $this->whenLoaded('subject', function () {
                return new SubjectResource($this->subject);
            }),
            'survey' => $this->whenLoaded('survey', function () {
                return SurveyQuestionResource::collection($this->survey);
            }),
            'professors' => $this->when($this->withProfessors, function () {
                $groupedSections = $this->sections->loadMissing('professor')->groupby('professor.id');

                $professors = [];
                foreach ($groupedSections as $sections) {
                    $totalGrades = [];
                    $totalEnrolled = 0;
                    foreach ($sections as $section) {
                        foreach ($section->grades as $grade => $value) {
                            $totalGrades[$grade] = ($totalGrades[$grade] ?? 0) + $value;
                            $totalEnrolled += $value;
                        }
                    }

                    $professor = $sections->first()->professor;
                    $professor->grades = $totalGrades;
                    $professor->total_enrolled = $totalEnrolled;
                    $professor->setRelation('sections', $sections);
                    $professors[] = $professor;
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
