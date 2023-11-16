<?php

namespace App\Models;

use App\Traits\HasSearch;
use App\Traits\HasSurvey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory, HasSearch, HasSurvey;

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'grades' => 'array',
    ];

    /**
     * Get all of the course's sections.
     */
    public function sections(): HasMany
    {
        return $this->HasMany(CourseSection::class);
    }

    /**
     * Get the course's subject.
     */
    public function subject(): BelongsTo
    {
        return $this->BelongsTo(Subject::class);
    }
}
