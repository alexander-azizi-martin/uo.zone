<?php

namespace App\Traits;

use App\Models\Grades;
use Illuminate\Database\Eloquent\Relations\MorphOne;

trait HasGrades
{
    /**
     * Get the models's grades.
     */
    public function grades(): MorphOne
    {
        return $this->MorphOne(Grades::class, 'gradable');
    }
}
