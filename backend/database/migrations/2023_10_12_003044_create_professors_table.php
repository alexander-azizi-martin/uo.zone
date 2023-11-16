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
        Schema::create('professors', function (Blueprint $table) {
            $table->id();
            $table->string('name')->index();
            $table->jsonb('grades')->default('[]');
            $table->integer('total_enrolled')->unsigned()->default(0);
            $table->timestamps();
        });

        DB::unprepared("
            ALTER TABLE professors ADD COLUMN searchable_text tsvector
                GENERATED ALWAYS AS (
                    to_tsvector('english_ispell', coalesce(name, ''))
                ) STORED;

            CREATE INDEX professors_searchable_text_idx ON professors USING GIN (searchable_text);
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('professors');
    }
};
