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
    protected $signature = 'db:dump {--upload : Whether the dump is uploaded to s3}';

    /**
     * The console command description.
     */
    protected $description = 'Creates a database dump';

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
        $process->run();

        if ($this->argument('upload')) {
            $db_dump_file = new File($filepath);
            Storage::disk('s3')->put($filename, $db_dump_file);
        }
    }
}
