<?php

namespace App\Http\Resources\Course;

use App\Http\Resources\GradesResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseSectionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'term' => $this->term,
            'section' => $this->section,
            'grades' => new GradesResource($this->grades),
        ];
    }
}
