<?php

namespace Database\Seeders;

use App\Models\CourseSection;
use App\Models\Grades;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gradesCSV = Storage::disk('scrapped')->readStream('processed_grade_data.csv');

        $header = fgetcsv($gradesCSV);
        while ($row = fgetcsv($gradesCSV)) {
            $gradeData = array_combine($header, $row);

            $courseSection = CourseSection::firstWhere([
                'code' => "{$gradeData['course']} {$gradeData['section']}",
                'term_id' => $gradeData['term_id'],
            ]);

            if (empty($courseSection) || isset($courseSection->grades)) {
                continue;
            }

            $grades = $courseSection->grades()->create(
                Arr::only($gradeData, [...array_keys(Grades::GRADE_VALUES), 'total'])
            );

            $courseSection->course
                ->grades()
                ->firstOrNew()
                ->mergeGrades($grades)
                ->save();

            $courseSection->course->subject
                ->grades()
                ->firstOrNew()
                ->mergeGrades($courseSection->grades)
                ->save();

            $courseSection->professor
                ->grades()
                ->firstOrNew()
                ->mergeGrades($grades)
                ->save();
        }
    }
}
