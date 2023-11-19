<?php

namespace Database\Seeders;

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
        $subjects = Storage::json('courses_en.json');

        foreach ($subjects as $subjectData) {
            if (! Arr::exists($subjectData, 'code') || ! Arr::exists($subjectData, 'faculty')) {
                continue;
            }

            $subject = Subject::create(
                Arr::only($subjectData, ['faculty', 'code', 'subject'])
            );

            $courses = [];
            foreach ($subjectData['courses'] as $course) {
                if (! Arr::exists($course, 'description')) {
                    continue;
                }

                $courses[] = [
                    ...Arr::only($course, ['code', 'title', 'description', 'units']),
                    'languages' => [
                        'en' => (int) ($course['language'] == 'en'),
                        'fr' => (int) ($course['language'] == 'fr'),
                    ],
                ];
            }

            $subject->courses()->createMany($courses);
        }

        $frenchSubjects = Storage::json('courses_fr.json');
        foreach ($frenchSubjects as $subjectData) {
            if (! Arr::exists($subjectData, 'code') || ! Arr::exists($subjectData, 'faculty')) {
                continue;
            }

            $subject = Subject::where('code', $subjectData['code'])->firstOrFail();
            $subject->subject->addTranslation('fr', $subjectData['subject']);
            $subject->faculty->addTranslation('fr', $subjectData['faculty']);
            $subject->save();
        }
    }
}
