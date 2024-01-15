<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class SubjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'code' => Str::upper($this->code),
            'subject' => $this->subject,
            'faculty' => $this->whenHas('faculty'),
            'gradeInfo' => $this->whenLoaded('grades', function () {
                return isset($this->grades) ? new GradesResource($this->grades) : null;
            }),
            'courses' => $this->whenLoaded('courses', function () {
                return CourseResource::collection($this->courses->sortBy('code'));
            }),
        ];
    }
}
