<?php

namespace App\Http\Resources\Search;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin App\Models\Professor\Professor
 */
class ProfessorSearchRecourse extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            /** @var int */
            'publicId' => $this->public_id,
            'name' => $this->name,
        ];
    }
}
