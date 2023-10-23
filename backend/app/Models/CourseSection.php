<?php

namespace App\Models;

use App\Traits\HasSurveys;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CourseSection extends Model
{
    use HasFactory, HasSurveys;

    /**
     * The attributes that aren't mass assignable.
     */
    protected $guarded = [];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'grades' => 'array',
        'term' => Translations::class,
    ];

    /**
     * Get the section's course.
     */
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the section's professor.
     */
    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class);
    }
}
