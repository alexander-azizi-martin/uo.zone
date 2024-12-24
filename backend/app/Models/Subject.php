<?php

namespace App\Models;

use App\Helpers\CustomRelation;
use App\Helpers\TranslationCast;
use App\Traits\HasCustomRelations;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Subject extends Model
{
    use HasCustomRelations, HasFactory, Searchable;

    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = 'code';

    protected $keyType = 'string';

    protected $guarded = [];

    protected $casts = [
        'title' => TranslationCast::class,
        'faculty' => TranslationCast::class,
    ];

    /**
     * Get all the subject's courses.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function grades(): CustomRelation
    {
        $includeCovid = filter_var(
            request()->query('covid', false),
            FILTER_VALIDATE_BOOL
        );

        return $this->hasGrades(includeCovid: $includeCovid);
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        $this->loadMissing('grades');

        return [
            'title' => json_decode($this->getRawOriginal('title'), true),
            'code' => $this->code,
            'total_enrolled' => $this->grades->total ?? 0,
        ];
    }
}
