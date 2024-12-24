<?php

namespace Database\Seeders\Course;

use App\Models\Course;
use Database\Seeders\CollectionSeeder;
use Illuminate\Support\Facades\DB;

class EquivalentCourseSeeder extends CollectionSeeder
{
    private \Ds\Set $courses;

    public function loadCollection(): array
    {
        Course::disableSearchSyncing();

        $this->courses = new \Ds\Set(Course::pluck('code'));

        return Course::all()->all();
    }

    public function seedItem(mixed $course): void
    {
        $subjectCode = str($course->code)->take(3);
        $courseNumber = intval(str_replace($subjectCode, '', $course->code));
        $courseNumberLength = (int) log($courseNumber, 10);

        if ($course->languages['en'] === 1 && $course->languages['fr'] === 1) {
        } elseif ($course->languages['en'] === 1) {
            $frenchCourseNumber = $courseNumber + 4 * 10 ** ($courseNumberLength - 1);
            $frenchCourseCode = "$subjectCode$frenchCourseNumber";

            if ($this->courses->contains($frenchCourseCode)) {
                DB::table('equivalent_courses')->upsert(
                    [
                        'course_code' => $course->code,
                        'equivalent_course_code' => $frenchCourseCode,
                        'equivalent_course_language' => 'fr',
                    ],
                    ['course_code', 'equivalent_course_code', 'equivalent_course_language']
                );
            }
        } elseif ($course->languages['fr'] === 1) {
            $englishCourseNumber = $courseNumber - 4 * 10 ** ($courseNumberLength - 1);
            $englishCourseCode = "$subjectCode$englishCourseNumber";

            if ($this->courses->contains($englishCourseCode)) {
                DB::table('equivalent_courses')->upsert(
                    [
                        'course_code' => $course->code,
                        'equivalent_course_code' => $englishCourseCode,
                        'equivalent_course_language' => 'en',
                    ],
                    ['course_code', 'equivalent_course_code', 'equivalent_course_language']
                );
            }
        }
    }
}
