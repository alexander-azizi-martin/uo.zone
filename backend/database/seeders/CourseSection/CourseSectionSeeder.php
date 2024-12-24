<?php

namespace Database\Seeders\CourseSection;

use App\Models\Course;
use App\Models\CourseSection\CourseSection;
use App\Models\Professor\Professor;
use Database\Seeders\CollectionSeeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use function Laravel\Prompts\multiselect;

class CourseSectionSeeder extends CollectionSeeder
{
    private \Ds\Set $courses;

    public function loadCollection(): array
    {
        Professor::disableSearchSyncing();

        $this->courses = new \Ds\Set(Course::pluck('code'));

        $directories = collect(Storage::disk('static')->directories('surveys'))
            ->sort()
            ->values()
            ->toArray();

        $selectedDirectories = multiselect(
            'What term\'s surveys should be seeded?',
            $directories,
        );

        $files = collect($selectedDirectories)
            ->flatMap(function ($directory) {
                return Storage::disk('static')->allFiles($directory);
            })
            ->filter(function (string $file) {
                return Str::endsWith($file, '.json') && ! Str::endsWith($file, '.cache.json');
            });

        return $files->all();
    }

    public function seedItem(mixed $file): void
    {
        $courseSectionSurveyData = json_decode(Storage::disk('static')->get($file), true);

        $professor = Professor::firstOrCreate(['name' => $courseSectionSurveyData['professor']]);

        [$season, $year] = str($courseSectionSurveyData['term'])->explode(' ');
        $seasonId = ['Winter' => 0, 'Summer' => 1, 'Fall' => 2][$season];
        $termId = (intval($year) * 10) + $seasonId;

        foreach ($courseSectionSurveyData['courses'] as ['code' => $code, 'section' => $section]) {
            $courseCode = str($code)->lower();
            $subjectCode = $courseCode->take(3);

            $courseSectionId = CourseSection::hashId([
                'course_code' => $courseCode,
                'section' => $section,
                'term_id' => $termId,
            ]);

            if (! $this->courses->contains($courseCode->toString())) {
                continue;
            }

            CourseSection::upsert(
                [
                    'id' => $courseSectionId,
                    'course_code' => $courseCode,
                    'subject_code' => $subjectCode,
                    'section' => $section,
                    'term_id' => $termId,
                ],
                ['id']
            );

            DB::table('course_section_professor')->upsert(
                ['course_section_id' => $courseSectionId, 'professor_id' => $professor->id],
                ['course_section_id', 'professor_id']
            );

            if (! array_key_exists('questions', $courseSectionSurveyData)) {
                return;
            }

            foreach ($courseSectionSurveyData['questions'] as $questionData) {
                $translatedQuestion = [
                    'en' => __('survey-questions.'.$questionData['question'], locale: 'en'),
                    'fr' => __('survey-questions.'.$questionData['question'], locale: 'fr'),
                ];

                $questionType = config('survey.questions')[$translatedQuestion['en']];

                $responses = collect($questionData['responses']);
                $options = $responses->pluck('description', 'label');
                $translatedOptions = [
                    'en' => $options->mapWithKeys(
                        function (string $response, string $label) {
                            return [
                                Str::upper($label) => __('survey-responses.'.$response, locale: 'en'),
                            ];
                        }
                    ),
                    'fr' => $options->mapWithKeys(
                        function (string $response, string $label) {
                            return [
                                Str::upper($label) => __('survey-responses.'.$response, locale: 'fr'),
                            ];
                        }
                    ),
                ];

                DB::table('course_section_survey_responses')->upsert(
                    [
                        'course_section_id' => $courseSectionId,
                        'question' => json_encode($translatedQuestion),
                        'question_type' => $questionType,
                        'options' => json_encode($translatedOptions),
                        ...$responses->pluck('num_responses', 'label'),
                    ],
                    ['course_section_id', 'question']
                );
            }
        }
    }
}
