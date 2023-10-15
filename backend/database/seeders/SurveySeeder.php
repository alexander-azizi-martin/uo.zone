<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\Professor;
use App\Models\Survey;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
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

            $courseSections = collect();
            foreach ($feedbackData['sections'] as ['code' => $code, 'section' => $section]) {
                $course = Course::firstWhere('code', $code);

                if (is_null($course))
                    continue;
                
                $courseSections->push($course->sections()->create([
                    'professor_id' => $professor->id,
                    'code' => Str::squish(Str::upper("$code $section")),
                    'term' => $feedbackData['term'],
                ]));
            }

            foreach ($feedbackData['surveys'] as $surveyData) {
                $questionType = config('survey.questions')[$surveyData['question']];
                $question = config('survey.equivalent_questions')[$surveyData['question']] ?? $surveyData['question'];

                if ($questionType == 'professor') {
                    $survey = $professor->surveys()->firstOrCreate(['question' => $question]);
                    SurveySeeder::updateSurvey($survey, $surveyData);
                } else if ($questionType == 'course') {
                    $courseSections->map(function (CourseSection $section) use ($surveyData, $question) {
                        $survey = $section->surveys()->firstOrCreate(['question' => $question]);
                        SurveySeeder::updateSurvey($survey, $surveyData);
                    });
                }
            }
        }
    }

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
