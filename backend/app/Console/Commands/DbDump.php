<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\spin;

class DbDump extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'db:dump
                            {--s3 : Upload the database dump to s3}';

    /**
     * The console command description.
     */
    protected $description = 'Dump the database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dbDumpFilename = 'dump.sql';
        $dbDumpFilepath = database_path($dbDumpFilename);

        spin(
            function () use ($dbDumpFilename) {
                $connection = config('database.connections.mysql');
                $dbDump = Process::run([
                    'mysqldump',
                    '--add-drop-table',
                    '--extended-insert',
                    "--host={$connection['host']}",
                    "--user={$connection['username']}",
                    "--password={$connection['password']}",
                    $connection['database'],
                ])->throw()->output();

                Storage::disk('database')->put($dbDumpFilename, $dbDump);
            },
            'Dumping the database.',
        );
        $this->info('Successfully dumped the database.');

        spin(
            function () use ($dbDumpFilepath) {
                Process::run([
                    'gzip',
                    '--force',
                    '--keep',
                    '--best',
                    $dbDumpFilepath,
                ])->throw();
            },
            'Compressing the database dump.',
        );
        $this->info('Successfully compressed the database dump.');

        if ($this->option('s3')) {
            $success = spin(
                function () use ($dbDumpFilename, $dbDumpFilepath) {
                    $archive_file = fopen($dbDumpFilepath.'.gz', 'rb');

                    return Storage::disk('s3')->put($dbDumpFilename.'.gz', $archive_file, 'public');
                },
                'Uploading the compressed database dump to s3.',
            );

            if ($success) {
                $this->info('Successfully uploaded the compressed database dump.');
            } else {
                $this->error('Something went wrong while uploading the compressed database dump.');
            }
        }
    }

    private function dumpDatabase()
    {

    }

    private function compressedDatabaseDump()
    {

    }

    private function uploadDatabaseDump()
    {

    }
}
