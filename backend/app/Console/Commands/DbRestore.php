<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class DbRestore extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'db:restore 
                            {--s3 : Whether the dump is downloaded from s3}
                            {--file= : File to use as database dump}';

    /**
     * The console command description.
     */
    protected $description = 'Restore the database from a dump';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filename = 'db_dump';
        $filepath = storage_path("app/$filename");
        $pgsqlConfig = config('database.connections.pgsql');

        if (!is_null($this->option('file'))) {
            $this->info("Downloading the database dump from {$this->option('file')}.");

            $db_dump_file = fopen($this->option('file'), 'rb');
            $success = Storage::disk('local')->put($filename, $db_dump_file);
        } else if ($this->option('s3')) {
            $this->info('Downloading the database dump from s3.');

            $db_dump_file = Storage::disk('s3')->readStream($filename);
            $success = Storage::disk('local')->put($filename, $db_dump_file);
        }

        if (isset($success)) {
            if ($success)
                $this->info('Successfully downloaded the database dump.');
            else
                $this->error('Something went wrong while downloading the database dump.');
        }

        if (!file_exists($filepath)) {
            $this->error('No database dump found.');
            return;
        }

        $process = new Process([
            'pg_restore',
            $filepath,
            '--jobs=4',
            '--format=c',
            '--verbose',
            '--clean',
            '--no-owner',
            "--dbname={$pgsqlConfig['database']}",
            "--host={$pgsqlConfig['host']}",
            "--port={$pgsqlConfig['port']}",
            "--username={$pgsqlConfig['username']}",
        ]);

        $process->setEnv(['PGPASSWORD' => $pgsqlConfig['password']]);
        $process->setTty(true);
        $process->mustRun();

        $this->exec(DbConfig::class);
    }
}
