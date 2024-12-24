<?php

namespace App\Http\Resources\Course;

use App\Http\Resources\CourseSection\GradesResource;
use App\Http\Resources\Subject\SubjectResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin App\Models\Course
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
            'components' => $this->components,
            /** @var array{'code':string,'language':string}|null */
            'equivalentCourse' => is_null($this->equivalent_course)
                ? null
                : [
                    'code' => $this->equivalent_course->code,
                    'language' => $this->equivalent_course->pivot->equivalent_course_language,
                ],
            /** @var array<int> */
            'previousTermIds' => $this->previousTermIds,
            'grades' => new GradesResource($this->grades),
            'subject' => new SubjectResource($this->subject),
        ];
    }
}
