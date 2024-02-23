<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Professor;
use App\Models\SurveyQuestion;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SurveySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(string $file): void
    {
        $surveyData = Storage::disk('static')->json($file);

        $professor = Professor::firstOrCreate(['name' => $surveyData['professor']]);

        $courses = collect();
        $courseSections = collect();
        foreach ($surveyData['sections'] as ['code' => $code, 'section' => $section]) {
            $course = Course::firstWhere('code', $code);

            if (is_null($course)) {
                continue;
            }

            [$season, $year] = str($surveyData['term'])->explode(' ');
            $seasonId = [
                'Winter' => 0,
                'Summer' => 1,
                'Fall' => 2,
            ][$season];

            $courses->push($course);
            $courseSections->push($course->sections()->create([
                'professor_id' => $professor->id,
                'code' => Str::squish(Str::upper("$code $section")),
                'section' => $section,
                'term_id' => (intval($year) * 10) + $seasonId,
            ]));
        }

        $courses = $courses->unique('code');

        foreach ($surveyData['questions'] as $questionData) {
            $questionType = config('survey.questions')[$questionData['question']];
            $questionVal = config('survey.equivalent_questions')[$questionData['question']] ?? $questionData['question'];

            if ($questionType == 'professor') {
                $question = $professor->survey()->firstOrCreate(['question' => $questionVal]);
                SurveySeeder::updateQuestion($question, $questionData);
            } elseif ($questionType == 'course') {
                foreach ($courses as $course) {
                    $question = $course->survey()->firstOrCreate(['question' => $questionVal]);
                    SurveySeeder::updateQuestion($question, $questionData);
                }

                foreach ($courseSections as $section) {
                    $question = $section->survey()->firstOrCreate(['question' => $questionVal]);
                    SurveySeeder::updateQuestion($question, $questionData);
                }
            }
        }
    }

    /**
     * Updates the given survey question with more data.
     */
    public static function updateQuestion(SurveyQuestion $survey, array $surveyData): void
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
