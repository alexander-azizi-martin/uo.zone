<?php

namespace App\Models;

use App\Traits\HasSurvey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Course extends Model
{
    use HasFactory, HasSurvey, Searchable;

    /**
     * The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'title' => Translations::class,
        'description' => Translations::class,
        'components' => Translations::class,
        'requirements' => Translations::class,
        'languages' => 'array',
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

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return [
            'title' => $this->title,
            'code' => $this->code,
            'total_enrolled' => $this->total_enrolled,
            'languages' => $this->languages,
        ];
    }
}
