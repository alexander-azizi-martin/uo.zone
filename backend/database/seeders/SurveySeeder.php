<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\Professor;
use App\Models\Survey;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;


class SurveySeeder extends Seeder
{
    public const SURVEY_QUESTIONS = [
        'For your program, this course is' => 'course',
        'What is the percentage of classes you attended?' => 'course',
        'How did the teaching modality (in class, online, blended) impact your learning?' => 'course',
        'I find the professor well prepared for class' => 'professor',
        'The course is well organized.' => 'course',
        'Course expectations are clearly explained.' => 'course',
        'I think the professor conveys the subject matter effectively' => 'professor',
        'Instructions for completing activities and assignments are clear.' => 'course',
        'The professors feedback contributes to my learning.' => 'professor',
        'The teaching and learning methods used in the course facilitated my learning.' => 'professor',
        'Assignments and/or exams closely reflect what is covered in class.' => 'course',
        'I find that the professor as a teacher is' => 'professor',
        'The professor is available to address questions outside of class.' => 'professor',
        'The professor shows respect towards the students.' => 'professor',
        'I have learned a lot in this course.' => 'course',
        'I believe that I can apply the knowledge and skills that I acquired in this course outside of the classroom.' => 'course',
    ];

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
            foreach ($feedbackData['codes'] as $courseCode) {
                $course = Course::firstWhere('code', $courseCode);

                if (is_null($course))
                    continue;

                $courseSections->push($course->sections()->create([
                    'professor_id' => $professor->id,
                    'code' => $courseCode,
                    'term' => $feedbackData['term'],
                ]));
            }

            foreach ($feedbackData['surveys'] as $surveyData) {
                $questionType = SurveySeeder::SURVEY_QUESTIONS[$surveyData['question']];

                if ($questionType == 'professor') {
                    $survey = $professor->surveys()->firstOrCreate(Arr::only($surveyData, ['question']));
                    SurveySeeder::updateSurvey($survey, $surveyData);
                } else if ($questionType == 'course') {
                    $courseSections->map(function (CourseSection $section) use ($surveyData) {
                        $survey = $section->surveys()->firstOrCreate(Arr::only($surveyData, ['question']));
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
