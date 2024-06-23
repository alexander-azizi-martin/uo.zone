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
        return [
            'total' => $this->total,
            /** @var float|null */
            'mean' => $this->mean,
            /** @var ('A+'|'A'|'A-'|'B+'|'B'|'C+'|'C'|'D+'|'D'|'E'|'F'|'EIN'|'NS'|'NC'|'ABS'|'P'|'S')|null */
            'median' => $this->median,
            /** @var ('A+'|'A'|'A-'|'B+'|'B'|'C+'|'C'|'D+'|'D'|'E'|'F'|'EIN'|'NS'|'NC'|'ABS'|'P'|'S')|null */
            'mode' => $this->mode,
            'distribution' => [
                /** @var int */
                'A+' => $this->{'A+'},
                /** @var int */
                'A' => $this->{'A'},
                /** @var int */
                'A-' => $this->{'A-'},
                /** @var int */
                'B+' => $this->{'B+'},
                /** @var int */
                'B' => $this->{'B'},
                /** @var int */
                'C+' => $this->{'C+'},
                /** @var int */
                'C' => $this->{'C'},
                /** @var int */
                'D+' => $this->{'D+'},
                /** @var int */
                'D' => $this->{'D'},
                /** @var int */
                'E' => $this->{'E'},
                /** @var int */
                'F' => $this->{'F'},
                /** @var int */
                'EIN' => $this->{'EIN'},
                /** @var int */
                'NS' => $this->{'NS'},
                /** @var int */
                'NC' => $this->{'NC'},
                /** @var int */
                'ABS' => $this->{'ABS'},
                /** @var int */
                'P' => $this->{'P'},
                /** @var int */
                'S' => $this->{'S'},
            ],
        ];
    }
}
