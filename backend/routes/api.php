<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\ProfessorController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SubjectController;
use Illuminate\Http\Request;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/courses/{code}', [CourseController::class, 'getCourse']);

Route::get('/subjects/{code}', [SubjectController::class, 'getSubject']);

Route::get('/professors/{id}', [ProfessorController::class, 'getProfessor']);

Route::get('/search', [SearchController::class, 'search']);
