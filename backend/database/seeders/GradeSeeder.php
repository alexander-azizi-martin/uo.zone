<?php

namespace Database\Seeders;

use App\Models\CourseSection;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    public const GRADES = [
        'A+',
        'A',
        'A-',
        'B+',
        'B',
        'C+',
        'C',
        'D+',
        'D',
        'E',
        'F',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (CourseSection::lazy() as $section) {
            $grades = collect();

            foreach (GradeSeeder::GRADES as $grade) {
                $grades->put($grade, fake()->randomNumber(2));
            }

            $section->grades = $grades->toArray();
            $section->total_enrolled = $grades->sum();
            $section->save();

            $course = $section->course;
            if (empty($course->grades)) {
                $course->grades = $grades;
            } else {
                $course->grades = $grades
                    ->mergeRecursive($course->grades)
                    ->map(function (array $values) {
                        return array_sum($values);
                    });
            }
            $course->total_enrolled += $section->total_enrolled;
            $course->save();

            $professor = $section->professor;
            if (empty($professor->grades)) {
                $professor->grades = $grades;
            } else {
                $professor->grades = $grades
                    ->mergeRecursive($professor->grades)
                    ->map(function (array $values) {
                        return array_sum($values);
                    });
            }
            $professor->total_enrolled += $section->total_enrolled;
            $professor->save();

            $subject = $section->course->subject;
            if (empty($subject->grades)) {
                $subject->grades = $grades;
            } else {
                $subject->grades = $grades
                    ->mergeRecursive($subject->grades)
                    ->map(function (array $values) {
                        return array_sum($values);
                    });
            }
            $subject->total_enrolled += $section->total_enrolled;
            $subject->save();
        }
    }
}
