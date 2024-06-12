<?php

namespace App\Models\Survey;

use App\Casts\Translation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SurveyQuestion extends Model
{
    use HasFactory;

    /**
     * The relations to eager load on every query.
     */
    protected $with = ['responses'];

    /**
     * The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'question' => Translation::class,
    ];

    /**
     * Get the survey question's responses.
     */
    public function responses(): HasMany
    {
        return $this->hasMany(SurveyResponse::class);
    }

    /**
     * Gets the total number of responses to the survey question.
     */
    public function getTotalResponsesAttribute(): int
    {
        return $this->responses->sum('num_responses');
    }
}
