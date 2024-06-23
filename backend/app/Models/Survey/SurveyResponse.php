<?php

namespace App\Models\Survey;

use App\Casts\Translation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyResponse extends Model
{
    use HasFactory;

    const RESPONSE_VALUES = [
        'almost always' => 5,
        'often' => 4,
        'sometimes' => 3,
        'rarely' => 2,
        'almost never' => 1,
        'strongly agree' => 5,
        'agree' => 4,
        'neither agree nor disagree' => 3,
        'disagree' => 2,
        'strongly disagree' => 1,
        'very useful' => 5,
        'useful' => 4,
        'not very useful' => 3,
        'useless' => 2,
        'no feedback' => 1,
        'excellent' => 5,
        'good' => 4,
        'acceptable' => 3,
        'poor' => 2,
        'very poor' => 1,
        'very light' => 5,
        'lighter than average' => 4,
        'average' => 3,
        'heavier than average' => 2,
        'very heavy' => 1,
    ];

    /**
     * The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'response' => Translation::class,
    ];

    /**
     * Get the section's professor.
     */
    public function surveyQuestion(): BelongsTo
    {
        return $this->belongsTo(SurveyQuestion::class);
    }

    /**
     * Gets a value out of 5 for the survey response.
     */
    public function getValueAttribute(): ?int
    {
        return self::RESPONSE_VALUES[
            __('survey-responses.'.$this->response, locale: 'en')
        ] ?? null;
    }
}
