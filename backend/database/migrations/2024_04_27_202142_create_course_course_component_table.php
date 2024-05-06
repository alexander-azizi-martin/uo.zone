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
        Schema::create('course_course_component', function (Blueprint $table) {
            $table->foreignId('course_id')->constrained();
            $table->foreignId('course_component_id')->constrained();
            $table->primary(['course_id', 'course_component_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_course_components');
    }
};
