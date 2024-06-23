<?php

namespace App\Models\Professor;

use App\Models\Course\CourseSection;
use App\Traits\HasGrades;
use App\Traits\HasSurvey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'public_id';
    }

    /**
     * Get all of the sections taught by the professor.
     */
    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(CourseSection::class);
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
        $this->loadMissing('grades');

        return [
            'name' => $this->name,
            'public_id' => $this->public_id,
            'total_enrolled' => (int) ($this->grades->total ?? 0),
        ];
    }

    /**
     * Gets instance representing an unknown professor.
     */
    public static function unknown(): Professor
    {
        return new Professor(['id' => 0, 'name' => '']);
    }
}
