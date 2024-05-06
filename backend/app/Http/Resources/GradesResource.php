<?php

namespace App\Http\Resources;

use App\Models\Grades;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $distribution = [];
        foreach (array_keys(Grades::GRADE_VALUES) as $grade) {
            $distribution[$grade] = $this->getAttribute($grade);
        }

        return [
            'mean' => $this->mean,
            'median' => $this->median,
            'mode' => $this->mode,
            'total' => $this->total,
            'distribution' => $distribution,
        ];
    }
}
