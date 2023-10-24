<?php

namespace App\Console\Commands;

use Database\Seeders\SurveySeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class TermFeedback extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'app:feedback';

    /**
     * The console command description.
     */
    protected $description = 'Seeds course surveys for a particular term.';

    /**
     * Execute the console command.
     */
    public function handle(SurveySeeder $surveySeeder)
    {
        $termDirectories = collect(['feedback', ...Storage::directories('feedback')])
            ->sort()
            ->values()
            ->toArray();

        $directory = $this->choice(
            'What term\'s surveys should be seeded?',
            $termDirectories,
        );

        $files = Storage::allFiles($directory);
        $this->withProgressBar($files, function (string $file) use ($surveySeeder) {
            $surveySeeder->run($file);
        });
    }
}
