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
        Schema::create('course_sections', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->char('subject_code', 3);
            $table->char('course_code', 8);
            $table->unsignedInteger('term_id');
            $table->char('section', 5);

            $table->unique(['course_code', 'term_id', 'section']);
            $table->foreign('course_code')->references('code')->on('courses');
            $table->foreign('subject_code')->references('code')->on('subjects');
        });

        Schema::create('course_section_professor', function (Blueprint $table) {
            $table->foreignId('professor_id')->constrained();
            $table->foreignId('course_section_id')->constrained();

            $table->primary(['professor_id', 'course_section_id']);

        });

        Schema::create('course_section_grades', function (Blueprint $table) {
            $table->foreignId('course_section_id')->constrained();

            $table->unsignedInteger('A+');
            $table->unsignedInteger('A');
            $table->unsignedInteger('A-');
            $table->unsignedInteger('B+');
            $table->unsignedInteger('B');
            $table->unsignedInteger('C+');
            $table->unsignedInteger('C');
            $table->unsignedInteger('D+');
            $table->unsignedInteger('D');
            $table->unsignedInteger('E');
            $table->unsignedInteger('F');
            $table->unsignedInteger('EIN');
            $table->unsignedInteger('NS');
            $table->unsignedInteger('NC');
            $table->unsignedInteger('ABS');
            $table->unsignedInteger('P');
            $table->unsignedInteger('S');

            $table->primary('course_section_id');
        });

        Schema::create('course_section_survey_responses', function (Blueprint $table) {
            $table->foreignId('course_section_id')->constrained();

            $table->json('question');
            $table->string('question_type');
            $table->json('options');
            $table->unsignedInteger('A')->default(0);
            $table->unsignedInteger('B')->default(0);
            $table->unsignedInteger('C')->default(0);
            $table->unsignedInteger('D')->default(0);
            $table->unsignedInteger('E')->default(0);
            $table->unsignedInteger('F')->default(0);

            $table->primary(['course_section_id', 'question']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_sections');
        Schema::dropIfExists('course_section_professor');
        Schema::dropIfExists('course_section_grades');
        Schema::dropIfExists('course_section_survey_responses');
    }
};
