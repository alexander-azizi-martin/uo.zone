<?php

namespace App\Http\Resources\Course;

use App\Http\Resources\GradesResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin App\Models\Course\Course
 */
class CourseWithSectionsResource extends JsonResource
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
            'grades' => new GradesResource($this->grades),
            'sections' => CourseSectionResource::collection($this->sections),
        ];
    }
}
