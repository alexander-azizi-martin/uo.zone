<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfessorController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SubjectController;
use Illuminate\Support\Facades\Route;

Route::controller(CourseController::class)->group(function () {
    Route::get('/courses', 'allCourses')->middleware('throttle:list-all');
    Route::get('/courses/{course}', 'getCourse');
});

Route::controller(SubjectController::class)->group(function () {
    Route::get('/subjects', 'allSubjects')->middleware('throttle:list-all');
    Route::get('/subjects/{subject}', 'getSubject');
    Route::get('/subjects/{subject}/courses', 'getSubjectCourses');
});

Route::controller(ProfessorController::class)->group(function () {
    Route::get('/professors', 'allProfessors')->middleware('throttle:list-all');
    Route::get('/professors/{professor}', 'getProfessor');
});

Route::post('/search', [SearchController::class, 'search']);
