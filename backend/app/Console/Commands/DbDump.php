<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Http\File;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class DbDump extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'db:dump {--s3 : Whether the dump is uploaded to s3}';

    /**
     * The console command description.
     */
    protected $description = 'Create a database dump';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filename = 'db_dump';
        $filepath = storage_path("app/$filename");
        $pgsqlConfig = config('database.connections.pgsql');

        $process = new Process([
            'pg_dump',
            '--format=c',
            "--file=$filepath",
            '--verbose',
            "--dbname={$pgsqlConfig['database']}",
            "--host={$pgsqlConfig['host']}",
            "--port={$pgsqlConfig['port']}",
            "--username={$pgsqlConfig['username']}",
        ]);

        $process->setEnv(['PGPASSWORD' => $pgsqlConfig['password']]);
        $process->setTty(true);
        $process->mustRun();

        if ($this->option('s3')) {
            $this->info('Uploading the database dump to s3.');

            $db_dump_file = fopen($filepath, 'rb');
            $success = Storage::disk('s3')->put($filename, $db_dump_file);

            if ($success)
                $this->info('Successfully uploaded the database dump.');
            else
                $this->error('Something went wrong while uploading the database dump.');
        }
    }
}
