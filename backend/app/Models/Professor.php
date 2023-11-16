<?php

namespace App\Models;

use App\Traits\HasSearch;
use App\Traits\HasSurvey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Professor extends Model
{
    use HasFactory, HasSurvey, HasSearch;

    /**
     * The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'grades' => 'array',
    ];

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
}
