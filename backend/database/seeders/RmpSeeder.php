<?php

namespace Database\Seeders;

use App\Models\Professor\Professor;
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
        $reviews = json_decode(Storage::disk('static')->get('rmp.json'), true);

        foreach ($reviews as $review) {
            $professor = Professor::firstWhere('name', $review['name']);

            if (! isset($professor)) {
                continue;
            }

            $professor->rmpReview()->updateOrCreate(
                Arr::except($review, ['name'])
            );
        }
    }
}
