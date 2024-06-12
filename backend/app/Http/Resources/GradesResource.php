<?php

namespace App\Http\Resources;

use App\Models\Grades;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin App\Models\Grades
 */
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
            'total' => $this->total,
            /** @var float|null */
            'mean' => $this->mean,
            /** @var string|null */
            'median' => $this->median,
            /** @var string|null */
            'mode' => $this->mode,
            /** @var array<string,int> */
            'distribution' => $distribution,
        ];
    }
}
