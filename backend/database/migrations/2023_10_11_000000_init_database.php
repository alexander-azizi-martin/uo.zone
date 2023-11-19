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
            PRAGMA journal_mode=WAL;
            PRAGMA synchronous=NORMAL;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
    }
};
