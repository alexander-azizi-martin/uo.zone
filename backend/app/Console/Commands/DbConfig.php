<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DbConfig extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'db:config';

    /**
     * The console command description.
     */
    protected $description = 'Copy config files to database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::unprepared("
            DO $$
            DECLARE
                file record;
            BEGIN
                FOR file IN (SELECT * FROM pg_config_files)
                LOOP
                    EXECUTE format('
                        COPY (SELECT data FROM pg_config_files WHERE path = ''%1\$s'') 
                        TO ''%1\$s''
                        (header FALSE)
                    ', file.path);
                END LOOP;
            END;
            $$ LANGUAGE plpgsql;
        ");
    }
}
