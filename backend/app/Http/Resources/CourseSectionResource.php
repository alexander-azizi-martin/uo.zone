<?php

namespace App\Http\Resources;

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
            'code' => $this->code,
            'grades' => $this->grades,
            'total_enrolled' => $this->total_enrolled,
        ];
    }
}