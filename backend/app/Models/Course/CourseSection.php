<?php

namespace App\Models\Course;

use App\Models\Professor\Professor;
use App\Traits\HasGrades;
use App\Traits\HasSurvey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
    public function professors(): BelongsToMany
    {
        return $this->belongsToMany(Professor::class);
    }

    /**
     * Representation of the term id in the locale language.
     */
    public function getTermAttribute(): string
    {
        $year = (int) ($this->term_id / 10);
        $seasonId = $this->term_id % 10;
        $season = __('seasons.'.['Winter', 'Summer', 'Fall'][$seasonId]);

        return "$season $year";
    }
}
