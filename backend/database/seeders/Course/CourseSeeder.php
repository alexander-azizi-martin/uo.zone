<?php

namespace Database\Seeders\Course;

use App\Models\Course;
use App\Models\Subject;
use Database\Seeders\CollectionSeeder;
use Illuminate\Support\Facades\Storage;

class CourseSeeder extends CollectionSeeder
{
    public function loadCollection(): array
    {
        Course::disableSearchSyncing();

        $subjectCodes = new \Ds\Set(Subject::pluck('code'));

        $courses = collect(json_decode(Storage::disk('static')->get('subjects_en.json'), true))
            ->filter(fn ($subject) => $subjectCodes->contains($subject['code'] ?? null))
            ->flatMap(function ($subject) {
                $courses = data_fill($subject['courses'], '*.subject_code', $subject['code']);

                return $courses;
            });

        return $courses->all();
    }

    public function seedItem(mixed $courseData): void
    {
        $translatedComponents = collect(head($courseData['components']))
            ->unique()
            ->map(fn ($component) => [
                'en' => __('course-components.'.$component, locale: 'en'),
                'fr' => __('course-components.'.$component, locale: 'fr'),
            ]);

        $courseData['title'] = json_encode($courseData['title']);
        $courseData['description'] = json_encode($courseData['description']);
        $courseData['requirements'] = json_encode($courseData['requirements']);
        $courseData['languages'] = json_encode($courseData['languages']);
        $courseData['components'] = json_encode([
            'en' => data_get($translatedComponents, '*.en'),
            'fr' => data_get($translatedComponents, '*.fr'),
        ]);

        Course::upsert($courseData, ['code']);
    }
}
