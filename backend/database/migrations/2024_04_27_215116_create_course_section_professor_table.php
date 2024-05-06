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
        Schema::create('course_section_professor', function (Blueprint $table) {
            $table->foreignId('course_section_id')->constrained();
            $table->foreignId('professor_id')->constrained();
            $table->primary(['course_section_id', 'professor_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_section_professor');
    }
};
