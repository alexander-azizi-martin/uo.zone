<?php

namespace App\Models;

use App\Traits\HasViews;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Course extends Model
{
    use HasFactory, HasViews;

    /**
     * Get all of the course's sections.
     */
    public function sections(): HasMany
    {
        return $this->HasMany(CourseSection::class);
    }

    /**
     * Get the course's subject.
     */
    public function subject(): HasOne
    {
        return $this->HasOne(Subject::class);
    }
}
