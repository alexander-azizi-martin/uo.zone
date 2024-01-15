<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfessorController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SubjectController;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::get('/courses', [CourseController::class, 'allCourses'])->middleware(ThrottleRequests::using('list-all'));
Route::get('/courses/{code}', [CourseController::class, 'getCourse']);

Route::get('/subjects', [SubjectController::class, 'allSubjects'])->middleware(ThrottleRequests::using('list-all'));
Route::get('/subjects/{code}', [SubjectController::class, 'getSubject']);

Route::get('/professors', [ProfessorController::class, 'allProfessors'])->middleware(ThrottleRequests::using('list-all'));
Route::get('/professors/{id}', [ProfessorController::class, 'getProfessor']);

Route::post('/search', [SearchController::class, 'search']);
