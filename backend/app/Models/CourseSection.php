<?php

namespace App\Models;

use App\Traits\HasGrades;
use App\Traits\HasSurvey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\App;

class CourseSection extends Model
{
    use HasFactory, HasGrades, HasSurvey;

    /**
     * The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * Get the section's course.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the section's professor.
     */
    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class);
    }

    /**
     * Representation of the term id in the locale language.
     */
    public function getTermAttribute(): string
    {
        $year = (int) ($this->term_id / 10);
        $seasonId = $this->term_id % 10;

        $season = [
            ['en' => 'Winter', 'fr' => 'Hiver'],
            ['en' => 'Summer', 'fr' => 'Été'],
            ['en' => 'Fall', 'fr' => 'Autome'],
        ][$seasonId][App::getLocale()];

        return "$season $year";
    }
}
