<?php

namespace App\Traits;

use App\Models\Survey;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasSurveys 
{
    /**
     * Get the models's surveys.
     */
    public function surveys(): MorphMany
    {
        return $this->MorphMany(Survey::class, 'surveyable');
    }
};
