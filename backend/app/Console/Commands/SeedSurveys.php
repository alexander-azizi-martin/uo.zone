<?php

namespace App\Console\Commands;

use Database\Seeders\SurveySeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use function Laravel\Prompts\multiselect;
use function Laravel\Prompts\progress;

class SeedSurveys extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'db:seed-surveys';

    /**
     * The console command description.
     */
    protected $description = 'Seed the database with course surveys from a particular term';

    /**
     * Execute the console command.
     */
    public function handle(SurveySeeder $surveySeeder)
    {
        $directories = collect(Storage::disk('static')->directories('surveys'))
            ->sort()
            ->values()
            ->toArray();

        $selectedDirectories = multiselect(
            'What term\'s surveys should be seeded?',
            $directories,
            required: true,
        );

        $files = collect($selectedDirectories)
            ->flatMap(function ($directory) {
                return Storage::disk('static')->allFiles($directory);
            })
            ->filter(function (string $file) {
                return Str::endsWith($file, '.json') && ! Str::endsWith($file, '.cache.json');
            });

        progress(
            'Seeding surveys',
            $files,
            fn ($file) => $surveySeeder->run($file),
        );
    }
}
