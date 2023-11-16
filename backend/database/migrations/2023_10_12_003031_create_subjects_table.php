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
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->jsonb('subject')->default('[]');
            $table->jsonb('faculty')->default('[]');
            $table->jsonb('grades')->default('[]');
            $table->integer('total_enrolled')->unsigned()->default(0);
            $table->timestamps();
        });

        DB::unprepared("
            ALTER TABLE subjects ADD COLUMN searchable_text tsvector
                GENERATED ALWAYS AS (
                    to_tsvector('simple', coalesce(code, '')) || 
                    ' ' ||
                    to_tsvector('english_ispell', coalesce(subject ->> 'en', '')) ||
                    ' ' ||
                    to_tsvector('french_ispell', coalesce(subject ->> 'fr', ''))
                ) STORED;

            CREATE INDEX subjects_searchable_text_idx ON subjects USING GIN (searchable_text);
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subjects');
    }
};
