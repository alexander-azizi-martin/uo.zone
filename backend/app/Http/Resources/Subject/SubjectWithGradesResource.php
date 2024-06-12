<?php

namespace App\Http\Resources\Subject;

use App\Http\Resources\GradesResource;
use Illuminate\Http\Request;

/**
 * @mixin App\Models\Subject
 */
class SubjectWithGradesResource extends SubjectResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {

        return [
            $this->merge(parent::toArray($request)),

            /** @var int */
            'coursesCount' => $this->courses_count,
            'grades' => new GradesResource($this->grades),
        ];
    }
}
