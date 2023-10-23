<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Professor;
use App\Models\Survey;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;


class SurveySeeder extends Seeder
{
    public string $term = 'Winter 2023';

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $files = Storage::files("feedback/$this->term");

        foreach ($files as $file) {
            $feedbackData = Storage::json($file);

            $professor = Professor::firstOrCreate(['name' => $feedbackData['professor']]);

            $courses = collect();
            $courseSections = collect();
            foreach ($feedbackData['sections'] as ['code' => $code, 'section' => $section]) {
                $course = Course::firstWhere('code', $code);

                if (is_null($course))
                    continue;

                [$season, $year] = str($feedbackData['term'])->explode(' ');
                $season = ['Winter' => 'Hiver', 'Summer' => 'Été', 'Fall' => 'Automne'][$season];

                $courses->push($course);
                $courseSections->push($course->sections()->create([
                    'professor_id' => $professor->id,
                    'code' => Str::squish(Str::upper("$code $section")),
                    'section' => $section,
                    'term' => [
                        'en' => $feedbackData['term'],
                        'fr' => "$season $year"
                    ],
                ]));
            }

            $courses = $courses->unique('code');

            foreach ($feedbackData['surveys'] as $surveyData) {
                $questionType = config('survey.questions')[$surveyData['question']];
                $question = config('survey.equivalent_questions')[$surveyData['question']] ?? $surveyData['question'];

                if ($questionType == 'professor') {
                    $survey = $professor->surveys()->firstOrCreate(['question' => $question]);
                    SurveySeeder::updateSurvey($survey, $surveyData);
                } else if ($questionType == 'course') {
                    foreach ($courses as $course) {
                        $courseSurvey = $course->surveys()->firstOrCreate(['question' => $question]);
                        SurveySeeder::updateSurvey($courseSurvey, $surveyData);
                    }

                    foreach ($courseSections as $section) {
                        $sectionSurvey = $section->surveys()->firstOrCreate(['question' => $question]);
                        SurveySeeder::updateSurvey($sectionSurvey, $surveyData);
                    }
                }
            }
        }
    }

    /**
     * Updates the given survey with more data.
     */
    public static function updateSurvey(Survey $survey, array $surveyData): void
    {
        $options = $survey->options ?? [];
        foreach ($surveyData['options'] as $option) {
            $options[$option['description']] = ($options[$option['description']] ?? 0) + $option['responses'];
        }

        $survey->total_responses += $surveyData['total_responses'];
        $survey->options = $options;

        $survey->save();
    }
}
