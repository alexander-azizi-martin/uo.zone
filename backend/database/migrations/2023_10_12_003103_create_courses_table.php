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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('subject_id')->constrained();
            $table->string('code')->unique();
            $table->string('title');
            $table->text('description');
            // $table->text('prerequisites');
            // $table->text('corequisites');
            $table->float('units')->nullable();
            $table->jsonb('grades')->default('[]');
            $table->integer('total_enrolled')->unsigned()->default(0);
            $table->enum('language', ['en', 'fr']);
            $table->timestamps();
        });

        DB::unprepared("
            ALTER TABLE courses ADD COLUMN searchable_text tsvector
                GENERATED ALWAYS AS (
                    to_tsvector('english_ispell', coalesce(code, '')) || 
                    ' ' ||
                    to_tsvector('english_ispell', coalesce(title, ''))
                ) STORED;

            CREATE INDEX courses_searchable_text_idx ON courses USING GIN (searchable_text);
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
