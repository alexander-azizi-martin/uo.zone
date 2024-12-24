<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\spin;

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
        $archiveFilename = pathinfo($databaseFilename)['filename'].'.tar.xz';
        $archiveFilepath = database_path($archiveFilename);

        if (! file_exists($databaseFilepath)) {
            $this->error('The database file could not be found.');

            return;
        }

        $compressDB = Process::command([
            'tar',
            '-cJf',
            $archiveFilepath,
            $databaseFilepath,
        ]);

        spin(fn () => $compressDB->run()->throw(), 'Compressing the database.');

        $this->info('Successfully compressed the database.');

        if ($this->option('s3')) {
            $success = spin(
                function () use ($archiveFilename, $archiveFilepath) {
                    $archiveFile = fopen($archiveFilepath, 'rb');

                    return Storage::disk('s3')->put($archiveFilename, $archiveFile, 'public');
                },
                'Uploading the compressed database to s3.',
            );

            if ($success) {
                $this->info('Successfully uploaded the compressed database.');
            } else {
                $this->error('Something went wrong while uploading the compressed database.');
            }
        }
    }
}
