<?php

namespace App\Models\CourseSection;

use App\Models\Course;
use App\Models\Professor\Professor;
use App\Traits\HasHashId;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CourseSection extends Model
{
    use HasFactory, HasHashId;

    const COVID_START = 20200;

    const COVID_END = 20212;

    public $timestamps = false;

    public $incrementing = false;

    public $idHashAttributes = ['course_code', 'section', 'term_id'];

    protected $guarded = [];

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

    /**
     * Whether the course section happened during covid.
     */
    protected function getIsDuringCovidAttribute(): bool
    {
        return $this->term_id >= self::COVID_START && $this->term_id <= self::COVID_END;
    }

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
     * Get the section's grades.
     */
    public function grades(): HasOne
    {
        return $this->hasOne(Grades::class);
    }
}
