<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->char('code', 8)->primary();
            $table->char('subject_code', 3);
            $table->text('title');
            $table->text('description');
            $table->json('components');
            $table->text('requirements')->nullable();
            $table->text('languages');
            $table->float('units')->nullable();

            $table->foreign('subject_code')->references('code')->on('subjects');
        });

        Schema::create('equivalent_courses', function (Blueprint $table) {
            $table->char('course_code', 8);
            $table->char('equivalent_course_code', 8);
            $table->char('equivalent_course_language', 3);

            $table->primary(['course_code', 'equivalent_course_code', 'equivalent_course_language']);
            $table->foreign('course_code')->references('code')->on('courses');
            $table->foreign('equivalent_course_code')->references('code')->on('courses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
        Schema::dropIfExists('equivalent_courses');
    }
};
