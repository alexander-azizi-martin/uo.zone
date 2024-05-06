<?php

namespace Database\Seeders;

use App\Models\Course\Course;
use App\Models\Professor\Professor;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class SurveySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(string $file): void
    {
        Professor::disableSearchSyncing();

        $surveyData = json_decode(Storage::disk('static')->get($file), true);

        [$season, $year] = str($surveyData['term'])->explode(' ');
        $seasonId = ['Winter' => 0, 'Summer' => 1, 'Fall' => 2][$season];
        $termId = (intval($year) * 10) + $seasonId;

        $professor = Professor::firstOrCreate(['name' => $surveyData['professor']]);

        $courses = collect();
        $courseSections = collect();
        foreach ($surveyData['courses'] as ['code' => $code, 'section' => $section]) {
            $course = Course::firstWhere('code', str($code)->lower());

            if (is_null($course)) {
                continue;
            }

            $courseSection = $course->sections()->firstOrCreate([
                'section' => $section,
                'term_id' => $termId,
            ]);
            $courseSection->professors()->attach($professor->id);

            $courses->push($course);
            $courseSections->push($courseSection);
        }

        if (! array_key_exists('questions', $surveyData)) {
            return;
        }

        $courses = $courses->unique('code');

        foreach ($surveyData['questions'] as $questionData) {
            $question = __('survey-questions.'.$questionData['question'], locale: 'en');
            $questionType = config('survey.questions')[$question];

            switch ($questionType) {
                case 'professor':
                    static::updateQuestion($professor, $questionData);
                    break;
                case 'course':
                    foreach ($courses as $course) {
                        static::updateQuestion($course, $questionData);
                    }
                    foreach ($courseSections as $section) {
                        static::updateQuestion($section, $questionData);
                    }
                    break;
            }
        }
    }

    /**
     * Updates the given survey question with more data.
     */
    public static function updateQuestion(Model $surveyable, mixed $questionData): void
    {
        $translatedQuestion = [
            'en' => __('survey-questions.'.$questionData['question'], locale: 'en'),
            'fr' => __('survey-questions.'.$questionData['question'], locale: 'fr'),
        ];

        $question = $surveyable->survey()->firstOrCreate([
            'question' => json_encode($translatedQuestion),
        ]);

        foreach ($questionData['options'] as $option) {
            $translatedResponse = [
                'en' => __('survey-responses.'.$option['description'], locale: 'en'),
                'fr' => __('survey-responses.'.$option['description'], locale: 'fr'),
            ];

            $response = $question->responses()->firstOrCreate([
                'response' => json_encode($translatedResponse),
            ]);

            $response->num_responses += $option['responses'];
            $response->save();

            $question->total_responses += $option['responses'];
        }

        $question->save();
    }
}
