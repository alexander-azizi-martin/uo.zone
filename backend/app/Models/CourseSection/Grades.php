<?php

namespace App\Models\CourseSection;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Grades extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'course_section_grades';

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
    public static function merge($grades): ?Grades
    {
        $collectedGrades = collect($grades)->filter();

        $mergedGrades = new Grades;
        foreach (array_keys(self::GRADE_VALUES) as $grade) {
            $gradeTotal = $collectedGrades->sum(fn ($g) => $g->getAttribute($grade));
            $mergedGrades->setAttribute($grade, $gradeTotal);
        }

        return $mergedGrades;
    }

    /**
     * Sums the total number of grades.
     */
    public function getTotalAttribute(): int
    {
        $total = 0;

        foreach (array_keys(self::GRADE_VALUES) as $grade) {
            $total += $this->getAttribute($grade);
        }

        return $total;
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
        foreach (self::GRADE_VALUES as $grade => $value) {
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
        foreach (array_keys(self::GRADE_VALUES) as $grade) {
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
        $mode = null;
        $size = 0;
        foreach (array_keys(self::GRADE_VALUES) as $grade) {
            if ($size < $this->getAttribute($grade)) {
                $mode = $grade;
                $size = $this->getAttribute($grade);
            }
        }

        return $mode;
    }
}
