<?php

namespace App\Console\Commands;

use Database\Seeders\SurveySeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        $termDirectories = collect(['all', ...Storage::disk('scraped')->directories('surveys')])
            ->sort()
            ->values()
            ->toArray();

        $directory = $this->choice(
            'What term\'s surveys should be seeded?',
            $termDirectories,
        );

        if ($directory == 'all') {
            $directory = 'surveys';
        }

        $files = collect(Storage::disk('scraped')->allFiles($directory))
            ->filter(function (string $file) {
                return Str::endsWith($file, '.json') && !Str::endsWith($file, '.cache.json');
            });

        $this->withProgressBar($files, function (string $file) use ($surveySeeder) {
            $surveySeeder->run($file);
        });
    }
}
