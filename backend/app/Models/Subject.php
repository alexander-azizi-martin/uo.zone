<?php

namespace App\Models;

use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
     * Get the searchable columns for the model.
     */
    public static function searchableColumns(): array
    {
        return ['code', 'subject'];
    }
}
