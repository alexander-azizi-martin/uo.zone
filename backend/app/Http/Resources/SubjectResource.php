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
            'subject' => $this->subject->getLocalTranslation(),
            'grades' => $this->whenHas('grades'),
            'total_enrolled' => $this->whenHas('total_enrolled'),
            'faculty' => $this->whenHas('faculty', function () {
                return $this->faculty->getLocalTranslation();
            }),
            'courses' => $this->whenLoaded('courses', function () {
                return CourseResource::collection($this->courses->sortBy('code'));
            }),
        ];
    }
}
