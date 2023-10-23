<?php

namespace App\Models;

use App\Traits\HasSurveys;
use App\Traits\Searchable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Professor extends Model
{
    use HasFactory, HasSurveys, Searchable;

    /**
     * The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'grades' => 'array',
    ];

    /**
     * Get all of the sections taught by the professor.
     */
    public function sections(): HasMany
    {
        return $this->HasMany(CourseSection::class);
    }

    /**
     * Get the searchable columns for the model.
     */
    public static function searchableColumns(): array
    {  
        return ['name'];
    }
}
