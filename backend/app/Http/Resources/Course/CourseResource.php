<?php

namespace App\Http\Resources\Course;

use App\Http\Resources\GradesResource;
use App\Http\Resources\Professor\ProfessorResource;
use App\Http\Resources\SubjectResource;
use App\Http\Resources\Survey\SurveyQuestionResource;
use App\Models\Course\CourseSection;
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
            'languages' => $this->whenHas('languages', function () {
                return collect($this->languages)->filter()->keys();
            }),
            'components' => $this->whenLoaded('components', function () {
                return $this->components->pluck('component');
            }),
            'englishEquivalent' => $this->whenLoaded('englishEquivalent', function () {
                return $this->englishEquivalent->code;
            }),
            'frenchEquivalent' => $this->whenLoaded('frenchEquivalent', function () {
                return $this->frenchEquivalent->code;
            }),
            'grades' => $this->whenLoaded('grades', function () {
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
                    ->loadMissing('professors')
                    ->groupby(function (CourseSection $section) {
                        return $section->professors->pluck('id')->all();
                    })
                    ->map(function ($sections, $professorId) {
                        $grades = Grades::new();
                        $sections->pluck('grades')->each([$grades, 'mergeGrades']);

                        $professor = $sections->first()->professors->find($professorId);
                        $professor->setRelation('sections', $sections);
                        $professor->setRelation('grades', $grades->total > 0 ? $grades : null);

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
