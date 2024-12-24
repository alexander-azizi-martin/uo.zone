<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

use function Laravel\Prompts\progress;

abstract class CollectionSeeder extends Seeder
{
    private string $progressLabel = '';

    /**
     * Run the database seeds.
     */
    public function run()
    {
        $collection = $this->loadCollection();

        DB::transaction(function () use ($collection) {
            progress(
                label: $this->progressLabel,
                steps: $collection,
                callback: fn ($item) => $this->seedItem($item)
            );
        });
    }

    abstract public function loadCollection(): array;

    abstract public function seedItem(mixed $item): void;
}
