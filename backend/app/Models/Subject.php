<?php

namespace App\Models;

use App\Casts\Translation;
use App\Models\Course\Course;
use App\Traits\HasGrades;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Subject extends Model
{
    use HasFactory, HasGrades, Searchable;

    /**
     * The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'subject' => Translation::class,
        'faculty' => Translation::class,
    ];

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'code';
    }

    /**
     * Get all the subject's courses.
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        $this->loadMissing('grades');

        return [
            'subject' => $this->getRawOriginal('subject'),
            'code' => $this->code,
            'total_enrolled' => (int) ($this->grades->total ?? 0),
        ];
    }
}
