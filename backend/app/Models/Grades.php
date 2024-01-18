<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Grades extends Model
{
    use HasFactory;

    const GRADE_VALUES = [
        'A+' => 10,
        'A' => 9,
        'A-' => 8,
        'B+' => 7,
        'B' => 6,
        'C+' => 5,
        'C' => 4,
        'D+' => 3,
        'D' => 2,
        'E' => 1,
        'F' => 0,
        'EIN' => 0,
        'NS' => 0,
        'NC' => 0,
        'ABS' => 0,
        'P' => 0,
        'S' => 0,
    ];

    /**
     * Get the parent Grades model.
     */
    public function gradable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Gets the mean of the grade distribution.
     */
    public function getMeanAttribute(): ?float
    {
        if ($this->total == 0) {
            return null;
        }

        $mean = 0;
        foreach (Grades::GRADE_VALUES as $grade => $value) {
            $mean += $value * $this->getAttribute($grade) / $this->total;
        }

        return $mean;
    }

    /**
     * Gets the median of the grade distribution.
     */
    public function getMedianAttribute(): ?string
    {
        if ($this->total == 0) {
            return null;
        }

        $accumulator = 0;
        foreach (Grades::GRADE_VALUES as $grade => $_) {
            $accumulator += $this->getAttribute($grade);
            if ($accumulator >= $this->total / 2) {
                break;
            }
        }

        return $grade;
    }

    /**
     * Gets the mode of the grade distribution.
     */
    public function getModeAttribute(): ?string
    {
        $mode = '';
        $size = 0;
        foreach (Grades::GRADE_VALUES as $grade => $_) {
            if ($size < $this->getAttribute($grade)) {
                $mode = $grade;
                $size = $this->getAttribute($grade);
            }
        }

        return $mode !== '' ? $mode : null;
    }

    /**
     * Merge distribution of another Grades model.
     */
    public function mergeGrades(?Grades $grades): static
    {
        if (is_null($grades)) {
            return $this;
        }

        foreach (Grades::GRADE_VALUES as $grade => $_) {
            $this->setAttribute(
                $grade,
                $this->getAttribute($grade) + $grades->getAttribute($grade)
            );
        }

        $this->total += $grades->total;

        return $this;
    }
}
