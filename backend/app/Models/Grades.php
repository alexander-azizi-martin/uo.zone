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
        'NS' => null,
        'NC' => null,
        'ABS' => 0,
        'P' => null,
        'S' => null,
    ];

    /**
     * Creates a new instance of grades with all values initialized to 0.
     */
    public static function new(): Grades
    {
        $grades = new Grades;

        foreach (array_keys(Grades::GRADE_VALUES) as $grade) {
            $grades->setAttribute($grade, 0);
        }

        $grades->total = 0;

        return $grades;
    }

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
        $total = 0;
        foreach (Grades::GRADE_VALUES as $grade => $value) {
            if (is_null($value)) {
                continue;
            }

            $mean += $value * $this->getAttribute($grade);
            $total += $this->getAttribute($grade);
        }

        return $total > 0 ? $mean / $total : null;
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
        foreach (array_keys(Grades::GRADE_VALUES) as $grade) {
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
        foreach (array_keys(Grades::GRADE_VALUES) as $grade) {
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

        foreach (array_keys(Grades::GRADE_VALUES) as $grade) {
            $this->setAttribute(
                $grade,
                $this->getAttribute($grade) + $grades->getAttribute($grade)
            );
        }

        $this->total += $grades->total;

        return $this;
    }
}
