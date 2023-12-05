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
        $subjects = Storage::json('subjects_en.json');

        foreach ($subjects as $subjectData) {
            if (! Arr::exists($subjectData, 'code') || ! Arr::exists($subjectData, 'faculty')) {
                continue;
            }

            $subject = Subject::create(Arr::only($subjectData, ['code']));
            $subject->subject->addTranslation('en', $subjectData['subject']);
            $subject->faculty->addTranslation('en', $subjectData['faculty']);
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

                self::translateComponents($course);
            }
        }

        $frenchSubjects = Storage::json('subjects_fr.json');
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

    /**
     * Adds translations for the components of the given course.
     */
    public static function translateComponents(Course $course)
    {
        if (! $course->components->hasTranslation('en')) {
            $translatedComponents = [];

            foreach ($course->components->getTranslation('fr') as $component) {
                $translatedComponents[] = (
                    self::COMPONENT_FRENCH_TO_ENGLISH[$component] ?? $component
                );
            }

            $course->components->addTranslation('en', $translatedComponents);
        }

        if (! $course->components->hasTranslation('fr')) {
            $translatedComponents = [];

            foreach ($course->components->getTranslation('en') as $component) {
                $translatedComponents[] = (
                    self::COMPONENT_ENGLISH_TO_FRENCH[$component] ?? $component
                );
            }

            $course->components->addTranslation('fr', $translatedComponents);
        }

        $course->save();
    }
}
