<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfessorController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SubjectController;
use Illuminate\Support\Facades\Route;

Route::controller(CourseController::class)->group(function () {
    Route::get('/courses', 'getAllCourses')->middleware('throttle:list-all');
    Route::get('/courses/{course}', 'getCourse');
    Route::get('/courses/{course}/professors', 'getCourseProfessors');
    Route::get('/courses/{course}/survey', 'getCourseSurvey');
});

Route::controller(SubjectController::class)->group(function () {
    Route::get('/subjects', 'getAllSubjects')->middleware('throttle:list-all');
    Route::get('/subjects/{subject}', 'getSubject');
    Route::get('/subjects/{subject}/courses', 'getSubjectCourses');
});

Route::controller(ProfessorController::class)->group(function () {
    Route::get('/professors', 'getAllProfessors')->middleware('throttle:list-all');
    Route::get('/professors/{professor}', 'getProfessor');
    Route::get('/professors/{professor}/courses', 'getProfessorCourses');
    Route::get('/professors/{professor}/survey', 'getProfessorSurvey');
});

Route::post('/search', [SearchController::class, 'search']);
