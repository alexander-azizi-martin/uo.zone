<?php

namespace Database\Seeders\Course;

use App\Models\Course;
use Database\Seeders\CollectionSeeder;
use Illuminate\Support\Arr;

class CourseLinkSeeder extends CollectionSeeder
{
    private \Ds\Set $courses;

    public function loadCollection(): array
    {
        Course::disableSearchSyncing();

        $this->courses = new \Ds\Set(Course::pluck('code'));

        return Course::all()->all();
    }

    public function seedItem(mixed $course): void
    {
        if ($course->getRawOriginal('description') !== 'null') {
            $course->description = Arr::map(
                json_decode($course->getRawOriginal('description'), true),
                fn (string $text) => $this->addCourseLinks($text, $course->code),
            );
        }
        if ($course->getRawOriginal('requirements') !== 'null') {
            $course->requirements = Arr::map(
                json_decode($course->getRawOriginal('requirements'), true),
                fn (string $text) => $this->addCourseLinks($text, $course->code),
            );
        }
        $course->save();
    }

    /**
     * Replaces course codes with markdown links to the course's page.
     */
    public function addCourseLinks(string $text, string $courseCode): string
    {
        return str($text)->replaceMatches(
            '/(?<!\[)[a-zA-Z]{3} ?\d{4,5}(?!\])/',
            function (array $matches) use ($courseCode) {
                $code = str($matches[0])->lower()->remove(' ')->toString();
                $courseExists = $this->courses->contains($code);

                if ($code != $courseCode && $courseExists) {
                    return "[$matches[0]](/course/$code)";
                } else {
                    return $matches[0];
                }
            }
        );
    }
}
