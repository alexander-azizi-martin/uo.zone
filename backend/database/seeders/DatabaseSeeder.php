<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SubjectSeeder::class,
            Course\CourseSeeder::class,
            Course\CourseLinkSeeder::class,
            Course\EquivalentCourseSeeder::class,
            CourseSection\CourseSectionSeeder::class,
            CourseSection\CourseSectionGradeSeeder::class,
        ]);
    }
}
