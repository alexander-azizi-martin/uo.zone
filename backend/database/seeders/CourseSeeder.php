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

        foreach ($subjects as $subject) {
            if (!Arr::exists($subject, 'code') || !Arr::exists($subject, 'faculty'))
                continue;

            $savedSubject = Subject::create(
                Arr::only($subject, ['faculty', 'code', 'subject'])
            );

            foreach ($subject['courses'] as $course) {
                if (!Arr::exists($course, 'description'))
                    continue;

                $course['code'] = str($course['code'])
                    ->lower()
                    ->remove(' ')
                    ->toString();

                $savedSubject->courses()->create(
                    Arr::only($course, ['code', 'title', 'description', 'units'])
                );
            }
        }
    }
}
