<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared("
            CREATE TABLE ts_synonyms (
                t tsquery PRIMARY KEY, 
                s tsquery
            );

            INSERT INTO ts_synonyms VALUES 
                ('1', '(1:*|i)'), 
                ('2', '(2:*|ii)'), 
                ('3', '(3:*|iii)'), 
                ('4', '(4:*|iv)'), 
                ('5', '(5:*|v)');
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TABLE IF EXISTS ts_synonyms;');
    }
};
