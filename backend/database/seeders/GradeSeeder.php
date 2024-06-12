<?php

namespace Database\Seeders;

use App\Models\Course\Course;
use App\Models\Course\CourseSection;
use App\Models\Grades;
use App\Models\Professor\Professor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GradeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $gradesCSV = Storage::disk('static')->readStream('processed_grade_data.csv');

        $header = fgetcsv($gradesCSV);
        while ($row = fgetcsv($gradesCSV)) {
            $gradeData = array_combine($header, $row);

            $course = Course::firstWhere('code', Str::lower($gradeData['course']));

            if (empty($course)) {
                continue;
            }

            $courseSection = CourseSection::firstWhere([
                'course_id' => $course->id,
                'term_id' => $gradeData['term_id'],
            ]);

            if (empty($courseSection)) {
                $courseSection = Professor::unknown()->sections()->create([
                    'course_id' => $course->id,
                    'term_id' => $gradeData['term_id'],
                    'section' => Str::lower($gradeData['section']),
                ]);
            }

            if (isset($courseSection->grades)) {
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
                ->mergeGrades($grades)
                ->save();

            foreach ($courseSection->professors as $professor) {
                $professor
                    ->grades()
                    ->firstOrNew()
                    ->mergeGrades($grades)
                    ->save();
            }
        }
    }
}
