<?php

namespace App\Http\Resources\Survey;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin App\Models\Survey\SurveyQuestion
 */
class SurveyQuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'question' => $this->question,
            'totalResponses' => $this->total_responses,
            'responses' => SurveyResponseResource::collection($this->responses),
        ];
    }
}
