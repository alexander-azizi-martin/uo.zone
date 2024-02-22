<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\Grades;
use App\Models\Professor;
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
        $gradesCSV = Storage::disk('scraped')->readStream('processed_grade_data.csv');

        $header = fgetcsv($gradesCSV);
        while ($row = fgetcsv($gradesCSV)) {
            $gradeData = array_combine($header, $row);

            $courseSection = CourseSection::firstWhere([
                'code' => "{$gradeData['course']} {$gradeData['section']}",
                'term_id' => $gradeData['term_id'],
            ]);

            if (empty($courseSection)) {
                $course = Course::where('code', Str::lower($gradeData['course']))->first();

                if (isset($course)) {
                    $courseSection = Professor::unknown()->sections()->create([
                        'course_id' => $course->id,
                        'term_id' => $gradeData['term_id'],
                        'code' => "{$gradeData['course']} {$gradeData['section']}",
                        'section' => Str::lower($gradeData['section']),
                    ]);
                }
            }

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
                ->mergeGrades($grades)
                ->save();

            $courseSection->professor
                ->grades()
                ->firstOrNew()
                ->mergeGrades($grades)
                ->save();
        }
    }
}
