<?php

namespace App\Models\Professor;

use App\Helpers\CustomRelation;
use App\Models\CourseSection\CourseSection;
use App\Traits\HasCustomRelations;
use App\Traits\HasHashId;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Scout\Searchable;

class Professor extends Model
{
    use HasCustomRelations, HasFactory, HasHashId, Searchable;

    public $timestamps = false;

    public $incrementing = false;

    public $idHashAttributes = ['name'];

    protected $guarded = [];

    public function getRouteKeyName(): string
    {
        return 'public_id';
    }

    /**
     * Gets instance representing an unknown professor.
     */
    public static function unknown(): Professor
    {
        return new Professor(['id' => 0, 'name' => null]);
    }

    /**
     * Get all the sections taught by the professor.
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
     * Get the professor's review from grades.
     */
    public function grades(): CustomRelation
    {
        $includeCovid = filter_var(
            request()->query('covid', false),
            FILTER_VALIDATE_BOOL
        );

        return $this->hasGrades(joinTable: 'course_section_professor', includeCovid: $includeCovid);
    }

    /**
     * Get the professor's review from survey responses.
     */
    public function surveyResponses(): CustomRelation
    {
        return $this->hasSurveyResponses(
            questionType: Professor::class,
            joinTable: 'course_section_professor'
        );
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
            'total_enrolled' => $this->grades->total ?? 0,
        ];
    }
}
