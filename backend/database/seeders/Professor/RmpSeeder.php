<?php

namespace Database\Seeders\Professor;

use App\Models\Professor\Professor;
use Database\Seeders\CollectionSeeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class RmpSeeder extends CollectionSeeder
{
    public function loadCollection(): array
    {
        return json_decode(Storage::disk('static')->get('rmp.json'), true);
    }

    public function seedItem(mixed $review): void
    {
        $professor = Professor::firstWhere('name', $review['name']);

        if (is_null($professor)) {
            return;
        }

        $professor->rmpReview()->upsert(
            ['professor_id' => $professor->id, ...Arr::except($review, ['name'])],
            ['professor_id']
        );
    }
}
