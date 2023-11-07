<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RateMyProfessorReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'link' => $this->link,
            'rating' => $this->rating,
            'difficulty' => $this->difficulty,
            'numRatings' => $this->num_ratings,
            'department' => $this->department,
        ];
    }
}
