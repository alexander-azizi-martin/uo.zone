<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\JsonResponse;

class SubjectController extends Controller
{
    public function getSubject(string $code): JsonResponse
    {
        $subject = Subject::where('code', $code)->firstOrFail();
        $subject->incrementViewCount();

        return response()->json($subject->toArray());
    }
}
