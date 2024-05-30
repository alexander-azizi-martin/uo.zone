<?php

namespace App\Models\Course;

use App\Casts\Translation;
use App\Models\Subject;
use App\Traits\HasGrades;
use App\Traits\HasSurvey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'title' => Translation::class,
        'description' => Translation::class,
        'requirements' => Translation::class,
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
     * Get the course's components.
     */
    public function components(): BelongsToMany
    {
        return $this->belongsToMany(CourseComponent::class);
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
     * Get the term ids the course was previously offered in.
     */
    public function previousTermIds(): array
    {
        return $this->sections()
            ->groupBy('term_id')
            ->select('term_id')
            ->toBase()
            ->get()
            ->pluck('term_id')
            ->all();
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        $this->loadMissing(['grades', 'englishEquivalent', 'frenchEquivalent']);

        return [
            'title' => $this->getRawOriginal('title'),
            'code' => $this->code,
            'total_enrolled' => (int) ($this->grades->total ?? 0),
            'languages' => $this->languages,
            'english_equivalent_title' => ! is_null($this->englishEquivalent)
                ? $this->englishEquivalent->getRawOriginal('title')
                : null,
            'french_equivalent_title' => ! is_null($this->frenchEquivalent)
                ? $this->frenchEquivalent->getRawOriginal('title')
                : null,
        ];
    }
}
