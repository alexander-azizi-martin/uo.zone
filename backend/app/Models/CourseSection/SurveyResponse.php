<?php

namespace App\Models\CourseSection;

use App\Helpers\TranslationCast;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public $timestamps = false;

    protected $table = 'course_section_survey_responses';

    protected $casts = [
        'question' => TranslationCast::class,
        'options' => TranslationCast::class,
    ];

    /**
     * Sums the total number of responses for the question.
     */
    public function getTotalResponsesAttribute(): int
    {
        return collect(['A', 'B', 'C', 'D', 'E', 'F'])
            ->map([$this, 'getAttribute'])
            ->sum();
    }

    /**
     * Gets a score out of 5 for the survey question.
     */
    public function getScoreAttribute(): ?float
    {
        $score = 0;
        $total = 0;
        foreach ($this->options as $label => $option) {
            $translatedOption = __("survey-responses.$option", locale: 'en');
            if (! array_key_exists($translatedOption, self::RESPONSE_VALUES)) {
                continue;
            }

            $value = self::RESPONSE_VALUES[$translatedOption];
            if ($value < 0) {
                continue;
            }

            $score += $value * $this->getAttribute($label);
            $total += $this->getAttribute($label);
        }

        return $total > 0 ? $score / $total : null;
    }
}
