<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;

class SubjectController extends Controller
{
    public function allSubjects(Request $request): JsonResponse
    {
        $limiterKey = 'all-subjects:' . $request->ip;
        abort_if(
            RateLimiter::tooManyAttempts($limiterKey, 5),
            429,
            'To many requests to /api/subjects'
        );
        RateLimiter::hit($limiterKey, 60);

        if (!Cache::has('subjects')) {
            $subjects = Subject::cursor()->pluck('code')->all();
            Cache::put('subjects', $subjects);
        }

        return response()->json(Cache::get('subjects'));
    }

    public function getSubject(string $code)
    {
        $subject = Subject::with('courses')
            ->where('code', Str::lower($code))
            ->firstOrFail();

        return new SubjectResource($subject);
    }
}
