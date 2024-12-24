<?php

namespace App\Http\Resources\CourseSection;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin App\Models\CourseSection\SurveyResponse
 */
class SurveyResponseRecourse extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            /** @var string */
            'question' => $this->question,
            /** @var array{'A'?:string,'B'?:string,'C'?:string,'D'?:string,'E'?:string,'F'?:string} */
            'options' => $this->options,
            /** @var int */
            'totalResponses' => $this->total_responses,
            /** @var float|null */
            'score' => $this->score,
            'A' => $this->A,
            'B' => $this->B,
            'C' => $this->C,
            'D' => $this->D,
            'E' => $this->E,
            'F' => $this->F,
        ];
    }
}
