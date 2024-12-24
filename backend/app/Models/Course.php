<?php

namespace App\Models;

use App\Helpers\CustomRelation;
use App\Helpers\TranslationCast;
use App\Models\CourseSection\CourseSection;
use App\Traits\HasCustomRelations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Course extends Model
{
    use HasCustomRelations, HasFactory, Searchable;

    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = 'code';

    protected $keyType = 'string';

    protected $guarded = [];

    protected $casts = [
        'title' => TranslationCast::class,
        'description' => TranslationCast::class,
        'requirements' => TranslationCast::class,
        'components' => TranslationCast::class,
        'languages' => 'collection',
    ];

    /**
     * Get all of the course's sections.
     */
    public function sections(): HasMany
    {
        return $this->hasMany(
            CourseSection::class,
            foreignKey: 'course_code',
            localKey: 'code',
        );
    }

    /**
     * Get the course's subject.
     */
    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    /**
     * Get the course's equivalentCourses.
     */
    public function equivalentCourses(): BelongsToMany
    {
        return $this->belongsToMany(
            Course::class,
            table: 'equivalent_courses',
            foreignPivotKey: 'course_code',
            relatedPivotKey: 'equivalent_course_code',
            parentKey: 'code',
            relatedKey: 'code',
        )->withPivot('equivalent_course_language');
    }

    /**
     * Get the course's grades.
     */
    public function grades(): CustomRelation
    {
        $includeCovid = filter_var(
            request()->query('covid', false),
            FILTER_VALIDATE_BOOL
        );

        return $this->hasGrades(includeCovid: $includeCovid);
    }

    /**
     * Get the course's survey responses.
     */
    public function surveyResponses(): CustomRelation
    {
        return $this->hasSurveyResponses(questionType: Course::class);
    }

    /**
     * Get's the course's first equivalent course. There really should
     * only be one equivalent course. A french one for an english class,
     * and vise versa.
     */
    public function getEquivalentCourseAttribute()
    {
        return $this->equivalentCourses->first();
    }

    /**
     * Get the term ids the course was previously offered in.
     *
     * @return array<int>
     */
    public function getPreviousTermIdsAttribute(): array
    {
        return $this->sections->pluck('term_id')->unique()->all();
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<mixed>
     */
    public function toSearchableArray(): array
    {
        $this->loadMissing(['grades', 'equivalentCourses']);

        return [
            'title' => json_decode($this->getRawOriginal('title'), true),
            'code' => $this->code,
            'languages' => $this->languages,
            'total_enrolled' => $this->grades->total ?? 0,
            'equivalent_course_title' => ! is_null($this->equivalent_course)
                ? json_decode($this->equivalent_course->getRawOriginal('title'), true)
                : null,
        ];
    }
}
