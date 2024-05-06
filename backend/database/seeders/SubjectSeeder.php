<?php

namespace Database\Seeders;

use App\Models\Course\Course;
use App\Models\Course\CourseComponent;
use App\Models\Subject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\progress;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Course::disableSearchSyncing();
        Subject::disableSearchSyncing();

        $subjects = json_decode(Storage::disk('static')->get('subjects_en.json'), true);

        $progress = progress('Seeding subjects', count($subjects), null);
        $progress->start();

        foreach ($subjects as $subjectData) {
            if (
                ! Arr::exists($subjectData, 'code') ||
                ! Arr::exists($subjectData, 'faculty')
            ) {
                $progress->advance();

                continue;
            }

            $subject = Subject::create([
                'code' => $subjectData['code'],
                'subject' => ['en' => $subjectData['subject']],
                'faculty' => ['en' => $subjectData['faculty']],
            ]);

            foreach ($subjectData['courses'] as $courseData) {
                if (is_null($courseData['description'])) {
                    continue;
                }

                $course = $subject->courses()->create(
                    Arr::whereNotNull(
                        Arr::only($courseData, [
                            'code',
                            'title',
                            'description',
                            'requirements',
                            'languages',
                            'units',
                        ])
                    )
                );

                $componentIds = collect(head($courseData['components']))
                    ->unique()
                    ->map(function ($value) {
                        $translatedComponents = [
                            'en' => __('course-components.'.$value, locale: 'en'),
                            'fr' => __('course-components.'.$value, locale: 'fr'),
                        ];

                        return CourseComponent::firstOrCreate([
                            'component' => json_encode($translatedComponents),
                        ])->id;
                    });

                $course->components()->attach($componentIds);
            }

            $progress->advance();
        }

        $progress->finish();

        foreach (Course::lazy() as $course) {
            if ($course->getRawOriginal('description')) {
                $course->description = Arr::map(
                    json_decode($course->getRawOriginal('description'), true),
                    fn (string $text) => static::addCourseLinks($text, $course->code),
                );
            }
            if ($course->getRawOriginal('requirements')) {
                $course->requirements = Arr::map(
                    json_decode($course->getRawOriginal('requirements'), true),
                    fn (string $text) => static::addCourseLinks($text, $course->code),
                );
            }
            $course->save();
        }

        $frenchSubjects = json_decode(Storage::disk('static')->get('subjects_fr.json'), true);
        foreach ($frenchSubjects as $subjectData) {
            if (
                ! Arr::exists($subjectData, 'code') ||
                ! Arr::exists($subjectData, 'faculty')
            ) {
                continue;
            }

            $subject = Subject::where('code', $subjectData['code'])->firstOrFail();
            $subject->subject = array_merge(
                json_decode($subject->getRawOriginal('subject'), true),
                ['fr' => $subjectData['subject']]
            );
            $subject->faculty = array_merge(
                json_decode($subject->getRawOriginal('faculty'), true),
                ['fr' => $subjectData['faculty']]
            );
            $subject->save();
        }
    }

    /**
     * Replaces course codes with markdown links to the course's page.
     */
    public static function addCourseLinks(string $text, string $courseCode): string
    {
        return str($text)->replaceMatches(
            '/[a-zA-Z]{3} ?\d{4,5}/',
            function (array $matches) use ($courseCode) {
                $code = str($matches[0])->lower()->remove(' ');
                $courseExists = Course::where('code', $code)->exists();

                if ($code != $courseCode && $courseExists) {
                    return "[$matches[0]](/course/$code)";
                } else {
                    return $matches[0];
                }
            }
        );
    }
}
