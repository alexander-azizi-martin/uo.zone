<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class DbCompress extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'db:compress
                            {--s3 : Whether the compressed database is uploaded to s3}';

    /**
     * The console command description.
     */
    protected $description = 'Compress the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $databaseFilename = 'database.sqlite';
        $databaseFilepath = database_path($databaseFilename);
        $archiveFilename = pathinfo($databaseFilename)['filename'] . '.tar.xz';
        $archiveFilepath = database_path($archiveFilename);

        $this->info('Compressing the database.');

        $process = new Process([
            'tar',
            '-cJf',
            $archiveFilepath,
            $databaseFilepath,
        ]);
        $process->mustRun();
        $this->

        if ($this->option('s3')) {
            $this->info('Uploading the compressed database to s3.');

            $archive_file = fopen($archiveFilepath, 'rb');
            $success = Storage::disk('s3')->put($archiveFilename, $archive_file);

            if ($success) {
                $this->info('Successfully uploaded the compressed database.');
            } else {
                $this->error('Something went wrong while uploading the compressed database.');
            }
        }
    }
}
