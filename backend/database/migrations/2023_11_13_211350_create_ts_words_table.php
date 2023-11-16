<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ts_words', function (Blueprint $table) {
            $table->string('word');
            $table->string('language');
            $table->primary(['word', 'language']);
        });

        DB::unprepared('
            DROP EXTENSION IF EXISTS pg_trgm;
            CREATE EXTENSION pg_trgm;

            CREATE INDEX ts_words_idx ON ts_words USING GIN (word gin_trgm_ops);
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ts_words');
        DB::unprepared('DROP EXTENSION IF EXISTS pg_trgm;');
    }
};
