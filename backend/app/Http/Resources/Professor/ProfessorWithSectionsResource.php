<?php

namespace App\Http\Resources\Professor;

use App\Http\Resources\Course\CourseSectionResource;
use App\Http\Resources\GradesResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin App\Models\Professor\Professor
 */
class ProfessorWithSectionsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'grades' => new GradesResource($this->grades),
            'sections' => CourseSectionResource::collection($this->sections),
        ];
    }
}
