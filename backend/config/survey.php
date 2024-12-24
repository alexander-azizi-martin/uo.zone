<?php

use App\Models\Course;
use App\Models\Professor\Professor;

return [
    'questions' => [
        'For your program, this course is' => Course::class,
        'What is the percentage of classes you attended' => Course::class,
        'How did the teaching modality (in class, online, blended) impact your learning' => Course::class,
        'I find the professor well prepared for class' => Professor::class,
        'The professor\'s teaching is stimulating' => Professor::class,
        'The course is well organized' => Course::class,
        'I think the professor conveys the subject matter effectively' => Professor::class,
        'The professor is available to address questions outside of class' => Professor::class,
        'The professor\'s expectations of students for this course are clear' => Professor::class,
        'Assignments and/or exams closely reflect what is covered in class' => Course::class,
        'The professor\'s feedback on assignments and/or exams is' => Professor::class,
        'I find that the professor as a teacher is' => Professor::class,
        'I have learned a lot in this course' => Course::class,
        'In comparison with my other courses, the workload for this course is' => Course::class,
        'Overall, I find this course' => Course::class,
        'I would recommend this course to another student' => Course::class,
        'Course expectations are clearly explained' => Course::class,
        'Instructions for completing activities and assignments are clear' => Professor::class,
        'The professor\'s feedback contributes to my learning' => Professor::class,
        'The teaching and learning methods used in the course facilitated my learning' => Professor::class,
        'The professor shows respect towards the students' => Professor::class,
        'I believe that I can apply the knowledge and skills that I acquired in this course outside of the classroom' => Course::class,
    ],
];
