<?php

namespace App\Http\Resources\CourseSection;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin App\Models\CourseSection\CourseSection
 */
class CourseSectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            /** @var string */
            'term' => $this->term,
            'section' => $this->section,
            'grades' => new GradesResource($this->grades),
        ];
    }
}
