<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class SubjectSeeder extends CollectionSeeder
{
    public function loadCollection(): array
    {
        Subject::disableSearchSyncing();

        $englishSubjects = collect(json_decode(Storage::disk('static')->get('subjects_en.json'), true))
            ->filter(fn ($subject) => Arr::has($subject, ['code', 'faculty']))
            ->map(function ($subject) {
                return Arr::whereNotNull([
                    'code' => $subject['code'],
                    'faculty' => ['en' => $subject['faculty']],
                    'title' => ['en' => $subject['subject']],
                ]);
            })
            ->keyBy('code');

        $frenchSubjects = collect(json_decode(Storage::disk('static')->get('subjects_fr.json'), true))
            ->filter(fn ($subject) => Arr::has($subject, ['code', 'faculty']))
            ->map(function ($subject) {
                return Arr::whereNotNull([
                    'code' => $subject['code'],
                    'faculty' => ['fr' => $subject['faculty']],
                    'title' => ['fr' => $subject['subject']],
                ]);
            })
            ->keyBy('code');

        return $englishSubjects->mergeRecursive($frenchSubjects)->all();
    }

    public function seedItem(mixed $subjectData): void
    {
        $subjectData['code'] = head(Arr::wrap($subjectData['code']));
        $subjectData['faculty'] = json_encode($subjectData['faculty']);
        $subjectData['title'] = json_encode($subjectData['title']);

        Subject::upsert($subjectData, ['code']);
    }
}
