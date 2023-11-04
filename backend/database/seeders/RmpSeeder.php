<?php

namespace Database\Seeders;

use App\Models\Professor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class RmpSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reviews = Storage::json("professors.json");

        foreach ($reviews as $review) {
            $professor = Professor::where('name', $review['name'])->first();

            if (!isset($professor)) continue;

            $professor->rmpReview()->updateOrCreate(Arr::except($review, ['name']));
        }
    }
}
