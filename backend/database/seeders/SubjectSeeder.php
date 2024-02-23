<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Subject;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class SubjectSeeder extends Seeder
{
    const COMPONENT_ENGLISH_TO_FRENCH = [
        'Lecture' => 'Cours magistral',
        'Tutorial' => 'Tutoriel',
        'Discussion Group' => 'Groupe de discussion',
        'Laboratory' => 'Laboratoire',
        'Theory and Laboratory' => 'Théorie et laboratoire',
        'Research' => 'Recherche',
        'Certification Test' => 'Test de compétence',
        'Seminar' => 'Séminaire',
        'Work Term' => 'Stage',
    ];

    const COMPONENT_FRENCH_TO_ENGLISH = [
        'Cours magistral' => 'Lecture',
        'Tutoriel' => 'Tutorial',
        'Groupe de discussion' => 'Discussion Group',
        'Laboratoire' => 'Laboratory',
        'Théorie et laboratoire' => 'Theory and Laboratory',
        'Recherche' => 'Research',
        'Test de compétence' => 'Certification Test',
        'Séminaire' => 'Seminar',
        'Stage' => 'Work Term',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = Storage::disk('static')->json('subjects_en.json');

        foreach ($subjects as $subjectData) {
            if (! Arr::exists($subjectData, 'code') || ! Arr::exists($subjectData, 'faculty')) {
                continue;
            }

            $subject = Subject::create(Arr::only($subjectData, ['code']));
            $subject->subject->setTranslation('en', $subjectData['subject']);
            $subject->faculty->setTranslation('en', $subjectData['faculty']);
            $subject->save();

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
                            'components',
                            'requirements',
                            'languages',
                            'units',
                        ])
                    )
                );

                static::translateComponents($course);
            }
        }

        foreach (Course::lazy() as $course) {
            $course->description->mapTranslations(
                fn (string $text) => static::addCourseLinks($text, $course->code)
            );
            $course->requirements->mapTranslations(
                fn (string $text) => static::addCourseLinks($text, $course->code)
            );
            $course->save();
        }

        $frenchSubjects = Storage::disk('static')->json('subjects_fr.json');
        foreach ($frenchSubjects as $subjectData) {
            if (! Arr::exists($subjectData, 'code') || ! Arr::exists($subjectData, 'faculty')) {
                continue;
            }

            $subject = Subject::where('code', $subjectData['code'])->firstOrFail();
            $subject->subject->setTranslation('fr', $subjectData['subject']);
            $subject->faculty->setTranslation('fr', $subjectData['faculty']);
            $subject->save();
        }
    }

    /**
     * Replaces course codes with markdown links to the course's page.
     */
    public static function addCourseLinks(string $text, string $courseCode): string
    {
        return str($text)
            ->replaceMatches('/[a-zA-Z]{3} ?\d{4,5}/', function (array $matches) use ($courseCode) {
                $code = str($matches[0])->lower()->remove(' ');

                if ($code != $courseCode && ! is_null(Course::firstWhere('code', $code))) {
                    return "[$matches[0]](/course/$code)";
                } else {
                    return $matches[0];
                }
            });
    }

    /**
     * Adds translations for the components of the given course.
     */
    public static function translateComponents(Course $course): void
    {
        if (! $course->components->hasLanguage('en')) {
            $translatedComponents = [];

            foreach ($course->components->getTranslation('fr') as $component) {
                $translatedComponents[] = (
                    self::COMPONENT_FRENCH_TO_ENGLISH[$component] ?? $component
                );
            }

            $course->components->setTranslation('en', $translatedComponents);
        }

        if (! $course->components->hasLanguage('fr')) {
            $translatedComponents = [];

            foreach ($course->components->getTranslation('en') as $component) {
                $translatedComponents[] = (
                    self::COMPONENT_ENGLISH_TO_FRENCH[$component] ?? $component
                );
            }

            $course->components->setTranslation('fr', $translatedComponents);
        }

        $course->save();
    }
}
