<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\spin;

class DbRestore extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'db:restore
                            {--s3 : Whether the database dump is downloaded from s3}
                            {--file= : File to use as database dump}';

    /**
     * The console command description.
     */
    protected $description = 'Restore database from dump file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dbDumpFilename = 'dump.sql';
        $dbDumpFilepath = database_path($dbDumpFilename);

        if (! is_null($this->option('file'))) {
            $success = spin(
                function () use ($dbDumpFilename) {
                    $compressedFile = fopen($this->option('file'), 'r');

                    return Storage::disk('database')->put($dbDumpFilename, $compressedFile);
                },
                "Downloading the compressed database dump from {$this->option('file')}."
            );
        } elseif ($this->option('s3')) {
            $success = spin(
                function () use ($dbDumpFilename) {
                    $compressedFile = Storage::disk('s3')->readStream($dbDumpFilename.'.gz');

                    return Storage::disk('database')->put($dbDumpFilename, $compressedFile);
                },
                'Downloading the compressed database dump from s3.'
            );
        }

        if (isset($success)) {
            if ($success) {
                $this->info('Successfully downloaded the compressed database dump.');
            } else {
                $this->error('Something went wrong while downloading the compressed dump database.');
            }
        }

        if (! file_exists($dbDumpFilepath)) {
            $this->error('The database dump could not be found.');

            return;
        }

        spin(
            function () use ($dbDumpFilepath) {
                Process::run([
                    'gzip',
                    '--force',
                    '--keep',
                    '--decompress',
                    $dbDumpFilepath.'.gz',
                ])->throw();
            },
            'Decompressing the database dump.',
        );
        $this->info('Successfully decompressed the database dump.');

        spin(
            function () use ($dbDumpFilepath) {
                $connection = config('database.connections.mysql');

                $databaseDump = fopen($dbDumpFilepath, 'r');

                Process::input($databaseDump)->run([
                    'mysql',
                    "--host={$connection['host']}",
                    "--user={$connection['username']}",
                    "--password={$connection['password']}",
                    $connection['database'],
                ]);
            },
            'Restoring the database from dump file.',
        );
        $this->info('Successfully restored the database from dump file.');
    }
}
