<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Subject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;


class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = Storage::json("courses.json");

        foreach ($subjects as $subjectData) {
            if (!Arr::exists($subjectData, 'code') || !Arr::exists($subjectData, 'faculty'))
                continue;

            $subject = Subject::create(
                Arr::only($subjectData, ['faculty', 'code', 'subject'])
            );

            $courses = [];
            foreach ($subjectData['courses'] as $course) {
                if (!Arr::exists($course, 'description'))
                    continue;

                $course['code'] = str($course['code'])
                    ->lower()
                    ->remove(' ')
                    ->toString();

                $courses[] = Arr::only($course, ['code', 'title', 'description', 'units']);
            }

            $subject->courses()->createMany($courses);
        }
    }
}
