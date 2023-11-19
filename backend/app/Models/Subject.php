<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Subject extends Model
{
    use HasFactory, Searchable;

    /**
     * The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'grades' => 'json',
        'subject' => Translations::class,
        'faculty' => Translations::class,
    ];

    /**
     * Get all of the subject's courses.
     */
    public function courses(): HasMany
    {
        return $this->HasMany(Course::class);
    }

    /**
     * Get the indexable data array for the model.
     */
    public function toSearchableArray(): array
    {
        return [
            'subject' => $this->subject,
            'code' => $this->code,
            'total_enrolled' => $this->total_enrolled,
        ];
    }
}
