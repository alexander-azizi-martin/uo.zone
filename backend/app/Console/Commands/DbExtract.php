<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

use function Laravel\Prompts\spin;

class DbExtract extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'db:extract
                            {--s3 : Whether the compressed database is downloaded from s3}
                            {--file= : File to use as compressed database}';

    /**
     * The console command description.
     */
    protected $description = 'Extract the database from compressed file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $databaseFilename = 'database.sqlite';
        $archiveFilename = pathinfo($databaseFilename)['filename'].'.tar.xz';
        $archiveFilepath = database_path($archiveFilename);

        if (! is_null($this->option('file'))) {
            $success = spin(
                function () use ($archiveFilename) {
                    $compressed_file = fopen($this->option('file'), 'rb');

                    return Storage::disk('database')->put($archiveFilename, $compressed_file);
                },
                "Downloading the compressed database from {$this->option('file')}."
            );
        } elseif ($this->option('s3')) {
            $success = spin(
                function () use ($archiveFilename) {
                    $compressed_file = Storage::disk('s3')->readStream($archiveFilename);

                    return Storage::disk('database')->put($archiveFilename, $compressed_file);
                },
                'Downloading the database from s3.'
            );
        }

        if (isset($success)) {
            if ($success) {
                $this->info('Successfully downloaded the compressed database.');
            } else {
                $this->error('Something went wrong while downloading the compressed database.');
            }
        }

        if (! file_exists($archiveFilepath)) {
            $this->error('The compressed database could not be found.');

            return;
        }

        spin(
            function () use ($archiveFilepath) {
                $numPathComponents = str($archiveFilepath)->explode('/')->count() - 2;
                $process = new Process([
                    'tar',
                    '-xf',
                    $archiveFilepath,
                    '-C',
                    database_path(),
                    "--strip-components=$numPathComponents",
                ]);
                $process->mustRun();
            },
            'Extracting the database.'
        );

        $this->info('Successfully extracted the compressed database.');
    }
}
