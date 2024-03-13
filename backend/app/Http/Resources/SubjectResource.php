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
            'coursesCount' => $this->whenHas('courses_count', function () {
                return $this->courses_count;
            }),
            'gradeInfo' => $this->whenLoaded('grades', function () {
                return isset($this->grades) ? new GradesResource($this->grades) : null;
            }),
        ];
    }
}
