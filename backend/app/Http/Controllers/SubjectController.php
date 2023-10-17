<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Support\Str;

class SubjectController extends Controller
{
    public function getSubject(string $code)
    {
        $subject = Subject::with('courses')
            ->where('code', Str::upper($code))
            ->firstOrFail();
        
        return new SubjectResource($subject);
    }
}
