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
        }
    }
}
