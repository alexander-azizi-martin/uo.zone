<?php

namespace Database\Seeders;

use App\Models\Professor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class RmpSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $reviews = Storage::disk('static')->json('rmp.json');

        foreach ($reviews as $review) {
            $professor = Professor::firstWhere('name', $review['name']);

            if (! isset($professor)) {
                continue;
            }

            $professor->rmpReview()->updateOrCreate(Arr::except($review, ['name']));
        }
    }
}
