<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'subject' => $this->subject,
            'faculty' => $this->whenHas('faculty'),
            'courses' => $this->whenLoaded('courses', function () {
                return CourseResource::collection($this->courses);
            }),
        ];
    }
}
