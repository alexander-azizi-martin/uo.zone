<?php

namespace App\Http\Resources\Course;

use App\Http\Resources\GradesResource;
use App\Http\Resources\Subject\SubjectResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin App\Models\Course\Course
 */
class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'title' => $this->title,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'units' => $this->units,
            /** @var array<string> */
            'languages' => $this->languages->filter()->keys(),
            /** @var array<string> */
            'components' => $this->components->pluck('component'),
            /** @var string|null */
            'englishEquivalent' => $this->englishEquivalent->code ?? null,
            /** @var string|null */
            'frenchEquivalent' => $this->frenchEquivalent->code ?? null,
            /** @var array<int> */
            'previousTermIds' => $this->previousTermIds,
            'grades' => new GradesResource($this->grades),
            'subject' => new SubjectResource($this->subject),
        ];
    }
}
