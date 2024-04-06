<?php

namespace App\Models;

use App\Traits\HasGrades;
use App\Traits\HasSurvey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Course extends Model
{
    use HasFactory, HasGrades, HasSurvey, Searchable;

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
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'code';
    }

    /**
     * Get all of the course's sections.
     */
    public function sections(): HasMany
    {
        return $this->hasMany(CourseSection::class);
    }

    /**
     * Get the course's subject.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the course's english equivalent.
     */
    public function englishEquivalent(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'en_equivalent_id');
    }

    /**
     * Get the course's french equivalent.
     */
    public function frenchEquivalent(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'fr_equivalent_id');
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        $this->loadMissing(['grades', 'englishEquivalent', 'frenchEquivalent']);

        return [
            'title' => $this->title->translations,
            'code' => $this->code,
            'total_enrolled' => (int) ($this->grades->total ?? 0),
            'languages' => $this->languages,
            'english_equivalent_title' => $this->englishEquivalent->title->translations ?? null,
            'french_equivalent_title' => $this->frenchEquivalent->title->translations ?? null,
        ];
    }
}
