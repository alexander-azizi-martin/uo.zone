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
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
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
            $table->unsignedInteger('total');
            $table->morphs('gradable');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
