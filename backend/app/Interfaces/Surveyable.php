<?php

namespace App\Interfaces;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

abstract class Surveyable extends Model
{
    abstract public function survey(): MorphMany;
}
