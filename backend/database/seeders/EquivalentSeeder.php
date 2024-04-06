<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Seeder;

use function Laravel\Prompts\progress;

class EquivalentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = Course::lazy();

        $progress = progress('', $courses->count(), null);
        $progress->start();

        foreach ($courses as $course) {
            $courseCode = str($course->code);

            $subjectCode = $courseCode->take(3);
            $courseNumber = intval((string) $courseCode->substr(3));
            $courseNumberLength = (int) log($courseNumber, 10);

            if ($course->languages['en'] === 1 && $course->languages['fr'] === 1) {
            } elseif ($course->languages['en'] === 1) {
                $frenchCourseNumber = $courseNumber + 4 * 10 ** ($courseNumberLength - 1);
                $frenchEquivalent = Course::firstWhere(['code' => "$subjectCode$frenchCourseNumber"]);

                if (! is_null($frenchEquivalent)) {
                    $course->fr_equivalent_id = $frenchEquivalent->id;
                }
            } elseif ($course->languages['fr'] === 1) {
                $englishCourseNumber = $courseNumber - 4 * 10 ** ($courseNumberLength - 1);
                $englishEquivalent = Course::firstWhere(['code' => "$subjectCode$englishCourseNumber"]);

                if (! is_null($englishEquivalent)) {
                    $course->en_equivalent_id = $englishEquivalent->id;
                }
            }

            $course->save();
            $progress->advance();
        }

        $progress->finish();
    }
}
