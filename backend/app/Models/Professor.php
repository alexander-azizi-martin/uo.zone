<?php

namespace App\Models;

use App\Traits\HasGrades;
use App\Traits\HasSurvey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Scout\Searchable;

class Professor extends Model
{
    use HasFactory, HasGrades, HasSurvey, Searchable;

    /**
     * The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * Get all of the sections taught by the professor.
     */
    public function sections(): HasMany
    {
        return $this->HasMany(CourseSection::class);
    }

    /**
     * Get the professor's review from ratemyprofessor.
     */
    public function rmpReview(): HasOne
    {
        return $this->hasOne(RateMyProfessorReview::class);
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'total_enrolled' => (int) ($this->loadMissing('grades')->grades->total ?? 0),
        ];
    }

    /**
     * Gets instance representing an unknown professor.
     */
    public static function unknown(): Professor
    {
        $unknownProfessor = Professor::find(0);

        if (empty($unknownProfessor)) {
            $unknownProfessor = Professor::create(['id' => 0, 'name' => 'Unknown Professors']);
        }

        return $unknownProfessor;
    }
}
