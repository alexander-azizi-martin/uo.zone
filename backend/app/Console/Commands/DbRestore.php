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
                            {--download : Whether the dump is downloaded from s3}
                            {--file= : File to use as database dump}';

    /**
     * The console command description.
     */
    protected $description = 'Restores the database from a dump';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filename = 'db_dump';
        $filepath = storage_path("app/$filename");
        $pgsqlConfig = config('database.connections.pgsql');

        if (!is_null($this->option('file'))) {
            $db_dump_file = fopen($this->option('file'), 'rb');
            Storage::disk('local')->put($filename, $db_dump_file);
        } else if ($this->option('download')) {
            $db_dump_file = Storage::disk('s3')->readStream($filename);
            Storage::disk('local')->put($filename, $db_dump_file);
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
        $process->run();
    }
}
