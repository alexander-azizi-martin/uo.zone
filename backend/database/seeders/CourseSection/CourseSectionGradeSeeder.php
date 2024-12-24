<?php

namespace Database\Seeders\CourseSection;

use App\Models\Course;
use App\Models\CourseSection\CourseSection;
use App\Models\CourseSection\Grades;
use Database\Seeders\CollectionSeeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class CourseSectionGradeSeeder extends CollectionSeeder
{
    private \Ds\Set $courses;

    public function loadCollection(): array
    {
        $this->courses = new \Ds\Set(Course::pluck('code'));

        $gradesCSV = Storage::disk('static')->readStream('processed_grade_data.csv');
        $grades = [];

        $header = fgetcsv($gradesCSV);
        while ($row = fgetcsv($gradesCSV)) {
            $grades[] = array_combine($header, $row);
        }

        return $grades;
    }

    public function seedItem(mixed $gradeData): void
    {
        $courseCode = str($gradeData['course'])->lower();
        $subjectCode = $courseCode->take(3);

        $courseSectionId = CourseSection::hashId([
            'course_code' => $courseCode,
            'section' => $gradeData['section'],
            'term_id' => $gradeData['term_id'],
        ]);

        if (! $this->courses->contains($courseCode->toString())) {
            return;
        }

        CourseSection::upsert(
            [
                'id' => $courseSectionId,
                'course_code' => $courseCode,
                'subject_code' => $subjectCode,
                'section' => $gradeData['section'],
                'term_id' => $gradeData['term_id'],
            ],
            ['id']
        );
        Grades::upsert(
            [
                'course_section_id' => $courseSectionId,
                ...Arr::only($gradeData, array_keys(Grades::GRADE_VALUES)),
            ],
            ['course_section_id']
        );
    }
}
