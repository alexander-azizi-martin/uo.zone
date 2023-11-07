<?php

namespace App\Traits;

use App\Models\SurveyQuestion;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait HasSurvey
{
    /**
     * Get the models's survey.
     */
    public function survey(): MorphMany
    {
        return $this->MorphMany(SurveyQuestion::class, 'surveyable');
    }
};
